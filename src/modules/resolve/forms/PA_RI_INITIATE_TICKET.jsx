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
import JSHook from "../../resolve/forms/PA_RI_INITIATE_TICKET_JS";
import { useState, useEffect } from "react";
import Section from "src/components/forms/reactformutils/fields/Section";
import useVisibility from "../../../components/forms/reactformutils/fields/FieldProperties";
import { getServiceData, getObjectData } from "../ResolveServices";
import { AlignJustify } from "react-feather";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import Popup from "src/components/forms/reactformutils/elements/Popup";
import BottomBar from "src/components/forms/reactformutils/elements/BottomBar";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
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

  formMetaData.form = JSHook(form, fields, formMethods, formValues);
  let [submissionPopup, setSubmissionPopup] = useState(false);
  const formApi = formMetaData.formmeta.api_handler.replace(/[/]/, "");
  const formObjectId =
    formMethods.getValues("objectId") == ""
      ? -1
      : formMethods.getValues("objectId");
  const request = formMethods.getValues("request");

  let action = formMethods.getValues("action");

  useEffect(() => {
    if (formValues.objectId == null) {
      // formMethods.setValue("status", "News");
      formMethods.setValue("currentStage", "QUEUE");
      formMethods.setValue("previousStage", "INITIATE");
    }
  }, []);

  if (action === 6) {
    formMetaData.fields.completion.required = false;
    formMetaData.fields.resolution.required = false;
  }
  return (
    <>
      <div>
        <Container className="justify-content-center  ">
          <SubSection title="General Information">
            <Row>
              <div className="col-md-9">
                <FormControl
                  control={control}
                  name="subject"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="ticketStatus"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>

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
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="businessUnit"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="requestType"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              {/* <div className="col-md-3">
                                <FormControl
                                    control={control}
                                    name="firstOccurrence"
                                    formMetaData={formMetaData}
                                    formMethods={formMethods}
                                />
                            </div> */}
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="reportedDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          </SubSection>
          <SubSection title="Service Information">
            <Row>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="impact"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="urgency"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="priority"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              {/* <div className="col-md-3">
                                <FormControl
                                    control={control}
                                    name="sla"
                                    formMetaData={formMetaData}
                                    formMethods={formMethods}
                                />
                            </div> */}
            </Row>

            <Row>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="groups"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="category"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>

              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="analyst"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              {/* <div className="col-md-3">
                                <FormControl
                                    control={control}
                                    name="specialist"
                                    formMetaData={formMetaData}
                                    formMethods={formMethods}
                                />
                            </div> */}
            </Row>
          </SubSection>
          <SubSection title="Resolution Details">
            <div className="col-md-6">
              <FormControl
                control={control}
                name="completion"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="resolution"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="attachments"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </SubSection>
          {/* <div>
            {submissionPopup && (
              <Popup
                header={"Submission Comments"}
                content={
                  <>
                    {submissionPopup == "Queue" && (
                      <Col>
                        <FormControl
                          control={control}
                          name="comments"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                        />
                      </Col>
                    )}
                    {submissionPopup == "IT" && action != 6 && (
                      <Col>
                        <FormControl
                          control={control}
                          name="comments"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                        />
                      </Col>
                    )}
                    {submissionPopup == "HR" && (
                      <Col>
                        <FormControl
                          control={control}
                          name="comments"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                        />
                      </Col>
                    )}
                    {submissionPopup == "Resolved" && (
                      <Col>
                        <FormControl
                          control={control}
                          name="comments"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                        />
                      </Col>
                    )}
                    {submissionPopup == "IT" && action == 6 && (
                      <Col>
                        <Row>
                          <FormControl
                            control={control}
                            name="analyst"
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            disabled={false}
                            required={true}
                          />
                          <FormControl
                            control={control}
                            name="comments"
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            required={true}
                          />
                        </Row>
                      </Col>
                    )}
                  </>
                }
                formObjectId={formObjectId}
                formApi={formApi}
                form={form}
                // datahandle={props.datahandle}
                runtimeParams={runtimeParams}
                closePopup={setSubmissionPopup}
              />
            )}
          </div> */}
          {/* <div className="text-center py-2 d-flex justify-content-end sticky-bottom shadow bg-white z-0">
                        <BottomBar
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            // dataHandle={props.dataHandle}
                            form={form}
                            runtimeParams={runtimeParams}
                            subPopup={setSubmissionPopup}
                        />
                    </div> */}

          {formObjectId !== -1 && (
            <>
              {" "}
              <AuditTrail
                formMetaData={formMetaData}
                formMethods={formMethods}
                formId={formMetaData.formmeta.form_id}
                objectId={formValues.objectId}
                enableAddComment={formValues.status == "Closed" ? false : true}
              />
            </>
          )}
        </Container>
        {/* <div className="text-center py-2 d-flex justify-content-end sticky-bottom shadow bg-white z-0">
          <BottomBar
            formMetaData={formMetaData}
            formMethods={formMethods}
            // dataHandle={props.dataHandle}
            form={form}
            runtimeParams={runtimeParams}
            subPopup={setSubmissionPopup}
          />
        </div> */}
      </div>
    </>
  );
};

export default FormLayout;
