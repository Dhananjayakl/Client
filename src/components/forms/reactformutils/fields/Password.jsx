import React from "react";
import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import FieldDom from "./FieldDom";

function PasswordField(props) {
  let { fieldDef, control, required, name, editable, field_title, ...rest } =
    props;

  if (!fieldDef) fieldDef = {};

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
      render={({ fieldState, field }) => {
        let message;
        if (fieldState) {
          message = fieldState?.error?.message;
        }
        return (
          <FieldDom {...props} {...fieldState} {...field}>
            <>
              <Form.Control
                size="lg"
                autoComplete="off"
                type="password"
                className={editable && required && "mandatory"}
                isInvalid={message ? true : false}
                {...field}
                {...rest}
              />
            </>

            {!editable && <div>{field.value ? "••••••••" : "--"}</div>}
          </FieldDom>
        );
      }}
    />
  );
}

export default PasswordField;
