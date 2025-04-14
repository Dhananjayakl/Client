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
  append,
  remove,
  addRow,
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
  } else {
    formMetaData.fields.userId.visible = true;
    formMetaData.fields.userId.required = true;
  }
  if (formValues.objectId !== undefined) {
    formMetaData.fields.userId.editable = false;
  }

  useEffect(() => {
    const validationSchema = Yup.object().shape({
      // userId: Yup.number().required('Employee Name is Required'),
      FM: Yup.array().of(
        Yup.object().shape({
          familyName: Yup.string().required("* Required"),

          relationshipType: Yup.string().required("* Required."),
          familyGender: Yup.string()
            .test(
              "gender-validation",
              "Invalid gender for the selected relationship",
              function (value) {
                const selectedRelationship = this.parent.relationshipType;

                if (selectedRelationship === "1") {
                  return value === "2";
                } else if (selectedRelationship == "2") {
                  return value === "1";
                } else if (selectedRelationship == "3") {
                  return value === "1";
                } else if (selectedRelationship == "4") {
                  return value === "2";
                } else if (selectedRelationship == "5") {
                  return value === "1" || value === "2";
                }
                return true;
              }
            )
            .required("* Required"),
          // phoneNo: Yup.string()
          //   .nullable()
          //   .transform((originalValue, originalObject) => {
          //     return originalValue === '' ? null : originalValue;
          //   })
          //   .matches(/^\+91-[6789]\d{9}$/, { message: 'Invalid Mobile No format' })
          //   .test("format", "Invalid  Mobile No format", function (value) {
          //     if (value !== null) {
          //       return true; // Additional custom validations can be added here if needed
          //     }
          //     return true; // Allow null values
          //   }),
          birthDate: Yup.string()
            .nullable()
            .transform((originalValue, originalObject) => {
              return originalValue === "" ? null : originalValue;
            })
            .test(
              "not-future-date",
              "Date of Birth must not be a future date.",
              function (value) {
                if (value !== null) {
                  const currentDate = new Date();
                  const selectedDate = new Date(value);
                  return selectedDate < currentDate;
                }
                return true;
              }
            ),
        })
      ),
    });

    callbackToParent(validationSchema);
  }, []);

  form.occupationType.onChange(function (value, row) {
    let occupationType = value.replace(/[^a-zA-Z\s]+/g, "");
    formMethods.setValue("FM." + row + ".occupationType", occupationType);
  });

  form.familyName.onChange(function (value, row) {
    let familyName = value.replace(/[^a-zA-Z\s]+/g, "");
    formMethods.setValue("FM." + row + ".familyName", familyName);
  });

  const bankViewdata = {
    viewName: "PA_EM_FAMILY_DETAILS_FM_BV",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `(object_id=${euser})`,
  };

  const familyDetails = [
    { label: "relationship_type", key: "relationshipType" },
    { label: "family_name", key: "familyName" },
    { label: "birth_date", key: "birthDate" },
    { label: "family_gender", key: "familyGender" },
    { label: "occupation_type", key: "occupationType" },
    { label: "phone_no", key: "phoneNo" },
    { label: "family_id", key: "familyId" },
    { label: "rel_address", key: "relAddress" },
  ];

  useEffect(() => {
    if (euser !== "") {
      getviewData(bankViewdata)
        .then((response) => {
          const responseData = response.data;
          // Clear values and close all rows
          fields.forEach((_, rowIndex) => {
            familyDetails.forEach(({ key }) => {
              // callbacktoHook(null);
              setValue(`FM[${rowIndex}].${key}`, ""); // Clear the values
            });
          });

          // Close all rows
          for (let i = fields.length - 1; i >= 0; i--) {
            remove(i);
          }

          if (responseData && responseData.data.length > 0) {
            responseData.data.forEach((rowData, rowIndex) => {
              familyDetails.forEach(({ key, label }) => {
                const apiValue = rowData[label];
                // callbacktoHook(rowIndex);
                setValue(`FM[${rowIndex}].${key}`, apiValue);
              });

              // Open additional rows if needed
              if (rowIndex >= fields.length) {
                append({
                  relationshipType: "",
                  familyName: "",
                  birthDate: "",
                  familyGender: "",
                  occupationType: "",
                  phoneNo: "",
                  relAddress: "",
                  familyId: "",
                });
              }
            });
          } else {
            append({
              relationshipType: "",
              familyName: "",
              birthDate: "",
              familyGender: "",
              occupationType: "",
              phoneNo: "",
              relAddress: "",
              familyId: "",
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
      getObjectInfo("getObjectInfo", euser, "EM_FAMILY_DETAILS", "object_id")
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
