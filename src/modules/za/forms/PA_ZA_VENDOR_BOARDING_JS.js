import { useState, useEffect } from "react";
import { useWatch } from "react-hook-form";

let JSHook = (form, control, formMetaData, formMethods, formValues) => {
  if (
    formMethods?.getValues("previousStage") === undefined ||
    formMethods?.getValues("previousStage") === ""
  ) {
    formMethods?.setValue("currentStage", "INITIATE");
    formMethods?.setValue("status", "New");
  }

  let attachments = useWatch({
    control,
    name: "ATH",
  });

  let action = useWatch({
    control: control,
    name: "action",
  });

  form.onSubmit = function (actionName) {
    if (actionName == "Send for Business HOD Sign Off") {
      formMethods.setValue("comments", "");
      return actionName;
    }
    if (actionName == "Request Clarification") {
      console.log(attachments, "attachments in this stage");

      const canSubmit = attachments.some(
        (attachment) => attachment.athClarification === true
      );

      if (canSubmit) {
        return actionName;
      } else {
        alert(
          "At least one clarification must be checked to submit the request clarification."
        );

        return false;
      }
    }

    if (
      actionName === "Request Clarification" ||
      actionName === "Submit Clarification" ||
      actionName === "Submit Clarification for Business HOD Review" ||
      actionName === "Approve" ||
      actionName === "Save"
    ) {
      return "skip";
    }

    return actionName;
  };
  // form.athClarification.onChange(function (value, row) {
  //   if (
  //     value === true &&
  //     !formMetaData.fields["ATH." + row + ".athRiskReviewComments"]
  //   ) {
  //     formMetaData.fields["ATH." + row + ".athRiskReviewComments"] = {};
  //     formMetaData.fields[
  //       "ATH." + row + ".athRiskReviewComments"
  //     ].required = true;
  //     // formMetaData.fields[
  //     //   "ATH." + row + ".athRiskReviewComments"
  //     // ].required = true;
  //   } else {
  //     // formMetaData.fields[
  //     //   "ATH." + row + ".athRiskReviewComments"
  //     // ].required = false;
  //   }
  // });

  // useEffect(() => {
  //   const submitButtons = document.querySelectorAll(".disbutton");

  //   if (submitButtons.length > 0) {
  //     const firstSubmitButton = submitButtons[0]; // Target only the first button

  //     // Define the form submission handler
  //     const handleFormSubmit = (e) => {
  //       e.preventDefault(); // Prevent default form submission for validation

  //       // Check if any attachment has athClarification set to true
  //       const canSubmit = attachments.some(
  //         (attachment) => attachment.athClarification === true
  //       );

  //       if (!canSubmit) {
  //         alert(
  //           "At least one clarification must be checked to submit the form."
  //         );
  //       } else {
  //         console.log("Form can be submitted");
  //         // Submit the form programmatically if validation passes
  //       }
  //     };

  //     // Remove any previous event listener before adding a new one
  //     firstSubmitButton.removeEventListener("click", handleFormSubmit);
  //     firstSubmitButton.addEventListener("click", handleFormSubmit);

  //     // Clean up function to remove event listener when the component unmounts
  //     return () => {
  //       firstSubmitButton.removeEventListener("click", handleFormSubmit);
  //     };
  //   }
  // }, [attachments]);

  useEffect(() => {
    attachments?.map((ath, index) => {
      if (
        formValues?.currentStage === "SUBMIT_CLARIFICATION" &&
        formMethods.getValues(`ATH.${index}.athClarification`)
      ) {
        formMethods?.setValue(`ATH.${index}.athBusinessComments`, "");
      }
      if (
        formValues?.previousStage === "SUBMIT_CLARIFICATION" &&
        formMethods.getValues(`ATH.${index}.athClarification`)
      ) {
        formMethods?.setValue(`ATH.${index}.athClarification`, "");
        formMethods?.setValue(`ATH.${index}.athRiskReviewComments`, "");
      }
      const buttons = document.querySelectorAll(".disbutton");

      console.log(buttons, "action buttons in the stage");
      buttons?.forEach((button) => {
        const buttonText = button.textContent.trim();
        if (
          buttonText === "Submit Clarification" &&
          formValues.previousStage === "BUSINESS_HOD_REVIEW"
        ) {
          button.hidden = true;
        }
        if (
          buttonText === "Submit Clarification for Business HOD Review" &&
          formValues.previousStage === "REVIEW"
        ) {
          button.hidden = true;
        }
      });
    });
  }, []);

  return form;
};

export default JSHook;
