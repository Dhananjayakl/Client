import React, { useState, useEffect } from "react";
import DragQuestions from "./DragQuestions";
import { Helmet } from "react-helmet-async";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useFieldArray, useWatch } from "react-hook-form";
import { Col, Row, ListGroup, Button, Card, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faArrowDown19,
  faSquareCaretDown,
  faSquareCheck,
  faCircleDot,
  faToggleOff,
  faSection,
  faStar,
  faFont,
  faWeightScale,
  faCalendarDay,
  faPlusCircle,
  faEdit,
  faFile,
  faParagraph,
} from "@fortawesome/free-solid-svg-icons";
import QuestionnaireSections from "./QSTNRSections";
import { v4 as uuidv4 } from "uuid";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";
import { ModalContextProvider } from "../../context/ModalProvider";
import useTheme from "src/hooks/useTheme";
import CustomTooltip from "src/components/forms/reactformutils/fields/FieldToolTip";
import axios from "src/utils/AxiosInstance";

const Fields = [
  { id: 1, FieldName: "select", icon: faSquareCaretDown },
  { id: 2, FieldName: "radio", icon: faCircleDot },
  { id: 3, FieldName: "checkboxes", icon: faSquareCheck },
  { id: 4, FieldName: "input", icon: faFont },
  { id: 5, FieldName: "number", icon: faArrowDown19 },
  { id: 6, FieldName: "date", icon: faCalendarDay },
  { id: 7, FieldName: "textarea", icon: faParagraph },
  { id: 8, FieldName: "range", icon: faWeightScale },
  { id: 9, FieldName: "rating", icon: faStar },
  { id: 10, FieldName: "files", icon: faFile },
  { id: 11, FieldName: "boolean", icon: faToggleOff },
];

