import React, { useState } from "react";
import { useDrop } from "react-dnd";
import {
  Col,
  Row,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  Nav,
  NavDropdown,
  Navbar,
  Container,
} from "react-bootstrap";
import SurveyOffCanvas from "./SurveyOffCanvas";
import { v4 as uuidv4 } from "uuid";
import CustomTooltip from "src/components/forms/reactformutils/fields/FieldToolTip";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faXmark,
  faPencil,
  faFlag,
  faCircleInfo,
  faEllipsisV,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const QuestionnaireQuestions = ({
  sectionId,
  sectionCode,
  control,
  form,
  formMetaData,
  formMethods,
  instructions,
  scoring,
  accessCode,
  pageIndex,
  qCode,
  SetQcode,
  QSTquestions,
  QSTappendQuestions,
  QSTupdateQuestions,
  QSTremoveQuestions,
  QSTswapQuestions,
  OPToptions,
  OPTappendOptions,
  OPTremoveOptions,
  OPTupdateOptions,
}) => {
  const [selectedField, setSelectedField] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

  // const {
  //   fields: QSTquestions,
  //   append: QSTappendQuestions,
  //   update: QSTupdateQuestions,
  //   remove: QSTremoveQuestions,
  //   swap: QSTswapQuestions,
  // } = useFieldArray({
  //   name: "QST",
  //   control,
  // });

  // const {
  //   fields: OPToptions,
  //   append: OPTappendOptions,
  //   remove: OPTremoveOptions,
  // } = useFieldArray({
  //   name: "OPT",
  //   control,
  // });

  const [{ isOver }, dropField] = useDrop(() => ({
    accept: "question",
    drop: (item) => {
      QSTappendQuestions({
        qstId: "",
        qstType: item.FieldName,
        qstCode: uuidv4(),
        qstSecId: sectionId,
        qstQuestion: "",
        qstQuestionCode: "",
        qstScore: "",
        qstDependencyQuestion: "",
        qstBooleanType: "",
        qstRatingScale: "",
        qstRatingDisplayType: "",
        qstSupportDocuments: "",
        qstSupportComments: "",
        qstMandatory: "",
        qstMultiSelect: "",
        qstFlag: "",
        qstQuestionDescription: "",
        qstQuestionAdditionalAttributes: "",
        qstEnableDescription: "",
        qstEnableAdditionalAttributes: "",
        qstQuestionImpact: "",
        qstQuestionPrimarySecondary: "",
        qstSecCode: sectionCode,
      });
      setSelectedField(item.FieldName);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleOffCanvasSubmit = (fieldData, index, OPToptions) => {
    if (fieldData === null) {
      setSelectedField("");
      setEditingIndex(null);
      QSTremoveQuestions(index);
      return;
    }
    if (index !== null) {
      QSTupdateQuestions(index, fieldData);
    } else {
      QSTappendQuestions(fieldData);
    }
    setSelectedField("");
    setEditingIndex(null);
  };

  const handleEdit = (index, questionCode) => {
    setEditingIndex(index);
    setSelectedField(QSTquestions[index].qstType);
    setShowOffCanvas(true);
  };

  const onCloseCanvas = () => {
    setSelectedField("");
    setEditingIndex(null);
  };

  const swapQuestions = (indexA, indexB) => {
    QSTswapQuestions(indexA, indexB); // Swaps the questions

    setHighlightedIndices([indexA, indexB]); // Highlight the swapped questions
    setHoveredRowIndex(null); // Clear the hover state once the swap is complete

    setTimeout(() => {
      setHighlightedIndices([]);
      setHoveredRowIndex(null); // Remove the highlight after 300ms
    }, 300);
  };

  const getAnimationStyle = (isHighlighted) => ({
    transition: "transform 0.3s ease-in-out, background-color 0.3s ease-in-out",
    transform: isHighlighted ? "scale(1.02)" : "scale(1)",
    backgroundColor: isHighlighted ? "#f0f8ff" : "white",
  });

  const sectionQuestions = QSTquestions?.filter(
    (question) => question.qstSecCode === sectionCode
  );

  return (
    <div className={`p-2 ${isOver ? "bg-body-secondary" : ""}`} ref={dropField}>
      {sectionQuestions.map((question, index) => {
        const questionRowIndex = QSTquestions?.findIndex(
          (ques) => ques.qstCode === question.qstCode
        );
        const questionOptions = OPToptions?.map((option, index) => ({
          index,
          optValue: option.optValue,
          optQstCode: option.optQstCode,
        }))
          .filter((option) => option.optQstCode === question.qstCode)
          .map((option) => ({
            index: option.index,
            optValue: option.optValue,
          }));

        const isHighlighted = highlightedIndices.includes(questionRowIndex);
        const isHovered = hoveredRowIndex === questionRowIndex;
        return (
          <Row
            key={question.id}
            className={`d-flex justify-content-between  px-1 shadow-lg mb-2 py-2 p-0  border border-light-subtle`}
            style={getAnimationStyle(isHighlighted)}
            onMouseEnter={() => setHoveredRowIndex(questionRowIndex)}
            onMouseLeave={() => setHoveredRowIndex(null)}
          >
            <div
              className="d-flex justify-content-end text-primary  m-0 p-0 me-2"
              style={{ minWidth: "100px", minHeight: "10px" }}
            >
              <CustomTooltip
                placement="bottom"
                tooltip={
                  <div>
                    <strong>Question Code: </strong>
                    <span>{question.qstQuestionCode}</span>
                    <br />
                    <strong>Question Type: </strong>
                    <span>{question.qstType}</span>
                    <br />
                    <span className="fw-bold">Question:</span>
                    <FormControl
                      control={control}
                      name={`QST[${questionRowIndex}].qstQuestion`}
                      formMethods={formMethods}
                      formMetaData={formMetaData}
                      disabled={true}
                      hideTitle={true}
                      textColor={true}
                    />
                    {(question.qstType === "select" ||
                      question.qstType === "checkboxes" ||
                      question.qstType === "radio") && (
                      <div className="d-flex">
                        <span className="fw-bold">Options:</span>
                        <br />
                        <Row>
                          {questionOptions.map((option, index) => {
                            return (
                              <Col md={12} style={{ maxWidth: "120px" }}>
                                <FormControl
                                  control={control}
                                  name={`OPT[${option.index}].optValue`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  hideTitle={true}
                                  disabled={true}
                                  textColor={true}
                                />
                              </Col>
                            );
                          })}
                        </Row>
                      </div>
                    )}
                  </div>
                }
              >
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  className={`flex-fill mx-1 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />
              </CustomTooltip>
              {accessCode === 1 && (
                <>
                  <CustomTooltip tooltip={<div>Move down</div>}>
                    {index < sectionQuestions.length - 1 && (
                      <FontAwesomeIcon
                        icon={faArrowDown}
                        className={`flex-fill mx-1 cursor-pointer ${
                          isHovered ? "opacity-100" : "opacity-0"
                        }`}
                        onClick={() =>
                          swapQuestions(questionRowIndex, questionRowIndex + 1)
                        }
                      />
                    )}
                  </CustomTooltip>
                  <CustomTooltip tooltip={<div>Move up</div>}>
                    {index > 0 && (
                      <FontAwesomeIcon
                        icon={faArrowUp}
                        className={`flex-fill mx-1 cursor-pointer ${
                          isHovered ? "opacity-100" : "opacity-0"
                        }`}
                        onClick={() =>
                          swapQuestions(questionRowIndex, questionRowIndex - 1)
                        }
                      />
                    )}
                  </CustomTooltip>
                  <CustomTooltip tooltip={<div>Edit</div>}>
                    <FontAwesomeIcon
                      icon={faPencil}
                      className={`flex-fill mx-1 cursor-pointer ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                      onClick={() =>
                        handleEdit(questionRowIndex, question.qstCode)
                      }
                    />
                  </CustomTooltip>
                  <CustomTooltip tooltip={<div>Delete</div>}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className={`flex-fill mx-1 cursor-pointer ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                      onClick={() => QSTremoveQuestions(questionRowIndex)}
                    />
                  </CustomTooltip>
                </>
              )}
            </div>

            <Col
              md={12}
              className="p-0 m-0 mb-2"
              // onClick={() => handleEdit(questionRowIndex, question.qstCode)}
            >
              <div
                className="d-flex"
                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              >
                <span className="text-danger me-2">
                  {question.qstMandatory === true ? "*" : ""}
                </span>
                <div>
                  <FormControl
                    control={control}
                    name={`QST[${questionRowIndex}].qstQuestion`}
                    formMethods={formMethods}
                    formMetaData={formMetaData}
                    disabled={true}
                    hideTitle={true}
                    textColor={true}
                  />
                </div>
              </div>
            </Col>
          </Row>
        );
      })}
      {accessCode === 1 && (
        <span className="text-primary">Drag & Drop Questions Here</span>
      )}

      {selectedField && (
        <SurveyOffCanvas
          component={selectedField}
          onSubmit={handleOffCanvasSubmit}
          QSTquestions={QSTquestions}
          control={control}
          form={form}
          formMetaData={formMetaData}
          formMethods={formMethods}
          questionIndex={
            editingIndex !== null ? editingIndex : QSTquestions.length - 1
          }
          initialData={
            editingIndex !== null ? QSTquestions[editingIndex] : null
          }
          onCloseCanvas={onCloseCanvas}
          QSTremoveQuestions={QSTremoveQuestions}
          instructions={instructions}
          scoring={scoring}
          OPToptions={OPToptions}
          OPTappendOptions={OPTappendOptions}
          OPTremoveOptions={OPTremoveOptions}
          OPTupdateOptions={OPTupdateOptions}
          pageIndex={pageIndex}
          qCode={qCode}
          SetQcode={SetQcode}
          sectionCode={sectionCode}
          //openModal={openModal}
        />
      )}
    </div>
  );
};

export default QuestionnaireQuestions;
