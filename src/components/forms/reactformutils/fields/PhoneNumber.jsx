import FieldDom from "./FieldDom";
import { PhoneNumberUtil } from "google-libphonenumber";
import { PhoneInput, parseCountry } from "react-international-phone";
import "react-international-phone/style.css";

import useTheme from "../../../../hooks/useTheme";
import { useState, useRef, useEffect } from "react";

import { Controller } from "react-hook-form";
// import { zIndex } from "html2canvas/dist/types/css/property-descriptors/z-index";

function PhoneNumber(props) {
  const { theme, setTheme } = useTheme();

  // console.log(props);

  const {
    name,
    label,
    control,
    options,
    helptext,
    tooltip,
    required,
    visible,
    formMethods,
    form,
    editable,
    field_title,
    isMulti,
    textColor,
    ...rest
  } = props;
  const phoneNumRef = useRef(null);
  console.log(phoneNumRef.current, "phone num ref");
 
  let customStyles;
  const phoneUtil = PhoneNumberUtil.getInstance();
  const isPhoneValid = (phone) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
      return required ? true : false;
    }
  };
  

  const themeClass = theme === "dark" ? "phone-dark-mode" : "phone-light-mode";
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required && editable,
          message: `${field_title} is required!`,
        },

        validate: {
          isValidCheck: (value) =>{
            if(!value){
              // formMethods.clearErrors()
              return true
            }
            let phoneValid=isPhoneValid(value)
            console.log(phoneValid,"phone-valid");
            
           return phoneValid || "Invalid PhoneNumber."
          }
        },
      }}
      render={({ field, fieldState, formState }) => {
        let message;
        console.log(fieldState, "state is here");
        console.log(field.value, "number value");
        if (fieldState) {
          message = fieldState.error;
        }
        console.log(message, "e2 message");
        let borderStyles = {
          borderLeft:
            (fieldState.error &&
              fieldState.error.message &&
              "4px solid rgb(217, 83, 79)") ||
            (required && editable && "4px solid #3266bb"),
          borderRadius: "7px",
        };

        if (field.value == null) {
          field.value = "";
        }
   

        return (
          <FieldDom {...props} {...fieldState} {...field}>
            {editable && (
              <PhoneInput
                ref={phoneNumRef}
                {...field}
                value={field.value}
                className={`${themeClass} ${
                  editable && required
                    ? fieldState.error
                      ? "react-phone-input-danger react-international-phone-country-selector-button"
                      : "react-phone-input-noDanger"
                    : "react-phone-input-noRequired"
                }`}
                isInvalid={
                  (message && !field.value) || field.value.length > 4
                    ? true
                    : false
                }
                {...field}
                {...rest}
                style={borderStyles}
                inputStyle={{ width: "100%" }}
                preferredCountries={"in,us"}
                defaultCountry="in"
                // disableDialCodePrefill={false}
                disableDialCodeAndPrefix={true}
                onChange={(value) => {
                  console.log(value, "on changed value in--phone");
                  if (value.length <= 4) {
                    field.onChange("");
                  } else {
                    field.onChange(value);
                  }
                
                }}
              />
            )}
            {!editable && (
              <div
                style={{ color: "rgb(108, 117, 125)" }}
                className={textColor ? "text-dark" : ""}
              >
                {field.value ? field.value : "--"}
              </div>
            )}

            {message && (
              <div className="error-message text-danger mt-1 p-0" style={{ fontSize: '10.56px' }} >
                {fieldState.error.message}
              </div>
            )}
          </FieldDom>
        );
      }}
    />
  );
}

export default PhoneNumber;
