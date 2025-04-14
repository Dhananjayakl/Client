import React, { useState } from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faShieldAlt,
  faGaugeSimpleHigh,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import OptionsCard from "src/components/pages/OptionsCard";

const Default = () => {
  const navigate = useNavigate();
  const [selectedFramework, setSelectedFramework] = useState(null);

  const handleClick = (framework) => {
    setSelectedFramework(framework);
    if (framework === "Process Compliance")
      navigate("/page?name=GL_RELATIONSHIP_FRAMEWORKS");
    else if (framework === "Business Resilience")
      navigate("/page?name=GL_BUSINESS_RES_FRAMEWORK");
    else if (framework === "Regulatory Compliance")
      navigate("/page?name=GL_REGULATORY_COM_FRAMEWORK");
    else if (framework === "Internal Audits")
      navigate("/page?name=GL_GRC_AUDIT_FRAMEWORK");
    else {
      alert("Framework Under Implementation");
    }
  };

  const forms = [
    {
      framework: "Process Compliance",
      icon: faShieldAlt,
      privilege: "GL_PROCESS_COM_FRAMEWORK",
    },
    {
      framework: "Regulatory Compliance",

      icon: faCheckCircle,
      privilege: "GL_REGULATORY_COM_FRAMEWORK",
    },
    // {
    //   framework: "Business Resilience",
    //   icon: faBalanceScale,
    //   privilege: "GL_BUSINESS_RES_FRAMEWORK",
    // },
    {
      framework: "Internal Audits",
      icon: faGaugeSimpleHigh,
      privilege: "GL_INTERNAL_AUDIT_FRAMEWORK",
    },
  ];

  const privs = util.getCurrentUser().privileges?.split(",");

  return (
    <Container fluid className="p-0">
      <Card className="reportChart-cards">
        <div className="d-flex justify-content-between align-items-center mt-2">
          <Card.Body>
            <Card.Title>Frameworks</Card.Title>
            <Row>
              {forms.map((item) =>
                privs.includes(item.privilege) ? (
                  <Col key={item.id} className="mb-2">
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
                      <FontAwesomeIcon
                        icon={item.icon}
                        style={{
                          color: "green",
                          marginRight: "0.5rem",
                        }}
                      />
                      <span className="text-center fw-bold fs-5 ms-3">
                        {item.framework}
                      </span>
                    </Button>
                    {selectedFramework === item.framework && (
                      <OptionsCard framework={item.framework} render={false} />
                    )}
                  </Col>
                ) : null
              )}
            </Row>
          </Card.Body>
        </div>
      </Card>
      <hr />
    </Container>
  );
};

export default Default;
