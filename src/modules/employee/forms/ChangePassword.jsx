import React from "react";
// import { Formik, Field } from "formik";
import { useForm } from "react-hook-form";

import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FormControl from "src/components/forms/reactformutils/FormControl";
import {
  Button,
  Card,
  Container,
  Col,
  Row,
  InputGroup,
  Form,
  Alert,
} from "react-bootstrap";
import { changePassword, updatePassword } from "src/modules/admin/AdminService";
// import FormErrorMessage from "src/FormErrorMessage";
import { getServiceData } from "src/components/server/service";
import useAuth from "src/hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";

let initialValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  userId: "",
};

const ChangePassword = (props) => {
  const navigate = useNavigate();
  const [touchedAllFields, setTouchedAllFields] = useState(false);
  const [submitTouched, setSubmitTouched] = useState(false);
  const handleButtonClick = () => {
    setSubmitTouched(true);
  };
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState([]);

  const pagePath = window.parent.location.pathname;
  const { signOut } = useAuth();

  useEffect(() => {
    getServiceData("getUserInfo")
      .then((response) => {
        const sortedData = response.data.data.sort((a, b) =>
          a.value.localeCompare(b.value)
        );
        setUser(sortedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let logout = async () => {
    try {
      await signOut();
      navigate("/auth/sign-in");
    } catch (error) {
      console.log("Error while signing out", error);
    }
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string().test(
      "conditional-required",
      "Current Password is Required",
      function (value) {
        if (pagePath === "/form/changepwd" && !value) {
          return false;
        }
        return true;
      }
    ),
    // newPassword: Yup.string().required("New Password is Required").min(7),
    newPassword: Yup.string()
      .required("Please enter your password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,15})/,
        "Password: 8-15 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char."
      )
      .max(15, "Password must not exceed 15 characters"),
    confirmPassword: Yup.string().test(
      "confirm-password",
      "Passwords must match",
      function (value) {
        const newPassword = this.resolve(Yup.ref("newPassword"));
        return newPassword ? value && value === newPassword : true;
      }
    ),
    userId: Yup.number().test(
      "conditional-required",
      "Employee Name is Required",
      function (value) {
        if (!(pagePath === "/form/changepwd") && !value) {
          return false;
        }
        return true;
      }
    ),
  });
  const { control, setValue, watch, handleSubmit, getValues, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });
  let onSubmit = (values) => {
    if (pagePath === "/form/changepwd") {
      if (values) {
        changePassword("password", values)
          .then((response) => {
            setSuccessMessage(
              "Password updated successfully!, please Sign in with new password"
            );
            reset({ newPassword: "", confirmPassword: "", userId: "" });
            setTimeout(() => {
              setSuccessMessage(null);
              logout();
            }, 2000);
          })
          .catch((err) => {
            setErrorMessage(err.response.data);
            setSuccessMessage(null);
            setTimeout(() => {
              setErrorMessage(null);
            }, 3000);
            console.log(err);
          });

        // logout();
      }
    }
    if (!(pagePath === "/form/changepwd")) {
      if (values) {
        updatePassword("changePassword", values)
          .then((response) => {
            setSuccessMessage("Password updated successfully!");
            reset({ newPassword: "", confirmPassword: "", userId: "" });

            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  return (
    <Card className="w-50 container">
      <Card.Header>
        <Card.Title className="mb-0">Change Password</Card.Title>
        <div>
          {successMessage && (
            <Alert variant="success" className="mt-2">
              <p className="text-lg font-weight-bold ">{successMessage}</p>
            </Alert>
          )}
          {errorMessage && pagePath === "/form/changepwd" && (
            <Alert variant="danger" className="mt-2">
              <p className="text-lg font-weight-bold ">{errorMessage}</p>
            </Alert>
          )}
          {errorMessage && !(pagePath === "/form/changepwd") && (
            <Alert variant="danger" className="mt-2">
              <p className="text-lg font-weight-bold ">{errorMessage}</p>
            </Alert>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        {/* <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            errors,
            handleSubmit,
            handleBlur,
            handleChange,
            isSubmitting,
            setFieldValue,
            touched,
            values,
          }) => ( */}
        <Container fluid className="p-0">
          {/* <Header /> */}
          <div className="container">
            <div className=" row justify-content-center ">
              <div className="col-10 col-sm-8 col-md-6 col-lg-7">
                <Form id="profile" onSubmit={handleSubmit(onSubmit)}>
                  {/* <FormErrorMessage
                        submitTouched={submitTouched}
                        errors={errors}
                      /> */}
                  <Row>
                    {!(pagePath === "/form/changepwd") && (
                      <FormControl
                        type="select"
                        control={control}
                        name="userId"
                        field_title="Employee Name"
                        options={user}
                        required
                      />
                    )}
                  </Row>
                  {pagePath === "/form/changepwd" && (
                    <Row>
                      <FormControl
                        control={control}
                        type="password"
                        field_title="Current Password"
                        name="currentPassword"
                        required
                      />
                    </Row>
                  )}
                  <Row>
                    <FormControl
                      control={control}
                      type="password"
                      field_title="New Password"
                      name="newPassword"
                      required
                    />
                  </Row>
                  <Row>
                    <FormControl
                      control={control}
                      type="password"
                      field_title="Confirm Password"
                      name="confirmPassword"
                      required
                    />
                  </Row>
                  <div className="text-center mt-3">
                    {
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        onClick={() => {
                          handleSubmit(onSubmit)();
                          // handleButtonClick();
                          setValue("userId", getValues("userId"));
                        }}
                      >
                        Submit
                      </Button>
                    }
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </Container>
        {/* ) */}
        {/* } */}
        {/* </Formik> */}
      </Card.Body>
    </Card>
  );
};
export default ChangePassword;