function QUESTIONNAIRE({
  formMetaData,
  instructions,
  scoring,
  formMethods,
  control,
  form,
  formValues,
  accessCode,
}) {
  const [showPageModal, setShowPageModal] = useState(false);
  const [editedPageIndex, setEditedPageIndex] = useState(null);
  const [qCode, SetQcode] = useState(
    formValues?.QST ? formValues?.QST?.length : 0
  );
  const { theme } = useTheme();

  const [{ isOver }, dropPage] = useDrop(() => ({
    accept: "page",
    drop: (item) => {
      // when page is dropped, appending page into the PGEpages
      setShowPageModal(true);
      appendPGEPages({
        pgeId: "",
        pgeTitle: "",
        pgeInstructions: "",
        pgeCode: uuidv4(),
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const [{ isDraggingPage }, dragPage] = useDrag(() => ({
    type: "page",
    item: { page: "page" + uuidv4() },
    collect: (monitor) => ({
      isDraggingSection: !!monitor.isDragging(),
    }),
  }));

  const [{ isDraggingSection }, dragSection] = useDrag(() => ({
    type: "section",
    item: { section: "section" + uuidv4() },
    collect: (monitor) => ({
      isDraggingSection: !!monitor.isDragging(),
    }),
  }));

  const {
    fields: PGEPages,
    append: appendPGEPages,
    update: updatePGEPages,
    remove: removePGEPages,
  } = useFieldArray({
    name: "PGE",
    control: control,
  });

  const {
    fields: SECSections,
    append: SECappendSections,
    update: updateSECSections,
    remove: removeSECSections,
  } = useFieldArray({
    name: "SEC",
    control: control,
  });

  const {
    fields: QSTquestions,
    append: QSTappendQuestions,
    update: QSTupdateQuestions,
    remove: QSTremoveQuestions,
    swap: QSTswapQuestions,
  } = useFieldArray({
    name: "QST",
    control,
  });

  const {
    fields: OPToptions,
    append: OPTappendOptions,
    remove: OPTremoveOptions,
    update: OPTupdateOptions,
  } = useFieldArray({
    name: "OPT",
    control,
  });

  const pageTitle = useWatch({
    control,
    name: `PGE[${
      editedPageIndex !== null ? editedPageIndex : PGEPages?.length - 1
    }].pgeTitle`,
  });

  const handlePage = () => {
    if (editedPageIndex !== null) {
    } else {
      appendPGEPages({
        pgeId: "",
        pgeTitle: "",
        pgeInstructions: "",
        pgeCode: uuidv4(),
      });
    }
  };

  return (
    <React.Fragment>
      <Helmet title="Survey Designer" />
      <ModalContextProvider>
        <Modal
          show={showPageModal}
          centered
          backdrop="static"
          onHide={() => {
            setShowPageModal(false);
            if (editedPageIndex === null) {
              removePGEPages(PGEPages.length - 1);
            } else {
              if (pageTitle?.length < 1 && editedPageIndex !== null) {
                removePGEPages(editedPageIndex);
                setEditedPageIndex(null);
              }
            }
            setEditedPageIndex(null);
          }}
        >
          <Modal.Header
            closeButton={editedPageIndex === null}
            className="text-dark"
          >
            {editedPageIndex !== null ? "Edit Page " : "Add New Page"}
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <FormControl
                  control={control}
                  name={`PGE[${
                    editedPageIndex !== null
                      ? editedPageIndex
                      : PGEPages?.length - 1
                  }].pgeTitle`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col md={12}>
                {instructions && (
                  <FormControl
                    control={control}
                    name={`PGE[${
                      editedPageIndex !== null
                        ? editedPageIndex
                        : PGEPages.length - 1
                    }].pgeInstructions`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                )}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            {pageTitle?.length >= 1 && (
              <Button
                className="mb-2 px-1 py-1 ms-1"
                onClick={() => {
                  setShowPageModal(false);
                  setEditedPageIndex(null);
                }}
              >
                {editedPageIndex !== null ? "Save Changes" : "Create Page"}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
        <Row>
          {accessCode === 1 && (
            <Col
              md={2}
              style={{
                position: "sticky",
                top: "140px",
                maxHeight: "300px",
                zIndex: 2,
              }}
            >
              <div className="py-2 p-0 fw-medium text-center bg-dark-subtle border rounded-end">
                Question Types
              </div>
              <ListGroup className="border-light-subtle border">
                <ListGroup.Item
                  onClick={() => {
                    setEditedPageIndex(null);
                    setShowPageModal(true);
                    handlePage();
                  }}
                  className={`p-1 d-flex align-items-center text-wrap fw-medium border cursor-pointer ${
                    isDraggingPage ? "text-info" : "text-dark bg-light"
                  }`}
                  ref={dragPage}
                >
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    style={{ width: "24px" }}
                    className="me-2"
                  />
                  <span className="fw-medium">Page</span>
                </ListGroup.Item>
                <ListGroup.Item
                  className={`p-1 d-flex align-items-center text-wrap cursor-pointer ${
                    isDraggingSection ? "text-info" : "text-dark bg-light"
                  }`}
                  ref={dragSection}
                >
                  <FontAwesomeIcon
                    icon={faSection}
                    style={{ width: "24px" }}
                    className="me-2"
                  />
                  <span className="fw-medium">Section</span>
                </ListGroup.Item>
                {Fields?.map((field, index) => (
                  <>
                    <div className="fw-medium cursor-pointer">
                      <DragQuestions
                        icon={field.icon}
                        fieldName={field.FieldName}
                        id={field.id}
                      />
                    </div>
                  </>
                ))}
              </ListGroup>
            </Col>
          )}

          <Col
            md={accessCode === 1 ? 10 : 12}
            className="p-0 m-0"
            style={{
              height: "calc(100vh - 62px)",
              overflowY: "auto",
              backgroundColor: isOver ? "#e9ecef" : "",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(0, 0, 0, 0.5) #f1f1f1",
            }}
            ref={dropPage}
          >
            {accessCode === 1 && PGEPages?.length === 0 && (
              <>
                <h5 className="mt-2">
                  Please add pages to drag the sections and questions
                </h5>
              </>
            )}

            {PGEPages?.map((page, pageIndex) => {
              return (
                <Card
                  key={page.id}
                  className="p-0 m-0 mb-2 border border-dark-subtle"
                >
                  <Card.Header
                    className={`d-flex justify-content-between border border-dark-subtle border-bottom-1 border-top-0  border-start-0 ${
                      theme === "dark" ? "bg-secondary" : "bg-secondary-subtle"
                    } text-secondary-emphasis p-2 pe-0`}
                  >
                    <Col md={11} lg={11} xs={10}>
                      <FormControl
                        className="m-0"
                        control={control}
                        name={`PGE[${pageIndex}].pgeTitle`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        disabled={true}
                        hideTitle={true}
                        textColor={true}
                      />
                    </Col>

                    {accessCode === 1 && (
                      <Col className="ms-4" md={1} lg={1} xs={2}>
                        <CustomTooltip tooltip={<div>Edit Page</div>}>
                          <FontAwesomeIcon
                            onClick={() => {
                              setShowPageModal(true);
                              setEditedPageIndex(pageIndex);
                            }}
                            className="me-2 text-primary cursor-pointer"
                            icon={faEdit}
                          />
                        </CustomTooltip>
                        <CustomTooltip tooltip={<div>Delete Page</div>}>
                          <FontAwesomeIcon
                            className=" text-primary cursor-pointer"
                            onClick={() => {
                              removePGEPages(pageIndex);
                            }}
                            icon={faTrash}
                          />
                        </CustomTooltip>
                      </Col>
                    )}
                  </Card.Header>
                  <Card.Body className="m-0 p-0">
                    <QuestionnaireSections
                      pageId={page.id}
                      pageIndex={pageIndex}
                      pageCode={page.pgeCode}
                      control={control}
                      form={form}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      formValues={formValues}
                      instructions={instructions}
                      scoring={scoring}
                      accessCode={accessCode}
                      qCode={qCode}
                      SetQcode={SetQcode}
                      SECSections={SECSections}
                      SECappendSections={SECappendSections}
                      updateSECSections={updateSECSections}
                      removeSECSections={removeSECSections}
                      QSTquestions={QSTquestions}
                      QSTappendQuestions={QSTappendQuestions}
                      QSTupdateQuestions={QSTupdateQuestions}
                      QSTremoveQuestions={QSTremoveQuestions}
                      QSTswapQuestions={QSTswapQuestions}
                      OPToptions={OPToptions}
                      OPTappendOptions={OPTappendOptions}
                      OPTremoveOptions={OPTremoveOptions}
                      OPTupdateOptions={OPTupdateOptions}
                    />
                  </Card.Body>
                </Card>
              );
            })}
          </Col>
        </Row>
      </ModalContextProvider>
    </React.Fragment>
  );
}

export default QUESTIONNAIRE;
