import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Modal,
  ButtonToolbar,
  ButtonGroup,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_RA_RISK_ASSESSMENT_REG_COMP_JS";
import React, { useState, useEffect, useRef } from "react";
import HybridSection from "src/components/forms/reactformutils/fields/HybridSection";
import Section from "src/components/forms/reactformutils/fields/Section";
import { useFieldArray } from "react-hook-form";
import { getServiceData } from "../RiskServices";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";
import Confirmation from "src/components/forms/reactformutils/elements/Confirmation";
import ReportRuntime from "src/components/reports/Report";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import PriorIssues from "../pages/PriorIssues";
import { ModalButton } from "src/components/forms/reactformutils/elements/Confirmation";
import { useTranslation } from "react-i18next";
const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    getValues,
    formState: {},
  } = formMethods;
  const refreshdataref = React.useRef(null);
  runtimeParams.refreshdataref = refreshdataref;
  const { t } = useTranslation("common");

  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };
  const [deletedSectionKey, setDeletedSectionKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedControlId, setSelectedControlId] = useState(null);

  const deleteSectionforFND = (index) => {
    setDeletedSectionKey(deletedSectionKey + 1);
    FNDremove(index);
  };

  formValues.source_form_name = "RA_RISK_ASSESSMENT_REG_COMP";

  const [show, setShow] = useState(false);

  const handleCloseModal = () => {
    setShow(false);
    setSelectedControlId(null);
  };

  let riskIds = formValues.REQ?.map((a) => a.reqId);
  const [isLoading, setIsLoading] = useState(true);
  const [controlData, setControlData] = useState({});
  //Configuration setUp
  const Configure = formMetaData.configurationFormMetaData;
  const preRating = Configure.pre_reg_rating;
  const factorType = Configure.factor_based;
  const priorIssuesReport = Configure.prior_issue_report;

  let onlyInherent = getValues("assessmentType") == "1" ? true : false;

  useEffect(() => {
    const handleControlRelationship = () => {
      getServiceData("getRequirementInfo", riskIds)
        .then((response) => {
          setControlData(response.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    handleControlRelationship();
  }, []);

  const {
    fields: REQFields,
    append: REQappend,
    remove: REQremove,
  } = useFieldArray({
    name: "REQ",
    control,
  });

  const {
    fields: CTLFields,
    append: CTLappend,
    remove: CTLremove,
  } = useFieldArray({
    name: "CTL",
    control,
  });
  console.log("fhfhf", CTLFields);

  const [alert, setAlert] = useState("");

  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formValues,
    formMetaData,
    runtimeParams,
    control,
    setAlert,
    setShowModal
  );

  if (isLoading) {
    return;
  }

  const handleAlertClose = () => {
    setShowModal(false);
  };

  function multiregionCondition(item, i) {
    formMethods.setValue("REQ." + i + ".overrideResidualRating", "");
  }
  const scopeBusinessUnit = formValues.businessUnit;
  const FrameworkType = formMethods.getValues("framework");
  const objectId = formMethods.getValues("objectId");
  const previousControlResultsContent = (selectedControlId) => (
    <>
      <ReportRuntime
        report="CT_CONTROL_RESULTS"
        drilldownReports={{
          controlId: selectedControlId,
          scopeBusinessUnitId: scopeBusinessUnit[0]?.value || scopeBusinessUnit,
          Object_id: objectId,
          framework: FrameworkType,
        }}
      />
    </>
  );

  return (
    <>
      <Container className="justify-content-center">
        <div>
          <div>
            <Section title={t("Details")}>
              <Row>
                <div className="col-md-4">
                  <Row>
                    <FormControl
                      control={control}
                      name="businessUnit"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={4}
                    />
                  </Row>
                  <Row>
                    <FormControl
                      control={control}
                      name="assessor"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={4}
                    />
                  </Row>
                  <Row>
                    <FormControl
                      control={control}
                      name="approver"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={4}
                    />
                  </Row>
                  <Row>
                    <FormControl
                      control={control}
                      name="dueDate"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      futureDate={true}
                      labelSize={4}
                    />
                  </Row>
                </div>
                <div className="col-md-6">
                  <Row>
                    <FormControl
                      control={control}
                      name="assessableEntity"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={3}
                    />
                  </Row>
                  <Row>
                    <FormControl
                      control={control}
                      name="requirementId"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={3}
                    />
                  </Row>
                </div>
              </Row>
            </Section>
          </div>

          <Section title={t("Assessment")}>
            {REQFields.map((item, i) => {
              let REQRecord = `REQ.${i}`;
              let requirementId = getValues(`${REQRecord}.reqId`);
              let inherited = getValues(`${REQRecord}.inherited`);

              const inherentRating = formValues.REQ.map(
                (value) => value.inherentRating
              ).filter((inherentRating) => inherentRating !== null);

              const InherentValues = () => {
                if (inherentRating.length === 0) {
                  return false;
                } else {
                  return true;
                }
              };
              let inherentValues = InherentValues();
              if (formMethods.getValues("currentStage") === "PERFORM") {
                inherentValues = false;
              }
              let action = formMethods.getValues("action");

              if (factorType === false) {
                formMetaData.fields.inhImpact.editable = true;
                formMetaData.fields.inhImpact.required = true;
                formMetaData.fields.inhLikelihood.required = true;
              } else {
                formMetaData.fields.inhImpact.editable = false;
                formMetaData.fields.inhLikelihood.required = true;
                formMetaData.fields.inhFinancial.required = true;
                formMetaData.fields.inhReputational.required = true;
                formMetaData.fields.inhStakeholder.required = true;
                formMetaData.fields.inhLegal.required = true;
                formMetaData.fields.inhStakeholder.required = true;
              }
              if (action === 2) {
                formMetaData.fields.residualRating.required = false;
                formMetaData.fields.inhImpact.required = false;
                formMetaData.fields.inhLikelihood.required = false;
                formMetaData.fields.inhFinancial.required = false;
                formMetaData.fields.inhReputational.required = false;
                formMetaData.fields.inhStakeholder.required = false;
                formMetaData.fields.inhLegal.required = false;
                formMetaData.fields.overrideTestResult.required = false;
              }
              const regulatoryCompliance = [
                { label: t("Business Unit"), type: "Business Unit" },
                { label: t("Area Of Compliance"), type: "area_of_compliance" },
                { label: t("Control"), type: "Controls" },
              ];

              return (
                <HybridSection
                  title={controlData && controlData[requirementId]?.name}
                  expand={false}
                  headerClass="bg-primary bg-gradient bg-opacity-55"
                  field1={
                    <FormControl
                      control={control}
                      name={`${REQRecord}.inherentRating`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      disabled
                    />
                  }
                  field2={
                    !onlyInherent ? (
                      <FormControl
                        control={control}
                        name={`${REQRecord}.controlEffectiveness`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        disabled
                      />
                    ) : null
                  }
                  field3={
                    !onlyInherent ? (
                      <FormControl
                        control={control}
                        name={`${REQRecord}.residualRating`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        disabled
                      />
                    ) : null
                  }
                  editablefield={
                    (formMethods.getValues("currentStage") == "APPROVAL" ||
                      formMethods.getValues("currentStage") == "CLOSE") &&
                    !onlyInherent ? (
                      <FormControl
                        control={control}
                        name={`${REQRecord}.overrideResidualRating`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    ) : null
                  }
                >
                  {alert !== null && (
                    <Confirmation
                      show={showModal}
                      content={`Do you want to override the 'Override Risk Rating'`}
                      onHide={handleAlertClose}
                      onNoClick={() => {
                        multiregionCondition(item, i);
                      }}
                    />
                  )}
                  <div className="pt-1">
                    <Row>
                      <h6>{t("Description")}</h6>
                    </Row>
                    <Row>
                      <h9>
                        {controlData && controlData[requirementId]?.description}
                      </h9>
                    </Row>
                    <Row className="mt-3">
                      <div className="col-md-4">
                        <Col>
                          <h6>{t("Type Of Compliance")}</h6>
                          {controlData &&
                            controlData[requirementId]?.d_type_of_complnc && (
                              <ul style={{ listStyleType: "disc" }}>
                                <li>
                                  {controlData &&
                                    controlData[requirementId]
                                      ?.d_type_of_complnc}
                                </li>
                              </ul>
                            )}
                        </Col>
                      </div>
                      <div className="col-md-4">
                        <Col>
                          <h6>{t("Categories")}</h6>
                          {controlData &&
                            controlData[requirementId]?.d_categorization && (
                              <ul style={{ listStyleType: "disc" }}>
                                <li>
                                  {controlData &&
                                    controlData[requirementId]
                                      ?.d_categorization}
                                </li>
                              </ul>
                            )}
                        </Col>
                      </div>
                      <div className="col-md-4">
                        <Col>
                          <h6>{t("Impact and Penalties")}</h6>
                          {controlData &&
                            controlData[requirementId]?.d_impct_and_penalt && (
                              <ul style={{ listStyleType: "disc" }}>
                                <li>
                                  {controlData &&
                                    controlData[requirementId]
                                      ?.d_impct_and_penalt}
                                </li>
                              </ul>
                            )}
                        </Col>
                      </div>
                    </Row>

                    <Row>
                      <Row className="mt-3">
                        <span className="h5">{t("Relationships")}</span>
                        {regulatoryCompliance.map(({ label, type }) => (
                          <Col key={type} md={4}>
                            <strong>{label}</strong>
                            {controlData[requirementId]?.relationships
                              ?.filter(
                                (relation) => relation.object_type === type
                              )
                              .filter(
                                (relationShip) => relationShip?.object_name
                              )
                              .map((relationShip, index) => (
                                <ul
                                  key={index}
                                  style={{ margin: "2px", padding: "2px" }}
                                >
                                  <li className="ms-3">
                                    {relationShip?.object_name}
                                  </li>
                                </ul>
                              ))}
                          </Col>
                        ))}
                      </Row>
                      <hr></hr>
                    </Row>

                    <Row className=" mt-3">
                      <div className="col-md-4">
                        <Col>
                          <FormControl
                            control={control}
                            name={`${REQRecord}.inherentRating`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            disabled={"true"}
                          />
                        </Col>
                      </div>
                      {!onlyInherent && (
                        <>
                          <div className="col-md-4">
                            <Col>
                              <FormControl
                                control={control}
                                name={`${REQRecord}.controlEffectiveness`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                                disabled={true}
                              />
                            </Col>
                          </div>
                          <div className="col-md-4">
                            <Col>
                              <FormControl
                                control={control}
                                name={`${REQRecord}.residualRating`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                                disabled={true}
                              />
                            </Col>
                          </div>
                        </>
                      )}

                      {!onlyInherent && <Col></Col>}
                    </Row>
                    {preRating && (
                      <Row className=" mt-3">
                        <div className="col-md-3">
                          <Col>
                            <FormControl
                              control={control}
                              name={`${REQRecord}.preInherentRating`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              disabled={"true"}
                            />
                          </Col>
                        </div>
                        {!onlyInherent && (
                          <>
                            <div className="col-md-3">
                              <Col>
                                <FormControl
                                  control={control}
                                  name={`${REQRecord}.preControlEffectiveness`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                />
                              </Col>
                            </div>
                            <div className="col-md-3">
                              <Col>
                                <FormControl
                                  control={control}
                                  name={`${REQRecord}.preResidualRating`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                />
                              </Col>
                            </div>
                          </>
                        )}

                        {!onlyInherent && <Col></Col>}
                      </Row>
                    )}

                    <Row className="pt-3">
                      {" "}
                      <Collapse
                        title="Inherent Risk Rating"
                        className="bg-nblue bg-gradient text-white"
                        headerfont="text-white"
                        secondaryTitle={
                          <FormControl
                            control={control}
                            name={`${REQRecord}.inherentRating`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            disabled
                            singleRow
                            hideTitle
                            textColor={"white"}
                          />
                        }
                      >
                        {factorType && (
                          <>
                            <Row className="pt-2">
                              <div className="col-md-2">
                                <FormControl
                                  control={control}
                                  name={`${REQRecord}.inhImpact`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                />
                              </div>
                              <div className="col-md-1 d-flex align-items-center justify-content-center">
                                <span className="fs-1 fw-bold">=</span>
                              </div>

                              <div className=" col-md-9 border border-secondary-subtle rounded">
                                <Row>
                                  <div className="col-md-3">
                                    <FormControl
                                      control={control}
                                      name={`${REQRecord}.inhFinancial`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                      disabled={
                                        (!onlyInherent && inherited) ||
                                        !(
                                          formMethods.getValues(
                                            "currentStage"
                                          ) == "PERFORM" ||
                                          formMethods.getValues(
                                            "currentStage"
                                          ) == "SUBMIT_CLARIFICATION"
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="col-md-3">
                                    <FormControl
                                      control={control}
                                      name={`${REQRecord}.inhReputational`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                      disabled={
                                        (!onlyInherent && inherited) ||
                                        !(
                                          formMethods.getValues(
                                            "currentStage"
                                          ) == "PERFORM" ||
                                          formMethods.getValues(
                                            "currentStage"
                                          ) == "SUBMIT_CLARIFICATION"
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="col-md-3">
                                    <FormControl
                                      control={control}
                                      name={`${REQRecord}.inhStakeholder`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                      disabled={
                                        (!onlyInherent && inherited) ||
                                        !(
                                          formMethods.getValues(
                                            "currentStage"
                                          ) == "PERFORM" ||
                                          formMethods.getValues(
                                            "currentStage"
                                          ) == "SUBMIT_CLARIFICATION"
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="col-md-3">
                                    <FormControl
                                      control={control}
                                      name={`${REQRecord}.inhLegal`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                      disabled={
                                        (!onlyInherent && inherited) ||
                                        !(
                                          formMethods.getValues(
                                            "currentStage"
                                          ) == "PERFORM" ||
                                          formMethods.getValues(
                                            "currentStage"
                                          ) == "SUBMIT_CLARIFICATION"
                                        )
                                      }
                                    />
                                  </div>
                                </Row>
                              </div>
                            </Row>
                            <Row>
                              <div className=" col-md-6">
                                <FormControl
                                  control={control}
                                  name={`${REQRecord}.inhLikelihood`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  disabled={
                                    (!onlyInherent && inherited) ||
                                    !(
                                      formMethods.getValues("currentStage") ==
                                        "PERFORM" ||
                                      formMethods.getValues("currentStage") ==
                                        "SUBMIT_CLARIFICATION"
                                    )
                                  }
                                />
                              </div>
                              <div className=" col-md-6">
                                <FormControl
                                  control={control}
                                  name={`${REQRecord}.inhVelocity`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  disabled={
                                    (!onlyInherent && inherited) ||
                                    !(
                                      formMethods.getValues("currentStage") ==
                                        "PERFORM" ||
                                      formMethods.getValues("currentStage") ==
                                        "SUBMIT_CLARIFICATION"
                                    )
                                  }
                                />
                              </div>
                            </Row>
                          </>
                        )}
                        {!factorType && (
                          <>
                            <Row className="pt-2">
                              <div className="col-md-6">
                                <FormControl
                                  control={control}
                                  name={`${REQRecord}.inhImpact`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  disabled={
                                    formMethods.getValues("currentStage") !=
                                    "PERFORM"
                                  }
                                />
                              </div>

                              <div className=" col-md-6">
                                <FormControl
                                  control={control}
                                  name={`${REQRecord}.inhLikelihood`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                />
                              </div>
                            </Row>
                          </>
                        )}
                      </Collapse>
                    </Row>
                    {!onlyInherent && (
                      <Row>
                        {" "}
                        <Collapse
                          title="Control Effectiveness"
                          className="bg-nblue bg-gradient text-white"
                          secondaryTitle={
                            <FormControl
                              control={control}
                              name={`${REQRecord}.controlEffectiveness`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              disabled
                              singleRow
                              hideTitle
                              textColor={"white"}
                            />
                          }
                          watchFor={[`${REQRecord}.controlEffectiveness`]}
                        >
                          {CTLFields.map((citem, ci) => {
                            let CTLRecord = `CTL.${ci}`;
                            if (
                              getValues(
                                `${CTLRecord}.parentRequirementId.value`
                              ) == requirementId
                            ) {
                              let action = formMethods.getValues("action");

                              if (action == 2) {
                                formMetaData.fields.overrideTestResult.required = false;
                              }

                              return (
                                <>
                                  <Card.Body>
                                    <Col>
                                      <ModalButton
                                        buttonText={t(
                                          "Previous Control Results"
                                        )}
                                        controlId={getValues(
                                          `${CTLRecord}.ctlId`
                                        )}
                                        content={previousControlResultsContent}
                                      />
                                    </Col>

                                    <Modal
                                      className="modal-xl setting"
                                      backdrop="static"
                                      show={show}
                                    >
                                      <Modal.Header>
                                        {" "}
                                        <Button
                                          size="lg"
                                          className=" ms-8close-btn"
                                          variant="secondary"
                                          onClick={() => handleCloseModal()}
                                          style={{ marginLeft: "1000px" }}
                                        >
                                          Close
                                        </Button>
                                      </Modal.Header>
                                      <Modal.Body>
                                        <>
                                          <ReportRuntime
                                            report="CT_CONTROL_RESULTS"
                                            drilldownReports={{
                                              controlId: selectedControlId,
                                            }}
                                          />
                                        </>
                                      </Modal.Body>
                                      <Modal.Footer></Modal.Footer>
                                    </Modal>
                                    <Row>
                                      <div className="col-md-6">
                                        <FormControl
                                          control={control}
                                          name={`${CTLRecord}.controlName`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                          disabled
                                          hideTitle
                                          singleRow
                                        />
                                      </div>
                                      <div className="col-md-3">
                                        <FormControl
                                          control={control}
                                          name={`${CTLRecord}.testResult`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                          disabled={true}
                                        />
                                      </div>
                                      <div className="col-md-3">
                                        <FormControl
                                          control={control}
                                          name={`${CTLRecord}.overrideTestResult`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                          required={
                                            (formMethods.getValues(
                                              `${CTLRecord}.testResult`
                                            )
                                              ? false
                                              : true) && action != 2
                                          }
                                          disabled={
                                            formMethods.getValues(
                                              "currentStage"
                                            ) != "PERFORM" &&
                                            formMethods.getValues(
                                              "currentStage"
                                            ) != "SUBMIT_CLARIFICATION"
                                          }
                                        />
                                      </div>
                                    </Row>
                                    <hr></hr>
                                  </Card.Body>
                                </>
                              );
                            }
                          })}
                        </Collapse>
                      </Row>
                    )}
                    {!onlyInherent && (
                      <Row>
                        {" "}
                        <Collapse
                          title="Residual Risk Rating"
                          className="bg-nblue bg-gradient text-white"
                          secondaryTitle={
                            <FormControl
                              control={control}
                              name={`${REQRecord}.residualRating`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              disabled
                              singleRow
                              hideTitle
                              textColor={"white"}
                            />
                          }
                        >
                          <Row className="pt-2">
                            <div className=" col-md-4">
                              <FormControl
                                control={control}
                                name={`${REQRecord}.inherentRating`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                                disabled={true}
                              />
                            </div>
                            <div className=" col-md-4">
                              <FormControl
                                control={control}
                                name={`${REQRecord}.controlEffectiveness`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                                disabled={true}
                              />
                            </div>
                            <div className=" col-md-4">
                              <FormControl
                                control={control}
                                name={`${REQRecord}.residualRating`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                                required={true}
                                disabled={true}
                              />
                            </div>
                          </Row>
                        </Collapse>
                      </Row>
                    )}

                    {formMethods.getValues("assessmentType") == "2" && (
                      <Section title={t("Findings")}>
                        {runtimeParams.formmeta.accessCode == 1 &&
                        formMethods.getValues("assessmentType") == 2 &&
                        (formMethods.getValues("currentStage") == "PERFORM" ||
                          formMethods.getValues("currentStage") ==
                            "SUBMIT_CLARIFICATION") ? (
                          <div>
                            <ButtonToolbar
                              className="justify-content-center mb-1"
                              aria-label="Toolbar with Action Management"
                            >
                              <ButtonGroup
                                aria-label="First group"
                                className="flex-grow-1"
                              >
                                <ModalForm
                                  objectId={-1}
                                  fornname="issueobservation"
                                  component={
                                    <FormRunTime
                                      formService="issueobservation"
                                      objectId={-1}
                                      modal
                                      program="3"
                                      source_form_name="RA_RISK_ASSESSEMENT_REG_COMP"
                                      ParentFormObjectId={formMethods.getValues(
                                        "objectId"
                                      )}
                                      type="1"
                                      callbackParent={form.callbackFromChild}
                                      fndApprover={formMethods.getValues(
                                        "approver"
                                      )}
                                      fndBusinessUnit={formMethods.getValues(
                                        "businessUnit"
                                      )}
                                      relatedId={requirementId}
                                      relatedObject="Regulatory Compliance"
                                    />
                                  }
                                  buttonText={
                                    <>
                                      <FontAwesomeIcon
                                        icon={faPlusCircle}
                                        size="lg"
                                      />{" "}
                                      {t("Add Findings")}
                                    </>
                                  }
                                  size="xl"
                                />
                              </ButtonGroup>
                            </ButtonToolbar>
                          </div>
                        ) : null}
                        <ReportRuntime
                          refreshdataref={refreshdataref}
                          formcallbackParent={form.callbackFromChild}
                          report="IR_RISK_COMP_FINDING"
                          drilldownReports={{
                            objectId: formMethods.getValues("objectId"),
                            riskId: requirementId,
                          }}
                          handleReportClosebtn
                        />
                      </Section>
                    )}
                  </div>
                </HybridSection>
              );
            })}
          </Section>
        </div>
        {formMethods.getValues("assessmentType") == "2" && (
          <Section title={t("Prior Issues")}>
            <Row>
              {priorIssuesReport ? (
                <>
                  <PriorIssues
                    processId={formMethods.getValues("assessableEntity")}
                  />
                </>
              ) : (
                <ReportRuntime
                  report="IR_RA_ISSUE_DETAILS"
                  drilldownReports={{
                    processId: formMethods.getValues("assessableEntity"),
                    createdOn: formMethods.getValues("createdOn"),
                  }}
                />
              )}
            </Row>
          </Section>
        )}

        <Section title="Additional Details">
          <div>
            <FormControl
              control={control}
              name="attachFiles"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Section>

        <AuditTrail
          formMetaData={formMetaData}
          formMethods={formMethods}
          formId={formMetaData.formmeta.form_id}
          objectId={formValues.objectId}
          enableAddComment={formValues.status == "Closed" ? false : true}
        />
      </Container>
    </>
  );
};

export default FormLayout;
