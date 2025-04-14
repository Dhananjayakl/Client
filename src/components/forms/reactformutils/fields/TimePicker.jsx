import React from "react";
import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import FieldDom from "./FieldDom";
import { useTranslation } from "react-i18next";
function TimePicker(props) {
  let {
    control,
    required,
    name,
    formMethods,
    editable,
    field_title,
    isMulti,
    ...rest
  } = props;

  const pagepath = window.parent.location.pathname;
  const { t } = useTranslation("common");
  function formatTime(jsonTime) {
    if (jsonTime === "" || jsonTime === undefined) return "";
    const time = new Date(jsonTime);
    const formattedTime = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return formattedTime;
  }

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
      // rules={{
      //   required: {
      //     value: required,
      //     message: `${name} is required!`,
      //   },
      // }}
      render={({ field, fieldState, formState }) => {
        const formattedTime = formatTime(field.value);

        return (
          <FieldDom {...props} {...fieldState}>
            {editable && (
              <Form.Control
                size="lg"
                className={editable && required && "mandatory"}
                // isInvalid={Boolean(touched[name] && errors[name])}
                isInvalid={Boolean(
                  (fieldState.isTouched || formState.submitCount > 0) &&
                    fieldState.error
                )}
                value={formattedTime} // Set the value prop
                {...field}
                {...rest}
                type="time" // Set the input type to "time" for time picker
                onChange={(e) => {
                  field.onChange(e);

                  props.form?.change.forEach((element) => {
                    element(e.target.value, e.target.name.split(".")[1]);
                  });
                }}
                onBlur={() => {
                  // Close the time picker when it loses focus
                  field.onBlur();
                }}
              />
            )}
            {!editable && <div>--</div>}
          </FieldDom>
        );
      }}
    />
  );
}

export default TimePicker;
