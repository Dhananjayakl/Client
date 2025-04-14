import { getServiceData } from "src/components/server/service";
import { getHrAdmin } from "../EmployeeService";
import { useState, useEffect } from "react";

let JSHook = (form, formMethods, fields, formMetaData) => {
  const pagePath = window.parent.location.pathname;
  const [date, setDate] = useState("");
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  formMetaData.fields.userId.editable = false;
  formMetaData.fields.resDate.editable = false;
  formMetaData.fields.manager.editable = false;
  formMetaData.fields.noticePeriod.editable = false;

  function formatDate(jsonDate) {
    if (!jsonDate) return "";
    const date = new Date(jsonDate);

    const getYear = date.toLocaleDateString("default", { year: "numeric" });
    const getMonth = date.toLocaleDateString("default", { month: "2-digit" });
    const getDay = date.toLocaleDateString("default", { day: "2-digit" });
    const formattedDate = getYear + "-" + getMonth + "-" + getDay;
    return formattedDate;
  }

  if (pagePath === "/employee/settings" || pagePath === "/employee/profile") {
    formMethods.setValue("resDate", new Date());

    formMethods.setValue("userId", userId);
    useEffect(() => {
      if (
        formMethods.getValues("previousStage") === null ||
        formMethods.getValues("previousStage") === ""
      ) {
        formMethods.setValue("action", 1);
        formMethods.setValue("currentStage", "INITIATE");
      }

      formMethods.setValue("status", "New");
    });

    useEffect(() => {
      getServiceData("manager", userId)
        .then((response) => {
          const managerId = response.data;
          // initialValues.manager = managerId;

          formMethods.setValue("manager", managerId);
        })
        .catch((err) => {});
      getHrAdmin("getUsersForHrmsAdmin")
        .then((response) => {
          const hrUserId = response.data[0];
          formMethods.setValue("hrManager", hrUserId);
        })
        .catch((err) => {
          console.log(err);
        });
    }, [userId]);

    form.relievingDate.onChange(function (value) {
      setDate(value);
    });

    useEffect(() => {
      const fromDate = new Date();
      const toDate = new Date(date);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);

      const timeDifference = toDate - fromDate;
      const totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      // formMethods.setValue("noticePeriod",0);
      if (totalDays >= 0) {
        formMethods.setValue("noticePeriod", totalDays + 1);
      } else {
        formMethods.setValue("noticePeriod", 0);
      }
    }, [date]);
  }
  if (pagePath === "/form/runtime") {
    formMetaData.fields.userId.editable = false;
    formMetaData.fields.resDate.editable = false;
    formMetaData.fields.noticePeriod.editable = false;
    formMetaData.fields.relievingDate.editable = false;
    formMetaData.fields.reasonSeparation.editable = false;
    formMetaData.fields.srFeedback.editable = false;
    formMetaData.fields.confFeedback.editable = false;
    formMetaData.fields.manager.editable = false;
  }

  let sysDate = formatDate(new Date());

  useEffect(() => {
    if (date < sysDate) {
      formMethods.setError("relievingDate", {
        type: "manual",
        message: "Relieving Date must be Greater than Equal Resignation Date",
      });
      // formMethods.setValue('relievingDate', '');
    } else if (date >= sysDate) {
      formMethods.clearErrors("relievingDate");
    }
  }, [sysDate, date]);
  return form;
};

export default JSHook;
