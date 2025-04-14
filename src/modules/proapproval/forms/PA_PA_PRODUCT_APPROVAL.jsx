import { Container, Row, Col, Button } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_PA_PRODUCT_APPROVAL_JS";
import { useState, useEffect } from "react";
import { useWatch } from "react-hook-form";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import Section from "src/components/forms/reactformutils/fields/Section";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import ReportRuntime from "src/components/reports/Report";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import VendorModalForm from "../pages/VendorModalForms";
import { useFieldArray } from "react-hook-form";
import { Modal } from "react-bootstrap";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    formState: {},
  } = formMethods;

  const [fieldTitle, setFieldTitle] = useState("");
  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formValues,
    formMetaData,
    setFieldTitle,
    control,
    runtimeParams
  );

  const {
    fields: QSTFields,
    append: QSTappend,
    remove: QSTremove,
  } = useFieldArray({
    name: "QST",
    control,
  });

  const {
    fields: SECFields,
    append: SECappend,
    remove: SECremove,
  } = useFieldArray({
    name: "SEC",
    control,
  });

  const {
    fields: OPTFields,
    append: OPTappend,
    remove: OPTremove,
  } = useFieldArray({
    name: "OPT",
    control,
  });

  useEffect(() => {
    if (formValues.objectId == null) {
      formMethods.setValue("status", "New");
      formMethods.setValue("currentStage", "INITIATE");
      formMethods.setValue("previousStage", "");
      // formMethods.setValue("action", 1);
    }
  }, []);

  const configurationData = formMetaData.configurationFormMetaData;

  const stage = formMethods.getValues("currentStage");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal1 = () => setIsModalOpen(false);

  // if (action == 5 || action == 6 || action == 7) {
  //   formMetaData.fields.approvalCommitteeComments.required = false;
  // }

  let riskColor;
  switch (formValues?.preliminaryRiskRating) {
    case 1:
      riskColor = "Green";
      break;
    case 2:
      riskColor = "#ffde21";
      break;
    case 3:
      riskColor = "Red";
      break;
    default:
      riskColor = "#ffde21";
  }

  const schStartDate = useWatch({
    control: control,
    name: "startDate",
  });
  const Frequency = useWatch({
    control: control,
    name: "frequency",
  });
  const frequency = formMethods.getValues("frequency");
  return (
    <>
      <div>
        <Container className="justify-content-center">
          <Section title="General">
            <Row>
              <div className="col-md-10">
                <FormControl
                  control={control}
                  name="name"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  others
                />
              </div>
              <div className="col-md-2">
                <FormControl
                  control={control}
                  name="version"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  others
                />
              </div>
            </Row>
            <Row>
              <div className="col-md-12">
                <FormControl
                  control={control}
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
                  name="proposedDateOfLaunch"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate
                />
              </div>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="businessUnit"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="category"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="type"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          </Section>

          <Section title="Preliminary Risk Assessment">
            <div className="ms-4 mb-2">
              <VendorModalForm
                buttonText={"PRA"}
                objectId={formMethods.getValues("preliminaryChecklistId")}
                control={control}
                formMetaData={formMetaData}
                formMethods={formMethods}
                formValues={formValues}
                modalTitle={"Preliminary Evaluation"}
                SECFields={SECFields}
                SECappend={SECappend}
                QSTFields={QSTFields}
                QSTappend={QSTappend}
                OPTFields={OPTFields}
                OPTappend={OPTappend}
                configurationData={configurationData}
              />

              <Modal show={isModalOpen} onHide={closeModal1} centered>
                <Modal.Header closeButton>
                  <Modal.Title>
                    <h3 className="font-weight-bold text-primary">
                      Following Fields are Mandatory
                    </h3>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
                  Please perform the Preliminary Assessment
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={closeModal1}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="preliminaryRiskScore"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="preliminaryRiskRating"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  textColor={riskColor}
                />
              </div>
            </Row>
          </Section>
          {(stage == "OPCHECK" || stage == "CLOSE" || stage == "APPROVE") && (
            <Section title="Operational Prepradeness">
              <div className="ms-4 mb-2">
                <VendorModalForm
                  buttonText={"OP Checklist"}
                  objectId={formMethods.getValues(
                    "operationPreparednessChecklistId"
                  )}
                  control={control}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  formValues={formValues}
                  modalTitle={"Operational Preparedness Checklist"}
                  SECFields={SECFields}
                  SECappend={SECappend}
                  QSTFields={QSTFields}
                  QSTappend={QSTappend}
                  OPTFields={OPTFields}
                  OPTappend={OPTappend}
                  configurationData={configurationData}
                />

                <Modal show={isModalOpen} onHide={closeModal1} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>
                      <h3 className="font-weight-bold text-primary">
                        Following Fields are Mandatory
                      </h3>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
                    Please perform the Preliminary Assessment
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal1}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
              <Row>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    name="operationalPreparednessScore"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    name="operationalPreparednessRating"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            </Section>
          )}

          <Section title="Revenue Projection">
            <Row>
              <Col md={4}>
                <FormControl
                  control={control}
                  name="estimatedRevenue"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col md={8}>
                <FormControl
                  control={control}
                  name="revenueAttachment"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  required={
                    formMethods.getValues("estimatedRevenue") >=
                    configurationData.revenue_threshold
                  }
                />
              </Col>
            </Row>
            <Row>
              <FormControl
                control={control}
                name="revenueComments"
                formMetaData={formMetaData}
                formMethods={formMethods}
                required={
                  formMethods.getValues("estimatedRevenue") >=
                  configurationData.revenue_threshold
                }
              />
            </Row>
          </Section>
          <Section title="Disclosures">
            <Row>
              <Col md={2}>
                <FormControl
                  control={control}
                  name="customerDisclosures"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col md={5}>
                <FormControl
                  control={control}
                  name="customerDisclosuresAttachment"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  required={
                    formMethods.getValues("customerDisclosures") == true
                  }
                />
              </Col>
              <Col md={5}>
                <FormControl
                  control={control}
                  name="customerDisclosuresComments"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  required={
                    formMethods.getValues("customerDisclosures") == false
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col md={2}>
                <FormControl
                  control={control}
                  name="fairPracticesCode"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col md={5}>
                <FormControl
                  control={control}
                  name="fairPracticesCodeAttachment"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  required={formMethods.getValues("fairPracticesCode") == true}
                />
              </Col>
              <Col md={5}>
                <FormControl
                  control={control}
                  name="fairPracticesCodeComments"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  required={
                    formMethods.getValues("fairPracticesCode") === false
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col md={2}>
                <FormControl
                  control={control}
                  name="kYCNorms"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col md={5}>
                <FormControl
                  control={control}
                  name="kYCNormsAttachment"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  required={formMethods.getValues("kYCNorms") == true}
                />
              </Col>
              <Col md={5}>
                <FormControl
                  control={control}
                  name="kYCNormsComments"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  required={formMethods.getValues("kYCNorms") == false}
                />
              </Col>
            </Row>
          </Section>

          <Section title="Stakeholders">
            <Row>
              <Col md={6}>
                <SubSection title="Internal Stakeholders">
                  <Row>
                    <Row className="p-0 m-0">
                      <div className="col-md-5">
                        <FormControl
                          control={control}
                          name="complianceTeam"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                        />
                      </div>
                      <div className="col-md-7">
                        <FormControl
                          control={control}
                          name="creviewUser"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          required={
                            formMethods.getValues("complianceTeam") == true
                          }
                          visible={
                            formMethods.getValues("complianceTeam") == true
                          }
                          hideTitle
                        />
                      </div>
                    </Row>
                    <Row className="p-0 m-0">
                      <div className="col-md-5">
                        <FormControl
                          control={control}
                          name="riskTeam"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                        />
                      </div>
                      <div className="col-md-7">
                        <FormControl
                          control={control}
                          name="rreviewUser"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          required={formMethods.getValues("riskTeam") == true}
                          visible={formMethods.getValues("riskTeam") == true}
                          hideTitle
                        />
                      </div>
                    </Row>
                    <Row className="p-0 m-0">
                      <div className="col-md-5">
                        <FormControl
                          control={control}
                          name="legalTeam"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                        />
                      </div>
                      <div className="col-md-7">
                        <FormControl
                          control={control}
                          name="lreviewUser"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          required={formMethods.getValues("legalTeam") == true}
                          visible={formMethods.getValues("legalTeam") == true}
                          hideTitle
                        />
                      </div>
                    </Row>
                    <Row className="p-0 m-0">
                      <div className="col-md-5">
                        <FormControl
                          control={control}
                          name="cybersecurityTeam"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                        />
                      </div>
                      <div className="col-md-7">
                        <FormControl
                          control={control}
                          name="itreviewUser"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          required={
                            formMethods.getValues("cybersecurityTeam") == true
                          }
                          visible={
                            formMethods.getValues("cybersecurityTeam") == true
                          }
                          hideTitle
                        />
                      </div>
                    </Row>
                    <Row className="p-0 m-0">
                      <div className="col-md-5">
                        <FormControl
                          control={control}
                          name="operationsTeam"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                        />
                      </div>
                      <div className="col-md-7">
                        <FormControl
                          control={control}
                          name="opreviewUser"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          required={
                            formMethods.getValues("operationsTeam") == true
                          }
                          visible={
                            formMethods.getValues("operationsTeam") == true
                          }
                          hideTitle
                        />
                      </div>
                    </Row>
                    <Row className="p-0 m-0">
                      <div className="col-md-5">
                        <FormControl
                          control={control}
                          name="financeTeam"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                        />
                      </div>
                      <div className="col-md-7">
                        <FormControl
                          control={control}
                          name="freviewUser"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          required={
                            formMethods.getValues("financeTeam") == true
                          }
                          visible={formMethods.getValues("financeTeam") == true}
                          hideTitle
                        />
                      </div>
                    </Row>
                    <Row className="p-0 m-0">
                      <div className="col-md-5">
                        <FormControl
                          control={control}
                          name="customerTeam"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                        />
                      </div>
                      <div className="col-md-7">
                        <FormControl
                          control={control}
                          name="csreviewUser"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          required={
                            formMethods.getValues("customerTeam") == true
                          }
                          visible={
                            formMethods.getValues("customerTeam") == true
                          }
                          hideTitle
                        />
                      </div>
                    </Row>
                    <div className="col-md-12">
                      <FormControl
                        control={control}
                        name="approvalCommitee"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </div>
                    <div className="col-md-12">
                      <FormControl
                        control={control}
                        name="finalApproval"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </div>
                  </Row>
                </SubSection>
              </Col>
              <Col md={6}>
                <SubSection title="External Stakeholders">
                  <Row className="p-0 m-0">
                    <div className="col-md-8">
                      <FormControl
                        control={control}
                        name="emailType"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </div>
                  </Row>
                  <Row className="p-0 m-0">
                    <div className="col-md-12">
                      <FormControl
                        control={control}
                        name="email"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        required={formMethods.getValues("emailType") != ""}
                        visible={formMethods.getValues("emailType") != ""}
                      />
                    </div>
                  </Row>
                  <Row className="p-0 m-0">
                    <div className="col-md-12">
                      <FormControl
                        control={control}
                        name="approver"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </div>
                  </Row>
                </SubSection>
              </Col>
            </Row>
          </Section>
          <Section title="Review Cycle">
            <Row>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="frequency"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>

            {frequency == "8" || frequency == "1" ? (
              <Row>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="startDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    futureDate={true}
                    watchFor="frequency"
                  />
                </div>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="dueDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="frequency"
                    futureDate={true}
                    futureDateValue={
                      frequency == "8"
                        ? new Date(schStartDate).setDate(
                            new Date(schStartDate).getDate()
                          )
                        : new Date(schStartDate).setDate(
                            new Date(schStartDate).getDate() + 1
                          )
                    }
                  />
                </div>
              </Row>
            ) : (
              <Row>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="startDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    futureDate={true}
                    watchFor="frequency"
                  />
                </div>

                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="dueBy"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="frequency"
                  />
                </div>
                <div className="col-md-2 mt-3">
                  <FormControl
                    control={control}
                    name="onWorkingDay"
                    auditableEntity
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="frequency"
                    hideTitle
                  />
                  <FormControl
                    control={control}
                    name="onCalendarDay"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="frequency"
                    hideTitle
                  />
                </div>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="dueDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="frequency"
                    futureDate={true}
                    futureDateValue={
                      frequency == "8"
                        ? new Date(schStartDate).setDate(
                            new Date(schStartDate).getDate()
                          )
                        : new Date(schStartDate).setDate(
                            new Date(schStartDate).getDate() + 1
                          )
                    }
                  />
                </div>
              </Row>
            )}
          </Section>

          {(stage == "CREVIEW" || stage == "CCLARIFICATION") && (
            <Section title="Compliance Review">
              <Row>
                <ReportRuntime
                  report="SM_PRODUCT_APPROVAL_CREVIEW"
                  drilldownReports={{
                    objectId: formMethods.getValues("objectId"),
                  }}
                />
              </Row>
            </Section>
          )}
          {(stage == "RREVIEW" || stage == "RCLARIFICATION") && (
            <Section title="Risk Review">
              <Row>
                <ReportRuntime
                  report="SM_PRODUCT_APPROVAL_RREVIEW"
                  drilldownReports={{
                    objectId: formMethods.getValues("objectId"),
                  }}
                />
              </Row>
            </Section>
          )}
          {(stage == "LREVIEW" || stage == "LCLARIFICATION") && (
            <Section title="Legal Review">
              <Row>
                <ReportRuntime
                  report="SM_PRODUCT_APPROVAL_LREVIEW"
                  drilldownReports={{
                    objectId: formMethods.getValues("objectId"),
                  }}
                />
              </Row>
            </Section>
          )}
          {(stage == "APPROVE" || stage == "CLOSE") && (
            <Section title="Review Summary">
              <Row className="p-0 m-0">
                <ReportRuntime
                  report="SM_PRODUCT_APPROVAL_REVIEWS"
                  drilldownReports={{
                    objectId: formMethods.getValues("objectId"),
                  }}
                />
              </Row>
            </Section>
          )}
          <Section title="Addtional Details">
            <Row>
              <div className="col-md-12">
                <FormControl
                  control={control}
                  name="attachments"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  others
                  required={false}
                />
              </div>
            </Row>
          </Section>

          {(stage == "APPROVE" || stage == "CLOSE") && (
            <Section title="Summary">
              <Row className="p-0 m-0">
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="approvalCommitteeComments"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            </Section>
          )}
        </Container>

        {formValues.objectId != null && (
          <Container className="justify-content-center  ">
            <AuditTrail
              formMetaData={formMetaData}
              formMethods={formMethods}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
              enableAddComment={formValues.status == "Closed" ? false : true}
            />
          </Container>
        )}
      </div>
    </>
  );
};

export default FormLayout;
