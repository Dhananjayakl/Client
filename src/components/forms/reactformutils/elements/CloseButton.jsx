import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { formObjectUnlock } from "src/components/server/service";
import { LogOut } from "react-feather";
import { ModalOnClick } from "src/redux/slices/ModalHandler";
import { useDispatch } from "react-redux";
export let CloseForm = (runtimeParams, ModalCloseDispatch) => {
  console.log(runtimeParams, "close button params");
  // const navigate = useNavigate();
  // let {runtimeParams} = props;
  const formId = runtimeParams.formId;
  const objectId = runtimeParams.objectId;
  const doesAnyHistoryEntryExist = location.key !== "default";
  console.log(runtimeParams, "runtime-params-modal-props");

  if (runtimeParams.closeCanvas && runtimeParams.modal) {
    console.error("modal closed");

    ModalCloseDispatch(
      ModalOnClick({
        status: true,
        id: runtimeParams.objectId ? runtimeParams.objectId : -1,
      })
    );
    // runtimeParams.closeCanvas.click();
    if (objectId && objectId != "-1" && runtimeParams.formmeta.isLocked) {
      console.log("modal unlocked");
      formObjectUnlock("formobjectunlock", objectId, formId)
        .then((response) => {})
        .catch((err) => {
          console.log(err);
        });
    }
  } else if (runtimeParams.offCanvas && runtimeParams.closeCanvas) {
    runtimeParams.closeCanvas.click();
  } else if (runtimeParams.popup) {
    console.error("popup closed");

    if (objectId && objectId != "-1" && runtimeParams.formmeta.isLocked) {
      console.log("popup unlocked");
      formObjectUnlock("formobjectunlock", objectId, formId)
        .then((response) => {})
        .catch((err) => {
          console.log(err);
        });
    }
    runtimeParams.popup.click();
  } else if (runtimeParams.bearerURL) {
    console.log("navigate 1");
    runtimeParams.navigate("/");
    localStorage.removeItem("stateData");
  } else {
    if (runtimeParams.doesAnyHistoryEntryExist) {
      console.log("navigate 2");
      window.history.back();
      // runtimeParams.navigate(-1);
    } else {
      console.log("navigate 3");
      runtimeParams.navigate("/");
    }
  }
  return true;
};

let CloseButton = (props) => {
  const ModalCloseDispatch = useDispatch();
  console.log(props, "close button props");
  const navigate = useNavigate();
  let { runtimeParams } = props;
  console.log(runtimeParams, "runtimeparamas of close");

  const formId = runtimeParams.formId;
  const objectId = runtimeParams.objectId;
  const [buttonClicked, setButtonClicked] = useState(false);
  // let navigate = useNavigate();
  // runtimeParams.navigate = navigate;

  useEffect(() => {
    if (
      buttonClicked &&
      objectId &&
      objectId != "-1" &&
      runtimeParams.formmeta.isLocked
    ) {
      console.log("closer1");

      formObjectUnlock("formobjectunlock", objectId, formId)
        .then((response) => {})
        .catch((err) => {
          console.log(err);
        });
    }
  }, [buttonClicked, objectId, formId]);

  const handleButtonClick = () => {
    console.log(
      "closer2",
      sessionStorage.getItem("stateData"),
      runtimeParams.modal
    );
    let sessionItem = sessionStorage.getItem("stateData");
    console.log(sessionItem, "session items");

    if (sessionItem != null && sessionItem != "null") {
      console.log("handleclicker");

      navigate("/");
      sessionStorage.removeItem("stateData");
    } else {
      console.log("called close form");

      setButtonClicked(true);
      CloseForm(callingBack(runtimeParams), ModalCloseDispatch);
    }
  };

  const callingBack = (runtime) => {
    if (!("modal" in runtime)) {
      //if not form is true only  in that time pop should have value else the pop up should be null
      runtime.popup = null;
    }
    return runtime;
  };

  return (
    <Button
      type="button"
      onClick={() => {
        handleButtonClick();
      }}
      //   onClick={showToastMessage}
      size="lg"
      className="ms-2 close-btn"
      variant="secondary"
    >
      {" "}
      <FontAwesomeIcon icon={faCircleLeft} /> Close
    </Button>
  );
};

export default CloseButton;
