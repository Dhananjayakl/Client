import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import CloseButton from "./CloseButton";
import { LogIn } from "react-feather";
import { ModalOnClick } from "src/redux/slices/ModalHandler";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
export const ModalForm = ({
  buttonText,
  modalTitle,
  id,
  component,
  onHide,
  style,
  disabled, // Add disabled prop
  objectId,
  ...props
}) => {
  console.log(objectId, onHide, "component--is--here");
  let Modaltoggler = useSelector((state) => state.ModalCloseHandler.value);
  console.log(Modaltoggler, "TOGGLER--12");
  const ModalCloseDispatch = useDispatch();
  const [show, setShow] = useState(false);
  const toggleShow = () => {
    console.log("toggler--", show);

    if (show == undefined || show == false) {
      setShow(true);
    }
  };
  const variant = props.variant || "primary";
  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    console.log(Modaltoggler.status, "test is here");
    if (Modaltoggler.id == objectId && Modaltoggler.status == true) {
      setShow(false);
    }
  }, [Modaltoggler]);
  return (
    <>
      {buttonText === "dataimports" ? null : (
        <Button
          variant={variant}
          style={style}
          onClick={toggleShow}
          disabled={disabled} // Pass disabled prop to Button
          // className="me-2"
        >
          {buttonText}
        </Button>
      )}

      <Modal
        show={show}
        size={props.size || "lg"}
        onHide={() => {
          toggleShow();
          if (onHide) onHide();
        }}
        backdrop="static"
        {...props}
      >
        <Modal.Header closeButton className={`${modalTitle ? "" : "d-none"}`}>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{component}</Modal.Body>
      </Modal>
    </>
  );
};
