import React from "react";
import Modal from "react-bootstrap/Modal";
import { QuestionCircleFill } from "react-bootstrap-icons";

function Notify(props) {
  const handleYesClick = () => {
    if (props.onYesClick) {
      props.onYesClick();
    }
    props.onHide();
  };

  const handleNoClick = () => {
    if (props.onNoClick) {
      props.onNoClick();
    }
    props.onHide();
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div style={{ display: "flex" }}>
          <QuestionCircleFill
            className="bi flex-shrink-0 me-2"
            width="25"
            height="25"
            color="red"
          />
          {props.content}
        </div>
      </Modal.Body>
      <Modal.Footer style={{ padding: "5px", fontSize: "12px" }}>
        <button className="btn btn-secondary" onClick={handleYesClick}>
          Yes
        </button>
        <button className="btn btn-secondary" onClick={handleNoClick}>
          No
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default Notify;
