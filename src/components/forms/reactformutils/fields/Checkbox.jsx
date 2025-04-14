// import React, { useEffect, useState } from "react";
// import { Controller } from "react-hook-form";
// import { Form } from "react-bootstrap";
// import FieldToolTip from "./FieldToolTip";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faCheck,
//   faCheckSquare,
//   faCheckDouble,
//   faMinus,
// } from "@fortawesome/free-solid-svg-icons";
// import FieldDom from "./FieldDom";

// function CheckBox(props) {
//   const {
//     fieldDef,
//     field_title,
//     control,
//     name,
//     helptext,
//     tooltip,
//     required,
//     editable,
//     isMulti,
//     formMethods,
//     ...rest
//   } = props;

//   let handleChange = (e) => {
//     console.log(e, "checker e");
//     if (e.target.checked == true) {
//       formMethods.setValue(name, true);
//     } else {
//       formMethods.setValue(name, false);
//     }

//     console.log(e.target.checked, "target value");
//   };

//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={{
//         required: {
//           value: required,
//           message: `${props.field_title} is required!`,
//         },
//         // Other rules if needed
//       }}
//       render={({ field, fieldState }) => {
//         console.log(editable, name, field.value, "editable check box");
//         console.log(field.value, name, "mercedes");
//         return (
//           <FieldDom {...props} {...fieldState}>
//             <Form.Group>
//               <div key={`div-${name}`}>
//                 {editable && (
//                   <Form.Check
//                     type="checkbox"
//                     checked={
//                       field.value == "true" || field.value == true
//                         ? true
//                         : false
//                     }
//                     id={`check-${name}`}
//                     label={field_title}
//                     onChange={(e) => {
//                       props.form?.change.forEach((element) => {
//                         element(e.target.checked, e.target.name.split(".")[1]);
//                         // Called for each iteration
//                       });
//                       handleChange(e);
//                     }}
//                   />
//                 )}
//               </div>

//               {!editable && (
//                 <>
//                   <span className="me-2">
//                     {(field.value == true || field.value == "true") && (
//                       <FontAwesomeIcon icon={faCheck} />
//                     )}

//                     {(field.value == false ||
//                       field.value == "false" ||
//                       !field.value) && <FontAwesomeIcon icon={faMinus} />}
//                   </span>
//                   <Form.Check.Label>
//                     {field_title || (fieldDef && props.field_title)}{" "}
//                     {required && <span class="text-danger">*</span>}{" "}
//                   </Form.Check.Label>
//                 </>
//               )}

//               {fieldState.isTouched && fieldState.error && (
//                 <Form.Control.Feedback type="invalid">
//                   {fieldState.error}
//                 </Form.Control.Feedback>
//               )}
//               <Form.Text>{fieldDef && props.help_text}</Form.Text>
//             </Form.Group>
//           </FieldDom>
//         );
//       }}
//     />
//   );
// }

import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCheckSquare,
  faCheckDouble,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import FieldDom from "./FieldDom";
import { useTranslation } from "react-i18next";

function CheckBox(props) {
  const {
    fieldDef,
    field_title,
    control,
    name,
    helptext,
    tooltip,
    required,
    editable,
    isMulti,
    formMethods,
    ...rest
  } = props;
  const { t } = useTranslation("common");
  let handleChange = (e) => {
    console.log(e, "checker e");
    if (e.target.checked == true) {
      formMethods.setValue(name, true);
    } else {
      formMethods.setValue(name, false);
    }

    console.log(e.target.checked, "target value");
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required,
          message: `${t(props.field_title)} ${t("is required!")}`,
        },
        // Other rules if needed
      }}
      render={({ field, fieldState }) => {
        console.log(editable, name, field.value, "editable check box");
        console.log(field.value, name, "mercedes");
        return (
          <FieldDom {...props} {...fieldState}>
            <Form.Group>
              <div key={`div-${name}`}>
                {editable && (
                  <Form.Check
                    type="checkbox"
                    checked={
                      field.value == "true" || field.value == true
                        ? true
                        : false
                    }
                    id={`check-${name}`}
                    label={field_title}
                    onChange={(e) => {
                      props.form?.change.forEach((element) => {
                        element(e.target.checked, e.target.name.split(".")[1]);
                        // Called for each iteration
                      });
                      handleChange(e);
                    }}
                  />
                )}
              </div>

              {!editable && (
                <>
                  <span className="me-2">
                    {(field.value == true || field.value == "true") && (
                      <FontAwesomeIcon icon={faCheck} />
                    )}

                    {(field.value == false ||
                      field.value == "false" ||
                      !field.value) && <FontAwesomeIcon icon={faMinus} />}
                  </span>
                  <Form.Check.Label>
                    {field_title || (fieldDef && props.field_title)}{" "}
                    {required && <span class="text-danger">*</span>}{" "}
                  </Form.Check.Label>
                </>
              )}

              {/* {fieldState.isTouched && fieldState.error && (
                <Form.Control.Feedback type="invalid">
                  {fieldState.error.message}
                </Form.Control.Feedback>
              )} */}
              {(fieldState && fieldState.error && fieldState.error.message && (
                <span className="text-danger">{fieldState.error.message}</span>
              )) || <span></span>}
              <Form.Text>{fieldDef && props.help_text}</Form.Text>
            </Form.Group>
          </FieldDom>
        );
      }}
    />
  );
}

export default CheckBox;
