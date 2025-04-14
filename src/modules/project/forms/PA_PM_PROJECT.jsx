import React from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useFieldArray } from "react-hook-form";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import { useEffect, useMemo, useState } from "react";
import JSHook from "./PA_PM_PROJECT_JS";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import ReportRuntime from "src/components/reports/Report";
import { useTranslation } from "react-i18next";
let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    callbackToParent,
    formValues,
    runtimeParams,
  } = props;
  const { t } = useTranslation();
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

  const {
    fields: MSFields,
    append: MSappend,
    remove: MSremove,
  } = useFieldArray({
    name: "MS",
    control,
  });
  const addMSRow = () => {
    MSappend({
      proposedMilestoneDate: "",
      actualDate: "",
      status: "",
      milestoneTitle: "",
      MSID: "",
    });
  };
  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    MSFields,
    formValues,
    control
  );
  let accessCode = formMetaData.formmeta.accessCode;
  return (
    <>
      <Container className="justify-content-center">
        <Section title="Project Information" required>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="projectTitle"
                formMetaData={formMetaData}
                formMethods={formMethods}
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
            <div className="col-md-6">
              <FormControl
                control={control}
                name="projectType"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="projectCategory"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="apps"
                type="PicklistSelect"
                isMulti={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <SubSection title="Project Details" required>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="proposedProjectStartDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  // futureDate={true}
                  // futureDateValue={formMethods.getValues(
                  //   "proposedProjectStartDate"
                  // )}
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="proposedProjectEndDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate={true}
                  futureDateValue={formMethods.getValues(
                    "proposedProjectStartDate"
                  )}
                />
              </div>
            </Row>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="actualStartDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="actualEndDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate={true}
                  futureDateValue={formMethods.getValues("actualStartDate")}
                />
              </div>
            </Row>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="estimatedHours"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="actualHours"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="projectPriority"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="projectStatus"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
            {formValues.objectId > 0 && (
              <Row>
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="projectRisks"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            )}
          </SubSection>
          <SubSection title="Team Members" required>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="projectManager"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="teamMembers"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          </SubSection>
        </Section>
        <Section title="MileStones" required>
          <div
            style={{
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            {MSFields.map((row, rowIndex) => (
              <Row key={row.id}>
                <Col xs={12} md={12} lg={12}>
                  <div>
                    <div
                      className="d-flex"
                      // style={{
                      //   minWidth: "max-content",
                      // }}
                    >
                      <div className="col-md-3 me-3">
                        <FormControl
                          control={control}
                          name={`MS.${rowIndex}.milestoneTitle`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          hideTitle={rowIndex > 0 ? true : false}
                        />
                      </div>
                      <div className="col-md-3 me-2">
                        <FormControl
                          control={control}
                          name={`MS.${rowIndex}.proposedMilestoneDate`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          futureDate={true}
                          futureDateValue={formMethods.getValues(
                            "proposedProjectStartDate"
                          )}
                          hideTitle={rowIndex > 0 ? true : false}
                        />
                      </div>
                      <div className="col-md-3 me-3">
                        <FormControl
                          control={control}
                          name={`MS.${rowIndex}.actualDate`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          // futureDate={true}
                          // futureDateValue={formMethods.getValues(
                          //   `MS.${rowIndex}.proposedMilestoneDate`
                          // )}
                          hideTitle={rowIndex > 0 ? true : false}
                        />
                      </div>
                      <div className="col-md-3 me-3">
                        <FormControl
                          control={control}
                          name={`MS.${rowIndex}.status`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          hideTitle={rowIndex > 0 ? true : false}
                        />
                      </div>

                      {MSFields[rowIndex].MSID == "" && (
                        <div
                          className={
                            rowIndex == "0" ? " col-md mt-4" : " col-md mt-0"
                          }
                        >
                          <Button
                            type="button"
                            variant="warning"
                            className="float-end"
                            onClick={() => MSremove(rowIndex)}
                            hidden={accessCode === 7}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            ))}
          </div>
          <Row>
            <Button type="button" onClick={addMSRow} hidden={accessCode === 7}>
              + Add MileStones
            </Button>
          </Row>
        </Section>
        {formValues.objectId > 0 && (
          <Section title="Task Details">
            <ReportRuntime
              refreshdataref={refreshdataref}
              report="PM_PROJECT_TASK_INLINE_RPT"
              drilldownReports={{
                projectId: formMethods.getValues("objectId"),
              }}
            />
          </Section>
        )}
        {formValues.objectId > 0 && (
          <Section title="Closure Summery" required>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="closureDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  // futureDate={true}
                  // futureDateValue={formMethods.getValues(
                  //   "proposedProjectStartDate"
                  // )}
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="closureReports"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
            <Row>
              <FormControl
                control={control}
                type="textarea"
                name="closureComments"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Row>
          </Section>
        )}
      </Container>
      {formValues.objectId != null && (
        // <Container className="justify-content-center  ">
        //   <Section title="Comments and Change History">
            <AuditTrail
              formMetaData={formMetaData}
              formMethods={formMethods}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
            />
        //   </Section>
        // </Container>
      )}
    </>
  );
};

export default FormLayout;
