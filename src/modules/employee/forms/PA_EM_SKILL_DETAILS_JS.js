import { useState, useEffect } from "react";
import * as Yup from "yup";
import { getviewData } from "../EmployeeService";
import { getObjectInfo } from "src/modules/admin/AdminService";
import { Value } from "sass";
let JSHook = (
  form,
  formMethods,
  fields,
  formMetaData,
  formValues,
  register,
  setValue,
  callbackToParent,
  remove,
  append,
  addRow,
  runtimeParams
) => {
  const [euser, setuser] = useState("");
  const pagePath = window.parent.location.pathname;
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
    formMethods.setValue("objectId", userId);
    formMethods.setValue("userId", userId);
    formMetaData.fields.userId.visible = false;
    formMetaData.fields.userId.required = false;
  } else {
    formMetaData.fields.userId.visible = true;
    formMetaData.fields.userId.required = true;
  }
  if (formValues.objectId !== undefined) {
    formMetaData.fields.userId.editable = false;
  }
  formMetaData.fields.expYears.required = true;
  formMetaData.fields.expMonths.required = true;
  const viewData = {
    viewName: "pa_em_skill_details_sk_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `(object_id=${euser})`,
  };

  const SkillDetails = [
    { label: "category", key: "Category" },
    { label: "sub_category", key: "subCategory" },
    { label: "title", key: "title" },
    { label: "rating", key: "rating" },
    { label: "exp_years", key: "expYears" },
    { label: "exp_months", key: "expMonths" },
    { label: "skill_id", key: "skillId" },
  ];

  // if(euser){
  useEffect(() => {
    if (euser !== "") {
      getviewData(viewData)
        .then((response) => {
          const responseData = response.data;

          // Clear values and close all rows
          fields.forEach((_, rowIndex) => {
            SkillDetails.forEach(({ key }) => {
              // callbacktoHook(null);
              setValue(`SK[${rowIndex}].${key}`, ""); // Clear the values
            });
          });

          // Close all rows
          for (let i = fields.length - 1; i >= 0; i--) {
            remove(i);
          }

          if (responseData && responseData.data.length > 0) {
            responseData.data.forEach((rowData, rowIndex) => {
              SkillDetails.forEach(({ key, label }) => {
                const apiValue = rowData[label];
                // callbacktoHook(rowIndex);
                setValue(`SK[${rowIndex}].${key}`, apiValue);
              });

              if (rowIndex >= fields.length) {
                append({
                  subCategory: "",
                  Category: "",
                  title: "",
                  rating: "",
                  exp: "",
                  skillId: "",
                  expYears: "",
                  expMonths: "",
                });
              }
            });
          } else {
            append({
              subCategory: "",
              Category: "",
              title: "",
              rating: "",
              exp: "",
              skillId: "",
              expYears: "",
              expMonths: "",
            });
          }
        })
        .catch((error) => {
          console.info("error");
        });
    }
  }, [setValue, remove, euser]);

  useEffect(() => {
    if (euser !== "") {
      getObjectInfo("getObjectInfo", euser, "EM_SKILL_DETAILS", "object_id")
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
  // }

  const [row, setRow] = useState("");
  form.Category.onChange(function (value, row) {
    setRow(row);
  });

  useEffect(() => {
    const validationSchema = Yup.object({
      userId: Yup.number().typeError("Employee Name is Required"),
      SK: Yup.array().of(
        Yup.object().shape({
          Category: Yup.string().required("* Required"),
          subCategory: Yup.string().required("* Required"),
          title: [74, 75, 76, 77, 78, 79].includes(
            formMethods.watch(`SK.${parseInt(row)}.subCategory`)
          )
            ? Yup.string().required("* Required")
            : Yup.string().nullable(),
          rating: Yup.string().required("* Required"),
          // exp: Yup.number().typeError("* Required"),
          expYears: Yup.number().typeError("* Required"),
          expMonths: Yup.number().typeError("* Required"),
        })
      ),
    });

    callbackToParent(validationSchema);
  }, [formMethods.watch(`SK.${parseInt(row)}.subCategory`), row]);

  form.exp.onChange(function (value, row) {
    let exp = value.replace(/[^\d.]/g, "");
    const parts = exp.split(".");
    if (parts.length > 1) {
      parts[1] = parts[1].substring(0, 1);
    }
    exp = parts.join(".");
    exp = exp.length > 5 ? exp.slice(0, 5) : exp;
    exp = parseFloat(exp) > 60 ? "" : exp;
    formMethods.setValue("SK." + row + ".exp", exp);
  });

  form.title.onChange(function (value, row) {
    let title = value.replace(/[^a-zA-Z0-9\s]+/g, "");
    formMethods.setValue("SK." + row + ".title", title);
  });

  form.Category.onChange(function (value, row) {
    // let title = value.replace(/[^a-zA-Z0-9\s]+/g, "");
    formMethods.setValue("SK." + row + ".subCategory", undefined);
  });

  return form;
};

export default JSHook;
