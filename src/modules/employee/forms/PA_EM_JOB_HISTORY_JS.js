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

  useEffect(() => {
    const validationSchema = Yup.object().shape({
      userId: Yup.number().typeError("Employee Name is Required"),
      PE: [false, ""].includes(formMethods.watch("nopriorExperience"))
        ? Yup.array().of(
            Yup.object().shape({
              employerName: Yup.string().required("* Required"),
              jobType: Yup.string().required("* Required"),
              jobTitle: Yup.string().required("* Required"),
              dateOfJoined: Yup.string()
                .required("* Required")
                .test(
                  "not-today-or-future-date",
                  "Date of Joining  less than  future date",
                  function (value) {
                    const currentDate = new Date();
                    const selectedDate = new Date(value);
                    return selectedDate < currentDate;
                  }
                ),
              relievingDate: Yup.string()
                .required("* Required")
                .test(
                  "is-after-date-of-joined",
                  "Relieving Date must be greater than Date of Joining",
                  function (value) {
                    const dateOfJoined = this.resolve(Yup.ref("dateOfJoined"));
                    return !dateOfJoined || !value || value > dateOfJoined;
                  }
                )
                .test(
                  "not-future-date",
                  "Relieving Date must be less than or equal to the current date",
                  function (value) {
                    const currentDate = new Date();
                    const selectedDate = new Date(value);
                    return selectedDate <= currentDate;
                  }
                ),
              jobTenure: Yup.string().required("* Required"),
            })
          )
        : "",
      expRelAttach: [false, ""].includes(formMethods.watch("nopriorExperience"))
        ? Yup.array().required("Experience/Relieving Letter is Required")
        : Yup.string().nullable(),
    });

    callbackToParent(validationSchema);
  }, [formMethods.watch("nopriorExperience")]);

  form.jobTitle.onChange(function (value, row) {
    let numericValue = value.replace(/[^a-zA-Z0-9\s]+/g, "");
    formMethods.setValue("PE." + row + ".jobTitle", numericValue);
  });

  form.employerName.onChange(function (value, row) {
    let numericValue = value.replace(/[^a-zA-Z0-9\s]+/g, "");
    formMethods.setValue("PE." + row + ".employerName", numericValue);
  });

  // form.jobTenure.onChange(function (value, row) {
  //   let exp = value.replace(/[^\d.]/g, "");
  //   const parts = exp.split(".");
  //   if (parts.length > 1) {
  //     parts[1] = parts[1].substring(0, 2);
  //   }
  //   exp = parts.join(".");
  //   exp = exp.length > 5 ? exp.slice(0, 5) : exp;
  //   exp = parseFloat(exp) > 60 ? "" : exp;
  //   formMethods.setValue("PE." + row + ".jobTenure", exp);
  // });

  const [joinDate, setjoinDate] = useState("");
  const [relDate, setrelDate] = useState("");

  form.dateOfJoined.onChange(function (value, row) {
    formMethods.setValue("PE." + row + ".relievingDate", "");
    formMethods.setValue("PE." + row + ".jobTenure", "");
    if (value) {
      setjoinDate(value);
      let selectedDate = new Date(value);
      let currentDate = new Date();
      if (selectedDate >= currentDate) {
        formMethods.setValue("PE." + row + ".dateOfJoined", "");
      }
    }
  });

  form.relievingDate.onChange(function (value, row) {
    if (value) {
      setrelDate(value);
      let selectedDate = new Date(value);
      let currentDate = new Date();
      if (selectedDate > currentDate) {
        formMethods.setValue("PE." + row + ".relievingDate", "");
      }
    }

    let joined = new Date(formMethods.getValues("PE." + row + ".dateOfJoined"));
    let relieved = new Date(
      formMethods.getValues("PE." + row + ".relievingDate")
    );
    let difference = relieved - joined;
    let yearsExperience = difference / (1000 * 60 * 60 * 24 * 365);
    yearsExperience = Math.round(yearsExperience * 10) / 10;
    formMethods.setValue("PE." + row + ".jobTenure", yearsExperience);
  });

  form.nopriorExperience.onChange(function (value) {
    if (value) {
      fields.forEach((_, rowIndex) => {
        formMethods.setValue("PE." + rowIndex + ".relievingDate", "");
      });
    }
  });

  if (formMethods.watch("nopriorExperience") === true) {
    fields.forEach((_, rowIndex) => {
      remove(rowIndex);
    });
    formMetaData.fields.expRelAttach.visible = false;
    formMetaData.fields.reasonForLeaving.visible = false;
  } else {
    formMetaData.fields.expRelAttach.visible = true;
    formMetaData.fields.reasonForLeaving.visible = true;
  }

  const jobHistoryViewdata = {
    viewName: "PA_EM_JOB_HISTORY_PE_BV",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `(object_id=${euser})`,
  };

  const Professinal = [
    { label: "employer_name", key: "employerName" },
    { label: "job_type", key: "jobType" },
    { label: "job_title", key: "jobTitle" },
    { label: "date_of_joined", key: "dateOfJoined" },
    { label: "relieving_date", key: "relievingDate" },
    { label: "job_tenure", key: "jobTenure" },
    { label: "last_ctc", key: "lastCtc" },
    { label: "job_id", key: "jobId" },
  ];

  useEffect(() => {
    if (euser !== "") {
      getviewData(jobHistoryViewdata)
        .then((response) => {
          const responseData = response.data;
          // Clear values and close all rows
          fields.forEach((_, rowIndex) => {
            Professinal.forEach(({ key }) => {
              // callbacktoHook(null);
              setValue(`PE[${rowIndex}].${key}`, ""); // Clear the values
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
                setValue(`PE[${rowIndex}].${key}`, apiValue);
              });

              // Open additional rows if needed
              if (rowIndex >= fields.length) {
                append({
                  employerName: "",
                  jobType: "",
                  jobTitle: "",
                  dateOfJoined: "",
                  relievingDate: "",
                  jobTenure: "",
                  lastCtc: "",
                  jobId: "",
                });
              }
            });
          } else {
            append({
              employerName: "",
              jobType: "",
              jobTitle: "",
              dateOfJoined: "",
              relievingDate: "",
              jobTenure: "",
              lastCtc: "",
              jobId: "",
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
      getObjectInfo("getObjectInfo", euser, "EM_JOB_HISTORY", "object_id")
        .then((response) => {
          const filedData = response.data[0];
          if (response.data && response.data.length > 0) {
            formMethods.setValue("comments", response.data[0].comments);
            formMethods.setValue(
              "nopriorExperience",
              response.data[0].no_prior_experience
            );

            formMethods.setValue(
              "expRelAttach",
              response.data[0].exp_rel_attach
            );
            formMethods.setValue(
              "reasonForLeaving",
              response.data[0].reason_for_leaving
            );
            formMethods.setValue("createdOn", response.data[0].created_on);
            formMethods.setValue("createdBy", response.data[0].created_by);
          } else {
            formMethods.setValue("comments", "");
            formMethods.setValue("expRelAttach", "");
            formMethods.setValue("createdOn", "");
            formMethods.setValue("createdBy", "");
            formMethods.setValue("nopriorExperience", false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [euser]);

  if ([false, ""].includes(formMethods.watch("nopriorExperience"))) {
    formMetaData.fields.expRelAttach.required = true;
  } else {
    formMetaData.fields.expRelAttach.required = false;
  }

  return form;
};

export default JSHook;
