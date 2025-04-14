import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Offcanvas,
  Button,
  Breadcrumb,
  Modal,
} from "react-bootstrap";
import SimpleTable from "src/components/reports/SimpleReport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faHome,
  faCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Bold } from "react-feather";

{
  /* <FontAwesomeIcon icon="fa-solid fa-coffee" mask="fa-regular fa-circle" /> */
}

export const ActionButtons = ({
  row,
  id,
  service,
  updateFormLabel,
  component,
  deleteObject,
  AddComponent,
  addFormLabel,
  navigationPath,
}) => {
  //let id = row.original.formId;
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    deleteObject(service, id)
      .then((response) => {})
      .catch((err) => {
        console.log(err);
      });

    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // const handleKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //     handleDelete();
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, [id]);
  const pagePath = window.parent.location.pathname;

  return (
    <>
      {" "}
      {addFormLabel && (
        <OffCanvasForm
          placement="end"
          buttonText={
            <>
              {" "}
              <FontAwesomeIcon
                icon={faPlus}
                mask={faCircle}
                size="lg"
              /> Add{" "}
            </>
          }
          canvasTitle={addFormLabel}
          component={AddComponent}
        />
      )}
      {navigationPath ? (
        <RedirectFormButton
          placement="end"
          buttonText={<FontAwesomeIcon icon={faEdit} size="lg" />}
          canvasTitle={updateFormLabel}
          component={component}
          id={id}
          navigationPath={navigationPath}
          variant="light"
        />
      ) : (
        <OffCanvasForm
          placement="end"
          buttonText={<FontAwesomeIcon icon={faEdit} size="lg" />}
          canvasTitle={updateFormLabel}
          component={component}
          id={id}
          variant="light"
        />
      )}
      {pagePath !== "/leave/default" ? (
        <>
          <Button variant="light" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faTrash} size="lg" />
          </Button>

          <Modal show={showModal} size="sm" onHide={handleCloseModal} centered>
            <Modal.Header>
              <Modal.Title className="font-weight-bold ">
                Delete This Record?
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to <strong>delete the record?</strong>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-secondary"
                // className="btn btn-secondary btn-hover"
                size="lg"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                variant="outline-danger"
                // className="btn btn-danger btn-hover "
                size="lg"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        ""
      )}
      {/* <Button
        variant="light"
        onClick={() => {
          let text = "Are you sure you want to delete the record?";
          if (confirm(text) == true) {
            deleteObject(service, id)
              .then((response) => {
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }}
      >
        <FontAwesomeIcon icon={faTrash} size="lg" />
      </Button> */}
    </>
  );
};

export const ModalForm = ({
  buttonText,
  modalTitle,
  id,
  component,
  onHide,
  style,
  buttons,
  ...props
}) => {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow((s) => !s);
  const variant = props.variant || "primary";
  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      {buttons != undefined ? (
        buttons.map((item) => {
          return (
            <Button
              variant={variant}
              style={style}
              onClick={toggleShow}
              className="me-2"
            >
              {item.buttonText}
            </Button>
          );
        })
      ) : (
        <Button
          variant={variant}
          style={style}
          onClick={toggleShow}
          className="me-2"
        >
          {buttonText}
        </Button>
      )}

      <Modal
        show={show}
        size="lg"
        onHide={() => {
          toggleShow();
          onHide();
        }}
        backdrop="static"
        {...props}
      >
        <Modal.Header>
          <div className="CloseChildForm">
            <Button onClick={handleClose} style={{ marginLeft: "500px" }}>
              Close
            </Button>
          </div>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{component}</Modal.Body>
      </Modal>
    </>
  );
};

export const OffCanvasForm = ({
  buttonText,
  canvasTitle,
  id,
  component,
  navigationPath,
  ...props
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  const variant = props.variant || "primary";

  return (
    <>
      <Button variant={variant} onClick={toggleShow} className="me-2">
        {buttonText}
      </Button>

      <Offcanvas show={show} onHide={handleClose} backdrop="static" {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{canvasTitle}</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {/* <Forms id={id} /> */}
          {component}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export const RedirectFormButton = ({
  buttonText,
  canvasTitle,
  id,
  navigationPath,
  ...props
}) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const openForm = () => {
    navigate(navigationPath);
  };

  const variant = props.variant || "primary";

  return (
    <>
      <Button variant={variant} onClick={openForm} className="me-2">
        {buttonText}
      </Button>
    </>
  );
};

const { useRef } = React;

const LandingPage = ({
  title,
  newFormLabel,
  service,
  component,
  tableColumns,
  getObjectData,
  application,
  navigationPath,
}) => {
  const childRef = useRef();

  return (
    <React.Fragment>
      <Helmet title={title} />
      <Container fluid className="p-0">
        {/* <Breadcrumb>
          <Breadcrumb.Item href="/"> <FontAwesomeIcon icon={faHome} />   Home</Breadcrumb.Item>
          <Breadcrumb.Item >
            {application}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{title}</Breadcrumb.Item>
        </Breadcrumb> */}
        <Row className="mb-2 mb-xl-3">
          <Col xs="auto" className="d-none d-sm-block">
            <h3 className="">{title}</h3>
            {/* text-uppercase */}
          </Col>

          <Col xs="auto" className="ms-auto text-end mt-n1">
            {navigationPath ? (
              <RedirectFormButton
                placement="end"
                buttonText={
                  <span>
                    <FontAwesomeIcon icon={faPlus} /> {newFormLabel}
                  </span>
                }
                canvasTitle={newFormLabel}
                navigationPath={navigationPath}
              />
            ) : (
              <OffCanvasForm
                placement="end"
                buttonText={
                  <span>
                    <FontAwesomeIcon icon={faPlus} /> {newFormLabel}
                  </span>
                }
                canvasTitle={newFormLabel}
                component={component}
              />
            )}
          </Col>
        </Row>

        <SimpleTable
          dataFunction={getObjectData}
          service={service}
          // data={tableData}
          columns={tableColumns}
        />
      </Container>
    </React.Fragment>
  );
};

export default LandingPage;
