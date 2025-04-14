import { Formik, FieldArray } from "formik";
import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CSS } from "@dnd-kit/utilities";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getServiceData } from "src/components/server/service";
import Marquee from "react-fast-marquee";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Controller } from "react-hook-form";
import Select from "react-select";
import {
  horizontalListSortingStrategy,
  rectSwappingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { getviewData } from "../EngineService";
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
  Nav,
  Modal,
} from "react-bootstrap";

const fileType = [
  { key: ".pdf", value: "PDF" },
  { key: ".doc", value: "DOC" },
  { key: ".xlsx", value: "XLSX" },
  { key: ".png", value: "PNG" },
  { key: ".jpg", value: "JPG" },
  { key: ".docx", value: "DOCX" },
  { key: ".txt", value: "TXT" },
  { key: ".zip", value: "ZIP" },
  { key: ".xls", value: "XLS" },
  { key: ".csv", value: "CSV" },
  { key: ".gif", value: "GIF" },
];
const fieldDataTypeOptions = [
  { key: "1", value: "Number" },
  { key: "2", value: "Number with Decimals" },
  { key: "3", value: "Date" },
  { key: "4", value: "DateTime" },
  { key: "5", value: "DateTime with Timezone" },
  { key: "6", value: "String" },
  { key: "7", value: "Boolean" },
  { key: "8", value: "CLOB" },
];

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
  { key: "PicklistSelect", value: "PicklistSelect" },
  { key: "richtexteditor", value: "Rich Text Editor" },
  { key: "treeDropdown", value: "Tree Dropdown" },
  { key: "timepicker", value: "Time Picker" },
  { key: "controlledObjectName", value: "Controlled ObjectName" },
  { key: "range", value: "Range" },
  { key: "rating", value: "Rating" },
];
const categories = [
  { key: "1", value: "Organization" },
  { key: "2", value: "User" },
  { key: "3", value: "Others" },
];

const afterSubmit = [
  { key: "1", value: "Report" },
  { key: "2", value: "Chart" },
  { key: "3", value: "Custom" },
];

const profiles = [
  { key: "1", value: "standardColumns" },
  { key: "2", value: "standardColumnsWf" },
  { key: "3", value: "standardLibraryColumns" },
  { key: "4", value: "standardSchedularColumn" },
];

