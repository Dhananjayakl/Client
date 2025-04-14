import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import customer from "../../../assets/img/illustrations/customer-support.png";

const SurveyIntroductionPage = ({ formValues, setIntroModal }) => {
  return (
    <Card
      className="mt-1"
      style={{ minHeight: "110vh", minWidth: "170vh", zIndex: 1000 }}
    >
      <Card.Header className="text-center pt-3 p-2">
        <h3>{formValues?.introductionPageTitle}</h3>
      </Card.Header>
      <Card.Body className="d-flex justify-content-between py-5">
        <Row>
          <Col className="col-md-8">
            <div>
              <h3 className="text-primary">{formValues?.questionnaireName}</h3>
              <p className="text-primary fw-bold">
                {formValues?.introductionPageDescription}
              </p>
            </div>
            <Button
              variant="success fw-bold"
              className="rounded-pill p-2"
              onClick={() => setIntroModal(false)}
            >
              <span className="me-1 fw-medium">START SURVEY</span>
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </Col>
          <Col className="col-md-4">
            <img src={customer} style={{ height: "200px" }} alt="no result" />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SurveyIntroductionPage;
