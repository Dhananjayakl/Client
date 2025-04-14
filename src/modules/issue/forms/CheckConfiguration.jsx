const CheckConfiguration = (formMethods, formMetaData) => {
  if (
    formMethods.getValues("currentStage") == "APP" &&
    formMetaData.actions != null
  ) {
    if (formMetaData.configurationFormMetaData != null) {
      if (
        formMetaData.configurationFormMetaData
          .is_action_plan_approver_auto_approve == true
      ) {
        formMetaData.actions = formMetaData.actions.filter(
          (item) => item.action != "Trigger Actions"
        );
      }
      if (
        formMetaData.configurationFormMetaData
          .is_action_plan_approver_auto_approve == false
      ) {
        formMetaData.actions = formMetaData.actions.filter(
          (item) => item.action != "Send for Approval"
        );
      }
    }
  }
};

export default CheckConfiguration;
