import {
  Container,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_CT_OBLIGATION_TASK_JS";
import { useState } from "react";
import Section from "src/components/forms/reactformutils/fields/Section";
import { useFieldArray, useWatch } from "react-hook-form";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ReportRuntime from "src/components/reports/Report";
import React from "react";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
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

  const [deletedSectionKey, setDeletedSectionKey] = useState(0);

  let stage = formMethods.getValues("currentStage");

  const showRequestDate =
    formMethods?.getValues("currentStage") === "DUE DATE CLARIFICATION";
  console.log(showRequestDate, "showRequestDateshowRequestDate");

  const showRequestDates = formMethods?.getValues("currentStage") === "PERFORM";
  const check = showRequestDate || showRequestDates;

  const schStartDate = useWatch({
    control: control,
    name: "schStartDate",
  });

  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formValues,
    formMetaData,
    control
  );
  let action = formMethods.getValues("action");
  const refreshdataref = React.useRef(null);
  runtimeParams.refreshdataref = refreshdataref;
  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };

  let Stage = formMethods.getValues("currentStage");

  if (action == 4 || action == 3) {
    formMetaData.fields.percentageCompletion.required = false;
    formMetaData.fields.resolution.required = false;
  } else if (action == 5 || action == 6) {
    formMetaData.fields.percentageCompletion.required = false;
    formMetaData.fields.resolution.required = false;
    formMetaData.fields.comments.required = true;
  } else {
    formMetaData.fields.percentageCompletion.required = true;
    formMetaData.fields.resolution.required = true;
  }

  const View = formMetaData.formmeta.accessCode;

  if (check === true) {
    formMetaData.fields.oldDueDate.visible = true;
  }

  return (
    <div>
      <Container className="justify-content-center  ">
        <Section title="Details">
          <Row>
            <Col className="ps-4 col-md-9">
              <div>
                <FormControl
                  control={control}
                  name="deliverable"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Col>
            <Col className="col-md-3">
              <div>
                <FormControl
                  control={control}
                  name="category"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <div className="ps-4 col-md-12">
              <FormControl
                control={control}
                name="reportingObligation"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row></Row>

          <Row>
            <Col>
              <SubSection title="Scope">
                <Row>
                  <div className=" col-md-12">
                    <FormControl
                      control={control}
                      name="source"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={4}
                    />
                  </div>
                  <div className="col-md-12">
                    <FormControl
                      control={control}
                      name="reference"
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
              <SubSection title="Schedule">
                <Row>
                  <div className=" col-md-12">
                    <FormControl
                      control={control}
                      name="schedule"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={4}
                    />
                  </div>

                  <div className="col-md-12">
                    <FormControl
                      control={control}
                      name="schStartDate"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={4}
                    />
                  </div>

                  <div className="col-md-12">
                    <FormControl
                      control={control}
                      name="dueDate"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={4}
                      futureDate
                      required={true}
                      futureDateValue={new Date(schStartDate).setDate(
                        new Date(schStartDate).getDate()
                      )}
                    />
                  </div>
                  {stage === "DUE DATE CLARIFICATION" && (
                    <div>
                      <FormControl
                        control={control}
                        name="oldDueDate"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        singleRow
                        labelSize={4}
                      />
                    </div>
                  )}
                </Row>
              </SubSection>
            </Col>
            <Col>
              <SubSection title="Respondent">
                <Row>
                  <div className=" col-md-12">
                    <FormControl
                      control={control}
                      name="responsibleBusinessUnit"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={5}
                    />
                  </div>
                  <div className="col-md-12">
                    <FormControl
                      control={control}
                      name="reportOwners"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      singleRow
                      labelSize={5}
                    />
                  </div>
                </Row>
              </SubSection>
            </Col>
          </Row>
        </Section>
        {!showRequestDate && (
          <Section title="Resolution Details">
            <Row>
              <div className="ps-4 col-md-4">
                <FormControl
                  control={control}
                  name="percentageCompletion"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="ps-4 col-md-8">
                <FormControl
                  control={control}
                  name="resolution"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>

            <Section title="Addtional Details">
              <div className="col-md-12">
                <FormControl
                  control={control}
                  name="attachment"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Section>
          </Section>
        )}

        <Section title="Findings">
          {Stage !== "CANCEL TASK" && View !== 9 && (
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
                        program="8"
                        source_form_name="CT_OBLIGATION_TASK"
                        ParentFormObjectId={formMethods.getValues("objectId")}
                        type="1"
                        callbackParent={form.callbackFromChild}
                        fndApprover={formMethods.getValues("reportOwners")}
                        fndBusinessUnit={formMethods.getValues(
                          "responsibleBusinessUnit"
                        )}
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
            report="IR_OBLIGATION_FINDING"
            drilldownReports={{
              objectId: formMethods.getValues("objectId"),
            }}
          />
        </Section>
        <AuditTrail
          formMetaData={formMetaData}
          formMethods={formMethods}
          formId={formMetaData.formmeta.form_id}
          objectId={formValues.objectId}
          enableAddComment={formValues.status == "Closed" ? false : true}
        />
      </Container>
    </div>
  );
};

export default FormLayout;
