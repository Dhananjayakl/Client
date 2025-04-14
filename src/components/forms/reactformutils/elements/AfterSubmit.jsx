import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import CloseButton from "./CloseButton";
import WindowPopup from "./WindowPopup";
import ErrorAlert from "./ErrorAlert";
import { ToastContainer, toast } from "react-toastify";
import Popup from "src/components/forms/reactformutils/elements/Popup";
import ReportRuntime from "src/components/reports/Report";
import { CloseForm } from "./CloseButton";

let AfterSubmit = ({
  formMetaData,
  formMethods,
  form,
  fields,
  formValues,
  callbackToParent,
  runtimeParams,
  submissionFlag,
  setSubmissionPopup,
  submissionPopup,
  generatedobjectId,
}) => {
  console.log(runtimeParams, generatedobjectId, "aftersbmit handle");
  console.log(formMetaData, "after submit meta");

  const [buttonClick, setButtonClick] = useState(false);
  const [closeToggle, setCloseToggle] = useState(true);
  const handleClick = () => {
    setButtonClick(true);

    // console.log("clicked here", runtimeParams.AfterSubmitHandle);
    // {
    //   runtimeParams.AfterSubmitHandle();
    // }
    // <runtimeParams.AfterSubmitHandle/>
  };

  return (
    <>
      <Modal
        style={{ border: "2px solid black", background: "rgba(0, 0, 0, 0.5)" }}
        show={closeToggle}
        size={buttonClick ? "lg" : "sm"}
        fullscreen={buttonClick ? true : false}
      >
        <ModalHeader>
          <h4> Upload successfull</h4>
        </ModalHeader>
        {!buttonClick ? (
          <ModalBody>
            <h5>Click "OK" to view the Status</h5>
          </ModalBody>
        ) : (
          <ModalBody className="w-100">
            <div>
              {formMetaData.formmeta.object_type_post_submit == "1" && (
                <ReportRuntime
                  report={formMetaData?.formmeta?.object_name}
                  formExpression={formMetaData?.formmeta?.object_expression}
                  generatedobjectId={generatedobjectId}
                />
              )}
            </div>
          </ModalBody>
        )}
        <ModalFooter>
          {!buttonClick && (
            <Button className="button" onClick={handleClick}>
              OK
            </Button>
          )}

          <Button
            type="button"
            className="ms-1"
            onClick={() => {
              setCloseToggle(false);
              CloseForm(runtimeParams);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default AfterSubmit;
