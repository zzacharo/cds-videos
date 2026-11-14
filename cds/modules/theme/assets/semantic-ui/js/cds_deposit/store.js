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
 * State and logic of the deposit pages, ported from the AngularJS
 * ``cdsDeposits`` and ``cdsDeposit`` components.
 *
 * ``DepositsController`` is the page (the project and its videos) and owns
 * one ``DepositController`` per deposit. The records are plain objects shared
 * by reference (the project ``videos`` are the video records), mutated in
 * place as before. Any change calls ``notify()`` and the views re-render.
 */

import _cloneDeep from "lodash/cloneDeep";
import _constant from "lodash/constant";
import _difference from "lodash/difference";
import _find from "lodash/find";
import _flatten from "lodash/flatten";
import _get from "lodash/get";
import _groupBy from "lodash/groupBy";
import _intersection from "lodash/intersection";
import _isEmpty from "lodash/isEmpty";
import _isEqual from "lodash/isEqual";
import _keyBy from "lodash/keyBy";
import _keys from "lodash/keys";
import _map from "lodash/map";
import _mapValues from "lodash/mapValues";
import _merge from "lodash/merge";
import _omit from "lodash/omit";
import _omitBy from "lodash/omitBy";
import _partition from "lodash/partition";
import _pick from "lodash/pick";
import _reject from "lodash/reject";
import _set from "lodash/set";
import _throttle from "lodash/throttle";
import _toPath from "lodash/toPath";
import _values from "lodash/values";

import { http, storage } from "@js/cds/api";
import { toaster } from "@js/cds/components/Toaster";

import {
  action,
  chainedActions,
  cleanData,
  getUrlPath,
  guessEndpoint,
  makeAction,
  resolveJSON,
} from "./api";
import {
  DEPOSIT_EXTRACTED_METADATA,
  DEPOSIT_STATES,
  DEPOSIT_STATUSES,
  INHERITED_PROPERTIES,
  urlBuilder,
} from "./constants";

/* ``angular-local-storage`` prefix of the deposit app. */
const STORAGE_PREFIX = "cdsDeposit";

/* Requests made in the background, without the loading bar. */
const BACKGROUND = { ignoreLoadingBar: true };

/* Fields edited by the forms of each deposit type. */
export const FORM_FIELDS = {
  project: [
    "title",
    "description",
    "keywords",
    "_eos_library_path",
    "category",
    "type",
    "contributors",
    "license",
    "translations",
  ],
  video: [
    "title",
    "description",
    "keywords",
    "language",
    "date",
    "contributors",
    "featured",
    "vr",
    "license",
    "copyright",
    "translations",
    "related_links",
    "related_identifiers",
  ],
};

function hasNoProperties(obj) {
  return (
    obj !== null &&
    typeof obj === "object" &&
    Object.getOwnPropertyNames(obj).length === 0
  );
}

/**
 * Find an element inside an object given a path of properties, and set it
 * when a value is given (``accessElement`` of ``cdsDepositCtrl``).
 */
function accessElement(object, elem, value) {
  let obj = object;
  let lastPart;
  let parentObj = obj;
  _toPath(elem).forEach((part) => {
    if (!obj) {
      return;
    }
    lastPart = part;
    parentObj = obj;
    if (!obj[part] && value) {
      obj[part] = {};
    }
    obj = obj[part];
  });
  if (value) {
    parentObj[lastPart] = value;
  }
  return obj;
}

/** One deposit (the project or a video). */
export class DepositController {
  constructor(depositsCtrl, { record, links, master }) {
    this.depositsCtrl = depositsCtrl;
    this.master = Boolean(master);
    this.record = record;
    this.links = links;
    this.depositType = this.master ? "project" : "video";
    this.applySchemaDefaults();
    this.alerts = [];
    this.metadataToFill = false;
    this.noValidateFields = ["description"];
    this.previewer = null;
    this.actionLoading = false;
    this.framesReady = false;
    this.allFlowsTasksByName = {};
    this.cachedFlowTasksById = {};
    this.currentStartedTaskName = null;
    this.currentDepositStatus = null;
    this.loading = false;
    this.waitingUpload = false;
    this.presets = [];
    this.stateReporter = {};
    // Form state
    this.dirty = false;
    this.formErrors = {};
    this.backendErrors = {};
    // Keys of the rendered fields: only they show the server validation errors
    this.fieldKeys = new Map();
    this.formApi = null;
    this.permissions = undefined;
    this.started = false;
    this.throttledSetDirty = _throttle(() => this.setDirty(), 1000);
  }

