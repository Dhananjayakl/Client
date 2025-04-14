import { useEffect } from "react";
import { getObjectInfo } from "../BRService";
import { useWatch } from "react-hook-form";
let formMetaFields = [];
const JSHook = (form, formMetaData, formMethods, formValues, control) => {
  if (
    formMethods.getValues("previousStage") === null ||
    formMethods.getValues("previousStage") === ""
  ) {
    // formMethods.setValue("action", 1);
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }

  let existNotification = useWatch({
    control: control,
    name: "existNotification",
  });

  let approvers = useWatch({
    control: control,
    name: "approvers",
  });

  useEffect(() => {
    if (existNotification !== "") {
      getObjectInfo(
        "getObjectInfo",
        existNotification,
        "BR_EMERGENCY_NOTIFICATIONS",
        "OBJECT_ID"
      )
        .then((response) => {
          if (response.data && response.data.length > 0) {
            formMethods.setValue("subject", response.data[0].subject);
            formMethods.setValue("body", response.data[0].body);
          } else {
            formMethods.setValue("subject", "");
            formMethods.setValue("body", "");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      formMethods.setValue("subject", "");
      formMethods.setValue("body", "");
    }
  }, [existNotification]);
  const buttons = document.querySelectorAll(".disbutton");

  buttons.forEach((button) => {
    const buttonChildren = button.textContent.trim();

    if (approvers !== "") {
      if (buttonChildren === "Trigger Notification") {
        button.hidden = true;
      } else {
        button.hidden = false;
      }
    } else if (approvers === "") {
      if (buttonChildren === "Send for Approval") {
        button.hidden = true;
      } else {
        button.hidden = false;
      }
    } else {
      button.hidden = false;
    }
  });

  let action = useWatch({
    control: control,
    name: "action",
  });

  useEffect(() => {
    if (action === 1) {
      if (formMetaFields.length == 0) {
        for (const key in formMetaData.fields) {
          if (formMetaData.fields[key].required == true) {
            formMetaFields.push(key);
          }
        }
      }
      for (const key in formMetaData.fields) {
        if (key !== "notificationName") {
          formMetaData.fields[key].required = false;
        }
      }
    } else if (
      formMethods.getValues("currentStage") === "INITIATE" &&
      (action === 2 || action === 3 || action === 4)
    ) {
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
