import { useState, useEffect, useRef } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Tab,
  Nav,
  Modal,
  Dropdown,
  Table,
  ButtonToolbar,
  ButtonGroup,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_SM_RESPONDENT_FORM_JS";
import SurveySection from "../Utils/SurveySection";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Section from "src/components/forms/reactformutils/fields/Section";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightLeft,
  faUpDown,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import SurveyEndPage from "../Utils/SurveyEndPage";
import {
  getExpectedOptionValues,
  getQuestionScores,
} from "../Utils/RespondentUtils";
import RespondentFindings from "../Utils/RespondentFindings";
import RespondentInformation from "../Utils/RespondentInformation";
import RespondentDocuments from "../Utils/RespondentDocuments";
import SurveyFlagQuestions from "../Utils/SurveyFlagQuestions";
import SurveyScoreCard from "../Utils/SurveyScoreCard";
import SurveyCertification from "../Utils/SurveyCertification";
import SurveyIntroductionPage from "../Utils/SurveyIntroductionPage";
import SurveyResponseField from "../Utils/SurveyResponseField";
import { debounce } from "lodash";
import QuestionSupporters from "../Utils/QuestionSupporters";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import CustomTooltip from "src/components/forms/reactformutils/fields/FieldToolTip";
import ReportRuntime from "src/components/reports/Report";

const FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    formValues,
    runtimeParams,
  } = props;
  const {
    setError,
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touched, isSubmitting },
  } = formMethods;

  const PGEPages = formValues.PGE;
  const SECSections = formValues.SEC;
  const QSTQuestions = formValues.QST;
  const OPTOptions = formValues.OPT;

  const {
    fields: DOCFields,
    append: DOCappend,
    remove: DOCremove,
  } = useFieldArray({
    name: "DOC",
    control,
  });

  const watchedResponses = useWatch({
    control,
    name: "QST",
  });

  formMetaData.form = JSHook(
    form,
    control,
    fields,
    formMethods,
    formValues,
    formMetaData,
    runtimeParams,
    PGEPages,
    SECSections,
    QSTQuestions,
    OPTOptions
  );

  const [showPage, setShowPage] = useState(PGEPages[0]?.pgeTitle);
  const [horizontalAlign, setHorizontalAlign] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [introModal, setIntroModal] = useState(false);

  const certificationPage = false;
  const surveyEndingPage = formValues?.enableEndingPage;

  const approverStage = formValues?.currentStage === "APPROVER";
  const respondStage = formValues?.currentStage === "RESPOND";
  const previousStage = formValues?.previousStage === "RESPOND";
  const closedStage = formValues?.currentStage === "APPROVE-CLOSE";
  const refreshdataref = useRef(null);
  runtimeParams.refreshdataref = refreshdataref;

  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };

  useEffect(() => {
    if (PGEPages?.length > 0) {
      const sortedPages = [...PGEPages].sort((a, b) => a.pgeId - b.pgeId);
      setShowPage(sortedPages[currentPageIndex]?.pgeTitle);
    }
  }, [PGEPages]);

  const flaggedQuestions = getExpectedOptionValues(QSTQuestions, OPTOptions);

  const handleNextPage = () => {
    const currentIndex = PGEPages?.findIndex(
      (page) => page.pgeTitle === showPage
    );
    if (currentIndex < PGEPages.length - 1) {
      setShowPage(PGEPages[currentIndex + 1].pgeTitle);
      setCurrentPageIndex(currentIndex + 1);
    }
  };

  const [percentageAnswered, setPercentageAnswered] = useState(0);
  useEffect(() => {
    const calculatePercentage = debounce(() => {
      const answeredMandatoryQuestions = QSTQuestions.reduce(
        (count, question, index) => {
          const response = watchedResponses[index]?.qstResponse;
          if (question.qstType === "checkboxes") {
            if (Array.isArray(response) && response.length > 0) {
              return count + 1;
            }
          } else {
            if (response !== null && response !== "" && response !== false) {
              return count + 1;
            }
          }

          return count;
        },
        0
      );

      setPercentageAnswered(
        Math.floor((answeredMandatoryQuestions / QSTQuestions.length) * 100)
      );
    }, 300); // 300ms debounce

    calculatePercentage();

    return () => {
      calculatePercentage.cancel();
    };
  }, [watchedResponses]);
  const handlePreviousPage = () => {
    const currentIndex = PGEPages?.findIndex(
      (page) => page.pgeTitle === showPage
    );
    if (currentIndex > 0) {
      setShowPage(PGEPages[currentIndex - 1].pgeTitle);
      setCurrentPageIndex(currentIndex - 1);
    }
  };

  const shouldDisplayQuestion = (question, questionRowIndex) => {
    const dependencyCondition = question?.qstDependencyCondition;
    if (!dependencyCondition) return true;

    const [dependencyQuestionCode, expectedValue] =
      dependencyCondition.split("=");
    const dependencyQuestion = QSTQuestions?.find(
      (q) => q.qstQuestionCode === dependencyQuestionCode
    );

    const dependencyQuestionIndex = QSTQuestions?.indexOf(dependencyQuestion);
    if (
      dependencyQuestionIndex === -1 ||
      !watchedResponses ||
      !watchedResponses[dependencyQuestionIndex]
    ) {
      return true; // If no valid response or index, show the question
    }

    const actualValue = String(
      watchedResponses[dependencyQuestionIndex]?.qstResponse
    );

    return actualValue === expectedValue;
  };

  return (
    <>
      <Container>
        {introModal && !approverStage && !previousStage ? (
          <SurveyIntroductionPage
            formValues={formValues}
            setIntroModal={setIntroModal}
          />
        ) : (
          <div>
            {formValues?.sourceFormName !== "VM_DUE_DILIGENCE" ||
              (formValues?.sourceFormName !== "VM_PRODUCT_SERVICE" && (
                <Card className=" m-0 p-0">
                  <div
                    style={{
                      position: "fixed",
                      bottom: 100,
                      left: 100,
                      width: "80px",
                      height: "100px",
                      zIndex: 1000,
                    }}
                  >
                    <CircularProgressbar
                      value={percentageAnswered}
                      text={`${percentageAnswered}%`}
                      background
                      backgroundPadding={6}
                      styles={buildStyles({
                        backgroundColor: "#065f8b",
                        textColor: "#fff",
                        pathColor: "#fff",
                        trailColor: "transparent",
                        pathTransitionDuration: 0.5,
                        rotation: 0.25,
                      })}
                    />
                  </div>
                  {formValues?.sourceFormName === "IA_CREATE_WORKPAPER" && (
                    <>
                      <RespondentInformation
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        control={control}
                      />
                    </>
                  )}
                </Card>
              ))}

            {PGEPages?.sort((a, b) => a.pgeId - b.pgeId)
              .filter((page) => page?.pgeTitle === showPage)
              .map((page, pageIndex) => (
                <Card key={pageIndex} className="p-0 m-0">
                  <Card.Header className="text-dark  m-0 p-1  mb-1 border border-light-subtle">
                    <Row
                      className="d-flex justify-content-between align-items-center"
                      md={12}
                      lg={12}
                    >
                      <Col md={9} lg={9}>
                        {/* <FormControl
                          control={control}
                          name={`PGE[${currentPageIndex}].pgeTitle`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          disabled={true}
                          textColor={true}
                          hideTitle={true}
                        /> */}
                        <span>{page.pgeTitle}</span>
                      </Col>
                      <Col md={3} lg={3} className="me-0 ps-5 pe-0">
                        {PGEPages?.length > 1 && (
                          <div className="d-flex  align-items-center">
                            <p className="m-0 p-0 pe-2 text-primary">
                              {currentPageIndex + 1}/{PGEPages?.length}
                            </p>
                            <Button
                              variant="light"
                              className="me-1"
                              onClick={handlePreviousPage}
                              disabled={
                                PGEPages.findIndex(
                                  (page) => page?.pgeTitle === showPage
                                ) === 0
                              }
                            >
                              Previous
                            </Button>
                            <Button
                              variant="light"
                              onClick={handleNextPage}
                              disabled={
                                PGEPages.findIndex(
                                  (page) => page?.pgeTitle === showPage
                                ) ===
                                PGEPages.length - 1
                              }
                            >
                              Next
                            </Button>
                            <Button
                              className="float-end ms-1"
                              variant="light"
                              onClick={() =>
                                setHorizontalAlign(!horizontalAlign)
                              }
                            >
                              {horizontalAlign ? (
                                <FontAwesomeIcon icon={faUpDown} />
                              ) : (
                                <FontAwesomeIcon icon={faRightLeft} />
                              )}
                            </Button>
                          </div>
                        )}
                      </Col>
                    </Row>
                    <div>
                      {page?.pgeInstructions !== null && (
                        <>
                          <FormControl
                            control={control}
                            name={`PGE[${pageIndex}].pgeInstructions`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            disabled={true}
                          />
                        </>
                      )}
                    </div>
                  </Card.Header>
                  <Card.Body className="p-0 m-0">
                    {SECSections?.sort((a, b) => a.secId - b.secId)
                      .filter((section) => page.pgeCode === section.secPgeCode)
                      .map((section, sectionIndex) => (
                        <>
                          <Section title={section?.secTitle}>
                            {QSTQuestions?.filter(
                              (question) =>
                                question?.qstSecCode === section?.secCode
                            )
                              .sort((a, b) => a.qstId - b.qstId)
                              .map((question, questionIndex) => {
                                const questionRowIndex =
                                  QSTQuestions?.findIndex(
                                    (ques) =>
                                      ques?.qstCode === question?.qstCode
                                  );
                                let quesRecord = `QST.${questionRowIndex}`;
                                return (
                                  shouldDisplayQuestion(
                                    question,
                                    questionRowIndex
                                  ) && (
                                    <div className="border border-light-subtle  mb-1 p-1 pt-3">
                                      <Row
                                        key={question.qstReferenceId}
                                        className="d-flex justify-content-between align-item-center"
                                      >
                                        <Col
                                          className={
                                            horizontalAlign
                                              ? "col-lg-7 col-md-7"
                                              : "col-md-12"
                                          }
                                        >
                                          <h5 className="text-primary d-flex fw-medium pb-1 p-0 m-0">
                                            {question?.qstMandatory && (
                                              <span className="text-danger me-1">
                                                *
                                              </span>
                                            )}
                                            {/* {question?.qstQuestion} */}
                                            <Col md={12} lg={12}>
                                              <FormControl
                                                control={control}
                                                name={`QST.${questionRowIndex}.qstQuestion`}
                                                formMetaData={formMetaData}
                                                formMethods={formMethods}
                                                disabled={true}
                                                textColor={true}
                                                hideTitle={true}
                                              />
                                            </Col>
                                          </h5>
                                        </Col>
                                        <Col
                                          className={
                                            horizontalAlign
                                              ? `col-lg-4 col-md-4${
                                                  approverStage
                                                    ? "text-left"
                                                    : ""
                                                } `
                                              : "col-md-8"
                                          }
                                        >
                                          <SurveyResponseField
                                            question={question}
                                            qstType={question?.qstType}
                                            quesRecord={quesRecord}
                                            questionRowIndex={questionRowIndex}
                                            OPTOptions={OPTOptions}
                                            formValues={formValues}
                                            formMetaData={formMetaData}
                                            formMethods={formMethods}
                                            control={control}
                                            respondStage={respondStage}
                                          />
                                          {/* {(question?.qstSupportComments ===
                                            true ||
                                            question?.qstSupportDocuments ===
                                              true) &&
                                            respondStage && (
                                              <div>
                                                <QuestionSupporters
                                                  question={question}
                                                  quesRecord={quesRecord}
                                                  questionRowIndex={
                                                    questionRowIndex
                                                  }
                                                  formValues={formValues}
                                                  formMetaData={formMetaData}
                                                  formMethods={formMethods}
                                                  control={control}
                                                  respondStage={respondStage}
                                                  approverStage={approverStage}
                                                />
                                              </div>
                                            )} */}
                                        </Col>

                                        <Col className="col-lg-1 col-md-1 p-0 m-0">
                                          <ModalForm
                                            objectId={-1}
                                            formname="issueobservation"
                                            component={
                                              <FormRunTime
                                                formService="issueobservation"
                                                objectId={-1}
                                                modal
                                                ParentFormObjectId={
                                                  formValues.objectId
                                                }
                                                callbackParent={
                                                  form.callbackFromChild
                                                }
                                                fndApprover={formMethods.getValues(
                                                  "approver"
                                                )}
                                                fndBusinessUnit={formMethods.getValues(
                                                  "businessUnit"
                                                )}
                                                program="10"
                                                source_form_name="SM_RESPONDENT_FORM"
                                                subObjId={formValues.objectId}
                                                relatedId={question.qstId}
                                                relatedObject={
                                                  question.qstQuestion
                                                }
                                                variant={"secondary"}
                                              />
                                            }
                                            buttonText={
                                              <>
                                                <CustomTooltip
                                                  tooltip={
                                                    <div>Add Findings</div>
                                                  }
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPlusCircle}
                                                    size="lg"
                                                    className="p-0 m-0"
                                                  />
                                                </CustomTooltip>
                                              </>
                                            }
                                          />
                                        </Col>
                                      </Row>

                                      <Row className=" pb-3 m-0 p-0">
                                        {(question?.qstSupportComments ===
                                          true ||
                                          question?.qstSupportDocuments ===
                                            true) && (
                                          <div>
                                            <QuestionSupporters
                                              question={question}
                                              quesRecord={quesRecord}
                                              questionRowIndex={
                                                questionRowIndex
                                              }
                                              formValues={formValues}
                                              formMetaData={formMetaData}
                                              formMethods={formMethods}
                                              control={control}
                                              respondStage={respondStage}
                                              approverStage={approverStage}
                                            />
                                          </div>
                                        )}
                                      </Row>
                                    </div>
                                  )
                                );
                              })}
                          </Section>
                        </>
                      ))}
                  </Card.Body>
                </Card>
              ))}

            {currentPageIndex === PGEPages?.length - 1 && (
              <ReportRuntime
                refreshdataref={refreshdataref}
                formcallbackParent={form.callbackFromChild}
                report="IR_SURVEY_FINDINGS"
                drilldownReports={{
                  objectId: formValues.objectId,
                }}
              />
            )}

            {certificationPage && currentPageIndex === PGEPages?.length - 1 && (
              <SurveyCertification />
            )}
            {(approverStage || closedStage) &&
              currentPageIndex === PGEPages?.length - 1 && (
                <Row>
                  {flaggedQuestions.length > 0 && (
                    <Col md={12} lg={12}>
                      <Section title="Flagged Questions">
                        <SurveyFlagQuestions
                          flaggedQuestions={flaggedQuestions}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          control={control}
                        />
                      </Section>
                    </Col>
                  )}

                  <Col>
                    <Section title="Score Card">
                      <SurveyScoreCard
                        QSTQuestions={QSTQuestions}
                        OPTOptions={OPTOptions}
                        formValues={formValues}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        control={control}
                      />
                    </Section>
                  </Col>
                </Row>
              )}
          </div>
        )}

        {formValues?.sourceFormName === "IA_CREATE_WORKPAPER" && (
          <>
            <RespondentFindings
              control={control}
              form={form}
              fields={fields}
              formValues={formValues}
              formMetaData={formMetaData}
              formMethods={formMethods}
              runtimeParams={runtimeParams}
            />
            <RespondentDocuments
              control={control}
              form={form}
              fields={fields}
              formValues={formValues}
              formMetaData={formMetaData}
              formMethods={formMethods}
              DOCFields={DOCFields}
              DOCappend={DOCappend}
              DOCremove={DOCremove}
            />
          </>
        )}
      </Container>
      {formValues.objectId != null && (
        <Container className="justify-content-center">
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
          />
        </Container>
      )}
    </>
  );
};

export default FormLayout;
