// import React from "react";
// // import { Field } from "formik";
// import { Form } from "react-bootstrap";
// import { Controller } from "react-hook-form";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faCheck,
//   faCheckSquare,
//   faCheckDouble,
//   faMinus,
// } from "@fortawesome/free-solid-svg-icons";

// import FieldDom from "./FieldDom";
// function Switch(props) {
//   console.log("inside switch");
//   const {
//     name,
//     control,
//     label,
//     helptext,
//     visible,
//     tooltip,
//     required,
//     fieldDef,
//     field_title,
//     editable,
//     isMulti,
//     ...rest
//   } = props;
//   console.log(editable, required, "condiiton check");
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
//       // rules={{
//       //   required: true,
//       // }}
//       render={({ field, fieldState, formState }) => {
//         console.log(field.value, name, "switch value");

//         let message;
//         if (fieldState) {
//           message = fieldState.error;
//         }
//         // if(fieldState){
//         //   console.log(fieldState.error.message,"error message")
//         // }
//         return (
//           <FieldDom {...props} {...fieldState} {...field}>
//             <div key={`div-${name}`} style={{ display: "flex" }}>
//               {editable && (
//                 <Form.Check
//                   type="switch"
//                   name={name}
//                   //  label={`${field.value ? "Yes" : "No"} `}
//                   // className={editable && required && "mandatory"}
//                   id={`check-${name}`}
//                   {...field}
//                   checked={field.value === true || field.value === "true"}
//                   {...rest}
//                   isInvalid={message && field.value == "" ? true : false}
//                   onChange={(e) => {
//                     field.onChange(e);
//                     console.log(e, "e");
//                     props.form?.change.forEach((element) => {
//                       element(e.target.checked, e.target.name.split(".")[1]);
//                     });
//                   }}
//                 />
//               )}
//               {!editable && (
//                 <span className="me-2">
//                   {(field.value == true || field.value == "true") && (
//                     <FontAwesomeIcon icon={faCheck} />
//                   )}

//                   {(field.value == false || field.value == "false") && (
//                     <FontAwesomeIcon icon={faMinus} />
//                   )}
//                 </span>
//               )}

//               {/* <div>{props.field_title}</div> */}
//               <Form.Check.Label>
//                 {(fieldState &&
//                   fieldState.error &&
//                   fieldState.error.message &&
//                   field.value == "" && (
//                     <span className="text-danger">{field_title}</span>
//                   )) || <span>{field_title}</span>}
//                 {required && editable && <span className="text-danger">*</span>}{" "}
//               </Form.Check.Label>
//             </div>
//             {(fieldState &&
//               fieldState.error &&
//               fieldState.error.message &&
//               field.value == "" && (
//                 <small className="text-danger">
//                   {fieldState.error.message}
//                 </small>
//               )) || <span></span>}
//             {/* {fieldState.isTouched && fieldState.error && (
//             <Form.Control.Feedback type="invalid">
//               {fieldState.error}
//             </Form.Control.Feedback>
//           )} */}
//             <Form.Text>{helptext}</Form.Text>
//           </FieldDom>
//         );
//       }}
//     />
//   );
// }

// export default Switch;

import React from "react";
// import { Field } from "formik";
import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCheckSquare,
  faCheckDouble,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

import FieldDom from "./FieldDom";
function Switch(props) {
  console.log("inside switch");
  const {
    name,
    control,
    label,
    helptext,
    visible,
    tooltip,
    required,
    fieldDef,
    field_title,
    fieldProps,
    editable,
    isMulti,
    ...rest
  } = props;
  console.log(editable, required, fieldProps, "condiiton check");
  return (
    <Controller
      name={name}
      control={control}
      // rules={{
      //   required: {
      //     value: required && editable,
      //     message: `${field_title} is required!`,
      //   },
      // }}
      rules={{
        required: required
          ? {
              value: true,
              message: `${field_title} is required!`,
            }
          : false,
      }}
      // rules={{
      //   required: true,
      // }}
      render={({ field, fieldState, formState }) => {
        console.log(
          field.value,
          fieldState,
          fieldState.error,
          name,
          "switch value"
        );

        let message;
        if (fieldState) {
          message = fieldState.error;
        }
        // if(fieldState){
        //   console.log(fieldState.error.message,"error message")
        // }
        return (
          <FieldDom
            {...props}
            {...fieldState}
            {...field}
            fieldProps={fieldProps}
          >
            <div key={`div-${name}`} style={{ display: "flex" }}>
              {editable && (
                <Form.Check
                  type="switch"
                  name={name}
                  //  label={`${field.value ? "Yes" : "No"} `}
                  // className={editable && required && "mandatory"}
                  id={`check-${name}`}
                  {...field}
                  checked={field.value === true || field.value === "true"}
                  {...rest}
                  isInvalid={message && field.value == "" ? true : false}
                  onChange={(e) => {
                    field.onChange(e);
                    console.log(e, "e");
                    props.form?.change.forEach((element) => {
                      element(e.target.checked, e.target.name.split(".")[1]);
                    });
                  }}
                />
              )}
              {!editable && (
                <span className="me-2">
                  {(field.value == true || field.value == "true") && (
                    <FontAwesomeIcon icon={faCheck} />
                  )}

                  {(field.value == false || field.value == "false") && (
                    <FontAwesomeIcon icon={faMinus} />
                  )}
                </span>
              )}

              {/* <div>{props.field_title}</div> */}
              <Form.Check.Label>
                {(fieldState &&
                  fieldState.error &&
                  fieldState.error.message &&
                  field.value == "" && (
                    <span className="text-danger">{field_title}</span>
                  )) || <span>{field_title}</span>}
                {/* {required && editable && <span className="text-danger">*</span>}{" "} */}
              </Form.Check.Label>
            </div>
            {(fieldState && fieldState.error && fieldState.error.message && (
              <span className="text-danger">{fieldState.error.message}</span>
            )) || <span></span>}
            {/* {fieldState.isTouched && fieldState.error && (
            <Form.Control.Feedback type="invalid">
              {fieldState.error}
            </Form.Control.Feedback>
          )} */}
            <Form.Text>{helptext}</Form.Text>
          </FieldDom>
        );
      }}
    />
  );
}

export default Switch;
