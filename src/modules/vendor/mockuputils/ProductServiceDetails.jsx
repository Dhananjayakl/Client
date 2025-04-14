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
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Legend,
  Tooltip
);

const ProductServiceDetails = ({
  businessCriticalityData,
  expiredProductData,
  rejectedVendorDetails,
}) => {
  console.log("Received businessCriticalityData:", businessCriticalityData);
  const validData = Array.isArray(businessCriticalityData?.output)
    ? businessCriticalityData.output
    : [];
  let processedData = validData.map((item) => {
    let transformed = {
      unit: item.d_purchasing_business_unit || "-",
      veryHigh: "-",
      high: "-",
      medium: "-",
      low: "-",
      veryLow: "-",
    };

    item.criticality?.forEach(({ count, d_criticality }) => {
      const value = count !== undefined ? count : "-";
      switch (d_criticality) {
        case "Very High":
          transformed.veryHigh = value;
          break;
        case "High":
          transformed.high = value;
          break;
        case "Medium":
          transformed.medium = value;
          break;
        case "Low":
          transformed.low = value;
          break;
        case "Very Low":
          transformed.veryLow = value;
          break;
        default:
          break;
      }
    });

    return transformed;
  });

  console.log(processedData, "processedDataprocessedData");

  while (processedData.length < 5) {
    processedData.push({
      unit: "-",
      veryHigh: "-",
      high: "-",
      medium: "-",
      low: "-",
      veryLow: "-",
    });
  }

  const criticalityMap = {
    "Very High": 0,
    High: 0,
    Medium: 0,
    Low: 0,
    "Very Low": 0,
  };

  rejectedVendorDetails?.forEach(({ d_criticality, Total_Rejected }) => {
    if (criticalityMap.hasOwnProperty(d_criticality)) {
      criticalityMap[d_criticality] = Total_Rejected;
    }
  });
  const totalRejected = Object.values(criticalityMap).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <>
      <Row className="p-0 m-0">
        <Col md={6}>
          <Card
            className="reportChart-cards"
            style={{ backgroundColor: "#f7fafa", marginLeft: "-5px" }}
          >
            <table style={{ borderRadius: "6px", overflow: "hidden" }}>
              <thead>
                <tr className="justify-content-between text-center">
                  <th className="border text-dark">Business Unit(s)</th>
                  <th className="border text-dark">Very High</th>
                  <th className="border text-dark">High</th>
                  <th className="border text-dark">Medium</th>
                  <th className="border text-dark">Low</th>
                  <th className="border text-dark">Very Low</th>
                </tr>
              </thead>
              <tbody>
                {processedData.length > 0 ? (
                  processedData.map((row, index) => (
                    <tr
                      key={index}
                      className="justify-content-between text-center"
                    >
                      <td className="border">{row.unit}</td>
                      <td className="border">{row.veryHigh}</td>
                      <td className="border">{row.high}</td>
                      <td className="border">{row.medium}</td>
                      <td className="border">{row.low}</td>
                      <td className="border">{row.veryLow}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border text-center" colSpan="6">
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="reportChart-cards p-4"
            style={{ backgroundColor: "#f7f7f7" }}
          >
            <div className="d-flex flex-column">
              <h6 className="fw-bold justify-content-between text-center">
                Expiring Product/Service
              </h6>
              <div className="d-flex justify-content-between">
                <h2
                  className="fw-bold align-self-center"
                  style={{ fontSize: "40px", marginLeft: "40px" }}
                >
                  {expiredProductData?.[0]?.Total_Experied || 0}
                </h2>
                <div>
                  <p className="mb-1">
                    <span className="text-dark">&lt; 30</span>:{" "}
                    {expiredProductData?.[0]?.Expired_Less_30_Days || 0}
                  </p>
                  <p className="mb-1">
                    <span className="text-dark">&gt; 30-&lt; 60</span>:{" "}
                    {expiredProductData?.[0]?.Expired_30_to_60_Days || 0}
                  </p>
                  <p className="mb-1">
                    <span className="text-dark">&gt; 60</span>:{" "}
                    {expiredProductData?.[0]?.Expired_Greater_60_Days || 0}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="reportChart-cards p-4"
            style={{ backgroundColor: "#f7f7f7", marginRight: "-5px" }}
          >
            <div className="d-flex flex-column">
              <h6 className="fw-bold">
                Rejected <br /> Product/Service
              </h6>
              <div className="d-flex justify-content-between">
                <h2
                  className="fw-bold align-self-center"
                  style={{ fontSize: "40px", marginLeft: "20px" }}
                >
                  {totalRejected}
                </h2>
                <div style={{ marginTop: "-55px", marginRight: "20px" }}>
                  <p className="mb-1">
                    <span className="text-dark">VH</span>:{" "}
                    {criticalityMap["Very High"]}
                  </p>
                  <p className="mb-1">
                    <span className="text-dark">H</span>:{" "}
                    {criticalityMap["High"]}
                  </p>
                  <p className="mb-1">
                    <span className="text-dark">M</span>:{" "}
                    {criticalityMap["Medium"]}
                  </p>
                  <p className="mb-1">
                    <span className="text-dark">L</span>:{" "}
                    {criticalityMap["Low"]}
                  </p>
                  <p className="mb-1">
                    <span className="text-dark">VL</span>:{" "}
                    {criticalityMap["Very Low"]}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductServiceDetails;
