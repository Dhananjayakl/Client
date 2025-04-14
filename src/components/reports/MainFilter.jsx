import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  Row,
  Col,
  Form,
  Button,
  Offcanvas,
  Card,
  InputGroup,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "../../../src/assets/scss/profile.scss";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
// import useTheme from "src/hooks/useTheme";

import AxiosInstance from "../../utils/AxiosInstance";
import useTheme from "src/hooks/useTheme";
import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/light.css";
import { useSelector } from "react-redux";
import moment from "moment";

const yearOptions = [
  { key: 2027, label: "2027" },
  { key: 2026, label: "2026" },
  { key: 2025, label: "2025" },
  { key: 2024, label: "2024" },
  { key: 2023, label: "2023" },
  { key: 2022, label: "2022" },
  { key: 2021, label: "2021" },
  { key: 2020, label: "2020" },
  { key: 2019, label: "2019" },
  { key: 2018, label: "2018" },
  { key: 2017, label: "2017" },
  { key: 2016, label: "2016" },
  { key: 2015, label: "2015" },
  { key: 2014, label: "2014" },
  { key: 2013, label: "2013" },
  { key: 2012, label: "2012" },
  { key: 2011, label: "2011" },
  { key: 2010, label: "2010" },
];

const fiscalyearOptions = [
  { key: 2027, label: "FY 2027-28" },
  { key: 2026, label: "FY 2026-27" },
  { key: 2025, label: "FY 2025-26" },
  { key: 2024, label: "FY 2024-25" },
  { key: 2023, label: "FY 2023-24" },
  { key: 2022, label: "FY 2022-23" },
  { key: 2021, label: "FY 2021-22" },
  { key: 2020, label: "FY 2020-21" },
  { key: 2019, label: "FY 2019-20" },
  { key: 2018, label: "FY 2018-19" },
  { key: 2017, label: "FY 2017-18" },
  { key: 2016, label: "FY 2016-17" },
  { key: 2015, label: "FY 2015-16" },
  { key: 2014, label: "FY 2014-15" },
  { key: 2013, label: "FY 2013-14" },
  { key: 2012, label: "FY 2012-13" },
  { key: 2011, label: "FY 2011-12" },
  { key: 2010, label: "FY 2010-11" },
];

