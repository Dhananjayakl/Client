import React from "react";
import { Field } from "formik";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function PhoneNumber(props) {
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
        return (
          <FieldDom {...props} {...meta}>
            <PhoneInput {...field} {...rest} />
          </FieldDom>
        );
      }}
    </Field>
  );
}

export default PhoneNumber;
