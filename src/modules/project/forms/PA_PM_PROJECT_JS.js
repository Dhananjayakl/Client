import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { getObjectCount } from "../PMService";

let JSHook = (
  form,
  formMetaData,
  formMethods,
  MSFields,
  formValues,
  control
) => {
  form.onLoad = (props) => {
    const proposedStartDateVal = formMethods.getValues(
      "proposedProjectStartDate"
    );
    const proposedEndDateVal = formMethods.getValues("proposedProjectEndDate");
    const actualStartDateVal = formMethods.getValues("actualStartDate");
    const actualEndDateVal = formMethods.getValues("actualEndDate");
    // if (formValues.objectId > 0) {
    //   formMetaData.fields.proposedProjectStartDate.editable = false;
    //   formMetaData.fields.proposedProjectEndDate.editable = false;
    // }
    if (proposedStartDateVal > proposedEndDateVal) {
      formMethods.setValue("proposedProjectEndDate", "");
    }
    if (actualStartDateVal < actualEndDateVal) {
      formMethods.setValue("actualEndDate", "");
    }
    if (formMethods.getValues("projectStatus") == "") {
      formMethods.setValue("projectStatus", "1");
    }
  };

  let projectStatus = useWatch({
    control: control,
    name: "projectStatus",
  });
  form.proposedProjectStartDate.onChange((value) => {
    const proposedEndDate = formMethods.getValues("proposedProjectEndDate");
    if (proposedEndDate < value) {
      formMethods.setValue("proposedProjectEndDate", "");
    }
  });
  form.actualStartDate.onChange((value) => {
    const actualEndDate = formMethods.getValues("actualEndDate");
    if (actualEndDate > value) {
      formMethods.setValue("actualEndDate", "");
    }
  });
  form.proposedMilestoneDate.onChange((value, row) => {
    const actualMSDate = formMethods.getValues("MS." + row + ".actualDate");
    if (actualMSDate < value) {
      formMethods.setValue("MS." + row + ".actualDate", "");
    }
  });
  form.actualDate.onChange((value, row) => {
    const proposedMSDate = formMethods.getValues(
      "MS." + row + ".proposedMilestoneDate"
    );
    if (proposedMSDate < value) {
      formMethods.setValue("MS." + row + ".actualDate", "");
    }
  });
  if (formMethods.getValues("objectId") > 0) {
    if (projectStatus == 3) {
      formMetaData.fields.closureDate.required = true;
      formMetaData.fields.closureDate.editable = true;
    } else {
      formMetaData.fields.closureDate.required = false;
      formMethods.setValue("closureDate", "");
      formMetaData.fields.closureDate.editable = false;
    }

    let filterExpression = `project=${formValues.objectId} and (status != 'Completed' or task_status != 6)`;
    const buttons = document.querySelectorAll(".disbutton");
    useEffect(() => {
      getObjectCount(
        "getObjectCount",
        "pa_pm_project_tasks",
        filterExpression
      ).then((response) => {
        buttons.forEach((button) => {
          const buttonChildren = button.textContent.trim();
          if (
            buttonChildren === "Submit" &&
            response.data > 0 &&
            projectStatus == 3
          ) {
            alert(
              "There are open tasks for this project, Please ask team to complete"
            );
            button.hidden = true;
          } else {
            button.hidden = false;
          }
        });
      });
    }, [projectStatus, buttons]);
  }

  form.onLoad();

  return form;
};

export default JSHook;
