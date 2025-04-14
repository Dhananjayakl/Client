import { useEffect } from "react";
import { useWatch } from "react-hook-form";

let formMetaFields = [];

const JSHook = (
  form,
  fields,
  formMethods,
  formMetaData,
  formValues,
  control,
  changeTheAertModal
) => {
  let action = useWatch({
    control: control,
    name: "action",
  });
  useEffect(() => {
    if (
      formMethods.getValues("initiator") === null ||
      formMethods.getValues("initiator") === ""
    ) {
      formMethods.setValue(
        "initiator",
        JSON.parse(localStorage.current_logged_User)[0].user_details.data[0]
          .user_id
      );

      formMethods.setValue("action", 1);
      formMethods.setValue("currentStage", "INITIATE");
    }
    formMethods.setValue("comments", "");

    const handleFormSubmit = (actionName, e) => {
      if (
        formMethods.getValues("actionDueDate") != "" &&
        formMethods.getValues("actionStartDate") != ""
      ) {
        if (
          formMethods.getValues("actionDueDate") <
          formMethods.getValues("actionStartDate")
        ) {
          changeTheAertModal(
            "Action due date should not be less than Action start Date"
          );
          e.preventDefault();
        }
      }

      if (actionName === "Send For Approval") {
        if (formMethods.getValues("progressPercent") < 100) {
          changeTheAertModal(
            "Completion(%) should be 100% to send action for approval"
          );
          e.preventDefault();
        } else if (formMethods.getValues("progressPercent") > 100) {
          changeTheAertModal("% Complete should not exceed 100%");
          e.preventDefault();
        }
      }
    };
    // Select all buttons with the class `.disbutton`
    const allButtons = document.querySelectorAll(".modaldisbutton, .disbutton");

    // Attach event listeners to buttons
    const listeners = [];
    allButtons.forEach((button) => {
      const actionName = button.textContent.trim();
      const clickHandler = (e) => handleFormSubmit(actionName, e);

      button.addEventListener("click", clickHandler);
      listeners.push({ button, clickHandler });
    });

    // Cleanup function to remove all event listeners
    return () => {
      listeners.forEach(({ button, clickHandler }) => {
        button.removeEventListener("click", clickHandler);
      });
    };
  }, [action]);

  form.onSubmit = function (actionName) {
    if (actionName === "Approve Cancellation") {
      for (const key in formMetaData.fields) {
        formMetaData.fields[key].required = false;
      }
      return actionName;
    }
    if (
      actionName === "Submit Clarification" ||
      actionName === "Request Clarification" ||
      actionName === "Action Reviewed" ||
      actionName === "Close Action" ||
      actionName === "Initiate Action"
    ) {
      return actionName;
    }
    if (actionName === "Draft") {
      // for (const key in formMetaData.fields) {
      //   formMetaData.fields[key].required = false;
      // }
      // formMetaData.fields.actionTitle.required = true;
      return "skip";
    }
    if (actionName == "Update Action") {
      return "skip";
    }
    if (actionName === "Cancel Action") {
      for (const key in formMetaData.fields) {
        formMetaData.fields[key].required = false;
      }
      formMetaData.fields.reasonForCancel.required = true;
      formMetaData.fields.justificationForCancellation.required = true;
      return actionName;
    }
    if (actionName === "Send For Approval") {
      for (const key in formMetaData.fields) {
        formMetaData.fields[key].required = false;
        formMethods.setValue("reasonForCancel", null);
        formMethods.setValue("justificationForCancellation", null);
      }
      formMetaData.fields.actionWorkDone.required = true;
      formMetaData.fields.actionResults.required = true;
      formMetaData.fields.progressPercent.required = true;
      return actionName;
    }
  };

  form.progressPercent.onChange(function (value) {
    let exp = value.replace(/[^\d.]/g, "");
    const parts = exp.split(".");
    if (parts.length > 1) {
      parts[1] = parts[1].substring(0, 2);
    }
    exp = parts.join(".");
    exp = exp.length > 3 ? exp.slice(0, 3) : exp;
    exp = parseFloat(exp) > 100 ? "" : exp;
    formMethods.setValue("progressPercent", exp);
  });

  form.onCancel = (action) => {
    formMethods.setValue("comments", "");
    if (action == "Cancel Action Comments") {
      formMethods.setValue("reasonForCancel", null);
      formMethods.setValue("justificationForCancellation", null);
      formMetaData.fields.reasonForCancel.required = false;
      formMetaData.fields.justificationForCancellation.required = false;
    }
  };

  if (formMethods.getValues("currentStage") == "CANCEL-APPROVAL") {
    formMetaData.fields.reasonForCancel.editable = false;
    formMetaData.fields.justificationForCancellation.editable = false;
  }
  useEffect(() => {
    if (action === 1) {
      if (formMetaFields.length == 0) {
        for (const key in formMetaData.fields) {
          if (formMetaData.fields[key].required) {
            formMetaFields.push(key);
          }
        }
      }
      for (const key in formMetaData.fields) {
        if (key !== "actionTitle") {
          formMetaData.fields[key].required = false;
        }
      }
    }
    //  (
    //   formMethods.getValues("currentStage") === "INITIATE" &&
    //   (action === 1 || action === 5 || action === 8)
    // )
    else {
      if (formMetaFields.length != 0) {
        for (const key in formMetaFields) {
          formMetaData.fields[formMetaFields[key]].required = true;
        }
      }
    }
  }, [action]);
  return form;
};

export default JSHook;
