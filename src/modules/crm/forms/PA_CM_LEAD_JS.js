import { useState, useEffect } from "react";
import { useWatch } from "react-hook-form";
let formMetaFields = [];

let JSHook = (form, formMethods, formMetaData, formValues, control) => {
  let action = useWatch({
    control: control,
    name: "action",
  });
  useEffect(() => {
    if (action === 3) {
      if (formMetaFields.length == 0) {
        for (const key in formMetaData.fields) {
          if (formMetaData.fields[key].required == true) {
            formMetaFields.push(key);
          }
        }
      }
      for (const key in formMetaData.fields) {
        if (
          key !== "prospect" &&
          key !== "contact" &&
          key !== "firstName" &&
          key !== "secondName"
        ) {
          formMetaData.fields[key].required = false;
        }
      }
    } else if (
      formMethods.getValues("currentStage") === "INITIATE" &&
      action === 1
    ) {
      // formMetaData.fields = JSON.parse(JSON.stringify(formMetaFields[0]));
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
