import React, { useState, useEffect } from "react";
import { Card, Col, Dropdown, ButtonGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpShortWide,
  faBatteryHalf,
  faBoltLightning,
} from "@fortawesome/free-solid-svg-icons";
import axios from "src/utils/AxiosInstance";
import { partialupdateObjectData } from "src/components/forms/reactformutils/elements/PartialUpdate";
import { toast } from "react-toastify";

const ReportTileLayouts = (props) => {
  let { page, headerGroups, prepareRow, refreshData } = props;
  const [selectOptions, setSelectOptions] = useState({});
  const [jsonData, setJsondata] = useState();
  const [objectId, setObjectId] = useState();

  if (!headerGroups || headerGroups.length === 0) {
    return <div>No Records Available</div>;
  }

  const showToastMessage = (message, type) => {
    if (type === "success") {
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 500,
        closeButton: false,
      });
    } else if (type === "error") {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  const patchupdate = (objectId, fieldKey, optionValue) => {
    const updateData = {
      [fieldKey]: optionValue,
    };
    setJsondata(updateData);
    setObjectId(objectId);
    refreshData();
  };

  useEffect(() => {
    if (jsonData && objectId) {
      const sendUpdateRequest = async () => {
        try {
          await partialupdateObjectData("createticket", objectId, jsonData);
          showToastMessage("Updated successfully!", "success");
        } catch (error) {
          console.error("Error updating data:", error);
          showToastMessage("Updated failed.", "error");
        }
      };
      sendUpdateRequest();
    }
  }, [jsonData, objectId]);

  useEffect(() => {
    const callpicklist = async () => {
      try {
        const response = await axios.get(`form/createticket/-1`);
        const data = response?.data?.meta?.resources;

        Object.keys(data).forEach((fieldName) => {
          const fieldValue = data[fieldName];
          const transformedData = fieldValue.map((item) => ({
            value: item.key,
            label: item.value,
          }));
          setSelectOptions((prevOptions) => ({
            ...prevOptions,
            [fieldName]: transformedData,
          }));
        });
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    callpicklist();
  }, []);

  return (
    <>
      {page.map((row, rowIndex) => {
        prepareRow(row);
        const subjectCell = row.cells.find(
          (cell) => cell.column.Header === "Subject"
        );
        const createdOnCell = row.cells.find(
          (cell) => cell.column.Header === "Created On"
        );
        const createdByCell = row.cells.find(
          (cell) => cell.column.Header === "Created By"
        );
        const statusCell = row.cells.find(
          (cell) => cell.column.Header === "Status"
        );
        // const priorityCell = row.cells.find(
        //   (cell) => cell.column.Header === "Priority"
        // );
        // const urgencyCell = row.cells.find(
        //   (cell) => cell.column.Header === "Urgency"
        // );
        const objectId = row.original.object_id;
        return (
          <Card key={rowIndex} className="m-4 cardDesign">
            <div className="d-flex">
              <Col lg={10} md={9}>
                <div className="ms-2  mt-3 ">
                  <span className=" ms-5   text-bg-danger ps-1 pe-1">
                    {statusCell ? statusCell.value : "N/A"}
                  </span>
                  {/* <span className=" ms-5   text-bg-danger ps-1 pe-1">
                    {priorityCell ? priorityCell.value : "N/A"}
                  </span>
                  <span className=" ms-5   text-bg-danger ps-1 pe-1">
                    {urgencyCell ? urgencyCell.value : "N/A"}
                  </span> */}
                </div>
                <div className="ms-2  mt-3">
                  <span className="h4 ms-5">
                    {headerGroups[0]?.headers[1]?.Header}:
                  </span>
                  <span className="h4 ms-2">
                    {subjectCell ? subjectCell.value : "N/A"} [#{objectId}]
                  </span>
                </div>
                <div className="mt-3 ms-2">
                  <span className="h4 ms-5">
                    {headerGroups[0]?.headers[13]?.Header}:
                  </span>
                  <span className="h4 ms-2">
                    {createdOnCell
                      ? new Date(createdOnCell.value).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="mt-3 ms-2">
                  <span className="h4 ms-5">
                    {headerGroups[0]?.headers[12]?.Header}:
                  </span>
                  <span className="h4 ms-2">
                    {createdByCell ? createdByCell.value : "N/A"}
                  </span>
                </div>
              </Col>
              <Col lg={1} md={2}>
                <Dropdown as={ButtonGroup} className="mt-3">
                  <Button variant="primary" disabled className="buttonSize">
                    <FontAwesomeIcon
                      icon={faArrowUpShortWide}
                      className="me-3"
                    />
                    {headerGroups[0]?.headers[5]?.Header}
                  </Button>
                  <Dropdown.Toggle variant="light"></Dropdown.Toggle>

                  <Dropdown.Menu>
                    {selectOptions["RI_PRIORITY"] &&
                      selectOptions["RI_PRIORITY"].map((option) => (
                        <Dropdown.Item
                          key={option.value}
                          onClick={() => {
                            patchupdate(objectId, "priority", option.value);
                          }}
                        >
                          {option.label}
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown as={ButtonGroup} className="mt-1">
                  <Button variant="primary" disabled className="buttonSize">
                    <FontAwesomeIcon icon={faBatteryHalf} className="me-3" />
                    {headerGroups[0]?.headers[11]?.Header}
                  </Button>
                  <Dropdown.Toggle variant="light"></Dropdown.Toggle>
                  <Dropdown.Menu>
                    {selectOptions["RI_TICKET_STATUS"] &&
                      selectOptions["RI_TICKET_STATUS"].map((option) => (
                        <Dropdown.Item
                          key={option.value}
                          onClick={() => {
                            patchupdate(objectId, "ticketStatus", option.value);
                          }}
                        >
                          {option.label}
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown as={ButtonGroup} className="mt-1">
                  <Button variant="primary" disabled className="buttonSize">
                    <FontAwesomeIcon icon={faBoltLightning} className="me-2" />
                    {headerGroups[0]?.headers[4]?.Header}
                  </Button>
                  <Dropdown.Toggle variant="light"></Dropdown.Toggle>
                  <Dropdown.Menu>
                    {selectOptions["RI_URGENCY"] &&
                      selectOptions["RI_URGENCY"].map((option) => (
                        <Dropdown.Item
                          key={option.value}
                          onClick={() => {
                            patchupdate(objectId, "urgency", option.value);
                          }}
                        >
                          {option.label}
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </div>
          </Card>
        );
      })}
    </>
  );
};

export default ReportTileLayouts;
