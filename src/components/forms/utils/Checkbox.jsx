import React from "react";
import { Field } from "formik";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";

function CheckBox(props) {
  const { fieldDef, label, name, helptext, tooltip, required, ...rest } = props;
  return (
    <Field name={name}>
      {({ field, form: { touched, errors }, meta }) => {
        //  console.log("field.value",field.value);
        return (
          <Form.Group>
            <div key={`div-${name}`}>
              <Form.Check type="checkbox" id={`check-${name}`}>
                <Form.Check.Input
                  type="checkbox"
                  name={name}
                  defaultChecked={field.value === "Yes"}
                  {...field}
                  // value={field.value === "Yes"}
                  checked={field.value}
                  {...rest}
                />
                <Form.Check.Label>
                  {label || (fieldDef && fieldDef.field_title)}{" "}
                  {required && <span className="text-danger">*</span>}{" "}
                </Form.Check.Label>

                <FieldToolTip tooltip={tooltip} />
              </Form.Check>
            </div>

            {meta.touched && meta.error && (
              <Form.Control.Feedback type="invalid">
                {meta.error}
              </Form.Control.Feedback>
            )}
            <Form.Text>{helptext}</Form.Text>
          </Form.Group>
        );
      }}
    </Field>
  );
}

export default CheckBox;
