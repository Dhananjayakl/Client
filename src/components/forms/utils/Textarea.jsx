import React from "react";
import { Field } from "formik";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import FieldDom from "./FieldDom";

function Input(props) {
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
  // console.log(props);
  return (
    <Field name={name}>
      {({ field, form: { touched, errors }, meta }) => {
        return (
          <FieldDom {...props} {...meta}>
            <Form.Control
              as="textarea"
              rows={3}
              size="lg"
              type="text"
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

export default Input;