  get id() {
    return this.record._deposit.id;
  }

  /** Default values of the JSON schemas, set by the form as before. */
  applySchemaDefaults() {
    const record = this.record;
    if (this.depositType === "video") {
      if (record.language === undefined) {
        record.language = "en";
      }
      // The checkboxes of angular-schema-form defaulted to ``false``
      if (record.vr === undefined) {
        record.vr = false;
      }
      if (
        record.featured === undefined &&
        this.depositsCtrl.showAvcRestrictedFields === true
      ) {
        record.featured = false;
      }
    }
    (record.translations || []).forEach((translation) => {
      if (translation && translation.language === undefined) {
        // eslint-disable-next-line no-param-reassign
        translation.language = "en";
      }
    });
  }

  notify() {
    this.depositsCtrl.notify();
  }

  /* Status */

  isPublished() {
    return this.record._deposit.status === "published";
  }

  isProjectPublished() {
    if (this.depositType === "project") {
      return this.isPublished();
    }
    return this.depositsCtrl.master.metadata._deposit.status === "published";
  }

  isDraft() {
    return this.record._deposit.status === "draft";
  }

  hasCategory() {
    return !this.record.category;
  }

  initShowAll() {
    this.showAll = !this.isPublished();
  }

  changeShowAll(hide) {
    this.showAll = !hide;
    this.notify();
  }

  findMasterFile() {
    return _find(this.record._files, { context_type: "master" });
  }

  /** Start: same as ``$onInit`` and ``$postLink``. */
  start() {
    if (this.started) return;
    this.started = true;
    this.initShowAll();
    this.loading = false;
    if (!this.master) {
      this.metadataToFill = this.getMetadataToFill();
    }
    if (this.isPublished()) {
      this.cleanLocalStorage();
    }
    this.currentMasterFile = this.findMasterFile();
    this.currentStartedTaskName = null;
    this.initializeStateReported();
    this.stateChanged(true);
    this.videoPreviewer();
    this.fetchFlowTasksStatuses();
    this.fetchStatusInterval = setInterval(
      () => this.recurrentFetchFlowTasksStatuses(),
      5000
    );
    this.pristineTimeout = setTimeout(() => this.setPristine(), 1500);
  }

  stop() {
    clearInterval(this.fetchStatusInterval);
    clearTimeout(this.pristineTimeout);
    this.started = false;
  }

  /* Metadata inheritance */

  inheritMetadata(specific, forceInherit) {
    const record = this.record;
    const master = this.depositsCtrl.master.metadata;
    const paths = specific !== undefined ? specific : INHERITED_PROPERTIES;
    paths.forEach((propPath) => {
      const inheritedVal = accessElement(master, propPath);
      const ownElement = accessElement(record, propPath);
      if (
        (inheritedVal && !ownElement) ||
        (inheritedVal && forceInherit === true)
      ) {
        accessElement(record, propPath, _cloneDeep(inheritedVal));
      } else if (
        Array.isArray(ownElement) &&
        ownElement.every(hasNoProperties)
      ) {
        accessElement(record, propPath, _cloneDeep(inheritedVal));
      }
    });
    this.syncForm();
    this.setDirty();
  }

  /* Flows and tasks */

  getTaskFeedback(flowId) {
    const url = urlBuilder.taskFeedback({ flowId });
    // Polled in the background, the tasks show their own status
    return action(url, "GET", {}, undefined, BACKGROUND)
      .then((response) => _flatten(response.data, true))
      .catch((e) => _flatten(e.data, true));
  }

  triggerRestartFlow() {
    const flowId = _get(this.findMasterFile(), "tags.flow_id", undefined);
    action(urlBuilder.restartFlow({ flowId }), "PUT").then(
      () => {
        toaster.pop({ type: "info", title: "Flow has been restarted!" });
        this.fetchFlowTasksStatuses();
      },
      () => {
        toaster.pop({ type: "error", title: "Flow cannot be restarted!" });
      }
    );
  }

  triggerRestartFlowTask(flowId, taskId) {
    this.restartFlowTask(flowId, taskId).then(() =>
      this.fetchFlowTasksStatuses()
    );
  }

  restartFlowTask(flowId, taskId) {
    return action(urlBuilder.restartTask({ taskId, flowId }), "PUT");
  }

