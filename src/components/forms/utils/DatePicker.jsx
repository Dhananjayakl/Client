import React from "react";
import { Field } from "formik";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import { Children } from "react";
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

  function formatDate(jsonDate) {
    if (!jsonDate) {
      return;
    }
    const date = new Date(jsonDate);

    const getYear = date.toLocaleDateString("default", { year: "numeric" });
    const getMonth = date.toLocaleDateString("default", { month: "2-digit" });
    const getDay = date.toLocaleDateString("default", { day: "2-digit" });
    const formattedDate = getYear + "-" + getMonth + "-" + getDay;
    return formattedDate;
  }
  return (
    <Field name={name}>
      {({
        field, // { name, value, onChange, onBlur }
        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta,
      }) => {
        console.log("Additional Field:", field.value);
        field.value = formatDate(field.value);
        return (
          <FieldDom {...props} {...meta}>
            <Form.Control
              size="lg"
              type="date"
              className={required && "border-start border-primary border-4"}
              isInvalid={Boolean(touched[name] && errors[name])}
              {...field}
              // onChange={onChange}
              // disabled={!editable}
              // {...fieldAttributes}
              {...rest}
            />
          </FieldDom>
        );
      }}
    </Field>
  );
}

export default Input;
