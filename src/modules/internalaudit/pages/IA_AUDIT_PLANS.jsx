import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Nav,
  Tab,
  Dropdown,
} from "react-bootstrap";

import dragula from "react-dragula";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import avatar1 from "src/assets/img/avatars/avatar.jpg";

import { getviewData } from "src/modules/admin/AdminService";
import { getQuarter } from "src/components/forms/reactformutils/elements/formutilfunctions";
import { useNavigate } from "react-router-dom";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import { useSelector } from "react-redux";
let auditInfo = {
  viewName: "PA_IA_AUDITS_bt",
  pageNumber: 0,
  pageSize: 0,
  sortField: "",
  sortOrder: "",
  orderExpression: "",
  filterExpression:
    "plan_id in (select plan_id from pa_ia_audit_plan where status='Active')",
};

const Lane = ({ name, children, onContainerLoaded }) => {
  const handleContainerLoaded = (container) => {
    if (container) {
      onContainerLoaded(container);
    }
  };

  return (
    <Card className=" h-100 shadow  pt-2 pb-0">
      <Card.Header className="p-1 m-0">
        <Card.Title className="border-bottom">{name}</Card.Title>
      </Card.Header>
      <Card.Body
        className="px-1"
        style={{
          height: "500px",
          overflowY: "auto",
          scrollbarWidth: "thin",
        }}
      >
        <div ref={handleContainerLoaded}>{children}</div>
      </Card.Body>
    </Card>
  );
};

const statusColors = {
  "Audit Started": "blue",
  Completed: "green",
  Closed: "green",
  Future: "grey",
  Overdue: "orange",
  Scheduled: "grey",
  Cancelled: "lightgray",
};

