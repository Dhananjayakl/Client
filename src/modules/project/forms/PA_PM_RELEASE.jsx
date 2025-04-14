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
import JSHook from "./PA_PM_RELEASE_JS";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import ReportRuntime from "src/components/reports/Report";
import { useTranslation } from "react-i18next";
import { Grid } from "src/Progrec";

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

  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    control
  );

  if (formValues.objectId == null) {
    formMethods.setValue("action", 1);
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }
  let accessCode = formMetaData.formmeta.accessCode;
  return (
    <>
      <Container className="justify-content-center">
        <Section title="Release Information" required>
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
            <div className="col-md-4">
              <FormControl
                control={control}
                name="startDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="releaseDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="endDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>

        <Section title="Release Notes">
        

          <Grid
            formMetaData={formMetaData}
            formMethods={formMethods}
            region="PRD"
            columns={[
              { name: "prdProduct", length: 3 },
              { name: "prdReleaseDocument", length: 5 },
              "prdNotes",
            ]}
            actions={{ add: true, remove: true }}
          />

<Row>
            <Col>
              <FormControl
                control={control}
                name="releaseSummary"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>{" "}
          </Row>
        </Section>

        <Section title="Validation">
          <Row>
            <Col>
              <FormControl
                control={control}
                name="validationSummary"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>{" "}
          </Row>
        </Section>

        <Section title="Attachments">
          <Row>
            <Col>
              <FormControl
                control={control}
                name="attachments"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>{" "}
          </Row>
        </Section>
      </Container>
      {formValues.objectId != null && (
        // <Container className="justify-content-center  ">
        //   <Section title="Comments and Change History">
        <AuditTrail
          formMetaData={formMetaData}
          formMethods={formMethods}
          formId={formMetaData.formmeta.form_id}
          objectId={formValues.objectId}
        />
        //   </Section>
        // </Container>
      )}
    </>
  );
};

export default FormLayout;
