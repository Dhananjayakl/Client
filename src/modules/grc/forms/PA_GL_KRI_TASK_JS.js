import { useState, useEffect } from "react";
import { useWatch } from "react-hook-form";

const JSHook = (
  form,
  formMetaData,
  formMethods,
  formValues,
  runtimeParams,
  control,
  SUBFields,
  FNDFields,
  setBgc,
  setDataValue
) => {

    const [backgroundColor, setBackgroundColor] = useState("white");
  const [fieldvalue, setFieldValue] = useState("");
  form.onLoad = (props) => {
    const schedule = formMethods.getValues("frequency");

    if (schedule == 1) {
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.dueBy.visible = false;
      formMetaData.fields.dueDate.visible = true;
      formMetaData.fields.dueDate.required = true;
      formMetaData.fields.onWorkingDay.visible = false;
      formMetaData.fields.onCalendarDay.visible = false;
    } else if (schedule == 8) {
      formMetaData.fields.dueDate.visible = true;
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
  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };
  //collapse bgColor
  useEffect(() => {
    FNDFields.map((fitem, fi) => {
      let FNDRecord = `FND.${fi}`;

      setFieldValue(`${FNDRecord}.fndType`);
    });
  }, [FNDFields]);
  let fndType = {
    key: useWatch({
      control: control,
      name: fieldvalue,
    }),
    value: fieldvalue,
  };

  const logicValue = formMethods.getValues("logic");
  const highValue = formMethods.getValues("high");
  const lowValue = formMethods.getValues("low");
  const mediumValue = formMethods.getValues("medium");

  if (
    formMethods.getValues("previousStage") === null ||
    formMethods.getValues("previousStage") === ""
  ) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }

  let valuesCTD = formMethods.getValues("SUB");
  const ctdArray = Object.keys(valuesCTD).map((key) => valuesCTD[key]);
  let gapValues = []; // Array to store each gapValue

  for (let i = 0; i < ctdArray.length; i++) {
    const subValue = formMethods.getValues(`SUB.${i}.subValue`);
    if (subValue !== null && subValue !== undefined) {
      gapValues.push(Number(subValue)); // Store each gapValue
    }
  }

  const calculateResult = () => {
    const subValues = Object.values(gapValues).map((val) =>
      val === null ? 0 : Number(val)
    );

    if (subValues.length === 0) {
      return null;
    }

    if (logicValue === 1) {
      return subValues.reduce((acc, val) => acc + val, 0) / subValues.length;
    } else if (logicValue === 2) {
      return subValues.reduce((acc, val) => acc * val, 1);
    } else if (logicValue === 3) {
      return subValues.reduce((acc, val) => acc + val, 0);
    } else {
      return null;
    }
  };

  const result = calculateResult();

  useEffect(() => {
    if (formMetaData.formmeta.accessCode === 1) {
      formMethods.setValue("kriValue", Math.round(result));
    }
  }, [result]);

  const [krivalue, setkriValue] = useState("");
  form.kriValue.onChange(function (value) {
    setkriValue(value);
  });
  const finalData = formMethods.getValues("kriValue");

  useEffect(() => {
    let kriData = krivalue === "" ? finalData : krivalue;
    const numericValue = Number(kriData);

    if (numericValue === null || numericValue === "") {
      setBackgroundColor("black");
    } else if (numericValue >= 0) {
      if (
        Math.abs(numericValue - highValue) <
          Math.abs(numericValue - mediumValue) &&
        Math.abs(numericValue - highValue) < Math.abs(numericValue - lowValue)
      ) {
        setBackgroundColor("red");
      } else if (
        Math.abs(numericValue - mediumValue) < Math.abs(numericValue - lowValue)
      ) {
        setBackgroundColor("yellow");
      } else {
        setBackgroundColor("green");
      }
    } else {
      setBackgroundColor("black");
    }
  }, [highValue, mediumValue, lowValue, finalData, krivalue]);

  useEffect(() => {
    if (backgroundColor === "red") {
      formMethods.setValue("threshold", 1);
      setBgc("bg-danger");
    } else if (backgroundColor === "yellow") {
      formMethods.setValue("threshold", 2);
      setBgc("bg-warning");
    } else if (backgroundColor === "green") {
      formMethods.setValue("threshold", 3);
      setBgc("bg-success");
    } else {
      formMethods.setValue("threshold", "");
      setBgc("");
    }
  }, [backgroundColor]);
  //Finding Filed Conditional mandatory
  form.fndType.onChange(function (value, row) {
    if (value == 1) {
      //Finding Description
      if (!formMetaData.fields["FND." + row + ".fndDesc"]) {
        formMetaData.fields["FND." + row + ".fndDesc"] = {};
        formMetaData.fields["FND." + row + ".fndDesc"].required = true;
      } else {
        formMetaData.fields["FND." + row + ".fndDesc"].required = true;
      }
      //Finding Priority
      if (!formMetaData.fields["FND." + row + ".fndPriority"]) {
        formMetaData.fields["FND." + row + ".fndPriority"] = {};
        formMetaData.fields["FND." + row + ".fndPriority"].required = true;
      } else {
        formMetaData.fields["FND." + row + ".fndPriority"].required = true;
      }
      //Finding Severity
      if (!formMetaData.fields["FND." + row + ".fndSeverity"]) {
        formMetaData.fields["FND." + row + ".fndSeverity"] = {};
        formMetaData.fields["FND." + row + ".fndSeverity"].required = true;
      } else {
        formMetaData.fields["FND." + row + ".fndSeverity"].required = true;
      }
      //Finding BU
      if (!formMetaData.fields["FND." + row + ".fndBusinessUnit"]) {
        formMetaData.fields["FND." + row + ".fndBusinessUnit"] = {};
        formMetaData.fields["FND." + row + ".fndBusinessUnit"].required = true;
      } else {
        formMetaData.fields["FND." + row + ".fndBusinessUnit"].required = true;
      }
      //Finding Owner
      if (!formMetaData.fields["FND." + row + ".fndOwner"]) {
        formMetaData.fields["FND." + row + ".fndOwner"] = {};
        formMetaData.fields["FND." + row + ".fndOwner"].required = true;
      } else {
        formMetaData.fields["FND." + row + ".fndOwner"].required = true;
      }
      // Due Date
      if (!formMetaData.fields["FND." + row + ".fndDueDate"]) {
        formMetaData.fields["FND." + row + ".fndDueDate"] = {};
        formMetaData.fields["FND." + row + ".fndDueDate"].required = true;
      } else {
        formMetaData.fields["FND." + row + ".fndDueDate"].required = true;
      }
    } else {
      //Finding Description
      if (!formMetaData.fields["FND." + row + ".fndDesc"]) {
        formMetaData.fields["FND." + row + ".fndDesc"] = {};
        formMetaData.fields["FND." + row + ".fndDesc"].required = false;
      } else {
        formMetaData.fields["FND." + row + ".fndDesc"].required = false;
      }
      //Finding Priority
      if (!formMetaData.fields["FND." + row + ".fndPriority"]) {
        formMetaData.fields["FND." + row + ".fndPriority"] = {};
        formMetaData.fields["FND." + row + ".fndPriority"].required = false;
      } else {
        formMetaData.fields["FND." + row + ".fndPriority"].required = false;
      }
      //Finding Severity
      if (!formMetaData.fields["FND." + row + ".fndSeverity"]) {
        formMetaData.fields["FND." + row + ".fndSeverity"] = {};
        formMetaData.fields["FND." + row + ".fndSeverity"].required = false;
      } else {
        formMetaData.fields["FND." + row + ".fndSeverity"].required = false;
      }
      //Finding BU
      if (!formMetaData.fields["FND." + row + ".fndBusinessUnit"]) {
        formMetaData.fields["FND." + row + ".fndBusinessUnit"] = {};
        formMetaData.fields["FND." + row + ".fndBusinessUnit"].required = false;
      } else {
        formMetaData.fields["FND." + row + ".fndBusinessUnit"].required = false;
      }
      //Finding Owner
      if (!formMetaData.fields["FND." + row + ".fndOwner"]) {
        formMetaData.fields["FND." + row + ".fndOwner"] = {};
        formMetaData.fields["FND." + row + ".fndOwner"].required = false;
      } else {
        formMetaData.fields["FND." + row + ".fndOwner"].required = false;
      }
      //Finding Due Date
      if (!formMetaData.fields["FND." + row + ".fndDueDate"]) {
        formMetaData.fields["FND." + row + ".fndDueDate"] = {};
        formMetaData.fields["FND." + row + ".fndDueDate"].required = false;
      } else {
        formMetaData.fields["FND." + row + ".fndDueDate"].required = false;
      }
    }
  });

  form.kriValue.onChange((value) => {
    if (value.length <= 5) {
      formMethods.setValue("kriValue", value);
    } else {
      const truncatedValue = value.slice(0, 5);
      formMethods.setValue("kriValue", truncatedValue);
    }
  });

  const currentStage = formMethods.getValues("currentStage");
  if (currentStage === "CLOSE") {
    FNDFields.forEach((fitem, fi) => {
      let FNDRecord = `FND.${fi}`;
      console.log("FNDRecord", FNDRecord);
      formMetaData.fields[FNDRecord].disableDelete = true;
    });
  }
  form.onLoad();
  return form;
};

export default JSHook;
