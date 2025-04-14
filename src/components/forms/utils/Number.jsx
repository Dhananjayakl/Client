import React from "react";
import { Field } from "formik";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import FieldDom from "./FieldDom";

function Input(props) {
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
  // console.log(props);
  var inputTypeNumbers = document.querySelectorAll("input[type=number]");
  for (var a = 0; a < inputTypeNumbers.length; a++) {
    inputTypeNumbers[a].onwheel = function (event) {
      event.target.blur();
    };
  }
  return (
    <Field name={name}>
      {({ field, form: { touched, errors }, meta }) => {
        return (
          <FieldDom {...props} {...meta}>
            <Form.Control
              size="lg"
              type="number"
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
