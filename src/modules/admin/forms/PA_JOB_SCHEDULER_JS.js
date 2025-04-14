import { useEffect, useState } from "react";

let JSHook = (form, formMethods, fields, formMetaData) => {
  console.log("Props from JS Hook:", form, formMethods, fields);
  console.log("see it from fields", fields);

  fields.days.visible = false;
  fields.byMinute.visible = false;
  fields.weekly.visible = false;
  fields.date.visible = false;
  formMetaData.fields.runAt.visible = false;
  fields.run.visible = false;

  const [scheduleType, setScheduleType] = useState();
  const [runValue, setRunValue] = useState();
  useEffect(() => {
    setRunValue(formMethods.getValues("run"));
  }, []);

  useEffect(() => {
    setScheduleType(formMethods.getValues("scheduleType"));
  }, []);

  form.scheduleType.onChange(function (value) {
    console.log(value, "valsch");
    formMethods.setValue("run", "0");
    formMethods.setValue("runAt", "");
    formMethods.setValue("weekly", "0");
    formMethods.setValue("byMinute", "");
    formMethods.setValue("date", undefined);
    formMethods.setValue("days", "0");

    setScheduleType(parseInt(value));
  });
  form.run.onChange(function (value) {
    setRunValue(parseInt(value));
    formMethods.setValue("runAt", "");
    formMethods.setValue("weekly", "0");
    formMethods.setValue("byMinute", "");
    formMethods.setValue("date", undefined);
    formMethods.setValue("days", "0");
  });
  console.log(scheduleType, runValue, "thanos");

  if (scheduleType) {
    fields.run.visible = true;
    fields.required = true;
  }
  if (!scheduleType) {
    // formMethods.setValue("run", 0);
    fields.byMinute.visible = false;
    fields.days.visible = false;
    fields.runAt.visible = false;
    fields.weekly.visible = false;
    fields.date.visible = false;
  }

  if (runValue == 1 || formMethods.getValues("run") == 1) {
    console.log(runValue, "runners");
    fields.runAt.visible = true;
    fields.days.visible = false;
    fields.byMinute.visible = false;
    fields.weekly.visible = false;
  } else if (runValue == 2 || formMethods.getValues("run") == 2) {
    console.log(runValue, "runners");
    fields.runAt.visible = true;
    fields.days.visible = false;
    fields.byMinute.visible = false;
    fields.weekly.visible = false;
  } else if (runValue == 3 || formMethods.getValues("run") == 3) {
    console.log(runValue, "runners");
    fields.runAt.visible = true;
    fields.days.visible = false;
    fields.byMinute.visible = false;
    fields.weekly.visible = true;
    fields.date.visible = false;
  } else if (runValue == 4 || formMethods.getValues("run") == 4) {
    console.log(runValue, "runners");
    fields.runAt.visible = false;
    fields.days.visible = false;
    fields.byMinute.visible = true;
    fields.weekly.visible = false;
    fields.date.visible = false;
  } else if (runValue == 5 || formMethods.getValues("run") == 5) {
    console.log(runValue, "runners");
    fields.runAt.visible = true;
    fields.days.visible = false;
    fields.byMinute.visible = false;
    fields.weekly.visible = false;
    fields.date.visible = true;
  } else if (runValue == 6 || formMethods.getValues("run") == 6) {
    console.log(runValue, "runners");
    fields.runAt.visible = true;
    fields.days.visible = true;
    fields.byMinute.visible = false;
    fields.weekly.visible = false;
    fields.date.visible = false;
  } else {
    fields.runAt.visible = false;
    fields.days.visible = false;
    fields.byMinute.visible = false;
    fields.weekly.visible = false;
    fields.date.visible = false;
  }

  return form;
};

export default JSHook;
