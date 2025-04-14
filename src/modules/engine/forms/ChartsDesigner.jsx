// import { Formik, FieldArray } from "formik";

import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useWatch } from "react-hook-form";
import axios from "axios";
import AxiosInstance from "src/utils/AxiosInstance";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import * as Yup from "yup";
import Select from "react-select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// import FormControl from "src/components/forms/reactformutils/FormControl";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getServiceData } from "src/components/server/service";
import {
  Alert,
  Button,
  Container,
  Form,
  Row,
  ButtonToolbar,
  Col,
  ButtonGroup,
  Card,
  Accordion,
  Tabs,
  Tab,
} from "react-bootstrap";
const fieldTypeOptions = [
  { key: "input", value: "input" },
  { key: "textarea", value: "textarea" },
  { key: "select", value: "select" },
  { key: "date", value: "date" },
  { key: "singleattach", value: "singleattach" },
  { key: "multiattach", value: "multiattach" },
  { key: "radio", value: "radio" },
  { key: "check", value: "check" },
  { key: "checkboxes", value: "checkboxes" },
  { key: "number", value: "number" },
  { key: "phonenumber", value: "phonenumber" },
  { key: "user", value: "user" },
  { key: "switch", value: "switch" },
  { key: "email", value: "email" },
  { key: "password", value: "password" },
];
const filterTypeOptions = [
  { key: "number", value: "Number" },
  { key: "date", value: "Date" },
  { key: "input", value: "Free Text" },
  { key: "Picklist Single Select", value: "Picklist(Single Select)" },
  { key: "Picklist Multi Select", value: "Picklist(Multi Select)" },
  { key: "Single Select Other Source", value: "Other Source (Single Select" },
  { key: "Multi Select Other Source", value: "Other Source(Multi Select)" },
  { key: "fiscal", value: "Fiscal Year" },
];

const colorshades = [
  { key: "#3F51B5", value: "Blue" },
  { key: "#1A7171A", value: "Red" },
  { key: "#00FF00", value: "Green" },
  { key: "#E30B5C", value: "Red" },
];
const columnTypeOptions = [
  { key: "1", value: "Number" },
  { key: "2", value: "Link" },
  { key: "3", value: "Date" },
  { key: "4", value: "String" },
  { key: "5", value: "Boolean" },
  { key: "6", value: "Attachment" },
  { key: "7", value: "Button" },
];

const chartType = [
  { key: "bar", value: "Bar" },
  { key: "pie", value: "Pie" },
  { key: "doughnut", value: "Doughnut" },
  { key: "line", value: "Line" },
  // { key: "area", value: "Area" },
  { key: "bubble", value: "Bubble" },
  { key: "radar", value: "Radar" },
  // { key: "polar", value: "Polar" },
  // { key: "scatter", value: "Scatter" },
  { key: "gauge", value: "Gauge" },
  { key: "heatmap", value: "HeatMap" },
  { key: "mixedChart", value: "MixedChart" },
  { key: "trend", value: "Trend Chart" },
   { key: "meter", value: "Meter Chart" },
];
const pointRadius = [
  { key: "1", value: "x-small" },
  { key: "2", value: "small" },
  { key: "3", value: "medium" },
  { key: "4", value: "large" },
  { key: "5", value: "x-large" },
];
const size = [
  { key: "10", value: "x-small" },
  { key: "20", value: "small" },
  { key: "30", value: "medium" },
  { key: "40", value: "large" },
  { key: "50", value: "x-large" },
];
const Position = [
  { key: "top", value: "Top" },
  { key: "bottom", value: "Bottom" },
  { key: "right", value: "Right" },
  { key: "left", value: "Left" },
];
const Align = [
  { key: "start", value: "Start" },
  { key: "center", value: "Center" },
  { key: "end", value: "End" },
];
const TableAlign = [
  { key: "end", value: "Chart:Start Table:End" },
  { key: "below", value: "Chart:Top Table:Bottom" },
];
const MatrixType = [
  { key: "3", value: "3*3" },
  { key: "4", value: "4*4" },
  { key: "5", value: "5*5" },
];
const LineBorder = [
  { key: "1", value: "x-small" },
  { key: "2", value: "small" },
  { key: "3", value: "medium" },
  { key: "5", value: "large" },
  { key: "7", value: "x-large" },
];
const barThickness = [
  { key: "10", value: "x-small" },
  { key: "15", value: "small" },
  { key: "20", value: "medium" },
  { key: "25", value: "large" },
  { key: "30", value: "x-large" },
];
const trendOptions = [
  { key: 1, value: "Year" },
  {
    key: 2,
    value: "Quarter",
  },
  { key: 3, value: "Month" },
];
// const axisCo_ordinates = [
//     { key: "x", value: "X" },
//     { key: "y", value: "Y" },
//     { key: "z", value: "Z" },
//     { key: "xyz", value: "XYZ" }

// ];
const chartOperations = [
  { key: "count", value: "Count" },
  { key: "sum", value: "Sum" },
  { key: "avg", value: "Average" },
];

import {
  createObject,
  getObjectData,
  updateObjectData,
} from "../EngineService";
import { Watch } from "react-feather";
import { getReportColumnsBySource } from "../EngineService";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import { getModuleForms } from "src/components/server/service";
import { use } from "i18next";

const service = "chartdesigner";