const Task = ({ item, id, checked, text, avatar, status }) => {
  const navigate = useNavigate();
  const circleColor = statusColors[item.status] || "grey";

  const handleClick = (e) => {
    // const path = `/page?id=${179}`;
    const path = `/page?name=${"IA_AUDIT"}&objectId=${id}`;

    navigate(path);
  };

  return (
    <Card
      className=" cursor-grab textlink-border2"
      style={{
        borderLeft: `5px solid ${circleColor}`,
      }}
    >
      <Card.Body className="px-2">
        <Row>
          <Col className="standard-Font fw-medium">
            {item.d_aud_classification}
          </Col>
          <Col className="standard-Font ">
            <span className="float-end">{item.status}</span>
          </Col>
        </Row>
        <Row>
          <p
            className="standard-heading-font text-link2"
            onClick={handleClick}
            value={id}
          >
            {text}
          </p>
        </Row>
        <Row className="standard-Font">
          <Col md={6} className="fw-medium">
            Manager:
          </Col>
          <Col>{item.d_audit_manager}</Col>
        </Row>
        <Row className="standard-Font">
          <Col md={6} className="fw-medium">
            Business Unit:
          </Col>
          <Col>{item.d_business_unit}</Col>
        </Row>
        <Row className="standard-Font">
          <Col md={6} className="fw-medium">
            Scope:
          </Col>
          <Col>{item.d_scope}</Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const containers = [];
let quarterMap = { 1: [], 2: [], 3: [], 4: [] };

const PageNavigation = () => {
  return (
    <Nav
      variant="underline"
      defaultActiveKey="first"
      className="float-end mt-1 d-none"
    >
      <Nav.Item>
        <Nav.Link eventKey="first">Audit</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="second">Audit Entity</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="third">Business Unit</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

const Tasks = () => {
  const [auditData, setAuditData] = useState([]);
  const [selectedYear, setSelectedYear] = useState();
  const [quarterMap, setQuarterMap] = useState({ 1: [], 2: [], 3: [], 4: [] });
  const { fiscal_year_starts } = useSelector(
    (state) => state.systemConfig.systemConfig
  );
  useEffect(() => {
    dragula(containers);
    getviewData(auditInfo)
      .then((response) => {
        setAuditData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const newQuarterMap = { 1: [], 2: [], 3: [], 4: [] };
    if (fiscal_year_starts === 4) {
      auditData.forEach((item) => {
        const itemYear = new Date(item.start_date).getFullYear();
        if (itemYear == selectedYear) {
          const quarter = getQuarter(item.start_date);
          newQuarterMap[quarter - 1]?.push(item);
        } else if (
          itemYear > selectedYear &&
          itemYear == parseInt(selectedYear, 10) + 1
        ) {
          const quarter = getQuarter(item.start_date);
          if (quarter == 1) {
            newQuarterMap[4]?.push(item);
          }
        }
      });
    } else {
      auditData.forEach((item) => {
        const itemYear = new Date(item.start_date).getFullYear();
        if (itemYear == selectedYear) {
          const quarter = getQuarter(item.start_date);
          newQuarterMap[quarter]?.push(item);
        }
      });
    }

    setQuarterMap(newQuarterMap);
  }, [auditData, selectedYear]);
  const getUniqueYears = (data) => {
    const yearsSet = new Set();
    data.forEach((item) => {
      const year = new Date(item.start_date).getFullYear();
      yearsSet.add(year);
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  };

  const handleYearCallback = (year) => {
    // setYearProp(year);

    setSelectedYear(year);
  };
  return (
    <React.Fragment>
      <Helmet title="Audit Plans" />
      <Container fluid className="p-0">
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <LandingPagesTitle
            title="Audits Dashboard"
            onYearChange={handleYearCallback}
            showYearFilter
          />
          <Row>
            <Col lg="6" xl="3" className="mt-2">
              <Lane
                name={
                  fiscal_year_starts === 4
                    ? "Q1 (Apr to Jun)"
                    : "Q1 (Jan to Mar)"
                }
                onContainerLoaded={(container) => containers.push(container)}
              >
                {quarterMap[1].map((item) => (
                  <Task
                    item={item}
                    key={item.object_id}
                    id={item.object_id}
                    avatar={avatar1}
                    text={item.audit_title}
                    status={item.d_audit_status}
                    checked
                  />
                ))}
              </Lane>
            </Col>
            <Col lg="6" xl="3" className="mt-2">
              <Lane
                name={
                  fiscal_year_starts === 4
                    ? "Q2 (Jul to Sep)"
                    : "Q2 (Apr to Jun)"
                }
                onContainerLoaded={(container) => containers.push(container)}
              >
                {quarterMap[2].map((item) => (
                  <Task
                    item={item}
                    key={item.object_id}
                    id={item.object_id}
                    avatar={avatar1}
                    text={item.audit_title}
                    status={item.d_audit_status}
                    checked
                  />
                ))}
              </Lane>
            </Col>
            <Col lg="6" xl="3" className="mt-2">
              <Lane
                name={
                  fiscal_year_starts === 4
                    ? "Q3 (Oct to Dec)"
                    : "Q3 (Jul to Sep)"
                }
                onContainerLoaded={(container) => containers.push(container)}
              >
                {quarterMap[3].map((item) => (
                  <Task
                    item={item}
                    key={item.object_id}
                    id={item.object_id}
                    avatar={avatar1}
                    text={item.audit_title}
                    status={item.d_audit_status}
                    checked
                  />
                ))}
              </Lane>
            </Col>
            <Col lg="6" xl="3" className="mt-2">
              <Lane
                name={
                  fiscal_year_starts === 4
                    ? "Q4 (Jan to Mar)"
                    : "Q4 (Oct to Dec)"
                }
                onContainerLoaded={(container) => containers.push(container)}
              >
                {quarterMap[4].map((item) => (
                  <Task
                    item={item}
                    key={item.object_id}
                    id={item.object_id}
                    avatar={avatar1}
                    text={item.audit_title}
                    status={item.d_audit_status}
                    checked
                  />
                ))}
              </Lane>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </React.Fragment>
  );
};

export default Tasks;
