import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import JSHook from "./PA_IA_AUDIT_WORKPAPER_JS";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import ReportRuntime from "src/components/reports/Report";
import Popup from "src/components/forms/reactformutils/elements/Popup";
import BottomBar from "src/components/forms/reactformutils/elements/BottomBar";
import { useTranslation } from "react-i18next";
let FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues, runtimeParams } = props;
  const { t } = useTranslation("common");
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
  const [auditName, setAuditName] = useState("");
  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  const riskList = [
    ...new Set(
      formValues &&
        formValues?.CTL?.reduce(
          (accumulator, currentValue) => [
            ...accumulator,
            currentValue.ctRiskID,
          ],
          []
        )
    ),
  ];
  const wpType = formValues.wpType;
  const controlID = formValues.CTL?.map((a) => a.ctControlName);
  const {
    fields: QSTFields,
    append: QSTappend,
    remove: QSTremove,
  } = useFieldArray({
    name: "QST",
    control,
  });

  let [submissionPopup, setSubmissionPopup] = useState(false);
  const {
    fields: CTLFields,
    append: CTLappend,
    remove: CTLremove,
  } = useFieldArray({
    name: "CTL",
    control,
  });
  const addCtlRow = () => {
    CTLappend({
      ctlId: "",
      ctRiskID: "",
      ctControlId: "",
      ctDesignEffectiveness: "",
      ctOperatingEffectiveness: "",
      ctJustification: "",
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
  const {
    fields: TSTFields,
    append: TSTappend,
    remove: TSTremove,
  } = useFieldArray({
    name: "TST",
    control,
  });
  console.log(TSTFields, formMethods.getValues("CurrentStage"), "tstfieldstst");

  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    control,
    runtimeParams,
    setAuditName,
    QSTappend,
    TSTFields
  );

  const deleteSectionforTST = (index, rowIndex) => {
    // console.log(index,"docupindex",rowIndex);
    // const updatedTSTFields = TSTFields.filter((field, i) => i !== index);
    TSTremove(index);
  };

  const deleteSectionforDOC = (index) => {
    DOCremove(index);
  };
  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };

  function getLabelsFromKey(data, key) {
    const labels = [];

    if (data.hasOwnProperty(key)) {
      const array = data[key];
      array.forEach((item) => {
        if (item.label) {
          labels.push(item.label);
        }
      });
    }
    return labels;
  }

  function multiregionCondition(rowIndex) {
    if (formMethods.getValues(`CTL.${rowIndex}.ctDesignEffectiveness`) === 2) {
      formMetaData.fields["CTL." + rowIndex + ".ctOperatingEffectiveness"] = {};
      formMetaData.fields[
        "CTL." + rowIndex + ".ctOperatingEffectiveness"
      ].editable = false;
    }
  }

  return (
    <>
      <Container className="justify-content-center">
        <Section title="General" required>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="wpTitle"
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
            <div className="col-md-4">
              {/* <FormControl
                control={control}
                name="auditTitle"
                formMetaData={formMetaData}
                formMethods={formMethods}
              /> */}
              <Row>
                <label>{t("Audit Title")} </label>
              </Row>
              <ModalForm
                objectId={formMethods.getValues("auditTitle")}
                formname="audits"
                className="mb-4"
                variant
                style={{
                  textDecoration: "underline",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
                component={
                  <FormRunTime
                    formService="audits"
                    objectId={formMethods.getValues("auditTitle")}
                    modal
                    // callbackParent={callbackFromChild}
                  />
                }
                buttonText={auditName}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="wpCategory"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="wpType"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <Col>
              <SubSection title="Scope">
                <Row>
                  <div className="col-md-12">
                    <FormControl
                      control={control}
                      name="businessUnit"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={4}
                    />
                  </div>
                  <div className="col-md-12">
                    <FormControl
                      control={control}
                      name="aeProcess"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={4}
                    />
                  </div>
                </Row>
              </SubSection>
            </Col>
            <Col>
              <SubSection title="Ownership">
                <Row>
                  <div className="col-md-12">
                    <FormControl
                      control={control}
                      name="wpAuditor"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={4}
                    />
                  </div>
                </Row>
                <Row>
                  <div className="col-md-12">
                    <FormControl
                      control={control}
                      name="wpApprover"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={4}
                    />
                  </div>
                </Row>
              </SubSection>
            </Col>
            <Col>
              <SubSection title="Key Dates">
                <Row>
                  <FormControl
                    control={control}
                    name="wpStartDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    singleRow
                  />
                </Row>

                <Row>
                  <FormControl
                    control={control}
                    name="wpEndDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    singleRow
                  />
                </Row>
              </SubSection>
            </Col>
          </Row>
        </Section>

        <Section title="Scope Details">
          <div
            style={{
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            {riskList.map((index, item) => {
              let ctr = 0;
              const labels = getLabelsFromKey(
                formMetaData.dataSourceResponse,
                `CTL.${item}.ctRiskID`
              );
              return (
                <>
                  <Collapse
                    title={`${labels}`}
                    className={"bg-nblue bg-gradient text-white"}
                    control={control}
                  >
                    {CTLFields.map((row, rowIndex) => {
                      let CTLRecord = `CTL.${rowIndex}`;
                      let controlId = getValues(`${CTLRecord}.ctControlName`);
                      let riskId = getValues(`${CTLRecord}.ctRiskID`);
                      if (riskId != index) return;
                      multiregionCondition(rowIndex);
                      ctr++;
                      return (
                        <>
                          <div
                            style={{
                              overflowX: "auto",
                              maxWidth: "100%",
                            }}
                          >
                            <Row key={row.id}>
                              <Col xs={12} md={12} lg={12}>
                                <div>
                                  {wpType == 2 && (
                                    <div className="d-flex">
                                      <div className="col-md-2 me-1">
                                        <FormControl
                                          control={control}
                                          name={`CTL.${rowIndex}.ctControlName`}
                                          formMetaData={formMetaData}
                                          zIndex={true}
                                          formMethods={formMethods}
                                          hideTitle={ctr > 1 ? true : false}
                                        />
                                      </div>
                                      <div className="col-md-2 me-1">
                                        <FormControl
                                          control={control}
                                          zIndex={true}
                                          name={`CTL.${rowIndex}.ctDesignEffectiveness`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                          hideTitle={ctr > 1 ? true : false}
                                        />
                                      </div>
                                      <div className="col-md-3 me-1">
                                        <FormControl
                                          control={control}
                                          name={`CTL.${rowIndex}.ctOperatingEffectiveness`}
                                          formMetaData={formMetaData}
                                          zIndex={true}
                                          dropDownFlag={true}
                                          formMethods={formMethods}
                                          hideTitle={ctr > 1 ? true : false}
                                          watchFor={[
                                            `CTL.${rowIndex}.ctDesignEffectiveness`,
                                          ]}
                                        />
                                      </div>

                                      <div className="col-md-2 me-1">
                                        <FormControl
                                          control={control}
                                          zIndex={true}
                                          name={`CTL.${rowIndex}.ctJustification`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                          hideTitle={ctr > 1 ? true : false}
                                        />
                                      </div>
                                      <div className="col-md-2 me-1">
                                        <FormControl
                                          control={control}
                                          zIndex={true}
                                          name={`CTL.${rowIndex}.ctAttachments`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                          hideTitle={ctr > 1 ? true : false}
                                        />
                                      </div>
                                      {formMetaData.formmeta.accessCode == 1 &&
                                        (formMethods.getValues(
                                          "currentStage"
                                        ) == "AUDITOR" ||
                                          formMethods.getValues(
                                            "currentStage"
                                          ) == "SUBMIT-CLARIFICATION") && (
                                          <Row>
                                            <Col>
                                              <h6
                                                className={
                                                  ctr > 1 ? "d-none " : ""
                                                }
                                              >
                                                {t("Findings")}
                                              </h6>
                                            </Col>
                                            <Col className="h6 text-end mb-1 w-100">
                                              <ModalForm
                                                formname="issueobservation"
                                                objectId={-1}
                                                component={
                                                  <FormRunTime
                                                    formService="issueobservation"
                                                    objectId={-1}
                                                    modal
                                                    ParentFormObjectId={
                                                      formValues.auditTitle
                                                    }
                                                    fndApprover={
                                                      formValues.wpAuditor
                                                    }
                                                    fndApproveBU={
                                                      formValues.businessUnit
                                                    }
                                                    program="1"
                                                    // callbackParent={refreshIssueReport}
                                                    source_form_name="IA_AUDITS"
                                                    subObjId={
                                                      formValues.objectId
                                                    }
                                                    callbackParent={
                                                      form.callbackFromChild
                                                    }
                                                  />
                                                }
                                                buttonText={
                                                  <>
                                                    <FontAwesomeIcon
                                                      icon={faPlusCircle}
                                                      size="lg"
                                                    />{" "}
                                                    {t("Add")}
                                                  </>
                                                }
                                              />
                                            </Col>
                                          </Row>
                                        )}
                                      <hr
                                        style={{
                                          backgroundColor: "#333",
                                          height: "3px",
                                        }}
                                      />
                                    </div>
                                  )}
                                  {wpType == 3 && (
                                    <div className="d-flex">
                                      <div className="col-md-10 me-1">
                                        <FormControl
                                          control={control}
                                          name={`CTL.${rowIndex}.ctControlName`}
                                          formMetaData={formMetaData}
                                          zIndex={true}
                                          formMethods={formMethods}
                                          hideTitle={ctr > 1 ? true : false}
                                        />
                                      </div>

                                      <div>
                                        <Col>
                                          <h6
                                            className={ctr > 1 ? "d-none" : ""}
                                          >
                                            Findings
                                          </h6>
                                        </Col>
                                        <Col className="h6 text-end mb-1">
                                          <ModalForm
                                            formname="issueobservation"
                                            objectId={-1}
                                            component={
                                              <FormRunTime
                                                formService="issueobservation"
                                                objectId={-1}
                                                modal
                                                ParentFormObjectId={
                                                  formValues.auditTitle
                                                }
                                                fndApprover={
                                                  formValues.wpAuditor
                                                }
                                                fndApproveBU={
                                                  formValues.businessUnit
                                                }
                                                program="1"
                                                // callbackParent={refreshIssueReport}
                                                source_form_name="IA_AUDITS"
                                                subObjId={formValues.objectId}
                                                callbackParent={
                                                  form.callbackFromChild
                                                }
                                              />
                                            }
                                            buttonText={
                                              <>
                                                <FontAwesomeIcon
                                                  icon={faPlusCircle}
                                                  size="lg"
                                                />{" "}
                                                {t("Add")}
                                              </>
                                            }
                                          />
                                        </Col>
                                      </div>
                                      <hr
                                        style={{
                                          backgroundColor: "#333",
                                          height: "3px",
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </div>
                          <Row className="mb-2 px-2">
                            {formMetaData.formmeta.accessCode == 1 &&
                              (formMethods.getValues("currentStage") ==
                                "AUDITOR" ||
                                formMethods.getValues("currentStage") ==
                                  "SUBMIT-CLARIFICATION") && (
                                <Button
                                  onClick={() =>
                                    TSTappend({
                                      tstParentControlId: controlId,
                                      tstParentRiskId: riskId,
                                      tstName: "",
                                      tstProcedure: "",
                                      tstId: "",
                                      tstResult: "",
                                    })
                                  }
                                >
                                  + {t("Add Test Scripts")}
                                </Button>
                              )}
                          </Row>
                          {TSTFields.map((titem, ti) => {
                            let TSTRecord = `TST.${ti}`;

                            if (
                              getValues(`${TSTRecord}.tstParentControlId`) ==
                                controlId &&
                              getValues(`${TSTRecord}.tstParentRiskId`) ==
                                riskId
                            ) {
                              return (
                                <>
                                  <Collapse
                                    key={`${TSTRecord}`}
                                    title={`${TSTRecord}.tstName`}
                                    secondaryTitle={
                                      <FormControl
                                        control={control}
                                        name={`${TSTRecord}.tstResult`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        disabled
                                        // singleRow
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
                                        : getValues(`${TSTRecord}.tstResult`) ==
                                          "2"
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
                                                  zIndex={true}
                                                  formMetaData={formMetaData}
                                                  formMethods={formMethods}
                                                  // disabled={getValues(
                                                  //   `${TSTRecord}.sourceProcedureId`
                                                  // )}
                                                  disabled={getValues(
                                                    `${TSTRecord}.tstTrigger`
                                                  )}
                                                  others
                                                  // required={true}
                                                />
                                              </div>
                                            </Row>
                                            <div>
                                              <Row>
                                                <Col>
                                                  <FormControl
                                                    control={control}
                                                    zIndex={true}
                                                    name={`${TSTRecord}.tstResult`}
                                                    formMetaData={formMetaData}
                                                    formMethods={formMethods}
                                                    editable={true}
                                                  />
                                                </Col>
                                              </Row>
                                            </div>
                                          </Col>
                                        </Form.Group>
                                      </Col>
                                      <Col>
                                        <FormControl
                                          control={control}
                                          zIndex={true}
                                          name={`${TSTRecord}.tstProcedure`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                          disabled={getValues(
                                            `${TSTRecord}.tstTrigger`
                                          )}
                                        />
                                      </Col>
                                      <Row>
                                        <Col className="col-md-4">
                                          <div>
                                            <FormControl
                                              control={control}
                                              zIndex={true}
                                              name={`${TSTRecord}.sampleTested`}
                                              formMetaData={formMetaData}
                                              formMethods={formMethods}
                                              editable={true}
                                              onKeyDown={(e) =>
                                                exceptThisSymbols.includes(
                                                  e.key
                                                ) && e.preventDefault()
                                              }
                                            />
                                          </div>
                                        </Col>
                                        <Col className="col-md-4">
                                          <div>
                                            <FormControl
                                              control={control}
                                              zIndex={true}
                                              name={`${TSTRecord}.samplePassed`}
                                              formMetaData={formMetaData}
                                              formMethods={formMethods}
                                              editable={true}
                                              onKeyDown={(e) =>
                                                exceptThisSymbols.includes(
                                                  e.key
                                                ) && e.preventDefault()
                                              }
                                              // watchFor={`${TSTRecord}.sampleTested`}
                                            />
                                          </div>
                                        </Col>
                                        <Col className="col-md-4">
                                          <div>
                                            <FormControl
                                              control={control}
                                              zIndex={true}
                                              name={`${TSTRecord}.sampleFailed`}
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
                                          zIndex={true}
                                          name={`${TSTRecord}.tstAttachments`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                          editable={true}
                                        />
                                        <FormControl
                                          control={control}
                                          zIndex={true}
                                          name={`${TSTRecord}.resultSummary`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                        />
                                      </Row>
                                      <Row>
                                        {formMetaData.formmeta.accessCode ==
                                          1 &&
                                          (formMethods.getValues(
                                            "currentStage"
                                          ) == "AUDITOR" ||
                                            formMethods.getValues(
                                              "currentStage"
                                            ) == "SUBMIT-CLARIFICATION") && (
                                            <Col className="mb-3">
                                              <Button
                                                type="button"
                                                variant="warning"
                                                className="float-end"
                                                onClick={() =>
                                                  deleteSectionforTST(
                                                    ti,
                                                    rowIndex
                                                  )
                                                }
                                                hidden={getValues(
                                                  `${TSTRecord}.tstTrigger`
                                                )}
                                              >
                                                {t("Remove")}
                                              </Button>
                                            </Col>
                                          )}
                                      </Row>
                                    </Row>
                                  </Collapse>
                                </>
                              );
                            }
                          })}
                        </>
                      );
                    })}
                  </Collapse>
                </>
              );
            })}
          </div>
        </Section>

        <Section title="Finding Details">
          <ReportRuntime
            refreshdataref={refreshdataref}
            report="IR_AUDIT_WP_FINDINGS"
            drilldownReports={{ wpId: formMethods.getValues("objectId") }}
          />
        </Section>

        <Section title="Result Summary">
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="proceduresPerformed"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="testResult"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="result"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>
        <Section title="Documents/Evidence">
          <Row>
            {DOCFields.map((docItem, doc) => {
              let DOCRecord = `DOC.${doc}`;
              return (
                <Row key={docItem.id}>
                  <Col lg={4} md={3} sm={12}>
                    <FormControl
                      control={control}
                      zIndex={true}
                      name={`${DOCRecord}.docCategory`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      hideTitle={doc > 0 ? true : false}
                    />
                  </Col>
                  <Col lg={6} md={9} sm={12}>
                    <FormControl
                      control={control}
                      zIndex={true}
                      name={`${DOCRecord}.docUploadEvidence`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      hideTitle={doc > 0 ? true : false}
                    />
                  </Col>
                  <Col style={doc == 0 ? { marginTop: "30px" } : {}}>
                    {formMetaData.formmeta.accessCode == 1 &&
                      (formMethods.getValues("currentStage") == "AUDITOR" ||
                        formMethods.getValues("currentStage") ==
                          "SUBMIT-CLARIFICATION") && (
                        <Col className="mb-3">
                          <Button
                            type="button"
                            variant="warning"
                            className="float-end"
                            onClick={() => deleteSectionforDOC(doc)}
                          >
                            {t("Remove")}
                          </Button>
                        </Col>
                      )}
                  </Col>
                </Row>
              );
            })}
            <Row>
              {formMetaData.formmeta.accessCode == 1 &&
                (formMethods.getValues("currentStage") == "AUDITOR" ||
                  formMethods.getValues("currentStage") ==
                    "SUBMIT-CLARIFICATION") && (
                  <Button type="button" onClick={addDOCRow}>
                    + {t("Add Documents/Evidence")}
                  </Button>
                )}
            </Row>
          </Row>
        </Section>

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
    </>
  );
};

export default FormLayout;
