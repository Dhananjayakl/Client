import { useState, useEffect } from "react";
import * as Yup from "yup";

let JSHook = (form, formMethods, fields, callbackToParent, formValues) => {
  const pagePath = window.parent.location.pathname;
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  if (pagePath === "/employee/settings" || pagePath === "/employee/profile") {
    formMethods.setValue("userId", userId);
    fields.userId.visible = false;
    fields.userId.required = false;
  }
  // else{
  //     fields.userId.visible=true;
  //     fields.userId.required=true;
  // }
  if (formValues.objectId !== undefined) {
    fields.userId.editable = false;
  }

  useEffect(() => {
    if (
      pagePath === "/employee/references" ||
      formValues.objectId === undefined
    ) {
      formMethods.setValue("userId", userId);
      fields.userId.visible = true;
      fields.userId.required = true;
    }
  }, [pagePath, formMethods, fields]);

  useEffect(() => {
    const validationSchema = Yup.object({
      userId: Yup.number().required("Please Select Employee Name"),
      refId: Yup.number(),
      refName: Yup.string().required("Name is  Required"),
      jobTitle: Yup.string().required("Designation is Required"),
      companyName: Yup.string().required("Organization is Required"),
      emailId: Yup.string()
        .nullable()
        .transform((originalValue, originalObject) => {
          return originalValue === "" ? null : originalValue;
        })
        .test(
          "custom-email-validation",
          "Invalid Email format",
          function (value) {
            if (value !== null) {
              const startsWithLetter = /^[a-zA-Z]/.test(value);
              const dotAndAt = /^[^@]+@[^@]+\.[^@]+$/.test(value);

              return startsWithLetter && dotAndAt;
            }
            return true;
          }
        ),
      totalExperience: Yup.number().typeError("Total Experience is required"),
      mobileNo: Yup.string()
        .required("Mobile No. is required")
        .matches(/^\+91-[6789]\d{9}$/, {
          message: "Invalid Mobile No. format",
        }),
    });

    callbackToParent(validationSchema);
  }, []);

  form.mobileNo.onChange(function (value) {
    let allowedCharacters = value.replace(/[^0-9a-zA-Z+-]/g, "");
    formMethods.setValue("mobileNo", allowedCharacters);
  });

  form.refName.onChange(function (value) {
    let refeName = value.replace(/[^a-zA-Z\s]+/g, "");
    formMethods.setValue("refName", refeName);
  });

  form.companyName.onChange(function (value) {
    let OrganizationName = value.replace(/[^a-zA-Z\s]+/g, "");
    formMethods.setValue("companyName", OrganizationName);
  });

  form.jobTitle.onChange(function (value) {
    let Designation = value.replace(/[^a-zA-Z\s]+/g, "");
    formMethods.setValue("jobTitle", Designation);
  });

  form.totalExperience.onChange(function (value) {
    let totalExperience = value.replace(/[^\d.]/g, "");
    const parts = totalExperience.split(".");
    parts[0] = parts[0].substring(0, 3);
    totalExperience = parts.join(".");
    totalExperience =
      totalExperience.length > 5
        ? totalExperience.slice(0, 5)
        : totalExperience;
    totalExperience = parseFloat(totalExperience) > 60 ? "" : totalExperience;
    formMethods.setValue("totalExperience", totalExperience);
  });

  return form;
};

export default JSHook;
