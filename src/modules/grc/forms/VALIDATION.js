import React, { useState, useEffect, useMemo } from "react";
import { Button, Card, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const SvgCircleWithDots = () => {
  const [policyDocuments, setPolicyDocuments] = useState([]);
  const fetchPolicyData = () => {
    getviewData({
      viewName: "PA_SD_DOCUMENTS",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: "",
    })
      .then((response) => {
        setPolicyDocuments(response?.data?.data || []);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchPolicyData();
  }, []);
  console.log("bvbnbnbn", policyDocuments);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleDots, setVisibleDots] = useState(0);
  const [lastHoveredObject, setLastHoveredObject] = useState(null);

  const [currentDataSet, setCurrentDataSet] = useState("objects");
  const objectsPerPage = 15;

  const handleNextPage = () => {
    if (currentPage < Math.ceil(objects.length / objectsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
      setVisibleDots(0); // Reset visible dots on page change
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      setVisibleDots(0); // Reset visible dots on page change
    }
  };

  useEffect(() => {
    setVisibleDots(0);
  }, [currentPage]);

  const dataPoints = useMemo(() => {
    return currentObjects.map((object, index) => {
      const angle =
        index * (360 / Math.min(objectsPerPage, currentObjects.length));
      return {
        objectId: object.object_id,
        name: object.name,
        businessUnit: object.businessUnit,
        angle: angle,
        buttonLabel: `Button ${index + 1}`,
      };
    });
  }, [currentObjects, objectsPerPage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (visibleDots < currentObjects.length) {
        setVisibleDots((prevVisibleDots) => prevVisibleDots + 1);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [currentPage, visibleDots, currentObjects.length]);

  useEffect(() => {
    if (hoveredIndex !== null) {
      setLastHoveredObject(dataPoints[hoveredIndex]);
    }
  }, [hoveredIndex, dataPoints]);

  const handleTextClick = (objectId) => {
    let nextDataSet;

    const renderCardContent = () => {
      const renderContent = (title, color, icon, idLabel, idValue) => {
        if (!lastHoveredObject) {
          return (
            <>
              <FontAwesomeIcon
                icon={faSpinner}
                size="2x"
                className="devtool-icon"
                style={{
                  color: color,
                  marginRight: "10.0rem",
                }}
              />
              <h3>{title}</h3>
            </>
          );
        }

        return (
          <>
            <div style={{ display: "inline-flex", alignItems: "center" }}>
              <FontAwesomeIcon
                icon={faSpinner}
                size="2x"
                className="devtool-icon"
                style={{
                  color: color,
                  marginRight: "12px",
                }}
              />
              <h3 style={{ margin: 0 }}>{title}</h3>{" "}
            </div>

            <div className="ms-3">
              <div>
                <span>
                  {"Id"}: {lastHoveredObject.objectId}{" "}
                </span>
              </div>
              <div>
                <span>Name: </span>
                <a href={engineTaskURL} className="NavChildLink">
                  {lastHoveredObject.name}
                </a>
              </div>
            </div>
          </>
        );
      };

      switch (currentDataSet) {
        case "objects":
          return renderContent(
            "Process",
            "green",
            faSpinner,
            "ObjectId",
            lastHoveredObject?.objectId
          );
        case "risks":
          return renderContent(
            "Risk",
            "red",
            faSpinner,
            "RiskId",
            lastHoveredObject?.objectId
          );
        case "controls":
          return renderContent(
            "Control",
            "blue",
            faSpinner,
            "ControlId",
            lastHoveredObject?.objectId
          );
        case "testProcedures":
          return renderContent(
            "Test Procedure",
            "purple",
            faSpinner,
            "TestProcedureId",
            lastHoveredObject?.objectId
          );
        default:
          return null;
      }
    };

    return (
      <>
        <Row className="container">
          <div className="circle-container">
            <svg width="600" height="600" viewBox="0 0 450 500">
              <circle
                cx="225"
                cy="250"
                r="180"
                fill="none"
                stroke="black"
                strokeWidth="2"
              />

              {dataPoints.slice(0, visibleDots).map((point, index) => {
                const angleInRadians = (point.angle * Math.PI) / 180;
                const dotX = 225 + 180 * Math.cos(angleInRadians);
                const dotY = 250 + 180 * Math.sin(angleInRadians);
                const textOffset = 40;
                const textX =
                  225 + (180 + textOffset) * Math.cos(angleInRadians);
                const textY =
                  250 + (180 + textOffset) * Math.sin(angleInRadians);

                let displayedText = point.name;
                if (point.name.length > 10) {
                  displayedText = `${point.name.slice(0, 10)}...`;
                }

                return (
                  <g key={index} className={`dot-animation-${index}`}>
                    <circle cx={dotX} cy={dotY} r="5" fill="skyblue" />
                    <text
                      x={textX}
                      y={textY}
                      className="dot-text"
                      onMouseOver={() => setHoveredIndex(index)}
                      onMouseOut={() => setHoveredIndex(null)}
                      onClick={() => handleTextClick(point.objectId)}
                      title={point.objectId}
                    >
                      {displayedText}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="card-container">
              <div>{renderCardContent()}</div>
            </div>
          </div>

          <div className="pagination-controls">
            <Button onClick={handlePrevPage} disabled={currentPage === 1}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>

            <span className="page-count">
              {currentPage} of {Math.ceil(objects.length / objectsPerPage)}
            </span>

            <Button
              onClick={handleNextPage}
              disabled={
                currentPage >= Math.ceil(objects.length / objectsPerPage)
              }
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </div>
        </Row>
      </>
    );
  };
};

export default SvgCircleWithDots;
