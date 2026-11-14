# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2015, 2016, 2017 CERN.
#
# Invenio is free software; you can redistribute it
# and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# Invenio is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Invenio; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.

"""JS/CSS bundles for CDS Theme."""

"""JS/CSS bundles for search-ui.

You include one of the bundles in a page like the example below (using
``base`` bundle as an example):

 .. code-block:: html

    {{ webpack['base.js']}}

"""

from invenio_assets.webpack import WebpackThemeBundle

theme = WebpackThemeBundle(
    __name__,
    "assets",
    default="bootstrap3",
    themes={
        "bootstrap3": dict(
            entry={
                "cds_theme_app": "./js/cds/app.js",
                "cds_theme_styles": "./scss/cds/cds.scss",
                "cds_deposit_app": "./js/cds_deposit/app.js",
                "cds_previewer_styles": "./scss/cds_previewer/video.scss",
                "cds_records_app": "./js/cds_records/app.js",
                "cds_records_stats_app": "./js/cds_records/stats.js",
                "cds_records_stats_styles": "./scss/cds_records/stats.scss",
                "cds_search_ui_app": "./js/cds_search_ui/app.js",
            },
            dependencies={
                "angular": "~1.5.8",
                "angular-animate": "~1.4.8",
                "angular-loading-bar": "~0.9.0",
                "angular-sanitize": "~1.5.8",
                "angular-elastic": "~2.5.1",
                "angular-scroll": "~1.0.2",
                "angular-sticky-plugin": "~0.4.1",
                "angular-schema-form": "~0.8.13",
                "angular-lazy-image": "~0.3.2",
                "angular-local-storage": "~0.5.2",
                "angular-schema-form-dynamic-select": "~0.13.1",
                "angular-mass-autocomplete": "~0.5.0",
                "angular-local-storage": "~0.5.2",
                "angularjs-toaster": "~2.1.0",
                "angular-ui-bootstrap": "~2.5.0",
                "angular-strap": "~2.3.9",
                "angular-translate": "~2.11.0",
                "angular-underscore": "~0.0.3",
                "angular-ui-sortable": "~0.14.3",
                "d3": "^3.5.17",
                "invenio-search-js": "^1.5.4",
                "invenio-charts-js": "^0.2.7",
                "invenio-records-js": "~0.0.8",
                # TODO: check if we can remove invenio-files-js
                "invenio-files-js": "~0.0.2",
                "ng-file-upload": "~12.0.4",
                "jquery": "~3.2.1",
                "jqueryui": "~1.11.1",
                "ng-dialog": "~0.6.0",
                "ui-select": "~0.18.1",
                "clipboard": "~1.5.16",
                "ngclipboard": "~1.1.1",
                "lodash": "~4.17.4",
                "mousetrap": "~1.6.1",
                "objectpath": "~1.2.1",
                "tv4": "~1.2.7",
                "bootstrap-sass": "<3.4.2",
                "font-awesome": "~4.5.0",
                "ngmodal": "~2.0.1",
                "cds": "~0.2.0",
                "angular-schema-form-ckeditor": "git+https://github.com/CERNDocumentServer/cds-videos-angular-schema-ckeditor",
                "ckeditor": "4.12.1",
                "rr-ng-ckeditor": "~0.2.1",
                "dompurify": "^2.4.5",
                # needed because ci fails on tests otherwise. not imported in any bundle
                "semantic-ui-less": "^2.4.1",
                "vtt.js": "~0.13.0",
            },
            aliases={
                "@js/cds": "js/cds",
                "@js/cds_deposit": "js/cds_deposit",
                "@js/cds_search_ui": "js/cds_search_ui",
            },
        ),
        "semantic-ui": dict(
            entry={
                # Same entry names as the bootstrap3 theme, so that Python
                # config values (e.g. ``PREVIEWER_BASE_JS_BUNDLES``) work with
                # both themes.
                "cds_theme_app": "./js/cds/app.js",
                "cds_theme_styles": "./scss/cds/cds.scss",
                "cds_deposit_app": "./js/cds_deposit/app.js",
                "cds_previewer_styles": "./scss/cds_previewer/video.scss",
                "cds_records_app": "./js/cds_records/app.js",
                "cds_records_stats_app": "./js/cds_records/stats.js",
                "cds_records_stats_styles": "./scss/cds_records/stats.scss",
                "cds_search_ui_app": "./js/cds_search_ui/app.js",
            },
            dependencies={
                "react": "^16.13.0",
                "react-dom": "^16.13.0",
                "prop-types": "^15.7.2",
                "semantic-ui-react": "^2.1.0",
                "semantic-ui-less": "^2.4.1",
                # react-searchkit 3.0.0 is the last release compatible with
                # react-overridable 0.0.3 (pinned by Invenio-Search-UI 3.0.x).
                # ``<3.0.1`` resolves to 3.0.0 and wins the version merge
                # against the ``^3.0.0`` of Invenio-Search-UI.
                "react-searchkit": "<3.0.1",
                "formik": "^2.4.0",
                "axios": "^1.7.7",
                "lodash": "^4.17.4",
                "qs": "^6.8.0",
                "d3": "^3.5.17",
                "vtt.js": "~0.13.0",
                "dompurify": "^2.4.5",
                "ckeditor": "4.12.1",
                "invenio-charts-js": "^0.2.7",
                # Not used by CDS, but required by Invenio-Search-UI with
                # ``^4.0.0``: the latest 4.x releases need react-overridable
                # 1.x while Invenio-Search-UI pins react-overridable 0.0.3, so
                # keep the last release line compatible with both.
                "react-invenio-forms": "~4.10.0",
            },
            aliases={
                "@js/cds": "js/cds",
                "@js/cds_deposit": "js/cds_deposit",
                "@js/cds_records": "js/cds_records",
                "@js/cds_search_ui": "js/cds_search_ui",
                "@scss/cds": "scss/cds",
                # Semantic-UI theme configuration used by Invenio-Theme to
                # build Semantic UI (``theme.js`` entry point).
                "../../theme.config$": "less/theme.config",
                "../../less/site": "less/site",
                "../../less": "less",
            },
        ),
    },
)
