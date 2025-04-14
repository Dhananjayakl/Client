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
  }

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
      formMetaData.fields.nextReviewDate.editable = false;
    }

    var currentDate = new Date();
    var formattedDate;

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