  initializeStateReported() {
    this.stateReporter = {};
    this.presets = [];
    DEPOSIT_STATES.forEach((state) => {
      this.stateReporter[state] = { status: "PENDING", message: state };
    });
    Object.entries((this.record._cds && this.record._cds.state) || {}).forEach(
      ([state, value]) => {
        if (!this.stateReporter[state]) {
          this.stateReporter[state] = { status: value, message: state };
        } else {
          this.stateReporter[state].status = value;
        }
      }
    );
    this.calculateCurrentDepositStatus();
  }

  videoPreviewer() {
    const master = this.findMasterFile();
    if (master && master.subformat) {
      const finished = master.subformat.filter(
        (fmt) => fmt.completed && !_isEmpty(fmt.checksum)
      );
      if (finished.length > 0) {
        this.previewer = urlBuilder.video({
          deposit: this.record._deposit.id,
          key: finished[0].key,
        });
      }
    }
  }

  /** Update the files and the tasks state (form changes are kept). */
  updateDeposit(deposit) {
    const subformat = _get(deposit, "_files[0].subformat");
    if (subformat) {
      // Same comparator as before (``parseInt("1080p") -> 1080``)
      subformat.sort((a, b) => parseInt(a.key, 10) < parseInt(b.key, 10));
    }
    this.record._files = _cloneDeep(deposit._files);
    this.currentMasterFile = this.findMasterFile();
    if (!this.record._cds) {
      this.record._cds = {};
    }
    this.record._cds.state = _cloneDeep(
      (deposit._cds && deposit._cds.state) || {}
    );
    this.stateChanged();
    if (_isEmpty(this.previewer)) {
      this.videoPreviewer();
    }
    this.notify();
  }

  refetchRecordOnTaskStatusChanged(flowTasksById) {
    const cached = _isEmpty(this.cachedFlowTasksById)
      ? _cloneDeep(flowTasksById)
      : this.cachedFlowTasksById;
    let reFetchRecord = false;
    for (const taskId in flowTasksById) {
      const cachedTask = _get(cached, taskId, null);
      if (!cachedTask) {
        reFetchRecord = true;
        break;
      }
      if (flowTasksById[taskId].status !== cachedTask.status) {
        reFetchRecord = true;
        break;
      }
    }
    this.cachedFlowTasksById = _cloneDeep(flowTasksById);
    if (reFetchRecord) {
      this.depositsCtrl.fetchRecord();
    }
  }

  updateSubformatsTranscodingStatus(flowTasks) {
    const transcodingTasks = _groupBy(flowTasks, "name").file_transcode;
    const subformatsNew = (transcodingTasks || [])
      .filter((task) => task.info)
      .map((task) => {
        const payload = task.info.payload;
        if (task.status === "SUCCESS") {
          payload.status_completed = true;
        } else if (task.status === "FAILURE") {
          payload.status_failure = true;
        } else if (task.status === "PENDING") {
          payload.status_pending = true;
        } else if (task.status === "STARTED") {
          payload.status_started = true;
        } else if (task.status === "CANCELLED") {
          payload.status_cancelled = true;
        }
        return payload;
      });
    this.currentMasterFile = this.findMasterFile();
    if (this.currentMasterFile) {
      this.currentMasterFile.subformat = subformatsNew;
    }
  }

  fetchFlowTasksStatuses() {
    const flowId = _get(this.findMasterFile(), "tags.flow_id", undefined);
    if (!flowId) {
      return;
    }
    this.getTaskFeedback(flowId).then((data) => {
      const tasksById = _mapValues(_groupBy(data, "id"), (tasks) => tasks[0]);
      this.allFlowsTasksByName = _groupBy(data, "name");
      this.refetchRecordOnTaskStatusChanged(tasksById);
      this.updateSubformatsTranscodingStatus(data);
      (data || []).forEach((task) => {
        this.updateStateReporter(task.name, task.info, task.status);
      });
      this.notify();
    });
  }

  anyTaskIsRunning() {
    const state = (this.record._cds && this.record._cds.state) || {};
    return Object.keys(state).some((key) =>
      ["PENDING", "STARTED"].includes(state[key])
    );
  }

  recurrentFetchFlowTasksStatuses() {
    if (this.anyTaskIsRunning()) {
      this.fetchFlowTasksStatuses();
    }
  }

  /* Extracted metadata */

  fillMetadata(answer) {
    const metadataToFill = this.metadataToFill[0];
    if (answer) {
      _merge(this.record, metadataToFill);
      this.syncForm();
      this.preActions();
      this.makeSingleAction("SAVE_PARTIAL")
        .then(
          (response) => this.onSuccessAction(response),
          (response) => this.onErrorAction(response)
        )
        .finally(() => this.postActions());
    }
    try {
      this.setOnLocalStorage("prompted", true);
    } finally {
      this.metadataToFill = false;
      this.notify();
    }
  }

