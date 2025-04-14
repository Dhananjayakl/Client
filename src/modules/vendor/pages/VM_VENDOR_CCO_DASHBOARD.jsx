import React from "react";
import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import { Row, Col, Card, Button, Modal } from "react-bootstrap";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  faClipboardCheck,
  faBriefcase,
  faBookBookmark,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getviewData } from "../VendorFormservice";

const Default = () => {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  const [VendorsCount, setVendorsCount] = useState(false);
  const [vendorsDataCount, setVendorsDataClount] = useState(false);
  const [vendorsRatingCount, setVendorsRatingCount] = useState(false);
  const [countInherentRisks, setTotalInherentRisks] = useState(false);

  const vendorsDataCard = () => {
    getviewData({
      viewName: "pa_gl_thirdparty_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `status='Active'`,
    })
      .then((response) => {
        const vendorsData = response.data.data;
        const objectIdCount = vendorsData.reduce((count, vendor) => {
          return vendor.object_id ? count + 1 : count;
        }, 0);
        setVendorsCount(objectIdCount);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const totalInherentRisks = () => {
    getviewData({
      viewName: "pa_sm_respondent_form_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: ``,
    })
      .then((response) => {
        const vendorsData = response.data.data;

        const inherentCount = vendorsData.reduce((count, vendor) => {
          return vendor.object_id && vendor.category === 2 ? count + 1 : count;
        }, 0);

        setTotalInherentRisks(inherentCount);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const vendorsData = () => {
    getviewData({
      viewName: "pa_vm_product_service_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: ``,
    })
      .then((response) => {
        const vendorsData = response.data.data;
        const objectIdCount = vendorsData.reduce((count, vendor) => {
          return vendor.object_id ? count + 1 : count;
        }, 0);
        const onBoardedCount = vendorsData.reduce((count, vendor) => {
          return vendor.status === "Closed" ? count + 1 : count;
        }, 0);
        const onProgressCount = vendorsData.reduce((count, vendor) => {
          return vendor.status !== "Closed" && vendor.status !== "Rejected"
            ? count + 1
            : count;
        }, 0);
        const offBoardedCount = vendorsData.reduce((count, vendor) => {
          return vendor.status === "Rejected" ? count + 1 : count;
        }, 0);
        setVendorsDataClount({
          objectIdCount,
          onBoardedCount,
          offBoardedCount,
          onProgressCount,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const HighRiskVendors = () => {
    getviewData({
      viewName: "pa_vm_vendor_register_v",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: ``,
    })
      .then((response) => {
        const vendorsData = response.data.data;

        const RatingHighCount = vendorsData.reduce((count, vendor) => {
          return vendor.d_rating === "High" ? count + 1 : count;
        }, 0);

        const RatingModerateCount = vendorsData.reduce((count, vendor) => {
          return vendor.d_rating === "Medium" ? count + 1 : count;
        }, 0);

        const RatingLowCount = vendorsData.reduce((count, vendor) => {
          return vendor.d_rating === "Low" ? count + 1 : count;
        }, 0);

        setVendorsRatingCount({
          RatingHighCount,
          RatingModerateCount,
          RatingLowCount,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    vendorsDataCard();
    vendorsData();
    HighRiskVendors();
    totalInherentRisks();
  }, []);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleShow = (reportName) => {
    setSelectedReport(reportName);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const data = [
    {
      value: vendorsDataCount?.objectIdCount,
      label: "Total Product/Service",
      color: "#57e32c",
    },
    {
      value: vendorsDataCount?.onProgressCount,
      label: "Ongoing Product/Service",
      color: "#ffca3a",
    },
    {
      value: countInherentRisks,
      label: "Total Risk Assessments",
      color: "#007bff",
    },
    {
      value: vendorsDataCount?.onBoardedCount,
      label: "Onboarded Vendors",
      color: "#8ac926",
    },
    {
      value: vendorsDataCount?.offBoardedCount,
      label: "Rejected Vendors",
      color: "#ff595e",
    },
  ];
  return (
    <>
      <div>
        <Row className="mb-4">
          <Col md={3}>
            <div
              className="p-3"
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                height: "90px",
                width: "210px",
                position: "relative",
                marginLeft: "10px",
              }}
            >
              <div
                className="d-flex  align-items-center mb-2"
                style={{ position: "relative" }}
              >
                <h5
                  className="fw-bold text-dark mb-0"
                  style={{ marginRight: "30px" }}
                >
                  # Total Vendors
                </h5>
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "150px",
                  }}
                  className="translate-middle bg-info text-dark border-0 rounded-circle p-2 opacity-75 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faBookBookmark} />
                </div>
              </div>

              <div className="d-flex justify-content-center align-items-center mb-4">
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    backgroundColor: "rgba(173, 216, 230, 1)",
                    color: "darkblue",
                    width: "70px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleShow("SM_INHERENT_RISK_ASSESSMENTS")}
                >
                  {" "}
                  {VendorsCount || 0}
                </div>
              </div>
            </div>
          </Col>
          <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Report Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedReport && (
                <ReportRuntime
                  report={selectedReport}
                  drilldownReports={{ objectId }}
                />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Col md={3}>
            <div
              className="p-3"
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                height: "90px",
                width: "220px",
                position: "relative",
              }}
            >
              <div className="d-flex  align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0"># High Risk Vendors</h5>
                <div
                  style={{
                    top: "25px",
                    left: "180px",
                  }}
                  className="position-absolute translate-middle bg-info text-dark border-0 rounded-circle p-2 opacity-75 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faSquare} />
                </div>
              </div>

              <div className="d-flex justify-content-center align-items-center mb-4">
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    backgroundColor: "rgba(173, 216, 230, 1)",
                    color: "darkblue",
                    width: "70px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleShow("SM_INHERENT_RISK_ASSESSMENTS")}
                >
                  {" "}
                  {vendorsRatingCount?.RatingHighCount || 0}
                </div>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div
              className="p-3"
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                height: "90px",
                width: "210px",
                position: "relative",
              }}
            >
              <div
                className="d-flex  align-items-center mb-2"
                style={{ position: "relative" }}
              >
                <h5
                  className="fw-bold text-dark mb-0"
                  style={{ marginRight: "30px" }}
                >
                  # Moderate Risk Vendors
                </h5>
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "150px",
                  }}
                  className="translate-middle bg-info text-dark border-0 rounded-circle p-2 opacity-75 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faBriefcase} />
                </div>
              </div>

              <div className="d-flex justify-content-center align-items-center mb-6">
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    backgroundColor: "rgba(173, 216, 230, 1)",
                    color: "darkblue",
                    width: "70px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleShow("GL_ACTIVE_THIRD_PARTY")}
                >
                  {" "}
                  {vendorsRatingCount?.RatingModerateCount || 0}
                </div>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div
              className="p-3"
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                height: "90px",
                width: "230px",
                position: "relative",
              }}
            >
              <div
                className="d-flex  align-items-center mb-3"
                style={{ position: "relative" }}
              >
                <h5
                  className="fw-bold text-dark mb-0"
                  style={{ marginRight: "30px" }}
                >
                  # Low Risk Vendors
                </h5>
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "170px",
                  }}
                  className="translate-middle bg-info text-dark border-0 rounded-circle p-2 opacity-75 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faClipboardCheck} />
                </div>
              </div>

              <div className="d-flex justify-content-center align-items-center mb-6">
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    backgroundColor: "rgba(173, 216, 230, 1)",
                    color: "darkblue",
                    width: "70px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleShow("GL_ACTIVE_THIRD_PARTY")}
                >
                  {" "}
                  {vendorsRatingCount?.RatingLowCount || 0}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mb-4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "20px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              height: "200px",
              width: "980px",
              marginLeft: "20px",
            }}
          >
            {data.map((item, index) => (
              <div key={index} style={{ width: "100px", textAlign: "center" }}>
                <CircularProgressbar
                  value={item.value}
                  maxValue={500}
                  text={`${item.value}`}
                  styles={buildStyles({
                    textColor: "#000",
                    pathColor: item.color,
                    trailColor: "#d6d6d6",
                    textColor: "#f88",
                  })}
                />
                <p style={{ marginTop: "10px", fontSize: "14px" }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </Row>

        <Row>
          <ReportRuntime report="SM_ASSESSMENTS_BY_VENDOR" dataCard />
        </Row>
        <Row>
          <ReportRuntime report="VM_COUNT_OF_SERVICES_OF_VENDORS" pivotTable />
        </Row>
        <Row>
          <Col>
            <Chart
              chart="VM_PRODUCT_SERVICE_BY_CATEGORY"
              defaultFilter={{ processId: objectId }}
            />
          </Col>
          <Col>
            <Chart
              chart="VM_PRODUCT_SERVICE_BY_CRITICALITY"
              defaultFilter={{ processId: objectId }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Chart
              chart="VM_PRUCHASING_BUSINESS_UNIT"
              defaultFilter={{ processId: objectId }}
            />
          </Col>
          <Col>
            <Chart
              chart="VM_TERMINATED_VENDORS"
              defaultFilter={{ processId: objectId }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Chart
              chart="VM_COUNT_OF_PRODUCTS_PER_MONTH"
              defaultFilter={{ processId: objectId }}
            />
          </Col>
        </Row>
        <Row>
          <ReportRuntime report="VM_SINGLE_SOURCE_PRODUCTS" />
        </Row>
        <Row>
          <ReportRuntime report="VM_MULTI_SOURCE_PRODUCTS" />
        </Row>
      </div>
    </>
  );
};

export default Default;
