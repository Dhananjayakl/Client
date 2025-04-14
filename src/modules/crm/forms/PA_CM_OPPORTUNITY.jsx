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
import JSHook from "./PA_CM_OPPORTUNITY_JS";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import { useTranslation } from "react-i18next";
import ReportRuntime from "src/components/reports/Report";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import { useFieldArray } from "react-hook-form";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Grid from "src/components/forms/reactformutils/Grid";

import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
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
  console.log("formValuesformValues", formValues);
  if (formValues.objectId == null) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }

  // const CNTHelpers = useFieldArray({
  //   name: "CNT",
  //   control,
  // });

  // const {
  //   fields: ATHfields,
  //   rows: ATHRows,
  //   append: appendATH,
  //   remove: removeATH,
  // } = useFieldArray({
  //   name: "ATH",
  //   control,
  // });

  // const {
  //   fields: COMfields,
  //   rows: comRows,
  //   append: appendCOM,
  //   remove: removeCOM,
  //   replace: replaceCOM,
  // } = useFieldArray({
  //   name: "COM",
  //   control,
  // });

  const refreshdataref = React.useRef(null);
  runtimeParams.refreshdataref = refreshdataref;

  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref?.current();
  };
  return (
    <>
      <Container className="justify-content-center">
        <Section title="Basic Information">
          <Row>
            <Col md={9}>
              <FormControl
                control={control}
                name="opportunityName"
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
          </Row>
          <Row>
            <Col md={4}>
              <FormControl
                control={control}
                name="bde"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={4}>
              <FormControl
                control={control}
                name="salesManager"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={4}>
              <FormControl
                control={control}
                name="type"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormControl
                control={control}
                name="probability"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={4}>
              <FormControl
                control={control}
                name="account"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={4}>
              <FormControl
                control={control}
                name="lead"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={4}>
              <FormControl
                control={control}
                name="forecastCategory"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={4}>
              <FormControl
                control={control}
                name="expectedCloseDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={4}>
              <FormControl
                control={control}
                name="nextFollowupDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>

        <Section title="Contact Information">
          <Row>
            <Col md={3}>
              <FormControl
                control={control}
                name="primaryContact"
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
                name="phoneNumber"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormControl
                control={control}
                name="decisionMakers"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6}>
              <FormControl
                control={control}
                name="influencers"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>

        <Section title="Contact">
          <Grid
            formMetaData={formMetaData}
            formMethods={formMethods}
            region="CNT"
            columns={[
              { name: "CNT_NAME", length: 3 },
              "CNT_EMAIL",
              "CNT_PHONE_NUMBER",
            ]}
            actions={{ add: true, remove: true }}
          />
        </Section>

        {/* <Section title="Contact">
          <Row>
            {formMetaData.formmeta.accessCode == 1 && (
              <Button
                variant="primary"
                onClick={() => {
                  CNTHelpers.append({});
                }}
              >
                <FontAwesomeIcon icon={faPlusCircle} size="lg" /> Add Contact
              </Button>
            )}
          </Row>
          {CNTHelpers.fields.map((row, rowIndex) => (
            <Row key={row.id}>
              <Col xs={12} md={12} lg={12}>
                <div className="d-flex">
                  {formMetaData.formmeta.accessCode == 1 && (
                    <div
                      className="me-2 "
                      style={rowIndex == 0 ? { marginTop: "3%" } : {}}
                    >
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        color="#FF0000"
                        onClick={() => CNTHelpers.remove(rowIndex)}
                        style={{ cursor: "pointer" }}
                        size="lg"
                      />
                    </div>
                  )}
                  <div className="col-md-4 me-2">
                    <FormControl
                      control={control}
                      zIndex={true}
                      name={`CNT.${rowIndex}.CNT_NAME`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      setData={true}
                      hideTitle={rowIndex > 0 ? true : false}
                    />
                  </div>

                  <div className="col-md-4 me-2">
                    <FormControl
                      control={control}
                      zIndex={true}
                      name={`CNT.${rowIndex}.CNT_EMAIL`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      setData={true}
                      hideTitle={rowIndex > 0 ? true : false}
                    />
                  </div>

                  <div className="col-md-3 me-2">
                    <FormControl
                      control={control}
                      zIndex={true}
                      name={`CNT.${rowIndex}.CNT_PHONE_NUMBER`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      setData={true}
                      hideTitle={rowIndex > 0 ? true : false}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          ))}
        </Section> */}

        <Section title="Competitor">
          <Grid
            formMetaData={formMetaData}
            formMethods={formMethods}
            region="COM"
            columns={["COM_COMPETITOR", "COM_POSITION", "COM_COMMENTS"]}
            actions={{ add: true, remove: true }}
          />
        </Section>
        {/* <Section title="Competitor">
          {formMetaData.formmeta.accessCode == 1 && (
            <Row>
              <Button
                variant="primary"
                onClick={() => {
                  // addcomRows();
                  appendCOM({});
                }}
              >
                <FontAwesomeIcon icon={faPlusCircle} size="lg" /> Add Competitor
              </Button>
            </Row>
          )}
          {COMfields.map((row, rowIndex) => (
            <Row key={row.id}>
              <Col xs={12} md={12} lg={12}>
                <div className="d-flex">
                  {formMetaData.formmeta.accessCode == 1 && (
                    <div
                      className="me-2 "
                      style={rowIndex == 0 ? { marginTop: "3%" } : {}}
                    >
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        color="#FF0000"
                        onClick={() => removeCOM(rowIndex)}
                        style={{ cursor: "pointer" }}
                        size="lg"
                      />
                    </div>
                  )}
                  <div className="col-md-4 me-2">
                    <FormControl
                      control={control}
                      zIndex={true}
                      name={`COM.${rowIndex}.COM_COMPETITOR`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      setData={true}
                      hideTitle={rowIndex > 0 ? true : false}
                    />
                  </div>

                  <div className="col-md-3 me-2">
                    <FormControl
                      control={control}
                      zIndex={true}
                      name={`COM.${rowIndex}.COM_POSITION`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      setData={true}
                      hideTitle={rowIndex > 0 ? true : false}
                    />
                  </div>

                  <div className="col-md-3 me-2">
                    <FormControl
                      control={control}
                      zIndex={true}
                      name={`COM.${rowIndex}.COM_COMMENTS`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      setData={true}
                      hideTitle={rowIndex > 0 ? true : false}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          ))}
        </Section> */}
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
        <Section title="Product/Service Information">
          <Row>
            <Col md={6}>
              <FormControl
                control={control}
                name="solutions"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>

            <Col md={6}>
              <FormControl
                control={control}
                name="additionalComments"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <FormControl
                control={control}
                name="deploymentType"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="license"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="implementation"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="amc"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            {/* <Col md={6}>
              <FormControl
                control={control}
                name="winLossReason"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6}>
              <FormControl
                control={control}
                name="specialInstructions"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col> */}
          </Row>
        </Section>

        <Section title="Attachments">
          <Grid
            formMetaData={formMetaData}
            formMethods={formMethods}
            region="ATH"
            // helpers={CNTHelpers}
            columns={["ATH_CATEGORY", "ATH_ATTACHMENT"]}
            actions={{ add: true, remove: true }}
          />
        </Section>
        {/* <Section title="Attachments">
          {formMetaData.formmeta.accessCode == 1 && (
            <Row>
              <Button
                variant="primary"
                onClick={() => {
                  // addATHRow();
                  appendATH({});
                }}
              >
                <FontAwesomeIcon icon={faPlusCircle} size="lg" /> Add Attachment
              </Button>
            </Row>
          )}
          {ATHfields.map((row, rowIndex) => (
            <Row key={row.id}>
              <Col xs={12} md={12} lg={12}>
                <div className="d-flex">
                  {formMetaData.formmeta.accessCode == 1 && (
                    <div
                      className="me-2 "
                      style={rowIndex == 0 ? { marginTop: "3%" } : {}}
                    >
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        color="#FF0000"
                        onClick={() => removeATH(rowIndex)}
                        size="lg"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  )}
                  <div className="col-md-4 me-2">
                    <FormControl
                      control={control}
                      zIndex={true}
                      name={`ATH.${rowIndex}.ATH_CATEGORY`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      setData={true}
                      hideTitle={rowIndex > 0 ? true : false}
                    />
                  </div>

                  <div className="col-md-8 me-2">
                    <FormControl
                      control={control}
                      zIndex={true}
                      name={`ATH.${rowIndex}.ATH_ATTACHMENT`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      setData={true}
                      hideTitle={rowIndex > 0 ? true : false}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          ))}
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
                      sourceType="2"
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
              ChartdrilldownReports={`source_type=2 and source =${formValues.objectId}`}
              // drilldownReports={{
              //   objectId: formValues.objectId,
              //   lead: formValues.lead == null ? 0 : formValues.lead,
              // }}
            />
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
