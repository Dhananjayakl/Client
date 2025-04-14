import { useState, useEffect } from "react";
import { getviewData, getObjectData, getServiceData } from "../LeaveService";

import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
let JSHook = (
  form,
  formMethods,
  fields,
  formMetaData,
  formValues,
  setLeave,
  setGender,
  setuserId,
  setAlertMessage,
  setIsAlertShown,
  setWorkday,
  setDaysFlag,
  setDaysAlert,
  runtimeParams
) => {
  formMetaData.fields.manager.required = true;
  formMetaData.fields.reasonDetails.required = false;

  const userData = JSON.parse(localStorage.current_logged_User);
  const renderCharts = userData.some((user) =>
    user.user_details.data[0].role_names.includes("HR_Admin")
  );
  let LuserId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  const [formDate, setformDate] = useState("");
  const [untilDate, setuntilDate] = useState("");
  const [type, setType] = useState("");
  const [HruserId, setHruserId] = useState("");
  const [userId, setuser] = useState("");
  const [workday, setWork] = useState("");
  const [gender, setGen] = useState("");

  const [leaveData, setLeaveData] = useState([]);

  const [responseData, setresponseData] = useState("");
  const [halfDay, sethalfDay] = useState("");
  const [sechalfDay, setsechalfDay] = useState("");
  const [halfDayUntil, sethalfDayUntil] = useState("");
  const [sechalfDayUntil, setsechalfDayUntil] = useState("");

  const [lfhalfval, setLFhalval] = useState(0);
  const [luhalfval, setLUhalval] = useState(0);
  const [suffix, setSuffix] = useState(false);
  const [emptype, setEmptype] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);

  form.leaveFrom.onChange(function (value) {
    formMethods.setValue("leaveFrom", util.dateFormat(value));
    setformDate(util.dateFormat(value));
  });
  if (formDate && formMethods.watch("leaveFrom") == "") {
    formMethods.setValue("leaveUntil", "");
    setformDate("");
  }
  form.userId.onChange(function (value) {
    setHruserId(value);
  });

  form.leaveUntil.onChange(function (value) {
    formMethods.setValue("leaveUntil", util.dateFormat(value));
    setuntilDate(util.dateFormat(value));
  });

  useEffect(() => {
    if (untilDate && formMethods.watch("leaveUntil") == "") {
      setformDate("");
      formMetaData.fields.leaveUntil.editable = false;
      formMethods.setValue("leaveUntil", "");
    }
    if (formValues.objectId === undefined) {
      if (renderCharts && !HruserId) {
        formMetaData.fields.userId.editable = true;
      } else if (HruserId) {
        formMethods.setValue("userId", HruserId);
      } else {
        formMetaData.fields.userId.visible = false;
        formMethods.setValue("userId", LuserId);
      }
    }
  }, [untilDate]);

  form.leaveType.onChange(function (value) {
    setType(value);
    if (value) {
      formMethods.setValue("leaveUntil", "");
      formMethods.setValue("leaveFrom", "");
      formMethods.setValue("noOfDays", 0);
      formMethods.setValue("reasonFor", "");
      formMethods.setValue("firsthalfdayFrom", false);
      formMethods.setValue("secondhalfdayFrom", false);
      formMethods.setValue("firsthalfdayUntil", false);
      formMethods.setValue("secondhalfdayUntil", false);
    }
  });

  if (formValues.objectId === undefined) {
    formMetaData.fields.manager.editable = false;
    formMetaData.fields.noOfDays.editable = false;
    formMetaData.fields.leaveUntil.editable = false;
    if (formDate) {
      formMetaData.fields.leaveUntil.editable = true;
    } else {
      formMetaData.fields.leaveUntil.editable = false;
    }
    useEffect(() => {
      let manager;
      if (HruserId) {
        manager = HruserId;
      } else {
        manager = LuserId;
      }
      getServiceData("manager", manager)
        .then((response) => {
          const managerId = response.data;

          formMethods.setValue("manager", managerId);
        })
        .catch((err) => {
          console.log(err);
          formMethods.setValue("manager", 0);
        });
    }, [LuserId, renderCharts, HruserId]);
  }

  const action = formMethods.watch("action");
  useEffect(() => {
    if (action === 3) {
      formMetaData.fields.comments.required = true;
    } else {
      formMetaData.fields.comments.required = false;
    }
  }, [formMetaData.fields.comments.required, action]);

  useEffect(() => {
    if (formMethods.watch("leaveUntil") < formMethods.watch("leaveFrom")) {
      formMethods.setValue("leaveUntil", "");
      formMethods.clearErrors("leaveUntil");
    } else if (
      formMethods.watch("leaveUntil") >= formMethods.watch("leaveFrom")
    ) {
      formMethods.clearErrors("leaveUntil");
    } else {
      formMethods.setError("leaveUntil", {
        type: "manual",
        message: "Valid Until must be after Valid From date",
      });
    }
  }, [formMethods.watch("leaveUntil"), formMethods.watch("leaveFrom")]);
  // ==========================================================================================

  let clearuntilDate = formMethods.getValues("leaveUntil");
  let clearfromDate = formMethods.getValues("leaveFrom");

  form.userId.onChange(function (value) {
    setHruserId(value);
  });

  form.leaveFrom.onChange(function (value) {
    setformDate(util.dateFormat(value));
  });

  form.leaveType.onChange(function (value) {
    setLeave(value);
    setIsAlertShown(false);
  });

  let filterExpression;
  let Year = new Date().getFullYear();

  useEffect(() => {
    getObjectData("getFiscalYear")
      .then((response) => {
        const responseData = response.data;

        if (responseData.data && responseData.data.length > 0) {
          setCurrentYear(responseData.data[0].year);
        } else {
          setCurrentYear(Year);
        }
      })
      .catch((error) => {
        setCurrentYear(Year);
        console.error("Error occured");
      });
  }, []);

  if (renderCharts && HruserId) {
    filterExpression = `USER_ID=${HruserId}`;
  } else {
    filterExpression = `user_id=:USER_ID and year=${currentYear}`;
  }

  const viewParams = {
    viewName: "pa_lm_leave_ledger_details_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: filterExpression,
  };
  const leaveConfig = {
    viewName: "pa_lm_leave_configuration_setup_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `year=${currentYear} and emp_type=${emptype}`,
  };
  form.firsthalfdayFrom.onChange(function (value) {
    sethalfDay(value);
    if (value) {
      setLFhalval(0.5);
    } else {
      setLFhalval(0);
    }
  });

  form.secondhalfdayFrom.onChange(function (value) {
    setsechalfDay(value);
    if (value) {
      setLFhalval(0.5);
    } else {
      setLFhalval(0);
    }
  });

  form.firsthalfdayUntil.onChange(function (value) {
    sethalfDayUntil(value);
    if (value) {
      setLUhalval(0.5);
    } else {
      setLUhalval(0);
    }
  });

  form.secondhalfdayUntil.onChange(function (value) {
    setsechalfDayUntil(value);
    if (value) {
      setLUhalval(0.5);
    } else {
      setLUhalval(0);
    }
  });

  formMetaData.fields.secondhalfdayFrom.editable = false;
  formMetaData.fields.firsthalfdayFrom.editable = false;
  formMetaData.fields.secondhalfdayUntil.editable = false;
  formMetaData.fields.firsthalfdayUntil.editable = false;
  if (formDate && clearfromDate != "") {
    if (halfDay == true) {
      formMetaData.fields.secondhalfdayFrom.editable = false;
    } else {
      formMetaData.fields.secondhalfdayFrom.editable = true;
    }
    if (sechalfDay == true) {
      formMetaData.fields.firsthalfdayFrom.editable = false;
    } else {
      formMetaData.fields.firsthalfdayFrom.editable = true;
    }
  } else {
    formMethods.setValue("secondhalfdayFrom", false);
    formMethods.setValue("firsthalfdayFrom", false);
  }

  if (untilDate && clearuntilDate != "") {
    if (halfDayUntil == true) {
      formMetaData.fields.secondhalfdayUntil.editable = false;
    } else {
      formMetaData.fields.secondhalfdayUntil.editable = true;
    }
    if (sechalfDayUntil == true) {
      formMetaData.fields.firsthalfdayUntil.editable = false;
    } else {
      formMetaData.fields.firsthalfdayUntil.editable = true;
    }
  } else {
    formMethods.setValue("secondhalfdayUntil", false);
    formMethods.setValue("firsthalfdayUntil", false);
  }
  useEffect(() => {
    getviewData(leaveConfig)
      .then((response) => {
        const leaveConfigData = response.data;

        if (leaveConfigData.data.length > 0) {
          setWorkday(leaveConfigData.data[0].work_day_code);
          setWork(leaveConfigData.data[0].work_day_code);
          setSuffix(leaveConfigData.data[0].suffix_leave);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // }

    getviewData(viewParams)
      .then((response) => {
        const responseData = response.data;
        if (responseData.data && responseData.data.length > 0) {
          const newLeaveData = responseData.data[0];
          if (JSON.stringify(newLeaveData) !== JSON.stringify(leaveData)) {
            setLeaveData(newLeaveData);
          }
          setGender(responseData.data[0]?.gender);
          setGen(responseData.data[0]?.gender);
          setuserId(responseData.data[0]?.user_id);
          setuser(responseData.data[0]?.user_id);
          setEmptype(responseData.data[0]?.emp_type);
        } else {
          setGender(0);
          setGen(0);
          setuserId(HruserId);
          setuser(HruserId);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [HruserId, leaveData]);

  if (formValues.objectId === undefined) {
    useEffect(() => {
      if (
        formDate &&
        clearuntilDate &&
        clearfromDate &&
        untilDate &&
        type &&
        userId &&
        gender > 0
      ) {
        getObjectData(
          "leaveCount",
          `getCount?fromDate=${formDate}&untilDate=${untilDate}&leaveType=${type}&gender=${gender}&userId=${userId}&workId=${workday}&suffix=${suffix}`
        )
          .then(({ data }) => {
            setresponseData(data);
            handleLeaveValidationCommon(
              data,
              type,
              casualleaves,
              sickleaves,
              earnedleaves,
              maternalLeaves,
              paternalLeaves,
              restrictedleaves
            );

            if (untilDate >= formDate && data > 0) {
              let leavecnt = data - lfhalfval;
              if (halfDayUntil || sechalfDayUntil) {
                leavecnt -= luhalfval;
              }
              formMethods.setValue("noOfDays", leavecnt);
            }
          })
          .catch(() => formMethods.setValue("noOfDays", 0));
      } else {
        setresponseData(0);
        formMethods.setValue("noOfDays", 0);
        setIsAlertShown(false);
      }
    }, [
      formDate,
      untilDate,
      type,
      gender,
      userId,
      halfDay,
      clearfromDate,
      clearuntilDate,
      sechalfDay,
      halfDayUntil,
      sechalfDayUntil,
    ]);
  }

  const sickleaves = leaveData?.available_sick_leaves || 0;
  const casualleaves = leaveData?.available_casual_leaves || 0;
  const earnedleaves = leaveData?.available_earned_leaves || 0;
  const restrictedleaves = leaveData?.ava_rest_holidays || 0;
  const noOf_days = leaveData?.no_of_days || 0;
  const medicalCert = leaveData?.medical_cert_req || false;
  const maternalLeaves =
    leaveData?.gender === 2 ? leaveData?.available_maternity_leaves || 0 : "";
  const paternalLeaves =
    leaveData?.gender === 1 ? leaveData?.available_paternity_leaves || 0 : "";

  useEffect(() => {
    formMetaData.fields.attachments.required =
      medicalCert && type == "4" && responseData >= noOf_days;
  }, [medicalCert, responseData, noOf_days, type]);

  const handleLeaveValidationCommon = (
    data,
    values,
    casualleaves,
    sickleaves,
    earnedleaves,
    maternalLeaves,
    paternalLeaves,
    restrictedleaves
  ) => {
    const leaveCheck = {
      1: casualleaves,
      2: earnedleaves,
      6: restrictedleaves,
      3: gender == 1 ? paternalLeaves : maternalLeaves,
    };

    if (leaveCheck[values] < data - lfhalfval - luhalfval) {
      const leaveTypeLabel = {
        1: "Casual Leaves",
        2: "Earned Leaves",
        3: gender == 1 ? "Paternity Leaves" : "Maternity Leaves",
        6: "Restricted Holidays",
      }[values];

      showAlert(
        `Your ${leaveTypeLabel} are not sufficient. Please contact HR Admin`
      );
    } else if (sickleaves < data && values === "4") {
      showAlert("Your Sick Leave is not sufficient. Please contact HR ADMIN.");
    } else {
      setIsAlertShown(false);
    }
  };

  const AlertMessage = (message) => {
    setDaysAlert(message);
    setDaysFlag(true);
  };

  useEffect(() => {
    if (
      !responseData > 0 &&
      formMethods.getValues("leaveFrom") !== "" &&
      formMethods.getValues("leaveUntil") !== ""
    ) {
      if (
        formMethods.getValues("noOfDays") === 0 &&
        formMethods.getValues("leaveFrom") !== "" &&
        formMethods.getValues("leaveUntil") !== ""
      ) {
        console.log(
          "You do not have sufficient leave.",
          formMethods.getValues("noOfDays")
        );
        AlertMessage(`You do not have sufficient leave.`);
      }
    } else {
      setDaysFlag(false);
    }
  }, [formMethods, AlertMessage, responseData]);

  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertShown(true);
  };

  form.leaveUntil.onChange(function (value) {
    formMethods.setValue("leaveUntil", util.dateFormat(value));
    setuntilDate(util.dateFormat(value));
  });

  // This is Attendance Regularization Code ,No need to Change it.
  let LeaveReport = runtimeParams.objectData;
  if (LeaveReport != null) {
    function ReportformatDate(dateStr) {
      if (!dateStr) {
        return "";
      }

      const parts = dateStr.split("-");
      if (parts.length !== 3) {
        return "Invalid Date";
      }

      const [day, month, year] = parts.map(Number);

      const date = new Date(Date.UTC(year, month - 1, day));

      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      const formattedDate = date.toISOString().split("T")[0];

      return formattedDate;
    }

    const editButton = document.querySelector(".edit");

    if (editButton != null || editButton != undefined) {
      if (LeaveReport != null) {
        editButton.style.display = "none";
      } else {
        editButton.style.display = "";
      }
    }

    useEffect(() => {
      if (runtimeParams.objectData) {
        getServiceData("manager", LeaveReport.emp_user_id)
          .then((response) => {
            const managerId = response.data;
            formMethods.setValue("manager", managerId);
          })
          .catch((err) => {
            console.log(err);
          });

        const formattedPunchDate = ReportformatDate(LeaveReport.punch_date);

        if (formMethods.getValues("leaveUntil") !== formattedPunchDate) {
          console.log("Updating leaveUntil");
          formMethods.setValue("leaveUntil", formattedPunchDate);
        }

        if (formMethods.getValues("leaveFrom") !== formattedPunchDate) {
          console.log("Updating leaveFrom");
          formMethods.setValue("leaveFrom", formattedPunchDate);
        }

        formMethods.setValue("noOfDays", 1);
      }
    });

    formMetaData.fields.manager.visible = false;
    formMethods.setValue("userId", LeaveReport.emp_user_id);

    formMetaData.fields.userId.visible = false;
    formMetaData.fields.leaveFrom.visible = true;
    formMetaData.fields.leaveUntil.visible = false;
    formMetaData.fields.leaveUntil.editable = false;
    formMetaData.fields.manager.required = false;
    formMetaData.fields.leaveFrom.editable = false;
    formMethods.setValue("noOfDays", 1);
    formMetaData.fields.noOfDays.visible = false;
    formMetaData.fields.reasonDetails.visible = false;

    formMetaData.fields.firsthalfdayFrom.visible = false;
    formMetaData.fields.manager.visible = true;
  }

  return form;
};

export default JSHook;
