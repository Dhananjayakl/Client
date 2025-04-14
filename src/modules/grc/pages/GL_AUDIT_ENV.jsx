import React, { useState, useEffect } from "react";
import { Container, Row, Col, Tab, Card, Nav } from "react-bootstrap";
import { getTableDetail, getviewData } from "../GrcService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportRuntime from "src/components/reports/Report";
import AuditTree from "src/components/pages/AuditTree";
import { useSearchParams } from "react-router-dom";
import {
  faArrowsSpin,
  faTriangleExclamation,
  faCheckToSlot,
  faComments,
  faPencil,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";
import { PageBreadCrumb, PageBreadCrumbItem } from "./PageUtils";

const Default = () => {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  const [refreshCharts, setRefreshCharts] = useState(false);
  const handleRefreshClick = () => {
    setRefreshCharts((prev) => !prev);
  };
  const [processInfo, setProcessInfo] = useState();

  useEffect(() => {
    getviewData({
      viewName: "pa_ia_auditable_entity_bt",
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
  }, []);

  return (
    <div>
      <Container fluid className="p-0 ">
        <PageBreadCrumb>
          <PageBreadCrumbItem title={"Audit Environment"} />
          <PageBreadCrumbItem title={processInfo?.d_business_unit} />
          <PageBreadCrumbItem
            title={processInfo?.title + " [" + objectId + "]"}
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
                  <FontAwesomeIcon icon={faArrowsSpin} /> {processInfo?.title}
                </div>
              </Col>
              <Col>
                <div className="float-end">
                  {processInfo?.auditable_entity && (
                    <span className="badge border fs-6 border-primary text-primary">
                      Auditable Entity
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
            {/* <hr className="my-0 mb-1 py-0" /> */}
          </Card>

          <Tab.Content className="bg-white pt-3">
            <Tab.Pane eventKey="CombinedAssurance">
              <CombinedAssurance objectId={objectId} />
            </Tab.Pane>
            <Tab.Pane eventKey="relationships">
              <Relationships
                objectId={objectId}
                refreshCharts={refreshCharts}
                setRefreshCharts={setRefreshCharts}
                handleRefreshClick={handleRefreshClick}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};

const generateTreeData = (tableDetails, treeOptions) => {
  if (!tableDetails || !tableDetails.businessUnits) return [];

  const treeDataArray = [];

  tableDetails.businessUnits.forEach((businessUnit) => {
    businessUnit.units.forEach((unit) => {
      unit.auditableEntity.forEach((process) => {
        if (process.name) {
          const processNode = {
            title: (
              <span className="text-center fw-bold fs-5  text-black ">
                <FontAwesomeIcon
                  icon={faArrowsSpin}
                  size="lg"
                  className=" me-2"
                />
                [AE]{process.name}
              </span>
            ),
            toggled: true,
            expanded: true,
            formService: "risk",
            options: treeOptions,
            label: "Risk",
            children: [],
            isProcess: true,
            source: "risk",
            id: process.id,
            businessUnitName: businessUnit.units[0].name,
            businessUnitId: businessUnit.id,
            type: "process",
          };

          process.risks.forEach((risk) => {
            if (risk.name) {
              const riskNode = {
                title: (
                  <span className="text-center fw-bold fs-5  text-black ">
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      size="lg"
                      className=" me-2"
                    />
                    [R]{risk.name}
                  </span>
                ),
                toggled: true,
                expanded: true,
                formService: "control",
                options: treeOptions,
                label: "Controls",
                children: [],
                source: "control",
                isControl: true,
                id: risk.id,
                type: "risk",
              };

              risk.controls.forEach((control) => {
                if (control.name) {
                  // Check if name exists and is not null
                  const controlNode = {
                    title: (
                      <span className="text-center fw-bold fs-5   text-black">
                        <FontAwesomeIcon
                          icon={faCheckToSlot}
                          size="lg"
                          className=" me-2"
                        />
                        [C]{control.name}
                      </span>
                    ),
                    toggled: true,
                    formService: "testandprocedures",
                    options: treeOptions,
                    label: "Test and Procedure",
                    source: "test",
                    isTest: true,
                    children: [],
                    id: control.id,
                    type: "control",
                  };

                  control.testProcedures.forEach((testProcedure) => {
                    if (
                      testProcedure.name &&
                      testProcedure.name !== "null" &&
                      testProcedure.name.trim() !== ""
                    ) {
                      // Check if name exists and is not null
                      controlNode.children.push({
                        title: (
                          <span className="text-center fw-bold fs-5 text-black ">
                            <FontAwesomeIcon
                              icon={faComments}
                              size="lg"
                              className=" me-2"
                            />
                            [T]{testProcedure.name}
                          </span>
                        ),
                        toggled: true,
                        isTestProcedure: true,
                        details: true,
                        id: testProcedure.id,
                        type: "test",
                      });
                    }
                  });

                  riskNode.children.push(controlNode);
                }
              });

              processNode.children.push(riskNode);
            }
          });

          treeDataArray.push({
            processName: process.name,
            businessUnitName: businessUnit.units[0].name,
            businessUnitId: businessUnit.id,
            treeData: [processNode],
          });
        }
      });
    });
  });

  return treeDataArray;
};
const CombinedAssurance = ({ objectId }) => {
  return (
    <Row id="scrollspyHeading1">
      <Row id="scrollspyHeading1">
        <Col className="p-0 m-0">
          <ReportRuntime
            report="GL_BUSINESSUNITS_BY_AUDIT"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
        <Col className="p-0 m-0">
          <ReportRuntime
            report="GL_RISK_BY_AUDIT_ID"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
        <Col className="p-0 m-0">
          <ReportRuntime
            report="GL_CONTROLS_BY_AUDIT_ID"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>

        <Row></Row>
        <Row>
          <Col id="scrollspyHeading1" md={6}>
            <ReportRuntime
              report="IA_AUDIT_INFO"
              drilldownReports={{ processId: objectId }}
            />
          </Col>
        </Row>
      </Row>
      <Row></Row>
    </Row>
  );
};

const Relationships = ({ objectId, refreshCharts, handleRefreshClick }) => {
  const [tableDetails, setTableDetails] = useState(null);
  const [treeOptions, setTreeOptions] = useState();
  const [treeDataArray, setTreeDataArray] = useState([]);
  const handleOptionsUpdate = (options) => {
    setTreeOptions(options);
  };

  // Effect to fetch table details on each reload
  useEffect(() => {
    getTableDetail("getAuditData", objectId)
      .then((tableResponse) => {
        setTableDetails(tableResponse.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refreshCharts]);

  useEffect(() => {
    if (tableDetails) {
      const generatedTreeDataArray = generateTreeData(
        tableDetails,
        treeOptions
      );

      setTreeDataArray(generatedTreeDataArray);
    }
  }, [tableDetails, treeOptions]);

  return (
    <>
      <Row className="d-flex justify-content-between align-items-start">
        <Col className="d-flex justify-content-end mb-0">
          <ModalForm
            component={
              <FormRunTime
                formService="internalaudits"
                objectId={-1}
                modal
                processName={objectId}
                upload={true}
                hide={true}
                size={"xs"}
              />
            }
            buttonText={
              <span className="badge border fs-6 border-primary text-primary">
                Add BU
              </span>
            }
            style={{ fontSize: "0.65rem", padding: "0.1rem 0.3rem" }}
            variant="link"
          />

          <FontAwesomeIcon
            icon={faRefresh}
            size="lg"
            className="text-black mt-1"
            onClick={handleRefreshClick}
          />
        </Col>
      </Row>

      <Row>
        <div>
          {!tableDetails ||
          !tableDetails.businessUnits ||
          tableDetails.businessUnits.length === 0 ? (
            <Container className="mt-4">
              <ModalForm
                component={
                  <FormRunTime
                    formService="internalaudits"
                    objectId={-1}
                    modal
                    processName={objectId}
                    upload={true}
                  />
                }
                buttonText={
                  <>
                    <FontAwesomeIcon
                      icon={faPencil}
                      className="text-light"
                      size="lg"
                    />{" "}
                    Create Relationship
                  </>
                }
                variant="dark"
              />
            </Container>
          ) : (
            treeDataArray.map((businessUnitTree, index) => {
              return (
                <div key={index}>
                  <Collapse
                    className="bg-primary text-white bg-opacity-50"
                    title={businessUnitTree.businessUnitName}
                    objectId={objectId}
                    businessUnitId={businessUnitTree.businessUnitId}
                    renderOptionsCard={false}
                  >
                    <div className="d-flex p-3 align-items-start">
                      <AuditTree
                        treeData={businessUnitTree.treeData}
                        onOptionsUpdate={handleOptionsUpdate}
                        treeOptions={treeOptions}
                        refreshCharts={refreshCharts}
                      />
                    </div>
                  </Collapse>
                </div>
              );
            })
          )}
        </div>
      </Row>
    </>
  );
};

const PageNavigation = () => {
  return (
    <Nav
      variant="underline"
      defaultActiveKey="CombinedAssurance"
      className="justify-content-start mt-1"
    >
      <Nav.Item>
        <Nav.Link eventKey="CombinedAssurance" className="py-0">
          Combined Assurance
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="relationships" className="py-0">
          Relationship
        </Nav.Link>
      </Nav.Item>
      {/* <Nav.Item>
        <Nav.Link eventKey="assesments" className="py-0">
          Risk Assessment
        </Nav.Link>
      </Nav.Item> */}
      {/* <Nav.Item>
        <Nav.Link eventKey="obligations" className="py-0">
          Obligations
        </Nav.Link>
      </Nav.Item> */}
    </Nav>
  );
};

export default Default;
