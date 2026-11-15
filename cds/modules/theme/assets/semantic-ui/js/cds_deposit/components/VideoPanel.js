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
 * A video of the project (the video panel of deposits.html,
 * types/video/actions.html and types/video/form.html).
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

import { DialogModal } from "@js/cds/components/DialogModal";

import { actionHandler, deleteVideo, editPublished } from "../actions";
import { DEPOSIT_STATUSES } from "../constants";
import { RestrictionsBox } from "../fields/Access";
import {
  CheckboxField,
  CKEditorField,
  ContributorsField,
  DateField,
  KeywordsField,
  LicensesField,
  SelectField,
  TextField,
} from "../fields/Fields";
import {
  CopyrightFieldset,
  RelatedIdentifiersField,
  RelatedLinksField,
  TranslationsField,
} from "../fields/Groups";
import {
  CONTRIBUTOR_ROLES,
  SCHEMA_DESCRIPTIONS,
  VIDEO_CKEDITOR_CONFIG,
  VIDEO_LANGUAGES,
} from "../fields/options";
import { taskRepr } from "../filters";
import {
  ErrorAlerts,
  Html,
  ProgressBar,
  Tabs,
  TaskList,
  VideoPreview,
  show,
} from "./common";
import { DepositForm } from "./DepositForm";
import { VideoUploader } from "./Uploaders";

/* Actions (``types/video/actions.html``) */

function VideoActions({ ctrl }) {
  const depositsCtrl = ctrl.depositsCtrl;
  const [deleteShown, setDeleteShown] = useState(false);
  const [publishShown, setPublishShown] = useState(false);
  const [cannotEditShown, setCannotEditShown] = useState(false);
  const loading = depositsCtrl.loading;
  const success = ctrl.currentDepositStatus === DEPOSIT_STATUSES.SUCCESS;
  const published = ctrl.isPublished();
  const master = depositsCtrl.master.metadata;
  const masterFile = ctrl.currentMasterFile || {};
  const showAssign =
    !ctrl.record.report_number &&
    depositsCtrl.showAvcRestrictedFields &&
    master.category &&
    master.type;

  return (
    <div style={show(!ctrl.waitingUpload)}>
      <DialogModal
        open={deleteShown}
        onClose={() => setDeleteShown(false)}
        title="Delete video"
      >
        Are you sure you want permanently delete the video?
        <hr className="mt-30 mb-10" />
        <p className="pull-right">
          <button
            type="button"
            className="ui green button"
            onClick={() => {
              deleteVideo(ctrl);
              setDeleteShown(false);
            }}
          >
            Yes
          </button>
          <button
            type="button"
            className="ui red button"
            onClick={() => setDeleteShown(false)}
          >
            No
          </button>
        </p>
      </DialogModal>
      <DialogModal
        open={publishShown}
        onClose={() => setPublishShown(false)}
        title="Publish video"
      >
        The video workflow is still processing.
        <br />
        <br />
        You can publish the video even if not all video subformats have been
        generated yet.
        <br />
        Before publishing the video, make sure that at least on subformats has
        been completed by checking the &quot;Files&quot; tab.
        <br />
        Completed video subformats will be automatically published.
        <br />
        <br />
        Do you want publish the video?
        <br />
        <hr className="mt-30 mb-10" />
        <p className="pull-right">
          <button
            type="button"
            className="ui basic button"
            onClick={() => setPublishShown(false)}
          >
            No
          </button>
          <button
            type="button"
            className="ui green button"
            onClick={() => {
              actionHandler(ctrl, ["SAVE", "PUBLISH"]);
              ctrl.changeShowAll(true);
              setPublishShown(false);
            }}
          >
            Yes
          </button>
        </p>
      </DialogModal>
      <DialogModal
        open={cannotEditShown}
        onClose={() => setCannotEditShown(false)}
        title="Cannot edit the video"
      >
        You cannot edit the video if the project is published.
        <br />
        Please <strong>edit the project first</strong>, and then edit the video.
        <br />
        <hr className="mt-30 mb-10" />
        <p className="pull-right">
          <button
            type="button"
            className="ui primary button"
            onClick={() => setCannotEditShown(false)}
          >
            Close
          </button>
        </p>
      </DialogModal>
      <div className="text-right">
        {loading && (
          <span>
            <i className="fa fa-spinner fa-spin text-muted fa-fw" />
          </span>
        )}{" "}
        {!(
          ctrl.record._deposit.status === "published" ||
          ctrl.record._deposit.pid
        ) && (
          <>
            <button
              type="button"
              className="ui small basic button"
              disabled={
                (!ctrl.framesReady || loading) &&
                !(masterFile.size === undefined)
              }
              onClick={() => setDeleteShown(true)}
            >
              <i className="fa fa-trash-o" />
            </button>{" "}
          </>
        )}
        {!published && (
          <>
            <button
              type="button"
              className="ui small green button"
              disabled={ctrl.isPristine() || loading}
              onClick={() => actionHandler(ctrl, "SAVE_PARTIAL")}
            >
              {ctrl.actionLoading ? "Saving ..." : "Save"}
            </button>{" "}
          </>
        )}
        {success && !published && (
          <>
            <button
              type="button"
              className="ui small primary button"
              disabled={!ctrl.framesReady || loading || !success}
              onClick={() => {
                actionHandler(ctrl, ["SAVE", "PUBLISH"]);
                ctrl.changeShowAll(true);
              }}
            >
              {ctrl.actionLoading ? "Publishing ..." : "Publish"}
            </button>{" "}
          </>
        )}
        {!success && !published && (
          <>
            <button
              type="button"
              className="ui small primary button"
              disabled={!ctrl.framesReady || loading}
              onClick={() => setPublishShown(true)}
            >
              {ctrl.actionLoading ? "Publishing ..." : "Publish"}
            </button>{" "}
          </>
        )}
        {!ctrl.isDraft() && (
          <>
            <button
              type="button"
              className="ui small basic button"
              disabled={loading}
              onClick={() =>
                editPublished(ctrl, () => setCannotEditShown(true))
              }
            >
              {ctrl.actionLoading ? "Editing ..." : "Edit"}
            </button>{" "}
          </>
        )}
        {showAssign && (
          <a
            className={`ui small orange button${loading ? " disabled" : ""}`}
            href={`/deposit/reportnumbers/assign/${ctrl.record._deposit.id}`}
          >
            Assign Report Number
          </a>
        )}
      </div>
    </div>
  );
}

