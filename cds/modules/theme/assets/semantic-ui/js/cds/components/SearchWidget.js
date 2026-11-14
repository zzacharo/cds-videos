/*
 * This file is part of CDS.
 * Copyright (C) 2026 CERN.
 *
 * CDS is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 2 of the License, or (at your
 * option) any later version.
 */

import React from "react";
import PropTypes from "prop-types";

import { SearchLoading, SearchResults } from "../search/components";
import { SearchApp } from "../search/SearchApp";
import { VIDEO_TEMPLATES } from "./VideoTemplates";

/**
 * A search that is not reflected in the URL, used by the home page sections
 * and the related videos (``<invenio-search disable-url-handler="true">``).
 */
export function SearchWidget({
  endpoint,
  template,
  loadingMessage,
  centeredLoading,
  withLoading,
  hiddenParams,
  extraParams,
  children,
}) {
  const Template =
    typeof template === "string" ? VIDEO_TEMPLATES[template] : template;
  const loading = <SearchLoading message={loadingMessage} />;
  return (
    <SearchApp
      endpoint={endpoint}
      hiddenParams={hiddenParams}
      extraParams={extraParams}
      disableUrlHandler
    >
      {children}
      {withLoading &&
        (centeredLoading ? (
          <div className="text-center">{loading}</div>
        ) : (
          loading
        ))}
      <SearchResults template={Template} />
    </SearchApp>
  );
}

SearchWidget.propTypes = {
  endpoint: PropTypes.string.isRequired,
  template: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType])
    .isRequired,
  loadingMessage: PropTypes.string,
  centeredLoading: PropTypes.bool,
  withLoading: PropTypes.bool,
  hiddenParams: PropTypes.object,
  extraParams: PropTypes.object,
  children: PropTypes.node,
};

SearchWidget.defaultProps = {
  loadingMessage: "",
  centeredLoading: true,
  withLoading: true,
  hiddenParams: {},
  extraParams: {},
  children: null,
};
