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
  setAlerts,
  setAlertss,
  setShowModal,
  setShowAlert,
  setShowAlerts
) => {
  let score = 0;
  let overallRating = 0;
  const [fieldvalue, setFieldValue] = useState("");
  let riskIdsWithKeys = (formValues.RSK || []).map((a, index) => ({
    id: a.riskId,
    key: index,
  }));
  let riskIdsWithControls = (formValues.CTL || []).map((a, index) => ({
    id: a.ctlParentRiskId,
    key: index,
  }));

  let Configure = formMetaData.configurationFormMetaData;

  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };
  function inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
  }
  // Function to validate input value
  function validatePercentage(value) {
    return value <= 100;
  }

  //collapse bgColor
  let fndType = {
    key: useWatch({
      control: control,
      name: fieldvalue,
    }),
    value: fieldvalue,
  };
  // Inherent Calculations
  form.calculateImpact = (row) => {
    score = Math.round(
      (parseInt(formMethods.getValues(`RSK.${row}.inhFinancial`)) +
        parseInt(formMethods.getValues(`RSK.${row}.inhReputational`)) +
        parseInt(formMethods.getValues(`RSK.${row}.inhStakeholder`)) +
        parseInt(formMethods.getValues(`RSK.${row}.inhLegal`))) /
        4
    );

    formMethods.setValue(`RSK.${row}.inhImpact`, score);
    form.calculateOverallInhImpact(row);
  };

  form.calculateOverallInhImpact = (row) => {
    overallRating =
      parseInt(formMethods.getValues(`RSK.${row}.inhImpact`)) *
      parseInt(formMethods.getValues(`RSK.${row}.inhLikelihood`));

    formMethods.setValue(`RSK.${row}.overallInhScore`, overallRating);

    for (let i = 0; i < Configure.SCR.length; i++) {
      if (
        inRange(
          overallRating,
          Configure.SCR[i].start_range,
          Configure.SCR[i].end_range
        )
      ) {
        formMethods.setValue(
          `RSK.${row}.inherentRating`,
          Configure.SCR[i].score
        );
      }
    }
  };

  // Residual Calculations using Factory

  form.calculateResImpact = (row) => {
    score = Math.round(
      (parseInt(formMethods.getValues(`RSK.${row}.resFinancial`)) +
        parseInt(formMethods.getValues(`RSK.${row}.resReputational`)) +
        parseInt(formMethods.getValues(`RSK.${row}.resStakeholder`)) +
        parseInt(formMethods.getValues(`RSK.${row}.resLegal`))) /
        4
    );

    formMethods.setValue(`RSK.${row}.resImpact`, score);
    form.calculateOverallResImpact(row);
  };

  // Residual Impact Calculations using Percentage

  form.calculateResImpactPercentage = (row) => {
    score = Math.round(
      parseInt(
        formMethods.getValues(`RSK.${row}.inhImpact`) *
          ((100 -
            parseInt(formMethods.getValues(`RSK.${row}.resImpactPercentage`))) /
            100)
      )
    );
    if (score == 0) {
      formMethods.setValue(`RSK.${row}.resImpact`, score + 1);
    } else {
      formMethods.setValue(`RSK.${row}.resImpact`, score);
    }
    form.calculateOverallResImpact(row);
  };
  // Residual Likelihood Calculations using Percentage

  form.calculateResLikelihoodPercentage = (row) => {
    score = Math.round(
      parseInt(
        formMethods.getValues(`RSK.${row}.inhLikelihood`) *
          ((100 -
            parseInt(
              formMethods.getValues(`RSK.${row}.resLikelihoodPercentage`)
            )) /
            100)
      )
    );
    if (score == 0) {
      formMethods.setValue(`RSK.${row}.resLikelihood`, score + 1);
    } else {
      formMethods.setValue(`RSK.${row}.resLikelihood`, score);
    }
    form.calculateOverallResImpact(row);
  };

  form.calculateOverallResImpact = (row) => {
    overallRating =
      parseInt(formMethods.getValues(`RSK.${row}.resImpact`)) *
      parseInt(formMethods.getValues(`RSK.${row}.resLikelihood`));

    formMethods.setValue(`RSK.${row}.overallResScore`, overallRating);

    for (let i = 0; i < Configure.SCR.length; i++) {
      if (
        inRange(
          overallRating,
          Configure.SCR[i].start_range,
          Configure.SCR[i].end_range
        )
      ) {
        formMethods.setValue(
          `RSK.${row}.residualRating`,
          Configure.SCR[i].score
        );
      }
    }
  };

  // Calculation of Controleffectiveness
  form.calculateControlEffectiveness = (row) => {
    let CEScore = 0;
    let validCount = 0; // Counter for valid values

    let rskid = formMethods.getValues(`CTL.${row}.ctlParentRiskId`);

    // Filter riskIdsWithKeys to find matching id
    let result = riskIdsWithKeys.find((obj) => obj.id === rskid);

    // Filter riskIdsWithControls to find matching id
    let Ctlresult = riskIdsWithControls.filter((obj) => obj.id === rskid);

    // Loop through each item in formValues.CTL
    for (let i = 0; i < Ctlresult.length; i++) {
      let ctlEffectiveness = parseInt(
        formMethods.getValues(`CTL.${Ctlresult[i].key}.ctlEffectiveness`)
      );

      // Check if ctlEffectiveness is a valid number
      if (!isNaN(ctlEffectiveness)) {
        CEScore += ctlEffectiveness;
        validCount++; // Increment the counter for valid values
      }
    }
    // Calculate TotalCEScore only if there are valid values
    let TotalCEScore = validCount > 0 ? Math.round(CEScore / validCount) : 0;

    // Set values in the form
    formMethods.setValue(`RSK.${result.key}.overllControlScore`, TotalCEScore);
    formMethods.setValue(
      `RSK.${result.key}.controlEffectivenessRating`,
      TotalCEScore
    );
  };
  // Assuming form.overrideResidualRating is a valid object
  form.overrideResidualRating.onChange(function (value) {
    if (value > 0) {
      setShowModal(true);
    }
    setAlert(value);
  });

  //Residual Factor Ratings Should not be greater than Inherent Factor Ratings
  form.checkInherentValue = (row, sourceFiled, destinationField) => {
    if (
      parseInt(formMethods.getValues(`RSK.${row}.${sourceFiled}`)) >
      parseInt(formMethods.getValues(`RSK.${row}.${destinationField}`))
    ) {
      formMethods.setValue(`RSK.${row}.${sourceFiled}`, "");

      setAlerts(true);
      setShowAlert(true);
    }
  };
  //Inherent Factor Ratings Should not be Lesser than Rasidual  Factor Ratings
  form.checkResidualValue = (row, sourceFiled, destinationField) => {
    if (
      parseInt(formMethods.getValues(`RSK.${row}.${sourceFiled}`)) <
      parseInt(formMethods.getValues(`RSK.${row}.${destinationField}`))
    ) {
      formMethods.setValue(`RSK.${row}.${sourceFiled}`, "");

      setAlertss(true);
      setShowAlerts(true);
    }
  };

  // Inherent Field OnChange

  form.inhFinancial.onChange(function (value, row) {
    form.calculateImpact(row);
    form.checkResidualValue(row, "inhFinancial", "resFinancial");
  });
  form.inhLegal.onChange(function (value, row) {
    form.calculateImpact(row);
    form.checkResidualValue(row, "inhLegal", "resLegal");
  });
  form.inhReputational.onChange(function (value, row) {
    form.calculateImpact(row);
    form.checkResidualValue(row, "inhReputational", "resReputational");
  });
  form.inhStakeholder.onChange(function (value, row) {
    form.calculateImpact(row);
    form.checkResidualValue(row, "inhStakeholder", "resStakeholder");
  });
  form.inhImpact.onChange(function (value, row) {
    form.calculateOverallInhImpact(row);
  });
  form.inhLikelihood.onChange(function (value, row) {
    form.calculateOverallInhImpact(row);
  });

  // Residual Filed OnChange

  form.resFinancial.onChange(function (value, row) {
    form.calculateResImpact(row);
    form.checkInherentValue(row, "resFinancial", "inhFinancial");
  });
  form.resLegal.onChange(function (value, row) {
    form.calculateResImpact(row);
    form.checkInherentValue(row, "resLegal", "inhLegal");
  });
  form.resReputational.onChange(function (value, row) {
    form.calculateResImpact(row);
    form.checkInherentValue(row, "resReputational", "inhReputational");
  });
  form.resStakeholder.onChange(function (value, row) {
    form.calculateResImpact(row);
    form.checkInherentValue(row, "resStakeholder", "inhStakeholder");
  });
  form.resImpact.onChange(function (value, row) {
    form.calculateOverallResImpact(row);
  });
  form.resLikelihood.onChange(function (value, row) {
    form.calculateOverallResImpact(row);
  });

  // Calculations for Percentage based Residual Rating
  form.resImpactPercentage.onChange(function (value, row) {
    form.calculateResImpactPercentage(row);
    form.calculateResLikelihoodPercentage(row);
    form.calculateOverallResImpact(row);
  });
  form.resLikelihoodPercentage.onChange(function (value, row) {
    form.calculateResImpactPercentage(row);
    form.calculateResLikelihoodPercentage(row);
    form.calculateOverallResImpact(row);
  });

  //Control Effectiveness OnChange

  form.ctlEffectiveness.onChange(function (value, row) {
    form.calculateControlEffectiveness(row);
  });

  // Adding validation to ensure the value does not exceed 100
  form.resImpactPercentage.onChange(function (value, row) {
    if (validatePercentage(value)) {
      form.calculateResImpactPercentage(row);
      form.calculateOverallResImpact(row);
    } else {
      formMethods.setValue(`RSK.${row}.resImpactPercentage`, "");
    }
  });

  // Adding validation to ensure the value does not exceed 100
  form.resLikelihoodPercentage.onChange(function (value, row) {
    if (validatePercentage(value)) {
      form.calculateResLikelihoodPercentage(row);
      form.calculateOverallResImpact(row);
    } else {
      formMethods.setValue(`RSK.${row}.resLikelihoodPercentage`, "");
    }
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
