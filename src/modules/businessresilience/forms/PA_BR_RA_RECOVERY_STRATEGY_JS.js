import { useWatch } from "react-hook-form";
import { getviewData, getObjectInfo, getObjectCount } from "../BRService";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
const JSHook = (
  form,
  formMetaData,
  formMethods,
  formValues,
  appendRas,
  removeras,
  control,
  setBiaName,
  setGroupValue,
  setSectionName,
  seterrorMessage,
  setSuccessMessage,
  setbiaformId
) => {
  const [srcId, setSrcID] = useState("");

  const [msg, setMsg] = useState(0);
  form.biaName.onChange(function (value) {
    setSectionName("");
    removeras();
  });

  const location = useLocation();
  useEffect(() => {
    if (location.state !== null) {
      if (location.state.objectData?.bia_id !== undefined) {
        formMethods.setValue("biaName", location.state.objectData?.bia_id);
        setbiaformId(location.state?.objectData?.bia_id);
        formMetaData.fields.biaName.editable = false;
      }
    }
  }, [location?.state, formMetaData, formMethods]);
  let biaName = useWatch({
    control: control,
    name: "biaName",
  });

  let process = useWatch({
    control: control,
    name: "processName",
  });

  let asset = useWatch({
    control: control,
    name: "assetName",
  });

  let businessUnits = useWatch({
    control: control,
    name: "businessUnit",
  });

  const assetdependenciesData1 = {
    viewName: "pa_br_bia_process_assets_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "order by type",
    filterExpression: `tgt_obj_id=${asset?.value}`,
  };
  const assetdependenciesData2 = {
    viewName: "pa_br_bia_process_assets_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "order by type",
    filterExpression: `src_obj_id in (${srcId}) and bu_id=${
      businessUnits?.value
    } and type in (0,2) and tgt_obj_id in (select ctd_obj_id from pa_br_business_impact_analysis_ctd_bt where object_id=${
      biaName?.value ? biaName?.value : location?.state?.objectData?.bia_id
    } and ctd_obj_type != 3 and (ctd_is_applicable_during_crisis is null or ctd_is_applicable_during_crisis=1))`,
  };

  let filterExpression;
  let errorName = "";

  let rto = useWatch({
    control: control,
    name: "rto",
  });
  useEffect(() => {
    if (biaName !== "") {
      filterExpression = ` bia_name=${biaName?.value} `;

      errorName = "BIA Name";
    }
    if (biaName !== "" && formValues.objectId === undefined) {
      getObjectCount(
        "getObjectCount",
        "pa_br_ra_recovery_strategy",
        filterExpression
      )
        .then((response) => {
          if (response.data > 0) {
            removeras();
            setSectionName("");
            setMsg(response.data);
            seterrorMessage(
              `The selected  ${errorName} is already exist, please select different.`
            );
          } else {
            setMsg(response.data);
            removeras();
            setSectionName("");
            seterrorMessage(false);
            setSuccessMessage(null);
          }
        })
        .catch((err) => {
          console.log(err);
          setMsg(0);
          removeras();
          setSectionName("");
          seterrorMessage(false);
          setSuccessMessage(null);
        });
    } else {
      removeras();
      setSectionName("");
      seterrorMessage(false);
    }
    if (
      (biaName !== "" || location?.state?.objectData?.bia_id !== undefined) &&
      formValues.objectId === undefined
    ) {
      getObjectInfo(
        "getObjectInfo",
        location?.state?.objectData?.bia_id
          ? location?.state?.objectData?.bia_id
          : biaName?.value,
        "BR_BUSINESS_IMPACT_ANALYSIS",
        "object_id"
      )
        .then((response) => {
          if (response.data && response.data.length > 0 && msg === 0) {
            console.log(response.data, "responseeeessss");

            formMethods.setValue("processName", {
              value: response.data[0].process_name,
              label: response.data[0].d_process_name,
            });

            if (response.data[0].process_name > 0) {
              formMethods.setValue("assetName", "");
            }
            formMethods.setValue("assetName", {
              value: response.data[0].asset_name,
              label: response.data[0].d_asset_name,
            });
            if (response.data[0].asset_name > 0) {
              formMethods.setValue("processName", "");
            }

            formMethods.setValue("businessUnit", {
              value: response.data[0].business_unit,
              label: response.data[0].d_business_unit,
            });
            setBiaName(response.data[0].object_name);

            formMethods.setValue("biaOwner", {
              value: response.data[0].bia_owner,
              label: response.data[0].d_bia_owner,
            });
            formMethods.setValue("biaApprover", {
              value: response.data[0].bia_approver,
              label: response.data[0].d_bia_approver,
            });
            formMethods.setValue(
              "frequencyReview",
              response.data[0].schedule_frequency
            );
            formMethods.setValue(
              "nextReviewDate",
              response.data[0].next_review_date
            );
            formMethods.setValue("rto", response.data[0].imp_rto);
            formMethods.setValue("wrt", response.data[0].imp_wrt);
            formMethods.setValue("rpo", response.data[0].imp_rpo);
            formMethods.setValue("mtd", response.data[0].imp_mtd);
          } else {
            formMethods.setValue("rto", "");
            formMethods.setValue("wrt", "");
            formMethods.setValue("rpo", "");
            formMethods.setValue("mtd", "");
            formMethods.setValue("frequencyReview", "");
            formMethods.setValue("nextReviewDate", "");
            formMethods.setValue("processName", "");
            formMethods.setValue("assetName", "");
            formMethods.setValue("biaOwner", "");
            formMethods.setValue("biaApprover", "");
            formMethods.setValue("businessUnit", "");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (
      formValues.objectId === undefined &&
      process !== "" &&
      businessUnits !== "" &&
      businessUnits != undefined
    ) {
      let processdependenciesData;
      processdependenciesData = {
        viewName: "pa_br_bia_process_assets_v",
        pageNumber: 0,
        pageSize: 0,
        sortField: "",
        sortOrder: "",
        orderExpression: "order by type",
        filterExpression: `src_obj_id=${process?.value} and bu_id=${
          businessUnits?.value
        } and type !=3 and tgt_obj_id in (select ctd_obj_id from pa_br_business_impact_analysis_ctd_bt where object_id=${
          biaName?.value ? biaName?.value : location?.state?.objectData?.bia_id
        } and ctd_obj_type != 3 and (ctd_is_applicable_during_crisis is null or ctd_is_applicable_during_crisis=1))`,
      };

      if (process !== "") {
        getviewData(processdependenciesData)
          .then((response) => {
            const responseData = response.data;
            if (
              responseData &&
              responseData.data.length > 0 &&
              msg === 0 &&
              process != ""
            ) {
              removeras();
              const groupedData = responseData.data.reduce((acc, obj) => {
                const key = obj.tgt_obj_type;
                if (!acc[key]) {
                  acc[key] = [];
                }
                acc[key].push(obj);
                return acc;
              }, {});

              setGroupValue(groupedData);
              setSectionName(Object.keys(groupedData));

              const rasObjTypes = Object.keys(groupedData);

              rasObjTypes.forEach((rasObjType) => {
                groupedData[rasObjType].forEach((rowData) => {
                  appendRas(
                    {
                      raId: "",
                      raDependencies: {
                        value: rowData.tgt_obj_id,
                        label: rowData.tgt_obj_name,
                      },
                      raObjId: rowData.tgt_obj_id,
                      raObjType: rowData.type,
                      raDeptType: rowData.class_type,
                      raRto: rowData.rto,
                      dependencyGap:
                        rowData.rto > 0
                          ? JSON.stringify(rto - rowData.rto)
                          : "",
                      purpose: rowData.description,
                      primaryLocation: rowData.primary_location,
                      secondaryLocation: rowData.secondary_location,
                    },
                    { shouldFocus: false }
                  );
                });
              });
            } else {
              removeras();
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      if (process !== "") {
        const ctdObjTypeLabels = {
          0: "Process",
          1: "Asset",
          2: "Third Party",
          3: "SOP",
        };
        let humanResources = "Human Resource";
        const ctdLabels = [
          ...new Set(
            formValues.RAS.map((item) => ctdObjTypeLabels[item.ctdObjType])
          ),
        ];

        const groupedCtdList = formValues.RAS.reduce(
          (accumulator, currentValue) => {
            const { raId, raObjType, raDeptType } = currentValue;

            let label;
            if (raDeptType === 10) {
              label = humanResources;
            } else {
              label = ctdObjTypeLabels[raObjType];
            }

            if (!accumulator[label]) {
              accumulator[label] = [];
            }

            accumulator[label].push(raId);

            return accumulator;
          },
          {}
        );

        if (
          groupedCtdList[humanResources] &&
          !ctdLabels.includes(humanResources)
        ) {
          ctdLabels.push(humanResources);
        }

        setGroupValue(groupedCtdList);
        setSectionName(Object.keys(groupedCtdList));
      }
    }
    // }, [biaName, msg, process, rto, srcId, asset, businessUnits]);
  }, [biaName, msg, rto]);

  useEffect(() => {
    if (
      asset !== "" &&
      formValues.objectId === undefined &&
      businessUnits !== "" &&
      businessUnits !== undefined
    ) {
      getviewData(assetdependenciesData1).then((response) => {
        const responseData = response.data;
        if (responseData && responseData.data.length > 0) {
          const srcIds = responseData.data
            .map((item) => item.src_obj_id)
            .join(",");
          setSrcID(srcIds);
        }
      });
    }
  }, [asset, businessUnits]);

  useEffect(() => {
    if (formValues.objectId === undefined) {
      if (asset !== "") {
        getviewData(assetdependenciesData2).then((response) => {
          const responseData1 = response.data;
          if (
            responseData1 &&
            responseData1.data.length > 0 &&
            msg === 0 &&
            asset !== ""
          ) {
            removeras();
            const groupedData = responseData1.data.reduce((acc, obj) => {
              const key = obj.tgt_obj_type;
              const tgtObjId = obj.tgt_obj_id;

              if (!acc[key]) {
                acc[key] = {
                  items: [],
                  ids: new Set(),
                };
              }

              if (!acc[key].ids.has(tgtObjId)) {
                acc[key].items.push(obj);
                acc[key].ids.add(tgtObjId);
              }

              return acc;
            }, {});
            const finalGroupedData = Object.keys(groupedData).reduce(
              (acc, key) => {
                acc[key] = groupedData[key].items;
                return acc;
              },
              {}
            );

            setGroupValue(finalGroupedData);
            setSectionName(Object.keys(finalGroupedData));

            const rasObjTypes = Object.keys(finalGroupedData);

            rasObjTypes.forEach((rasObjTypes) => {
              finalGroupedData[rasObjTypes].forEach((rowData) => {
                if (formValues.objectId === undefined) {
                  appendRas(
                    {
                      raId: "",
                      raDependencies: {
                        value: rowData.tgt_obj_id,
                        label: rowData.tgt_obj_name,
                      },
                      raObjId: rowData.tgt_obj_id,
                      raObjType: rowData.type,
                      raDeptType: rowData.class_type,
                      raRto: rowData.rto,
                      dependencyGap:
                        rowData.rto > 0
                          ? JSON.stringify(rto - rowData.rto)
                          : "",
                      purpose: rowData.description,
                      primaryLocation: rowData.primary_location,
                      secondaryLocation: rowData.secondary_location,
                    },
                    { shouldFocus: false }
                  );
                }
              });
            });
          } else {
            removeras();
          }
        });
      }
    } else {
      if (asset !== "") {
        const ctdObjTypeLabels = {
          0: "Process",
          1: "Asset",
          2: "Third Party",
          3: "SOP",
        };
        let humanResources = "Human Resource";
        const ctdLabels = [
          ...new Set(
            formValues.RAS.map((item) => ctdObjTypeLabels[item.ctdObjType])
          ),
        ];

        const groupedCtdList = formValues.RAS.reduce(
          (accumulator, currentValue) => {
            const { raId, raObjType, raDeptType } = currentValue;

            let label;
            if (raDeptType === 10) {
              label = humanResources;
            } else {
              label = ctdObjTypeLabels[raObjType];
            }

            if (!accumulator[label]) {
              accumulator[label] = [];
            }

            accumulator[label].push(raId);

            return accumulator;
          },
          {}
        );

        if (
          groupedCtdList[humanResources] &&
          !ctdLabels.includes(humanResources)
        ) {
          ctdLabels.push(humanResources);
        }

        setGroupValue(groupedCtdList);
        setSectionName(Object.keys(groupedCtdList));
      }
    }
  }, [msg, rto, srcId, asset, formValues]);

  let reStrategy = useWatch({
    control: control,
    name: "recoveryStrategy",
  });

  form.recoveryStrategy.onChange(function (value) {
    formMethods.setValue("responsible", "");
    formMethods.setValue("raLocation", "");
    formMethods.setValue("raAttachments", "");
  });

  if (reStrategy == 4) {
    formMetaData.fields.responsible.editable = false;
    formMetaData.fields.responsible.required = false;
    formMetaData.fields.raLocation.editable = false;
    formMetaData.fields.raLocation.required = false;
    formMetaData.fields.raAttachments.editable = false;
  } else {
    if (formValues.objectId === undefined) {
      formMetaData.fields.responsible.editable = true;
      formMetaData.fields.responsible.required = true;
      formMetaData.fields.raLocation.editable = true;
      formMetaData.fields.raLocation.required = true;
      formMetaData.fields.raAttachments.editable = true;
    }
  }

  if (
    formMetaData.configurationFormMetaData.ras_revi_enabled === null ||
    formMetaData.configurationFormMetaData.ras_revi_enabled === false
  ) {
    if (formMetaData.actions !== null) {
      formMetaData.actions = formMetaData.actions.filter(
        (item) => item.action != "Send for Review"
      );
    }
  }

  form.onSubmit = function (actionName, actionCode) {
    if (actionName == "Send for Review") {
      formMethods.setValue("comments", "");
      formMethods.setValue("reviewer", "");
      return actionName;
    } else if (actionName == "Submit") {
      formMethods.setValue("comments", "");
      return actionName;
    }
  };

  let action = useWatch({
    control: control,
    name: "action",
  });
  useEffect(() => {
    if (action === 1) {
      formMethods.setValue("currentStage", "");
      formMethods.setValue("previousStage", "");
      if (
        formMethods.getValues("previousStage") === null ||
        formMethods.getValues("previousStage") === ""
      ) {
        formMethods.setValue("action", 1);
        formMethods.setValue("currentStage", "INITIATE");
        formMethods.setValue("status", "New");
      }
    } else if (action === "") {
      if (
        formMethods.getValues("previousStage") === null ||
        formMethods.getValues("previousStage") === ""
      ) {
        formMethods.setValue("status", "New");
      }
    } else if (action === 3) {
      formMethods.setValue("currentStage", "");
      formMethods.setValue("previousStage", "");
      if (
        formMethods.getValues("previousStage") === null ||
        formMethods.getValues("previousStage") === ""
      ) {
        formMethods.setValue("action", 3);
        formMethods.setValue("currentStage", "CLOSE-SUBMIT");
        formMethods.setValue("previousStage", "INITIATE");
        formMethods.setValue("status", "Performed");
      }
    }
  }, [action]);
  function handleInputChange(region, fieldName, value, row) {
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

    formMethods.setValue(`${region}.${row}.${fieldName}`, value);
  }

  form.pctResourcesWfh.onChange(function (value, row) {
    handleInputChange("RAS", "pctResourcesWfh", value, row);
  });
  return form;
};
export default JSHook;