let Profile = {
  standardColumns: {
    objectId: {
      fieldType: "1",
      displayType: "number",
      fieldTitle: "Id",
      fieldName: "objectId",
      dbColumnName: "OBJECT_ID",
      isKeyColumn: true,
    },
    createdOn: {
      fieldType: "4",
      displayType: "date",
      fieldTitle: "Created On",
      fieldName: "createdOn",
      dbColumnName: "CREATED_ON",
      isReportable: true,
      isPersistable: true,
    },
    createdBy: {
      fieldType: "1",
      displayType: "input",
      fieldTitle: "Created By",
      fieldName: "createdBy",
      dbColumnName: "CREATED_BY",
      // isReportable:true,
      // isPersistable:true,
      category: "2",
      isPicklist: true,
    },
    lastUpdatedOn: {
      fieldType: "4",
      displayType: "date",
      fieldTitle: "Last Updated On",
      fieldName: "lastUpdatedOn",
      dbColumnName: "LAST_UPDATED_ON",
      isReportable: true,
      isPersistable: true,
    },
    lastUpdatedBy: {
      fieldType: "1",
      displayType: "input",
      fieldTitle: "Last Updated by",
      fieldName: "lastUpdatedBy",
      dbColumnName: "LAST_UPDATED_BY",
      category: "2",
      isPicklist: true,
    },
    comments: {
      fieldType: "6",
      displayType: "textarea",
      fieldTitle: "Comments",
      fieldName: "comments",
      dbColumnName: "COMMENTS",
      isReportable: true,
      isPersistable: true,
      changeHistory: true,
      fieldSize: 4000,
    },
  },
  standardColumnsWf: {
    objectId: {
      fieldType: "1",
      displayType: "number",
      fieldTitle: "Id",
      fieldName: "objectId",
      dbColumnName: "OBJECT_ID",
      isKeyColumn: true,
    },
    createdOn: {
      fieldType: "4",
      displayType: "date",
      fieldTitle: "Created On",
      fieldName: "createdOn",
      dbColumnName: "CREATED_ON",
      isReportable: true,
      isPersistable: true,
    },
    createdBy: {
      fieldType: "1",
      displayType: "input",
      fieldTitle: "Created By",
      fieldName: "createdBy",
      dbColumnName: "CREATED_BY",
      // isReportable:true,
      // isPersistable:true,
      category: "2",
      isPicklist: true,
    },
    lastUpdatedOn: {
      fieldType: "4",
      displayType: "date",
      fieldTitle: "Last Updated On",
      fieldName: "lastUpdatedOn",
      dbColumnName: "LAST_UPDATED_ON",
      isReportable: true,
      isPersistable: true,
    },
    lastUpdatedBy: {
      fieldType: "1",
      displayType: "input",
      fieldTitle: "Last Updated by",
      fieldName: "lastUpdatedBy",
      dbColumnName: "LAST_UPDATED_BY",
      category: "2",
      isPicklist: true,
    },
    currentStage: {
      fieldType: "6",
      displayType: "input",
      fieldTitle: "Current Stage",
      fieldName: "currentStage",
      dbColumnName: "CURRENT_STAGE",
      fieldSize: 255,
    },
    previousStage: {
      fieldType: "6",
      displayType: "input",
      fieldTitle: "Previous Stage",
      fieldName: "previousStage",
      dbColumnName: "PREVIOUS_STAGE",
      fieldSize: 255,
    },
    status: {
      fieldType: "6",
      displayType: "input",
      fieldTitle: "Status",
      fieldName: "status",
      dbColumnName: "STATUS",
      isReportable: true,
      isPersistable: true,
      fieldSize: 255,
    },
    Action: {
      fieldType: "1",
      displayType: "input",
      fieldTitle: "Action",
      fieldName: "action",
      dbColumnName: "ACTION",
      isReportable: true,
      isPersistable: true,
    },
    // dueDate: {
    //   fieldType: "4",
    //   displayType: "date",
    //   fieldTitle: "Due Date",
    //   fieldName: "dueDate",
    //   dbColumnName: "DUE_DATE",
    // },
    workFlow: {
      fieldType: "1",
      displayType: "input",
      fieldTitle: "Work Flow",
      fieldName: "workflow",
      dbColumnName: "WORKFLOW",
    },
    comments: {
      fieldType: "6",
      displayType: "textarea",
      fieldTitle: "Comments",
      fieldName: "comments",
      dbColumnName: "COMMENTS",
      isReportable: true,
      isPersistable: true,
      changeHistory: true,
      fieldSize: 4000,
    },
  },
  standardLibraryColumns: {
    objectId: {
      fieldType: "1",
      displayType: "number",
      fieldTitle: "Id",
      fieldName: "objectId",
      dbColumnName: "OBJECT_ID",
      isKeyColumn: true,
    },
    createdOn: {
      fieldType: "4",
      displayType: "date",
      fieldTitle: "Created On",
      fieldName: "createdOn",
      dbColumnName: "CREATED_ON",
      isReportable: true,
      isPersistable: true,
    },
    createdBy: {
      fieldType: "1",
      displayType: "input",
      fieldTitle: "Created By",
      fieldName: "createdBy",
      dbColumnName: "CREATED_BY",
      // isReportable:true,
      // isPersistable:true,
      category: "2",
      isPicklist: true,
    },
    lastUpdatedOn: {
      fieldType: "4",
      displayType: "date",
      fieldTitle: "Last Updated On",
      fieldName: "lastUpdatedOn",
      dbColumnName: "LAST_UPDATED_ON",
      isReportable: true,
      isPersistable: true,
    },
    lastUpdatedBy: {
      fieldType: "1",
      displayType: "input",
      fieldTitle: "Last Updated by",
      fieldName: "lastUpdatedBy",
      dbColumnName: "LAST_UPDATED_BY",
      category: "2",
      isPicklist: true,
    },
    name: {
      fieldType: "6",
      displayType: "input",
      fieldTitle: "Name",
      fieldName: "name",
      dbColumnName: "NAME",
    },
    procedures: {
      fieldType: "6",
      displayType: "textarea",
      fieldTitle: "Procedures",
      fieldName: "procedures",
      dbColumnName: "PROCEDURES",
      fieldSize: 4000,
    },
    attachtment: {
      fieldType: "6",
      displayType: "multiattach",
      fieldTitle: "Attachtment",
      fieldName: "attachtment",
      dbColumnName: "ATTACHTMENT",
    },
    type: {
      fieldType: "1",
      displayType: "select",
      fieldTitle: "Type",
      fieldName: "type",
      dbColumnName: "TYPE",
    },
    businessUnits: {
      fieldType: "1",
      displayType: "SSelect",
      fieldTitle: "Business Unit(s)",
      fieldName: "businessUnits",
      dbColumnName: "BUSINESS_UNITS",
      category: "1",
    },
    owners: {
      fieldType: "1",
      displayType: "SSelect",
      fieldTitle: "Owner(s)",
      fieldName: "owners",
      dbColumnName: "OWNERS",
      category: "3",
    },
    reviewCycle: {
      fieldType: "1",
      displayType: "select",
      fieldTitle: "Review Cycle",
      fieldName: "reviewCycle",
      dbColumnName: "REVIEW_CYCLE",
    },
    nextReviewDate: {
      fieldType: "3",
      displayType: "date",
      fieldTitle: "Next Review Date",
      fieldName: "nextReviewDate",
      dbColumnName: "NEXT_REVIEW_DATE",
    },
    archive: {
      fieldType: "7",
      displayType: "check",
      fieldTitle: "Archive",
      fieldName: "archive",
      dbColumnName: "ARCHIVE",
    },
    endDate: {
      fieldType: "3",
      displayType: "date",
      fieldTitle: "End Date",
      fieldName: "endDate",
      dbColumnName: "END_DATE",
    },
    endDate: {
      fieldType: "3",
      displayType: "date",
      fieldTitle: "Start Date",
      fieldName: "startDate",
      dbColumnName: "START_DATE",
    },
  },

  standardSchedularColumn: {
    frequency: {
      fieldType: "1",
      picklist: "OBJ_SCHEDULE",
      displayType: "SSelect",
      fieldTitle: "Frequency",
      fieldName: "frequency",
      dbColumnName: "FREQUENCY",
      isPicklist: true,
      editable: true,
    },
    startDate: {
      fieldType: "3",
      displayType: "date",
      fieldTitle: "Start Date",
      fieldName: "startDate",
      dbColumnName: "START_DATE",
      editable: true,
    },
    nextReviewDate: {
      fieldType: "3",
      displayType: "date",
      fieldTitle: "Next Review Date",
      fieldName: "nextReviewDate",
      dbColumnName: "NEXT_REVIEW_DATE",
      editable: true,
    },
    dueBy: {
      fieldType: "1",
      displayType: "number",
      fieldTitle: "Due By",
      fieldName: "dueBy",
      dbColumnName: "DUE_BY",
    },
  },
};
import {
  createObject,
  getObjectData,
  updateObjectData,
} from "../EngineService";
import {
  faCircleInfo,
  faKey,
  faList,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { closestCenter, DndContext } from "@dnd-kit/core";
const service = "forms";

let defaultValues = {
  formId: "",
  formName: "",
  formTitle: "",
  moduleId: "",
  apiHandler: "",
  purpose: "",
  createdOn: "",
  createdBy: "",
  workflowCode: "",
  lastUpdatedOn: "",
  lastUpdatedBy: "",
  enableTopBar: true,
  enableBookmark: true,
  enableWorkflowIndicator: true,
  enableNotifiers: true,
  enableBottomBar: true,
  enableLocking: false,
  enableSectionNavigation: false,
  fields: [
    // {
    //   fieldName: "",
    //   fieldTitle: "",
    //   fieldType: "",
    //   fieldSize: "",
    //   regionCode: "",
    // },
  ],
  regions: [
    {
      regionCode: "NOREGION",
      regionTitle: "NOREGION",
      parentRegion: "",
    },
  ],
};

const validationSchema = Yup.object({
  id: Yup.number(),
  moduleId: Yup.string().required(),
  formName: Yup.string().required(),
  formTitle: Yup.string().required(),
  purpose: Yup.string().required(),
  apiHandler: Yup.string().required(),
});

function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

let fieldHelpersRef;

const Forms = ({ id }) => {
  console.log("id", id);
  const [formValues, setFormValues] = useState(null);
  const [ModuleOptions, setModuleOptions] = useState();
  let [formMetaData, setFormMetaData] = useState({});
  let navigate = useNavigate();
  let fieldRegions;
  let regionHelpersRef;
  const [searchParams] = useSearchParams();
  if (!id) {
    id = searchParams.get("id");
  }
  const validator = { resolver: yupResolver(validationSchema) };

  const formMethods = useForm({
    defaultValues,
    validator,
  });

  if (id) {
    useEffect(() => {
      getObjectData(service, id)
        .then((response) => {
          console.log("response", response.data);
          formMethods.reset(response.data);
          setFormValues(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, [id]);
  }
  useEffect(() => {}, []);
  useEffect(() => {
    getServiceData("getModuleInfo")
      .then((response) => {
        console.log("Module Response", response.data);
        setModuleOptions(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let onSubmit = (values) => {
    console.log("onSubmitValues", JSON.stringify(values));
    //Fail the onsubmit to avoid page refresh.
    let closeCanvas = document.querySelector('[class="btn-close"]');
    if (values.formId) {
      updateObjectData(service, values, values.formId)
        .then((response) => {
          if (closeCanvas) closeCanvas.click();
          else navigate(-1);
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
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

  // let defaultValues = formValues||initialValues;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState,
    getValues,
    watch,
    setValue,
    errors,
  } = formMethods;

  // {
  //   fields: regions,
  //   append: regAppend,
  //   remove: regRemove,
  // }
  let moduleId = useWatch({ name: "moduleId", control: control });
  let formName = useWatch({ name: "formName", control: control });
  useEffect(() => {
    let formmeta = {
      module_id: moduleId,
      formName: formName,
      designer: true,
    };
    setFormMetaData(formmeta);
  }, [moduleId, formName]);
  console.log(formMetaData, "metas");

  console.log(moduleId, "zoro");
  const regionHelpers = useFieldArray({
    name: "regions",
    control,
  });

  const fieldHelpers = useFieldArray({
    name: "fields",
    control,
  });

  console.log("formData", defaultValues, formValues);

  let formTitle = useWatch({ name: "formTitle", control: control });

  const [touchedAllFields, setTouchedAllFields] = useState(false);
  return (
    <Container fluid className="px-4 py-2 card">
      <Form id="formEngine" onSubmit={formMethods.handleSubmit(onSubmit)}>
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}

        <div
          className="shadow font-medium  bg-white sticky-top "
          style={{ top: "62px", zIndex: 1 }}
        >
          <Row>
            <Col>
              <span className="f-6">Form Designer</span> <br />
              <span className="h4">{formTitle}</span>
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
        {/* <hr className="m-0" /> */}

        {/* {errors.submit && (
          <Alert className="my-3" variant="danger">
            <div className="alert-message">{errors.submit}</div>
          </Alert>
        )} */}

        <Tabs
          defaultActiveKey="details"
          id="masterTab"
          // className="justify-content-center"
          variant="underline"
        >
          <Tab
            eventKey="details"
            title={
              <>
                <FontAwesomeIcon icon={faCircleInfo} className="me-1" />
                Details
              </>
            }
          >
            <hr className="" />

            <DetailsTab control={control} ModuleOptions={ModuleOptions} />
          </Tab>

          <Tab
            eventKey="regionfields"
            title={
              <>
                <FontAwesomeIcon icon={faList} className="me-1" /> Regions &
                Fields
              </>
            }
          >
            <hr className="" />
            <RegionTab
              formMethods={formMethods}
              regionHelpers={regionHelpers}
              fieldHelpers={fieldHelpers}
            />
          </Tab>
          <Tab
            eventKey="viewControl"
            title={
              <>
                <FontAwesomeIcon icon={faShieldHalved} className="me-1" />
                View Control
              </>
            }
          >
            <hr className="" />
            <ViewControlTab control={control} />
          </Tab>
          <Tab
            eventKey="otherDetails"
            title={
              <>
                <FontAwesomeIcon icon={faKey} className="me-1" />
                Other Details
              </>
            }
          >
            <hr className="" />
            <OtherDetails
              control={control}
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Tab>
        </Tabs>
      </Form>
    </Container>
  );
};

let DetailsTab = ({ control, ModuleOptions }) => {
  return (
    <>
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
            field_title="Title"
            name="formTitle"
            required
          />
        </Col>
        <Col>
          <FormControl
            control={control}
            type="input"
            field_title="Name"
            name="formName"
            required
          />
        </Col>
        <Col>
          <FormControl
            control={control}
            type="switch"
            field_title="Is Versionable"
            name="isVersionable"
            hideTitle
          />
          <FormControl
            control={control}
            type="switch"
            field_title="Is Relatable"
            name="isRelatable"
            hideTitle
          />
          <FormControl
            control={control}
            type="switch"
            field_title="Configuration Form"
            name="isConfigurationForm"
            options={profiles}
            hideTitle
          />
          <FormControl
            control={control}
            type="switch"
            field_title="Allow Deletion"
            name="allowDeletion"
            hideTitle
          />
          <FormControl
            control={control}
            type="switch"
            field_title="Is Scheduled"
            name="isScheduled"
            hideTitle
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <FormControl
            control={control}
            type="input"
            field_title="API Handler"
            name="apiHandler"
            required
          />
        </Col>

        <Col>
          <FormControl
            control={control}
            type="input"
            field_title="View Name"
            name="viewName"
          />
        </Col>
        <Col>
          <FormControl
            control={control}
            type="input"
            field_title="Header Column Name"
            name="headerColumn"
          />
        </Col>
        <Col>
          <FormControl
            control={control}
            type="input"
            field_title="Related Objects"
            name="relatedObjects"
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormControl
            control={control}
            type="textarea"
            field_title="Purpose"
            name="purpose"
            required
          />
        </Col>
        <Col></Col>
        <Col></Col>
      </Row>
    </>
  );
};

let RegionTab = ({ regionHelpers, fieldHelpers, formMethods }) => {
  // let

  let regions = regionHelpers.fields;
  console.log(fieldHelpers, "updated field helpers");

  const addColumns = (profile) => {
    // console.log(fieldHelpersRef, "field helps");
    const existingFieldNames = fieldHelpers.fields.map(
      (field) => field.fieldName
    );
    const formType = profiles[profile - 1].value;
    const selectedForm = Profile[formType];
    Object.keys(selectedForm).map((col) => {
      if (!existingFieldNames.includes(selectedForm[col].fieldName)) {
        fieldHelpers.append({
          fieldName: selectedForm[col].fieldName,
          fieldTitle: selectedForm[col].fieldTitle,
          fieldType: selectedForm[col].fieldType,
          fieldSize: selectedForm[col].fieldSize,
          displayType: selectedForm[col].displayType,
          dbColumnName: selectedForm[col].dbColumnName,
          regionCode: "NOREGION",
          category: selectedForm[col].category,
          visible: true,
          // editable: false,
          editable: selectedForm[col].editable
            ? selectedForm[col].editable
            : false,
          required: false,
          isReportable: selectedForm[col].isReportable,
          isPersistable: selectedForm[col].isPersistable,
          changeHistory: selectedForm[col].changeHistory,
          isKeyColumn: selectedForm[col].isKeyColumn,
          isPicklist: selectedForm[col].isPicklist,
          picklist: selectedForm[col].picklist,
        });
      }
    });
  };

  return (
    <>
      <Row>
        <Col>
          <FormControl
            // control={control}
            formMethods={formMethods}
            type="select"
            // field_title="Profile"
            placeholder="Select a Profile"
            name="profile"
            options={profiles}
          />
        </Col>
        <Col>
          <Button
            className="mt-4"
            onClick={() => {
              // alert(formMethods.getValues('profile'));
              addColumns(formMethods.getValues("profile"));
            }}
            variant="secondary"
          >
            Apply Profile
          </Button>
        </Col>
        <Col className="d-flex align-items-end justify-content-end">
          <FormControl
            // control={control}
            formMethods={formMethods}
            type="switch"
            field_title="Sort Fields"
            name="sort"
            hideTitle={true}
          />
        </Col>
      </Row>

      <Tab.Container
        defaultActiveKey="0"
        id="regionTab"
        // className="justify-content-center"
      >
        <Row className="bg-dark-subtle">
          <Col md={10}>
            <Nav variant="underline" className="justify-content-start mt-1">
              {regions && regions.length > 0
                ? regions.map((region, regionIndex) => {
                    let regionRecord = `regions.${regionIndex}`;
                    return (
                      <Nav.Item>
                        <Nav.Link eventKey={regionIndex} className="py-0">
                          <Row className="m-0 p-0">
                            <Col className="p-0 m-0">
                              <FormControl
                                formMethods={formMethods}
                                type="input"
                                hideTitle
                                name={`${regionRecord}.regionCode`}
                                designerLabel={true}
                                disabled={region.regionCode === "NOREGION"}
                              />
                            </Col>
                            [
                            <Col className="p-0 m-0">
                              <FormControl
                                formMethods={formMethods}
                                type="input"
                                hideTitle
                                name={`${regionRecord}.regionTitle`}
                                designerLabel={true}
                                disabled={region.regionCode === "NOREGION"}
                              />
                            </Col>
                            ]
                          </Row>
                        </Nav.Link>
                      </Nav.Item>
                    );
                  })
                : null}
            </Nav>
          </Col>
          <Col>
            <Button
              onClick={() =>
                regionHelpers.append({
                  regionCode: "",
                  regionTitle: "",
                  parentRegion: "NOREGION", // Set the default alignment
                })
              } // insert an empty string at a position
              className="float-end"
              variant="purple"
            >
              + Add Region
            </Button>
          </Col>
        </Row>
        <hr />
        <Card>
          <Tab.Content>
            {regions && regions.length > 0
              ? regions.map((region, regionIndex) => {
                  let regionRecord = `regions.${regionIndex}`;
                  return (
                    <>
                      <RegionFields
                        region={region}
                        regionIndex={regionIndex}
                        fieldHelpers={fieldHelpers}
                        regionHelpers={regionHelpers}
                        formMethods={formMethods}
                      />
                    </>
                  );
                })
              : null}
          </Tab.Content>
        </Card>
      </Tab.Container>
    </>
  );
};

let RegionFields = ({
  region,
  regionIndex,
  regionHelpers,
  fieldHelpers,
  formMethods,
}) => {
  console.log(regionHelpers, "region helpers");

  let regionRecord = `regions.${regionIndex}`;

  let regionTitle = useWatch({
    name: `${regionRecord}.regionTitle`,
    control: formMethods.control,
  });
  let sortFlag = useWatch({
    name: "sort",
    control: formMethods.control,
  });
  console.log(sortFlag, "sorting flag");

  let regionCode = useWatch({
    name: `${regionRecord}.regionCode`,
    control: formMethods.control,
  });

  let fields = fieldHelpers.fields;
  console.log(fieldHelpers, "field helpers are here");
  const handleDragEnd = (event) => {
    const { active, over } = event;
    fieldHelpers.swap(
      active.data.current.sortable.index,
      over.data.current.sortable.index
    );
    console.log(active.data.current.sortable.index, over, "dnd properties");
  };
  return (
    <Tab.Pane
      eventKey={regionIndex}
      title={<>{regionTitle + " [" + regionCode + "]"}</>}
    >
      <Row key={regionIndex}>
        <Col>
          <FormControl
            // control={control}
            formMethods={formMethods}
            type="input"
            field_title="Region Code"
            name={`${regionRecord}.regionCode`}
            required
            disabled={region.regionCode === "NOREGION"}
          />
        </Col>
        <Col>
          <FormControl
            // control={control}
            formMethods={formMethods}
            type="input"
            field_title="Region TItle"
            name={`${regionRecord}.regionTitle`}
            required
            disabled={region.regionCode === "NOREGION"}
          />
        </Col>

        <Col>
          <FormControl
            // control={control}
            formMethods={formMethods}
            type="input"
            field_title="Parent Region"
            name={`${regionRecord}.parentRegion`}
            disabled={region.regionCode === "NOREGION"}
          />
        </Col>

        <Col>
          <Button
            variant="warning"
            className="mt-4"
            onClick={() => {
              regionHelpers.remove(regionIndex);
              // fieldHelpers.remove(1);
            }}
            disabled={region.regionCode === "NOREGION"}
          >
            Delete
          </Button>
        </Col>
      </Row>
      <Row>
        <>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              strategy={rectSwappingStrategy}
              items={fieldHelpers.fields.map((field, index) => field.fieldId)}
            >
              {fieldHelpers.fields.map((field, fieldIndex) => {
                const fieldRecord = `fields.${fieldIndex}`;
                if (field.regionCode === regionCode)
                  return (
                    <Col md={4} className="reportChart-cards" key={fieldRecord}>
                      <Row className="column">
                        <FieldModal
                          sortFlag={sortFlag}
                          id={field.fieldId} // Ensure this is a unique id
                          fieldRecord={fieldRecord}
                          fieldIndex={fieldIndex}
                          field={field}
                          region={region}
                          regionIndex={regionIndex}
                          fieldHelpers={fieldHelpers}
                          formMethods={formMethods}
                        />
                      </Row>
                    </Col>
                  );
              })}
            </SortableContext>
          </DndContext>
          <Row>
            <Button
              onClick={() =>
                fieldHelpers.append({
                  fieldName: "",
                  fieldTitle: "",
                  fieldType: "",
                  fieldSize: "",
                  regionCode: regionCode,
                  visible: true,
                  editable: true,
                  required: false,
                  isReportable: true,
                  isPersistable: true,
                  changeHistory: true,
                  isUploadable: true,
                })
              } // insert an empty string at a position
              disabled={regionCode === ""}
            >
              + Add Field
            </Button>
          </Row>
        </>
        {/* ); */}
      </Row>
    </Tab.Pane>
  );
};

let FieldModal = ({
  sortFlag,
  id,
  fieldRecord,
  fieldIndex,
  field,
  region,
  regionIndex,
  fieldHelpers,
  formMethods,
}) => {
  console.log(field, "FIELD HELPERS in modal");

  const [show, setShow] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled: sortFlag == true ? false : true });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let isPicklist = useWatch({
    name: `${fieldRecord}.isPicklist`,
    control: formMethods.control,
  });

  let isMultiSelect = useWatch({
    name: `${fieldRecord}.isMultiSelect`,
    control: formMethods.control,
  });

  let dataSource = useWatch({
    name: `${fieldRecord}.dataSource`,
    control: formMethods.control,
  });

  let fieldTitle = useWatch({
    name: `${fieldRecord}.fieldTitle`,
    control: formMethods.control,
  });
  let fieldName = useWatch({
    name: `${fieldRecord}.fieldName`,
    control: formMethods.control,
  });
  let isKeyColumn = useWatch({
    name: `${fieldRecord}.isKeyColumn`,
    control: formMethods.control,
  });
  console.log(fieldIndex, fieldHelpers, "deleting index");
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const [privilegeOptions, setPrivilegeOptions] = useState([]);
  const [reopeningFetchFlag, setReopeningFetchFlag] = useState(false);
  const [selectedPrivilegeValue, setSelecetdPrivelegeValue] = useState();
  let categoryOrganization = [
    { key: 1, value: "All Busines Units" },
    { key: 2, value: "Filter As Per Logged In User" },
    { key: 3, value: "Filter Based On Privilege" },
  ];
  let categoryOwners = [
    { key: 1, value: "All" },
    { key: 2, value: "Selected Bu Only" },
    { key: 3, value: "Selected BU and Child BU" },
    { key: 4, value: "Selected BU and Parent BU" },
  ];
  console.log(field, "placeholders");
  let CategoryType = useWatch({
    name: `${fieldRecord}.categoryType`,
    control: formMethods.control,
  });
  let Cateogry = useWatch({
    name: `${fieldRecord}.category`,
    control: formMethods.control,
  });
  let PrivelegeValue = useWatch({
    name: `${fieldRecord}.privileges`,
    control: formMethods.control,
  });
  const PrevilegeOptions = (refetch) => {
    const assetdependenciesData1 = {
      viewName: "pa_privileges",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `module_id=${formMethods.getValues("moduleId")}`,
    };
    getviewData(assetdependenciesData1)
      .then((response) => {
        const responseData = response.data;
        if (!refetch) {
          if (responseData && responseData.data.length > 0) {
            let options = responseData?.data
              .map((items, index) => {
                if (items.active == true) {
                  return {
                    value: items.id,
                    label: items.name,
                  };
                }
              })
              .filter((items) => items != undefined);
            console.log(options, "options--1");
            setPrivilegeOptions(options);
          }
        }
        if (refetch) {
          if (responseData && responseData.data.length > 0) {
            let selectedOptions = responseData?.data
              .map((items, index) => {
                if (PrivelegeValue.includes(items.id)) {
                  return {
                    value: items.id,
                    label: items.name,
                  };
                }
              })
              .filter((item) => item != undefined);
            setSelecetdPrivelegeValue(selectedOptions);
            let IdValue = selectedOptions?.map((items) => {
              return items.value;
            });
            formMethods.setVlaue(`${fieldRecord}.privileges`, IdValue);
            console.log(selectedOptions, "selected--options--here");
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    console.log("test--here");
    if (
      PrivelegeValue?.length > 0 &&
      reopeningFetchFlag == false &&
      (!selectedPrivilegeValue || selectedPrivilegeValue?.length == 0)
    ) {
      console.log("test is here");

      let refetch = true;
      PrevilegeOptions(refetch);
      setReopeningFetchFlag(true);
    }
  }, [PrivelegeValue]);

  useEffect(() => {
    if (CategoryType == 3) {
      PrevilegeOptions();
    }
  }, [CategoryType]);

  console.log(CategoryType, Cateogry, "cat--type");

  useEffect(() => {
    formMethods.setValue(`${fieldRecord}.displayOrder`, fieldIndex);
    // formMethods.setValue(`${fieldRecord}.placeHolder`, field.placeHolder);
    // formMethods.setValue(`${fieldRecord}.displayType`, field.displayType);
    // formMethods.setValue(
    //   `${fieldRecord}.isCommentSection`,
    //   field.isCommentSection
    // );
    // formMethods.setValue(`${fieldRecord}.isMandate`, field.isMandate);
  }, []);
  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="mt-1 me-0"
      >
        <Button
          style={{ width: "100%", height: "30px" }}
          variant="light"
          className="w-100 mt-1"
          onClick={(e) => {
            // Prevent drag from interfering with click
            handleShow();
          }}
          key={id}
        >
          [ {fieldName} ] {isPicklist ? "Picklist" : ""}
        </Button>
      </div>

      {/* </Col> */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {field.fieldTitle} [ {field.fieldName} ]{" "}
            {isPicklist ? "Picklist" : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="my-2">
            <Card.Body>
              <div key={field.id}>
                <Row key={field.id}>
                  <Col md={5}>
                    <FormControl
                      formMethods={formMethods}
                      type="input"
                      field_title="Field TItle"
                      name={`${fieldRecord}.fieldTitle`}
                      required
                    />
                  </Col>
                  <Col md={1} className="aligh-bottom">
                    {" "}
                    <Button
                      onClick={() => {
                        l;
                        let regionCode =
                          field.regionCode != "NOREGION"
                            ? field.regionCode + "_"
                            : "";
                        let regionCode1 =
                          field.regionCode != "NOREGION"
                            ? field.regionCode.toLowerCase()
                            : "";
                        //.toLowerCase()
                        formMethods.setValue(
                          `${fieldRecord}.fieldName`,
                          camelize(
                            regionCode1 +
                              formMethods.getValues(`${fieldRecord}.fieldTitle`)
                          )
                        );
                        formMethods.setValue(
                          `${fieldRecord}.dbColumnName`,
                          regionCode +
                            formMethods
                              .getValues(`${fieldRecord}.fieldTitle`)
                              ?.toUpperCase()
                              .replaceAll(" ", "_")
                        );
                        // alert(formMethods.getValues(`${fieldRecord}.fieldTitle`));
                      }}
                      className="mt-4"
                    >
                      Populate
                    </Button>
                  </Col>

                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="input"
                      field_title="Field Name"
                      name={`${fieldRecord}.fieldName`}
                      required
                    />
                  </Col>

                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="input"
                      field_title="DB Column Name"
                      name={`${fieldRecord}.dbColumnName`}
                      required
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="select"
                      field_title="Field Data Type"
                      name={`${fieldRecord}.fieldType`}
                      options={fieldDataTypeOptions}
                      required
                    />
                  </Col>
                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="number"
                      field_title="Size"
                      name={`${fieldRecord}.fieldSize`}
                    />
                  </Col>{" "}
                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="select"
                      field_title="Display Type"
                      name={`${fieldRecord}.displayType`}
                      options={fieldTypeOptions}
                      required
                    />
                  </Col>{" "}
                </Row>
                <Row>
                  <Col className="mt-4">
                    <FormControl
                      // control={control}
                      formMethods={formMethods}
                      type="switch"
                      field_title="is Comment Section"
                      name={`${fieldRecord}.isCommentSection`}
                      hideTitle={true}
                    />
                  </Col>
                  <Col>
                    <FormControl
                      // control={control}
                      formMethods={formMethods}
                      type="input"
                      field_title="Mandate Based on Action"
                      name={`${fieldRecord}.isMandate`}
                    />
                  </Col>
                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="input"
                      field_title="Visble on Action"
                      name={`${fieldRecord}.rules`}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="input"
                      field_title="Help Text"
                      name={`${fieldRecord}.helpText`}
                    />
                  </Col>
                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="input"
                      field_title="Place Holder"
                      name={`${fieldRecord}.placeHolder`}
                    />
                  </Col>
                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="input"
                      field_title="Tooltip"
                      name={`${fieldRecord}.tooltip`}
                    />
                  </Col>
                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="input"
                      field_title="Default Value"
                      name={`${fieldRecord}.defaultValue`}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="input"
                      field_title="Display Order"
                      // value={fieldIndex}
                      name={`${fieldRecord}.displayOrder`}
                    />
                  </Col>
                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="input"
                      field_title="Upload Help Text"
                      name={`${fieldRecord}.uploadHelpText`}
                    />
                  </Col>
                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="select"
                      field_title="Category"
                      name={`${fieldRecord}.category`}
                      options={categories}
                    />
                  </Col>
                  {Cateogry != "3" && Cateogry && (
                    <Col>
                      <FormControl
                        formMethods={formMethods}
                        type="select"
                        field_title="Category Type"
                        name={`${fieldRecord}.categoryType`}
                        options={
                          Cateogry == 1 ? categoryOrganization : categoryOwners
                        }
                      />
                    </Col>
                  )}
                  <Col>
                    <FormControl
                      field_title="Business Unit Name"
                      formMethods={formMethods}
                      type="input"
                      name={`${fieldRecord}.businessUnitName`}
                    />
                  </Col>
                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="input"
                      field_title="File Type"
                      name={`${fieldRecord}.fileType`}
                    />
                  </Col>
                </Row>
                <Row>
                  {((CategoryType == "3" && Cateogry == "1") ||
                    (Cateogry == "2" && CategoryType && CategoryType != 1)) && (
                    <Col lg={3} md={6} sm={12}>
                      <div>
                        <label>Privileges</label>
                        <Controller
                          name={`${fieldRecord}.privileges`}
                          control={formMethods.control}
                          render={({ field }) => {
                            console.log(field.value, "field--val");

                            return (
                              <Select
                                {...field}
                                className="mt-2"
                                options={privilegeOptions}
                                isMulti={true}
                                value={selectedPrivilegeValue}
                                closeMenuOnSelect={false}
                                onChange={(selectedOption) => {
                                  console.log(
                                    selectedOption,
                                    "select--is here"
                                  );
                                  let selectedKey = selectedOption?.map(
                                    (items) => {
                                      return items.value;
                                    }
                                  );
                                  field.onChange(selectedKey);
                                  setSelecetdPrivelegeValue(selectedOption);
                                }}
                              />
                            );
                          }}
                        />
                      </div>
                    </Col>
                  )}
                </Row>
                <Row>
                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="switch"
                      field_title="Include Upload Template"
                      name={`${fieldRecord}.isUploadable`}
                      hideTitle
                    />
                    <FormControl
                      formMethods={formMethods}
                      type="switch"
                      field_title="Reportable"
                      name={`${fieldRecord}.isReportable`}
                      hideTitle
                    />
                  </Col>
                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="switch"
                      field_title="Persist"
                      name={`${fieldRecord}.isPersistable`}
                      hideTitle
                    />

                    <FormControl
                      formMethods={formMethods}
                      type="switch"
                      field_title="Change History"
                      name={`${fieldRecord}.changeHistory`}
                      hideTitle
                    />
                  </Col>

                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="switch"
                      field_title="Key Column"
                      name={`${fieldRecord}.isKeyColumn`}
                      required
                      hideTitle
                    />
                    {isKeyColumn && (
                      <FormControl
                        formMethods={formMethods}
                        type="input"
                        field_title="Sequence"
                        name={`${fieldRecord}.idSequence`}
                        // hideTitle
                      />
                    )}

                    {region.regionCode !== "NOREGION" && (
                      // <Col>
                      <FormControl
                        formMethods={formMethods}
                        type="switch"
                        field_title="Change History Column"
                        name={`${fieldRecord}.changeHistoryKeyColumn`}
                        hideTitle
                      />
                      // </Col>
                    )}
                  </Col>

                  <Col>
                    <FormControl
                      formMethods={formMethods}
                      type="switch"
                      field_title="Visible"
                      name={`${fieldRecord}.visible`}
                      required
                      hideTitle
                    />

                    <FormControl
                      formMethods={formMethods}
                      type="switch"
                      field_title="Allow special Charcters"
                      name={`${fieldRecord}.allowSpecialChar`}
                      hideTitle
                      required
                    />

                    <FormControl
                      formMethods={formMethods}
                      type="switch"
                      field_title="Editable"
                      name={`${fieldRecord}.editable`}
                      required
                      hideTitle
                    />
                    <FormControl
                      formMethods={formMethods}
                      type="switch"
                      field_title="Required"
                      name={`${fieldRecord}.required`}
                      required
                      hideTitle
                    />
                    <FormControl
                      formMethods={formMethods}
                      type="switch"
                      field_title="Force Filter"
                      name={`${fieldRecord}.enableFilterResultSetOnReload`}
                      required
                      hideTitle
                    />
                  </Col>
                </Row>

                <hr />
                <Row>
                  <Col md={3}>
                    {" "}
                    <FormControl
                      formMethods={formMethods}
                      type="switch"
                      field_title="Is Picklist column?"
                      name={`${fieldRecord}.isPicklist`}
                      hideTitle
                    />
                    {isPicklist && (
                      <FormControl
                        formMethods={formMethods}
                        type="switch"
                        field_title="Pop-up Selection"
                        name={`${fieldRecord}.popupSelection`}
                        hideTitle
                      />
                    )}
                    {/* {isPicklist && ( */}
                    <FormControl
                      formMethods={formMethods}
                      type="switch"
                      field_title="Multi Select"
                      name={`${fieldRecord}.isMultiSelect`}
                      hideTitle
                    />
                    {/* )} */}
                    {isPicklist && (
                      <FormControl
                        formMethods={formMethods}
                        type="switch"
                        field_title="Create Option"
                        name={`${fieldRecord}.createOptions`}
                        hideTitle
                      />
                    )}
                    {isPicklist && isMultiSelect && (
                      <FormControl
                        formMethods={formMethods}
                        type="input"
                        field_title="Multi Select Separator"
                        name={`${fieldRecord}.mulitSelectSeparator`}
                        required
                        hideTitle
                      />
                    )}
                    <Button
                      variant="warning"
                      onClick={() => {
                        fieldHelpers.remove(fieldIndex);
                        setShow(false);
                        console.log(fieldHelpers, "field helpers delete");
                      }}
                    >
                      Delete
                    </Button>
                  </Col>
                  <Col>
                    <Row>
                      <Col md={3}>
                        {isPicklist && (
                          <>
                            <FormControl
                              formMethods={formMethods}
                              type="input"
                              field_title="Picklist"
                              name={`${fieldRecord}.picklist`}
                              required
                            />
                          </>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      {isPicklist && (
                        <>
                          <Col md={3}>
                            <FormControl
                              formMethods={formMethods}
                              type="input"
                              field_title="Data Source"
                              name={`${fieldRecord}.dataSource`}
                              required
                              onChange={(e) => {
                                alert(e.target.value);
                                if (!e.target.value) {
                                  formMethods.setValue(
                                    `${fieldRecord}.storedColumn`,
                                    ""
                                  );
                                  formMethods.setValue(
                                    `${fieldRecord}.displayColumn`,
                                    ""
                                  );
                                  formMethods.setValue(
                                    `${fieldRecord}.filterExpression`,
                                    ""
                                  );
                                }
                                // handleChange(e);
                              }}
                            />
                          </Col>
                          {dataSource && (
                            <>
                              <Col>
                                <FormControl
                                  formMethods={formMethods}
                                  type="input"
                                  field_title="Stored Column"
                                  name={`${fieldRecord}.storedColumn`}
                                  required
                                />
                              </Col>
                              <Col>
                                <FormControl
                                  formMethods={formMethods}
                                  type="input"
                                  field_title="Display Column"
                                  name={`${fieldRecord}.displayColumn`}
                                  required
                                />
                              </Col>
                              <Col>
                                <FormControl
                                  formMethods={formMethods}
                                  type="input"
                                  field_title="Filter Expression"
                                  name={`${fieldRecord}.filterExpression`}
                                  required
                                />
                              </Col>
                            </>
                          )}
                        </>
                      )}
                    </Row>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="primary">Understood</Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

let ViewControlTab = ({ control }) => {
  return (
    <>
      <Row>
        <FormControl
          control={control}
          type="switch"
          field_title="Enable Top Bar"
          name="enableTopBar"
          // value={true}
          hideTitle
        />
        <FormControl
          control={control}
          type="switch"
          field_title="Enable Bookmarking"
          name="enableBookmark"
          hideTitle
        />
        <FormControl
          control={control}
          type="switch"
          field_title="Enable Workflow indicator"
          name="enableWorkflowIndicator"
          hideTitle
        />
        <FormControl
          control={control}
          type="switch"
          field_title="Enable Notifiers"
          name="enableNotifiers"
          hideTitle
        />
        <FormControl
          control={control}
          type="switch"
          field_title="Enable Bottom Bar"
          name="enableBottomBar"
          hideTitle
        />
        <FormControl
          control={control}
          type="switch"
          field_title="Enable Locking"
          name="enableLocking"
          hideTitle
        />
        <FormControl
          control={control}
          type="switch"
          field_title="Enable Print"
          name="enablePrint"
          hideTitle
        />
        <FormControl
          control={control}
          type="switch"
          field_title="Enable Section Navigation"
          name="enableSectionNavigation"
          hideTitle
        />
      </Row>
      <Row>
        <Col>
          <FormControl
            control={control}
            type="select"
            field_title="After Submit call  Render"
            name="objectTypePostSubmit"
            options={afterSubmit}
          />
        </Col>
        <Col>
          <FormControl
            control={control}
            type="input"
            field_title="Name"
            name="objectName"
          />
        </Col>
        <Col>
          <FormControl
            control={control}
            type="input"
            field_title="Expression"
            name="objectExpression"
          />
        </Col>
      </Row>
    </>
  );
};
let OtherDetails = ({ control, formMetaData, formMethods }) => {
  console.log(formMethods, "other details");

  return (
    <>
      <span className="h3">Security:</span>

      <Row>
        <div className="col-md-3">
          <FormControl
            control={control}
            type="input"
            field_title="Create Privilege"
            name="createPrivilege"
          />
        </div>

        <div className="col-md-3">
          <FormControl
            control={control}
            type="input"
            field_title="View Privilege"
            name="viewPrivilege"
          />
        </div>

        <div className="col-md-3">
          <FormControl
            control={control}
            type="input"
            field_title="View All Privilege"
            name="viewAllPrivilege"
          />
        </div>
        <div className="col-md-3">
          <FormControl
            control={control}
            type="input"
            field_title="Edit Privilege"
            name="editPrivilege"
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-3">
          <FormControl
            control={control}
            type="input"
            field_title="Edit All Privilege"
            name="editAllPrivilege"
          />
        </div>
        <div className="col-md-3">
          <FormControl
            control={control}
            type="input"
            field_title="ReAssign"
            name="reAssign"
          />
        </div>

        <div className="col-md-3">
          <FormControl
            control={control}
            type="input"
            field_title="ReAssign All"
            name="reAssignAll"
          />
        </div>
        <div className="col-md-3"></div>
      </Row>

      <Row className>
        <FormControl
          control={control}
          type="multiattach"
          field_title="Fields"
          name="fieldsattach"
          formMetaData={formMetaData}
          formMethods={formMethods}
        />
      </Row>

      <Row>
        <Col>
          <span className="h3">Workflow:</span>
          <Row>
            <Col>
              <FormControl
                control={control}
                type="input"
                field_title="Workflow Code"
                name="workflowCode"
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <span className="h3">Upload:</span>
          <Row>
            <Col>
              <FormControl
                control={control}
                type="singleattach"
                field_title="Upload Template"
                name="uploadTemplate"
                formMetaData={formMetaData}
                formMethods={formMethods}
                // setFieldValue={setFieldValue}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <span className="h3">Help Files:</span>
      <Row>
        <Col>
          <FormControl
            control={control}
            type="input"
            field_title="Video File URL"
            name="videoFileURL"
            // setFieldValue={setFieldValue}
          />
        </Col>
        <Col>
          {" "}
          <FormControl
            control={control}
            type="input"
            field_title="Help Text URL"
            name="helpTextURL"
            // setFieldValue={setFieldValue}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <span className="h3">Scheduler:</span>
          <Row>
            <Col>
              <FormControl
                control={control}
                type="input"
                field_title="End Stage"
                name="publishStage"
              />
            </Col>
          </Row>
        </Col>
        <Col></Col>
      </Row>
    </>
  );
};

export default Forms;
