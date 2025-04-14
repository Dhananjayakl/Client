import React from "react";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Card,
  Collapse,
} from "react-bootstrap";
import Chart from "src/components/charts/Chart";

const OnboardingVendorDetails = ({ onboardingData }) => {
  return (
    <>
      <Row>
        <Col md={5}>
          <Card
            className="reportChart-cards"
            style={{
              backgroundColor: "#f5f7f6",
              borderRadius: "12px",
              height: "200px",
              padding: "15px",
              marginLeft: "5px",
            }}
          >
            <Card.Body className="d-flex align-items-center justify-content-between h-100">
              <div className="text-center flex-grow-1">
                <h6 className="fw-bold">
                  Inherent Risk <br /> Assessment
                </h6>
                <h2 className="fw-bold" style={{ fontSize: "40px" }}>
                  {
                    onboardingData?.inherentRiskAssessmentCountQueryResult
                      ?.total_count
                  }
                </h2>
                <div className="d-flex justify-content-center gap-3 mt-2">
                  <span className="fw-bold text-dark">
                    H:
                    <span className="text-muted">
                      {
                        onboardingData?.inherentRiskAssessmentCountQueryResult
                          ?.high_count
                      }
                    </span>
                  </span>
                  <span className="fw-bold text-dark">
                    M:
                    <span className="text-muted">
                      {
                        onboardingData?.inherentRiskAssessmentCountQueryResult
                          ?.medium_count
                      }
                    </span>
                  </span>
                  <span className="fw-bold text-dark">
                    L:
                    <span className="text-muted">
                      {
                        onboardingData?.inherentRiskAssessmentCountQueryResult
                          ?.low_count
                      }
                    </span>
                  </span>
                </div>
              </div>

              <div
                className="border-start"
                style={{ height: "80%", width: "1px", backgroundColor: "#000" }}
              ></div>

              <div className="text-center flex-grow-1">
                <h6 className="fw-bold">Due Diligence</h6>
                <h2 className="fw-bold" style={{ fontSize: "40px" }}>
                  93
                </h2>
                <span className="fw-bold text-dark">
                  Completed: <span className="text-muted">57</span>
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            className="reportChart-cards"
            style={{
              backgroundColor: "#f7fafa",
              height: "194px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{ flexGrow: 1, overflowY: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderRadius: "6px",
                  tableLayout: "auto",
                }}
              >
                <thead>
                  <tr style={{ fontSize: "15px" }}>
                    <th className="border text-dark justify-content-between text-center">
                      Category
                    </th>
                    <th
                      className="border text-dark justify-content-between text-center"
                      style={{ textAlign: "right" }}
                    >
                      Vendors
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {onboardingData?.getVendorCountByCategory?.map(
                    (row, index) => (
                      <tr
                        style={{ fontSize: "15px" }}
                        key={index}
                        className="justify-content-between text-center"
                      >
                        <td className="border">{row.d_category}</td>
                        <td className="border">{row.vendor_count}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Chart chart="SM_DUE_DILIGENCE_RATING" />
        </Col>
      </Row>
    </>
  );
};

export default OnboardingVendorDetails;
