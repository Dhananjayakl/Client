import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import FieldDom from "./FieldDom";
// import {  useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next";

function Select(props) {
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
    formMethod,
    editable,
    disabled,
    field_title,
    parentKey,
    Hierarchy,
    isMulti,
    textColor,
    groupFieldLabel,
    ...rest
  } = props;
  const SelectRef = React.useRef();
  const [fieldValue, setFieldValue] = useState();
  let fieldLabel;
  const { t } = useTranslation("common");
  //console.log("Select: Props", props);

  // console.log(options, "check options");

  // let title = props.title;
  // if (props.watchFor) {
  //   let value= useWatch({
  //     control: control,
  //     // name: props.id,
  //     name: props.watchFor,
  //   });
  //   console.log("Select: Parent Field Value:",name,value)
  // }
  // console.log(fieldValue, "ferrari");
  //console.log(options, "opt1");

  options?.map((items) => {
    if (items.key == fieldValue) {
      fieldLabel = items.value;
    }
  });

  //console.log(fieldLabel, fieldValue, name, "f123");
  //console.log(SelectRef.current, "select ref");
  // let guidence =
  //   options &&
  //   options.map(
  //     (item) =>
  //       item.guidence && (
  //         <ul style={{ margin: "1.5px" }}>
  //           <li>
  //             <div class="font-weight-bold">{item.value}</div>
  //             <span>{item.guidence}</span>
  //           </li>
  //         </ul>
  //       )
  //   );

  // if (guidence?.length > 0) {
  //   guidence = guidence.filter((value) => value !== null && value !== "");
  //   guidence = guidence?.length > 0 ? guidence : undefined;

  // }

  const pagepath = window.parent.location.pathname;
  const parentPath = window.parent.location.href.includes("project");
  const SelectComponent = disabled ? Form.Control : Form.Select;

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required && editable,
          message: `${t(props.field_title)} ${t("is required")}!`,
        },
      }}
      // rules={{
      //   required: {
      //     value: required && editable,
      //     message:  `${fieldDef.field_title||name} is required!`,
      //   },

      // }}

      render={({ field, fieldState, formState }) => {
        setFieldValue(field.value);
        SelectRef.current = field.value;
        let message;
        if (fieldState) {
          message = fieldState.error;
        }

        return (
          <FieldDom {...props} {...fieldState} {...field}>
            {editable && (
              <SelectComponent
                as="select"
                size="lg"
                ref={SelectRef}
                className={editable && required && "mandatory"}
                // isInvalid={Boolean( formState.submitCount>0) && formState.errors}
                // isInvalid={message && fieldValue == "" ? true : false}
                isInvalid={message && !fieldValue ? true : false}
                disabled={disabled}
                {...field}
                {...rest}
                onChange={(e) => {
                  field.onChange(e);
                  // console.log("e.target", e.target);
                  // console.log("Value", props.form?.change);
                  props.form?.change.forEach((element) => {
                    element(e.target.value, e.target.name.split(".")[1]);
                  });
                }}
              >
                {name !== "hierarchy" && (
                  <option key="" value="">
                    {groupFieldLabel
                      ? `${groupFieldLabel}`
                      : t("Select an option")}
                  </option>
                )}
                {options &&
                  options.map((option, index) => {
                    return (
                      <option
                        key={`name${index}`}
                        value={option.key}
                        disabled={option.active == false}
                      >
                        {option.active == false ? (
                          <del>{t(option.value)}</del>
                        ) : (
                          t(option.value)
                        )}
                      </option>
                    );
                  })}
              </SelectComponent>
            )}
            {!editable && (
              <div
                style={{ color: textColor ? textColor : "rgb(108, 117, 125)" }}
                className={textColor == true ? "text-dark" : ""}
              >
                {fieldLabel ? fieldLabel : "--"}
              </div>
            )}
            {
              // <div>
              //   {field.value}
              // </div>
            }
          </FieldDom>
        );
      }}
    />
  );
}

export default Select;
