import React from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
  ButtonToolbar,
  ButtonGroup,
} from "react-bootstrap";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";

import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import { useTranslation } from "react-i18next";
import ReportRuntime from "src/components/reports/Report";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";

import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import JSHook from "./PA_CM_LEAD_JS";
let FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues, runtimeParams } = props;
  const { t } = useTranslation();

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
    formMethods,
    formMetaData,
    formValues,
    control
  );

  if (formValues.objectId == null) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }
  const refreshdataref = React.useRef(null);
  runtimeParams.refreshdataref = refreshdataref;

  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref?.current();
  };

  if (formMethods.getValues("industry") != 6) {
    formMethods.setValue("addIndustry", "");
  }

  const watchedType = watch("industry");

  return (
    <>
      <Container className="justify-content-center">
        <Section title={t("Basic Information")}>
          <Row>
            <Col md={6}>
              <FormControl
                control={control}
                name="prospect"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            {/* <Col md={6}>
              <FormControl
                control={control}
                name="leadName"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col> */}
            <Col md={2}>
              <FormControl
                control={control}
                name="contact"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={2}>
              <FormControl
                control={control}
                name="firstName"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={2}>
              <FormControl
                control={control}
                name="secondName"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <FormControl
                control={control}
                name="jobTitle"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="email"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="primaryNumber"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="secondaryNumber"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <FormControl
                control={control}
                name="sourceType"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="referral"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="industry"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="status"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>

            {formMethods.getValues("industry") == 6 && (
              <Col md={3}>
                <FormControl
                  control={control}
                  name="addIndustry"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
            )}
          </Row>
          <Row>
            <Col md={3}>
              <FormControl
                control={control}
                name="bde"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="salesManager"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            {/* <Col md={3}>
              <FormControl
                control={control}
                name="account"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col> */}
            <Col md={3}>
              <FormControl
                control={control}
                name="conversionProbability"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="leadDisposition"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>

        <Section title="Qualification">
          <Row>
            <Col md={3}>
              <FormControl
                control={control}
                name="budget"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="authority"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="need"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="timeline"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>
        {/* <Section title={t("Lead Status")}>
          <Row>
            <Col md={3}>
              <FormControl
                control={control}
                name="qualificationStatus"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="conversionProbability"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section> */}
        {formValues.objectId != null && (
          <Section title={t("Activity List")}>
            {runtimeParams.formmeta.accessCode == 1 && (
              <Row className="px-2">
                <ModalForm
                  formService="cmactivity"
                  objectId={-1}
                  component={
                    <FormRunTime
                      formService="cmactivity"
                      objectId={-1}
                      // notform={true}
                      modal
                      ParentFormObjectId={formMethods.getValues("objectId")}
                      sourceType="1"
                      callbackParent={form.callbackFromChild}
                    />
                  }
                  buttonText={
                    <>
                      <FontAwesomeIcon icon={faPlusCircle} size="lg" /> Activity
                    </>
                  }
                  size="xl"
                />
              </Row>
            )}
            <ReportRuntime
              refreshdataref={refreshdataref}
              report="CM_ACTIVITY_LIST_BY_SOURCE"
              // drilldownReports={{
              //   objectId: 0,
              //   lead: formValues.objectId,
              // }}
              ChartdrilldownReports={`source_type=1 and source =${formValues.objectId}`}
            />
          </Section>
        )}

        {formValues.objectId != null && (
          <Section title={t("Disqualification Information")}>
            <Row>
              <Col md={3}>
                <FormControl
                  control={control}
                  name="disqualificationDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col md={9}>
                <FormControl
                  control={control}
                  name="disqualificationReason"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col md={12}>
                <FormControl
                  control={control}
                  name="followUpPotential"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
            </Row>
          </Section>
        )}

        {formValues.objectId != null && (
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
          />
        )}
      </Container>
    </>
  );
};

export default FormLayout;
