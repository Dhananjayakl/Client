import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useLocation } from "react-router-dom";

const JSHook = (
  form,
  fields,
  formMethods,
  formMetaData,
  formValues,
  control,
  runtimeParams
) => {
  console.log(runtimeParams, "formValuesformValuesformValuesformValues");

  if (
    formMethods.getValues("previousStage") === null ||
    formMethods.getValues("previousStage") === ""
  ) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }

  if (runtimeParams.source_form_name === "BR_EXERCISE_PLAN") {
    if (formMetaData.actions !== null) {
      formMetaData.actions = formMetaData.actions.filter(
        (item) => item.action !== "Send for Auditee Review"
      );
    }
  }
  if (
    runtimeParams.source_form_name === "GL_KRI_TASK" ||
    runtimeParams.source_form_name === "RA_RISK_ASSESSEMENT" ||
    runtimeParams.source_form_name === "RA_RISK_ASSESSEMENT_REG_COMP" ||
    runtimeParams.source_form_name === "CT_CONTROL_TESTING" ||
    runtimeParams.source_form_name === "CT_OBLIGATION_TASK"
  ) {
    if (formMetaData.actions !== null) {
      formMetaData.actions = formMetaData.actions.filter(
        (item) => item.action !== "Send for Auditee Review"
      );
    }
  }
  if (runtimeParams?.objectData?.source_form_name == "LE_INTERNAL_LOSS_EVENT") {
    if (formMetaData.actions !== null) {
      formMetaData.actions = formMetaData.actions.filter(
        (item) => item.action !== "Send for Auditee Review"
      );
    }
  }
  const location = useLocation();
  console.log(runtimeParams, "yessssssss", formMetaData, formValues, location);
  useEffect(() => {
    if (runtimeParams.formService == "issueobservation") {
      let editbutton = document.querySelector(
        `.form-${formMetaData.formmeta.form_id}`
      );
      if (editbutton != null || editbutton != undefined) {
        if (location?.state?.objectData?.reportflag == true) {
          editbutton.hidden = true;
          // document.querySelector(".editbutton").style.display = "none";
          // document.querySelector(".editbutton").hidden = true;
        }
      }
    }
  }, []);
  useEffect(() => {
    if (
      runtimeParams.source_form_name === "BR_EXERCISE_PLAN" ||
      runtimeParams.source_form_name === "SM_RESPONDENT_FORM"
    ) {
      formMethods.setValue("srcObjId", runtimeParams.ParentFormObjectId);
      formMethods.setValue("fndProgram", runtimeParams.program);
      formMethods.setValue("fndApprover", runtimeParams.fndApprover);
      formMethods.setValue(
        "fndapproverBusinessUnit",
        runtimeParams.fndBusinessUnit[0].value
      );
    } else if (runtimeParams?.source_form_name === "IA_AUDITS") {
      formMethods.setValue("srcObjId", runtimeParams.ParentFormObjectId);
      formMethods.setValue("fndProgram", runtimeParams.program);
      formMethods.setValue("fndApprover", runtimeParams.fndApprover);
      formMethods.setValue(
        "fndapproverBusinessUnit",
        runtimeParams.fndApproveBU[0].value
      );
      formMethods.setValue("subObjId", runtimeParams.subObjId);
    } else if (
      runtimeParams.source_form_name === "GL_KRI_TASK" ||
      runtimeParams.source_form_name === "RA_RISK_ASSESSEMENT" ||
      runtimeParams.source_form_name === "RA_RISK_ASSESSEMENT_REG_COMP" ||
      runtimeParams.source_form_name === "CT_CONTROL_TESTING" ||
      runtimeParams.source_form_name === "CT_OBLIGATION_TASK"
    ) {
      formMethods.setValue("fndProgram", runtimeParams.program);
      formMethods.setValue("srcObjId", runtimeParams.ParentFormObjectId);
      formMethods.setValue("fndApprover", runtimeParams.fndApprover);
      formMethods.setValue(
        "fndapproverBusinessUnit",
        parseInt(runtimeParams.fndBusinessUnit[0].value)
      );
      formMethods.setValue("relatedId", runtimeParams.relatedId);
      formMethods.setValue("relatedObject", runtimeParams.relatedObject);
    } else {
      if (runtimeParams.objectData !== undefined) {
        if (
          runtimeParams?.objectData?.source_form_name ==
          "LE_INTERNAL_LOSS_EVENT"
        ) {
          formMetaData.fields.fndProgram.editable = false;
          formMetaData.fields.fndapproverBusinessUnit.editable = false;
          formMetaData.fields.fndApprover.editable = false;
          // if (formMetaData.actions !== null) {
          //   formMetaData.actions = formMetaData.actions.filter(
          //     (item) => item.action !== "Send for Auditee Review"
          //   );
          // }

          formMethods.setValue(
            "srcObjId",
            runtimeParams.objectData.object_id ||
              runtimeParams.objectData.objectId
          );
          formMethods.setValue("fndProgram", 6);
          formMethods.setValue(
            "fndBusinessUnit",
            runtimeParams.objectData.business_unit ||
              runtimeParams.objectData.businessUnit
          );
          formMethods.setValue(
            "fndapproverBusinessUnit",
            runtimeParams.objectData.business_unit[0].value ||
              runtimeParams.objectData.businessUnit
          );
          formMethods.setValue(
            "fndApprover",
            runtimeParams.objectData.owner || runtimeParams.objectData.owner
          );
        }
      } else {
        if (formValues.fndProgram == 6 && formValues.fndId != null) {
          if (formMetaData.actions !== null) {
            const buttons = document.querySelectorAll(".modaldisbutton");
            buttons.forEach((button) => {
              const buttonChildren = button.textContent.trim();
              if (buttonChildren == "Send for Auditee Review") {
                button.hidden = true;
              }
            });
          }
        }
      }
    }
  }, [formMetaData.formmeta.accessCode]);

  if (
    runtimeParams.source_form_name === "BR_EXERCISE_PLAN" ||
    formValues.fndProgram == 5
  ) {
    formMetaData.fields.fndApprover.editable = false;
    formMetaData.fields.fndProgram.editable = false;
    formMetaData.fields.fndapproverBusinessUnit.editable = false;
  } else if (runtimeParams.source_form_name === "IA_AUDITS") {
    formMetaData.fields.fndApprover.editable = false;
    formMetaData.fields.fndapproverBusinessUnit.editable = false;
    formMetaData.fields.fndProgram.editable = false;
  } else if (
    runtimeParams.source_form_name === "CT_OBLIGATION_TASK" ||
    runtimeParams.source_form_name === "RA_RISK_ASSESSEMENT" ||
    runtimeParams.source_form_name === "RA_RISK_ASSESSEMENT_REG_COMP" ||
    runtimeParams.source_form_name === "CT_CONTROL_TESTING"
  ) {
    formMetaData.fields.fndProgram.editable = false;
    formMetaData.fields.fndapproverBusinessUnit.editable = false;
    formMetaData.fields.fndApprover.editable = false;
  } else if (runtimeParams.source_form_name === "GL_KRI_TASK");

  formMetaData.fields.fndProgram.editable = false;

  let firstOccuredOn = useWatch({
    control,
    name: "fndfirstOccurredOn",
  });

  form.fndIdentifiedOn.onChange(function (value) {
    if (value < firstOccuredOn) {
      formMethods.setValue("fndfirstOccurredOn", "");
    }
  });

  form.fndType.onChange(function (value) {
    fndTypeChange(value);
  });

  function fndTypeChange(value) {
    if (value == 2) {
      formMetaData.fields.fndIdentifiedOn.required = false;
      formMetaData.fields.fndfirstOccurredOn.required = false;
      formMetaData.fields.fndDueBy.required = false;
      formMetaData.fields.fndBusinessUnit.required = false;
      formMetaData.fields.fndOwner.required = false;
      formMetaData.fields.fndapproverBusinessUnit.required = false;
      formMetaData.fields.fndApprover.required = false;
    } else {
      formMetaData.fields.fndIdentifiedOn.required = true;
      formMetaData.fields.fndfirstOccurredOn.required = true;
      formMetaData.fields.fndDueBy.required = true;
      formMetaData.fields.fndBusinessUnit.required = true;
      formMetaData.fields.fndOwner.required = true;
      formMetaData.fields.fndapproverBusinessUnit.required = true;
      formMetaData.fields.fndApprover.required = true;
    }
  }
  fndTypeChange(formMethods.getValues("fndType"));
  let fndType = useWatch({
    control,
    name: "fndType",
  });

  return form;
};

export default JSHook;
