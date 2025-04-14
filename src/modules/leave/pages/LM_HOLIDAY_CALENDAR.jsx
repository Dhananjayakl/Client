import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Container,
  Card,
  Row,
  Col,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
// import SimpleTable from "src/components/reports/SimpleReport";
import ReportRuntime from "src/components/reports/Report";
import useSidebar from "../../../hooks/useSidebar";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";

import multiMonthPlugin from "@fullcalendar/multimonth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faEdit,
  faTable,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import { getObjectData, getviewData } from "../LeaveService";
import { DateCell } from "src/components/reports/DateRangeColumnFilter";
import { useEffect, useState } from "react";
import { faCalendarPlus } from "@fortawesome/free-regular-svg-icons";

const viewParams = {
  viewName: "pa_lm_holiday_setup_bv",
  pageNumber: 0,
  pageSize: 0,
  sortField: "",
  sortOrder: "",
  orderExpression: "",
  filterExpression: "",
};

const Default = () => {
  const [events, setEvents] = useState([]);

  const { behavior } = useSidebar();

  useEffect(() => {
    getviewData(viewParams)
      .then((response) => {
        if (response.data.data.length > 0) {
          const storedDate = response.data.data.map(
            (item) => item.holiday_date
          );
          const occasions = response.data.data.map((item) => item.occasion);
          const newEvents = storedDate.map((date, index) => {
            return {
              title: occasions[index],
              start: date.substring(0, 10),
            };
          });
          setEvents([...newEvents]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {}, [behavior]);

  function renderCellContent(arg) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cellDate = arg.date; // Get date of the cell
    if (
      cellDate.getFullYear() === today.getFullYear() &&
      cellDate.getMonth() === today.getMonth() &&
      cellDate.getDate() === today.getDate()
    ) {
    }

    return { html: arg.dayNumberText };
  }

  const renderEventContent = (eventInfo) => {
    return (
      <OverlayTrigger
        trigger={["hover", "focus"]}
        placement="bottom"
        overlay={
          <Popover className="bg-success  text-dark bg-opacity-25 p-2">
            {eventInfo.event.title}
          </Popover>
        }
      >
        <div className="bg-primary text-wrap text-white   px-2">
          {eventInfo.event.title}
        </div>
      </OverlayTrigger>
    );
  };

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
    <React.Fragment>
      <Helmet title="Holiday Calendar" />
      <Container fluid className="p-0">
        <Row className="mt-1 ">
          <h4>Holiday Calendar</h4>
          <Col xs={12} md={6} xl={6} className="card pt-2">
            <FullCalendar
              dayCellContent={renderCellContent}
              dayCellDidMount={handleCellMount}
              plugins={[dayGridPlugin]} //multiMonthPlugin,
              initialView="dayGridMonth"
              initialDate={new Date()}
              themeSystem="bootstrap"
              isResizing={true}
              headerToolbar={{
                left: "prev,next,today",
                center: "title",
                right: "dayGridMonth",
              }}
              handleWindowResize={true}
              height="auto"
              dayMinWidth="auto"
              events={events}
              eventClassNames="bg-primary text-white "
              eventContent={renderEventContent}
              buttonText={{
                today: "Today",
                month: "Month",
                week: "Weeks",
                day: "Day",
              }}
            />
          </Col>
          <Col xs={12} md={6} xl={6}>
            <ReportRuntime report="LM_EMPLOYEE_HOLIDAY_CALENDAR" />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Default;
