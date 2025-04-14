import { useState, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { getroduedates } from "../ControltestingServices";

let JSHook = (
  form,
  fields,
  formMethods,
  formValues,
  formMetaData,
  control,
  runtimeParams
) => {
  formMetaData.fields.dueDate.editable = false;

  const controls = formMethods.getValues("controls");
  console.log(controls, "controlscontrols");

  form.framework.onChange((value) => {
    formMethods.setValue("assessableBusinessUnit", "");
    formMethods.setValue("assessableEntity", "");
    formMethods.setValue("controls", []);
  });

  form.frequency.onChange(function (value) {
    formMethods.setValue("startDate", "");
    formMethods.setValue("dueDate", "");
    formMethods.setValue("dueBy", "");
    formMethods.setValue("dueDate", "");
    formMethods.setValue("onCalendarDay", false);
    formMethods.setValue("onWorkingDay", false);
  });

  form.startDate.onChange(function (value) {
    formMethods.setValue("dueBy", "");
    formMethods.setValue("dueDate", "");

    if (
      !value ||
      value == "Invalid Date-Invalid Date-Invalid Date Invalid Date"
    ) {
      formMethods.setValue("dueDate", "");
      formMethods.setValue("onWorkingDay", false);
      formMethods.setValue("onCalendarDay", false);
    } else if (value) {
    }
  });

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
    if (frequency == 1) {
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
      // formMethods.setValue("schStartDate","")
    } else if (frequency == 8) {
      formMetaData.fields.dueDate.visible = false;
      formMetaData.fields.dueDate.editable = false;
      formMetaData.fields.dueDate.editable = false;
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.onWorkingDay.required = false;
      formMetaData.fields.onCalendarDay.required = false;
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;
      // formMethods.setValue("schStartDate","")
    }
    // Weekly,Monthly,Quarterly, Semi-Annually,Annually
    else if (
      frequency == 2 ||
      frequency == 3 ||
      frequency == 4 ||
      frequency == 5 ||
      frequency == 6 ||
      frequency == 7
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
    } else {
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.dueDate.visible = false;
      formMetaData.fields.dueDate.required = false;
      formMetaData.fields.startDate.visible = false;
      formMetaData.fields.startDate.required = false;
    }
  }, [scheduler]);

  const [scheduleData, setScheduleData] = useState({
    schstartDateValue: formMethods.getValues("startDate"),
    schdaysToAdd: parseInt(formMethods.getValues("dueBy"), 10),
  });

  form.startDate.onChange((value) => {
    const schStartDate = formMethods.getValues("startDate");
    setScheduleData((prev) => ({ ...prev, schstartDateValue: value }));
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
    if (value == "") {
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

  const Onworking = useWatch({
    control,
    name: ["onWorkingDay", "onCalendarDay"],
  });

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

  form.onLoad();

  return form;
};

export default JSHook;
