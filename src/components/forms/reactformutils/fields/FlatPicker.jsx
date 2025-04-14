import { Controller } from "react-hook-form";
import FieldDom from "./FieldDom";
import { useTranslation } from "react-i18next";
import useTheme from "src/hooks/useTheme";
import Flatpickr from "react-flatpickr";
import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { toPixelData } from "html-to-image";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import { useSelector } from "react-redux";
function FlatPicker(props) {
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
    randomDate,
    futureDate,
    dateOfBirth,
    gender,
    selectedDate,
    setClear,
    userId,
    form,
    editable,
    field_title,
    ConditionalDate,
    minDate,
    fieldDef,
    futureDateValue,
    isMulti,
    textColor,
    fieldProps,
    enableFieldData,
    systemConfig,
    ...rest
  } = props;
  const { t } = useTranslation("common");
  //console.log("flatpicker properties", systemConfig,fieldDef);
  const { theme, setTheme } = useTheme();
  const [date, setDate] = useState(null);
  let [fieldValue, setFieldValue] = useState(null);
  const [controlFlag, setControlFlag] = useState(false);
  var todaydate = new Date();
  todaydate.setDate(todaydate.getDate() - 1);
  const fp = useRef(null);
  const fieldType = fieldDef?.field_type ? fieldDef.field_type : "3";

  //console.log(enableFieldData, "enable field data");

  function formatDates(jsonDate) {
    if (jsonDate === undefined || jsonDate === "") return "";
    const date = new Date(jsonDate);
    //console.log(jsonDate, "jsonDate");

    const getYear = date.toLocaleDateString("default", {
      year: "numeric",
    });
    const getMonth = date.toLocaleDateString("default", {
      month: "2-digit",
    });
    const getDay = date.toLocaleDateString("default", {
      day: "2-digit",
    });

    const getHours = date.toLocaleTimeString("default", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    // Check if time is not "00:00:00"
    const isTimePresent = getHours !== "00:00:00";
    const formattedDate = isTimePresent
      ? `${getYear}-${getMonth}-${getDay} ${getHours}`
      : `${getYear}-${getMonth}-${getDay}`;

    //console.log("formatted Date Value", formattedDate);
    return formattedDate;
  }
  const { d_date_format, d_data_time_format } = useSelector(
    (state) => state.systemConfig.systemConfig
  );
  function changeformat(inputDate) {
    //console.log(systemConfig.d_date_format, "antony das");
    if (inputDate) {
      let result = util.formatDate(inputDate, d_date_format);
      // console.log(result, "wolverine");

      // console.log("inputDate", inputDate);
      return result;
    }
  }
  // console.log(systemConfig.d_date_format, "rolex");
  // console.log(fieldDef, "flat picker componen props");

  let formattedFormat =
    fieldDef?.field_type == "4"
      ? d_data_time_format
      : d_date_format
          .replace(/ss/g, "S")
          .replace(/HH/g, "H")
          .replace(/yyyy|YYYY/g, "Y")
          .replace(/mm/g, "i")
          .replace(/MM/g, "m")
          .replace(/MMM/g, "M")
          .replace(/MMMM/g, "F")
          .replace(/dd/g, "d")
          .replace(/E/g, "D")
          .replace(/EEEE/g, "L")
          .replace(/a/g, "K");

  // console.log(formattedFormat, systemConfig, "formatted format leo");
  const loadTheme = (themeName) => {
    const themeId = "flatpickr-theme";
    let themeLink = document.getElementById(themeId);

    if (!themeLink) {
      themeLink = document.createElement("link");
      themeLink.rel = "stylesheet";
      themeLink.id = themeId;
      document.head.appendChild(themeLink);
    }

    themeLink.href = `https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/${themeName}.css`;
  };

  // Load the theme when the component mounts or theme changes
  useEffect(() => {
    console.log(theme, "themer");

    if (theme == "dark") {
      loadTheme("dark");
    } else {
      loadTheme("light");
    }
  }, [theme]);
  console.log(fieldType, "field type");

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
        //  console.log(field.value, name, "filed_value");
        let message;
        if (fieldState) {
          message = fieldState.error;
        }
        // console.log(message, "ferrari");
        setFieldValue(field.value);

        return (
          <FieldDom
            {...props}
            {...fieldState}
            {...field}
            fieldProps={fieldProps}
          >
            {editable && (
              <>
                <div className="d-flex ">
                  <Flatpickr
                    // style={{
                    //   // width: "100px",
                    //   height: "2px",
                    //   // fontSize: "16px", // Optional
                    //   padding: "0px",
                    //   margin: "0px",
                    // }}
                    value={
                      d_date_format == "yyyy-MM-dd"
                        ? field.value
                        : changeformat(field.value)
                    }
                    {...rest}
                    options={{
                      // altInput:true,
                      // allowInput:true,
                      allowInvalidPreload:
                        enableFieldData == true ? true : false,
                      // defaultDate:"10-07-2024",
                      maxDate: props.ConditionalDate,
                      disable: [
                        minDate && {
                          from: minDate - 1,
                          to: "01-01-3000",
                        },
                        props.futureDate == true && {
                          from: "01-01-1900",
                          to: futureDateValue
                            ? new Date(
                                new Date(futureDateValue).setDate(
                                  new Date(futureDateValue).getDate() - 1
                                )
                              )
                            : todaydate,
                        },
                      ],
                      enableTime: fieldType === "4",
                      dateFormat: formattedFormat,
                    }}
                    placeholder={systemConfig.d_date_format}
                    onChange={(e) => {
                      const dateString = Array.isArray(e) ? e[0] : e;
                      field.onChange(
                        formatDates(dateString),
                        name.split(".")[1]
                      );
                      props.form?.change.forEach((element) => {
                        element(formatDates(e), props.name.split(".")[1]);
                      });
                    }}
                    className={
                      editable && required
                        ? message && !field.value
                          ? "mandatory form-control form-control-lg border-danger"
                          : "mandatory form-control form-control-lg"
                        : "form-control form-control-lg"
                    }
                    ref={fp}
                  />
                  {/* <Button
                    variant="light"
                    onClick={() => {
                      // console.log("ConditionalDate", props.ConditionalDate);

                      if (!fp?.current?.flatpickr) return;
                      fp.current.flatpickr.open();
                    }}
                  >
                    <FontAwesomeIcon icon={faCalendar} size="lg" />
                  </Button> */}
                  <Button
                    type="button"
                    variant="light"
                    //className="p-0"
                    className="border border-dark"
                    onClick={() => {
                      if (!fp?.current?.flatpickr) return;
                      fp.current.flatpickr.clear();
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                  </Button>
                </div>
                {/* <div className="d-flex float-end ">
                  <Button
                    type="button"
                    variant="light"
                    className="p-0"
                    onClick={() => {
                      if (!fp?.current?.flatpickr) return;
                      fp.current.flatpickr.clear();
                    }}
                  >
                    Clear
                  </Button>
                </div> */}
              </>
            )}{" "}
            {/* {!editable && (
              <div
                style={{ color: "rgb(108, 117, 125)" }}
                className={textColor ? "text-dark" : ""}
              >
                {field.value ? changeformat(field.value) : "--"}
              </div>
            )} */}
            {!editable && (
              <div
                style={{ color: textColor ? textColor : "rgb(108, 117, 125)" }}
                className={textColor == true ? "text-dark" : ""}
              >
                {field.value ? (
                  <>
                    {systemConfig.d_date_format == "YYYY-MM-DD"
                      ? field.value
                      : changeformat(field.value)}
                  </>
                ) : (
                  "--"
                )}
              </div>
            )}
            <div>
              {message && !field.value && required && (
                <div className="validation">{fieldState.error.message}</div>
              )}
            </div>
          </FieldDom>
        );
      }}
    />
  );
}

export default FlatPicker;
