import React, { useState, useEffect } from "react";
import { Button, Offcanvas, Form, Card, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useFieldArray, useWatch } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import AdvancedFields from "./AdvancedFields";
import QuestionOptions from "./QuestionOptions";
import { useModalContext } from "../../context/ModalProvider";

function SurveyOffCanvas({
  component,
  onSubmit,
  control,
  form,
  formMetaData,
  formMethods,
  QSTquestions,
  questionIndex,
  initialData,
  onCloseCanvas,
  QSTremoveQuestions,
  scoring,
  OPToptions,
  OPTappendOptions,
  OPTremoveOptions,
  OPTupdateOptions,
  pageIndex,
  qCode,
  SetQcode,
  sectionCode,
  //openModal,
}) {
  const [show, setShow] = useState(true);
  const currentQuestionCode = QSTquestions[questionIndex].qstCode;
  const currentQuestionOptions = OPToptions?.filter(
    (option, originalIndex) => option.optQstCode === currentQuestionCode
  );
  const { openModal } = useModalContext();

  const sectionQuestions = QSTquestions?.filter(
    (question) => question.qstSecCode === sectionCode
  );

  useEffect(() => {
    if (initialData) {
      formMethods.setValue(`QST[${questionIndex}]`, initialData);
    }
  }, [initialData]);

  const questionScore = parseFloat(
    useWatch({
      control,
      name: `QST[${questionIndex}].qstScore`,
    })
  );
  const questionText = useWatch({
    control,
    name: `QST[${questionIndex}].qstQuestion`,
  });

  const questionRatingDisplayType = useWatch({
    control,
    name: `QST[${questionIndex}].qstRatingDisplayType`,
  });

  const questionBooleanType = useWatch({
    control,
    name: `QST[${questionIndex}].qstBooleanType`,
  });

  console.log(initialData, OPToptions, "initial data for the this question");

  let hasError = false;
  let isUniqueOptions = false;
  let isFilled = false;
  const handleSubmit = () => {
    const seenValues = new Set();

    let filledOptionCount = 0;

    const trimmedQuestionText = questionText?.trim().toLowerCase();

    let QuestionExists = sectionQuestions?.some(
      (question) =>
        question.qstQuestion?.trim().toLowerCase() === trimmedQuestionText &&
        question.qstCode !== initialData?.qstCode
    );

    if (questionText?.length < 1) {
      hasError = true;
      openModal("To proceed, please add a question in the specified field");

      return;
    }
    if (QuestionExists) {
      openModal(
        "A question with this text already exists in this section. Please enter a unique question."
      );
      return;
    }

    if (component === "rating" && !questionRatingDisplayType) {
      openModal("Please Select Rating Display Type");
      return;
    }

    if (component === "boolean" && !questionBooleanType) {
      openModal("Please Select Boolean Display Type");
      return;
    }
    currentQuestionOptions?.forEach((option) => {
      const optionRowIndex = OPToptions?.findIndex(
        (opt) => opt.id === option.id
      );
      const optValue = formMethods
        .getValues(`OPT[${optionRowIndex}].optValue`)

        .toLowerCase();

      if (optValue) {
        filledOptionCount++;
      }

      if (!optValue) {
        isFilled = true;
      } else if (seenValues.has(optValue)) {
        isUniqueOptions = true;
      } else {
        seenValues.add(optValue);
      }
    });

    if (
      ["select", "radio", "checkboxes"].includes(component) &&
      currentQuestionOptions.length < 2
    ) {
      hasError = true;
      openModal("Please add at least two options for this question");

      return;
    }

    if (isFilled) {
      openModal("Please ensure all option values are filled");

      return;
    }
    if (isUniqueOptions) {
      openModal("Please ensure all option values are unique");

      return;
    }

    if (!questionScore || questionScore <= 0) {
      hasError = true;
      openModal("Please provide a valid score for this question.");
      return;
    }

    setShow(false);
    onCloseCanvas();
    const fieldData = formMethods.getValues(`QST[${questionIndex}]`);

    if (initialData === null) {
      formMethods.setValue(
        `QST[${questionIndex}.qstQuestionCode]`,
        `Q${qCode + 1}`
      );
      SetQcode((p) => p + 1);
    }
    onSubmit(fieldData, questionIndex, OPToptions);
  };

  const renderBooleanTypeSelector = () => (
    <FormControl
      control={control}
      name={`QST[${questionIndex}].qstBooleanType`}
      formMetaData={formMetaData}
      formMethods={formMethods}
    />
  );

  const updateCurrentQuestionOptions = (currentQuestionOptionIndices) => {
    if (initialData == null) {
      OPTremoveOptions(currentQuestionOptionIndices);
    }
  };
  const handleOnHideOffcanvas = () => {
    if (initialData == null) {
      QSTremoveQuestions(questionIndex);
      const currentQuestionOptionIndices = OPToptions?.map((option, index) =>
        option.optQstCode === currentQuestionCode ? index : -1
      ).filter((index) => index !== -1);

      updateCurrentQuestionOptions(currentQuestionOptionIndices);
    } else {
      onSubmit(initialData, questionIndex, OPToptions);
    }
    setShow(false);
    onCloseCanvas();
  };

  //const pageTitle = formMethods.getValues(`PGE[${pageIndex}].pgeTitle`);
  return (
    <>
      <div className="ms-auto text-end">
        <Offcanvas
          className="shadow-lg"
          show={show}
          onHide={() => {
            handleOnHideOffcanvas();
          }}
          placement="end"
          backdrop="static"
        >
          <Offcanvas.Header
            className="d-flex justify-content-between "
            closeButton
          >
            <Offcanvas.Title className="fw-medium col-md-3  col-sm-3">
              <span className="">
                Configure {component.toUpperCase()} Question:
              </span>
            </Offcanvas.Title>
            <div>
              <Offcanvas.Title className="fw-medium">
                <span className="h6 text-primary ms-2"> Page title: </span>
                <div
                  className="ms-2 d-flex "
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  <FormControl
                    control={control}
                    name={`PGE[${pageIndex}].pgeTitle`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    disabled={true}
                    textColor={true}
                    hideTitle={true}
                  />
                </div>
              </Offcanvas.Title>
            </div>
          </Offcanvas.Header>
          <Offcanvas.Body className="p-1 m-1 shadow-lg">
            <Card className="px-3 m-0">
              <Form>
                <div className="pt-2 d-flex justify-content-between">
                  <FormControl
                    control={control}
                    name={`QST[${questionIndex}].qstQuestionCode`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    disabled={true}
                    textColor={true}
                  />
                </div>
                <FormControl
                  control={control}
                  name={`QST[${questionIndex}].qstQuestion`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  required={true}
                />
                {(component === "select" ||
                  component === "checkboxes" ||
                  component === "radio") && (
                  <div className="d-flex justify-content-between mt-4">
                    <Form.Label className="text-dark fw-medium">
                      Options
                      <span className="text-danger me-2">*</span>
                    </Form.Label>
                  </div>
                )}
                {component === "boolean" && <>{renderBooleanTypeSelector()}</>}
                {(component === "select" ||
                  component === "checkboxes" ||
                  component === "radio") && (
                  <>
                    <QuestionOptions
                      questionIndex={questionIndex}
                      component={component}
                      scoring={scoring}
                      currentQuestionOptions={currentQuestionOptions}
                      currentQuestionCode={currentQuestionCode}
                      OPToptions={OPToptions}
                      OPTappendOptions={OPTappendOptions}
                      OPTremoveOptions={OPTremoveOptions}
                      OPTupdateOptions={OPTupdateOptions}
                      control={control}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      initialData={initialData}
                    />
                  </>
                )}
                {component === "rating" && (
                  <>
                    {/* <FormControl
                      className="m-0"
                      control={control}
                      name={`QST[${questionIndex}].qstRatingScale`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    /> */}
                    <FormControl
                      control={control}
                      name={`QST[${questionIndex}].qstRatingDisplayType`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </>
                )}
                {scoring && (
                  <>
                    <FormControl
                      control={control}
                      name={`QST[${questionIndex}].qstScore`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </>
                )}

                <div className="mt-2">
                  <FormControl
                    className="m-0"
                    control={control}
                    name={`QST[${questionIndex}].qstDependencyCondition`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                  <Form.Label className="text-dark fw-medium">
                    Advanced Configurations:
                  </Form.Label>
                  <AdvancedFields
                    questionIndex={questionIndex}
                    component={component}
                    control={control}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>

                <Button
                  variant="primary text-center mt-2 fw-medium"
                  onClick={handleSubmit}
                >
                  {initialData ? "Update" : "Add"}
                </Button>
              </Form>
            </Card>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
}

export default SurveyOffCanvas;
