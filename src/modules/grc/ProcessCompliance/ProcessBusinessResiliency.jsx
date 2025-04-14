import React, { useState, useEffect } from "react";
import { Container, Row, Col, Tab, Card, Nav } from "react-bootstrap";
import { getBusinessDetails } from "../GrcService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsSpin,
  faBriefcase,
  faPencil,
  faRefresh,
  faUser,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";
import BusinessTree from "src/components/pages/BusinessTree";

const generateBusinessTree = (tableDetails, treeOptions) => {
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
          const iconMap = {
            Asset: {
              icon: faBriefcase,
              options: treeOptions,
              label: "Asset",
              source: "asset",
              value: "[A]",
            },
            "Third Party": {
              icon: faUser,
              options: treeOptions,
              label: "Third Party",
              source: "third party",
              value: "[T]",
            },
            SOP: {
              icon: faFileAlt,
              options: treeOptions,
              label: "SOP",
              source: "sop",
              value: "[S]",
            },
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
            processId: process.id,
          });
        }
      });
    });
  });

  return treeDataArray;
};

const ProcessBusinessResiliency = ({
  objectId,
  refreshCharts,
  handleRefreshClick,
}) => {
  const [tableDetails, setTableDetails] = useState(null);
  const [treeDataArray, setTreeDataArray] = useState([]);
  const [treeOptions, setTreeOptions] = useState();
  const [processNames, setProcessNames] = useState([]);

  const handleOptionsUpdate = (options) => {
    setTreeOptions(options);
  };

  useEffect(() => {
    if (objectId) {
      getBusinessDetails("businessinfo", objectId)
        .then((tableResponse) => {
          setTableDetails(tableResponse.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [objectId, refreshCharts]);

  useEffect(() => {
    if (tableDetails) {
      const generatedTreeDataArray = generateBusinessTree(
        tableDetails,
        treeOptions
      );
      setTreeDataArray(generatedTreeDataArray);
      const allProcessNames = generatedTreeDataArray.map((item) => ({
        value: item.processId,
        label: item.processName,
      }));
      setProcessNames(allProcessNames);
    }
  }, [tableDetails, treeOptions]);

  return (
    <>
      <Row className="d-flex justify-content-between align-items-start">
        <Col className="d-flex justify-content-end mb-0">
          <ModalForm
            objectId={-1}
            formname="businessresilienceframework"
            component={
              <FormRunTime
                formService="businessresilienceframework"
                objectId={-1}
                modal
                processName={[
                  { value: objectId, label: processNames[0]?.label },
                ]}
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
      {!tableDetails ||
      !tableDetails.businessUnits ||
      tableDetails.businessUnits.length === 0 ? (
        <Container className="mt-4">
          <ModalForm
            objectId={-1}
            formname="businessresilienceframework"
            component={
              <FormRunTime
                formService="businessresilienceframework"
                objectId={-1}
                modal
                processName={[
                  { value: objectId, label: processNames[0]?.label },
                ]}
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
              objectId={[
                { value: objectId, label: businessUnitTree.processName },
              ]}
              businessUnitId={[
                {
                  value: businessUnitTree.businessUnitId,
                  label: businessUnitTree.businessUnitName,
                },
              ]}
              renderOptionsCard={false}
            >
              <div class="d-flex p-3 align-items-start">
                <BusinessTree
                  treeData={businessUnitTree.treeData}
                  refreshCharts={refreshCharts}
                  onOptionsUpdate={handleOptionsUpdate}
                  treeOptions={treeOptions}
                />
              </div>
            </Collapse>
          </div>
        ))
      )}
    </>
  );
};
export default ProcessBusinessResiliency;
