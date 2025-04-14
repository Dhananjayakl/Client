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
    upperCase,
    ...rest
  } = props;
  console.log(name, upperCase, "uppercase flag");
  console.log("input props", props);
  return (
    <Field name={name}>
      {({ field, form: { touched, errors }, meta }) => {
        if (field?.value && upperCase == true) {
          let UpperCaseValue = field.value.toUpperCase();
          console.log(UpperCaseValue, "upper1");
        }
        console.log("input field value:", field.value);
        return (
          <FieldDom {...props} {...field} {...meta}>
            <Form.Control
              {...field}
              {...rest}
              size="lg"
              type="text"
              value={
                field.value && upperCase == true
                  ? field.value.toUpperCase()
                  : field.value
              }
              className={required && "mandatory"}
              isInvalid={Boolean(touched[name] && errors[name])}
            />
          </FieldDom>
        );
      }}
    </Field>
  );
}

export default Input;
