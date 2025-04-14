//

import { useState, useEffect } from "react";
import * as Yup from "yup";
import { getviewData } from "../EmployeeService";
import { getObjectInfo } from "src/modules/admin/AdminService";

let JSHook = (
  form,
  formMethods,
  fields,
  callbackToParent,
  formValues,
  setValue,
  register,
  formMetaData,
  remove,
  append,
  addRow,
  runtimeParams
) => {
  const [doc, setdoc] = useState("");
  const [euser, setuser] = useState("");
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  form.userId.onChange(function (value) {
    setuser(value);
  });
  if (euser) {
    formMethods.setValue("objectId", euser);
  }

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

  form.documentType.onChange(function (value, row) {
    formMethods.setValue("DC." + row + ".idNumber", "");
    formMethods.setValue("DC." + row + ".docExpiryDate", "");
  });

  form.idNumber.onChange(function (value, row) {
    if (value) {
      const documentType = formMethods.getValues("DC." + row + ".documentType");
      if (documentType == 1) {
        //AdharCardNumber
        let numericValue = value.replace(/[^0-9]/g, "").slice(0, 12);
        formMethods.setValue("DC." + row + ".idNumber", numericValue);
      } else if (documentType == 2) {
        // PAN Card
        let panValue = value.toUpperCase().replace(/[^a-zA-Z0-9]/g, "");
        panValue =
          panValue.slice(0, 5).replace(/[^a-zA-Z]/g, "") +
          panValue.slice(5, 9).replace(/[^0-9]/g, "") +
          panValue.slice(9, 10).replace(/[^a-zA-Z]/g, "");
        formMethods.setValue("DC." + row + ".idNumber", panValue);
      } else if (documentType >= 3 && documentType <= 5) {
        //Others
        let alphanumericValue = value.replace(/[^0-9a-zA-Z]/g, "").slice(0, 20);
        formMethods.setValue("DC." + row + ".idNumber", alphanumericValue);
      }
    }
  });

  form.docExpiryDate.onChange(function (value, row) {
    if (value) {
      let selectedDate = new Date(value);
      let currentDate = new Date();
      if (selectedDate < currentDate) {
        formMethods.setValue("DC." + row + ".docExpiryDate", "");
      }
    }
  });

  useEffect(() => {
    const validationSchema = Yup.object({
      userId: Yup.number().typeError("Employee Name is Required"),
      DC: Yup.array().of(
        Yup.object().shape({
          documentType: Yup.string().required("* Required"),
          idNumber: Yup.string()
            .test("idNumber", "Invalid Identification No", function (value) {
              const documentType = this.parent.documentType;
              if (documentType === "1") {
                if (/^(\d)\1*$/.test(value)) {
                  return false;
                }
                return /^\d{12}$/.test(value);
              }
              if (documentType === "2") {
                // PAN card format: ABCDE1234F
                return /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/.test(value);
              }
              if (
                documentType === "3" ||
                documentType === "4" ||
                documentType === "5"
              ) {
                return value.length <= 20;
              }
              return true;
            })
            .required("* Required"),
          docAttachment: Yup.string().required("* Required "),
          docExpiryDate: Yup.string()
            .test(
              "is-required-if-option-3 or 4",
              "* Required",
              function (value) {
                const { documentType } = this.parent;
                return documentType === "3" || documentType === "4"
                  ? !!value
                  : true;
              }
            )
            .test(
              "is-future-date",
              "Document Expiry date must be a future date",
              function (value) {
                if (
                  value &&
                  (this.parent.documentType === "3" ||
                    this.parent.documentType === "4")
                ) {
                  return new Date(value) > new Date();
                }
                return true;
              }
            )
            .nullable(),
        })
      ),
    });

    callbackToParent(validationSchema);
  }, []);

  const documentViewdata = {
    viewName: "pa_em_documents_dc_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `(object_id=${euser})`,
  };

  const Documents = [
    { label: "document_type", key: "documentType" },
    { label: "id_number", key: "idNumber" },
    { label: "doc_attachment", key: "docAttachment" },
    { label: "doc_expiry_date", key: "docExpiryDate" },
    { label: "doc_id", key: "docId" },
  ];

  useEffect(() => {
    if (euser !== "") {
      getviewData(documentViewdata)
        .then((response) => {
          const responseData = response.data;

          // Clear values and close all rows
          fields.forEach((_, rowIndex) => {
            Documents.forEach(({ key }) => {
              // callbacktoHook(null);
              setValue(`DC[${rowIndex}].${key}`, ""); // Clear the values
            });
          });

          // Close all rows
          for (let i = fields.length - 1; i >= 0; i--) {
            remove(i);
          }

          if (responseData && responseData.data.length > 0) {
            responseData.data.forEach((rowData, rowIndex) => {
              Documents.forEach(({ key, label }) => {
                const apiValue = rowData[label];
                // callbacktoHook(rowIndex);
                setValue(`DC.${rowIndex}.${key}`, apiValue);
              });

              // Open additional rows if needed
              if (rowIndex >= fields.length) {
                append({
                  documentType: "",
                  idNumber: "",
                  docAttachment: "",
                  accountType: "",
                  docExpiryDate: "",
                  docId: "",
                });
              }
            });
          } else {
            append({
              documentType: "",
              idNumber: "",
              docAttachment: "",
              accountType: "",
              docExpiryDate: "",
              docId: "",
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
      getObjectInfo("getObjectInfo", euser, "EM_DOCUMENTS", "object_id")
        .then((response) => {
          const filedData = response.data[0];
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

  return form;
};

export default JSHook;
