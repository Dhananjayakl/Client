import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import * as Yup from "yup";

import Select from "react-select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import FormControl from "src/components/forms/reactformutils/FormControl";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getServiceData, getModuleForms } from "src/components/server/service";
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

const columnTypeOptions = [
  { key: "1", value: "Number" },
  { key: "2", value: "Link(Full Window)" },
  { key: "3", value: "Date" },
  { key: "4", value: "String" },
  { key: "5", value: "Boolean" },
  { key: "6", value: "Attachment" },
  { key: "7", value: "Button" },
  { key: "8", value: "Link(Off Canvas Window)" },
  { key: "9", value: "Link(Modal Window)" },
  { key: "10", value: "Progress" },
  { key: "11", value: "PlayButton" },
  { key: "12", value: "Actions" },
  { key: "13", value: "ArrayObject" },
  { key: "14", value: "ChildReports" },
  { key: "15", value: "Unpin" },
  { key: "16", value: "JasperReport" },
  { key: "17", value: "Trends" },
  { key: "18", value: "CheckBox" },
  { key: "19", value: "DateWithTimeStamp" },
  { key: "20", value: "Switch" },
];
const filterTypeOptions = [
  { key: "number", value: "Number" },
  { key: "date", value: "Date" },
  { key: "input", value: "Free Text" },
  { key: "fiscal", value: "Fiscal Year" },
  { key: "Picklist Single Select", value: "Picklist(Single Select)" },
  { key: "Picklist Multi Select", value: "Picklist(Multi Select)" },
  { key: "Single Select Other Source", value: "Other Source (Single Select" },
  { key: "Multi Select Other Source", value: "Other Source(Multi Select)" },
];

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

import {
  createObject,
  getObjectData,
  updateObjectData,
  getReportColumnsBySource,
} from "../EngineService";
import { Watch } from "react-feather";
import { useSSR } from "react-i18next";

const service = "reportdesigner";

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
  enableExportHistory: true,
  enableFilterPanel: true,
  enableColumnFilters: true,
  enableColumnSelection: true,
  enableHeaderBar: true,
  enableBottomBar: true,
  enablePagination: true,
  enableRecordsPerPage: true,
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

const validationSchema = Yup.object({
  reportId: Yup.number(),
  moduleId: Yup.string().required(),
  reportName: Yup.string().required(),
  reportTitle: Yup.string().required(),
  purpose: Yup.string().required(),
  // apiHandler: Yup.string().required(),
  noOfRecordsPerPage: Yup.string().required(),
});
let TempcreateFormLink = [];

