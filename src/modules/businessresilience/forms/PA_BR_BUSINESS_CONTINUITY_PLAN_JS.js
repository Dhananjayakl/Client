import { useEffect, useRef } from "react";
import { getviewData } from "../BRService";
import { useWatch } from "react-hook-form";
import { useLocation } from "react-router-dom";
let formMetaFields = [];

const JSHook = (
  form,
  formMetaData,
  formMethods,
  formValues,
  control,
  addPaRow,
  addPtRow,
  runtimeParams,
  setReportfilter,
  removept
) => {
  const editButton = document.querySelector(
    `.form-${formMetaData.formmeta.form_id}`
  );
  const location = useLocation();

  useEffect(() => {
    if (
      location?.state !== null &&
      location?.state?.objectData?.bia_id !== undefined
    ) {
      formMethods.setValue("processAsset", [
        location?.state?.objectData?.bia_id,
      ]);
    }
  }, [location?.state, formMethods]);

  if (editButton != null || editButton != undefined) {
    if (runtimeParams.editButton && runtimeParams.modal) {
      editButton.hidden = true;
    } else {
      editButton.hidden = false;
    }
  }

  let process = useWatch({
    control: control,
    name: "processAsset",
  });

  let PAP = useWatch({
    control: control,
    name: "PAP",
  });

  let PTA = useWatch({
    control: control,
    name: "PTA",
  });

  const previousPAP = useRef([]);

  useEffect(() => {
    if (PAP && PTA) {
      const removedPAPItems = previousPAP.current?.filter(
        (prevItem) =>
          !PAP.some((currentItem) => currentItem.riskId === prevItem.riskId)
      );

      if (removedPAPItems?.length) {
        const indicesToRemove = [];
        removedPAPItems.forEach((removedItem) => {
          PTA.forEach((ptaItem, ptaIndex) => {
            console.log(ptaItem.ptRisk, parseInt(removedItem.riskId), "Rest");

            if (ptaItem.ptRisk === parseInt(removedItem.riskId)) {
              indicesToRemove.push(ptaIndex);
            }
          });
        });

        indicesToRemove
          .sort((a, b) => b - a)
          .forEach((index) => {
            console.log(`Removing PTA row at index ${index}`);
            if (index >= 0) {
              removept(index);
            }
            // else {
            //   formMethods.setValue(`PTA.${index}.ptRisk`, "");
            //   formMethods.setValue(`PTA.${index}.ptTaskName`, "");
            //   formMethods.setValue(`PTA.${index}.ptTaskOwner`, "");
            //   formMethods.setValue(`PTA.${index}.ptTimeAllocated`, "");
            //   formMethods.setValue(`PTA.${index}.ptComments`, "");
            // }
          });
      }
    }

    previousPAP.current = PAP || [];
  }, [PAP, PTA]);

  let processAsset = formMethods.getValues("processAsset");

  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  let planOwner = useWatch({
    control: control,
    name: "planOwner",
  });

  const buttons = document.querySelectorAll(".disbutton");
  if (!runtimeParams.modal) {
    buttons.forEach((button) => {
      const buttonChildren = button.textContent.trim();

      if (
        Array.isArray(planOwner)
          ? planOwner[0]?.value
          : planOwner?.value === "" || Array.isArray(planOwner)
          ? planOwner[0]?.value
          : planOwner?.value === userId
      ) {
        if (buttonChildren === "Send to Owner") {
          button.hidden = true;
        } else {
          button.hidden = false;
        }
      } else if (
        Array.isArray(planOwner)
          ? planOwner[0]?.value
          : planOwner?.value !== "" && Array.isArray(planOwner)
          ? planOwner[0]?.value
          : planOwner?.value !== userId
      ) {
        if (buttonChildren === "Send for Approval") {
          button.hidden = true;
        } else {
          button.hidden = false;
        }
      } else {
        button.hidden = false;
      }
    });
  }

  useEffect(() => {
    if (formValues.objectId === undefined) {
      addPtRow();
      addPaRow();
    }
  }, [formValues]);
  const processArray = Array.isArray(process)
    ? process
    : Object.values(process);
  const processValues = processArray.map((item) => item.value);

  const rsData = {
    viewName: "pa_br_bia_recovery_strategy_details_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "order by version desc",
    filterExpression: `bia_id IN (${
      processValues && processValues.length > 0
        ? processValues.join(",")
        : processAsset
    })`,
  };

  useEffect(() => {
    if (process !== "" || processAsset !== "") {
      if (process !== "" || processAsset !== "") {
        getviewData(rsData)
          .then((response) => {
            const responseData = response.data;
            let allBusinessUnits = new Set();
            let alllabelBusinessUnits = new Set();
            let allBia = new Set();
            let flagBU = false;

            if (responseData && responseData.data.length > 0) {
              responseData.data.forEach((rowData, rowIndex) => {
                if (
                  rowData.owner_orgs &&
                  rowData.owner_orgs.length > 0 &&
                  Array.isArray(rowData.owner_orgs) &&
                  Array.isArray(rowData.d_owner_orgs) &&
                  rowData.owner_orgs.length === rowData.d_owner_orgs.length
                ) {
                  console.log(
                    rowData.owner_orgs,
                    "rowData.owner_orgs rowData.owner_orgs"
                  );

                  rowData.owner_orgs.forEach((unit) =>
                    allBusinessUnits.add(unit)
                  );
                  rowData.d_owner_orgs.forEach((unit) =>
                    alllabelBusinessUnits.add(unit)
                  );
                  flagBU = false;
                } else {
                  allBusinessUnits.add(rowData.owner_orgs);
                  alllabelBusinessUnits.add(rowData.d_owner_orgs);
                  flagBU = true;
                }
                if (rowData.master_object_id) {
                  allBia.add(rowData.master_object_id);
                }
              });
              let uniqueBusinessUnits;
              let uniqueLabelBusinessUnits;
              if (!flagBU) {
                uniqueBusinessUnits = Array.from(allBusinessUnits).sort();
                uniqueLabelBusinessUnits = Array.from(
                  alllabelBusinessUnits
                ).sort();
              } else {
                uniqueBusinessUnits = Array.from(allBusinessUnits)
                  .flatMap((unit) => unit.split(","))
                  .map((value) => Number(value.trim()))
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .sort((a, b) => a - b);
                uniqueLabelBusinessUnits = Array.from(alllabelBusinessUnits)
                  .flatMap((unit) => unit.split(","))
                  .map((value) => String(value.trim()))
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .sort((a, b) => a - b);
              }
              // let uniqueBusinessUnits = Array.from(allBusinessUnits).sort();

              const allBiaFormattedbia = `${[...allBia].join(", ")}`;

              setReportfilter(allBiaFormattedbia);
              // formMethods.setValue("ownOrgs", [
              //   {
              //     value: uniqueBusinessUnits,
              //     label: uniqueLabelBusinessUnits,
              //   },
              // ]);
              const ownOrgsArray = uniqueBusinessUnits.map((value, index) => ({
                value,
                label: uniqueLabelBusinessUnits[index] || "",
              }));

              formMethods.setValue("ownOrgs", ownOrgsArray);
              // formMethods.setValue("ownOrgs", uniqueBusinessUnits);
            } else {
              setReportfilter(null);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      setReportfilter(null);
    }
    if (
      !Array.isArray(process) ||
      (process.length === 0 &&
        (formValues.objectId === undefined ||
          formMethods.getValues("currentStage") === "INITIATE" ||
          formMethods.getValues("currentStage") === "CLOSE-APPROVE"))
    ) {
      formMethods.setValue("ownOrgs", "");
      setReportfilter(null);
      return;
    }
  }, [process, formMethods, processAsset]);

  if (
    formMethods.getValues("previousStage") === null ||
    formMethods.getValues("previousStage") === ""
  ) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }

  const getNextReviewDate = (value) => {
    if (value !== "") {
      const todaydate = new Date();
      todaydate.setFullYear(todaydate.getFullYear() + parseInt(value));
      todaydate.setDate(todaydate.getDate());
      formMethods.setValue("nextReviewDate", formatDate(todaydate));
    } else {
      formMethods.setValue("nextReviewDate", "");
    }
  };

  useEffect(() => {
    if (
      formValues.objectId === undefined ||
      formMethods.getValues("currentStage") === "INITIATE"
    ) {
      formMethods.setValue("frequencyReview", 1);
      getNextReviewDate(1);
    }
  }, []);
  form.frequencyReview.onChange(function (value) {
    getNextReviewDate(value);
  });

  function formatDate(jsonDate) {
    if (jsonDate === undefined || jsonDate == "") return "";
    const date = new Date(jsonDate);

    const getYear = date.toLocaleDateString("default", {
      year: "numeric",
    });
    const getMonth = date.toLocaleDateString("default", {
      month: "2-digit",
    });
    const getDay = date.toLocaleDateString("default", { day: "2-digit" });
    const formattedDate = getYear + "-" + getMonth + "-" + getDay;
    return formattedDate;
  }

  let action = useWatch({
    control: control,
    name: "action",
  });

  useEffect(() => {
    if (action === 3) {
      formMetaData.fields.comments.required = true;
    } else {
      formMetaData.fields.comments.required = false;
    }

    if (action === 8) {
      if (formMetaFields.length == 0) {
        for (const key in formMetaData.fields) {
          if (formMetaData.fields[key].required == true) {
            formMetaFields.push(key);
          }
        }
      }
      for (const key in formMetaData.fields) {
        if (key !== "planName") {
          formMetaData.fields[key].required = false;
        }
      }
    } else if (
      formMethods.getValues("currentStage") === "INITIATE" &&
      (action === 1 || action === 4)
    ) {
      if (formMetaFields.length != 0) {
        for (const key in formMetaFields) {
          formMetaData.fields[formMetaFields[key]].required = true;
        }
      }
    }
  }, [action]);
  function handleInputChange(fieldName, value, row) {
    if (value.length > 5) {
      value = value.slice(0, 5);
    }
    let numericValue = parseFloat(value);
    if (numericValue > 100000) {
      value = "";
    }
    const decimalPattern = /^\d*$/;
    if (!decimalPattern.test(value)) {
      value = value.slice(0, -1);
    }
    formMethods.setValue("PTA." + row + "." + fieldName, value);
  }

  form.ptTimeAllocated.onChange(function (value, row) {
    handleInputChange("ptTimeAllocated", value, row);
  });

  form.bridgeNumber.onChange(function (value) {
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    formMethods.setValue("bridgeNumber", value);
  });

  form.bridgePasscode.onChange(function (value) {
    if (value.length > 20) {
      value = value.slice(0, 20);
    }

    formMethods.setValue("bridgePasscode", value);
  });

  form.office.onChange(function (value) {
    if (value.length > 15) {
      value = value.slice(0, 15);
    }

    formMethods.setValue("office", value);
  });

  return form;
};

export default JSHook;
