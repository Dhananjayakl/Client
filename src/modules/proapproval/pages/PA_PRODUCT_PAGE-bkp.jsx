import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProductChart = () => {
  const data = {
    labels: [
      "Digital Gold Loan",
      "MSME Working Capital",
      "Vehicle Financing",
      "BNPL (Buy Now Pay Later)",
      "Gold Loan",
      "Personal Loan",
      "Invoice Discounting",
      "Credit Line for Startups",
      "Housing Loan",
    ],
    datasets: [
      {
        label: "Compliance Score",
        data: [85, 90, 80, 60, 92, 70, 88, 75, 95],
        backgroundColor: "#007bff", // Updated Blue (closer to donut)
      },
      {
        label: "Risk Score",
        data: [75, 65, 85, 45, 88, 60, 82, 55, 90],
        backgroundColor: "#ff9900", // Orange (matches donut)
      },
      {
        label: "Legal Score",
        data: [80, 70, 75, 55, 85, 65, 80, 65, 88],
        backgroundColor: "#008066", // Teal (matches donut "Rejected")
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "Product vs Score",
        font: { size: 16, weight: "bold" },
      },
      tooltip: {
        backgroundColor: "rgba(1, 5, 7, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
      datalabels: {
        color: "#FFFFFF",
        anchor: "center",
        align: "center",
        font: { size: 10 },
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 12 },
          autoSkip: false,
          maxRotation: 35,
          minRotation: 35,
        },
        grid: { display: false },
        barPercentage: 0.5, // Adjusted for better appearance
        categoryPercentage: 0.7,
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div style={{ height: "410px", width: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

const Default = () => {
  let forms = [
    {
      title: "Initiate New Product Approval",
      form: "productapproval",
      privilege: "PA_PRODUCT_APPROVAL",
    },
  ];
  let privs = util.getCurrentUser().privileges?.split(",");

  let reports = [
    {
      title: "Product Approval Status",
      report: "PA_PRODUCT_STATUS",
      privilege: "PA_PRODUCT_APPROVAL",
    },
  ];
  let chart = [
    {
      // title: "Risks By Category",
      // chart: "GL_RISK_CATEGORY",
      // privilege: "RA_CREATE_RISK_ASSESSMENT",
    },
  ];

  const combinedItems = [
    ...forms.map((item) => ({ ...item, type: "form" })),
    ...reports.map((item) => ({ ...item, type: "report" })),
    ...chart.map((item) => ({ ...item, type: "chart" })),
  ];
  return (
    <>
      <Container fluid className="p-0 ">
        <LandingPagesTitle
          title={"Product Approval Overview"}
          // configrationForm={"riskconfig"}
          // privileges={"GL_CREATE_GRC"}
        />
        <div>
          <Row className="p-0 m-0">
            <FormReportChartLink combinedItems={combinedItems} />
          </Row>
        </div>
        <Row>
          <ReportRuntime report="PA_PRODUCT_STATUS" dataCard />
        </Row>
        <Row>
          <Col md={4}>
            <Chart chart="PA_PA_PRODUCT_REVIEW_STATUS" />
          </Col>
          <Col md={8}>
            <div className="reportChart-cards card">
              <ProductChart />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {" "}
            <Chart chart="PA_PRODUCT_TRENDS" />
          </Col>
          {/* <Col md={4}>
            <ReportRuntime report="PA_PRODUCT_STATUS_TABLE" pivotTable />
          </Col> */}
        </Row>
      </Container>
    </>
  );
};

export default Default;
