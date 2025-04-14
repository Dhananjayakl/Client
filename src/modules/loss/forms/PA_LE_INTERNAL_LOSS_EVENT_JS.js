import { useState, useEffect } from "react";
import { useWatch } from "react-hook-form";
import LE_CALCUALTION from "./LE_CALCULATION";
import { getviewData, getActionCode } from "src/modules/loss/lossFormService";
let Comment = "Comment";
let Reassign = "Reassign";

let FormFieldsBackup = [];
let currencyList = [];
let JSHook = (
  form,
  formMethods,
  formMetaData,
  runtimeParams,
  LeFields,
  arrayData,
  leRows,
  appendLE,
  removeLE,
  minThreshold
) => {
  const allapprovers = [
    "levelOneApprover",
    "levelTwoApprover",
    "levelThreeApprover",
    "levelFourApprover",
    "levelFiveApprover",
  ];
  const allapproverslevelcodes = [
    "LEVEL-1-APPR",
    "LEVEL-2-APPR",
    "LEVEL-3-APPR",
    "LEVEL-4-APPR",
    "LEVEL-5-APPR",
  ];
  const {
    control,
    formState: { errors, touched, isSubmitting, isDirty },
    watch,
  } = formMethods;

  const [refreshLossEntry, setRefreshLossEntry] = useState(false);
  // let actiondetails=useWatch({
  //   control : control,
  //   action : "action",
  // })

  const viewParams = {
    viewName: "pa_le_configuration_setup_cur_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: "cur_active=true",
  };

  useEffect(() => {
    if (
      formMethods.getValues("initiator") === null ||
      formMethods.getValues("initiator") === ""
    ) {
      formMethods.setValue("initiator", formMetaData.util.getCurrentUser().id);

      formMethods.setValue("currentStage", "INITIATE");
      formMethods.setValue("status", "New");
    }

    getviewData(viewParams)
      .then((response) => {
        currencyList = [];
        currencyList = response.data.data;
        if (response.data.data.length == 1) {
          if (
            response.data.data[0].cur_transactional_currency ==
            formMetaData.configurationFormMetaData.system_currency
          ) {
            formMetaData.fields.leCurrency.visible = false;
            formMetaData.fields.leEquivalentAmount.visible = false;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    LE_CALCUALTION(
      form,
      formMethods,
      formMetaData,
      runtimeParams,
      LeFields,
      arrayData,
      leRows,
      appendLE,
      removeLE
    );
  }, [arrayData, refreshLossEntry]);
  console.log(formMethods.getValues("LE"), "values of loss entry are here ");

  // form.leLossAmount.onChange(function (value, row) {
  //   let equiCalculation;
  //   if (currencyList.length > 0) {
  //     equiCalculation = currencyList.filter(
  //       (num) =>
  //         num.cur_transactional_currency ==
  //         formMethods.getValues("LE." + row + ".leCurrency")
  //     )[0].cur_conversion_rate;
  //   }

  //   let mtdValue = value.slice(0, 12);

  //   let totalEqui = equiCalculation * mtdValue;
  //   console.log("equiCalculation", totalEqui);

  //   formMethods.setValue(
  //     "LE." + row + ".leEquivalentAmount",
  //     parseFloat(totalEqui.toFixed(2))
  //   );

  //   var fieldsToManipulate = [
  //     "levelOneApprover",
  //     "levelTwoApprover",
  //     "levelThreeApprover",
  //     "levelFourApprover",
  //     "levelFiveApprover",
  //   ];
  //   // when ever we change the data we are making all fields unmadatory and making it require false
  //   fieldsToManipulate.forEach(function (fieldName) {
  //     formMetaData.fields[fieldName].required = false;
  //     formMetaData.fields[fieldName].visible = false;
  //   });

  //   setRefreshLossEntry(!refreshLossEntry);
  // });


  form.leLossAmount.onChange(function (value, row) {
    let equiCalculation = 1; // default fallback if not found
    if (currencyList.length > 0) {
      const selectedCurrency = formMethods.getValues("LE." + row + ".leCurrency");
  
      const matchedCurrency = currencyList.find(
        (num) => num.cur_transactional_currency === selectedCurrency
      );
  
      if (matchedCurrency && matchedCurrency.cur_conversion_rate) {
        equiCalculation = matchedCurrency.cur_conversion_rate;
      } else {
        console.warn("Currency not found or conversion rate missing for:", selectedCurrency);
      }
    }
  
    let mtdValue = value.slice(0, 12); // assuming this is always a number string
    let totalEqui = equiCalculation * mtdValue;
  
    console.log("equiCalculation", totalEqui);
  
    formMethods.setValue(
      "LE." + row + ".leEquivalentAmount",
      parseFloat(totalEqui.toFixed(2))
    );
  
    var fieldsToManipulate = [
      "levelOneApprover",
      "levelTwoApprover",
      "levelThreeApprover",
      "levelFourApprover",
      "levelFiveApprover",
    ];
  
    fieldsToManipulate.forEach(function (fieldName) {
      formMetaData.fields[fieldName].required = false;
      formMetaData.fields[fieldName].visible = false;
    });
  
    setRefreshLossEntry(!refreshLossEntry);
  });

  
  form.leCategory.onChange(function (value, row) {
    setRefreshLossEntry(!refreshLossEntry);
  });

  form.leCurrency.onChange(function (value, row) {
    let tem = "LE." + row + ".leLossAmount";
    // formMetaData.fields[tem].editable = true;
    let equiCalculation;
    if (currencyList.length > 0) {
      equiCalculation = currencyList.filter(
        (num) =>
          num.cur_transactional_currency ==
          formMethods.getValues("LE." + row + ".leCurrency")
      )[0].cur_conversion_rate;
    }

    let totalEqui =
      equiCalculation * formMethods.getValues("LE." + row + ".leLossAmount");
    formMethods.setValue(
      "LE." + row + ".leEquivalentAmount",
      parseFloat(totalEqui.toFixed(2))
    );
    var fieldsToManipulate = [
      "levelOneApprover",
      "levelTwoApprover",
      "levelThreeApprover",
      "levelFourApprover",
      "levelFiveApprover",
    ];
    // when ever we change the data we are making all fields unmadatory and making it require false and refresh data
    fieldsToManipulate.forEach(function (fieldName) {
      formMetaData.fields[fieldName].required = false;
      formMetaData.fields[fieldName].visible = false;
    });
    setRefreshLossEntry(!refreshLossEntry);
  });

  form.firstOccurrence.onChange(function (value) {
    const lastOccurrence = formMethods.getValues("lastOccurrence");
    const identifedOn = formMethods.getValues("identifedOn");
    const provisionOn = formMethods.getValues("provisionOn");
    const settlementOn = formMethods.getValues("settlementOn");
    const expectedClosure = formMethods.getValues("expectedClosure");
    if (value > lastOccurrence) {
      formMethods.setValue("lastOccurrence", "");
    }
    if (value > identifedOn) {
      formMethods.setValue("identifedOn", "");
    }
    if (value > provisionOn) {
      formMethods.setValue("provisionOn", "");
    }
    if (value > settlementOn) {
      formMethods.setValue("settlementOn", "");
    }
    if (value > expectedClosure) {
      formMethods.setValue("expectedClosure", "");
    }
  });

  form.lastOccurrence.onChange(function (value) {
    const identifedOn = formMethods.getValues("identifedOn");

    if (value > identifedOn) {
      formMethods.setValue("identifedOn", "");
    }
  });

  function handleInputChange(fieldName, value, length) {
    if (value.length > 5) {
      value = value.slice(0, 5);
    }
    let numericValue = parseFloat(value);
    if (numericValue > length) {
      value = "";
    }
    const decimalPattern = /^\d+(\.\d{0,2})?$/;
    if (!decimalPattern.test(value)) {
      value = value.slice(0, -1);
    }
    formMethods.setValue(fieldName, value);
  }

  form.laAllocation.onChange(function (value, row) {
    handleInputChange("LA." + row + ".laAllocation", value, 100);
    // console.log(value,"adjadsfjksdkjasdfkjdsjkf");
    // if(value.length>5){
    //   value=value.slice(0,-1);
    // }
    // let exp = value.replace(/[^\d.]/g, "");
    // const parts = exp.split(".");
    // if (parts.length > 1) {
    //   parts[1] = parts[1].substring(0, 2);
    // }
    // exp = parts.join(".");
    // exp = exp.length > 3 ? exp.slice(0, 3) : exp;
    // exp = parseFloat(exp) > 100 ? "" : parseFloat(exp);
    // console.log(typeof(value),"asdkjsaksjdskdjhaskdjhskja",value);

    // formMethods.setValue("LA." + row + ".laAllocation",exp);
  });

  form.bcgAllocation.onChange(function (value, row) {
    handleInputChange("BCG." + row + ".bcgAllocation", value, 100);
    // let exp = value.replace(/[^\d.]/g, "");
    // const parts = exp.split(".");
    // if (parts.length > 1) {
    //   parts[1] = parts[1].substring(0, 2);
    // }
    // exp = parts.join(".");
    // exp = exp.length > 3 ? exp.slice(0, 3) : exp;
    // exp = parseFloat(exp) > 100 ? "" : parseFloat(exp);

    // if(exp==0){
    //   formMethods.setValue("BCG." + row + ".bcgAllocation", 0);
    // }
    // else{
    //   formMethods.setValue("BCG." + row + ".bcgAllocation", exp);
    // }
  });

  //
  function currentApprover() {
    if (formMethods.getValues("currentStage") == "OWNER") {
      formMethods.setValue(
        "currentApprover",
        formMethods.getValues("levelOneApprover")
      );
    }
    if (formMethods.getValues("currentStage") == "LEVEL-1-APPR") {
      formMethods.setValue(
        "currentApprover",
        formMethods.getValues("levelTwoApprover")
      );
    }
    if (formMethods.getValues("currentStage") == "LEVEL-2-APPR") {
      formMethods.setValue(
        "currentApprover",
        formMethods.getValues("levelThreeApprover")
      );
    }
    if (formMethods.getValues("currentStage") == "LEVEL-3-APPR") {
      formMethods.setValue(
        "currentApprover",
        formMethods.getValues("levelFourApprover")
      );
    }
    if (formMethods.getValues("currentStage") == "LEVEL-4-APPR") {
      formMethods.setValue(
        "currentApprover",
        formMethods.getValues("levelFiveApprover")
      );
    }
    if (formMethods.getValues("currentStage") == "LEVEL-5-APPR") {
      formMethods.setValue("currentApprover", null);
    }
  }

  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };

  form.onSubmit = function (actionName, actionCode) {
    console.log(actionName, "actionNameactionNameactionName", actionCode);

    currentApprover();
    //this code is written for make reassign value null so that when reassign action is clicked the value will not show the existing user when closes previous value should be there and it should not be null
    if (actionName == "Reassign") {
      formMethods.setValue("reassignOwner", null);
    } else {
      formMethods.setValue(
        "reassignOwner",
        formMethods.getValues("reassignOwner")
      );
    }

    if (
      actionName == "Request For Clarification" ||
      actionName == "Cancel Loss"
    ) {
      for (const key in formMetaData.fields) {
        formMetaData.fields[key].required = false;
      }
    }

    if (
      actionName == "Assign To Owner" &&
      formMethods.getValues("currentStage") == "TRIAGE"
    ) {
      for (const key in formMetaData.fields) {
        formMetaData.fields[key].required = false;
      }

      if (actionName == "Assign To Owner") {
        formMetaData.fields.owner.required = true;
      }
    }

    if (
      (actionName == "Reassign" || actionName == "Update Incident") &&
      formMethods.getValues("currentStage") == "OWNER"
    ) {
      if (FormFieldsBackup.length == 0) {
        for (const key in formMetaData.fields) {
          if (formMetaData.fields[key].required == true) {
            FormFieldsBackup.push(key);
          }
        }
      }
      for (const key in formMetaData.fields) {
        formMetaData.fields[key].required = false;
      }
    }
    return actionName;
  };

  // after filling the comment if click on cancel the comment field is set to  empty
  form.onCancel = (action) => {
    formMethods.setValue("comments", "");
  };

  //this will restrict the form to submit when the  sum of basel category allocation and business unit allocation  is not 100% when form is with owner
  useEffect(() => {
    const handleFormSubmit = (actionName, e) => {
      if (
        (actionName == "Submit and Initiate Action" ||
          actionName == "Submit Clarification" ||
          actionName == "Submit") &&
        formMethods.getValues("currentStage") != "INITIATE" &&
        formMethods.getValues("currentStage") != "SUBMIT-CLARIFICATION-OWNER" &&
        formMethods.getValues("currentStage") != "SUBMIT-CLARIFICATION-TRIAGE"
      ) {
        let totalBcgAllocation = 0;
        let totalLaAllocation = 0;
        console.log("action details im fetching ", actionName, e);

        if (formMethods.getValues("BCG").length > 0) {
          for (let i = 0; i < formMethods.getValues("BCG").length; i++) {
            // totalBcgAllocation += formMethods.getValues("BCG")[i].bcgAllocation;
            const allocation = parseFloat(
              formMethods.getValues("BCG")[i].bcgAllocation
            );
            if (!isNaN(allocation)) {
              totalBcgAllocation += allocation;
            }
          }

          if (totalBcgAllocation != 100) {
            alert(
              "Total Basel Category allocation (%) value is not equal to 100(%)"
            );
            e.preventDefault();
          }
        }
        if (formMethods.getValues("totalNetLoss") < minThreshold) {
          alert(
            "Loss amount cannot be less than the minimum threshold value:" +
              minThreshold +
              " "
          );
          e.preventDefault();
        }

        if (formMethods.getValues("LA").length > 0) {
          for (let i = 0; i < formMethods.getValues("LA").length; i++) {
            const allocation = parseFloat(
              formMethods.getValues("LA")[i].laAllocation
            );
            if (!isNaN(allocation)) {
              totalLaAllocation += allocation;
            }
            // totalLaAllocation += formMethods.getValues("LA")[i].laAllocation;
          }

          if (totalLaAllocation != 100) {
            alert(
              "Total Business Unit Loss allocation (%) value is not equal to 100(%)"
            );
            e.preventDefault();
          }
        }
        if (FormFieldsBackup.length != 0) {
          for (const key in FormFieldsBackup) {
            formMetaData.fields[FormFieldsBackup[key]].required = true;
          }
        }
        formMetaData.fields.financialStatus.required = true;

        if (formMethods.getValues("LE").length == 0) {
          alert("Loss Event is not Created");
          e.preventDefault();
        }
      }
    };

    const allButtons = document.querySelectorAll(".disbutton");
    const listeners = [];
    allButtons.forEach((button) => {
      const actionName = button.textContent.trim();
      const clickHandler = (e) => handleFormSubmit(actionName, e);
      button.addEventListener("click", clickHandler);
      listeners.push({ button, clickHandler });
    });

    return () => {
      listeners.forEach(({ button, clickHandler }) => {
        button.removeEventListener("click", clickHandler);
      });
    };
  }, [formMethods.getValues("action"), minThreshold]);

  return form;
};

export default JSHook;
