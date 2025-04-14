import {
  Container,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
  Table,
  Button,
} from "react-bootstrap";
import Section from "src/components/forms/reactformutils/fields/Section";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_KRI_TASK_JS";
import { useFieldArray, useWatch } from "react-hook-form";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ReportRuntime from "src/components/reports/Report";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";
import React from "react";
import Grid from "src/components/forms/reactformutils/Grid";

import { useEffect } from "react";
let FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;

  const {
    control,
    getValues,

    formState: {},
  } = formMethods;
  const refreshdataref = React.useRef(null);
  runtimeParams.refreshdataref = refreshdataref;
  const KRIsub = useFieldArray({
    name: "SUB",
    control,
  });

  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };

  const [deletedSectionKey, setDeletedSectionKey] = useState(0);
  const [DataValue, setDataValue] = useState("");

  useEffect(() => {
    const hierarchyValue = formMethods.getValues("kriValue");
    if (hierarchyValue && hierarchyValue !== " " && hierarchyValue !== null) {
      setDataValue(hierarchyValue);
    }
  });

  form.kriValue.onChange(function (value, row) {
    setDataValue(value);
  });

  const {
    fields: SUBFields,
    append: SUBappend,
    remove: SUBremove,
  } = useFieldArray({
    name: "SUB",
    control,
  });

  const {
    fields: FNDFields,
    append: FNDappend,
    remove: FNDremove,
  } = useFieldArray({
    name: "FND",
    control,
  });

  const View = formMetaData.formmeta.accessCode;
  const [bgc, setBgc] = useState("");
  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    runtimeParams,
    control,
    SUBFields,
    FNDFields,
    setBgc,
    setDataValue
  );
  const exceptThisSymbols = ["e", "E", "+", "-", "."];
  const Frequency = useWatch({
    control: control,
    name: "frequency",
  });
  const schStartDate = useWatch({
    control: control,
    name: "startDate",
  });

  return (
    <>
      <Container className="justify-content-center  ">
        <Section title="General">
          <Row>
            <Col>
              <Row>
                <Col md={12}>
                  <FormControl
                    control={control}
                    name="name"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    singleRow
                    labelSize={4}
                  />
                </Col>
              </Row>

              <Row>
                <Row>
                  <h5>Schedule</h5>
                </Row>
                <hr></hr>
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
                {Frequency == "8" || Frequency == "1" ? (
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
                          Frequency == "8"
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
                    <div className="col-md-3 mt-2">
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
                          Frequency == "8"
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
              </Row>
              <Row>
                <Col md={12}>
                  <FormControl
                    control={control}
                    name="sourceKri"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    singleRow
                    labelSize={4}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormControl
                    control={control}
                    name="owner"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    singleRow
                    labelSize={4}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col md={5}>
                  <FormControl
                    control={control}
                    name="computation"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    hideTitle
                    singleRow
                  />
                </Col>
              </Row>
              <Col md={10}>
                <FormControl
                  control={control}
                  name="type"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                />
              </Col>
              <Row>
                {" "}
                <h5>Threshold</h5>
              </Row>

              <hr></hr>
              <Col>
                <div md={10}>
                  <FormControl
                    control={control}
                    name="high"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    singleRow
                  />
                </div>
              </Col>
              <Col>
                <div md={10}>
                  <FormControl
                    control={control}
                    name="medium"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    singleRow
                  />
                </div>
              </Col>

              <Col>
                <div md={10}>
                  <FormControl
                    control={control}
                    name="low"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    singleRow
                  />
                </div>
              </Col>
            </Col>
          </Row>

          <Row>
            <h5>Applicability</h5>
          </Row>
          <hr></hr>
          <Row>
            <Row>
              <Col md={4}>
                <FormControl
                  control={control}
                  name="riskCategory"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                  labelSize={4}
                />
              </Col>

              <Col md={4}>
                <FormControl
                  control={control}
                  name="process"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                  labelSize={4}
                />
              </Col>

              <Col md={4}>
                <FormControl
                  control={control}
                  name="risk"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                  labelSize={4}
                />
              </Col>
            </Row>
          </Row>
        </Section>

        <Section title="Response">
          {formMethods.getValues("computation") && (
            <>
              <Col md={6}>
                <FormControl
                  control={control}
                  name="logic"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                  labelSize={4}
                />
              </Col>

              <Row>
                <Grid
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  region="SUB"
                  columns={[
                    { name: "subTitle", length: 5 },
                    { name: "subOwner", length: 4 },
                    { name: "subValue", length: 3 },
                  ]}
                  actions={{ add: false, remove: false }}
                  formValues={formValues}
                  // disableOnNextStage={true}
                  helpers={KRIsub}
                  disabled={true}
                />
              </Row>
            </>
          )}
          <Row className="mt-4">
            <Col md={3}>
              <FormControl
                control={control}
                name="kriValue"
                formMetaData={formMetaData}
                formMethods={formMethods}
                onKeyDown={(e) =>
                  exceptThisSymbols.includes(e.key) && e.preventDefault()
                }
              />
            </Col>
            {DataValue !== null && DataValue !== "" && (
              <Col className="mt-4 pt-1 text-center" xs={1}>
                <div
                  className={`py-1 px-1 rounded-pill text-uppercase align-items-center ${bgc}`}
                >
                  <div className="mt-2">
                    <FormControl
                      control={control}
                      name="threshold"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      hideTitle
                      textColor={"white"}
                    />
                  </div>
                </div>
              </Col>
            )}
          </Row>
          <Row md={1}>
            <FormControl
              control={control}
              name="kriComments"
              formMetaData={formMetaData}
              formMethods={formMethods}
              disabled={View !== 1 ? true : false}
              required={true}
            />
          </Row>
        </Section>
        <Section title="Findings">
          {View === 1 && (
            <div>
              <ButtonToolbar
                className="justify-content-center mb-1"
                aria-label="Toolbar with Action Management"
              >
                <ButtonGroup aria-label="First group" className="flex-grow-1">
                  <ModalForm
                    objectId={-1}
                    component={
                      <FormRunTime
                        formService="issueobservation"
                        objectId={-1}
                        modal
                        program="7"
                        source_form_name="GL_KRI_TASK"
                        ParentFormObjectId={formMethods.getValues("objectId")}
                        type="1"
                        callbackParent={form.callbackFromChild}
                      />
                    }
                    buttonText={
                      <>
                        <FontAwesomeIcon icon={faPlusCircle} size="lg" /> Add
                        Findings
                      </>
                    }
                    size="xl"
                  />
                </ButtonGroup>
              </ButtonToolbar>
            </div>
          )}
          <ReportRuntime
            refreshdataref={refreshdataref}
            formcallbackParent={form.callbackFromChild}
            report="IR_KRI_FINDING"
            drilldownReports={{
              objectId: formValues.objectId,
            }}
          />
        </Section>
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
        {formValues.objectId != null && (
          <Container className="justify-content-center">
            <AuditTrail
              formMetaData={formMetaData}
              formMethods={formMethods}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
              enableAddComment={formValues.status == "Closed" ? false : true}
            />
          </Container>
        )}
      </Container>
    </>
  );
};

export default FormLayout;
