import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
// import {
//   getLandingPages,
// } from "../../admin/AdminService";

import { useEffect, useState } from "react";

import ReportRuntime from "src/components/reports/Report";
const FormLink = (props) => {
  let navigate = useNavigate();
  return (
    <Button
      variant="light"
      className="mx-2 text-dark"
      size="sm"
      onClick={() => navigate(`/form/runtime?formService=${props.form}`)}
    >
      {props.title}
    </Button>
  );
};

const ReportLink = (props) => {
  let navigate = useNavigate();
  return (
    <Button
      variant="light"
      className="mx-2 text-dark"
      size="sm"
      onClick={() => navigate(`/report?report=${props.form}`)}
    >
      {props.title}
    </Button>
  );
};

const Default = () => {
  // const [forms, SetForms] = useState([]);
  // const [reports, SetReports] = useState([]);

  // useEffect(() => {

  //   getLandingPages(
  //       "getLandingPages")
  //       .then((response) => {
  //         console.log("response IssueID", response.data.reports.length);
  //         SetForms(response.data.forms);
  //         SetReports(response.data.reports);

  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });

  // }, []);

  let forms = [
    { title: "Issue Management", form: "issueregistry" },
    { title: "Log Issues", form: "logissue" },
  ];
  let reports = [
    { title: "Issues", form: "IR_ISSUE_DETAILS" },
    { title: "Triage Issues", form: "IR_TRIAGE_ISSUES" },
    { title: "My Issues", form: "IR_MY_ISSUES" },
    { title: "First Line Issues", form: "IR_FIRST_LINE_ISSUES" },
    { title: "Reopen Issues", form: "IR_CLOSED_ISSUES" },
    { title: "Action", form: "IR_ACTION_REPORT" },
    { title: "Reopen Actions", form: "IR_CLOSED_ACTION" },
    { title: "My Actions", form: "IR_MY_ACTIONS" },
  ];

  return (
    <React.Fragment>
      <Helmet title="Issue Management" />
      <Container fluid className="p-0">
        <div>
          <b>Create:</b>
          {forms.map((item) => {
            return <FormLink title={item.formTitle} form={item.formName} />;
          })}
        </div>
        <div>
          <b>View/Edit:</b>
          {reports.map((item) => {
            return (
              <ReportLink title={item.reportTitle} form={item.reportName} />
            );
          })}
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Default;
