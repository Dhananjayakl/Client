import { useState, useEffect } from "react";
import * as Yup from "yup";
import { getviewData } from "../EmployeeService";
import { getObjectInfo } from "src/modules/admin/AdminService";

let JSHook = (
  form,
  formMethods,
  fields,
  formValues,
  register,
  setValue,
  formMetaData,
  remove,
  append,
  addRow,
  callbackToParent,
  runtimeParams
) => {
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  const [euser, setuser] = useState("");
  form.userId.onChange(function (value) {
    setuser(value);
  });
  if (euser) {
    formMethods.setValue("objectId", euser);
  }
  // formMethods.setValue('userId', userId);
  if (formValues.objectId === undefined) {
    useEffect(() => {
      addRow();
    }, []);
  }

  if (runtimeParams.type === "Emp") {
    formMethods.setValue("userId", userId);
    formMethods.setValue("objectId", userId);
    formMetaData.fields.userId.visible = false;
    formMetaData.fields.userId.required = false;
  }
  if (formValues.objectId !== undefined) {
    formMetaData.fields.userId.editable = false;
  }

  form.expiryDate.onChange(function (value, row) {
    if (value) {
      let selectedDate = new Date(value);
      let currentDate = new Date();
      if (selectedDate < currentDate) {
        formMethods.setValue("CR." + row + ".expiryDate", "");
      }
    }
  });

  form.certType.onChange(function (value, row) {
    formMethods.setValue("CR." + row + ".certTitle", "");
  });

  const certificationViewdata = {
    viewName: "PA_EM_CERTIFICATIONS_CR_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `(object_id=${euser})`,
  };

  const CertificationDetails = [
    { label: "cert_type", key: "certType" },
    { label: "cert_title", key: "certTitle" },
    { label: "cert_desc", key: "certDesc" },
    { label: "upload_certificate", key: "uploadCertificate" },
    { label: "expiry_date", key: "expiryDate" },
    { label: "cert_id", key: "certId" },
  ];

  useEffect(() => {
    if (euser !== "") {
      getviewData(certificationViewdata)
        .then((response) => {
          const responseData = response.data;
          // Clear values and close all rows
          fields.forEach((_, rowIndex) => {
            CertificationDetails.forEach(({ key }) => {
              // callbacktoHook(null);
              setValue(`CR[${rowIndex}].${key}`, ""); // Clear the values
            });
          });

          // Close all rows
          for (let i = fields.length - 1; i >= 0; i--) {
            remove(i);
          }

          if (responseData && responseData.data.length > 0) {
            responseData.data.forEach((rowData, rowIndex) => {
              CertificationDetails.forEach(({ key, label }) => {
                const apiValue = rowData[label];
                // callbacktoHook(rowIndex);
                setValue(`CR[${rowIndex}].${key}`, apiValue);
              });

              // Open additional rows if needed
              if (rowIndex >= fields.length) {
                append({
                  certType: "",
                  certTitle: "",
                  certDesc: "",
                  uploadCertificate: "",
                  expiryDate: "",
                  certId: "",
                });
              }
            });
          } else {
            append({
              certType: "",
              certTitle: "",
              certDesc: "",
              uploadCertificate: "",
              expiryDate: "",
              certId: "",
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [setValue, remove, euser]);

  useEffect(() => {
    if (euser !== "") {
      getObjectInfo("getObjectInfo", euser, "EM_CERTIFICATIONS", "object_id")
        .then((response) => {
          if (response.data && response.data.length > 0) {
            formMethods.setValue("comments", response.data[0].comments);
            formMethods.setValue("createdOn", response.data[0].created_on);
            formMethods.setValue("createdBy", response.data[0].created_by);
          } else {
            formMethods.setValue("comments", "");
            formMethods.setValue("createdOn", "");
            formMethods.setValue("createdBy", "");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [euser]);
  useEffect(() => {
    const validationSchema = Yup.object({
      userId: Yup.number().typeError("Employee Name is Required"),
      CR: Yup.array().of(
        Yup.object().shape({
          certType: Yup.string().required("* Required"),
          certTitle: Yup.string().required("* Required"),
          certDesc: Yup.string().required("* Required"),
          uploadCertificate: Yup.array().required("* Required"),
        })
      ),
    });

    callbackToParent(validationSchema);
  }, []);
  return form;
};

export default JSHook;
