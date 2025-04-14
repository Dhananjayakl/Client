import {
  InputGroup,
  ModalFooter,
  ModalTitle,
  Row,
  Table,
} from "react-bootstrap";
import Section from "src/components/forms/reactformutils/fields/Section";
import { getviewData } from "src/modules/admin/AdminService";
import { Controller } from "react-hook-form";
import React from "react";
import FormControl from "src/components/forms/reactformutils/FormControl";
import {
  Form,
  Button,
  Card,
  Container,
  Col,
  Alert,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import Select from "react-select";
import axios from "src/utils/AxiosInstance";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { useForm, useFieldArray } from "react-hook-form";
import { useWatch } from "react-hook-form";
import ReportRuntime from "src/components/reports/Report";
import { useTranslation } from "react-i18next";
let RelationShip = ({
  formMetaData,
  hidden,
  formMethods,
  formId,
  objectId,
  sourceName,
  formValues,
  secondaryFormName,
  secondaryObjectId,
}) => {
  const modalBodyRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState();
  const [optionsModal, setOptionsModal] = useState(false);
  const [formOptions, setFormOptions] = useState([]);
  const [checkBoxValue, setCheckboxValue] = useState([]);
  const [counter, setCounter] = useState(10);
  const [reportValue, setReportValue] = useState();
  const [submittedData, setSubmittedData] = useState({});
  const [targetTypeOptions, setTargetTypeOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState,
    getValues,
    watch,
    setValue,
  } = useForm({});
  const { t } = useTranslation();
  console.log(inputValue, "inputs value");
  let refreshData = useRef();
  let reportData = useRef("empty");
  console.log(reportData, "bmw");
  console.log(reportValue, "report value");
  let objectType = useWatch({
    name: "objectType",
    control: control,
  });
  let objectName = useWatch({
    name: "objectName",
    control: control,
  });
  useEffect(() => {
    if (objectName) {
      setInputValue(objectName);
    } else {
      setInputValue("");
    }
  }, [objectName]);
  useEffect(() => {
    if (objectType) {
      setSelectedOption(objectType);
    }
  }, [objectType]);
  console.log(objectName, "obj name watch");

  const AddRelation = () => {
    fetchOptions();
    const targetTypeData = {
      viewName: "pa_forms_v",
      pageNumber: 1,
      pageSize: counter,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `is_relatable = true`,
    };
    getviewData(targetTypeData)
      .then((response) => {
        const responseData = response.data.data;
        console.log(responseData, "repose");

        if (responseData.length > 0) {
          let FilteredData = responseData.map((items) => {
            console.log(items, "target items");

            return {
              key: items.form_name,
              value: items.form_title,
            };
          });
          setTargetTypeOptions(FilteredData);
          setOptionsModal(true);
        } else {
          setTargetTypeOptions("");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  async function fetchData(Data) {
    try {
      const response = await axios.post(`/object-relationship`, {
        sourceObjectId: objectId,
        sourceObjectType: formMetaData.formmeta.form_name,
        sourceObjectName: formMetaData.formmeta.form_title,
        relationshipType: "",
        createdBy: "",
        createdOn: "",
        lastUpdatedBy: "",
        lastUpdatedOn: "",
        comments: "",
        target: Data,
      });

      if (response) {
        setOptionsModal(false);

        setCheckboxValue([]);
        refreshData.current();
      }
      console.log(response, "api 123 response");
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  }
  console.log(formMetaData.form_name, "former name");

  // const AddRelation = () => {};

  console.log(selectedOption, "selected in relation");
  async function fetchOptions() {
    console.log(selectedOption, "selected in api");
    console.log(inputValue, "inside api");
    console.log(formMetaData, "forms meta");

    let filterExpression = selectedOption;
    if (!filterExpression) {
      filterExpression = "";
    }
    console.log(filterExpression, "filt expression");
    //localhost:8080/progrecapps/api/v1/getRelatedObjects?pageNumber=1&pageSize=100&objectType=GL_PROCESS&filterExpression
    try {
      const response = await axios.get(
        `getRelatedObjects?pageNumber=1&pageSize=${counter}&targetObjectType=${filterExpression}&sourceObjectType=${formMetaData.formmeta.form_name}&filterExpression=${inputValue}&sourceObjectId=${objectId}`
      );

      let options = response.data;
      setFormOptions(response.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  }
  // useEffect(() => {
  //   fetchOptions(inputValue, selectedOption);
  // }, [selectedOption, inputValue]);
  useEffect(() => {
    console.log(selectedOption, "selling 123");
    if (selectedOption?.value || counter || inputValue) {
      fetchOptions();
    }
  }, [selectedOption, counter, inputValue]);
  console.log(formOptions, "state options");

  const handleCheckboxChange = (e) => {
    console.log(e, "italia");
    const checkTitle = e.target.alt;
    const checkedId = parseInt(e.target.id);
    const checkedName = e.target.name;
    const checkedType = e.target.value;
    console.log(checkedId, checkedName, "chnage box");

    if (e.target.checked == true) {
      setCheckboxValue((prevCheckedSelected) => [
        ...prevCheckedSelected,
        {
          value: checkedId,
          label: checkedName,
          Type: checkedType,
          Title: checkTitle,
        },
      ]);
    } else if (e.target.checked == false) {
      setCheckboxValue((prevCheckedValue) =>
        prevCheckedValue?.filter((item) => item.value !== checkedId)
      );
    }
  };
  console.log(checkBoxValue, "check box value");
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = modalBodyRef.current;
    const totalValue = Math.ceil(scrollTop + clientHeight);
    if (totalValue >= scrollHeight) {
      // Call your function here when scrollbar reaches the end
      setCounter((prevcounter) => prevcounter + 10);
    }
  };
  const checkBoxSubmit = () => {
    console.log(checkBoxValue, "submitted check box value");
    let TargetobjectName;
    let TargetobjectId;
    let TargetType;
    let Data = {};

    if (checkBoxValue.length > 0) {
      console.log(checkBoxValue, "checker");
      Data = checkBoxValue.map((items) => {
        return {
          targetObjectName: items.label,
          targetObjectId: items.value,
          targetObjectType: items.Type,
          targetObjectTypeTitle: items.Title,
        };
      });
      console.log(Data, "data source");
    }

    fetchData(Data);
  };
  console.log(submittedData, "submitted data");
  console.log(selectedOption, "selected one");
  console.log(targetTypeOptions, "target type options");
  console.log(refreshData, "refresh report");
  console.log(checkBoxValue, "check--box--value");

  return (
    <>
      <Section title={t("Relationships")}>
        {!hidden && (
          <Row className="px-2">
            <Button onClick={AddRelation} className="mb-3">
              (+) Relationship
            </Button>
          </Row>
        )}
        <ReportRuntime
          setReportValue={setReportValue}
          reportDataref={reportData}
          refreshdataref={refreshData}
          report="OBJECT_RELATIONSHIP"
          drilldownReports={{
            objectId: objectId,
            objectName: sourceName,
            secondaryFormName:
              secondaryFormName == undefined ? "" : secondaryFormName,
            secondaryObjectId:
              secondaryObjectId == undefined ||
              secondaryObjectId == "" ||
              secondaryObjectId == null
                ? 0
                : secondaryObjectId,
          }}
          ReletionDltIcon={hidden}
          // source_object_id=:objectId AND source_object_type=:objectType
        />
      </Section>
      <br></br>
      <Modal show={optionsModal} onHide={optionsModal} fullscreen={true}>
        <ModalTitle></ModalTitle>
        {/* <ModalTitle>options</ModalTitle> */}
        <ModalBody
          ref={modalBodyRef}
          onScroll={handleScroll}
          style={{
            height: "80vh",
            overflowY: "scroll",
          }}
        >
          <Card>
            <Card.Header>
              <Row>
                <Col className="">
                  <FormControl
                    control={control}
                    type="input"
                    field_title="Object Name"
                    name="objectName"
                    placeholder="Object Name"
                    size={255}
                  />
                </Col>
                <Col className="">
                  <FormControl
                    control={control}
                    type="select"
                    options={targetTypeOptions}
                    field_title="Object Type"
                    // groupFieldLabel="Object Type"
                    name="objectType"
                  />
                </Col>

                {/* <Col className="border">
                  <label className="mb-1">Object Type</label>
                  <Select
                    name="objectType"
                    className="form-control"
                    options={targetTypeOptions}
                    value={selectedOption}
                    closeMenuOnSelect={true}
                    isClearable={true}
                    onChange={(e) => {
                      console.log(e, "options in relation");
                      // if (e) {
                      //   setOptionsModal(true);
                      // }
                      const values = e;
                      setSelectedOption(e);
                      setCounter(10);
                    }}
                  ></Select>
                </Col> */}
              </Row>
            </Card.Header>
            <Card.Body>
              <>
                <br></br>
                {/* <InputGroup size="md" className="mb-3">
                  <Form.Control
                    type="search"
                    className="form-control"
                    placeholder="🔎 Search..."
                    aria-label="Disabled input example"
                    onChange={searchHandle}
                  />
                </InputGroup> */}
                <React.Fragment>
                  {/* <ListGroup>
                      <Row className="p-0 m-0 w-100">
                        <Col className="p-0 m-0 ">
                          <ListGroupItem
                            className="d-flex justify-content-center"
                            style={{
                              wordWrap: "break-word",
                            }}
                            variant="dark"
                          >
                            {formKey}
                          </ListGroupItem>
                        </Col>
                      </Row>
                    </ListGroup> */}
                  <ListGroup horizontal>
                    <Row className="p-0 m-0 w-100 h-100">
                      <Col className="p-0 m-0" xs={1}>
                        <ListGroupItem
                          className="w-100 h-100 m-0 p-0 d-flex justify-content-center"
                          variant="dark"
                        ></ListGroupItem>
                      </Col>
                      <Col className="p-0 m-0" xs={7}>
                        <ListGroupItem
                          className="w-100 h-100 m-0 p-0 d-flex justify-content-center"
                          // style={{
                          //   wordWrap: "break-word",
                          //   width: "400px",
                          // }}
                          variant="dark"
                        >
                          Object Name
                        </ListGroupItem>
                      </Col>
                      <Col className="p-0 m-0" xs={1}>
                        <ListGroupItem
                          className="w-100 h-100 m-0 p-0 d-flex justify-content-center"
                          variant="dark"
                        >
                          Object ID
                        </ListGroupItem>
                      </Col>
                      <Col className="p-0 m-0" variant="light" xs={3}>
                        <ListGroupItem
                          className="w-100 h-100 m-0 p-0 d-flex justify-content-center"
                          // style={{
                          //   wordWrap: "break-word",
                          //   width: "400px",
                          // }}
                          variant="dark"
                        >
                          Object Type
                        </ListGroupItem>
                      </Col>
                    </Row>
                  </ListGroup>
                  {formOptions.length > 0 &&
                    formOptions.map((items) => {
                      return (
                        <ListGroup horizontal key={items.objectId}>
                          <Row className="p-0 m-0 w-100">
                            {/* Column for the checkbox */}
                            <Col className="p-0 m-0 " xs={1}>
                              <ListGroupItem
                                variant="light"
                                className="w-100 h-100 d-flex justify-content-center py-1"
                              >
                                <Form.Check
                                  name={items.objectName}
                                  size="sm"
                                  alt={items.objectTypeTitle}
                                  type="checkbox"
                                  value={items.objectType}
                                  checked={
                                    checkBoxValue?.length > 0 &&
                                    checkBoxValue.some(
                                      (option) =>
                                        option.value === items.objectId &&
                                        option.Type === items.objectType
                                    )
                                  }
                                  id={items.objectId}
                                  onChange={(e) => handleCheckboxChange(e)}
                                />
                              </ListGroupItem>
                            </Col>
                            <Col className="p-0 m-0" variant="light" xs={7}>
                              <ListGroupItem
                                className="w-100 h-100 py-1"
                                variant="light"
                                style={{
                                  wordWrap: "break-word",
                                  whiteSpace: "normal", // Allows wrapping
                                  overflowWrap: "break-word", // Breaks long words
                                }}
                              >
                                <span>{items.objectName}</span>
                              </ListGroupItem>
                            </Col>
                            <Col className="p-0 m-0" xs={1}>
                              <ListGroupItem
                                className="w-100 h-100 py-1"
                                variant="light"
                                // style={{
                                //   wordWrap: "break-word",
                                //   whiteSpace: "normal",
                                //   overflowWrap: "break-word",
                                // }}
                              >
                                <span>{items.objectId}</span>
                              </ListGroupItem>
                            </Col>

                            {/* Column for the object name */}
                            <Col className="p-0 m-0" variant="light" xs={3}>
                              <ListGroupItem
                                className="w-100 h-100 py-1"
                                variant="light"
                                style={{
                                  wordWrap: "break-word",
                                  whiteSpace: "normal", // Allows wrapping
                                  overflowWrap: "break-word", // Breaks long words
                                }}
                              >
                                <span>{items.objectType}</span>
                              </ListGroupItem>
                            </Col>

                            {/* Column for the object ID */}
                          </Row>
                        </ListGroup>
                      );
                    })}
                </React.Fragment>
              </>
            </Card.Body>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button onClick={checkBoxSubmit}>Select</Button>
          <Button onClick={() => setOptionsModal(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default RelationShip;
