/*
 * This file is part of CDS.
 * Copyright (C) 2026 CERN.
 *
 * CDS is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 2 of the License, or (at your
 * option) any later version.
 */

/*
 * File uploads of a deposit (the former ``cdsUploader`` component).
 */

import _cloneDeep from "lodash/cloneDeep";
import _difference from "lodash/difference";
import _find from "lodash/find";
import _findIndex from "lodash/findIndex";
import _indexOf from "lodash/indexOf";
import _map from "lodash/map";
import _merge from "lodash/merge";
import _reject from "lodash/reject";
import _remove from "lodash/remove";
import _values from "lodash/values";

import { getCookie, http } from "@js/cds/api";
import { toaster } from "@js/cds/components/Toaster";
import { ISO_LANGUAGES } from "@js/cds/isoLanguages";

import { FLOWS_RECEIVER, urlBuilder } from "./constants";

function preventBrowserClose(event) {
  event.preventDefault();
  // eslint-disable-next-line no-param-reassign
  event.returnValue = "";
}

function toResponse(error) {
  return (error && error.response) || { data: {}, status: 0 };
}

export class UploaderController {
  constructor(
    deposit,
    { autoStartUpload = true, remoteMasterReceiver = FLOWS_RECEIVER } = {}
  ) {
    this.deposit = deposit;
    this.depositsCtrl = deposit.depositsCtrl;
    this.autoStartUpload = autoStartUpload;
    this.remoteMasterReceiver = remoteMasterReceiver;
    this.loading = false;
    this.errors = [];
    this.duplicateFiles = [];
    this.confirmNewMaster = false;
    this.newMasterName = null;
    this.newMasterDefer = null;
    // Add any files that are not completed to the queue
    this.queue = _reject(this.files, { completed: true });
  }

  /** The files of the deposit (the array is replaced on record updates). */
  get files() {
    if (!this.deposit.record._files) {
      this.deposit.record._files = [];
    }
    return this.deposit.record._files;
  }

  notify() {
    this.deposit.notify();
  }

  /** Upload the video file of a new video (``$postLink``). */
  start() {
    if (!this.deposit.master) {
      this.deposit.waitingUpload = true;
      this.deposit.loading = true;
      this.startTimeout = setTimeout(() => this.upload(), 1500);
    }
  }

  stop() {
    clearTimeout(this.startTimeout);
  }

  updateMasterFileUpload(state, percentage) {
    if (!this.deposit.findMasterFile()) {
      this.deposit.currentStartedTaskName = "file_upload";
      this.deposit.updateStateReporter(
        "file_upload",
        { payload: { percentage: percentage || 0 } },
        state
      );
      this.deposit.calculateCurrentDepositStatus();
    }
  }

  findFileIndex(files, key) {
    return _indexOf(files, _find(this.files, { key }));
  }

  updateFile(key, data, force) {
    const index = this.findFileIndex(this.files, key);
    if (index !== -1) {
      if (force === true) {
        this.files[index] = _cloneDeep(data);
        return;
      }
      Object.assign(this.files[index], data || {});
    }
  }

  success(key, responseData) {
    let data = { ...responseData, percentage: 100, completed: true };
    if (data.tags) {
      data = _merge({}, data, data.tags || {});
    }
    this.updateFile(key, data, true);
    this.updateMasterFileUpload("SUCCESS", 100);
  }

  progress(key, percentage) {
    this.updateMasterFileUpload("STARTED", percentage);
    this.updateFile(key, {
      percentage: percentage || 0,
      completed: percentage === 100,
    });
    this.notify();
  }

  prepareLocalFile(file) {
    const headers = {
      "Content-Type": (file.type || "").indexOf("/") > -1 ? file.type : "",
      "X-CSRFToken": getCookie("csrftoken"),
      ...(file.headers || {}),
    };
    const url = urlBuilder.bucketVideo({
      bucket: this.deposit.record._buckets.deposit,
    });
    return { url: url + "/" + file.key, method: "PUT", headers, data: file };
  }

  startWorkflow(file, response) {
    return {
      method: "POST",
      url: this.remoteMasterReceiver,
      headers: { "Content-Type": "application/json" },
      data: {
        version_id: response.data.version_id,
        key: file.key,
        bucket_id: this.deposit.record._buckets.deposit,
        deposit_id: this.deposit.record._deposit.id,
      },
    };
  }

