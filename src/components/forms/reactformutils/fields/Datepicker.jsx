import React from "react";
// import { Field } from "formik";
import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import FieldDom from "./FieldDom";
import { useTranslation } from "react-i18next";

function DatePicker(props) {
  let {
    fieldDef,
    control,
    required,
    name,
    options,
    editable,
    formMethods,
    field_title,
    isMulti,
    dateRange,
    ...rest
  } = props;
  const { t } = useTranslation("common");
  if (!fieldDef) fieldDef = {};
  function formatDate(jsonDate) {
    if (!jsonDate) return "";
    const date = new Date(jsonDate);

    const getYear = date.toLocaleDateString("default", { year: "numeric" });
    const getMonth = date.toLocaleDateString("default", { month: "2-digit" });
    const getDay = date.toLocaleDateString("default", { day: "2-digit" });
    const formattedDate = getYear + "-" + getMonth + "-" + getDay;
    return formattedDate;
  }
  const pagepath = window.parent.location.pathname;
  const parentPath = window.parent.location.href.includes("project");

  function getPastDate() {
    if (dateRange == true) {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 18);
      return formatDate(date);
    } else if (dateRange == "pastDate") {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return formatDate(yesterday);
    } else if (dateRange == "priortoToday") {
      const today = new Date();
      today.setDate(today.getDate());
      return formatDate(today);
    }
  }

  function getfutureDate() {
    if (dateRange === "futureDate") {
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 1);
      return formatDate(futureDate);
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      // rules={{
      //   required: {
      //     value: required,
      //     message: (pagepath === '/form/reportdesigner' || parentPath === true)
      //       ? `${name} is Required`
      //       : `${props.fieldDef.field_title} is Required`

      //   },

      //   // minLength: {
      //   //   value: 2,
      //   //   message: "Your name must be at least 2 characters"
      //   // }

      // }}
      rules={{
        required: {
          value: required && editable,
          message: `${t(field_title)} ${t("is required")}!`,
        },
      }}
      render={({ field, fieldState, formState }) => {
        if (props.type == "date") field.value = formatDate(field.value);

        return (
          <FieldDom {...props} {...fieldState}>
            {editable && (
              <Form.Control
                size="lg"
                className={editable && required && "mandatory"} //"border-start border-primary border-4"
                isInvalid={Boolean(
                  (fieldState.isTouched || formState.submitCount > 0) &&
                    fieldState.error
                )}
                // isInvalid={
                //   Boolean(
                //     (fieldState.isTouched ||formState.submitCount>0) &&
                //       formState.errors[name]?.message
                //   )
                // }
                max={getPastDate()}
                min={getfutureDate()}
                {...field}
                {...rest}
                onChange={(e) => {
                  field.onChange(e);

                  props.form?.change.forEach((element) => {
                    element(e.target.value, e.target.name.split(".")[1]);
                  });
                }}
              />
            )}
            {!editable && <div>{field.value ? field.value : "--"}</div>}
          </FieldDom>
        );
      }}
    />
  );
}

export default DatePicker;

// import React from "react";
// import { Controller } from "react-hook-form";
// import { Form } from "react-bootstrap";
// import FieldDom from "./FieldDom";

// function Input(props) {
//   let { control, required, name, formMethods, ...rest } = props;

//   function formatTime(jsonTime) {
//     if (jsonTime === "" || jsonTime === undefined) return "";
//     const time = new Date(jsonTime);
//     const formattedTime = time.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     });
//     return formattedTime;
//   }

//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={{
//         required: {
//           value: required,
//           message: `${name} is required!`,
//         },
//       }}
//       render={({ field, fieldState }) => {
//         field.value = formatTime(field.value);

//         return (
//           <FieldDom {...props} {...fieldState}>
//             <Form.Control
//               size="lg"
//               className={required && "mandatory"}
//               isInvalid={
//                 Boolean(
//                   (fieldState.isTouched || formMethods.formState.submitCount > 0) &&
//                     fieldState.error
//                 )
//               }
//               {...field}
//               {...rest}
//               type="time" // Set the input type to "time" for time picker
//               onChange={(e) => {
//                 field.onChange(e);
//                 console.log("Value", e.target.value);
//                 console.log("Value", props.form?.change);
//                 props.form?.change.forEach((element) => {
//                   element(e.target.value);
//                 });
//               }}
//             />
//           </FieldDom>
//         );
//       }}
//     />
//   );
// }

// export default Input;