  getMetadataToFill(metadata) {
    if (this.getFromLocalStorage("prompted")) {
      return false;
    }
    const allMetadata = metadata || this.getFromLocalStorage("metadata");
    if (!allMetadata) {
      return false;
    }
    const metadataToFill = {};
    const metadataToFillValues = {};
    Object.keys(DEPOSIT_EXTRACTED_METADATA).forEach((item) => {
      const value = DEPOSIT_EXTRACTED_METADATA[item](
        metadataToFill,
        allMetadata
      );
      if (value) {
        metadataToFillValues[item] = value;
      }
    });
    if (_isEmpty(metadataToFill)) {
      return false;
    }
    return [metadataToFill, metadataToFillValues];
  }

  getMetadataToDisplay() {
    return this.metadataToFill ? this.metadataToFill[1] : {};
  }

  updateStateReporter(name, info, status) {
    const information = info || {};
    if (status && !information.status) {
      information.status = status;
    }
    if (!this.stateReporter[name]) {
      this.stateReporter[name] = information;
    }
    if (this.stateReporter[name].status !== information.status) {
      this.onTask(name, information.status, information);
    }
    this.stateReporter[name] = _cloneDeep(information);
  }

  /** ``cds.deposit.task`` */
  onTask(type, status, data) {
    if (type === "file_video_metadata_extraction" && status === "SUCCESS") {
      const allMetadata = _get(data, "payload.extracted_metadata");
      this.setOnLocalStorage("metadata", allMetadata);
      this.metadataToFill = this.getMetadataToFill(allMetadata);
    } else if (type === "file_video_extract_frames" && status === "SUCCESS") {
      this.framesReady = true;
    }
  }

  calculateCurrentDepositStatus() {
    const state = (this.record._cds && this.record._cds.state) || {};
    let currentStartedTaskName = null;
    for (const task of DEPOSIT_STATES) {
      if (state[task] === "STARTED") {
        currentStartedTaskName = task;
        break;
      }
    }
    this.currentStartedTaskName = currentStartedTaskName;
    const values = _values(_omit(state, "file_video_extract_chapter_frames"));
    if (!values.length) {
      this.currentDepositStatus = null;
    } else if (values.includes(DEPOSIT_STATUSES.FAILURE)) {
      this.currentDepositStatus = DEPOSIT_STATUSES.FAILURE;
    } else if (values.includes(DEPOSIT_STATUSES.STARTED)) {
      this.currentDepositStatus = DEPOSIT_STATUSES.STARTED;
    } else if (values.includes(DEPOSIT_STATUSES.PENDING)) {
      this.currentDepositStatus = DEPOSIT_STATUSES.PENDING;
    } else {
      this.currentDepositStatus = DEPOSIT_STATUSES.SUCCESS;
    }
  }

  /** Watcher of ``record._cds.state``. */
  stateChanged(force) {
    const state = (this.record._cds && this.record._cds.state) || {};
    if (force || !_isEqual(state, this._lastState)) {
      this.calculateCurrentDepositStatus();
    }
    this._lastState = _cloneDeep(state);
    this.framesReady = state.file_video_extract_frames === "SUCCESS";
  }

  displayFailure() {
    return this.currentDepositStatus === DEPOSIT_STATUSES.FAILURE;
  }

  displayPending() {
    return this.currentDepositStatus === DEPOSIT_STATUSES.PENDING;
  }

  displayStarted() {
    return this.currentDepositStatus === DEPOSIT_STATUSES.STARTED;
  }

  displaySuccess() {
    return (
      this.currentDepositStatus === DEPOSIT_STATUSES.SUCCESS &&
      !this.isPublished() &&
      !this.record.recid
    );
  }

  /* Actions */

  postSuccessProcess(responses) {
    const response = (
      Array.isArray(responses) ? responses[responses.length - 1] : responses
    ).data;
    // Merge in place: the project keeps the references to the video records
    _merge(this.record, response.metadata);
    this.stateChanged();
  }

  postErrorProcess(response) {
    const data = response.data || {};
    if (data.status === 400 && data.errors) {
      data.errors.forEach((value) =>
        this.depositsCtrl.validationError(value, this.id)
      );
    }
  }

  /** ``cds.deposit.validation.error`` */
  onValidationError(value) {
    if (
      !this.noValidateFields.includes(value.field) &&
      this.fieldKeys.has(value.field)
    ) {
      this.backendErrors = {
        ...this.backendErrors,
        [value.field]: value.message,
      };
      this.notify();
    }
  }

