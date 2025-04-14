import React, { useState, useEffect } from "react";
import { Container, Row, Col, Tab, Card, Nav } from "react-bootstrap";
import { getObjects, getServiceData, getviewData } from "../GrcService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportRuntime from "src/components/reports/Report";
import RegulatoryTree from "src/components/pages/RegulatoryTree";
import { useSearchParams } from "react-router-dom";
import {
  faArrowsSpin,
  faCheckCircle,
  faBalanceScale,
  faComments,
  faBriefcase,
  faPencil,
  faRefresh,
  faBuildingColumns,
  faClipboardList,
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
      viewName: "pa_gl_regulatorybody_bt",
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
          <PageBreadCrumbItem title={"Regulatory Compliance Environment"} />
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
            <Tab.Pane eventKey="assessments">
              <RiskAssessment objectId={objectId} />
            </Tab.Pane>
            <Tab.Pane eventKey="obligations">
              <Obligations objectId={objectId} />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};

const generateTreeData = (tableDetails, treeOptions) => {
  if (!tableDetails || !tableDetails.regulatoryBodies)
    return { treeDataArray: [], regulatoryBodies: [] };

  const treeDataArray = [];
  const regulatoryBodies = [];

  tableDetails.regulatoryBodies.forEach((regulatoryBody) => {
    if (!regulatoryBody.name || !regulatoryBody.id) return;

    const regulatoryBodyNode = {
      title: (
        <span className="text-center fw-bold fs-5 text-black">
          <FontAwesomeIcon icon={faComments} size="lg" className="me-2" />
          [RB]{regulatoryBody.name}
        </span>
      ),
      toggled: true,
      expanded: true,
      formService: "regulatoryBody",
      label: "Area of Compliance",
      children: [],
      source: "regulatoryBody",
      id: regulatoryBody.id,
      type: "regulatoryBody",
      isArea: true,
      options: treeOptions,
    };
    const iconMap = {
      Controls: {
        icon: faCheckCircle,
        options: treeOptions,
        label: "Controls",
        source: "control",
        value: "[C]",
      },
      Obligations: {
        icon: faBalanceScale,
        options: treeOptions,
        label: "Obligations",
        source: "obligation",
        value: "[O]",
      },
      "Business Unit": {
        icon: faBuildingColumns,
        options: treeOptions,
        label: "Business Unit",
        source: "Buisness Unit",
        value: "[BU]",
      },
    };

    regulatoryBody.areasOfCompliance.forEach((areaOfCompliance) => {
      if (!areaOfCompliance.name || !areaOfCompliance.id) return;

      const areaOfComplianceNode = {
        title: (
          <span className="text-center fw-bold fs-5 text-black">
            <FontAwesomeIcon icon={faBriefcase} size="lg" className="me-2" />
            [A]{areaOfCompliance.name}
          </span>
        ),
        toggled: true,
        expanded: true,
        formService: "compliance",
        label: "Requirement",
        children: [],
        isAreaOfCompliance: true,
        source: "compliance",
        id: areaOfCompliance.id,
        type: "areaOfCompliance",
        isRequire: true,
        options: treeOptions,
      };

      areaOfCompliance.requirements.forEach((requirement) => {
        if (!requirement.name || !requirement.id) return;

        const requirementNode = {
          title: (
            <span className="text-center fw-bold fs-5 text-black">
              <FontAwesomeIcon
                icon={faClipboardList}
                size="lg"
                className="me-2"
              />
              [R]{requirement.name}
            </span>
          ),
          toggled: true,
          expanded: true,
          formService: "requirement",
          label: "Extra",
          children: [],
          isBusiness: true,
          source: "requirement",
          id: requirement.id,
          type: "requirement",
          isRequirementNode: true,
        };

        requirement.objectTypes.forEach((objectType) => {
          if (!objectType.name || !objectType.id) return;

          const icon = iconMap[objectType.name]?.icon;
          const options = iconMap[objectType.name]?.options;
          const label = iconMap[objectType.name]?.label;
          const source = iconMap[objectType.name]?.source;
          const value = iconMap[objectType.name]?.value;
          let isControls = false;
          let isObligate = false;
          let isBusinessUnit = false;

          if (objectType.name === "Controls") {
            isControls = true;
          } else if (objectType.name === "Obligations") {
            isObligate = true;
          } else if (objectType.name === "Business Unit") {
            isBusinessUnit = true;
          }

          const objectTypeNode = {
            id: objectType.id,
            name: objectType.name,
            children: [],
            options: options,
            label: label,
            source: source,
            value: value,
            isControls: isControls,
            isObligate: isObligate,
            isBusinessUnit: isBusinessUnit,
            requirementId: requirement.id,
            areaofComplianceId: areaOfCompliance.id,
            title: (
              <span className="text-center fw-bold fs-5 text-black">
                <FontAwesomeIcon icon={icon} size="lg" className="me-2" />
                {value}
                {objectType.name}
              </span>
            ),
          };

          const addObjectNodes = (objects, parentNode) => {
            if (objects.length === 0) {
              return;
            }

            objects.forEach((object) => {
              if (object.objects && object.objects.length > 0) {
                addObjectNodes(object.objects, parentNode);
              } else if (object.name) {
                parentNode.children.push({
                  id: object.id,
                  name: object.name,
                  isBusiness: true,
                  objectType: objectType.id,
                  title: (
                    <span className="text-center fw-bold fs-5 text-black">
                      <FontAwesomeIcon icon={icon} size="lg" className="me-2" />
                      {value} {object.name}
                    </span>
                  ),
                });
              }
            });
          };

          addObjectNodes(objectType.objects, objectTypeNode);

          if (
            objectType.name === "Controls" ||
            objectType.name === "Obligations" ||
            objectType.name === "Business Unit"
          ) {
            requirementNode.children.push(objectTypeNode);
          }
        });

        areaOfComplianceNode.children.push(requirementNode);
      });

      regulatoryBodyNode.children.push(areaOfComplianceNode);
    });

    treeDataArray.push(regulatoryBodyNode);
    regulatoryBodies.push({
      name: regulatoryBody.name,
      id: regulatoryBody.id,
    });
  });

  return { treeDataArray, regulatoryBodies };
};

