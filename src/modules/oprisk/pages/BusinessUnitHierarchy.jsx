import React, { useState, useMemo } from "react";
import { Row, Col, Container, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinusCircle,
  faPlusCircle,
  faBuilding,
  faUniversity,
  faLayerGroup,
  faToolbox,
  faDesktop,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const BusinessUnitHierarchy = ({ applicableBData }) => {
  const [expandedNodes, setExpandedNodes] = useState({});
  const navigate = useNavigate();

  const handleClick = (unitId) => {
    navigate(`/page?name=GL_BU_SUMMARY&objectId=${unitId}`);
  };

  const toggleNode = (id) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const hierarchicalData = useMemo(() => {
    const map = new Map();
    const roots = [];

    applicableBData.forEach((unit) => {
      map.set(unit.businessUnitId, { ...unit, children: [] });
    });

    applicableBData.forEach((unit) => {
      if (unit.parentBuId && map.has(unit.parentBuId)) {
        map.get(unit.parentBuId).children.push(map.get(unit.businessUnitId));
      } else {
        roots.push(map.get(unit.businessUnitId));
      }
    });

    return roots;
  }, [applicableBData]);

  const riskLevels = {
    "Very High": "#ff4545",
    High: "#ffa534",
    Medium: "#ffe234",
    Low: "#b7dd29",
    "Very Low": "#57e32c",
    Complied: "#8ac926",
    "Partially Complied": "#ffca3a",
    "Not Complied": "#ff595e",
  };

  const levelIcons = [
    faUniversity,
    faBuilding,
    faToolbox,
    faDesktop,
    faLayerGroup,
  ];

  const renderHierarchy = (units, level = 1) => (
    <ul className="tree list-unstyled ps-3">
      {units.map((unit) => (
        <li key={unit.businessUnitId} className="mb-3">
          <Card
            className="tree-node shadow-sm rounded p-3 bg-light w-100"
            style={{ border: "1px solid #dcdcdc" }}
          >
            <div
              className="node-header d-flex align-items-center"
              style={{ marginBottom: "12px" }}
            >
              {unit.children.length > 0 && (
                <span
                  className="toggle-btn me-2"
                  onClick={() => toggleNode(unit.businessUnitId)}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon
                    icon={
                      expandedNodes[unit.businessUnitId]
                        ? faMinusCircle
                        : faPlusCircle
                    }
                    className={
                      expandedNodes[unit.businessUnitId]
                        ? "text-success"
                        : "text-danger"
                    }
                    size="lg"
                    style={{ fontSize: "1.1rem" }}
                  />
                </span>
              )}
              <FontAwesomeIcon
                icon={levelIcons[level - 1] || faBuilding}
                className="me-2 text-primary"
                size="lg"
                style={{ fontSize: "1.1rem" }}
              />
              <span
                className="node-name fw-bold text-dark"
                style={{ cursor: "pointer" }}
                onClick={() => handleClick(unit.businessUnitId)}
              >
                Level {level}: {unit.businessUnitName}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  marginLeft: "80px",
                  fontWeight: "normal",
                }}
              >
                {/* <strong>Overall Rating:</strong> */}
                <span
                  style={{
                    backgroundColor: riskLevels[unit.AvgValue] || "#6c757d",
                    marginLeft: "8px",
                    color: "#000000",
                    padding: "1px 10px",
                    borderRadius: "18px",
                    display: "inline-block",
                    fontSize: "10px",
                    cursor: "default",
                  }}
                >
                  {unit.AvgValue}
                </span>
              </span>
            </div>

            <div className="node-details mt-2">
              <Row
                className="g-2 flex-nowrap align-items-center"
                style={{ display: "flex", flexWrap: "nowrap" }}
              >
                {[
                  { key: "RiskManagement", label: "Risk" },
                  { key: "LossManagement", label: "Loss" },
                  { key: "IssueManagement", label: "Issue" },
                  { key: "Controltesting", label: "Control" },
                ].map(({ key, label }, index) => {
                  const status = unit[key]?.status || "N/A";
                  const color = riskLevels[status] || "#6c757d";

                  return (
                    <Col
                      key={index}
                      style={{
                        flexGrow: 1,
                        marginLeft: "18px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <strong>{label}:</strong>{" "}
                      <span
                        style={{
                          backgroundColor: color,
                          marginLeft: "8px",
                          color: "#000000",
                          padding: "1px 10px",
                          borderRadius: "18px",
                          display: "inline-block",
                          fontSize: "10px",
                          cursor: "default",
                        }}
                      >
                        {status}
                      </span>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Card>

          {expandedNodes[unit.businessUnitId] && unit.children.length > 0 && (
            <div className="tree-children ps-4">
              {renderHierarchy(unit.children, level + 1)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <Container fluid className="p-3">
      <Row className="justify-content-start" style={{ width: "940px" }}>
        {renderHierarchy(hierarchicalData)}
      </Row>
    </Container>
  );
};

export default BusinessUnitHierarchy;
