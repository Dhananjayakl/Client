// import usePalette from "src/hooks/usePalette";

import AxiosInstance from "../../utils/AxiosInstance";
import {
  Card,
  Modal,
  Button,
  Row,
  Col,
  Form,
  ModalHeader,
  ModalTitle,
  ModalBody,
  Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useState, useEffect } from "react";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { parse } from "@fortawesome/fontawesome-svg-core";

const ChartFilter = (props) => {
  console.log(props,"properties are here");
  
  const [selectedOption, setSelectedOption] = useState([]);
  const [fiscalLabel, setfiscalLabel] = useState();
  //  const [finalExpression, setFinalExpression] = useState("");
  const [filtername, setFilterName] = useState();
  const [currenFiscalValue, setCurrentFiscalValue] = useState();
  const [filterExpression, setFilterExpression] = useState();
  const [fieldValues, setFieldValues] = useState({});
  const [multiFieldValues, setMultiFieldValues] = useState("");
  const [singleFieldValues, setSingleFieldValues] = useState("");
  const [notMandatoryExpression, setNotMandatory] = useState("");
  const [filtershow, setFilterShow] = React.useState(false);
  const [FiltercontentHeight, setFilterContentHeight] = React.useState("auto");
  const [filterExpressionMerge, setfilterExpressionMerge] = React.useState();
  const { setValue, control, handleSubmit } = useForm();
  const [optionsFetched, setOptionsFetched] = useState(false);
  let [selectedValue, setSelectedValue] = useState();
  let [selectedOptionDropDown, setSelectedOptionDropDown] = useState();
  const [selectOptions, setSelectOptions] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [dropDownValue, setDropDownValue] = useState("");
  // const [selectedOption,setSelectedOption]=useState();
  let enhancedData;
  let RetrivedOption;
  let RetrivedMultipleOption = [];
  const [chartFilter, setChartFilter] = useState();
  const FilterhandleClose = () => setFilterShow(false);
  let clearReport;
  let localreport;
  let localLocation;
  let frequentValue = {};
  let replacedExpressions = [];

  useEffect(() => {
    setChartFilter(props.chartFilter);
  }, []);
  const FiltertoggleShow = () => {
    setFilterShow((s) => !s);
    const retrievedData = JSON.parse(localStorage.getItem("allData"));
    if (retrievedData) {
      const parsedData = retrievedData.submittedData;
      if (parsedData) {
        chartFilter &&
          chartFilter.forEach((items) => {
            if (items.filter_type == "Picklist Single Select") {
              selectOptions &&
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
      chartFilter &&
        chartFilter.forEach((items) => {
          if (
            items.filter_type == "Picklist Single Select" ||
            items.filter_type === "Single Select Other Source"
          ) {
            selectOptions &&
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
              selectOptions[items.filter_parameter].forEach((options) => {
                parsedData[items.filter_parameter].forEach((values) => {
                  if (values == options.value) {
                    RetrivedOption = { value: values, label: options.label };
                    RetrivedMultipleOption.push(RetrivedOption);

                    setValue(items.filter_parameter, RetrivedMultipleOption);
                  }
                });
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
    if (selectedOption && filterExpression && filterExpression && filtername) {
      frequentValue[filtername] = selectedOption;

      let placeholder = filterExpression.match(/:\w+/)[0]; // This will match the pattern :<word> and extract the placeholder
      let keyName = placeholder.substring(1);
      let replacedExpression = filterExpression.replace(
        placeholder,
        frequentValue[keyName]
      );

      //  setFinalExpression(replacedExpression)
      replacedExpressions.push(replacedExpression); //this is used to fetch the options that has been selected along with the expression
      // setMultiFieldValues((prevValues)=>({
      //   ...prevValues,
      //   [filtername]:selectedOption})
      // )
      setFieldValues((prevValues) => ({
        ...prevValues,
        [filtername]: {
          value: selectedOption[filtername],
          expression: filterExpression,
        },
      }));
    }
  }, [selectedOption, filtername, filterExpression]);

  useEffect(() => {
    if (chartFilter) {
      const replacedExpressions = []; // Initialize outside the loops

      chartFilter.forEach((items) => {
        if (items.filter_type !== "fiscal") {
          Object.keys(fieldValues).forEach((key) => {
            const nestedObject = fieldValues[key];
            const placeholderMatch = nestedObject.expression.match(/:\w+/);

            if (placeholderMatch) {
              const placeholder = placeholderMatch[0]; // Match the :<word>
              const keyName = placeholder.substring(1);
              const replacedExpression = nestedObject.expression.replace(
                placeholder,
                nestedObject.value
              );

              replacedExpressions.push(replacedExpression); // Collect expressions

              setSingleFieldValues((prevValues) => {
                return { ...prevValues, [keyName]: replacedExpression };
              });
            }
          });
        }
      });

      // Uncomment this when needed:
      // setFinalExpression(replacedExpressions.join(" AND "));
    }
  }, [fieldValues, chartFilter]);

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
    let finalvalues = [];
    if (singleFieldValues) {
      finalvalues.push(singleFieldValues.replacedExpressions);
    }
    if (multiFieldValues) {
      finalvalues.push(multiFieldValues);
    }
    if (notMandatoryExpression) {
      finalvalues.push(notMandatoryExpression);
    }

    props.updateFinalExpression(finalvalues.join(" " + "AND" + " "));
    // setFinalExpression(finalvalues.join(" " + "AND" + " "));
  }, [singleFieldValues, multiFieldValues, notMandatoryExpression]);

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
  console.log(props,"chart filter props");
  
  const onSubmit = (data) => {
    setfilterExpressionMerge(""); // Resetting filterExpressionMerge at the beginning
    if (data) {
      enhancedData = data;

      chartFilter &&
        chartFilter.forEach((item) => {
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
        });
    }

    if (enhancedData) {
      const expressions = []; // Array to hold replaced expressions
      let expression;
      chartFilter &&
        chartFilter.forEach((items) => {
          if (items.filter_type != "fiscal") {
            expression = items.filter_expression;

            const replacedExpression = expression.replace(/:\w+/g, (match) => {
              const key = match.substring(1);
              if (
                enhancedData.hasOwnProperty(key) &&
                enhancedData[key] !== undefined
              ) {
                // Convert the value to a string and remove brackets if present
                const value = enhancedData[key]
                  .toString()
                  .replace(/[\[\]']+/g, ""); // Removes square brackets
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
              modifiedExpression = replacedExpression.replace(
                /\(([^)]+)\)/g,
                "'$1'"
              );
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

            // if (modifiedExpression != "object_name LIKE ()") {

            // }
            if (!/\(\)/.test(modifiedExpression)) {
              expressions.push(modifiedExpression);
            }
            const allData = {
              submittedData: enhancedData,
              report: props.report,
              location: window.location.pathname,
            };
            localStorage.setItem("allData", JSON.stringify(allData));
          }
          // Store replaced expressions in the array
        });

      setNotMandatory(expressions.join(" " + "AND" + " "));
    }
  };

  useEffect(() => {
    if (chartFilter?.length > 0) {
      chartFilter.forEach((item) => {
        console.log(item, "filter item");

        if (
          item.filter_type === "fiscal" ||
          item.filter_type === "Single Select Other Source" ||
          item.filter_type === "Picklist Multi Select" ||
          item.filter_type === "Picklist Single Select" ||
          item.filter_type === "Multi Select Other Source"
        ) {
          fetchOptions(
            item.filter_type,
            item.chart_id,
            item.filter_id,
            item.filter_parameter,
            inputValue,
            props.chartMeta
          );
        }
      });
      setOptionsFetched(true);
    }
  }, [chartFilter, optionsFetched, inputValue]);

  async function fetchOptions(
    filter_type,
    reportId,
    filterId,
    fieldName,
    inputText,
    chartMeta
  ) {
    if (filter_type == "fiscal") {
      setSelectOptions((prevOptions) => ({
        ...prevOptions,
        [fieldName]:
          chartMeta.systemConfig?.fiscal_year_starts == 4
            ? fiscalYearOptions
            : yearOptions,
      }));
    } else {
      try {
        const response = await AxiosInstance.get(
          `/chart/fetchDataSourceOrPicklistInfo?chartId=${reportId}&filterId=${filterId}&searchString=${inputText}&filterExpression`
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
  }
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  const fiscalYearOptions = [];
  for (let i = currentYear - 5; i <= currentYear + 3; i++) {
    yearOptions.push({
      value: i,
      label: i,
    });
  }
  for (let i = currentYear - 5; i <= currentYear + 3; i++) {
    fiscalYearOptions.push({
      value: i,
      label: `FY${i}-${(i + 1).toString().slice(-2)}`,
    });
  }
  console.log(fiscalYearOptions, "fiscal year options");

  console.log(yearOptions, "year range");

  // if (chartFilter?.length > 0) {
  //   chartFilter.forEach((item) => {
  //     if (
  //       item.filter_type === "fiscal") {
  //     setSelectOptions(yearOptions)
  //     }
  //   });
  //   // setOptionsFetched(true);
  // }

  const handleFormSubmit = handleSubmit(onSubmit, { shouldReset: false });
  const toggleLang = (selectedValue, filtername, filterExpression) => {
    setFilterName(filtername);
    setFilterExpression(filterExpression);
    setSelectedOption((prevValues) => {
      let prevArray = prevValues[filtername] || [];
      let updatedArray = [...prevArray, selectedValue];
      if (prevArray.includes(selectedValue)) {
        updatedArray = updatedArray.filter((items) => {
          return items !== selectedValue;
        });
      }
      return {
        ...prevValues,
        [filtername]: updatedArray,
      };
    });
  };
  const handleSelect = (eventKey) => {
    setSelectedOption(eventKey);
  };
  const handlekey = (e) => {
    console.log(e, "dropper selector");

    setSelectedValue(e.target.textContent);
  };
  console.log(selectOptions, "seller");
  const handleChange = (eventKey) => {
    if (chartFilter?.length > 0) {
      chartFilter.forEach((item) => {
        if (item.filter_type == "fiscal") {
          console.log(eventKey, "content");
          let convertValue = parseInt(eventKey);
          // console.log(convertValue, "converted value");
          props.fiscalYearFilter([convertValue]);
          setCurrentFiscalValue(convertValue);
        }
      });
    }
  };
  console.log(currenFiscalValue, "current fiscal value");
  console.log(chartFilter,"porsche");
  

  return (
    <>
      <Row className="d-flex m-0 p-0">
        <Col className="m-0">
          {/* {chartFilter && chartFilter.length > 0 && (
                  <Button variant="primary" onClick={FiltertoggleShow}>
                    <FontAwesomeIcon icon={faFilter} className="mx-1" />
                    Filters
                  </Button>
                )} */}
          <form onSubmit={handleFormSubmit}>
            {chartFilter &&
              chartFilter.map(
                (item, index) =>
                  (item.filter_type === "date" ||
                    item.filter_type === "number" ||
                    item.filter_type === "input") &&
                  item.frequent_filter == true && (
                    <Controller
                      name={item.filter_parameter}
                      control={control}
                      render={({ field }) => {
                        return (
                          <div>
                            <Form.Label htmlFor="test">
                              {item.filter_title}
                            </Form.Label>
                            <Form.Control
                              {...field}
                              type={item.filter_type}
                              // value={
                              //   field.value
                              // }

                              size="lg"
                              onChange={(e) => {
                                field.onChange(e);
                                // setFieldValues((prevValues) => ({
                                //   ...prevValues,
                                //   [item.filter_parameter]:
                                //     e.target.value,
                                // }));
                              }}
                            />
                          </div>
                        );
                      }}
                    />
                  )
              )}

            {chartFilter &&
              chartFilter.map(
                (item, index) =>
                  // Ensure you have the condition to check the required item type
                  (item.filter_type === "Single Select Other Source" ||
                    item.filter_type == "fiscal" ||
                    item.filter_type === "Picklist Single Select") &&!item.visible&&
                  item.frequent_filter == true && (
                    <Row
                      key={index}
                      style={{ justifyContent: "end" }}
                      // className="border"
                    >
                      <Col className="">
                        <Controller
                          // Name should be unique for each field
                          name={item.filter_parameter}
                          control={control}
                          render={({ field }) => {
                            return (
                                <>
                              <Dropdown
                                className="m-0"
                                hidden={props.yearProp?true:false}
                                onSelect={(eventKey) => handleChange(eventKey)}
                              >
                                <Dropdown.Toggle
                                  variant=""
                                  className="m-0"
                                  id="dropdown-basic"
                                >
                                  {item.filter_type == "fiscal" &&
                                  currenFiscalValue &&
                                  props.chartMeta.systemConfig
                                    ?.fiscal_year_starts == 4
                                    ? `FY${currenFiscalValue}-${(
                                        currenFiscalValue + 1
                                      )
                                        .toString()
                                        .slice(-2)}`
                                    : item.filter_type == "fiscal" &&
                                      currenFiscalValue &&
                                      props.chartMeta.systemConfig
                                        ?.fiscal_year_starts != 4
                                    ? currenFiscalValue
                                    : item.filter_type == "fiscal" &&
                                      !currenFiscalValue &&
                                      props.chartMeta.systemConfig
                                        ?.fiscal_year_starts == 4
                                    ? `FY${currentYear}-${(currentYear + 1)
                                        .toString()
                                        .slice(-2)}`
                                    : item.filter_type == "fiscal" &&
                                      !currenFiscalValue &&
                                      props.chartMeta.systemConfig
                                        ?.fiscal_year_starts != 4
                                    ? currentYear
                                    : item.field_title}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <Form.Control
                                    autoFocus
                                
                                    className="mx-3 my-2 w-auto"
                                    placeholder="Type to filter..."
                                    onChange={(e) =>
                                      setInputValue(e.target.value)
                                    }
                                    value={inputValue}
                                  />
                                  {selectOptions[item.filter_parameter] &&
                                    selectOptions[item.filter_parameter].map(
                                      (items, index) => (
                                        <Dropdown.Item
                                          eventKey={items.value}
                                          key={items.value}
                                          id={item.filter_parameter}
                                          onClick={() => {
                                            // handleDropdownItemClick(
                                            //   items.value,
                                            //   item.filter_parameter,
                                            //   item.filter_expression
                                            // );
                                            setFieldValues((prevValues) => ({
                                              ...prevValues,
                                              [item.filter_parameter]: {
                                                value: items.value,
                                                expression:
                                                  item.filter_expression,
                                              },
                                            }));
                                          }}
                                        >
                                          {items.label}
                                        </Dropdown.Item>
                                      )
                                    )}
                                </Dropdown.Menu>
                              </Dropdown>
                             
                              </>
                            );
                          
                          }}
                        />
                      </Col>
                    </Row>
                  )
              )}
            {chartFilter &&
              chartFilter.map(
                (item, index) =>
                  // Ensure you have the condition to check the required item type
                  (item.filter_type === "Picklist Multi Select" ||
                    item.filter_type === "Multi Select Other Source") &&
                  item.frequent_filter == true && (
                    <Row key={index} style={{ justifyContent: "end" }}>
                      <Col>
                        <Controller
                          // Name should be unique for each field
                          name={item.filter_parameter}
                          control={control}
                          render={({ field }) => {
                            return (
                              <Dropdown className="mx-3 pel-5">
                                <Dropdown.Toggle
                                  variant=""
                                  className="p-2 m-1"
                                  id="dropdown-basic"
                                >
                                  {item.filter_title}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <Form.Control
                                    autoFocus
                                    className="mx-3 my-2 w-auto"
                                    placeholder="Type to filter..."
                                    onChange={(e) =>
                                      setInputValue(e.target.value)
                                    }
                                    value={inputValue}
                                  />
                                  {selectOptions[item.filter_parameter] &&
                                    selectOptions[item.filter_parameter].map(
                                      (items, index) => (
                                        <Dropdown.Item
                                          key={items.value}
                                          id={item.filter_parameter}
                                          // onClick={() =>
                                          //   toggleLang(
                                          //     items.value,
                                          //     item.filter_parameter,
                                          //     item.filter_expression
                                          //   )
                                          // }
                                          onClick={() => {
                                            toggleLang(
                                              items.value,
                                              item.filter_parameter,
                                              item.filter_expression
                                            );
                                          }}
                                          active={
                                            fieldValues &&
                                            fieldValues[
                                              item.filter_parameter
                                            ] &&
                                            fieldValues[
                                              item.filter_parameter
                                            ].value.includes(items.value)
                                          }
                                        >
                                          {items.label}
                                        </Dropdown.Item>
                                      )
                                    )}
                                </Dropdown.Menu>
                              </Dropdown>
                            );
                          }}
                        />
                      </Col>
                    </Row>
                  )
              )}

            <Row></Row>
          </form>
        </Col>
      </Row>

      <>
        <Modal
          show={filtershow}
          onHide={FilterhandleClose}
          style={{ maxHeight: FiltercontentHeight, width: "300px" }}
        >
          <ModalHeader closeButton>
            <ModalTitle>Filters</ModalTitle>
          </ModalHeader>

          <ModalBody id="offCanvasContent">
            {" "}
            {/* Add an ID to the content */}
            <form onSubmit={handleFormSubmit}>
              {chartFilter &&
                chartFilter.map(
                  (item, index) =>
                    (item.filter_type === "date" ||
                      item.filter_type === "number" ||
                      item.filter_type === "input") &&
                    !item.frequent_filter && (
                      <Row key={index}>
                        <Col>
                          <Controller
                            name={item.filter_parameter}
                            control={control}
                            render={({ field }) => {
                              return (
                                <div>
                                  <Form.Label htmlFor="test">
                                    {item.filter_title}
                                  </Form.Label>
                                  <Form.Control
                                    {...field}
                                    type={item.filter_type}
                                    // value={
                                    //   field.value
                                    // }

                                    size="lg"
                                    onChange={(e) => {
                                      field.onChange(e);
                                      // setFieldValues((prevValues) => ({
                                      //   ...prevValues,
                                      //   [item.filter_parameter]:
                                      //     e.target.value,
                                      // }));
                                    }}
                                  />
                                </div>
                              );
                            }}
                          />
                        </Col>
                      </Row>
                    )
                )}

              {chartFilter &&
                chartFilter.map(
                  (item, index) =>
                    // Ensure you have the condition to check the required item type
                    (item.filter_type === "Single Select Other Source" ||
                      item.filter_type === "Picklist Multi Select" ||
                      item.filter_type === "Picklist Single Select" ||
                      item.filter_type === "Multi Select Other Source") &&
                    !item.frequent_filter && (
                      <Row key={index}>
                        <Col>
                          <Controller
                            // Name should be unique for each field
                            name={item.filter_parameter}
                            control={control}
                            render={({ field }) => {
                              return (
                                <div>
                                  <Form.Label htmlFor="test2">
                                    {item.filter_title}
                                  </Form.Label>
                                  <Select
                                    as="select"
                                    size="lg"
                                    // className={required && "mandatory"}
                                    {...field}
                                    // value={selectOptions[item.filter_parameter]||[]}
                                    options={
                                      selectOptions[item.filter_parameter] || []
                                    }
                                    isMulti={
                                      item.filter_type ===
                                        "Picklist Multi Select" ||
                                      item.filter_type ===
                                        "Multi Select Other Source"
                                        ? true
                                        : false
                                    } // Assuming options are defined elsewhere
                                    onChange={(value) => {
                                      field.onChange(value.value);

                                      setSelectedOption((prevValues) => ({
                                        ...prevValues,
                                        [item.filter_parameter]: value,
                                      }));
                                      if (
                                        item.filter_type ==
                                          "Picklist Multi Select" ||
                                        item.filter_type ==
                                          "Multi Select Other Source"
                                      ) {
                                        const selectedValues = value.map(
                                          (item) => item.value
                                        );
                                        field.onChange(selectedValues);
                                      }

                                      // Ensure proper handling of field changes
                                    }}
                                    value={
                                      (selectedOption &&
                                        selectedOption[
                                          item.filter_parameter
                                        ]) ||
                                      field.value
                                    }
                                  />
                                </div>
                              );
                            }}
                          />
                        </Col>
                      </Row>
                    )
                )}
              <br></br>
              <Row>
                <Col>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </form>
          </ModalBody>
        </Modal>
        <br></br>
      </>
    </>
  );
};
export default ChartFilter;
