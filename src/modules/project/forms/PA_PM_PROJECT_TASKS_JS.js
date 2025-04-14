import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { getObjectInfo } from "../PMService";

let createTask = "Create Task";
let review = "Send for Review";
let submit = "Submit";
let update = "Update";
let reqClarification = "Request Clarification";
let submitClarification = "Submit Clarification";
let onHold = "On Hold";

let JSHook = (form, formMetaData, formMethods, formValues, control) => {
  form.onLoad = (props) => {
    const proposedStartDateVal = formMethods.getValues("plannedTaskStartDate");
    const proposedEndDateVal = formMethods.getValues("plannedTaskEndDate");
    if (formValues.objectId == null) {
      formMethods.setValue("action", 1);
      formMethods.setValue("currentStage", "INITIATE");
      formMethods.setValue("status", "New");
      formMetaData.fields.percentageOfCompletion.visible = false;
      formMetaData.fields.percentageOfCompletion.required = false;
      useEffect(() => {
        formMethods.setValue("taskStatus", 1);
      }, []);
    } else if (formValues.objectId > 0) {
      formMetaData.fields.plannedTaskStartDate.editable = false;
      formMetaData.fields.plannedTaskEndDate.editable = false;
      formMetaData.fields.percentageOfCompletion.visible = true;
      // formMetaData.fields.percentageOfCompletion.required = true;
    }
    if (proposedStartDateVal > proposedEndDateVal) {
      formMethods.setValue("plannedTaskEndDate", "");
    }
  };

  let projectId = useWatch({
    control: control,
    name: "projectName",
  });
  let productId = useWatch({
    control: control,
    name: "productName",
  });

  if (formValues.objectId == null) {
    if (projectId) {
      formMetaData.fields.productName.editable = false;
      formMetaData.fields.productName.required = false;
    } else {
      formMetaData.fields.productName.editable = true;
      formMetaData.fields.productName.required = true;
      formMethods.setValue("projectStatus", "");
    }
    if (productId) {
      formMetaData.fields.projectName.editable = false;
      formMetaData.fields.projectName.required = false;
      formMethods.setValue("projectStatus", "");
    } else {
      formMetaData.fields.projectName.editable = true;
      formMetaData.fields.projectName.required = true;
    }
  }

  useEffect(() => {
    getObjectInfo("getObjectInfo", projectId, "PM_PROJECT", "OBJECT_ID").then(
      (response) => {
        if (response.data && response.data.length > 0) {
          console.log(response.data, " Response Data");
          formMethods.setValue(
            "projectStatus",
            response.data[0].project_status
          );
          formMethods.setValue(
            "projectManager",
            response.data[0].project_manager
          );
          formMethods.setValue("classType", 1);
          formMethods.setValue("productName", 0);
        }
      }
    );
  }, [projectId]);
  useEffect(() => {
    getObjectInfo("getObjectInfo", productId, "PM_PRODUCT", "OBJECT_ID").then(
      (response) => {
        if (response.data && response.data.length > 0) {
          console.log(response.data, " Response Data");

          formMethods.setValue(
            "projectManager",
            response.data[0].product_manager
          );
          formMethods.setValue("classType", 2);
          formMethods.setValue("projectName", 0);
        }
      }
    );
  }, [productId]);
  form.plannedTaskStartDate.onChange((value) => {
    const proposedEndDate = formMethods.getValues("plannedTaskEndDate");
    if (proposedEndDate < value) {
      formMethods.setValue("plannedTaskEndDate", "");
    }
  });
  const validatePercentage = (fieldName, value, length) => {
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
  };
  form.percentageOfCompletion.onChange(function (value) {
    validatePercentage("percentageOfCompletion", value, 100);
  });

  form.onLoad();
  if (formValues.objectId > 0) {
    let progressStatus = useWatch({
      control: control,
      name: "taskStatus",
    });
    const buttons = document.querySelectorAll(".ms-1.disbutton");
    useEffect(() => {
      buttons.forEach((button) => {
        const buttonChildren = button.textContent.trim();
        if (buttonChildren === "Send for Review" && progressStatus != "6") {
          button.hidden = true;
        } else {
          button.hidden = false;
        }
      });
    }, [progressStatus]);
    let action = useWatch({
      control: control,
      name: "action",
    });
    useEffect(() => {
      if (action === 2) {
        formMetaData.fields.percentageOfCompletion.required = true;
        formMetaData.fields.taskReviewer.required = true;
        formMetaData.fields.comments.required = false;
      } else if (action === 5) {
        formMetaData.fields.comments.required = true;
      } else {
        formMetaData.fields.percentageOfCompletion.required = false;
        formMetaData.fields.comments.required = false;
      }
    }, [action]);
  }

  form.onSubmit = function (actionName, actionCode) {
    if (actionName == "Send for Review") {
      formMetaData.fields.taskReviewer.required = true;
      return actionName;
    } else if (actionName == "Submit") {
      return actionName;
    } else if (actionName == "Create Task") {
      return actionName;
    } else if (actionName == "Update") {
      return actionName;
    } else if (actionName == "Request Clarification") {
      return actionName;
    } else if (actionName == "Submit Clarification") {
      return actionName;
    } else if (actionName == "On Hold") {
      return actionName;
    }
  };

  return form;
};

export default JSHook;
