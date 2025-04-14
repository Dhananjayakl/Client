import React from "react";

import { Container, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faCheckCircle,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Default = () => {
    const { t } = useTranslation("common");
  const navigate = useNavigate();

  const handleClick = (framework) => {
    if (framework === "Process Compliance") navigate("/grc/rcsaframework");
    else {
      alert("Framework Under Implmentation");
    }
  };

  let forms = [
    { framework: "Process Compliance", icon: faShieldAlt },
    { framework: "Regulatory Compliance", icon: faCheckCircle },
    { framework: "Third Party Compliance", icon: faCogs },
  ];

  return (
    <>
      <Container fluid className="p-0 ">
        <div>
          <h4>{t("Frameworks")}</h4>
          <Row>
            {forms.map((item, index) => (
              <Col key={index} className="mb-2">
                <Button
                  variant="light"
                  className="w-30 text-dark bg-gray"
                  size="lg"
                  onClick={() => handleClick(item.framework)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.border = "2px solid #1f1f24";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.border =
                      "2px solid rgb(41,48,66,0.04)";
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  <span className="text-center fw-bold fs-5 ms-3">
                    {item.framework}
                  </span>
                </Button>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
      <hr />
    </>
  );
};

export default Default;
