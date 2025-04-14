import { getObjectData } from "src/modules/employee/EmployeeService";
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
  const [value1, setvalue] = useState("");
  // const [address, setAddress] = useState("");
  // const [sameadd, setsameadd] = useState("");
  form.userId.onChange(function (value) {
    setvalue(value);
  });
  const sameadd = formMethods.getValues("sameAddress");
  const presentadd = formMethods.getValues("presentAddress");
  // useEffect(() => {
  if (sameadd) {
    formMetaData.fields.permanentAddress.editable = false;
    formMethods.setValue("permanentAddress", presentadd);
  }
  if (presentadd == "") {
    formMetaData.fields.permanentAddress.editable = true;
    formMethods.setValue("sameAddress", false);
  }
  // }, [formMethods.watch, formMetaData, sameadd, presentadd]);

  form.sameAddress.onChange(function (value) {
    formMethods.setValue("permanentAddress", "");
    if (value == true) {
      formMetaData.fields.permanentAddress.editable = false;
      formMethods.setValue("permanentAddress", presentadd);
    } else {
      formMetaData.fields.permanentAddress.editable = true;
      formMethods.setValue("permanentAddress", "");
    }
  });

  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  if (runtimeParams.type === "Emp" && formValues.objectId === undefined) {
    formMethods.setValue("objectId", userId);
    formMethods.setValue("userId", userId);
    fields.userId.visible = false;
    fields.userId.required = false;
  }
  // else{
  //     fields.userId.visible=true;
  //     fields.userId.required=true;
  // }

  useEffect(() => {
    if (formValues.objectId === undefined) {
      //  formMethods.setValue('userId', userId);
      fields.userId.visible = true;
      fields.userId.required = true;
    }
  }, [formMethods, fields]);

  if (formValues.objectId !== undefined) {
    formMetaData.fields.userId.editable = false;
  }

  if (formValues.objectId === undefined && runtimeParams.type === undefined) {
    formMethods.setValue("objectId", value1);
    useEffect(() => {
      form.userId.onChange(function (value) {
        getObjectInfo("getObjectInfo", value, "EM_CONTACT_DETAILS", "object_id")
          .then((response) => {
            const filedData = response.data[0];
            if (filedData && response.data.length > 0) {
              formMethods.setValue("workNo", filedData.work_no);
              formMethods.setValue(
                "personalEmailId",
                filedData.personal_email_id
              );
              formMethods.setValue(
                "permanentAddress",
                filedData.permanent_address
              );
              formMethods.setValue("presentAddress", filedData.present_address);
              formMethods.setValue("linkdinId", filedData.linkedin_id);
              formMethods.setValue("comments", filedData.comments);
              formMethods.setValue("sameAddress", filedData.same_address);
              formMethods.setValue(
                "relationshipType",
                filedData.relationship_type
              );
              formMethods.setValue("contactName", filedData.contact_name);
              formMethods.setValue("phoneNo", filedData.phone_no);
              formMethods.setValue("contactAddress", filedData.contact_address);
              formMethods.setValue("objectId", response.data[0].object_id);
              formMethods.setValue("createdBy", response.data[0].created_by);
              formMethods.setValue("createdOn", response.data[0].created_on);
            } else {
              formMethods.setValue("workNo", "");
              formMethods.setValue("personalEmailId", "");
              formMethods.setValue("permanentAddress", "");
              formMethods.setValue("presentAddress", "");
              formMethods.setValue("linkdinId", "");
              formMethods.setValue("comments", "");
              formMethods.setValue("objectId", -1);
              formMethods.setValue("createdBy", "");
              formMethods.setValue("createdOn", "");
              formMethods.setValue("relationshipType", "");
              formMethods.setValue("contactName", "");
              formMethods.setValue("phoneNo", "");
              formMethods.setValue("contactAddress", "");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }, []);
  }

  const [email, setEmail] = useState("");
  form.personalEmailId.onChange(function (value) {
    setEmail(value);
  });

  useEffect(() => {
    const validationSchema = Yup.object().shape({
      userId: Yup.number().typeError("Employee Name is Required"),
      permanentAddress: Yup.string()
        .required("Permanent Address is Required")
        .max(255, "Permanent Address must be at most 255 characters"),
      presentAddress: Yup.string()
        .required("Present Address is Required")
        .max(255, "Present Address must be at most 255 characters"),
      workNo: Yup.string()
        .required("Mobile No. is Required")
        .test(
          "len",
          "Mobile No. must be at least 10 digits",
          (val) => val && val.length >= 13
        ),
      personalEmailId: Yup.string()
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
      relationshipType: Yup.string().required("Relationship is Required"),
      contactName: Yup.string().required("Name is Required"),
      phoneNo: Yup.string()
        .required("Mobile No. is Required")
        .test(
          "len",
          "Mobile No. must be at least 10 digits",
          (val) => val && val.length >= 13
        ),
      // phoneNo: Yup.string()
      // .required("Mobile No. is Required")
      // .matches(/^\+91-[6789]\d{9}$/, { message: 'Invalid  Mobile No. format' }),

      //     linkdinId:  Yup.string()
      // .nullable()
      // .transform((originalValue, originalObject) => {
      //   return originalValue === '' ? null : originalValue;
      // })
      // .test('custom-linkedin-validation', 'Invalid LinkedIn URL', function (value) {
      //   if (value !== null) {
      //     const isValidLinkedInID = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/([a-z0-9_-]{3,})\/?$/i.test(value);

      //     return isValidLinkedInID;
      //   }
      //   return true;
      // }),
    });

    callbackToParent(validationSchema);
  }, []);

  form.workNo.onChange(function (value) {
    let workNo = value.replace(/\D/g, ""); // Remove all non-digit characters
    workNo = "+91" + workNo.replace(/^91/, ""); // Ensure the prefix is "+91" and remove any additional "91" at the beginning
    workNo = workNo.replace(/[^\d6897]/g, ""); // Remove all digits except 8, 9, 6, 7
    formMethods.setValue("workNo", workNo);
  });

  useEffect(() => {
    const updatedButton = document.querySelector(".my-2.disbutton");
    const skipButton = document.querySelector(".my-2.close-btn");
    if (updatedButton) {
      updatedButton.textContent = "Save";
      updatedButton.style.borderRadius = "30px";
    }
    if (skipButton) {
      skipButton.textContent = "Skip";
      skipButton.style.borderRadius = "30px";
    }
  }, [form, formMethods, fields, formMetaData]);

  return form;
};
export default JSHook;
