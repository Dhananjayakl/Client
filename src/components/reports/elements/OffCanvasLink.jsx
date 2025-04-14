import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Offcanvas, Button } from "react-bootstrap";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";

const OffCanvasLink = ({ value, row, columnMeta, refreshData }) => {
  let navigate = useNavigate();
  let objectId = row.original[columnMeta.id_column_name];
  let formService = row.original.formservice;
  let multiformService =
    row.original[columnMeta.form.match(/\$\{([^}]+)\}/)?.[1] || ""];
  const isTemplateString =
    columnMeta.form && /\$\{([^}]+)\}/.test(columnMeta.form);

  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [depdId, setDepdId] = useState();

  const toggleOffCanvas = () => setShowOffCanvas(!showOffCanvas);

  const handleClose = () => {
    setShowOffCanvas(false);
  };

  const offCanvas = () => {
    return (
      <Offcanvas show={showOffCanvas} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FormRunTime
            // formService={columnMeta.form}
            formService={
              isTemplateString
                ? multiformService
                : columnMeta.form || formService
            }
            objectId={objectId}
            // notform={true}
            offCanvas
            ParentFormObjectId={depdId}
            callbackParent={refreshData}
          />
        </Offcanvas.Body>
      </Offcanvas>
    );
  };

  return (
    <div className="d-flex flex-grow-1">
      <a
        onClick={() => setShowOffCanvas(true)}
        target="_blank"
        rel="noopener noreferrer"
        className="me-2"
      >
        {value}
      </a>
      {showOffCanvas && offCanvas()}
    </div>
  );
};

export default React.memo(OffCanvasLink);
