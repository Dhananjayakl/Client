import {
  Form,
  Button,
  Container,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
} from "react-bootstrap";

import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_CT_CONTROL_TESTING_JS";
import { useState, useEffect } from "react";
import Section from "src/components/forms/reactformutils/fields/Section";
import HybridSection from "src/components/forms/reactformutils/fields/HybridSection";
import { useFieldArray } from "react-hook-form";
import { getServiceDatas, getPriorIssues } from "../ControltestingServices";
import { getviewData } from "../../grc/GrcService";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";
import ReportRuntime from "src/components/reports/Report";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "src/components/Loader";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import { ModalButton } from "src/components/forms/reactformutils/elements/Confirmation";
import PriorIssues from "src/modules/risk/pages/PriorIssues";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useSearchParams } from "react-router-dom";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,

    form,
    fields,
    formValues,
    runtimeParams,
  } = props;
  const {
    setError,
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touched, isSubmitting },
  } = formMethods;
  const refreshdataref = React.useRef(null);
  runtimeParams.refreshdataref = refreshdataref;

  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };

  const controlID = formValues.CTL?.map((a) => a.sourceControlId);

  const scopeBusinessUnit = formValues.scopeBusinessUnit;
  console.log(scopeBusinessUnit, "scopeBusinessUnitscopeBusinessUnit");

  const [searchParams] = useSearchParams();
  const object_Id = searchParams.get("objectId");
  console.log(object_Id, "object_idobject_idobject_id");

  const [isLoading, setIsLoading] = useState(true);

  const [controlData, setControlData] = useState({});

  const [ctlPreviousData, setCtlPreviousData] = useState({});

  const [deletedSectionKey, setDeletedSectionKey] = useState(0);
  let [submissionPopup, setSubmissionPopup] = useState(false);
  const formApi = formMetaData.formmeta.api_handler.replace(/[/]/, "");
  let Comment = "Comment";
  const FrameworkType = formMethods.getValues("framework");
  console.log(FrameworkType, "FrameworkTypeFrameworkType");

  const RegCompFrameWork = FrameworkType == 1 ? true : false;
  const [showModal, setShowModal] = useState(false);
  const [selectedControlId, setSelectedControlId] = useState(null);

  const Configure = formMetaData.configurationFormMetaData;
  const priorIssuesReport = Configure.prior_issue;
  const previousrating = Configure.previous_rating;

  const deleteSectionforTST = (index) => {
    setDeletedSectionKey(deletedSectionKey + 1);
    TSTremove(index);
  };

  const deleteSectionforFND = (index) => {
    setDeletedSectionKey(deletedSectionKey + 1);
    FNDremove(index);
  };

  if (Array.isArray(controlID) && controlID.length > 0) {
    useEffect(() => {
      const handleControlRelationship = () => {
        getServiceDatas("getControlRelationshipData", controlID, FrameworkType)
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
  }
  //Prior Issues
  const objectId = formMethods.getValues("objectId");

  const processId = formMethods.getValues("testScope");
  const [prior, setPrior] = useState("");

  useEffect(() => {
    getPriorIssues("getpriorissue", objectId, 2, processId)
      .then((response) => {
        setPrior(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Custom Card to get the Previous Control Test Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getviewData({
          viewName: "pa_ct_control_testing_results_new_v",
          pageNumber: 0,
          pageSize: 0,
          sortField: "",
          sortOrder: "",
          orderExpression: "",
          filterExpression: `control_id=${selectedControlId}`,
        });

        if (response.data.data.length !== 0) {
          setCtlPreviousData(response.data.data[0]);
        }
      } catch (error) {}
    };

    fetchData();
  }, [selectedControlId]);
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

  const {
    fields: CTLFields,
    append,
    prepend,
    remove,
    swap,
    move,
    insert,
    replace,
  } = useFieldArray({
    name: "CTL",
    control,
  });

  const {
    fields: TSTFields,
    append: TSTappend,
    remove: TSTremove,
  } = useFieldArray({
    name: "TST",
    control,
  });

  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formValues,
    formMetaData,
    runtimeParams,
    control,

    TSTFields,
    CTLFields
  );

  if (isLoading) {
    return <Loader />;
  }

  const processCompliance = [
    { label: "Business Unit", type: "Business Unit" },
    { label: "Process", type: "Process" },
    { label: "Risk", type: "Risk" },
  ];

  const regulatoryCompliance = [
    { label: "Regulatory Body", type: "RegulatoryBody" },
    { label: "Area Of Compliance", type: "AreaOfCompliance" },
    { label: "Requirement", type: "Requirement" },
  ];

  return (
    <>
      <div>
        <Container className="justify-content-center  ">
          <div>
            <Section title="Details">
              <Row>
                <div className="col-md-5">
                  <Row>
                    <Col>
                      <FormControl
                        control={control}
                        name="businessUnit"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        singleRow
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormControl
                        control={control}
                        name="tester"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        singleRow
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormControl
                        control={control}
                        name="approver"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        singleRow
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormControl
                        control={control}
                        type="flatpick"
                        name="dueDate"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        singleRow
                        futureDate={true}
                      />
                    </Col>
                  </Row>
                </div>
                <div className="col-md-5">
                  <Row>
                    <Col>
                      <FormControl
                        control={control}
                        name="scopeBusinessUnit"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        singleRow
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormControl
                        control={control}
                        name="testScope"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        singleRow
                      />
                    </Col>
                  </Row>
                  <Row>
                    <FormControl
                      control={control}
                      name="controls"
                      isMulti={true}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      dataHeight={300}
                      singleRow
                    />
                  </Row>
                </div>
              </Row>
            </Section>
          </div>

          {/* <span className="h4 mb-2">Test Executions</span> */}
          {Array.isArray(controlID) && controlID.length > 0 && (
            <Section title="Test Executions">
              {CTLFields.map((item, i) => {
                let CTLRecord = `CTL.${i}`;
                let controlId = getValues(`${CTLRecord}.sourceControlId`);
                let action = formMethods.getValues("action");
                console.log("CTLRecordCTLRecord", CTLRecord);

                if (action == 2) {
                  formMetaData.fields.designEffectiveness.required = false;
                  formMetaData.fields.operationalEffectiveness.required = false;
                } else if (action == 3) {
                  formMetaData.fields.designEffectiveness.required = true;
                  formMetaData.fields.operationalEffectiveness.required = true;
                }
                let Effectiveness = getValues(
                  `${CTLRecord}.designEffectiveness`
                );
                if (Effectiveness === 3) {
                  formMetaData.fields.operationalEffectiveness.editable = false;
                }

                console.log(
                  controlData[controlId],

                  "Each Control Id details for rendering"
                );
                return (
                  <HybridSection
                    title={getValues(`${CTLRecord}.sourceControlName`)}
                    expand={false}
                    headerClass="bg-primary bg-gradient bg-opacity-55"
                    headerfont="text-white"
                    field1={
                      <FormControl
                        control={control}
                        name={`${CTLRecord}.designEffectiveness`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        disabled={true}
                      />
                    }
                    field2={
                      <FormControl
                        control={control}
                        name={`${CTLRecord}.operationalEffectiveness`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        disabled={true}
                      />
                    }
                  >
                    <div>
                      <Row>
                        <h6>Description</h6>
                      </Row>
                      <Row>
                        <h9>
                          {controlData && controlData[controlId]?.description}
                        </h9>
                      </Row>
                      <Row>
                        <Col>
                          <Form.Group
                            className="mb-3"
                            controlId="formPlaintextEmail"
                          >
                            <Form.Label>
                              <b> Nature</b>
                            </Form.Label>
                            <Col>
                              {controlData &&
                                controlData[controlId]?.d_nature && (
                                  <ul style={{ listStyleType: "disc" }}>
                                    <li>
                                      {controlData &&
                                        controlData[controlId]?.d_nature}
                                    </li>
                                  </ul>
                                )}
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group
                            className="mb-3"
                            controlId="formPlaintextEmail"
                          >
                            <Form.Label>
                              <b> Source</b>
                            </Form.Label>
                            <Col>
                              {controlData &&
                                controlData[controlId]?.d_sources && (
                                  <ul style={{ listStyleType: "disc" }}>
                                    <li>
                                      {controlData &&
                                        controlData[controlId]?.d_sources}
                                    </li>
                                  </ul>
                                )}
                            </Col>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group
                            className="mb-3"
                            controlId="formPlaintextEmail"
                          >
                            <Form.Label>
                              <b> Purpose</b>
                            </Form.Label>
                            <Col>
                              {controlData &&
                                controlData[controlId]?.d_purpose && (
                                  <ul style={{ listStyleType: "disc" }}>
                                    <li>
                                      {controlData &&
                                        controlData[controlId]?.d_purpose}
                                    </li>
                                  </ul>
                                )}
                            </Col>
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Relationships */}
                      {/* Process Compliance Relationship */}
                      {!RegCompFrameWork && (
                        <Row className="d-flex align-items-center">
                          <span className="h5">Relationships</span>
                          {processCompliance.map(({ label, type }) => (
                            <Col key={type}>
                              <strong>{label}</strong>
                              {controlData[controlId]?.relationships
                                ?.filter(
                                  (relation) => relation.object_type === type
                                )
                                .map((relationShip, index) => (
                                  <ul key={index}>
                                    <li>{relationShip?.object_name}</li>
                                  </ul>
                                ))}
                            </Col>
                          ))}
                        </Row>
                      )}
                      {/* Regulator Compliance Relationship */}
                      {RegCompFrameWork && (
                        <Row className="d-flex align-items-center">
                          <span className="h5">Relationships</span>
                          {regulatoryCompliance.map(({ label, type }) => (
                            <Col key={type}>
                              <strong>{label}</strong>
                              {controlData[controlId]?.relationships
                                ?.filter(
                                  (relation) => relation.object_type === type
                                )
                                .map((relationShip, index) => (
                                  <ul key={index}>
                                    <li>{relationShip?.object_name}</li>
                                  </ul>
                                ))}
                            </Col>
                          ))}
                        </Row>
                      )}
                      <Row>
                        <div className="col-md-12">
                          <hr></hr>
                        </div>
                      </Row>

                      <Row>
                        <Col>
                          <FormControl
                            control={control}
                            name={`${CTLRecord}.designEffectiveness`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control={control}
                            name={`${CTLRecord}.operationalEffectiveness`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            watchFor={`${CTLRecord}.designEffectiveness`}
                          />
                        </Col>
                        <Col>
                          <ModalButton
                            buttonText="Previous Control Result"
                            controlId={getValues(
                              `${CTLRecord}.sourceControlId`
                            )}
                            content={previousControlResultsContent}
                          />
                        </Col>
                      </Row>
                      <Row>
                        {previousrating && (
                          // getValues(
                          //   `${CTLRecord}.previousDesignEffectiveness`
                          // )
                          <Col>
                            <FormControl
                              control={control}
                              name={`${CTLRecord}.previousDesignEffectiveness`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              editable={false}
                            />
                          </Col>
                        )}
                        {previousrating && (
                          // getValues(
                          //   `${CTLRecord}.previousOperationalEffectiveness`
                          // ) &&
                          <Col>
                            <FormControl
                              control={control}
                              name={`${CTLRecord}.previousOperationalEffectiveness`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              editable={false}
                            />
                          </Col>
                        )}
                      </Row>

                      {runtimeParams.formmeta.accessCode == 1 &&
                      (formMethods.getValues("currentStage") == "PERFORM" ||
                        formMethods.getValues("currentStage") ==
                          "SUBMIT_CLARIFICATION") ? (
                        <Row className="mb-2 px-2">
                          <Button
                            onClick={() =>
                              TSTappend({
                                tstParentControlId: controlId,
                                tstName: "",
                                tstProcedure: "",
                                tstId: "",
                                tstResult: "",
                              })
                            }
                          >
                            + Add Test Scripts
                          </Button>
                        </Row>
                      ) : null}

                      {TSTFields.map((titem, ti) => {
                        let TSTRecord = `TST.${ti}`;

                        const TestNameValue =
                          getValues(`${TSTRecord}.tstName`) ||
                          "New Test Script";

                        if (
                          getValues(`${TSTRecord}.tstParentControlId`) ==
                          controlId
                        ) {
                          let action = formMethods.getValues("action");

                          if (action == 2) {
                            formMetaData.fields.tstResult.required = false;
                            formMetaData.fields.totalSamples.required = false;
                            formMetaData.fields.samplesPassed.required = false;
                            formMetaData.fields.tstProcedure.required = false;
                            formMetaData.fields.tstName.required = false;
                          }
                          return (
                            <>
                              <Collapse
                                key={`${TSTRecord}-${deletedSectionKey}`}
                                title={`${TSTRecord}.tstName`}
                                secondaryTitle={
                                  <FormControl
                                    control={control}
                                    name={`${TSTRecord}.tstResult`}
                                    formMetaData={formMetaData}
                                    formMethods={formMethods}
                                    disabled
                                    singleRow
                                    hideTitle
                                    textColor={"white"}
                                  />
                                }
                                className="bg-nblue text-white bg-gradient"
                                control={control}
                                watchFor={[
                                  `${TSTRecord}.tstName`,
                                  `${TSTRecord}.tstResult`,
                                ]}
                                formMethods={formMethods}
                                bgcolor={
                                  getValues(`${TSTRecord}.tstResult`) == "1"
                                    ? "bg-success"
                                    : getValues(`${TSTRecord}.tstResult`) == "2"
                                    ? "bg-danger"
                                    : ""
                                }
                                state={
                                  getValues(`${TSTRecord}.tstName`)
                                    ? false
                                    : true
                                }
                              >
                                <Row className=" card-body mt-2 ">
                                  <Col>
                                    <Form.Group
                                      className="mb-3"
                                      controlId="formPlaintextEmail"
                                    >
                                      <Col>
                                        <Row>
                                          <div>
                                            <FormControl
                                              control={control}
                                              name={`${TSTRecord}.tstName`}
                                              formMetaData={formMetaData}
                                              formMethods={formMethods}
                                              disabled={getValues(
                                                `${TSTRecord}.sourceProcedureId`
                                              )}
                                              others
                                            />
                                          </div>
                                        </Row>
                                        <div>
                                          <Row>
                                            <Col>
                                              <FormControl
                                                control={control}
                                                name={`${TSTRecord}.tstResult`}
                                                formMetaData={formMetaData}
                                                formMethods={formMethods}
                                                editable={true}
                                              />
                                            </Col>

                                            {getValues("sourceType") == 1 &&
                                              getValues(
                                                `${TSTRecord}.tstPreviousResult`
                                              ) && (
                                                <Col>
                                                  <FormControl
                                                    control={control}
                                                    name={`${TSTRecord}.tstPreviousResult`}
                                                    formMetaData={formMetaData}
                                                    formMethods={formMethods}
                                                    editable={false}
                                                  />
                                                </Col>
                                              )}
                                          </Row>
                                        </div>
                                      </Col>
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <FormControl
                                      control={control}
                                      name={`${TSTRecord}.tstProcedure`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                      editable={true}
                                    />
                                  </Col>
                                  <Row>
                                    <Col className="col-md-4">
                                      <div>
                                        <FormControl
                                          control={control}
                                          name={`${TSTRecord}.totalSamples`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                          editable={true}
                                        />
                                      </div>
                                    </Col>
                                    <Col className="col-md-4">
                                      <div>
                                        <FormControl
                                          control={control}
                                          name={`${TSTRecord}.samplesPassed`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                          editable={true}
                                          watchFor={`${TSTRecord}.totalSamples`}
                                        />
                                      </div>
                                    </Col>
                                    <Col className="col-md-4">
                                      <div>
                                        <FormControl
                                          control={control}
                                          name={`${TSTRecord}.samplesFailed`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                          editable={false}
                                        />
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <FormControl
                                      control={control}
                                      name={`${TSTRecord}.tstAttachment`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                      editable={true}
                                    />
                                    <FormControl
                                      control={control}
                                      name={`${TSTRecord}.tstComments`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                    />
                                  </Row>
                                  <Row>
                                    {runtimeParams.formmeta.accessCode == 1 &&
                                    (formMethods.getValues("currentStage") ==
                                      "PERFORM" ||
                                      formMethods.getValues("currentStage") ==
                                        "SUBMIT_CLARIFICATION") ? (
                                      <Col className="mb-3">
                                        <Button
                                          type="button"
                                          variant="warning"
                                          className="float-end"
                                          onClick={() =>
                                            deleteSectionforTST(ti)
                                          }
                                        >
                                          Remove
                                        </Button>
                                      </Col>
                                    ) : null}
                                  </Row>
                                </Row>
                              </Collapse>
                            </>
                          );
                        }
                      })}
                      {/* Findings */}
                      <Section title="Findings">
                        {runtimeParams.formmeta.accessCode == 1 &&
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
                                      program="2"
                                      source_form_name="CT_CONTROL_TESTING"
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
                                      relatedId={controlId}
                                      relatedObject="Compliance"
                                    />
                                  }
                                  buttonText={
                                    <>
                                      <FontAwesomeIcon
                                        icon={faPlusCircle}
                                        size="lg"
                                      />{" "}
                                      Add Findings
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
                          report="IR_CONTROL_TESTING_FINDING"
                          drilldownReports={{
                            objectId: formValues.objectId,
                            riskId: controlId,
                          }}
                          handleReportClosebtn
                        />
                      </Section>
                    </div>
                  </HybridSection>
                );
              })}
            </Section>
          )}
          <Section title="Prior Issues">
            <div>
              <Row>
                {priorIssuesReport ? (
                  <>
                    <PriorIssues
                      processId={formMethods.getValues("testScope")}
                    />
                  </>
                ) : (
                  <ReportRuntime
                    report="IR_RA_ISSUE_DETAILS"
                    ChartdrilldownReports={`issue_id in (${prior})`}
                  />
                )}
              </Row>
            </div>
          </Section>
          <Section title="Additional Details">
            <FormControl
              control={control}
              name="attachFiles"
              isMulti={false}
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Section>
          <div></div>
          {formValues.objectId != null && (
            <AuditTrail
              formMetaData={formMetaData}
              formMethods={formMethods}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
              enableAddComment={formValues.status == "Closed" ? false : true}
            />
          )}
        </Container>
      </div>
    </>
  );
};

export default FormLayout;
