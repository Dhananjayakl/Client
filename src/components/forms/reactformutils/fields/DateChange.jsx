import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import FieldDom from "./FieldDom";
// import { createObject, getObjectData, updateObjectData, getviewData } from '../../../modules/leave/LeaveService';
import { getviewData } from "src/modules/admin/AdminService";
// import { getObjectData, getviewData } from "src/modules/leave/LeaveService";
import "../../../../../src/assets/scss/datepicker-wrapper.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
const service = "setupholiday";

function DateChange(props) {
  const {
    name,
    label,
    control,
    options,
    helptext,
    tooltip,
    required,
    visible,
    formMethods,
    disableDates,
    leaveType,
    gender,
    selectedDate,
    setClear,
    userId,
    workday,
    field_title,
    editable,
    fieldProps,
    isMulti,
    ...rest
  } = props;

  let customDates = [];
  let HigltedDates = [];

  const [startDate, setStartDate] = useState(null);
  const [valid, setValid] = useState(true);

  const pagePath = window.parent.location.pathname;
  const { t } = useTranslation("common");
  const current_year = new Date().getFullYear();
  const filterExpr = `USER_ID=${userId}`;
  const viewParams = {
    viewName: "pa_lm_generate_leaves_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: filterExpr,
  };
  const service = {
    viewName: "pa_lm_holiday_setup_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: "",
  };

  useEffect(() => {
    getviewData(service)
      .then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          customDates.push(new Date(response.data.data[i].holiday_date));
          HigltedDates.push({
            id: new Date(response.data.data[i].holiday_date),
            name: response.data.data[i].occasion,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [customDates, HigltedDates]);

  useEffect(() => {
    // const log_user_id = JSON.parse(localStorage.current_logged_User)[0].user_details.data[0].user_id;
    if (userId !== "") {
      getviewData(viewParams)
        .then((leavedata) => {
          for (let i = 0; i < leavedata.data.data.length; i++) {
            if (leavedata.data.data[i].user_id === userId) {
              customDates.push(new Date(leavedata.data.data[i].generated_date));
              HigltedDates.push({
                id: new Date(leavedata.data.data[i].generated_date),
                name: leavedata.data.data[i].reason_details,
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [viewParams, customDates, HigltedDates]);

  const isWeekday = (date) => {
    const day = date.getDay();
    const dayOfMonth = date.getDate();

    if (leaveType === "3" && gender === 2) {
      return true;
    } else if (workday === 1) {
      return day != 0;
    } else if (workday === 2) {
      if (dayOfMonth <= 7 || (dayOfMonth > 14 && dayOfMonth <= 21)) {
        return day !== 0;
      } else if (day === 6 && dayOfMonth > 28) {
        return day !== 0;
      } else {
        return day !== 0 && day !== 6;
      }
    } else if (workday === 3) {
      if (dayOfMonth <= 7) {
        return day !== 0;
      } else if (dayOfMonth > 14 && dayOfMonth <= 21) {
        return day !== 0;
      } else if (day === 6 && dayOfMonth >= 22) {
        return day !== 0;
      } else {
        return day !== 0 && day !== 6;
      }
    } else {
      return day !== 0 && day !== 6;
    }
  };

  const formatDay = (jsonDate) => {
    const date = new Date(jsonDate);
    const getDay = date.toLocaleDateString("default", { day: "2-digit" });
    return getDay;
  };

  function formatDate(jsonDate) {
    // alert(jsonDate);
    if (jsonDate === undefined || jsonDate === "") return "";

    const date = new Date(jsonDate);

    const getYear = date.toLocaleDateString("default", { year: "numeric" });
    const getMonth = date.toLocaleDateString("default", { month: "2-digit" });
    const getDay = date.toLocaleDateString("default", { day: "2-digit" });

    const formattedDate = getYear + "-" + getMonth + "-" + getDay;

    return formattedDate;
  }

  const renderDayContents = (day, date) => {
    const shouldShowTooltip = HigltedDates.some(
      (specificDate) => specificDate.id.toDateString() === date.toDateString()
    );

    const tooltipText = HigltedDates.find(
      (specificDate) => specificDate.id.toDateString() === date.toDateString()
    )?.name;

    return (
      <span
        title={shouldShowTooltip ? tooltipText : ""}
        className={shouldShowTooltip ? "tooltip-content" : ""}
      >
        {formatDay(date)}
      </span>
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required && editable,
          message: `${t(field_title)} ${t("is required")}!`,
        },
      }}
      render={({ field, fieldState, formState }) => {
        let message;
        if (fieldState) {
          message = fieldState.error;
        }
        field.value = formatDate(field.value);

        return (
          <FieldDom {...props} {...fieldState} fieldProps={fieldProps}>
            {editable && (
              <DatePicker
                // showIcon
                selected={field.value ? selectedDate : undefined}
                className={required && "mandatory form-control"}
                // // selected={field.value}
                // onChange={(date) => {
                //   field.onChange(date);
                // }}
                isInvalid={message && field.value == "" ? true : false}
                onChange={(e) => {
                  field.onChange("");
                  props.form?.change.forEach((element) => {
                    element(e);
                  });
                }}
                value={formatDate(field.value)}
                wrapperClassName="custom-datepicker-wrapper"
                excludeDates={
                  gender === 2 && leaveType === "3" ? "" : customDates
                }
                filterDate={isWeekday}
                showYearDropdown
                showMonthDropdown
                minDate={new Date(disableDates)}
                renderDayContents={renderDayContents}
                placeholderText="dd-mm-yyyy"
                isClearable={setClear}
                calendarStartDay={1}
                {...rest}
                // {...field}
              />
            )}
            {!editable && <div>{field.value ? field.value : "--"}</div>}
            {setClear && field.value !== "" && editable && (
              <FontAwesomeIcon
                icon={faTimesCircle}
                onClick={() => {
                  setStartDate(null);
                  field.onChange("");
                }}
                style={{ cursor: "pointer", color: "blue" }}
              />
            )}

            {field.value == "" &&
              fieldState.error &&
              fieldState.error.message && (
                <div className="validation">{fieldState.error.message}</div>
              )}
          </FieldDom>
        );
      }}
    />
  );
}

export default DateChange;
