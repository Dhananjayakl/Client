// import React, { useState, useEffect } from "react";
// import { Controller } from "react-hook-form";
// import { Form, Col, Row } from "react-bootstrap";
// import FieldToolTip from "./FieldToolTip";
// import FieldDom from "./FieldDom";

// function CheckBoxes(props) {
//   const {
//     label,
//     name,
//     options,
//     control,
//     helptext,
//     tooltip,
//     required,
//     isMulti,
//     fieldDef,
//     editable,
//     ...rest
//   } = props;

//   const [fieldValue, setFieldValue] = useState([]);
//   const [selectedLabels, setSelectedLabels] = useState([]);

//   useEffect(() => {
//     const labels = options
//       .filter((option) => fieldValue?.includes(option.key))
//       .map((option) => option.value);
//     setSelectedLabels(labels);
//   }, [fieldValue, options]);

//   const handleChange = (value, field) => {
//     let updatedValues;
//     if (field.value?.includes(value)) {
//       updatedValues = field.value.filter((key) => key !== value);
//     } else {
//       updatedValues = [...(field.value || []), value];
//     }
//     setFieldValue(updatedValues);
//     field.onChange(updatedValues);
//   };

//   console.log(options, editable, "Check box options");

//   return (
//     <Controller
//       name={name}
//       control={control}
//       defaultValue={[]}
//       rules={{
//         required: {
//           value: required,
//           message: `${props.field_title} is required!`,
//         },
//         // Other rules if needed
//       }}
//       render={({ field, fieldState }) => {
//         console.log(field.value, fieldState, "checkbox value");
//         setFieldValue(field.value);

//         return (
//           <FieldDom {...props} {...fieldState}>
//             {editable ? (
//               <Row className="d-flex">
//                 {options.map((item) => (
//                   <Col sm={12} md={12} lg={12}>
//                     <Form.Check
//                       key={item.key}
//                       id={item.key}
//                       type="checkbox"
//                       className="me-2"
//                       label={item.value}
//                       checked={field?.value?.includes(item.key)}
//                       onChange={() => handleChange(item.key, field)}
//                     />
//                   </Col>
//                 ))}
//               </Row>
//             ) : (
//               <div
//                 style={{ color: props.textColor || "rgb(108, 117, 125)" }}
//                 className={props.textColor ? "text-dark" : ""}
//               >
//                 {selectedLabels.length > 0 ? selectedLabels.join(", ") : "--"}
//               </div>
//             )}
//             {fieldState.error && (
//               <p className="text-danger">{fieldState.error.message}</p>
//             )}
//           </FieldDom>
//         );
//       }}
//     />
//   );
// }

// export default CheckBoxes;

import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Form, Col, Row } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import FieldDom from "./FieldDom";
import { useTranslation } from "react-i18next";
function CheckBoxes(props) {
  const {
    label,
    name,
    options,
    control,
    helptext,
    tooltip,
    required,
    // isMulti,
    fieldDef,
    editable,
    ...rest
  } = props;
  let isMulti = true;
  const { t } = useTranslation("common");
  const [fieldValue, setFieldValue] = useState(isMulti ? [] : null);
  const [selectedLabels, setSelectedLabels] = useState([]);
  console.log(isMulti, "checkbox multi");
  useEffect(() => {
    const labels = options
      .filter((option) =>
        isMulti
          ? fieldValue?.includes(option.value)
          : fieldValue == option.value
      )
      .map((option) => option.label);
    setSelectedLabels(labels);
    console.log(labels, "labels in the chekcbox");
  }, [fieldValue, options, isMulti]);

  const handleChange = (value, field) => {
    let updatedValues;

    if (isMulti) {
      // Ensure that field.value is always an array when isMulti is true
      const currentValue = Array.isArray(field.value) ? field.value : [];
      console.log(currentValue, value, "checkbox values");
      if (currentValue.includes(value)) {
        updatedValues = currentValue.filter((key) => key !== value);
      } else {
        updatedValues = [...currentValue, value];
      }
    } else {
      // For single selection, just toggle the value between null and the selected value
      updatedValues = field.value === value ? null : value;
    }

    setFieldValue(updatedValues);
    field.onChange(updatedValues);
  };
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={isMulti ? [] : null}
      rules={{
        required: {
          value: required,
          message: `${t(props.field_title)} ${t("is required!")}`,
        },
        // Other rules if needed
      }}
      render={({ field, fieldState }) => {
        useEffect(() => {
          setFieldValue(field.value);
        }, [field.value]);

        return (
          <FieldDom {...props} {...fieldState}>
            {editable ? (
              <Row className="d-flex align-items-center">
                {options.map((item) => (
                  <Col className="col-auto" key={item.value}>
                    <Form.Check
                      id={item.value}
                      type="checkbox"
                      label={item.label}
                      checked={
                        isMulti
                          ? field.value?.includes(item.value)
                          : field.value == item.value
                      }
                      onChange={() => handleChange(item.value, field)}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <div
                style={{ color: props.textColor || "rgb(108, 117, 125)" }}
                className={props.textColor ? "text-dark" : ""}
              >
                {selectedLabels.length > 0 ? (
                  <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                    {selectedLabels.map((label, index) => (
                      <li key={index}>{label}</li>
                    ))}
                  </ul>
                ) : (
                  "--"
                )}
              </div>
            )}
            {fieldState.error && (
              <p className="text-danger">{fieldState.error.message}</p>
            )}
          </FieldDom>
        );
      }}
    />
  );
}

export default CheckBoxes;
