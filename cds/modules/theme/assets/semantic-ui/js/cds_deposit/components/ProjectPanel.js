/*
 * This file is part of CDS.
 * Copyright (C) 2026 CERN.
 *
 * CDS is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 2 of the License, or (at your
 * option) any later version.
 */

/* The project (types/project/form.html and types/project/actions.html). */

import React, { useState } from "react";
import PropTypes from "prop-types";

import { actionHandler, deleteVideo, saveAllPartial } from "../actions";
import { EditorsField, RestrictionsBox } from "../fields/Access";
import { CategoryField, TypeField } from "../fields/CategoryType";
import {
  CKEditorField,
  ContributorsField,
  KeywordsField,
  LicensesField,
  TextField,
} from "../fields/Fields";
import {
  CONTRIBUTOR_ROLES,
  PROJECT_CKEDITOR_CONFIG,
  SCHEMA_DESCRIPTIONS,
} from "../fields/options";
import { TranslationsField } from "../fields/Groups";
import { ErrorAlerts, Html, InfoDialog, Tabs } from "./common";
import { DepositForm } from "./DepositForm";
import { ProjectUploader } from "./Uploaders";

function ProjectActions({ ctrl }) {
  const depositsCtrl = ctrl.depositsCtrl;
  const status = ctrl.record._deposit.status;
  return (
    <>
      {status !== "published" && (
        <button
          type="button"
          className="ui small green button"
          disabled={ctrl.isPristine() || depositsCtrl.loading}
          onClick={() => saveAllPartial(ctrl)}
        >
          {ctrl.actionLoading ? "Saving ..." : "Save Project and Videos"}
        </button>
      )}{" "}
      {status !== "published" && (
        <button
          type="button"
          className="ui small primary button"
          disabled={ctrl.isInvalid() || depositsCtrl.loading}
          onClick={() => actionHandler(ctrl, "PUBLISH")}
        >
          {ctrl.actionLoading ? "Publishing ..." : "Publish Project and Videos"}
        </button>
      )}{" "}
      {status !== "draft" && (
        <button
          type="button"
          className="ui small basic button"
          disabled={depositsCtrl.loading}
          onClick={() => actionHandler(ctrl, ["EDIT", "SAVE_PARTIAL"])}
        >
          {ctrl.actionLoading ? "Editing ..." : "Edit Project"}
        </button>
      )}
    </>
  );
}

ProjectActions.propTypes = { ctrl: PropTypes.object.isRequired };

function ShowDetailsButton({ label, onClick }) {
  return (
    <button type="button" className="ui small basic button" onClick={onClick}>
      {label}
    </button>
  );
}

ShowDetailsButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

function ProjectFields({ ctrl }) {
  const depositsCtrl = ctrl.depositsCtrl;
  return (
    <div className="cds-row">
      <div className="cds-col-sm-6">
        <TextField name="title.title" label="Title" required />
        <div className="form-ckeditor">
          <CKEditorField
            name="description"
            label="Description"
            required
            config={PROJECT_CKEDITOR_CONFIG}
          />
        </div>
        <KeywordsField
          name="keywords"
          label="Keywords"
          placeholder="Keywords"
          description="Search or add keywords as a comma separated list e.g. keyword1, keyword2 etc."
        />
        {depositsCtrl.showAvcRestrictedFields === true && (
          <TextField
            name="_eos_library_path"
            label="EOS library path"
            description={SCHEMA_DESCRIPTIONS._eos_library_path}
          />
        )}
      </div>
      <div className="cds-col-sm-6">
        <CategoryField withDescription />
        <TypeField withDescription />
        <ContributorsField roles={CONTRIBUTOR_ROLES} />
      </div>
      <div className="cds-col-sm-12">
        <hr className="my-15" />
        <RestrictionsBox ctrl={ctrl} project />
      </div>
    </div>
  );
}

ProjectFields.propTypes = { ctrl: PropTypes.object.isRequired };