  /** A field of the form is rendered (``key`` as ``a.0.b``). */
  registerField(key) {
    this.fieldKeys.set(key, (this.fieldKeys.get(key) || 0) + 1);
    return () => {
      const count = this.fieldKeys.get(key) - 1;
      if (count > 0) {
        this.fieldKeys.set(key, count);
      } else {
        this.fieldKeys.delete(key);
      }
    };
  }

  removeValidationMessage(path) {
    const field = _toPath(path).join(".");
    const errors = _omitBy(this.backendErrors, (message, key) => {
      if (key === field) return true;
      // Errors of the whole contributor (the object is changed at once)
      const parts = _toPath(path);
      if (parts[0] === "contributors") {
        return key === parts.slice(0, -1).join(".");
      }
      return false;
    });
    if (!_isEqual(errors, this.backendErrors)) {
      this.backendErrors = errors;
      this.notify();
    }
  }

  makeSingleAction(actionName) {
    const cleanRecord = cleanData(this.record);
    const url = guessEndpoint(
      cleanRecord,
      this.depositType,
      actionName,
      this.links
    );
    return makeAction(url, this.depositType, actionName, cleanRecord);
  }

  makeMultipleActions(actions) {
    const cleanRecord = cleanData(this.record);
    const promises = actions.map((actionName) => {
      const url = guessEndpoint(
        cleanRecord,
        this.depositType,
        actionName,
        this.links
      );
      return () => makeAction(url, this.depositType, actionName, cleanRecord);
    });
    return chainedActions(promises);
  }

  preActions() {
    this.depositsCtrl.loading = true;
    this.loading = true;
    this.actionLoading = true;
    this.notify();
  }

  postActions() {
    this.depositsCtrl.loading = false;
    this.loading = false;
    this.actionLoading = false;
    this.notify();
  }

  onSuccessActionMultiple(response, message) {
    this.depositsCtrl.setPristineAll();
    this.onSuccessAction(response, message);
  }

  onSuccessAction(response, message) {
    this.postSuccessProcess(response);
    // ``cds.deposit.success``
    this.alerts = [{ message: "Success!", type: "success" }];
    if (message !== undefined) {
      toaster.pop({
        type: "success",
        title: this.record.title ? this.record.title.title : "Video",
        body: message,
      });
    }
    this.syncForm();
    // The backend sanitizes the HTML, so wait before making it pristine
    setTimeout(() => this.setPristine(), 50);
    this.notify();
  }

  onErrorAction(response) {
    this.postErrorProcess(response);
    // ``cds.deposit.error``
    const data = response.data || {};
    this.alerts = [
      { message: data.message, type: "danger", errors: data.errors || [] },
    ];
    const message = String(response.status || "").startsWith("5")
      ? "Internal Sever Error"
      : data.message;
    toaster.pop({
      type: "error",
      title: this.record.title ? this.record.title.title : "Video",
      body: message,
    });
    this.notify();
  }

  dismissAlert(index) {
    this.alerts.splice(index, 1);
    this.notify();
  }

  /* Form state */

  isPristine() {
    return !this.dirty;
  }

  isDirty() {
    return this.dirty;
  }

  isInvalid() {
    return !_isEmpty(this.formErrors) || !_isEmpty(this.backendErrors);
  }

  setDirty() {
    if (!this.dirty) {
      this.dirty = true;
      this.notify();
    }
  }

  setPristine() {
    this.dirty = false;
    if (this.formApi) {
      this.formApi.resetForm(this.formValues());
    }
    this.notify();
  }

  /** Values of the form fields of the record. */
  formValues() {
    return _cloneDeep(_pick(this.record, FORM_FIELDS[this.depositType]));
  }

  /** Push the record values to the form (after a programmatic change). */
  syncForm() {
    if (this.formApi) {
      this.formApi.setValues(this.formValues());
    }
  }

  /** A field changed in the form. */
  setRecordValue(path, value) {
    _set(this.record, path, _cloneDeep(value));
    this.removeValidationMessage(path);
    if (_toPath(path)[0] === "contributors") {
      // Watcher on the contributors (throttled)
      this.throttledSetDirty();
    }
    this.setDirty();
  }

  /* Local storage (``angular-local-storage``, prefix ``cdsDeposit``) */

  getFromLocalStorage(key) {
    try {
      return _get(storage.get(STORAGE_PREFIX, this.id), key, undefined);
    } catch (error) {
      return null;
    }
  }

