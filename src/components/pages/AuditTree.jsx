import React, { useState, useEffect } from "react";
import SortableTree, {
  removeNodeAtPath,
} from "@nosferatu500/react-sortable-tree";
import "@nosferatu500/react-sortable-tree/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faCheckToSlot,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import DynamicModalPopup from "src/components/pages/DynamicModalPopup";
import { useForm } from "react-hook-form";
import Buttons from "src/components/pages/Buttons";
import {
  deleteAudits,
  insertAuditData,
  getTableDetail,
  checkData,
} from "src/modules/grc/GrcService";
import useTheme from "../../hooks/useTheme";
import { useSearchParams } from "react-router-dom";
const AuditTree = ({
  treeData,
  flag,
  controlDetails,
  testDetails,
  callback,
  onOptionsUpdate,
}) => {
  const [data, setData] = useState(treeData);
  const [showModal, setShowModal] = useState(false);
  const [selectedNodeOptions, setSelectedNodeOptions] = useState([]);
  const [label, setLabel] = useState("");
  const [source, setSource] = useState("");
  const { control } = useForm();
  const [selectedOptionsBySource, setSelectedOptionsBySource] = useState({});
  const [parentNode, setParentNode] = useState(null);
  const [objectRisk, setObjectRisk] = useState([]);
  const [objectControl, setObjectControl] = useState([]);
  const [objectTest, setObjectTest] = useState([]);
  const [parentRiskId, setParentRiskId] = useState();
  const [tableDetails, setTableDetails] = useState(null);
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  const { theme, setTheme } = useTheme();
  const [options, setOptions] = useState("");

  useEffect(() => {
    getTableDetail("getAuditData", objectId)
      .then((tableResponse) => {
        setTableDetails(tableResponse.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data]);

  // Function to traverse tree data by ID
  const traverseTreeById = (
    treeData,
    callback,
    deletedNodeId,
    parent = null,
    grandParent = null,
    stopAtDeletedNode = false,
    titles = {}
  ) => {
    treeData.forEach((node) => {
      callback(
        node.id,
        parent ? parent.id : null,
        grandParent ? grandParent.id : null,
        node.type
      );

      if (stopAtDeletedNode && node.id === deletedNodeId) {
        return;
      }
      if (node.children) {
        traverseTreeById(
          node.children,
          callback,
          deletedNodeId,
          node,
          parent,
          stopAtDeletedNode
        );
      }
    });
  };
  //to access grandParent Node
  const findGrandparentNode = (treeData, parentId) => {
    let grandparentNode = null;
    const traverse = (node, parent) => {
      if (node.id === parentId) {
        grandparentNode = parent;
        return;
      }

      if (node.children) {
        node.children.forEach((child) => traverse(child, node));
      }
    };

    treeData.forEach((node) => traverse(node, null));

    return grandparentNode;
  };

  //to access grandParent Node
  const findGrandparentNodes = (treeData, targetId, aboveNode) => {
    let result = {
      parentId: null,
      grandparentId: null,
      grandGrandparentId: null,
    };

    const traverse = (node, parent, grandparent, grandGrandparent) => {
      if (node.id === targetId && node.requirementId === aboveNode) {
        result.parentId = parent ? parent.id : null;
        result.grandparentId = grandparent ? grandparent.id : null;
        result.grandGrandparentId = grandGrandparent
          ? grandGrandparent.id
          : null;
        return;
      }

      if (node.children) {
        node.children.forEach((child) =>
          traverse(child, node, parent, grandparent)
        );
      }
    };

    treeData.forEach((node) => traverse(node, null, null, null));

    return result;
  };

  useEffect(() => {
    setData(treeData);
  }, [treeData]);

  const handleTreeOnChange = (treeData) => {
    setData(treeData);
  };

  const [deleteNode, setDeleteNode] = useState("");
  // Function to delete a node from the tree
  const handleDeleteNode = (rowInfo) => {
    const { node, path } = rowInfo;
    const deletedNodeId = node.id;
    setDeleteNode(deletedNodeId);
    const newData = removeNodeAtPath({
      treeData: data,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex,
    });

    setData(newData);
  };
  const [nodeId, setNodeId] = useState();
  const [parentNodeId, setParentNodeId] = useState();
  const [grandParentNodeId, setGrandParentNodeId] = useState();

  // Function to update table data by ID
  const updateTableById = (
    nodeId,
    parentNodeId,
    grandParentNodeId,
    nodeType,
    titles
  ) => {
    setNodeId(nodeId);
    setParentNodeId(parentNodeId);
    setGrandParentNodeId(grandParentNodeId);
  };

  useEffect(() => {
    traverseTreeById(
      treeData,
      updateTableById,
      deleteNode,
      null,
      null,
      false,
      {}
    );
  }, [data]);

  // Function to handle node deletion
  const handleNodeDelete = (rowInfo) => {
    handleDeleteNode(rowInfo);
    const { node } = rowInfo;
    const deletedNodeType = node.label;
    const grandparentNode = findGrandparentNodes(treeData, node.id);
    let riskId = grandparentNode.grandparentId;
    let controlId = grandparentNode.parentId;
    let testId = node.id;
    const ProcessId = data[0].id;
    const BusinessUnitId = data[0].businessUnitId;

    if (deletedNodeType === "" || deletedNodeType === "Testing") {
      controlId = grandparentNode.parentId;
      riskId = grandparentNode.grandparentId;
      testId = node.id;
    } else if (deletedNodeType === "Test and Procedure") {
      riskId = grandparentNode.parentId;
      controlId = node.id;
      testId = "";
    } else if (deletedNodeType === "Controls") {
      riskId = node.id;
      controlId = "";
      testId = "";
    }

    deleteAudits(
      "deleteAuditData",
      ProcessId,
      BusinessUnitId,
      riskId,
      controlId,
      testId
    )
      .then((response) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  // Function to handle adding a new node
  const handleAddButtonClick = async (parentNode) => {
    try {
      const grandparentNode = findGrandparentNodes(treeData, parentNode.id);
      const processId = data[0].id;
      const BusinessUnitId = data[0].businessUnitId;

      let riskId = grandparentNode.grandparentId;
      let controlId = grandparentNode.parentId;
      let testId = grandparentNode.parentId;
      let deletedNodeType = parentNode.label;

      if (deletedNodeType === "Test and Procedure") {
        riskId = grandparentNode.parentId;
        controlId = parentNode.id;
        testId = "";
      } else if (deletedNodeType === "Controls") {
        riskId = parentNode.id;
        controlId = "";
        testId = "";
      } else if (deletedNodeType === "Risk") {
        riskId = "";
        controlId = "";
        testId = "";
      }

      const response = await checkData(
        "CheckExistAudit",
        processId,
        BusinessUnitId,
        riskId,
        controlId,
        testId
      );

      const newOptions = response.data;
      setOptions(newOptions);
      setSelectedNodeOptions(Array.isArray(newOptions) ? newOptions : []);
      setLabel(parentNode.label);
      setSource(parentNode.source);
      setParentNode(parentNode);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  // Function to create a new node
  const handleCreateNode = (parentNode, label, source) => {
    let title, icon, newLabel, isControl, isTest, isTestProcedure, type;
    let insertedName = "";
    let deletedNodeId = "";

    if (parentNode.label === "Risk") {
      objectRisk.forEach((item) => {
        insertedName = item.name;
        deletedNodeId = item.id;
        return <span key={item.id}>{item.name}</span>;
      });

      title = (
        <span className="text-center fw-bold fs-5 text-black">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className=" me-2"
            size="lg"
          />
          [R]{insertedName}
        </span>
      );
      icon = faTriangleExclamation;
      newLabel = "Controls";
      isControl = true;
      isTest = true;
      (isTestProcedure = false), (type = "risk");
    } else if (parentNode.label === "Controls") {
      objectControl.forEach((item) => {
        insertedName = item.name;
        deletedNodeId = item.id;
        return <span key={item.id}>[C]{item.name}</span>;
      });

      title = (
        <span className="text-center fw-bold fs-5 text-black">
          <FontAwesomeIcon icon={faCheckToSlot} className=" me-2" size="lg" />
          [C]{insertedName}
        </span>
      );
      icon = faCheckToSlot;
      newLabel = "Test and Procedure";
      isControl = false;
      isTest = true;
      (isTestProcedure = false), (type = "control");
    } else {
      objectTest.forEach((item) => {
        insertedName = item.name;
        deletedNodeId = item.id;
        return <span key={item.id}>[T]{item.name}</span>;
      });

      title = (
        <span className="text-center fw-bold fs-5 text-black">
          <FontAwesomeIcon icon={faComments} className=" me-2" size="lg" />
          [T]{insertedName}
        </span>
      );
      icon = faComments;
      newLabel = "Testing";
      isControl = false;
      isTest = false;
      (isTestProcedure = true), (type = "test");
    }

    const newNodes = {
      title,
      source,
      toggled: true,
      formService: "someFormService",
      options: [],
      label: newLabel,
      isTest,
      isTestProcedure,
      isControl,
      id: deletedNodeId,
    };

    if (parentNode) {
      const updatedData = addNodesToParent(
        data,
        [newNodes],
        source,
        parentNode
      );

      setData(updatedData);
    } else {
      setData([...data, newNodes]);
    }

    const deletedNodeType = parentNode.label;

    let riskId = parentRiskId;
    let controlId = parentNode.id;
    let testId = deletedNodeId;
    const processId = data[0].id;
    const BusinessUnitId = data[0].businessUnitId;

    if (deletedNodeType === "Test and Procedure") {
      const grandparentNode = findGrandparentNode(treeData, parentNode.id);
      controlId = parentNode.id;
      riskId = grandparentNode.id;
      testId = deletedNodeId;
    } else if (deletedNodeType === "Controls") {
      riskId = parentNode.id;
      controlId = deletedNodeId;
      testId = "";
    } else if (deletedNodeType === "Risk") {
      riskId = deletedNodeId;
      controlId = "";
      testId = "";
    }

    insertAuditData(
      "insertAudit",
      processId,
      BusinessUnitId,
      riskId,
      controlId,
      testId
    )
      .then((response) => {})
      .catch((err) => {
        console.log(err);
      });
  };
  // Function to handle modal hide
  const handleModalHide = (selectedOptions, label, source, options) => {
    setShowModal(false);
    setSource(parentNode.source);
    const selectedOptionValues = selectedOptions.map((option) => option.value);

    const labelConfigurations = {
      Risk: {
        formService: "control",
        serviceOptions: controlDetails,
        newLabel: "Controls",
        icon: faTriangleExclamation,
        isControl: true,
        isTest: true,
        isTestProcedure: false,
        value: "[R]",
        type: "risk",
      },
      Controls: {
        formService: "testandprocedures",
        serviceOptions: testDetails,
        newLabel: "Test and Procedure",
        icon: faCheckToSlot,
        isControl: false,
        isTest: true,
        isTestProcedure: false,
        value: "[C]",
        type: "control",
      },
      "Test and Procedure": {
        formService: "testandprocedures",
        serviceOptions: testDetails,
        newLabel: "Testing",
        icon: faComments,
        isControl: false,
        isTest: false,
        isTestProcedure: true,
        value: "[T]",
        type: "test",
      },
      default: {
        icon: faComments,
        isControl: false,
        isTest: false,
        isTestProcedure: true,
        value: "[T]",
      },
    };

    const {
      formService = null,
      serviceOptions = null,
      newLabel = label,
      icon = null,
      isControl = false,
      isTest = false,
      isTestProcedure = false,
      value = "",
    } = labelConfigurations[label] || labelConfigurations.default;

    const newNodes =
      selectedOptionValues[0] !== null
        ? selectedOptions.map((option) => ({
            title: (
              <span className="text-center fw-bold fs-5 text-black ">
                <FontAwesomeIcon icon={icon} size="lg" className="me-2" />
                {value}
                {option.label}
              </span>
            ),
            source: source,
            toggled: true,
            children: [],
            formService: formService,
            options: serviceOptions,
            label: newLabel,
            isTest: isTest,
            isTestProcedure: isTestProcedure,
            isControl: isControl,
            id: option.value,
          }))
        : [];
    if (parentNode) {
      const updatedData = addNodesToParent(
        data,
        newNodes,
        source,
        parentNode,
        selectedOptions
      );
      setData(updatedData);
    } else {
      setData([...data, ...newNodes]);
    }

    setSelectedOptionsBySource((prevState) => ({
      ...prevState,
      [source]: selectedOptions,
    }));

    setParentNode(null);

    const deletedNodeType = label;
    let riskId = parentRiskId;
    let controlId = parentNode.id;
    traverseTreeById(
      treeData,
      updateTableById,
      controlId,
      null,
      null,
      false,
      {}
    );

    let testId = selectedOptionValues;
    const processId = data[0].id;
    const BusinessUnitId = data[0].businessUnitId;

    if (deletedNodeType === "Test and Procedure") {
      const grandparentNode = findGrandparentNode(treeData, parentNode.id);
      riskId = grandparentNode.id;
      testId = selectedOptionValues;
    } else if (deletedNodeType === "Controls") {
      riskId = parentNode.id;
      controlId = selectedOptionValues;
      testId = "";
    } else if (deletedNodeType === "Risk") {
      riskId = selectedOptionValues;
      controlId = "";
      testId = "";
    }

    if (selectedOptionValues[0] !== undefined) {
      insertAuditData(
        "insertAudit",
        processId,
        BusinessUnitId,
        riskId,
        controlId,
        testId
      )
        .then((response) => {})
        .catch((err) => {
          console.log(err);
        });
    }
  };
  // Function to add nodes to parent
  const addNodesToParent = (treeData, newNodes, source, parentNode) => {
    return treeData.map((node) => {
      if (node === parentNode) {
        return {
          ...node,
          children: [...(node.children || []), ...newNodes],
        };
      } else if (node.children) {
        return {
          ...node,
          children: addNodesToParent(
            node.children,
            newNodes,
            source,
            parentNode
          ),
        };
      } else {
        return node;
      }
    });
  };

  const [isClicked, setIsClicked] = useState(false);

  // Function to generate node content
  const generateNodeContent = ({ node, path }) => {
    const handleClick = () => {
      setIsClicked(!isClicked);
    };

    return (
      <>
        <Buttons
          isProcess={node.isProcess}
          isControl={node.isControl}
          isTest={node.isTest}
          isTestProcedure={node.isTestProcedure}
          handleAddButtonClick={(options) =>
            handleAddButtonClick(node, options)
          }
          handleDeleteNode={() => handleNodeDelete({ node, path })}
          handleCreateNode={(rowInfo) => handleCreateNode(node, rowInfo)}
          objectRisk={objectRisk}
          setObjectRisk={setObjectRisk}
          objectControl={objectControl}
          setObjectControl={setObjectControl}
          objectTest={objectTest}
          setObjectTest={setObjectTest}
        />
        <span className="ms-2" style={{ marginRight: 0 }} onClick={handleClick}>
          {isClicked ||
          typeof node.title.props.children[2] !== "string" ||
          node.title.props.children[2].length <= 75
            ? node.title
            : `${node.title.props.children[2].slice(0, 75)}•••`}
        </span>
      </>
    );
  };

  return (
    <div className={`tree-container ${theme === "dark" ? "dark-theme" : ""}`}>
      <SortableTree
        treeData={data}
        onChange={handleTreeOnChange}
        canDrag={false}
        generateNodeProps={({ node, path }) => ({
          title: generateNodeContent({ node, path }),
        })}
        objectRisk={objectRisk}
        objectControl={objectControl}
        objectTest={objectTest}
      />

      <DynamicModalPopup
        control={control}
        show={showModal}
        title="Select an Object"
        options={selectedNodeOptions}
        buttonLabel="Select"
        label={label}
        onHide={handleModalHide}
        source={source}
        flag={flag}
      />
    </div>
  );
};

export default AuditTree;
