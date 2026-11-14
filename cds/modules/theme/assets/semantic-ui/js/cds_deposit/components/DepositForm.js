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
 * Formik form of a deposit: the values are the form fields of the record,
 * kept in sync with the deposit controller in both directions.
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Formik, useFormikContext } from "formik";
import _isEqual from "lodash/isEqual";

import { DepositFormContext } from "../fields/Fields";
import { validateProject, validateVideo } from "../fields/validation";

function FormBridge({ ctrl, children }) {
  const formik = useFormikContext();

  // The controller pushes programmatic changes to the form
  // eslint-disable-next-line no-param-reassign
  ctrl.formApi = {
    setValues: (values) => formik.setValues(values, true),
    resetForm: (values) => {
      formik.resetForm({ values });
      formik.validateForm(values);
    },
  };

  useEffect(
    () => () => {
      // eslint-disable-next-line no-param-reassign
      ctrl.formApi = null;
    },
    [ctrl]
  );

  useEffect(() => {
    if (!_isEqual(ctrl.formErrors, formik.errors)) {
      // eslint-disable-next-line no-param-reassign
      ctrl.formErrors = formik.errors;
      ctrl.notify();
    }
  }, [ctrl, formik.errors]);

  return (
    <DepositFormContext.Provider value={{ ctrl }}>
      {children}
    </DepositFormContext.Provider>
  );
}

FormBridge.propTypes = {
  ctrl: PropTypes.object.isRequired,
  children: PropTypes.node,
};

FormBridge.defaultProps = { children: null };

export function DepositForm({ ctrl, children }) {
  const [initialValues] = useState(() => ctrl.formValues());
  const validate =
    ctrl.depositType === "project" ? validateProject : validateVideo;
  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      validateOnMount
      onSubmit={() => {}}
    >
      <FormBridge ctrl={ctrl}>{children}</FormBridge>
    </Formik>
  );
}

DepositForm.propTypes = {
  ctrl: PropTypes.object.isRequired,
  children: PropTypes.node,
};

DepositForm.defaultProps = { children: null };
