import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import {
  faArrowsRotate,
  faRepeat,
  faSearch,
  faSortAmountAsc,
  faSortAmountDesc,
} from "@fortawesome/free-solid-svg-icons";
import dragula from "react-dragula";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import {
  getServiceData,
  getTaskInfo,
  getviewData,
  getTaskForms,
  getTaskFilters,
} from "src/components/server/service";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import { useTranslation } from "react-i18next";
const Task = ({ taskData, index }) => {
  const { t } = useTranslation("common");
  const [currentDate, setCurrentDate] = useState();
  const [showDetails, setShowDetails] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString();

    setCurrentDate(formattedDate);
  }, []);

  const taskURl = `/form${taskData.apihandler}?id=${taskData.object_id}`;
  const withoutSlash = taskData.apihandler.replace(/^\/+/, ""); //this will remove the slash from the api handler
  const engineTaskURl = `/form/runtime?formService=${withoutSlash}&objectId=${taskData.object_id}`; //suppose if i click on the button it will open the form

  return (
    <div className="card mb-2" onClick={() => setShowDetails(!showDetails)}>
      <div className="card-header pb-0">
        <Row>
          <div className="col-9 overflow-x-hidden">
            {/* {taskData.formtitle === "Leave Request" ? (
              <Link key={index} to={taskURl} className="link-dark">
                {" "}
                {taskData.task_title}
              </Link>
            ) : ( */}
            <Link key={index} to={engineTaskURl} className="link-dark">
              {" "}
              {taskData.task_title}
            </Link>
            {/* )} */}
            <div>
              <small>
                {taskData.modulename} {" -> "}
                {taskData.formtitle}{" "}
              </small>
            </div>
          </div>
          <div className="col text-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                // taskData.formtitle === "Leave Request" &&
                // ? navigate(taskURl)
                navigate(engineTaskURl);
              }}
            >
              {t("Open Task")}
            </Button>
          </div>
        </Row>
        <hr className="m-0" />
      </div>
      <div className="card-body">
        <Row>
          <Col className="col-3">
            <div>{t("Status")} :</div>
            <div>{taskData.due_date && <>{t("Due Date")} :</>}</div>
            <div>{taskData.createdby && <>{t("Created")} :</>}</div>
            <div>{taskData.last_updated_by && <>{t("Last Updated")} :</>}</div>
          </Col>
          <Col>
            <div>{taskData.status}</div>
            <div>
              {" "}
              {taskData.due_date && (
                <>{util.getFormattedDate(taskData.due_date)}</>
              )}{" "}
            </div>
            <div>
              {taskData.createdby && (
                <>
                  {taskData.createdby} ({" "}
                  {util.getFullFormattedDate(taskData.created_on)})
                </>
              )}
            </div>
            <div>
              {taskData.last_updated_by && (
                <>
                  {taskData.last_updated_by} ({" "}
                  {util.getFullFormattedDate(taskData.last_updated_on)})
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const containers = [];

const Tasks = (props) => {
  let { tasksData } = props;
  const { t } = useTranslation();
  return (
    <div className="row row-cols-1 row-cols-lg-2">
      {tasksData &&
        tasksData.data.map((taskData, index) => (
          <div className="col mb-2 mt-2" key={index}>
            <Task taskData={taskData}></Task>
          </div>
        ))}
    </div>
  );
};

const TasksPage = () => {
  const { t } = useTranslation("common");
  const [tasksData, setTasksData] = useState();
  const [visibleTasks, setVisibleTasks] = useState([]);
  const containerRef = useRef(null);
  const [pageSize, setPageSize] = useState(10);
  const [fetchingData, setFetchingData] = useState(false);
  const [filtervalue, setFiltervalue] = useState();
  const [filterData, SetFilterData] = useState();
  const [formValues, setFormValues] = useState();
  const [formOptions, setFormOptions] = useState();
  const [formSelected, setFormSelected] = useState("");
  const [sortbyselected, setSortbySelected] = useState("");
  const [titleSelecetd, setTitleSelected] = useState("");
  const [fromDateSelected, setFromDateSelected] = useState("");
  const [toDateSelected, setToDateSelected] = useState("");
  const [inputValLength, setInputValLength] = useState();
  const [errorFlag, setErrorFlag] = useState(false);
  const [orderBy, setOrderBy] = useState("");
  const [meta, setMeta] = useState();
  const [sortByType, setSortByType] = useState();
  const [dateValue, setDateValue] = useState();

  const [sortbyvalue, setsortbyvalue] = useState("");
  const batchSize = 10;
  let counter = 10;
  const [counters, setcounters] = useState(counter);
  const handleScroll = () => {
    const container = containerRef.current;
    if (
      !fetchingData &&
      container.scrollTop + container.clientHeight >=
        container.scrollHeight - 20
    ) {
      setFetchingData(true); // Set flag to prevent multiple calls
      loadMoreTasks(
        formSelected,
        fromDateSelected,
        toDateSelected,
        titleSelecetd,
        sortbyvalue
      );
    }
  };

  const loadMoreTasks = async (formvalue, fromDate, toDate, title, sort) => {
    counter += 10;
    const form = fromDateSelected;
    setcounters(counter);
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [visibleTasks]);

  useEffect(() => {
    getTaskForms("getTaskForms")
      .then((response) => {
        const responseData = response.data;
        setFormValues(responseData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  let finalrecord;
  if (meta) {
    finalrecord = Math.ceil(meta.totalRecords / 10) * 10;
    finalrecord = finalrecord;
    if (counters > finalrecord) {
      setcounters(finalrecord);
    }
  }

  useEffect(() => {
    if (meta) {
      getTaskFilters(
        "getTaskFilters",
        1,
        formSelected,
        titleSelecetd,
        fromDateSelected,
        toDateSelected,
        counters,
        sortbyselected,
        sortbyvalue
      )
        .then((response) => {
          const responseData = response.data;
          setMeta(response.data);
          setTasksData(responseData);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [
    formSelected,
    fromDateSelected,
    toDateSelected,
    counters,
    titleSelecetd,
    sortbyselected,
    sortbyvalue,
  ]);
  useEffect(() => {
    getTaskFilters(
      "getTaskFilters",
      1,
      formSelected,
      titleSelecetd,
      fromDateSelected,
      toDateSelected,
      counters,
      sortbyselected
    )
      .then((response) => {
        const responseData = response.data;
        setMeta(response.data);
        setTasksData(responseData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    if (formValues && formValues.data) {
      setFormOptions(
        formValues.data.map((item) => ({
          value: item.form_id,
          label: item.formtitle,
        }))
      );
    }
  }, [formValues]);

  const fields = [
    { value: "", label:"Select an Option"},
    { value: "formtitle", label: "Form Title" },
    { value: "created_on", label: "Created On" },
  ];

  const handleDropdownSelect = (eventKey, event) => {
    // You can perform additional actions with the selected value here
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "3px solid #ced4da", // Customize border styles
      fontWeight: "bold", // Make the border bold
    }),
  };
  // const defaultOption = object[0];
  const handleSortByAsc = () => {
    if (sortbyselected) {
      setsortbyvalue("asc");
    }
  };
  const handleSortByDesc = () => {
    if (sortbyselected) {
      setsortbyvalue("desc");
    }
  };
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);


  const SearchHandle = () => {};
  useEffect(() => {
    if (inputValLength?.length > 4) {
    }
  }, [inputValLength]);
  return (
    <React.Fragment>
      <Helmet title=" To Do List" />
      <Container
        fluid
        ref={containerRef}
        style={{ height: "80vh", overflowY: "scroll" }}
      >
        <div className="d-flex">
          <h1 className="h3 mb-3 flex-grow-1">{t("To Do List")}</h1>
          <div className="float-end me-2">
            {" "}
            {tasksData && tasksData.totalRecords} {t("Tasks")}
          </div>
        </div>
        <Form>
          <Row className="mb-3 align-items-center">
            <Col xs={12} sm={6} md={4} lg={2} xl={2}>
              <Form.Label htmlFor="title">{t("Title")}</Form.Label>
              <Form.Control
                style={{ borderColor: errorFlag ? "red" : "black" }}
                onChange={(e) => {
                  if (e.target.value?.length > 100) {
                    setErrorFlag(true);
                    setTimeout(() => {
                      setErrorFlag(false);
                    }, 1000);
                  }
                  setInputValLength(e.target.value);
                  const trimmedValue = e.target.value.trim();
                  if (
                    (trimmedValue.length === 1 &&
                      /[^a-zA-Z0-9]/.test(trimmedValue)) ||
                    (trimmedValue === "" && e.target.value.length > 100)
                  ) {
                    return;
                  }
                  setTitleSelected(e.target.value.substring(0, 100));
                }}
                value={titleSelecetd}
                className=""
                id="title"
                type="search"
                autoComplete="false"
              />
              {/* {errorFlag && (
                <div
                  className="text-danger mt-1"
                  style={{ fontSize: "10px" }}
                >
                  Maximum Character Length Reached.
                </div>
              )} */}
            </Col>
            <Col xs={12} sm={6} lg={2} md={4} xl={2}>
              <Form.Label htmlFor="fromDate">From Date</Form.Label>
              <Form.Control
                ref={fromDateRef}
                onChange={(event) => {
                  setFromDateSelected(event.target.value);
                }}
                onClick={() => {
                  if (fromDateRef.current && fromDateRef.current.showPicker) {
                    fromDateRef.current.showPicker();
                  }
                }}
                onFocus={(e) => e.target.blur()}
                placeholder="choose date"
                onKeyDown={(e) => {
                  e.preventDefault(); // This prevents all key inputs
                }}
                name="formDate"
                className="input-field"
                id="fromDate"
                type="date"
              />
            </Col>
            <Col xs={12} sm={6} md={4} lg={2}>
              <Form.Label htmlFor="toDate">To Date</Form.Label>
              <Form.Control
              ref={toDateRef}
                onFocus={(e) => e.target.blur()}
                   onClick={() => {
                  if (toDateRef.current && toDateRef.current.showPicker) {
                    toDateRef.current.showPicker();
                  }
                }}
                onChange={(event) => {
                  setToDateSelected(event.target.value);
                }}
                onKeyDown={(e) => {
                  e.preventDefault(); // This prevents all key inputs
                }}
                className="input-field"
                name="toDate"
                id="toDate"
                type="date"
              />
            </Col>
            <Col xs={12} sm={6} md={4} lg={2}>
              <Form.Label htmlFor="selectedColumns">Form</Form.Label>

              <Form.Select
                id="selectedColumns"
                // defaultValue={defaultOption.value}
                className="input-field me-2"
                onChange={(event) => {
                  setFormSelected(event.target.value);
                  setFormValues();
                }}
              >
                <option value="">{t("Select an option")}</option>
                {formOptions &&
                  formOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </Form.Select>
            </Col>
            {/* <Col>
              <Button onClick={SearchHandle} variant="outline-secondary" className="search-icon mt-3 p-2">
                <FontAwesomeIcon icon={faSearch} size="xl" style={{ color: '#007bff', padding: "5px" }} />

              </Button>
            </Col> */}
            {/* <Col></Col> */}

            <Col xs={12} sm={6} md={4} lg={2}>
              <Form.Label htmlFor="selectedColumns">Task By</Form.Label>
              <Form.Select
                id="selectedColumns"
                className="input-field me-2"
                onChange={(event) => {
                  setSortbySelected(event.target.value);
                }}
              >
                {fields.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={6} sm={3} md={1} lg={1}>
              <Button
                variant="outline-secondary"
                onClick={handleSortByAsc}
                className="search-icon mt-3 p-2 ms-2"
              >
                <FontAwesomeIcon
                  icon={faSortAmountAsc}
                  style={{ color: "#007bff" }}
                />
              </Button>
            </Col>
            {/* {sortbyselected && (sortbyselected == 3 || sortbyselected == 4) && ( */}
            <Col xs={6} sm={3} md={1} lg={1}>
              <Button
                variant="outline-secondary"
                onClick={handleSortByDesc}
                className="search-icon mt-3 p-2 ms-2"
              >
                <FontAwesomeIcon
                  icon={faSortAmountDesc}
                  style={{ color: "#007bff" }}
                />
              </Button>
              {/* )} */}
            </Col>
          </Row>
        </Form>

        {tasksData && <Tasks tasksData={tasksData} />}
      </Container>
    </React.Fragment>
  );
};

export default TasksPage;
