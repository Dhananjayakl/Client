import React, { useState, useEffect } from "react";
import SortableTree, {
  removeNodeAtPath,
} from "@nosferatu500/react-sortable-tree";
import "@nosferatu500/react-sortable-tree/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faBriefcase,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import DynamicModalPopup from "src/components/pages/DynamicModalPopup";
import { useForm } from "react-hook-form";
import Buttons from "src/components/pages/Buttons";
import {
  deleteBusiness,
  insertBusiness,
  checkBuisnessData,
  getBusinessDetails,
} from "src/modules/grc/GrcService";
import useTheme from "../../hooks/useTheme";
import { useSearchParams } from "react-router-dom";
const BusinessTree = ({ treeData, flag }) => {
  const [data, setData] = useState(treeData);
  const [showModal, setShowModal] = useState(false);
  const [selectedNodeOptions, setSelectedNodeOptions] = useState([]);
  const [label, setLabel] = useState("");
  const [source, setSource] = useState("");
  const { control } = useForm();
  const [selectedOptionsBySource, setSelectedOptionsBySource] = useState({});
  const [parentNode, setParentNode] = useState(null);
  const [objectAsset, setObjectAsset] = useState([]);
  const [objectSop, setObjectSop] = useState([]);
  const [objectThird, setObjectThird] = useState([]);
  const { theme, setTheme } = useTheme();
  const [options, setOptions] = useState("");
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");

  useEffect(() => {
    getBusinessDetails("businessinfo", objectId)
      .then((tableResponse) => {
        setTableDetails(tableResponse.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [data]);
  useEffect(() => {
    setData(treeData);
  }, [treeData]);

  const handleTreeOnChange = (treeData) => {
    setData(treeData);
  };
  const [deleteNode, setDeleteNode] = useState("");

  //   Function to delete a node from the tree
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

  // Function to handle node deletion
  const handleNodeDelete = (rowInfo) => {
    handleDeleteNode(rowInfo);
    const { node } = rowInfo;
    const deletedNode = node.id;
    const objectType = node.objectType;
    const processId = data[0].id;
    const BusinessUnitId = data[0].businessUnitId;

    deleteBusiness(
      "deleteBusiness",
      processId,
      BusinessUnitId,
      objectType,
      deletedNode
    )
      .then((response) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  // Function to handle adding a new node
  const handleAddButtonClick = async (parentNode) => {
    try {
      const processId = data[0].id;
      const BusinessUnitId = data[0].businessUnitId;
      const objectType = parentNode ? parentNode.id : null;

      const response = await checkBuisnessData(
        "CheckExistBusiness",
        processId,
        BusinessUnitId,
        objectType
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
    let title, icon, newLabel, isBusiness;
    let insertedName = "";
    let insertedNodeId = "";
    const objectType = parentNode.id;

    let selectedObject = null;

    if (parentNode.label === "Asset") {
      selectedObject = objectAsset[0];
      icon = faBriefcase;
    } else if (parentNode.label === "Third Party") {
      selectedObject = objectThird[0];
      icon = faUser;
    } else {
      selectedObject = objectSop[0];
      icon = faFileAlt;
    }

    if (!selectedObject) return;

    insertedName = selectedObject.name;
    insertedNodeId = selectedObject.id;
    isBusiness = true;

    const nodeAlreadyExists = parentNode.children?.some(
      (child) => child.id === insertedNodeId
    );
    if (nodeAlreadyExists) {
      console.warn("Node already exists.");
      return;
    }

    const prefix =
      parentNode.label === "Asset"
        ? "A"
        : parentNode.label === "Third Party"
        ? "T"
        : "S";
    title = (
      <span className="text-center fw-bold fs-5 text-black">
        <FontAwesomeIcon icon={icon} className="me-2" size="lg" />[{prefix}]
        {insertedName}
      </span>
    );

    const newNodes = {
      title,
      source,
      toggled: true,
      children: [],
      formService: "someFormService",
      options: [],
      label: newLabel,
      isBusiness,
      objectType,
      id: insertedNodeId,
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

    const testId = insertedNodeId;
    const processId = data[0].id;
    const BusinessUnitId = data[0].businessUnitId;

    insertBusiness(
      "insertBusiness",
      processId,
      BusinessUnitId,
      objectType,
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
    setOptions(selectedOptions);

    const selectedOptionValues = selectedOptions.map((option) => option.value);

    const labelConfigurations = {
      Asset: {
        newLabel: "SOP",
        value: "[A]",
        icon: faBriefcase,
        isBusiness: true,
      },
      SOP: {
        newLabel: "Third Party",
        value: "[S]",
        icon: faFileAlt,
        isBusiness: true,
      },
      "Third Party": {
        value: "[T]",
        icon: faUser,
        isBusiness: true,
      },
      default: {
        value: "[T]",
      },
    };

    // Destructuring configurations
    const {
      newLabel = label,
      value = "",
      icon = null,
      isBusiness = false,
    } = labelConfigurations[label] || labelConfigurations.default;

    const objectType = parentNode ? parentNode.id : null;

    // Create new nodes based on selected options
    const newNodes =
      selectedOptionValues[0] !== null
        ? selectedOptions.map((option) => ({
            title: (
              <span className="text-center fw-bold fs-5 text-black ">
                <FontAwesomeIcon size="lg" icon={icon} className="me-2" />
                {value}
                {option.label}
              </span>
            ),
            source: source,
            toggled: true,
            children: [],
            label: newLabel,
            id: option.value,
            isBusiness: isBusiness,
            objectType: objectType,
          }))
        : [];

    if (parentNode) {
      // Add new nodes to the parent node
      const updatedData = addNodesToParent(
        data,
        newNodes,
        source,
        parentNode,
        options
      );

      setData(updatedData);
    } else {
      setData([...data, ...newNodes]);
    }

    setSelectedOptionsBySource((prevState) => ({
      ...prevState,
      [source]: options,
    }));

    setParentNode(null);

    const processId = data[0].id;
    const BusinessUnitId = data[0].businessUnitId;

    if (selectedOptionValues[0] !== undefined) {
      insertBusiness(
        "insertBusiness",
        processId,
        BusinessUnitId,
        objectType,
        selectedOptionValues
      )
        .then((response) => {
          console.log("Insert Business Success:", response);
        })
        .catch((err) => {
          console.log("Insert Business Error:", err);
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
  //   // Function to generate node content
  const [isClicked, setIsClicked] = useState(false);
  const generateNodeContent = ({ node, path }) => {
    const handleClick = () => {
      setIsClicked(!isClicked);
    };
    return (
      <>
        <Buttons
          isBusiness={node.isBusiness}
          isAsset={node.isAsset}
          isSop={node.isSop}
          isThirdParty={node.isThirdParty}
          handleAddButtonClick={(options) =>
            handleAddButtonClick(node, options)
          }
          handleDeleteNode={() => handleNodeDelete({ node, path })}
          handleCreateNode={(rowInfo) => handleCreateNode(node, rowInfo)}
          objectAsset={objectAsset}
          setObjectAsset={setObjectAsset}
          objectSop={objectSop}
          setObjectSop={setObjectSop}
          objectThird={objectThird}
          setObjectThird={setObjectThird}
        />
        <span className="m-2" style={{ marginRight: 0 }} onClick={handleClick}>
          {isClicked ||
          typeof node.title.props.children[3] !== "string" ||
          node.title.props.children[3].length <= 80
            ? node.title
            : `${node.title.props.children[3].slice(0, 80)}•••`}
        </span>
      </>
    );
  };

  return (
    <div
      className={`tree-container ${theme === "dark" ? "dark-theme" : ""}`}
      style={{ width: "900px", height: "500px" }}
    >
      <SortableTree
        treeData={data}
        onChange={handleTreeOnChange}
        canDrag={false}
        generateNodeProps={({ node, path }) => ({
          title: generateNodeContent({ node, path }),
        })}
        objectAsset={objectAsset}
        objectSop={objectSop}
        objectThird={objectThird}
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

export default BusinessTree;
