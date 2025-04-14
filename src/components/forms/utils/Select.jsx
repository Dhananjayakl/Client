import React from "react";
import { Field } from "formik";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import FieldDom from "./FieldDom";

function Select(props) {
  const {
    fieldDef,
    label,
    name,
    options,
    helptext,
    tooltip,
    required,
    visible,
    disabled,
    ...rest
  } = props;
  console.log("Select Props", props);

  const SelectComponent = disabled ? Form.Control : Form.Select;
  return (
    <Field name={name}>
      {({ field, form: { touched, errors }, meta }) => {
        return (
          <FieldDom {...props} {...meta}>
            <SelectComponent
              as="select"
              size="lg"
              className={required && "mandatory"}
              isInvalid={Boolean(touched[name] && errors[name])}
              disabled={disabled}
              {...field}
              {...rest}
            >
              <option key="" value="Select an option">
                Select an option
              </option>
              {options &&
                options.map((option) => {
                  return (
                    <option
                      key={option.key}
                      value={option.key}
                      disabled={option.active == false}
                    >
                      {option.active == false ? (
                        <del>{option.value}</del>
                      ) : (
                        option.value
                      )}
                    </option>
                  );
                })}
            </SelectComponent>
          </FieldDom>
        );
      }}
    </Field>
  );
}

export default Select;
