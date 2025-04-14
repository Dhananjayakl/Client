import { useEffect, useState } from "react";
import { getviewData, getStatus, getObjectInfo } from "../BRService";
import { useWatch } from "react-hook-form";
let formMetaFields = [];

const JSHook = (
  form,
  formMetaData,
  formMethods,
  formValues,
  appendbcp,
  removebcp,
  setBcpName,
  control,
  runtimeParams
) => {
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  let exerciseOwner = useWatch({
    control: control,
    name: "exerciseOwner",
  });

  const editButton = document.querySelector(
    `.form-${formMetaData.formmeta.form_id}`
  );

  if (editButton != null || editButton != undefined) {
    if (formValues.currentStage == "CLOSE-CANCEL") {
      editButton.hidden = true;
    } else {
      editButton.hidden = false;
    }
  }

  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };

  const buttons = document.querySelectorAll(".disbutton");

  buttons.forEach((button) => {
    const buttonChildren = button.textContent.trim();
    if (
      Array.isArray(exerciseOwner)
        ? exerciseOwner[0]?.value
        : exerciseOwner?.value === "" || Array.isArray(exerciseOwner)
        ? exerciseOwner[0]?.value
        : exerciseOwner?.value === userId
    ) {
      if (buttonChildren === "Send to Owner") {
        button.hidden = true;
      } else {
        button.hidden = false;
      }
    } else if (
      Array.isArray(exerciseOwner)
        ? exerciseOwner[0]?.value
        : exerciseOwner?.value !== "" && Array.isArray(exerciseOwner)
        ? exerciseOwner[0]?.value
        : exerciseOwner?.value !== userId
    ) {
      if (buttonChildren === "Schedule Exercise") {
        button.hidden = true;
      } else {
        button.hidden = false;
      }
    } else {
      button.hidden = false;
    }
  });
  if (
    formMethods.getValues("exerciseMethod") === "" ||
    formMethods.getValues("exerciseMethod") === undefined
  ) {
    formMetaData.fields.scope.visible = false;
  } else {
    formMetaData.fields.scope.visible = true;
  }

  form.exerciseMethod.onChange(function (value) {
    formMethods.setValue("scope", "");
    formMethods.setValue("planReviewer", "");
    formMethods.setValue("startDate", "");
    formMethods.setValue("comments", "");
    formMethods.setValue("bcpComments", "");
    formMethods.setValue("exerciseName", "");
    removebcp();

    if (value !== undefined) {
      formMetaData.fields.scope.visible = true;
    }
  });
  function formatDate(jsonDate) {
    if (jsonDate === undefined || jsonDate == "") return "";
    const date = new Date(jsonDate);

    const getYear = date.toLocaleDateString("default", {
      year: "numeric",
    });
    const getMonth = date.toLocaleDateString("default", {
      month: "2-digit",
    });
    const getDay = date.toLocaleDateString("default", { day: "2-digit" });
    const formattedDate = getYear + "-" + getMonth + "-" + getDay;
    return formattedDate;
  }
  const getNextReviewDate = (value) => {
    if (value !== "") {
      const todaydate = new Date();
      todaydate.setFullYear(todaydate.getFullYear() + parseInt(value));
      todaydate.setDate(todaydate.getDate());
      formMethods.setValue("nextReviewDate", formatDate(todaydate));
    } else {
      formMethods.setValue("nextReviewDate", "");
    }
  };

  useEffect(() => {
    if (
      formValues.objectId === undefined ||
      formMethods.getValues("currentStage") === "INITIATE"
    ) {
      formMethods.setValue("scheduleFrequency", 1);
      getNextReviewDate(1);
    }
  }, []);

  form.scheduleFrequency.onChange(function (value) {
    console.log(value, "valuevaluevalue");

    getNextReviewDate(value);
  });

  let bcpId = useWatch({
    control: control,
    name: "scope",
  });

  const dependenciesData = {
    viewName: "pa_br_bcp_tasks_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `object_id=${
      Array.isArray(bcpId) ? bcpId[0]?.value : bcpId?.value
    }`,
  };

  useEffect(() => {
    if (
      (formValues.objectId === undefined ||
        formMethods.getValues("currentStage") === "INITIATE") &&
      bcpId != ""
    ) {
      getviewData(dependenciesData)
        .then((response) => {
          const responseData = response.data;

          if (responseData && responseData.data.length > 0) {
            removebcp();
            responseData.data.forEach((rowData, rowIndex) => {
              appendbcp({
                bcpId: "",
                bcpRisk: rowData.d_pt_risk,
                bcpTask: rowData.pt_task_name,
                bcpOwner: {
                  value: rowData.pt_task_owner,
                  label: rowData.d_pt_task_owner,
                },
                bcptimeAllocated: rowData.pt_time_alloca,
                bcpTaskComments: rowData.pt_comments,
              });
            });
          } else {
            removebcp();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [bcpId]);
  if (
    formMethods.getValues("previousStage") === null ||
    formMethods.getValues("previousStage") === ""
  ) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }
  let exerciseMethods = formMethods.getValues("exerciseMethod");
  let formId;
  if (exerciseMethods === 1) {
    formId = "BR_EXERCISE_FUNCTIONAL";
  } else if (exerciseMethods === 2) {
    formId = "BR_EXERCISE_DESK_CHECK";
  }
  const [responseData, setResponseData] = useState("");

  if (formId !== undefined) {
    getStatus("checkObjectStatus", formId, formValues.objectId)
      .then((response) => {
        setResponseData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (responseData > 0 && formMetaData.actions !== null) {
    buttons.forEach((button) => {
      const buttonChildren = button.textContent.trim();
      if (buttonChildren === "Submit") {
        button.hidden = true;
      } else {
        button.hidden = false;
      }
    });
  }
  useEffect(() => {
    if (
      formValues.objectId === undefined ||
      formMethods.getValues("currentStage") === "INITIATE"
    ) {
      if (bcpId !== "") {
        getObjectInfo(
          "getObjectInfo",
          Array.isArray(bcpId) ? bcpId[0]?.value : bcpId?.value,
          "BR_BUSINESS_CONTINUITY_PLAN",
          "object_id"
        )
          .then((response) => {
            if (response.data && response.data.length > 0) {
              setBcpName(response.data[0].plan_name);
              if (
                response.data[0].own_orgs &&
                response.data[0].own_orgs.length >= 1 &&
                response.data[0].d_own_orgs &&
                response.data[0].d_own_orgs.length >= 1
              ) {
                let businessUnitValue = response.data[0].own_orgs;
                let businessUnitLabel = response.data[0].d_own_orgs;

                let reorderedBusinessUnitValue = businessUnitValue
                  .slice()
                  .sort();
                let reorderedBusinessUnitLabel = businessUnitLabel
                  .slice()
                  .sort();
                const ownOrgsArray = reorderedBusinessUnitValue.map(
                  (value, index) => ({
                    value,
                    label: reorderedBusinessUnitLabel[index] || "",
                  })
                );
                formMethods.setValue("businessUnit", ownOrgsArray);
              }
              if (exerciseMethods == 1) {
                formMethods.setValue(
                  "exerciseName",
                  "Functional Exercise - " + response.data[0].plan_name
                );
              } else if (exerciseMethods == 2) {
                formMethods.setValue(
                  "exerciseName",
                  "Desk Check Exercise - " + response.data[0].plan_name
                );
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setBcpName("");
      }
    }
  }, [bcpId, formValues, formMethods]);
  let action = useWatch({
    control: control,
    name: "action",
  });

  useEffect(() => {
    if (action == 4) {
      formMetaData.fields.processRecovered.required = false;
      formMetaData.fields.exerciseResult.required = false;
      formMetaData.fields.comments.required = true;
    } else if (action == 3) {
      formMetaData.fields.processRecovered.required = true;
      formMetaData.fields.exerciseResult.required = true;
      formMetaData.fields.comments.required = false;
    } else {
      formMetaData.fields.processRecovered.required = false;
      formMetaData.fields.exerciseResult.required = false;
      formMetaData.fields.comments.required = false;
    }

    if (action === 8) {
      if (formMetaFields.length == 0) {
        for (const key in formMetaData.fields) {
          if (formMetaData.fields[key].required) {
            formMetaFields.push(key);
          }
        }
      }
      for (const key in formMetaData.fields) {
        if (key !== "exerciseMethod" && key !== "scope") {
          formMetaData.fields[key].required = false;
        }
      }
    } else if (
      formMethods.getValues("currentStage") === "INITIATE" &&
      (action === 1 || action === 5)
    ) {
      if (formMetaFields.length != 0) {
        for (const key in formMetaFields) {
          formMetaData.fields[formMetaFields[key]].required = true;
        }
      }
    }
  }, [action]);

  return form;
};

export default JSHook;
