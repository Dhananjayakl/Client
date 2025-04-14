import React, { useState, useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Col, Form, Row } from "react-bootstrap";
import FieldToolTip from "./FieldToolTip";
import FieldDom from "./FieldDom";
import Select from "react-select";
import { useDebounce } from "use-debounce";
import axios from "src/utils/AxiosInstance";
import CreatableSelect from "react-select/creatable";
import useTheme from "../../../../hooks/useTheme";
var DynamicArray = [];
import { useTranslation } from "react-i18next";

function getdependentvalues(
  formid,
  name,
  inputValue,
  setOption,
  formMethods,
  formMetaData,
  extractedFieldName,
  extractedSubstring
) {
  console.log(
    extractedFieldName,
    formMetaData.fields[extractedFieldName].filter_expression,
    "extractor"
  );
  if (formMetaData.fields[extractedFieldName].filter_expression != null) {
    async function callbackend() {
      const regex = /:(\w+)/g;
      const matches = [];
      let match;
      try {
        if (
          (match = regex.exec(
            formMetaData.fields[extractedFieldName].filter_expression
          )) !== null
        ) {
          matches.push({
            name: match[1],
            value: extractedSubstring
              ? formMethods.getValues(extractedSubstring + match[1])
              : formMethods.getValues(match[1]),
          });
        }
        console.log(matches, "matcher1");
        let insertArray = [];
        if (Array.isArray(matches) == true) {
          let mulParts =
            formMetaData.fields[extractedFieldName].filter_expression;

          for (let i = 0; i < matches.length; i++) {
            if (Array.isArray(matches[i].value) == true) {
              mulParts = mulParts.replace(
                `:${matches[i].name}`,
                `(${matches[i].value})`
              );
            } else {
              mulParts = mulParts.replace(
                `:${matches[i].name}`,
                matches[i].value
              );
            }
          }
          if (mulParts.includes("undefined")) {
            mulParts = formMetaData.fields[name].filter_expression;
          }
          const response = await axios.get(
            `/form/fetchDataSourceInfo?formId=${formid}&columnName=${extractedFieldName}&searchString=${inputValue}&pageSize=10&filterExpression=${mulParts}`
          );
          const data = await response.data;
          console.log(data, "data of option");
          for (let j = 0; j < data.length; j++) {
            insertArray.push({
              value: data[j].key,
              label: data[j].value,
            });
          }
          DynamicArray.push({ name: match[1] });
          setOption(insertArray);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }
    callbackend();
  }
}

function PicklistSelect(props) {
  const {
    fieldDef,
    label,
    control,
    name,
    helptext,
    tooltip,
    disabled,
    required,
    visible,
    formMethods,
    options,
    formid,
    colum,
    isMulti,
    formMetaData,
    disableDrop,
    value,
    editable,
    textColor,
    zIndex,

    ...rest
  } = props;
  const { t } = useTranslation("common");
  const field_name = name;
  const dotStyle = (colors) => ({
    alignItems: "center",
    display: "flex",
    backgroundColor: colors,
    borderRadius: 10,
    flexShrink: 0,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 13,
    width: 13,
  });
  const lastDotIndex = field_name.lastIndexOf(".");
  const extractedFieldName =
    lastDotIndex !== -1 ? field_name.slice(lastDotIndex + 1) : field_name;
  console.log(extractedFieldName, "extracted name");
  let createOptions = formMetaData.fields[extractedFieldName].create_options;
  console.log(createOptions, "create options are here");
  const { theme, setTheme } = useTheme();
  console.log(name, "picklistname");
  const createOption = (item) => {
    console.log(item, "functionItem");
    return {
      value: item.key,
      label: item.value,
    };
  };

  //  console.log(name,"title name")

  //  console.log(formMetaData.dataSourceResponse[0][name][0],"metadata")

  const [selectedOption, setSelectedOption] = useState(null); // it holds the selected option from the dropdown
  const [option, setOption] = useState([]); // Initialize options as an empty array
  const [inputValue, setInputValue] = useState(""); // input value that we enter
  const [initial, setInitial] = useState("");
  const [field, setfield] = useState("");
  const [matchingOption, setMatchingOption] = useState("");
  const [filteredoptions, setfilteredoptions] = useState();
  const [picklistOptions, setpicklistOptions] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [fieldStateValue, setFieldStateValue] = useState();
  const [createFlag, setCreateFlag] = useState(false);
  const [handlefocusFlag, setHandleFocusFlag] = useState(false);
  let customStyles;
  const fieldData = useWatch({ name: name, control: control });
  if (theme == "dark") {
    customStyles = {
      control: (provided, state) => ({
        ...provided,
        backgroundColor: "rgba(41,48,66,255)",
        boxShadow:
          fieldStateValue &&
          fieldStateValue.message &&
          state.isFocused &&
          field == ""
            ? "2px solid red"
            : " ", // Remove default border on focus
        border:
          fieldStateValue && fieldStateValue.message && !fieldStateValue.value
            ? "1px solid red"
            : "1px solid rgb(84, 89, 104)",
        borderLeft:
          (fieldStateValue &&
            fieldStateValue.message &&
            !fieldStateValue.value &&
            "4px solid rgb(217, 83, 79)") ||
          (required && editable && "4px solid rgb(50, 102, 187)"),
      }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
          ...styles,
          backgroundColor: isFocused ? "rgba(25,103,210,255)" : "",
          color: isFocused ? "white" : "black",
        };
      },
      singleValue: (provided, state) => ({
        ...provided,
        color: theme === "dark" ? "white" : "black", // Change the font color for the selected value
        // Add any other styles as needed
      }),
    };
  }
  // (formMetadata.formmeta.form_id)
  useEffect(() => {
    const filteredoptions = options?.filter((option) => option.active == true);
    console.log(filteredoptions, "filz");
    if (filteredoptions && filteredoptions.length > 0) {
      setOption(
        filteredoptions.map((option) => ({
          label: option.value,
          value: option.key,
          color: option.value_color,
        }))
      );
      // setOption(picklistOptions)
    }
  }, [options]);
  console.log(option, "forza");

  if (formMetaData.dataSourceResponse[0] && selectedOption == null) {
    const swapped = formMetaData.dataSourceResponse
      .map((data) => {
        // here i am using tfhe map to iterate the each item present in the dataSourceResponse
        const meta = data[name];

        if (meta && meta.length > 0) {
          return meta.map((item) => ({
            label: item.value,
            value: item.key,
          }));
        }
        return [];
      })
      .flat();

    if (swapped.length > 0) {
      setSelectedOption(swapped);
    }
  }

  //  formMethods.setValue(name,351)
  let lastIndex = name.lastIndexOf(".");
  let extractedSubstring = name.substring(0, lastIndex + 1);
  const handleFocus = () => {
    if (formMetaData.fields[extractedFieldName].filter_expression != null) {
      getdependentvalues(
        formid,
        name,
        inputValue,
        setOption,
        formMethods,
        formMetaData,
        extractedFieldName,
        extractedSubstring
      );
      // Call your function or perform any action here
    }
  };
  const handleCreate = (inputValue) => {
    console.log(inputValue, "createInput");
    setIsLoading(true);

    // const newOption = createOption(inputValue);

    setIsLoading(false);
    async function callbackend() {
      try {
        const response = await axios.post(
          `form/createNewPicklistValue?formId=${formid}&columnName=${extractedFieldName}`,
          {
            value: inputValue,
          }
        );
        console.log(response, "response axios");

        const data = await response.data;
        let finalData = createOption(data);
        setOption((prev) => [...prev, finalData]);
        // console.log(finalData,"f123tes");
        // setSelectedOption(finalData);
        // formMethods.setValue(name,finalData.value)

        console.log(data, "selected data");
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }
    callbackend(inputValue);
  };
  console.log(option, "creatableOption ");

  const pagepath = window.parent.location.pathname;
  const createMessage = () => {
    setCreateFlag(true);
  };
  const inputHandler = (value) => {
    setInputValue(value);
    setCreateFlag(false);
  };
  console.log(selectedOption, name, "picklist select");
  useEffect(() => {
    console.log(name, "harold das");
    console.log(options, "opt");
    let value = formMethods.getValues(name);
    console.log(value, "valler");
    if (Array.isArray(value) && value?.length > 0) {
      console.log("back up");
      const refinedValue = options
        .filter((item) => value.includes(item.key))
        .map((item) => ({
          label: item.value,
          value: item.key,
          display_order: item.display_order,
          parent_key: item.parent_key,
          score: item.score,
          value_color: item.value_color,
          guidence: item.guidence,
        }));
      console.log(refinedValue, name, "refined value");
      setSelectedOption(refinedValue);
      setHandleFocusFlag(true);
    } else {
      const refinedValue = options?.filter((items) => items.key == value);
      console.log(refinedValue, "refined value is here");

      let finalData = refinedValue?.map((item) => {
        return {
          label: item.value,
          value: item.key,
          display_order: item.display_order,
          parent_key: item.parent_key,
          score: item.score,
          value_color: item.value_color,
          guidence: item.guidence,
        };
      });
      if (finalData) {
        setSelectedOption(finalData);
        setHandleFocusFlag(true);
      }
      console.log(finalData, "final ref");
    }
  }, [fieldData]);
  console.log(selectedOption, name, "valorant");
  useEffect(() => {
    console.log(selectedOption, "selected options is here");

    if (
      (!selectedOption || selectedOption?.length == 0) &&
      fieldData &&
      handlefocusFlag == true
    ) {
      formMethods.setValue(name, "");
    }
  }, [selectedOption, fieldData, handlefocusFlag]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required && editable,
          message: fieldDef?.field_title
            ? `${t(fieldDef.field_title)} ${t("is required")}!`
            : `${t(name)} ${t("is required")}!`,
        },
      }}
      render={({ field, fieldState, formState }) => {
        console.log(field.value, "royce");

        setfield(field.value);
        setFieldStateValue(fieldState.error);
        const existingStyles = {
          control: (provided, state) => ({
            ...provided,
            boxShadow:
              fieldStateValue && fieldStateValue.message && state.isFocused
                ? // field.value == ""
                  "2px solid rgb(217, 83, 79)"
                : "", // Remove default border on focus
            className: "mandatory",
            border:
              fieldStateValue && fieldStateValue.message && !field.value
                ? "1px solid red"
                : "1px solid black",
            borderLeft:
              (fieldStateValue &&
                fieldStateValue.message &&
                !field.value &&
                "4px solid rgb(217, 83, 79)") ||
              (required && editable && "4px solid rgb(50, 102, 187)"),
          }),
          option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
              ...styles,
              backgroundColor: isFocused ? "rgba(25,103,210,255)" : "",
              color: isFocused ? "white" : "black",
            };
          },
          input: (styles) => {
            return { ...styles, color: theme == "dark" ? "white" : "black" };
          },
          menu: (styles) => {
            return {
              ...styles,
              backgroundColor: theme == "dark" ? "#293042" : "white",
            };
          },
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        };
        const combinedStyles =
          theme === "dark"
            ? {
                ...existingStyles,
                dropdownIndicator: (base) => ({
                  ...base,
                  display: disabled ? "none" : base.display,
                }),
                ...customStyles,
              }
            : existingStyles;

        return (
          <FieldDom {...props} {...fieldState}>
            {editable && (
              <>
                {/* {createOptions == true && createFlag == true && (
                 <Form.Label>
             Create an Option
               </Form.Label>
                )} */}
                {createOptions == true && (
                  <CreatableSelect
                    as="select"
                    size="lg"
                    className={required}
                    isInvalid={Boolean(
                      (fieldState.isTouched || formState.submitCount > 0) &&
                        fieldState.error
                    )}
                    {...field}
                    {...rest}
                    isDisabled={disabled}
                    openMenuOnClick={true}
                    menuPortalTarget={zIndex == true ? document.body : ""}
                    // openMenuOnFocus={true}
                    onMenuScrollToBottom={createMessage}
                    placeholder={createFlag == true ? "Create option" : ""}
                    isSearchable
                    isLoading={isLoading}
                    onFocus={handleFocus}
                    onCreateOption={handleCreate}
                    closeMenuOnSelect={isMulti == true ? false : true}
                    options={option} // here from the state we got(setoptions) we are setting here directly
                    value={matchingOption ? matchingOption : selectedOption} //here the option we selected form thr dropdown will be given by the state
                    inputValue={inputValue} // Pass the inputValue to the Select component
                    onInputChange={(value) => inputHandler(value)} // as the user types it updates to the state
                    onChange={(value) => {
                      setSelectedOption(value);
                      setCreateFlag(false);
                      field.onChange(value.value);

                      if (isMulti == true) {
                        const selectedValues = value.map((item) => item.value);

                        field.onChange(selectedValues);

                        props.form?.change.forEach((element) => {
                          element(value, name.split(".")[1]);
                        });
                      }
                      if (isMulti == false) {
                        field.onChange(value.value);
                        props.form?.change.forEach((element) => {
                          element(value.value);
                        });
                      }
                      // setInputValue(value.label);
                      // Set inputValue when an option is selected
                    }}
                    isMulti={isMulti}
                    // styles={{
                    //   dropdownIndicator: (base) => ({
                    //     ...base,
                    //     display: disabled ? "none" : base.display,
                    //   }),
                    // }}
                    styles={combinedStyles}
                  />
                )}

                {!createOptions && (
                  <Select
                    as="select"
                    size="lg"
                    className={required}
                    isInvalid={Boolean(
                      (fieldState.isTouched || formState.submitCount > 0) &&
                        fieldState.error
                    )}
                    {...field}
                    {...rest}
                    menuPortalTarget={document.body}
                    isClearable={true}
                    menuShouldScrollIntoView={false}
                    isDisabled={disabled}
                    hideSelectedOptions={true}
                    onFocus={handleFocus}
                    closeMenuOnSelect={isMulti == true ? false : true}
                    options={option} // here from the state we got(setoptions) we are setting here directly
                    formatOptionLabel={(option) => {
                      return (
                        <>
                          {isMulti == false ? (
                            option.color || option.value_color ? (
                              <>
                                <div className="d-flex">
                                  <div
                                    className="d-flex justify-content-center align-items-center p-0 m-0 mt-1 me-1"
                                    style={dotStyle(
                                      option.color
                                        ? option.color
                                        : option.value_color
                                    )}
                                  ></div>
                                  <div>
                                    <div>{option.label}</div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <span>{option.label}</span>
                            )
                          ) : (
                            <span>{option.label}</span>
                          )}
                        </>
                      );
                    }}
                    value={matchingOption ? matchingOption : selectedOption} //here the option we selected form thr dropdown will be given by the state
                    inputValue={inputValue} // Pass the inputValue to the Select component
                    onInputChange={(value) => setInputValue(value)} // as the user types it updates to the state
                    onChange={(value) => {
                      setSelectedOption(value);
                      field.onChange(value.value);

                      if (isMulti == true) {
                        const selectedValues = value.map((item) => item.value);

                        field.onChange(selectedValues);

                        props.form?.change.forEach((element) => {
                          element(value, name.split(".")[1]);
                        });
                      }
                      if (isMulti == false) {
                        field.onChange(value.value);
                        props.form?.change.forEach((element) => {
                          element(value.value);
                        });
                      }
                      // setInputValue(value.label);
                      // Set inputValue when an option is selected
                    }}
                    isMulti={isMulti}
                    // styles={{
                    //   dropdownIndicator: (base) => ({
                    //     ...base,
                    //     display: disabled ? "none" : base.display,
                    //   }),
                    // }}
                    styles={combinedStyles}
                  />
                )}
              </>
            )}
            {!editable &&
              selectedOption &&
              selectedOption.length > 0 &&
              isMulti && (
                <>
                  {/* <div>inside selected</div> */}
                  <ul>
                    {selectedOption.map((item, index) => (
                      <li
                        key={index}
                        className={textColor ? "text-dark" : ""}
                        style={{ color: "rgb(108, 117, 125)" }}
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            {!editable && selectedOption && isMulti == false && (
              <div style={{ color: "rgb(108, 117, 125)" }}>
                {selectedOption?.length > 0
                  ? selectedOption[0].label
                  : selectedOption.value}
              </div>
            )}
            {!field.value &&
              fieldState.error &&
              fieldState.error.message &&
              editable && (
                <div className="validation">{fieldState.error.message}</div>
              )}
          </FieldDom>
        );
      }}
    />
  );
}

export default PicklistSelect;
