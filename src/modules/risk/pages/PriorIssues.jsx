import React, { useState, useEffect } from "react";
import { getviewData } from "../../grc/GrcService";
import { Card, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import { useTranslation } from "react-i18next";

const PriorIssues = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [aiData, setAiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState([]);
  const { t } = useTranslation("common");

  const closePopup = () => {
    setShowPopup(false);
  };
  const navigate = useNavigate();
  const service = "issueregistry";

  useEffect(() => {
    if (showPopup && aiData.length > 0) {
      // Reset visible items when popup opens
      setVisibleItems([]);

      // Show items with delay
      aiData.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, index]);
        }, 1000 * (index + 1));
      });
    }
  }, [showPopup, aiData]); // Dependency on both showPopup and aiData

  const fetchData = () => {
    setShowPopup(true);
    setLoading(true);

    getviewData({
      viewName: "pa_ir_issue_registry_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `issue_id=ANY(select distinct issue_id from pa_ct_ra_combined_findings_v where process_id=${props.processId})`,
    })
      .then((response) => {
        const data = response?.data || [];
        setAiData(data.data);
      })
      .catch((error) => {
        console.error("Error fetching business data:", error);
        setError("An error occurred while fetching AI data.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
      <div className="d-flex align-items-center justify-content-center">
        <h3 className="text-dark mb-0 me-3">{t("Related Issues")}</h3>
        <Button variant="primary" onClick={fetchData}>
          {t("PredictX")}
        </Button>
      </div>

      {showPopup && (
        <>
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(5px)",
              zIndex: 2,
            }}
            onClick={closePopup}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              padding: "40px",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              zIndex: 3,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="position-absolute text-primary"
              style={{
                top: "15px",
                right: "15px",
                cursor: "pointer",
                fontSize: "20px",
              }}
              onClick={closePopup}
            />
            <h3
              className=" mb-0 me-3"
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#007bff",
              }}
            >
              {t("Related Issues")}
            </h3>
            {loading ? (
              <div className="text-center my-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-primary fw-bold">
                  {t("ProGReC AI computing...")}
                </p>
              </div>
            ) : aiData.length > 0 ? (
              <div className="row mt-4">
                {aiData.map((risk, index) =>
                  visibleItems.includes(index) ? (
                    <div key={index} className="col-md-6 mb-3">
                      <Card
                        className="shadow-sm h-100"
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
                            // onClick={() =>
                            //   navigate(
                            //     `/form/runtime?formService=${service}&objectId=${risk.issue_id}`
                            //   )
                            // }
                          >
                            <ModalForm
                              className="ms-1"
                              style={{ textDecoration: "underline" }}
                              objectId={risk.issue_id}
                              formname="issueregistry"
                              component={
                                <FormRunTime
                                  formService="issueregistry"
                                  objectId={risk.issue_id}
                                  modal
                                />
                              }
                              buttonText={risk.issue_title}
                              variant
                            />
                          </Card.Title>
                          <Card.Text>
                            <strong>{t("Program:")}</strong>{" "}
                            <span
                              style={{
                                color: getRatingColor(risk.d_program),
                              }}
                            >
                              {risk.d_program}
                            </span>
                          </Card.Text>
                          <Card.Text>
                            <strong>{t("Priority:")}</strong>{" "}
                            <span
                              style={{
                                color: getRatingColor(risk.d_issue_priority),
                              }}
                            >
                              {risk.d_issue_priority}
                            </span>
                          </Card.Text>
                          <Card.Text>
                            <strong>{t("Severity:")}</strong>{" "}
                            <span
                              style={{
                                color: getRatingColor(risk.d_severity_rating),
                              }}
                            >
                              {risk.d_severity_rating}
                            </span>
                          </Card.Text>
                          <Card.Text>
                            <strong>{t("Due Date:")}</strong>{" "}
                            <span>{risk.issue_due_date}</span>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                  ) : null
                )}
              </div>
            ) : (
              <div className="text-center mt-4">
                <p>{t("No prior issues present.")}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PriorIssues;
