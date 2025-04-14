import { useState, useEffect } from "react";
import { useWatch } from "react-hook-form";
//  import React from "react";
let requestforduedate = "Request Due Date";
let updateDueDate = "Accept Due Date";
let updateTask = "Update Task";
let Complete = "Complete";
let cancle = "Cancel Task";
const JSHook = (
  form,
  fields,
  formMethods,
  formValues,
  formMetaData,
  control
) => {
  function validatePercentage(value) {
    return value <= 100;
  }
  const [fieldvalue, setFieldValue] = useState("");
  //collapse bgColor

  let fndType = {
    key: useWatch({
      control: control,
      name: fieldvalue,
    }),
    value: fieldvalue,
  };

  const showRequestDate =
    formMethods?.getValues("currentStage") === "DUE DATE CLARIFICATION";
  let schedule = formMethods.getValues("schedule");
  useEffect(() => {
    if (showRequestDate && schedule !== 1) {
      formMethods.setValue("dueDate", formValues?.requestduedate);
      formMethods.setValue("oldDueDate", formValues?.dueDate);
    }
  }, []);

  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };

  // PERCENTAGE VALUE SHOULD NOT BE MORE THAN 100
  form.percentageCompletion.onChange(function (value, row) {
    if (value === "0" || value === "0".repeat(value.length)) {
      if (value.length <= 10) {
        formMethods.setValue("percentageCompletion", value);
      } else {
        const truncatedValue = value.slice(0, 10);
        formMethods.setValue("percentageCompletion", truncatedValue);
      }
    } else if (validatePercentage(value)) {
      if (value.length <= 10) {
        formMethods.setValue("percentageCompletion", value);
      }
    } else {
      formMethods.setValue("percentageCompletion", "");
    }
  });

  // Bottom Bar functionality
  form.onSubmit = function (actionName) {
    if (actionName == "Request Due Date") {
      formMethods.setValue("requestduedate", "");
      return actionName;
    }
    if (actionName == "Accept Due Date") {
      return actionName;
    }
    if (actionName == "Update Task") {
      formMethods.setValue("comments", "");
      return actionName;
    }
    if (actionName == "Complete") {
      return actionName;
    }
    if (actionName == "Cancel Task") {
      return actionName;
    }
  };

  form.onSubmit = function (actionName) {
    const actionsRequiringCommentsReset = [
      "Request Due Date",
      "Accept Due Date",
      "Update Task",
      "Complete",
      "Cancel Task",
    ];

    if (actionsRequiringCommentsReset.includes(actionName)) {
      formMethods.setValue("comments", "");
      return actionName;
    }
  };

  return form;
};

export default JSHook;
