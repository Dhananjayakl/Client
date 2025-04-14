let CheckConfiguration = (formMethods, formMetaData) => {
  console.log("CheckConfiguration", formMetaData);
  if (formMetaData.configurationFormMetaData != null) {
    if (formMetaData.actions != null) {
      if (formMethods.getValues("currentStage").includes("LEVEL")) {
        if (
          formMethods.getValues("finalApproverStage") !=
          formMethods.getValues("currentStage")
        ) {
          formMetaData.actions = formMetaData.actions.filter(
            (item) => item.action != "Submit and Close"
          );
        }
      }
    }

    if (formMetaData.actions != null) {
      if (
        formMethods.getValues("finalApproverStage") ==
        formMethods.getValues("currentStage")
      ) {
        formMetaData.actions = formMetaData.actions.filter(
          (item) => item.action != "Send For Approval"
        );
      }
    }
  }
};

export default CheckConfiguration;
