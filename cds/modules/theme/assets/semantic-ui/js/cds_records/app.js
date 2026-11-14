/*
 * This file is part of CDS.
 * Copyright (C) 2026 CERN.
 *
 * CDS is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 2 of the License, or (at your
 * option) any later version.
 */

/* ``cds_records_app`` entry point: the record page (``/record/<recid>``). */

import React from "react";
import ReactDOM from "react-dom";

import { mountLoadingBar, onReady } from "@js/cds/search/mount";

import { RecordView } from "./RecordView";

onReady(() => {
  const element = document.getElementById("cds-record-view");
  if (!element) {
    return;
  }
  const data = element.dataset;
  ReactDOM.render(
    <RecordView
      type={data.type === "project" ? "project" : "video"}
      recordUrl={data.record}
      recordViewsUrl={data.recordViews || ""}
      mediaDownloadEventUrl={data.mediaDownloadEventUrl || ""}
      relatedQueryUrl={data.relatedQueryUrl || ""}
      previewLines={parseInt(data.previewLines, 10) || 10}
    />,
    element
  );
  mountLoadingBar();
});
