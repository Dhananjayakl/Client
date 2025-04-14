import { useEffect } from "react";

let JSHook = (form, formMetaData, formMethods, formValues) => {
  form.onLoad = (props) => {
    formMetaData.fields.parent.visible = false;

    const hierarchyValue = formMethods.getValues("hierarchy");

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

      if (formMethods.getValues("objectId") != "") {
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
  };

  form.hierarchy.onChange(function (value) {
    formValues.hierarchy = value;

    if (value >= 2) {
      formMetaData.fields.parent.visible = true;
      formMetaData.fields.parent.required = true;
      formMethods.setValue("parent", "");
    } else {
      formMetaData.fields.parent.visible = false;
      formMetaData.fields.parent.required = false;
    }
  });

  form.onLoad();

  return form;
};
export default JSHook;
