import { useEffect, useState } from "react";
import { getviewData } from "../IAService";

const JSHook = (
  form,
  formMetaData,
  formMethods,
  control,
  runtimeParams,
  setIsModalOpen,
  setAuditData
) => {
  formMetaData.fields.businessUnit.editable = false;
  formMethods.setValue(
    "businessUnit",
    formMetaData.configurationFormMetaData.audit_bu
  );
  let isPlanreviewerenabled =
    formMetaData.configurationFormMetaData.review_plan;
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;
  form.onLoad = (props) => {
    if (isPlanreviewerenabled === false || isPlanreviewerenabled === null) {
      if (formMetaData.actions !== null) {
        formMetaData.actions = formMetaData.actions.filter(
          (item) => item.action != "Send for Review"
        );
      }
    }
  };
  form.onLoad = () => {
    const proposedStartDateVal = formMethods.getValues("startDate");
    const proposedEndDateVal = formMethods.getValues("endDate");

    if (proposedStartDateVal > proposedEndDateVal) {
      formMethods.setValue("endDate", "");
    }
  };

  if (
    formMethods.getValues("previousStage") === null ||
    formMethods.getValues("previousStage") === ""
  ) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "Initial Planning");
    formMethods.setValue("planInitiator", userId);
  }
  form.startDate.onChange(function (value) {
    formMetaData.fields.endDate.editable = true;
    const currentDate = new Date(value);
    let formattedDate;
    currentDate.setDate(currentDate.getDate() + 364);
    formattedDate = currentDate.toISOString().split("T")[0];
    formMethods.setValue("endDate", formattedDate);
  });
  const planId = formMethods.getValues("planId");
  const formData = {
    viewName: "pa_ia_audits_bt",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `plan_id = ${planId}`,
  };
  const formFieldsData = {
    viewName: "pa_form_fields",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression:
      "form_id=(select form_id from pa_forms where form_name='IA_AUDITS')",
  };
  const [requiredAuditFields, setRequiredAuditFields] = useState({});
  const handleSubmit = async (actionName) => {
    try {
      const response = await getviewData(formData);
      const responseData = response.data.data;
      const auditPlanFields = formMetaData.fields;

      let requiredAuditPlanFields = Object.values(auditPlanFields)
        .filter(
          (field) =>
            field.required &&
            field.field_name != "planApprover" &&
            field.field_name != "planReviewer"
        )
        .map((field) => field.field_name);

      let checkMainForm = true;

      if (requiredAuditPlanFields.length > 0) {
        for (let element of requiredAuditPlanFields) {
          if (
            formMethods.getValues(element) == null ||
            formMethods.getValues(element) == "" ||
            formMethods.getValues(element) == undefined
          ) {
            checkMainForm = false;
            break;
          }
        }
      }

      if (!checkMainForm) {
        setIsModalOpen(false);
      } else if (checkMainForm && responseData.length === 0) {
        setIsModalOpen(true);
        return false;
      } else {
        let fieldsMissing = {};
        for (let fieldName of requiredAuditFields) {
          for (let obj of responseData) {
            const fieldKey = Object.keys(fieldName)[0];
            const fieldValue = fieldName[fieldKey];
            if (obj[fieldKey] == null) {
              if (!fieldsMissing[obj.object_id]) {
                fieldsMissing[obj.object_id] = {};
              }

              if (!fieldsMissing[obj.object_id][obj.audit_title]) {
                fieldsMissing[obj.object_id][obj.audit_title] = [];
              }

              if (
                !fieldsMissing[obj.object_id][obj.audit_title].includes(
                  fieldValue
                )
              ) {
                fieldsMissing[obj.object_id][obj.audit_title].push(fieldValue);
              }
            }
          }
        }
        if (Object.keys(fieldsMissing).length > 0) {
          setIsModalOpen(true);
          setAuditData(fieldsMissing);
          return false;
        }
        return actionName;
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      return false;
    }
  };
  useEffect(() => {
    getviewData(formFieldsData).then((resp) => {
      const auditFields = resp.data.data;
      console.log(auditFields, "auditFieldsauditFields");

      const reqAuditFields = auditFields.filter(
        (field) => field.required && field.region_code == "NOREGION"
      );
      const mandatoryAuditFields = reqAuditFields.map((field) => ({
        [field.db_colum_name.toLowerCase()]: field.field_title,
      }));
      setRequiredAuditFields(mandatoryAuditFields);
    });
  }, []);

  form.onSubmit = function (actionName) {
    if (actionName == "Send for Review" || actionName == "Send for Approval") {
      return handleSubmit(actionName);
    } else if (actionName == "Submit") {
      return actionName;
    } else if (actionName == "Request Clarification") {
      return actionName;
    } else if (actionName == "Approve") {
      return actionName;
    } else if (actionName == "Submit Clarification") {
      return actionName;
    } else {
      return actionName;
    }
  };
  if (formMethods.getValues("startDate") === "") {
    formMetaData.fields.endDate.editable = false;
    formMethods.setValue("endDate", "");
  }
  form.onLoad();
  return form;
};
export default JSHook;
