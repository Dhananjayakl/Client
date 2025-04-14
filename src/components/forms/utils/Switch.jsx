import React from "react";
import { Field } from "formik";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";

function Switch(props) {
  const { label, name, helptext, tooltip, required, fieldDef, ...rest } = props;
  return (
    <Field name={name}>
      {({ field, form: { touched, errors }, meta }) => {
        //  console.log(field);
        return (
          <Form.Group>
            <div key={`div-${name}`}>
              <Form.Check
                type="switch"
                name={name}
                label={label || (fieldDef && fieldDef.field_title)}
                id={`check-${name}`}
                {...field}
                checked={field.value}
                {...rest}
              />
              {/* <Form.Check type="switch" id={`check-${name}`}>
                <Form.Check.Input
                  type="switch"
                  name={name}
                  //checked={field.value === true}
                  {...field}
                  //value={true}
                  {...rest}
                />
                <Form.Check.Label>
                  {label} {required && <span className="text-danger">*</span>}{" "}
                </Form.Check.Label>
                <FieldToolTip tooltip={tooltip} />
              </Form.Check> */}
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

export default Switch;
