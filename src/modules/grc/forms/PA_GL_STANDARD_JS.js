import { useEffect } from "react";

const JSHook = (form, formMetaData, formMethods, formValues) => {
  form.onLoad = (props) => {
    formMetaData.fields.parent.visible = false;
    const hierarchyValue = formMethods.getValues("hierarchy");
    const startDateValue = formMethods.getValues("startDate");
    const endDateValue = formMethods.getValues("endDate");
    if (hierarchyValue && hierarchyValue >= 2) {
      formMetaData.fields.parent.visible = true;
      formMetaData.fields.parent.required = true;
    } else {
      formMetaData.fields.parent.visible = false;
      formMetaData.fields.parent.required = false;
    }
    if (formValues.objectId == null) {
      formMethods.setValue("status", "New");
    }

    useEffect(() => {
      formMethods.setValue("active", true);
      const statusValue = formMethods.getValues("status");

      if (formMethods.getValues("objectId") == "") {
        formMethods.setValue(
          "objectId",
          formMethods.getValues("objectId")
            ? formMethods.getValues("objectId")
            : -1
        );
      }

      if (
        formMethods.getValues("objectId") != -1 &&
        formMethods.getValues("objectId") != ""
      ) {
        if (statusValue === "Active") {
          formMethods.setValue("active", true);
        } else {
          formMethods.setValue("active", false);
        }
      }
    }, []);

    if (!formValues.hierarchy) {
      formMethods.setValue("hierarchy", "1");
    }
    if (startDateValue > endDateValue) {
      formMethods.setValue("endDate", "");
    }
  };
  form.hierarchy.onChange(function (value) {
    formValues.hierarchy = value;
    if (value == 1) {
      formMethods.setValue("parent", "");
    }
    if (value >= 2) {
      formMetaData.fields.parent.visible = true;
      formMetaData.fields.parent.required = true;
      formMethods.setValue("parent", "");
    } else {
      formMetaData.fields.parent.visible = false;
      formMetaData.fields.parent.required = false;
    }
  });

  form.startDate.onChange((value) => {
    const endDate = formMethods.getValues("endDate");
    if (endDate < value) {
      formMethods.setValue("endDate", "");
    }
  });

  form.onLoad();

  return form;
};

export default JSHook;
