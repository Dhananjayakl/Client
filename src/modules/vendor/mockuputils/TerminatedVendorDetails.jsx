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
import { Bar, Doughnut } from "react-chartjs-2";
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

const BarChart = () => {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: [35, 85, 60, 2, 25, 25, 65, 30, 98, 35, 5, 40],
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        barPercentage: 0.5,
        categoryPercentage: 0.6,
      },
      y: {
        ticks: {
          beginAtZero: true,
          stepSize: 25,
          suggestedMax: 100,
          callback: (value) =>
            [0, 25, 50, 75, 100].includes(value) ? value : "",
        },
      },
    },
  };

  return (
    <div style={{ height: "160px", padding: "3px", borderRadius: "10px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

const TerminatedVendorDetails = ({ cardData }) => {
  const vendorData = [
    {
      category: "Contractor",
      vendor: 34,
    },
    {
      category: "Distributor",
      vendor: 34,
    },
    {
      category: "Partner",
      vendor: 34,
    },
    {
      category: "Service Provider",
      vendor: 34,
    },
    {
      category: "Vendor",
      vendor: 34,
    },
  ];
  return (
    <>
      <Row>
        <Col md={3}>
          <Card
            className="reportChart-cards"
            style={{
              backgroundColor: "#f5f7f6",
              borderRadius: "12px",
              height: "170px",
              padding: "15px",
              marginLeft: "5px",
            }}
          >
            <Card.Body className="d-flex flex-column justify-content-between h-100">
              <div className="flex-fill">
                <h4 className="fw-bold justify-content-between text-center mt-4">
                  Terminated
                </h4>
                <h2
                  className="fw-bold justify-content-between text-center mt-3"
                  style={{ fontSize: "40px" }}
                >
                  {cardData?.["Total Vendors / Third-Parties"]?.["Terminated"]}
                </h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            className="reportChart-cards"
            style={{ backgroundColor: "#f7fafa" }}
          >
            <table style={{ borderRadius: "6px", overflow: "hidden" }}>
              <thead>
                <tr
                  className="justify-content-between text-center"
                  style={{ fontSize: "15px" }}
                >
                  <th className="border text-dark">Business Units</th>
                  <th className="border text-dark">Very low</th>
                </tr>
              </thead>
              <tbody>
                {vendorData.map((row, index) => (
                  <tr
                    className="justify-content-between text-center"
                    style={{ fontSize: "16px" }}
                    key={index}
                  >
                    <td className="border">{row.category}</td>
                    <td className="border">{row.vendor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </Col>
        <Col md={6}>
          {/* <BarChart /> */}
          <Chart chart="VM_TERMINATED_VENDORS_BY_MONTH" />
        </Col>
      </Row>
    </>
  );
};

export default TerminatedVendorDetails;
