import React, { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { Row, Col } from "react-bootstrap";
import CustomTooltip from "src/components/forms/reactformutils/fields/FieldToolTip";

const SurveySection = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [rotate, setRotate] = useState(180);
  const {
    icons,
    title,
    SECSections,
    editSection,
    removeSection,
    sectionIndex,
    control,
    formMetaData,
    formMethods,
    accessCode,
    expandCollapse,
    sectionCode,
    QSTquestions,
    QSTremoveQuestions,
  } = props;

  //const accessCode = formMetaData?.formmeta?.accessCode;
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    setRotate(isCollapsed ? 90 : 180);
  };

  const sectionQuestions = QSTquestions?.map((question, questionIndex) =>
    question.qstSecCode === sectionCode ? questionIndex : null
  ).filter((index) => index !== null); // Ensures only valid indices are kept

  const handleRemoveSection = () => {
    removeSection(sectionIndex);
    const questionsToRemove = [...sectionQuestions].reverse(); // Prevent modifying the original array
    QSTremoveQuestions(questionsToRemove);
  };

  return (
    <div className="card rounded border-light-subtle border-1">
      <div
        onClick={expandCollapse ? handleToggle : ""}
        className={`card-header p-1 form-section  d-flex justify-content-between text-primary   fw-medium`}
      >
        <Col md={11} lg={11} className=" cursor-pointer p-1">
          {expandCollapse === true && (
            <>
              <FontAwesomeIcon
                icon={faAngleUp}
                style={{ transform: `rotate(${rotate}deg)` }}
              />
            </>
          )}
          <h5 className="ms-1 m-0 p-0 text-dark">{title}</h5>
          <FormControl
            control={control}
            name={`SEC[${sectionIndex}].secTitle`}
            formMetaData={formMetaData}
            formMethods={formMethods}
            disabled={true}
            hideTitle={true}
            textColor={true}
          />
        </Col>
        <Col md={1} lg={1} className="pe-1">
          {icons && accessCode === 1 && (
            <span className="float-end text-primary">
              <CustomTooltip tooltip={<div>Edit Section</div>}>
                <FontAwesomeIcon
                  className=" me-2 cursor-pointer"
                  onClick={() => editSection(sectionIndex)}
                  icon={faEdit}
                />
              </CustomTooltip>
              <CustomTooltip tooltip={<div>Delete Section</div>}>
                <FontAwesomeIcon
                  className=" cursor-pointer"
                  onClick={() => handleRemoveSection()}
                  icon={faTrash}
                />
              </CustomTooltip>
            </span>
          )}
        </Col>
      </div>

      <div className={`collapse ${isCollapsed ? "show" : ""}`}>
        <div className="card-body py-1">{props.children}</div>
      </div>
    </div>
  );
};

export default SurveySection;
