import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { getroduedates } from "../GrcService";

const JSHook = (
  form,
  formMetaData,
  formMethods,
  formValues,
  updatevalue,
  KRIsub,
  runtimeParams,
  control
) => {
  form.onLoad = (props) => {
    const schedule = formMethods.getValues("frequency");
    const objectId = formValues.objectId;
   const accessCode = formMetaData.formmeta.accessCode;
    
    if (schedule == 1) {
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueDate.visible = true;
      formMetaData.fields.dueDate.required = true;
      if(accessCode === 7){
        formMetaData.fields.dueDate.editable = false;
      } else {
        formMetaData.fields.dueDate.editable = true;
      }
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;
    } 
    else if (schedule == 8) {
      formMetaData.fields.dueDate.visible = true;
      if(accessCode === 7){
        formMetaData.fields.dueDate.editable = false;
      } else {
        formMetaData.fields.dueDate.editable = true;
      }
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.startDate.visible = true;
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
      //     (schedule == 2 || schedule == 3 || schedule == 4 || schedule == 5 || schedule == 6 || schedule == 7) &&
      // objectId == undefined
    ) {
      formMetaData.fields.dueBy.visible = true;
      formMetaData.fields.dueDate.visible = true;
      formMetaData.fields.startDate.visible = true;

      formMetaData.fields.onWorkingDay.visible = true;
      formMetaData.fields.onCalendarDay.visible = true;
    } else {
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueDate.visible = false;
      formMetaData.fields.startDate.visible = false;
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;
    }
  };

  const [valueComp, setValueComp] = useState("");
  const archive = formMethods.getValues("computation");
  const handleClick = (value) => {
    updatevalue(value);
  };
  useEffect(() => {
    if (archive && archive === true) {
      updatevalue(archive);
    }
  }, []);

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

  useEffect(() => {
    const objectId = formValues.objectId; // Get objectId from formValues
    const schedule = formMethods.getValues("frequency"); // Get schedule (frequency) from form methods

    // Case when frequency is 1
    if (schedule == 1) {
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.startDate.required = true;
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.dueDate.visible = false;
      formMetaData.fields.dueDate.required = false;
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;
      formMetaData.fields.onWorkingDay.required = false;
      formMetaData.fields.onCalendarDay.required = false;
      formMethods.setValue("schStartDate", "");
    }
    // Case when frequency is 8
    else if (schedule == 8) {
      formMetaData.fields.dueDate.visible = false;
      formMetaData.fields.dueDate.editable = false;
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;
      formMetaData.fields.onWorkingDay.required = false;
      formMetaData.fields.onCalendarDay.required = false;
      formMethods.setValue("schStartDate", "");
    }
    // Case when frequency is Weekly, Monthly, Quarterly, etc. AND objectId is undefined
    else if (
      (schedule == 2 ||
        schedule == 3 ||
        schedule == 4 ||
        schedule == 5 ||
        schedule == 6 ||
        schedule == 7) &&
      objectId === undefined
    ) {
      formMetaData.fields.dueBy.visible = true;
      formMetaData.fields.dueBy.required = true;
      formMetaData.fields.dueDate.visible = true;
      formMetaData.fields.dueDate.required = true;
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.startDate.required = true;
      // formMethods.setValue("startDate", "");
      // formMethods.setValue("dueBy", "");
      formMethods.setValue("dueDate", "");
      formMethods.setValue("onCalendarDay", false);
      formMethods.setValue("onWorkingDay", false);
    }
    // Case when frequency is Weekly, Monthly, Quarterly, etc. AND objectId is defined
    else if (
      (schedule == 2 ||
        schedule == 3 ||
        schedule == 4 ||
        schedule == 5 ||
        schedule == 6 ||
        schedule == 7) &&
      objectId !== undefined
    ) {
      const onWorkingDay =
        formValues.onWorkingDay != null
          ? Boolean(formValues.onWorkingDay)
          : false;
      const onCalendarDay =
        formValues.onCalendarDay != null
          ? Boolean(formValues.onCalendarDay)
          : false;

      console.log("onWorkingDay ==> ", onWorkingDay);
      console.log("onCalendarDay ==> ", onCalendarDay);

      formMetaData.fields.dueBy.visible = true;
      formMetaData.fields.dueBy.required = true;
      formMetaData.fields.dueDate.visible = true;
      formMetaData.fields.dueDate.required = true;
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.startDate.required = true;
      // formMethods.setValue("startDate", "");
      // formMethods.setValue("dueBy", "");
      formMethods.setValue("dueDate", "");
      formMethods.setValue("onCalendarDay", onCalendarDay);
      formMethods.setValue("onWorkingDay", onWorkingDay);
    }
    // Default case to hide all fields when no conditions match
    else {
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.dueDate.visible = false;
      formMetaData.fields.dueDate.required = false;
      formMetaData.fields.startDate.visible = false;
      formMetaData.fields.startDate.required = false;
    }
  }, [scheduler]); // Ensure dependencies include 'schedule' and 'formValues'

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

  form.high.onChange((value) => {
    const medium = parseFloat(formMethods.getValues("medium"));
    const low = parseFloat(formMethods.getValues("low"));
    const high = parseFloat(value);

    if (!isNaN(medium) && high <= medium) {
      formMethods.setValue("medium", "");
    }
    if (!isNaN(low) && high <= low) {
      formMethods.setValue("low", "");
    }
  });

  form.medium.onChange((value) => {
    const high = parseFloat(formMethods.getValues("high"));
    const low = parseFloat(formMethods.getValues("low"));
    const medium = parseFloat(value);

    if (!isNaN(high) && medium >= high) {
      formMethods.setValue("medium", "");
    }
    if (!isNaN(low) && medium <= low) {
      formMethods.setValue("low", "");
    }
  });

  form.low.onChange((value) => {
    const high = parseFloat(formMethods.getValues("high"));
    const medium = parseFloat(formMethods.getValues("medium"));
    const low = parseFloat(value);

    if (!isNaN(high) && low >= high) {
      formMethods.setValue("low", "");
    }
    if (!isNaN(medium) && low >= medium) {
      formMethods.setValue("low", "");
    }
  });

  const [scheduleData, setScheduleData] = useState({
    schstartDateValue: formMethods.getValues("startDate"),
    schdaysToAdd: parseInt(formMethods.getValues("dueBy"), 10),
  });

  formMetaData.fields.dueDate.editable = false;
  form.computation.onChange((value) => {
    handleClick(value);
    setValueComp(value);
  });

  form.riskCategory.onChange(() => {
    formMethods.setValue("risk", "");
    formMethods.setValue("process", "");
  });
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
        return;
      }

      // Validation: At least one KRI must be selected
      if (valueComp === true && KRIsub.fields.length === 0) {
        e.preventDefault();
        disabledButton.hidden = false;
        alert("At least one KRI must be selected to proceed");
        return;
      }

      disabledButton.hidden = false;
    };

    if (disabledButton) {
      disabledButton.addEventListener("click", handleFormSubmit);
    }

    return () => {
      if (disabledButton) {
        disabledButton.removeEventListener("click", handleFormSubmit);
      }
    };
  }, [Onworking, frequency, valueComp, KRIsub.fields.length, StartDueBy]);

  form.onLoad();

  return form;
};

export default JSHook;
