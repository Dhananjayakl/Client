import React from "react";
import { Field, useFormikContext, ErrorMessage } from "formik";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import FieldDom from "./FieldDom";

function CheckBoxes({ name, options, ...rest }) {
  const { values, setFieldValue } = useFormikContext();

  const handleCheckboxChange = (optionKey, isChecked) => {
    const currentValues = values[name] || [];
    let updatedValues = [];

    if (isChecked) {
      updatedValues = [...currentValues, optionKey];
    } else {
      updatedValues = currentValues.filter((value) => value !== optionKey);
    }
    setFieldValue(name, updatedValues);
  };

  return (
    <Field name={name} validate={null}>
      {({ field }) => (
        <FieldDom {...rest} {...field}>
          {options &&
            options.map((option) => {
              const isChecked = field.value.includes(option.key.toString());
              return (
                <Form.Check
                  key={option.key}
                  type="checkbox"
                  id={`check-${name}-${option.key}`}
                >
                  <Form.Check.Input
                    type="checkbox"
                    name={name}
                    checked={isChecked}
                    onChange={(e) =>
                      handleCheckboxChange(
                        option.key.toString(),
                        e.target.checked
                      )
                    }
                    value={option.key}
                    {...rest}
                  />
                  <Form.Check.Label>{option.value}</Form.Check.Label>
                </Form.Check>
              );
            })}
          <ErrorMessage name={name} component="div" className="error" />
        </FieldDom>
      )}
    </Field>
  );
}

export default CheckBoxes;
