import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  Container,
  Row,
  Col,
  Button,
  Overlay,
  Tooltip,
  Card,
  NavItem,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faList,
  faUpload,
  faTruckPlane,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import FormLink from "src/components/pages/FormLink";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { NavLink } from "react-router-dom";
import ReportRuntime from "src/components/reports/Report";

let GroupLinks = (props) => {
  const { Header, linkList } = props;
  const navigate = useNavigate();
  return (
    <>
      <Card>
        <CardHeader>
          <FontAwesomeIcon
            icon={faList}
            className="pe-2 fa-lg"
            style={{ color: "green" }}
          />
          <a className="text-black sidebar-link-navigation p-0 m-0">
            <span className="text-black fs-4">{Header}</span>
            <hr className="p-0 m-0 text-black" />
          </a>
        </CardHeader>
        <Card.Body>
          <ul
            style={{ listStyleType: "circle", color: "black" }}
            md={6}
            xs={12}
            className="d-flex justify-content-evenly"
          >
            {linkList.map((item) => {
              return (
                <li style={{ width: "100%" }}>
                  <NavLink
                    to={`/report?report=${item.report}`}
                    md={12}
                    xs={12}
                    className="NavChildLink"
                  >
                    {item.title}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </Card.Body>
      </Card>
    </>
  );
};

const Default = () => {
  let FormHistory = [
    { title: "Form Access Info", report: "FORM_ACCESS_INFO" },
    { title: "Form Submission Log", report: "FORM_SUBMISSION_LOG" },
    { title: "Task History", report: "TASK_HISTORY" },
    { title: "Data Imports", report: "DATA_IMPORTS" },
  ];

  let ReportHistory = [
    { title: "Report Access Info", report: "REPORT_ACCESS_INFO" },
    { title: "Report Export", report: "REPORT_EXPORT" },
  ];

  let UserHistory = [
    {
      title: "User Login History",
      report: "USER_LOGIN_HISTORY",
    },

    {
      title: "Idea Users History",
      report: "MH_IDEAL_USERS",
    },
  ];

  let OtherHistory = [
    { title: "Attachments", report: "ATTACHMENTS" },
    { title: "Email", report: "EMAIL_QUEUE" },
    { title: "Deployment", report: "DEPLOYMENT" },

    // { title: "Data Imports", report: "DATA_IMPORTS" },
  ];
  return (
    <Container>
      <Helmet title="Monitoring And Health" />
      <h3 className="">Monitoring and Health</h3>
      <Row className="p-o m-0">
        <GroupLinks Header="Form History" linkList={FormHistory} />
      </Row>
      {/* <Row  className="p-o m-0">
        <GroupLinks Header="Report History" linkList={ReportHistory} />
      </Row> */}
      <Row className="p-o m-0">
        <GroupLinks Header="User History" linkList={UserHistory} />
      </Row>
      <Row className="p-o m-0">
        <GroupLinks Header="Other History" linkList={OtherHistory} />
      </Row>

      <Row>
        <ReportRuntime report="MH_TOTAL_USERS" dataCard />
      </Row>
      <Row>
        <Col>
          <ReportRuntime report="MH_LOGIN_FAILED_HISTORY" dataCard />
        </Col>
        <Col>
          <ReportRuntime report="MH_TOP_USERS_IN_WEEK" dataCard />
        </Col>
      </Row>
    </Container>
  );
};

export default Default;
