import { useState, useEffect } from "react";
import { Button, Modal, ModalFooter, Row, Col, Card } from "react-bootstrap";
import { getRegionData } from "../ProductFormservice";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import {
  validateResponses,
  calculateScore,
  getRatingAndScoreByTotalScore,
} from "../utils/VendorUtils";

const VendorModalForm = ({
  buttonText,
  objectId,
  formMetaData,
  formMethods,
  formValues,
  control,
  modalTitle,
  SECFields,
  SECappend,
  QSTFields,
  QSTappend,
  OPTFields,
  OPTappend,
  id,
  component,
  onHide,
  style,
  disabled,
  configurationData,

  ...props
}) => {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow((s) => !s);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const variant = props.variant || "primary";
  const handleClose = () => {
    setShow(false);
  };

  const { preliminary_risk_checklist, operational_preparedness_checklist } =
    configurationData;
  useEffect(() => {
    if (isSubmitted) {
      const isValid = validateResponses(QSTFields, formMethods);
      setErrorMessage(!isValid);
    }
  }, [QSTFields, isSubmitted]);

  const Ratings = formMetaData?.configurationFormMetaData?.RTG;
  function handleSubmit(questions, options, buttonText) {
    setIsSubmitted(true);
    const scores = calculateScore(questions, options, formMethods, objectId);
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const rating = getRatingAndScoreByTotalScore(totalScore, Ratings);
    console.log(rating, totalScore, "rating we got here");
    console.log("Scores:", scores);
    console.log("Total Score:", totalScore);
    if (
      formValues.objectId === undefined ||
      formMethods.getValues("currentStage") === "INITIATE"
    ) {
      formMethods.setValue("preliminaryRiskScore", totalScore);
      formMethods.setValue("preliminaryRiskRating", rating);
      // formMetaData.fields.preliminaryRiskscore.editable = false;
      // formMetaData.fields.preliminaryRiskRating.editable = false;
    }

    if (
      formValues.currentStage === "OPCHECK" &&
      buttonText === "OP Checklist"
    ) {
      formMethods.setValue("operationalPreparednessScore", totalScore);
      formMethods.setValue("operationalPreparednessRating", rating);
    }

    const isValid = validateResponses(questions, formMethods, objectId);
    if (isValid) {
      // formMethods.setValue("preliminaryScore", totalScore);
      // formMethods.setValue("preliminaryRating", 30);
      setErrorMessage(false);
      setShow(false);
    } else {
      setErrorMessage(true);
      setShow(true);
    }
  }

  const [PGEPages, setPGEPages] = useState([]);
  const [SECSections, setSECSections] = useState([]);
  const [QSTQuestions, setQSTQuestions] = useState([]);
  const [OPTOptions, setOPTOptions] = useState([]);

  // const getQuestionnaireData = async (objectId) => {
  //   try {
  //     const response = await getRegionData(
  //       "getRegionData",
  //       objectId,
  //       "SM_QUESTIONNAIRE"
  //     );
  //     const { PGE = [], SEC = [], QST = [], OPT = [] } = response.data;
  //     console.log(response, "response of the questionnaire");
  //     response.data.QST.forEach((question) => {
  //       QSTappend({
  //         questionId: "",
  //         questionText: question.qst_question,
  //         score: question.qst_question_score,
  //         sqoId: question.qst_code,
  //         qstSecCode: question.qst_sec_code,
  //         qstType: question.qst_type,
  //         questionCode: question.qst_code,
  //         qstResponse: "",
  //         qstResponseArray: [],
  //         qstDateResponse: "",
  //         qstMandatory: question.qst_mandatory,
  //         qstChecklistId: question.object_id,
  //       });
  //     });

  //     response.data.SEC.forEach((section) => {
  //       SECappend({
  //         secId: "",
  //         secCode: section.sec_code,
  //         secTitle: section.sec_title,
  //         secChecklistId: section.object_id,
  //       });
  //     });

  //     response.data.OPT.forEach((option) => {
  //       OPTappend({
  //         optId: "",
  //         optCode: option.opt_code,
  //         optValue: option.opt_value,
  //         optQstCode: option.opt_qst_code,
  //         optScore: option.opt_score,
  //       });
  //     });

  //     //setPGEPages(PGE);
  //     setSECSections(SEC);
  //     setQSTQuestions(QST);
  //     setOPTOptions(OPT);

  //     // Update form values with total score
  //   } catch (error) {
  //     console.error("Error fetching questionnaire data:", error);
  //   }
  // };

  const getQuestionnaireData = async (objectId) => {
    try {
      const response = await getRegionData(
        "getRegionData",
        objectId,
        "SM_QUESTIONNAIRE"
      );

      const { PGE = [], SEC = [], QST = [], OPT = [] } = response.data;

      console.log(response, "response of the questionnaire");

      // Avoid adding duplicate questions
      QST.forEach((question) => {
        const alreadyExists = QSTFields.some(
          (q) =>
            q.qstChecklistId === objectId &&
            q.questionCode === question.qst_code
        );

        if (!alreadyExists) {
          QSTappend({
            questionId: "",
            questionText: question.qst_question,
            score: question.qst_question_score,
            sqoId: question.qst_code,
            qstSecCode: question.qst_sec_code,
            qstType: question.qst_type,
            questionCode: question.qst_code,
            qstResponse: "",
            qstResponseArray: [],
            qstDateResponse: "",
            qstMandatory: question.qst_mandatory,
            qstChecklistId: question.object_id,
            qstMultiselect: question?.qst_multiselect,
          });
        }
      });

      // Avoid adding duplicate sections
      SEC.forEach((section) => {
        const alreadyExists = SECFields.some(
          (s) => s.secChecklistId === objectId && s.secCode === section.sec_code
        );

        if (!alreadyExists) {
          SECappend({
            secId: "",
            secCode: section.sec_code,
            secTitle: section.sec_title,
            secChecklistId: section.object_id,
          });
        }
      });

      // Avoid adding duplicate options
      OPT.forEach((option) => {
        const alreadyExists = OPTFields.some(
          (o) =>
            o.optCode === option.opt_code &&
            o.optQstCode === option.opt_qst_code &&
            o.optchecklistId === option.object_id
        );

        if (!alreadyExists) {
          OPTappend({
            optId: "",
            optCode: option.opt_code,
            optValue: option.opt_value,
            optQstCode: option.opt_qst_code,
            optScore: option.opt_score,
            optchecklistId: option.object_id,
          });
        }
      });

      setSECSections(SEC);
      setQSTQuestions(QST);
      setOPTOptions(OPT);
    } catch (error) {
      console.error("Error fetching questionnaire data:", error);
    }
  };

  useEffect(() => {
    if (
      formValues.objectId === undefined ||
      formMethods.getValues("currentStage") === "INITIATE"
    ) {
      getQuestionnaireData(preliminary_risk_checklist);
    }

    if (
      formValues.currentStage === "OPCHECK" &&
      buttonText === "OP Checklist"
    ) {
      getQuestionnaireData(operational_preparedness_checklist);
    }
  }, []);

  return (
    <>
      {buttonText === "dataimports" ? null : (
        <Button
          variant={variant}
          style={{
            background: "linear-gradient(135deg, #6f42c1, #9b59b6, #b28cd9)", // Gradient background
            border: "none",
            borderRadius: "30px", // Smooth, pill-like edges
            color: "#fff",
            //fontWeight: "bold",
            padding: "10px 20px", // Add padding for a prominent look
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow
            fontSize: "15px",
            transition: "all 0.3s ease-in-out", // Smooth animation
            //animation: "bounce 1.5s infinite",
            //animation: "rollDice 5s infinite",
          }}
          onClick={toggleShow}
          disabled={disabled}
          onMouseEnter={
            (e) => (e.currentTarget.style.transform = "scale(1.1)") // Slight zoom on hover
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset zoom
        >
          <FontAwesomeIcon
            icon={faClipboardList}
            style={{ marginRight: "8px" }}
          />

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
        <Modal.Body>
          {SECFields.length === 0 && QSTFields.length === 0 ? (
            <div>No data available</div>
          ) : (
            <>
              {PGEPages.map((page) => (
                <Card key={page.pge_id}>
                  <Card.Header>
                    <Card.Title>Evaluation</Card.Title>
                  </Card.Header>
                </Card>
              ))}

              {SECFields.filter((sec) => sec.secChecklistId === objectId).map(
                (section) => (
                  <div key={section.secId}>
                    <Section title={section.secTitle}>
                      {QSTFields.filter(
                        (question) =>
                          question.qstChecklistId === objectId &&
                          question.qstSecCode === section.secCode
                      ).map((question) => {
                        const questionRowIndex = QSTFields?.findIndex(
                          (ques) =>
                            ques?.questionCode === question?.questionCode
                        );

                        const queOptions = OPTFields?.filter(
                          (option) =>
                            option?.optQstCode === question?.questionCode
                        );

                        const optionsArray = queOptions?.map(
                          (option, index) => {
                            if (question.qstType === "radio") {
                              return {
                                key: option?.optValue,
                                value: option?.optValue,
                                parent_key: null,
                              };
                            }

                            return {
                              value: option?.optValue,
                              label: option?.optValue,
                            };
                          }
                        );

                        let quesRecord = `QST.${questionRowIndex}`;
                        let qtype;
                        let fieldName;

                        switch (question.qstType) {
                          case "checkboxes":
                            fieldName = "qstResponseArray";
                            qtype = "checkboxes";
                            break;
                          case "select":
                            qtype = "SSelect";
                            fieldName = question?.qstMultiselect
                              ? "qstResponseArray"
                              : "qstResponse";

                            break;
                          case "boolean":
                            qtype =
                              question?.qstBooleanType === 1
                                ? "check"
                                : "switch";
                            break;
                          case "date":
                            qtype = "date";
                            fieldName = "qstDateResponse";
                            break;
                          default:
                            qtype = question.qstType;
                            fieldName = "qstResponse";
                        }

                        return (
                          <Row
                            key={question.qstId}
                            className="d-flex justify-content-between align-items-center border border-light-subtle mt-2 pt-1 mb-0 pb-0 p-1"
                          >
                            <Col md={8}>
                              <span>
                                {" "}
                                <span className="text-danger me-2">
                                  {question?.qstMandatory === true ? "*" : ""}
                                </span>
                              </span>
                              {question.questionText}
                            </Col>
                            <Col md={4}>
                              <FormControl
                                control={control}
                                name={`${quesRecord}.${fieldName}`}
                                type={question.qstType}
                                dropDownFlag={true}
                                dropDown={optionsArray}
                                options={optionsArray}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                                hideTitle={true}
                                textColor={true}
                                closeButton={true}
                                required={question.qstMandatory}
                              />
                            </Col>
                          </Row>
                        );
                      })}
                    </Section>
                  </div>
                )
              )}
            </>
          )}
        </Modal.Body>
        <ModalFooter>
          <div className="d-flex justify-content-between align-items-center">
            <div className="me-4">
              {isSubmitted && errorMessage && (
                <p className="text-danger">
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    size="1x"
                    className="me-2"
                    color="red"
                  />
                  Please provide a response for all mandatory questions before
                  submitting.
                </p>
              )}
            </div>
            <div>
              <Button
                className="me-2"
                onClick={() => {
                  handleSubmit(QSTFields, OPTFields, buttonText);
                }}
              >
                Submit
              </Button>
              <Button onClick={handleClose}>Close</Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default VendorModalForm;
