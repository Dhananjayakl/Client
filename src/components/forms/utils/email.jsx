import React from "react";
import { Field } from "formik";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import FieldDom from "./FieldDom";

function Email(props) {
  const {
    fieldDef,
    label,
    name,
    options,
    helptext,
    tooltip,
    required,
    visible,
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
              type="email"
              className={required && "border-start border-primary border-4"}
              isInvalid={Boolean(touched[name] && errors[name])}
              {...field}
              {...rest}
              // {...fieldAttributes}
            />
          </FieldDom>
        );
      }}
    </Field>
  );
}

export default Email;
