import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import { getviewData } from "../GrcService";
import DataCardsForFinancialYear from "./DataCardsForFinancialYear";
import { useTranslation } from "react-i18next";

const cardData = (issueData) => {
    const { t } = useTranslation("common");
  
  return [
  {
    label: t("Total Issues"),
    value: issueData?.["Total Issues"] || 0,
    objectName: "IR_TOTAL_ISSUES",
    length: 2,
  },
  {
    label: t("Open Issues"),
    value: issueData?.["Open Issues"] || 0,
    objectName: "IR_OPEN_ISSUE",
    length: 2,
  },
  {
    label: t("Total Actions"),
    value: issueData?.["Total Actions"] || 0,
    objectName: "IR_TOTAL_ACTION",
    length: 2,
  },
  {
    label: t("Open Actions"),
    value: issueData?.["Open Actions"] || 0,
    objectName: "IR_OPEN_ACTIONS_BY_BU",
    length: 2,
  },
  {
    label: t("Corrective Actions"),
    value: issueData?.["Corrective Actions"] || 0,
    objectName: "IR_CORRECTIVE_ACTION",
    length: 2,
  },
  {
    label: t("Preventive Actions"),
    value: issueData?.["Preventive Actions"] || 0,
    objectName: "IR_PREVENTIVE_ACTION",
    length: 2,
  },
];
};

const Issues = ({ objectId, refreshCharts, yearStr, issueData}) => {
  const items = cardData(issueData).filter(
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
      <ReportRuntime
        report="IR_ISSUE_BUSINESS_UNIT"
        drilldownReports={{ processId: objectId }}
        key={refreshCharts}
        yearProp={yearStr}
        yearFlag
        dataCard
      />
      <Row className="p-0 m-0">
        <Col md={4}>
          <Chart
            chart="IR_ISSUES_BY_CATEGORY"
            defaultFilter={{ processId: objectId }}
            key={refreshCharts}
            yearProp={yearStr}
            yearFlag
            customExpressionFlag
          />
        </Col>
        <Col md={4}>
          <Chart
            chart="IR_ISSUES_SEVERITY_RATING"
            defaultFilter={{ processId: objectId }}
            key={refreshCharts}
            yearProp={yearStr}
            yearFlag
            customExpressionFlag
          />
        </Col>
        <Col md={4}>
          <ReportRuntime
            report="IR_ISSUE_DUE"
            drilldownReports={{ processId: objectId }}
            key={refreshCharts}
            yearProp={yearStr}
            yearFlag
            dataCard
            customExpressionFlag
          />
        </Col>
      </Row>
      <Row className="p-0 m-0">
        <Chart
          chart="IR_OPEN_AND_CLOSE_ISSUES_CLOSED"
          defaultFilter={{ processId: objectId }}
          key={refreshCharts}
          yearProp={yearStr}
          yearFlag
          customExpressionFlag
        />
      </Row>
    </>
  );
};

export default Issues;
