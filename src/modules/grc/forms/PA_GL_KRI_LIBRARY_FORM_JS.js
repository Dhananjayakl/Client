const JSHook = (form, formMetaData, formMethods, formValues) => {
  form.measurementType.onChange(function (value) {
    formMetaData.fields.expectedValue.visible = true;
    formMetaData.fields.nonCriticalBreach.visible = true;
    formMetaData.fields.criticalBreach.visible = true;
  });

  form.frequency.onChange(function (value) {
    if (value == 7) {
      formMetaData.fields.specificDate.required = true;
      formMethods.setValue("startDate", "");
      formMethods.setValue("endDate", "");
    } else {
      formMetaData.fields.startDate.required = true;
      formMethods.setValue("specificDate", "");
    }
  });

  form.expectedValue.onChange(function (value) {
    if (formMethods.getValues("responseType") == 2) {
      let exp = value.replace(/[^\d.]/g, "");
      const parts = exp.split(".");
      if (parts.length > 1) {
        parts[1] = parts[1].substring(0, 2);
      }
      exp = parts.join(".");
      exp = exp.length > 3 ? exp.slice(0, 3) : exp;
      exp = parseFloat(exp) > 100 ? "" : exp;
      formMethods.setValue("expectedValue", exp);
    }
  });
  form.nonCriticalBreach.onChange(function (value) {
    if (formMethods.getValues("responseType") == 2) {
      let exp = value.replace(/[^\d.]/g, "");
      const parts = exp.split(".");
      if (parts.length > 1) {
        parts[1] = parts[1].substring(0, 2);
      }
      exp = parts.join(".");
      exp = exp.length > 3 ? exp.slice(0, 3) : exp;
      exp = parseFloat(exp) > 100 ? "" : exp;
      formMethods.setValue("nonCriticalBreach", exp);
    }
  });
  form.criticalBreach.onChange(function (value) {
    if (formMethods.getValues("responseType") == 2) {
      let exp = value.replace(/[^\d.]/g, "");
      const parts = exp.split(".");
      if (parts.length > 1) {
        parts[1] = parts[1].substring(0, 2);
      }
      exp = parts.join(".");
      exp = exp.length > 3 ? exp.slice(0, 3) : exp;
      exp = parseFloat(exp) > 100 ? "" : exp;
      formMethods.setValue("criticalBreach", exp);
    }
  });
  return form;
};

export default JSHook;
