import React, { useState } from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";

const ReportModal = ({
  showModal,
  handleClose,
  report,
  objectId,
  yearProp,
  refreshReports,
}) => {
//  // Get the current system year
//  const currentYear = new Date().getFullYear();

//  // Adjust the yearProp if it doesn't match the current year
//  yearProp = (parseInt(yearProp) === currentYear) ? yearProp : (parseInt(yearProp) + 1).toString();
 
  return (
    <Modal show={showModal} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ReportRuntime
          report={report}
          drilldownReports={{ objectId, yearProp }}
          yearProp={yearProp}
          refreshReports={refreshReports}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const DataCardsForIssue = ({ items, yearStr, objectId }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShow = (reportName) => {
    setSelectedReport(reportName);
    setShowModal(true);
  };

  return (
    <>
      <Row className="g-3">
        {items.map((item, index) => {
          const colSize = item.length;

          return (
            <Col
              key={index}
              md={colSize}
              className={`d-flex flex-column align-items-center  ${
                index !== items.length - 1 ? "border-end" : ""
              }`}
            >
              <h5 className="text-secondary text-center">{item.label}</h5>
              <div className="h3">
                <span
                  onClick={() => {
                    handleShow(item.objectName);
                  }}
                  className="text-primary cursor-pointer"
                >
                  {item.value}
                </span>
              </div>
            </Col>
          );
        })}
      </Row>

      {selectedReport && (
        <ReportModal
          showModal={showModal}
          handleClose={handleClose}
          report={selectedReport}
          objectId={objectId}
          yearProp={yearStr}
          refreshReports={true}
        />
      )}
    </>
  );
};

export default DataCardsForIssue;
