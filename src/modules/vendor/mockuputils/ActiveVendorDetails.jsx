import React from "react";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Card,
  Collapse,
  Modal,
  Button,
} from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
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
const StackedBarChart = () => {
  const data = {
    labels: [
      "Central Operations",
      "IT Department",
      "Finance",
      "Martketing",
      "Human Resources",
    ],
    datasets: [
      { label: "Low", data: [15, 10, 30, 25, 20], backgroundColor: "#4caf50" },
      {
        label: "Medium",
        data: [20, 25, 40, 35, 30],
        backgroundColor: "#ffc107",
      },
      { label: "High", data: [10, 15, 20, 30, 25], backgroundColor: "#f44336" },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false, // Allow resizing
    plugins: {
      // legend: { position: "top", labels: { boxWidth: 10, font: { size: 12 } } },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        title: {
          display: false,
          text: "Number of Issues",
          font: { size: 10, weight: "bold" },
        },
      },
      y: { stacked: true, grid: { display: false } },
    },
  };

  return (
    <div style={{ height: "98%", width: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

const ActiveVendorDetails = ({ activeVendorDetails }) => {
  console.log(activeVendorDetails, "vendordetailssssssssssssssssss");
  const [showModal, setShowModal] = useState(false);

  const totalDuediligenceCount =
    activeVendorDetails?.dueDiligencecountBystatus?.approved_count +
    activeVendorDetails?.dueDiligencecountBystatus?.not_approved_count;
  return (
    <>
      <Row>
        <Col md={3}>
          <Card
            className="reportChart-cards p-4 d-flex align-items-center"
            style={{ backgroundColor: "#f7f7f7", marginLeft: "5px" }}
          >
            <div className="d-flex w-100 text-center">
              <div className="w-50">
                <h6 className="fw-bold">
                  Single Point <br /> Failure
                </h6>
                <h2
                  className="fw-bold"
                  style={{ fontSize: "40px", cursor: "pointer" }}
                  onClick={() => setShowModal(true)}
                >
                  {activeVendorDetails?.SinglePointFailuredetails.length}
                </h2>

                {/* Popup Modal */}
                <Modal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  size="lg"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Single Point Failure Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Card className="p-3">
                      <table className="w-100 border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border p-2">Vendor</th>
                            <th className="border p-2">Business Unit</th>
                            <th className="border p-2">Estimated Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeVendorDetails?.SinglePointFailuredetails.map(
                            (item, index) => (
                              <tr key={index} className="text-center">
                                <td className="border p-2">
                                  {item.d_selected_vendor}
                                </td>
                                <td className="border p-2">
                                  {item.d_purchasing_business_unit}
                                </td>
                                <td className="border p-2">
                                  {item.total_estimated_cost.toLocaleString()}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </Card>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
              <div className="border-start mx-3"></div>

              <div className="w-50">
                <h6 className="fw-bold">Critical Vendors</h6>
                <h2 className="fw-bold mt-3" style={{ fontSize: "40px" }}>
                  {activeVendorDetails?.CriticalCount?.critical_vendor_count}
                </h2>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="reportChart-cards" style={{ height: "160px" }}>
            <Card.Body className="d-flex flex-column">
              <h4 className="text-center ">Vendor Rating By Business Unit</h4>
              <div className="flex-grow-1">
                <StackedBarChart />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            className="reportChart-cards"
            style={{
              backgroundColor: "#f5f7f6",
              borderRadius: "12px",
              height: "160px",
              padding: "15px",
              marginRight: "7px",
            }}
          >
            <Card.Body className="d-flex flex-column justify-content-between h-100">
              <div className="flex-fill">
                <h6 className="fw-bold justify-content-between text-center mt-2">
                  Total Due Diligence{" "}
                </h6>
                <h2
                  className="fw-bold justify-content-between text-center"
                  style={{ fontSize: "40px" }}
                >
                  {totalDuediligenceCount}
                </h2>
              </div>
              <div className="d-flex justify-content-center gap-3 mt-2">
                <span className="fw-bold text-dark">
                  Completed:
                  <span className="text-muted">
                    {
                      activeVendorDetails?.dueDiligencecountBystatus
                        ?.approved_count
                    }
                  </span>
                </span>
                <span className="fw-bold text-dark">
                  Pending:{" "}
                  <span className="text-muted">
                    {
                      activeVendorDetails?.dueDiligencecountBystatus
                        ?.not_approved_count
                    }
                  </span>
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ActiveVendorDetails;
