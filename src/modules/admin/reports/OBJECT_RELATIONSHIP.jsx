import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
//import './ReportTileLayouts.css'; // Import custom CSS for additional styling if needed
import logo from "src/assets/img/logo.png";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import { faPlusSquare, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteFromRelation } from "src/modules/admin/AdminService";
const ReportTileLayouts = (props) => {
  let { table, flexRender, refreshData, ReletionDltIcon } = props;
  console.log("Relationship Props:", props);
  return (
    <>
      {" "}
      <Row>
        {table.getRowModel().rows.map((row, rowIndex) => {
          const { original } = row;
          const rowKey = original.id || rowIndex;
          return (
            <Relationship
              rowIndex={rowIndex}
              key={rowKey}
              row={row}
              original={original}
              column={table.getAllColumns()}
              refreshdataref={refreshData}
              ReletionDltIcon={ReletionDltIcon}
            />
          );
        })}
      </Row>
    </>
  );
};

let Relationship = (props) => {
  let { rowIndex, row, original, column, refreshdataref, ReletionDltIcon } =
    props;

  let formServiceName = original.tgt_api_handler;
  // if (
  //   original.tgt_api_handler != undefined ||
  //   original.tgt_api_handler != null
  // ) {
  //   formServiceName = original.tgt_api_handler;
  // }
  let formObjectId = original.target_object_id;
  const [showModal, setShowModal] = useState(false);

  const openPopupFormLink = () => {
    const handleCloseModal = () => {
      setShowModal(false);
    };
    // const toggleShow = () => setShow((s) => !s);
    const handleClose = () => {
      setShowModal();
    };

    return (
      <Modal
        show={showModal}
        size="lg"
        onHide={() => {
          // toggleShow();
          // onHide();
        }}
      >
        <Modal.Header className="d-none">
          <div className="CloseModalForm">
            <Button onClick={handleClose} style={{ marginLeft: "5px" }}>
              Close
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <FormRunTime
            // formService={columnMeta.form || formService}
            formService={formServiceName}
            objectId={formObjectId}
            // notform={true}
            modal
          />
        </Modal.Body>
      </Modal>
    );
  };

  const handleDelete = (id) => {
    deleteFromRelation("deleteFromRelation", id)
      .then((response) => {
        refreshdataref();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Col md={6}>
      <Card className="shadow-lg bg-body-tertiary">
        <Row className=" standard-Font">
          <Col className="fw-bold">{original.tgi_title}</Col>
          <Col>
            <span className="float-end">{original.created_on}</span>
          </Col>
        </Row>
        <div className="d-flex  justify-content-between">
          <div>
            <a
              // onClick={() => setShowModal(true)}
              onClick={() => {
                setShowModal(true);
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="me-2 text-break"
            >
              {original.target_object_name}
            </a>
          </div>
          {!ReletionDltIcon && (
            <div>
              <FontAwesomeIcon
                icon={faTrashAlt}
                color="#FF0000"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleDelete(original.object_relation_ship_id);
                }}
              />
            </div>
          )}
        </div>
      </Card>
      {showModal && openPopupFormLink()}
    </Col>
  );
};
export default ReportTileLayouts;
