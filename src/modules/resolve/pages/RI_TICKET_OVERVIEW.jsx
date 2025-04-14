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

const Default = () => {
  let forms = [
    {
      title: "Ticket",
      form: "createticket",
      privilege: "RI_INITIATE_TICKET",
    },
  ];
  return (
    <>
      <Helmet title="Resolve IT" />
      <Container fluid className="p-0 ">
        <div className="pb-2">
          <h4>Overview</h4>
        </div>
        {/* <Row>
          <ReportRuntime report="RI_TICKET_TRENDS" dataCard />
        </Row>
        <Row>
          <ReportRuntime report="RI_TICKET_TRENDS" />
        </Row> */}
      </Container>
    </>
  );
};

export default Default;
