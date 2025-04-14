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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useFieldArray } from "react-hook-form";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import { useEffect, useMemo, useState } from "react";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import JSHook from "./PA_PM_PROJECT_TASKS_JS";
import BottomBar from "src/components/forms/reactformutils/elements/BottomBar";
import Popup from "src/components/forms/reactformutils/elements/Popup";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import ReportRuntime from "src/components/reports/Report";
import { useTranslation } from "react-i18next";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    table,
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

  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    control
  );
  console.log("jjjjjjjjj", formMethods);
  const refreshTaskReportRef = React.useRef(null);
  let refreshTaskReport = (props) => {
    refreshdataref.current();
  };
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  if (formValues.objectId > 0) {
    useEffect(() => {
      const checkIfEndDateReached = () => {
        const endDate = new Date(getValues("plannedTaskEndDate"));
        console.log(endDate, "gvhkvukyflu");
        const currentDate = new Date();
        const formatCurrentDate = currentDate.toISOString().split("T")[0];
        const formatEndDate = endDate.toISOString().split("T")[0];
        if (formatCurrentDate > formatEndDate) {
          setShowAdditionalFields(true);
        } else {
          setShowAdditionalFields(false);
        }
      };

      checkIfEndDateReached();
    }, [getValues]);
  }
  let accessCode = formMetaData.formmeta.accessCode;
  let currentstage = formMethods.getValues("currentStage");
  let [submissionPopup, setSubmissionPopup] = useState(false);
  const formApi = formMetaData.formmeta.api_handler.replace(/[/]/, "");
  const formObjectId =
    formMethods.getValues("objectId") == ""
      ? -1
      : formMethods.getValues("objectId");
  return (
    <>
      <Container className="justify-content-center">
        <Section title="Task Information" required>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="taskTitle"
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
                name="taskDesc"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            {/* <div className="col-md-4">
              <FormControl
                control={control}
                name="categorization"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
              <FormControl
                control={control}
                name="taskPriority"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div> */}
          </Row>
          <Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="categorization"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="taskPriority"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="percentageOfCompletion"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          <SubSection title="Project Information" required>
            <Row>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="projectName"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  closeButton={true}
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="productName"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  closeButton={true}
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="taskAssignee"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          </SubSection>
          <SubSection title="Task Details" required>
            <Row>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="plannedTaskStartDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  // futureDate={true}
                  // futureDateValue={formMethods.getValues(
                  //   "proposedProjectStartDate"
                  // )}
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="plannedTaskEndDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate={true}
                  futureDateValue={formMethods.getValues(
                    "plannedTaskStartDate"
                  )}
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="hoursAllocated"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          </SubSection>
        </Section>

        {currentstage != "INITIATE" && (
          <Section title="Activity Details">
            <Col className="h6 text-end mb-1">
              <ModalForm
                formService="taskactivities"
                objectId={-1}
                component={
                  <FormRunTime
                    formService="taskactivities"
                    objectId={-1}
                    // notform={true}
                    modal
                    ParentFormObjectId={formObjectId}
                    callbackParent={refreshTaskReport}
                  />
                }
                buttonText={
                  <>
                    <FontAwesomeIcon icon={faPlusCircle} size="lg" /> Add
                    Activities
                  </>
                }
              />
            </Col>

            <ReportRuntime
              refreshdataref={refreshdataref}
              report="PM_TASK_ACTIVITIES"
              drilldownReports={{ taskId: formMethods.getValues("objectId") }}
            />
          </Section>
        )}
        <Section title="References">
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="attachments"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          {/* <div>
            {submissionPopup && (
              <Popup
                header={
                  submissionPopup == "Send for Review"
                    ? "Send for Review"
                    : submissionPopup
                }
                content={
                  <>
                    {submissionPopup == "Send for Review" &&
                      submissionPopup !== "Submit" && (
                        <>
                          <Col>
                            <FormControl
                              control={control}
                              name="taskReviewer"
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              // isMulti={false}
                            />
                          </Col>
                          <Col>
                            {showAdditionalFields && (
                              <>
                                <div className="col-md-12">
                                  <FormControl
                                    control={control}
                                    name="delay"
                                    formMetaData={formMetaData}
                                    formMethods={formMethods}
                                  />
                                </div>
                              </>
                            )}
                          </Col>
                        </>
                      )}
                    {submissionPopup == "On Hold" &&
                      submissionPopup !== "Submit" && (
                        <>
                          <div className="col-md-12">
                            <FormControl
                              control={control}
                              name="reason"
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                            />
                          </div>
                        </>
                      )}
                    <Col>
                      <FormControl
                        control={control}
                        name="comments"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </Col>
                  </>
                }
                formObjectId={formObjectId}
                formApi={formApi}
                form={form}
                runtimeParams={runtimeParams}
                closePopup={setSubmissionPopup}
              />
            )}
          </div> */}
        </Section>
        {formValues.objectId != null && (
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
          />
        )}
        {/* <BottomBar
          formMetaData={formMetaData}
          formMethods={formMethods}
          form={form}
          runtimeParams={runtimeParams}
          subPopup={setSubmissionPopup}
        /> */}
      </Container>
    </>
  );
};

export default FormLayout;
