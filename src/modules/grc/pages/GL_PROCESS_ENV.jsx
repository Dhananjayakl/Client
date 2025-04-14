import React, { useState, useEffect } from "react";
import { Container, Row, Col, Tab, Card, Nav } from "react-bootstrap";
import { getviewData, getBusinessDetails } from "../GrcService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "react-router-dom";
import { faArrowsSpin } from "@fortawesome/free-solid-svg-icons";
import { PageBreadCrumb, PageBreadCrumbItem } from "./PageUtils";
import ProcessCombinedAssurance from "../ProcessCompliance/ProcessCombinedAssurance";
import ProcessRelationships from "../ProcessCompliance/ProcessRelationships";
import ProcessBusinessResiliency from "../ProcessCompliance/ProcessBusinessResiliency";
import ProcessTestExecutions from "../ProcessCompliance/ProcessTestExecutions";
import ProcessRiskAssessment from "../ProcessCompliance/ProcessRiskAssessment";
import ProcessIssues from "../ProcessCompliance/ProcessIssues";
import ProcessKRI from "../ProcessCompliance/ProcessKRI";
import ProcessVendorTP from "../ProcessCompliance/ProcessVendorTP";
import { useTranslation } from "react-i18next";

const Default = () => {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  const [processInfo, setProcessInfo] = useState();
  const [refreshCharts, setRefreshCharts] = useState(false);

  const handleRefreshClick = () => {
    setRefreshCharts((prev) => !prev);
  };

  useEffect(() => {
    getviewData({
      viewName: "pa_gl_process_bt",
      pageNumber: 0,
      pageSize: 0,
      orderExpression: "",
      filterExpression: "object_id=" + objectId,
    })
      .then((response) => {
        const responseData = response.data;

        setProcessInfo(responseData.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });

    getviewData({
      viewName: "pa_gl_process_bt",
      pageNumber: 0,
      pageSize: 0,
      orderExpression: "",
      filterExpression: "",
    })
      .then((response) => {
        const responseData = response.data.data;

        // Map the response to the desired format
        const processes = responseData.map((item) => ({
          object_id: item.object_id,
          name: item.name,
          parent: item.parent || null,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [objectId]);

  const { t } = useTranslation("common");
  return (
    <div>
      <Container fluid className="p-0 ">
        <PageBreadCrumb>
          <PageBreadCrumbItem title={"Process Environment"} />
          <PageBreadCrumbItem title={processInfo?.d_owner_orgs} />
          <PageBreadCrumbItem
            title={processInfo?.name + " [" + objectId + "]"}
          />
        </PageBreadCrumb>
        {/* <div className="bg-body-tertiary  text-dark  ">
          <Row>
            <nav
              aria-label="breadcrumb"
              style={{
                "--bs-breadcrumb-divider": "'>'",
              }}
            >
              <ol className="breadcrumb mb-1 standard-Font">
                <li className="breadcrumb-item">
                  <a href="/">
                    <FontAwesomeIcon icon={faHome} /> Home
                  </a>
                </li>
                <li className="breadcrumb-item " aria-current="page">
                  <a href="#">Process Environment</a>
                </li>
                <li className="breadcrumb-item " aria-current="page">
                  <a href="#">{processInfo?.d_owner_orgs}</a>
                </li>
                <li
                  className="breadcrumb-item active fw-bold"
                  aria-current="page"
                >
                  <a href="#">
                    [{objectId}]
                  </a>
                </li>
              </ol>
            </nav>
          </Row>
        </div> */}

        <Tab.Container id="menu" defaultActiveKey="CombinedAssurance">
          <Card className="sticky-top px-2 py-1 mb-3" style={{ zIndex: "1" }}>
            <Row>
              <Col lg={8}>
                <div className="h4 overflow-hidden ">
                  <FontAwesomeIcon icon={faArrowsSpin} /> {processInfo?.name}
                </div>
              </Col>
              <Col>
                <div className="float-end">
                  {processInfo?.auditable_entity && (
                    <span className="badge border fs-6 border-primary text-primary">
                      {t("Auditable Entity")}
                    </span>
                  )}
                  <span className=" ms-1 badge border fs-6 border-primary text-primary">
                    {processInfo?.status}
                  </span>
                  <span className="ms-1 badge border  fs-6 border-primary text-primary">
                    {processInfo?.d_business_critic}
                  </span>
                  {/* <span
                    className={`ms-1 rounded-circle  align-items-center justify-content-center`}
                  >
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      size="lg"
                      className="text-black"
                    />
                    <i className="bi bi-file-earmark-pdf-fill"></i>
                  </span> */}
                </div>
              </Col>
              <hr className="my-1 py-0" />
            </Row>
            <Row className="ps-2">
              <PageNavigation />
            </Row>
          </Card>

          <Tab.Content className="bg-white pt-3">
            <Tab.Pane eventKey="CombinedAssurance">
              <ProcessCombinedAssurance objectId={objectId} />
            </Tab.Pane>
            <Tab.Pane eventKey="relationships">
              <ProcessRelationships
                objectId={objectId}
                refreshCharts={refreshCharts}
                handleRefreshClick={handleRefreshClick}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="BusinessReslience">
              <ProcessBusinessResiliency
                objectId={objectId}
                refreshCharts={refreshCharts}
                handleRefreshClick={handleRefreshClick}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="testexecutions">
              <ProcessTestExecutions objectId={objectId} />
            </Tab.Pane>
            <Tab.Pane eventKey="assessments">
              <ProcessRiskAssessment objectId={objectId} />
            </Tab.Pane>
            <Tab.Pane eventKey="issues">
              <ProcessIssues objectId={objectId} />
            </Tab.Pane>
            <Tab.Pane eventKey="kri">
              <ProcessKRI objectId={objectId} />
            </Tab.Pane>
            <Tab.Pane eventKey="thirdparty/vendors">
              <ProcessVendorTP objectId={objectId} />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};
const PageNavigation = () => {
  const { t } = useTranslation("common");
  return (
    <Nav
      variant="underline"
      defaultActiveKey="CombinedAssurance"
      className="justify-content-start mt-1"
    >
      <Nav.Item>
        <Nav.Link eventKey="CombinedAssurance" className="py-0">
          {t("Combined Assurance")}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="relationships" className="py-0">
          {t("RCSA")}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="BusinessReslience" className="py-0">
          {t("Business Resilience")}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="testexecutions" className="py-0">
          {t("Test Executions")}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="assessments" className="py-0">
          {t("Risk Assessments")}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="issues" className="py-0">
          {t("Issues")}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="kri" className="py-0">
          {t("KRI")}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="thirdparty/vendors" className="py-0">
          {t("Third Party/Vendors")}
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Default;
