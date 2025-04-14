import { Card, Form, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { getFormData } from "../IAService";
const FindingObservationTask = ({
  id,
  text,
  dueBy,
  submittedIds,
  item,
  handleCheckboxChange,
  isCheckedF,
  statusColors,
}) => {
  const borderColor = statusColors[item?.fnd_type] || "grey";
  const circleColor = statusColors[item?.d_fnd_severity] || "grey";
  const [responseStatus, setResponseStatus] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleSubmitInModal = (fndId) => {
    handleSendForReview(fndId).then((res) => {
      setResponseStatus(res.status);
    });
    closeModal();
  };
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const isSubmitted = submittedIds.has(item.fnd_id);
  const handlefindingObervation = () => {
    const path = `/form/runtime?formService=issueobservation&objectId=${id}`;
    navigate(path);
  };
  const handleSendForReview = (fndId) => {
    const service = "sendForReviewButton";
    const action = 2;
    const formApi = "issueobservation";
    submittedIds.add(fndId);
    return getFormData(service, action, fndId, formApi);
  };
  return (
    <Card
      className="mb-3 textlink-border"
      style={{
        borderLeft: `3px solid ${borderColor || "red"}`,
      }}
    >
      <Card.Body className="py-1 px-2 ">
        <div>
          <span className="standard-Font">
            <FontAwesomeIcon
              icon={faCircle}
              style={{ color: circleColor }}
              className="me-1"
            />
            <strong>{item.d_fnd_severity}</strong>
          </span>
          <span className="float-end standard-Font">
            <strong> {item.status} </strong>
          </span>
        </div>

        <h5 className="d-flex justify-content-between align-items-center fw-bold standard-heading-font text-link">
          <span
            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
            onClick={handlefindingObervation}
          >
            {" "}
            {text}
          </span>

          {item.status === "New" && !isSubmitted && (
            <Form.Check
              type="checkbox"
              className="ml-2 d-flex flex-column standard-Font float-end"
              id={`checkbox-${item.fnd_id}`} // Ensure a unique ID
              //  checked={activeFndIds.includes(item.fnd_id)} // Manage checkbox state
              onChange={(e) =>
                handleCheckboxChange(item.fnd_id, e.target.checked)
              } // Handle state change
              key={item.fnd_id}
            ></Form.Check>
          )}
        </h5>

        {item.status === "New" && (
          <div className="d-flex flex-column standard-Font float-end">
            <button
              className="mx-1 standard-Font btn btn-outline-secondary"
              onClick={openModal}
              hidden={isCheckedF || responseStatus === 200 ? true : false}
            >
              Send to Auditee Review
            </button>
          </div>
        )}
        <Modal show={modalOpen} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Submission</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to submit?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSubmitInModal(item.fnd_id)}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};
export default FindingObservationTask;
