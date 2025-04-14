import { useState, useEffect } from "react";
import * as Yup from "yup";
import { getObjectInfo } from "src/modules/admin/AdminService";

let JSHook = (
  form,
  formMethods,
  fields,
  formMetaData,
  callbackToParent,
  formValues,
  runtimeParams
) => {
  console.log(runtimeParams, "runtimeParamsruntimeParams");

  if (formValues.userId > 0) {
    // formMetaData.fields.firstName.editable = false;
    // formMetaData.fields.middleName.editable = false;
    // formMetaData.fields.lastName.editable = false;
    formMetaData.fields.employeeId.editable = false;
    formMetaData.fields.userName.editable = false;
    formMetaData.fields.password.visible = false;
    formMetaData.fields.confirmPassword.visible = false;
    formMetaData.fields.password.required = false;
    formMetaData.fields.confirmPassword.required = false;
  }
  if (formValues.userId === undefined) {
    formMethods.setValue("active", true);
  }

  useEffect(() => {
    const validationSchema = Yup.object({
      // userId: Yup.number(),
      // empType: Yup.string().required('Employee Type is required'),
      firstName: Yup.string().required("FirstName is required"),
      // middleName: Yup.string(),
      lastName: Yup.string().required("LastName is required"),
      userName: Yup.string()
        // .required()
        // .notOneOf(
        //   [Yup.ref("emailAddress")],
        //   "Username and email must not be the same"
        // )
        .required("Username is required"),
      emailAddress: Yup.string()
        .email("Invalid Email format")
        .test("lowercase-start", "Email must start with a letter", (value) =>
          /^[a-zA-Z]/.test(value)
        )
        .test(
          "dot-and-at",
          "Email must contain a dot (.) and an at symbol (@)",
          (value) => /^[^@]+@[^@]+\.[^@]+$/.test(value)
        )
        .required("Email Address  is required"),
      // phoneNumber: Yup.string()
      //     .required("Phone Number is required")
      //     .matches(/^\+.*$/, { message: 'Invalid Phone Number format', excludeEmptyString: false })
      //     .test("format", "Invalid Phone Number format", (value) => {
      //         const plusCount = (value.match(/\+/g) || []).length;
      //         const hyphenCount = (value.match(/-/g) || []).length;
      //         const digitsOnly = /^\+\d{1,3}-\d{10}$/;
      //         return plusCount === 1 && hyphenCount === 1 && digitsOnly.test(value);
      //     }),
      phoneNumber: Yup.string()
        .required("Phone Number is Required")
        .test(
          "len",
          "Phone Number must be at least 10 digits",
          (val) => val && val.length >= 13
        ),
      timeZone: Yup.string().required("Time Zone is Required"),
      password:
        formValues.userId === undefined
          ? Yup.string()
              .required("Please enter your password")
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,15})/,
                "Password must contain at least 8 characters,at least one uppercase,at least one lowercase,at least one number, at least one special character, and should not exceed 15 characters"
              )
              .max(15, "Password must not exceed 15 characters")
          : "",
      confirmPassword:
        formValues.userId === undefined
          ? Yup.string()
              .required("Confirm Password is required")
              .oneOf([Yup.ref("password")], "Passwords must match")
          : "",

      employeeId: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Employee ID is")
        .required("Employee ID is required"),
    });

    callbackToParent(validationSchema);
  }, []);

  form.employeeId.onChange(function (value) {
    let employeeId = value.replace(/[^0-9a-zA-Z]/g, "");
    formMethods.setValue("employeeId", employeeId);
  });

  form.firstName.onChange(function (value) {
    let firstName = value.replace(/[^a-zA-Z\s]+/g, "");
    formMethods.setValue("firstName", firstName);
  });

  form.middleName.onChange(function (value) {
    let middleName = value.replace(/[^a-zA-Z\s]+/g, "");
    formMethods.setValue("middleName", middleName);
  });

  form.lastName.onChange(function (value) {
    let lastName = value.replace(/[^0-9a-zA-Z]/g, "");
    formMethods.setValue("lastName", lastName);
  });

  form.password.onChange(function (value) {
    let password = value.replace(/\s+/g, "");
    // let password = value.replace(/[^a-zA-Z0-9!@#$%^&*()_+{}\[\]:;"'<>,.?/~`\\|-]/g, "");
    formMethods.setValue("password", password);
  });

  form.confirmPassword.onChange(function (value) {
    let confirmPassword = value.replace(/\s+/g, "");
    // let password = value.replace(/[^a-zA-Z0-9!@#$%^&*()_+{}\[\]:;"'<>,.?/~`\\|-]/g, "");
    formMethods.setValue("confirmPassword", confirmPassword);
  });

  const [empCode, setempCode] = useState("");
  const [userresponse, setuserResponse] = useState("");

  if (runtimeParams.ParentFormObjectId !== undefined) {
    formMetaData.fields.firstName.editable = false;
    formMetaData.fields.middleName.editable = false;
    formMetaData.fields.lastName.editable = false;
    formMetaData.fields.employeeId.editable = false;

    useEffect(() => {
      getObjectInfo(
        "getObjectInfo",
        runtimeParams.ParentFormObjectId,
        "EM_EMPLOYEE_DETAILS",
        "object_id"
      )
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setuserResponse(response);
            setempCode(response.data[0].employee_code);
            formMethods.setValue("firstName", response.data[0].first_name);
            formMethods.setValue("middleName", response.data[0].middle_name);
            formMethods.setValue("lastName", response.data[0].last_name);
            formMethods.setValue("employeeId", response.data[0].employee_code);
          }
          // else {
          //     formMethods.setValue("firstName", '');
          //     formMethods.setValue("middleName", '');
          //     formMethods.setValue("lastName", '');
          //     formMethods.setValue("employeeId", '');
          // }
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
  }

  useEffect(() => {
    getObjectInfo("getObjectInfo", "'" + empCode + "'", "USERS", "employee_id")
      .then((response) => {
        if (response.data && response.data.length > 0) {
          if (
            response.data[0].employee_id !== undefined &&
            response.data[0].employee_id !== ""
          ) {
            formMethods.setValue("firstName", response.data[0].first_name);
            formMethods.setValue("middleName", response.data[0].middle_name);
            formMethods.setValue("lastName", response.data[0].last_name);
            formMethods.setValue("employeeId", response.data[0].employee_id);
            formMethods.setValue("userName", response.data[0].user_name);
            formMethods.setValue(
              "emailAddress",
              response.data[0].email_address
            );
            formMethods.setValue("phoneNumber", response.data[0].phone_number);
            formMethods.setValue("timeZone", response.data[0].time_zone);
            formMethods.setValue("manager", response.data[0].manager);
            formMethods.setValue("userId", response.data[0].user_id);
            formMethods.setValue("createdOn", response.data[0].created_on);
          } else {
            formMethods.setValue("firstName", userresponse.data[0].first_name);
            formMethods.setValue(
              "middleName",
              userresponse.data[0].middle_name
            );
            formMethods.setValue("lastName", userresponse.data[0].last_name);
            formMethods.setValue(
              "employeeId",
              userresponse.data[0].employee_code
            );
          }
        } else if (userresponse.data && userresponse.data.length > 0) {
          debugger;
          formMethods.setValue("firstName", userresponse.data[0].first_name);
          formMethods.setValue("middleName", userresponse.data[0].middle_name);
          formMethods.setValue("lastName", userresponse.data[0].last_name);
          formMethods.setValue(
            "employeeId",
            userresponse.data[0].employee_code
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [empCode, userresponse]);

  return form;
};

export default JSHook;