const FilterColumnSelection = (props) => {
  const { reportmeta, yearProp } = props;
  const { theme, setTheme } = useTheme();
  const [filtershow, setFilterShow] = React.useState(false);
  const [filterExpressionMerge, setfilterExpressionMerge] = React.useState();
  const { setValue, control, handleSubmit } = useForm();
  const { t } = useTranslation("common");
  const [filtervisible, setFilterVisible] = useState(false);
  const [datarender, setDatarender] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { d_date_format, d_data_time_format } = useSelector(
    (state) => state.systemConfig.systemConfig
  );
  //  newValue = { value: 'value-to-set', label: 'Label for the value' };
  let RetrivedOption;
  let RetrivedMultipleOption = [];
  const [filtermeta, setfiltermeta] = useState();

  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [selectedKeys, setselectedKeys] = useState();
  // const FilterhandleClose = () => setFilterShow(false);

  let clearReport;
  let localreport;
  let localLocation;
  let fp = useRef(null);

  if (localStorage && localStorage.getItem("allData")) {
    clearReport = JSON.parse(localStorage.getItem("allData"));
    localreport = clearReport.report;
    localLocation = clearReport.location;
    //clearing the data present in the local storage based on the condition
    if (
      localreport != props.report ||
      localLocation != window.location.pathname
    ) {
      clearReport = JSON.parse(localStorage.getItem("allData"));

      localreport = clearReport.report;
      localStorage.removeItem("allData");
    }
  }

  useEffect(() => {
    const clearDataOnUnload = () => {
      localStorage.removeItem("allData");
    };
    const clearDataOnPathChange = () => {
      localStorage.removeItem("allData");
    };
    const handlePathChange = () => {
      clearDataOnPathChange();
    };
    const handleUnload = () => {
      clearDataOnUnload();
    };
    window.addEventListener("popstate", handlePathChange);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("popstate", handlePathChange);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);
  const FiltertoggleShow = () => {
    setFilterShow((s) => !s);
    setFilterVisible(!filtervisible);
    //
    const retrievedData = JSON.parse(localStorage.getItem("allData"));
    if (retrievedData) {
      const parsedData = retrievedData.submittedData;
      if (parsedData) {
        filtermeta &&
          filtermeta.forEach((items) => {
            if (items.filter_type == "Picklist Single Select") {
              selectOptions &&
                Array.isArray(selectOptions[items.filter_parameter]) &&
                selectOptions[items.filter_parameter].forEach((options) => {
                  if (parsedData[items.filter_parameter] == options.value) {
                    RetrivedOption = {
                      value: parsedData[items.filter_parameter],
                      label: options.label,
                    };
                    setValue(items.filter_parameter, RetrivedOption);
                  }
                });
            }
          });
      }
      filtermeta &&
        filtermeta.forEach((items) => {
          if (
            items.filter_type == "Picklist Single Select" ||
            items.filter_type === "Single Select Other Source"
          ) {
            selectOptions &&
              Array.isArray(selectOptions[items.filter_parameter]) &&
              selectOptions[items.filter_parameter].forEach((options) => {
                if (parsedData[items.filter_parameter] == options.value) {
                  RetrivedOption = {
                    value: parsedData[items.filter_parameter],
                    label: options.label,
                  };
                  setValue(items.filter_parameter, RetrivedOption);
                }
              });
          } else if (
            items.filter_type == "Picklist Multi Select" ||
            items.filter_type === "Multi Select Other Source"
          ) {
            selectOptions &&
              Array.isArray(selectOptions[items.filter_parameter]) &&
              selectOptions[items.filter_parameter].forEach((options) => {
                if (parsedData[items.filter_parameter]) {
                  parsedData[items.filter_parameter].forEach((values) => {
                    if (values == options.value) {
                      RetrivedOption = { value: values, label: options.label };
                      RetrivedMultipleOption.push(RetrivedOption);
                      setValue(items.filter_parameter, RetrivedMultipleOption);
                    }
                  });
                }
              });
          } else {
            setValue(
              items.filter_parameter,
              parsedData[items.filter_parameter]
            );
          }
        });
    }
  };
  useEffect(() => {
    if (props.reportmeta?.filters) {
      setfiltermeta(props.reportmeta.filters);
    }
  }, [props]);
  const [optionsFetched, setOptionsFetched] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const [selectOptions, setSelectOptions] = useState({});

  const [fieldValues, setFieldValues] = useState({});
  let matchedOption = [];
  let enhancedData;
  const onSubmit = (data) => {
    setfilterExpressionMerge(""); // Resetting filterExpressionMerge at the beginning

    if (data) {
      enhancedData = data;
      filtermeta &&
        filtermeta.forEach((item) => {
          if (
            item.filter_type == "Picklist Single Select" ||
            item.filter_type === "Single Select Other Source"
          ) {
            if (enhancedData[item.filter_parameter] != undefined) {
              if (enhancedData[item.filter_parameter]?.value) {
                enhancedData[item.filter_parameter] =
                  enhancedData[item.filter_parameter].value;
              }
            }
          }
          if (
            item.filter_type == "Picklist Multi Select" ||
            item.filter_type === "Multi Select Other Source"
          ) {
            if (enhancedData[item.filter_parameter] != undefined) {
              if (
                enhancedData[item.filter_parameter].every(
                  (item) =>
                    typeof item === "object" &&
                    "value" in item &&
                    "label" in item
                )
              ) {
                enhancedData[item.filter_parameter] = enhancedData[
                  item.filter_parameter
                ].map((item) => item.value);
              }
            }
          }
          // if (item.filter_type === "input") {
          //   if (enhancedData[item.filter_parameter] !== undefined) {
          //     enhancedData[item.filter_parameter] = `%${
          //       enhancedData[item.filter_parameter]
          //     }%`;
          //   }
          // }
          if (item.filter_type === "input") {
            if (enhancedData[item.filter_parameter] !== undefined) {
              const value = enhancedData[item.filter_parameter];

              if (value.includes("'")) {
                enhancedData[item.filter_parameter] = value;
              } else if (value) {
                enhancedData[item.filter_parameter] = `'%${value}%'`;
              }
            }
          }

          if (item.filter_type === "fiscal") {
            const selectedKeysArray = Array.isArray(
              enhancedData[item.filter_parameter]
            )
              ? enhancedData[item.filter_parameter].map((option) => option.key)
              : [];
            props.fiscalYearFilter(selectedKeysArray);
          }
        });
    }

    if (enhancedData) {
      const expressions = []; // Array to hold replaced expressions

      let expression;
      filtermeta &&
        filtermeta.forEach((items) => {
          if (items.filter_type != "fiscal") {
            expression = items.filter_expression;

            const replacedExpression = expression?.replace(/:\w+/g, (match) => {
              const key = match.substring(1);

              if (items.filter_type === "date" && enhancedData[key]) {
                const formattedDate = enhancedData[key];

                // Remove first and last parentheses
                // const modifiedDate = formattedDate.replace(/^\(|\)$/g, "");
                const modifiedDate = formattedDate?.replace(/^\((.*)\)$/, "$1");

                return modifiedDate;
              }

              if (
                enhancedData.hasOwnProperty(key) &&
                enhancedData[key] !== undefined
              ) {
                // Convert the value to a string and remove brackets if present
                const value = enhancedData[key].toString().replace(
                  // /[\[\]']+/g,
                  /\(([^()]+)\)/g,
                  ""
                ); // Removes square brackets
                // const value = enhancedData[key].toString();

                return value;
              }
              return ""; // Ensure to handle cases where the replacement might not exist
            });

            let modifiedExpression;

            if (
              (enhancedData[items.filter_parameter] !== "" ||
                enhancedData[items.filter_parameter] !== null ||
                enhancedData[items.filter_parameter] !== undefined) &&
              !(
                items.filter_type === "Single Select Other Source" ||
                items.filter_type === "Picklist Single Select" ||
                items.filter_type === "Multi Select Other Source" ||
                items.filter_type === "Picklist Multi Select"
              )
            ) {
              // modifiedExpression = replacedExpression.replace(
              //   // /\(([^)]+)\)/g,
              //   /\(([^()]+)\)/g,
              //   "'$1'"
              // );
              modifiedExpression = replacedExpression;
            }
            if (
              items.filter_type == "Single Select Other Source" ||
              items.filter_type == "Picklist Single Select"
            ) {
              modifiedExpression = replacedExpression;
            }
            if (
              items.filter_type == "Multi Select Other Source" ||
              items.filter_type == "Picklist Multi Select"
            ) {
              modifiedExpression = replacedExpression;
            }

            // if (items.filter_type == "fiscal") {
            //   modifiedExpression = "";
            // }
            // if (modifiedExpression != "object_name LIKE ()") {

            // }

            if (!/\(\)/.test(modifiedExpression)) {
              expressions.push(modifiedExpression);
            }

            const stripPercentSigns = (value) => {
              if (
                typeof value === "string" &&
                value.startsWith("'%") &&
                value.endsWith("%'")
              ) {
                return value.slice(2, -2); // Remove the first two and last two characters (the surrounding '%')
              }
              return value;
            };

            // Only modify `enhancedData` before storing it in localStorage
            const strippedData = {};

            // Loop through the enhancedData object and remove the surrounding %% if present before saving to localStorage
            for (const key in enhancedData) {
              if (enhancedData.hasOwnProperty(key)) {
                strippedData[key] = stripPercentSigns(enhancedData[key]);
              }
            }

            const allData = {
              submittedData: strippedData,
              report: props.report,
              location: window.location.pathname,
            };
            localStorage.setItem("allData", JSON.stringify(allData));
          }
          // Store replaced expressions in the array
        });

      // Join all replaced expressions in the array to form the final filter expression
      const finalExpression1 = expressions
        ?.filter((exp) => exp?.trim())
        .join(" And ");

      props.setFinalExpression(finalExpression1);
      props.setFilterExpression1(finalExpression1);
      props.mainfiltetWithExport(finalExpression1);
    }
  };

  useEffect(() => {
    if (filtermeta?.length > 0 && !optionsFetched) {
      filtermeta.forEach((item) => {
        if (
          item.filter_type === "Single Select Other Source" ||
          item.filter_type === "Picklist Multi Select" ||
          item.filter_type === "Picklist Single Select" ||
          item.filter_type === "Multi Select Other Source"
        ) {
          fetchOptions(item.report_id, item.filter_id, item.filter_parameter);
        }
      });
      setOptionsFetched(true);
    }
  }, [filtermeta, optionsFetched]);
  // &searchString=${inp}
  async function fetchOptions(reportId, filterId, fieldName, search) {
    let searchFilter = "";
    if (search) {
      searchFilter = search;
    }

    try {
      const response = await AxiosInstance.get(
        `/report/fetchDataSourceOrPicklistInfo?reportId=${reportId}&searchString=${searchFilter}&filterId=${filterId}&filterExpression`
      );
      const data = response.data;

      const transformedData = data.map((item) => ({
        value: item.key,
        label: item.value,
      }));

      // Set options for each specific select field using the fieldName
      setSelectOptions((prevOptions) => ({
        ...prevOptions,
        [fieldName]: transformedData,
      }));
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  }

  useEffect(() => {
    if (filtermeta?.length > 0) {
      filtermeta.forEach((item) => {
        if (
          item.filter_type === "Single Select Other Source" ||
          item.filter_type === "Picklist Multi Select" ||
          item.filter_type === "Picklist Single Select" ||
          item.filter_type === "Multi Select Other Source"
        ) {
          fetchOptions(
            item.report_id,
            item.filter_id,
            item.filter_parameter,
            inputValue[item.filter_parameter]
          );
        }
      });
      setOptionsFetched(true);
    }
  }, [inputValue]);

  const submitted = () => {};
  useEffect(() => {
    FiltertoggleShow();
    // setDatarender(true)
  }, [props.filteropen]);

  const themeStyle = {
    singleValue: (provided, state) => ({
      ...provided,
      color: theme === "dark" ? "white" : "black",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "0.95rem", // Adjust the font size
      color: "#aaa", // Optional: Customize the color
      marginLeft: "12px",
    }),
    ...(theme === "dark" && {
      control: (provided, state) => ({
        ...provided,
        background: "#293042",
        border: "0.1px solid grey",
        // height: "41.27px",
      }),

      menu: (provided) => ({
        ...provided,
        background: "#293042",
        color: "white",
        zIndex: 9999,
      }),

      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? "#394b61" : "#293042",
        color: "white",
      }),
      input: (provided) => ({
        ...provided,
        color: " #cfcfcf",
        border: "1px red",
      }),
    }),

    ...(theme !== "dark" && {
      menu: (provided) => ({
        ...provided,
        zIndex: 9999,
      }),
      control: (provided, state) => ({
        ...provided,
        border: "0.1px solid grey",
        // height: "41.27px",
      }),
    }),
  };

  const handleMoreButtonClick = () => {
    setShowAdditionalFields(!showAdditionalFields);
  };

  // const handleChange = (selectedOptions) => {
  //   const selectedKeysArray = selectedOptions.map((option) => option.key);
  //   setselectedKeys(selectedKeysArray);
  //   props.fiscalYearFilter(selectedKeysArray);
  // };

  const currentYear = new Date().getFullYear();

  //FlatPicker code Starts
  function transformDateFormat(format) {
    const formatMapping = {
      yyyy: "Y", // Full year
      MM: "m", // Month with leading zero
      mm: "m",
      dd: "d", // Day with leading zero
      HH: "H", // Hours (24-hour format)
      // mm: "i", // Minutes
    };

    return format.replace(
      /yyyy|MM|dd|HH|mm/g,
      (match) => formatMapping[match] || match
    );
  }

  const loadTheme = (themeName) => {
    const themeId = "flatpickr-theme";
    let themeLink = document.getElementById(themeId);

    if (!themeLink) {
      themeLink = document.createElement("link");
      themeLink.rel = "stylesheet";
      themeLink.id = themeId;
      document.head.appendChild(themeLink);
    }

    themeLink.href = `https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/${themeName}.css`;
  };

  useEffect(() => {
    loadTheme(theme === "dark" ? "dark" : "light");
  }, [theme]);
  //FlatPicker code Ends

  return (
    <>
      {(props.filteropen ||
        (filtermeta && filtermeta.some((item) => item.frequent_filter))) && (
        <Card className="me-2">
          <Card.Body id="offCanvasContent">
            <form>
              <Row lg={3} md={2} sm={12}>
                {filtermeta &&
                  filtermeta.map((item, index) => {
                    if (item.filter_type === "date" && item.frequent_filter) {
                      return (
                        <Controller
                          key={item.filter_parameter || index} // Use unique key
                          name={item.filter_parameter}
                          control={control}
                          render={({ field }) => (
                            <div>
                              <Form.Label htmlFor={item.filter_parameter}>
                                {item.filter_title}
                              </Form.Label>
                              <InputGroup xs="auto">
                                <Flatpickr
                                  style={{
                                    height: "41.09px",
                                    borderRadius: "5px 0px 0px 5px",
                                  }}
                                  {...field} // Integrate Flatpickr with react-hook-form
                                  placeholder={d_date_format}
                                  className="form-control " // Bootstrap styling
                                  options={{
                                    dateFormat:
                                      transformDateFormat(d_date_format),
                                    monthSelectorType: "static",
                                  }}
                                  onChange={(selectedDates) => {
                                    // const formattedDate = selectedDates.length
                                    //   ? selectedDates[0]
                                    //   : null;
                                    const validDate = selectedDates[0];
                                    let formattedFormat = d_date_format
                                      .replace(/dd/g, "DD")
                                      .replace(/EEEE/g, "dddd")
                                      .replace(/E/g, "ddd");
                                    const formattedDate =
                                      moment(validDate).format(formattedFormat);

                                    // field.onChange(formattedDate);
                                    // setFieldValues((prevValues) => ({
                                    //   ...prevValues,
                                    //   [item.filter_parameter]: formattedDate,
                                    // }));
                                    field.onChange(
                                      `to_date('${formattedDate}', 'dd-mm-yyyy')`
                                    );
                                    setFieldValues((prevValues) => ({
                                      ...prevValues,
                                      [item.filter_parameter]: `to_date('${formattedDate}', 'dd-mm-yyyy')`,
                                    }));
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleSubmit(onSubmit)();
                                    }
                                    if (e.key === "Backspace") {
                                      field.onChange("");
                                      setFieldValues((prevValues) => ({
                                        ...prevValues,
                                        [item.filter_parameter]: "",
                                      }));
                                    }
                                  }}
                                  ref={(instance) => {
                                    fp = instance;
                                  }}
                                />
                                <Button
                                  className="border "
                                  style={{ borderRadius: "0px 5px 5px 0px" }}
                                  size="sm"
                                  variant="light"
                                  onClick={() => {
                                    if (fp && fp.clear) {
                                      fp.clear();
                                    }
                                    field.onChange("");
                                    setFieldValues((prevValues) => ({
                                      ...prevValues,
                                      [item.filter_parameter]: "",
                                    }));
                                  }}
                                >
                                  X
                                </Button>
                              </InputGroup>
                            </div>
                          )}
                        />
                      );
                    } else if (
                      (item.filter_type === "number" ||
                        item.filter_type === "input") &&
                      item.frequent_filter
                    ) {
                      return (
                        <Controller
                          key={index}
                          name={item.filter_parameter}
                          control={control}
                          render={({ field }) => (
                            <div>
                              <Form.Label htmlFor="test">
                                {item.filter_title}
                              </Form.Label>
                              <Form.Control
                                {...field}
                                type={item.filter_type}
                                size="lg"
                                placeholder="Search..."
                                onKeyDown={(e) => {
                                  if (
                                    item.filter_type === "number" &&
                                    (e.key === "+" || e.key === "-")
                                  ) {
                                    e.preventDefault();
                                  }
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSubmit(onSubmit)();
                                  }
                                }}
                                onChange={(e) => {
                                  if (
                                    item.filter_type === "number" &&
                                    parseFloat(e.target.value) < 0
                                  ) {
                                    e.target.value = ""; // Clear the input if negative
                                  }
                                  field.onChange(e);
                                  setFieldValues((prevValues) => ({
                                    ...prevValues,
                                    [item.filter_parameter]: e.target.value,
                                  }));
                                }}
                                onClick={(e) => {
                                  if (item.filter_type === "date") {
                                    e.target.showPicker();
                                  }
                                }}
                                onFocus={(e) => {
                                  if (item.filter_type === "date") {
                                    e.target.showPicker();
                                  }
                                }}
                                onWheel={(e) =>
                                  item.filter_type === "number" &&
                                  e.target.blur()
                                }
                              />
                            </div>
                          )}
                        />
                      );
                    }
                  })}

                {filtermeta &&
                  filtermeta.map(
                    (item, index) =>
                      (item.filter_type === "Single Select Other Source" ||
                        item.filter_type === "Picklist Multi Select" ||
                        item.filter_type === "Picklist Single Select" ||
                        item.filter_type === "Multi Select Other Source") &&
                      item.frequent_filter && (
                        <Controller
                          key={index}
                          name={item.filter_parameter}
                          control={control}
                          render={({ field }) => (
                            <div>
                              <Form.Label htmlFor="test2">
                                {t(item.filter_title)}
                              </Form.Label>
                              <Select
                                as="select"
                                size="lg"
                                styles={themeStyle}
                                isClearable={true}
                                placeholder={t("Select...")}
                                inputValue={inputValue[item.filter_parameter]}
                                onInputChange={(value) =>
                                  setInputValue((prevValues) => ({
                                    ...prevValues,
                                    [item.filter_parameter]: value,
                                  }))
                                }
                                {...field}
                                options={
                                  selectOptions[item.filter_parameter] || []
                                }
                                isMulti={
                                  item.filter_type ===
                                    "Picklist Multi Select" ||
                                  item.filter_type ===
                                    "Multi Select Other Source"
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault(); // Prevent form submission
                                    // field.onChange(e); // Update the field value
                                    // setFieldValues((prevValues) => ({
                                    //   ...prevValues,
                                    //   [item.filter_parameter]: e.target.value,
                                    // }));
                                    handleSubmit(onSubmit)(); // Submit the form
                                  }
                                }}
                                onChange={(value) => {
                                  const changedValue = value ? value.value : "";
                                  field.onChange(changedValue);

                                  setSelectedOption((prevValues) => ({
                                    ...prevValues,
                                    [item.filter_parameter]: value,
                                  }));
                                  if (
                                    item.filter_type ===
                                      "Picklist Multi Select" ||
                                    item.filter_type ===
                                      "Multi Select Other Source"
                                  ) {
                                    const selectedValues = value.map(
                                      (item) => item.value
                                    );
                                    field.onChange(selectedValues);
                                  }
                                }}
                                value={
                                  (selectedOption &&
                                    selectedOption[item.filter_parameter]) ||
                                  field.value
                                }
                              />
                            </div>
                          )}
                        />
                      )
                  )}
                {filtermeta &&
                  filtermeta.map(
                    (item, index) =>
                      item.filter_type === "fiscal" &&
                      item.filter_parameter && (
                        <Controller
                          key={index}
                          name={item.filter_parameter}
                          control={control}
                          render={({ field }) => (
                            <div>
                              <Form.Label htmlFor="test2">
                                {item.filter_title}
                              </Form.Label>

                              <Select
                                {...field} // Spread field props
                                options={
                                  reportmeta?.systemConfig
                                    ?.fiscal_year_starts === 1
                                    ? yearOptions
                                    : fiscalyearOptions
                                }
                                // onChange={(selectedOptions) => {
                                //   field.onChange(selectedOptions); // Update the field value
                                //   handleChange(selectedOptions); // Call additional handleChange function if needed
                                // }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    // handleSubmit(onSubmit)();
                                    handleSubmit(onSubmit)();
                                  }
                                }}
                                onChange={(selectedOptions) => {
                                  const valueAsArray = Array.isArray(
                                    selectedOptions
                                  )
                                    ? selectedOptions
                                    : [selectedOptions];

                                  field.onChange(valueAsArray);
                                  // handleChange(valueAsArray);
                                }}
                                inputValue={inputValue[item.filter_parameter]} // Pass the inputValue to the Select component
                                onInputChange={(value) =>
                                  setInputValue((prevValues) => ({
                                    ...prevValues,
                                    [item.filter_parameter]: value,
                                  }))
                                }
                                closeMenuOnSelect={false}
                                isMulti={item.is_multi_select}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.key}
                                placeholder="Select years"
                                styles={themeStyle}
                                defaultValue={
                                  reportmeta?.systemConfig
                                    ?.fiscal_year_starts === 1
                                    ? yearOptions.find(
                                        (option) => option.key === currentYear
                                      )
                                      ? [
                                          yearOptions.find(
                                            (option) =>
                                              option.key === currentYear
                                          ),
                                        ]
                                      : []
                                    : fiscalyearOptions.find(
                                        (option) => option.key === currentYear
                                      )
                                    ? [
                                        fiscalyearOptions.find(
                                          (option) => option.key === currentYear
                                        ),
                                      ]
                                    : []
                                }
                              />
                            </div>
                          )}
                        />
                      )
                  )}

                {filtermeta &&
                  (showAdditionalFields || props.filteropen) &&
                  filtermeta.map((item, index) => {
                    if (item.filter_type === "date" && !item.frequent_filter) {
                      return (
                        <Controller
                          key={item.filter_parameter || index} // Use unique key
                          name={item.filter_parameter}
                          control={control}
                          render={({ field }) => (
                            <div>
                              <Form.Label htmlFor={item.filter_parameter}>
                                {item.filter_title}
                              </Form.Label>
                              <InputGroup xs="auto">
                                <Flatpickr
                                  style={{
                                    height: "41.09px",
                                    borderRadius: "5px 0px 0px 5px",
                                  }}
                                  {...field} // Integrate Flatpickr with react-hook-form
                                  placeholder={d_date_format}
                                  className="form-control " // Bootstrap styling
                                  options={{
                                    dateFormat:
                                      transformDateFormat(d_date_format),
                                    monthSelectorType: "static",
                                  }}
                                  onChange={(selectedDates) => {
                                    // const formattedDate = selectedDates.length
                                    //   ? selectedDates[0]
                                    //   : null;
                                    const validDate = selectedDates[0];
                                    let formattedFormat = d_date_format
                                      .replace(/dd/g, "DD")
                                      .replace(/EEEE/g, "dddd")
                                      .replace(/E/g, "ddd");

                                    const formattedDate =
                                      moment(validDate).format(formattedFormat);

                                    field.onChange(
                                      `to_date('${formattedDate}', 'dd-mm-yyyy')`
                                    );
                                    setFieldValues((prevValues) => ({
                                      ...prevValues,
                                      [item.filter_parameter]: `to_date('${formattedDate}', 'dd-mm-yyyy')`,
                                    }));
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleSubmit(onSubmit)();
                                    }
                                    if (e.key === "Backspace") {
                                      field.onChange("");
                                      setFieldValues((prevValues) => ({
                                        ...prevValues,
                                        [item.filter_parameter]: "",
                                      }));
                                    }
                                  }}
                                  ref={(instance) => {
                                    fp = instance;
                                  }}
                                />
                                <Button
                                  className="border "
                                  style={{ borderRadius: "0px 5px 5px 0px" }}
                                  size="sm"
                                  variant="light"
                                  onClick={() => {
                                    if (fp && fp.clear) {
                                      fp.clear();
                                    }
                                    field.onChange("");
                                    setFieldValues((prevValues) => ({
                                      ...prevValues,
                                      [item.filter_parameter]: "",
                                    }));
                                  }}
                                >
                                  X
                                </Button>
                              </InputGroup>
                            </div>
                          )}
                        />
                      );
                    }
                    // Render other filter types if needed
                    else if (
                      (item.filter_type === "number" ||
                        item.filter_type === "input") &&
                      !item.frequent_filter
                    ) {
                      return (
                        <Controller
                          key={item.filter_parameter || index}
                          name={item.filter_parameter}
                          control={control}
                          render={({ field }) => (
                            <div>
                              <Form.Label htmlFor={item.filter_parameter}>
                                {t(item.filter_title)}
                              </Form.Label>
                              <Form.Control
                                {...field}
                                type={item.filter_type}
                                size="lg"
                                placeholder={t("Search...")}
                                onChange={(e) => {
                                  if (
                                    item.filter_type === "number" &&
                                    parseFloat(e.target.value) < 0
                                  ) {
                                    e.target.value = ""; // Clear the input if negative
                                  }
                                  field.onChange(e.target.value);
                                  setFieldValues((prevValues) => ({
                                    ...prevValues,
                                    [item.filter_parameter]: e.target.value,
                                  }));
                                }}
                                onKeyDown={(e) => {
                                  if (
                                    item.filter_type === "number" &&
                                    (e.key === "+" || e.key === "-")
                                  ) {
                                    e.preventDefault();
                                  }
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSubmit(onSubmit)();
                                  }
                                }}
                                onWheel={(e) =>
                                  item.filter_type === "number" &&
                                  e.target.blur()
                                }
                              />
                            </div>
                          )}
                        />
                      );
                    }
                    return null;
                  })}

                {filtermeta &&
                  (showAdditionalFields || props.filteropen) &&
                  filtermeta.map(
                    (item, index) =>
                      (item.filter_type === "Single Select Other Source" ||
                        item.filter_type === "Picklist Multi Select" ||
                        item.filter_type === "Picklist Single Select" ||
                        item.filter_type === "Multi Select Other Source") &&
                      !item.frequent_filter &&
                      !item.favourite_filter && (
                        <Controller
                          key={index}
                          name={item.filter_parameter}
                          control={control}
                          render={({ field }) => (
                            <div>
                              <Form.Label htmlFor="test2">
                                {t(item.filter_title)}
                              </Form.Label>
                              <Select
                                as="select"
                                size="lg"
                                styles={themeStyle}
                                placeholder={t("Select...")}
                                isClearable={true}
                                inputValue={inputValue[item.filter_parameter]} // Pass the inputValue to the Select component
                                onInputChange={(value) =>
                                  setInputValue((prevValues) => ({
                                    ...prevValues,
                                    [item.filter_parameter]: value,
                                  }))
                                }
                                {...field}
                                options={
                                  selectOptions[item.filter_parameter] || []
                                }
                                isMulti={
                                  item.filter_type ===
                                    "Picklist Multi Select" ||
                                  item.filter_type ===
                                    "Multi Select Other Source"
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault(); // Prevent form submission
                                    // field.onChange(e); // Update the field value
                                    // setFieldValues((prevValues) => ({
                                    //   ...prevValues,
                                    //   [item.filter_parameter]: e.target.value,
                                    // }));
                                    handleSubmit(onSubmit)(); // Submit the form
                                  }
                                }}
                                onChange={(value) => {
                                  const changedValue = value ? value.value : "";
                                  field.onChange(changedValue);

                                  setSelectedOption((prevValues) => ({
                                    ...prevValues,
                                    [item.filter_parameter]: value,
                                  }));
                                  if (
                                    item.filter_type ===
                                      "Picklist Multi Select" ||
                                    item.filter_type ===
                                      "Multi Select Other Source"
                                  ) {
                                    const selectedValues = value.map(
                                      (item) => item.value
                                    );
                                    field.onChange(selectedValues);
                                  }
                                }}
                                value={
                                  (selectedOption &&
                                    selectedOption[item.filter_parameter]) ||
                                  field.value
                                }
                              />
                            </div>
                          )}
                        />
                      )
                  )}
              </Row>
            </form>
          </Card.Body>

          <div className="d-flex justify-content-end">
            {filtermeta &&
              filtermeta.some((item) => item.frequent_filter) &&
              !filtermeta.every((item) => item.frequent_filter) && (
                <Button
                  variant="light"
                  type="button"
                  className="border rounded-3   mt-1 me-2 border-primary"
                  size="sm"
                  onClick={handleMoreButtonClick}
                  style={{ width: "80px" }}
                >
                  {showAdditionalFields ? "Less..." : "More..."}
                </Button>
              )}

            {props.filteropen ||
            (filtermeta && filtermeta.some((item) => item.frequent_filter)) ? (
              <Button
                variant="primary"
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="border rounded-3 mt-1 me-4 "
                size="sm"
                style={{ width: "80px" }}
              >
                <FontAwesomeIcon icon={faSearch} className="mt-1 me-1" />
                {t("Search")}{" "}
              </Button>
            ) : null}
          </div>
        </Card>
      )}
    </>
  );
};
export default FilterColumnSelection;
