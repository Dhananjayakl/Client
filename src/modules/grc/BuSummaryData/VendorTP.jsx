import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import DataCards from "./DataCards"; 
import DataCardsForFinancialYear from "./DataCardsForFinancialYear";
import { useTranslation } from "react-i18next";

const cardData = (vendorData, activeThirdparties) => {
  const { t } = useTranslation("common");
  return [
  {
    label: t("Number of Services"),
    value: vendorData?.numberofservice || 0,
    objectName: "VM_NUMBER_OF_SERVICES",
    length: 3,
  },
  {
    label: t("Surveys Performed"),
    value: vendorData?.surveysPerformed || 0,
    objectName: "SM_SURVEYS_PERFORMED",
    length: 3,
  },
  {
    label: t("Critical Services"),
    value: vendorData?.criticalservices || 0,
    objectName: "VM_CRITICAL_SERVICES",
    length: 3,
  },
  {
    label: t("Vendors/Third Parties"),
    value: activeThirdparties || 0,
    objectName: "GL_THIRD_PARTY_BY_BU",
    length: 3,
  },
];
};

const VendorTP = ({
  objectId,
  refreshCharts,
  yearStr,
  businessData,
  vendorData,
}) => {
  const activeThirdparties = businessData?.thirdparty_bt || 0;

  const items = cardData(vendorData, activeThirdparties).filter(
    (item) => item.value !== undefined
  );

  return (
    <>
      <Row className="d-flex justify-content-center">
        <Col className="gx-5">
          <Card className="shadow-lg p-4 rounded position-relative">
            <Card.Body>
              <DataCardsForFinancialYear items={items} yearStr={yearStr} objectId={objectId} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <ReportRuntime
            report="SM_SURVEY_STATUS_BY_BU"
            drilldownReports={{ processId: objectId }}
            yearProp={yearStr}
            dataCard
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Chart
            chart="VM_HIGH_RISK_VENDORS_BY_BU"
            defaultFilter={{ processId: objectId }}
            key={refreshCharts}
            yearProp={yearStr}
            // yearFlag
            customExpressionFlag
          />
        </Col>
        <Col md={6}>
          <Chart
            chart="VM_ONGOING_VENDOR_CONTRACTS_BY_BU"
            defaultFilter={{ processId: objectId }}
            key={refreshCharts}
            yearProp={yearStr}
            // yearFlag
            customExpressionFlag
          />
        </Col>
      </Row>
      <ReportRuntime
        report="VM_EXPIRED_CONTRACTS_BY_BU"
        drilldownReports={{ processId: objectId }}
        yearProp={yearStr}
      />
      <ReportRuntime
        report="VM_VENDOR_REGISTER_BY_BU"
        drilldownReports={{ processId: objectId }}
        yearProp={yearStr}
      />
    </>
  );
};

export default VendorTP;
