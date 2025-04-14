import { useState, useEffect, useRef } from "react";
import { useWatch } from "react-hook-form";
import { getroduedates } from "../ControltestingServices";

let JSHook = (
  form,
  fields,
  formMethods,
  formValues,
  formMetaData,
  runtimeParams,
  setAlert,
  setShowModal,
  control,
  setIsModalOpen
) => {
  // Handle initial load of the form
  form.onLoad = (props) => {
    const schedule = formMethods.getValues("frequency");
    const dueBy = formMethods.getValues("dueBy");
    const schStartDate = formMethods.getValues("startDate");

    if (!dueBy) {
      formMetaData.fields.onWorkingDay.editable = false;
      formMetaData.fields.onCalendarDay.editable = false;
    } else {
      formMetaData.fields.onWorkingDay.editable = true;
      formMetaData.fields.onCalendarDay.editable = true;
    }
    // Daily
    if (schedule == 1) {
      formMetaData.fields.dueDate.visible = true;
      formMetaData.fields.dueDate.editable = true;
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.startDate.required = true;
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;

      if (formMetaData.formmeta.accessCode == 7) {
        formMetaData.fields.dueDate.editable = false;
      }
    }
    //specific date
    else if (schedule == 8) {
      formMetaData.fields.dueDate.visible = true;
      formMetaData.fields.dueDate.editable = true;
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.startDate.required = true;
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;

      if (formMetaData.formmeta.accessCode == 7) {
        formMetaData.fields.dueDate.editable = false;
      }
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
      formMetaData.fields.dueDate.editable = false;
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.startDate.required = true;
      formMetaData.fields.onWorkingDay.visible = true;
      formMetaData.fields.onCalendarDay.visible = true;

      if (formMetaData.formmeta.accessCode == 7) {
        formMetaData.fields.onCalendarDay.editable = false;
        formMetaData.fields.onWorkingDay.editable = false;
      }
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
  const startDateValue = formMethods.getValues("start");
  const endDateValue = formMethods.getValues("end");

  // if endate is more than startdate
  if (startDateValue > endDateValue) {
    formMethods.setValue("end", "");
  }

  // Handle startDate change logic
  form.start.onChange((value) => {
    const endDate = formMethods.getValues("end");
    const schStartDate = formMethods.getValues("startDate");
    if (endDate < value) {
      formMethods.setValue("end", "");
    }
    if (schStartDate < value) {
      formMethods.setValue("startDate", "");
      formMethods.setValue("dueBy"),
        formMethods.setValue("onWorkingDay", false);
      formMethods.setValue("onCalendarDay", false);
      formMethods.setValue("dueDate", "");
    }
  });

  // Handle endDate change logic
  form.end.onChange((value) => {
    const startDate = formMethods.getValues("start");
    const schStartDate = formMethods.getValues("startDate");
    if (startDate > value) {
      formMethods.setValue("end", "");
    }
    if (schStartDate > value) {
      formMethods.setValue("startDate", "");
    }
  });

  // Logic for schStartDate change

  const alertShownRef = useRef(false);
  form.startDate.onChange((value) => {
    const schStartDate = formMethods.getValues("startDate");
    const endDateValue = formMethods.getValues("end");

    // Check if schStartDate is valid
    if (
      !value ||
      value == "Invalid Date-Invalid Date-Invalid Date Invalid Date"
    ) {
      formMethods.setValue("dueBy", "");
      formMethods.setValue("dueDate", "");

      setScheduleData({
        startDateValue: null,
        daysToAdd: null,
      });

      alertShownRef.current = false; // Reset alert state
    } else {
      if (
        endDateValue &&
        !isNaN(new Date(endDateValue)) &&
        new Date(endDateValue) < new Date(value)
      ) {
        setIsModalOpen(true);
        formMethods.setValue("startDate", " ");
      } else {
        setScheduleData((prev) => ({ ...prev, schstartDateValue: value }));
      }
    }
  });

  // Logic for schDueByDays change
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

  form.frequency.onChange(function (value) {
    formMethods.setValue("startDate", "");
    formMethods.setValue("dueDate", "");
    formMethods.setValue("dueBy", "");
    formMethods.setValue("dueDate", "");
    formMethods.setValue("onCalendarDay", false);
    formMethods.setValue("onWorkingDay", false);
  });

  // Handle the case of onworking day and onCalendar Day
  const [onWorkingDay, setOnWorkingDay] = useState(
    formMethods.getValues("onWorkingDay")
  );
  const [onCalendarDay, setOnCalendarDay] = useState(
    formMethods.getValues("onCalendarDay")
  );

  form.onWorkingDay.onChange(function (value) {
    formMetaData.fields.onCalendarDay.required = false;
    if (value) {
      setOnCalendarDay(false);
      formMethods.setValue("onCalendarDay", false);
    }
    setOnWorkingDay(value);
  });

  form.onCalendarDay.onChange(function (value) {
    formMetaData.fields.onWorkingDay.required = false;
    if (value) {
      setOnWorkingDay(false);
      formMethods.setValue("onWorkingDay", false);
    }
    setOnCalendarDay(value);
  });

  // Logic for calling api and set the duedate value
  const [scheduleData, setScheduleData] = useState({
    schstartDateValue: formMethods.getValues("startDate"),
    schdaysToAdd: parseInt(formMethods.getValues("dueBy"), 10),
  });

  const Onworkings = useWatch({
    control,
    name: "onWorkingDay",
  });

  const Oncalenders = useWatch({
    control,
    name: "onCalendarDay",
  });

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

  const [dateFormat, setDateFormat] = useState(false);

  // Handle the frquency filed and date fields validation logic
  const frequency = useWatch({
    control,
    name: `frequency`,
  });

  const StartDueBy = useWatch({
    control,
    name: ["startDate", "dueBy"],
  });

  useEffect(() => {
    if (frequency == 1) {
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.startDate.required = true;
      formMetaData.fields.dueDate.visible = true;
      formMetaData.fields.dueDate.editable = true;
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;
      formMetaData.fields.onWorkingDay.required = false;
      formMetaData.fields.onCalendarDay.required = false;
      if (formMetaData.formmeta.accessCode == 1) {
        formMethods.setValue("schStartDate", "");
      }

      if (formMetaData.formmeta.accessCode == 7) {
        formMetaData.fields.dueDate.editable = false;
      }
    } else if (frequency == 8) {
      formMetaData.fields.dueDate.visible = true;
      formMetaData.fields.dueDate.editable = true;
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.onWorkingDay.required = false;
      formMetaData.fields.onCalendarDay.required = false;
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;
      if (formMetaData.formmeta.accessCode == 1) {
        formMethods.setValue("startDate", "");
      }
      if (formMetaData.formmeta.accessCode == 7) {
        formMetaData.fields.dueDate.editable = false;
      }
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
      formMetaData.fields.dueBy.editable = false;
      formMetaData.fields.dueDate.visible = true;
      formMetaData.fields.dueDate.required = true;
      formMetaData.fields.dueDate.editable = false;
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.startDate.required = true;

      if (formMetaData.formmeta.accessCode == 1) {
        formMethods.setValue("startDate", "");
        formMethods.setValue("dueBy", "");
        formMethods.setValue("dueDate", "");
      }

      if (formMetaData.formmeta.accessCode == 7) {
        formMetaData.fields.onCalendarDay.editable = false;
        formMetaData.fields.onWorkingDay.editable = false;
      }
    } else {
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueBy.required = false;
      formMetaData.fields.dueDate.visible = false;
      formMetaData.fields.dueDate.required = false;
      formMetaData.fields.startDate.visible = false;
      formMetaData.fields.startDate.required = false;
    }
  }, [scheduler]);

  if (dateFormat === true) {
    formMethods.setValue("dueDate", "");

    setDateFormat(false);
  }

  // Handling the logic to display the alert message
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
