import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
// import { ExclamationTriangleFill } from "react-bootstrap-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

function Alert(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      // className="bg-blur"
      style={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
      backdrop={false}
    >
      <Modal.Header>
        <div style={{ display: "flex" }}>
          {/* <ExclamationTriangleFill className="bi flex-shrink-0 me-2" width="35" height="40" color="red" /> */}
          {props.info && <FontAwesomeIcon icon={faCircleInfo} size="lg" />}
          {props.warning && (
            <FontAwesomeIcon icon={faTriangleExclamation} size="lg" />
          )}
          <div className="h4 ms-2 ">{props.heading}</div>
        </div>
      </Modal.Header>
      <Modal.Body classnmae="text-break fixed-header  bg-white">
        <div className="ms-4 h5">{props.content}</div>
      </Modal.Body>
      <Modal.Footer style={{ padding: "5px", fontSize: "12px" }}>
        <button className="btn btn-secondary" onClick={props.onHide}>
          {props.button ? props.button : "Cancel"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default Alert;