export function ProjectPanel({ ctrl }) {
  const depositsCtrl = ctrl.depositsCtrl;
  const master = depositsCtrl.master.metadata;
  const [collapsed, setCollapsed] = useState(true);
  const [active, setActive] = useState("metadata");
  const published = ctrl.isPublished();

  return (
    <DepositForm ctrl={ctrl}>
      <div className="cds-panel cds-deposit-panel cds-deposit-panel-project">
        <div className="cds-panel-heading px-20 py-10">
          <span className=" text-muted">
            <i className="fa fa-list-ul" /> Project
          </span>
          <div className="pull-right">
            <InfoDialog
              title="What is a project?"
              trigger={(open) => (
                <button
                  type="button"
                  className="ui small basic button"
                  onClick={open}
                >
                  <i className="fa fa-info" />
                </button>
              )}
            >
              <div className="text-left">
                <p>
                  A project is a set of metadata common to a collection of
                  videos.
                </p>
                <p>
                  You can define category, type, license and access restriction
                  on the project and they will be applied to each video of the
                  project.
                </p>
              </div>
            </InfoDialog>{" "}
            <ProjectActions ctrl={ctrl} />
          </div>
        </div>
        <div className="cds-panel-body">
          <ErrorAlerts ctrl={ctrl} />
          {/* Collapsed */}
          <div style={{ display: collapsed ? undefined : "none" }}>
            <div style={{ display: published ? undefined : "none" }}>
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
              <h3 className="mb-5 mt-0">
                <a href={depositsCtrl.getRecordUrl(ctrl.record.recid)}>
                  {(ctrl.record.title && ctrl.record.title.title) ||
                    "No video title"}
                </a>
              </h3>
              <Html
                className="f6"
                html={ctrl.record.description || "No description"}
              />
            </div>
            {!published && (
              <div>
                <div className="cds-row">
                  <div className="cds-col-sm-6">
                    <CategoryField />
                  </div>
                  <div className="cds-col-sm-6">
                    <TypeField />
                  </div>
                </div>
                <div className="cds-row">
                  <div className="cds-col-sm-12 text-center text-muted">
                    {!ctrl.isAnyVideoAlreadyPublished() && (
                      <span>
                        Select category and type, they will be applied to the
                        project and all videos.
                        <br />
                        <br />
                        Each project can contain{" "}
                        <strong>
                          maximum {depositsCtrl.maxNumberOfVideos}
                        </strong>{" "}
                        videos.
                      </span>
                    )}
                    {ctrl.isAnyVideoAlreadyPublished() && (
                      <span>
                        Category and type can be changed only if no video has
                        been published yet.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="cds-row">
              <div className="cds-col-sm-12 text-center">
                <hr className="mb-15" />
                <ShowDetailsButton
                  label="Show details"
                  onClick={() => setCollapsed(false)}
                />
              </div>
            </div>
          </div>
          {/* Expanded */}
          {
            <div
              className="cds-row"
              style={{ display: collapsed ? "none" : undefined }}
            >
              <div className="cds-col-sm-12">
                <Tabs
                  active={active}
                  onChange={setActive}
                  tabs={[
                    { key: "metadata", title: "Basic Info" },
                    { key: "files", title: "Files" },
                    { key: "licenses", title: "Licences" },
                    { key: "translations", title: "Translations" },
                    { key: "access", title: "Project editors" },
                    {
                      key: "admin",
                      hidden: !depositsCtrl.isSuperAdmin,
                      title: (
                        <>
                          <i className="fa fa-bug" aria-hidden="true" /> Admin
                        </>
                      ),
                    },
                  ]}
                />
                <div className="tab-content cds-tab-content pt-20 px-20">
                  <div
                    style={{
                      display: active === "metadata" ? undefined : "none",
                    }}
                  >
                    <ProjectFields ctrl={ctrl} />
                  </div>
                  <div
                    style={{ display: active === "files" ? undefined : "none" }}
                  >
                    <ProjectUploader ctrl={ctrl} />
                  </div>
                  <div
                    style={{
                      display: active === "licenses" ? undefined : "none",
                    }}
                  >
                    <div className="cds-row">
                      <div className="cds-col-sm-12">
                        <LicensesField />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: active === "translations" ? undefined : "none",
                    }}
                  >
                    <div className="cds-row">
                      <div className="cds-col-sm-12">
                        <TranslationsField project />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: active === "access" ? undefined : "none",
                    }}
                  >
                    <EditorsField ctrl={ctrl} />
                  </div>
                  <div
                    style={{ display: active === "admin" ? undefined : "none" }}
                  >
                    <div className="mb-10 text-center">
                      <i className="fa fa-external-link" aria-hidden="true" />{" "}
                      <a
                        href={
                          depositsCtrl.projectLinks &&
                          depositsCtrl.projectLinks.self
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        See JSON
                      </a>
                    </div>
                    <div className="cds-panel cds-panel-danger">
                      <div className="cds-panel-heading">Danger Zone</div>
                      <div className="cds-panel-body">
                        <button
                          type="button"
                          className="ui large red button"
                          disabled={ctrl.actionLoading}
                          onClick={() => deleteVideo(ctrl)}
                        >
                          {ctrl.actionLoading
                            ? "Deleting ..."
                            : "Delete Project"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="cds-col-sm-12 pa-5">
                    <hr className="mb-15" />
                    <div className="text-center">
                      <ShowDetailsButton
                        label="Hide details"
                        onClick={() => setCollapsed(true)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </DepositForm>
  );
}

ProjectPanel.propTypes = { ctrl: PropTypes.object.isRequired };
