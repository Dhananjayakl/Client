import { useState } from "react";

let JSHook = (form, formMethods, fields) => {
  const [value1, setvalue] = useState("");
  const [Rotate, setRotate] = useState("");

  form.regularizationApplicable.onChange(function (value) {
    setvalue(value);
  });

  if (value1 == 1 || formMethods.getValues("regularizationApplicable") == 1) {
    fields.workhours.visible = true;
    fields.gracePeriod.visible = true;
    fields.workHoursRotation.visible = true;
    fields.workhours.required = true;
    fields.gracePeriod.required = true;
    fields.workHoursRotation.required = true;
  } else {
    if (
      formMethods.getValues("regularizationApplicable") == 2 ||
      value1 == 2 ||
      formMethods.getValues("regularizationApplicable") == "" ||
      formMethods.getValues("regularizationApplicable") === "Select an option"
    )
      fields.workhours.visible = false;
    fields.gracePeriod.visible = false;
    fields.workHoursRotation.visible = false;
    fields.targetWorkhour.visible = false;
    fields.workhours.required = false;
    fields.gracePeriod.required = false;
    fields.workHoursRotation.required = false;
    fields.targetWorkhour.required = false;
    formMethods.setValue("workHoursRotation", 0);
    // formMethods.setValue('workhours',0)
    // formMethods.setValue('targetWorkhour',0)
    // formMethods.setValue('gracePeriod',0)
    formMethods.setValue("workhours", "");
    formMethods.setValue("targetWorkhour", "");
    formMethods.setValue("gracePeriod", "");
  }
  form.workHoursRotation.onChange(function (value) {
    setRotate(value);
  });
  if (
    (Rotate == 1 && value1 == 1) ||
    formMethods.getValues("workHoursRotation") == 1
  ) {
    fields.targetWorkhour.visible = true;
    fields.targetWorkhour.required = true;
  } else {
    if (
      Rotate == 2 ||
      formMethods.getValues("workHoursRotation") === "" ||
      formMethods.getValues("workHoursRotation") === 2 ||
      formMethods.getValues("workHoursRotation") == "Select an option"
    ) {
      fields.targetWorkhour.visible = false;
      fields.targetWorkhour.required = false;
      formMethods.setValue("targetWorkhour", "");

      // formMethods.setValue('targetWorkhour',0)
    }
  }
  return form;
};

export default JSHook;
