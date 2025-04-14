import { useEffect, useState } from "react";
import * as Yup from "yup";

let JSHook = (form, formMethods, fields, callbackToParent) => {
  fields.TotalWorkhours.editable = false;
  const [StartTime, setStartTime] = useState("");
  const [EndTime, setEndTime] = useState("");

  form.workhoursEndTime.onChange(function (value) {
    setEndTime(value);
  });
  form.workhoursStartTime.onChange(function (value) {
    setStartTime(value);
  });

  let getStartDate = formMethods.getValues("workhoursStartTime");
  let getEndDate = formMethods.getValues("workhoursEndTime");
  let getTotalworkHours = formMethods.getValues("TotalWorkhours");

  let start, end;

  if (EndTime && StartTime) {
    start = new Date(`2000-01-01 ${StartTime}`);
    end = new Date(`2000-01-01 ${EndTime}`);
  } else if (getStartDate && getEndDate) {
    start = new Date(`2000-01-01 ${getStartDate}`);
    end = new Date(`2000-01-01 ${getEndDate}`);
  }

  useEffect(() => {
    const diffMilliseconds = end - start;
    const diffHours = diffMilliseconds / 3600000; // 3600000 ms in an hour
    const nonNegativeDiffHours = Math.max(0, diffHours).toFixed(2);
    if (nonNegativeDiffHours === "NaN") {
      formMethods.setValue("TotalWorkhours", getTotalworkHours);
    } else {
      formMethods.setValue("TotalWorkhours", nonNegativeDiffHours);
    }
  }, [end, start, formMethods, getTotalworkHours]);

  useEffect(() => {
    const validationSchema = Yup.object({
      workhoursName: Yup.string().required("Work hours Name is Required"),
      workhoursStartTime: Yup.string().required(
        "Work hours Start Time  is Required"
      ),
      workhoursEndTime: Yup.string()
        .required("Work hours End Time is required")
        .test(
          "greater-than-start-time",
          "Work hours End Time must be greater than Work hours Start Time",
          function (value) {
            const startTime = this.resolve(Yup.ref("workhoursStartTime"));

            return startTime < value;
          }
        ),
    });
    callbackToParent(validationSchema);
  }, []);
  return form;
};

export default JSHook;
