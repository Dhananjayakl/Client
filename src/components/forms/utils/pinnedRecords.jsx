import React, { useEffect, useState } from "react";
// import { getviewData } from "src/modules/employee/EmployeeService";
import { getviewData } from "src/modules/admin/AdminService";
import ReportRuntime from "src/components/reports/Report";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";

const PinnedRecords = () => {
  const [showModallink, setShowModallink] = useState(false);

  const handleOpenModal = () => {
    setShowModallink(true);
  };

  const handleCloseModal = () => {
    setShowModallink(false);
  };

  return (
    <>
      <FontAwesomeIcon
        // size="xl"
        icon={faThumbTack}
        onClick={handleOpenModal}
        className="pinnedIcon"
        title="All Bookmarks"
      />
      <Modal
        id="pinnedRecordsModal"
        show={showModallink}
        onHide={handleCloseModal}
        size="lg"
        className="modalviewportpinned "
      >
        <Modal.Header
          closeButton
          className="modelLinkcloseButton"
          onClick={handleCloseModal}
        ></Modal.Header>
        <Modal.Body>
          <ReportRuntime report="PINNED_REPORTS" />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PinnedRecords;
