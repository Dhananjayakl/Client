import React from "react";
import { useEffect, useState, useReducer, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import FieldDom from "./FieldDom";
import { Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import { Row } from "react-bootstrap";
import { FilteredOptions } from "./SselectFilter";
import { WithoutFilter } from "./SselectWithoutFilter";
import useTheme from "../../../../hooks/useTheme";
import { DependencyFields } from "./SselectDepdency";
import { useTranslation } from "react-i18next";
import { MenuOnChange } from "src/redux/slices/SselectDependency";
function SSelect(props) {
  const {
    fieldDef,
    label,
    name,
    helptext,
    tooltip,
    disabled,
    required,
    visible,
    formMethods,
    formid,
    colum,
    fieldProps,
    formMetaData,
    disableDrop,
    value,
    FieldValue,
    editable,
    field_title,
    defaultvalue,
    ObjectId,
    setData,
    dropDown,
    trimmedValue,
    zIndex,
    FilterOption,
    textColor,
    customChange,
    closeButton,
    dropDownFlag,
    customDropdown,
    ...rest
  } = props;
  console.log(customDropdown, "custom dropdown");

  let isMulti = formMetaData?.fields?.[name]?.is_multi_select ? true : false;
  const field_name = name;
  const { t } = useTranslation("common");
  let currentValue = useRef("");
  let previousValue = useRef("");
  const lastDotIndex = field_name.lastIndexOf(".");
  let Counters = 10;
  let firstDotIndex = field_name.split(".");
  let indexVal = parseInt(firstDotIndex[1]);
  //console.log(dropDown, "custom drop down");
  const extractedFieldName =
    lastDotIndex !== -1 ? field_name.slice(lastDotIndex + 1) : field_name;
  let lastIndex = name.lastIndexOf(".");
  let extractedSubstring = name.substring(0, lastIndex + 1);
  console.log(
    extractedFieldName,
    "-extractedfieldname",
    extractedSubstring,
    "-extractedsubstring",
    "testing-field-name",
    formMetaData
  );
  console.log(formMetaData.dependencyFields, "depend--fields");
  let [options, setOptions] = useState([]);
  const [fieldStateValue, setFieldStateValue] = useState();
  const { theme, setTheme } = useTheme(); //theme is used either dark or light
  const [counters, setCounters] = useState(10);
  const [mainOnchangeFlag, setMainOnchangeFlag] = useState(false);
  const FieldValueWatch = useWatch({
    name: name,
    control: props.control,
  });
  let menuDispatch = useDispatch();

  let MenuOnChangeFlag = useSelector((state) => state.MenuChange.value);
  const DependencyFieldCall = (
    // this function check the dependecy fields and check its child value and upate its value based on the parent field for single select there is no change for multi select it calls another function
    formMetaData,
    DependencyFields,
    value,
    name,
    extractedFieldName,
    extractedSubstring,
    formid,
    childFieldName
  ) => {


    if (childFieldName && isMulti == false) {
      formMethods.setValue(childFieldName, "");
    }
    if (childFieldName && isMulti == true) {
      console.log("called the multi select test here",name);
      
      let childFieldValue = formMethods.getValues(childFieldName);
      DependencyFields(
        FieldValueWatch,
        name,
        childFieldName,
        formid,
        childFieldName,
        childFieldValue,
        formMetaData.fields[childFieldName].filter_expression,
        formMethods,
        extractedFieldName,
        extractedSubstring
      );
    }
  };
  let customStyles;
  console.log(options, "options--123");
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

      singleValue: (provided, state) => ({
        ...provided,
        color: theme === "dark" ? "white" : "black", // Change the font color for the selected value
        // Add any other styles as needed
      }),
    };
  }
  useEffect(() => {
    if (
      formMetaData &&
      formMetaData?.dependencyFields &&
      MenuOnChangeFlag == true
    ) {
      console.log(formMetaData.dependencyFields, "depend--fields");

      formMetaData.dependencyFields.forEach((items) => {
        if (items[name]) {
          let childFieldName = items[name];
          DependencyFieldCall(
            formMetaData,
            DependencyFields,
            value,
            name,
            extractedFieldName,
            extractedSubstring,
            formid,
            childFieldName
          );
        }
      });
    }
  }, [FieldValueWatch, MenuOnChangeFlag]);
  function fetchOptions(state, action) {
    switch (action.type) {
      case "GEToPTIONS":
        console.log(state, action, "initial-action");

        return [
          FilteredOptions(
            formid,
            name,
            "",
            extractedFieldName,
            extractedSubstring,
            formMetaData,
            formMethods,
            colum
          ),
        ];
    }
  }
  console.log(options, "reduced-options");
  let InfiniteLoad = () => {
    setCounters((prevCounter) => {
      return prevCounter + 10;
    });
  };
  let InputLoad = (input) => {
    if (formMetaData.fields[extractedFieldName].filter_expression) {
      FilteredOptions(
        formid,
        name,
        input ? input : "",
        extractedFieldName,
        extractedSubstring,
        formMetaData,
        formMethods,
        colum,
        setOptions,
        counters
      );
    } else {
      console.log("without-filter-stage1");

      WithoutFilter(
        formid,
        name,
        input ? input : "",
        extractedFieldName,
        setOptions,
        counters
      );
    }
  };
  useEffect(() => {
    if (counters) {
      if (formMetaData.fields[extractedFieldName].filter_expression) {
        FilteredOptions(
          formid,
          name,
          "",
          extractedFieldName,
          extractedSubstring,
          formMetaData,
          formMethods,
          colum,
          setOptions,
          counters
        );
      } else {
        console.log("without-filter-stage1");

        WithoutFilter(
          formid,
          name,
          "",
          extractedFieldName,
          setOptions,
          counters
        );
      }
    }
  }, [counters]);
  console.log(editable, visible, "servger-side-edit");
  console.log(formMetaData);

  return (
    <>
      <Controller
        name={name}
        control={props.control}
        rules={{
          required: {
            value: required && editable,
            message: `${t(field_title)} ${t("is required!")}`,
          },
        }}
        render={({ field, fieldState }) => {
          console.log(field.value, name, "field-current-value");

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
                margin: "0px",
                backgroundColor: isFocused ? "rgba(25,103,210,255)" : "",
                color:
                  theme == "dark"
                    ? "white"
                    : (theme == "default" && isFocused) ||
                      (theme == "light" && isFocused == true)
                    ? "white"
                    : "dark",
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
            <Row>
              <FieldDom
                {...props}
                {...fieldState}
                {...field}
                fieldProps={fieldProps}
              >
                {editable && visible && (
                  <Select
                    as="select"
                    {...field}
                    {...rest}
                    value={field.value}
                    styles={combinedStyles}
                    options={customDropdown ? customDropdown : options}
                    menuPortalTarget={zIndex == true ? document.body : ""}
                    hideSelectedOptions={true}
                    isClearable={closeButton}
                    menuShouldBlockScroll={zIndex == true ? true : false}
                    menuShouldScrollIntoView={false}
                    menuPlacement="auto"
                    onMenuScrollToBottom={!customDropdown ? InfiniteLoad : ""}
                    isMulti={isMulti}
                    onInputChange={(value) => {
                      if (!customDropdown && !customDropdown?.length > 0) {
                        InputLoad(value);
                      }
                    }} // as the user types it updates to the state
                    onMenuOpen={() => {
                      if (!customDropdown && !customDropdown?.length > 0) {
                        if (
                          formMetaData.fields[extractedFieldName]
                            .filter_expression
                        ) {
                          console.log("with-filter-stage1", name);
                          FilteredOptions(
                            formid,
                            name,
                            "",
                            extractedFieldName,
                            extractedSubstring,
                            formMetaData,
                            formMethods,
                            colum,
                            setOptions
                          );
                        } else {
                          console.log("without-filter-stage1", name);

                          WithoutFilter(
                            formid,
                            name,
                            "",
                            extractedFieldName,
                            setOptions
                          );
                        }
                      }
                    }}
                    onChange={(value) => {
                      menuDispatch(MenuOnChange(true));
                      setMainOnchangeFlag(true);
                      if (isMulti == true) {
                        field.onChange(value);
                        props.form?.change.forEach((element) => {
                          element(value);
                        });
                      }
                      if (isMulti == false) {
                        field.onChange(value);
                        if (previousValue.current == "" && field.value) {
                          previousValue.current = field.value;
                        } else {
                          previousValue.current = currentValue.current;
                        }
                        currentValue.current = value.value;

                        let combinedValues = previousValue.current;

                        props.form?.change.forEach((element) => {
                          element(
                            value,
                            props.name.split(".")[1],
                            previousValue.current
                          );
                        });
                      }
                    }}
                  />
                )}
                {!editable && visible && (
                  <div
                  // className="overflow - y - scroll"
                  // style={{ maxHeight: "100px", overflowY: "auto" }}
                  >
                    {field.value ? (
                      isMulti ? (
                        <>
                          {/* <span>inside multi matching option</span> */}
                          <ul>
                            {field?.value?.map((items, index) => (
                              <li key={index}>{items.label}</li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <>
                          {field.value && (
                            <span
                              style={{ color: "rgb(108, 117, 125)" }}
                              className={textColor ? "text-dark" : ""}
                            >
                              {field.value.label
                                ? field.value.label
                                : field.value[0]?.label}
                            </span>
                          )}
                        </>
                      )
                    ) : (
                      <span>--</span>
                    )}
                  </div>
                )}
                {!field.value &&
                  fieldState.error &&
                  fieldState.error.message &&
                  editable && (
                    <div className="validation">{fieldState.error.message}</div>
                  )}
              </FieldDom>
            </Row>
          );
        }}
      />
    </>
  );
}

export default SSelect;