  setOnLocalStorage(key, value) {
    const currentInfo = storage.get(STORAGE_PREFIX, this.id);
    currentInfo[key] = value;
    storage.set(STORAGE_PREFIX, this.id, currentInfo);
  }

  cleanLocalStorage() {
    storage.remove(STORAGE_PREFIX, this.id);
  }

  /* Permissions (``cdsForm``) */

  getPermissionsFromCategory() {
    const master = this.depositsCtrl.master;
    if (master && master.metadata) {
      this.depositsCtrl.accessRights = _find(
        this.depositsCtrl.categories,
        (category) => category.metadata.name === master.metadata.category
      );
    }
  }

  initPermissions() {
    this.getPermissionsFromCategory();
    const masterData = this.depositsCtrl.master.metadata;
    if (masterData && masterData.category) {
      try {
        this.permissions =
          !this.record._access.read &&
          this.depositsCtrl.accessRights.metadata.access.public
            ? "public"
            : "restricted";
      } catch (e) {
        this.permissions = "public";
      }
    }
  }

  isAnyVideoAlreadyPublished() {
    return (
      this.depositsCtrl.master.metadata.videos.filter((video) => video.recid)
        .length > 0
    );
  }

  /** Category or type changed in the project form. */
  updateCategoryTypeAndPermissions() {
    if (this.depositType === "project") {
      this.getPermissionsFromCategory();
      this.permissions = _get(
        this.depositsCtrl.accessRights,
        "metadata.access.public"
      )
        ? "public"
        : "restricted";
      this.applyNewAccessRights();
      this.depositsCtrl.saveAll();
      this.depositsCtrl.setPristineAll();
    }
  }

  applyNewAccessRights() {
    const accessRights = this.depositsCtrl.accessRights;
    if (this.record._access) {
      delete this.record._access.read;
      delete this.record._access.update;
    }
    const responsible = _cloneDeep(
      _get(accessRights, "metadata.access.responsible")
    );
    if (!this.record._access) {
      this.record._access = {};
    }
    this.record._access.update = [this.depositsCtrl.currentUserEmail];
    if (responsible) {
      this.record._access.update =
        this.record._access.update.concat(responsible);
    }
    if (this.permissions === "restricted") {
      this.record._access.read = _cloneDeep(
        _get(accessRights, "metadata.access.restricted")
      );
    }
    this.setDirty();
    if (this.depositType === "project") {
      this.depositsCtrl.updateVideosPermissions(
        this.record._access,
        this.permissions
      );
    }
    this.notify();
  }

  /** ``cds.deposit.video.permissions.update`` */
  onProjectPermissionsUpdate(access, permissions) {
    if (this.depositType === "video") {
      this.record._access = _cloneDeep(access || {});
      this.permissions = _cloneDeep(permissions);
      this.setDirty();
    }
  }

  /** ``onSelectValue`` and ``onRemoveValue`` of the access selects. */
  setAccess(path, values) {
    _set(this.record, path, values);
    this.setDirty();
    this.notify();
  }
}

