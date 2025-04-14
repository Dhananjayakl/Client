import React, { useState, useEffect } from "react";

import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import { getBusinessDetails, getObjects, getServiceData } from "../GrcService";
import Chart from "src/components/charts/Chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportRuntime from "src/components/reports/Report";

import { useSearchParams } from "react-router-dom";

import {
  faFileAlt,
  faBriefcase,
  faUser,
  faAngleDoubleRight,
  faArrowsSpin,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";
import BusinessTree from "src/components/pages/BusinessTree";
const Default = ({ selectedFramework }) => {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  const [processName, setProcessName] = useState("null");
  const [tableDetails, setTableDetails] = useState(null);
  const [assetDetails, setAssetDetails] = useState();
  const [sopDetails, setSopDetails] = useState();
  const [thirdDetails, setThirdDetails] = useState();
  const [treeDataArray, setTreeDataArray] = useState([]);

  useEffect(() => {
    if (selectedFramework !== "") {
      Promise.all([
        getObjects("objectdetails", "asset"),
        getObjects("objectdetails", "thirdparty"),
        getObjects("objectdetails", "standardoperatingprocedures"),
      ])
        .then(([assetResponse, thirdpartyResponse, sopResponse]) => {
          setAssetDetails(assetResponse.data);
          setThirdDetails(thirdpartyResponse.data);
          setSopDetails(sopResponse.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedFramework]);
  const [busiStatus, setBusiStatus] = useState("");

  useEffect(() => {
    getServiceData("getProcessInfo", objectId)
      .then((response) => {
        const responseData = response.data;

        setProcessName(responseData.data.name);
        setBusiStatus(responseData.data.status);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    getBusinessDetails("businessinfo", objectId)
      .then((tableResponse) => {
        setTableDetails(tableResponse.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    if (tableDetails) {
      const generatedTreeDataArray = generateTreeData(tableDetails);
      assetDetails, sopDetails, thirdDetails;

      setTreeDataArray(generatedTreeDataArray);
    }
  }, [tableDetails, assetDetails, sopDetails, thirdDetails]);
  const iconMap = {
    Asset: {
      icon: faBriefcase,
      options: assetDetails,
      label: "Asset",
      source: "asset",
      value: "[A]",
    },
    "Third Party": {
      icon: faUser,
      options: thirdDetails,
      label: "Third Party",
      source: "third party",
      value: "[T]",
    },
    SOP: {
      icon: faFileAlt,
      options: sopDetails,
      label: "SOP",
      source: "sop",
      value: "[S]",
    },
  };

  const generateTreeData = (tableDetails) => {
    if (!tableDetails || !tableDetails.businessUnits) return [];

    const treeDataArray = [];

    tableDetails.businessUnits.forEach((businessUnit) => {
      businessUnit.units.forEach((unit) => {
        unit.processes.forEach((process) => {
          if (process.name) {
            const processNode = {
              title: (
                <span className="text-center fw-bold fs-5  text-black ">
                  <FontAwesomeIcon
                    icon={faArrowsSpin}
                    size="lg"
                    className=" me-2"
                  />{" "}
                  [P]{process.name}
                </span>
              ),
              toggled: true,
              expanded: true,
              formService: "risk",
              label: "Risk",
              children: [],
              isProcess: true,
              source: "risk",
              id: process.id,
              businessUnitName: businessUnit.units[0].name,
              businessUnitId: businessUnit.id,
              type: "process",
            };

            process.objectTypes.forEach((objectType) => {
              const icon = iconMap[objectType.name]?.icon;
              const options = iconMap[objectType.name]?.options;
              const label = iconMap[objectType.name]?.label;
              const source = iconMap[objectType.name]?.source;
              const value = iconMap[objectType.name]?.value;

              let isAsset = false;
              let isSop = false;
              let isThirdParty = false;

              if (objectType.name === "Asset") {
                isAsset = true;
              } else if (objectType.name === "SOP") {
                isSop = true;
              } else if (objectType.name === "Third Party") {
                isThirdParty = true;
              }

              const objectTypeNode = {
                id: objectType.id,
                name: objectType.name,
                children: [],
                isAsset: isAsset,
                isSop: isSop,
                isThirdParty: isThirdParty,
                options: options,
                label: label,
                source: source,
                value: value,

                title: (
                  <span className="text-center fw-bold fs-5  text-black ">
                    <FontAwesomeIcon icon={icon} size="lg" className=" me-2" />{" "}
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
                          <FontAwesomeIcon
                            icon={icon}
                            size="lg"
                            className="me-2"
                          />{" "}
                          {value}
                          {object.name}
                        </span>
                      ),
                    });
                  }
                });
              };

              addObjectNodes(objectType.objects, objectTypeNode);

              processNode.children.push(objectTypeNode);
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

  return (
    <div>
      <Container fluid className="p-0">
        <div className="shadow font-medium text-2xl py-2 bg-white sticky-top z-1">
          {/* <div className="float-end">
            <Button
              variant="light"
              className={`rounded-circle d-flex align-items-center justify-content-center`}
              onClick={() => {}}
            >
              <FontAwesomeIcon icon={faFilePdf} size="xl" />
              <i className="bi bi-file-earmark-pdf-fill"></i>
            </Button>
          </div> */}
        </div>

        <div className="bg-secondary d-flex  flex-wrap py-1 px-4 z-4 fs-6  rounded text-white ">
          <div>
            Relationship FrameWork{" "}
            <FontAwesomeIcon
              icon={faAngleDoubleRight}
              size="sm"
              className="me-2 text-white"
            />{" "}
            Business Resilience Framework{" "}
            <FontAwesomeIcon
              icon={faAngleDoubleRight}
              size="sm"
              className="me-2 text-white"
            />{" "}
            [{objectId}]{processName}
          </div>
        </div>

        <Tabs
          defaultActiveKey="Combined Assurance"
          id="ProcessTab"
          className="mb-3 mt-3"
        >
          <Tab eventKey="Combined Assurance" title="Combined Assurance">
            <Row>
              <Col>
                <ReportRuntime
                  report="GL_BUSINESSUNITS_BY_PROCESS"
                  drilldownReports={{ processId: objectId }}
                  dataCard
                />
                <ReportRuntime
                  report="GL_RELATED_ASSET_BY_ID"
                  drilldownReports={{ processId: objectId }}
                  dataCard
                />
                <ReportRuntime
                  report="GL_RELATED_THIRDPARTY_BY_ID"
                  drilldownReports={{ processId: objectId }}
                  dataCard
                />
                <ReportRuntime
                  report="GL_RELATED_SOP_BY_ID"
                  drilldownReports={{ processId: objectId }}
                  dataCard
                />
              </Col>

              <Col xs={3}>
                <Chart
                  chart="CT_OVERALL_COMPLIANCE_STATUS"
                  defaultFilter={{ processId: objectId }}
                />
              </Col>
              <Col>
                <ReportRuntime
                  report="GL_PROCESS_INFO_BY_ID"
                  drilldownReports={{ processId: objectId }}
                />
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="relationships" title="Relationships">
            {!tableDetails ||
            !tableDetails.businessUnits ||
            (tableDetails.businessUnits.length === 0 &&
              busiStatus === "Active") ? (
              <Container className="mt-4">
                <ModalForm
                  component={
                    <FormRunTime
                      formService="businessresilienceframework"
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
              treeDataArray.map((businessUnitTree, index) => (
                <div key={index}>
                  <Collapse
                    className="bg-primary text-white bg-opacity-50"
                    title={businessUnitTree.businessUnitName}
                    objectId={objectId}
                    businessUnitId={businessUnitTree.businessUnitId}
                    renderOptionsCard={false}
                  >
                    <div className="d-flex p-3 align-items-start">
                      <BusinessTree
                        treeData={businessUnitTree.treeData}
                        options={iconMap.options}
                        label={iconMap.label}
                        source={iconMap.source}
                      />
                    </div>
                  </Collapse>
                </div>
              ))
            )}
          </Tab>
          <Tab eventKey="BIA" title="BIA"></Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default Default;
