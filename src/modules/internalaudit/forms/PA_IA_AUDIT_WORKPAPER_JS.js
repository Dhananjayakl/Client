import { useEffect, useState, useCallback } from "react";
import { useWatch } from "react-hook-form";
import { getObjectInfo } from "../IAService";
let JSHook = (
  form,
  formMetaData,
  formMethods,
  formValues,
  control,
  runtimeParams,
  setAuditName,
  TSTFields
) => {
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  let auditor = useWatch({
    control: control,
    name: "wpAuditor",
  });
  const [tstField, setTstField] = useState("");

  useEffect(() => {
    if (Array.isArray(TSTFields)) {
      TSTFields?.map((titem, ti) => {
        let TSTRecord = `TST.${ti}`;
        setTstField(`${TSTRecord}.tstResult`);
      });
    }
  }, [TSTFields]);

  let tstResult = {
    key: useWatch({
      control: control,
      name: tstField,
    }),
    value: tstField,
  };

  let tstName = useWatch({
    control: control,
    name: "TST",
  });
  useEffect(() => {
    if (formMethods.getValues("auditTitle") !== "") {
      getObjectInfo(
        "getObjectInfo",
        formMethods.getValues("auditTitle")[0].value,
        "IA_AUDITS",
        "object_id"
      )
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setAuditName(response.data[0].audit_title);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setAuditName("");
    }
  }, [formMethods.getValues("auditTitle")]);

  console.log(formMethods.getValues("auditTitle"), "iuewiufe");

  const buttons = document.querySelectorAll(".disbutton");
  useEffect(() => {
    buttons.forEach((button) => {
      const buttonChildren = button.textContent.trim();

      if (auditor === "" || auditor === null || auditor === userId) {
        if (buttonChildren === "Send To Auditor") {
          button.hidden = true;
        } else {
          button.hidden = false;
        }
      } else if (auditor !== "" && auditor !== userId) {
        if (buttonChildren === "Send for Approval") {
          button.hidden = true;
        } else {
          button.hidden = false;
        }
      } else {
        button.hidden = false;
      }
    });
  }, [buttons, auditor, userId]);

  if (
    formMethods.getValues("previousStage") === null ||
    formMethods.getValues("previousStage") === ""
  ) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }

  let action = useWatch({
    control: control,
    name: "action",
  });
  useEffect(() => {
    if (
      action === 5 ||
      action === 7 ||
      action === 8 ||
      action === 9 ||
      action === 10
    ) {
      formMetaData.fields.proceduresPerformed.required = false;
      formMetaData.fields.testResult.required = false;
      formMetaData.fields.result.required = false;
      formMetaData.fields.ctDesignEffectiveness.required = false;
      formMetaData.fields.ctOperatingEffectiveness.required = false;
      formMetaData.fields.sampleTested.required = false;
      formMetaData.fields.samplePassed.required = false;
      formMetaData.fields.tstResult.required = false;
      formMetaData.fields.tstName.required = false;
      formMetaData.fields.tstProcedure.required = false;
    } else {
      formMetaData.fields.proceduresPerformed.required = true;
      formMetaData.fields.testResult.required = true;
      formMetaData.fields.result.required = true;
      formMetaData.fields.ctDesignEffectiveness.required = true;
      formMetaData.fields.ctOperatingEffectiveness.required = true;
      formMetaData.fields.sampleTested.required = true;
      formMetaData.fields.samplePassed.required = true;
      formMetaData.fields.tstResult.required = true;
      formMetaData.fields.tstName.required = true;
      formMetaData.fields.tstProcedure.required = true;
    }
  }, [action]);

  form.ctDesignEffectiveness.onChange(function (value, row) {
    if (value == 2) {
      formMethods.setValue("CTL." + row + ".ctOperatingEffectiveness", "");
      if (!formMetaData.fields["CTL." + row + ".ctOperatingEffectiveness"]) {
        formMetaData.fields["CTL." + row + ".ctOperatingEffectiveness"] = {};
        formMetaData.fields[
          "CTL." + row + ".ctOperatingEffectiveness"
        ].editable = false;
      } else {
        formMetaData.fields[
          "CTL." + row + ".ctOperatingEffectiveness"
        ].editable = false;
      }
    } else {
      if (!formMetaData.fields["CTL." + row + ".ctOperatingEffectiveness"]) {
        formMetaData.fields["CTL." + row + ".ctOperatingEffectiveness"] = {};
        formMetaData.fields[
          "CTL." + row + ".ctOperatingEffectiveness"
        ].editable = true;
      } else {
        formMetaData.fields[
          "CTL." + row + ".ctOperatingEffectiveness"
        ].editable = true;
      }
    }
  });

  form.sampleTested.onChange(function (value, row) {
    if (value.length <= 5) {
      formMethods.setValue("TST." + row + ".sampleTested", value);
    } else {
      const truncatedValue = value.slice(0, 5);
      formMethods.setValue("TST." + row + ".sampleTested", truncatedValue);
    }
    value = parseFloat(value);

    const passedValues = parseFloat(
      formMethods.getValues("TST." + row + ".samplePassed")
    );
    if (value) {
      formMethods.setValue(
        "TST." + row + ".sampleFailed",
        value - passedValues
      );
      if (value - passedValues < 0) {
        formMethods.setValue("TST." + row + ".sampleFailed", "");
        formMethods.setError("TST." + row + ".samplePassed", {
          type: "manual",
          message:
            "Passed Samples values shouldn't be greater than the Total Samples value",
        });
      } else {
        formMethods.clearErrors("TST." + row + ".samplePassed");
      }
    }
    if (passedValues === value) {
      formMethods.setValue("TST." + row + ".sampleFailed", "0");
    }
    if (passedValues > value) {
      formMethods.setValue("TST." + row + ".samplePassed", "");
      formMethods.setError("TST." + row + ".samplePassed", {
        type: "manual",
        message:
          "Passed Samples values shouldn't be greater than the Total Samples value",
      });
    }
  });

  form.samplePassed.onChange(function (value, row) {
    if (value.length <= 5) {
      formMethods.setValue("TST." + row + ".samplePassed", value);
    } else {
      const truncatedValue = value.slice(0, 5);
      formMethods.setValue("TST." + row + ".samplePassed", truncatedValue);
    }
    const totalSamplesValue = parseFloat(
      formMethods.getValues("TST." + row + ".sampleTested")
    );

    value = parseFloat(value);

    if (
      !isNaN(value) &&
      !isNaN(totalSamplesValue) &&
      value > totalSamplesValue
    ) {
      formMethods.setValue("TST." + row + ".samplePassed", "");
      formMethods.setValue("TST." + row + ".sampleFailed", totalSamplesValue);

      formMethods.setError("TST." + row + ".samplePassed", {
        type: "manual",
        message:
          "Passed Samples values shouldn't be greater than the Total Samples value",
      });
    } else {
      if (!isNaN(value)) {
        let samplesFailedValue;
        if (value === totalSamplesValue) {
          samplesFailedValue = "0";
        } else {
          samplesFailedValue = totalSamplesValue - value;
        }
        formMethods.setValue(
          "TST." + row + ".sampleFailed",
          samplesFailedValue
        );
      } else {
        formMethods.setValue("TST." + row + ".sampleFailed", totalSamplesValue);
      }
      formMethods.clearErrors("TST." + row + ".samplePassed");
    }
  });
  form.onSubmit = function (actionName, actionCode) {
    return actionName;
  };
  return form;
};

export default JSHook;
