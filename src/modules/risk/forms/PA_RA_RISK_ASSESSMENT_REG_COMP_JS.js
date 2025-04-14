import { useState, useEffect } from "react";
import { useWatch } from "react-hook-form";

const JSHook = (
  form,
  fields,
  formMethods,
  formValues,
  formMetaData,
  runtimeParams,
  control,

  setAlert,
  setShowModal
) => {
  let score = 0;
  let overallRating = 0;

  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };

  const [fieldvalue, setFieldValue] = useState("");

  let fndType = {
    key: useWatch({
      control: control,
      name: fieldvalue,
    }),
    value: fieldvalue,
  };

  let riskIdsWithKeys = (formValues.REQ || []).map((a, index) => ({
    id: a.reqId,
    key: index,
  }));
  let riskIdsWithControls = (formValues.CTL || []).map((a, index) => ({
    id: a.parentRequirementId,
    key: index,
  }));

  let Configure = formMetaData.configurationFormMetaData;

  function inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
  }

  // Residual Calculations using Factory

  form.calculateImpact = (row) => {
    score = Math.round(
      (parseInt(formMethods.getValues(`REQ.${row}.inhFinancial`)) +
        parseInt(formMethods.getValues(`REQ.${row}.inhReputational`)) +
        parseInt(formMethods.getValues(`REQ.${row}.inhStakeholder`)) +
        parseInt(formMethods.getValues(`REQ.${row}.inhLegal`))) /
        4
    );

    formMethods.setValue(`REQ.${row}.inhImpact`, score);
    form.calculateOverallInhImpact(row);
  };

  form.calculateOverallInhImpact = (row) => {
    overallRating =
      parseInt(formMethods.getValues(`REQ.${row}.inhImpact`)) *
      parseInt(formMethods.getValues(`REQ.${row}.inhLikelihood`));

    //formMethods.setValue(`RSK.${row}.overallInhScore`, overallRating);

    for (let i = 0; i < Configure.SCR.length; i++) {
      if (
        inRange(
          overallRating,
          Configure.SCR[i].start_range,
          Configure.SCR[i].end_range
        )
      ) {
        formMethods.setValue(
          `REQ.${row}.inherentRating`,
          Configure.SCR[i].score
        );
      }
    }
  };

  function calculateControlEffectiveness(row) {
    let CEScore = 0;
    let validCount = 0; // Counter for valid values

    let rskid = formMethods.getValues(`CTL.${row}.parentRequirementId`);
    // let rskid = 175;
    console.log("hcghdghcfh", rskid, row);

    // Filter riskIdsWithKeys to find matching id
    let result = riskIdsWithKeys.find((obj) => obj.id === rskid);

    // Filter riskIdsWithControls to find matching id
    let Ctlresult = riskIdsWithControls.filter((obj) => obj.id === rskid);

    // Loop through each item in formValues.CTL
    for (let i = 0; i < Ctlresult.length; i++) {
      let ctlEffectiveness = parseInt(
        formMethods.getValues(`CTL.${Ctlresult[i].key}.overrideTestResult`)
      );

      // Check if ctlEffectiveness is a valid number
      if (!isNaN(ctlEffectiveness)) {
        CEScore += ctlEffectiveness;
        validCount++; // Increment the counter for valid values
      }
    }
    // Calculate TotalCEScore only if there are valid values
    let TotalCEScore = validCount > 0 ? Math.round(CEScore / validCount) : 0;

    formMethods.setValue(
      `REQ.${result?.key}.controlEffectiveness`,
      TotalCEScore
    );

    form.calculateResidualRating(result?.key);
  }

  form.calculateResidualRating = (row) => {
    let rating = 0;

    let inh = formMethods.getValues(`REQ.${row}.inherentRating`);
    let ctl = formMethods.getValues(`REQ.${row}.controlEffectiveness`);

    rating = Math.round(inh / ctl);

    if (rating == 0) {
      rating = 1;
    }
    formMethods.setValue(`REQ.${row}.residualRating`, rating);
  };

  // Inherent Field OnChange

  form.inhFinancial.onChange(function (value, row) {
    form.calculateImpact(row);
  });
  form.inhLegal.onChange(function (value, row) {
    form.calculateImpact(row);
  });
  form.inhReputational.onChange(function (value, row) {
    form.calculateImpact(row);
  });
  form.inhStakeholder.onChange(function (value, row) {
    form.calculateImpact(row);
  });

  form.inhImpact.onChange(function (value, row) {
    form.calculateOverallInhImpact(row);
    form.calculateResidualRating(row);
  });
  form.inhLikelihood.onChange(function (value, row) {
    form.calculateOverallInhImpact(row);
    form.calculateResidualRating(row);
  });
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

  //Control Effectiveness OnChange

  form.overrideTestResult.onChange(function (value, row) {
    calculateControlEffectiveness(row);
  });

  useEffect(() => {
    formMethods.getValues("CTL").map((item, index) => {
      calculateControlEffectiveness(index);
    });
  }, [formMethods]);

  form.inherentRating.onChange(function (value, row) {
    form.calculateResidualRating(row);
  });

  form.controlEffectiveness.onChange(function (value, row) {
    form.calculateResidualRating(row);
  });
  form.overrideResidualRating.onChange(function (value) {
    if (value > 0) {
      setShowModal(true);
    }
    setAlert(value);
  });
  // On Submit Functionality for Action name
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
