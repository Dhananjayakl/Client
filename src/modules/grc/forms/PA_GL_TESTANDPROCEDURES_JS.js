import { useEffect } from "react";
const JSHook = (form, formMetaData, formMethods, formValues) => {
  form.onLoad = (props) => {
    const startDateValue = formMethods.getValues("startDate");
    const endDateValue = formMethods.getValues("endDate");

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

    if (startDateValue > endDateValue) {
      formMethods.setValue("endDate", "");
    }
  };

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
