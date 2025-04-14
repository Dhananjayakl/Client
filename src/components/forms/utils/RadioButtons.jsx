import React from "react";
import { Field } from "formik";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import FieldDom from "./FieldDom";
function RadioButtons(props) {
  const {
    label,
    name,
    options,
    helptext,
    tooltip,
    required,
    fieldDef,
    ...rest
  } = props;
  return (
    <Field name={name}>
      {({ field, form: { touched, errors }, meta }) => {
        return (
          <FieldDom {...props} {...meta}>
            {options.map((option) => {
              return (
                <Form.Check
                  type="radio"
                  id={`radio-${name}-${option.key}`}
                  name={name}
                >
                  <Form.Check.Input
                    type="radio"
                    name={name}
                    defaultChecked={field.value === option.key}
                    // checked={field.value === option.key}
                    {...field}
                    value={option.key}
                    {...rest}
                  />
                  <Form.Check.Label>{option.value}</Form.Check.Label>
                </Form.Check>
              );
            })}
          </FieldDom>
        );
      }}
    </Field>
  );
}

export default RadioButtons;
