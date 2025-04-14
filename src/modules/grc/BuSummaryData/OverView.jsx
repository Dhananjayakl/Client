import React, { useState, useEffect } from "react";
import { Row, Col, Card, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getviewData } from "../GrcService";
import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faTriangleExclamation,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";
import DataCards from "./DataCards";
import { useTranslation } from "react-i18next";

const cardData = (businessData, countoflastquarted) => {
  const { t } = useTranslation("common");
  return [
  {
    label: t("Process"),
    value: businessData?.process_bt || 0,
    objectName: "GL_PROCESS_BY_BU",
    length: 2,
  },
  {
    label: t("Risks"),
    value: businessData?.risk_bt || 0,
    objectName: "GL_RISK_BY_BU",
    length: 2,
  },
  {
    label: t("Controls"),
    value: businessData?.control_bt || 0,
    objectName: "GL_CONTROL_BY_BU",
    length: 2,
  },
  {
    label: t("Assets"),
    value: businessData?.asset_bt || 0,
    objectName: "GL_ASSET_BY_BU",
    length: 2,
  },
  {
    label: t("Vendors"),
    value: businessData?.thirdparty_bt || 0,
    objectName: "GL_THIRD_PARTY_BY_BU",
    length: 2,
  },
  {
    label: t("KRI"),
    value: businessData?.total_kri_count_bt || 0,
    objectName: "GL_KRI_BUSINESS_UNIT",
    length: 2,
  },
];
};

