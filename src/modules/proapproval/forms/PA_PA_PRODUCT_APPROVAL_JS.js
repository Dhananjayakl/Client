import { useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { getroduedates } from "../../controltesting/ControltestingServices";

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

  //preliminaryChecklistId
  //operationPreparednessChecklistId

  const complianceTeam = useWatch({ control, name: "complianceTeam" });
  const riskTeam = useWatch({ control, name: "riskTeam" });
  const legalTeam = useWatch({ control, name: "legalTeam" });
  const cybersecurityTeam = useWatch({ control, name: "cybersecurityTeam" });
  const operationsTeam = useWatch({ control, name: "operationsTeam" });
  const financeTeam = useWatch({ control, name: "financeTeam" });
  const customerTeam = useWatch({ control, name: "customerTeam" });

  const schedule = formMethods.getValues("frequency");
  const effectiveDate = new Date(formMethods.getValues("startDate"));

  form.onLoad = (props) => {
    const schedule = formMethods.getValues("frequency");

    const dueBy = formMethods.getValues("dueBy");
    const startDate = formMethods.getValues("startDate");
    console.log(startDate, "schdaysToAddschdaysToAdd");

    if (!dueBy) {
      formMetaData.fields.onWorkingDay.editable = false;
      formMetaData.fields.onCalendarDay.editable = false;
    } else {
      formMetaData.fields.onWorkingDay.editable = true;
      formMetaData.fields.onCalendarDay.editable = true;
    }

    if (schedule == 1) {
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.startDate.required = true;
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.dueDate.visible = true;
      formMetaData.fields.dueDate.editable = true;
      formMetaData.fields.dueDate.required = true;
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;
    } else if (schedule == 8) {
      formMetaData.fields.dueDate.visible = true;
      formMetaData.fields.dueDate.editable = true;
      formMetaData.fields.dueDate.required = true;
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.startDate.required = true;
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;
    }
    // Weekly,Monthly,Quarterly, Semi-Annually,Annually
    else if (
      schedule == 2 ||
      schedule == 3 ||
      schedule == 4 ||
      schedule == 5 ||
      schedule == 6 ||
      schedule == 7
    ) {
      formMetaData.fields.dueBy.visible = true;
      formMetaData.fields.dueBy.required = true;
      formMetaData.fields.dueDate.visible = true;
      formMetaData.fields.dueDate.required = true;
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.startDate.required = true;
      formMetaData.fields.onWorkingDay.visible = true;
      formMetaData.fields.onCalendarDay.visible = true;
    } else {
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.dueDate.visible = false;
      formMetaData.fields.dueDate.required = false;
      formMetaData.fields.startDate.visible = false;
      formMetaData.fields.startDate.required = false;
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;
    }
  };

  const frequency = useWatch({
    control,
    name: `frequency`,
  });

  const Onworking = useWatch({
    control,
    name: ["onWorkingDay", "onCalendarDay"],
  });
  const Onworkings = useWatch({
    control,
    name: "onWorkingDay",
  });
  const Oncalenders = useWatch({
    control,
    name: "onCalendarDay",
  });

  const StartDueBy = useWatch({
    control,
    name: ["startDate", "dueBy"],
  });
  console.log("cbncbnbncbnc", frequency);

  //onChange Frequency Validation
  useEffect(() => {
    if (frequency == "1") {
      formMetaData.fields.dueDate.visible = false;
      formMetaData.fields.dueDate.editable = true;
      formMetaData.fields.dueDate.editable = false;
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.onWorkingDay.required = false;
      formMetaData.fields.onCalendarDay.required = false;
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;
      formMethods.setValue("schStartDate", "");
    } else if (frequency == "8") {
      formMetaData.fields.dueDate.visible = false;
      formMetaData.fields.dueDate.editable = true;
      formMetaData.fields.dueDate.editable = false;
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.onWorkingDay.required = false;
      formMetaData.fields.onCalendarDay.required = false;
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;
      formMethods.setValue("schStartDate", "");
    }
    // Weekly,Monthly,Quarterly, Semi-Annually,Annually
    else if (
      frequency == "2" ||
      frequency == "3" ||
      frequency == "4" ||
      frequency == "5" ||
      frequency == "6" ||
      frequency == "7"
    ) {
      formMetaData.fields.dueBy.visible = true;
      formMetaData.fields.dueBy.required = true;
      formMetaData.fields.dueDate.visible = true;
      formMetaData.fields.dueDate.required = true;
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.startDate.required = true;
      formMethods.setValue("startDate", "");
      formMethods.setValue("dueBy", "");
      formMethods.setValue("dueDate", "");
      formMethods.setValue("onCalendarDay", false);
      formMethods.setValue("onWorkingDay", false);
    } else {
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.dueDate.visible = false;
      formMetaData.fields.dueDate.required = false;
      formMetaData.fields.startDate.visible = false;
      formMetaData.fields.startDate.required = false;
    }
  }, [frequency]);
  form.frequency.onChange(function (value) {
    formMethods.setValue("startDate", "");
    formMethods.setValue("dueDate", "");
    formMethods.setValue("dueBy", "");
    formMethods.setValue("dueDate", "");
    formMethods.setValue("onCalendarDay", false);
    formMethods.setValue("onWorkingDay", false);
  });

  form.startDate.onChange((value) => {
    formMethods.setValue("dueBy", "");
    formMethods.setValue("dueDate", "");
    formMethods.setValue("onCalendarDay", false);
    formMethods.setValue("onWorkingDay", false);

    setScheduleData((prev) => ({ ...prev, schstartDateValue: value }));
  });

  const [scheduleData, setScheduleData] = useState({
    schstartDateValue: formMethods.getValues("startDate"),
    schdaysToAdd: parseInt(formMethods.getValues("dueBy"), 10),
  });

  // formMetaData.fields.dueDate.editable = false;
  form.dueBy.onChange((value) => {
    const startDate = formMethods.getValues("startDate");

    if (!startDate) {
      formMethods.setValue("dueBy", "");
      return;
    }

    if (value) {
      formMetaData.fields.onWorkingDay.editable = true;
      formMetaData.fields.onCalendarDay.editable = true;

      setScheduleData((prev) => ({ ...prev, schdaysToAdd: value }));
    }
    if (!value) {
      formMethods.setValue("dueDate", "");
    }
    if (value == "") {
      formMethods.setValue("onWorkingDay", false);
      formMethods.setValue("onCalendarDay", false);
      formMethods.setValue("dueDate", "");
      formMetaData.fields.onWorkingDay.editable = false;
      formMetaData.fields.onCalendarDay.editable = false;
    }
  });

  const [onWorkingDay, setOnWorkingDay] = useState(
    formMethods.getValues("onWorkingDay")
  );
  const [onCalendarDay, setOnCalendarDay] = useState(
    formMethods.getValues("onCalendarDay")
  );

  form.onWorkingDay.onChange(function (value) {
    formMetaData.fields.onCalendarDay.required = false;
    formMethods.setValue("dueDate", "");
    if (value) {
      setOnCalendarDay(false);
      formMethods.setValue("onCalendarDay", false);
    }
    setOnWorkingDay(value);
  });

  form.onCalendarDay.onChange(function (value) {
    formMetaData.fields.onWorkingDay.required = false;
    formMethods.setValue("dueDate", "");
    if (value) {
      setOnWorkingDay(false);
      formMethods.setValue("onWorkingDay", false);
    }
    setOnCalendarDay(value);
  });

  //API Call for dueDate
  useEffect(() => {
    const { schstartDateValue, schdaysToAdd } = scheduleData;

    const actualStartDateValue = schstartDateValue;
    const actualDaysToAdd = schdaysToAdd;

    if (actualDaysToAdd != "" && (Oncalenders == true || Onworkings == true)) {
      getroduedates(
        "getroduedate",
        actualStartDateValue,
        actualDaysToAdd,
        Onworkings,
        Oncalenders
      )
        .then((response) => {
          const fetchedDueDate = response.data;
          formMethods.setValue("dueDate", fetchedDueDate);
        })
        .catch((error) => {
          console.error("Failed to fetch due date:", error);
        });
    }
  }, [
    scheduleData.schstartDateValue,
    scheduleData.schdaysToAdd,
    Onworkings,
    onWorkingDay,
    onCalendarDay,
    Oncalenders,
    formMethods,
  ]);
  //alert popup for onworkingday and onCalender Day
  useEffect(() => {
    const disabledButton = document.querySelector(
      runtimeParams?.modal ? ".modaldisbutton" : ".disbutton"
    );

    const handleFormSubmit = (e) => {
      const allFalseOrNull = Onworking.every((value) => !value);
      const StartDueByNull = StartDueBy.every((value) => value);

      if (disabledButton != null) {
        if (
          allFalseOrNull &&
          StartDueByNull &&
          frequency !== JSON.stringify(1) &&
          frequency !== JSON.stringify(8) &&
          frequency !== ""
        ) {
          e.preventDefault();
          disabledButton.hidden = false;
          alert(
            "Please select either 'On Working Day' or 'On Calendar Day' to proceed"
          );
        } else {
          disabledButton.hidden = false;
        }
      }
    };

    if (disabledButton) {
      disabledButton.addEventListener("click", handleFormSubmit);
    }

    return () => {
      if (disabledButton) {
        disabledButton.removeEventListener("click", handleFormSubmit);
      }
    };
  }, [Onworking, frequency, StartDueBy]);

  const buttons = document.querySelectorAll(
    runtimeParams?.modal ? ".modaldisbutton" : ".disbutton"
  );
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

  useEffect(() => {
    const buttons = document.querySelectorAll(
      runtimeParams?.modal ? ".modaldisbutton" : ".disbutton"
    );
    showRelevantButtons();

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

    const preliminaryChecklistId =
      formMetaData?.configurationFormMetaData?.preliminary_risk_checklist;
    const operationChecklistId =
      formMetaData?.configurationFormMetaData
        ?.operational_preparedness_checklist;

    console.log(
      preliminaryChecklistId,
      operationChecklistId,
      "object id is different"
    );
    formMethods.setValue("preliminaryChecklistId", preliminaryChecklistId);
    formMethods.setValue(
      "operationPreparednessChecklistId",
      operationChecklistId
    );
  }, [schedule, formMethods, form, formValues]);

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

  const currentStage = formMethods.getValues("currentStage");
  const clarificationStages = formMethods.getValues("clarificationStages");

  useEffect(() => {
    if (currentStage === "APPROVE") {
      // console.log(clarificationStages, "clarification stages");

      const selectedValue =
        clarificationStages?.value ||
        (Array.isArray(clarificationStages) && clarificationStages[0]?.value) ||
        clarificationStages ||
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
  form.onLoad();

  return form;
};

export default JSHook;
