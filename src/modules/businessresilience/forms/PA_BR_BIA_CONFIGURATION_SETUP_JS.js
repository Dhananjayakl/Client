import { useEffect } from "react";
import { useWatch } from "react-hook-form";
const JSHook = (form, formMethods, control) => {
  const fieldNames = [
    { key: "rto1", value: "15" },
    { key: "rto2", value: "30" },
    { key: "rto3", value: "45" },
    { key: "rto4", value: "60" },
    { key: "rto5", value: "120" },
    { key: "rto6", value: "240" },
    { key: "rto7", value: "360" },
    { key: "rto8", value: "480" },
    { key: "rto9", value: "720" },
    { key: "rto10", value: "1440" },
    { key: "rto11", value: "2880" },
    { key: "rto12", value: "10080" },
    { key: "rto13", value: "20160" },
    { key: "rto14", value: "30240" },
    { key: "rto15", value: "40320" },
    { key: "rto16", value: "50400" },
  ];
  let valueCnt = 0;

  fieldNames.forEach((fieldName) => {
    if (formMethods.getValues(fieldName.key) === true) {
      valueCnt = valueCnt + 1;
    }
    console.log("valueCounting", valueCnt);
  });
  fieldNames.forEach((fieldName) => {
    form[fieldName.key].onChange(function (value) {
      if (value === true) {
        valueCnt = valueCnt + 1;
      } else if (value === false) {
        valueCnt = valueCnt - 1;
      }
      console.log("valueCount", valueCnt);
      if (valueCnt > 10) {
        formMethods.setValue(fieldName.key, false);
        valueCnt = valueCnt - 1;
      }
    });
  });
  const rtoFields = useWatch({
    control,
    name: [
      "rto1",
      "rto2",
      "rto3",
      "rto4",
      "rto5",
      "rto6",
      "rto7",
      "rto8",
      "rto9",
      "rto10",
      "rto11",
      "rto12",
      "rto13",
      "rto14",
      "rto15",
      "rto16",
    ],
  });

  let qstRegion = useWatch({
    control,
    name: "QST",
  });

  let qstActives = [];
  if (qstRegion !== undefined) {
    qstRegion.map((item) => {
      const value = item.qstActive;
      qstActives.push(value);
    });
  }
  useEffect(() => {
    const disabledButton = document.querySelector(".disbutton");

    const handleFormSubmit = (e) => {
      const allFalseOrNull = rtoFields.every((value) => !value);
      const questionActives = qstActives.every((value) => !value);
      if (disabledButton != null) {
        if (allFalseOrNull) {
          e.preventDefault();
          disabledButton.hidden = false;
          alert("At least one Duration field must be required.");
        } else {
          disabledButton.hidden = false;
        }
        if (questionActives) {
          e.preventDefault();
          disabledButton.hidden = false;
          alert(
            "At least one Active Asset/Process Assessment question is required."
          );
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
  }, [rtoFields, qstActives]);

  function handleInputChange(fieldName, value) {
    if (value.length > 5) {
      value = value.slice(0, 5);
    }
    let numericValue = parseFloat(value);
    if (numericValue > 100) {
      value = "";
    }
    const decimalPattern = /^\d+(\.\d{0,2})?$/;
    if (!decimalPattern.test(value)) {
      value = value.slice(0, -1);
    }
    formMethods.setValue(fieldName, value);
  }

  form.calculateRTO.onChange(function (value) {
    handleInputChange("calculateRTO", value);
  });

  form.calculateRPO.onChange(function (value) {
    handleInputChange("calculateRPO", value);
  });

  form.calculateMTD.onChange(function (value) {
    handleInputChange("calculateMTD", value);
  });

  function handleFieldChange(field, value) {
    if (value !== 0) {
      const storedValue = value;
      const fieldValue =
        storedValue === "0" || storedValue.length > 2 ? " " : storedValue;
      formMethods.setValue(field, fieldValue);
    }
  }

  form.biaReminder.onChange(function (value) {
    handleFieldChange("biaReminder", value);
  });

  form.biaOverDue.onChange(function (value) {
    handleFieldChange("biaOverDue", value);
  });

  form.bcpReminder.onChange(function (value) {
    handleFieldChange("bcpReminder", value);
  });

  form.bcpOverDue.onChange(function (value) {
    handleFieldChange("bcpOverDue", value);
  });

  return form;
};

export default JSHook;
