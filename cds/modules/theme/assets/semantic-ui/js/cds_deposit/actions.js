/*
 * This file is part of CDS.
 * Copyright (C) 2026 CERN.
 *
 * CDS is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 2 of the License, or (at your
 * option) any later version.
 */

/* Actions of the deposits (the former ``cdsActions`` component). */

import { chainedActions, cleanData, guessEndpoint, makeAction } from "./api";

function videoMakeActions(actionName, videos) {
  return videos
    .filter((video) => video._deposit.status === "draft")
    .map((video) => () => {
      const cleanedVideo = cleanData(video);
      const url = guessEndpoint(
        cleanedVideo,
        "video",
        actionName,
        cleanedVideo.links
      );
      return makeAction(url, "video", actionName, cleanedVideo);
    });
}

function projectMakeAction(actionName, master, project) {
  return () => {
    const cleanedProject = cleanData(project);
    const url = guessEndpoint(
      cleanedProject,
      "project",
      actionName,
      master.links
    );
    return makeAction(url, "project", actionName, cleanedProject);
  };
}

/**
 * Save the videos first, then the project: the response of the project
 * contains the videos metadata too, which must be up to date.
 */
function saveAllMakeActions(depositsCtrl) {
  const master = depositsCtrl.master;
  const actions = videoMakeActions("SAVE_PARTIAL", master.metadata.videos);
  actions.push(projectMakeAction("SAVE_PARTIAL", master, master.metadata));
  return actions;
}

/** When publishing a project, save the videos and the project first. */
function chainExtraActions(ctrl, actions) {
  const arrayActions = Array.isArray(actions) ? actions : [actions];
  if (arrayActions.indexOf("PUBLISH") > -1 && ctrl.depositType === "project") {
    return chainedActions(saveAllMakeActions(ctrl.depositsCtrl));
  }
  return Promise.resolve();
}

export function actionHandler(ctrl, userActions) {
  const hasMultipleActions = Array.isArray(userActions);
  ctrl.preActions();
  return chainExtraActions(ctrl, userActions)
    .then(() =>
      hasMultipleActions
        ? ctrl.makeMultipleActions(userActions)
        : ctrl.makeSingleAction(userActions)
    )
    .then(
      (response) => {
        const check = hasMultipleActions ? userActions : [userActions];
        let message;
        if (check.indexOf("DELETE") > -1) {
          message = "Successfully deleted.";
        } else if (check.indexOf("PUBLISH") > -1) {
          message = "Successfully published.";
        }
        ctrl.onSuccessAction(response, message);
      },
      // As before, a failed action is reported but resolves the promise
      (response) => ctrl.onErrorAction(response)
    )
    .finally(() => ctrl.postActions());
}

export function deleteVideo(ctrl) {
  return actionHandler(ctrl, "DELETE").then(() =>
    ctrl.depositsCtrl.removeVideo(ctrl.id)
  );
}

/** Edit a published deposit, unless it is a video of a published project. */
export function editPublished(ctrl, showCannotEditVideoDialog) {
  if (ctrl.depositType === "video" && ctrl.isProjectPublished()) {
    showCannotEditVideoDialog();
  } else {
    actionHandler(ctrl, ["EDIT", "SAVE_PARTIAL"]);
    ctrl.changeShowAll(false);
  }
}

/** Save the project and all its draft videos. */
export function saveAllPartial(ctrl) {
  if (ctrl.depositType !== "project") {
    return Promise.resolve();
  }
  ctrl.preActions();
  return chainedActions(saveAllMakeActions(ctrl.depositsCtrl))
    .then(
      (responses) => ctrl.onSuccessActionMultiple(responses),
      (response) => ctrl.onErrorAction(response)
    )
    .finally(() => ctrl.postActions());
}
