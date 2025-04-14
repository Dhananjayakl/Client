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
import JSHook from "./PA_PM_WEEKLY_STATUS_UPDATE_JS";
import BottomBar from "src/components/forms/reactformutils/elements/BottomBar";
import Popup from "src/components/forms/reactformutils/elements/Popup";
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

  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    control
  );
  let accessCode = formMetaData.formmeta.accessCode;
  let currentstage = formMethods.getValues("currentStage");
  let [submissionPopup, setSubmissionPopup] = useState(false);
  const formApi = formMetaData.formmeta.api_handler.replace(/[/]/, "");
  const formObjectId =
    formMethods.getValues("objectId") == ""
      ? -1
      : formMethods.getValues("objectId");
  return (
    <>
      <Container className="justify-content-center">
        <Section title="Employee Information" required>
          <Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="empName"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="empId"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="empDept"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>
        <Section title="Weekly Status">
          <Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="weekEnding"
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
            <div className="col-md-4"></div>
          </Row>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="projectTask"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="projectProgress"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="challenges"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="nextSteps"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="reportingManager"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="submittedOn"
                formMetaData={formMetaData}
                formMethods={formMethods}
                enableFieldData={true}
              />
            </div>
          </Row>
        </Section>
      </Container>
    </>
  );
};

export default FormLayout;
