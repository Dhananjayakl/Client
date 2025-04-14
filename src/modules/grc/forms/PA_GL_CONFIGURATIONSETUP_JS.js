import { useEffect } from "react";
const JSHook = (form, formMetaData, formMethods, fields, formValues) => {
  form.onLoad = (props) => {
    formMetaData.fields.processReminder.visible = false;
    formMetaData.fields.processOverDue.visible = false;
    formMetaData.fields.controlReminder.visible = false;
    formMetaData.fields.controlOverDue.visible = false;
    formMetaData.fields.riskReminder.visible = false;
    formMetaData.fields.riskOverDue.visible = false;
    formMetaData.fields.assetReminder.visible = false;
    formMetaData.fields.assetOverDue.visible = false;
    const proValue = formMethods.getValues("processReview");
    const riskValue = formMethods.getValues("riskReview");
    const controlValue = formMethods.getValues("controlReview");
    const assetValue = formMethods.getValues("assetReview");
    if (proValue && proValue == true) {
      formMetaData.fields.processReminder.visible = true;
      formMetaData.fields.processOverDue.visible = true;
    } else {
      formMetaData.fields.processReminder.visible = false;
      formMetaData.fields.processOverDue.visible = false;
    }
    if (controlValue && controlValue == true) {
      formMetaData.fields.controlReminder.visible = true;
      formMetaData.fields.controlOverDue.visible = true;
    } else {
      formMetaData.fields.controlReminder.visible = false;
      formMetaData.fields.controlOverDue.visible = false;
    }
    if (riskValue && riskValue == true) {
      formMetaData.fields.riskReminder.visible = true;
      formMetaData.fields.riskOverDue.visible = true;
    } else {
      formMetaData.fields.riskReminder.visible = false;
      formMetaData.fields.riskOverDue.visible = false;
    }
    if (assetValue && assetValue == true) {
      formMetaData.fields.assetReminder.visible = true;
      formMetaData.fields.assetOverDue.visible = true;
    } else {
      formMetaData.fields.assetReminder.visible = false;
      formMetaData.fields.assetOverDue.visible = false;
    }
  };
  form.processReview.onChange(function (value) {
    if (value == true) {
      formMetaData.fields.processReminder.visible = true;
      formMetaData.fields.processOverDue.visible = true;
    } else {
      formMetaData.fields.processReminder.visible = false;
      formMetaData.fields.processOverDue.visible = false;
    }
  });

  form.assetReview.onChange(function (value) {
    if (value == true) {
      formMetaData.fields.assetReminder.visible = true;
      formMetaData.fields.assetOverDue.visible = true;
    } else {
      formMetaData.fields.assetReminder.visible = false;
      formMetaData.fields.assetOverDue.visible = false;
    }
  });

  form.riskReview.onChange(function (value) {
    if (value == true) {
      formMetaData.fields.riskReminder.visible = true;
      formMetaData.fields.riskOverDue.visible = true;
    } else {
      formMetaData.fields.riskReminder.visible = false;
      formMetaData.fields.riskOverDue.visible = false;
    }
  });

  form.controlReview.onChange(function (value) {
    if (value == true) {
      formMetaData.fields.controlReminder.visible = true;
      formMetaData.fields.controlOverDue.visible = true;
    } else {
      formMetaData.fields.controlReminder.visible = false;
      formMetaData.fields.controlOverDue.visible = false;
    }
  });
  function handleFieldChange(field, value) {
    if (value !== 0) {
      const storedValue = value;
      const fieldName = `${field.charAt(0).toLowerCase()}${field.slice(1)}`;
      const fieldValue = storedValue === "0" ? " " : storedValue;
      formMethods.setValue(fieldName, fieldValue);
    }
  }

  form.processReminder.onChange(function (value) {
    handleFieldChange("processReminder", value);
  });

  form.processOverDue.onChange(function (value) {
    handleFieldChange("processOverDue", value);
  });

  form.controlReminder.onChange(function (value) {
    handleFieldChange("controlReminder", value);
  });

  form.controlOverDue.onChange(function (value) {
    handleFieldChange("controlOverDue", value);
  });

  form.assetReminder.onChange(function (value) {
    handleFieldChange("assetReminder", value);
  });

  form.assetOverDue.onChange(function (value) {
    handleFieldChange("assetOverDue", value);
  });

  form.riskReminder.onChange(function (value) {
    handleFieldChange("riskReminder", value);
  });

  form.riskOverDue.onChange(function (value) {
    handleFieldChange("riskOverDue", value);
  });
  useEffect(() => {
    if (formMethods.getValues("processReminder") == null) {
      formMethods.setValue("processReminder", "6");
    }

    if (formMethods.getValues("processOverDue") == null) {
      formMethods.setValue("processOverDue", "6");
    }
    if (formMethods.getValues("assetReminder") == null) {
      formMethods.setValue("assetReminder", "6");
    }
    if (formMethods.getValues("assetOverDue") == null) {
      formMethods.setValue("assetOverDue", "6");
    }
    if (formMethods.getValues("controlReminder") == null) {
      formMethods.setValue("controlReminder", "6");
    }
    if (formMethods.getValues("controlOverDue") == null) {
      formMethods.setValue("controlOverDue", "6");
    }
    if (formMethods.getValues("riskReminder") == null) {
      formMethods.setValue("riskReminder", "6");
    }
    if (formMethods.getValues("riskOverDue") == null) {
      formMethods.setValue("riskOverDue", "6");
    }
  }, [formMethods]);

  form.onLoad();
  return form;
};

export default JSHook;
