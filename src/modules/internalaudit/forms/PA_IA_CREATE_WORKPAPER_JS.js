import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { getObjectInfo } from "../IAService";

let JSHook = (
  form,
  formMetaData,
  formMethods,
  formValues,
  control,
  runtimeParams,
  addScpRow,
  setauditName
) => {
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  if (runtimeParams.ParentFormObjectId) {
    formMethods.setValue("auditId", runtimeParams.ParentFormObjectId);
    formMethods.setValue("businessUnit", runtimeParams.fndApproveBU);
    formMetaData.fields.businessUnit.editable = false;
    formMetaData.fields.auditId.editable = false;
  }
  if (formValues.objectId === undefined) {
    useEffect(() => {
      // setTimeout(() => {
      addScpRow();
    }, []);
  }
  form.aeProcess.onChange(function (value) {
    formMethods.setValue("SCP", "");
  });
  form.scpRisk.onChange(function (value, row) {
    formMethods.setValue("SCP." + row + ".scpControl", "");
  });
  let wpType = useWatch({
    control: control,
    name: "wpType",
  });
  console.log(formMetaData.fields, "yugwufuweg");

  if (wpType > 1 || wpType == "") {
    formMetaData.fields.checklistName.visible = false;
    formMetaData.fields.checklistName.required = false;
    formMetaData.fields.aeProcess.visible = true;
    formMetaData.fields.aeProcess.required = true;
    formMetaData.fields.scpRisk.visible = true;
    formMetaData.fields.scpRisk.required = true;
    formMetaData.fields.scpControl.visible = true;
    formMetaData.fields.scpControl.required = true;
  } else {
    formMetaData.fields.checklistName.visible = true;
    formMetaData.fields.checklistName.required = true;
    formMetaData.fields.aeProcess.visible = false;
    formMetaData.fields.aeProcess.required = false;
    formMetaData.fields.scpRisk.visible = false;
    formMetaData.fields.scpRisk.required = false;
    formMetaData.fields.scpControl.visible = false;
    formMetaData.fields.scpControl.required = false;
  }
  form.wpType.onChange(function (value) {
    if (formMethods.getValues("checklistName") > 0) {
      formMethods.setValue("checklistName", "");
    }
  });

  form.wpStartDate.onChange(function (value) {
    formMethods.setValue("wpEndDate", "");
  });

  if (
    formValues.objectId === undefined ||
    formMethods.getValues("currentStage") === "INITIATE"
  ) {
    useEffect(() => {
      if (runtimeParams.ParentFormObjectId !== "") {
        getObjectInfo(
          "getObjectInfo",
          runtimeParams.ParentFormObjectId,
          "IA_AUDITS",
          "object_id"
        )
          .then((response) => {
            if (response.data && response.data.length > 0) {
              setauditName(response.data[0].audit_title);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setauditName("");
      }
    }, [runtimeParams.ParentFormObjectId]);
  }
  const hideTitle = (auditId) => {
    if (auditId === "auditId") {
      let getFieldvalue = document.getElementById("auditIdvalue");

      if (getFieldvalue) {
        getFieldvalue.remove();
      }
    }
  };
  // useEffect(() => {
  hideTitle("auditId");
  // }, []);
  return form;
};

export default JSHook;
