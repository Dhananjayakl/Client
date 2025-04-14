import { useEffect } from "react";
import { getObjectInfo, getviewData, getFormData } from "../IAService";
import { useWatch } from "react-hook-form";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import { useSearchParams } from "react-router-dom";
const JSHook = (
  form,
  formMetaData,
  formMethods,
  formValues,
  control,
  runtimeParams,
  MSTappend,
  setplanEnd,
  setplanStart
) => {
  useEffect(() => {
    if (formValues?.planId) {
      formMethods.setValue("planId", formValues?.planId);
    }
    if (
      (formMethods.getValues("objectId") == null ||
        formMethods.getValues("objectId") == "") &&
      runtimeParams.ParentFormObjectId !== undefined
    ) {
      formMethods.setValue("planId", runtimeParams.ParentFormObjectId);
      formMethods.setValue("currentStage", "PLAN");
      formMethods.setValue("scopeBasedOn", 1);
      if (runtimeParams?.ParentFormObjectId) {
        formMetaData.fields.planId.visible = false;
      }
    }
  }, []);
  useEffect(() => {
    if (
      formMethods.getValues("objectId") == null ||
      formMethods.getValues("objectId") == ""
    ) {
      formMethods.setValue("scopeBasedOn", 1);
    }
  }, []);
  formMetaData.fields.auditBU.editable = false;
  useEffect(() => {
    formMethods.setValue(
      "auditBU",
      formMetaData.configurationFormMetaData.audit_bu
    );
  });

  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  if (
    formMethods.getValues("auditStatus") == null ||
    formMethods.getValues("auditStatus") == ""
  ) {
    formMethods.setValue("auditStatus", 1);
  }

  if (
    formMethods.getValues("status") == null ||
    formMethods.getValues("status") == ""
  ) {
    formMethods.setValue("status", "Audit Planning");
  }

  if (runtimeParams.actionFlag === true) {
    if (formMetaData.actions !== null) {
      formMetaData.actions = formMetaData.actions.filter(
        (item) =>
          item.action != "Schedule Audit" && item.action != "Create Audit"
      );
      formMetaData.fields.planId.visible = false;
      formMetaData.fields.planId.required = false;
    }
  } else if (
    formMethods.getValues("currentStage") == null ||
    formMethods.getValues("currentStage") == ""
  ) {
    formMethods.setValue("currentStage", "PLAN");
  }

  form.scopeBasedOn.onChange(function (value) {
    if (value) {
      formMethods.setValue("scope", "");
    }
  });
  let startDate = useWatch({
    control: control,
    name: "startDate",
  });
  const buttons = document.querySelectorAll(".disbutton");

  let ab = searchParams.get("formService");
  if (formMetaData.actions != null && ab == "auditplan") {
    formMetaData.actions = formMetaData.actions.filter(
      (actionName) =>
        actionName.action != "Schedule Audit" &&
        actionName.action != "Create Audit"
    );
  }
  useEffect(() => {
    let ab = searchParams.get("formService");

    if (!runtimeParams.actionFlag && ab != "auditplan") {
      buttons.forEach((button) => {
        const buttonChildren = button.textContent.trim();

        if (util.getFormattedDate(startDate) == util.getCurrentDate()) {
          if (
            buttonChildren === "Schedule Audit" ||
            buttonChildren === "Save"
          ) {
            button.hidden = true;
          } else {
            button.hidden = false;
          }
        } else {
          if (buttonChildren === "Create Audit" || buttonChildren === "Save") {
            button.hidden = true;
          }
          // else if (buttonChildren == "Trigger Audit") {
          //   button.hidden = true;
          // }
          else {
            button.hidden = false;
          }
        }
      });
    }
  }, [buttons, startDate, runtimeParams.actionFlag]);
  let allInLastStage = true;
  let count = 0;
  let auditWorkpaperArray = [];
  let findingIds = [];
  let reportIds = [];
  const mstData = {
    viewName: "PA_IA_CONFIGURATION_MST_BT",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "order by mst_order",
    filterExpression: "",
  };
  const workpaperData = {
    viewName: "pa_ia_get_open_workpaper_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `audit_id=${objectId}`,
  };

  const issueobservationData = {
    viewName: "pa_ir_issue_observation_log_bt",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `src_obj_id=${objectId} and fnd_program=1`,
  };

  const reportData = {
    viewName: "pa_ia_audit_report_bt",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `AUDIT_TITLE=${objectId}`,
  };

  const checkWorkpapers = () => {
    return getviewData(workpaperData)
      .then((response) => {
        console.log(
          response.data.data,
          response.data.data.length,
          "Workpaper Dataaaaaa"
        );
        if (response.data.data.length > 0) {
          count += 1;
          console.log(count, "Workpaper Dataaaaaacount");
        }

        for (let item in response.data.data) {
          if (
            !(
              response.data.data[item].status == "Cancelled" ||
              response.data.data[item].status == "Approved" ||
              response.data.data[item].status == "Rejected"
            )
          ) {
            allInLastStage = false;
            auditWorkpaperArray.push([
              response.data.data[item].object_id,
              response.data.data[item].status,
              response.data.data[item].formservice,
            ]);
          }
        }
        console.log(
          auditWorkpaperArray,
          "Workpaper Dataaaaaa workpaperIdsworkpaperIds"
        );
      })
      .catch((error) => {
        console.error("Error fetching workpapers:", error);
        allInLastStage = false;
      });
  };
  const checkIssueObservations = () => {
    return getviewData(issueobservationData)
      .then((response) => {
        console.log(response.data.data, "Findings Dataaaa  fnd_id");
        if (response.data.data.length > 0) {
          count += 1;
        }
        for (let item in response.data.data) {
          if (response.data.data[item].status != "Response Received") {
            allInLastStage = false;
            findingIds.push(response.data.data[item].fnd_id);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching issue observations:", error);
        allInLastStage = false;
      });
  };

  const checkReports = () => {
    return getviewData(reportData)
      .then((response) => {
        console.log(response.data.data, "Reports data");
        if (response.data.data.length > 0) {
          count += 1;
        }
        for (let item in response.data.data) {
          if (
            response.data.data[item].status != "Published" ||
            response.data.data[item].report_type == 1
          ) {
            allInLastStage = false;
            reportIds.push(response.data.data[item].object_id);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        allInLastStage = false;
      });
  };
  form.onSubmit = async function (actionName, actionCode, e) {
    console.log("Action:", actionName);

    if (actionName === "Close Audit") {
      try {
        await checkWorkpapers();
        if (allInLastStage && count == 1) {
          await checkIssueObservations();
        }
        if (allInLastStage && (count == 2 || count == 1)) {
          await checkReports();
        }

        console.log(allInLastStage, count, "audit close condition checks");

        if (!allInLastStage || count < 2) {
          alert(
            "Please create atleast one workpaper,finding and final report and close them."
          );
          return false;
        } else {
          return actionName;
        }
      } catch (error) {
        console.error("Error in the data validation process:", error);
        alert("An error occurred while checking the status.");
        return false;
      }
    } else if (actionName == "Save") {
      return "skip";
    } else if (actionName == "Trigger Audit") {
      triggerAudit(actionName);
    } else {
      return actionName;
    }
  };
  useEffect(() => {
    if (formValues.MST == undefined) {
      getviewData(mstData)
        .then((response) => {
          const responseData = response.data;

          if (responseData && responseData.data.length > 0) {
            responseData.data.forEach((rowData, rowIndex) => {
              MSTappend(
                {
                  mstId: "",
                  mstName: rowData.mst_name,
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
  }, []);

  let planId = useWatch({
    control: control,
    name: "planId",
  });

  useEffect(() => {
    if (planId !== undefined && planId !== "") {
      getObjectInfo("getObjectInfo", planId, "IA_AUDIT_PLAN", "PLAN_ID")
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setplanEnd(response.data[0].end_date),
              setplanStart(response.data[0].start_date);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [planId]);
  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().split("T")[0];
  const triggerAudit = (actionName) => {
    formMethods.setValue("startDate", formattedCurrentDate);
    return actionName;
  };
  form.startDate.onChange(function (value) {
    formMetaData.fields.endDate.editable = true;
    formMethods.setValue("endDate", "");
  });

  if (formMethods.getValues("startDate") == "") {
    formMetaData.fields.endDate.editable = false;
    formMethods.setValue("endDate", "");
  }
  if (formMethods.getValues("planId") == "") {
    formMetaData.fields.startDate.editable = false;
  } else if (
    formMethods.getValues("planId") != "" &&
    formMethods.getValues("currentStage") == "PLAN" &&
    formMetaData.formmeta.accessCode == 1
  ) {
    formMetaData.fields.startDate.editable = true;
  }

  form.planId.onChange(function (value) {
    formMetaData.fields.startDate.editable = true;
    formMethods.setValue("startDate", "");
  });

  let actioncode = formMethods.getValues("action");

  if (actioncode == 1) {
    try {
      for (const key in formMetaData.fields) {
        if (key == "auditTitle") {
          formMetaData.fields[key].required = true;
        } else {
          formMetaData.fields[key].required = false;
        }
      }
    } catch (error) {
      console.log("error in the form submission");
    }
  }

  return form;
};
export default JSHook;
