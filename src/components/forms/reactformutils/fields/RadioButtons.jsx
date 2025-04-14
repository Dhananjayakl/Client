// // import React, { useState } from "react";
// // import { Controller } from "react-hook-form";
// // import { Radio, RadioGroup } from "react-radio-group";
// // import FieldDom from "./FieldDom";

// // function RadioButtons(props) {
// //   const {
// //     label,
// //     name,
// //     options,
// //     control,
// //     helptext,
// //     tooltip,
// //     required,
// //     isMulti,
// //     editable,
// //     fieldDef,
// //     field_title,
// //     formMethods,
// //     formMethod,
// //     disabled,
// //     ...rest
// //   } = props;

// //   let [fieldValue, setFieldValue] = useState();

// //   console.log("Radio:", props);
// //   const handleChange = (value) => {
// //     setFieldValue(value);
// //   };

// //   let fieldContent ;

// //   console.log(fieldValue, "formula e");

// //   return (
// //     <Controller
// //       name={name}
// //       control={control}
// //       rules={{
// //         required: {
// //           value: required,
// //           message: `${field_title} is required!`,
// //         },
// //         // minLength: {
// //         //   value: 2,
// //         //   message: "Your name must be at least 2 characters"
// //         // }
// //       }}
// //       render={({ field, fieldState }) => {
// //         const { onChange, value, ...restField } = field;
// //         const errorMessage = fieldState?.error?.message;
// //         setFieldValue(field.value);
// //         // const handleInternalChange = (value) => {
// //         //   setFieldValue(value);
// //         //   onChange(value); // Update the form state
// //         // };

// //         return (
// //           <FieldDom {...props} {...fieldState}>
// //             <RadioGroup
// //               name={name}
// //               //onChange={handleInternalChange}
// //               selectedValue={value || fieldValue}
// //               {...rest}
// //             >
// //               {options.map((items) => (
// //                 <>
// //                   <Radio
// //                     id={items.key}
// //                     style={{ verticalAlign: "middle" }}
// //                     value={items.key}
// //                     disabled={editable == true ? false : true}
// //                   />
// //                   <span
// //                     className={
// //                       errorMessage && !value
// //                         ? "me-4 ms-2 mb-3 text-danger"
// //                         : "me-4 ms-2 mb-3 text-dark"
// //                     }
// //                     style={{ verticalAlign: "middle" }}
// //                   >
// //                     {items.value}
// //                   </span>
// //                 </>
// //               ))}
// //             </RadioGroup>
// //             {/* {errorMessage && <p className="text-danger">{errorMessage}</p>} */}
// //           </FieldDom>
// //         );
// //       }}
// //     />
// //   );
// // }

// // export default RadioButtons;

// // import React, { useState, useRef } from "react";
// // import { Controller } from "react-hook-form";
// // import { RadioGroup, Radio } from "react-radio-group";
// // import FieldDom from "./FieldDom";

// // function RadioButtons(props) {
// //   const {
// //     fieldDef,
// //     label,
// //     control,
// //     name,
// //     options,
// //     helptext,
// //     tooltip,
// //     required,
// //     visible,
// //     formMethods,
// //     formMethod,
// //     editable,
// //     disabled,
// //     field_title,
// //     textColor,
// //     groupFieldLabel,
// //     ...rest
// //   } = props;
// //   const [fieldValue, setFieldValue] = useState();
// //   let fieldLabel;
// //   console.log("RadioGroup: Props", props);
// //   let RadioRef = useRef();

// //   options?.map((items) => {
// //     if (items.key == fieldValue) {
// //       fieldLabel = items.value;
// //     }
// //   });

// //   return (
// //     <Controller
// //       name={name}
// //       control={control}
// //       rules={{
// //         required: {
// //           value: required && editable,
// //           message: `${props.field_title} is required!`,
// //         },
// //       }}
// //       render={({ field, fieldState, formState }) => {
// //         console.log(field, field.value, "ranga value");
// //         setFieldValue(field.value);
// //         RadioRef.current = field.value;
// //         let message;
// //         if (fieldState) {
// //           message = fieldState.error;
// //         }

