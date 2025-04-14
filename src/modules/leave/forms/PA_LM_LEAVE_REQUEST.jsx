import { Container, Row, Col, Alert } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_LM_LEAVE_REQUEST_JS";
import { getviewData, getObjectData } from "../LeaveService";
import { useState, useEffect } from "react";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import Section from "src/components/forms/reactformutils/fields/Section";

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
    formState: { errors, touched, isSubmitting, isDirty },
  } = formMethods;

  const [daysFlag, setDaysFlag] = useState(false);
  const [daysAlert, setDaysAlert] = useState("");
  const [workday, setWorkday] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertShown, setIsAlertShown] = useState(false);
  const [gender, setGender] = useState("");
  const [userId, setuserId] = useState("");
  const [type, setLeave] = useState(0);

  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    formMetaData,
    formValues,
    setLeave,
    setGender,
    setuserId,
    setAlertMessage,
    setIsAlertShown,
    setWorkday,
    setDaysFlag,
    setDaysAlert,
    runtimeParams
  );

  const disabledButton = document.querySelector(".disbutton");

  if (disabledButton != null || disabledButton != undefined) {
    if (isAlertShown || daysFlag) {
      disabledButton.hidden = true;
    } else {
      disabledButton.hidden = false;
    }
  }

  return (
    <>
      <Row>
        <Col>
          <Container className="justify-content-center text-start ">
            <Row>
              <FormControl
                control={control}
                type="sselect"
                name="userId"
                formMetaData={formMetaData}
                formMethods={formMethods}
                FieldValue={true}
              />
            </Row>
            <Row>
              <Col>
                <FormControl
                  control={control}
                  type="select"
                  name="leaveType"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col>
                <FormControl
                  control={control}
                  type="select"
                  name="reasonFor"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <FormControl
                  control={control}
                  type="datepick"
                  name="leaveFrom"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  setClear
                  leaveType={type}
                  gender={gender}
                  userId={userId}
                  workday={workday}
                  watchFor="noOfDays"
                />
              </Col>
              <Col>
                <FormControl
                  control={control}
                  type="datepick"
                  name="leaveUntil"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  setClear
                  leaveType={type}
                  gender={gender}
                  userId={userId}
                  workday={workday}
                  watchFor="noOfDays"
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <FormControl
                  control={control}
                  type="switch"
                  name="firsthalfdayFrom"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>

              {/* <Col>
                <FormControl
                  control={control}
                  type="switch"
                  name="secondhalfdayFrom"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col> */}
              {/* <Col>
                <FormControl
                  control={control}
                  type="switch"
                  name="firsthalfdayUntil"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col> */}
              <Col>
                <FormControl
                  control={control}
                  type="input"
                  name="noOfDays"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  watchFor="leaveUntil"
                />
              </Col>
              {/* <Col>
                <FormControl
                  control={control}
                  type="switch"
                  name="secondhalfdayUntil"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col> */}
            </Row>

            {isAlertShown && (
              <Alert variant="danger" className="mt-2">
                {alertMessage}
              </Alert>
            )}
            {daysFlag && (
              <Alert variant="danger" className="mt-2">
                {daysAlert}
              </Alert>
            )}

            <Row>
              <FormControl
                control={control}
                type="textarea"
                name="reasonDetails"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Row>
            <Row>
              <FormControl
                control={control}
                type="singleattach"
                name="attachments"
                formMetaData={formMetaData}
                formMethods={formMethods}
                // required={false}
              />
            </Row>
            <Row>
              <FormControl
                control={control}
                type="SSelect"
                name="manager"
                formMetaData={formMetaData}
                formMethods={formMethods}
                FieldValue={true}
              />
            </Row>

            <Row>
              <FormControl
                control={control}
                type="textarea"
                name="comments"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Row>
          </Container>
          {formValues.objectId != null && (
            <Container className="justify-content-center text-start ">
              <Section title="Comments and Change History">
                <AuditTrail
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  formId={formMetaData.formmeta.form_id}
                  objectId={formValues.objectId}
                />
              </Section>
            </Container>
          )}
        </Col>
      </Row>
    </>
  );
};

export default FormLayout;
