import { useEffect, useState } from "react";
import { getObjectInfo, getviewData } from "../IAService";
import { useWatch } from "react-hook-form";

const JSHook = (
  form,
  formMetaData,
  formMethods,
  formValues,
  control,
  runtimeParams,
  setjsonData,
  setApiResponse
) => {
  formMetaData.fields.auditTitle.editable = false;
  formMetaData.fields.auditManager.editable = false;
  formMetaData.fields.leadAuditor.editable = false;
  formMetaData.fields.startDate.editable = false;
  formMetaData.fields.endDate.editable = false;
  if (formValues.objectId === undefined) {
    useEffect(() => {
      formMethods.setValue("objectId", runtimeParams.ParentFormObjectId);
      formMethods.setValue("auditTitle", runtimeParams.ParentFormObjectId);

      if (runtimeParams.ParentFormObjectId !== "") {
        getObjectInfo(
          "getObjectInfo",
          runtimeParams.ParentFormObjectId,
          "IA_AUDITS",
          "object_id"
        )
          .then((response) => {
            if (response.data && response.data.length > 0) {
              formMethods.setValue(
                "auditManager",
                response.data[0].audit_manager
              );
              formMethods.setValue(
                "leadAuditor",
                response.data[0].lead_auditor
              );
              formMethods.setValue("startDate", response.data[0].start_date);
              formMethods.setValue("endDate", response.data[0].end_date);
            } else {
              formMethods.setValue("auditManager", "");
              formMethods.setValue("leadAuditor", "");
              formMethods.setValue("startDate", "");
              formMethods.setValue("endDate", "");
            }
          })
          .catch((err) => {
            console.log(err);
          });

        getObjectInfo(
          "getObjectInfo",
          runtimeParams.ParentFormObjectId,
          "IA_AUDIT_REPORT",
          "object_id"
        )
          .then((response) => {
            if (response.data && response.data.length > 0) {
              formMethods.setValue(
                "reportNumber",
                response.data[0].report_number
              );
              formMethods.setValue("reportYear", response.data[0].report_year);
              formMethods.setValue(
                "auditRating",
                response.data[0].audit_rating
              );
              formMethods.setValue(
                "auditProcedures",
                response.data[0].audit_procedures
              );
              formMethods.setValue(
                "auditConclusion",
                response.data[0].audit_conclusion
              );
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      // })
    }, [runtimeParams]);
  }
  form.reportYear.onChange(function (value) {
    if (value.length > 4) {
      value = value.slice(0, 4);
      formMethods.setValue("reportYear", value);
    }
  });

  if (
    formMethods.getValues("previousStage") === null ||
    formMethods.getValues("previousStage") === ""
  ) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }

  form.onSubmit = function (actionName, actionCode) {
    return actionName;
  };
  console.log(
    runtimeParams,
    formMethods.getValues(),
    "runtimeparamsruntimeparams"
  );

  let selectFindings = useWatch({
    control: control,
    name: "selectFindings",
  });
  let reportType = useWatch({
    control: control,
    name: "reportType",
  });

  useEffect(() => {
    console.log(
      formMethods.getValues("selectFindings"),
      "formMethodsvalues changed"
    );
    console.log(formMethods.getValues(), "formMethodsvalues");
    const data = formMethods.getValues();
    if (reportType >= 1) {
      setjsonData(JSON.stringify(data));
    }
  }, [reportType, selectFindings]);
  let currentStage = formMethods.getValues("currentStage");
  if (currentStage == "INITIATE") {
    formMethods.setValue("businessUnitAudited", runtimeParams.fndApproveBU);
  }

  formMetaData.fields.businessUnitAudited.editable = false;
  const [auditId, setauditId] = useState("");
  const workpaperData = {
    viewName: "pa_ia_audit_workpaper_bt",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `audit_id = ${
      runtimeParams.ParentFormObjectId
        ? runtimeParams.ParentFormObjectId
        : formValues.auditTitle[0].value
    }`,
  };
  const findingData = {
    viewName: "pa_ir_issue_observation_log",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `fnd_program=1 and fnd_type=1 and src_obj_id= ${
      runtimeParams.ParentFormObjectId
        ? runtimeParams.ParentFormObjectId
        : formValues.auditTitle
    }`,
  };
  const [findingCount, setFindingCount] = useState(true);
  useEffect(() => {
    getviewData(findingData).then((response) => {
      const responseData = response.data;
      if (responseData.data.length == 0) {
        setFindingCount(false);
      }
    });
  }, []);
  if (!findingCount) {
    formMetaData.fields.selectFindings.required = false;
  } else {
    formMetaData.fields.selectFindings.required = true;
  }

  useEffect(() => {
    getviewData(workpaperData)
      .then((response) => {
        const responseData = response.data;
        if (responseData.data.length > 0) {
          const srcIds = responseData.data
            .map((item) => item.object_id)
            .join(",");
          setauditId(srcIds);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const viewData = {
    viewName: "pa_ia_audit_workpaper_tst_bt",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `object_id in (${auditId}) and tst_result is not null`,
  };
  console.log(auditId, "auditId");

  useEffect(() => {
    if (auditId != "") {
      getviewData(viewData)
        .then((response) => {
          const responseData = response.data;
          if (responseData.data.length > 0) {
            setApiResponse(response.data.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [auditId]);
  return form;
};
export default JSHook;
