import { useState, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { getviewData } from "src/modules/crm/crmFormService";
let JSHook = (form, formMethods, formMetaData, formValues, control) => {
  const [updateCI, setUpdateCT] = useState();
  useEffect(() => {
    if (
      formMethods.getValues("lead") != null &&
      formMethods.getValues("lead") != "" &&
      formMethods.getValues("objectId") != null &&
      formMethods.getValues("objectId") != ""
    ) {
      formMetaData.fields.lead.editable = false;
    }
  }, []);

  const viewParams = {
    viewName: "pa_cm_lead",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `object_id=${formMethods.getValues("lead")}`,
  };

  useEffect(() => {
    if (
      formMethods.getValues("lead") != null &&
      formMethods.getValues("lead") != ""
    )
      getviewData(viewParams)
        .then((response) => {
          console.log("responseresponse", response);
          formMethods.setValue(
            "primaryContact",
            response.data.data[0].lead_name
          );
          formMethods.setValue("email", response.data.data[0].email);
          formMethods.setValue(
            "phoneNumber",
            response.data.data[0].phone_number
          );
        })
        .catch((err) => {
          console.log(err);
        });
  }, [updateCI]);

  form.lead.onChange(function (value, row) {
    setUpdateCT(value);
  });

  form.onSubmit = function (actionName, actionCode) {
    console.log("actionNameactionNameactionName", actionName);

    if (actionName == "Save") {
      for (const key in formMetaData.fields) {
        if (formMetaData.fields[key].field_name != "opportunityName")
          formMetaData.fields[key].required = false;
      }
    }
    if (actionName == "Move to Solutioning") {
      formMetaData.fields.budget.required = true;
      formMetaData.fields.authority.required = true;
      formMetaData.fields.need.required = true;
      formMetaData.fields.timeline.required = true;
    }

    // if (formMethods.getValues("currentStage") == "PROPOSAL") {
    if (actionName == "Move to Negotiation") {
      formMetaData.fields.deploymentType.required = true;
      formMetaData.fields.license.required = true;
      formMetaData.fields.implementation.required = true;
      formMetaData.fields.amc.required = true;
    }
    // }

    return actionName;
  };

  // probability
  // let currentStage = useWatch({
  //   control: control,
  //   name: "currentStage",
  // });
  let currentStage = formMethods.getValues("currentStage");
  if (currentStage == "INITIATE") {
    formMethods.setValue("probability", 10);
  } else if (currentStage == "SOLUTION") {
    formMethods.setValue("probability", 40);
  } else if (currentStage == "PROPOSAL") {
    formMethods.setValue("probability", 60);
  } else if (currentStage == "NEGOTIATION") {
    formMethods.setValue("probability", 70);
  } else if (currentStage == "COMMITMENT") {
    formMethods.setValue("probability", 80);
  } else if (currentStage == "CLOSE_WIN") {
    formMethods.setValue("probability", 100);
  } else if (currentStage == "CLOSE_LOST") {
    formMethods.setValue("probability", 0);
  }
  return form;
};

export default JSHook;
