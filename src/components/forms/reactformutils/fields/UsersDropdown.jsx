import React, { useState, useEffect, useRef, useMemo } from "react";
import Select from "react-select";
import FieldDom from "./FieldDom";
import { useForm, Controller, useWatch } from "react-hook-form";
import useTheme from "../../../../hooks/useTheme";
import { Form, ListGroupItem, ModalHeader, Row, Col } from "react-bootstrap";
import axios from "src/utils/AxiosInstance";
import users from "../../../../assets/img/avatars/noUser.png";
import { components } from "react-select";
import { Image, Shimmer, Breathing } from "react-shimmer";

const UsersDropdown = (props) => {
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
    isMulti,
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
    FilteredOptions,
    textColor,
    customChange,
    closeButton,
    fieldProps,
    dropDownFlag,
    ...rest
  } = props;
  const { theme, setTheme } = useTheme();
  const [fieldStateValue, setFieldStateValue] = useState();
  const [options, setOptions] = useState([]);
  const [initialLoadFlag, setInitialLoadFlag] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const [counters, setCounters] = useState(10);
  const [inputValue, setInputValue] = useState("");
  let initialLoad = false;
  let ParentFieldValue = useWatch({
    name: formMetaData.fields[name]?.business_unit_name
      ? formMetaData.fields[name].business_unit_name
      : "",
    control: formMethods.control,
  });
  const ParentFieldName = formMetaData?.fields[name]?.business_unit_name
    ? formMetaData?.fields[name]?.business_unit_name
    : "";
  let customStyles;
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
  let removeArray = (businessUnit) => {
    // if(typeof(businessUnit)=="object"){}
    if (businessUnit?.length > 0) {
      return `${businessUnit?.join(",")}`;
    } else {
      return "";
    }
  };
  async function ApiCall(businessUnit, imageLoad, serachString) {
    console.log(businessUnit, "api-business-unit");

    if (Array.isArray(businessUnit)) {
      businessUnit = businessUnit.map((items) => {
        return items?.value ? items.value : items;
      });
      businessUnit = businessUnit.join(",");
    }
    // console.log(field_name, "fetch5");

    try {
      const response = await axios.post("/form/fetchDataSourceInfo", {
        formId: formid,
        columnName: colum,
        searchString: serachString ? serachString : "",
        filterExpression: "",
        orderExpression: "",
        pageSize: counters,
        businessUnitValues: businessUnit,
        includeImage: initialLoadFlag,
      });

      const data = await response.data;
      console.log("data--user", data);
      let insertArray;
      insertArray = data.map((items) => {
        console.log(items.image, "image-item");

        return {
          value: items.value,
          label: items.label,
          image:
            items.image == "noimage"
              ? "noimage"
              : items.image == "loading"
              ? "loading"
              : `data:image/jpeg;base64,${items.image}`,
        };
      });
      setInitialLoadFlag(true);
      console.log(insertArray, "insert--revan");

      setOptions(insertArray);
    } catch (error) {
      setOptions([]);
      console.error("Api-failed");
    }
  }

  const FetchParentFieldValues = (imageLoad) => {
    let Field = formMetaData?.fields[name]?.business_unit_name;
    if (Field) {
      console.log(Field, "ninja-zx10r");

      let BusinessUnits = formMethods.getValues("businessUnit");
      if (Array.isArray(BusinessUnits)) {
        BusinessUnits = BusinessUnits?.map((items) => {
          return items.value;
        });
      }
      console.log(BusinessUnits, "Business-unit-name");

      if (BusinessUnits) {
        ApiCall(BusinessUnits, imageLoad, inputValue);
      }
    } else {
      console.log("called else");

      ApiCall("", imageLoad, inputValue);
    }
  };
  useEffect(() => {
    function LoadingImageCheck(element, index, array) {
      return element.image == "loading";
    }
    if (options.length > 0 && options.some(LoadingImageCheck)) {
      let imageLoad = true;
      console.log("refetcher", name);

      FetchParentFieldValues(ParentFieldValue, imageLoad, inputValue);
    }
  }, [options]);
  useEffect(() => {
    ApiCall(ParentFieldValue, true, inputValue);
  }, [ParentFieldValue]);
  const MultiValueLabel = (props) => {
    const { data } = props; // Extract the data prop to access label and value
    return (
      <components.MultiValueLabel {...props}>
        {data.label} {/* Only display the label */}
      </components.MultiValueLabel>
    );
  };
  const InfiniteLoad = () => {
    setCounters((prevCounters) => {
      return prevCounters + 10;
    });
  };
  useEffect(() => {
    console.log("calling-counter");

    FetchParentFieldValues();
  }, [counters]);
  return (
    <>
      <Controller
        name={name}
        control={props.control}
        rules={{
          required: {
            value: required && editable,
            message: `${field_title} is required!`,
          },
        }}
        defaultValue={""}
        render={({ field, fieldState }) => {
          console.log(field.value, "user-field-value");

          let message;
          if (fieldState) {
            message = fieldState.error;
          }
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
            <>
              <Row>
                <FieldDom
                  {...props}
                  {...fieldState}
                  {...field}
                  fieldProps={fieldProps}
                >
                  {editable && visible && (
                    <>
                      <Row className="">
                        <Select
                          as="select"
                          {...field}
                          {...rest}
                          // ref={SelectRef}
                          // isClearable={closeButton}
                          //   menuIsOpen={true}

                          hideSelectedOptions={true}
                          components={{ MultiValueLabel }}
                          menuPortalTarget={zIndex == true ? document.body : ""}
                          menuShouldScrollIntoView={false}
                          menuShouldBlockScroll={zIndex == true ? true : false}
                          onMenuOpen={() => {
                            if (initialLoadFlag == false) {
                              console.log("called-api-1");
                              FetchParentFieldValues();
                            }
                          }}
                          openMenuOnFocus={true}
                          // onMenuScrollToBottom={dropDownLoad}
                          menuPlacement="auto"
                          closeMenuOnSelect={isMulti == true ? false : true}
                          onMenuScrollToBottom={InfiniteLoad}
                          // isLoading={loadingFlag && menuIsOpenFlag}
                          // backspaceRemovesValue={true}
                          styles={combinedStyles}
                          // isOptionDisabled={(option) => option.isdisabled}
                          options={options} // here from the state we got(setoptions) we are setting here directly
                          value={field.value} //here the option we selected form thr dropdown will be given by the state
                          onChange={(value) => {
                            setSelectedOption(value);
                            if (isMulti == true) {
                              if (value.length > 0) {
                                const selectedValues = value.map((item) => {
                                  return {
                                    value: item.value,
                                    label: item.label,
                                  };
                                });
                                field.onChange(value);
                                props.form?.change.forEach((element) => {
                                  element(value);
                                });
                              } else {
                                field.onChange("");
                                props.form?.change.forEach((element) => {
                                  element("");
                                });
                              }
                            }
                            if (isMulti == false) {
                              // field.onChange({
                              //   value: value.value,
                              //   label: value.label,
                              // });
                              field.onChange(value);
                              props.form?.change.forEach((element) => {
                                element(value);
                              });
                            }
                          }}
                          inputValue={inputValue} // Pass the inputValue to the Select component
                          onInputChange={
                            (value) => {
                              ApiCall(ParentFieldValue, true, value);
                              setInputValue(value);
                            }
                            // Call the API with the updated input value
                          } // as the user types it updates to the state
                          isMulti={isMulti}
                          formatOptionLabel={(option) => {
                            console.log(option, "option-label");

                            return (
                              <>
                                <Row className="">
                                  {option?.image === "loading" ? (
                                    <Col
                                      xs={3}
                                      md={3}
                                      sm={3}
                                      lg={3}
                                      xl={3}
                                      className="ps-1 m-0"
                                    >
                                      <div
                                        className=""
                                        style={{
                                          width: "50px", // Adjusted to match the intended circular shape
                                          height: "50px",
                                          borderRadius: "50%",
                                          overflow: "hidden",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          backgroundColor: "grey", // Optional: background in case of missing image
                                        }}
                                      >
                                        {/* <ShimmerCircularImage /> */}

                                        <Breathing />
                                      </div>
                                    </Col>
                                  ) : (
                                    <Col
                                      xs={3}
                                      md={3}
                                      sm={3}
                                      lg={3}
                                      xl={3}
                                      className="m-0 d-flex"
                                    >
                                      <div
                                        style={{
                                          width: "50px", // Adjusted to match the intended circular shape
                                          height: "50px",
                                          borderRadius: "50%",
                                          overflow: "hidden",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          backgroundColor: "#f0f0f0", // Optional: background in case of missing image
                                        }}
                                      >
                                        <img
                                          src={
                                            option?.image == "noimage"
                                              ? users
                                              : option.image
                                          } // Defaulting to `users` if `option?.image` is undefined
                                          alt="profile"
                                          style={{
                                            width: "100%", // Ensure it covers the parent container
                                            height: "100%",
                                            objectFit: "cover",
                                          }}
                                        />
                                      </div>
                                    </Col>
                                  )}

                                  <Col className="">
                                    <div style={{ fontSize: "12px" }}>
                                      {option.label}
                                    </div>
                                  </Col>
                                </Row>
                              </>
                            );
                          }}
                        />
                      </Row>
                    </>
                  )}
                  {!editable && visible && (
                    <div
                    // className="overflow - y - scroll"
                    // style={{ maxHeight: "100px", overflowY: "auto" }}
                    >
                      {field.value && field.value.length > 0 ? (
                        isMulti ? (
                          <>
                            {/* <span>inside multi matching option</span> */}
                            <ul>
                              {field.value.map((items, index) => (
                                <li key={index}>
                                  {!editable && items.label?.length > 50 ? (
                                    <div
                                      onMouseEnter={handleMouseEnter}
                                      onMouseLeave={handleMouseLeave}
                                    >
                                      {editable &&
                                        items.label?.length > 50 &&
                                        trimmedValue &&
                                        isTooltipVisible == false &&
                                        `${items.label.substring(0, 50)}..More`}
                                      {isTooltipVisible && (
                                        <div>{items.label}</div>
                                      )}
                                    </div>
                                  ) : (
                                    items.label
                                  )}
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <>
                            {field.value.map((item, index) => (
                              <span
                                style={{ color: "rgb(108, 117, 125)" }}
                                className={textColor ? "text-dark" : ""}
                              >
                                {item.label}
                              </span>
                            ))}
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
                      <div className="validation">
                        {fieldState.error.message}
                      </div>
                    )}
                  {/* Fields={field} */}
                </FieldDom>
              </Row>
            </>
          );
        }}
      />
    </>
  );
};

export default UsersDropdown;
