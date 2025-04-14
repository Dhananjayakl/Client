import React, { useState, useEffect } from "react";
import CustomTooltip from "src/components/forms/reactformutils/fields/FieldToolTip";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import search from "../../../assets/img/illustrations/searching.png";

const ObjectInfo = ({
  moduleId,
  selectedItems,
  setSelectedItems,
  selectedObjectType,
  moduleData,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState({});

  const handleSelectedItems = (module_id, object_type, object_name) => {
    const selectedItem = {
      module_id,
      object_type,
      object_name,
      id: `${module_id}-${object_type}-${object_name}`,
    };

    setSelectedItems((prevState) => {
      const index = prevState.findIndex((item) => item.id === selectedItem.id);
      if (index > -1) {
        // Item found, remove it
        return [...prevState.slice(0, index), ...prevState.slice(index + 1)];
      } else {
        // Item not found, add it
        return [...prevState, selectedItem];
      }
    });
  };

  const filteredModuleData =
    Object.keys(moduleData).length > 0
      ? Object.keys(moduleData).reduce((filteredData, obj) => {
          let filteredItems = [];

          if (selectedObjectType && moduleData[selectedObjectType]) {
            if (obj === selectedObjectType) {
              filteredItems = moduleData[selectedObjectType].filter((item) =>
                item.object_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              );
            }
          } else {
            filteredItems = moduleData[obj]?.filter((item) =>
              item.object_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }

          if (filteredItems && filteredItems.length > 0) {
            filteredData[obj] = filteredItems;
          }

          return filteredData;
        }, {})
      : {};

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const noObjectsFound = Object.keys(filteredModuleData).length === 0;

  if (!selectedObjectType || !moduleData[selectedObjectType]) {
    return (
      <Card>
        <Card.Header
          className="d-flex  pt-2 mb-0 pb-1  bg-body-tertiary 
      justify-content-between align-items-center shadow"
        >
          <Card.Title className="fw-semibold text-primary">
            All objects
          </Card.Title>
          <div>
            <Form.Control
              type="text"
              placeholder="🔍 Search by Object Name..."
              value={searchTerm}
              className="float-end me-2 bg-body-secondary"
              onChange={handleSearchChange}
            />
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            {noObjectsFound ? (
              <div className="vh-50  d-flex justify-content-center align-items-center">
                <h3 className="text-primary fw-bolder">No objects found...</h3>
                <img src={search} style={{ height: "150px" }} alt="no result" />
              </div>
            ) : (
              Object.keys(filteredModuleData).map((obj, index) => (
                <Col className="p-0 m-0" key={index} sm={12}>
                  <Card className="mb-3 ms-0">
                    <Card.Header className="h5 text-primary fw-bolder p-0 pt-2 ps-2">
                      {obj.charAt(0).toUpperCase() + obj.slice(1).toLowerCase()}
                    </Card.Header>

                    <Card.Body>
                      <Row xs={1} sm={2} md={2}>
                        {filteredModuleData[obj] &&
                          Object.entries(filteredModuleData[obj]).map(
                            ([subKey, value], innerIndex) => (
                              <Col
                                key={subKey}
                                className={`text-primary d-flex ps-2 p-0 pe-0 justify-content-start align-items-center
                                  pb-1  my-1  `}
                              >
                                <div className="d-inline-block text-truncate">
                                  <CustomTooltip
                                    tooltip={`${value.object_type}: ${value.object_name}`}
                                  >
                                    <div className="d-flex justify-content-between  align-items-center">
                                      <Form.Check
                                        type="checkbox"
                                        label={value.object_name}
                                        className="me-1"
                                        checked={selectedItems.some(
                                          (item) =>
                                            item.id ===
                                            `${value.module_id}-${value.object_type}-${value.object_name}`
                                        )}
                                        onChange={() =>
                                          handleSelectedItems(
                                            value.module_id,
                                            value.object_type,
                                            value.object_name
                                          )
                                        }
                                      />
                                    </div>
                                  </CustomTooltip>
                                </div>
                              </Col>
                            )
                          )}
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Card.Body>
      </Card>
    );
  }

  const selectAllObjects = () => {
    setSelectAll((prevSelectAll) => ({
      ...prevSelectAll,
      [selectedObjectType]: !prevSelectAll[selectedObjectType],
    }));

    setSelectedItems((prevItems) => {
      if (!selectAll[selectedObjectType]) {
        // Select all items
        const allItems = Object.keys(moduleData[selectedObjectType] || {}).map(
          (key) => ({
            module_id: moduleId,
            object_type: selectedObjectType,
            object_name: moduleData[selectedObjectType][key].object_name,
            id: `${moduleId}-${selectedObjectType}-${moduleData[selectedObjectType][key].object_name}`,
          })
        );

        // Add only items that are not already selected
        const newItems = allItems.filter(
          (item) =>
            !prevItems.some((selectedItem) => selectedItem.id === item.id)
        );

        return [...prevItems, ...newItems];
      } else {
        // Deselect all items of the current object type
        return prevItems.filter(
          (item) => item.object_type !== selectedObjectType
        );
      }
    });
  };

  return (
    <Card className="m-0  p-0">
      <Card.Header
        className="d-flex  pt-2 mb-0 pb-1  bg-body-tertiary 
      justify-content-between align-items-center shadow"
      >
        <Card.Title className="fw-semibold  text-primary mt-1">
          {selectedObjectType}
        </Card.Title>
        <div className="d-flex justify-content-center align-items-center">
          <Button style={{ width: "150px" }} onClick={selectAllObjects}>
            {selectAll[selectedObjectType] ? "Deselect All" : "Select All"}
          </Button>
          <Form.Control
            type="text"
            placeholder="🔍 Search by Object Name..."
            value={searchTerm}
            className="float-end me-2 ms-1 bg-body-secondary"
            onChange={handleSearchChange}
          />
        </div>
      </Card.Header>
      <Card.Body>
        <Row xs={12} sm={6} md={6} lg={2}>
          {noObjectsFound ? (
            <div className="d-flex justify-content-center align-items-center">
              <h3 className="text-primary fw-bolder">No objects found...</h3>
              <img src={search} style={{ height: "150px" }} alt="no result" />
            </div>
          ) : (
            filteredModuleData[selectedObjectType] &&
            Object.entries(filteredModuleData[selectedObjectType]).map(
              ([subKey, value], index) => (
                <Col key={subKey}>
                  <Row>
                    <Col
                      className={`text-primary d-flex ps-2 p-0 pe-0 justify-content-start align-items-center
                      pb-1  my-1  `}
                    >
                      <CustomTooltip
                        tooltip={`${value.object_type}: ${value.object_name}`}
                      >
                        <div className="d-inline-block text-truncate justify-content-between  align-items-center">
                          <Form.Check
                            type="checkbox"
                            label={value.object_name}
                            className="me-1"
                            checked={selectedItems.some(
                              (item) =>
                                item.id ===
                                `${value.module_id}-${value.object_type}-${value.object_name}`
                            )}
                            onChange={() =>
                              handleSelectedItems(
                                value.module_id,
                                value.object_type,
                                value.object_name
                              )
                            }
                          />
                        </div>
                      </CustomTooltip>
                    </Col>
                  </Row>
                </Col>
              )
            )
          )}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ObjectInfo;