let initialValues = {
  reportId: "",
  reportName: "",
  reportTitle: "",
  moduleId: "",
  // apiHandler: "",
  purpose: "",
  createdOn: "",
  createdBy: "",
  lastUpdatedOn: "",
  lastUpdatedBy: "",
  columns: [
    // {
    //   fieldName: "",
    //   fieldTitle: "",
    //   fieldType: "",
    //   fieldSize: "",
    //   regionCode: "",
    // },
  ],
};

// const validationSchema = Yup.object({
//     reportId: Yup.number(),
//     moduleId: Yup.string().required(),
//     reportName: Yup.string().required(),
//     reportTitle: Yup.string().required(),
//     purpose: Yup.string().required(),
//     // apiHandler: Yup.string().required(),
// });

const ChartDesigner = ({ id }) => {
  console.log("id", id);
  // const [formValues, setFormValues] = useState(null);
  const [ModuleOptions, setModuleOptions] = useState();
  // const [formOptions, setFormOptions] = useState();
  const [columnOptions, setColumnOptions] = useState();
  const [columnsMetaData, setColumnsMetaData] = useState();
  const [selectedColumnValues, setSelectedColumnValues] = useState([]);
  const [formOptions, setFormOptions] = useState();

  const [formValues, setFormValues] = useState(null);
  let navigate = useNavigate();

  const [searchParams] = useSearchParams();
  if (!id) {
    id = searchParams.get("id");
  }

  if (id) {
    useEffect(() => {
      getObjectData(service, id)
        .then((response) => {
          setFormValues(response.data);
          reset(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, [id]);
  }

  // const chartTypesGet=getValues('chartType');

  // console.log(chartTypesGet,"chart get")
  useEffect(() => {
    getServiceData("getModuleInfo")
      .then((response) => {
        setModuleOptions(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // console.log("pagani")
  let onSubmit = (values) => {
    //Fail the onsubmit to avoid page refresh.
    // debugger;
    let closeCanvas = document.querySelector('[class="btn-close"]');
    if (values.chartId) {
      updateObjectData(service, values, values.chartId)
        .then((response) => {
          if (closeCanvas) closeCanvas.click();
          else navigate(-1);
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // AxiosInstance.post("/chartdesigner")
      createObject(service, values)
        .then((response) => {
          if (closeCanvas) closeCanvas.click();
          else navigate(-1);
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  let getSelectedColumnsSource = (formId, dataSource) => {
    getReportColumnsBySource(formId, dataSource)
      .then((response) => {
        setColumnsMetaData(response.data);
        let options = response.data.map((x) => {
          return {
            value: x.column_name,
            label: x.field_title + "[" + x.column_name + "]",
          };
        });
        console.log(options);
        setColumnOptions(options);
        return options;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const validator = { resolver: yupResolver(validationSchema) };

  // functions to build form returned by useForm() and useFieldArray() hooks
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState,
    getValues,
    watch,
    setValue,
  } = useForm();
  let chartTypeValue = useWatch({
    control: control,
    name: "chartType",
  });
  useEffect(() => {
    setChartType(chartTypeValue);
  }, [chartTypeValue]);
  const moduleId = useWatch({
    control: control,
    name: "moduleId",
  });
  console.log(chartTypeValue, "pagani");

  useEffect(() => {
    getModuleForms("moduleForms", "", moduleId)
      .then((response) => {
        setFormOptions(response.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [moduleId]);
  console.log(moduleId, "monza");
  const { errors } = formState;
  const { fields, append, prepend, remove, swap, move, insert, replace } =
    useFieldArray({
      name: "columns",
      control,
    });
  const { fields: gaugeFields, append: AppendGauge } = useFieldArray({
    name: "gauge",
    control,
  });
  const {
    fields: newFields, // fields for the new accordion
    append: appendNew, // append method for the new accordion
  } = useFieldArray({
    name: "filters", // unique name for the new accordion
    control,
  });

  const { fields: heatmapFields, append: heatmapAppend } = useFieldArray({
    name: "heatMap", // unique name for the new accordion
    control,
  });
  const datalabelView = [
    {
      key: "bottom",
      value: "Bottom",
    },
    { key: "end", value: "End" },
  ];
  const legendMarker = [
    {
      key: "square",
      value: "Square",
    },
    {
      key: "circle",
      value: "Circle",
    },
  ];
  useEffect(() => {
    getSelectedColumnsSource(getValues("formName"), getValues("dataSource"));
  }, [watch("formName"), watch("dataSource")]);
  const [chartTypes, setChartType] = useState(getValues("chartType"));

  let getChartType = getValues("chartType");
  useEffect(() => {
    if (getChartType) {
      setChartType(getChartType);
    }
  }, [getChartType]);
  console.log(chartTypes, "chart type is here");
  const chartSize = [
    { key: "xs", value: "Small" },
    { key: "md", value: "Medium" },
    { key: "lg", value: "Large" },
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="card m-3">
        {/* <h4 className="card-header">
          CHARTS DESIGNER : {watch("reportTitle")}
        </h4> */}

        <div
          className="shadow font-medium  bg-white sticky-top "
          style={{ top: "62px", zIndex: 1 }}
        >
          <Row className="m-1">
            <Col>
              <span className="f-6">Chart Designer</span> <br />
              <span className="h4">{watch("chartTitle")}</span>
            </Col>
            <Col>
              <div className="text-center  float-end">
                <Button type="submit" variant="primary" size="lg">
                  Submit
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <Tabs
          defaultActiveKey="details"
          id="justify-tab-example"
          className="justify-content-center"
          variant="underline"
        >
          <Tab
            eventKey="details"
            title={
              <>
                {/* <FontAwesomeIcon icon={faHistory} />  */}
                Details
              </>
            }
          >
            <div className="card-body border-bottom">
              <Row>
                <Col>
                  <FormControl
                    control={control}
                    type="select"
                    field_title="Module"
                    name="moduleId"
                    options={ModuleOptions}
                    required
                  />
                </Col>
                <Col>
                  <FormControl
                    control={control}
                    type="input"
                    field_title="Chart Title"
                    name="chartTitle"
                    required
                  />
                </Col>
                <FormControl
                  control={control}
                  name="defaultFilter"
                  type="input"
                  field_title="default Filter"
                />
                <Col>
                  {/* <FormControl
                control={control}
                type="input"
                field_title="Name"
                name="chartName"
                required
              /> */}
                  <FormControl
                    control={control}
                    type="controlledObjectName"
                    field_title="Name"
                    name="chartName"
                    required
                    nonEngine="charts"
                    value={watch("moduleId")}
                    setValue={setValue}
                  />
                </Col>
                {/* <Col>
                  <label>Chart Type</label>
                  <Form.Select
                    as="select"
                    size="lg"
                    title="format"
                    {...register("chartType")}
                    name="chartType"
                    value={chartTypes}
                    onChange={(e) => {
                      setChartType(e.target.value);
                    }}
                  >
                    <option key="" value="Select an option">
                      Select an option
                    </option>
                    {chartType &&
                      chartType.map((option) => {
                        return (
                          <option
                            key={option.key}
                            value={option.key}
                            disabled={option.active == false}
                          >
                            {option.active == false ? (
                              <del>{option.value}</del>
                            ) : (
                              option.value
                            )}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Col> */}
                <Col>
                  <FormControl
                    control={control}
                    type="select"
                    field_title="chart Type"
                    name="chartType"
                    options={chartType}
                    required
                  />
                </Col>
                <Col>
                  <FormControl
                    control={control}
                    type="switch"
                    field_title="Record level Security"
                    name="recordLevelSecurity"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormControl
                    control={control}
                    type="textarea"
                    field_title="Purpose"
                    name="purpose"
                    required
                  />
                </Col>
                <Col>
                  <Row>
                    <FormControl
                      control={control}
                      type="select"
                      field_title="Form"
                      name="formName"
                      // tooltip="Please select the form."
                      // help_text="Please select the form."
                      options={formOptions}
                    />
                  </Row>

                  <Row>
                    <FormControl
                      control={control}
                      type="input"
                      field_title="Data Source"
                      name="dataSource"
                    />
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col>
                  <div>
                    {chartTypeValue != "bubble" && (
                      <Row>
                        <h4>X-Axis</h4>
                        <hr />
                      </Row>
                    )}
                    <Row>
                      {chartTypeValue != "bubble" && (
                        <Col>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Column"
                            name="xcolumn"
                          />
                        </Col>
                      )}
                      {chartTypeValue == "gauge" && (
                        <Col>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Expression"
                            name="expression"
                          />
                        </Col>
                      )}
                      <Row>
                        <Col>
                          <FormControl
                            control={control}
                            type="select"
                            options={chartOperations}
                            field_title="Chart Operations"
                            name="chartOperations"
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control={control}
                            type="number"
                            field_title="Year"
                            name="year"
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control={control}
                            type="select"
                            options={trendOptions}
                            field_title="Trend Type"
                            name="trendType"
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control={control}
                            type="number"
                            field_title="No of Years"
                            name="noOfYears"
                          />
                        </Col>
                      </Row>
                      {(chartTypeValue == "bar" ||
                        chartTypeValue == "line") && (
                        <Col>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="X Sub Column"
                            name="xsubColumn"
                          />
                        </Col>
                      )}
                      {chartTypeValue != "bubble" && (
                        <Col>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="TItle"
                            name="xtitle"
                          />
                        </Col>
                      )}

                      <Col></Col>
                    </Row>
                    {(chartTypes == "line" ||
                      chartTypes == "bar" ||
                      chartTypes == "heatmap" ||
                      chartTypeValue == "trend") && (
                      <>
                        <Row>
                          <h4>Y-Axis</h4>
                          <hr />
                        </Row>

                        <Row>
                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="Column"
                              name="ycolumn"
                            />
                          </Col>

                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="TItle"
                              name="ytitle"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <FormControl
                              control={control}
                              type="switch"
                              field_title="Transition"
                              name="transition"
                            />
                          </Col>

                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="Comparison Value"
                              name="comparisonColumnValue"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <FormControl
                              control={control}
                              type="switch"
                              field_title="ProNova Enabled"
                              name="proNovaEnabled"
                            />
                          </Col>

                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="Prompt Expression"
                              name="promptExpression"
                            />
                          </Col>
                        </Row>
                      </>
                    )}
                  </div>
                </Col>
              </Row>

              <hr></hr>
            </div>
          </Tab>
          {chartTypeValue == "gauge" && (
            <Tab
              eventKey="Gauge"
              title={
                <>
                  {/* <FontAwesomeIcon icon={faHistory} />  */}
                  Value & Color Codes
                </>
              }
            >
              <h2>
                <center>Values</center>
              </h2>
              <Accordion defaultActiveKey="0">
                {gaugeFields.map((item, i) => {
                  const swapFunctionUp = (currentIndex) => {
                    //passing the current index based on the onclick i will get these and i am passed it as an parameter and taking here as an argument

                    const newIndex = currentIndex - 1; // based on the currentindex subracting and creating new index

                    if (newIndex >= 0) {
                      const updatedFields = [...fields]; //taking the itesm that i have selected using the the select option

                      const temp = updatedFields[currentIndex]; //taking the item that i have been trigrred using the onclick move up

                      updatedFields[currentIndex] = updatedFields[newIndex]; //swapping here

                      console.log(
                        "newindex of current",
                        updatedFields[currentIndex]
                      );

                      //  swap(currentIndex, newIndex);
                      // setValue(`columns.${i}.columnName`,`${currentColumnName}`)
                      // setValue(`columns.${i}.columnTitle`,`${currentColumnTitle}`)
                      // setValue(`columns.${i}.columnType`,`${currentColumnType}`)
                      setValue("columns", updatedFields); //setting the updatedFields to the fields or column
                    }
                  };
                  const swapFunctionDown = (currentIndex) => {
                    const newIndex = currentIndex + 1;
                    // Swap with the previous item
                    if (newIndex >= 0) {
                      const updatedFields = [...fields];

                      const temp = updatedFields[currentIndex];

                      updatedFields[currentIndex] = updatedFields[newIndex];

                      //  swap(currentIndex, newIndex);
                      // setValue(`columns.${i}.columnName`,`${currentColumnName}`)
                      // setValue(`columns.${i}.columnTitle`,`${currentColumnTitle}`)
                      // setValue(`columns.${i}.columnType`,`${currentColumnType}`)
                      setValue("columns", updatedFields);
                    }
                  };

                  let gaugeRecord = `gauge.${i}`;

                  return (
                    <Accordion.Item eventKey={i} key={i}>
                      <Accordion.Header className="d-flex justify-content-start">
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <div>
                            {(getValues(`gauge.${i}.datasetValue`) || "") +
                              " [ " +
                              (getValues(`${gaugeRecord}.gaugeTitle`) || "") +
                              "]"}
                          </div>
                          <div className="ml-auto d-flex">
                            <Button
                              className="me-3"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent the click event from bubbling
                                // Your existing button click logic here

                                // swapFunctionUp(i);
                                remove(i);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent the click event from bubbling
                                // Your existing button click logic here

                                swapFunctionUp(i);
                              }}
                              disabled={i === 0}
                            >
                              <FontAwesomeIcon icon={faArrowUp} />
                            </Button>

                            <Button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent the click event from bubbling
                                // Your existing button click logic here

                                swapFunctionDown(i);
                              }}
                              disabled={i === fields.length - 1}
                            >
                              <FontAwesomeIcon icon={faArrowDown} />
                            </Button>
                          </div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Row>
                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="Title"
                              name={`${gaugeRecord}.gaugeTitle`}
                              required={false}
                            />
                          </Col>

                          <Col>
                            <FormControl
                              control={control}
                              type="number"
                              field_title="Value"
                              name={`${gaugeRecord}.gaugeValue`}
                              // required
                              required={false}
                            />
                          </Col>
                          <Col>
                            <FormControl
                              control={control}
                              type="colorPicker"
                              field_title="color"
                              name={`${gaugeRecord}.gaugeBackgroundColor`}
                              required={false}
                              options={colorshades}
                            />
                          </Col>
                        </Row>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>

              <Button
                onClick={() =>
                  // regionHelpers.push({
                  //   regionCode: "",
                  //   regionTitle: "",
                  //   parentRegion: "",
                  // })
                  AppendGauge({})
                } // insert an empty string at a position
              >
                + Add Gauge Config
              </Button>
            </Tab>
          )}
          {chartTypeValue == "bubble" && (
            <Tab eventKey={"bubbleConfig"} title={<>Bubble Configuration</>}>
              <Row className="m-1">
                <Col>
                  <FormControl
                    control={control}
                    type="input"
                    field_title=" X Column Name"
                    name="xcolumn"
                  />
                </Col>
                <Col>
                  <FormControl
                    control={control}
                    type="input"
                    field_title="Y Column Name"
                    name="ycolumn"
                  />
                </Col>

                <Col>
                  <FormControl
                    control={control}
                    type="input"
                    field_title="Radius Column Name"
                    name="radiusColumn"
                  />
                </Col>
                <Row>
                  <Col>
                    <FormControl
                      control={control}
                      type="input"
                      field_title="X-TItle"
                      name="xtitle"
                    />
                  </Col>
                  <Col>
                    <FormControl
                      control={control}
                      type="input"
                      field_title="Y-TItle"
                      name="ytitle"
                    />
                  </Col>
                </Row>
              </Row>
            </Tab>
          )}
          {(chartTypeValue == "bar" ||
            chartTypeValue == "line" ||
            chartTypeValue == "pie" ||
            chartTypeValue == "doughnut" ||
            chartTypeValue == "mixedChart") && (
            <Tab
              eventKey="columns"
              title={
                <>
                  {/* <FontAwesomeIcon icon={faHistory} />  */}
                  Value & Color Codes
                </>
              }
            >
              <h2>
                <center>Value & Color Codes</center>
              </h2>
              <Accordion defaultActiveKey="0">
                {fields.map((item, i) => {
                  const swapFunctionUp = (currentIndex) => {
                    //passing the current index based on the onclick i will get these and i am passed it as an parameter and taking here as an argument

                    const newIndex = currentIndex - 1; // based on the currentindex subracting and creating new index

                    if (newIndex >= 0) {
                      const updatedFields = [...fields]; //taking the itesm that i have selected using the the select option

                      const temp = updatedFields[currentIndex]; //taking the item that i have been trigrred using the onclick move up

                      updatedFields[currentIndex] = updatedFields[newIndex]; //swapping here

                      console.log(
                        "newindex of current",
                        updatedFields[currentIndex]
                      );

                      //  swap(currentIndex, newIndex);
                      // setValue(`columns.${i}.columnName`,`${currentColumnName}`)
                      // setValue(`columns.${i}.columnTitle`,`${currentColumnTitle}`)
                      // setValue(`columns.${i}.columnType`,`${currentColumnType}`)
                      setValue("columns", updatedFields); //setting the updatedFields to the fields or column
                    }
                  };
                  const swapFunctionDown = (currentIndex) => {
                    const newIndex = currentIndex + 1;
                    // Swap with the previous item
                    if (newIndex >= 0) {
                      const updatedFields = [...fields];

                      const temp = updatedFields[currentIndex];

                      updatedFields[currentIndex] = updatedFields[newIndex];

                      //  swap(currentIndex, newIndex);
                      // setValue(`columns.${i}.columnName`,`${currentColumnName}`)
                      // setValue(`columns.${i}.columnTitle`,`${currentColumnTitle}`)
                      // setValue(`columns.${i}.columnType`,`${currentColumnType}`)
                      setValue("columns", updatedFields);
                    }
                  };

                  let columnRecord = `columns.${i}`;

                  return (
                    <Accordion.Item eventKey={i} key={i}>
                      <Accordion.Header className="d-flex justify-content-start">
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <div>
                            {(getValues(`columns.${i}.datasetValue`) || "") +
                              " [ " +
                              (getValues(`${columnRecord}.displayOrder`) ||
                                "") +
                              "]"}
                          </div>
                          <div className="ml-auto d-flex">
                            <Button
                              className="me-3"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent the click event from bubbling
                                // Your existing button click logic here

                                // swapFunctionUp(i);
                                remove(i);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent the click event from bubbling
                                // Your existing button click logic here

                                swapFunctionUp(i);
                              }}
                              disabled={i === 0}
                            >
                              <FontAwesomeIcon icon={faArrowUp} />
                            </Button>

                            <Button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent the click event from bubbling
                                // Your existing button click logic here

                                swapFunctionDown(i);
                              }}
                              disabled={i === fields.length - 1}
                            >
                              <FontAwesomeIcon icon={faArrowDown} />
                            </Button>
                          </div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Row>
                          <Col>
                            <FormControl
                              control={control}
                              type="number"
                              field_title="Display Order"
                              name={`${columnRecord}.displayOrder`}
                              required={false}
                            />
                          </Col>

                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="Value"
                              name={`${columnRecord}.datasetValue`}
                              // required
                              required={false}
                            />
                          </Col>

                          {/* <Col>
                            <FormControl
                              control={control}
                              type="number"
                              field_title="Border Radius"
                              name={`${columnRecord}.borderRadius`}
                              required={false}
                            />
                          </Col> */}
                          <Col>
                            <FormControl
                              control={control}
                              type="colorPicker"
                              field_title="BackGroundColor"
                              name={`${columnRecord}.backgroundColor`}
                              required={false}

                              // value="y"
                              // required
                            />
                          </Col>
                        </Row>
                        <Row>
                          {/* <Col>
                            <FormControl
                              control={control}
                              type="colorPicker"
                              field_title="Border Color"
                              name={`${columnRecord}.borderColor`}
                              // value="y"
                              required={false}

                              // required
                            />
                          </Col> */}
                          <Col></Col>
                          {/* <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="HoverBgColor"
                              name={`${columnRecord}.hoverBackgroundColor`}
                              required={false}

                              // required
                            />
                          </Col> */}
                          <Col>
                            <FormControl
                              control={control}
                              type="switch"
                              field_title="Is Sub Column"
                              name={`${columnRecord}.isSub`}
                              required={false}
                              hideTitle
                              // required
                            />
                          </Col>
                        </Row>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>

              <Button
                onClick={() =>
                  // regionHelpers.push({
                  //   regionCode: "",
                  //   regionTitle: "",
                  //   parentRegion: "",
                  // })
                  append({})
                } // insert an empty string at a position
              >
                + Add Column
              </Button>
            </Tab>
          )}

          {(chartTypeValue == "bar" ||
            chartTypeValue == "mixedChart" ||
            chartTypeValue == "trend") && (
            <Tab
              eventKey="barConfig"
              title={
                <>
                  {/* <FontAwesomeIcon icon={faHistory} />  */}
                  Bar/line Configuration
                </>
              }
            >
              <Row className="m-1"></Row>
              <Row className="m-1">
                <Col className="mt-3 pt-2">
                  <FormControl
                    control={control}
                    type="switch"
                    field_title="X-Grid"
                    name="xgrid"
                    hideTitle
                  />
                </Col>
                <Col className="mt-3 pt-2">
                  <FormControl
                    control={control}
                    type="switch"
                    field_title="Y-Grid"
                    name="ygrid"
                    hideTitle
                  />
                </Col>
                <Col className="mt-3 pt-2">
                  <FormControl
                    control={control}
                    type="switch"
                    field_title="Stack"
                    name="xstack"
                    hideTitle
                  />
                </Col>
                <Col className="mt-3 pt-2">
                  <FormControl
                    control={control}
                    type="switch"
                    field_title="Horizontal Bar"
                    name="chartIndex"
                    hideTitle
                  />
                </Col>
                <Col>
                  <FormControl
                    control={control}
                    type="number"
                    field_title="Steps"
                    name="ysteps"
                  />
                </Col>
                <Col>
                  <FormControl
                    control={control}
                    type="select"
                    field_title="Bar Thickness"
                    name="barThickness"
                    options={barThickness}
                  />
                </Col>
              </Row>
            </Tab>
          )}
          {(chartTypeValue == "line" || chartTypeValue == "mixedChart") && (
            <Tab eventKey="lineConfig" title={<>Line Configuration</>}>
              <h2>
                <center>Line Configuration</center>
              </h2>
              <>
                <Row className="m-1">
                  <Col>
                    <FormControl
                      control={control}
                      type="switch"
                      field_title="Color Fill"
                      name="fill"
                      hideTitle
                    />
                  </Col>
                  <Col>
                    <FormControl
                      control={control}
                      type="input"
                      field_title="Pointer Color"
                      name="pointerColor"
                    />
                  </Col>
                  <Col>
                    <FormControl
                      control={control}
                      type="input"
                      field_title="Border Color"
                      name="lineBorderColor"
                    />
                  </Col>
                  <Col>
                    <FormControl
                      control={control}
                      type="select"
                      options={LineBorder}
                      field_title="Border Width"
                      name="lineBorderWidth"
                    />
                  </Col>

                  <Col>
                    <FormControl
                      control={control}
                      type="select"
                      options={pointRadius}
                      field_title="Point Radius"
                      name="pointRadius"
                    />
                  </Col>
                  <Col>
                    <FormControl
                      control={control}
                      type="number"
                      field_title="Tension"
                      name="tension"
                    />
                  </Col>
                </Row>
              </>
            </Tab>
          )}
          {chartTypeValue == "pie" && (
            <Tab eventKey="pieConfig" title={<>Pie Configuration</>}>
              {chartTypes && chartTypes == "pie" && (
                <>
                  <Row className="m-1">
                    <Col>
                      <FormControl
                        control={control}
                        type="switch"
                        field_title="Data Table"
                        name="dataTable"
                        hideTitle
                      />
                    </Col>
                    <Col>
                      <FormControl
                        control={control}
                        type="select"
                        options={TableAlign}
                        field_title="Alingment"
                        name="tableAlign"
                      />
                    </Col>
                  </Row>
                </>
              )}
            </Tab>
          )}

          {chartTypeValue == "heatmap" && (
            <Tab
              eventKey="heatMap"
              title={
                <>
                  {/* <FontAwesomeIcon icon={faHistory} />  */}
                  Value & Color Codes
                </>
              }
            >
              <h2>
                <center> Value & Color Codes</center>
              </h2>
              <Row>
                <Col>
                  <FormControl
                    control={control}
                    type="select"
                    field_title="MatrixType"
                    options={MatrixType}
                    name="matrixType"
                    // required
                  />
                </Col>
              </Row>
              <Accordion defaultActiveKey="0">
                {heatmapFields.map((item, i) => {
                  let heatmapRecord = `heatMap.${i}`;

                  return (
                    <Accordion.Item eventKey={i} key={i}>
                      <Accordion.Header className="d-flex justify-content-start">
                        <div className="d-flex justify-content-between align-items-center w-100">
                          {`x-value : ` +
                            (getValues(`${heatmapRecord}.xvalue`) || "") +
                            " , " +
                            "y-value : " +
                            (getValues(`${heatmapRecord}.yvalue`) || "")}

                          <div className="ml-auto d-flex"></div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Row>
                          {/* <Col>
                          <FormControl
                            control={control}
                            type="textarea"
                            field_title="Filter Expression"
                            name={`${FilterRecord}.filterExpression`}
                            // options={columnOptions}
                          />
                        </Col> */}
                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="X-Value"
                              name={`${heatmapRecord}.xvalue`}
                              // required
                            />
                          </Col>

                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="Y-Value"
                              name={`${heatmapRecord}.yvalue`}
                              // required
                            />
                          </Col>
                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="Background Color"
                              name={`${heatmapRecord}.backgroundColor`}
                              // required
                            />
                          </Col>
                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="Text Color"
                              name={`${heatmapRecord}.textColor`}
                              // required
                            />
                          </Col>
                        </Row>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>

              <Button
                onClick={() => heatmapAppend({})} // insert an empty string at a position
              >
                + Add Data
              </Button>
            </Tab>
          )}
          {(chartTypeValue == "bar" ||
            chartTypeValue == "line" ||
            chartTypeValue == "pie" ||
            chartTypeValue == "bubble" ||
            chartTypeValue=="meter"||
             chartTypeValue=="trend"||
              chartTypeValue=="gauge"||
            chartTypeValue == "doughnut") && (
            <Tab eventKey="customization" title={<>Customization</>}>
              <h2>
                <center> Customization</center>
              </h2>

              <>
                <Row>
                  <hr />
                </Row>
                <Accordion>
                  <AccordionHeader>
                    <h4>Legend Configuration</h4>
                  </AccordionHeader>
                  <AccordionBody>
                    <Row>
                      <Col>
                        <FormControl
                          control={control}
                          type="switch"
                          field_title="Legend Display"
                          name="legendDisplay"
                          hideTitle
                        />
                      </Col>

                      <Col>
                        <FormControl
                          control={control}
                          type="select"
                          options={size}
                          field_title="Box Width"
                          name="boxWidth"
                        />
                      </Col>
                      <Col>
                        <FormControl
                          control={control}
                          type="select"
                          options={size}
                          field_title="Padding"
                          name="legendPadding"
                        />
                      </Col>
                      <Col>
                        <FormControl
                          control={control}
                          type="select"
                          options={size}
                          field_title="Font Size"
                          name="legendFontSize"
                        />
                      </Col>
                      <Col>
                        <FormControl
                          control={control}
                          type="select"
                          options={Position}
                          field_title="Position"
                          name="legendPosition"
                        />
                      </Col>
                      <Col>
                        <FormControl
                          control={control}
                          type="select"
                          options={Align}
                          field_title="Alingment"
                          name="legendAlign"
                        />
                      </Col>
                    </Row>
                  </AccordionBody>
                </Accordion>

                {(chartTypeValue == "pie" ||
                  chartTypeValue == "doughnut" ||
                  chartTypeValue == "bar") && (
                  <Accordion>
                    <AccordionHeader>
                      <h4>Compact View</h4>
                    </AccordionHeader>
                    <AccordionBody>
                      <Row>
                        <Col>
                          <FormControl
                            control={control}
                            type="switch"
                            field_title="Compact View"
                            name="compactView"
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control={control}
                            type="select"
                            field_title="Data label View"
                            name="dataLabelView"
                            options={datalabelView}
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control={control}
                            type="select"
                            field_title="Legend Marker"
                            name="legendMarker"
                            options={legendMarker}
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control={control}
                            type="colorPicker"
                            field_title="Legend Font Color"
                            name="legendFontColor"
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control={control}
                            type="colorPicker"
                            field_title="Legend Label Color"
                            name="legendLabelColor"
                          />
                        </Col>
                      </Row>
                    </AccordionBody>
                  </Accordion>
                )}
              </>

              {chartTypes && chartTypes != "Select an option" && (
                <>
                  <Row>
                    <hr />
                  </Row>
                  <Accordion>
                    <AccordionHeader>
                      <h4>Datalabels Configuration</h4>
                    </AccordionHeader>
                    <AccordionBody>
                      <Row>
                        <Col>
                          <FormControl
                            control={control}
                            type="switch"
                            field_title="Datalabel Display"
                            name="datalabelDisplay"
                            hideTitle
                          />

                          <FormControl
                            control={control}
                            type="switch"
                            field_title="Value in Percentage"
                            name="valuePercentage"
                            hideTitle
                          />
                        </Col>
                        <Col></Col>
                        <Col>
                          <FormControl
                            control={control}
                            type="select"
                            options={Position}
                            field_title="Position"
                            name="datalabelPosition"
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control={control}
                            type="select"
                            options={Align}
                            field_title="Alingment"
                            name="datalabelAlign"
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Font Colour"
                            name="datalabelColor"
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control={control}
                            type="select"
                            options={size}
                            field_title="Font Size"
                            name="datalabelFontSize"
                          />
                        </Col>
                      </Row>
                    </AccordionBody>
                  </Accordion>
                </>
              )}

              <Accordion>
                <AccordionHeader>
                  <h4>Additional settings</h4>
                </AccordionHeader>
                <AccordionBody>
                  <Row>
                    <Col>
                      <FormControl
                        control={control}
                        type="number"
                        field_title="Hover-Value"
                        name="hoverValue"
                      />
                    </Col>
                    <Col>
                      <FormControl
                        control={control}
                        type="switch"
                        field_title="Transparent-Background"
                        name="transparent"
                      />
                    </Col>
                    <Col>
                      <FormControl
                        control={control}
                        type="input"
                        field_title="Padding"
                        name="padding"
                      />
                    </Col>
                    <Col>
                      <FormControl
                        name="defaultFilter"
                        type="input"
                        control={control}
                        field_title="Default Filter"
                      />
                    </Col>
                    <Col>
                      <FormControl
                        name="defaultOrderExpression"
                        type="input"
                        control={control}
                        field_title="Default Order Expression"
                      />
                    </Col>
                    <Col className="mt-5">
                      <FormControl
                        name="recordLevelSecurity"
                        type="switch"
                        control={control}
                        field_title="Record level Security"
                        hideTitle
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormControl
                        control={control}
                        type="switch"
                        field_title="Only Chart"
                        name="onlyChart"
                      />
                    </Col>
                    <Col>
                      <FormControl
                        control={control}
                        type="select"
                        options={chartSize}
                        field_title="Chart Size"
                        name="chartSize"
                      />
                    </Col>
                  </Row>
                </AccordionBody>
              </Accordion>
            </Tab>
          )}
          {chartTypeValue && (
            <Tab
              eventKey="filters"
              title={
                <>
                  {/* <FontAwesomeIcon icon={faHistory} />  */}
                  Filters
                </>
              }
            >
              <h2>
                <center>Filters</center>
              </h2>

              <Accordion defaultActiveKey="0">
                {newFields.map((item, i) => {
                  let FilterRecord = `filters.${i}`;
                  console.log("columnRecord", FilterRecord);
                  return (
                    <Accordion.Item eventKey={i} key={i}>
                      <Accordion.Header className="d-flex justify-content-start">
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <div>
                            {getValues(`${FilterRecord}.filterTitle`) || ""}
                          </div>
                          <div className="ml-auto d-flex"></div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Row>
                          <Col>
                            <FormControl
                              control={control}
                              type="textarea"
                              field_title="Filter Expression"
                              name={`${FilterRecord}.filterExpression`}
                              // options={columnOptions}
                            />
                          </Col>
                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="Filter Param Name"
                              name={`${FilterRecord}.filterParameter`}
                              // required
                            />
                            <FormControl
                              control={control}
                              type="switch"
                              field_title="Mandatory filter"
                              name={`${FilterRecord}.mandatoryFilter`}
                              hideTitle
                            />
                            <FormControl
                              control={control}
                              type="switch"
                              field_title="hidden"
                              name={`${FilterRecord}.visible`}
                              hideTitle
                            />
                          </Col>
                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="Filter Title"
                              name={`${FilterRecord}.filterTitle`}
                              // required
                            />
                            <FormControl
                              control={control}
                              type="switch"
                              field_title="Frequent"
                              name={`${FilterRecord}.frequentFilter`}
                              hideTitle
                            />
                          </Col>
                          <Col>
                            <FormControl
                              control={control}
                              type="select"
                              field_title="Filter Column Data Type"
                              name={`${FilterRecord}.filterType`}
                              options={filterTypeOptions}
                            />
                          </Col>
                          {/* <Col>
                          <FormControl
                            control={control}
                            type="select"
                            field_title="Filter Column Type"
                            name={`${FilterRecord}.displayType`}
                            options={fieldTypeOptions}
                          />
                        </Col> */}
                        </Row>
                        <Row>
                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="Picklist"
                              name={`${FilterRecord}.picklist`}
                            />
                          </Col>
                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="Data Source"
                              name={`${FilterRecord}.dataSource`}
                            />
                          </Col>
                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="Display Value"
                              name={`${FilterRecord}.displayValue`}
                            />
                          </Col>
                          <Col>
                            <FormControl
                              control={control}
                              type="input"
                              field_title="Stored Value"
                              name={`${FilterRecord}.storedValue`}
                            />
                          </Col>
                          <Row>
                            <Col xl={3} md={6} sm={12}>
                              <FormControl
                                control={control}
                                type="input"
                                field_title="Filter Profile Title"
                                name={`${FilterRecord}.filterProfileTitle`}
                              />
                            </Col>

                            <Col xl={3} md={6} sm={12}>
                              <FormControl
                                control={control}
                                type="input"
                                field_title="Filter Profile Expression"
                                name={`${FilterRecord}.filterProfile`}
                              />
                            </Col>
                            <Col xl={3} md={6} sm={12}>
                              <FormControl
                                control={control}
                                type="switch"
                                field_title="Filter Profile Status"
                                name={`${FilterRecord}.filterProfileStatus`}
                                hideTitle
                              />
                            </Col>
                            <Col xl={3} md={6} sm={12}></Col>
                            <Col xl={3} md={6} sm={12}></Col>
                          </Row>
                        </Row>
                        <Row>
                          <Col></Col>
                          <Col></Col>
                          <Col></Col>
                        </Row>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>

              <Button
                onClick={() => appendNew({})} // insert an empty string at a position
              >
                + Add Filter
              </Button>
            </Tab>
          )}
          {
            chartTypeValue != "bubble" &&
            chartTypeValue != "mixedChart" &&
            chartTypeValue && (
              <Tab
                eventKey="drillDown"
                title={
                  <>
                    {/* <FontAwesomeIcon icon={faHistory} />  */}
                    Drill Down
                  </>
                }
              >
                <Row>
                  <span className="h2">
                    {" "}
                    <center> Drill Down Reports Configuration</center>
                  </span>
                </Row>
                <Row>
                  {/* <FormControl
                name="enableExportHistory"
                type="switch"
                control={control}
                field_title="Export History"
              />
              <FormControl
                name="enableFilterPanel"
                type="switch"
                control={control}
                field_title="Filters Panel"
              />

              <FormControl
                name="enableColumnFilters"
                type="switch"
                control={control}
                field_title="Column Filters"
              />

              <FormControl
                name="enableColumnSelection"
                type="switch"
                control={control}
                field_title="Column Selection"
              />

              <FormControl
                name="enableHeaderBar"
                type="switch"
                control={control}
                field_title="Report Header Panel"
              />
              <FormControl
                name="enableBottomBar"
                type="switch"
                control={control}
                field_title="Report Bottom Panel"
              />
              <FormControl
                name="enablePagination"
                type="switch"
                control={control}
                field_title="Report Pagination"
              />
              <FormControl
                name="enableRecordsPerPage"
                type="switch"
                control={control}
                field_title="Records Per Page"
              /> */}
                  <Col>
                    <FormControl
                      control={control}
                      type="input"
                      field_title="Report Name"
                      name="reportName"
                    />
                  </Col>
                  <Col>
                    <FormControl
                      control={control}
                      type="input"
                      field_title="Report Filter Expression"
                      name="reportFilterExpression"
                    />
                  </Col>
                </Row>
              </Tab>
            )}
        </Tabs>
        {/* <div className="card-footer text-center border-top-0">
          <button type="submit" className="btn btn-primary mr-1">
            Submit
          </button>
        </div> */}
      </div>
    </form>
  );
};

export default ChartDesigner;
