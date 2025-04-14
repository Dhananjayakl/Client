import { useState, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

let initiallyMandatoryQuestions = [];
const JSHook = (
  form,
  control,
  fields,
  formMethods,
  formValues,
  formMetaData,
  runtimeParams,
  PGEPages,
  SECSections,
  QSTQuestions,
  OPTOptions
) => {
  useEffect(() => {
    //const buttons = document.querySelectorAll(".modaldisbutton");
    const buttons = document.querySelectorAll(
      runtimeParams?.modal ? ".modaldisbutton" : ".disbutton"
    );

    buttons?.forEach((button) => {
      const buttonText = button.textContent.trim();

      if (formValues?.sourceFormName === "IA_CREATE_WORKPAPER") {
        // For "IA_CREATE_WORKPAPER", showing "Cancel Workpaper", "Save", and "Approve" buttons
        if (
          [
            // "Cancel Workpaper",
            "Send for Approval",
            "Save",
            "Approve",
            "Cancel",
          ].includes(buttonText)
        ) {
          button.hidden = false;
        } else {
          button.hidden = true;
        }
      } else {
        // For other cases, showing "Approve", "Reject", and "Save" buttons
        if (
          [
            "Approve",
            //"Reject",
            "Save",
            "Send for Approval",
            "Initiate Onboarding",
            "Initiate Due Diligence",
            "Onboard & Close",
          ].includes(buttonText)
        ) {
          //currentStage is "APPROVER", hiding the "Save" button
          if (
            buttonText === "Save" &&
            formValues?.currentStage === "APPROVER"
          ) {
            button.hidden = true;
          } else {
            button.hidden = false;
          }
        } else {
          button.hidden = true;
        }
      }
    });
  }, [formValues?.sourceFormName, formValues?.currentStage]);

  form.onSubmit = function (actionName, actionCode) {
    console.log(actionName, actionCode, "form submit actions");

    if (actionName === "Save" || actionCode === 2 || actionName === "Cancel") {
      // Store initially mandatory questions only once
      if (initiallyMandatoryQuestions.length === 0) {
        initiallyMandatoryQuestions = Object.keys(QSTQuestions).filter(
          (question) => QSTQuestions[question].qstMandatory === true
        );
      }

      Object.keys(QSTQuestions).forEach((question) => {
        QSTQuestions[question].qstMandatory = false;
      });

      Object.keys(formMetaData.fields).forEach((key) => {
        formMetaData.fields[key].required = false;
      });

      console.log("Mandatory questions set to false for saving.");
    }

    if (actionName === "Send for Approval") {
      initiallyMandatoryQuestions.forEach((question) => {
        if (QSTQuestions[question]) {
          QSTQuestions[question].qstMandatory = true;
        }
      });

      initiallyMandatoryQuestions.forEach((key) => {
        if (formMetaData.fields[key]) {
          formMetaData.fields[key].required = true;
        }
      });
    }
  };

  return form;
};

export default JSHook;
