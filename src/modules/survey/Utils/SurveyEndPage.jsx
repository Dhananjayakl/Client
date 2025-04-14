import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SurveyEndPage = () => {
  const navigate = useNavigate();
  return (
    <div className="survey-end-page p-5 text-center">
      <Row className="d-flex align-items-center justify-content-center">
        <Col md={8} className="d-flex flex-column align-items-center">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="display-1 text-success mb-4"
          />
          <h2 className="mb-3">Thank You for Your Participation!</h2>
          <p className="lead mb-4">
            Your response has been submitted successfully. Your feedback is
            valuable and will help us to improve and provide better services.
          </p>
          <Button variant="link" onClick={() => navigate("/")} className="mt-2">
            Take Another Survey
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SurveyEndPage;