// //         return (
// //           <FieldDom {...props} {...fieldState} {...field}>
// //             {editable && (
// //               <RadioGroup
// //                 name={name}
// //                 ref={RadioRef}
// //                 selectedValue={field.value}
// //                 onChange={(value) => {
// //                   console.log(value, "radio value respondent form");
// //                   field.onChange(value);
// //                   props.form?.change.forEach((element) => {
// //                     console.log(element, name, "radio value respondent");
// //                     element(value, name.split(".")[1]);
// //                   });
// //                 }}
// //               >
// //                 <div className="d-flex flex-wrap">
// //                   {options &&
// //                     options.map((option, index) => (
// //                       <label key={`name${index}`} className="me-2">
// //                         <Radio
// //                           className="m-2 ms-0"
// //                           value={option.key}
// //                           disabled={editable == true ? false : true}
// //                           style={{ verticalAlign: "middle" }}
// //                         />
// //                         {option.value}
// //                       </label>
// //                     ))}
// //                 </div>
// //               </RadioGroup>
// //             )}
// //             {!editable && (
// //               <div
// //                 style={{ color: textColor ? textColor : "rgb(108, 117, 125)" }}
// //                 className={textColor === true ? "text-dark" : ""}
// //               >
// //                 {fieldLabel ? fieldLabel : "--"}
// //               </div>
// //             )}
// //           </FieldDom>
// //         );
// //       }}
// //     />
// //   );
// // }

// // export default RadioButtons;

// import React, { useState, useEffect } from "react";
// import { Controller } from "react-hook-form";
// import { Form, Col, Row } from "react-bootstrap";
// import FieldDom from "./FieldDom";

// function RadioButtons(props) {
//   const {
//     label,
//     name,
//     options,
//     control,
//     helptext,
//     tooltip,
//     required,
//     editable,
//     fieldDef,
//     textColor,
//     field_title,
//     ...rest
//   } = props;

//   const [fieldValue, setFieldValue] = useState();
//   const [fieldLabel, setFieldLabel] = useState();

//   useEffect(() => {
//     const selectedOption = options.find((option) => option.value == fieldValue);
//     setFieldLabel(selectedOption ? selectedOption.label : "--");
//   }, [fieldValue, options]);

//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={{
//         required: {
//           value: required && editable,
//           message: `${field_title} is required!`,
//         },
//       }}
//       render={({ field, fieldState }) => {
//         useEffect(() => {
//           setFieldValue(field.value);
//         }, [field.value]);

//         return (
//           <FieldDom {...props} {...fieldState} {...field}>
//             {editable ? (
//               <Row className="d-flex align-items-center">
//                 {options.map((option, index) => (
//                   <Col key={option.key} className="col-auto">
//                     <Form.Check
//                       type="radio"
//                       id={option.value}
//                       label={option.label}
//                       className="m-0"
//                       name={name}
//                       value={option.index}
//                       checked={field.value == option.value}
//                       onChange={() => field.onChange(option.value)}
//                       disabled={!editable}
//                     />
//                   </Col>
//                 ))}
//               </Row>
//             ) : (
//               <div
//                 style={{ color: textColor || "rgb(108, 117, 125)" }}
//                 className={textColor ? "text-dark" : ""}
//               >
//                 {fieldLabel}
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

// export default RadioButtons;

import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Form, Col, Row } from "react-bootstrap";
import FieldDom from "./FieldDom";

function RadioButtons(props) {
  const {
    label,
    name,
    options,
    control,
    helptext,
    tooltip,
    required,
    editable,
    fieldDef,
    textColor,
    field_title,
    ...rest
  } = props;

  const [fieldValue, setFieldValue] = useState();
  const [fieldLabel, setFieldLabel] = useState();

  useEffect(() => {
    const selectedOption = options.find((option) => option.key == fieldValue);
    setFieldLabel(selectedOption ? selectedOption.value : "--");
  }, [fieldValue, options]);

  options.map((option) => {
    console.log(
      option.key,

      typeof option.key,

      "options in radio"
    );
  });

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required && editable,
          message: `${field_title} is required!`,
        },
      }}
      render={({ field, fieldState }) => {
        useEffect(() => {
          setFieldValue(field.value);
        }, [field.value]);

        return (
          <FieldDom {...props} {...fieldState} {...field}>
            {editable ? (
              <Row className="d-flex align-items-center">
                {options.map((option, index) => (
                  <Col key={option.key} className="col-auto">
                    <Form.Check
                      type="radio"
                      id={option.key}
                      label={option.value}
                      className="m-0"
                      name={name}
                      value={option.key}
                      checked={field.value == option.key}
                      onChange={() => field.onChange(option.key)}
                      disabled={!editable}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <div
                style={{ color: textColor || "rgb(108, 117, 125)" }}
                className={textColor ? "text-dark" : ""}
              >
                {fieldLabel}
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

export default RadioButtons;
