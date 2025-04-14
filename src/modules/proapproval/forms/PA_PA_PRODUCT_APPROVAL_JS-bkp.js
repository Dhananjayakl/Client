import { useWatch } from "react-hook-form";
import { useEffect } from "react";

const JSHook = (
  form,
  fields,
  formMethods,
  formValues,
  formMetaData,
  setFieldTitle,
  control,
  runtimeParams
) => {
  // Watch values
  const complianceTeam = useWatch({ control, name: "complianceTeam" });
  const riskTeam = useWatch({ control, name: "riskTeam" });
  const legalTeam = useWatch({ control, name: "legalTeam" });
  const cybersecurityTeam = useWatch({ control, name: "cybersecurityTeam" });
  const operationsTeam = useWatch({ control, name: "operationsTeam" });
  const financeTeam = useWatch({ control, name: "financeTeam" });
  const customerTeam = useWatch({ control, name: "customerTeam" });

  const schedule = formMethods.getValues("frequency");
  const effectiveDate = new Date(formMethods.getValues("startDate"));
  const dueBy = formMethods.getValues("dueBy");

  form.reviewCycles = (value) => {
    // No Review
    if (value == 5) {
      formMetaData.fields.nextReviewDate.visible = false;
      formMetaData.fields.nextReviewDate.required = false;
      formMetaData.fields.nextReviewDate.editable = false;
    }
    // Specific Date
    else if (value == 4) {
      formMetaData.fields.nextReviewDate.visible = true;
      formMetaData.fields.nextReviewDate.required = true;
      formMetaData.fields.nextReviewDate.editable = true;
    }
    // Days , Month and Years
    else if (value == 2 || value == 3 || value == 1) {
      formMetaData.fields.nextReviewDate.visible = true;
      formMetaData.fields.nextReviewDate.required = false;
      formMetaData.fields.nextReviewDate.editable = false;
    }
  };
  const showRelevantButtons = () => {
    if (formMethods.getValues("currentStage") === "INITIATE") {
      // Identify selected team
      const selectedTeam = Object.keys(teamButtonMap).find((team) =>
        formMethods.getValues(team)
      );

      buttons?.forEach((button) => {
        const buttonText = button.textContent.trim();

        if (buttonText === "Save") {
          button.hidden = false;
        } else if (selectedTeam && buttonText === teamButtonMap[selectedTeam]) {
          button.hidden = false;
        } else {
          button.hidden = true;
        }
      });
    } else if (formMethods.getValues("currentStage") === "APPROVE") {
      buttons?.forEach((button) => {
        const buttonText = button.textContent.trim();
        if (
          buttonText === "Launch Product" ||
          buttonText === "Request Clarification"
        ) {
          button.hidden = false;
        } else {
          button.hidden = true;
        }
      });
    }
  };

  const teamButtonMap = {
    complianceTeam: "Initiate Compliance Review",
    riskTeam: "Initiate Risk Review",
    legalTeam: "Initiate Legal Review",
    cybersecurityTeam: "Initiate IT / Cybersecurity Review",
    operationsTeam: "Initiate Operations Review",
    financeTeam: "Initiate Finance & Taxation Review",
    customerTeam: "Initiate Customer Service Review",
  };

  const buttons = document.querySelectorAll(
    runtimeParams?.modal ? ".modaldisbutton" : ".disbutton"
  );

  form.onLoad = () => {
    showRelevantButtons();
    form.reviewCycles(schedule);
    if (
      formMethods.getValues("currentStage") === "INITIATE" ||
      formValues.objectId === undefined
    ) {
      // Identify selected team
      const selectedTeam = Object.keys(teamButtonMap).find((team) =>
        formMethods.getValues(team)
      );

      buttons?.forEach((button) => {
        const buttonText = button.textContent.trim();

        if (buttonText === "Save") {
          button.hidden = false;
        } else if (selectedTeam && buttonText === teamButtonMap[selectedTeam]) {
          button.hidden = false;
        } else {
          button.hidden = true;
        }
      });
    } else if (formMethods.getValues("currentStage") === "APPROVE") {
      buttons?.forEach((button) => {
        const buttonText = button.textContent.trim();
        if (
          buttonText === "Launch Product" ||
          buttonText === "Request Clarification"
        ) {
          button.hidden = false;
        } else {
          button.hidden = true;
        }
      });
    }
  };

  form.onLoad();

  useEffect(() => {
    showRelevantButtons();
  }, [
    complianceTeam,
    riskTeam,
    legalTeam,
    cybersecurityTeam,
    operationsTeam,
    financeTeam,
    customerTeam,
  ]);

  // let clarificationStages = useWatch({
  //   control,
  //   name: "clarificationStages",
  // });

  function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  }
  // Function to Add Months to date
  function addMonths(date, months) {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + months);
    return newDate;
  }
  // Function to Add Years to date
  function addYears(date, years) {
    const newDate = new Date(date);
    newDate.setFullYear(date.getFullYear() + years);
    return newDate;
  }

  // Review cycle On Change
  form.frequency.onChange((value) => {
    console.log(value, "review cycle but not like this");
    form.reviewCycles(value);
    calculateNextReviewDate(value, dueBy);
  });

  form.dueBy.onChange((value) => {
    calculateNextReviewDate(schedule, value);
  });

  function calculateNextReviewDate(cycle, review) {
    // Utility to format date as YYYY-MM-DD
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    // Adding Days when review cycle is Days
    if (cycle == 1) {
      if (review !== "") {
        const newDate = addDays(effectiveDate, parseInt(review));
        formMethods.setValue("nextReviewDate", formatDate(newDate));
      } else {
        formMethods.setValue("nextReviewDate", "");
      }
    }
    // Adding Months when review cycle is Months
    else if (cycle == 2) {
      if (review !== "") {
        const newDate = addMonths(effectiveDate, parseInt(review));
        formMethods.setValue("nextReviewDate", formatDate(newDate));
      } else {
        formMethods.setValue("nextReviewDate", "");
      }
    }
    // Adding Years when review cycle is Years
    else if (cycle == 3) {
      if (review !== "") {
        const newDate = addYears(effectiveDate, parseInt(review));
        formMethods.setValue("nextReviewDate", formatDate(newDate));
      } else {
        formMethods.setValue("nextReviewDate", "");
      }
    }
  }

  // Function to show and hide the next review and review after fileds

  console.log(
    formMethods.getValues("clarificationStages"),
    "current action in this stage"
  );
  const currentStage = formMethods.getValues("currentStage");
  const clarificationStages = formMethods.getValues("clarificationStages");

  useEffect(() => {
    if (currentStage === "APPROVE") {
      // console.log(clarificationStages, "clarification stages");

      const selectedValue =
        clarificationStages?.value ||
        (Array.isArray(clarificationStages) && clarificationStages[0]?.value) ||
        null;

      if (selectedValue !== undefined) {
        formMethods.setValue("action", selectedValue);
        // or return actionName if needed
      } else {
        console.warn("No clarification stage selected");
        return null; // or handle it as needed
      }
    }
  }, [clarificationStages]);

  form.onSubmit = function (actionName) {
    const skipActions = [
      "Launch Product",
      "Initiate Compliance Review",
      "Initiate Risk Review",
      "Initiate Legal Review",
      "Send to Approval Committee",
      "Initiate IT / Cybersecurity Review",
      "Initiate Operations Review",
      "Initiate Finance & Taxation Review",
      "Initiate Customer Service Review",
      "Initiate Operational Preparedness",
      "Initiate Approval Committee",
      "Save",
    ];

    if (skipActions.includes(actionName)) {
      return "skip";
    }

    // if (actionName === "Request Clarification") {
    //   const clarificationStages = formMethods.getValues("clarificationStages");
    //   console.log(clarificationStages, "clarification stages");

    //   const selectedValue = clarificationStages[0]?.value;

    //   if (selectedValue !== undefined) {
    //     formMethods.setValue("action", selectedValue);
    //     // or return actionName if needed
    //   } else {
    //     console.warn("No clarification stage selected");
    //     return null; // or handle it as needed
    //   }
    // }

    return actionName;
  };

  return form;
};

export default JSHook;
