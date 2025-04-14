import { useState, useEffect } from "react";
import { getObjectInfo } from "../../admin/AdminService";
import { useWatch } from "react-hook-form";
import { getviewData } from "../IssueFormService";
let actionDetails = [];
const JSHook = (form, formMethods, formMetaData, runtimeParams, control,changeTheAertModal) => {
  const [isAct, setisAct] = useState();
  const [updateAct, setupdateAct] = useState(false);
  let action = useWatch({
    control: control,
    name: "action",
  });
  const actiondata={
      viewName: "pa_form_fields_v",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `form_id=(select form_id from pa_forms where form_name='IR_ACTION') and required=true`,
    }
  const getAllActions={
    viewName: "pa_ir_action_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `issue_id=${formMethods.getValues("issueId")}`,
  }

  let checkissueFields=()=>{
    let issueRequriedFields=[];
    for (let field in formMetaData.fields) {
      if (formMetaData.fields[field].required) {
        issueRequriedFields.push(field);
      }
    }

    for(let key in issueRequriedFields){
      if(!formMethods.getValues(issueRequriedFields[key])){
        return true;

      }
    }
    return false;

  }
  
  useEffect(() => {
    if (action === 30) {
      for (const key in formMetaData.fields) {
        formMetaData.fields[key].required = false;
      }
      formMetaData.fields["issueTitle"].required = true;
    } else if (
      action === 2 &&
      formMethods.getValues("currentStage") === "INITIATE"
    ) {
      formMetaData.fields["issueTitle"].required = true;
      formMetaData.fields["description"].required = true;
      formMetaData.fields["identifiedOn"].required = true;
      formMetaData.fields["firstOccurredOn"].required = true;
      formMetaData.fields["program"].required = true;
    }

    const handleFormSubmit = async(actionName, e) => {

    if (
      (actionName === "Send for Approval" || actionName=="Trigger Actions") &&
      (formMethods.getValues("currentStage") === "APP" ||
        formMethods.getValues("currentStage") === "SUBMIT_CLARIFICATION_APP")
    ) {
      if (
        formMethods.getValues("noOfActions") == null ||
        formMethods.getValues("noOfActions") === 0
      ) {
        changeTheAertModal("At least one Action Plan required")
        e.preventDefault();
      }
    }
    else if (actionName == "Send for Closure" || actionName == "Close Issue") {
      if (formMethods.getValues("noOfActions") != null) {
        if (actionDetails.length > 0) {
          changeTheAertModal("Please close all the Actions, before closing the Issue.")
          e.preventDefault();
        } 
      }
    }
  };
  const allButtons = document.querySelectorAll(".disbutton");
  const listeners = [];
  allButtons.forEach((button) => {
    const actionName = button.textContent.trim();
    const clickHandler = async (e) =>  await handleFormSubmit(actionName, e);
    button.addEventListener("click", clickHandler);
    listeners.push({ button, clickHandler });
  });
  
  
  return () => {
    listeners.forEach(({ button, clickHandler }) => {
      button.removeEventListener("click", clickHandler);
    });
  };
    
  }, [action]);

  let checkAllFieldsInActions= async ()=>{
    
    let actionmetaData=await getviewData(actiondata);
    console.log(actionmetaData,"metadata of action")
    let allactionsdata= await getviewData(getAllActions)
    let flagforFields="Send for Approval";
    
    let notfilledInfo={}
    allactionsdata.data.data.forEach(element => {
      
      let temactionnotfilled=false;
      let notfilledFields=[]
      actionmetaData.data.data.forEach(elementmeta => {
        let fieldName=elementmeta.db_colum_name.toLowerCase();
        if(!element[fieldName]){
          flagforFields=false;
          temactionnotfilled=true;
          notfilledFields.push(elementmeta.field_title);
        }
      });
      if(temactionnotfilled){
        notfilledFields.push(element.action_title);
        notfilledInfo[element.action_id]=notfilledFields;
        
      }


    });
    if(!flagforFields){      
      changeTheAertModal(notfilledInfo);
    }
    return flagforFields;

  }

  useEffect(() => {
    formMethods.getValues("initiator");

    if (
      formMethods.getValues("initiator") === null ||
      formMethods.getValues("initiator") === ""
    ) {
      formMethods.setValue("initiator", formMetaData.util.getCurrentUser().id);

      formMethods.setValue("currentStage", "INITIATE");
      formMethods.setValue("status", "New");
    }

    if (
      formMethods.getValues("issueId") != "" &&
      formMethods.getValues("issueId") != "-1"
    )
      getObjectInfo(
        "getObjectInfo",
        formMethods.getValues("issueId"),
        "IR_ACTION",
        "issue_id"
      )
        .then((response) => {
          actionDetails = [];
          setisAct(response.data.length);
          formMethods.setValue("noOfActions", response.data.length);
          for (let i = 0; i < response.data.length; i++) {
            if (
              response.data[i].current_stage != "CLOSE" &&
              response.data[i].current_stage != "CANCEL-ACTION"
            ) {
              actionDetails.push(response.data);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
  }, [updateAct]);

  

  function isApAchecked() {
    if (formMethods.getValues("issueId") != "") {
      if (formMethods.getValues("isActionPlanApproverDifferent") == true) {
        formMetaData.fields.actionPlanApproverOrgBu.visible = true;
        formMetaData.fields.actionPlanApprover.visible = true;
        if (formMethods.getValues("currentStage") != "INITIATE") {
          formMetaData.fields.actionPlanApproverOrgBu.required = true;
          formMetaData.fields.actionPlanApprover.required = true;
        }
      }
    }

    if (
      formMethods.getValues("isActionPlanApproverDifferent") == false ||
      formMethods.getValues("isActionPlanApproverDifferent") == ""
    ) {
      formMethods.setValue(
        "actionPlanApproverOrgBu",
        formMethods.getValues("approverBusinessUnit")
      );
      formMethods.setValue(
        "actionPlanApprover",
        formMethods.getValues("approver")
      );
    }
  }

  
  form.callbackFromChild = (props) => {
    setupdateAct(!updateAct);
    runtimeParams.refreshdataref.current();
  };

  form.source.onChange(function (value) {
    let numericValue = value.replace(/[^a-zA-Z0-9\s]+/g, "");
    formMethods.setValue("source", numericValue);
  });

  if(formMethods.getValues("identifiedOn")==''){
    formMetaData.fields.firstOccurredOn.editable=false;
  }
  form.identifiedOn.onChange(function (value) {
    const firstOccurredOn = formMethods.getValues("firstOccurredOn");
    if(value=='Invalid Date-Invalid Date-Invalid Date Invalid Date'){
      formMetaData.fields.firstOccurredOn.editable=false;
      formMethods.setValue("firstOccurredOn", "");
    }
    else{
      formMetaData.fields.firstOccurredOn.editable=true;

    }
    if (value < firstOccurredOn) {
      formMethods.setValue("firstOccurredOn", "");
    }
  });

  form.isActionPlanApproverDifferent.onChange(function (value) {
    if (value == true) {
      formMetaData.fields.actionPlanApproverOrgBu.visible = true;
      formMetaData.fields.actionPlanApprover.visible = true;
      if (formMethods.getValues("currentStage") != "INITIATE") {
        formMetaData.fields.actionPlanApproverOrgBu.required = true;
        formMetaData.fields.actionPlanApprover.required = true;
      }

      formMethods.setValue("actionPlanApproverOrgBu", null);
      formMethods.setValue("actionPlanApprover", null);
    }
    if (value == false) {
      formMetaData.fields.actionPlanApproverOrgBu.visible = false;
      formMetaData.fields.actionPlanApprover.visible = false;
      formMetaData.fields.actionPlanApproverOrgBu.required = false;
      formMetaData.fields.actionPlanApprover.required = false;
      formMethods.setValue(
        "actionPlanApproverOrgBu",
        formMethods.getValues("approverBusinessUnit")
      );
      formMethods.setValue(
        "actionPlanApprover",
        formMethods.getValues("approver")
      );
    }
  });

  form.onSubmit = function  (actionName) {
    isApAchecked();
    if (actionName == "Update Issue" || actionName === "Approve Cancellation") {
      for (const key in formMetaData.fields) {
        formMetaData.fields[key].required = false;
      }
      return actionName;
    }
    if (actionName === "Cancel Issue") {
      for (const key in formMetaData.fields) {
        formMetaData.fields[key].required = false;
      }
      formMetaData.fields.reasonForCancel.required = true;
      formMetaData.fields.justificationForCancellation.required = true;
      return actionName;
    }
    if (
      actionName === "Request Clarification" &&
      formMethods.getValues("currentStage") == "TRIAGE"
    ) {
      for (const key in formMetaData.fields) {
        formMetaData.fields[key].required = false;
      }
      formMetaData.fields["comments"].required = true;
    }
    
    if (
      actionName === "Send for Approval" &&
      (formMethods.getValues("currentStage") == "APP"||formMethods.getValues("currentStage") == "SUBMIT_CLARIFICATION_APP")
    ) {
      formMetaData.fields.impact.required = true;
      formMetaData.fields.likelihood.required = true;
      formMetaData.fields.severityRating.required = true;

      let checkissueFormFieldNotFilled=checkissueFields();
      
      
      if(!checkissueFormFieldNotFilled){
       let result=checkAllFieldsInActions();
       return result;
      }
      return actionName;
    }
    
    if (actionName == "Send for Closure") {
      if (formMethods.getValues("resolutionSummary") == null) {
        formMetaData.fields.resolutionSummary.required = true;
        formMetaData.fields.resolutionSummary.editable = true;
        formMetaData.fields.resolutionSummary.visible = true;
        return false;
      }
      return actionName;
    }
    if (
      actionName === "Submit Clarification" ||
      actionName === "Request Clarification" ||
      actionName === "Review Completed" ||
      actionName == "Approve and Trigger Actions" ||
      actionName=="Send for Approval" ||
      actionName == "Approve & Close Issue"
    ) {
      return actionName;
    }

    if (actionName == "Draft" ) {
      return "skip";
    }
    if (actionName == "Accept Issue") {
      for (const key in formMetaData.fields) {
        formMetaData.fields[key].required = false;
      }
      formMethods.setValue(
        "triagedUser",
        formMetaData.util.getCurrentUser().id
      );
      isApAchecked();
      formMetaData.fields.dueDate.required = true;
      formMetaData.fields.types.required = true;
      formMetaData.fields.priority.required = true;
      formMetaData.fields.managedByBU.required = true;
      formMetaData.fields.owner.required = true;
      formMetaData.fields.approverBusinessUnit.required = true;
      formMetaData.fields.approver.required = true;
      return actionName;
    }
  };

  form.onCancel = (action) => {
    formMethods.setValue("comments", "");
    if (action == "Cancel Issue Comments") {
      formMethods.setValue("reasonForCancel", null);
      formMethods.setValue("justificationForCancellation", null);
      formMetaData.fields.reasonForCancel.required = false;
      formMetaData.fields.justificationForCancellation.required = false;
    }
  };
  return form;
};

export default JSHook;
