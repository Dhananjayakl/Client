import { Button, Container, Row, Col } from "react-bootstrap";
import { useFieldArray, useWatch } from "react-hook-form";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import JSHook from "./PA_BR_BUSINESS_CONTINUITY_PLAN_JS";
import React, { useEffect, useState } from "react";
import ReportRuntime from "src/components/reports/Report";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
const FormLayout = (props) => {
  let { formMethods, formMetaData, formValues, form, runtimeParams } = props;
  const {
    control,
    formState: {},
  } = formMethods;

  const {
    fields: idmFields,
    append: appendIdm,
    remove: removeIdm,
  } = useFieldArray({
    name: "IDM",
    control,
  });

  const addIdmRow = () => {
    appendIdm({
      idmId: "",
      name: "",
      division: "",
      officeNumber: "",
      mobileNumber: "",
    });
  };

  const {
    fields: ccmFields,
    append: appendccm,
    remove: removeccm,
  } = useFieldArray({
    name: "CCM",
    control,
  });

  const addCcmRow = () => {
    appendccm(
      {
        ccmId: "",
        ccmName: "",
        ccmofficeNo: "",
        ccmmobileNo: "",
        ccmComments: "",
      },
      { shouldFocus: false }
    );
  };

  const {
    fields: paFields,
    append: appendpa,
    remove: removepa,
  } = useFieldArray({
    name: "PAP",
    control,
  });

  const addPaRow = () => {
    const newRowIndex = paFields.length + 1;
    appendpa(
      {
        paId: "",
        paRisk: "",
        paImpactedFunctions: "",
        paComments: "",
        riskId: newRowIndex.toString(),
      },
      { shouldFocus: false }
    );
  };

  const {
    fields: ptFields,
    append: appendpt,
    remove: removept,
  } = useFieldArray({
    name: "PTA",
    control,
  });

  const addPtRow = () => {
    appendpt(
      {
        ptid: "",
        ptRisk: "",
        ptTaskName: "",
        ptTaskOwner: "",
        ptTimeAllocated: "",
        ptComments: "",
      },
      { shouldFocus: false }
    );
  };

  const [reportFilter, setReportfilter] = useState("");

  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    control,
    addPaRow,
    addPtRow,
    runtimeParams,
    setReportfilter,
    removept
  );
  const planApplicable = useWatch({
    control: control,
    name: "PAP",
  });

  let [dropDown, setDropDown] = useState([]);
  let [opt, setopt] = useState("");
  console.log(opt, dropDown, "optoptopt");
  let dropArray = new Array();

  useEffect(() => {
    setDropDown(
      planApplicable?.map((items) => {
        return items.paRisk;
      })
    );

    console.log(dropArray, "dropper");
  }, [planApplicable]);

  form.paRisk.onChange(function (value, row) {
    if (dropDown?.length > 0) {
      const lastIndex = dropDown.length - 1;
      console.log(lastIndex, row, dropDown[lastIndex], "last inex1");
      if (dropDown[lastIndex] == "" && row == lastIndex) {
        setDropDown((prevDropDown) => {
          const newArray = [...prevDropDown];
          newArray[row] = value;
          return newArray;
        });
      }
    }
  });

  useEffect(() => {
    setopt(
      dropDown?.map((items, index) => {
        if (items) {
          return { value: index + 1, label: items };
        } else {
          return "";
        }
      })
    );
  }, [dropDown]);

  let accessCode = formMetaData.formmeta.accessCode;
  let currentStage = formMethods.getValues("currentStage");
  let stageFlag = false;
  const exceptThisSymbols = ["e", "E", "+", "-", "."];
  if (currentStage === "APPROVER" || formMetaData.formmeta.accessCode === 9) {
    stageFlag = true;
  } else {
    stageFlag = false;
  }

  const refreshdataref = React.useRef(null);
  runtimeParams.refreshdataref = refreshdataref;

  return (
    <>
      <Container className="justify-content-center  ">
        <Section title="General" required>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="planName"
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
                name="businessUnit"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="processAsset"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FormControl
                control={control}
                name="planOwner"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="planApprover"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FormControl
                control={control}
                name="frequencyReview"
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
        <Section title="BIA & Recovery Strategy" required>
          <div>
            <ReportRuntime
              refreshdataref={refreshdataref}
              report="BR_BIA_RECOVERY_STRATEGY"
              ChartdrilldownReports={`master_object_id IN (${reportFilter})`}
            />
          </div>
        </Section>

        <Section title="General Section">
          <Row>
            <FormControl
              control={control}
              name="objective"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
          <Row>
            <FormControl
              control={control}
              name="scope"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>{" "}
          <Row>
            <FormControl
              control={control}
              name="planExclusions"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
          <Row>
            <FormControl
              control={control}
              name="planInvocation"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
          <Row>
            <FormControl
              control={control}
              name="planOwnership"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
          <Row>
            <FormControl
              control={control}
              name="planReview"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
        </Section>
        <Section title="Incident Definition & Management" required>
          <SubSection title="Crisis Management Team - Department / Function / Process Name">
            <div
              style={{
                overflowX: "auto",
                maxWidth: "100%",
              }}
            >
              {idmFields.map((row, rowIndex) => (
                <Row key={row.id}>
                  <Col xs={12} md={12} lg={12}>
                    <div>
                      <div className="d-flex">
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`IDM.${rowIndex}.name`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                        <div className="col-md-3 me-3 ">
                          <FormControl
                            control={control}
                            name={`IDM.${rowIndex}.division`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`IDM.${rowIndex}.officeNumber`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`IDM.${rowIndex}.mobileNumber`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>

                        <div
                          className={
                            rowIndex == "0" ? " col-md mt-4" : " col-md mt-0"
                          }
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            color="#FF0000"
                            onClick={() => removeIdm(rowIndex)}
                            style={{ cursor: "pointer" }}
                            size="2x"
                            hidden={accessCode === 7 || stageFlag}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              ))}
            </div>
            <Row>
              <Button
                type="button"
                onClick={addIdmRow}
                hidden={accessCode === 7 || stageFlag}
              >
                + Add Crisis Management Team
              </Button>
            </Row>
          </SubSection>

          <SubSection title="Central Crisis Management Team Contact Information">
            <Row>
              <Col>
                <FormControl
                  control={control}
                  name="office"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col
                className="mt-5 "
                style={{ marginRight: "-130px", marginLeft: "80px" }}
              >
                <label className="text-dark form-label mb-0">
                  Conference Bridge Details
                  <span className="text-danger mb-0 pb-0"></span>
                </label>
              </Col>
              <Col>
                <Row
                  style={{
                    marginTop: "-15px",
                    marginLeft: "-80px",
                  }}
                >
                  <FormControl
                    control={control}
                    name="bridgeNumber"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    field_title=""
                    required={false}
                    onKeyDown={(e) =>
                      exceptThisSymbols.includes(e.key) && e.preventDefault()
                    }
                  />
                </Row>
                <Row
                  style={{
                    marginTop: "-15px",
                    marginLeft: "-80px",
                  }}
                >
                  <FormControl
                    control={control}
                    name="bridgePasscode"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    field_title=""
                    required={false}
                  />
                </Row>
              </Col>
            </Row>
            <hr style={{ backgroundColor: "#333", height: "3px" }} />
            <div
              style={{
                overflowX: "auto",
                maxWidth: "100%",
              }}
            >
              {ccmFields.map((row, rowIndex) => (
                <Row key={row.id}>
                  <Col xs={12} md={12} lg={12}>
                    <div>
                      <div className="d-flex">
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`CCM.${rowIndex}.ccmName`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                        <div className="col-md-3 me-3 ">
                          <FormControl
                            control={control}
                            name={`CCM.${rowIndex}.ccmofficeNo`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`CCM.${rowIndex}.ccmmobileNo`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`CCM.${rowIndex}.ccmComments`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                        <div
                          className={
                            rowIndex == "0" ? " col-md mt-4" : " col-md mt-0"
                          }
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            color="#FF0000"
                            onClick={() => removeccm(rowIndex)}
                            style={{ cursor: "pointer" }}
                            size="2x"
                            hidden={accessCode === 7 || stageFlag}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              ))}
            </div>
            <Row>
              <Button
                type="button"
                onClick={addCcmRow}
                hidden={accessCode === 7 || stageFlag}
              >
                + Add Central Crisis Management
              </Button>
            </Row>
          </SubSection>
          <SubSection title={"Plan Applicability"}>
            <div
              style={{
                overflowX: "auto",
                maxWidth: "100%",
              }}
            >
              {paFields.map((row, rowIndex) => (
                <Row key={row.id}>
                  <Col xs={12} md={12} lg={12}>
                    <div>
                      <div className="d-flex">
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`PAP.${rowIndex}.paRisk`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                        <div className="col-md-4 me-3 ">
                          <FormControl
                            control={control}
                            name={`PAP.${rowIndex}.paImpactedFunctions`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                        <div className="col-md-4 me-3">
                          <FormControl
                            control={control}
                            name={`PAP.${rowIndex}.paComments`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                        {paFields.length > 1 && (
                          <div
                            className={
                              rowIndex == "0" ? " col-md mt-4" : " col-md mt-0"
                            }
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              color="#FF0000"
                              onClick={() => {
                                removepa(rowIndex);
                              }}
                              style={{ cursor: "pointer" }}
                              size="2x"
                              hidden={accessCode === 7 || stageFlag}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              ))}
            </div>
            <Row>
              <Button
                type="button"
                onClick={addPaRow}
                hidden={accessCode === 7 || stageFlag}
              >
                + Add Plan Applicability
              </Button>
            </Row>
          </SubSection>
          <SubSection title={" Plan Tasks"}>
            <div
              style={{
                overflowX: "auto",
                maxWidth: "100%",
              }}
            >
              {ptFields.map((row, rowIndex) => (
                <Row key={row.id}>
                  <Col xs={12} md={12} lg={12}>
                    <div>
                      <div className="d-flex">
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`PTA.${rowIndex}.ptRisk`}
                            formMetaData={formMetaData}
                            zIndex={true}
                            dropDownFlag={true}
                            customDropdown={opt}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                        <div className="col-md-3 me-2">
                          <FormControl
                            control={control}
                            name={`PTA.${rowIndex}.ptTaskName`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`PTA.${rowIndex}.ptTaskOwner`}
                            formMetaData={formMetaData}
                            zIndex={true}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`PTA.${rowIndex}.ptTimeAllocated`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>{" "}
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`PTA.${rowIndex}.ptComments`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                        {ptFields.length > 1 && (
                          <div
                            className={
                              rowIndex == "0" ? " col-md mt-4" : " col-md mt-0"
                            }
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              color="#FF0000"
                              onClick={() => {
                                removept(rowIndex);
                              }}
                              style={{ cursor: "pointer" }}
                              size="2x"
                              hidden={accessCode === 7 || stageFlag}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              ))}
            </div>
            <Row>
              <Button
                type="button"
                onClick={addPtRow}
                hidden={accessCode === 7 || stageFlag}
              >
                + Add Plan Tasks
              </Button>
            </Row>
          </SubSection>
        </Section>
        <Row>
          <FormControl
            control={control}
            name="comments"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
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
