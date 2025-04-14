//

import { getObjectInfo } from "src/modules/admin/AdminService";
import { useState, useEffect } from "react";

let JSHook = (form, formMethods, fields, formMetaData, formValues) => {
  formMetaData.fields.employeeCode.editable = false;
  formMetaData.fields.firstName.editable = false;
  formMetaData.fields.middleName.editable = false;
  formMetaData.fields.lastName.editable = false;

  const [userId, setUserId] = useState("");
  const [response, setresponse] = useState("");

  form.userId.onChange(function (value) {
    setUserId(value);
  });

  useEffect(() => {
    if (userId !== "") {
      getObjectInfo("getObjectInfo", userId, "USERS", "USER_ID")
        .then((response) => {
          if (response.data && response.data.length > 0) {
            formMethods.setValue("employeeCode", response.data[0].employee_id);
            formMethods.setValue("firstName", response.data[0].first_name);
            formMethods.setValue("middleName", response.data[0].middle_name);
            formMethods.setValue("lastName", response.data[0].last_name);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      getObjectInfo(
        "getObjectInfo",
        userId,
        "LM_LEAVE_LEDGER_DETAILS",
        "USER_ID"
      )
        .then((response) => {
          setresponse(response);

          if (response.data && response.data.length > 0) {
            formMethods.setValue(
              "totalcasualLeaves",
              response.data[0].total_casual_leaves
            );
            formMethods.setValue(
              "totalearnedLeaves",
              response.data[0].total_earned_leaves
            );
            formMethods.setValue(
              "totalmaternityLeaves",
              response.data[0].total_optional_holiday
            );
            formMethods.setValue(
              "totalsickLeaves",
              response.data[0].total_maternity_leaves
            );
            formMethods.setValue(
              "totalpaternityLeaves",
              response.data[0].total_paternity_leaves
            );
            formMethods.setValue(
              "totaloptionalHoliday",
              response.data[0].total_optional_holiday
            );
            formMethods.setValue("createdOn", response.data[0].created_on);
          } else {
            formMethods.setValue("totalcasualLeaves", "");
            formMethods.setValue("totalearnedLeaves", "");
            formMethods.setValue("totalmaternityLeaves", "");
            formMethods.setValue("totalsickLeaves", "");
            formMethods.setValue("totalpaternityLeaves", "");
            formMethods.setValue("totaloptionalHoliday", "");
            formMethods.setValue("createdOn", "");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userId]);

  if (response.data && response.data.length > 0) {
    for (const fieldKey in formMetaData.fields) {
      if (Object.hasOwnProperty.call(formMetaData.fields, fieldKey)) {
        if (fieldKey !== "userId")
          formMetaData.fields[fieldKey].editable = false;
      }
    }
  } else {
    for (const fieldKey in formMetaData.fields) {
      if (fieldKey !== "userId") {
        if (Object.hasOwnProperty.call(formMetaData.fields, fieldKey)) {
          formMetaData.fields[fieldKey].editable = true;
        }
      }
    }
  }

  const disabledButton = document.querySelector(".disbutton");

  if (disabledButton != null || disabledButton != undefined) {
    if (response.data && response.data.length > 0) {
      disabledButton.hidden = true;
    } else {
      disabledButton.hidden = false;
    }
  }

  if (formValues.objectId !== undefined) {
    formMetaData.fields.userId.editable = false;
  }
  return form;
};

export default JSHook;
