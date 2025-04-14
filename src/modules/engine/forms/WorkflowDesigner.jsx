import { Formik, FieldArray } from "formik";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import * as Yup from "yup";

import FormControl from "src/components/forms/utils/FormControl";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getServiceData } from "src/components/server/service";
import Select from "react-select";
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
  Table,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";



import {
  createObject,
  getObjectData,
  updateObjectData,
} from "../EngineService";

import {
  faInfo,
  faPlusSquare,
  faTrash,
  faEdit,
  faPlus,
  faHome,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

const service = "designWorkflow";

const emailDynamicDropdown = [
  { key: "1", value: "Db column Name" },
  { key: "2", value: "field Name" },
];

let initialValues = {
  stages: [
    {
      stageCode: "INITIATE",
      stageTitle: "Initiate",
      status: "New",

      actions: [
        {
          action: "Send for Review",
          actionCode: "1",
          enableAction: true,
        },
      ],
    },
    // {
    //   stageCode: "REVIEW",
    //   stageTitle: "Review",
    //   status: "Pending Review",
    // },
  ],
  workflowCode: "",
  version: "1.0",
  defaultFirstStage: "INITIATE",
  workflowTitle: "",
};

const validationSchema = Yup.object({
  workflowTitle: Yup.string().required("Workflow Code is required"),
  workflowCode: Yup.string().required("Workflow Title is required"),
  version: Yup.string().required("Version is required"),
  stages: Yup.array().of(
    Yup.object().shape({
      stageCode: Yup.string().required("Code required"),
      status: Yup.string().required("Status required"),
      stageTitle: Yup.string().required("Title required"),
      actions: Yup.array().of(
        Yup.object().shape({
          action: Yup.string().required("Code required"),
          targetStage: Yup.string().required("Stage required"),
          // assignmentText: Yup.string().required("Assignment Text required"),
          // assignmentType: Yup.string().required("Assignment Type required"),
          // fieldName: Yup.string().required("Field Name required"),
          // roleName: Yup.string().required("Role Name required"),
        })
      ),
    })
  ),
});

const Forms = ({ id }) => {
  console.log("id", id);
  const [formValues, setFormValues] = useState(null);
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [ModuleOptions, setModuleOptions] = useState();
  const [forms, setForms] = useState();
  console.log("forms123", forms);
  const [fields, setFields] = useState();
  const [columnOptions, setColumnOptions] = useState();
  const [fieldOptions, setFieldOptions] = useState();
  const [formID, setFormId] = useState();
  console.log("formID123", formID);


  // useEffect(() => {
  //   if (moduleId) {
  //     getModuleForms("moduleForms", "", moduleId)
  //       .then((response) => {
  //         setFormOptions(response.data.data);
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   }
  // }, [moduleId]);

  useEffect(() => {
    getServiceData("getModuleInfo")
      .then((response) => {
        console.log("Module Response", response.data);
        setModuleOptions(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    getServiceData("getForms")
      .then((response) => {
        console.log("response123", response.data.data);
        setForms(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getServiceData("getUserInfo")
      .then((response) => {
        console.log(response.data.data);
        setUsers(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getServiceData("getPrivilegeInfo")
      .then((response) => {
        console.log("getPrivilegeInfo", response);
        let privaleArray = [];
        for (let i = 0; i < response.data.data.length; i++) {
          if (response.data.data[i]) {
            const transformedData = {
              value: response.data.data[i].key,
              label: response.data.data[i].name,
            };
            privaleArray.push(transformedData);
          }
        }
        console.log("privaleArray", privaleArray);
        setPrivilegeOptions(privaleArray);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  if (!id) {
    id = searchParams.get("id");
  }
  const generateMap = (props) => {
    const dataFormat = props.fieldName.map((item) => ({
      value: item,
      label: item,
    }));
    console.log("dataFormat", dataFormat);
    return dataFormat;
  };

  if (id) {
    useEffect(() => {
      getObjectData(service, id)
        .then((response) => {
          console.log("response", response.data);
          setFormId(response.data.form);
          const transformedData = response.data.stages.map((item) => ({
            value: item.stageId,
            label: item.stageCode,
          }));
          setColumnOptions(transformedData);
          setFormValues(response.data);

          getServiceData("getFormFields", response.data.form)
            .then((response) => {
              console.log("response getFormFields", response.data);

              const transformedData = response.data.data.map((item) => ({
                value: item.key,
                label: item.value,
              }));
              setFieldOptions(transformedData);
            })
            .catch((err) => {
              console.log(err);
            });
          for (let k = 0; k < response.data.stages.length; k++) {
            if (response.data.stages[k].fields.length > 0) {
              stageArray.push({
                stageMap: {
                  value: response.data.stages[k].stageId,
                  label: response.data.stages[k].stageCode,
                },
                stages: response.data.stages[k].stageCode,
                stageId: response.data.stages[k].stageId,
                filedDetailes: response.data.stages[k].fields.map((item) => ({
                  fieldMap: generateMap(item),
                  // single select
                  // fieldMap: { value: item.fieldName, label: item.fieldName },
                  fieldName: item.fieldName,
                  visible: item.visible,
                  editable: item.editable,
                  required: item.required,
                })),
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, [id]);
  }

  function hasDuplicates(arr) {
    return new Set(arr).size !== arr.length;
  }

  let onSubmit = (values) => {
    console.log("Values", JSON.stringify(values));
    if (hasDuplicates(stageArray.map((item) => item.stages))) {
      alert("Stage Names are Repeated..");
      return false;
    }

    for (let j = 0; j < values.stages.length; j++) {
      for (let i = 0; i < stageArray.length; i++) {
        if (stageArray[i].stages == values.stages[j].stageCode) {
          values.stages[j].fields = stageArray[i].filedDetailes;
        }
      }
    }
    //Fail the onsubmit to avoid page refresh.
    let closeCanvas = document.querySelector('[class="btn-close"]');
    if (values.workflowId) {
      updateObjectData(service, values, values.workflowId)
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

  const [touchedAllFields, setTouchedAllFields] = useState(false);
  const [TempArray, setTempArray] = useState([]);
  const [PrivilegeOptions, setPrivilegeOptions] = useState();
  const [stageArray, setStageArray] = useState([]);
  const handleAddStage = () => {
    setStageArray([
      ...stageArray,
      { stages: "", stageId: "", stageMap: "", filedDetailes: [] },
    ]);
  };
  const handleAddFields = (index) => {
    setTempArray({
      fieldName: [],
      visible: false,
      editable: false,
      required: false,
    });
    stageArray[index].filedDetailes.push({
      fieldMap: "",
      fieldName: [],
      visible: false,
      editable: false,
      required: false,
    });
  };
  const removeTempArray = (index, indexRow) => {
    const updatedItems = [...stageArray];
    updatedItems[index].filedDetailes.splice(indexRow, 1);
    setStageArray(updatedItems);
    //setTempArray(updatedItems);
  };

  const removeStgArray = (index, values) => {
    //stageArray.remove(index)
    const updatedItems = [...stageArray];
    //delete updatedItems[index]
    updatedItems.splice(index, 1);
    setStageArray(updatedItems);
    changeArray(index, values);
  };

  function changeArray(index, values) {
    for (let i = 0; i < values.stages.length; i++) {
      if (stageArray[index].stages == values.stages[i].stageCode) {
        values.stages[i].fields = [];
      }
    }
  }

  function privilageArray(previlageId) {
    if (PrivilegeOptions != null) {
      let AssignArray = [];
      for (let j = 0; j < PrivilegeOptions.length; j++) {
        if (PrivilegeOptions[j].value == previlageId) {
          AssignArray.push({
            value: PrivilegeOptions[j].value,
            label: PrivilegeOptions[j].label,
          });
          return AssignArray;
        }
      }
    }
  }
  return (
    <Formik
      initialValues={formValues || initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({
        errors,
        handleSubmit,
        handleBlur,
        handleChange,
        isSubmitting,
        touched,
        values,
        setFieldValue,
      }) => (
        console.log("setFieldValue3333", values.dynamicValue),
        (
          <Container fluid className="p-0">
            {/* <Header forform="privilege" title="PRIVILEGES" /> */}
            {/* {values.createdBy && (
              <div>
                {" "}
                Creation: <span>{values.createdBy}</span>
                {"("}
                <span>{values.createdOn}</span>
                {")"}
              </div>
            )}
            {values.lastUpdatedBy && (
              <div>
                {" "}
                Last Updated: <span>{values.lastUpdatedBy}</span>
                {"("}
                <span>{values.lastUpdatedOn}</span>
                {")"}
              </div>
            )} */}
            <Form id="privilege" onSubmit={handleSubmit}>
              {errors.submit && (
                <Alert className="my-3" variant="danger">
                  <div className="alert-message">{errors.submit}</div>
                </Alert>
              )}

              <div
                className="shadow font-medium  bg-white sticky-top "
                style={{ top: "62px", zIndex: 1 }}
              >
                <Row>
                  <Col>
                    <span className="f-6">Workflow Designer</span> <br />
                    <span className="h4">{values.workflowTitle}</span>
                  </Col>

                  <Col>
                    <div className="text-center  float-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        // disabled={alertMessage}
                      >
                        Submit
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>

              <Card className="mt-2">
                <Tabs
                  defaultActiveKey="details"
                  id="formtabs"
                  className="mb-3"
                  variant="underline"
                  // justify
                >
                  <Tab eventKey="details" title="Details">
                    <div>
                      <Row>
                        <Col>
                          <FormControl
                            control="select"
                            label="Module"
                            name="moduleId"
                            options={ModuleOptions}
                            required
                          />
                        </Col>
                        <Col>
                          {" "}
                          <FormControl
                            control="select"
                            label="Form"
                            name="form"
                            options={ forms?.filter((form) => form.module_id == values.moduleId)}
                            required
                          />
                        </Col>

                        <Col>
                          <FormControl
                            control="input"
                            label="Version"
                            name="version"
                            required
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormControl
                            control="input"
                            label="Workflow Code"
                            name="workflowCode"
                            required
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control="input"
                            label="Workflow Title"
                            name="workflowTitle"
                            required
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control="input"
                            label="First Stage"
                            name="defaultFirstStage"
                            required
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col></Col>
                        <Col>
                          <FormControl
                            control="number"
                            label="Due Days"
                            name="dueDays"
                            required
                          />
                        </Col>
                        <Col>
                          <FormControl
                            control="switch"
                            label="Enable"
                            name="enableWorkflow"
                          />
                          <FormControl
                            control="switch"
                            label="New Version?"
                            name="newVersion"
                          />
                        </Col>
                      </Row>
                    </div>
                  </Tab>

                  <Tab eventKey="stageactions" title="Workflow Stage & Actions">
                    <FieldArray
                      name="stages"
                      render={(arrayHelpers) => {
                        const stages = values.stages;
                        console.log("stages", stages);
                        console.log("arrayHelpers", arrayHelpers);
                        console.log("touched", touched);
                        return (
                          <div>
                            <Row>
                              <Button
                                type="button"
                                onClick={() =>
                                  arrayHelpers.push({
                                    stageCode: "",
                                    stageTitle: "",
                                    status: "",
                                    enableReview: false,
                                    enableUpdate: false,
                                  })
                                } // insert an empty string at a position
                              >
                                + Add Stage
                              </Button>
                            </Row>

                            <Row>
                              <h2 className="text-center mt-2">
                                Workflow Stage & Actions{" "}
                              </h2>
                            </Row>
                            <Accordion defaultActiveKey="0">
                              {stages && stages.length > 0
                                ? stages.map((stage, index) => (
                                    <Accordion.Item eventKey={index}>
                                      <Accordion.Header>
                                        {stage.stageCode +
                                          " [ Title: " +
                                          stage.stageTitle +
                                          " Status: " +
                                          stage.status +
                                          "] (" +
                                          stage.executionOrder +
                                          ")"}
                                      </Accordion.Header>
                                      <Accordion.Body>
                                        <>
                                          {/* <Card>
                            <Card.Title className="mx-2"> */}
                                          <Row key={index}>
                                            <Col>
                                              <FormControl
                                                control="input"
                                                label="Stage Code"
                                                name={`stages.${index}.stageCode`}
                                                required
                                              />
                                            </Col>{" "}
                                            <Col>
                                              <FormControl
                                                control="input"
                                                label="Stage Title"
                                                name={`stages.${index}.stageTitle`}
                                                required
                                              />
                                            </Col>{" "}
                                            <Col>
                                              <FormControl
                                                control="input"
                                                label="Status"
                                                name={`stages.${index}.status`}
                                                required
                                              />

                                              {/* <Field  placeholder="Status" className="form-control" name={`stages.${index}.status`}/><ErrorMessage name={`stages.${index}.status`} /> */}

                                              <br />
                                            </Col>{" "}
                                            <Col>
                                              <FormControl
                                                control="switch"
                                                label="Optional Stage"
                                                name={`stages.${index}.optional`}
                                              />
                                              <FormControl
                                                control="switch"
                                                label="End Stage"
                                                name={`stages.${index}.isEndStage`}
                                              />
                                              {/* <FormControl
                                                control="switch"
                                                label="Can share the task for review"
                                                name={`stages.${index}.enableReview`}
                                              />
                                              <FormControl
                                                control="switch"
                                                label="Can perform updates to the task"
                                                name={`stages.${index}.enableUpdate`}
                                              /> */}

                                              <FormControl
                                                control="switch"
                                                label="Enable Overdue Emails"
                                                name={`stages.${index}.enableOverDue`}
                                              />
                                              <FormControl
                                                control="switch"
                                                label="Enable Reminder Emails"
                                                name={`stages.${index}.enableReminder`}
                                              />
                                              <FormControl
                                                control="switch"
                                                label="Enable Filter Result on Reload"
                                                name={`stages.${index}.enableFilterResultSetOnReload`}
                                              />
                                              {/* <FormControl
                                                control="input"
                                                label="Default First Stage"
                                                name={`stages.${index}.defaultFirstStage`}
                                              /> */}
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col>
                                              <FormControl
                                                control="number"
                                                label="Order"
                                                name={`stages.${index}.executionOrder`}
                                                required
                                              />
                                            </Col>
                                            <Col>
                                              <label>Stage Privilage</label>
                                              <div>
                                                <Select
                                                  options={PrivilegeOptions}
                                                  name={`stages.${index}.privilegeId`}
                                                  //value={stages[index].privilegeId}
                                                  value={privilageArray(
                                                    stages[index].privilegeId
                                                  )}
                                                  placeholder="Stage Privilage"
                                                  onChange={(value) => {
                                                    stages[index].privilegeId =
                                                      value.value;
                                                  }}
                                                ></Select>
                                              </div>
                                            </Col>
                                            <Col>
                                              <FormControl
                                                control="input"
                                                label="Stage User"
                                                name={`stages.${index}.stageUser`}
                                              />
                                            </Col>
                                            <Col>
                                              <FormControl
                                                control="input"
                                                label="Parent Stage"
                                                name={`stages.${index}.parentStage`}
                                              />
                                            </Col>
                                          </Row>{" "}
                                          <Row>
                                            <Col>
                                              <FormControl
                                                control="textarea"
                                                label="Responsibilities"
                                                name={`stages.${index}.responsibilities`}
                                                required
                                              />
                                            </Col>
                                            <Col>
                                              <Button
                                                type="button"
                                                variant="warning"
                                                onClick={() =>
                                                  arrayHelpers.remove(index)
                                                } // remove a friend from the list
                                              >
                                                Delete
                                              </Button>
                                            </Col>
                                          </Row>
                                          {/* <Row>
                                  <Col>
                                    <FormControl
                                      control="switch"
                                      label="Can share the task for review"
                                      name="enableReview"
                                    />
                                  </Col>
                                  <Col>
                                    <FormControl
                                      control="switch"
                                      label="Can perform updates to the task"
                                      name="enableUpdate"
                                    />
                                  </Col>

                                </Row> */}
                                          {/* </Card.Title>
                          </Card> */}
                                          <Card className="ms-4">
                                            <Card.Body className="ms-2">
                                              <Row>
                                                <FieldArray
                                                  name={`stages.${index}.actions`}
                                                  render={(arrayHelpers1) => {
                                                    const actions =
                                                      values.stages[index]
                                                        .actions;
                                                    console.log(
                                                      "actions",
                                                      actions
                                                    );
                                                    console.log(
                                                      "arrayHelpers",
                                                      arrayHelpers1
                                                    );
                                                    console.log(
                                                      "touched",
                                                      touched
                                                    );
                                                    return (
                                                      <div>
                                                        <ButtonToolbar
                                                          className="justify-content-center"
                                                          aria-label="Toolbar with Button groups"
                                                        >
                                                          <ButtonGroup
                                                            aria-label="First group"
                                                            className="flex-grow-1"
                                                          >
                                                            <Button
                                                              type="button"
                                                              onClick={() =>
                                                                arrayHelpers1.push(
                                                                  {
                                                                    action: "",
                                                                    actionCode:
                                                                      "",
                                                                    targetStage:
                                                                      "",
                                                                    assignmentText:
                                                                      "",
                                                                    assignmentType:
                                                                      "",
                                                                    fieldName:
                                                                      "",
                                                                    roleName:
                                                                      "",
                                                                    triggerTask: false,
                                                                    triggerEmail: false,
                                                                    assignee:
                                                                      "",
                                                                    actionEmailTo:
                                                                      "",
                                                                    actionEmailCC:
                                                                      "",
                                                                    actionEmailSubject:
                                                                      "",
                                                                    actionEmailBody:
                                                                      "",
                                                                    enableAction: true,
                                                                    privilege:
                                                                      "",
                                                                  }
                                                                )
                                                              } // insert an empty string at a position
                                                            >
                                                              + Add Task
                                                            </Button>
                                                          </ButtonGroup>
                                                          {/* <ButtonGroup className="ms-2">
                                                  <Button variant="secondary">
                                                    Add Email Action
                                                  </Button>{" "}
                                                  <Button
                                                    className="ms-2"
                                                    variant="secondary"
                                                  >
                                                    Add Stage Action
                                                  </Button>{" "}
                                                </ButtonGroup> */}
                                                        </ButtonToolbar>
                                                        {/* <Row>
                                                <Button
                                                  type="button"
                                                  onClick={() =>
                                                    arrayHelpers1.push({
                                                      action: "",
                                                      targetStage: "",
                                                      assignmentText: "",
                                                      assignmentType: "",
                                                      fieldName: "",
                                                      roleName: "",
                                                    })
                                                  } // insert an empty string at a position
                                                >
                                                  Add Action
                                                </Button>
                                              </Row> */}
                                                        {actions &&
                                                        actions.length > 0
                                                          ? actions.map(
                                                              (
                                                                action,
                                                                index1
                                                              ) => {
                                                                let actionId = `stages.${index}.actions.${index1}`;
                                                                return (
                                                                  //                    {let actionId = `stages.${index}.actions.${index1}`;}
                                                                  <>
                                                                    <Row
                                                                      key={
                                                                        index1
                                                                      }
                                                                    >
                                                                      <Col>
                                                                        <FormControl
                                                                          control="input"
                                                                          label="Action Code"
                                                                          name={`${actionId}.actionCode`}
                                                                          required
                                                                        />
                                                                      </Col>{" "}
                                                                      <Col>
                                                                        <FormControl
                                                                          control="input"
                                                                          label="Action Title"
                                                                          name={`${actionId}.action`}
                                                                          required
                                                                        />
                                                                      </Col>{" "}
                                                                      <Col>
                                                                        <FormControl
                                                                          control="input"
                                                                          label="Privilege"
                                                                          name={`${actionId}.privilege`}
                                                                        />
                                                                        {/* <Field  placeholder="Status" className="form-control" name={`actions.${index}.status`}  />  <ErrorMessage name={`stages.${index}.status`} /> */}

                                                                        <br />
                                                                      </Col>
                                                                      <Col>
                                                                        <FormControl
                                                                          control="input"
                                                                          label="Stage Title"
                                                                          name={`${actionId}.targetStage`}
                                                                          required
                                                                        />
                                                                      </Col>{" "}
                                                                      <Col>
                                                                        <FormControl
                                                                          control="switch"
                                                                          label="Trigger Task"
                                                                          name={`${actionId}.triggerTask`}
                                                                          required
                                                                        />
                                                                        <FormControl
                                                                          control="switch"
                                                                          label="Trigger Email"
                                                                          name={`${actionId}.triggerEmail`}
                                                                          required
                                                                        />
                                                                      </Col>{" "}
                                                                      <Col>
                                                                        <FormControl
                                                                          control="switch"
                                                                          label="Enable"
                                                                          name={`${actionId}.enableAction`}
                                                                          required
                                                                        />
                                                                        <Button
                                                                          type="button"
                                                                          variant="warning"
                                                                          onClick={() =>
                                                                            arrayHelpers1.remove(
                                                                              index1
                                                                            )
                                                                          }
                                                                        >
                                                                          Delete
                                                                        </Button>
                                                                      </Col>
                                                                    </Row>
                                                                    {action.triggerTask && (
                                                                      <Row>
                                                                        <Col>
                                                                          <FormControl
                                                                            control="input"
                                                                            label="Assignment Text "
                                                                            name={`${actionId}.assignmentText`}
                                                                            required
                                                                          />
                                                                        </Col>
                                                                        <Col>
                                                                          <FormControl
                                                                            control="input"
                                                                            label="Assignee "
                                                                            name={`${actionId}.assignee`}
                                                                            required
                                                                          />
                                                                        </Col>
                                                                      </Row>
                                                                    )}
                                                                    {action.triggerEmail && (
                                                                      <>
                                                                        <Row>
                                                                          <Col>
                                                                            <FormControl
                                                                              control="input"
                                                                              label="Email To"
                                                                              name={`${actionId}.actionEmailTo`}
                                                                              required
                                                                            />
                                                                          </Col>
                                                                          <Col>
                                                                            <FormControl
                                                                              control="input"
                                                                              label="Email CC "
                                                                              name={`${actionId}.actionEmailCC`}
                                                                              required
                                                                            />
                                                                          </Col>
                                                                          <Col
                                                                            xs={
                                                                              6
                                                                            }
                                                                          >
                                                                            <FormControl
                                                                              control="input"
                                                                              label="Email Subject "
                                                                              name={`${actionId}.actionEmailSubject`}
                                                                              required
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                        <Row>
                                                                          <Col>
                                                                            <FormControl
                                                                              control="richtext"
                                                                              label="Email Body "
                                                                              name={`${actionId}.actionEmailBody`}
                                                                              setFieldValue={
                                                                                setFieldValue
                                                                              }
                                                                              formId={
                                                                                formID
                                                                              }
                                                                              dynamic="2"
                                                                              required
                                                                            />
                                                                          </Col>
                                                                        </Row>
                                                                      </>
                                                                    )}
                                                                    <hr />
                                                                  </>
                                                                );
                                                              }
                                                            )
                                                          : null}
                                                      </div>
                                                    );
                                                  }}
                                                />
                                              </Row>
                                            </Card.Body>
                                          </Card>
                                        </>
                                      </Accordion.Body>
                                    </Accordion.Item>
                                  ))
                                : null}
                            </Accordion>
                            <br />
                            <br />
                          </div>
                        );
                      }}
                    />
                  </Tab>
                  <Tab eventKey="fieldaccess" title="Field Access">
                    <Button className="me-2" onClick={() => handleAddStage()}>
                      <FontAwesomeIcon icon={faPlus} /> Add Stages
                    </Button>

                    {/* <FontAwesomeIcon icon={faPlus} color="black" mask={faCircle} fixedWidth className="me-1" /> */}
                    <div>
                      {stageArray.length > 0
                        ? stageArray.map((stage, index) => {
                            console.log("jjjjjjjjjjjjjjj", stageArray);
                            return (
                              <Table
                                tabIndex={index}
                                style={{
                                  width: "100%",
                                  borderStyle: "solid",
                                  borderColor: "#d5cfcf",
                                  borderWidth: "thin",
                                }}
                              >
                                <tr>
                                  <td colspan="6">
                                    <div className=" justify-content-start row pb-0 mb-0">
                                      <tr>
                                        <Button
                                          className="me-2"
                                          onClick={() => handleAddFields(index)}
                                        >
                                          <FontAwesomeIcon icon={faPlus} />{" "}
                                          Fields
                                        </Button>

                                        <Button
                                          className="me-2"
                                          onClick={() =>
                                            removeStgArray(index, values)
                                          }
                                        >
                                          <FontAwesomeIcon icon={faTrash} />{" "}
                                          Stage
                                        </Button>
                                      </tr>
                                      {/* <FontAwesomeIcon icon={faPlusSquare} color="black" onClick={() => handleAddFields(index)} fixedWidth className="me-1" /> */}
                                      {/* <FontAwesomeIcon icon={faTrash} color="black"
                                    onClick={() => removeStgArray(index, values)}
                                    fixedWidth className="me-1" /> */}
                                      <label className="col-sm-4 mr-4 text-md-center mt-1">
                                        Stages
                                      </label>
                                      <div className="col-sm-5">
                                        <Select
                                          options={columnOptions}
                                          name={`stageArray.${index}.stages`}
                                          value={stageArray[index].stageMap}
                                          // defaultValue={stageArray[index].stageMap}
                                          // isMulti={true}
                                          placeholder="Stages"
                                          onChange={(value) => {
                                            changeArray(index, values);
                                            const updatedStageArray = [
                                              ...stageArray,
                                            ];
                                            updatedStageArray[index].stages =
                                              value.label;
                                            updatedStageArray[index].stageId =
                                              value.value;
                                            updatedStageArray[index].stageMap =
                                              value;
                                            setStageArray(updatedStageArray);
                                          }}
                                        ></Select>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                {stageArray[index].filedDetailes.length > 0
                                  ? stageArray[index].filedDetailes.map(
                                      (stage, indexRow) => {
                                        return (
                                          <tr>
                                            <td>
                                              <FontAwesomeIcon
                                                icon={faTrash}
                                                color="#3F80EA"
                                                onClick={() =>
                                                  removeTempArray(
                                                    index,
                                                    indexRow
                                                  )
                                                }
                                                fixedWidth
                                                className="me-1"
                                              />
                                            </td>
                                            <td>
                                              <div style={{ width: "75%" }}>
                                                <Select
                                                  name="FieldAccessNames"
                                                  options={fieldOptions}
                                                  value={
                                                    stageArray[index]
                                                      .filedDetailes[indexRow]
                                                      .fieldMap
                                                  }
                                                  isMulti={true}
                                                  placeholder="Field Name"
                                                  // applyCss={{ width: "120%" }}
                                                  onChange={(value) => {
                                                    console.log(
                                                      "Value2222222",
                                                      value
                                                    );
                                                    const updatedStageArray = [
                                                      ...stageArray,
                                                    ];
                                                    updatedStageArray[
                                                      index
                                                    ].filedDetailes[
                                                      indexRow
                                                    ].fieldMap = value;
                                                    updatedStageArray[
                                                      index
                                                    ].filedDetailes[
                                                      indexRow
                                                    ].fieldName =
                                                      updatedStageArray[
                                                        index
                                                      ].filedDetailes[
                                                        indexRow
                                                      ].fieldMap.map(
                                                        (item) => item.value
                                                      );
                                                    setStageArray(
                                                      updatedStageArray
                                                    );
                                                  }}
                                                ></Select>
                                              </div>
                                            </td>

                                            <td>
                                              <FormControl
                                                control="switch"
                                                label="Visible"
                                                checked={
                                                  stageArray[index]
                                                    .filedDetailes[indexRow]
                                                    .visible
                                                }
                                                name={`stageArray.${index}.filedDetailes.${indexRow}.visible`}
                                                onChange={(event) => {
                                                  const updatedStageArray = [
                                                    ...stageArray,
                                                  ];
                                                  updatedStageArray[
                                                    index
                                                  ].filedDetailes[
                                                    indexRow
                                                  ].visible =
                                                    event.target.checked;
                                                  setStageArray(
                                                    updatedStageArray
                                                  );
                                                }}
                                              />
                                            </td>
                                            <td>
                                              <FormControl
                                                control="switch"
                                                label="Editable"
                                                //name="editable"
                                                checked={
                                                  stageArray[index]
                                                    .filedDetailes[indexRow]
                                                    .editable
                                                }
                                                name={`stageArray.${index}.filedDetailes.${indexRow}.editable`}
                                                disabled={
                                                  stageArray[index]
                                                    .filedDetailes[indexRow]
                                                    .visible == false
                                                }
                                                onChange={(event) => {
                                                  const updatedStageArray = [
                                                    ...stageArray,
                                                  ];
                                                  updatedStageArray[
                                                    index
                                                  ].filedDetailes[
                                                    indexRow
                                                  ].editable =
                                                    event.target.checked;
                                                  setStageArray(
                                                    updatedStageArray
                                                  );
                                                }}
                                              />
                                            </td>
                                            <td>
                                              <FormControl
                                                control="switch"
                                                checked={
                                                  stageArray[index]
                                                    .filedDetailes[indexRow]
                                                    .required
                                                }
                                                label="Required"
                                                name={`stageArray.${index}.filedDetailes.${indexRow}.requried`}
                                                disabled={
                                                  stageArray[index]
                                                    .filedDetailes[indexRow]
                                                    .visible == false
                                                }
                                                onChange={(event) => {
                                                  const updatedStageArray = [
                                                    ...stageArray,
                                                  ];
                                                  updatedStageArray[
                                                    index
                                                  ].filedDetailes[
                                                    indexRow
                                                  ].required =
                                                    event.target.checked;
                                                  setStageArray(
                                                    updatedStageArray
                                                  );
                                                }}
                                              />
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )
                                  : null}
                              </Table>
                            );
                          })
                        : null}
                    </div>
                  </Tab>

                  <Tab
                    eventKey="reminderoverdue"
                    title="Reminder & Overdue Emails"
                  >
                    <Row>
                      <Col>
                        <FormControl
                          control="input"
                          label="Due Date Column"
                          name="dueDateColumn"
                        />
                      </Col>
                      <Col>
                        <FormControl
                          control="switch"
                          label="Reminder"
                          name="enableReminder"
                        />
                        <FormControl
                          control="switch"
                          label="Overdue"
                          name="enableOverDue"
                        />
                      </Col>
                    </Row>

                    {values.enableReminder && (
                      <>
                        <span className="h4">
                          Remainder Email Configuration
                        </span>
                        <hr />
                        <Row>
                          <Col>
                            <FormControl
                              control="number"
                              label="No. days before reminder to be sent "
                              name="reminderDays"
                            />
                          </Col>
                          <Col>
                            <FormControl
                              control="input"
                              label="Subject "
                              name="reminderSubject"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <FormControl
                              control="richtext"
                              label="Body "
                              name="reminderBody"
                              // value={values.dynamicValue}
                              setFieldValue={setFieldValue}
                              formId={formID}
                              dynamic="1"
                              required
                            />
                          </Col>
                        </Row>
                      </>
                    )}

                    {values.enableOverDue && (
                      <>
                        <span className="h4">Overdue Email Configuration</span>

                        <hr />
                        <Row>
                          <Col>
                            <FormControl
                              control="number"
                              label="Overdue Recurrence "
                              name="overdueRecurrence"
                            />
                          </Col>
                          <Col>
                            <FormControl
                              control="number"
                              label="How many times?"
                              name="noOfTimes"
                              // helptext="Incase overdue to be sent until task closure, leave this blank."
                            />
                          </Col>
                          <Col>
                            <FormControl
                              control="input"
                              label="Subject "
                              name="overdueSubject"
                            />
                          </Col>
                        </Row>

                        <Row>
                          <FormControl
                            control="richtext"
                            label="Body "
                            name="overdueBody"
                            // value={values.dynamicValue}
                            setFieldValue={setFieldValue}
                            formId={formID}
                            dynamic="1"
                            required
                          />
                        </Row>
                      </>
                    )}
                  </Tab>
                </Tabs>
              </Card>
              {/* <div className="text-center mt-3">
                <Button type="submit" variant="primary" size="lg">
                  Submit
                </Button>
              </div> */}
            </Form>
          </Container>
        )
      )}
    </Formik>
  );
};

export default Forms;
