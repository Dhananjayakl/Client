import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAiGenerateDynamicRatingValues } from "../GrcService";
import {
  Card,
  Button,
  Tooltip,
  OverlayTrigger,
  Spinner,
  Table,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Aigenerate = () => {
  const [searchParams] = useSearchParams();
  const objectid = searchParams.get("objectId");
  const userData = JSON.parse(localStorage.getItem("current_logged_User"));
  const userId = userData?.[0]?.user_details?.data?.[0]?.user_id;

  const [aiData, setAiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  const [visibleItems, setVisibleItems] = useState([]);
  const [processId, setProcessId] = useState(null);
  console.log(processId, "yyyyyyyyyyyyyyyy");

  useEffect(() => {
    if (aiData.length > 0) {
      aiData.forEach((item, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, index]);
        }, 1000 * (index + 1));
      });
    }
  }, [aiData]);

  console.log(aiData, "yyyyyyyyyyyyyy");

  const navigate = useNavigate();
  const service = "GL_RISK_SUMMARY";
  const services = "GL_PROCESS_ENV";
  const servicesprocess = "GL_PROCESS_ENV";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setSelectedBusinessUnit(null);
    setSelectedEntity(null);

    if (!userId) {
      setError("User ID not found");
      setLoading(false);
      return;
    }

    try {
      const response = await getAiGenerateDynamicRatingValues(
        "AiGenerateDynamicRating",
        userId
      );
      const data = response?.data || [];

      console.log(data, "dataaaaas");

      const groupedData = groupDataByProcess(data);

      setAiData(groupedData);
      setShowGenerateButton(false);
    } catch (error) {
      console.error("Error fetching business data:", error);
      setError("An error occurred while fetching AI data.");
    } finally {
      setLoading(false);
    }
  };

  const groupDataByProcess = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const key = `${item.businessUnit}-${item.assessableEntity}`;
      if (!grouped[key]) {
        grouped[key] = {
          businessUnit: item.businessUnit,
          assessableEntity: item.assessableEntity,
          processId: item.processId,
          risks: [],
        };
      }
      grouped[key].risks.push({
        riskName: item.riskName,
        dynamicRiskRating: item.dynamicRiskRating,
        trendRating: item.trendRating,
        riskId: item.riskId,
      });
    });
    return Object.values(grouped);
  };

  const handleBusinessUnitClick = (businessUnit) => {
    setSelectedBusinessUnit(businessUnit);
    setSelectedEntity(null);
  };

  const handleEntityClick = (entity) => {
    setSelectedEntity(entity);
  };

  const distinctBusinessUnits = [
    ...new Set(aiData.map((item) => item.businessUnit)),
  ];

  const getRatingColor = (rating) => {
    switch (rating) {
      case "High":
        return "#ff595e";
      case "Medium":
        return "#ffca3a";
      case "Low":
        return "#8ac926";
      default:
        return "black";
    }
  };

  return (
    <div className="container py-4">
      <div className="text-center d-flex align-items-center justify-content-center">
        <h3 className="mb-2 fw-bold me-5">Predict X</h3>
        {showGenerateButton && (
          <Button
            variant="primary"
            onClick={fetchData}
            disabled={loading || error}
          >
            Generate
          </Button>
        )}
      </div>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-primary fw-bold">ProGReC AI computing...</p>
        </div>
      )}

      {error && <p className="text-danger text-center">{error}</p>}

      {!loading &&
        !selectedBusinessUnit &&
        !selectedEntity &&
        aiData.length > 0 && (
          <div className="mt-4">
            <h4 className="text-center mb-3">Business Unit(s)</h4>
            <div className="d-flex flex-wrap justify-content-center">
              {distinctBusinessUnits.map((businessUnit, index) =>
                visibleItems.includes(index) ? (
                  <Card
                    className="shadow-lg rounded my-1 stats-card m-2"
                    onClick={() => handleBusinessUnitClick(businessUnit)}
                    key={index}
                    style={{
                      cursor: "pointer",
                      width: "18rem",
                      textAlign: "center",
                      padding: "10px",
                      transition: "transform 0.2s ease, box-shadow 0.1s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow =
                        "0px 15px 30px rgba(0, 0, 0, 1.0)";
                      e.currentTarget.style.zIndex = "10";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0px 4px 8px rgba(0, 0, 0, 0.1)";
                      e.currentTarget.style.zIndex = "1";
                    }}
                  >
                    <Card.Body>
                      <Card.Title>{businessUnit}</Card.Title>
                    </Card.Body>
                  </Card>
                ) : null
              )}
            </div>
          </div>
        )}

      {!loading && selectedBusinessUnit && !selectedEntity && (
        <div className="mt-2">
          <h2 className="text-center mb-3">
            {selectedBusinessUnit} - (Business Unit)
          </h2>
          <div>
            <ul className="list-group">
              {aiData
                .filter((item) => item.businessUnit === selectedBusinessUnit)
                .map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center bg-light"
                  >
                    <div>
                      <span
                        className="text-primary text-decoration-underline"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(
                            `/page?name=${servicesprocess}&objectId=${item.processId}`
                          )
                        }
                      >
                        {item.assessableEntity}
                      </span>
                    </div>

                    <div className="d-flex align-items-center">
                      <Button
                        variant="secondary"
                        onClick={() => handleEntityClick(item)}
                      >
                        View Risk(s)
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <div className="text-center mt-3">
            <Button
              variant="secondary"
              onClick={() => setSelectedBusinessUnit(null)}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
          </div>
        </div>
      )}

      {!loading && selectedEntity && (
        <div className="mt-4">
          <div className="text-center mb-3">
            <h3 className="mb-2">Risk(s) for:</h3>
            <h4
              className="text-primary text-decoration-underline"
              style={{ cursor: "pointer", textAlign: "center" }}
              onClick={() =>
                navigate(
                  `/page?name=${services}&objectId=${selectedEntity.processId}`
                )
              }
            >
              {selectedEntity.assessableEntity}
            </h4>
          </div>

          <div className="row">
            {selectedEntity.risks.map((risk, index) => (
              <div
                className={`col-md-4 mb-4 ${
                  selectedEntity.risks.length === 1 ? "mx-auto" : ""
                }`}
                key={index}
              >
                <Card
                  className="shadow-sm"
                  style={{
                    borderLeft: `5px solid ${getRatingColor(
                      risk.dynamicRiskRating
                    )}`,
                  }}
                >
                  <Card.Body>
                    <Card.Title
                      className="text-primary text-decoration-underline"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(
                          `/page?name=${service}&objectId=${risk.riskId}`
                        )
                      }
                    >
                      {risk.riskName}
                    </Card.Title>
                    <Card.Text>
                      <strong>Dynamic Risk Rating:</strong>{" "}
                      <span
                        style={{
                          color: getRatingColor(risk.dynamicRiskRating),
                        }}
                      >
                        {risk.dynamicRiskRating}
                      </span>
                    </Card.Text>
                    <Card.Text>
                      <strong>Trend Rating:</strong>{" "}
                      <span style={{ color: getRatingColor(risk.trendRating) }}>
                        {risk.trendRating}
                      </span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-3">
            <Button variant="secondary" onClick={() => setSelectedEntity(null)}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Aigenerate;
