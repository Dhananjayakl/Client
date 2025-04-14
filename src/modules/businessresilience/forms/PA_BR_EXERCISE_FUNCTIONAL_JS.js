import { useEffect } from "react";

const JSHook = (form, formMetaData, formMethods, formValues) => {

 
  if (
    formMethods.getValues("previousStage") === null ||
    formMethods.getValues("previousStage") === ""
  ) {
    formMethods.setValue("action", 1);
    formMethods.setValue("currentStage", "INITIATE");
  }

  formMethods.setValue("exerciseId", formValues.exerciseId);

  formMetaData.fields.exerciseId.visible = false;


  let action = formMethods.getValues("action");
  useEffect(() => {
    if (action === 3) {
      formMetaData.fields.actualTimeTaken.required = false;
      formMetaData.fields.percCompleted.required = false;
      formMetaData.fields.comments.required = true;
    } else if (action === 2) {
      formMetaData.fields.actualTimeTaken.required = true;
      formMetaData.fields.percCompleted.required = true;
      formMetaData.fields.comments.required = false;
    }
  }, [action]);

  function handleInputChange(fieldName, value, length) {
    if (value.length > 5) {
      value = value.slice(0, 5);
    }
    let numericValue = parseFloat(value);
    if (numericValue > length) {
      value = "";
    }
    const decimalPattern = /^\d+(\.\d{0,2})?$/;
    if (!decimalPattern.test(value)) {
      value = value.slice(0, -1);
    }
    formMethods.setValue(fieldName, value);
  }

  form.percCompleted.onChange(function (value) {
    handleInputChange("percCompleted", value, 100);
  });

  form.actualTimeTaken.onChange(function (value) {
    handleInputChange("actualTimeTaken", value, 100000);
  });

  form.timeAllocated.onChange(function (value) {
    handleInputChange("timeAllocated", value, 100000);
  });

 
  useEffect(()=>{
    const editButton = document.querySelector(
      `.form-${formMetaData.formmeta.form_id}`
    );
    if (editButton != null || editButton != undefined) {
      if (formValues.objectId!= undefined) {
        editButton.hidden = true;
      } else {
        editButton.hidden = false;
      }
    }
  },[formValues.objectId,formMetaData.formmeta.form_id]);

  return form;
};

export default JSHook;
