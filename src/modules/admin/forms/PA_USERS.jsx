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
import JSHook from "./PA_USERS_JS";
import { checkUsername, checkExistence } from "../AdminService";
import { useState, useEffect } from "react";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    fields,
    form,
    callbackToParent,
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

  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    formMetaData,
    callbackToParent,
    formValues,
    runtimeParams
  );

  const [errorMessage, seterrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userName, setUsername] = useState("");

  form.userName.onChange(function (value) {
    setUsername(value);
  });

  useEffect(() => {
    if (userName) {
      checkUsername("checkUsername", userName)
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
      // setSuccessMessage(false)
    }
  }, [userName]);

  const [employeeCodeerror, setemployeeCodeerror] = useState(false);
  const [employeeCodesuccess, setemployeeCodesuccess] = useState("");

  const [employeeCode, setemployeeCode] = useState("");
  form.employeeId.onChange(function (value) {
    setemployeeCode(value);
  });

  useEffect(() => {
    if (employeeCode) {
      checkExistence(
        "checkExistence",
        employeeCode,
        formMetaData.formmeta.form_id,
        "employee_id"
      )
        .then((response) => {
          setemployeeCodeerror(false);
          setemployeeCodesuccess(null);
        })
        .catch((err) => {
          console.log(err.response.data, "KLKLKL");
          setemployeeCodeerror(err.response.data);
          setemployeeCodesuccess(null);
        });
    } else {
      setemployeeCodeerror(false);
    }
  }, [employeeCode]);
  const disabledButton = document.querySelector(".disbutton");

  if (disabledButton != null || disabledButton != undefined) {
    if (errorMessage || employeeCodeerror) {
      disabledButton.hidden = true;
    } else {
      disabledButton.hidden = false;
    }
  }

  return (
    <>
      <Container className="justify-content-center  mt-3 ">
        <Row>
          <FormControl
            control={control}
            name="employeeId"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        {[
          employeeCodeerror ? (
            <div className="text-danger p-1">{employeeCodeerror}</div>
          ) : (
            employeeCodesuccess && <div>{employeeCodesuccess}</div>
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
          <FormControl
            control={control}
            name="userName"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        {[
          errorMessage ? (
            <div className="text-danger p-1">{errorMessage}</div>
          ) : (
            successMessage && <div>{successMessage}</div>
          ),
        ]}

        <Row>
          <FormControl
            control={control}
            name="emailAddress"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="phoneNumber"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="timeZone"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="manager"
            formMetaData={formMetaData}
            formMethods={formMethods}
            FieldValue={true}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            // type='password'
            name="password"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            // type='password'
            name="confirmPassword"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            // type='password'
            name="active"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
      </Container>
    </>
  );
};

export default FormLayout;
