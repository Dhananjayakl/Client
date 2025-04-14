import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faPencil, faEye } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";

const Default = () => {
  let privs = util.getCurrentUser().privileges?.split(",");
  console.log(privs, "privileges");
  let forms = [
    {
      title: "Vendor onboarding",
      form: "vendorBoarding",
      privilege: "ZA_VENDOR_RISK_MANAGER",
    },
  ];

  let reports = [
    {
      title: "Vendor onboarding Summary",
      report: "ZA_VENDOR_ONBOARDING",
      privilege: "ZA_VENDOR_RISK_MANAGER",
    },
  ];

  const combinedItems = [
    ...forms.map((item) => ({ ...item, type: "form" })),
    ...reports.map((item) => ({ ...item, type: "report" })),
  ];

  return (
    <>
      <Helmet title="Vendor Risk Management" />
      <Container fluid className="p-0 m-0">
        <div>
          <LandingPagesTitle
            title="Vendor Risk Management"
            privileges="ZA_VENDOR_RISK_MANAGER"
          />
          <FormReportChartLink combinedItems={combinedItems} />
          <Row>
            <Col>
              <Chart chart="ZA_VENDORS_BY_BUSINESS_UNIT" />
            </Col>
            <Col>
              <Chart chart="ZA_VENDOR_REVIEW_STATUS" />
            </Col>
          </Row>

          <Row>
            <ReportRuntime report="ZA_VENDOR_ONBOARDING_STATUS" dataCard />
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Default;
