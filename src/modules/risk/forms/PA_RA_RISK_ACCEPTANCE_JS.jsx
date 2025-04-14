import { useEffect } from "react";

const JSHook = (
  form,
  fields,
  formMethods,
  formValues,
  formMetaData,
  runtimeParams,
  control,
  updatevalue
) => {
  const archive = formMethods.getValues("compensationgControl");
  const handleClick = (value) => {
    updatevalue(value);
  };
  useEffect(() => {
    if (archive && archive === true) {
      updatevalue(archive);
    }
  }, []);
  form.compensationgControl.onChange((value) => {
    handleClick(value);
  });
  if (
    formMethods.getValues("previousStage") === null ||
    formMethods.getValues("previousStage") === ""
  ) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }
  // On Submit Functionality for Action name
  form.onSubmit = function (actionName) {
    const actionsRequiringCommentsReset = [
      "Approve",
      "Send for Approval",
      "Request Clarification",
      "Submit Clarification",
      "Update Risk Acceptance",
    ];

    if (actionsRequiringCommentsReset.includes(actionName)) {
      formMethods.setValue("comments", "");
      return actionName;
    }
  };
  return form;
};

export default JSHook;
