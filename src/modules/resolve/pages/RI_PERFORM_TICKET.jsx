import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faPencil } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import { Row, Col } from "react-bootstrap";
import FormLink from "src/components/pages/FormLink";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";

const Default = () => {
  let forms = [
    {
      title: "Ticket",
      form: "createticket",
      privilege: "RI_CREATE_TICKET",
    },
  ];
  let reports = [
    {
      title: "Closed Tickets",
      report: "RI_PERFORM_HR_RPT",
      privilege: "RI_EDIT_TICKET",
    },
  ];
  let privs = util.getCurrentUser().privileges?.split(",");

  const combinedItems = [
    ...forms.map((item) => ({ ...item, type: "form" })),
    ...reports.map((item) => ({ ...item, type: "report" })),
  ];
  return (
    <>
      <Helmet title="Resolve IT" />
      <Container fluid className="p-0 ">
        <LandingPagesTitle title={"Perform Tickets"} />
        <div>
          <Row className="p-0 m-0">
            <FormReportChartLink combinedItems={combinedItems} />
          </Row>
        </div>

        {privs.includes("RI_EDIT_TICKET") && (
          <Row>
            <div className="col-md-6">
              <Row>
                <ReportRuntime report="RI_INITIATE_IT_TICKET_RPT" dataCard />
              </Row>
            </div>
            <div className="col-md-6">
              <Row>
                <ReportRuntime report="RI_PERFORM_IT_RPT" dataCard />
              </Row>
            </div>
          </Row>
        )}

        {privs.includes("RI_EDIT_TICKET") && (
          <Row>
            <ReportRuntime report="RI_INITIATE_HR_TICKET_RPT" />
          </Row>
        )}
        {/* {((privs.includes("RI_EDIT_TICKET")) || (privs.includes("RI_EDIT_ALL_TICKET")) )&& (
        <Row>
          <ReportRuntime report="RI_TICKET_TRENDS" />
        </Row>
      )} */}
      </Container>
    </>
  );
};

export default Default;
