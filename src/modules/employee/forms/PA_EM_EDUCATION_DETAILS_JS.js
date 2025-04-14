//

import { useState, useEffect } from "react";
import * as Yup from "yup";
import { getviewData } from "../EmployeeService";
import { getObjectInfo } from "src/modules/admin/AdminService";

let JSHook = (
  form,
  formMethods,
  fields,
  formValues,
  formMetaData,
  setValue,
  register,
  callbackToParent,
  remove,
  append,
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
  }

  if (formValues.objectId !== undefined) {
    formMetaData.fields.userId.editable = false;
  }

  useEffect(() => {
    const validationSchema = Yup.object({
      userId: Yup.number().typeError("Employee Name is Required"),
      ED: Yup.array().of(
        Yup.object().shape({
          universityName: Yup.string().required("* Required"),
          // collegeName: Yup.string().required('* Required'),
          degreeType: Yup.string().required("* Required"),
          degreeSpecialization: Yup.string().required("* Required"),
          passedYear: Yup.number().typeError("* Required"),
          marksPercentage: Yup.number().typeError("* Required"),
        })
      ),
    });

    callbackToParent(validationSchema);
  }, []);

  form.universityName.onChange(function (value, row) {
    let universityName = value.replace(/[^a-zA-Z\s,\-]+/g, "");
    formMethods.setValue("ED." + row + ".universityName", universityName);
  });

  form.degreeType.onChange(function (value, row) {
    let degreeType = value.replace(/[^a-zA-Z\s,\-]+/g, "");
    formMethods.setValue("ED." + row + ".degreeType", degreeType);
  });

  form.degreeSpecialization.onChange(function (value, row) {
    let degreeSpecialization = value.replace(/[^a-zA-Z\s,\-]+/g, "");
    formMethods.setValue(
      "ED." + row + ".degreeSpecialization",
      degreeSpecialization
    );
  });

  form.marksPercentage.onChange(function (value, row) {
    let marksPercentage = value.replace(/[^\d.]/g, "");
    const parts = marksPercentage.split(".");
    parts[0] = parts[0].substring(0, 2);
    marksPercentage = parts.join(".");
    marksPercentage =
      marksPercentage.length > 5
        ? marksPercentage.slice(0, 5)
        : marksPercentage;
    formMethods.setValue("ED." + row + ".marksPercentage", marksPercentage);
  });

  form.passedYear.onChange(function (value, row) {
    let passedYear = value.replace(/\D/g, "");
    passedYear = passedYear.length > 4 ? passedYear.slice(0, 4) : passedYear;
    formMethods.setValue("ED." + row + ".passedYear", passedYear);
  });

  const educationViewdata = {
    viewName: "PA_EM_EDUCATION_DETAILS_ED_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `(object_id=${euser})`,
  };

  const Professinal = [
    { label: "university_name", key: "universityName" },
    { label: "college_name", key: "collegeName" },
    { label: "degree_type", key: "degreeType" },
    { label: "degree_specialization", key: "degreeSpecialization" },
    { label: "passed_year", key: "passedYear" },
    { label: "marks_percentage", key: "marksPercentage" },
    { label: "edu_id", key: "eduId" },
  ];

  useEffect(() => {
    if (euser !== "") {
      getviewData(educationViewdata)
        .then((response) => {
          const responseData = response.data;
          // Clear values and close all rows
          fields.forEach((_, rowIndex) => {
            Professinal.forEach(({ key }) => {
              // callbacktoHook(null);
              setValue(`ED[${rowIndex}].${key}`, ""); // Clear the values
            });
          });

          // Close all rows
          for (let i = fields.length - 1; i >= 0; i--) {
            remove(i);
          }

          if (responseData && responseData.data.length > 0) {
            responseData.data.forEach((rowData, rowIndex) => {
              Professinal.forEach(({ key, label }) => {
                const apiValue = rowData[label];
                // callbacktoHook(rowIndex);
                setValue(`ED[${rowIndex}].${key}`, apiValue);
              });

              // Open additional rows if needed
              if (rowIndex >= fields.length) {
                append({
                  universityName: "",
                  collegeName: "",
                  degreeType: "",
                  degreeSpecialization: "",
                  passedYear: "",
                  marksPercentage: "",
                  eduId: "",
                });
              }
            });
          } else {
            append({
              universityName: "",
              collegeName: "",
              degreeType: "",
              degreeSpecialization: "",
              passedYear: "",
              marksPercentage: "",
              eduId: "",
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
      getObjectInfo("getObjectInfo", euser, "EM_EDUCATION_DETAILS", "object_id")
        .then((response) => {
          const filedData = response.data[0];
          if (response.data && response.data.length > 0) {
            formMethods.setValue("comments", response.data[0].comments);
            formMethods.setValue(
              "uploadCertification",
              response.data[0].upload_certificate
            );
            formMethods.setValue("createdOn", response.data[0].created_on);
            formMethods.setValue("createdBy", response.data[0].created_by);
          } else {
            formMethods.setValue("comments", "");
            formMethods.setValue("uploadCertification", "");
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
