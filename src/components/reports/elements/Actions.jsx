import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import axios from "src/utils/AxiosInstance";
import { useState } from "react";
import { toast } from "react-toastify";

const Actions = ({ value, row, columnMeta, refreshData }) => {
  let columnName = columnMeta.column_name;
  let reportId = columnMeta.report_id;
  let reportType = columnMeta.record_type;

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

  const updatedData = {
    ...row.original,
    recordType: reportType,
  };

  const deleteObject = async (row) => {
    try {
      const response = await axios.put(
        `ajaxcall?reportId=${reportId}&columnName=${columnName}`,
        updatedData
      );
      refreshData();
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete?")) {
      deleteObject(row);
    }
    // showToastMessage("Deleted Succesfully!", "success");
  };

  return (
    <>
      <Button variant="light" onClick={handleDelete}>
        <FontAwesomeIcon icon={faTrash} size="lg" />
      </Button>{" "}
    </>
  );
};

export default Actions;