VideoActions.propTypes = { ctrl: PropTypes.object.isRequired };

/* Extracted metadata (``Fill metadata suggestion``) */

function ExtractedMetadata({ ctrl }) {
  const [open, setOpen] = useState(false);
  const toDisplay = ctrl.getMetadataToDisplay();
  return (
    <div style={show(!ctrl.isPublished())}>
      <div
        style={show(ctrl.metadataToFill)}
        className="cds-alert cds-alert-warning cds-alert-dismissible cds-deposit-metadata-extraction-alert"
        role="alert"
      >
        <button
          type="button"
          className="cds-close"
          aria-label="Close"
          onClick={() => {
            // eslint-disable-next-line no-param-reassign
            ctrl.metadataToFill = false;
            ctrl.notify();
          }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        Extracted metadata can be used to automatically fill part of the form.{" "}
        <button
          type="button"
          className="ui small orange button pull-right"
          onClick={() => setOpen(true)}
        >
          See the extracted metadata
        </button>
      </div>
      <DialogModal
        open={open}
        onClose={() => setOpen(false)}
        title="Are you sure you want to use the following metadata?"
      >
        <ul>
          {Object.entries(toDisplay).map(([key, value]) => (
            <li key={key}>
              <strong>{key}</strong>{" "}
              {typeof value === "string" ? value : JSON.stringify(value)}
            </li>
          ))}
        </ul>
        <hr className="mt-30 mb-10" />
        <p className="pull-right">
          <button
            type="button"
            className="ui basic button"
            onClick={() => {
              ctrl.fillMetadata(false);
              setOpen(false);
            }}
          >
            No
          </button>
          <button
            type="button"
            className="ui green button"
            onClick={() => {
              ctrl.fillMetadata(true);
              // eslint-disable-next-line no-param-reassign
              ctrl.metadataToFill = false;
              ctrl.notify();
              setOpen(false);
            }}
          >
            Yes
          </button>
        </p>
      </DialogModal>
    </div>
  );
}

ExtractedMetadata.propTypes = { ctrl: PropTypes.object.isRequired };

/* Sidebar of the detail view */

function InheritButton({ ctrl }) {
  const [open, setOpen] = useState(false);
  const master = ctrl.depositsCtrl.master.metadata;
  return (
    <div style={show(master.title && !ctrl.isPublished())}>
      <hr className="mt-10 mb-20" />
      <div className="text-center">
        <button
          type="button"
          className="ui small button cds-btn-info"
          onClick={() => setOpen(true)}
        >
          Inherit metadata from project
        </button>
      </div>
      <DialogModal
        open={open}
        onClose={() => setOpen(false)}
        title="Inherit metadata from the project"
      >
        <p className="text-left">
          Please select if you would like to replace all metadata of this video
          or inherit only the missing metadata from the project.
        </p>
        <hr className="mt-30 mb-10" />
        <p className="pull-right">
          <button
            type="button"
            className="ui basic button"
            onClick={() => {
              ctrl.inheritMetadata(undefined, false);
              setOpen(false);
            }}
          >
            Only the missing fields
          </button>
          <button
            type="button"
            className="ui basic button"
            onClick={() => {
              ctrl.inheritMetadata(undefined, true);
              setOpen(false);
            }}
          >
            Replace all metadata
          </button>
        </p>
      </DialogModal>
    </div>
  );
}

InheritButton.propTypes = { ctrl: PropTypes.object.isRequired };

function VideoSidebar({ ctrl, onTranscodeInfo }) {
  const depositsCtrl = ctrl.depositsCtrl;
  const master = depositsCtrl.master.metadata;
  const published = ctrl.isPublished();
  const recordUrl = depositsCtrl.getRecordUrl(ctrl.record.recid);
  return (
    <div className="cds-col-sm-3">
      <VideoPreview ctrl={ctrl} />
      <div>
        {master.category && (
          <div className="text-muted mt-10">
            <div className="cds-row">
              <div className="cds-col-md-6">
                <p className="mb-0">Category</p>
                {master.category && (
                  <p>
                    <span className="ui label cds-label cds-label-default">
                      {master.category}
                    </span>
                  </p>
                )}
              </div>
              <div className="cds-col-md-6">
                <p className="mb-0">Type</p>
                {master.type && (
                  <p>
                    <span className="ui label cds-label cds-label-warning">
                      {master.type}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <hr className="my-10" />
          </div>
        )}
        {!master.category && (
          <div className="text-muted mt-10">
            <i className="fa fa-info-circle" /> For publishing the video{" "}
            {depositsCtrl.showAvcRestrictedFields && (
              <span>, or assigning a report number, </span>
            )}{" "}
            please select category and type from the{" "}
            <a
              href={`#${master._deposit.id}`}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(master._deposit.id);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Project
            </a>
            .
            <hr className="my-10" />
          </div>
        )}
        <p className="text-muted mb-0">
          <strong>Video status:</strong>
        </p>
        <div style={show(published)}>
          <p className="text-muted mb-0">
            <span className="ui label cds-label cds-label-primary">
              Published
            </span>
          </p>
          <hr className="my-10" />
          <p className="mt-10">
            <i className="fa text-muted fa-link" />{" "}
            <a href={recordUrl}>Visit video page</a>
          </p>
        </div>
        <div style={show(!published)} className="text-muted">
          <p>
            The video is <strong>not</strong> published.
          </p>
          <ul className="list-unstyled text-left my">
            <TaskList
              state={ctrl.record._cds && ctrl.record._cds.state}
              small
              onTranscodeInfo={onTranscodeInfo}
            />
          </ul>
        </div>
        <InheritButton ctrl={ctrl} />
      </div>
    </div>
  );
}

VideoSidebar.propTypes = {
  ctrl: PropTypes.object.isRequired,
  onTranscodeInfo: PropTypes.func.isRequired,
};

/* Tabs */

function BasicInfo({ ctrl }) {
  return (
    <>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <TextField name="title.title" label="Title" required />
        <div className="form-ckeditor">
          <CKEditorField
            name="description"
            label="Description"
            required
            description="Required."
            config={VIDEO_CKEDITOR_CONFIG}
          />
        </div>
        <KeywordsField
          name="keywords"
          label="Keywords"
          placeholder="Keywords"
          description="Search or add keywords as a comma separated list e.g. keyword1, keyword2 etc."
        />
        <SelectField
          name="language"
          label="Language"
          required
          options={VIDEO_LANGUAGES}
          description={SCHEMA_DESCRIPTIONS.language}
        />
        <DateField
          name="date"
          label="Date"
          required
          description="Required. Format: YYYY-MM-DD. In case your upload was already published elsewhere, please use the date of first publication."
        />
        <ContributorsField roles={CONTRIBUTOR_ROLES} />
        {ctrl.depositsCtrl.showAvcRestrictedFields === true && (
          <CheckboxField
            name="featured"
            label="Feature this video on the home page"
          />
        )}
        <CheckboxField name="vr" label="This video is 360" />
      </form>
      <hr className="my-15" />
      <RestrictionsBox ctrl={ctrl} />
    </>
  );
}

BasicInfo.propTypes = { ctrl: PropTypes.object.isRequired };

function RestartTasks({ ctrl }) {
  return (
    <div className="cds-panel">
      <div className="cds-panel-heading">
        Restart tasks{" "}
        <a
          href="#restart"
          className="cds-btn-link cds-btn-xs pull-right"
          onClick={(e) => {
            e.preventDefault();
            ctrl.triggerRestartFlow();
          }}
        >
          <i className="fa fa-refresh" aria-hidden="true" /> Restart All
        </a>
      </div>
      <div className="cds-panel-body">
        {Object.entries(ctrl.allFlowsTasksByName || {}).map(([name, data]) => {
          const first = data[0] || {};
          const payload = (first.info && first.info.payload) || {};
          const running = (status) =>
            status === "PENDING" || status === "STARTED";
          if (name === "file_transcode") {
            return (
              <ul className="cds-list-group" key={name}>
                <li className="cds-list-group-item">
                  <p>
                    <strong>{name}</strong>
                  </p>
                  <div className="mb-10 text-center">
                    <i className="fa fa-external-link" aria-hidden="true" />{" "}
                    <a
                      href={`/admin/flowmetadata/?search=${payload.flow_id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      See Flow
                    </a>
                    &nbsp;&nbsp;{" "}
                    <i className="fa fa-external-link" aria-hidden="true" />{" "}
                    <a
                      href={`/admin/flowtaskmetadata/?search=${payload.flow_id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      See Tasks
                    </a>
                  </div>
                  {data.map((task, index) => {
                    const taskPayload = (task.info && task.info.payload) || {};
                    const blocked =
                      running(task.status) || task.status === "CANCELLED";
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <ul className="cds-list-group" key={index}>
                        <li className="cds-list-group-item">
                          {taskPayload.preset_quality}{" "}
                          <span className="ui label cds-label cds-label-default">
                            {task.status}
                          </span>
                          <a
                            href="#restart"
                            className="pull-right"
                            style={
                              blocked ? { pointerEvents: "none" } : undefined
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              if (!(ctrl.isDraft() || blocked)) {
                                ctrl.triggerRestartFlowTask(
                                  taskPayload.flow_id,
                                  taskPayload.task_id
                                );
                              }
                            }}
                          >
                            <i
                              style={show(
                                task.status === "SUCCESS" ||
                                  task.status === "FAILURE"
                              )}
                              className={`fa fa-refresh ${task.status}`}
                              aria-hidden="true"
                            />
                            <i
                              style={show(running(task.status))}
                              className="fa fa-spinner fa-spin"
                            />
                          </a>
                        </li>
                      </ul>
                    );
                  })}
                </li>
              </ul>
            );
          }
          return (
            <ul className="cds-list-group" key={name}>
              <li className="cds-list-group-item">
                <strong>{name}</strong>{" "}
                <span className="ui label cds-label cds-label-default">
                  {first.status}
                </span>
                <a
                  href="#restart"
                  className="pull-right"
                  style={
                    running(first.status)
                      ? { pointerEvents: "none" }
                      : undefined
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if (first.status !== "PENDING") {
                      ctrl.triggerRestartFlowTask(
                        payload.flow_id,
                        payload.task_id
                      );
                    }
                  }}
                >
                  <i
                    style={show(
                      first.status === "SUCCESS" || first.status === "FAILURE"
                    )}
                    className={`fa fa-refresh ${first.status}`}
                    aria-hidden="true"
                  />
                  <i
                    style={show(running(first.status))}
                    className="fa fa-spinner fa-spin"
                  />
                </a>
              </li>
            </ul>
          );
        })}
      </div>
    </div>
  );
}

RestartTasks.propTypes = { ctrl: PropTypes.object.isRequired };

function AdminTab({ ctrl }) {
  const [showMetadata, setShowMetadata] = useState(false);
  return (
    <>
      <div className="mb-10 text-center">
        <i className="fa fa-external-link" aria-hidden="true" />{" "}
        <a
          href={`/api/deposits/video/${ctrl.record._deposit.id}`}
          target="_blank"
          rel="noreferrer"
        >
          See JSON
        </a>
      </div>
      <RestartTasks ctrl={ctrl} />
      <div className="cds-panel">
        <div className="cds-panel-heading">Record metadata</div>
        <div className="cds-panel-body">
          <div className="text-center">
            <a
              href="#metadata"
              onClick={(e) => {
                e.preventDefault();
                setShowMetadata(!showMetadata);
              }}
            >
              {" "}
              {showMetadata ? "Hide" : "Show"} metadata
            </a>
          </div>
          <span style={show(showMetadata)}>
            {showMetadata && <pre>{JSON.stringify(ctrl.record, null, 2)}</pre>}
          </span>
        </div>
      </div>
    </>
  );
}

AdminTab.propTypes = { ctrl: PropTypes.object.isRequired };

function VideoTabs({ ctrl }) {
  const [active, setActive] = useState("metadata");
  const pane = (key) => ({ display: active === key ? undefined : "none" });
  return (
    <div className="cds-col-sm-9">
      <Tabs
        active={active}
        onChange={setActive}
        tabs={[
          { key: "metadata", title: "Basic Info" },
          { key: "files", title: "Files" },
          { key: "licenses", title: "Licences" },
          { key: "translations", title: "Translations" },
          { key: "related_links", title: "Related information" },
          {
            key: "admin",
            hidden: !ctrl.depositsCtrl.isSuperAdmin,
            title: (
              <>
                <i className="fa fa-bug" aria-hidden="true" /> Admin
              </>
            ),
          },
        ]}
      />
      <div className="tab-content cds-tab-content pa-20">
        <div style={pane("metadata")} role="tabpanel" className="tab-pane">
          <BasicInfo ctrl={ctrl} />
        </div>
        <div style={pane("files")} role="tabpanel" className="tab-pane">
          <VideoUploader ctrl={ctrl} />
        </div>
        <div style={pane("licenses")} role="tabpanel" className="tab-pane">
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <LicensesField />
            <CopyrightFieldset />
          </form>
        </div>
        <div style={pane("translations")} role="tabpanel" className="tab-pane">
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <TranslationsField />
          </form>
          {!ctrl.isPublished() && (
            <div className="cds-deposit-box">
              <div className="text-muted">
                <h5 className="text-muted">
                  <strong>Tips and suggestions</strong>
                </h5>
                <ul>
                  <li>
                    You can upload subtitle files in the <strong>Files</strong>{" "}
                    tab.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <div style={pane("related_links")} role="tabpanel" className="tab-pane">
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <RelatedLinksField />
            <RelatedIdentifiersField />
          </form>
        </div>
        <div style={pane("admin")} role="tabpanel" className="tab-pane">
          <AdminTab ctrl={ctrl} />
        </div>
      </div>
    </div>
  );
}

VideoTabs.propTypes = { ctrl: PropTypes.object.isRequired };

/* The video form (``types/video/form.html``) */

function VideoForm({ ctrl, onTranscodeInfo }) {
  const depositsCtrl = ctrl.depositsCtrl;
  const published = ctrl.isPublished();
  const master = depositsCtrl.master.metadata;
  const recordUrl = depositsCtrl.getRecordUrl(ctrl.record.recid);
  const firstFile = (ctrl.record._files || [])[0] || {};
  return (
    <>
      <ErrorAlerts ctrl={ctrl} />
      <ExtractedMetadata ctrl={ctrl} />
      <div className="cds-row" style={show(!ctrl.waitingUpload)}>
        {/* Brief view */}
        <div style={show(published && !ctrl.showAll)} className="cds-col-sm-12">
          <div className="cds-row">
            <div className="cds-col-sm-3">
              <VideoPreview ctrl={ctrl} />
            </div>
            <div className="cds-col-sm-9">
              <ul className="cds-list-inline">
                <li>
                  <span className="ui label cds-label cds-label-default">
                    {master.category}
                  </span>
                </li>{" "}
                <li>
                  <span className="ui label cds-label cds-label-warning">
                    {master.type}
                  </span>
                </li>{" "}
                <li>
                  <span className="ui label cds-label cds-label-primary">
                    Published
                  </span>
                </li>
              </ul>
              <hr className="my-15" />
              <h4 className="mb-5 mt-0">
                <a href={recordUrl}>
                  {(ctrl.record.title && ctrl.record.title.title) ||
                    "No video title"}
                </a>
              </h4>
              <Html html={ctrl.record.description || "No description"} />
            </div>
          </div>
        </div>
        {/* Detail view */}
        <div
          style={show(!published || (published && ctrl.showAll))}
          className="cds-col-sm-12"
        >
          <div className="cds-row">
            <div className="cds-col-sm-12">
              <div style={show(ctrl.displayFailure())}>
                {Object.keys(
                  ctrl.stateQueue ? ctrl.stateQueue.FAILURE || {} : {}
                )
                  .filter((status) => status !== "file_transcode")
                  .map((status) => (
                    <div className="cds-alert cds-alert-danger" key={status}>
                      <strong>
                        Error: {taskRepr(ctrl.stateReporter[status].message)}
                      </strong>
                    </div>
                  ))}
              </div>
              <div style={show(ctrl.displayPending())}>
                <ProgressBar striped active>
                  Loading ...
                </ProgressBar>
              </div>
              <div style={show(ctrl.displayStarted())} className="cds-row">
                <ProgressBar striped active>
                  {taskRepr(ctrl.currentStartedTaskName)}
                </ProgressBar>
              </div>
              <div style={show(ctrl.displaySuccess())} className="cds-row">
                <ProgressBar success>
                  <strong>Tasks successfully completed!</strong>
                </ProgressBar>
              </div>
            </div>
            <VideoSidebar ctrl={ctrl} onTranscodeInfo={onTranscodeInfo} />
            <VideoTabs ctrl={ctrl} />
          </div>
        </div>
        <div style={show(published)} className="cds-row">
          <div className="cds-col-sm-12 text-center">
            <div className="px-20">
              <hr className="mb-15" />
              <button
                type="button"
                className="ui small basic button"
                onClick={() => ctrl.changeShowAll(ctrl.showAll)}
              >
                {ctrl.showAll ? "Hide details" : "Show details"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Waiting for the upload */}
      <div className="cds-row" style={show(ctrl.waitingUpload)}>
        <div className="cds-col-md-12">
          <div className="cds-progress">
            <div
              style={{
                ...show(firstFile.percentage),
                width: `${firstFile.percentage || 0}%`,
              }}
              className="cds-progress-bar cds-progress-bar-primary"
              role="progressbar"
            >
              <span className="sr-only">
                {firstFile.percentage || 0}% Complete
              </span>
            </div>
            <div
              style={{ ...show(!firstFile.percentage), width: "100%" }}
              className="cds-progress-bar cds-progress-bar-primary cds-progress-bar-striped active"
              role="progressbar"
            >
              <span className="sr-only">Loading ...</span>
              Loading ...
            </div>
          </div>
          <p
            style={show(firstFile.percentage)}
            className="text-muted text-center f5"
          >
            {firstFile.percentage || 0}%
          </p>
        </div>
      </div>
    </>
  );
}

VideoForm.propTypes = {
  ctrl: PropTypes.object.isRequired,
  onTranscodeInfo: PropTypes.func.isRequired,
};

/* The video panel (``deposits.html``) */

export function VideoPanel({ ctrl, index, onTranscodeInfo }) {
  const depositsCtrl = ctrl.depositsCtrl;
  const id = ctrl.record._deposit.id;
  const reportNumber = ctrl.record.report_number;
  return (
    <div id={id}>
      <div id={`video_${id}`} className="cds-deposit-panel cds-panel">
        <div className="cds-panel-heading text-muted px-20 py-10 cds-sticky-heading">
          <span className="text-muted">
            <i className="fa fa-video-camera" /> Video #{index + 1} (of{" "}
            {depositsCtrl.maxNumberOfVideos}){" "}
            {reportNumber && (
              <span className="ui label cds-label cds-label-primary ml-10">
                {" "}
                {reportNumber[0]}{" "}
              </span>
            )}
          </span>
          <span className="pull-right">
            <VideoActions ctrl={ctrl} />
          </span>
        </div>
        <div className="cds-panel-body">
          <DepositForm ctrl={ctrl}>
            <VideoForm ctrl={ctrl} onTranscodeInfo={onTranscodeInfo} />
          </DepositForm>
        </div>
      </div>
    </div>
  );
}

VideoPanel.propTypes = {
  ctrl: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onTranscodeInfo: PropTypes.func.isRequired,
};
