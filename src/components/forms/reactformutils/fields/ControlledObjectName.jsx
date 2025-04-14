import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Alert, Form } from "react-bootstrap";
import FieldDom from "./FieldDom";
import { getviewData } from "src/modules/admin/AdminService";
// import { getviewData } from "../../../../modules/leave/LeaveService";
import { useLocation } from "react-router-dom";
import axios from "src/utils/AxiosInstance";
import { useTranslation } from "react-i18next";

function ControlledObjectName(props) {
  console.log("ControlledObjectNameprops", props);
  const {
    fieldDef,
    label,
    control,
    name,
    options,
    helptext,
    tooltip,
    required,
    visible,
    formMethods,
    formMetaData,
    isMulti,
    value,
    rules,
    editable,
    field_title,
    fields,
    setValue,
    nonEngine,
    others,
    textColor,
    runtimeParams,
    ...rest
  } = props;
  console.log("gggggggggggg", others);
  const { t } = useTranslation("common");
  let inputMessage = false;
  let form_id = fieldDef?.form_id || -1;
  let columnName = fieldDef?.db_colum_name || name;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const objectId = searchParams.get("objectId") || searchParams.get("id") || -1;
  const [inputvalue, setinputvalue] = useState("");
  const [valuestate, setValueState] = useState("");
  const [alertResponse, setAlertResponse] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [lengthflag, setLengthFlag] = useState(false);
  const [onChangeFlag, setOnchangeFlag] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  let fieldsize;
  fieldsize = 200;
  if (inputvalue && inputvalue?.length > 0 && inputvalue.length > fieldsize) {
    // console.log("limit exceeded error message");
    inputMessage = true;

    // Set a timeout to change inputMessage to false after 3 seconds
    setTimeout(() => {
      inputMessage = false;
      console.log("Input message reset to false");
    }, 3000); // 3000 milliseconds = 3 seconds
  }
  useEffect(() => {
    if (inputvalue?.length > fieldsize) {
      // console.log("logger for length");
      setLengthFlag(true);
      setTimeout(() => {
        // console.log("Input message reset to ducati");
        setLengthFlag(false);
      }, 2000);
    }
  }, [inputvalue]);
  console.log(columnName, "column--name");

  const uniqueValidation = async () => {
    try {
      let TrimmedInputValue = inputvalue.trim();
      const response = await axios.post(
        `util/uniqueValidation?objectId=${objectId}&formId=${form_id}&columnName=${columnName}&value=${TrimmedInputValue}&nonEngine=${
          nonEngine || ""
        }`
      );

      console.log(response.data, "reponse--data");
      setResponseMessage(response.data);
      setAlertResponse(response.data);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (value) {
          const viewParams = {
            viewName: "pa_modules_bv",
            pageNumber: 1,
            pageSize: 3,
            sortField: "",
            sortOrder: "",
            orderExpression: "",
            filterExpression: `(id=${value})`,
          };
          const response = await getviewData(viewParams);
          const responseData = response.data.data;
          if (responseData && responseData.length > 0) {
            setValueState(responseData[0].acronym_db + "_");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [value, valuestate]);

  console.log(formMetaData, "porsche");
  useEffect(() => {
    if (formMetaData?.dataSourceResponse?.length == 0) {
      if (formMethods) {
        formMethods?.setValue(name, "");
      }
    }
    if (objectId === -1 && !formMethods) {
      setValue(name, "");
    }
  }, [valuestate]);

  useEffect(() => {
    if (inputvalue) {
      uniqueValidation();
    }
  }, [inputvalue]);

  useEffect(() => {
    if (inputvalue?.length > fieldsize) {
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  }, [inputvalue]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required && editable,
          message: `${t(field_title)} ${t("is required!")}`,
        },
        validate: {
          isValidCheck: (value) => {
            console.log(responseMessage, "repose");
            if (responseMessage && onChangeFlag) {
              // If responseMessage is set, validation fails
              console.log(false, "response--flag");
              return responseMessage; // Use the state as the validation message
            } else {
              console.log(true, "response--flag");
              return true; // Input is valid
            }
          },
        },
      }}
      render={({ field, fieldState, formState }) => {
        console.log(fieldState.error, "field-state");

        setinputvalue(field.value);
        if (!field.value && valuestate && valuestate !== "._") {
          field.onChange(valuestate);
        }

        return (
          <FieldDom
            {...props}
            {...fieldState}
            responseMessage={responseMessage}
          >
            <div style={{ display: "flex" }}>
              {/* Non-editable part */}
              {!editable && (
                <div
                  style={{
                    color: textColor ? textColor : "rgb(108, 117, 125)",
                    whiteSpace: "normal", // Allows text to wrap onto new lines
                    wordBreak: "break-word", // Breaks long words to prevent overflow
                    overflowWrap: "break-word",
                  }}
                  className={textColor == true ? "text-dark" : ""}
                  id={`${props.name}value`}
                >
                  {field.value ? field.value : "--"}
                </div>
              )}
              {/* Editable part */}
              {editable && (
                <Form.Control
                  size="lg"
                  className={`${
                    inputMessage == true
                      ? "textarea-error"
                      : editable && required && !field.value
                      ? "mandatory"
                      : ""
                  }`}
                  value={field.value}
                  isInvalid={Boolean(
                    (fieldState.isTouched || formState.submitCount > 0) &&
                      fieldState.error
                  )}
                  {...field}
                  {...rest}
                  onKeyDown={(e) => {
                    const cursorPosition = e.target.selectionStart;
                    const valueStateLength = valuestate.length;
                    if (!others) {
                      if (
                        e.keyCode === 8 &&
                        cursorPosition <= valueStateLength
                      ) {
                        e.preventDefault();
                      }
                    }
                  }}
                  onChange={(e) => {
                    setOnchangeFlag(true);
                    const trimmedValue = e.target.value.trim();
                    if (
                      (trimmedValue.length === 1 &&
                        /[^a-zA-Z0-9]/.test(trimmedValue)) ||
                      (trimmedValue === "" && e.target.value.length > 0)
                    ) {
                      return;
                    }
                    setinputvalue(e.target.value);
                    const casevalue = others
                      ? e.target.value
                      : e.target.value.toUpperCase();
                    const trimmedText = casevalue.substring(0, fieldsize);
                    setinputvalue(casevalue);
                    field.onChange(trimmedText);
                    if (responseMessage) {
                      formMethods?.setError(name, {
                        type: "validate",
                        message: responseMessage,
                      });
                    }

                    props.form?.change.forEach((element) => {
                      console.log(element.taget, "element--is--here");

                      element(trimmedText, element.target.name.split(".")[1]);
                    });
                  }}
                />
              )}
            </div>

            {editable && lengthflag && (
              <span className="text-danger ps-3 mt-1 pt-1">
                Maximum Character Length Reached.
              </span>
            )}
            {field.value && responseMessage && onChangeFlag && (
              <Alert variant="danger" className=" mt-2">
                <div
                  className="text-danger ps-3"
                  style={{ wordBreak: "break-word" }}
                >
                  {responseMessage}
                </div>
              </Alert>
            )}
            {fieldState.error &&
              !field.value &&
              fieldState.error.message &&
              editable && (
                <div className="validation">{fieldState.error.message}</div>
              )}
          </FieldDom>
        );
      }}
    />
  );
}

export default ControlledObjectName;
