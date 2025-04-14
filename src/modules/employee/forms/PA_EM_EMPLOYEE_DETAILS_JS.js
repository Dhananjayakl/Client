import { useEffect } from "react";

let JSHook = (
  form,
  formMethods,
  fields,
  formMetaData,
  formValues,
  callbackToParent,
  runtimeParams
) => {
  if (runtimeParams.type === "Emp") {
    let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
      .data[0].user_id;
    formMethods.setValue("userId", userId);

    formMetaData.fields.userId.editable = false;
  }

  if (formValues.objectId !== undefined) {
    formMetaData.fields.userId.editable = false;
  }

  form.employeeCode.onChange(function (value) {
    let numericValue = value.replace(/[^0-9a-zA-Z]/g, "");
    formMethods.setValue("employeeCode", numericValue);
  });

  if (runtimeParams.type === "Emp") {
    if (formValues.objectId !== -1) {
      formMetaData.fields.userId.editable = false;
      formMetaData.fields.employeeCode.editable = false;
      formMetaData.fields.employeeType.editable = false;
      formMetaData.fields.designation.editable = false;
      formMetaData.fields.region.editable = false;
      formMetaData.fields.employeeGender.editable = false;
      formMetaData.fields.dateOfJoining.editable = false;
      formMetaData.fields.department.editable = false;
      formMetaData.fields.firstName.editable = false;
      formMetaData.fields.middleName.editable = false;
      formMetaData.fields.lastName.editable = false;
    }
  }

  useEffect(() => {
    const updatedButton = document.querySelector(".my-2.disbutton");
    const skipButton = document.querySelector(".my-2.close-btn");
    if (updatedButton) {
      updatedButton.textContent = "Save";
      updatedButton.style.borderRadius = "30px";
    }
    if (skipButton) {
      skipButton.textContent = "Skip";
      skipButton.style.borderRadius = "30px";
    }

    const EditButton = document.querySelector(".editbutton");
    if (EditButton != null || EditButton != undefined) {
      if (runtimeParams.type === "Emp") {
        EditButton.hidden = true;
      } else {
        EditButton.hidden = false;
      }
    }
  }, [form, formMethods, fields, formMetaData, runtimeParams.type]);

  return form;
};

export default JSHook;
