import { useState, useEffect } from "react";

const JSHook = (form, fields, formMethods, formValues) => {
  if (
    formMethods.getValues("previousStage") === null ||
    formMethods.getValues("previousStage") === ""
  ) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }

  const showRequestDate =
    formMethods?.getValues("currentStage") === "DUE DATE CLARIFICATION";
  let schedule = formMethods.getValues("schedule");
  useEffect(() => {
    if (showRequestDate && schedule !== 1) {
      formMethods.setValue("dueDate", formValues?.requestDueDate);
      formMethods.setValue("oldDueDate", formValues?.dueDate);
    }
  }, []);

  form.onSubmit = function (actionName) {
    if (actionName == "Request Due date") {
      formMethods.setValue("requestDueDate", " ");
      return actionName;
    }

    if (actionName == "Submit") {
      return actionName;
    }
    if (actionName == "Initiate Risk Action") {
      return actionName;
    }
  };
  return form;
};

export default JSHook;
