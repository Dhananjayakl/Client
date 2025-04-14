import { useState, useEffect } from "react";
let review = "Request Clarification";
import { useWatch } from "react-hook-form";
const JSHook = (
  form,
  fields,
  formMethods,
  formValues,
  formMetaData,
  runtimeParams,
  control,

  TSTFields,
  CTLFields
) => {
  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };
  form.onLoad = (props) => {
    const editButton = document.querySelector(".edit");

    if (editButton != null || editButton != undefined) {
      if (formValues.currentStage == "CLOSE") {
        editButton.hidden = true;
      } else {
        editButton.hidden = false;
      }
    }
  };

  form.onLoad();
  //to apply bgcolor

  const [field, setField] = useState("");
  useEffect(() => {
    if (Array.isArray()) {
      TSTFields?.map((titem, vdd) => {
        let TSTRecord = `TST.${ti}`;
        setField(`${TSTRecord}.tstResult`);
      });
    }
  }, [TSTFields]);

  let tstResult = {
    key: useWatch({
      control: control,
      name: field,
    }),
    value: field,
  };

  let tstName = useWatch({
    control: control,
    name: "TST",
  });

  form.designEffectiveness.onChange(function (value, row) {
    if (value == 3) {
      formMethods.setValue("CTL." + row + ".operationalEffectiveness", "");
      if (!formMetaData.fields["CTL." + row + ".operationalEffectiveness"]) {
        formMetaData.fields["CTL." + row + ".operationalEffectiveness"] = {};
        formMetaData.fields[
          "CTL." + row + ".operationalEffectiveness"
        ].editable = false;
      } else {
        formMetaData.fields[
          "CTL." + row + ".operationalEffectiveness"
        ].editable = false;
      }
    } else {
      if (!formMetaData.fields["CTL." + row + ".operationalEffectiveness"]) {
        formMetaData.fields["CTL." + row + ".operationalEffectiveness"] = {};
        formMetaData.fields[
          "CTL." + row + ".operationalEffectiveness"
        ].editable = true;
      } else {
        formMetaData.fields[
          "CTL." + row + ".operationalEffectiveness"
        ].editable = true;
      }
    }
  });

  form.totalSamples.onChange(function (value, row) {
    if (value.length <= 5) {
      formMethods.setValue("TST." + row + ".totalSamples", value);
    } else {
      const truncatedValue = value.slice(0, 5);
      formMethods.setValue("TST." + row + ".totalSamples", truncatedValue);
    }
    value = parseFloat(value);

    const passedValues = parseFloat(
      formMethods.getValues("TST." + row + ".samplesPassed")
    );
    if (value) {
      formMethods.setValue(
        "TST." + row + ".samplesFailed",
        value - passedValues
      );
      if (value - passedValues < 0) {
        formMethods.setValue("TST." + row + ".samplesFailed", "");
        formMethods.setError("TST." + row + ".samplesPassed", {
          type: "manual",
          message:
            "Passed Samples values shouldn't be greater than the Total Samples value",
        });
      } else {
        formMethods.clearErrors("TST." + row + ".samplesPassed");
      }
    }
    if (passedValues === value) {
      formMethods.setValue("TST." + row + ".samplesFailed", "0");
    }
    if (passedValues > value) {
      formMethods.setValue("TST." + row + ".samplesPassed", "");
      formMethods.setError("TST." + row + ".samplesPassed", {
        type: "manual",
        message:
          "Passed Samples values shouldn't be greater than the Total Samples value",
      });
    }
  });

  form.samplesPassed.onChange(function (value, row) {
    if (value.length <= 5) {
      formMethods.setValue("TST." + row + ".samplesPassed", value);
    } else {
      const truncatedValue = value.slice(0, 5);
      formMethods.setValue("TST." + row + ".samplesPassed", truncatedValue);
    }
    const totalSamplesValue = parseFloat(
      formMethods.getValues("TST." + row + ".totalSamples")
    );

    value = parseFloat(value);

    if (
      !isNaN(value) &&
      !isNaN(totalSamplesValue) &&
      value > totalSamplesValue
    ) {
      formMethods.setValue("TST." + row + ".samplesPassed", "");
      formMethods.setValue("TST." + row + ".samplesFailed", totalSamplesValue);

      formMethods.setError("TST." + row + ".samplesPassed", {
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
          "TST." + row + ".samplesFailed",
          samplesFailedValue
        );
      } else {
        formMethods.setValue(
          "TST." + row + ".samplesFailed",
          totalSamplesValue
        );
      }
      formMethods.clearErrors("TST." + row + ".samplesPassed");
    }
  });

  const action_id = formMetaData.actions?.map((a) => a.action_id);
  console.log(action_id, "action_idaction_idaction_id");

  form.onSubmit = function (action_id) {
    if (action_id === 134) {
      console.log(action_id, "asdfghjkjrewq");

      formMetaData.fields.designEffectiveness.required = true;
    }
  };

  if (formValues.objectId != null) {
    const ProcedureId = formValues.TST?.map((a) => a.sourceProcedureId);
    const testname = formValues.TST?.map((k) => k.tstname);
    if (ProcedureId != null && testname != null) {
      // fields.tstName?.[0].editable=false;
    }
  }
  // On Submit Functionality for Action name
  form.onSubmit = function (actionName) {
    if (actionName == "Send for Approval") {
      return actionName;
    } else if (actionName == "Approve & Close") {
      return actionName;
    } else if (actionName == "Request Clarfication") {
      return actionName;
    } else if (actionName == "Submit Clarification") {
      return actionName;
    } else if (actionName == "Update Test Execution") {
      formMetaData.fields.designEffectiveness.required = true;
      return actionName;
    }
  };

  form.onSubmit = function (actionName) {
    const actionsRequiringCommentsReset = [
      "Send for Approval",
      "Approve & Close",
      "Request Clarification",
      "Submit Clarification",
      "Update Risk Assessment",
    ];

    if (actionsRequiringCommentsReset.includes(actionName)) {
      formMethods.setValue("comments", "");
      return actionName;
    }
  };

  return form;
};

export default JSHook;