const CombinedAssurance = ({ objectId }) => {
  return (
    <Row id="scrollspyHeading1">
      <Row id="scrollspyHeading1">
        <Col className="p-0 m-0">
          <ReportRuntime
            report="GL_AREA_OF_COMPLIANCE_BY_ID"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
        <Col className="p-0 m-0">
          <ReportRuntime
            report="GL_RELATED_REQUIREMENT_BY_ID"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
        <Col className="p-0 m-0">
          <ReportRuntime
            report="GL_RELATED_CONTROLS_BY_ID"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
        <Col className="p-0 m-0">
          <ReportRuntime
            report="GL_RELATED_OBLIGATIONS_BY_ID"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
        <Col className="p-0 m-0">
          <ReportRuntime
            report="GL_BUSINESS_UNIT_BY_ID"
            drilldownReports={{ processId: objectId }}
            dataCard
          />
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <ReportRuntime
            report="GL_REGULATORY_INFO_BY_ID"
            drilldownReports={{ processId: objectId }}
          />
        </Col>
      </Row>
    </Row>
  );
};

const Relationships = ({ objectId, refreshCharts, handleRefreshClick }) => {
  const [tableDetails, setTableDetails] = useState(null);

  const [treeDataArray, setTreeDataArray] = useState([]);
  const [regulatoryBodies, setRegulatoryBodies] = useState([]);
  const [treeOptions, setTreeOptions] = useState();

  const handleOptionsUpdate = (options) => {
    setTreeOptions(options);
  };

  // Effect to fetch table details on each reload
  useEffect(() => {
    getServiceData("regulatoryCompliance", objectId)
      .then((tableResponse) => {
        setTableDetails(tableResponse.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [objectId, refreshCharts]);

  useEffect(() => {
    if (tableDetails) {
      const { treeDataArray, regulatoryBodies } = generateTreeData(
        tableDetails,
        treeOptions
      );
      setTreeDataArray(treeDataArray);
      setRegulatoryBodies(regulatoryBodies);
    }
  }, [tableDetails, treeOptions]);
  const [processInfo, setProcessInfo] = useState();

  useEffect(() => {
    getviewData({
      viewName: "pa_gl_regulatorybody_bt",
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
    <>
      <Row className="d-flex justify-content-between align-items-start">
        <Col className="d-flex justify-content-end">
          <FontAwesomeIcon
            icon={faRefresh}
            size="lg"
            className="text-black mb-2 "
            onClick={handleRefreshClick}
          />
        </Col>
      </Row>
      {!tableDetails ||
      !tableDetails.regulatoryBodies ||
      tableDetails.regulatoryBodies.length === 0 ? (
        <ModalForm
          objectId={-1}
          formname="regulatorycompliance"
          component={
            <FormRunTime
              formService="regulatorycompliance"
              objectId={-1}
              modal
              regulatoryName={[{ value: objectId, label: processInfo?.name }]}
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
      ) : (
        <div>
          {regulatoryBodies.map((regulatoryBody, index) => (
            <Collapse
              key={regulatoryBody.id}
              className="bg-primary text-white bg-opacity-50"
              // objectId={objectId}
              renderOptionsCard={true}
              title={regulatoryBody.name}
              id={regulatoryBody.id}
              button={"extra"}
            >
              <div className="d-flex p-3 align-items-start">
                <RegulatoryTree
                  treeData={treeDataArray}
                  onOptionsUpdate={handleOptionsUpdate}
                  treeOptions={treeOptions}
                  refreshCharts={refreshCharts}
                />
              </div>
            </Collapse>
          ))}
        </div>
      )}
    </>
  );
};
const RiskAssessment = ({ objectId }) => {
  return (
    <Row>
      <Col>
        <ReportRuntime
          report="RA_RISK_ASSESSMENT_BY_REG_BODY"
          drilldownReports={{ processId: objectId }}
        />
      </Col>
    </Row>
  );
};
const Obligations = ({ objectId }) => {
  return (
    <Row>
      <Col>
        <ReportRuntime
          report="GL_RELATED_OBLIGATION_RPT"
          drilldownReports={{ processId: objectId }}
        />
      </Col>
    </Row>
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
    </Nav>
  );
};

export default Default;
