import {
  Button,
  Card,
  Container,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import JSHook from "./PA_RA_RISK_ASSESSMENT_JS";
import React, { useState, useEffect } from "react";
import HybridSection from "src/components/forms/reactformutils/fields/HybridSection";
import Section from "src/components/forms/reactformutils/fields/Section";
import { useFieldArray } from "react-hook-form";
import { getServiceData } from "../RiskServices";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";
import Confirmation from "src/components/forms/reactformutils/elements/Confirmation";
import ReportRuntime from "src/components/reports/Report";
import Alert from "src/components/forms/reactformutils/elements/Alert";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { ModalButton } from "src/components/forms/reactformutils/elements/Confirmation";
import PriorIssues from "../pages/PriorIssues";
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

  //delete functioanlity of useField array
  const [deletedSectionKey, setDeletedSectionKey] = useState(0);

  const BusinessUnit = formValues.businessUnit;
  formValues.source_form_name = "RA_RISK_ASSESSEMENT";
  const FrameworkType = formMethods.getValues("framework");
  const objectId = formMethods.getValues("objectId");

  //Function to get the Test Results.
  const previousControlResultsContent = (selectedControlId) => (
    <>
      <ReportRuntime
        report="CT_CONTROL_RESULTS"
        drilldownReports={{
          controlId: selectedControlId,
          scopeBusinessUnitId: BusinessUnit[0]?.value || BusinessUnit,
          Object_id: objectId,
          framework: FrameworkType,
        }}
      />
    </>
  );

  //Function to get the Loss Events:
  const lossEvents = (selectedControlId) => (
    <>
      <Row>
        <ReportRuntime
          report="RA_LOSS_EVENT"
          drilldownReports={{
            controlId: selectedControlId,
          }}
        />
      </Row>
    </>
  );
  //Function to get the Issues:
  const Issues = (selectedControlId) => (
    <Row>
      <ReportRuntime
        report="RA_ISSUES"
        drilldownReports={{
          controlId: selectedControlId,
        }}
      />
    </Row>
  );
  //Function to get the KRI :
  const kriSummary = (selectedControlId) => (
    <Row>
      <ReportRuntime
        report="GL_RISK_KRI"
        drilldownReports={{
          controlId: selectedControlId,
        }}
      />
    </Row>
  );

  //to get the Alert
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  let riskIds = formValues.RSK?.map((a) => a.riskId);
  const [isLoading, setIsLoading] = useState(true);
  const [controlData, setControlData] = useState({});

  //  Ajax Call for getting the Assessment Type Percentage Based from Setup Form
  const Configure = formMetaData.configurationFormMetaData;
  const algorithmType = Configure.assessment_type;
  const factorType = Configure.factor_type;
  const scoreField = Configure.score_fields;
  const preRating = Configure.pre_pro_rating;
  const priorIssuesReport = Configure.prior_issue_report;

  let onlyInherent = getValues("assessmentType") == "1" ? true : false;
  //Api call to get the Control Details
  useEffect(() => {
    const handleControlRelationship = () => {
      getServiceData("getRiskRelationshipData", riskIds)
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
    fields: RSKFields,
    append: RSKappend,
    remove: RSkremove,
  } = useFieldArray({
    name: "RSK",
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

  //Alert Popup
  const [alert, setAlert] = useState("");
  const [alerts, setAlerts] = useState("");
  const [alertss, setAlertss] = useState("");
  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formValues,
    formMetaData,
    runtimeParams,
    control,
    setAlert,
    setAlerts,
    setAlertss,
    setShowModal,
    setShowAlert,
    setShowAlerts
  );

  if (isLoading) {
    return;
  }

  const handleAlertClose = () => {
    setShowModal(false);
  };
  const handleAlertClosed = () => {
    setShowAlert(false);
  };
  const handleAlertCloses = () => {
    setShowAlerts(false);
  };

  function multiregionCondition(item, i) {
    formMethods.setValue("RSK." + i + ".overrideResidualRating", "");
  }

  return (
    <Container
      className="justify-content-center"
      style={{
        filter: showAlert || showAlerts || showModal ? "blur(2px)" : "none",
        transition: "filter 0.3s ease",
      }}
    >
      <div>
        <div>
          <Section title="Details">
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
                    labelSize={4}
                  />
                </Row>
              </div>
              <div className="col-md-8">
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
                    name="parentRiskId"
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
      </div>
      <Section title="Assessment">
        {RSKFields.map((item, i) => {
          let RSKRecord = `RSK.${i}`;
          let riskId = getValues(`${RSKRecord}.riskId`);
          let inherited = getValues(`${RSKRecord}.inherited`);
          const processCompliance = [
            { label: t("Business Unit"), type: "Business Unit" },
            { label: t("Process"), type: "Process" },
            { label: t("Control"), type: "Control" },
          ];

          const inherentRating = formValues.RSK.map(
            (value) => value.inhImpact
          ).filter((inhImpact) => inhImpact !== null);

          const InherentValues = () => {};

          let inherentValues = InherentValues();

          let action = formMethods.getValues("action");

          if (action == 2) {
            formMetaData.fields.riskResponse.required = false;
            // Inherent Factors Non mandatory during update
            formMetaData.fields.inhFinancial.required = false;
            formMetaData.fields.inhReputational.required = false;
            formMetaData.fields.inhStakeholder.required = false;
            formMetaData.fields.inhLegal.required = false;
            formMetaData.fields.inhLikelihood.required = false;
            formMetaData.fields.inhImpact.required = false;

            // Residual Factors Non mandatory during update
            formMetaData.fields.resImpactPercentage.required = false;
            formMetaData.fields.resLikelihoodPercentage.required = false;
            formMetaData.fields.resFinancial.required = false;
            formMetaData.fields.resReputational.required = false;
            formMetaData.fields.resStakeholder.required = false;
            formMetaData.fields.resLegal.required = false;
            formMetaData.fields.resLikelihood.required = false;
          }
          if (factorType === false) {
            formMetaData.fields.inhImpact.editable = true;
          } else {
            formMetaData.fields.inhImpact.editable = false;
          }
          if (formMetaData.formmeta.accessCode == 9) {
            formMetaData.fields.inhFinancial.editable = false;
            formMetaData.fields.inhReputational.editable = false;
            formMetaData.fields.inhStakeholder.editable = false;
            formMetaData.fields.inhLegal.editable = false;
            formMetaData.fields.inhLikelihood.editable = false;
            formMetaData.fields.inhImpact.editable = false;
          }

          return (
            <HybridSection
              title={controlData && controlData[riskId]?.name}
              expand={false}
              headerClass="bg-primary bg-gradient bg-opacity-55"
              secondaryTitle={
                <FormControl
                  control={control}
                  name={`${RSKRecord}.riskResponse`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  disabled
                  singleRow
                  hideTitle
                  textColor={"white"}
                />
              }
              field1={
                formMethods.getValues("currentStage") == "APPROVAL" ||
                formMethods.getValues("currentStage") == "CLOSE" ? (
                  <FormControl
                    control={control}
                    name={`${RSKRecord}.inherentRating`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    disabled
                  />
                ) : null
              }
              field2={
                (formMethods.getValues("currentStage") == "APPROVAL" ||
                  formMethods.getValues("currentStage") == "CLOSE") &&
                !onlyInherent ? (
                  <FormControl
                    control={control}
                    name={`${RSKRecord}.controlEffectivenessRating`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    disabled
                  />
                ) : null
              }
              field3={
                (formMethods.getValues("currentStage") == "APPROVAL" ||
                  formMethods.getValues("currentStage") == "CLOSE") &&
                !onlyInherent ? (
                  <FormControl
                    control={control}
                    name={`${RSKRecord}.residualRating`}
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
                    name={`${RSKRecord}.overrideResidualRating`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                ) : null
              }
            >
              <div className="pt-1">
                <Row>
                  <h6>{t("Description")}</h6>
                </Row>
                <Row>
                  <h9>{controlData && controlData[riskId]?.description}</h9>
                </Row>
                <Row className="mt-3">
                  <div className="col-md-4">
                    <Col>
                      <h6>{t("Type")}</h6>
                      {controlData && controlData[riskId]?.d_type && (
                        <ul style={{ listStyleType: "disc" }}>
                          <li>{controlData && controlData[riskId]?.d_type}</li>
                        </ul>
                      )}
                    </Col>
                  </div>
                  <div className="col-md-4">
                    <Col>
                      <h6>{t("Categories")}</h6>
                      {controlData && controlData[riskId]?.d_categories && (
                        <ul style={{ listStyleType: "disc" }}>
                          <li>
                            {controlData && controlData[riskId]?.d_categories}
                          </li>
                        </ul>
                      )}
                    </Col>
                  </div>
                </Row>

                {
                  <Row>
                    <Row>
                      <span className="h5">{t("Relationships")}</span>
                      {processCompliance.map(({ label, type }) => (
                        <Col key={type} md={4}>
                          <strong>{label}</strong>
                          {controlData[riskId]?.relationships
                            ?.filter(
                              (relation) => relation.object_type === type
                            )
                            .filter((relationShip) => relationShip?.object_name)
                            .map((relationShip, index) => (
                              <ul
                                key={index}
                                style={{ margin: "2px", padding: "2px" }}
                              >
                                <li className="ms-3">
                                  {relationShip.object_name}
                                </li>
                              </ul>
                            ))}
                        </Col>
                      ))}
                    </Row>

                    <hr></hr>
                    {alert !== null && (
                      <Confirmation
                        show={showModal}
                        content={t(
                          `Do you want to override the 'Residual Risk Rating'`
                        )}
                        onHide={handleAlertClose}
                        onNoClick={() => {
                          multiregionCondition(item, i);
                        }}
                      />
                    )}
                    {alerts === true && (
                      <Alert
                        show={showAlert}
                        content={t(
                          `Residual Factor Rating cannot be greater than Inherent Factor Rating`
                        )}
                        onHide={handleAlertClosed}
                        button={t("OK")}
                      />
                    )}
                    {alertss === true && (
                      <Alert
                        show={showAlerts}
                        content={t(
                          `Inherent Factor Rating cannot be lesser than Residual Factor Rating`
                        )}
                        onHide={handleAlertCloses}
                        button={t("OK")}
                      />
                    )}

                    <span className="h5">{t("Dependencies")}</span>
                    <div className="col-md-4">
                      <Col>
                        <ModalButton
                          buttonText={t("KRI Summary")}
                          modalType="KRI Summary"
                          controlId={getValues(`${RSKRecord}.riskId`)}
                          content={kriSummary}
                        />
                      </Col>
                    </div>
                    <div className="col-md-4">
                      <Col>
                        <ModalButton
                          buttonText={t("Loss Events")}
                          modalType="Loss Events"
                          controlId={getValues(`${RSKRecord}.riskId`)}
                          content={lossEvents}
                        />
                      </Col>
                    </div>
                    <div className="col-md-4">
                      <Col>
                        <ModalButton
                          buttonText={t("Issues")}
                          modalType="Issues"
                          controlId={getValues(`${RSKRecord}.riskId`)}
                          content={Issues}
                        />
                      </Col>
                    </div>
                  </Row>
                }
                <Row>
                  <div className="col-md-12">
                    <hr></hr>
                  </div>
                </Row>

                <Row className=" mt-3">
                  <div className="col-md-3">
                    <Col>
                      <FormControl
                        control={control}
                        name={`${RSKRecord}.inherentRating`}
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
                            name={`${RSKRecord}.controlEffectivenessRating`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                          />
                        </Col>
                      </div>
                      <div className="col-md-3">
                        <Col>
                          <FormControl
                            control={control}
                            name={`${RSKRecord}.residualRating`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                          />
                        </Col>
                      </div>
                    </>
                  )}
                  <div className="col-md-3">
                    <Col>
                      <FormControl
                        control={control}
                        name={`${RSKRecord}.riskResponse`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </Col>
                  </div>
                  {!onlyInherent && <Col></Col>}
                </Row>
                {preRating && (
                  <Row className=" mt-3">
                    <div className="col-md-3">
                      <Col>
                        <FormControl
                          control={control}
                          name={`${RSKRecord}.preInherentRating`}
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
                              name={`${RSKRecord}.preControlEffectiveness`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                            />
                          </Col>
                        </div>
                        <div className="col-md-3">
                          <Col>
                            <FormControl
                              control={control}
                              name={`${RSKRecord}.preResidualRating`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                            />
                          </Col>
                        </div>
                      </>
                    )}
                    <div className="col-md-3">
                      <Col>
                        <FormControl
                          control={control}
                          name={`${RSKRecord}.preRiskResponse`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                        />
                      </Col>
                    </div>

                    {!onlyInherent && <Col></Col>}
                  </Row>
                )}

                {scoreField === true && (
                  <div className="mt-2 ms-1">
                    <Row>
                      <div className="col-md-3">
                        <Col>
                          <FormControl
                            control={control}
                            name={`${RSKRecord}.overallInhScore`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                          />
                        </Col>
                      </div>
                      {!onlyInherent && (
                        <>
                          <div className="col-md-3">
                            <Col>
                              <FormControl
                                control={control}
                                name={`${RSKRecord}.overllControlScore`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                              />
                            </Col>
                          </div>
                          <div className="col-md-3">
                            <Col>
                              <FormControl
                                control={control}
                                name={`${RSKRecord}.overallResScore`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                              />
                            </Col>
                          </div>
                        </>
                      )}
                    </Row>
                  </div>
                )}

                <Row className="pt-3">
                  <Collapse
                    key={`${RSKRecord}-${deletedSectionKey}`}
                    title={"Inherent Risk Rating"}
                    secondaryTitle={
                      <FormControl
                        control={control}
                        name={`${RSKRecord}.inherentRating`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        disabled
                        singleRow
                        hideTitle
                        textColor={"white"}
                      />
                    }
                    className={"bg-nblue bg-gradient text-white"}
                    control={control}
                    watchFor={[`${RSKRecord}.inherentRating`]}
                    state={
                      getValues(`${RSKRecord}.inherentRating`) ? false : true
                    }
                  >
                    {factorType && (
                      <>
                        <Row className="pt-2">
                          <div className="col-md-2 fw-10">
                            <FormControl
                              control={control}
                              name={`${RSKRecord}.inhImpact`}
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
                                  name={`${RSKRecord}.inhFinancial`}
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
                              <div className="col-md-3">
                                <FormControl
                                  control={control}
                                  name={`${RSKRecord}.inhReputational`}
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
                              <div className="col-md-3">
                                <FormControl
                                  control={control}
                                  name={`${RSKRecord}.inhStakeholder`}
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
                              <div className="col-md-3">
                                <FormControl
                                  control={control}
                                  name={`${RSKRecord}.inhLegal`}
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

                            <Row>
                              <div className="col-md-3">
                                <FormControl
                                  control={control}
                                  name={`${RSKRecord}.inhAddFactor1`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  disabled={inherentValues}
                                />
                              </div>
                              <div className="col-md-3">
                                <FormControl
                                  control={control}
                                  name={`${RSKRecord}.inhAddFactor2`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  disabled={inherentValues}
                                />
                              </div>
                              <div className="col-md-3">
                                <FormControl
                                  control={control}
                                  name={`${RSKRecord}.inhAddFactor3`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  disabled={inherentValues}
                                />
                              </div>
                              <div className="col-md-3">
                                <FormControl
                                  control={control}
                                  name={`${RSKRecord}.inhAddFactor4`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  disabled={inherentValues}
                                />
                              </div>
                            </Row>
                          </div>
                        </Row>
                      </>
                    )}
                    {!factorType && (
                      <>
                        <Row className="pt-2">
                          <div className="col-md-6 fw-10">
                            <FormControl
                              control={control}
                              name={`${RSKRecord}.inhImpact`}
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

                    <Row className="pt-2">
                      <div className=" col-md-6">
                        <FormControl
                          control={control}
                          name={`${RSKRecord}.inhLikelihood`}
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
                          name={`${RSKRecord}.inhVelocity`}
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
                  </Collapse>
                </Row>
                {!onlyInherent && (
                  <Row>
                    {" "}
                    <Collapse
                      key={`${RSKRecord}-${deletedSectionKey}`}
                      title={"Control Effectiveness"}
                      secondaryTitle={
                        <FormControl
                          control={control}
                          name={`${RSKRecord}.controlEffectivenessRating`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          disabled
                          singleRow
                          hideTitle
                          textColor={"white"}
                        />
                      }
                      className={"bg-nblue bg-gradient text-white"}
                      control={control}
                      watchFor={[`${RSKRecord}.controlEffectivenessRating`]}
                      state={
                        getValues(`${RSKRecord}.controlEffectivenessRating`)
                          ? false
                          : true
                      }
                    >
                      {algorithmType && (
                        <>
                          <Row className="pt-2">
                            <Col className="col-md-6">
                              <div>
                                <FormControl
                                  control={control}
                                  name={`${RSKRecord}.resImpactPercentage`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  singleRow
                                  disabled={
                                    formMethods.getValues("currentStage") ==
                                      "PERFORM" ||
                                    formMethods.getValues("currentStage") ==
                                      "SUBMIT_CLARIFICATION"
                                      ? false
                                      : true
                                  }
                                />
                              </div>
                              <div>
                                <FormControl
                                  control={control}
                                  name={`${RSKRecord}.resLikelihoodPercentage`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  singleRow
                                  disabled={
                                    formMethods.getValues("currentStage") ==
                                      "PERFORM" ||
                                    formMethods.getValues("currentStage") ==
                                      "SUBMIT_CLARIFICATION"
                                      ? false
                                      : true
                                  }
                                />
                              </div>
                            </Col>
                            <Col>
                              <div className=" align-items-center justify-content-center">
                                <FormControl
                                  control={control}
                                  name={`${RSKRecord}.controlEffectivenessRating`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  disabled={"true"}
                                  singleRow
                                />
                              </div>
                            </Col>
                          </Row>
                          <hr></hr>
                        </>
                      )}

                      {CTLFields.map((citem, ci) => {
                        let CTLRecord = `CTL.${ci}`;
                        if (
                          getValues(`${CTLRecord}.ctlParentRiskId`) == riskId
                        ) {
                          let action = formMethods.getValues("action");

                          if (action == 2) {
                            formMetaData.fields.ctlEffectiveness.required = false;
                          }

                          return (
                            <>
                              <Card.Body>
                                <div style={{ marginLeft: "400px" }}>
                                  <ModalButton
                                    buttonText={t(
                                      "Recent Control Test Results"
                                    )}
                                    modalType="Recent Control Test Results"
                                    controlId={getValues(
                                      `${CTLRecord}.controlId`
                                    )}
                                    content={previousControlResultsContent}
                                  />
                                </div>

                                <Row>
                                  <div className="col-md-9">
                                    <FormControl
                                      control={control}
                                      name={`${CTLRecord}.ctlTitle`}
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
                                      name={`${CTLRecord}.ctlEffectiveness`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                    />
                                  </div>
                                </Row>
                                <Row>
                                  <div className="col-md-6">
                                    <FormControl
                                      control={control}
                                      name={`${CTLRecord}.ctlDescription`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <FormControl
                                      control={control}
                                      name={`${CTLRecord}.ctlComments`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
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
                      key={`${RSKRecord}-${deletedSectionKey}`}
                      title={"Residual Risk Rating"}
                      secondaryTitle={
                        <FormControl
                          control={control}
                          name={`${RSKRecord}.residualRating`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          disabled
                          singleRow
                          hideTitle
                          textColor={"white"}
                        />
                      }
                      className={"bg-nblue bg-gradient text-white"}
                      control={control}
                      watchFor={[`${RSKRecord}.residualRating`]}
                      state={
                        getValues(`${RSKRecord}.residualRating`) ? false : true
                      }
                    >
                      {!algorithmType && (
                        <>
                          {factorType && (
                            <>
                              <Row className="pt-2">
                                <div className="col-md-2">
                                  <FormControl
                                    control={control}
                                    name={`${RSKRecord}.resImpact`}
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
                                        name={`${RSKRecord}.resFinancial`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                      />
                                    </div>
                                    <div className="col-md-3">
                                      <FormControl
                                        control={control}
                                        name={`${RSKRecord}.resReputational`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                      />
                                    </div>

                                    <div className="col-md-3">
                                      <FormControl
                                        control={control}
                                        name={`${RSKRecord}.resStakeholder`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                      />
                                    </div>
                                    <div className="col-md-3">
                                      <FormControl
                                        control={control}
                                        name={`${RSKRecord}.resLegal`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                      />
                                    </div>
                                  </Row>
                                  <Row>
                                    <Row>
                                      <div className="col-md-3">
                                        <FormControl
                                          control={control}
                                          name={`${RSKRecord}.resAddFactor1`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                        />
                                      </div>
                                      <div className="col-md-3">
                                        <FormControl
                                          control={control}
                                          name={`${RSKRecord}.resAddFactor2`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                        />
                                      </div>
                                      <div className="col-md-3">
                                        <FormControl
                                          control={control}
                                          name={`${RSKRecord}.resAddFactor3`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                        />
                                      </div>
                                      <div className="col-md-3">
                                        <FormControl
                                          control={control}
                                          name={`${RSKRecord}.resAddFactor4`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                        />
                                      </div>
                                    </Row>
                                  </Row>
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
                                    name={`${RSKRecord}.resImpact`}
                                    formMetaData={formMetaData}
                                    formMethods={formMethods}
                                    disabled={false}
                                    required={true}
                                  />
                                </div>
                              </Row>
                            </>
                          )}
                          <Row className="pt-2">
                            <div className=" col-md-6">
                              <FormControl
                                control={control}
                                name={`${RSKRecord}.resLikelihood`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                              />
                            </div>
                            <div className=" col-md-6">
                              <FormControl
                                control={control}
                                name={`${RSKRecord}.resVelocity`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                              />
                            </div>
                          </Row>
                        </>
                      )}

                      {algorithmType && (
                        <>
                          <Row className="pb-3 pt-2">
                            <div className=" pt-2 border border-secondary-subtle rounded">
                              <Row>
                                <div className="col-md-4">
                                  <FormControl
                                    control={control}
                                    name={`${RSKRecord}.inherentRating`}
                                    formMetaData={formMetaData}
                                    formMethods={formMethods}
                                    disabled={"true"}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <FormControl
                                    control={control}
                                    name={`${RSKRecord}.controlEffectivenessRating`}
                                    formMetaData={formMetaData}
                                    formMethods={formMethods}
                                    disabled={"true"}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <FormControl
                                    control={control}
                                    name={`${RSKRecord}.residualRating`}
                                    formMetaData={formMetaData}
                                    formMethods={formMethods}
                                    disabled={"true"}
                                  />
                                </div>
                              </Row>
                            </div>
                          </Row>

                          <Row>
                            <div className="col-md-6">
                              <FormControl
                                control={control}
                                name={`${RSKRecord}.resImpact`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                                disabled={"true"}
                                singleRow
                              />
                            </div>
                            <div className="col-md-6">
                              <FormControl
                                control={control}
                                name={`${RSKRecord}.resLikelihood`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                                disabled={"true"}
                                singleRow
                              />
                            </div>
                          </Row>
                        </>
                      )}
                    </Collapse>
                  </Row>
                )}

                {/* Findings */}
                {formMethods.getValues("assessmentType") == "2" && (
                  <Section title="Findings" className="mt-2">
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
                              formname="issueobservation"
                              component={
                                <FormRunTime
                                  formService="issueobservation"
                                  objectId={-1}
                                  modal
                                  program="3"
                                  source_form_name="RA_RISK_ASSESSEMENT"
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
                                  relatedId={riskId}
                                  relatedObject="Process Compliance"
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
                      report="IR_RISK_FINDING"
                      drilldownReports={{
                        objectId: formValues.objectId,
                        riskId: riskId,
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
      {formMethods.getValues("assessmentType") == "2" && (
        <Section title="Prior Issues">
          <div>
            <Row>
              {priorIssuesReport ? (
                <>
                  <PriorIssues
                    processId={formMethods.getValues("assessableEntity")}
                  />
                </>
              ) : (
                <ReportRuntime
                  // refreshdataref={refreshdataref}
                  report="IR_RA_ISSUE_DETAILS"
                  drilldownReports={{
                    processId: formMethods.getValues("assessableEntity"),
                    createdOn: formMethods.getValues("createdOn"),
                  }}
                />
              )}
            </Row>
          </div>
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
  );
};

export default FormLayout;
