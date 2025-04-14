import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
import ReportRuntime from "src/components/reports/Report";

const ChildReportLink = ({ value, row, columnMeta, reportmetaValue }) => {
  const [reportInfo, setReportInfo] = useState({
    reportName: null,
    filterExpression: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);

  const handleOpenModal = (row, columnMeta) => {
    const reportChilds = reportmetaValue[0]?.reportChilds || [];

    const idColumnNames = columnMeta?.id_column_name.split(",");

    const idValues = idColumnNames.reduce((acc, columnName) => {
      acc[columnName?.trim()] = row?.original[columnName.trim()];
      return acc;
    }, {});

    const replacePlaceholders = (filterExpression, idValues) => {
      return Object.entries(idValues).reduce((expression, [key, value]) => {
        const placeholder = `:${key}`;
        return expression.replace(new RegExp(placeholder, "g"), value);
      }, filterExpression);
    };
    const matchedColumns = reportChilds
      .map((child) => {
        const mappedColumnsCheck = child?.mapped_column
          .split(",")
          .map((col) => col.trim());
        if (mappedColumnsCheck.includes(columnMeta?.column_name)) {
          const filterExpression = replacePlaceholders(
            child.filter_expression,
            idValues
          );

          return {
            reportName: child?.report_name,
            filterExpression: filterExpression,
          };
        }
        return undefined;
      })
      .filter((match) => match !== undefined);

    if (matchedColumns.length > 0) {
      setReportInfo(matchedColumns[0]);
    } else {
      setReportInfo(null);
    }

    setShowModal(true);
    setFullscreen(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFullscreen(false);
  };

  const handleFullscreen = () => setFullscreen(!fullscreen);

  return (
    <div className="d-flex flex-grow-1">
      <a
        onClick={() => handleOpenModal(row, columnMeta)}
        className="me-2"
        style={{ cursor: "pointer" }}
      >
        {value}
      </a>

      <Modal
        show={showModal}
        fullscreen={fullscreen}
        onHide={handleClose}
        size="lg"
        className="modalviewport"
      >
        <Modal.Header className="d-flex justify-content-between align-items-center">
          {/* <Modal.Title>Modal Title</Modal.Title> */}
          <Button
            variant="link"
            onClick={handleFullscreen}
            className="p-0 border-0"
          >
            <FontAwesomeIcon
              icon={fullscreen ? faCompress : faExpand}
              className="text-dark"
            />
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Header>
        <Modal.Body size="lg">
          <ReportRuntime
            report={reportInfo?.reportName}
            ChartdrilldownReports={reportInfo?.filterExpression}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ChildReportLink;
