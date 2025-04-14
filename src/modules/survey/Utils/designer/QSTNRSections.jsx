import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Button, Row, Col, Modal, Alert } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import QuestionnaireQuestions from "./QSTNRQuestions";
import { v4 as uuidv4 } from "uuid";
import QuestionnaireSection from "../SurveySection";
import { useFieldArray, useWatch } from "react-hook-form";

function QuestionnaireSections({
  pageId,
  pageIndex,
  pageCode,
  control,
  form,
  formMetaData,
  formMethods,
  formValues,
  instructions,
  scoring,
  accessCode,
  qCode,
  SetQcode,
  SECSections,
  SECappendSections,
  updateSECSections,
  removeSECSections,
  QSTquestions,
  QSTappendQuestions,
  QSTupdateQuestions,
  QSTremoveQuestions,
  QSTswapQuestions,
  OPToptions,
  OPTappendOptions,
  OPTremoveOptions,
  OPTupdateOptions,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState(null);

  // const {
  //   fields: SECSections,
  //   append: SECappendSections,
  //   update: updateSECSections,
  //   remove: removeSECSections,
  // } = useFieldArray({
  //   name: "SEC",
  //   control: control,
  // });

  //const accessCode = formMetaData?.formmeta?.accessCode;

  const [{ isOver }, dropSection] = useDrop(() => ({
    accept: "section",
    drop: (item) => {
      setShowModal(true);
      setEditingSectionIndex(null);
      SECappendSections({
        secId: "",
        secTitle: "",
        secOptional: "",
        secPgeId: pageIndex,
        secCode: uuidv4(),
        secPgeCode: pageCode,
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // form.secTitle.onChange(function (value, row) {
  //   const sectionExists = SECSections?.some((section, index) => {
  //     const isSameSection =
  //       editingSectionIndex !== null && row === editingSectionIndex;

  //     return (
  //       !isSameSection &&
  //       section.secTitle?.toLowerCase() === value?.trim()?.toLowerCase() &&
  //       section.secPgeCode === pageCode
  //     );
  //   });
  //   if (sectionExists) {
  //     setErrors(true);
  //   } else {
  //     setErrors(false);
  //   }
  // });
  const sectionTitle = useWatch({
    control,
    name: `SEC[${
      editingSectionIndex !== null
        ? editingSectionIndex
        : SECSections.length - 1
    }].secTitle`,
  });

  const handleAddSection = () => {
    const trimmedSectionText = sectionTitle?.trim()?.toLowerCase();
    console.log("section title exists");
    const sectionExists = SECSections?.some((section, index) => {
      const isSameSection =
        editingSectionIndex !== null && index === editingSectionIndex;

      return (
        !isSameSection &&
        section.secTitle.toLowerCase() === trimmedSectionText &&
        section.secPgeCode === pageCode
      );
    });

    if (sectionExists) {
      // setErrors(true);
      console.log("section title exists");
      alert("Section title already exists on this page");
      return;
    }

    setShowModal(false);
  };

  const editSection = (index) => {
    setEditingSectionIndex(index);
    setShowModal(true);
  };

  return (
    <>
      <Modal
        backdrop="static"
        centered
        show={showModal}
        onHide={() => {
          setShowModal(false);
          if (editingSectionIndex === null) {
            removeSECSections(SECSections.length - 1);
          } else {
            if (sectionTitle?.length < 1 && editingSectionIndex !== null) {
              removeSECSections(editingSectionIndex);
              setEditingSectionIndex(null);
            }
          }
        }}
      >
        <Modal.Header closeButton={editingSectionIndex === null} as="h3">
          <Modal.Title>
            {editingSectionIndex !== null
              ? "Edit Section Details"
              : "Add Section"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {SECSections.length > 0 && (
            <FormControl
              control={control}
              name={`SEC[${
                editingSectionIndex !== null
                  ? editingSectionIndex
                  : SECSections.length - 1
              }].secTitle`}
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          {sectionTitle?.length >= 1 && (
            <Button variant="primary" onClick={handleAddSection}>
              {editingSectionIndex !== null ? "Save Changes" : "Add Section"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <div
        ref={dropSection}
        className={`mb-1 p-2 ${isOver ? "bg-body-secondary" : ""}`}
      >
        {SECSections?.filter((section) => section.secPgeCode === pageCode).map(
          (section, index) => {
            console.log(section, "section details");
            const sectionRowIndex = SECSections?.findIndex(
              (sec) => sec.secCode === section.secCode
            );

            return (
              <Row
                className="mt-1 d-flex justify-content-between"
                key={section.id}
              >
                <Col>
                  <QuestionnaireSection
                    icons={true}
                    SECSections={SECSections}
                    editSection={editSection}
                    removeSection={removeSECSections}
                    sectionIndex={sectionRowIndex}
                    control={control}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    accessCode={accessCode}
                    sectionCode={section.secCode}
                    QSTquestions={QSTquestions}
                    QSTremoveQuestions={QSTremoveQuestions}
                  >
                    <QuestionnaireQuestions
                      sectionId={section.secId}
                      sectionCode={section.secCode}
                      control={control}
                      form={form}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      instructions={instructions}
                      scoring={scoring}
                      accessCode={accessCode}
                      pageIndex={pageIndex}
                      qCode={qCode}
                      SetQcode={SetQcode}
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
                  </QuestionnaireSection>
                </Col>
              </Row>
            );
          }
        )}

        {accessCode === 1 && (
          <span className="text-primary ms-4">Drag & Drop Sections Here</span>
        )}
      </div>
    </>
  );
}

export default QuestionnaireSections;
