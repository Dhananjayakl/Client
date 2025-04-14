import React from "react";
import { Field } from "formik";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import FieldDom from "./FieldDom";

function Password(props) {
  // console.log(props);
  const {
    label,
    name,
    options,
    helptext,
    tooltip,
    required,
    visible,
    fieldDef,
    ...rest
  } = props;
  return (
    <Field name={name}>
      {({
        field, // { name, value, onChange, onBlur }
        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta,
      }) => {
        // console.log("Additinal Field:", field);
        return (
          <FieldDom {...props} {...meta}>
            <Form.Control
              size="lg"
              type="password"
              className={required && "mandatory"}
              isInvalid={Boolean(touched[name] && errors[name])}
              {...field}
              {...rest}
            />
          </FieldDom>
        );
      }}
    </Field>
  );
}

export default Password;
