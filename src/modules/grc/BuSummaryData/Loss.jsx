import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import DataCards from "./DataCards";
import { getLossData } from "../GrcService";
import DataCardsForFinancialYear from "./DataCardsForFinancialYear";
import { useTranslation } from "react-i18next";



const cardData = (totalLoss)  => {
  const { t } = useTranslation("common");
return  [
  {
    label: t("Loss Events"),
    value: totalLoss?.internal_loss_event?.total_count || 0,
    objectName: "LE_LOSS_EVENT_BY_BU",
    length: 2,
  },
  {
    label: t("Total Gross Loss"),
    value: "₹ " +  totalLoss?.totalGrossLoss  || 0,
    objectName: "LE_INTERNAL_NET_GROSS_LOSS",
    length: 4,
  },
  {
    label: t("Total Recovery Loss"),
    value: "₹ " + totalLoss?.totalrecoveryLoss || 0,
    objectName: "LE_INTERNAL_NET_GROSS_LOSS",
    length: 2,
  },
  {
    label: t("Total Net Loss"),
    value: "₹ " + totalLoss?.totalNetLoss || 0,
    objectName: "LE_INTERNAL_NET_GROSS_LOSS",
    length: 3,
  },
];
};

const Loss = ({ objectId, refreshCharts, yearStr,totalLoss }) => {
 

  const items = cardData(totalLoss).filter((item) => item.value !== undefined);
  

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
      {/* <Row>
        <Col md={6}>
          <ReportRuntime
            report="LE_TOP_5_LOSS_EVENTS"
            drilldownReports={{ processId: objectId }}
            key={refreshCharts}
            yearProp={yearStr}
            columnReport
            totalsum
          />
        </Col>
        <Col md={6}>
          <Chart
            chart="LE_LOSS_BY_QUARTER"
            defaultFilter={{ processId: objectId }}
            key={refreshCharts}
            yearProp={yearStr}
            yearFalg
            customExpressionFlag
          />
        </Col>
      </Row> */}
      <Row>
        <Col md={6}>
          <Chart
            chart="LE_BASAL_CATEGORY_BY_BU_ID"
            defaultFilter={{ processId: objectId }}
            customExpressionFlag
            yearFlag
            key={refreshCharts}
            yearProp={yearStr}
          />
        </Col>
        <Col md={6}>
          <Chart
            chart="LE_LOSS_BY_IMPACT"
            defaultFilter={{ processId: objectId }}
            key={refreshCharts}
            yearProp={yearStr}
            yearFlag
            customExpressionFlag
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Chart
            chart="LE_LOSS_STATUS"
            defaultFilter={{ processId: objectId }}
            key={refreshCharts}
            yearProp={yearStr}
            yearFlag
            customExpressionFlag
          />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Chart
            chart="LE_TOTAL_GROSS_LOSS"
            defaultFilter={{ processId: objectId }}
            key={refreshCharts}
            yearProp={yearStr}
            yearFlag
            customExpressionFlag
          />
        </Col>
        <Col md={6}>
          <Chart
            chart="LE_TOTAL_NET_LOSS"
            defaultFilter={{ processId: objectId }}
            key={refreshCharts}
            yearProp={yearStr}
            yearFlag
            customExpressionFlag
          />
        </Col>
      </Row>
    </>
  );
};
export default Loss;
