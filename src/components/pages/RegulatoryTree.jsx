import React, { useState, useEffect } from "react";
import SortableTree, {
  removeNodeAtPath,
} from "@nosferatu500/react-sortable-tree";
import "@nosferatu500/react-sortable-tree/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faCheckCircle,
  faBalanceScale,
  faBriefcase,
  faBuildingColumns,
} from "@fortawesome/free-solid-svg-icons";
import DynamicModalPopup from "src/components/pages/DynamicModalPopup";
import { useForm } from "react-hook-form";
import Buttons from "src/components/pages/Buttons";
import {
  getServiceData,
  insertRegulatory,
  deleteRegulatory,
  checkRegulatoryData,
} from "src/modules/grc/GrcService";
import useTheme from "../../hooks/useTheme";
import { useSearchParams } from "react-router-dom";
const RegulatoryTree = ({ treeData, flag }) => {
  const [data, setData] = useState(treeData);
  const [showModal, setShowModal] = useState(false);
  const [selectedNodeOptions, setSelectedNodeOptions] = useState([]);
  const [label, setLabel] = useState("");
  const [source, setSource] = useState("");
  const { control } = useForm();
  const [selectedOptionsBySource, setSelectedOptionsBySource] = useState({});
  const [parentNode, setParentNode] = useState(null);
  const [objectArea, setObjectArea] = useState([]);
  const [objectRequire, setObjectRequire] = useState([]);
  const [objectControl, setObjectControl] = useState([]);
  const [objectObligate, setObjectObligate] = useState([]);
  const [objectBusiness, setObjectBusiness] = useState([]);
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  const [tableDetails, setTableDetails] = useState(null);
  const { theme, setTheme } = useTheme();
  const [options, setOptions] = useState("");

  useEffect(() => {
    getServiceData("regulatoryCompliance", objectId)
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
    greatGrandParent = null,
    stopAtDeletedNode = false,
    titles = {}
  ) => {
    treeData.forEach((node) => {
      callback(
        node.id,
        parent ? parent.id : null,
        grandParent ? grandParent.id : null,
        greatGrandParent ? greatGrandParent.id : null,
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
          grandParent,
          stopAtDeletedNode
        );
      }
    });
  };
  //to access grandParent Node
  const findGrandparentNode = (treeData, targetId, aboveNode, firstNode) => {
    let result = {
      parentId: null,
      grandparentId: null,
      grandGrandparentId: null,
    };

    const traverse = (node, parent, grandparent, grandGrandparent) => {
      console.log("node", node);
      if (
        node.id === targetId &&
        node.requirementId === aboveNode &&
        node.areaofComplianceId === firstNode
      ) {
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
  //to access grandParent Delete Node
  const findGrand = (treeData, targetId, aboveNode) => {
    let result = {
      parentId: null,
      grandparentId: null,
      grandGrandparentId: null,
    };

    let found = false;

    const traverse = (node, parent, grandparent, grandGrandparent) => {
      if (found) return;
      if (node.id === targetId && node.requirementId === aboveNode) {
        if (parent && grandparent && grandGrandparent) {
          result.parentId = parent.id;
          result.grandparentId = grandparent.id;
          result.grandGrandparentId = grandGrandparent.id;
          found = true;
          return;
        }
      }

      if (node.children) {
        for (const child of node.children) {
          traverse(child, node, parent, grandparent);
          if (found) break;
        }
      }
    };

    for (const node of treeData) {
      if (found) break;
      traverse(node, null, null, null);
    }

    return found ? result : null;
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

    traverseTreeById(data, updateTableById, deletedNodeId, null, null, true);
  };
  const [nodeId, setNodeId] = useState();
  const [parentNodeId, setParentNodeId] = useState();
  const [grandParentNodeId, setGrandParentNodeId] = useState();
  const [greatGrandParent, setGreatGrandParent] = useState();

  // Function to update table data by ID
  const updateTableById = (
    nodeId,
    parentNodeId,
    grandParentNodeId,
    greatGrandParent,
    nodeType,
    titles
  ) => {
    if (grandParentNodeId === data[0].id) {
      grandParentNodeId = null;
    }
    if (parentNodeId === data[0].id) {
      parentNodeId = null;
    }
    setNodeId(nodeId);
    setParentNodeId(parentNodeId);
    setGrandParentNodeId(grandParentNodeId);
    setGreatGrandParent(greatGrandParent);
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
  const handleNodeDelete = (rowInfo, pa) => {
    handleDeleteNode(rowInfo);
    const { node } = rowInfo;
    const deletedNodeType = node.label || "";

    let grandparentNode = null;
    let areaId = null;
    let requireId = null;
    let objectTypes = node.objectType || " ";
    let objectId = node.id || " ";
    let regulatoryId = data[0]?.id || null;

    if (deletedNodeType !== "" && deletedNodeType !== "undefined") {
      grandparentNode = findGrandparentNode(treeData, node.id);
    }

    if (grandparentNode) {
      areaId = grandparentNode.grandGrandparentId;
      requireId = grandparentNode.grandparentId;
    }

    if (deletedNodeType === "Requirement") {
      regulatoryId = data[0]?.id || null;
      areaId = node.id;
      requireId = " ";
      objectId = " ";
      objectTypes = " ";
    } else if (deletedNodeType === "Extra" && grandparentNode) {
      regulatoryId = data[0]?.id || null;
      areaId = grandparentNode.parentId;
      requireId = node.id;
      objectId = " ";
      objectTypes = " ";
    } else if (deletedNodeType === "" || deletedNodeType === "undefined") {
      const parentNode = findGrand(treeData, node.id);
      if (parentNode) {
        regulatoryId = data[0]?.id || null;
        areaId = parentNode.grandGrandparentId;
        requireId = parentNode.grandparentId;
        objectTypes = node.objectType || " ";
        objectId = node.id || " ";
      }
    }

    deleteRegulatory(
      "deleteRegulatoryData",
      regulatoryId,
      areaId,
      requireId,
      objectTypes,
      objectId
    )
      .then((response) => {})
      .catch((err) => {
        console.error("Error while deleting node:", err);
      });
  };

  // Function to handle adding a new node

  const handleAddButtonClick = async (parentNode) => {
    try {
      const grandparentNode = findGrandparentNode(treeData, parentNode.id);

      let regulatoryId = data[0].id;
      let areaId = grandparentNode.grandparentId;
      let requireId = grandparentNode.parentId;
      let objectTypes = parentNode.label;
      let deletedNodeType = parentNode.label;

      if (deletedNodeType == "Area of Compliance") {
        regulatoryId = data[0].id;
        areaId = "";
        requireId = "";

        objectTypes = " ";
      } else if (
        deletedNodeType === "Compliance" ||
        deletedNodeType === "Requirement"
      ) {
        regulatoryId = data[0].id;
        areaId = parentNode.id;
        requireId = "";

        objectTypes = " ";
      } else if (
        deletedNodeType === "Controls" ||
        deletedNodeType === "Obligations" ||
        deletedNodeType === "Business Unit"
      ) {
        const grandparentNode = findGrandparentNode(
          treeData,
          parentNode.id,
          parentNode.requirementId,
          parentNode.areaofComplianceId
        );
        regulatoryId = data[0].id;
        areaId = grandparentNode.grandparentId;
        requireId = grandparentNode.parentId;
        objectTypes = parentNode.id;
      }

      const response = await checkRegulatoryData(
        "CheckExistRegulatory",
        regulatoryId,
        areaId,
        requireId,
        objectTypes
      );

      const newOptions = response.data;
      setOptions(newOptions);
      setShowModal(true);
      setSelectedNodeOptions(Array.isArray(newOptions) ? newOptions : []);
      setLabel(parentNode.label);
      setSource(parentNode.source);
      setParentNode(parentNode);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // Function to create a new node
  const handleCreateNode = (parentNode, label, source) => {
    let title,
      icon,
      value,
      newLabel,
      isBusiness,
      isArea,
      isRequire,
      isControls,
      isObligate,
      isBusinessUnit,
      formService,
      serviceOptions;

    let insertedName = "";
    let insertedNodeId = "";

    if (parentNode.label === "Area of Compliance") {
      objectArea.forEach((item) => {
        insertedName = item.name;
        insertedNodeId = item.id;
        return <span key={item.id}>[A]{item.name}</span>;
      });

      title = (
        <span className="text-center fw-bold fs-5 text-black">
          <FontAwesomeIcon icon={faBriefcase} className=" me-2" size="lg" />
          [A]
          {insertedName}
        </span>
      );
      icon = faBriefcase;
      isRequire = true;
      value = "[A]";

      (formService = "areaofcompliance"), (newLabel = "Requirement");
    } else if (parentNode.label === "Requirement") {
      objectRequire.forEach((item) => {
        insertedName = item.name;
        insertedNodeId = item.id;
        return <span key={item.id}>[A]{item.name}</span>;
      });

      title = (
        <span className="text-center fw-bold fs-5 text-black">
          <FontAwesomeIcon icon={faClipboardList} className=" me-2" size="lg" />
          [C]
          {insertedName}
        </span>
      );
      icon = faClipboardList;
      value = "[C]";
      isBusiness = true;

      (newLabel = "Requirement"), (formService = "requirement");
    } else if (parentNode.label === "Requirement") {
      objectRequire.forEach((item) => {
        insertedName = item.name;
        insertedNodeId = item.id;
        return <span key={item.id}>[A]{item.name}</span>;
      });

      title = (
        <span className="text-center fw-bold fs-5 text-black">
          <FontAwesomeIcon icon={faClipboardList} className=" me-2" size="lg" />
          [R]
          {insertedName}
        </span>
      );
      icon = faClipboardList;
      value = "[R]";
      isBusiness = true;
      (formService = "requirement"), (newLabel = "Control");
    } else if (parentNode.label === "Controls") {
      objectControl.forEach((item) => {
        insertedName = item.name;
        insertedNodeId = item.id;
        return <span key={item.id}>[A]{item.name}</span>;
      });

      title = (
        <span className="text-center fw-bold fs-5 text-black">
          <FontAwesomeIcon icon={faClipboardList} className=" me-2" size="lg" />
          [R]
          {insertedName}
        </span>
      );
      (icon = faCheckCircle),
        (serviceOptions = ""),
        (label = "Controls"),
        (source = "control"),
        (value = "[R]"),
        (isBusiness = true);
    } else if (parentNode.label === "Obligations") {
      objectObligate.forEach((item) => {
        insertedName = item.name;
        insertedNodeId = item.id;
        return <span key={item.id}>[A]{item.name}</span>;
      });

      title = (
        <span className="text-center fw-bold fs-5 text-black">
          <FontAwesomeIcon icon={faClipboardList} className=" me-2" size="lg" />
          [O]
          {insertedName}
        </span>
      );
      (icon = faBalanceScale),
        (serviceOptions = ""),
        (label = "Obligations"),
        (source = "obligation"),
        (value = "[O]"),
        (isBusiness = true);
    } else if (parentNode.label === "BuisnessUnits") {
      objectBusiness.forEach((item) => {
        insertedName = item.name;
        insertedNodeId = item.id;
        return <span key={item.id}>[BU]{item.name}</span>;
      });

      title = (
        <span className="text-center fw-bold fs-5 text-black">
          <FontAwesomeIcon
            icon={faBuildingColumns}
            className=" me-2"
            size="lg"
          />
          [BU]
          {insertedName}
        </span>
      );
      (icon = faBuildingColumns),
        (serviceOptions = ""),
        (label = "Business Unit"),
        (source = "Buisness Unit"),
        (value = "[BU]"),
        (isBusinessUnit = true);
    }

    const objectType = parentNode.id;
    const newRequirementNode = {
      title: (
        <span className="text-center fw-bold fs-5 text-black ">
          <FontAwesomeIcon icon={icon} size="lg" className="me-2" />
          {value}
          {insertedName}
        </span>
      ),
      source: source,
      toggled: true,
      children: [],
      label: newLabel,
      isArea: isArea,
      isRequire: isRequire,
      isControls: isControls,
      isObligate: isObligate,
      isBusiness: isBusiness,
      isBusinessUnit: isBusinessUnit,
      expanded: true,
      objectType,
    };

    if (parentNode) {
      const updatedData = addNodesToParent(
        data,
        [newRequirementNode],

        source,
        parentNode
      );
      setData(updatedData);
    } else {
      setData([...data, newRequirementNode]);
    }
    const deletedNodeType = parentNode.label;

    let areaId = parentNode.id;
    let requireId = grandParentNodeId;
    let objectTypes = objectType;
    let objectId = nodeId;
    let regulatoryId = data[0].id;

    if (deletedNodeType == "Area of Compliance") {
      regulatoryId = data[0].id;
      areaId = insertedNodeId;
      requireId = "";
      objectId = " ";
      objectTypes = " ";
    } else if (deletedNodeType === "Requirement") {
      regulatoryId = data[0].id;
      areaId = parentNode.id;
      requireId = insertedNodeId;
      objectId = " ";
      objectTypes = " ";
    } else if (
      deletedNodeType === "Controls" ||
      deletedNodeType === "Obligations" ||
      deletedNodeType === "Business Unit"
    ) {
      const grandparentNode = findGrandparentNode(
        treeData,
        parentNode.id,
        parentNode.requirementId,
        parentNode.areaofComplianceId
      );
      regulatoryId = data[0].id;
      areaId = grandparentNode.grandparentId;
      requireId = grandparentNode.parentId;
      objectTypes = parentNode.id;
      objectId = insertedNodeId;
    }

    insertRegulatory(
      "insertRegulatoryData",
      regulatoryId,
      areaId,
      requireId,
      objectTypes,
      objectId
    )
      .then((response) => {})
      .catch((err) => {
        console.log(err);
      });
  };
  //   // Function to handle modal hide
  const handleModalHide = (selectedOptions, label, source, options) => {
    setShowModal(false);
    setSource(parentNode.source);

    const selectedOptionValues = selectedOptions.map((option) => option.value);
    const selectedOptionNames = selectedOptions.map((option) => option.label);
    const objectType = parentNode ? parentNode.id : null;

    if (!selectedOptionNames[0] || selectedOptionNames[0].trim() === "") {
      return;
    }

    if (selectedOptionValues[0] === null) {
      return null;
    }

    const labelConfigurations = {
      "Area of Compliance": {
        formService: "areaofcompliance",
        serviceOptions: options,
        label: "Area of Compliance",
        icon: faBriefcase,
        isRequire: true,
        value: "[A]",
        type: "areaOfCompliance",
      },
      Requirement: {
        formService: "requirement",
        serviceOptions: options,
        label: "Requirement",
        icon: faClipboardList,
        value: "[R]",
        type: "requirement",
        isBusiness: true,
      },
      Controls: {
        icon: faCheckCircle,
        serviceOptions: options,
        label: "Controls",
        source: "control",
        value: "[C]",
        isBusiness: true,
      },
      Obligations: {
        icon: faBalanceScale,
        serviceOptions: options,
        label: "Obligations",
        source: "obligation",
        value: "[O]",
        isBusiness: true,
      },
      "Business Unit": {
        icon: faBuildingColumns,
        serviceOptions: options,
        label: "Business Unit",
        source: "Buisness Unit",
        value: "[BU]",
        isBusiness: true,
      },
      default: {},
    };

    const {
      formService = null,
      serviceOptions = null,
      newLabel = label,
      icon = null,
      isArea = false,
      isRequire = false,
      isControls = false,
      isObligate = false,
      isBusiness = false,
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
            isArea: isArea,
            isRequire: isRequire,
            isControls: isControls,
            isObligate: isObligate,
            isBusiness: isBusiness,
            id: value,
            expanded: true,
            objectType: objectType,
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
    const insertedId = selectedOptionValues;

    const deletedNodeType = label;
    let areaId = parentNode.id;
    let requireId = grandParentNodeId;
    let objectTypes = objectType;
    let objectId = insertedId;
    let regulatoryId = data[0].id;

    if (deletedNodeType == "Area of Compliance") {
      regulatoryId = data[0].id;
      areaId = insertedId;
      requireId = "";
      objectId = " ";
      objectTypes = " ";
    } else if (
      deletedNodeType === "Compliance" ||
      deletedNodeType === "Requirement"
    ) {
      regulatoryId = data[0].id;
      areaId = parentNode.id;
      requireId = insertedId;
      objectId = " ";
      objectTypes = " ";
    } else if (
      deletedNodeType === "Controls" ||
      deletedNodeType === "Obligations" ||
      deletedNodeType === "Business Unit"
    ) {
      const grandparentNode = findGrandparentNode(
        treeData,
        parentNode.id,
        parentNode.requirementId,
        parentNode.areaofComplianceId
      );
      regulatoryId = data[0].id;
      areaId = grandparentNode.grandparentId;
      requireId = grandparentNode.parentId;
      objectTypes = parentNode.id;
      objectId = insertedId;
    }

    if (selectedOptionValues[0] !== undefined) {
      insertRegulatory(
        "insertRegulatoryData",
        regulatoryId,
        areaId,
        requireId,
        objectTypes,
        objectId
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
  // Function to generate node content
  const [isClicked, setIsClicked] = useState(false);

  const generateNodeContent = ({ node, path }) => {
    const handleClick = () => {
      setIsClicked(!isClicked);
    };

    return (
      <>
        <Buttons
          isBusiness={node.isBusiness}
          isArea={node.isArea}
          isRequire={node.isRequire}
          isControls={node.isControls}
          isObligate={node.isObligate}
          isBusinessUnit={node.isBusinessUnit}
          handleAddButtonClick={(options) =>
            handleAddButtonClick(node, options)
          }
          handleDeleteNode={() => handleNodeDelete({ node, path, parentNode })}
          handleCreateNode={(rowInfo) => handleCreateNode(node, rowInfo)}
          objectArea={objectArea}
          setObjectArea={setObjectArea}
          objectRequire={objectRequire}
          setObjectRequire={setObjectRequire}
          objectControl={objectControl}
          setObjectControl={setObjectControl}
          objectObligate={objectObligate}
          setObjectObligate={setObjectObligate}
        />
        <span className="ms-2" style={{ marginRight: 0 }} onClick={handleClick}>
          {isClicked ||
          typeof node.title.props.children[2] !== "string" ||
          node.title.props.children[2].length <= 70
            ? node.title
            : `${node.title.props.children[2].slice(0, 70)}•••`}
        </span>
      </>
    );
  };

  return (
    <div
      style={{ width: "900px", height: "500px" }}
      className={`tree-container ${theme === "dark" ? "dark-theme" : ""}`}
    >
      <SortableTree
        treeData={data}
        onChange={handleTreeOnChange}
        canDrag={false}
        generateNodeProps={({ node, path }) => ({
          title: generateNodeContent({ node, path }),
        })}
        objectArea={objectArea}
        objectRequire={objectRequire}
        objectControl={objectControl}
        objectObligate={objectObligate}
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

export default RegulatoryTree;
