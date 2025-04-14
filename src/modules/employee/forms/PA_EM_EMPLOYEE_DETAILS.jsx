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
import JSHook from "./PA_EM_EMPLOYEE_DETAILS_JS";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import Section from "src/components/forms/reactformutils/fields/Section";
import { useState, useEffect } from "react";
import { checkEmployeeCode } from "../EmployeeService";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    form,
    fields,
    formValues,
    callbackToParent,
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

  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    formMetaData,
    formValues,
    callbackToParent,
    runtimeParams
  );

  const [errorMessage, seterrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [employeeCode, setemployeeCode] = useState("");
  form.employeeCode.onChange(function (value) {
    setemployeeCode(value);
  });
  useEffect(() => {
    if (employeeCode) {
      checkEmployeeCode("checkEmployeeCode", employeeCode)
        .then((response) => {
          seterrorMessage(false);
          setSuccessMessage(null);
        })
        .catch((err) => {
          console.log(err);
          seterrorMessage(err.response.data);
          setSuccessMessage(null);
        });
    } else {
      seterrorMessage(false);
    }
  }, [employeeCode]);

  const disabledButton = document.querySelector(".disbutton");

  if (disabledButton != null || disabledButton != undefined) {
    if (errorMessage) {
      disabledButton.hidden = true;
    } else {
      disabledButton.hidden = false;
    }
  }

  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <FormControl
            control={control}
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
              name="employeeCode"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col></Col>
          <Col></Col>
        </Row>
        {[
          errorMessage ? (
            <div className="text-danger p-1">{errorMessage}</div>
          ) : (
            successMessage && <div>{successMessage}</div>
          ),
        ]}
        <Row>
          <Col>
            <FormControl
              control={control}
              name="firstName"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col>
            <FormControl
              control={control}
              name="middleName"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col>
            <FormControl
              control={control}
              name="lastName"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <FormControl
              control={control}
              name="employeeType"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col>
            <FormControl
              control={control}
              name="designation"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>

        {/* <Row>
          <FormControl
            control={control}
            name="designation"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="department"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row> */}
        <Row>
          <Col>
            <FormControl
              control={control}
              name="department"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>

          <Col>
            <FormControl
              control={control}
              name="region"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <FormControl
              control={control}
              name="employeeGender"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col>
            <FormControl
              control={control}
              type="date"
              name="dateOfJoining"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>

        {/* <Row>
          <FormControl
            control={control}
            name="employeeGender"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

        <Row>
          <FormControl
            control={control}
            type="date"
            name="dateOfJoining"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row> */}
      </Container>
      {formValues.objectId != null && (
        <Container className="justify-content-center  ">
          <Section title="Comments and Change History">
            <AuditTrail
              formMetaData={formMetaData}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
            />
          </Section>
        </Container>
      )}
    </>
  );
};
export default FormLayout;
