let LE_CALCUALTION = (
  form,
  formMethods,
  formMetaData,
  runtimeParams,
  LeFields,
  arrayData,
  leRows,
  appendLE,
  removeLE
) => {
  formMethods.setValue("netDirectLoss", null);
  formMethods.setValue("netIndirectLoss", null);
  formMethods.setValue("netAdditionalCost", null);
  formMethods.setValue("netRecoveryAmount", null);
  formMethods.setValue("totalGrossLoss", null);
  formMethods.setValue("totalNetLoss", null);
  formMethods.setValue("netPotentialAmount", null);
  formMethods.setValue("netExpectedAmount", null);

  console.log("aaaaaaaaa",arrayData)
  console.log("aaaaaaaaa 111111",LeFields)
  if (arrayData != undefined && arrayData.length != 0) {
    //   Net Direct Loss
    if (arrayData.filter((a) => a.leEntryType == 1) != []) {
      let sum = 0;
      let netDirectLoss = null;
      const ValueArray = arrayData
        .filter((a) => a.leEntryType == 1)
        .map((a) => a.leEquivalentAmount);

      for (let i = 0; i < ValueArray.length; i++) {
        sum = sum + Number(ValueArray[i]);
      }
      netDirectLoss = sum == 0 ? null : sum;

      formMethods.setValue("netDirectLoss", netDirectLoss);
    }
    //Net Indirect Loss
    if (arrayData.filter((a) => a.leEntryType == 2) != []) {
      let sum = 0;
      let netIndirectLoss = null;
      const ValueArray = arrayData
        .filter((a) => a.leEntryType == 2)
        .map((a) => a.leEquivalentAmount);

      for (let i = 0; i < ValueArray.length; i++) {
        sum = sum + Number(ValueArray[i]);
      }
      netIndirectLoss = sum == 0 ? null : sum;

      formMethods.setValue("netIndirectLoss", netIndirectLoss);
    }
    //Net Additional Cost
    if (arrayData.filter((a) => a.leEntryType == 3) != []) {
      let sum = 0;
      let additionalCost = null;
      const ValueArray = arrayData
        .filter((a) => a.leEntryType == 3)
        .map((a) => a.leEquivalentAmount);

      for (let i = 0; i < ValueArray.length; i++) {
        sum = sum + Number(ValueArray[i]);
      }
      additionalCost = sum == 0 ? null : sum;

      formMethods.setValue("netAdditionalCost", additionalCost);
    }

    //Recoveries
    if (arrayData.filter((a) => a.leEntryType == 4) != []) {
      let sum = 0;
      let netRecoveryAmount = null;
      const ValueArray = arrayData
        .filter((a) => a.leEntryType == 4)
        .map((a) => a.leEquivalentAmount);
      for (let i = 0; i < ValueArray.length; i++) {
        sum = sum + Number(ValueArray[i]);
      }
      netRecoveryAmount = sum == 0 ? null : sum;
      formMethods.setValue("netRecoveryAmount", netRecoveryAmount);
    }

    //Total Loss

    //totalgrossloss
    let totalgrossloss = null;
    totalgrossloss =
      formMethods.getValues("netDirectLoss") +
      formMethods.getValues("netIndirectLoss") +
      formMethods.getValues("netAdditionalCost");

    totalgrossloss = totalgrossloss == 0 ? null : totalgrossloss;
    formMethods.setValue("totalGrossLoss", totalgrossloss);

    //Total Net Loss

    let totalnetloss = null;

    totalnetloss = totalgrossloss - formMethods.getValues("netRecoveryAmount");
    totalnetloss = totalnetloss == 0 ? null : totalnetloss;
    formMethods.setValue("totalNetLoss", totalnetloss);

    //Potential Loss
    if (arrayData.filter((a) => a.leEntryType == 5) != []) {
      let sum = 0;
      let netExpectedAmount = null;
      const ValueArray = arrayData
        .filter((a) => a.leEntryType == 5)
        .map((a) => a.leEquivalentAmount);
      for (let i = 0; i < ValueArray.length; i++) {
        sum = sum + Number(ValueArray[i]);
      }
      if (sum != 0) {
        formMethods.setValue("netPotentialAmount", sum);
        netExpectedAmount = sum + formMethods.getValues("totalNetLoss");
        netExpectedAmount = netExpectedAmount == 0 ? null : netExpectedAmount;
        formMethods.setValue("netExpectedAmount", netExpectedAmount);
      } else {
        formMethods.setValue("netExpectedAmount", null);
      }
    }
  }

  return form;
};
export default LE_CALCUALTION;
