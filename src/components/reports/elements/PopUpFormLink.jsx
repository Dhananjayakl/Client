import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";

const PopUpFormLink = ({
  value,
  row,
  columnMeta,
  refreshData,
  formcallbackParent,
}) => {
  let navigate = useNavigate();
  let objectId = row.original[columnMeta.id_column_name];
  let depdId = row.original[columnMeta.id_column_name];
  let formService = row.original.formservice;
  const [showModal, setShowModal] = useState(false);
  let multiformService =
    row.original[columnMeta.form.match(/\$\{([^}]+)\}/)?.[1] || ""];
  const isTemplateString =
    columnMeta.form && /\$\{([^}]+)\}/.test(columnMeta.form);

  // const [depdId, setdepdId] = useState();

  const closePinnedRecordsModal = () => {
    const pinnedRecordsModal = document.getElementById("pinnedRecordsModal");
    if (pinnedRecordsModal) {
      pinnedRecordsModal.style.display = "none";
    }
  };

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
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "0px",
          // backdropFilter: "blur(3px)",
          position: "fixed",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "-moz-initial",
          border: "5px",
          borderColor: "black",
        }}
        show={showModal}
        size="lg"
        onHide={() => {
          // toggleShow();
          onHide();
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
            formService={
              isTemplateString
                ? multiformService
                : columnMeta.form || formService
            }
            objectId={objectId}
            // notform={true}
            modal
            ParentFormObjectId={depdId}
            // callbackParent={refreshData}
            callbackParent={
              formcallbackParent ? formcallbackParent : refreshData
            }
          />
          <div hidden className="reportcloseButton">
            <Button onClick={handleClose}>Close</Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div className="d-flex flex-grow-1">
      {/* <FontAwesomeIcon icon={faFile} className="me-2 ms-2" /> */}
      <a
        // onClick={() => setShowModal(true)}
        onClick={() => {
          setShowModal(true);
          closePinnedRecordsModal();
        }}
        target="_blank"
        rel="noopener noreferrer"
        className="me-2"
      >
        {value}
      </a>
      {showModal && openPopupFormLink()}
    </div>
  );
};

// export default PopUpFormLink;
export default React.memo(PopUpFormLink);