  /** Upload a local file, then start the video workflow if needed. */
  local(upload) {
    const deposit = this.deposit;
    const args = this.prepareLocalFile(upload);
    if (!deposit.record._cds) deposit.record._cds = {};
    if (!deposit.record._cds.state) deposit.record._cds.state = {};
    deposit.record._cds.state.file_upload = "STARTED";
    deposit.stateChanged();
    return http
      .request({
        ...args,
        // The file is the raw body of the request
        transformRequest: [(data) => data],
        onUploadProgress: (evt) => {
          const total = evt.total || upload.size || 1;
          this.progress(
            upload.key || upload.name,
            parseInt((100.0 * evt.loaded) / total, 10)
          );
        },
      })
      .then(
        (response) => {
          deposit.record._cds.state.file_upload = "SUCCESS";
          deposit.stateChanged();
          this.success(upload.key, response.data);
          if (!upload.key) {
            // eslint-disable-next-line no-param-reassign
            upload.key = upload.name;
          }
          let workflow;
          if (
            !upload.isAdditional &&
            this.depositsCtrl.isVideoFile(upload.key)
          ) {
            workflow = http.request(this.startWorkflow(upload, response));
          } else {
            workflow = Promise.resolve();
          }
          return workflow.then((avcResponse) => {
            if (avcResponse) {
              deposit.presets = avcResponse.data.presets;
            }
            this.depositsCtrl.fetchRecord();
            this.notify();
            return response;
          });
        },
        (error) => {
          this.updateMasterFileUpload("FAILURE");
          this.notify();
          return Promise.reject(toResponse(error));
        }
      );
  }

  /** Upload the queue, one file after the other. */
  uploader() {
    const data = [];
    const next = () => {
      if (this.queue.length === 0) {
        return Promise.resolve(data);
      }
      return this.local(this.queue.shift()).then((response) => {
        data.push(response);
        return next();
      });
    };
    return next();
  }

  upload() {
    if (this.queue.length > 0) {
      window.addEventListener("beforeunload", preventBrowserClose);
      this.loading = true;
      this.notify();
      return this.uploader()
        .then(
          (response) => {
            toaster.pop({
              type: "info",
              title: "The file(s) has been successfully uploaded.",
              body: (_map(response, "data.key") || []).join(", "),
            });
          },
          (response) => {
            if (
              response.status === 400 &&
              response.data &&
              response.data.message
            ) {
              toaster.pop({ type: "error", title: response.data.message });
            } else {
              toaster.pop({
                type: "error",
                title: "Error uploading the file(s).",
              });
            }
          }
        )
        .finally(() => {
          this.deposit.waitingUpload = false;
          this.deposit.loading = false;
          this.loading = false;
          window.removeEventListener("beforeunload", preventBrowserClose);
          this.notify();
        });
    }
    this.deposit.waitingUpload = false;
    this.notify();
    return Promise.resolve();
  }

  /** Additional files (subtitles, posters, other files). */
  addFiles(newFiles, invalidFiles, extraHeaders) {
    if (!newFiles) {
      return;
    }
    let files = _difference(newFiles, invalidFiles || []);
    files = files.filter((file) => {
      const fileName = file.name.toLowerCase();
      const isSubtitleFile =
        fileName.endsWith(".vtt") || fileName.endsWith(".srt");
      if ((!file.type || file.type.trim() === "") && !isSubtitleFile) {
        toaster.pop(
          "warning",
          "Invalid File Type",
          `The file ${file.name} has no valid type.`
        );
        return false;
      }
      if (!file.size || file.size === 0) {
        toaster.pop(
          "warning",
          "Empty File",
          `The file ${file.name} is empty and cannot be uploaded.`
        );
        return false;
      }
      return true;
    });
    files.forEach((file) => {
      /* eslint-disable no-param-reassign */
      file.key = file.name;
      file.local = !file.receiver;
      file.isAdditional = true;
      if (extraHeaders) {
        file.headers = extraHeaders;
      }
      if (!extraHeaders || !("X-Invenio-File-Tags" in extraHeaders)) {
        file.headers = {
          "X-Invenio-File-Tags": "context_type=additional_file",
        };
      }
      /* eslint-enable no-param-reassign */
    });
    // Replaced files (same filename) are removed from the list
    files.forEach((file) => {
      _remove(this.files, (existing) => existing.key === file.key);
    });
    if ((invalidFiles || []).length > 0) {
      toaster.pop({
        type: "error",
        title:
          "Invalid file(s) for " +
          (this.deposit.record.title.title || "video."),
        body: _map(invalidFiles, "name").join(", "),
      });
    }
    Array.prototype.push.apply(this.files, files);
    Array.prototype.push.apply(this.queue, files);
    this.notify();
    if (this.autoStartUpload) {
      this.upload();
    }
  }