const ReportDesigner = ({ id }) => {
  const [formValues, setFormValues] = useState(null);
  const [ModuleOptions, setModuleOptions] = useState();
  const [formOptions, setFormOptions] = useState();
  const [allformOptions, setAllFormoptions] = useState();
  const [columnOptions, setColumnOptions] = useState();
  const [columnsMetaData, setColumnsMetaData] = useState();
  const [selectedColumnValues, setSelectedColumnValues] = useState([]);
  const [selectedOption, setSelecetdOption] = useState([]);
  const [finalValue, setFinalValue] = useState([]);
  const [missingOption, setMissingOptions] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [customSelect, setCustomSelect] = useState();
  const [onchangeValue, setOnChangeValue] = useState();
  const [format, setformat] = useState();
  const [dynamicOption, setdynamicOption] = useState([]);
  const [selectedFormOption, setSelecetedFormOption] = useState([]);
  const [creatLinkFormOptions, setcreatLinkFormOptions] = useState([]);
  const [deselected, setDeselected] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");

  // const [matchingColumnOptions, setMatchingColumnOptions] = useState([]);
  // const [uniqueColumnValues, setUniqueColumnValues] = useState([]);

  const [matchingColumnValues, setMatchingColumnValues] = useState([]);
  const [updatedOptions, setupdatedOptions] = useState([]);
  const fieldTypeOptions = [
    { key: "input", value: "Free Text" },
    { key: "textarea", value: "Text Area" },
    { key: "select", value: "Drop Down" },
    { key: "date", value: "Date" },
    { key: "singleattach", value: "Single Attachment" },
    { key: "multiattach", value: "Multi Attachment" },
    { key: "radio", value: "Radio Buttons" },
    { key: "check", value: "Checkbox" },
    { key: "checkboxes", value: "Multiple Checkboxes" },
    { key: "number", value: "Number" },
    { key: "phonenumber", value: "phonenumber" },
    { key: "user", value: "user" },
    { key: "switch", value: "Switch" },
    { key: "email", value: "Email" },
    { key: "password", value: "Password" },
    { key: "SSelect", value: "Server Side Select" },
    { key: "richtext", value: "Rich Text" },
  ];
  const DateFormat = [
    { key: "0", value: "Default" },
    { key: "1", value: "dd-mm-yyyy" },
    { key: "2", value: "yyyy-mm-dd" },
  ];

  const numberFormat = [
    { key: "1", value: "$" },
    { key: "2", value: "₹" },
  ];

  const reportOperations = [
    { key: "count", value: "Count" },
    { key: "sum", value: "Sum" },
    { key: "avg", value: "Average" },
  ];

  const defaultValues = {
    enableExportHistory: true,
    // enableFilterPanel: true,
    enableColumnFilters: true,
    enableColumnSelection: true,
    enableHeaderBar: true,
    enableBottomBar: true,
    enablePagination: true,
    enableRecordsPerPage: true,
    firstLastpage: true,
    previousNextpage: true,
    pageOfTotalPage: true,
    pageIndex: true,
    gotoPage: true,
    totalRow: true,
    recordsInPage: true,
    defaultBottomBar: true,
    enableOptionalBottomPanel: false,
    // enableTileView: true,
    // dataCard: true
  };

  useEffect(() => {
    if (formOptions?.length > 0) {
      setcreatLinkFormOptions(
        allformOptions.map((option) => ({
          label: option.value,
          value: option.key,
        }))
      );
    }
  }, [formOptions && formOptions.length > 0]);
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
  useEffect(() => {
    getServiceData("getModuleInfo")
      .then((response) => {
        setModuleOptions(response.data.data);
      })
      .catch((err) => {
        console.error(err);
      });

    getServiceData("getForms")
      .then((response) => {
        setAllFormoptions(response.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  let onSubmit = (values) => {
    //Fail the onsubmit to avoid page refresh.
    let closeCanvas = document.querySelector('[class="btn-close"]');
    if (values.reportId) {
      updateObjectData(service, values, values.reportId)
        .then((response) => {
          if (closeCanvas) closeCanvas.click();
          else navigate(-1);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      createObject(service, values)
        .then((response) => {
          if (closeCanvas) closeCanvas.click();
          else navigate(-1);
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
        // setColumnOptions(options);
        const updatedColumnOptions = options.filter((option) => {
          // Check if the option's value is in the selectedColumnValues array
          return !selectedColumnValues.includes(option.value);
        });
        setColumnOptions(updatedColumnOptions);
        return options;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (formValues && formValues.columns && columnOptions) {
      // Extract column names from formValues.columns
      const valueArrayy = columnOptions.map((obj) => obj.value);
      const columnNames = formValues.columns.map((column) => column.columnName);

      // Find the matching options in columnOptions based on value
      const matchedOptions = columnNames.map((name) => {
        const matchedOption = columnOptions.find(
          (option) => option.value === name
        );
        return matchedOption; // This will contain the key-value pair from columnOptions
      });
      setMatchingColumnValues(matchedOptions);
    }
    // setSelectedColumnValues(matchingColumnValues)
  }, [formValues, columnOptions]);
  useEffect(() => {
    if (formValues && formValues.columns && columnOptions) {
      // const columnNames = formValues.columns.map((column) => column.columnName);
      const missingOptions = formValues.columns.filter(
        (column) =>
          !columnOptions.some((option) => option.value === column.columnName)
      );
      setMissingOptions(missingOptions);
    }
  }, [formValues, columnOptions]);

  useEffect(() => {
    setSelecetdOption(matchingColumnValues);
  }, [matchingColumnValues]);
  if (selectedColumnValues) {
  }
  const validator = { resolver: yupResolver(validationSchema) };

  useEffect(() => {
    if (formValues && formValues.createFormLink && creatLinkFormOptions) {
      const optionsArray = creatLinkFormOptions || [];
      const selectedFormOptions = formValues.createFormLink.map(
        (formLinkId) => {
          const matchingOption = optionsArray.find(
            (option) => option.value === formLinkId
          );
          return matchingOption
            ? { label: matchingOption.label, value: matchingOption.value }
            : null;
        }
      );
      const filteredOptions = selectedFormOptions.filter(
        (option) => option !== null
      );
      setSelecetedFormOption(filteredOptions);
    }
  }, [formValues && creatLinkFormOptions]);

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
  } = useForm({
    defaultValues,
    validator,
  });
  const enableHeaderBar = watch("enableHeaderBar");
  const enableBottomBar = watch("enableBottomBar");
  const defaultBottomBar = watch("defaultBottomBar");
  const enableOptionalBottomPanel = watch("enableOptionalBottomPanel");
  const enablePagination = watch("enablePagination");
  const enableRecordsPerPage = watch("enableRecordsPerPage");
  const moduleId = getValues().moduleId;
  useEffect(() => {
    if (moduleId) {
      getModuleForms("moduleForms", "", moduleId)
        .then((response) => {
          setFormOptions(response.data.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [moduleId]);
  useEffect(() => {
    if (!enableHeaderBar) {
      setValue("enableExportHistory", false);
      setValue("enableFilterPanel", false);
      setValue("enableColumnFilters", false);
      setValue("enableColumnSelection", false);
    } else if (id) {
      setValue("enableExportHistory", formValues?.enableExportHistory);
      setValue("enableFilterPanel", formValues?.enableFilterPanel);
      setValue("enableColumnFilters", formValues?.enableColumnFilters);
      setValue("enableColumnSelection", formValues?.enableColumnSelection);
      if (id && enableHeaderBar) {
      }
    } else {
      setValue("enableExportHistory", defaultValues.enableExportHistory);
      setValue("enableFilterPanel", defaultValues.enableFilterPanel);
      setValue("enableColumnFilters", defaultValues.enableColumnFilters);
      setValue("enableColumnSelection", defaultValues.enableColumnSelection);
    }
  }, [enableHeaderBar, id]);

  useEffect(() => {
    if (!enableBottomBar) {
      setValue("enablePagination", false);
      setValue("enableRecordsPerPage", false);

      setValue("firstLastpage", false);
      setValue("previousNextpage", false);
      setValue("pageOfTotalPage", false);
      setValue("pageIndex", false);
      setValue("gotoPage", false);
      setValue("totalRow", false);
      setValue("recordsInPage", false);
      setValue("defaultBottomBar", false);
      setValue("enableOptionalBottomPanel", false);
    } else if (id) {
      setValue("enablePagination", formValues?.enablePagination);
      setValue("enableRecordsPerPage", formValues?.enableRecordsPerPage);

      setValue("firstLastpage", formValues?.firstLastpage);
      setValue("previousNextpage", formValues?.previousNextpage);
      setValue("pageOfTotalPage", formValues?.pageOfTotalPage);
      setValue("pageIndex", formValues?.pageIndex);
      setValue("gotoPage", formValues?.gotoPage);
      setValue("totalRow", formValues?.totalRow);
      setValue("recordsInPage", formValues?.recordsInPage);
      setValue("defaultBottomBar", formValues?.defaultBottomBar);
      setValue(
        "enableOptionalBottomPanel",
        formValues?.enableOptionalBottomPanel
      );
    } else {
      setValue("enablePagination", defaultValues.enablePagination);
      setValue("enableRecordsPerPage", defaultValues.enableRecordsPerPage);

      setValue("firstLastpage", defaultValues.firstLastpage);
      setValue("previousNextpage", defaultValues.previousNextpage);
      setValue("pageOfTotalPage", defaultValues.pageOfTotalPage);
      setValue("pageIndex", defaultValues.pageIndex);
      setValue("gotoPage", defaultValues.gotoPage);
      setValue("totalRow", defaultValues.totalRow);
      setValue("recordsInPage", defaultValues.recordsInPage);
      setValue("defaultBottomBar", defaultValues.defaultBottomBar);
    }
  }, [enableBottomBar, id]);

  useEffect(() => {
    if (enableBottomBar) {
      if (defaultBottomBar) {
        setValue("enableOptionalBottomPanel", false);
      } else {
        setValue("enableOptionalBottomPanel", true);
      }
    }
  }, [defaultBottomBar]);

  useEffect(() => {
    if (enableBottomBar) {
      if (enableOptionalBottomPanel) {
        setValue("defaultBottomBar", false);
      } else {
        setValue("defaultBottomBar", true);
      }
    }
  }, [enableOptionalBottomPanel]);

  useEffect(() => {
    if (!enablePagination) {
      setValue("firstLastpage", false);
      setValue("previousNextpage", false);
      setValue("gotoPage", false);
      setValue("pageIndex", false);
    } else {
      setValue("firstLastpage", true);
      setValue("previousNextpage", true);
      setValue("gotoPage", true);
      setValue("pageIndex", true);
    }
  }, [enablePagination]);
  useEffect(() => {
    if (!enableRecordsPerPage) {
      setValue("totalRow", false);
      setValue("pageOfTotalPage", false);
      setValue("recordsInPage", false);
    } else {
      setValue("totalRow", true);
      setValue("pageOfTotalPage", true);
      setValue("recordsInPage", true);
    }
  }, [enableRecordsPerPage]);

  const { errors } = formState;
  const {
    fields,
    append,
    remove: removeColumn,

    prepend,
    swap,
    move,
    insert,
    replace,
  } = useFieldArray({
    name: "columns",
    control,
  });

  const {
    fields: newFields,
    append: appendNew,
    remove: removeField,
  } = useFieldArray({
    name: "filters",
    control,
  });

  const {
    fields: dataCardFields, // fields for the new accordion
    append: appendNewDataCard,
    remove: removeDataCard, // append method for the new accordion
  } = useFieldArray({
    name: "dataCards", // unique name for the new accordion
    control,
  });

  const {
    fields: childReportsfields, // fields for the new accordion
    append: appendNewChildreports,
    remove: removeChildreports, // append method for the new accordion
  } = useFieldArray({
    name: "reportChilds", // unique name for the new accordion
    control,
  });
  // const removeDataCard = (indexToRemove) => {
  //   const updatedFields = newFields.filter((_, index) => index !== indexToRemove);
  //   setNewFields(updatedFields);
  // };
  useEffect(() => {
    getSelectedColumnsSource(getValues("formName"), getValues("dataSource"));
  }, [watch("formName"), watch("dataSource")]);

  useEffect(() => {
    const validDeselected = deselected.filter(Boolean);
    fields.forEach((item, i) => {
      const columnName = getValues(`columns.${i}.columnName`);
      if (validDeselected.some((d) => d.value === columnName)) {
        removeColumn(i);
      }
    });
  }, [deselected, fields]);

  useEffect(() => {
    getSelectedColumnsSource(getValues("formName"), getValues("dataSource"));
  }, [watch("formName"), watch("dataSource")]);

  const CustomFunction = (value, index) => {
    // debugger;
    if (value === "3") {
      setValue(`columns[${index}].format`, "2");
      setformat(getValues(`columns[${index}].format`), "getting");
    } else {
      setValue(`columns[${index}].format`, 0);
      setformat(null);
    }
  };
  //Deletion of Accordiaon from both Select and Accordion Button Start
  let resultant = [];
  function isObjectInArray(array, object, key) {
    return array.some((item) => item?.[key] === object?.[key]);
  }
  let columnManipulate = (prevValue, newValue) => {
    if (prevValue.length > newValue.length) {
      let resultant = prevValue.filter(
        (item) => !isObjectInArray(newValue, item, "value")
      );

      if (resultant) {
        setDeselected(resultant);
      }
    }
    return newValue;
  };

  const previousFields = useRef(fields);

  useEffect(() => {
    const fieldColumnNames = fields.map((field) => field.columnName);

    const removedFields = previousFields.current.filter(
      (prevField) => !fieldColumnNames.includes(prevField.columnName)
    );

    if (removedFields.length > 0) {
      const updatedSelectedOption = selectedOption.filter(
        (option) =>
          !removedFields.some(
            (removedField) => removedField?.columnName === option?.value
          )
      );

      setSelecetdOption(updatedSelectedOption);
    }

    previousFields.current = fields;
  }, [fields, selectedOption]);
  //Deletion of Accordiaon from both Select and Accordion Button End

  //Alert user For Display Duplicate Display order Start
  const displayOrders =
    useWatch({ name: "columns", control })?.map((col) =>
      Number(col.displayOrder)
    ) || [];
  useWatch({ name: "filters", control })?.map((col) =>
    Number(col.displayOrder)
  ) || [];

  useEffect(() => {
    const findDuplicates = (arr) => {
      const { seen, duplicates } = arr.reduce(
        (acc, value) => {
          if (acc.seen.has(value)) {
            acc.duplicates.add(value);
          }
          acc.seen.add(value);
          return acc;
        },
        { seen: new Set(), duplicates: new Set() }
      );

      return Array.from(duplicates);
    };

    const duplicates = findDuplicates(displayOrders);

    setAlertMessage(
      duplicates.length > 0
        ? `Duplicate displayOrder values detected: ${duplicates.join(", ")}`
        : ""
    );
  }, [displayOrders]);
  //Alert user For Display Duplicate Display order End

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="card reportChart-cards p-2">
        {/* <h4 className="card-header">
          REPORT DESIGNER : {watch("reportTitle")}
        </h4> */}

        <div
          className="shadow font-medium  bg-white sticky-top "
          style={{ top: "62px", zIndex: 1 }}
        >
          <Row>
            <Col>
              <span className="f-6">Report Designer</span> <br />
              <span className="h4">{watch("reportTitle")}</span>
            </Col>
            <Col className="mt-2">
              {alertMessage && (
                <Alert
                  variant="danger"
                  className="text-danger d-flex justify-content-center align-items-center"
                >
                  {alertMessage}
                </Alert>
              )}
            </Col>
            <Col>
              <div className="text-center  float-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={alertMessage}
                >
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
          <Tab eventKey="details" title="Details">
            <Row>
              <Col lg={3} md={6} sm={12}>
                <FormControl
                  control={control}
                  type="select"
                  field_title="Module"
                  name="moduleId"
                  options={ModuleOptions}
                  required
                />
              </Col>
              <Col lg={3} md={6} sm={12}>
                <FormControl
                  control={control}
                  type="input"
                  field_title="Title"
                  name="reportTitle"
                  required
                />
              </Col>
              {/* <Col>
              <FormControl
                control={control}
                type="input"
                field_title="Name"
                name="reportName"
                required
              />
            </Col> */}
              <Col lg={3} md={6} sm={12}>
                <FormControl
                  control={control}
                  type="controlledObjectName"
                  field_title="Name"
                  name="reportName"
                  required
                  nonEngine="reports"
                  value={watch("moduleId")}
                  setValue={setValue}
                />
              </Col>
              <Col lg={3} md={6} sm={12}>
                <FormControl
                  control={control}
                  type="select"
                  field_title="Form"
                  name="formName"
                  options={formOptions}
                  // required
                />
              </Col>
            </Row>
            <Row>
              <Col lg={3} md={6} sm={12}>
                <FormControl
                  control={control}
                  type="input"
                  field_title="Data Source"
                  name="dataSource"
                  // required
                />
              </Col>

              <Col lg={3} md={6} sm={12}>
                <FormControl
                  control={control}
                  type="input"
                  field_title="No of Records per Page"
                  name="noOfRecordsPerPage"
                  required
                  // value={10}
                />
              </Col>

              <Col lg={3} md={6} sm={12}>
                <FormControl
                  control={control}
                  type="select"
                  field_title="Theme"
                  name={`theme`}
                  options={[
                    { key: 1, value: "Default Theme" },
                    { key: 2, value: "Light Theme" },
                  ]}
                  // required
                />
              </Col>

              <Col lg={3} md={6} sm={12}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Create Form Link</label>

                    <Select
                      name="createFormLink"
                      {...register("createFormLink")}
                      className={`form-control ${
                        errors.createFormLink ? "is-invalid" : ""
                      }`}
                      options={creatLinkFormOptions}
                      value={selectedFormOption}
                      isMulti
                      closeMenuOnSelect={false}
                      onChange={(e) => {
                        TempcreateFormLink = [];
                        const values = e
                          .map((option) =>
                            TempcreateFormLink.push(option.value)
                          )
                          .join(", ");
                        setValue("createFormLink", TempcreateFormLink);
                        setSelecetedFormOption(e);
                      }}
                    ></Select>
                    <div className="invalid-feedback">
                      {errors.createFormLink?.message}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={6} md={12} sm={12}>
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
                    name="defaultFilter"
                    type="input"
                    control={control}
                    field_title="Default Filter"
                  />
                </Row>
                <Row>
                  <FormControl
                    name="defaultOrderExpression"
                    type="input"
                    control={control}
                    field_title="Default Order Expression"
                  />
                </Row>
              </Col>
            </Row>
          </Tab>
          <Tab
            eventKey="columns"
            title={
              <>
                {/* <FontAwesomeIcon icon={faHistory} />  */}
                Columns
              </>
            }
          >
            <Row>
              <h2>
                <center>Columns</center>
              </h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Select Columns</label>
                  <Select
                    name="selectedColumns"
                    {...register("selectedColumns")}
                    className={`form-control ${
                      errors.selectedColumns ? "is-invalid" : ""
                    }`}
                    options={columnOptions}
                    value={selectedOption}
                    isMulti
                    closeMenuOnSelect={false}
                    onChange={(selectedOptions) => {
                      resultant = selectedOptions;

                      setSelecetdOption((prevValue) => {
                        const updatedValue = columnManipulate(
                          prevValue,
                          selectedOptions
                        );

                        return updatedValue;
                      });

                      const selectedValues = selectedOptions.map(
                        (option) => option.value
                      );
                      // setSelectedColumnValues(selectedValues);
                      setSelectedColumnValues((prevSelectedValues) => {
                        // Combine the previous values with the selected values
                        const updatedValues = [
                          ...prevSelectedValues,
                          ...selectedValues,
                        ];

                        return updatedValues;
                      });

                      setSelectedColumnValues(selectedValues);

                      const selectedColumnsData = columnsMetaData.filter(
                        (option) => selectedValues.includes(option.column_name)
                      );
                      setFinalValue(selectedColumnsData);
                      // alert( getValues('columns').length);
                      const columnsArray = getValues("columns");

                      let existingColumns = [];
                      for (
                        let index = 0;
                        index < columnsArray.length;
                        index++
                      ) {
                        existingColumns.push(
                          getValues(`columns.${index}.columnName`)
                        );
                        // alert( getValues(`columns.${index}.columnName`))
                      }
                      selectedColumnsData.forEach((columnData) => {
                        const {
                          column_name,
                          field_title,
                          data_type,
                          title_key,
                        } = columnData;

                        // alert(existingColumns.includes(column_name));

                        if (!existingColumns.includes(column_name)) {
                          append({
                            columnName: column_name,
                            columnTitle: title_key,
                            columnType: data_type,
                            columnSize: 150,
                            visible: true,
                            sortable: true,
                            filterable: true,
                            displayOrder: fields.length,
                            align: 1,
                            format: format,
                          });
                        }
                      });
                    }}
                  ></Select>
                  <div className="invalid-feedback">
                    {errors.selectedColumns?.message}
                  </div>
                </div>
              </div>
            </Row>

            <Accordion defaultActiveKey="0">
              {fields.map((item, i) => {
                const swapFunctionUp = (currentIndex) => {
                  //passing the current index based on the onclick i will get these and i am passed it as an parameter and taking here as an argument
                  const newIndex = currentIndex - 1; // based on the currentindex subracting and creating new index
                  if (newIndex >= 0) {
                    const updatedFields = [...fields]; //taking the itesm that i have selected using the the select option
                    const temp = updatedFields[currentIndex]; //taking the item that i have been trigrred using the onclick move up

                    updatedFields[currentIndex] = updatedFields[newIndex]; //swapping here

                    updatedFields[newIndex] = temp; //swapping here

                    //  swap(currentIndex, newIndex);
                    // setValue(`columns.${i}.columnName`,`${currentColumnName}`)
                    // setValue(`columns.${i}.columnTitle`,`${currentColumnTitle}`)
                    // setValue(`columns.${i}.columnType`,`${currentColumnType}`)
                    setValue("columns", updatedFields); //setting the updatedFields to the fields or column
                  }
                };
                const swapFunctionDown = (currentIndex) => {
                  const newIndex = currentIndex + 1;
                  if (newIndex >= 0) {
                    const updatedFields = [...fields];
                    const temp = updatedFields[currentIndex];

                    updatedFields[currentIndex] = updatedFields[newIndex];

                    updatedFields[newIndex] = temp;

                    //  swap(currentIndex, newIndex);
                    // setValue(`columns.${i}.columnName`,`${currentColumnName}`)
                    // setValue(`columns.${i}.columnTitle`,`${currentColumnTitle}`)
                    // setValue(`columns.${i}.columnType`,`${currentColumnType}`)
                    setValue("columns", updatedFields);
                  }
                };

                let columnRecord = `columns.${i}`;

                return (
                  <Accordion.Item eventKey={i} key={item.id}>
                    <Accordion.Header
                      className="d-flex justify-content-start py-0"
                      style={{ height: "50px" }}
                    >
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <div>
                          {(getValues(`columns.${i}.columnTitle`) || "") +
                            " [ " +
                            (getValues(`${columnRecord}.columnName`) || "") +
                            "]"}
                        </div>
                        {/* <div className=" border d-flex justify-content-end"> */}
                        <Row className=" d-flex justify-content-end me-4">
                          <div className="col-md-6 mt-2">
                            <FormControl
                              control={control}
                              type="number"
                              field_title="Order"
                              name={`${columnRecord}.displayOrder`}
                              required
                              hideTitle
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="col-md-1 mt-1">
                            <Button
                              className="me-3 mt-2 "
                              onClick={(e) => {
                                e.stopPropagation();

                                removeColumn(i);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </Row>
                        {/* </div> */}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Name"
                            name={`${columnRecord}.columnName`}
                            value={getValues(`columns.${i}.columnName`)}
                            required
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Title"
                            name={`${columnRecord}.columnTitle`}
                            // value={getValues(`columns.${i}.columnTitle`)}
                            required
                          />
                        </Col>
                        {/* <Col>
                      <FormControl
                        control={control}
                        type="select"
                        field_title="Type"
                        name={`${columnRecord}.columnType`}
                        value={getValues(`columns.${i}.columnType`)}
                        options={columnTypeOptions}
                        required
                      />
                    </Col> */}
                        <Col xl={3} md={6} sm={12}>
                          <label className="text-black m-1">Type</label>
                          <Form.Select
                            as="select"
                            size="lg"
                            title="format"
                            {...register(`columns[${i}].columnType`)}
                            name={`columns[${i}].columnType`}
                            className={
                              `form-control ${
                                errors.selectedColumns ? "is-invalid" : ""
                              }` ||
                              (required && "mandatory")
                            }
                            defaultValue={getValues(`columns[${i}].columnType`)}
                            value={customSelect}
                            onChange={(e) => {
                              // setCustomSelect(e.target.value);
                              // const selectedValue = e.target.value;

                              // if (selectedValue === "4") { // Assuming "4" corresponds to the specific condition you want
                              //   setValue(`columns[${i}].format`, 82);
                              // } else {
                              //   // You might want to set another value or perform other actions for different conditions
                              // }
                              CustomFunction(e.target.value, i);
                            }}
                            required
                          >
                            <option key="" value="Select an option">
                              Select an option
                            </option>
                            {columnTypeOptions &&
                              columnTypeOptions.map((option) => {
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
                          {errors[`columns[${i}].columnType`] && (
                            <div className="invalid-feedback">
                              {errors[`columns[${i}].columnType`]?.message}
                            </div>
                          )}
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Size"
                            name={`${columnRecord}.columnSize`}
                            // value={getValues(`columns.${i}.columnSize`)}
                            required
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="number"
                            field_title="Order"
                            name={`${columnRecord}.displayOrder`}
                            required
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="select"
                            field_title="Alignment"
                            name={`${columnRecord}.align`}
                            options={[
                              { key: 1, value: "Left" },
                              { key: 2, value: "Right" },
                              { key: 3, value: "Center" },
                            ]}
                            required
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="ID Column"
                            name={`${columnRecord}.idColumnName`}
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Form"
                            name={`${columnRecord}.form`}
                          />
                        </Col>
                        {/* <Col>
                      <FormControl
                        control={control}
                        type="input"
                        field_title="Format"
                        name={`${columnRecord}.format`}
                      />
                    </Col> */}
                      </Row>
                      <Row>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Page"
                            name={`${columnRecord}.page`}
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Parent ID Column"
                            name={`${columnRecord}.parentObjectName`}
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Record Type"
                            name={`${columnRecord}.recordType`}
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Expression"
                            name={`${columnRecord}.expression`}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={3} md={6} sm={12}>
                          <label className="text-black m-1">Format</label>

                          <Form.Select
                            as="select"
                            size="lg"
                            name={`columns[${i}].format`}
                            {...register(`columns[${i}].format`)}
                            className={`form-control ${
                              errors.selectedColumns ? "is-invalid" : ""
                            }`}
                            defaultValue={getValues(`columns[${i}].columnType`)}
                            onChange={(e) => {}}
                          >
                            {/* <option key="" value="Select an option">
                              Select an option
                            </option> */}
                            {DateFormat &&
                              DateFormat.map((option) => {
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
                        </Col>

                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Class Name"
                            name={`${columnRecord}.className`}
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Method Name"
                            name={`${columnRecord}.methodName`}
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          {" "}
                          <FormControl
                            control={control}
                            type="select"
                            field_title="Direction"
                            name={`${columnRecord}.stickyDirection`}
                            options={[
                              { key: 1, value: "Start" },
                              { key: 2, value: "End" },
                            ]}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col xl={3} md={6} sm={12}>
                          <Row>
                            <Col>
                              <FormControl
                                control={control}
                                type="switch"
                                field_title="Visible"
                                name={`${columnRecord}.visible`}
                                value={getValues(`columns.${i}.visible`)}
                                hideTitle
                              />
                            </Col>
                            <Col>
                              <FormControl
                                control={control}
                                type="switch"
                                field_title="Sortable"
                                name={`${columnRecord}.sortable`}
                                value={getValues(`columns.${i}.sortable`)}
                                hideTitle
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <Row>
                            <Col>
                              <FormControl
                                control={control}
                                type="switch"
                                field_title="Filterable"
                                name={`${columnRecord}.filterable`}
                                value={getValues(`columns.${i}.filterable`)}
                                hideTitle
                              />
                            </Col>
                            <Col>
                              <FormControl
                                control={control}
                                type="switch"
                                field_title="Menu Column"
                                name={`${columnRecord}.menuColumn`}
                                value={getValues(`columns.${i}.menuColumn`)}
                                hideTitle
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <Row>
                            <Col>
                              <FormControl
                                control={control}
                                type="switch"
                                field_title="Sticky"
                                name={`${columnRecord}.stickyColumn`}
                                value={getValues(`columns.${i}.stickyColumn`)}
                                hideTitle
                              />
                            </Col>
                            <Col></Col>
                          </Row>
                        </Col>

                        <Col className="Color-column" xl={3} md={6} sm={12}>
                          <ColumnColour
                            parentIndex={i}
                            control={control}
                            fieldName={`${columnRecord}.colors`} // Replace 'nestedArray' with your nested array name
                          />
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>

            <Button
              className="mt-2"
              onClick={() =>
                // regionHelpers.push({
                //   regionCode: "",
                //   regionTitle: "",
                //   parentRegion: "",
                // })
                append({
                  columnSize: 150, // Provide a default size or set it as needed
                  visible: true,
                  sortable: true,
                  filterable: true,
                  displayOrder: fields.length, // Set the correct display order
                  align: 1, // Set the default alignment
                })
              } // insert an empty string at a position
            >
              + Add Column
            </Button>
          </Tab>
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
                return (
                  <Accordion.Item eventKey={i} key={item.id}>
                    <Accordion.Header
                      className="d-flex justify-content-start"
                      style={{ height: "50px" }}
                    >
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <div>
                          {getValues(`${FilterRecord}.filterTitle`) || ""}
                        </div>
                        {/* <div className="ml-auto d-flex">
                          <FormControl
                            control={control}
                            type="number"
                            field_title="Order"
                            name={`${FilterRecord}.displayOrder`}
                            required
                            hideTitle
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div> */}
                        {/* <Button
                          className="me-3"
                          onClick={(e) => {
                            e.stopPropagation();

                            // remove(i);
                            removeField(i);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button> */}
                        <Row className=" d-flex justify-content-end me-4">
                          <div className="col-md-6 mt-2">
                            <FormControl
                              control={control}
                              type="number"
                              field_title="Order"
                              name={`${FilterRecord}.displayOrder`}
                              required
                              hideTitle
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="col-md-1 mt-2">
                            <Button
                              className="me-3"
                              onClick={(e) => {
                                e.stopPropagation();

                                // remove(i);
                                removeField(i);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </Row>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="textarea"
                            field_title="Filter Expression"
                            name={`${FilterRecord}.filterExpression`}
                            // options={columnOptions}
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Filter Param Name"
                            name={`${FilterRecord}.filterParameter`}
                            // required
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Filter Title"
                            name={`${FilterRecord}.filterTitle`}
                            // required
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="select"
                            field_title="Filter Column Data Type"
                            name={`${FilterRecord}.filterType`}
                            options={filterTypeOptions}
                          />
                          <FormControl
                            control={control}
                            type="switch"
                            field_title="Multi Select"
                            name={`${FilterRecord}.isMultiSelect`}
                            hideTitle
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
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="number"
                            field_title="Order"
                            name={`${FilterRecord}.displayOrder`}
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Picklist"
                            name={`${FilterRecord}.picklist`}
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Display Value"
                            name={`${FilterRecord}.displayValue`}
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Stored Value"
                            name={`${FilterRecord}.storedValue`}
                          />
                        </Col>
                      </Row>
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
                          {" "}
                          <FormControl
                            control={control}
                            type="input"
                            field_title="Data Source"
                            name={`${FilterRecord}.dataSource`}
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}></Col>
                      </Row>
                      <Row>
                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="switch"
                            field_title="Favourite"
                            name={`${FilterRecord}.favouriteFilter`}
                            hideTitle
                          />
                        </Col>

                        <Col xl={3} md={6} sm={12}>
                          <FormControl
                            control={control}
                            type="switch"
                            field_title="Mandatory filter"
                            name={`${FilterRecord}.mandatoryFilter`}
                            hideTitle
                          />
                        </Col>
                        <Col xl={3} md={6} sm={12}>
                          {" "}
                          <FormControl
                            control={control}
                            type="switch"
                            field_title="Frequent"
                            name={`${FilterRecord}.frequentFilter`}
                            hideTitle
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
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>

            <Button
              className="mt-2"
              onClick={() => appendNew({})} // insert an empty string at a position
            >
              + Add Filter
            </Button>
          </Tab>

          <Tab eventKey="datacards" title={<>Data Cards</>}>
            <h2>
              <center>Data Cards</center>
            </h2>
            <Row>
              <Col xl={3} md={6} sm={12}>
                <FormControl
                  type="switch"
                  control={control}
                  field_title="Total Operation"
                  name="enableTotalOperation"
                  hideTitle
                />
              </Col>
            </Row>
            <Row>
              <Col xl={3} md={6} sm={12}>
                {" "}
                <FormControl
                  control={control}
                  type="colorPicker"
                  field_title="DataCard BackgroundColor"
                  name="dataCardBackgroundColor"
                />
              </Col>
              <Col xl={3} md={6} sm={12}>
                {" "}
                <FormControl
                  control={control}
                  type="colorPicker"
                  field_title="DataCard TextColor"
                  name="dataCardTextColor"
                />
              </Col>
              {watch("enableTotalOperation") && (
                // <Row>
                <>
                  <Col xl={3} md={6} sm={12}>
                    <FormControl
                      control={control}
                      type="select"
                      field_title="Total Operation"
                      options={reportOperations}
                      name="totalOperation"
                    />
                  </Col>
                  <Col xl={3} md={6} sm={12}>
                    <FormControl
                      control={control}
                      type="input"
                      field_title="Operation Field"
                      name="operationField"
                    />
                  </Col>
                </>
              )}
            </Row>
            <Accordion defaultActiveKey="0">
              {dataCardFields.map((item, i) => {
                let DataCard = `dataCards.${i}`;

                return (
                  <Accordion.Item eventKey={i} key={item.id}>
                    <Accordion.Header
                      className="d-flex justify-content-start"
                      style={{ height: "40px" }}
                    >
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <div>
                          {getValues(`${DataCard}.cardColumn`) +
                            "[" +
                            getValues(`${DataCard}.cardTitle`) +
                            "]" || ""}
                        </div>
                        <div className="ml-auto d-flex"></div>

                        <Button
                          className="me-3"
                          onClick={(e) => {
                            e.stopPropagation();

                            // remove(i);
                            removeDataCard(i);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col>
                          <FormControl
                            type="input"
                            control={control}
                            field_title="Card Column"
                            name={`${DataCard}.cardColumn`}
                          />
                        </Col>

                        <Col>
                          <FormControl
                            type="input"
                            control={control}
                            field_title="Card Title"
                            name={`${DataCard}.cardTitle`}
                          />
                        </Col>
                        <Col>
                          <FormControl
                            type="input"
                            control={control}
                            field_title="PickList Name"
                            name={`${DataCard}.picklistName`}
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control={control}
                            type="colorPicker"
                            field_title="BackGroundColor"
                            name={`${DataCard}.backgroundColor`}

                            // value="y"
                            // required
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control={control}
                            type="colorPicker"
                            field_title="Text Color"
                            name={`${DataCard}.textColor`}

                            // value="y"
                            // required
                          />
                        </Col>
                        <Row>
                          <Col>
                            <FormControl
                              type="switch"
                              control={control}
                              field_title="Active"
                              name={`${DataCard}.active`}
                              hideTitle
                            />
                          </Col>
                          <Col></Col>
                          <Col>
                            <FormControl
                              type="switch"
                              control={control}
                              field_title="Pivot"
                              name={`${DataCard}.isPivot`}
                              hideTitle
                            />
                          </Col>
                          <Col></Col>
                        </Row>
                      </Row>

                      <Row>
                        <Col xl={3} md={4} sm={12}>
                          <FormControl
                            control={control}
                            type="select"
                            options={reportOperations}
                            field_title="Operations"
                            name={`${DataCard}.operation`}
                          />
                        </Col>
                        <Col xl={3} md={4} sm={12}>
                          <FormControl
                            type="input"
                            control={control}
                            field_title="Order By"
                            name={`${DataCard}.orderBy`}
                          />
                        </Col>
                        {watch(`${DataCard}.isPivot`) && (
                          <>
                            <Col xl={3} md={4} sm={12}>
                              <FormControl
                                type="input"
                                control={control}
                                field_title="Sub Card Column"
                                name={`${DataCard}.subCardColumn`}
                              />
                            </Col>
                            <Col xl={3} md={4} sm={12}>
                              <FormControl
                                type="input"
                                control={control}
                                field_title="Sub Card Title"
                                name={`${DataCard}.subCardTitle`}
                              />
                            </Col>
                          </>
                        )}
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>

            <Button
              onClick={() => appendNewDataCard({})} // insert an empty string at a position
              className="mt-2"
            >
              + Add DataCard
            </Button>
          </Tab>

          <Tab
            eventKey="drilleddownReports"
            title={
              <>
                {/* <FontAwesomeIcon icon={faHistory} />  */}
                Child Reports
              </>
            }
          >
            <h2>
              <center> Child Reports</center>
            </h2>
            <Accordion defaultActiveKey="0">
              {childReportsfields.map((item, i) => {
                let Childreport = `reportChilds.${i}`;

                return (
                  <Accordion.Item eventKey={i} key={item.id}>
                    <Accordion.Header
                      className="d-flex justify-content-start"
                      style={{ height: "40px" }}
                    >
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <div>
                          {getValues(`${Childreport}.reportName`) +
                            "[" +
                            getValues(`${Childreport}.mappedColumn`) +
                            "]" || ""}
                        </div>
                        <div className="ml-auto d-flex"></div>

                        {/* <FontAwesomeIcon
                      icon={faTrash}
                      className="text-primary"
                      onClick={() => removeField(i)}
                      size="2x"
                    /> */}
                        <Button
                          className="me-3"
                          onClick={(e) => {
                            e.stopPropagation();

                            // remove(i);
                            removeChildreports(i);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col>
                          <FormControl
                            type="input"
                            control={control}
                            field_title="Report Name"
                            name={`${Childreport}.reportName`}
                          />
                        </Col>

                        <Col>
                          <FormControl
                            type="input"
                            control={control}
                            field_title="Filter Expression"
                            name={`${Childreport}.filterExpression`}
                          />
                        </Col>
                        <Col>
                          <FormControl
                            type="input"
                            control={control}
                            field_title="Mapped Columns"
                            name={`${Childreport}.mappedColumn`}
                          />
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>

            <Button
              onClick={() => appendNewChildreports({})} // insert an empty string at a position
              className="mt-2"
            >
              + Add Child Reports
            </Button>
          </Tab>
          <Tab eventKey="Settings" title={<>Additional Settings</>}>
            <Row className="pt-2">
              <Col className="ms-3">
                <FormControl
                  name="enableHeaderBar"
                  type="switch"
                  control={control}
                  field_title="Report Header Panel"
                  hideTitle
                />
                <FormControl
                  name="enableExportHistory"
                  type="switch"
                  control={control}
                  field_title="Export History"
                  className="ms-4"
                  hideTitle
                />
                <FormControl
                  name="enableFilterPanel"
                  type="switch"
                  control={control}
                  field_title="Filters Panel"
                  className="ms-4"
                  hideTitle
                />
                <FormControl
                  name="enableColumnFilters"
                  type="switch"
                  control={control}
                  field_title="Column Filters"
                  className="ms-4"
                  hideTitle
                />
                <FormControl
                  name="enableColumnSelection"
                  type="switch"
                  control={control}
                  field_title="Column Selection"
                  className="ms-4"
                  hideTitle
                />
                <FormControl
                  name="optionalColumnHeaderFilter"
                  type="switch"
                  control={control}
                  field_title="Optional Header Filter"
                  className="ms-4"
                  hideTitle
                />
              </Col>

              <Col>
                <FormControl
                  name="enableBottomBar"
                  type="switch"
                  control={control}
                  field_title="Report Bottom Panel"
                  hideTitle
                />
                <Row>
                  <Col>
                    <FormControl
                      name="defaultBottomBar"
                      type="switch"
                      control={control}
                      field_title="Default"
                      hideTitle
                    />
                  </Col>
                  <Col>
                    <FormControl
                      name="enableOptionalBottomPanel"
                      type="switch"
                      control={control}
                      field_title="Arrow"
                      hideTitle
                    />
                  </Col>
                </Row>
                <FormControl
                  name="enablePagination"
                  type="switch"
                  control={control}
                  field_title="Report Pagination"
                  className="ms-4"
                  hideTitle
                />

                <FormControl
                  name="firstLastpage"
                  type="switch"
                  control={control}
                  field_title="FirstPage & LastPage"
                  className="ms-6"
                  hideTitle
                />
                <FormControl
                  name="previousNextpage"
                  type="switch"
                  control={control}
                  field_title="PreviousPage & NextPage"
                  className="ms-6"
                  hideTitle
                />

                <FormControl
                  name="gotoPage"
                  type="switch"
                  control={control}
                  field_title="Goto Page"
                  className="ms-6"
                  hideTitle
                />
                <FormControl
                  name="pageIndex"
                  type="switch"
                  control={control}
                  field_title="PageIndex"
                  className="ms-6"
                  hideTitle
                />
                <FormControl
                  name="enableRecordsPerPage"
                  type="switch"
                  control={control}
                  field_title="Records Per Page"
                  className="ms-4"
                  hideTitle
                />

                <FormControl
                  name="totalRow"
                  type="switch"
                  control={control}
                  field_title="TotalRow"
                  className="ms-6"
                  hideTitle
                />
                <FormControl
                  name="pageOfTotalPage"
                  type="switch"
                  control={control}
                  field_title="Page of Total page"
                  className="ms-6"
                  hideTitle
                />
                <FormControl
                  name="recordsInPage"
                  type="switch"
                  control={control}
                  field_title="Records In page"
                  className="ms-6"
                  hideTitle
                />
              </Col>
              <Col>
                <FormControl
                  name="recordLevelSecurity"
                  type="switch"
                  control={control}
                  field_title="Record Level Security"
                  hideTitle
                />
                <FormControl
                  name="enableTileView"
                  type="switch"
                  control={control}
                  field_title="Tile view"
                  hideTitle
                />
                <FormControl
                  name="dataCard"
                  type="switch"
                  control={control}
                  field_title="Data Cards"
                  hideTitle
                />
                <FormControl
                  name="dataCardTitle"
                  type="switch"
                  control={control}
                  field_title="DataCard Title "
                  className="ms-4"
                  hideTitle
                />
                <FormControl
                  name="filterProfile"
                  type="switch"
                  control={control}
                  field_title="Filter Profile"
                  hideTitle
                />
                <FormControl
                  name="allowDeletion"
                  type="switch"
                  control={control}
                  field_title="Record Deletion"
                  hideTitle
                />
                <FormControl
                  name="enableExportToTemplate"
                  type="switch"
                  control={control}
                  field_title="Export To Template"
                  hideTitle
                />
              </Col>
            </Row>
          </Tab>
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

export default ReportDesigner;
const ColumnColour = ({ parentIndex, control, fieldName }) => {
  const [showModal, setModal] = useState(false);
  const parentFieldName = fieldName; //columns.1.fieldName
  const ColourApplied = [
    { key: "1", value: "Badge" },
    { key: "2", value: "Cell" },
    { key: "3", value: "Row" },
    { key: "4", value: "Icon" },
  ];
  const {
    fields: colourFields,
    append: appendcolour,
    remove: removeColour,
  } = useFieldArray({
    control,
    name: parentFieldName,
  });

  return (
    <div>
      <Button variant="success" onClick={() => setModal(true)}>
        Add Colour To Coloumns
      </Button>
      <Modal show={showModal} onHide={() => setModal(false)} size="lg">
        <ModalHeader closeButton>
          <Modal.Title>Add Colours To Columns</Modal.Title>
        </ModalHeader>
        <ModalBody>
          {colourFields.map((colourField, colourIndex) => (
            <div key={colourField.id}>
              <Row>
                <Col>
                  <FormControl
                    control={control}
                    type="select"
                    field_title="Apply Colour"
                    name={`${parentFieldName}[${colourIndex}].applyColor`} //columns.1.fieldName.0.applycolour
                    options={ColourApplied}
                  />
                </Col>
                <Col>
                  <FormControl
                    control={control}
                    type="input"
                    field_title="Column Value"
                    name={`${parentFieldName}[${colourIndex}].columnValue`}
                    // options={columnOptions}
                  />
                </Col>
                <Col>
                  <FormControl
                    control={control}
                    type="colorPicker"
                    field_title="Background Colour"
                    name={`${parentFieldName}[${colourIndex}].backgroundColor`}
                  />
                </Col>
                <Col>
                  <FormControl
                    control={control}
                    type="colorPicker"
                    field_title="Font Colour"
                    name={`${parentFieldName}[${colourIndex}].fontColor`}
                  />
                </Col>
                <Col>
                  <FormControl
                    control={control}
                    type="colorPicker"
                    field_title="Border Colour"
                    name={`${parentFieldName}[${colourIndex}].borderColor`}
                  />
                </Col>
              </Row>

              <Button
                variant="danger"
                type="button"
                onClick={() => removeColour(colourIndex)}
              >
                Remove Field
              </Button>
            </div>
          ))}

          {/* <Button type="button" onClick={() => appendcolour({
        
       })}>
        Add colour field 
      </Button> */}
        </ModalBody>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setModal(false)}>
            Ok
          </Button>
          {/* Button to add a new colour field */}
          <Button variant="primary" onClick={() => appendcolour({})}>
            Add Colour Field
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
