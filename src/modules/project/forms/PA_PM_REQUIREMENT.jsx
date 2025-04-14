import React from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useFieldArray } from "react-hook-form";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import { useEffect, useMemo, useState } from "react";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import ReportRuntime from "src/components/reports/Report";
import { useTranslation } from "react-i18next";
let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    callbackToParent,
    formValues,
    runtimeParams,
  } = props;
  const { t } = useTranslation();
  const refreshdataref = React.useRef(null);
  runtimeParams.refreshdataref = refreshdataref;
  const {
    setError,
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touched, isSubmitting, isDirty },
  } = formMethods;

  // formMetaData.form = JSHook(
  //   form,
  //   formMetaData,
  //   formMethods,
  //   MSFields,
  //   formValues,
  //   control
  // );
  if (formValues.objectId == null) {
    formMethods.setValue("action", 1);
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }
  let accessCode = formMetaData.formmeta.accessCode;

  return (
    <>
      <Container className="justify-content-center">
        <Section title="Project Information" required>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="title"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="status"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="product"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="category"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="functionality"
                formMetaData={formMetaData}
                formMethods={formMethods}
                required={false}
                // disabled={false}
              />
            </div>
          </Row>
        </Section>
      </Container>
      {formValues.objectId != null && (
        <AuditTrail
          formMetaData={formMetaData}
          formMethods={formMethods}
          formId={formMetaData.formmeta.form_id}
          objectId={formValues.objectId}
        />
      )}
    </>
  );
};

export default FormLayout;
