import React, { useState, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { Button, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { getviewData } from "../AdminService";
import { Modal } from "react-bootstrap";
import BusinessEntity from "src/components/forms/reactformutils/FormRuntimeEngine";
import { useNavigate } from "react-router-dom";

const BusinessUnitTree = ({ businessUnitId }) => {
  const [businessunitData, setBusinessUnitData] = useState([]);
  const [collapsedNodes, setCollapsedNodes] = useState({});
  const [isRootCollapsed, setIsRootCollapsed] = useState(true);
  const [rootData, setRootData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);
  let navigate = useNavigate();

  const handleAddNewUnit = (parentId) => {
    setSelectedParentId(parentId);
    setShowForm(true);
  };

  const fetchData = async () => {
    const viewParams = {
      viewName: "pa_business_entity_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: "",
    };

    try {
      const response = await getviewData(viewParams);
      setBusinessUnitData(response.data.data);
    } catch (error) {
      console.error("Error fetching business unit data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (businessunitData.length) {
      const rootBusinessUnit = businessunitData.find(
        (bu) => bu.business_entity_id === businessUnitId
      );
      setRootData(rootBusinessUnit);
    }
  }, [businessunitData, businessUnitId]);

  const toggleCollapse = (unitId) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  const callChildTree = (parentId) => {
    const childUnits = businessunitData.filter(
      (bu) => bu.parent_entity_id === parentId
    );

    return childUnits.map((child) => {
      const isCollapsed = collapsedNodes[child.business_entity_id] || false;
      const hasChildren = businessunitData.some(
        (bu) => bu.parent_entity_id === child.business_entity_id
      );

      return (
        <TreeNode
          key={child.business_entity_id}
          label={
            <Container className="d-flex justify-content-center align-items-center ">
              <div
                className="border border-dark rounded p-2"
                style={{
                  width: "200px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div className="d-flex align-items-center">
                  {hasChildren && (
                    <Button
                      size="sm"
                      variant="link"
                      onClick={() => toggleCollapse(child.business_entity_id)}
                      style={{ padding: 0 }}
                    >
                      <FontAwesomeIcon
                        size="xs"
                        icon={faChevronDown}
                        style={{
                          transform: isCollapsed
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    </Button>
                  )}
                  <span className="mx-2 text-center">
                    <a
                      onClick={() => {
                        navigate(
                          `/page?name=GL_BU_SUMMARY&objectId=${rootData.business_entity_id}`
                        );
                      }}
                    >
                      {child.business_entity_name}
                    </a>
                  </span>
                  <Button
                    size="sm"
                    variant="none"
                    className="rounded-circle bg-purple text-white d-flex justify-content-center align-items-center"
                    onClick={() => handleAddNewUnit(child.business_entity_id)}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "#6f42c1",
                    }}
                  >
                    <FontAwesomeIcon size="xs" icon={faAdd} />
                  </Button>
                </div>
              </div>
            </Container>
          }
        >
          {!isCollapsed && callChildTree(child.business_entity_id)}
        </TreeNode>
      );
    });
  };

  if (!rootData) {
    return null;
  }

  return (
    <>
      <Container className="tree-container " >
        <Tree
          lineHeight="20px"
          lineWidth={isRootCollapsed ? "0px" : "2px"}
          lineColor="green"
          lineBorderRadius="10px"
          lineStyle="solid"
          label={
            <Container className="d-flex justify-content-center align-items-center  mt-3">
              <div
                className="border border-dark rounded p-2"
                style={{
                  width: "200px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div className="d-flex align-items-center">
                  <Button
                    size="sm"
                    variant="link"
                    onClick={() => setIsRootCollapsed(!isRootCollapsed)}
                    style={{ padding: 0 }}
                  >
                    <FontAwesomeIcon
                      size="xs"
                      icon={faChevronDown}
                      style={{
                        transform: !isRootCollapsed
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </Button>
                  <span className="mx-2 text-center ">
                    <a
                      onClick={() => {
                        navigate(
                          `/page?name=GL_BU_SUMMARY&objectId=${rootData.business_entity_id}`
                        );
                      }}
                    >
                      {rootData.business_entity_name}
                    </a>
                  </span>
                  <Button
                    size="sm"
                    variant="none"
                    className="rounded-circle bg-purple text-white d-flex justify-content-center align-items-center"
                    onClick={() =>
                      handleAddNewUnit(rootData.business_entity_id)
                    }
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "#6f42c1",
                    }}
                  >
                    <FontAwesomeIcon size="xs" icon={faAdd} />
                  </Button>
                </div>
              </div>
            </Container>
          }
        >
          {!isRootCollapsed && callChildTree(rootData.business_entity_id)}
        </Tree>
      </Container>
      {showForm && (
        <Modal
          show={showForm}
          onHide={() => {
            console.log("dsas", selectedParentId);
            setShowForm(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add New Business Unit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BusinessEntity
              formService="businessunit"
              objectId={-1}
              parentEntityName={selectedParentId}
              callbackParent={() => {
                setShowForm(false);
                fetchData();
              }}
              modal
            />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default BusinessUnitTree;
