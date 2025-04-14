import React, { useState } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import FieldDom from "./FieldDom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function Input(props) {
  const {
    fieldDef,
    label,
    setValue,
    control,
    name,
    options,
    helptext,
    tooltip,
    required,
    visible,
    formMethods,
    form,
    editable,
    field_title,
    textColor,
    isMulti,
    ...rest
  } = props;
  const { t } = useTranslation("common");
  const exceptThisSymbols = ["e", "E", "+", "-"];
  let fieldValue = useWatch({ name: name, control: control });
  const [inputvalue, setinputvalue] = useState();
  const [lengthflag, setLengthFlag] = useState(false);
  let fieldsize;

  if (fieldDef) {
    fieldsize = fieldDef.field_size;

    if (!fieldsize) {
      fieldsize = 10;
    }
  }
  useEffect(() => {
    var inputTypeNumbers = document.querySelectorAll("input[type=number]");
    for (var a = 0; a < inputTypeNumbers.length; a++) {
      inputTypeNumbers[a].onwheel = function (event) {
        event.target.blur();
      };
    }
  }, []);

  function handleMoneyChange(e) {
    const value = e.target.value;
    const currentDecimalPlaces = value.split(".")[1]?.length || 0;

    // if (currentDecimalPlaces > 1) {
    //   e.preventDefault();
    // }
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
  const pagepath = window.parent.location.pathname;
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
        setinputvalue(field.value);

        return (
          <FieldDom {...props} {...fieldState}>
            {editable && (
              <Form.Control
                type="number"
                size="lg"
                 min="0"
                // max="180"
                step="any"
                className={editable && required && "mandatory"}
                onKeyDown={(e) =>
                  (exceptThisSymbols.includes(e.key) && e.preventDefault()) ||
                  handleMoneyChange(e)
                }
                isInvalid={message && !field.value ? true : false}
                {...field}
                {...rest}
                onChange={(e) => {
                  let refinedValue = e.target.value;
                  refinedValue= refinedValue.replace(/^(\d+)(\.\d{0,2})?.*$/, '$1$2');
                  console.log(refinedValue,"refined value");
                  let size = fieldDef?.field_size;
                  if (!size) {
                    size = 10;
                  }
                  setinputvalue(refinedValue);
                  if (
                    e.target.value?.length == size ||
                    e.target.value?.length < size
                  ) {
                    field.onChange(refinedValue);

                    props.form?.change.forEach((element) => {
                      element(refinedValue, e.target.name.split(".")[1]);
                    });
                  }
                }}
              />
            )}
            {!editable && (
              <div
                style={{ color: "rgb(108, 117, 125)" }}
                className={textColor ? "text-dark" : ""}
              >
                {field.value >= 0 || field.value < 0 ? field.value : "--"}
              </div>
            )}
            {editable && lengthflag && (
              <span className="text-danger ps-3 mt-1 pt-1">
                Maximum digit Length Reached.
              </span>
            )}
          </FieldDom>
        );
      }}
    />
  );
}

export default Input;
