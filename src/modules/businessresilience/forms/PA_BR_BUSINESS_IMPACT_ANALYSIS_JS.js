import { useWatch } from "react-hook-form";
import { getviewData, getObjectInfo, getObjectCount } from "../BRService";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

let formMetaFields = [];
const JSHook = (
  form,
  formMetaData,
  formMethods,
  formValues,
  appendImp,
  QSTappend,
  appendCtd,
  setFieldVisibility,
  removeCtd,
  control,
  setGroupValue,
  setSectionName,
  seterrorMessage,
  setSuccessMessage,
  runtimeParams
) => {
  let percentageMTD = formMetaData.configurationFormMetaData.calculate_mtd;
  let percentageRPO = formMetaData.configurationFormMetaData.calculate_rpo;
  let percentageRTO = formMetaData.configurationFormMetaData.calculate_rto;
  let isBIAreviewerenabled = formMetaData.configurationFormMetaData.rev_enabled;

  const location = useLocation();
  let processassetId = location?.state?.objectData?.object_id;
  let businessId = location.state?.objectData?.owner_orgs?.[0] ?? null;
  let proValue = location.state?.objectData?.process_name;
  let assValue = location.state?.objectData?.asset_name;

  useEffect(() => {
    if (location.state !== null) {
      if (location.state?.objectData?.owner_orgs !== undefined) {
        if (proValue !== null && assValue === undefined) {
          formMethods.setValue("businessUnit", businessId);
          formMetaData.fields.businessUnit.editable = false;
          formMethods.setValue("processName", processassetId);
          formMetaData.fields.processName.editable = false;
          formMetaData.fields.assetName.editable = false;
        } else if (assValue !== null && proValue === undefined) {
          formMethods.setValue("businessUnit", businessId);
          formMetaData.fields.businessUnit.editable = false;
          formMethods.setValue("assetName", processassetId);
          formMetaData.fields.processName.editable = false;
          formMetaData.fields.assetName.editable = false;
        }
      }
    }
  }, [processassetId, businessId, proValue, assValue, location?.state]);

  const editButton = document.querySelector(
    `.form-${formMetaData.formmeta.form_id}`
  );

  if (editButton != null || editButton != undefined) {
    if (runtimeParams.modal || formValues.currentStage == "CLOSE-REJECT") {
      editButton.hidden = true;
    } else {
      editButton.hidden = false;
    }
  }

  useEffect(() => {
    if (formValues.reviewer !== undefined) {
      formMethods.setValue("reviewer", "");
    }
  }, []);
  form.onLoad = (props) => {
    if (isBIAreviewerenabled === false || isBIAreviewerenabled === null) {
      if (formMetaData.actions !== null) {
        formMetaData.actions = formMetaData.actions.filter(
          (item) => item.action != "Send for Review"
        );
      }
    }

    let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
      .data[0].user_id;

    let biaOwner = useWatch({
      control: control,
      name: "biaOwner",
    });

    const buttons = document.querySelectorAll(".disbutton");

    useEffect(() => {
      if (!runtimeParams.modal) {
        buttons.forEach((button) => {
          const buttonChildren = button.textContent.trim();

          if (biaOwner !== "" && biaOwner !== userId) {
            if (
              (buttonChildren === "Send for Approval" ||
                buttonChildren === "Send for Review") &&
              formMethods.getValues("currentStage") !== "OWNER"
            ) {
              button.hidden = true;
            } else {
              button.hidden = false;
            }
          } else if (
            biaOwner === "" ||
            biaOwner === null ||
            biaOwner === userId
          ) {
            if (buttonChildren === "Send to Owner") {
              button.hidden = true;
            } else {
              button.hidden = false;
            }
          } else {
            button.hidden = false;
          }
        });
      }
    }, [buttons, biaOwner, userId, runtimeParams]);

    const processName = formMethods.getValues("processName");
    const assetName = formMethods.getValues("assetName");
    const currentStage = formMethods.getValues("currentStage");

    if (processName != "" && processName != undefined) {
      formMetaData.fields.assetName.editable = false;
      formMetaData.fields.assetName.required = false;
    }
    //  else {
    else if (
      formMetaData.formmeta.accessCode == 1 &&
      formMethods.getValues("action") !== 12 &&
      currentStage == "INITIATE" &&
      location?.state?.objectData?.owner_orgs === undefined
    ) {
      formMetaData.fields.assetName.editable = true;
      formMetaData.fields.assetName.required = true;
    }
    // }
    if (assetName != "" && assetName != undefined) {
      formMetaData.fields.processName.editable = false;
      formMetaData.fields.processName.required = false;
    }
    //  else {
    else if (
      formMetaData.formmeta.accessCode == 1 &&
      formMethods.getValues("action") !== 12 &&
      currentStage == "INITIATE" &&
      location?.state?.objectData?.owner_orgs === undefined
    ) {
      formMetaData.fields.processName.editable = true;
      formMetaData.fields.processName.required = true;
    }
    // }
  };

  const [srcId, setsrcID] = useState("");
  const [msg, setMsg] = useState(0);
  let process = useWatch({
    control: control,
    name: "processName",
  });
  let asset = useWatch({
    control: control,
    name: "assetName",
  });

  form.businessUnit.onChange(function (value) {
    setSectionName("");
    if (value === "") {
      formMetaData.fields.assetName.editable = true;
      formMetaData.fields.assetName.required = true;
      formMetaData.fields.processName.editable = true;
      formMetaData.fields.processName.required = true;
      formMethods.setValue("processName", "");
      formMethods.setValue("assetName", "");
      removeCtd();
    } else {
      console.log("Process Value", processName);
    }
  });

  form.processName.onChange(function (value) {
    if (value !== "") {
      removeCtd();
      formMetaData.fields.assetName.editable = false;
      formMetaData.fields.assetName.required = false;
      formMethods.clearErrors(".assetName");
      formMethods.setValue("assetName", "");
    } else {
      removeCtd();
      setSectionName("");
      formMetaData.fields.assetName.editable = true;
      formMetaData.fields.assetName.required = true;
    }
  });

  form.assetName.onChange(function (value) {
    setSectionName("");
    if (value !== "") {
      removeCtd();
      formMetaData.fields.processName.editable = false;
      formMetaData.fields.processName.required = false;
      formMethods.clearErrors(".processName");

      formMethods.setValue("processName", "");
    } else {
      removeCtd();
      setSectionName("");

      formMetaData.fields.processName.editable = true;
      formMetaData.fields.processName.required = true;
    }
  });

  let businessUnits = useWatch({
    control: control,
    name: "businessUnit",
  });

  let currentStage = useWatch({
    control: control,
    name: "currentStage",
  });

  const questionsData = {
    viewName: "pa_br_bia_configuration_setup_qst_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: "",
  };

  const factorsData = {
    viewName: "pa_br_bia_configuration_setup_imp_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: "",
  };

  form.qstResponse.onChange(function (value, row) {
    if (value !== "") {
      formMethods.clearErrors("QST." + row + ".qstResponse");
    }
  });

  useEffect(() => {
    if (
      formValues.objectId === undefined ||
      formMethods.getValues("currentStage") === "INITIATE"
    ) {
      getObjectInfo(
        "getObjectInfo",
        1,
        "BR_BIA_CONFIGURATION_SETUP",
        "OBJECT_ID"
      )
        .then((response) => {
          if (response.data && response.data.length > 0) {
            const fieldsToUpdate = {
              rto1: { field: "rto1", property: "rto1" },
              rto2: { field: "rto2", property: "rto2" },
              rto3: { field: "rto3", property: "rto3" },
              rto4: { field: "rto4", property: "rto4" },
              rto5: { field: "rto5", property: "rto5" },
              rto6: { field: "rto6", property: "rto6" },
              rto7: { field: "rto7", property: "rto7" },
              rot8: { field: "rto8", property: "rto8" },
              rto9: { field: "rto9", property: "rto9" },
              rto10: { field: "rto10", property: "rto10" },
              rto11: { field: "rto11", property: "rto11" },
              rto12: { field: "rto12", property: "rto12" },
              rto13: { field: "rto13", property: "rto13" },
              rto14: { field: "rto14", property: "rto14" },
              rto15: { field: "rto15", property: "rto15" },
              rot16: { field: "rto16", property: "rto16" },
            };
            for (let i = 1; i <= 16; i++) {
              fieldsToUpdate[`ctd${i}`] = {
                field: `ctd${i}`,
                property: `rto${i}`,
              };
            }

            const updatedVisibility = {};
            for (const key in fieldsToUpdate) {
              const fieldInfo = fieldsToUpdate[key];
              updatedVisibility[fieldInfo.field] =
                response.data[0][fieldInfo.property];
            }

            formMethods.setValue(
              "durationFields",
              JSON.stringify(updatedVisibility)
            );
            setFieldVisibility(updatedVisibility);
            if (response.data[0][fieldInfo.property] === true) {
              formMetaData.fields[fieldInfo.field].required = true;
            } else {
              formMetaData.fields[fieldInfo.field].required = false;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setFieldVisibility(JSON.parse(formValues.durationFields));
    }
    if (formValues.objectId === undefined) {
      getviewData(questionsData)
        .then((response) => {
          const responseData = response.data;

          if (responseData && responseData.data.length > 0) {
            responseData.data.forEach((rowData, rowIndex) => {
              if (rowData.qst_active === true) {
                QSTappend(
                  {
                    qstId: "",
                    qstName: rowData.qst_name,
                  },
                  { shouldFocus: false }
                );
              }
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
      getviewData(factorsData)
        .then((response) => {
          const responseData = response.data;

          if (responseData && responseData.data.length > 0) {
            responseData.data.forEach((rowData, rowIndex) => {
              appendImp(
                {
                  impId: "",
                  impFactor: rowData.imp_factors,
                  imppicklistId: rowData.imp_fact_picklist,
                },
                { shouldFocus: false }
              );
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

    if (
      formMethods.getValues("previousStage") === null ||
      formMethods.getValues("previousStage") === ""
    ) {
      formMethods.setValue("currentStage", "INITIATE");
      formMethods.setValue("status", "New");
    }
  }, []);

  const assetdependenciesData1 = {
    viewName: "pa_br_bia_process_assets_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "order by type",
    filterExpression: `tgt_obj_id=${
      Array.isArray(asset)
        ? asset[0]?.value
        : asset?.value
        ? Array.isArray(asset)
          ? asset[0]?.value
          : asset?.value
        : processassetId
    }`,
  };

  useEffect(() => {
    if (
      (businessUnits !== "" || businessId !== "") &&
      (businessUnits != undefined || businessId != undefined) &&
      (asset !== "" || (proValue == undefined && processassetId !== undefined))
    ) {
      getviewData(assetdependenciesData1)
        .then((response) => {
          const responseData = response.data;
          if (responseData && responseData.data.length > 0 && msg == 0) {
            const srcIds = responseData.data
              .map((item) => item.src_obj_id)
              .join(",");
            setsrcID(srcIds);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [asset, msg, businessUnits, processassetId, proValue, businessId]);

  let filterExpression;
  let errorName = "";

  useEffect(() => {
    if (
      (formValues.objectId === undefined ||
        formMethods.getValues("currentStage") === "INITIATE") &&
      formValues.processName !== process &&
      formValues.assetName !== asset
    ) {
      if (asset === "") {
        filterExpression = ` process_name=${process?.value} and business_unit=${businessUnits}`;

        errorName = "Process Name";
      }
      if (process === "") {
        filterExpression = ` asset_name=${asset?.value} and business_unit=${businessUnits}`;
        errorName = "Asset Name";
      }

      if (
        (asset && businessUnits !== "" && businessUnits != undefined) ||
        (process && businessUnits !== "" && businessUnits != undefined)
      ) {
        getObjectCount(
          "getObjectCount",
          "pa_br_business_impact_analysis_bt",
          filterExpression
        )
          .then((response) => {
            if (response.data > 0) {
              removeCtd();
              setSectionName("");
              setMsg(response.data);
              seterrorMessage(
                `The selected Business Unit and ${errorName} already exists. Please choose a different one.`
              );
            } else {
              setMsg(response.data);
              removeCtd();
              setSectionName("");
              seterrorMessage(false);
              setSuccessMessage(null);
            }
          })
          .catch((err) => {
            console.log(err);
            setMsg(0);
            removeCtd();
            setSectionName("");
            seterrorMessage(false);
            setSuccessMessage(null);
          });
      } else {
        removeCtd();
        setSectionName("");
        seterrorMessage(false);
      }
    } else {
      seterrorMessage(false);
      setSuccessMessage(null);
      setMsg(0);
    }

    let processctdData;
    processctdData = {
      viewName: "pa_br_bia_process_assets_v",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "order by type",
      filterExpression: `src_obj_id=${
        Array.isArray(process)
          ? process[0]?.value
          : process?.value
          ? Array.isArray(process)
            ? process[0]?.value
            : process?.value
          : formMethods.getValues("processName")?.value
      } and type != 0 and bu_id =${
        businessUnits ? businessUnits : formMethods.getValues("businessUnit")
      }`,
    };
    if (
      formValues.objectId === undefined ||
      currentStage === "INITIATE" ||
      (currentStage === "CLOSE-APPROVE" &&
        formMetaData.formmeta.accessCode !== 7)
    ) {
      if (
        (businessUnits !== "" ||
          formMethods.getValues("businessUnit") !== "") &&
        (businessUnits != undefined ||
          formMethods.getValues("businessUnit") != undefined) &&
        (process !== "" || formMethods.getValues("processName") !== "")
      ) {
        removeCtd();
        if (currentStage === "CLOSE-APPROVE") {
          removeCtd();
        }

        setSectionName("");
        getviewData(processctdData)
          .then((response) => {
            const responseData = response.data;
            if (responseData && responseData.data.length > 0 && msg == 0) {
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

              const ctdObjTypes = Object.keys(groupedData);
              removeCtd();

              ctdObjTypes.forEach((ctdObjTypes) => {
                if (
                  formValues.objectId === undefined ||
                  currentStage === "INITIATE" ||
                  (currentStage === "CLOSE-APPROVE" &&
                    formMetaData.formmeta.accessCode !== 7)
                ) {
                  groupedData[ctdObjTypes].forEach((rowData) => {
                    appendCtd(
                      {
                        ctdId: "",
                        ctdName: {
                          value: rowData.tgt_obj_id,
                          label: rowData.tgt_obj_name,
                        },
                        ctdRTO: rowData.rto,
                        ctdObjId: rowData.tgt_obj_id,
                        ctdObjType: rowData.type,
                        ctdDeptType: rowData.class_type,
                      },
                      { shouldFocus: false }
                    );
                  });
                }
              });
              if (currentStage === "CLOSE-APPROVE") {
                let critiCal = formMethods.getValues("CTD");

                const ctdArray = formValues.CTD;
                const criticalArray = critiCal;

                criticalArray.forEach((ctdItem, index) => {
                  const match = ctdArray.find(
                    (criticalItem) =>
                      criticalItem.ctdName.value === ctdItem.ctdName.value &&
                      criticalItem.ctdObjType === ctdItem.ctdObjType
                  );

                  formMethods.setValue(`CTD.${index}.ctd1`, "");
                  formMethods.setValue(`CTD.${index}.ctd2`, "");
                  formMethods.setValue(`CTD.${index}.ctd3`, "");
                  formMethods.setValue(`CTD.${index}.ctd4`, "");
                  formMethods.setValue(`CTD.${index}.ctd5`, "");
                  formMethods.setValue(`CTD.${index}.ctd6`, "");
                  formMethods.setValue(`CTD.${index}.ctd7`, "");
                  formMethods.setValue(`CTD.${index}.ctd8`, "");
                  formMethods.setValue(`CTD.${index}.ctd9`, "");
                  formMethods.setValue(`CTD.${index}.ctd10`, "");
                  formMethods.setValue(`CTD.${index}.ctd11`, "");
                  formMethods.setValue(`CTD.${index}.ctd12`, "");
                  formMethods.setValue(`CTD.${index}.ctd13`, "");
                  formMethods.setValue(`CTD.${index}.ctd14`, "");
                  formMethods.setValue(`CTD.${index}.ctd15`, "");
                  formMethods.setValue(`CTD.${index}.ctd16`, "");
                  formMethods.setValue(
                    `CTD.${index}.ctdisApplicableduringcrisis`,
                    ""
                  );
                  formMethods.setValue(`CTD.${index}.ctddependencyGap`, "");
                  formMethods.setValue(`CTD.${index}.ctdBusinessAsUsual`, "");
                  formMethods.setValue(`CTD.${index}.ctdRTO`, "");

                  if (match) {
                    Object.keys(match).forEach((key) => {
                      if (key !== "ctdName" && key !== "ctdId") {
                        formMethods.setValue(`CTD.${index}.${key}`, match[key]);
                      }
                    });
                  }
                });
              }
            } else {
              removeCtd();
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      if (process !== "" && asset === null) {
        const ctdObjTypeLabels = {
          0: "Process",
          1: "Asset",
          2: "Third Party",
          3: "SOP",
        };
        let humanResources = "Human Resource";
        const ctdLabels = [
          ...new Set(
            formValues.CTD.map((item) => ctdObjTypeLabels[item.ctdObjType])
          ),
        ];

        const groupedCtdList = formValues.CTD.reduce(
          (accumulator, currentValue) => {
            const { ctdId, ctdObjType, ctdDeptType } = currentValue;

            let label;
            if (ctdDeptType === 10) {
              label = humanResources;
            } else {
              label = ctdObjTypeLabels[ctdObjType];
            }

            if (!accumulator[label]) {
              accumulator[label] = [];
            }

            accumulator[label].push(ctdId);

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
  }, [
    process,
    msg,
    businessUnits,
    process,
    srcId,
    formValues,
    asset,
    currentStage,
    formMetaData,
  ]);

  useEffect(() => {
    let assetdependenciesData2;
    assetdependenciesData2 = {
      viewName: "pa_br_bia_process_assets_v",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "order by type",
      filterExpression: `src_obj_id in (${srcId}) and type in (0,2,3) and bu_id = ${
        businessUnits ? businessUnits : formMethods.getValues("businessUnit")
      }`,
    };
    if (
      formValues.objectId === undefined ||
      currentStage === "INITIATE" ||
      (currentStage === "CLOSE-APPROVE" &&
        formMetaData.formmeta.accessCode !== 7)
    ) {
      if (
        (businessUnits !== "" ||
          formMethods.getValues("businessUnit") !== "") &&
        (businessUnits != undefined ||
          formMethods.getValues("businessUnit") != undefined) &&
        (asset !== "" || formMethods.getValues("assetName"))
      ) {
        removeCtd();
        if (currentStage === "CLOSE-APPROVE") {
          removeCtd();
        }
        setSectionName("");
        getviewData(assetdependenciesData2)
          .then((response) => {
            const responseData = response.data;

            if (responseData && responseData.data.length > 0 && msg == 0) {
              const groupedData = responseData.data.reduce((acc, obj) => {
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

              const ctdObjTypes = Object.keys(finalGroupedData);

              ctdObjTypes.forEach((ctdObjTypes) => {
                if (
                  formValues.objectId === undefined ||
                  currentStage === "INITIATE" ||
                  (currentStage === "CLOSE-APPROVE" &&
                    formMetaData.formmeta.accessCode !== 7)
                ) {
                  finalGroupedData[ctdObjTypes].forEach((rowData) => {
                    appendCtd(
                      {
                        ctdId: "",
                        // ctdName: rowData.tgt_obj_id,
                        ctdName: {
                          value: rowData.tgt_obj_id,
                          label: rowData.tgt_obj_name,
                        },
                        ctdRTO: rowData.rto,
                        ctdObjId: rowData.tgt_obj_id,
                        ctdObjType: rowData.type,
                        ctdDeptType: rowData.class_type,
                      },
                      { shouldFocus: false }
                    );
                  });
                }
              });
              if (currentStage === "CLOSE-APPROVE") {
                let critiCal = formMethods.getValues("CTD");

                const ctdArray = formValues.CTD;
                const criticalArray = critiCal;

                criticalArray.forEach((ctdItem, index) => {
                  const match = ctdArray.find(
                    (criticalItem) =>
                      criticalItem.ctdName?.value === ctdItem.ctdName?.value &&
                      criticalItem.ctdObjType === ctdItem.ctdObjType
                  );
                  formMethods.setValue(`CTD.${index}.ctd1`, "");
                  formMethods.setValue(`CTD.${index}.ctd2`, "");
                  formMethods.setValue(`CTD.${index}.ctd3`, "");
                  formMethods.setValue(`CTD.${index}.ctd4`, "");
                  formMethods.setValue(`CTD.${index}.ctd5`, "");
                  formMethods.setValue(`CTD.${index}.ctd6`, "");
                  formMethods.setValue(`CTD.${index}.ctd7`, "");
                  formMethods.setValue(`CTD.${index}.ctd8`, "");
                  formMethods.setValue(`CTD.${index}.ctd9`, "");
                  formMethods.setValue(`CTD.${index}.ctd10`, "");
                  formMethods.setValue(`CTD.${index}.ctd11`, "");
                  formMethods.setValue(`CTD.${index}.ctd12`, "");
                  formMethods.setValue(`CTD.${index}.ctd13`, "");
                  formMethods.setValue(`CTD.${index}.ctd14`, "");
                  formMethods.setValue(`CTD.${index}.ctd15`, "");
                  formMethods.setValue(`CTD.${index}.ctd16`, "");
                  formMethods.setValue(
                    `CTD.${index}.ctdisApplicableduringcrisis`,
                    ""
                  );
                  formMethods.setValue(`CTD.${index}.ctddependencyGap`, "");
                  formMethods.setValue(`CTD.${index}.ctdBusinessAsUsual`, "");
                  formMethods.setValue(`CTD.${index}.ctdRTO`, "");
                  if (match) {
                    Object.keys(match).forEach((key) => {
                      if (key !== "ctdName" && key !== "ctdId") {
                        formMethods.setValue(`CTD.${index}.${key}`, match[key]);
                      }
                    });
                  }
                });
              }
            } else {
              removeCtd();
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      if (asset !== "" && process === null) {
        const ctdObjTypeLabels = {
          0: "Process",
          1: "Asset",
          2: "Third Party",
          3: "SOP",
        };
        let humanResources = "Human Resource";
        const ctdLabels = [
          ...new Set(
            formValues.CTD.map((item) => ctdObjTypeLabels[item.ctdId])
          ),
        ];

        const groupedCtdList = formValues.CTD.reduce(
          (accumulator, currentValue) => {
            const { ctdObjType, ctdId, ctdDeptType } = currentValue;

            let label;
            if (ctdDeptType === 10) {
              label = humanResources;
            } else {
              label = ctdObjTypeLabels[ctdObjType];
            }

            if (!accumulator[label]) {
              accumulator[label] = [];
            }

            accumulator[label].push(ctdId);

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
  }, [
    asset,
    srcId,
    businessUnits,
    msg,
    formValues,
    currentStage,
    formMetaData,
  ]);
  form.onLoad();

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

  const populateImpAll = (row, field) => {
    let preColumn;
    for (let pre = field - 2; pre >= 0; pre--) {
      if (formMetaData.configurationFormMetaData[fieldNames[pre].key]) {
        preColumn = pre;
        console.log(preColumn, " preColumn");
        break;
      }
    }
    if (
      preColumn != undefined &&
      formMethods.getValues("IMP." + row + "." + fieldNames[field - 1].key) <=
        formMethods.getValues("IMP." + row + "." + fieldNames[preColumn].key)
    ) {
      console.log(
        formMethods.getValues("IMP." + row + "." + fieldNames[preColumn].key)
      );

      formMethods.setValue(
        "IMP." + row + "." + fieldNames[field - 1].key,
        formMethods.getValues("IMP." + row + "." + fieldNames[preColumn].key)
      );
    } else {
      for (let i = field; i < fieldNames.length; i++) {
        if (formMetaData.configurationFormMetaData[fieldNames[i].key]) {
          if (
            formMethods.getValues("IMP." + row + "." + fieldNames[i].key) <=
            formMethods.getValues(
              "IMP." + row + "." + fieldNames[field - 1].key
            )
          )
            console.log(
              formMethods.getValues(
                "IMP." + row + "." + fieldNames[field - 1].key
              )
            );
          setTimeout(() => {
            formMethods.setValue(
              "IMP." + row + "." + fieldNames[i].key,
              formMethods.getValues(
                "IMP." + row + "." + fieldNames[field - 1].key
              )
            );
          }, 500);
        }
      }
    }
    fncalculateMTD();
  };
  form.rto1.onChange(function (value, row) {
    populateImpAll(row, 1);
  });
  form.rto2.onChange(function (value, row) {
    console.log("calling onChange");
    populateImpAll(row, 2);
  });
  form.rto3.onChange(function (value, row) {
    populateImpAll(row, 3);
  });
  form.rto4.onChange(function (value, row) {
    console.log("calling onChange");
    populateImpAll(row, 4);
  });
  form.rto5.onChange(function (value, row) {
    populateImpAll(row, 5);
  });
  form.rto6.onChange(function (value, row) {
    populateImpAll(row, 6);
  });
  form.rto7.onChange(function (value, row) {
    populateImpAll(row, 7);
  });
  form.rto8.onChange(function (value, row) {
    populateImpAll(row, 8);
  });
  form.rto9.onChange(function (value, row) {
    populateImpAll(row, 9);
  });
  form.rto10.onChange(function (value, row) {
    populateImpAll(row, 10);
  });
  form.rto11.onChange(function (value, row) {
    populateImpAll(row, 11);
  });
  form.rto12.onChange(function (value, row) {
    populateImpAll(row, 12);
  });
  form.rto13.onChange(function (value, row) {
    populateImpAll(row, 13);
  });
  form.rto14.onChange(function (value, row) {
    populateImpAll(row, 14);
  });
  form.rto15.onChange(function (value, row) {
    populateImpAll(row, 15);
  });
  form.rto16.onChange(function (value, row) {
    populateImpAll(row, 16);
  });

  const fncalculateMTD = () => {
    let targetKey = "";
    let targetVal = "";
    let targetPos = 0;

    fieldNames.forEach((fieldName) => {
      if (
        formMetaData.configurationFormMetaData[fieldName.key] &&
        targetKey == ""
      ) {
        targetPos = targetPos + 1;
        for (let i = 0; i < formMethods.getValues("IMP").length; i++) {
          if (
            formMethods.getValues("IMP." + i + "." + fieldName.key).value === 4
          ) {
            targetKey = fieldName.key;
            targetVal = fieldName.value;
          }
          if (targetKey) {
            calPercentage(targetPos, targetVal);
          } else {
            calPercentage(targetPos, 0);
          }
        }
      }
    });
  };

  function findRtoValues(impData) {
    if (!impData || impData.length === 0) return "";

    for (let i = 1; i <= 16; i++) {
      const rtoKey = `rto${i}`;
      const firstRowValue = impData[0][rtoKey];

      if (firstRowValue === undefined || firstRowValue === "") {
        continue;
      }

      for (const row of impData) {
        if (row[rtoKey] !== firstRowValue) {
          return "";
        }
      }
    }

    return impData[0][`rto1`] || "";
  }

  const impDatas = useWatch({
    control: control,
    name: "IMP",
  });

  const sameRtoValue = findRtoValues(impDatas);
  if (sameRtoValue === 1) {
    formMethods.setValue("calBusinessCriticality", "4");
  } else if (sameRtoValue === 2) {
    formMethods.setValue("calBusinessCriticality", "3");
  } else if (sameRtoValue === 3) {
    formMethods.setValue("calBusinessCriticality", "2");
  } else if (sameRtoValue === 4) {
    formMethods.setValue("calBusinessCriticality", "1");
  }

  const calPercentage = (pos, value) => {
    const seventyPercent = value * (percentageRTO / 100);
    const roundedValue = Number(seventyPercent.toFixed(2));
    let calRPO = seventyPercent * (percentageRPO / 100);
    const criticalArray = [1, 2];
    const highArray = [3, 4, 5];
    const mediumArray = [6, 7, 8];
    const lowArray = [9, 10];
    formMethods.setValue("calMTD", Math.round(value));
    formMethods.setValue("impMTD", Math.round(value));
    formMethods.setValue("impRTO", Math.round(roundedValue));
    formMethods.setValue(
      "impWRT",
      Math.round(
        formMethods.getValues("impMTD") - formMethods.getValues("impRTO")
      )
    );
    formMethods.setValue("impRPO", Math.round(calRPO));
    if (
      sameRtoValue === "" ||
      sameRtoValue === undefined ||
      sameRtoValue === null
    ) {
      if (criticalArray.includes(pos)) {
        formMethods.setValue("calBusinessCriticality", "1");
      } else if (highArray.includes(pos)) {
        formMethods.setValue("calBusinessCriticality", "2");
      } else if (mediumArray.includes(pos)) {
        formMethods.setValue("calBusinessCriticality", "3");
      } else if (lowArray.includes(pos)) {
        formMethods.setValue("calBusinessCriticality", "4");
      } else {
        formMethods.setValue("calBusinessCriticality", "");
        formMethods.setValue("overrideBusinessCriticality", "");
        formMethods.setValue("overrideMTD", "");
        formMethods.setValue("overrideRTO", "");
      }
    }
  };

  form.overrideMTD.onChange(function (value) {
    console.log("overide MTD Value", value);
    if (value > 0) {
      if (value.length > 4) {
        value = value.slice(0, 10);
      }
      formMethods.setValue("overrideMTD", value);
      const calOverRTO = value * (percentageMTD / 100);
      let rtoValue = Math.round(Number(calOverRTO.toFixed(2)));
      let calWRT =
        formMethods.getValues("impMTD") - formMethods.getValues("overrideRTO");
      if (rtoValue.toString().length > 5) {
        rtoValue = parseInt(rtoValue.toString().substring(0, 11), 10);
      }
      if (calWRT.toString().length > 5) {
        calWRT = parseInt(calWRT.toString().substring(0, 11), 10);
      }
      if (value.toString().length > 5) {
        value = parseInt(value.toString().substring(0, 11), 10);
      }
      formMethods.setValue("overrideRTO", rtoValue);
      formMethods.setValue("impMTD", Math.round(value));
      formMethods.setValue("impWRT", Math.round(calWRT));
    } else {
      formMethods.setValue("overrideRTO", "");
      formMethods.setValue("impMTD", Math.round(calMTD));
      formMethods.setValue("impWRT", Math.round(calMTD - impRTO));
    }
  });

  form.overrideRTO.onChange(function (value) {
    console.log("overide RTO Value", value);
    if (value > 0) {
      if (value.length > 4) {
        value = value.slice(0, 10);
      }
      formMethods.setValue("overrideRTO", value);
      const calOverMTD = Math.round((value * 100) / percentageMTD);
      let mtdValue = Math.round(Number(calOverMTD.toFixed(2)));
      if (mtdValue.toString().length > 5) {
        mtdValue = parseInt(mtdValue.toString().substring(0, 11), 10);
      }
      formMethods.setValue("impMTD", mtdValue);
      formMethods.setValue("overrideMTD", mtdValue);
      let wrtValue =
        formMethods.getValues("impMTD") - formMethods.getValues("overrideRTO");
      if (wrtValue.toString().length > 5) {
        wrtValue = parseInt(wrtValue.toString().substring(0, 11), 10);
      }

      formMethods.setValue("overrideRTO", value);
      formMethods.setValue("impWRT", Math.round(Number(wrtValue.toFixed(2))));
    } else {
      formMethods.setValue("overrideMTD", "");
      formMethods.setValue("impMTD", Math.round(calMTD));
      formMethods.setValue("impWRT", Math.round(calMTD - impRTO));
    }
  });
  let impRTO = useWatch({
    control: control,
    name: "impRTO",
  });

  let calMTD = useWatch({
    control: control,
    name: "calMTD",
  });

  let overRTO = useWatch({
    control: control,
    name: "overrideRTO",
  });

  const getStage = formMethods.getValues("currentStage");

  if (
    formMethods.getValues("calMTD") != undefined &&
    formMethods.getValues("calMTD") != "" &&
    (getStage == "INITIATE" ||
      getStage == "OWNER" ||
      getStage == "SUBMIT-CLARIFICATION" ||
      getStage == "CLOSE-APPROVE")
  ) {
    formMetaData.fields.overrideMTD.editable = true;
  } else {
    formMetaData.fields.overrideMTD.editable = false;
  }
  if (
    formMethods.getValues("impRTO") != undefined &&
    formMethods.getValues("impRTO") != "" &&
    (getStage == "INITIATE" ||
      getStage == "OWNER" ||
      getStage == "SUBMIT-CLARIFICATION" ||
      getStage == "CLOSE-APPROVE")
  ) {
    formMetaData.fields.overrideRTO.editable = true;
    populateGap(impRTO, overRTO);
  } else {
    formMetaData.fields.overrideRTO.editable = false;
  }
  if (
    formMethods.getValues("calBusinessCriticality") != undefined &&
    formMethods.getValues("calBusinessCriticality") != "" &&
    (getStage == "INITIATE" ||
      getStage == "OWNER" ||
      getStage == "CLOSE-APPROVE" ||
      getStage == "SUBMIT-CLARIFICATION")
  ) {
    formMetaData.fields.overrideBusinessCriticality.editable = true;
  } else {
    formMetaData.fields.overrideBusinessCriticality.editable = false;
  }

  function populateGap(actRTO, overrideRTO) {
    let valuesCTD = formMethods.getValues("CTD");
    const ctdArray = Object.keys(valuesCTD).map((key) => valuesCTD[key]);
    let gapValue = "";
    for (let i = 0; i <= ctdArray.length; i++) {
      if (
        formMethods.getValues("CTD." + i + ".ctdRTO") !== null &&
        formMethods.getValues("CTD." + i + ".ctdRTO") !== undefined
      ) {
        if (overrideRTO > 0) {
          gapValue =
            overrideRTO - formMethods.getValues("CTD." + i + ".ctdRTO");
          formMethods.setValue(
            "CTD." + i + ".ctddependencyGap",
            JSON.stringify(gapValue)
          );
        } else {
          gapValue = actRTO - formMethods.getValues("CTD." + i + ".ctdRTO");
          formMethods.setValue(
            "CTD." + i + ".ctddependencyGap",
            JSON.stringify(gapValue)
          );
        }
      }
    }
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
      formMethods.setValue("scheduleFrequency", 1);
      getNextReviewDate(1);
    }
  }, []);
  form.scheduleFrequency.onChange(function (value) {
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

  form.onSubmit = function (actionName, actionCode) {
    const actionsRequiringCommentsReset = [
      "Send for Review",
      "Send for Approval",
      "Submit",
      "Request Clarification",
      "Reject",
      "Approve",
      "Send to Owner",
      "Submit Clarification",
    ];

    if (actionsRequiringCommentsReset.includes(actionName)) {
      formMethods.setValue("comments", "");
      if (actionName === "Send for Review") {
        formMethods.setValue("reviewer", "");
      }
      return actionName;
    } else if (actionName === "Draft") {
      return "skip";
    }
  };

  if (
    formMethods.getValues("currentStage") === "REVIEWER" ||
    formMetaData.actions === null
  ) {
    formMetaData.fields.overrideBusinessCriticality.editable = false;
    formMetaData.fields.overrideMTD.editable = false;
    formMetaData.fields.overrideRTO.editable = false;
  }
  let overrideBussCriticality = useWatch({
    control,
    name: "overrideBusinessCriticality",
  });
  let overrideMTD = useWatch({
    control,
    name: "overrideMTD",
  });
  let overrideRTO = useWatch({
    control,
    name: "overrideRTO",
  });
  if (overrideBussCriticality >= 1 && formMethods.getValues("action") !== 12) {
    formMetaData.fields.overrideComments.required = true;
  } else {
    formMetaData.fields.overrideComments.required = false;
  }
  if (
    overrideMTD !== "" &&
    overrideMTD !== null &&
    formMethods.getValues("action") !== 12
  ) {
    formMetaData.fields.overrideMTDComments.required = true;
  } else {
    formMetaData.fields.overrideMTDComments.required = false;
  }

  if (
    overrideRTO !== "" &&
    overrideRTO !== null &&
    formMethods.getValues("action") !== 12
  ) {
    formMetaData.fields.overrideRTOComments.required = true;
  } else {
    formMetaData.fields.overrideRTOComments.required = false;
  }

  form.ctdBusinessAsUsual.onChange(function (value, row) {
    if (value.length > 4) {
      value = value.slice(0, 5);
    }
    formMethods.setValue("CTD." + row + ".ctdBusinessAsUsual", value);
  });

  const ctdfieldNames = [
    { key: "ctdBusinessAsUsual", value: "5" },
    { key: "ctd1", value: "15" },
    { key: "ctd2", value: "30" },
    { key: "ctd3", value: "45" },
    { key: "ctd4", value: "60" },
    { key: "ctd5", value: "120" },
    { key: "ctd6", value: "240" },
    { key: "ctd7", value: "360" },
    { key: "ctd8", value: "480" },
    { key: "ctd9", value: "720" },
    { key: "ctd10", value: "1440" },
    { key: "ctd11", value: "2880" },
    { key: "ctd12", value: "10080" },
    { key: "ctd13", value: "20160" },
    { key: "ctd14", value: "30240" },
    { key: "ctd15", value: "40320" },
    { key: "ctd16", value: "50400" },
  ];

  form.ctdBusinessAsUsual.onChange(function (value, row) {
    ctdfieldNames.forEach(function (field, index) {
      formMethods.setValue("CTD." + row + "." + field.key, "");
    });
  });

  ctdfieldNames.forEach(function (field, index) {
    form[field.key].onChange(function (value, row) {
      if (value.length > 5) {
        value = value.slice(0, 5);
      }
      if (field.key !== "ctdBusinessAsUsual") {
        const ctdBussiness = parseFloat(
          formMethods.getValues("CTD." + row + ".ctdBusinessAsUsual")
        );
        const enteredValue = parseFloat(value);
        if (
          (enteredValue > ctdBussiness && ctdBussiness != "") ||
          ctdBussiness == ""
        ) {
          formMethods.setValue("CTD." + row + "." + field.key, "");
        } else if (ctdBussiness == "") {
          formMethods.setValue("CTD." + row + "." + field.key, "");
        } else {
          formMethods.setValue("CTD." + row + "." + field.key, value);
        }
      } else {
        formMethods.setValue("CTD." + row + "." + field.key, value);
      }

      // for (let i = 1; i <= 16; i++) {
      //   const fieldName = `ctd${i - index}`;
      //   const previousValue = parseFloat(
      //     formMethods.getValues(`CTD.${row}.${fieldName}`)
      //   );

      //   const currentValue = parseFloat(value);

      //   if (!isNaN(previousValue) && previousValue >= 0) {
      //     if (currentValue < previousValue && currentValue >= 0) {
      //       console.log(
      //         currentValue,
      //         previousValue,
      //         "currentValuecurrentValuecurrentValue"
      //       );
      //       formMethods.setValue("CTD." + row + "." + field.key, "");
      //       return;
      //     }
      //   }
      // }
    });
  });

  let action = useWatch({
    control: control,
    name: "action",
  });

  useEffect(() => {
    if (action === 3 || action === 4) {
      formMetaData.fields.comments.required = true;
    } else {
      formMetaData.fields.comments.required = false;
    }

    if (action === 12) {
      if (formMetaFields.length == 0) {
        for (const key in formMetaData.fields) {
          if (formMetaData.fields[key].required) {
            formMetaFields.push(key);
          }
        }
      }
      for (const key in formMetaData.fields) {
        if (key !== "objName") {
          formMetaData.fields[key].required = false;
        }
      }
    } else if (
      formMethods.getValues("currentStage") === "INITIATE" &&
      (action === 1 || action === 5 || action === 8)
    ) {
      if (formMetaFields.length != 0) {
        for (const key in formMetaFields) {
          formMetaData.fields[formMetaFields[key]].required = true;
        }
      }
    }
  }, [action]);

  return form;
};

export default JSHook;
