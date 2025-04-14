import React from "react";
import {
  Container,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
} from "react-bootstrap";
import ISSUE_ALERT_MODAL from "./ISSUE_ALERT_MODAL";
import JSHook from "./PA_IR_ISSUE_REGISTRY_JS";
import CheckConfiguration from "./CheckConfiguration";
import "../../../../src/assets/scss/profile.scss";
import { useState } from "react";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import ReportRuntime from "src/components/reports/Report";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import Section from "src/components/forms/reactformutils/fields/Section";
import Relationship from "src/components/forms/reactformutils/elements/Relationship";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

let FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues, runtimeParams } = props;
  const { t } = useTranslation();
  const refreshdataref = React.useRef(null);
  runtimeParams.refreshdataref = refreshdataref;
  const { control, watch } = formMethods;
  CheckConfiguration(formMethods, formMetaData);
  const [isAlertShown, setIsAlertshown] = useState(false);
  const [ismessageForAlert, setISMessageForAlert] = useState("");
  let changeTheAertModal = (messageForAlert) => {
    setISMessageForAlert(messageForAlert);
    setIsAlertshown(true);
  };

  formMetaData.form = JSHook(
    form,
    formMethods,
    formMetaData,
    runtimeParams,
    control,
    changeTheAertModal,
    setIsAlertshown,
    setISMessageForAlert
  );
  let hideSection = false;
  if (
    formMethods.getValues("issueId") != "" &&
    formMethods.getValues("currentStage") != "SUBMIT-CLARIFICATION-INITIATOR" &&
    formMethods.getValues("currentStage") != "TRIAGE" &&
    formMethods.getValues("currentStage") != "INITIATE"
  ) {
    formMetaData.fields.issueTitle.editable = false;

    hideSection = true;
  }

  // function callAi() {
  //   rangaanna(formMethods.getValues("issueTitle"));
  // }

  const watchedType = watch("identifiedOn");
  const isActionPlanApproverDifferent = watch("isActionPlanApproverDifferent");
  return (
    <>
      <Container className="justify-content-center  ">
        <Section title={t("Issue Details")}>
          <Row>
            <div className="col-md-9">
              <FormControl
                control={control}
                type="input"
                name="issueTitle"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
              {/* <div onClick={callAi} style={{ cursor: "pointer" }}>
                +_+
              </div> */}
            </div>

            <div className="col-md-3">
              <FormControl
                control={control}
                type="input"
                name="status"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div>
              <FormControl
                control={control}
                name="executiveSummary"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div>
              <FormControl
                control={control}
                type="textarea"
                name="description"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-3">
              <FormControl
                control={control}
                // type="flatpick"
                name="identifiedOn"
                formMetaData={formMetaData}
                formMethods={formMethods}
                minDate={new Date()}
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                // type="flatpick"
                name="firstOccurredOn"
                formMetaData={formMetaData}
                formMethods={formMethods}
                ConditionalDate={
                  formMethods.getValues("identifiedOn") != ""
                    ? new Date(formMethods.getValues("identifiedOn"))
                    : new Date()
                }
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="dueDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
                futureDate={true}
              />
            </div>

            {formMethods.getValues("issueId") != "" &&
              formMethods.getValues("noOfExtensions") != null && (
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="originalIssueDueDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                  <label className="text-dark fw-medium form-label">
                    No of Extensions :{" "}
                  </label>
                  <span style={{ color: "rgb(108, 117, 125)" }}>
                    {formMethods.getValues("noOfExtensions")}
                  </span>
                </div>
              )}
          </Row>
          <div className="col-md-6"></div>
        </Section>

        <Section title={t("Classification")}>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                type="select"
                name="types"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                type="select"
                name="priority"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                type="select"
                name="impact"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                type="select"
                name="likelihood"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                type="select"
                name="severityRating"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>

            <div className="col-md-6">
              <FormControl
                control={control}
                name="justification"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>

        <Section title={t("Source Details")}>
          <Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                type="input"
                name="program"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>

            <div className="col-md-4">
              <FormControl
                control={control}
                type="input"
                name="source"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>

            <div className="col-md-4">
              <FormControl
                control={control}
                type="input"
                name="sourceName"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>

        {hideSection == true && (
          <Section title="Analysis">
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="rootCause"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>

              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="rootCauseDescription"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="symptoms"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="successCriteria"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
            <Row>
              <FormControl
                control={control}
                name="resolutionSummary"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Row>
          </Section>
        )}

        {hideSection == true && (
          <Section title={t("Action Plan Details")}>
            {runtimeParams.formmeta.accessCode == 1 &&
            (formMethods.getValues("currentStage") == "APP" ||
              formMethods.getValues("currentStage") ==
                "SUBMIT_CLARIFICATION_APP" ||
              formMethods.getValues("currentStage") == "API" ||
              formMethods.getValues("currentStage") ==
                "SUBMIT-CLARIFICATION-OWNER") ? (
              <>
                <ButtonToolbar
                  className="justify-content-center mb-1"
                  aria-label="Toolbar with Action Management"
                >
                  <ButtonGroup aria-label="First group" className="flex-grow-1">
                    <ModalForm
                      objectId={-1}
                      component={
                        <FormRunTime
                          formService="action"
                          objectId={-1}
                          modal
                          ParentFormObjectId={formMethods.getValues("issueId")}
                          type="2"
                          callbackParent={form.callbackFromChild}
                        />
                      }
                      buttonText={
                        <>
                          <FontAwesomeIcon icon={faPlusCircle} size="lg" />{" "}
                          {t("Corrective Action")}
                        </>
                      }
                    />
                    <ModalForm
                      objectId={-1}
                      component={
                        <FormRunTime
                          formService="action"
                          objectId={-1}
                          modal
                          ParentFormObjectId={formMethods.getValues("issueId")}
                          type="1"
                          callbackParent={form.callbackFromChild}
                        />
                      }
                      buttonText={
                        <>
                          <FontAwesomeIcon icon={faPlusCircle} size="lg" />{" "}
                          {t("Preventive Action")}
                        </>
                      }
                    />
                  </ButtonGroup>
                </ButtonToolbar>
              </>
            ) : null}
            <ReportRuntime
              refreshdataref={refreshdataref}
              report="IR_ACTION_MANAGEMENT"
              drilldownReports={{ issueId: formMethods.getValues("issueId") }}
              formcallbackParent={form.callbackFromChild}
            />
          </Section>
        )}
        <Section title={t("Ownership")}>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="managedByBU"
                formMetaData={formMetaData}
                formMethods={formMethods}
                zIndex={true}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="owner"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
              {formMethods.getValues("issueId") != "" &&
                formMethods.getValues("delegate") != null && (
                  <FormControl
                    control={control}
                    name="delegate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                )}
            </div>
          </Row>

          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="approverBusinessUnit"
                formMetaData={formMetaData}
                formMethods={formMethods}
                zIndex={true}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="approver"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <div style={{ marginLeft: "15%" }}>
            <Col>
              <FormControl
                control={control}
                hideTitle
                name="isActionPlanApproverDifferent"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </div>
          {formMethods.getValues("isActionPlanApproverDifferent") != false && (
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="actionPlanApproverOrgBu"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="actionPlanApprover"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          )}
        </Section>
        <Section title={t("Additional Details")}>
          <Row>
            <FormControl
              control={control}
              name="attachFiles"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
        </Section>
        {formMethods.getValues("issueId") != "" &&
          formMethods.getValues("currentStage") !== "INITIATE" && (
            <Relationship
              formMetaData={formMetaData}
              formMethods={formMethods}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.issueId}
              sourceName="IR_ISSUE_REGISTRY"
              formValues={formValues}
              secondaryFormName="IR_ISSUE_OBSERVATION_LOG"
              secondaryObjectId={
                formValues.fndId == null ? 0 : formValues.fndId
              }
              hidden={
                runtimeParams.formmeta.accessCode != 1 ||
                formMethods.getValues("currentStage") == "INITIATE" ||
                formMethods.getValues("currentStage") == "CLOSE" ||
                formMethods.getValues("currentStage") == "CANCEL"
                  ? true
                  : false
              }
            />
          )}
        {formMethods.getValues("reasonForCancel") != null &&
          formMethods.getValues("currentStage") != "TRIAGE" &&
          formMethods.getValues("currentStage") != "APP" &&
          formMethods.getValues("currentStage") != "APA" &&
          formMethods.getValues("currentStage") != "API" &&
          formMethods.getValues("issueId") != "" && (
            <Section title="Cancellation Details">
              <Row>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    type="select"
                    name="reasonForCancel"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    name="justificationForCancellation"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            </Section>
          )}
        {formMethods.getValues("issueId") != "" && (
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.issueId}
            enableAddComment={formValues.status == "Closed" ? false : true}
          />
        )}
      </Container>
      {isAlertShown && (
        <ISSUE_ALERT_MODAL
          isOpen={isAlertShown}
          onClose={() => {
            setIsAlertshown(false);
          }}
          message={ismessageForAlert}
        />
      )}
    </>
  );
};

export default FormLayout;