/** The deposit page: a project and its videos. */
export class DepositsController {
  constructor({ project, ...config }) {
    Object.assign(this, config);
    this.edit = false;
    this.master = {};
    this.loading = false;
    this.accessRights = {};
    this.categories = [];
    this.initialized = false;
    this.permissionDenied = false;
    this.duplicateVideos = [];
    this.onExit = false;
    this.deposits = {};
    this.listeners = new Set();
    this.version = 0;
    this.onBeforeUnload = this.onBeforeUnload.bind(this);
    // The project embedded in the page is shown from the first render
    if (project) {
      this.setMaster(project);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.version += 1;
    this.listeners.forEach((listener) => listener(this.version));
  }

  init() {
    this.categoriesPromise = http
      .get(urlBuilder.categories())
      .then((response) => response.data.hits.hits)
      .then((hits) => {
        this.categories = hits;
        Object.values(this.deposits).forEach((deposit) =>
          deposit.initPermissions()
        );
        this.notify();
        return hits;
      });

    if (this.projectLinks) {
      this.edit = true;
      if (this.initialized) {
        // Embedded in the page: refresh it as if it had just been fetched
        this.afterMaster();
      } else {
        resolveJSON(this.projectLinks.self).then(
          (response) => {
            this.addMaster(response.data);
            this.initialized = true;
            this.notify();
          },
          (response) => {
            if (response.status === 403) {
              this.permissionDenied = true;
              this.notify();
            }
          }
        );
      }
    }
    window.addEventListener("beforeunload", this.onBeforeUnload);
  }

  destroy() {
    window.removeEventListener("beforeunload", this.onBeforeUnload);
    Object.values(this.deposits).forEach((deposit) => deposit.stop());
  }

  /** Warn the user if there are any unsaved changes. */
  onBeforeUnload(event) {
    const dirty = Object.values(this.deposits).some(
      (deposit) => !deposit.isPristine()
    );
    if (!this.onExit && dirty) {
      this.onExit = true;
      event.preventDefault();
      // eslint-disable-next-line no-param-reassign
      event.returnValue = "Unsaved changes have been detected.";
      return "Unsaved changes have been detected.";
    }
    return undefined;
  }

  /** Controller of a deposit, created on first use. */
  deposit(record, links, master) {
    const id = record._deposit.id;
    let deposit = this.deposits[id];
    if (!deposit) {
      deposit = new DepositController(this, { record, links, master });
      this.deposits[id] = deposit;
      if (this.categoriesPromise) {
        deposit.initPermissions();
      }
    } else {
      deposit.record = record;
      deposit.links = links;
      deposit.applySchemaDefaults();
    }
    return deposit;
  }

  /**
   * Fetch the latest record data (``cds.deposit.metadata.update.<id>``), in
   * the background: the form is already shown.
   */
  fetchRecord() {
    action(
      this.master.links.self || this.projectLinks.self,
      "GET",
      {},
      undefined,
      BACKGROUND
    ).then((response) => {
      const metadata = response.data.metadata;
      // Each deposit is updated on its own (``cds.deposit.metadata.update.<id>``)
      [metadata].concat(metadata.videos || []).forEach((depositMetadata) => {
        const deposit = this.deposits[depositMetadata._deposit.id];
        if (deposit) {
          try {
            deposit.updateDeposit(depositMetadata);
            deposit.fetchFlowTasksStatuses();
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
          }
        }
      });
    });
  }

  addMaster(deposit, files) {
    if (this.initialized) {
      return;
    }
    this.setMaster(deposit, files);
    this.afterMaster();
  }

  /** Set the project, without the requests of ``addMaster``. */
  setMaster(deposit, files) {
    if (_isEmpty(deposit.metadata._files)) {
      // eslint-disable-next-line no-param-reassign
      deposit.metadata._files = files || [];
    }
    // Add empty ``keywords`` fields if missing (keywords not added/saved)
    if (deposit.metadata) {
      if (!("keywords" in deposit.metadata)) {
        // eslint-disable-next-line no-param-reassign
        deposit.metadata.keywords = [];
      }
      (deposit.metadata.videos || []).forEach((video) => {
        if (!video.keywords) {
          // eslint-disable-next-line no-param-reassign
          video.keywords = [];
        }
      });
    }
    this.master = deposit;
    this.initialized = true;
  }

  /** Refresh the project and its tasks once it is set. */
  afterMaster() {
    this.fetchRecord();
    if (this.master.links.html) {
      this.handleRedirect(this.master.links.html, true);
    }
    this.notify();
  }

  addChildren(deposit, files) {
    // eslint-disable-next-line no-param-reassign
    deposit.metadata._files = files || [];
    this.master.metadata.videos.push(deposit.metadata);
    this.notify();
  }

  isVideoFile(key) {
    const videoExtensions = (this.videoExtensions || "mp4,mkv,mov").split(",");
    let fileKey = null;
    videoExtensions.forEach((ext) => {
      if (key.toLowerCase().endsWith(ext.toLowerCase())) {
        fileKey = this.extractBasename(key);
      }
    });
    return fileKey;
  }

  extractBasename(key) {
    return key.slice(0, key.lastIndexOf("."));
  }

  /** Separate the video files (and their related files) from the others. */
  filterOutFiles(files) {
    const partition = _partition(files, (f) => this.isVideoFile(f.name));
    const videos = _keyBy(partition[0], (video) =>
      this.isVideoFile(video.name)
    );
    const other = partition[1];
    Object.values(videos).forEach((video) => {
      if (!video.key) {
        // eslint-disable-next-line no-param-reassign
        video.key = video.name;
      }
    });
    const videoKeys = _keys(videos);
    const result = {
      project: [],
      videos,
      videoFiles: _map(videos, _constant([])),
    };
    other.forEach((file) => {
      // eslint-disable-next-line no-param-reassign
      file.key = file.name;
      const basename = this.extractBasename(file.name);
      const videoMatch = _find(videoKeys, (videoKey) =>
        basename.startsWith(videoKey)
      );
      const toPush = videoMatch ? result.videoFiles[basename] : result.project;
      if (toPush) {
        toPush.push(file);
      }
    });
    return result;
  }

  /** New video files: create the project if needed and one video each. */
  addFiles(newFiles, invalidFiles) {
    if (!newFiles) {
      return;
    }
    const files = _difference(newFiles, invalidFiles || []);
    const filtered = this.filterOutFiles(files);
    let createMaster;
    if (!this.initialized) {
      createMaster = this.initProject(filtered.project);
    } else {
      Array.prototype.push.apply(this.master.metadata._files, filtered.project);
      createMaster = Promise.resolve();
    }
    createMaster.then(() => {
      const masterId = this.master.metadata._deposit.id;
      const uploadedVideos = this.master.metadata.videos
        .map((deposit) => {
          if (deposit._files && deposit._files.length > 0) {
            const masterFile = _find(deposit._files, {
              context_type: "master",
            });
            return !_isEmpty(masterFile) ? masterFile.key : undefined;
          }
          return undefined;
        })
        .filter((key) => key !== undefined);
      const videoKeys = _keys(filtered.videos).map(
        (name) => filtered.videos[name].key
      );
      this.duplicateVideos = _intersection(videoKeys, uploadedVideos);
      filtered.videos = _omitBy(filtered.videos, (val) =>
        this.duplicateVideos.includes(val.key)
      );
      if (this.duplicateVideos.length > 0) {
        toaster.pop({
          type: "error",
          title: "Duplicate video(s)!",
          body: this.duplicateVideos.join(", "),
        });
      }
      if ((invalidFiles || []).length > 0) {
        toaster.pop({
          type: "error",
          title: "Invalid file(s)",
          body: _map(invalidFiles, "name").join(", "),
        });
      }
      const promises = [];
      Object.entries(filtered.videos).forEach(([key, file]) => {
        promises.push([
          () =>
            this.createDeposit(this.videoInit, this.videoSchema, "video", {
              _project_id: masterId,
              title: { title: key },
            }),
          (response) => {
            // Map from deposit IDs to video basenames (local storage)
            const videoId = response.data.metadata._deposit.id;
            storage.set(STORAGE_PREFIX, videoId, { basename: key });
            const videoFiles = [file].concat(filtered.videoFiles[key] || []);
            this.addChildren(response.data, videoFiles);
          },
        ]);
      });
      if (promises.length > 0) {
        chainedActions(promises).then(
          () => {},
          () => {}
        );
      }
      this.notify();
    });
  }

  initProject(files) {
    const previousFiles = [];
    const uniqueFiles = _reject(files, (file) => {
      if (previousFiles.includes(file.key)) {
        return true;
      }
      previousFiles.push(file.key);
      return false;
    });
    return this.createDeposit(this.projectInit, this.projectSchema, "project")
      .then((response) => {
        this.addMaster(response.data, uniqueFiles);
        return resolveJSON(this.master.links.self);
      })
      .then((response) => {
        _merge(this.master, response.data);
        this.notify();
      });
  }

  createDeposit(url, schema, depositType, extra) {
    const data = _merge({}, { $schema: schema }, extra || {});
    return makeAction(url, depositType, "CREATE", data);
  }

  handleRedirect(url, replace) {
    if (url !== undefined && url !== "") {
      if (replace) {
        window.history.replaceState(window.history.state, "", getUrlPath(url));
      } else {
        window.location.href = url;
      }
    }
  }

  getRecordUrl(recid) {
    return urlBuilder.record({ recid });
  }

  /* Events between the deposits */

  validationError(value, depositId) {
    const deposit = this.deposits[depositId];
    if (deposit) {
      deposit.onValidationError(value);
    }
  }

  setPristineAll() {
    Object.values(this.deposits).forEach((deposit) => deposit.setPristine());
  }

  updateVideosPermissions(access, permissions) {
    Object.values(this.deposits).forEach((deposit) =>
      deposit.onProjectPermissionsUpdate(access, permissions)
    );
  }

  /** ``cds.deposit.project.saveAll``: handled by the project actions. */
  saveAll() {
    if (this.onSaveAll) {
      this.onSaveAll();
    }
  }

  removeVideo(id) {
    const videos = this.master.metadata.videos;
    const index = videos.findIndex((video) => video._deposit.id === id);
    if (index > -1) {
      videos.splice(index, 1);
    }
    const deposit = this.deposits[id];
    if (deposit) {
      deposit.stop();
      delete this.deposits[id];
    }
    this.notify();
  }
}
