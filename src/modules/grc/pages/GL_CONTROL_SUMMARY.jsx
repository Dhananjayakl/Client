import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  ButtonToolbar,
  ButtonGroup,
  Form,
  Nav,
  Card,
  Breadcrumb,
  Table,
} from "react-bootstrap";
import { getObjects, getTableDetails } from "../GrcService";
import Chart from "src/components/charts/Chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportRuntime from "src/components/reports/Report";
import Tree from "src/components/pages/Tree";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import GL_PROCESS_INFO_BY_ID from "src/modules/grc/reports/GL_PROCESS_INFO_BY_ID";
import {
  faFilePdf,
  faArrowsSpin,
  faCheckToSlot,
  faComments,
  faBriefcase,
  faBookBookmark,
  faTriangleExclamation,
  faIndustry,
  faBuilding,
  faTimes,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import DynamicModalPopup from "src/components/pages/DynamicModalPopup";
import Buttons from "src/components/pages/Buttons";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";
import { getServiceData } from "../GrcService";
import OptionsCard from "src/components/pages/OptionsCard";
import { getviewData } from "../GrcService";
import { PageBreadCrumb, PageBreadCrumbItem } from "./PageUtils";

const Default = ({ selectedFramework }) => {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  const [controldata, setControldata] = useState(null);

  const fetchControlData = () => {
    getviewData({
      viewName: "pa_gl_control_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `object_id=${objectId}`,
    })
      .then((response) => {
        setControldata(response.data.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchControlData();
  }, [objectId]);

  return (
    <div>
      <Container fluid className="p-3">
        <div className="shadow sticky-top bg-white z-1">
          <PageBreadCrumb>
            <PageBreadCrumbItem title={"Control Environment"} />
            <PageBreadCrumbItem title={controldata?.name} />
          </PageBreadCrumb>

          <Tab.Container id="menu" defaultActiveKey="Overview">
            <Card className="sticky-top px-2 py-1 mb-3" style={{ zIndex: "1" }}>
              <Row>
                <Col lg={8}>
                  <div className="h4 overflow-hidden">
                    <FontAwesomeIcon icon={faCheckToSlot} /> {controldata?.name}
                  </div>
                </Col>
                {/* <Col>
                  <div className="float-end">
                    <span className="ms-1 rounded-circle align-items-center justify-content-center">
                      <FontAwesomeIcon
                        icon={faFilePdf}
                        size="lg"
                        className="text-black"
                      />
                    </span>
                  </div>
                </Col> */}
                <hr className="my-1 py-0" />
              </Row>
              <Row className="ps-2">
                <PageNavigation />
              </Row>
            </Card>

            <Tab.Content className="bg-white pt-3">
              <Tab.Pane eventKey="Overview">
                <OverView objectId={objectId} />
              </Tab.Pane>
              {/* <Tab.Pane eventKey="Process Compliance">
                <ProcessCompliance objectId={objectId} />
              </Tab.Pane>
              <Tab.Pane eventKey="Regulatory Compliance">
                <RegulatoryCompliance objectId={objectId} />
              </Tab.Pane> */}
            </Tab.Content>
          </Tab.Container>
        </div>
      </Container>
    </div>
  );
};

const OverView = ({ objectId: propObjectId }) => {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId") || propObjectId;
  const [kriTrend, setKriTrend] = useState([]);
  const [krilibrarydata, setKrilibrarydata] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const [isBlurred, setIsBlurred] = useState(false);

  const handleIconClick = (popupType) => {
    setActivePopup(popupType);
    setIsBlurred(true);
  };

  const closePopup = () => {
    setActivePopup(null);
    setIsBlurred(false);
  };

  const fetchkrilibraryData = () => {
    getviewData({
      viewName: "pa_gl_rcsa_bv",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `control_id=${objectId}`,
    })
      .then((response) => {
        setKrilibrarydata(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchkrilibraryData();
  }, [objectId]);

  const renderProcessItems = () => {
    if (!krilibrarydata || !Array.isArray(krilibrarydata)) return <div>--</div>;

    const uniqueProcessNames = new Set();

    const processItems = krilibrarydata
      .map(({ d_process_name }, index) => {
        if (!d_process_name || uniqueProcessNames.has(d_process_name.trim()))
          return null;
        uniqueProcessNames.add(d_process_name.trim());
        return (
          <div key={index}>
            <ul>
              <li>{d_process_name.trim()}</li>
            </ul>
          </div>
        );
      })
      .filter(Boolean);

    return processItems.length > 0 ? (
      processItems
    ) : (
      <ul>
        <li>
          <div>--</div>
        </li>
      </ul>
    );
  };

  const renderRiskItems = () => {
    if (!krilibrarydata || !Array.isArray(krilibrarydata)) return <div>--</div>;

    const uniqueControlNames = new Set();

    const controlItems = krilibrarydata
      .map(({ d_risk_name }, index) => {
        if (!d_risk_name || uniqueControlNames.has(d_risk_name.trim()))
          return null;
        uniqueControlNames.add(d_risk_name.trim());
        return (
          <ul key={index}>
            <li>{d_risk_name.trim()}</li>
          </ul>
        );
      })
      .filter(Boolean);

    return controlItems.length > 0 ? (
      controlItems
    ) : (
      <ul>
        <li>
          <div>--</div>
        </li>
      </ul>
    );
  };

  const renderTestProcedures = () => {
    if (!krilibrarydata || !Array.isArray(krilibrarydata)) return <div>--</div>;

    const uniqueTestProcedures = new Set();

    const testProcedureItems = krilibrarydata
      .map(({ d_test_procedure_name }, index) => {
        if (
          !d_test_procedure_name ||
          uniqueTestProcedures.has(d_test_procedure_name.trim())
        )
          return null;
        uniqueTestProcedures.add(d_test_procedure_name.trim());
        return (
          <div key={index}>
            <ul>
              <li>{d_test_procedure_name.trim()}</li>
            </ul>
          </div>
        );
      })
      .filter(Boolean);

    return testProcedureItems.length > 0 ? (
      testProcedureItems
    ) : (
      <ul>
        <li>
          <div>--</div>
        </li>
      </ul>
    );
  };

  const renderBusinessUnits = () => {
    if (!krilibrarydata || !Array.isArray(krilibrarydata)) return <div>--</div>;

    const uniqueBusinessUnits = new Set();

    const businessUnitItems = krilibrarydata
      .map(({ d_business_unit }, index) => {
        if (!d_business_unit || uniqueBusinessUnits.has(d_business_unit.trim()))
          return null;
        uniqueBusinessUnits.add(d_business_unit.trim());
        return (
          <div key={index}>
            <ul>
              <li>{d_business_unit.trim()}</li>
            </ul>
          </div>
        );
      })
      .filter(Boolean);

    return businessUnitItems.length > 0 ? (
      businessUnitItems
    ) : (
      <ul>
        <li>
          <div>--</div>
        </li>
      </ul>
    );
  };

  return (
    <>
      <Row md={8} className="gx-5">
        <Col>
          <ReportRuntime
            report="GL_CONTROL_BY_ID"
            drilldownReports={{ objectId: objectId }}
            // dataCard
          />
        </Col>

        <Col>
          <Row className="text-center align-items-center d-flex justify-content-center">
            <Col className="d-flex">
              <h4>Relationship</h4>
            </Col>
            <Col className="d-flex">
              <hr className="w-100 ms-n7" />
            </Col>
          </Row>

          <Row className="mt-2 d-flex justify-content-around align-items-stretch">
            <Col md={3} className="d-flex">
              <Card
                className="gx-5 flex-grow-1"
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  textAlign: "center",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  flexGrow: 1,
                }}
              >
                <h5>Business Unit(s)</h5>
                <FontAwesomeIcon
                  icon={faBuilding}
                  style={{
                    cursor: "pointer",
                    fontSize: "24px",
                    color: "#007bff",
                  }}
                  onClick={() => handleIconClick("business")}
                />
                {activePopup === "business" && (
                  <>
                    <div
                      style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
                        backdropFilter: "blur(5px)", // Blur effect
                        zIndex: 2,
                      }}
                    />
                    <div
                      style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "400px",
                        padding: "40px",
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        zIndex: 2,
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
                      <h4 style={{ textAlign: "center", marginBottom: "20px" , color: "#007bff"}}>
                        Related Business Unit(s)
                      </h4>
                      <div
                        style={{
                          textAlign: "left",
                          marginTop: "20px",
                          maxHeight: "40vh",
                          overflowY: "auto",
                        }}
                      >
                        {renderBusinessUnits()}
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </Col>
            <Col md={3} className="d-flex">
              <Card
                className="gx-5 flex-grow-1"
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  textAlign: "center",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  flexGrow: 1,
                }}
              >
                <h5>Test Procedure(s)</h5>
                <FontAwesomeIcon
                  icon={faComments}
                  style={{
                    cursor: "pointer",
                    fontSize: "24px",
                    color: "#007bff",
                  }}
                  onClick={() => handleIconClick("testprocedure")}
                />
                {activePopup === "testprocedure" && (
                  <>
                    <div
                      style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
                        backdropFilter: "blur(5px)", // Blur effect
                        zIndex: 2,
                      }}
                    />
                    <div
                      style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "400px",
                        padding: "40px",
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        zIndex: 2,
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
                      <h4 style={{ textAlign: "center", marginBottom: "20px", color: "#007bff" }}>
                        Related Test Procedure(s)
                      </h4>
                      <div
                        style={{
                          textAlign: "left",
                          maxHeight: "40vh",
                          overflowY: "auto",
                        }}
                      >
                        {renderTestProcedures()}
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </Col>
            <Col md={3} className="d-flex">
              <Card
                className="gx-5 flex-grow-1"
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  textAlign: "center",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  flexGrow: 1,
                }}
              >
                <h5>Process</h5>
                <FontAwesomeIcon
                  icon={faArrowsSpin}
                  style={{
                    cursor: "pointer",
                    fontSize: "24px",
                    color: "#007bff",
                  }}
                  onClick={() => handleIconClick("process")}
                />
                {activePopup === "process" && (
                  <>
                    <div
                      style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
                        backdropFilter: "blur(5px)", // Blur effect
                        zIndex: 2,
                      }}
                    />
                    <div
                      style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "400px",
                        padding: "40px",
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        zIndex: 2,
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
                      <h4 style={{ textAlign: "center", marginBottom: "20px", color: "#007bff" }}>
                        Related Process
                      </h4>
                      <div
                        style={{
                          textAlign: "left",
                          marginTop: "20px",
                          maxHeight: "40vh",
                          overflowY: "auto",
                        }}
                      >
                        {renderProcessItems()}
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </Col>
            <Col md={3} className="d-flex">
              <Card
                className="gx-5 flex-grow-1"
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  textAlign: "center",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  flexGrow: 1,
                }}
              >
                <h5>Risk(s)</h5>
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  style={{
                    cursor: "pointer",
                    fontSize: "24px",
                    color: "#007bff",
                  }}
                  onClick={() => handleIconClick("control")}
                />
                {activePopup === "control" && (
                  <>
                    <div
                      style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
                        backdropFilter: "blur(5px)", // Blur effect
                        zIndex: 2,
                      }}
                    />
                    <div
                      style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "400px",
                        padding: "40px",
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        zIndex: 2,
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
                      <h4 style={{ textAlign: "center", marginBottom: "20px", color: "#007bff" }}>
                        Related Risk(s)
                      </h4>
                      <div
                        style={{
                          textAlign: "left",
                          maxHeight: "40vh",
                          overflowY: "auto",
                        }}
                      >
                        {renderRiskItems()}
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            {/* <Row>
              <ReportRuntime
                report="CT_COMPLIANCE_DATACARD"
                drilldownReports={{ processId: objectId }}
                dataCard
              />
            </Row> */}
          </Row>
        </Col>
      </Row>

      <Row>
        <Col>
          <ReportRuntime
            report="GL_CONTROL_SUMMARY"
            drilldownReports={{ processId: objectId }}
          />
        </Col>
      </Row>
      <Col>
        <Row>
          <ReportRuntime
            report="CT_CONTROL_RESULTS"
            drilldownReports={{ controlId: objectId }}
          />
        </Row>
      </Col>

      <Col>
        <Row>
          <ReportRuntime
            report="IR_RA_ISSUE_DETAILS_SUMMARY"
            drilldownReports={{ processId: objectId }}
          />
        </Row>
      </Col>
    </>
  );
};

// const ProcessCompliance = ({ objectId }) => {
//   return <>\</>;
// };

// const RegulatoryCompliance = ({ objectId }) => {
//   return <>\</>;
// };

const PageNavigation = () => {
  return (
    <Nav
      variant="underline"
      defaultActiveKey="OverView"
      className="justify-content-start mt-1"
    >
      <Nav.Item>
        <Nav.Link eventKey="Overview">Overview</Nav.Link>
      </Nav.Item>
      {/* <Nav.Item>
        <Nav.Link eventKey="Process Compliance">Process Compliance</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="Regulatory Compliance">
          Regulatory Compliance
        </Nav.Link>
      </Nav.Item> */}
    </Nav>
  );
};

export default Default;
