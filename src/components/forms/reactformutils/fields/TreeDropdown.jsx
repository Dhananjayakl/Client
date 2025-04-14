import DropdownTreeSelect from "react-dropdown-tree-select";
import React, { useState, useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import FieldDom from "./FieldDom";
import { LogIn, Search } from "react-feather";
import axios from "src/utils/AxiosInstance";
import { expressionbuilder } from "./SselectExpressionBuilder";
import "react-dropdown-tree-select/dist/styles.css";
import useTheme from "../../../../hooks/useTheme";
import { useTranslation } from "react-i18next";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
} from "react-bootstrap";
function TreeDropdown(props) {
  let {
    formid,
    colum,
    control,
    required,
    name,
    editable,
    field_title,
    formMetaData,
    formMethods,
    fieldProps,
    ...rest
  } = props;
  const isMulti = formMetaData.fields?.[name]?.is_multi_select ? true : false;
  console.log(formMetaData.fields[name], "jaguar");
  const { t } = useTranslation("common");
  const field_name = name;
  const lastDotIndex = field_name.lastIndexOf(".");
  let firstDotIndex = field_name.split(".");
  const extractedFieldName =
    lastDotIndex !== -1 ? field_name.slice(lastDotIndex + 1) : field_name;
  let lastIndex = name.lastIndexOf(".");
  let extractedSubstring = name.substring(0, lastIndex + 1);
  let [treeData, setTreeData] = useState([]);
  let [onChangeFlag, setOnChangeFlag] = useState(false);
  let [modalShow, setModalShow] = useState(false);
  let FieldData = useWatch({ name: name, control: control });
  const [firstRun, setFirstRun] = useState(false);
  let [initialRender, setInitialRender] = useState(false);
  let [labelValue, setLabelValue] = useState([]);
  console.log(labelValue, "label--value");

  const { theme, setTheme } = useTheme(); //theme is used either dark or light
  const expandData = (data) => {
    return data.map((node) => {
      return {
        ...node,
        expanded: true,
      };
    });
  };
  async function callbackend() {
    let BuiltExpresison;
    if (formMetaData?.fields[name].filter_expression != null) {
      BuiltExpresison = expressionbuilder(
        formMethods,
        formMetaData.fields[name].filter_expression,
        formMetaData.fields[extractedFieldName].stored_column,
        ""
      );
    }
    // console.log(field_name, "fetch5");
    try {
      console.log("call-api");

      const response = await axios.post("/form/fetchDataSourceInfo", {
        formId: formid,
        columnName: colum,
        searchString: "",
        filterExpression: BuiltExpresison ? BuiltExpresison : "",
        orderExpression: "",
        pageSize: "12",
        businessUnitValues: "",
      });
      const data = await response.data;
      if (formMetaData.fields[name].display_type == "treeDropdown") {
        let expandedData = expandData(data);
        setTreeData(expandedData);
        if (expandData) {
          setFirstRun(true);
        }
      }
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  }
  useEffect(() => {
    if (firstRun == false) {
      callbackend();
    }
  }, []);
  const FieldValue = useWatch({
    name: extractedFieldName,
    control: control,
  });

  useEffect(() => {
    console.log(FieldValue, "Field value--is--here");
  }, [FieldValue]);

  useEffect(() => {
    console.log("initial-render-data", FieldData);

    const markSelectedNodesInitial = (
      nodes,
      selectedValues,
      childValue = false
    ) => {
      console.log(selectedValues, "leo-das-01");

      return nodes.map((node) => {
        let isSelected = false;
        if (Array.isArray(selectedValues)) {
          isSelected = selectedValues.some((val) => val == node.value);
        } else if (!Array.isArray(selectedValues) && selectedValues) {
          console.log(selectedValues, node.value, "tree-iteration");

          isSelected = selectedValues == node.value;
        }
        // else{
        //   isSelected=childValue
        // }
        console.log(isSelected, "is-selected-here");

        return {
          ...node,
          checked: isSelected,
          children:
            node.children.length > 0
              ? markSelectedNodesInitial(
                  node.children,
                  selectedValues,
                  isSelected
                ) // Correct recursive call
              : [], // Ensure empty children remain empty
        };
      });
    };

    if (FieldData && onChangeFlag == false && firstRun == true) {
      console.log(FieldData, "field-data");
      let checkedData = markSelectedNodesInitial(treeData, FieldData, false);
      setTreeData(checkedData);
      console.log(checkedData, "check--data--1");
    }
  }, [FieldData, firstRun]);
  const findLabelById = (nodes, selectedIds) => {
    if (!Array.isArray(selectedIds)) {
      selectedIds = [selectedIds]; // Convert to array if it's a single value
    }

    let labels = [];

    selectedIds.forEach((selectedNode) => {
      const findNodeLabel = (nodes, selectedNode) => {
        for (const node of nodes) {
          if (node.value === selectedNode) {
            return node.label;
          }
          if (node.children.length > 0) {
            const foundLabel = findNodeLabel(node.children, selectedNode);
            if (foundLabel) return foundLabel;
          }
        }
        return null;
      };

      const label = findNodeLabel(nodes, selectedNode);
      console.log(label, "labels-are-here");

      if (label) labels.push(label);
    });

    return labels; // Return an array of labels
  };

  useEffect(() => {
    console.log(editable, "editable-tree");

    if (
      treeData?.length > 0 &&
      initialRender == false &&
      editable == false &&
     FieldData
    ) {
      console.log(FieldData, "FieldData--is--here");

      let fetchedResult = findLabelById(treeData, FieldData);
      setLabelValue(fetchedResult);
      console.log(fetchedResult, "fetched-result");

      setInitialRender(true);
      console.log(treeData, "got--tree--data");
    }
  }, [treeData, FieldData]);
  // Function to update `selected` property inside data
  const markSelectedNodes = (nodes, selectedValues, childValue = false) => {
    return nodes.map((node) => {
      const isSelected =
        selectedValues.some((val) => val.value == node.value) || childValue;
      return {
        ...node,
        checked: isSelected,
        children:
          node.children.length > 0
            ? markSelectedNodes(node.children, selectedValues, isSelected) // Correct recursive call
            : [], // Ensure empty children remain empty
      };
    });
  };

  console.log(formMetaData.fields[name].options_in_model, "treeData-is-here");
  console.log(treeData, "tree-data-is-here");

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required && editable,
          message: `${t(field_title)} ${t("is required")}!`,
        },
      }}
      render={({ field }) => {
        console.log(field.value, "porsche-gt3rs");

        return (
          <FieldDom {...props} fieldProps={fieldProps}>
            <div className="w-100">
              {editable ? (
                <DropdownTreeSelect
                  keepOpenOnSelect={true}
                  texts={{ placeholder: `${field_title}` }}
                  // disabled={true}
                  className={
                    // formMetaData.fields[name].options_in_model
                    // ?
                    "react-tree react-tree-none"
                    // : "react-tree"
                  }
                  {...field}
                  data={treeData} // Ensure selected values are marked
                  mode={isMulti ? "" : "radioSelect"}
                  onFocus={(e) => {
                    // callbackend()
                    // if (formMetaData.fields[name].options_in_model) {
                    setModalShow(true);
                    // }
                    console.log(e, "e123");
                  }}
                  onChange={(currentNode, selectedNodes) => {
                    if (onChangeFlag == false) {
                      setOnChangeFlag(true);
                    }
                    let onChangedData = markSelectedNodes(
                      treeData,
                      selectedNodes,
                      false
                    );
                    setTreeData(onChangedData);
                    console.log(onChangedData, "on--changed--data");
                    let selectedValueId = selectedNodes.map((items) => {
                      return items.value;
                    });

                    console.log(selectedValueId[0], "selectedValue--id");

                    field.onChange(
                      isMulti == true ? selectedValueId : selectedValueId[0]
                    ); // Sync with React Hook Form
                  }}
                  {...rest}
                />
              ) : Array.isArray(labelValue) ? (
                labelValue?.map((items) => {
                  return <li>{items}</li>;
                })
              ) : (
                <span>{labelValue}</span>
              )}

              <Modal
                show={modalShow}
                onHide={() => setModalShow(!modalShow)}
                size="md"
              >
                <ModalBody className="ms-0 w-100">
                  <div className="w-100 m-0 p-0">
                    <DropdownTreeSelect
                      keepOpenOnSelect={true}
                      keepChildrenOnSearch={true}
                      keepTreeOnSearch={true}
                      showPartiallySelected={true}
                      texts={{ placeholder: " 🔍︎ Search" }}
                      // disabled={true}
                      showDropdown="always"
                      className={"react-tree-modal"}
                      {...field}
                      data={treeData} // Ensure selected values are marked
                      mode={
                        formMetaData?.fields?.[name].is_multi_select
                          ? ""
                          : "radioSelect"
                      }
                      onFocus={(e) => {
                        setModalShow(true);
                        console.log(e, "e123");
                      }}
                      onChange={(currentNode, selectedNodes) => {
                        if (onChangeFlag == false) {
                          setOnChangeFlag(true);
                        }
                        let onChangedData = markSelectedNodes(
                          treeData,
                          selectedNodes,
                          false
                        );
                        setTreeData(onChangedData);
                        console.log(
                          onChangedData,
                          selectedNodes,
                          "on--changed--data"
                        );
                        let selectedValueId = selectedNodes.map((items) => {
                          return items.value;
                        });
                        console.log(selectedValueId, "selected-value-id1");

                        field.onChange(
                          isMulti == true ? selectedValueId : selectedValueId[0]
                        ); // Sync with React Hook Form
                      }}
                      {...rest}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  {/* <Button onClick={clearData}>Clear All</Button> */}
                  <Button className="m-0 " onClick={() => setModalShow(false)}>
                    Close
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
            {/* {labelValue?.length>0&&!editable&&(
                labelValue.map((items)=>{
                  return(
   <li>{items}</li>
                  )
                })
        
          )} */}
          </FieldDom>
        );
      }}
    />
  );
}

export default TreeDropdown;
