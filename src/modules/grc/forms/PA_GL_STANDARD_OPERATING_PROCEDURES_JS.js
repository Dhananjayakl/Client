import { useEffect } from "react";
const JSHook = (
  form,
  fields,
  formMethods,
  formValues,
  formMetaData,
  updatevalue
) => {
  form.onLoad = (props) => {
    formMetaData.fields.endDate.visible = false;

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

    const reviewCycle = formMethods.getValues("reviewCycle");

    if (reviewCycle && reviewCycle != null) {
      formMetaData.fields.nextReviewDate.visible = true;

      if (reviewCycle == "7" && formMetaData.formmeta.accessCode !== 7) {
        formMetaData.fields.nextReviewDate.required = true;
        formMetaData.fields.nextReviewDate.editable = true;
      } else {
        formMetaData.fields.nextReviewDate.required = false;
        formMetaData.fields.nextReviewDate.editable = false;
      }
    } else {
      formMetaData.fields.nextReviewDate.required = false;
      formMetaData.fields.nextReviewDate.visible = false;
      formMetaData.fields.nextReviewDate.editable = false;
    }

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

  form.reviewCycle.onChange(function (value) {
    if (value !== null) {
      formMetaData.fields.nextReviewDate.visible = true;
      if (value === "7") {
        formMetaData.fields.nextReviewDate.required = true;
        formMetaData.fields.nextReviewDate.editable = true;
      } else {
        formMetaData.fields.nextReviewDate.required = false;
        formMetaData.fields.nextReviewDate.editable = false;
      }
    } else {
      formMetaData.fields.nextReviewDate.visible = false;
      formMetaData.fields.nextReviewDate.required = false;
    }

    let currentDate = new Date();
    let formattedDate;

    switch (value) {
      case "1":
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case "2":
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case "3":
        currentDate.setDate(currentDate.getDate() + 30);
        break;
      case "4":
        currentDate.setDate(currentDate.getDate() + 90);
        break;
      case "5":
        currentDate.setDate(currentDate.getDate() + 180);
        break;
      case "6":
        currentDate.setDate(currentDate.getDate() + 365);
        break;
      case "7":
        formMethods.setValue("nextReviewDate", "");
        formMetaData.fields.nextReviewDate.required = true;
        return;
      default:
        formMetaData.fields.nextReviewDate.visible = false;
        formMetaData.fields.nextReviewDate.required = false;
        return;
    }

    formattedDate = currentDate.toISOString().split("T")[0];
    formMethods.setValue("nextReviewDate", formattedDate);
  });

  form.onLoad();

  return form;
};

export default JSHook;
