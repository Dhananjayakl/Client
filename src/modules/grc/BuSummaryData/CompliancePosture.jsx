import React, { useState, useEffect } from "react";
import { Row, Col, Card, Modal, Button } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import DataCards from "./DataCards";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import { useTranslation } from "react-i18next";


const cardData = (businessData, countoflastquarted,countofFramework) => {
  const { t } = useTranslation("common");

  return [
  {
    label: t("Requirement"),
    value: businessData?.requirement_bt || 0,
    objectName: "GL_REQUIREMENT_BY_BU",
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
    ?.ProcessAssessedControls || 0,
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
const cardDatas = (businessData, countoflastquarted,countofFramework) => {
  const { t } = useTranslation("common");

  return [
  {
    label: t("Requirement"),
    value: businessData?.requirement_bt || 0,
    objectName: "GL_REQUIREMENT_BY_BU",
    length: 4,
  },
  {
    label: t("Controls"),
    value: businessData?.control_bt || 0,
    objectName: "GL_CONTROL_BY_BU",
    length: 4,
  },
  {
    label: t("Assessed Controls"),
    value:
    countofFramework?.["Compliance Postue"]?.[0]
    ?.RegAssessedControls || 0,
    objectName: "CT_ASSESSED_CONTROLS",
    length: 3,
  },
  // {
  //   label: "Assessed Requirements",
  //   value:
  //     countoflastquarted?.["Compliance Postue"]?.[0]?.AssessedControls || 0,
  //   objectName: "CT_ASSESSED_CONTROLS",
  //   length: 4,
  // },
  // {
  //   label: "Test & Procedures",
  //   value: businessData?.testandprocedures_bt || 0,
  //   objectName: "GL_TESTANDPROCEDURES_BY_BU",
  //   length: 3,
  // },
];
};

const CompliancePosture = ({
  objectId,
  refreshCharts,
  businessData,
  countoflastquarted,
  countofFramework,
  yearStr,
}) => {
  const { t } = useTranslation("common");

  const items = cardData(businessData, countoflastquarted,countofFramework).filter(
    (item) => item.value !== undefined
  );
  const item = cardDatas(businessData, countoflastquarted,countofFramework).filter(
    (item) => item.value !== undefined
  );
  const framework = 1;

  return (
    // <>
    //   <Row className="d-flex justify-content-center">
    //     <Col className="gx-5">
    //       <Card className="shadow-lg p-4 rounded position-relative">
    //         <Card.Body>
    //           <DataCards items={items} yearStr={yearStr} objectId={objectId} />
    //         </Card.Body>
    //       </Card>
    //     </Col>
    //   </Row>
    //   <Row>
    //     <ReportRuntime
    //       report="CT_COMPLIANCE_BU_OVERALL_ASSESSMENTS"
    //       drilldownReports={{ processId: objectId }}
    //       key={refreshCharts}
    //       yearProp={yearStr}
    //       dataCard
    //     />
    //   </Row>

    //   <Row>
    //     {/* <Col md={6}>
    //       <Chart
    //         chart="CT_CONTROL_COMPLIANCE_STATUS"
    //         defaultFilter={{ processId: objectId }}
    //         key={refreshCharts}
    //       />
    //     </Col> */}
    //     <Col>
    //       <Chart
    //         chart="CT_COMPLIANCE_STATUS_BY_QUARTER"
    //         defaultFilter={{ processId: objectId }}
    //         customExpressionFlag
    //         key={refreshCharts}
    //         yearProp={yearStr}
    //         yearFlag
    //       />
    //     </Col>
    //   </Row>
    //   <Row>
    //     <ReportRuntime
    //       report="CT_PROCESS_CONTROL_BU_RPT"
    //       drilldownReports={{ objectId: objectId }}
    //       key={refreshCharts}
    //       yearProp={yearStr}
    //     />
    //   </Row>
    // </>
    <>
      {/* <Container fluid className="p-0 "> */}
      <div
        data-bs-spy="scroll"
        data-bs-target="#navbar-example2"
        data-bs-offset="0"
        class="scrollspy-example mt-3"
        tabindex="0"
      >
        <Row className="d-flex justify-content-center">
          <Col className="gx-5">
            <Card className="shadow-lg p-4 rounded position-relative">
              <Card.Body>
                <DataCards
                  items={items}
                  yearStr={yearStr}
                  objectId={objectId}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row id="scrollspyHeading1">
          <ReportRuntime
            report="CT_COMPLIANCE_OVERALL_ASSESSMENTSS"
            dataCard
            drilldownReports={{ frameworkID: framework, processId: objectId }}
            yearProp={yearStr}
            key={refreshCharts}
          />
        </Row>
        {/* <Row id="scrollspyHeading1">
          <Col className="p-0 m-0">
            <ReportRuntime report="GL_REQUIREMENT" dataCard />
          </Col>
          <Col className="p-0 m-0">
            <ReportRuntime report="GL_ORPHAN_REQUIREMENT" dataCard />
          </Col>
          <Col className="p-0 m-0">
            <ReportRuntime report="GL_CONTROL" dataCard />
          </Col>
          <Col className="p-0 m-0">
            <ReportRuntime report="GL_ORPHAN_CONTROLS" dataCard />
          </Col>
        </Row> */}

        {/* <Row id="scrollspyHeading1">
          <Col className="p-0 m-0">
            <ReportRuntime
              report="CT_CONTROL_TEST_FINDINGS"
              dataCard
              drilldownReports={{ frameworkID: framework }}
            />
          </Col>
          <Col className="p-0 m-0">
            <ReportRuntime
              report="CT_CONTROL_TEST_FINDINGS_OBS"
              dataCard
              drilldownReports={{ frameworkID: framework }}
            />
          </Col>
        </Row> */}
        <Row id="scrollspyHeading1">
          {/* <Col xs={12} md={6} lg={4}>
            <Chart chart="CT_CONTROL_BY_PRIORITY" />
          </Col> */}
          {/* <Col xs={12} md={6} lg={4}>
            <Chart
              chart="CT_COMPLIANCE_STATUS_KEY_CONTROL_CHART"
              defaultFilter={{ processId: framework }}
              customExpressionFlag
            />
          </Col> */}
          <Col>
            <Chart
              chart="CT_OVERALL_CONTROL_STATUS_CPY"
              defaultFilter={{ processId: objectId }}
              drilldownReports={{ frameworkID: framework, processId: objectId }}
              customExpressionFlag
              key={refreshCharts}
              yearProp={yearStr}
            />
          </Col>
          <Col>
            <Chart
              chart="CT_CONTROL_HEAT_MAPS"
              defaultFilter={{ processId: framework }}
              customExpressionFlag
              key={refreshCharts}
              yearProp={yearStr}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Chart
              chart="GL_REQUIREMENT_BY_COMPLIANCE_TYPE_BU"
              defaultFilter={{ processId: objectId }}
              customExpressionFlag
              key={refreshCharts}
              yearProp={yearStr}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <ReportRuntime
              report="CT_EFFECTIVE_CONTROLS_BU"
              drilldownReports={{ frameworkID: framework, processId: objectId }}
              yearProp={yearStr}
              key={refreshCharts}
            />
          </Col>
          <Col md={6}>
            <ReportRuntime
              report="CT_WEAK_CONTROL_BU"
              drilldownReports={{ frameworkID: framework, processId: objectId }}
              yearProp={yearStr}
              key={refreshCharts}
            />
          </Col>
        </Row>
      </div>
      {/* </Container> */}

      <div>
        <LandingPagesTitle title={t("Regulatory Risk Assessments")} />
        <Row className="d-flex justify-content-center">
          <Col className="gx-5">
            <Card className="shadow-lg p-4 rounded position-relative">
              <Card.Body>
                <DataCards items={item} yearStr={yearStr} objectId={objectId} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="p-0 m-0">
          <Col>
            <ReportRuntime
              report="RA_REQUIREMENT_RATING"
              drilldownReports={{ processId: objectId }}
              yearProp={yearStr}
              key={refreshCharts}
              pivotTable
            />
          </Col>
        </Row>
        <Row className="p-0 m-0">
          <Col xs={4}>
            <Chart
              chart="GL_REQUIREMENT_BY_CATEGORY"
              defaultFilter={{ processId: objectId }}
              customExpressionFlag
              key={refreshCharts}
              yearProp={yearStr}
            />
          </Col>
          <Col xs={8}>
            <ReportRuntime
              report="RA_REQUIREMENT_REGISTER_BY_BU"
              drilldownReports={{ processId: objectId }}
              yearProp={yearStr}
              key={refreshCharts}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CompliancePosture;
