import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Range as ReactRange } from "react-range";
import FieldDom from "./FieldDom";

function Range(props) {
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
    rules,
    editable,
    field_title,
    fieldValue,
    ...rest
  } = props;

  const min = fieldDef?.min || 0;
  const max = fieldDef?.max || 100;
  const step = fieldDef?.step || 1;

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required && editable,
          message: `${field_title} is required!`,
        },
      }}
      render={({ field, fieldState, formState }) => {
        let message;
        if (fieldState) {
          message = fieldState.error;
        }

        let parsedValue;
        if (
          typeof field.value === "string" &&
          field.value.startsWith("{") &&
          field.value.endsWith("}")
        ) {
          parsedValue = [parseFloat(field.value.replace(/[{}]/g, ""))];
        } else {
          parsedValue = Array.isArray(field.value)
            ? field.value.map((v) => parseFloat(v))
            : [parseFloat(field.value) || min];
        }

        return (
          <FieldDom {...props} {...fieldState} {...field}>
            {editable && (
              <>
                <ReactRange
                  values={parsedValue}
                  step={step}
                  min={min}
                  max={max}
                  onChange={(values) => {
                    formMethods.setValue(name, values);
                  }}
                  onFinalChange={(values) => field.onChange(values[0])}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "6px",
                        width: "80%",
                        backgroundColor: "#ccc",
                      }}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "24px",
                        width: "24px",
                        backgroundColor: "bg-primary",
                        borderRadius: "50%",
                      }}
                      className="bg-primary w-20 h-10"
                    />
                  )}
                />
                <div className="text-dark mt-1" id={`${props.name}value`}>
                  {field.value !== undefined ? field.value || 0 : "--"}/{max}
                </div>
              </>
            )}

            {!editable && (
              <div className="text-dark" id={`${props.name}value`}>
                {field.value !== undefined ? field.value : "--"}/{max}
              </div>
            )}

            {message && <div className="text-danger">{message.message}</div>}
          </FieldDom>
        );
      }}
    />
  );
}

export default Range;
