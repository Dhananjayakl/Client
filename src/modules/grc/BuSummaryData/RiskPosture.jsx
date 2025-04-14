import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Card, Button } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import DataCards from "./DataCards";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import { useTranslation } from "react-i18next";

const cardData = (businessData, countofFramework) =>{
  const { t } = useTranslation("common");

  return [
  {
    label: t("Process"),
    value: businessData?.process_bt || 0,
    objectName: "GL_PROCESS_BY_BU",
    length: 3,
  },
  {
    label: t("Risks"),
    value: businessData?.risk_bt || 0,
    objectName: "GL_RISK_BY_BU",
    length: 2,
  },
  {
    label: t("Assessed Risks"),
    value: countofFramework?.["Risk Outlook"]?.[0]
    ?.AssessedRisks ||
      0,
    objectName: "RA_ASSESSED_RISKS",
    length: 2,
  },
  {
    label: t("Controls"),
    value: businessData?.control_bt || 0,
    objectName: "GL_CONTROL_BY_BU",
    length: 2,
  },
  {
    label: t("KRI"),
    value: businessData?.total_kri_count_bt || 0,
    objectName: "GL_KRI_BUSINESS_UNIT",
    length: 3,
  },
];
};
const cardDatas = (businessData, countofFramework) => {
  console.log(countofFramework ,"countofFrameworkcountofFramework");
  
  const { t } = useTranslation("common");
  return [
  {
    label: t("Process"),
    value: businessData?.process_bt || 0,
    objectName: "GL_PROCESS_BY_BU",
    length: 3,
  },
  {
    label: t("Controls"),
    value: businessData?.control_bt || 0,
    objectName: "GL_CONTROL_BY_BU",
    length: 3,
  },
  {
    label: t("Assessed Controls"),
    value:
    countofFramework?.["Compliance Postue"]?.[0]
    ?.ProcessAssessedControls,
    objectName: "CT_ASSESSED_CONTROLS",
    length: 3,
  },
  {
    label: t("Test & Procedures"),
    value: businessData?.testandprocedures_bt || 0,
    objectName: "GL_TESTANDPROCEDURES_BY_BU",
    length: 3,
  },
];
};

const RiskPosture = ({
  objectId,
  refreshCharts,
  businessData,
  countofFramework,
  yearStr,
}) => {
  const items = cardData(businessData, countofFramework).filter(
    (item) => item.value !== undefined
  );

  console.log(items ,"oooooooooooo");
  
  const item = cardDatas(businessData, countofFramework).filter(
    (item) => item.value !== undefined
  );
  return (
    <>
      <Row className="d-flex justify-content-center">
        <Col className="gx-5">
          <Card className="shadow-lg p-4 rounded position-relative">
            <Card.Body>
              <DataCards items={items} yearStr={yearStr} objectId={objectId} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div>
        <Row className="p-0 m-0">
          <Col>
            <Chart
              chart="GL_KRI_TREANDS"
              defaultFilter={{ processId: objectId }}
              customExpressionFlag
              key={refreshCharts}
              yearProp={yearStr}
            />
          </Col>
          <Col>
            <Chart
              chart="GL_RISK_RESPONSE"
              defaultFilter={{ processId: objectId }}
              customExpressionFlag
              key={refreshCharts}
              yearProp={yearStr}
            />
          </Col>
          <Col>
            <Chart
              chart="GL_BU_RISKS"
              defaultFilter={{ processId: objectId }}
              customExpressionFlag
              key={refreshCharts}
              yearProp={yearStr}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Chart
              chart="GL_HEAT_MAP_PROCESS"
              defaultFilter={{ processId: objectId }}
              customExpressionFlag
              key={refreshCharts}
              yearProp={yearStr}
            />
          </Col>
          <Col>
            <Col>
              <Chart
                chart="GL_RESIDUAL_RATING"
                defaultFilter={{ processId: objectId }}
                customExpressionFlag
                key={refreshCharts}
                yearProp={yearStr}
              />
            </Col>
          </Col>
        </Row>

        <Row>
          <Col>
            <Chart
              chart="GL_KRI_TRENDS"
              defaultFilter={{ processId: objectId }}
              customExpressionFlag
              key={refreshCharts}
              yearProp={yearStr}
            />
          </Col>
        </Row>

        {/* <Row className="p-0 m-0">
              <Card
                className="shadow-lg p-4 mb-5 rounded position-relative"
                xs={12}
                md={6}
                lg={3}
              >
                <Card.Body style={{ height: "400px" }}>
                  <div>
                    <h5>KRI Trends</h5>
                    {chartData ? (
                      <Line data={chartData} options={options} height={85} />
                    ) : (
                      <p>Loading data...</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Row> */}
        <Row className="p-0 m-0">
          <Col>
            <ReportRuntime
              report="RA_RISK_REGISTER_BU"
              drilldownReports={{ processId: objectId }}
              yearProp={yearStr}
              key={refreshCharts}
            />
          </Col>
        </Row>
        {/* <Row className="p-0 m-0">
              <Col md={3}>
                <ReportRuntime
                  report="RA_TOP_RISK"
                  drilldownReports={{ objectId: objectId }}
                  key={refreshCharts}
                />
              </Col>
            </Row> */}
      </div>
      <div>
        <LandingPagesTitle title={"Control Testing"} />
        <Row className="d-flex justify-content-center">
          <Col className="gx-5">
            <Card className="shadow-lg p-4 rounded position-relative">
              <Card.Body>
                <DataCards items={item} yearStr={yearStr} objectId={objectId} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <ReportRuntime
            report="CT_COMPLIANCE_BU_OVERALL_ASSESSMENTS"
            drilldownReports={{ processId: objectId }}
            key={refreshCharts}
            yearProp={yearStr}
            dataCard
          />
        </Row>

        <Row>
          {/* <Col md={6}>
          <Chart
            chart="CT_CONTROL_COMPLIANCE_STATUS"
            defaultFilter={{ processId: objectId }}
            key={refreshCharts}
          />
        </Col> */}
          {/* <Col>
            <Chart
              chart="CT_COMPLIANCE_STATUS_BY_QUARTER"
              defaultFilter={{ processId: objectId }}
              customExpressionFlag
              key={refreshCharts}
              yearProp={yearStr}
              yearFlag
            />
          </Col> */}
        </Row>
        <Row>
          <ReportRuntime
            report="CT_PROCESS_CONTROL_BU_RPT"
            drilldownReports={{ objectId: objectId }}
            key={refreshCharts}
            yearProp={yearStr}
          />
        </Row>
      </div>
    </>
  );
};

export default RiskPosture;
