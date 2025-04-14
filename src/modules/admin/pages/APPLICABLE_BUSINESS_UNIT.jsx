import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import logo from "src/assets/img/logo.png";

// import { BusinessUnitTree } from "src/components/reports/BusinessUnitTree";

const ReportTileLayouts = (props) => {
  let { table, flexRender } = props;

  return (
    <>
      <BusinessUnitTree businessUnitId={1} />
    </>
  );
};

export default ReportTileLayouts;

import { Tree, TreeNode } from "react-organizational-chart";
import { Button, Container, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { getviewData } from "/src/modules/admin/AdminService";
import BusinessEntity from "src/components/forms/reactformutils/FormRuntimeEngine";
import { useNavigate } from "react-router-dom";
import { TextWrap } from "react-bootstrap-icons";

export const BusinessUnitTree = ({ businessUnitId }) => {
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

  useEffect(() => {
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

    fetchData();
  }, [showForm]);

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

  const callchildTree = (parentId) => {
    const childUnits = businessunitData.filter(
      (bu) => bu.parent_entity_id === parentId
    );

    return childUnits.map((child) => {
      const isCollapsed = collapsedNodes[child.business_entity_id] || false;
      const hasChildren = businessunitData.some(
        (bu) => bu.parent_entity_id === child.business_entity_id
      );

      return (
        <>
        <TreeNode
          label={
            <Container
              className="d-flex justify-content-center align-items-center"
              style={{ whiteSpace: "wrap" }}
            >
              <div
                className="border border-dark rounded p-2 text-center"
                style={{ width: "200px" }}
              >
                <span className="d-flex align-items-center">
                  {hasChildren && (
                    <Button
                      size="sm"
                      variant="link"
                      className="me-2"
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
                  <span style={{ TextWrap: "wrap" }}>
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
                    className="rounded-circle bg-purple text-white d-flex justify-content-center align-items-center ms-2"
                    onClick={() => handleAddNewUnit(child.business_entity_id)}
                    style={{
                      width: "5x",
                      height: "20px",
                      backgroundColor: "#6f42c1",
                    }}
                  >
                    <FontAwesomeIcon
                      size="xs"
                      icon={faAdd}
                      style={{ backgroundColor: "#6f42c1" }}
                    />
                  </Button>
                </span>
              </div>
            </Container>
          }
          key={child.business_entity_id}
        >
          {!isCollapsed && callchildTree(child.business_entity_id)}
        </TreeNode>
        <H1>COMING</H1>
        </>
      );
    });
  };

  return (
    <>
      {rootData && (
        <Container
          className="tree-container"
          style={{
            overflowX: "auto",
          }}
        >
          <Tree
            lineHeight="20px"
            lineWidth={"2px"}
            lineColor={"green"}
            lineBorderRadius={"10px"}
            lineStyle={"solid"}
            label={
              <Container className="d-flex justify-content-center align-items-center">
                <div
                  className="border border-dark rounded p-2 text-center"
                  style={{ width: "200px" }}
                >
                  <span className="d-flex align-items-center">
                    <Button
                      size="sm"
                      variant="link"
                      className="me-2"
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
                    <a
                      onClick={() => {
                        navigate(
                          `/page?name=GL_BU_SUMMARY&objectId=${rootData.business_entity_id}`
                        );
                      }}
                    >
                      {rootData.business_entity_name}
                    </a>
                    <Button
                      size="sm"
                      variant="none"
                      className="rounded-circle bg-purple text-white d-flex justify-content-center align-items-center ms-2"
                      onClick={() =>
                        handleAddNewUnit(rootData.business_entity_id)
                      }
                      style={{
                        width: "5x",
                        height: "20px",
                        backgroundColor: "#6f42c1",
                      }}
                    >
                      <FontAwesomeIcon
                        size="xs"
                        icon={faAdd}
                        style={{ backgroundColor: "#6f42c1" }}
                      />
                    </Button>
                  </span>
                </div>
              </Container>
            }
          >
            {!isRootCollapsed && callchildTree(rootData.business_entity_id)}
          </Tree>
        </Container>
      )}

      {showForm && (
        <Modal
          show={showForm}
          onHide={() => {
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
              }}
              modal
            />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
