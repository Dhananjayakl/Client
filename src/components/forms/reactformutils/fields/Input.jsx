import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import FieldDom from "./FieldDom";
import { useTranslation } from "react-i18next";

function Input(props) {
  const {
    fieldDef,
    control,
    label,
    name,
    options,
    helptext,
    tooltip,
    required,
    visible,
    formMethods,
    isMulti,
    rules,
    editable,
    field_title,
    fieldValue,
    textColor,
    designerLabel,
    fieldProps,
    ...rest
  } = props;

  let inputMessage = false;
  console.log(formMethods, "methodlogy");
  const { t } = useTranslation("common");
  console.log(props.textColor, name, "input props");
  const [showMessage, setShowMessage] = useState(false);
  const pagepath = window.parent.location.pathname;
  const parentPath = window.parent.location.href.includes("project");
  const [inputvalue, setinputvalue] = useState();
  const [lengthflag, setLengthFlag] = useState(false);
  const [adjustedStringlength, setAdjustedStringLength] = useState(0);
  let fieldsize;
  // const field_name = name;
  // const lastDotIndex = field_name.lastIndexOf(".");
  // const extractedFieldName =
  //   lastDotIndex !== -1 ? field_name.slice(lastDotIndex + 1) : field_name;
  // console.log(extractedFieldName, "extracted field name");
  if (fieldDef) {
    // fieldsize=5;
    fieldsize = fieldDef.field_size;
  }
  if (!fieldsize) {
    fieldsize = 255;
  }
  if (inputvalue && inputvalue?.length > 0 && inputvalue.length > fieldsize) {
    // console.log("limit exceeded error message");
    inputMessage = true;

    // Set a timeout to change inputMessage to false after 3 seconds
    setTimeout(() => {
      inputMessage = false;
      console.log("Input message reset to false");
    }, 3000); // 3000 milliseconds = 3 seconds
  }

  console.log(name, textColor, "fielder");
  const [showMore, setShowMore] = useState(false);
  const [textInput, settextInput] = useState("");

  const handleToggle = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };

  const truncateText = (text, length) => {
    if (typeof text !== "string") return "";
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  const displayedText = showMore ? textInput : truncateText(textInput, 100);
  console.log(inputvalue?.length, fieldsize, "guess");
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
      control={formMethods?.control ? formMethods.control : control}
      rules={{
        required: {
          value: required && editable,
          message: `${t(field_title)} ${t("is required")}!`,
        },
      }}
      render={({ field, fieldState, formState }) => {
        setinputvalue(field.value);
        let message;
        if (fieldState) {
          message = fieldState.error;
        }
        settextInput(field.value);

        return (
          <FieldDom
            {...props}
            {...fieldState}
            {...field}
            fieldProps={fieldProps}
          >
            {editable && !designerLabel && (
              <Form.Control
                size="sm"
                className={
                  editable && required
                    ? "mandatory form-control form-control-lg"
                    : "form-control form-control-lg"
                }
                isInvalid={message && !field.value ? true : false}
                maxLength={fieldsize}
                {...field}
                {...rest}
                onChange={(e) => {
                  const rawData = e.target.value.substring(0, fieldsize); // Limit initial raw input to `fieldsize`
                  const newlineCount = (rawData.match(/\n/g) || []).length; // Count newlines in the input
                  const adjustedLength = rawData.length + newlineCount; // Adjust the length to account for newlines
                  const trimmedValue = e.target.value.trim();
                  if (adjustedLength) {
                    setAdjustedStringLength(adjustedLength);
                  }
                  let differenceLength = 0;
                  if (adjustedLength > fieldsize) {
                    differenceLength = adjustedLength - fieldsize; // Calculate how much to trim
                  }
                  if (trimmedValue === "" && e.target.value.length > 0) {
                    return;
                  }
                  const finalTrimmedText = e.target.value.substring(
                    0,
                    fieldsize - differenceLength
                  );

                  setinputvalue(finalTrimmedText);
                  const trimmedText = e.target.value.substring(0, fieldsize);
                  field.onChange(finalTrimmedText);

                  props.form?.change.forEach((element) => {
                    element(finalTrimmedText, e.target.name.split(".")[1]);
                  });
                }}
              />
            )}
            {!editable && (
              <div
                style={{ color: textColor ? textColor : "rgb(108, 117, 125)" }}
                className={textColor == true ? "text-dark" : ""}
                id={`${props.name}value`}
              >
                {field.value ? (
                  <>
                    {displayedText}
                    {textInput && textInput.length > 100 && (
                      <a onClick={handleToggle} className="ms-2" size="lg">
                        {showMore ? "less" : "more"}
                      </a>
                    )}
                  </>
                ) : (
                  "--"
                )}
              </div>
            )}
            {designerLabel && <div className="h-0"> {field.value}</div>}

            {editable && lengthflag && (
              <div className="text-danger ps-3">
                Maximum Character Length Exceeded
              </div>
            )}
          </FieldDom>
        );
      }}
    />
  );
}

export default Input;
