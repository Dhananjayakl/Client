import { getServiceData } from "src/components/server/service";
import { useState, useEffect } from "react";
import * as Yup from "yup";

let JSHook = (
  form,
  fields,
  formMethods,
  formMetaData,
  callbackToParent,
  formValues,
  runtimeParams
) => {
  const pathName = window.parent.location.pathname;
  // console.log(runtimeParams, "ferariiiiii");

  const [valueFR, setvalueFR] = useState("");
  const [valueF, setValueF] = useState("");

  if (formMethods.getValues("futureRegularization") == "") {
    formMetaData.fields.until.editable = false;
  }

  if (formValues.objectId === undefined) {
    useEffect(() => {
      formMethods.setValue("futureRegularization", false);
    }, []);
  }
  form.from.onChange((value) => {
    setValueF(value);
  });

  if (formMethods.getValues("from") !== "") {
    formMetaData.fields.until.editable = true;
  }

  form.futureRegularization.onChange(function (value) {
    setvalueFR(value);
    formMethods.setValue("from", "");
    formMethods.setValue("until", "");
  });

  let getfutureValue = formMethods.getValues("futureRegularization");
  // console.log(validationFlag, "validation flag");

  useEffect(() => {
    if (!runtimeParams.objectData) {
      console.log("called yup");
      const validationSchema = Yup.object().shape({
        futureRegularization: Yup.string().required(
          "Future Regularization is Required"
        ),
        from: Yup.string()
          .required("From Date is required")
          .test(
            "futureDateCheck",
            "From Date must be greater than or equal to the current date",
            (value, { parent }) => {
              // const futureRegulations = this.futureRegulations;
              const currentDate = new Date();
              if (valueFR === true || getfutureValue === true) {
                const selectedDate = new Date(value);
                currentDate.setHours(0, 0, 0, 0);
                selectedDate.setHours(0, 0, 0, 0);
                return selectedDate >= currentDate;
                // return new Date(value) >= currentDate;
              }
              return true;
            }
          ),

        // until: Yup.string()
        //   .required("Until Date is required")
        //   .test(
        //     "is-after-date-of-joined",
        //     "Until Date must be greater than From Date",
        //     function (value) {
        //       const from = this.resolve(Yup.ref("from"));
        //       return !from || !value || value > from;
        //     }
        //   ),
        reason: Yup.string().required("Reason is required"),
      });
      callbackToParent(validationSchema);
    }
  }, [valueFR, getfutureValue]);
  // }

  useEffect(() => {
    formMethods.getValues("initiator");
    if (
      formMethods.getValues("previousStage") === null ||
      formMethods.getValues("previousStage") === ""
    ) {
      formMethods.setValue(
        "initiator",
        JSON.parse(localStorage.current_logged_User)[0].user_details.data[0]
          .user_id
      );
      formMethods.setValue("action", 1);
      formMethods.setValue("currentStage", "INITIATE");
    }

    formMethods.setValue("status", "New");
  });

  const [hruserId, sethruserId] = useState("");

  form.employeeName.onChange((value) => {
    sethruserId(value);
  });

  const userData = JSON.parse(localStorage.current_logged_User);
  const hradmin = userData.some((user) =>
    user.user_details.data[0].role_names.includes("HR_Admin")
  );
  const loguserId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  if (
    formMethods.getValues("employeeName") === null ||
    formMethods.getValues("employeeName") === "" ||
    formMethods.getValues("employeeName") === undefined
  ) {
    // formMethods.setValue('employeeName', loguserId);
    // formMethods.setValue('employeeName',"Employe Profile");
  }

  if (formValues.objectId == undefined) {
    useEffect(() => {
      let attUserId;
      if (hradmin) {
        attUserId = hruserId;
        // formMethods.setValue('employeeName', '');
        formMetaData.fields.manager.editable = false;
      } else {
        attUserId = loguserId;
        formMethods.setValue("employeeName", loguserId);
        formMetaData.fields.employeeName.editable = false;
        formMetaData.fields.manager.editable = false;
      }
      //set user_id and ManagerId
      getServiceData("manager", attUserId)
        .then((response) => {
          const managerId = response.data;
          // initialValues.manager = managerId;

          formMethods.setValue("manager", managerId);
        })
        .catch((err) => {
          console.log(err);
        });
    }, [hruserId, loguserId]);
  }

  if (formValues.objectId !== undefined) {
    formMetaData.fields.employeeName.editable = false;
    formMetaData.fields.manager.editable = false;
  }

  //Attendance Record
  const [duration, setDuration] = useState(null);
  const [date, setDate] = useState(null);
  const [userId, setUserId] = useState(null);
  const [logId, setLogid] = useState(null);

  if (window.parent.location.href.includes("yes")) {
    useEffect(() => {
      formMetaData.fields.futureRegularization.visible = false;
      formMetaData.fields.from.visible = false;
      formMetaData.fields.until.visible = false;
      formMetaData.fields.reason.visible = false;
      formMetaData.fields.comments.visible = false;

      formMetaData.fields.futureRegularization.required = false;
      formMetaData.fields.from.required = false;
      formMetaData.fields.until.required = false;
      formMetaData.fields.reason.required = false;
      formMetaData.fields.comments.required = false;

      formMetaData.fields.employeeName.editable = false;
      formMetaData.fields.manager.editable = false;
      formMetaData.fields.date.editable = false;
      formMetaData.fields.duration.editable = false;

      //Using this Function Fetch The value from
      //attendancelogid
      function parseQueryParam(paramIndex, setterFunction) {
        const paramString = window.location.search
          .substring(paramIndex)
          .split("&")[paramIndex];
        const queryString = new URLSearchParams(paramString);

        for (const [key, value] of queryString.entries()) {
          setterFunction(value);
        }
      }
      //Calling above Function Pass the Parameter
      parseQueryParam(2, setDuration);
      parseQueryParam(3, setDate);
      parseQueryParam(4, setUserId);
      parseQueryParam(5, setLogid);

      // getServiceData("manager", userId)
      //   .then((response) => {
      //     const managerId = response.data;
      //     // initialValues.manager = managerId;

      //     formMethods.setValue("manager", managerId);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      //Set The value
      formMethods.setValue("duration", duration);
      formMethods.setValue("date", date);
      formMethods.setValue("employeeName", userId);
      formMethods.setValue("attendanceLogId", logId);
    });
  }
  if (formValues.objectId !== undefined) {
    formMetaData.fields.date.editable = false;
    formMetaData.fields.employeeName.editable = false;
    formMetaData.fields.futureRegularization.editable = false;
    formMetaData.fields.from.editable = false;
    formMetaData.fields.until.editable = false;
    formMetaData.fields.duration.editable = false;
    formMetaData.fields.reason.editable = false;
    formMetaData.fields.manager.editable = false;
    formMetaData.fields.approvedOn.editable = false;
    formMetaData.fields.comments.required = true;
  }
  if (window.parent.location.href.includes(-1)) {
    formMetaData.fields.employeeName.editable = false;
    formMetaData.fields.manager.editable = false;
  }
  if (
    !window.parent.location.href.includes("yes") &&
    pathName == "/form/runtime"
  ) {
    if (
      formMethods.getValues("futureRegularization") == null ||
      formMethods.getValues("from") == undefined ||
      formMethods.getValues("until") == undefined ||
      formMethods.getValues("until") === undefined ||
      formMethods.getValues("reason") == undefined
    ) {
      formMetaData.fields.futureRegularization.visible = false;
      formMetaData.fields.from.visible = false;
      formMetaData.fields.until.visible = false;
      formMetaData.fields.reason.visible = false;
      formMetaData.fields.futureRegularization.required = false;
      formMetaData.fields.from.required = false;
      formMetaData.fields.until.required = false;
      formMetaData.fields.reason.required = false;
    }
    if (
      formMethods.getValues("date") == "" ||
      formMethods.getValues("date") == undefined ||
      formMethods.getValues("date") == null ||
      formMethods.getValues("duration") == "" ||
      formMethods.getValues("duration") == undefined ||
      formMethods.getValues("duration") == null
    ) {
      formMetaData.fields.date.visible = false;
      formMetaData.fields.duration.visible = false;
      formMetaData.fields.date.required = false;
      formMetaData.fields.duration.required = false;
    }

    // else{
    //   if((formMethods.getValues('futureRegularization')!==''||formMethods.getValues('from')!==''||formMethods.getValues('until')!==''||formMethods.getValues('until')!==''||
    //   formMethods.getValues('reason')!==''
    //   // ||formMethods.getValues('date')!=undefined||formMethods.getValues('duration')!=''
    //   ))
    // formMetaData.fields.futureRegularization.visible=true;
    // formMetaData.fields.from.visible=true;
    // formMetaData.fields.until.visible=true;
    // formMetaData.fields.reason.visible=true;
    // formMetaData.fields.futureRegularization.required=true;
    // formMetaData.fields.from.required=true;
    // formMetaData.fields.until.required=true;
    // formMetaData.fields.reason.required=true;
    // }
  }
  //
  //Hidden the Date and Duration Field
  if (!window.parent.location.href.includes("yes")) {
    formMetaData.fields.date.visible = false;
    formMetaData.fields.duration.visible = false;
    formMetaData.fields.date.required = false;
    formMetaData.fields.duration.required = false;
    // formMetaData.fields.employeeName.editable = false;
    // formMetaData.fields.manager.editable = false;
  }

  function formatDate(jsonDate) {
    if (!jsonDate) return "";
    const date = new Date(jsonDate);

    const getYear = date.toLocaleDateString("default", { year: "numeric" });
    const getMonth = date.toLocaleDateString("default", { month: "2-digit" });
    const getDay = date.toLocaleDateString("default", { day: "2-digit" });
    const formattedDate = getYear + "-" + getMonth + "-" + getDay;
    return formattedDate;
  }
  let from = formMethods.getValues("from");
  let until = formMethods.getValues("until");

  formMethods.setValue("from", formatDate(from));

  formMethods.setValue("until", formatDate(until));

  //Lokesh......................///

  function ReportformatDate(dateStr) {
    if (!dateStr) {
      return "";
    }

    // Check if the input string is in 'DD-MM-YYYY' format
    const parts = dateStr.split("-");
    if (parts.length !== 3) {
      return "Invalid Date";
    }

    const [day, month, year] = parts.map(Number);

    // Create a new Date object day month-1 year
    const date = new Date(Date.UTC(year, month - 1, day));

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    // Format the date as 'YYYY-MM-DD'
    const formattedDate = date.toISOString().split("T")[0];

    return formattedDate;
  }

  let ReportRegularization = runtimeParams.objectData;

  // console.log(ReportRegularization)
  // console.log(ReportRegularization, "ferariiiiii");

  if (ReportRegularization != null) {
    const editButton = document.querySelector(".edit");
    // editButton.style.display = "none";
    useEffect(() => {
      getServiceData("manager", ReportRegularization.emp_user_id)
        .then((response) => {
          const managerId = response.data;
          formMethods.setValue("manager", managerId);
        })
        .catch((err) => {
          console.log(err);
        });
      const editButton = document.querySelector(".edit");
      if (editButton != null || editButton != undefined) {
        console.log(ReportRegularization, "checkEdit");
        if (ReportRegularization != null) {
          editButton.style.display = "";
        } else {
          editButton.style.display = "";
        }
      }
    }, [editButton]);
    console.log(ReportRegularization, editButton, "ferariiiiiicheckEdit");
    console.log(ReportRegularization.punch_date, "ferariiiiiicheckEditdate");

    formMetaData.fields.manager.visible = false;
    formMethods.setValue("employeeName", ReportRegularization.emp_user_id);
    formMethods.setValue(
      "from",
      ReportformatDate(ReportRegularization.punch_date)
    );
    formMethods.setValue(
      "until",
      ReportformatDate(ReportRegularization.punch_date)
    );
    formMethods.setValue(
      "date",
      ReportformatDate(ReportRegularization.punch_date)
    );
    formMetaData.fields.employeeName.visible = false;
    formMetaData.fields.from.visible = false;
    formMetaData.fields.until.visible = false;
    formMetaData.fields.date.visible = true;
    formMetaData.fields.date.editable = false;
    formMetaData.fields.until.editable = false;
    formMetaData.fields.futureRegularization.visible = false;
    formMetaData.fields.manager.required = false;
    formMetaData.fields.manager.visible = true;
    formMetaData.fields.manager.editable = false;
  }

  return form;
};

export default JSHook;
