import { Helmet } from "react-helmet-async";
import { Container } from "react-bootstrap";
import { getviewData } from "../PMService";
import { getServiceData, getTaskForms } from "src/components/server/service";
import React from "react";
import { useNavigate } from "react-router-dom";
import ReportRuntime from "src/components/reports/Report";
import {
  Row,
  Col,
  Tab,
  Table,
  OverlayTrigger,
  Popover,
  Form,
  Button,
} from "react-bootstrap";
import CustomTooltip from "src/components/forms/reactformutils/fields/FieldToolTip";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import FormLink from "src/components/pages/FormLink";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import Chart from "src/components/charts/Chart";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faEdit,
  faTable,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
// import { display } from "html2canvas/dist/types/css/property-descriptors/display";

const Default = () => {
  let privs = util.getCurrentUser().privileges?.split(",");
  let forms = [];
  forms = [
    {
      title: "Create Product",
      form: "pmproduct",
      privilege: "PM_CREATE_PROJECT",
    },
    {
      title: "Create Project",
      form: "project",
      privilege: "PM_CREATE_PROJECT",
    },
    {
      title: "Create Release",
      form: "release",
      privilege: "PM_CREATE_PROJECT",
    },
    {
      title: "Create Task",
      form: "task",
      privilege: "PM_CREATE_TASK",
    },
    {
      title: "Weekly Status Update",
      form: "weeklystatus",
      privilege: "PM_CREATE_WSU",
    },
    {
      title: "Create Version",
      form: "pmversion",
      privilege: "PM_CREATE_PROJECT",
    },
    {
      title: "Create Ticket",
      form: "pmticket",
      privilege: "PM_CREATE_TICKET",
    },
    {
      title: "Create Test Scenario",
      form: "pmtestscenario",
      privilege: "PM_CREATE_TICKET",
    },
    {
      title: "Create Test Case",
      form: "pmtestcase",
      privilege: "PM_CREATE_TICKET",
    },
    {
      title: "Create Requirement",
      form: "pmrequirement",
      privilege: "PM_CREATE_REQUIREMENT",
    },
    
  ];
  const [enableTab, setEnableTab] = useState(false);

  let reports = [
    {
      title: "Product List Report",
      report: "PM_PRODUCT_LIST",
      privilege: "PM_VIEW_PROJECT",
    },
    {
      title: "Project List Report",
      report: "PROJECT_REPORT",
      privilege: "PM_VIEW_PROJECT",
    },
    {
      title: "Task List Report",
      report: "PM_PROJECT_TASK_LIST_REP",
      privilege: "PM_VIEW_TASK",
    },
    {
      title: "Weekly Status Report",
      report: "PM_EMP_WEEKLY_STATUS_RPT",
      privilege: "PM_VIEW_WSU",
    },
    {
      title: "Version List Report",
      report: "PM_VERSION_LIST",
      privilege: "PM_VIEW_PROJECT",
    },
    {
      title: "Release List Report",
      report: "PM_RELEASE_LIST",
      privilege: "PM_VIEW_PROJECT",
    },
    {
      title: "Ticket List Report",
      report: "PM_TICKET_LIST",
      privilege: "PM_VIEW_TICKET",
    },
    {
      title: "Requirement List Report",
      report: "PM_REQUIREMENT_LIST",
      privilege: "PM_VIEW_REQUIREMENT",
    },
  ];

  const FormsandReport = () => {
    const combinedItems = [
      ...forms.map((item) => ({ ...item, type: "form" })),
      ...reports.map((item) => ({ ...item, type: "report" })),
      //   ...chart.map((item) => ({ ...item, type: "chart" })),
    ];

    return (
      <>
        <div>
          <FormReportChartLink combinedItems={combinedItems} />
        </div>
      </>
    );
  };
  const updateValue = (value) => {
    setEnableTab(!enableTab);
    console.log("gggggggggggggggggggg", value);
  };

  // useEffect(() => {
  //   setTimeout(() => { //todo: workaround for calender not loading
  //     setTabValue(0)
  //   }, 10)
  // }, [])

  return (
    <>
      <Helmet title="Project Management" />
      <Container fluid className="p-0 ">
        <Tab.Container id="menu" defaultActiveKey="PM_DASHBOARD">
          <LandingPagesTitle
            title="Project Management"
            tabs={[
              {
                title: "Dashboard",
                key: "PM_DASHBOARD",
                privilege: "PM_VIEW_TASK",
              },
              {
                title: "Calendar",
                key: "PM_CALENDAR",
                privilege: "PM_VIEW_TASK",
              },
              {
                title: "Resource Utilization",
                key: "PM_RESOURCE",
                privilege: "PM_VIEW_TASK",
              },
            ]}
            updateValue={updateValue}
          />

          <Tab.Content>
            <Tab.Pane eventKey="PM_DASHBOARD">
              <div className="row row-cols-sm-1">
                <FormsandReport />
              </div>

              <div>
                {privs.includes("PM_CREATE_TASK") && (
                  <Row>
                    <ReportRuntime report="PM_PROJECT_TASK_REPORT" />
                  </Row>
                )}
              </div>
            </Tab.Pane>

            <Tab.Pane eventKey="PM_CALENDAR">
              <Calendar />
            </Tab.Pane>

            <Tab.Pane eventKey="PM_RESOURCE">
              <ResourceUtilization />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
};

let ResourceUtilization = () => {
  const [formValues, setFormValues] = useState([]);
  const [datesByMonth, setDatesByMonth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;
  const getDaysArray = (year, month) => {
    const monthIndex = month - 1;
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(year, monthIndex, 1);
    const result = [];
    while (date.getMonth() === monthIndex) {
      result.push([date.getDate(), names[date.getDay()]]);
      date.setDate(date.getDate() + 1);
    }
    return result;
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10));
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    setLoading(true);
    const viewParams = {
      viewName: "pa_pm_resource_utilization_data_v",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression:`user_id=${userId} or manager=${userId} or manager=${userId} or exists(select 1 from pa_bu_role_user_privilege where privilege_name='PM_VIEW_ALL_TASK' and user_id=${userId})`,
    };

    getviewData(viewParams)
      .then((response) => {
        console.log("response.data",response.data.data)
        setFormValues(response.data.data);
        const dates = getDaysArray(selectedYear, selectedMonth);
        setDatesByMonth(dates);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError(error);
        setLoading(false);
      });
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading resources: {error.message}</div>;
  }

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const startYear = 2010;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group controlId="monthSelect">
            <Form.Label>Select Month</Form.Label>
            <Form.Control
              as="select"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="form-select"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="yearSelect">
            <Form.Label>Select Year</Form.Label>
            <Form.Control
              as="select"
              value={selectedYear}
              onChange={handleYearChange}
              className="form-select"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <div style={{ maxHeight: "500px", zIndex: 2 }} className="card p-0 m-0">
     <Table bordered hover responsive className="table w-auto">
  <thead>
    <tr className="fs-5 fw-bold lh-1_5 text-center p-1 sticky-top">
      <th
        className="fixed-top text-start bg-white p-0 m-0"
        style={{
          position: "sticky",
          left: 0,
          zIndex: 3, // Ensure it stays above the "Reporting Manager" column and date fields
          whiteSpace: "nowrap",
          background: "#fff",
          paddingLeft: 1,
          paddingRight: 0,
        }}
      >
        Resource
      </th>
      <th
        className="text-start bg-white p-0 m-0"
        style={{
          position: "sticky",
          left: 112, // Adjust based on the width of the "Resource" column
          zIndex: 2, // Ensure it stays below the "Resource" column but above date fields
          whiteSpace: "nowrap",
          background: "#fff",
          padding: 0,
        }}
      >
        Reporting Manager
      </th>
      {datesByMonth.map((day, index) => (
        <th
          key={index}
          className={`m-0 px-1 ${day[1] === 'Sun' || day[1] === 'Sat' ? "bg-secondary-subtle" : "bg-white"}`}
        >
          <span
            className="fs-6 fw-light"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              paddingBottom: 0,
            }}
          >
            {day[0]} {" "} ({day[1]})
          </span>
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {formValues.length > 0 ? (
      formValues
        .filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.user_id === item.user_id)
        )
        .map((item, index) => (
          <tr key={index}>
            <td
              className="fw-medium text-start sticky-left bg-white"
              style={{
                position: "sticky",
                left: 0,
                whiteSpace: "nowrap",
                zIndex: 3,
                background: "#fff",
                padding: 0,
              }}
            >
              {item.full_name}
            </td>
            <td
              className="fw-medium text-start"
              style={{
                position: "sticky",
                left: 112, // Adjust based on the width of the "Resource" column
                zIndex: 2,
                background: "#fff",
                padding: 0,
              }}
            >
              {item.d_manager}
            </td>
            {datesByMonth.map((day, dayIndex) => {
              const dayString = `${selectedYear}-${selectedMonth
                .toString()
                .padStart(2, "0")}-${day[0]
                .toString()
                .padStart(2, "0")}`;

              const relatedTasks = formValues.filter(
                (task) =>
                  task.performed_on === dayString &&
                  task.user_id === item.user_id
              );
              const totalActivityHours = relatedTasks.reduce(
                (acc, task) => acc + (task.activity_hours || 0),
                0
              );

              const groupTasksByTitle = (tasks) => {
                return tasks.reduce((acc, task) => {
                  if (!acc[task.task_title]) {
                    acc[task.task_title] = [];
                  }
                  acc[task.task_title].push({
                    activity_name: task.activity_name || "N/A",
                    activity_hours: task.activity_hours || 0,
                    planned_task_start_date:
                      task.planned_task_start_date,
                    planned_task_end_date: task.planned_task_end_date,
                  });
                  return acc;
                }, {});
              };

              const groupedTasks = groupTasksByTitle(relatedTasks);
              const totalTasks = Object.keys(groupedTasks).length;
              const totalActivities = relatedTasks.reduce(
                (acc, task) => acc + (task.activity_name ? 1 : 0),
                0
              );
              const tooltipContent =
                Object.keys(groupedTasks).length > 0 ? (
                  <div
                    style={{
                      padding: "10px",
                      maxWidth: "400px",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      color: "#333333",
                      lineHeight: "1.5",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {/* Top Section */}
                    <div style={{ marginBottom: "10px" }}>
                      {Object.entries(groupedTasks).map(
                        ([taskTitle, activities], index) => (
                          <div key={index}>
                            <strong>Task:</strong> {taskTitle}
                            <div className="ps-2">
                              <strong>Activities:</strong>
                              {activities.map((activity, activityIndex) => (
                                <div
                                  key={activityIndex}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div>
                                    {activityIndex + 1}. {activity.activity_name}
                                  </div>
                                  <div className="ms-1 fw-bold">
                                    {activity.activity_hours} hrs
                                  </div>
                                </div>
                              ))}
                            </div>
                            <hr />
                          </div>
                        )
                      )}
                    </div>
                    {/* Separator Line */}
                    <hr />
                    {/* Bottom Section */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>Total Tasks</div>
                        <div className="fw-bold">{totalTasks}</div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>Total Activities</div>
                        <div className="fw-bold">{totalActivities}</div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>Total Activity Hours</div>
                        <div className="fw-bold">{totalActivityHours} hrs</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>No tasks on this day</div>
                );

              return (
                <td
                  key={dayIndex}
                  className={`text-center align-middle ${day[1] === 'Sun' || day[1] === 'Sat' ? "bg-secondary-subtle" : "bg-white"}`}
                  style={{
                    padding: 0,
                  }}
                >
                  <CustomTooltip tooltip={tooltipContent}>
                    <>
                      {totalActivityHours > 0 ? totalActivityHours : "-"}
                    </>
                  </CustomTooltip>
                </td>
              );
            })}
          </tr>
        ))
    ) : (
      <tr>
        <td
          colSpan={datesByMonth.length + 2} // Adjusted colspan to include the new Reporting Manager column
          className=""
          style={{ padding: 0 }}
        >
          No resources available
        </td>
      </tr>
    )}
  </tbody>
</Table>


      </div>
    </Container>
  );
};

const viewParams = {
  viewName: "pa_lm_holiday_setup_bv",
  pageNumber: 0,
  pageSize: 0,
  sortField: "",
  sortOrder: "",
  orderExpression: "",
  filterExpression: "",
};

export let Calendar = ({ rowIndex, row, original }) => {
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;
  let userName = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_name;
  const [userIds, setUserIds] = useState(userId);
  const [holidays, setHolidays] = useState([]);
  const [events, setEvents] = useState([]);
  const [formOptions, setFormOptions] = useState([]);
  const [user, setUser] = useState([]);
  const [formValues, setFormValues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(events);
  const calendarRef = useRef(null);
  const navigate = useNavigate();
  console.log(holidays, "holidaysholidays");

  useEffect(() => {
    getServiceData("getUserInfo")
      .then((response) => {
        const sortedData = response.data.data.sort((a, b) =>
          a.value.localeCompare(b.value)
        );
        setUser(sortedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getTaskForms("getUserInfo")
      .then((response) => {
        const responseData = response.data;
        setFormValues(responseData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleClick = (objectId) => {
    navigate(`/form/runtime?formService=task&objectId=${objectId}`);
  };

  const filterExpression = userIds ? `(${userIds}) = ANY(TASK_ASSIGNEE)` : "";

  useEffect(() => {
    getviewData(viewParams)
      .then((response) => {
        if (response.data.data.length > 0) {
          const storedDate = response.data.data.map(
            (item) => item.holiday_date
          );
          const occasions = response.data.data.map((item) => item.occasion);
          const newEventss = storedDate.map((date, index) => {
            return {
              holidaytitle: occasions[index],
              holidaystart: date.substring(0, 10),
            };
          });
          console.log(newEventss, "hjbjvgjk");

          setHolidays([...newEventss]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // const renderHolidayContent = (eventInfo) => {
  //   console.log(eventInfo, "hhhhg");

  //   return (
  //     <OverlayTrigger
  //       trigger={["hover", "focus"]}
  //       placement="bottom"
  //       // overlay={
  //       //   <Popover className="bg-success  text-dark bg-opacity-25 p-2">
  //       //     {eventInfo.event.holidaytitle}
  //       //   </Popover>
  //       // }
  //     >
  //       <div className="bg-primary text-wrap text-white   px-2">
  //         {eventInfo.event.holidaytitle}
  //       </div>
  //     </OverlayTrigger>
  //   );
  // };

  useEffect(() => {
    getviewData({
      viewName: "pa_pm_project_tasks_bv",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: filterExpression,
    })
      .then((response) => {
        if (response.data.data.length > 0) {
          const newEvents = response.data.data.flatMap((item) => {
            const startDate = new Date(item.planned_task_start_date);
            const endDate = new Date(item.planned_task_end_date);

            if (endDate) {
              endDate.setDate(endDate.getDate() + 1);
            }

            const formattedStartDate = startDate
              ? startDate.toISOString().substring(0, 10)
              : "";
            const formattedEndDate = endDate
              ? endDate.toISOString().substring(0, 10)
              : "";

            console.log(formattedStartDate, formattedEndDate, "ghasjtsy");

            const eventsArray = [];
            for (
              let date = new Date(startDate);
              date < endDate;
              date.setDate(date.getDate() + 1)
            ) {
              // Filter out weekends (Saturday and Sunday)
              if (date.getDay() !== 0 && date.getDay() !== 6) {
                eventsArray.push({
                  title: item.task_title,
                  objectIds: item.object_id,
                  start: new Date(date),
                  end: new Date(date),
                  ends: formattedEndDate,
                  starts: formattedStartDate,
                  extendedProps: {
                    status: item.status || "default",
                  },
                });
              }
            }
            // console.log(eventsArray, "arratttttt");

            return eventsArray;
          });

          setEvents(newEvents);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userIds]);

  useEffect(() => {
    if (formValues && formValues.data) {
      setFormOptions(
        formValues.data.map((item) => ({
          value: item.key,
          label: item.value,
        }))
      );
    }
  }, [formValues]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredEvents(
        events.filter((event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredEvents(events);
    }
  }, [searchQuery, events]);

  const handleUserChange = (event) => {
    setUserIds(event.target.value);
    setEvents([]);
    setFilteredEvents([]);
  };

  const renderEventContent = (eventInfo) => {
    const { title, start, end, extendedProps, starts, ends } = eventInfo.event;
    const status = extendedProps.status || "default";
    const starteddate = extendedProps.starts;
    const endeddate = extendedProps.ends;
    const objectId = extendedProps.objectIds;

    const startDate = new Date(starteddate);
    const endDate = new Date(endeddate);

    // const adjustedStartDate = new Date(startDate);
    // adjustedStartDate.setDate(adjustedStartDate.getDate());

    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);

    const today = new Date();

    const totalDays =
      adjustedEndDate && startDate
        ? Math.ceil((adjustedEndDate - startDate) / (1000 * 60 * 60 * 24)) + 1
        : 0;

    console.log(adjustedEndDate, totalDays, "csgiu");

    // Status colors
    const statusColors = {
      "Pending Review": "#FFC107", // Amber
      Completed: "#90EE90", // Light green or mint
      default: "#87CEEB", // Aqua
    };

    return (
      <OverlayTrigger
        trigger={["hover", "focus"]}
        placement="bottom"
        overlay={
          <Popover
            className="p-2"
            style={{
              backgroundColor: "#f0f0f0",
              color: "#000000",
              border: "1px solid #ced4da",
            }}
            // className="p-2 bg-success p-2 text-dark bg-opacity-25"
          >
            <div>
              <strong
                style={{
                  color: "#000000",
                }}
              >
                Title:
              </strong>{" "}
              {title}
            </div>
            <div>
              <strong
                style={{
                  color: "#000000",
                }}
              >
                Status:
              </strong>{" "}
              {status}
            </div>
            <div>
              <strong
                style={{
                  color: "#000000",
                }}
              >
                Start Date:
              </strong>{" "}
              {startDate.toISOString().substring(0, 10)}
            </div>
            <div>
              <strong
                style={{
                  color: "#000000",
                }}
              >
                End Date:
              </strong>{" "}
              {adjustedEndDate.toISOString().substring(0, 10)}
            </div>
            <div>
              <strong
                style={{
                  color: "#000000",
                }}
              >
                Total Days:
              </strong>{" "}
              {totalDays}
            </div>
          </Popover>
        }
      >
        <div
          className="text-wrap px-2"
          style={{
            backgroundColor: statusColors[status] || statusColors.default,
            color: "#000000",
            border: "1px solid transparent",
          }}
        >
          <span
            onClick={() => handleClick(objectId)}
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              whiteSpace: "pre-wrap",
            }}
          >
            {title}
          </span>
        </div>
      </OverlayTrigger>
    );
  };

  function renderCellContent(arg) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cellDate = arg.date;
    if (
      cellDate.getFullYear() === today.getFullYear() &&
      cellDate.getMonth() === today.getMonth() &&
      cellDate.getDate() === today.getDate()
    ) {
      // Additional logic if needed
    }

    return { html: arg.dayNumberText };
  }

  function handleCellMount(arg) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      arg.date.getFullYear() === today.getFullYear() &&
      arg.date.getMonth() === today.getMonth() &&
      arg.date.getDate() === today.getDate()
    ) {
      arg.el.classList.add("bg-success", "bg-opacity-25");
    }
  }

  return (
    <>
      <div className="d-flex align-items-center mb-3">
        <Form.Select
          className="input-field me-2"
          style={{ width: "200px" }}
          onChange={handleUserChange}
        >
          <option value="">{userName}</option>
          {formOptions &&
            formOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </Form.Select>
      </div>
      <div
        className="calendar-container bg-light d-flex flex-column"
        style={{
          height: "calc(100vh - 280px)",
          position: "fixed",
          overflow: "hidden",
          top: "220px",
          right: "0",
          bottom: "0",
          width: "calc(100% - 270px)",
        }}
      >
        <FullCalendar
          ref={calendarRef}
          dayCellContent={renderCellContent}
          dayCellDidMount={handleCellMount}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          initialDate={new Date()}
          themeSystem="bootstrap"
          isResizing={true}
          headerToolbar={{
            left: "prev,next,today",
            center: "title",
            right: "",
          }}
          handleWindowResize={true}
          height="100%"
          dayMinWidth="auto"
          events={filteredEvents}
          // holidayContent={renderHolidayContent}
          eventContent={renderEventContent}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Weeks",
            day: "Day",
          }}
        />
      </div>
    </>
  );
};

export default Default;