const OverView = ({
  objectId,
  refreshCharts,
  businessData,
  countoflastquarted,
  businessResilienceData,
  presentFinanceyearTotalcount,
  countOfPreviousFinanceYear,
  countofFramework,
  yearStr,
}) => {
  const { t } = useTranslation("common");
  const items = cardData(businessData, countoflastquarted).filter(
    (item) => item.value !== undefined
  );

  const fetchHighRiskVendors = () => {
    getviewData({
      viewName: "pa_vm_product_service_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `criticality=${1} and purchasing_business_unit=${objectId}`,
    })
      .then((response) => {
        // setCriticalVendors(response?.data?.totalRecords);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchData = () => {
    getviewData({
      viewName: "pa_ir_issue_registry_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: "",
    })
      .then((response) => {
        const issues = response.data.data;

        const issueCount = issues.filter((issue) => issue.issue_id).length;

        const getQuarter = (date) => {
          const month = new Date(date).getMonth();
          return Math.floor(month / 3) + 1;
        };

        const currentQuarter = getQuarter(new Date());

        const presentQuarterIssues = issues.filter((issue) => {
          const issueStartQuarter = getQuarter(issue.issue_identified_on);
          const issueEndQuarter = getQuarter(issue.issue_due_date);

          return (
            issueStartQuarter <= currentQuarter &&
            issueEndQuarter >= currentQuarter
          );
        });

        const presentQuarterCount = presentQuarterIssues.length;

        //setdata({ issueCount, presentQuarterCount });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchBUresData = () => {
    getviewData({
      viewName: "pa_br_business_impact_analysis_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: "",
    })
      .then((response) => {
        const issues = response.data.data;
        const issueCount = issues.filter((issue) => issue.object_id).length;

        const getQuarter = (date) => {
          const month = new Date(date).getMonth();
          return Math.floor(month / 3) + 1;
        };

        const currentQuarter = getQuarter(new Date());

        const presentQuarterIssues = issues.filter((issue) => {
          const issueStartQuarter = getQuarter(issue.issue_identified_on);
          const issueEndQuarter = getQuarter(issue.issue_due_date);

          return (
            issueStartQuarter <= currentQuarter &&
            issueEndQuarter >= currentQuarter
          );
        });

        const presentQuarterCount = presentQuarterIssues.length;

        // setBUresData({ issueCount, presentQuarterCount });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Only fetch data when objectId or yearStr changes
    if (objectId && yearStr) {
      fetchData();
      fetchBUresData();
      fetchHighRiskVendors();
    }
  }, [objectId, yearStr]);

  const StatsCard = ({ icon, title, totalCount, lastQuarterCount }) => (
    <Col md={4}>
      <Card className="shadow-lg p-2 mb-4 rounded position-relative">
        <Card.Body>
          <div className="position-relative">
            <div className="d-flex align-items-center">
              <div
                style={{
                  backgroundColor: "rgba(173, 216, 230, 1)",
                  color: "darkblue",
                }}
                className="position-absolute top-45 start-100 translate-middle rounded-circle opacity-75 p-3"
              >
                <FontAwesomeIcon icon={icon} size="lg" />
              </div>
              <div className="ms-1">
                <h6 className="text-muted">{title}</h6>
                <h1 className="mt-20">{totalCount}</h1>
                <div className="text-dark">
                  <span
                    className={`badge ${
                      lastQuarterCount < 0
                        ? "bg-danger bg-opacity-25 text-danger"
                        : "bg-success bg-opacity-25 text-success"
                    }`}
                  >
                    {lastQuarterCount}
                  </span>{" "}
                  {t("Last Year")}
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
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
        <Row>
          <StatsCard
            icon={faListCheck}
            title={`#${t("Test Executions")}`}  //  t("Assets"),
            totalCount={presentFinanceyearTotalcount?.test_execution[0]?.present_financeyear_totalcount ?? 0}
            lastQuarterCount={countOfPreviousFinanceYear?.test_execution[0]?.last_financeyear_totalcount ?? 0}
          />
          <StatsCard
            icon={faTriangleExclamation}
            title= {`#${t("Risk Assessments")}`}
            totalCount={presentFinanceyearTotalcount?.risk_assessment[0]?.present_financeyear_totalcount ?? 0}
            lastQuarterCount={countOfPreviousFinanceYear?.risk_assessment[0]?.last_financeyear_totalcount ?? 0}
            
          />
          <StatsCard
            icon={faSackDollar}
            title= {`#${t("Loss Events")}`}
            totalCount={presentFinanceyearTotalcount?.internal_loss_event[0]?.present_financeyear_totalcount ?? 0}
            lastQuarterCount={countOfPreviousFinanceYear?.internal_loss_event[0]?.last_financeyear_totalcount ?? 0}
            
          />
          {/* <StatsCard
            icon={faHandshake}
            title="# Product/Service"
            totalCount={countoflastquarted?.product_service[0]?.total_count}
            lastQuarterCount={
              countoflastquarted?.product_service[0]?.last_quarter_count
            }
          /> */}
        </Row>
      </div>

      <div>
        <Row>
          <Col md={4}>
            <Card className="shadow-lg p-4 rounded position-relative">
              <Card.Body>
                <div className="position-relative">
                  <div className="d-flex align-items-center">
                    <div className="m-0">
                      <h6 className="text-muted">{t("Compliance Posture")}</h6> 
                      <Row>
                        <div className="d-flex justify-content-between">
                          <div className="text-dark">{t("Total Controls")}</div> 
                          <div className="text-left">
                            <h1>
                              {
                                countofFramework?.["Compliance Postue"]?.[0]?.TotalControls
                              }
                            </h1>
                          </div>
                        </div>
                      </Row>
                      <Row>
                        <div className="d-flex justify-content-between">
                          <div className="text-dark">{t("Assessed Controls")}</div> 
                          <div className="text-left">
                            <h1>
                              {
                                countofFramework?.["Compliance Postue"]?.[0]
                                  ?.ProcessAssessedControls
                              }
                            </h1>
                          </div>
                        </div>
                      </Row>

                      <Row className="d-flex justify-content-between ">
                        <Chart
                          chart="CT_COMPLIANCE_STATUS_BY_BU"
                          defaultFilter={{ processId: objectId }}
                          customExpressionFlag
                          key={refreshCharts}
                          yearProp={yearStr}
                        />
                      </Row>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-lg p-4  rounded position-relative">
              <Card.Body>
                <div className="position-relative">
                  <div className="d-flex align-items-center">
                    <div className="m-0">
                      <h6 className="text-muted">{t("Risk Outlook")}</h6>
                      <Row>
                        <div className="d-flex justify-content-between">
                          <div className="text-dark">{t("Total Risks")}</div> 
                          <div className="text-left">
                            <h1>
                              {
                                countofFramework?.["Risk Outlook"]?.[0]
                                  ?.TotalRisks
                              }
                            </h1>
                          </div>
                        </div>
                      </Row>
                      <Row>
                        <div className="d-flex justify-content-between">
                          <div className="text-dark">{t("Assessed Risks")}</div>
                          <div className="text-left">
                            <h1>
                              {
                                countofFramework?.["Risk Outlook"]?.[0]
                                  ?.AssessedRisks
                              }
                            </h1>
                          </div>
                        </div>
                      </Row>

                      <Row className="d-flex justify-content-between ">
                        <Chart
                          chart="RA_RISK_RATING_BU_ID"
                          defaultFilter={{ processId: objectId }}
                          customExpressionFlag
                          key={refreshCharts}
                          yearProp={yearStr}
                        />
                      </Row>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-lg p-4  rounded position-relative">
              <Card.Body>
                <div className="position-relative">
                  <div className="d-flex align-items-center">
                    <div className="m-0">
                      <h6 className="text-muted">{t("Business Resilience")}</h6> 
                      <Row>
                        <div className="d-flex justify-content-between">
                          <div className="text-dark">{t("BIA")}</div> 
                          <div className="text-left">
                            <h1>
                            {
                               countofFramework?.["Business Resilience"]?.[0]
                               ?.BIA
                              }
                            </h1>
                          </div>
                        </div>
                      </Row>
                      <Row>
                        <div className="d-flex justify-content-between">
                          <div className="text-dark">{t("BCP")}</div>
                          <div className="text-left">
                            <h1>
                              {
                               countofFramework?.["Business Resilience"]?.[0]
                               ?.BCP
                              }
                            </h1>
                          </div>
                        </div>
                      </Row>
                      

                      <Row className="d-flex justify-content-between ">
                        <Chart
                          chart="BR_BIA_BUSINESS_CRITICALITY_CHART"
                          defaultFilter={{ processId: objectId }}
                          customExpressionFlag
                          key={refreshCharts}
                          yearProp={yearStr}
                        />
                      </Row>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default OverView;
