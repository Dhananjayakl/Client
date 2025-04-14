import { useEffect } from "react";

let JSHook = (form, formMethods, formMetaData, formValues, control) => {
  //   useEffect(() => {
  console.log(formMethods.getValues("dueDate"), "kkkkkklk");

  if (
    formMethods.getValues("dueDate") !== "" &&
    formMethods.getValues("dueDate") !== undefined &&
    formMethods.getValues("dueDate") !== null
  ) {
    formMetaData.fields.activityStatus.visible = true;
    // formMethods.setValue("activityStatus", "1");
  } else {
    formMetaData.fields.activityStatus.visible = false;
    // formMethods.setValue("activityStatus", "");
  }
  //   }, []);

  form.dueDate.onChange(function (value) {
    if (
      formMethods.getValues("dueDate") !== "" &&
      formMethods.getValues("dueDate") !== undefined
    ) {
      formMetaData.fields.activityStatus.visible = true;
      formMethods.setValue("activityStatus", "1");
    } else {
      formMetaData.fields.activityStatus.visible = false;
      formMethods.setValue("activityStatus", "");
    }
  });
  return form;
};

export default JSHook;
