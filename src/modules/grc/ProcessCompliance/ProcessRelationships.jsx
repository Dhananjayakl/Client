import React, { useState, useEffect } from "react";
import Tree from "src/components/pages/Tree";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";
import { Container, Row, Col } from "react-bootstrap";
import { getTableDetails } from "../GrcService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsSpin,
  faTriangleExclamation,
  faCheckToSlot,
  faComments,
  faBriefcase,
  faPencil,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";

const generateTreeData = (tableDetails, treeOptions) => {
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
                />
                [P]{process.name}
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
              // Check if name exists and is not null
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
                        label: " ",
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
            processId: process.id,
          });
        }
      });
    });
  });

  return treeDataArray;
};

const Relationships = ({ objectId, refreshCharts, handleRefreshClick }) => {
  const [tableDetails, setTableDetails] = useState(null);
  const [treeDataArray, setTreeDataArray] = useState([]);
  const [treeOptions, setTreeOptions] = useState();
  const [processNames, setProcessNames] = useState([]);

  const handleOptionsUpdate = (options) => {
    setTreeOptions(options);
  };

  // Effect to fetch table details on each reload
  useEffect(() => {
    getTableDetails("tableinfo", objectId)
      .then((tableResponse) => {
        setTableDetails(tableResponse.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refreshCharts, objectId]);

  useEffect(() => {
    if (tableDetails) {
      const generatedTreeDataArray = generateTreeData(
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
            formname="relationship"
            component={
              <FormRunTime
                formService="relationship"
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
            formname="relationship"
            component={
              <FormRunTime
                formService="relationship"
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
        treeDataArray.map((businessUnitTree, index) => {
          return (
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
                renderOptionsCard={true}
              >
                <div className="d-flex p-3 align-items-start">
                  <Tree
                    treeData={businessUnitTree.treeData}
                    refreshCharts={refreshCharts}
                    onOptionsUpdate={handleOptionsUpdate}
                    treeOptions={treeOptions}
                    handleRefreshClick={handleRefreshClick}
                  />
                </div>
              </Collapse>
            </div>
          );
        })
      )}
    </>
  );
};

export default Relationships;
