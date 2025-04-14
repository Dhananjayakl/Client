import React, { useEffect, useState } from "react";

import {
  Button,
  Container,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import ReportRuntime from "src/components/reports/Report";
import { useTranslation } from "react-i18next";
import { getPrimaryKeyByFormName } from "src/modules/admin/AdminService";
import Popup from "src/components/forms/reactformutils/elements/Popup";
import JSHook from "./PA_IA_AUDIT_PLAN_JS";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import { useWatch } from "react-hook-form";
import FormRuntime from "src/components/forms/reactformutils/FormRuntimeEngine";
import { Modal } from "react-bootstrap";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
const FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues, runtimeParams } = props;
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
  const [planid, setPlanId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal1 = () => setIsModalOpen(false);
  const [auditData, setAuditData] = useState({});
  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    control,
    runtimeParams,
    setIsModalOpen,
    setAuditData
  );
  let planStartDate = formMethods.getValues("startDate");
  const planStartDateObj = new Date(planStartDate);
  const currDate = new Date();
  console.log(
    planStartDate,
    currDate,
    "planStartDateplanStartDateplanStartDate"
  );

  useEffect(() => {
    if (
      formMethods.getValues("planId") == null ||
      formMethods.getValues("planId") == ""
    ) {
      getPrimaryKeyByFormName(
        "getPrimaryKeyByFormName",
        formMetaData.formmeta.form_id,
        "NOREGION"
      )
        .then((response) => {
          formMethods.setValue("planId", response.data);
          setPlanId(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setPlanId(formMethods.getValues("planId"));
    }
  });

  let [submissionPopup, setSubmissionPopup] = useState(false);
  const formApi = formMetaData.formmeta.api_handler.replace(/[/]/, "");
  const formObjectId =
    formMethods.getValues("objectId") == ""
      ? -1
      : formMethods.getValues("objectId");

  let auditplanId = useWatch({
    control: control,
    name: "planId",
  });
  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };

  console.log(auditData, "auditData");

  return (
    <>
      <Container className="justify-content-center">
        <Section title="General" required>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="planTitle"
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
            <div className="col-md-6">
              <FormControl
                control={control}
                name="startDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="endDate"
                futureDate={true}
                futureDateValue={
                  planStartDate && planStartDateObj > currDate
                    ? planStartDate
                    : currDate
                }
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="businessUnit"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="planInitiator"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="planOverview"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>
        {/* Commented section audit budget */}
        {/* <Section title="Audit Budget">
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="budgetEffort"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="budgetCost"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section> */}
        <Section title="Audits/Engagements" required>
          <>
            {runtimeParams.formmeta.accessCode == 1 &&
              (formMethods.getValues("currentStage") == "INITIATE" ||
                formMethods.getValues("currentStage") ==
                  "SUBMIT-CLARIFICATION") &&
              formMethods.getValues("startDate") != "" && (
                <>
                  <ButtonToolbar
                    className="justify-content-center mb-1"
                    aria-label="Toolbar with Action Management"
                  >
                    <ButtonGroup
                      aria-label="First group"
                      className="flex-grow-1"
                    >
                      <ModalForm
                        formname={"audits"}
                        objectId={-1}
                        component={
                          <FormRuntime
                            formService="audits"
                            objectId={-1}
                            modal
                            ParentFormObjectId={planid}
                            callbackParent={form.callbackFromChild}
                            actionFlag={true}
                            planStart={formMethods.getValues("startDate")}
                            planEnd={formMethods.getValues("endDate")}
                          />
                        }
                        buttonText={
                          <>
                            <FontAwesomeIcon icon={faPlusCircle} size="lg" />{" "}
                            {t("Add Engagements")}
                          </>
                        }
                      />
                    </ButtonGroup>
                  </ButtonToolbar>
                </>
              )}

            <Modal show={isModalOpen} onHide={closeModal1} centered>
              <Modal.Header closeButton>
                <Modal.Title>
                  <h3 class="font-weight-bold text-primary">
                    Following Field's are Mandatory
                  </h3>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
                {Object.entries(auditData).length > 0
                  ? Object.entries(auditData).map(
                      ([objectId, audits], auditIndex) =>
                        Object.entries(audits).map(
                          ([auditTitle, missingFields]) => (
                            <div
                              key={`${objectId}-${auditTitle}`}
                              style={{ marginBottom: "10px" }}
                            >
                              <strong>
                                <h2 style={{ color: "black" }}>
                                  {auditTitle} Row :{auditIndex + 1}
                                </h2>
                              </strong>
                              <ul style={{ marginLeft: "20px" }}>
                                {missingFields.map((field, index) => (
                                  <div>
                                    <h3>
                                      <span className="text-danger">*</span>
                                      <span style={{ color: "black" }}>
                                        {field}
                                      </span>{" "}
                                      is required{" "}
                                      <span style={{ color: "black" }}>!</span>
                                    </h3>
                                  </div>
                                ))}
                              </ul>
                            </div>
                          )
                        )
                    )
                  : "Please add at least one Engagement/Audit!"}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal1}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <ReportRuntime
              refreshdataref={refreshdataref}
              report="IA_AUDITS_REP"
              drilldownReports={{ planId: auditplanId }}
              formcallbackParent={form.callbackFromChild}
            />
          </>
        </Section>
        <Section title="Additional Details">
          <Row>
            <Col md={6} sm={12}>
              <FormControl
                control={control}
                name="planScope"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6} sm={12}>
              <FormControl
                control={control}
                name="planApproach"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} sm={12}>
              <FormControl
                control={control}
                name="BusinessOverview"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6} sm={12}>
              <FormControl
                control={control}
                name="processOverview"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} sm={12}>
              <FormControl
                control={control}
                name="significantChallenges"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6} sm={12}>
              <FormControl
                control={control}
                name="accomplishments"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <div>
            {submissionPopup && (
              <Popup
                header={
                  submissionPopup == "Review"
                    ? "Send for Review"
                    : submissionPopup
                }
                content={
                  <>
                    {submissionPopup == "Review" &&
                      submissionPopup !== "Submit" && (
                        <Col>
                          <FormControl
                            control={control}
                            name="planReviewer"
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            // isMulti={false}
                          />
                        </Col>
                      )}
                    {submissionPopup == "Approval" &&
                      submissionPopup !== "Submit" && (
                        <Col>
                          <FormControl
                            control={control}
                            name="planApprover"
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            // isMulti={false}
                          />
                        </Col>
                      )}

                    <Col>
                      <FormControl
                        control={control}
                        name="comments"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </Col>
                  </>
                }
                formObjectId={formObjectId}
                formApi={formApi}
                form={form}
                runtimeParams={runtimeParams}
                closePopup={setSubmissionPopup}
              />
            )}
          </div>
        </Section>
        {formValues.currentStage && formValues.currentStage != "INITIATE" && (
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.planId}
          />
        )}
      </Container>
    </>
  );
};

export default FormLayout;
