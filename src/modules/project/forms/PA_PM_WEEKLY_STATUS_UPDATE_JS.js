import { useEffect, useState } from "react";
import { getObjectInfo, getObjectCount } from "../PMService";
import { getServiceData } from "src/components/server/service";
import { useWatch } from "react-hook-form";
let review = "Send for Review";
let submit = "Submit";
let draft = "Draft";

let JSHook = (form, formMetaData, formMethods, formValues, control) => {
  form.onLoad = (props) => {
    if (formValues.objectId == null) {
      // formMethods.setValue("action", 1);
      formMethods.setValue("currentStage", "INITIATE");
      formMethods.setValue("status", "New");
    }
  };
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;
  const [currentDate, setCurrentDate] = useState();
  const [dayflag, setDayflag] = useState(false);
  useEffect(() => {
    getObjectInfo("getObjectInfo", userId, "EM_EMPLOYEE_DETAILS", "user_id")
      .then((response) => {
        if (response.data && response.data.length > 0) {
          console.log(response.data, " Response Data");
          formMethods.setValue("empName", response.data[0].user_id);
          formMethods.setValue("empId", response.data[0].employee_code);
          formMethods.setValue("empDept", response.data[0].department);
        }
      })
      // ;
      // getServiceData("manager", userId)
      //   .then((response) => {
      //     const managerId = response.data;
      //     formMethods.setValue("reportingManager", managerId);
      //   })
      .catch((err) => {
        console.log(err);
      });
    getObjectInfo("getObjectInfo", userId, "USERS", "user_id")
      .then((response) => {
        if (response.data && response.data.length > 0) {
          console.log(response.data, " Response Data");
          // formMethods.setValue("reportingManager", response.data[0].manager);
          formMethods.setValue("reportingManager", 1);
        }
      })
      // ;
      // getServiceData("manager", userId)
      //   .then((response) => {
      //     const managerId = response.data;
      //     formMethods.setValue("reportingManager", managerId);
      //   })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  let weekEnding = useWatch({
    control: control,
    name: "weekEnding",
  });

  form.onLoad();

  const isFriday = (date1) => {
    const dt = new Date(date1);
    return dt.getDay();
  };
  let filterExpression = `emp_name=${formMethods.getValues(
    "empName"
  )} and week_ending='${formMethods.getValues("weekEnding")}'`;
  const buttons = document.querySelectorAll(".ms-1.disbutton");
  if (formValues.objectId == null) {
    useEffect(() => {
      getObjectCount(
        "getObjectCount",
        "pa_pm_weekly_status_update",
        filterExpression
      )
        .then((response) => {
          if (response.data > 0) {
            setDayflag(true);

            alert(
              "The Weekly Status Update has been created for the selected date, please choose a different weekend date."
            );
            formMethods.setValue("weekEnding", "");
          } else {
            if (isFriday(weekEnding) != 5 && weekEnding != "") {
              setDayflag(true);
              alert(
                "The selected date is not a weekend date, please select weekend date."
              );
              formMethods.setValue("weekEnding", "");
            } else {
              setDayflag(false);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, [weekEnding]);

    // useEffect(() => {
    //   buttons.forEach((button) => {
    //     const buttonChildren = button.textContent.trim();
    //     if (buttonChildren === "Send for Review" && dayflag) {
    //       button.hidden = true;
    //     } else {
    //       button.hidden = false;
    //     }
    //   });
    // }, [dayflag]);
  }

  function formatDate(jsonDate) {
    if (jsonDate === undefined || jsonDate == "") return "";
    const date = new Date(jsonDate);

    const getYear = date.toLocaleDateString("default", {
      year: "numeric",
    });
    const getMonth = date.toLocaleDateString("default", {
      month: "2-digit",
    });
    const getDay = date.toLocaleDateString("default", { day: "2-digit" });
    const formattedDate = getYear + "-" + getMonth + "-" + getDay;
    return formattedDate;
  }
  if (formValues.objectId == null) {
    useEffect(() => {
      const date = new Date();
      const formattedDate = date.toISOString();

      setCurrentDate(formattedDate);
    }, []);
  }

  // let action = useWatch({
  //   control: control,
  //   name: "action",
  // });

  // useEffect(() => {
  //   if (action === 3) {
  //     formMetaData.fields.projectTask.required = false;
  //     formMetaData.fields.projectProgress.required = false;
  //   } else {
  //     formMetaData.fields.projectTask.required = true;
  //     formMetaData.fields.projectProgress.required = true;
  //   }
  // }, [action]);

  form.onSubmit = function (actionName, actionCode) {
    if (actionName == "Send for Review") {
      formMethods.setValue("submittedOn", formatDate(currentDate));
      formMetaData.fields.projectTask.required = true;
      formMetaData.fields.projectProgress.required = true;
      return actionName;
    } else if (actionName == "Submit") {
      return actionName;
    } else if (actionName == "Draft") {
      formMetaData.fields.projectTask.required = false;
      formMetaData.fields.projectProgress.required = false;
      formMethods.setValue("submittedOn", "");
      return "skip";
    }
  };

  return form;
};

export default JSHook;