  /** A new video file replacing the master file of a video. */
  replaceMasterFile(newFiles, invalidFiles) {
    if (!newFiles) {
      return;
    }
    const files = _difference(newFiles, invalidFiles || []);
    files.forEach((file) => {
      /* eslint-disable no-param-reassign */
      file.key = file.name;
      file.local = !file.receiver;
      /* eslint-enable no-param-reassign */
    });
    const masterFile = this.deposit.findMasterFile() || {};
    const videoFiles = _values(this.depositsCtrl.filterOutFiles(files).videos);
    if ((invalidFiles || []).length > 0) {
      toaster.pop({
        type: "error",
        title:
          "Invalid file(s) for " +
          (this.deposit.record.title.title || "video."),
        body: _map(invalidFiles, "name").join(", "),
      });
    }
    if (!this.deposit.master) {
      const newMasterFile = videoFiles[0];
      if (newMasterFile) {
        newMasterFile.key = masterFile.key;
        this.confirmNewMaster = true;
        this.newMasterName = newMasterFile.name;
        const masterFileVersion =
          masterFile.tags && masterFile.tags.times_replaced
            ? parseInt(masterFile.tags.times_replaced, 10) + 1
            : 1;
        newMasterFile.headers = {
          "X-Invenio-File-Tags": "times_replaced=" + masterFileVersion,
        };
        this.newMasterDefer = {
          resolve: () => {
            this.files.splice(
              _findIndex(this.files, { key: masterFile.key }),
              1
            );
            this.files.push(newMasterFile);
            this.queue.push(newMasterFile);
            this.deposit.previewer = null;
            this.upload();
          },
          reject: () => {},
        };
        this.notify();
      }
    }
  }

  closeNewMasterDialog(confirm) {
    this.confirmNewMaster = false;
    const defer = this.newMasterDefer;
    this.newMasterDefer = null;
    this.notify();
    if (defer) {
      if (confirm) defer.resolve();
      else defer.reject();
    }
  }

  remove(key) {
    const index = this.findFileIndex(this.files, key);
    const file = this.files[index];
    if (!file) return;
    if (file.links === undefined) {
      this.files.splice(index, 1);
      const queueIndex = this.findFileIndex(this.queue, key);
      if (queueIndex > -1) {
        this.queue.splice(queueIndex, 1);
      }
      this.notify();
      return;
    }
    http
      .request({
        url: file.links.version || file.links.deleteFile,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
      .then(
        () => {
          this.files.splice(index, 1);
          toaster.pop({
            type: "success",
            title: "The file has been succesfuly deleted.",
          });
          this.notify();
        },
        () => {
          toaster.pop({ type: "error", title: "Error deleting the file." });
        }
      );
  }

  thumbnailPreview(frame) {
    return urlBuilder.iiif({
      deposit: frame.bucket_id,
      key: frame.key,
      res: "150,100",
      version_id: frame.version_id,
    });
  }

  validateSubtitles(file) {
    // i.e. jessica_jones-en.vtt
    const match = file.name.match(/(?:.+)[_|-]([a-zA-Z]{2})\.(vtt|srt)/) || [];
    return match.length > 1 && match[1] in ISO_LANGUAGES;
  }

  validateAdditionalFiles(file) {
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith(".vtt") || fileName.endsWith(".srt")) {
      return this.validateSubtitles(file);
    }
    return true;
  }

  allFinished() {
    return (this.files || []).every((file) => file.completed);
  }
}
