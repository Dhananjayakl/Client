import { Container, Row, Col, Modal } from "react-bootstrap";
import { useFieldArray } from "react-hook-form";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import JSHook from "./PA_BR_EXERCISE_PLAN_JS";
import React, { useState } from "react";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import ReportRuntime from "src/components/reports/Report";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";

const FormLayout = (props) => {
  let { formMethods, formMetaData, formValues, form, runtimeParams } = props;
  const { control } = formMethods;

  const refreshdataref = React.useRef(null);
  runtimeParams.refreshdataref = refreshdataref;
  const {
    fields: bcpFields,
    append: appendbcp,
    remove: removebcp,
  } = useFieldArray({
    name: "BCP",
    control,
  });

  const [bcpName, setBcpName] = useState("");
  const [showModal, setShowModal] = useState(false);

  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    appendbcp,
    removebcp,
    setBcpName,
    control,
    runtimeParams
  );

  let exerciseStats = formMethods.getValues("status");
  let exerciseStage = formMethods.getValues("currentStage");

  let exerciseMethods = formMethods.getValues("exerciseMethod");

  const [showMore, setShowMore] = useState(false);

  const handleToggle = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };

  const truncateText = (text, length) => {
    if (typeof text !== "string") return "";
    if (text.length <= length) return text;
    return text.substring(0, length) + ".....";
  };

  const displayedText = showMore ? bcpName : truncateText(bcpName, 25);

  let currentStage = formMethods.getValues("currentStage");

  return (
    <>
      <Container className="justify-content-center  ">
        <Section title="General" required>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="exerciseName"
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
            <Col>
              <FormControl
                control={control}
                name="exerciseMethod"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="exerciseOwner"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FormControl
                control={control}
                name="guideLines"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FormControl
                control={control}
                name="scheduleFrequency"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="nextReviewDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>

        <Section title="Scope Definition" required>
          <Row>
            <Col>
              {" "}
              <FormControl
                control={control}
                name="scope"
                formMetaData={formMetaData}
                formMethods={formMethods}
                zIndex={true}
                defaultvalue={runtimeParams.ownerOrg}
              />
              {/* {bcpName && (
                <a
                  variant="dark"
                  className="ms-5 text-dark"
                  onClick={() => setShowModal(true)}
                >
                  {displayedText}
                </a>
              )}
              {bcpName && bcpName.length > 25 && (
                <a
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle();
                  }}
                  className="ms-2 fs-5"
                  variant="primary"
                >
                  {showMore ? "less" : "more"}
                </a>
              )}
              <Modal
                className="modal-xl setting"
                show={showModal}
                onHide={() => {
                  setShowModal(false);
                }}
                backdrop="static"
              >
                <Modal.Header closeButton className="d-none"></Modal.Header>
                <Modal.Body>
                  <FormRunTime
                    formService="businessconplan"
                    objectId={formMethods.getValues("scope")}
                    modal
                    editButton={true}
                  />
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
              </Modal> */}
              <ModalForm
                className="mb-4 ms-3"
                variant
                style={{ textDecoration: "underline" }}
                objectId={formMethods.getValues("scope")?.value}
                component={
                  <FormRunTime
                    formService="businessconplan"
                    objectId={formMethods.getValues("scope")?.value}
                    modal
                    editButton={true}
                    // callbackParent={callbackFromChild}
                  />
                }
                buttonText={bcpName}
              />
            </Col>
            <Col></Col>
          </Row>
          {exerciseMethods == 2 && (
            <SubSection title="Desk Check">
              <Row>
                <Col>
                  <FormControl
                    control={control}
                    name="planReviewer"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    defaultvalue={runtimeParams.ownerOrg}
                  />
                </Col>
                <Col>
                  <FormControl
                    control={control}
                    name="startDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    futureDate={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormControl
                    control={control}
                    name="deskcomments"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
              </Row>
              {(exerciseStats === "Active" || exerciseStats === "Closed") && (
                <>
                  <Row>
                    <FormControl
                      control={control}
                      name="taskOwnerComments"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </Row>
                  <Row>
                    <FormControl
                      control={control}
                      name="reviewerComments"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </Row>
                </>
              )}
            </SubSection>
          )}
          {exerciseMethods == 1 && (
            <SubSection title="Functional">
              <div
                style={{
                  overflowX: "auto",
                  maxWidth: "100%",
                }}
              >
                {bcpFields.map((row, rowIndex) => (
                  <Row key={row.id}>
                    <Col xs={12} md={12} lg={12}>
                      <div>
                        <div className="d-flex">
                          <div className="col-md-2 me-3 ">
                            <FormControl
                              control={control}
                              name={`BCP.${rowIndex}.bcpRisk`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              hideTitle={rowIndex > 0}
                            />
                          </div>
                          <div className="col-md-2 me-3 ">
                            <FormControl
                              control={control}
                              name={`BCP.${rowIndex}.bcpTask`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              hideTitle={rowIndex > 0}
                            />
                          </div>
                          <div className="col-md-2 me-2 ">
                            <FormControl
                              control={control}
                              name={`BCP.${rowIndex}.bcpOwner`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              setData={true}
                              hideTitle={rowIndex > 0}
                            />
                          </div>
                          <div className="col-md-2 me-3">
                            <FormControl
                              control={control}
                              name={`BCP.${rowIndex}.bcptimeAllocated`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              hideTitle={rowIndex > 0}
                            />
                          </div>{" "}
                          {(exerciseStats === "Active" ||
                            exerciseStats === "Closed") && (
                            <>
                              <div className="col-md-2 me-3">
                                <FormControl
                                  control={control}
                                  name={`BCP.${rowIndex}.bcpActualTimeTaken`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  hideTitle={rowIndex > 0}
                                />
                              </div>{" "}
                              <div className="col-md-2 me-3">
                                <FormControl
                                  control={control}
                                  name={`BCP.${rowIndex}.bcpPerceCompleted`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  hideTitle={rowIndex > 0}
                                />
                              </div>
                            </>
                          )}
                          <div className="col-md-3 me-3 ">
                            <FormControl
                              control={control}
                              name={`BCP.${rowIndex}.bcpTaskComments`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              hideTitle={rowIndex > 0}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ))}
              </div>

              <Row>
                <Col>
                  <FormControl
                    control={control}
                    name="startDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    futureDate={true}
                  />
                </Col>
                <Col>
                  <FormControl
                    control={control}
                    name="bcpComments"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
              </Row>
            </SubSection>
          )}
        </Section>
        {(exerciseStats === "Active" || exerciseStats === "Closed") && (
          <Section title="Findings / Actions during exercise">
            <Col className="text-end mb-1">
              <ModalForm
                formname="issueobservation"
                objectId={-1}
                component={
                  <FormRunTime
                    formService="issueobservation"
                    objectId={-1}
                    modal
                    ParentFormObjectId={formValues.objectId}
                    fndApprover={formValues.exerciseOwner}
                    fndBusinessUnit={formValues.businessUnit}
                    program="5"
                    callbackParent={form.callbackFromChild}
                    source_form_name="BR_EXERCISE_PLAN"
                  />
                }
                buttonText={
                  <>
                    <FontAwesomeIcon icon={faPlusCircle} size="lg" /> Add
                    Finding
                  </>
                }
                disabled={
                  exerciseStage === "CLOSE-REVIEW" ||
                  exerciseStage === "CLOSE-CANCEL" ||
                  formMetaData.formmeta.accessCode !== 1
                    ? true
                    : false
                }
              />
            </Col>
            <ReportRuntime
              refreshdataref={refreshdataref}
              formcallbackParent={form.callbackFromChild}
              report="IR_BR_FINDINGS"
              drilldownReports={{
                exerciseId: formValues.objectId,
              }}
            />
          </Section>
        )}
        {(exerciseStats === "Active" || exerciseStats === "Closed") && (
          <Section title="Exercise Results" required>
            <Row>
              <FormControl
                control={control}
                name="processRecovered"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Row>
            <Row>
              <FormControl
                control={control}
                name="exerciseResult"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Row>
          </Section>
        )}
        <Row>
          <Col>
            <FormControl
              control={control}
              name="comments"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
      </Container>
      {formValues.objectId != null && (
        <Container className="justify-content-center  ">
          <AuditTrail
            formMetaData={formMetaData}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
            formMethods={formMethods}
            enableChangeHistory={currentStage == "INITIATE"}
          />
        </Container>
      )}
    </>
  );
};

export default FormLayout;
