import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Modal,
} from "react-bootstrap";
import { useFieldArray, useWatch } from "react-hook-form";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import JSHook from "./PA_IA_AUDITS_JS";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import { getviewData, getInternalAuditFrameworkData } from "../IAService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsSpin,
  faTriangleExclamation,
  faCheckToSlot,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReportRuntime from "src/components/reports/Report";
import { useSearchParams } from "react-router-dom";
import Confirmation from "src/components/forms/reactformutils/elements/Confirmation";

let FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues, runtimeParams } = props;
  const [searchParams] = useSearchParams();
  let ab = searchParams.get("formService");

  if (ab === "auditplan") {
    formMetaData.fields.planId.visible = false;
  }
  let allScopes = formValues.scope;
  const [scopeData, setScopeData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const urlString = window.location.href;
  const url = new URL(urlString);
  const objectId = url.searchParams.get("objectId");
  const { t } = useTranslation("common");
  // useEffect(() => {
  //   if (formValues.objectId != undefined || formValues.objectId != null) {
  //     const filterExpression = `b.auditable_entity in (select unnest(a.scope) from pa_ia_audits a where a.object_id=${formValues.objectId} and a.business_unit=b.business_unit) and d_risk_id is not null`;
  //     getviewData({
  //       viewName: "pa_gl_internal_audits_bt b",
  //       pageNumber: 0,
  //       pageSize: 0,
  //       sortField: "",
  //       sortOrder: "",
  //       orderExpression: "",
  //       filterExpression,
  //     })
  //       .then((response) => {
  //         setScopeData(response.data.data);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  //   // setScopeData()
  //   // fetchData();
  // }, [objectId]);
  console.log(formValues.objectId, "formValues.objectId");

  useEffect(() => {
    if (formValues.objectId != undefined || formValues.objectId != null) {
      getInternalAuditFrameworkData(
        "InternalAuditFramework",
        formValues.objectId
      )
        .then((response) => {
          console.log(response.data, "InternalAuditFrameworkResponseData");
          setScopeData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [objectId]);

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

  const {
    fields: MSTFields,
    append: MSTappend,
    remove: MSTremove,
  } = useFieldArray({
    name: "MST",
    control,
  });
  const addQstRow = () => {
    MSTappend({
      mstId: "",
      mstName: "",
      mstProposedDate: "",
      mstActualDate: "",
      mstCompletionDate: "",
      mstBudgetedEffort: "",
      mstAttachments: "",
      mstComments: "",
    });
  };
  const {
    fields: DOCFields,
    append: DOCappend,
    remove: DOCremove,
  } = useFieldArray({
    name: "DOC",
    control,
  });
  const deleteSectionforDOC = (index) => {
    DOCremove(index);
  };
  const addDOCRow = () => {
    DOCappend({
      docId: "",
      uploadedOn: "",
      uploadedBy: "",
      docUploadEvidence: "",
      docCategory: "",
    });
    console.log(DOCFields, "DOC called");
  };
  const [planStart, setplanStart] = useState("");
  const [planEnd, setplanEnd] = useState("");
  const currDate = new Date();
  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    control,
    runtimeParams,
    MSTappend,
    setplanEnd,
    setplanStart
  );
  let startDate = useWatch({
    control: control,
    name: "startDate",
  });

  let endDateCon = new Date(startDate).setDate(new Date(startDate).getDate());
  let minendDateCon = new Date(
    runtimeParams.planEnd ? runtimeParams.planEnd : planEnd
  ).setDate(
    new Date(runtimeParams.planEnd ? runtimeParams.planEnd : planEnd).getDate()
  );

  let startDateCon = new Date(
    runtimeParams.planStart ? runtimeParams.planStart : planStart
  ).setDate(
    new Date(
      runtimeParams.planStart ? runtimeParams.planStart : planStart
    ).getDate()
  );

  const [uniqueAuditableEntities, setUniqueAuditableEntities] = React.useState(
    []
  );

  useEffect(() => {
    if (scopeData && scopeData?.length > 0) {
      const uniqueEntities = [
        ...new Set(scopeData.map((item) => item.d_auditable_entity)),
      ];
      setUniqueAuditableEntities(uniqueEntities);
    }
  }, [scopeData]);
  const scopeNames = [];
  if (formValues.objectId) {
    const scopeMap = formMetaData?.dataSourceResponse?.scope?.map((item) => {
      scopeNames.push(item.label);
    });
  }
  const scopeList = scopeNames.filter(
    (item) => !uniqueAuditableEntities.includes(item)
  );

  const groupedData = Array.isArray(scopeData)
    ? scopeData.reduce((acc, item) => {
        const {
          d_auditable_entity,
          d_risk_id,
          d_control_id,
          d_test_procedure_id,
        } = item;

        if (!acc[d_auditable_entity]) {
          acc[d_auditable_entity] = {};
        }
        if (!acc[d_auditable_entity][d_risk_id]) {
          acc[d_auditable_entity][d_risk_id] = {};
        }
        if (!acc[d_auditable_entity][d_risk_id][d_control_id]) {
          acc[d_auditable_entity][d_risk_id][d_control_id] = [];
        }
        if (d_test_procedure_id) {
          acc[d_auditable_entity][d_risk_id][d_control_id].push(
            d_test_procedure_id
          );
        }

        return acc;
      }, {})
    : {};

  return (
    <>
      <Container className="justify-content-center">
        <Section title="Details" required>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="auditTitle"
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
            <div className="col-md-8">
              <FormControl
                control={control}
                name="planId"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="objectives"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="scheduleType"
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
                modal={props?.modal ? true : false}
                formMetaData={formMetaData}
                formMethods={formMethods}
                futureDate={true}
                futureDateValue={
                  formValues.objectId
                    ? startDateCon
                    : startDateCon >= currDate
                    ? startDateCon
                    : currDate
                }
                // futureDateValue={startDateCon}
                ConditionalDate={minendDateCon}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="endDate"
                formMetaData={formMetaData}
                modal={props?.modal ? true : false}
                formMethods={formMethods}
                futureDate={true}
                futureDateValue={endDateCon}
                ConditionalDate={minendDateCon}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="audClassification"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6"></div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="auditBU"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="team"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="auditBU"
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="auditManager"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="auditBU"
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="leadAuditor"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="auditBU"
              />
            </div>
          </Row>
        </Section>

        <Section title="Scope & Auditee">
          <Row>
            {" "}
            <div className="col-md-6">
              <FormControl
                control={control}
                name="scopeBasedOn"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>{" "}
            <div className="col-md-6">
              <FormControl
                control={control}
                name="businessUnit"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="auditeeContact"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>

            <div className="col-md-6">
              {formMetaData.fields.scope.editable && (
                <FormControl
                  control={control}
                  zIndex={true}
                  name="scope"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              )}

              {formMetaData.fields.scope.editable === false && (
                <>
                  <h6 className="text-dark fw-medium form-label">Scope</h6>
                  <ul className="list-unstyled">
                    {uniqueAuditableEntities.map((entity, index) => (
                      <React.Fragment key={index}>
                        <li style={{ color: "rgb(108, 117, 125)" }}>
                          <FontAwesomeIcon
                            icon={faArrowsSpin}
                            className="me-2"
                          />
                          {entity}
                        </li>
                        <ul className="list-unstyled ms-4">
                          {Object.entries(groupedData[entity] || {}).map(
                            ([riskId, controls], riskIndex) => (
                              <React.Fragment key={riskIndex}>
                                <li style={{ color: "rgb(108, 117, 125)" }}>
                                  <FontAwesomeIcon
                                    icon={faTriangleExclamation}
                                    className="me-2"
                                  />
                                  {riskId}
                                </li>
                                <ul className="list-unstyled ms-4">
                                  {Object.entries(controls).map(
                                    (
                                      [controlId, testProcedures],
                                      controlIndex
                                    ) => (
                                      <React.Fragment key={controlIndex}>
                                        {controlId !== "null" && (
                                          <li
                                            style={{
                                              color: "rgb(108, 117, 125)",
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faCheckToSlot}
                                              className="me-2"
                                            />
                                            {controlId}
                                          </li>
                                        )}
                                        <ul className="list-unstyled ms-4">
                                          {testProcedures.map(
                                            (testProcedure, testIndex) =>
                                              testProcedure !== "null" && (
                                                <li
                                                  key={testIndex}
                                                  style={{
                                                    color: "rgb(108, 117, 125)",
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faComments}
                                                    className="me-2"
                                                  />
                                                  {testProcedure}
                                                </li>
                                              )
                                          )}
                                        </ul>
                                      </React.Fragment>
                                    )
                                  )}
                                </ul>
                              </React.Fragment>
                            )
                          )}
                        </ul>
                      </React.Fragment>
                    ))}
                    {scopeList.map((item, index) => {
                      return (
                        <li style={{ color: "rgb(108, 117, 125)" }}>
                          <FontAwesomeIcon
                            icon={faArrowsSpin}
                            className="me-2"
                          />
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
          </Row>
        </Section>
        {formValues.currentStage && formValues.currentStage != "PLAN" && (
          <>
            <Section title="Milestones">
              <div
                style={{
                  overflowX: "auto",
                  maxWidth: "100%",
                }}
              >
                {MSTFields.map((row, rowIndex) => (
                  <Row key={row.id}>
                    <Col xs={12} md={12} lg={12}>
                      <div>
                        <div className="d-flex">
                          <div className="col-md-2 ">
                            <FormControl
                              control={control}
                              name={`MST.${rowIndex}.mstName`}
                              formMetaData={formMetaData}
                              zIndex={true}
                              dropDownFlag={true}
                              // dropDown={opt}
                              formMethods={formMethods}
                              hideTitle={rowIndex > 0 ? true : false}
                            />
                          </div>
                          <div className="col-md-2 me-1">
                            <FormControl
                              control={control}
                              name={`MST.${rowIndex}.mstProposedDate`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              hideTitle={rowIndex > 0 ? true : false}
                              disabled={
                                formMethods.getValues(
                                  `MST.${rowIndex}.mstName`
                                ) === "Workpaper Review" ||
                                formMethods.getValues(
                                  `MST.${rowIndex}.mstName`
                                ) === "Follow-up"
                                  ? true
                                  : false
                              }
                            />
                          </div>
                          <div className="col-md-2 me-1">
                            <FormControl
                              control={control}
                              name={`MST.${rowIndex}.mstActualDate`}
                              formMetaData={formMetaData}
                              zIndex={true}
                              formMethods={formMethods}
                              hideTitle={rowIndex > 0 ? true : false}
                              disabled={
                                formMethods.getValues(
                                  `MST.${rowIndex}.mstName`
                                ) === "Workpaper Review" ||
                                formMethods.getValues(
                                  `MST.${rowIndex}.mstName`
                                ) === "Follow-up"
                                  ? true
                                  : false
                              }
                            />
                          </div>
                          <div className="col-md-2 me-1">
                            <FormControl
                              control={control}
                              name={`MST.${rowIndex}.mstCompletionDate`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              hideTitle={rowIndex > 0 ? true : false}
                            />
                          </div>{" "}
                          <div className="col-md-2 me-1">
                            <FormControl
                              control={control}
                              name={`MST.${rowIndex}.mstBudgetedEffort`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              hideTitle={rowIndex > 0 ? true : false}
                              disabled={
                                formMethods.getValues(
                                  `MST.${rowIndex}.mstName`
                                ) === "Workpaper Review" ||
                                formMethods.getValues(
                                  `MST.${rowIndex}.mstName`
                                ) === "Follow-up"
                                  ? true
                                  : false
                              }
                            />
                          </div>
                          <div className="col-md-2 me-1">
                            <FormControl
                              control={control}
                              name={`MST.${rowIndex}.mstAttachments`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              hideTitle={rowIndex > 0 ? true : false}
                              disabled={
                                formMethods.getValues(
                                  `MST.${rowIndex}.mstName`
                                ) === "Workpaper Review" ||
                                formMethods.getValues(
                                  `MST.${rowIndex}.mstName`
                                ) === "Follow-up"
                                  ? true
                                  : false
                              }
                            />
                          </div>{" "}
                          <div className="col-md-2 me-1">
                            <FormControl
                              control={control}
                              name={`MST.${rowIndex}.mstComments`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              hideTitle={rowIndex > 0 ? true : false}
                              disabled={
                                formMethods.getValues(
                                  `MST.${rowIndex}.mstName`
                                ) === "Workpaper Review" ||
                                formMethods.getValues(
                                  `MST.${rowIndex}.mstName`
                                ) === "Follow-up"
                                  ? true
                                  : false
                              }
                            />
                          </div>
                          {/* <hr style={{ backgroundColor: "#333", height: "3px" }} /> */}
                        </div>
                      </div>
                    </Col>
                  </Row>
                ))}
              </div>
            </Section>
            {formValues.currentStage != "INITIATE" && (
              <>
                <Section title="Documents/Evidence">
                  <Row>
                    {DOCFields.map((docItem, doc) => {
                      let DOCRecord = `DOC.${doc}`;
                      return (
                        <Row key={docItem.id}>
                          <Col lg={4} md={3} sm={12}>
                            <FormControl
                              control={control}
                              name={`${DOCRecord}.docCategory`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              hideTitle={doc > 0 ? true : false}
                            />
                          </Col>
                          <Col lg={6} md={3} sm={12}>
                            <FormControl
                              control={control}
                              name={`${DOCRecord}.docUploadEvidence`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              hideTitle={doc > 0 ? true : false}
                            />
                          </Col>
                          {runtimeParams.formmeta.accessCode == 1 &&
                            DOCFields[doc].docId == "" && (
                              <Col
                                lg={2}
                                md={2}
                                sm={12}
                                className={
                                  DOCRecord == "DOC.0"
                                    ? " col-md mt-4"
                                    : " col-md mt-0"
                                }
                              >
                                <Button
                                  type="button"
                                  variant="warning"
                                  onClick={() => deleteSectionforDOC(doc)}
                                >
                                  {t("Remove")}
                                </Button>
                              </Col>
                            )}
                        </Row>
                      );
                    })}
                    {runtimeParams.formmeta.accessCode == 1 && (
                      <Row>
                        <Button type="button" onClick={addDOCRow}>
                          + {t("Add Documents/Evidence")}
                        </Button>
                      </Row>
                    )}
                  </Row>
                </Section>

                <Section title="Final Audit Report">
                  <ReportRuntime
                    // refreshdataref={refreshdataref}
                    report="IA_AUDIT_REPORT"
                    ChartdrilldownReports={`AUDIT_TITLE = (${formValues.objectId})`}
                  />
                </Section>
                <Section title="Summary">
                  <FormControl
                    control={control}
                    name="executiveSummary"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Section>
              </>
            )}
          </>
        )}
        {formMethods.getValues("objectId") != "" && (
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
            // enableAddComment={formValues.status == "Closed" ? false : true}
          />
        )}
      </Container>
      <Confirmation
        show={modalShow}
        onHide={() => setModalShow(false)}
        content={modalContent}
      />
    </>
  );
};

export default FormLayout;
