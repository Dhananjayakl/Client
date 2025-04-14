import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import CustomTooltip from "src/components/forms/reactformutils/fields/FieldToolTip";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Tab,
  Accordion,
  Badge,
  ListGroup,
  Modal,
} from "react-bootstrap";
import WorkpaperTask from "./IA_WORKPAPER_TASK";
import PageNavigation from "./IA_PAGENAVIGATION";
import ReportsTask from "./IA_REPORTS_TASK";
import Attachment from "./IA_ATTACHMENT";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowsSpin,
  faComments,
  faTriangleExclamation,
  faCheckToSlot,
  faPlusCircle,
  faArrowsRotate,
  faCircle,
  faRectangleList,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import Lane from "./IA_LANE";
import FindingObservationTask from "./IA_FINDINGOBSERVATIONTASK";
import avatar1 from "src/assets/img/avatars/avatar.jpg";
import { useTranslation } from "react-i18next";

import { getviewData } from "src/modules/admin/AdminService";

import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import { useNavigate } from "react-router-dom";

import {
  downloadAlldocument,
  getFormData,
  getInternalAuditFrameworkData,
} from "../IAService";

const statusColors = {
  "Pending Approval": "blue",
  Completed: "green",
  Approved: "green",

  Future: "grey",
  Overdue: "red",
  1: "red",
  2: "orange",
  Critical: "red",
  High: "#ff0000",
  Medium: "#ffbf00",
  Low: "#008000",
};

const containers = [];

let quarterMap = { 1: [], 2: [], 3: [], 4: [], 5: [] };

const Tasks = () => {
  const onContainerReady = (container) => {
    containers.push(container);
  };
  let [auditData, setAuditData] = React.useState();
  const { t } = useTranslation("common");
  const [wpData, setWPData] = React.useState();
  const [findingObervation, setFindingObservationData] = React.useState();
  const [reportData, setReportData] = React.useState();
  const [documentData, setDocumentData] = React.useState();
  const [riskId, setRiskId] = useState("");
  const [controlId, setcontrolId] = useState("");
  const [activeIds, setActiveIds] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [submittedIds, setSubmittedIds] = useState(new Set());
  const [checkedItems, setCheckedItems] = useState({});
  const handleCheckboxChange = (fndId, isChecked) => {
    setCheckedItems((prev) => ({
      ...prev,
      [fndId]: isChecked,
    }));
    setActiveIds((prev) => {
      const updatedIds = new Set(prev);
      if (isChecked) {
        updatedIds.add(fndId);
      } else {
        updatedIds.delete(fndId);
      }
      return updatedIds;
    });
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSubmitInModals = (activeIds) => {
    if (activeIds.size > 0) {
      const selectedIds = Array.from(activeIds); // Convert Set to Array
      handleSendAllReview(selectedIds);
    }
    closeModal();
  };

  const isAnySelected = activeIds.size > 0;

  const handleSendForReviews = (fndId) => {
    const service = "sendForReviewButton";
    const action = 2;
    const formApi = "issueobservation";
    return getFormData(service, action, fndId, formApi);
  };

  const handleSendAllReview = (activeIds) => {
    activeIds.map((id) => handleSendForReviews(id));
    setSubmittedIds((prev) => new Set([...prev, ...activeIds]));
    setActiveIds(new Set());
  };

  const [counts, setCounts] = useState({
    findings: 0,
    observations: 0,
    findingName: "",
    observationName: "",
  });
  const [wpCount, setWpCounts] = useState({
    checklist: 0,
    controlTest: 0,
    others: 0,
    checklistName: "",
    controlName: "",
    othersName: "",
  });

  let [auditEnityData, setauditEnityData] = React.useState();
  const [uniqueAuditableEntities, setUniqueAuditableEntities] = React.useState(
    []
  );
  const navigate = useNavigate();
  const urlString = window.location.href;
  const url = new URL(urlString);
  const objectId = url.searchParams.get("objectId");

  // dragula(containers);

  const fetchAuditData = () => {
    getviewData({
      viewName: "pa_ia_audits_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `object_id=${objectId}`,
    })
      .then((response) => {
        setAuditData(response.data.data?.[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchworkPaperData = async () => {
    try {
      const controlOthers = await getviewData({
        viewName: "pa_ia_audit_workpaper_bt",
        pageNumber: 0,
        pageSize: 0,
        sortField: "",
        sortOrder: "",
        orderExpression: "",
        filterExpression: `audit_id=${objectId}`,
      });

      const wpData1 = controlOthers.data.data;
      setWPData(wpData1);
      quarterMap[2] = [];
      wpData1.forEach((item) => {
        quarterMap[2].push(item);
      });

      const controlOthercount = wpData1.reduce(
        (acc, wpData1) => {
          if (wpData1.wp_type === 1) {
            acc.checklist += 1;
            acc.checklistName = wpData1.d_wp_type;
          } else if (wpData1.wp_type === 2) {
            acc.controlTest += 1;
            acc.controlName = wpData1.d_wp_type;
          } else if (wpData1.wp_type === 3) {
            acc.others += 1;
            acc.othersName = wpData1.d_wp_type;
          }
          return acc;
        },
        {
          checklist: 0,
          controlTest: 0,
          others: 0,
          checklistName: "",
          controlName: "",
          othersName: "",
        }
      );

      const checklist = await getviewData({
        viewName: "pa_sm_respondent_form_bt",
        pageNumber: 0,
        pageSize: 0,
        sortField: "",
        sortOrder: "",
        orderExpression: "",
        filterExpression: `program=1 and audit_id=${objectId}`,
      });

      const wpData2 = checklist.data.data;
      setWPData(wpData2);
      wpData2.forEach((item) => {
        quarterMap[2].push(item);
      });

      const checklistcount = wpData2.reduce(
        (acc, wpData) => {
          if (wpData.wp_type === 1) {
            acc.checklist += 1;
            acc.checklistName = wpData.d_wp_type;
          } else if (wpData.wp_type === 2) {
            acc.controlTest += 1;
            acc.controlName = wpData.d_wp_type;
          } else if (wpData.wp_type === 3) {
            acc.others += 1;
            acc.othersName = wpData.d_wp_type;
          }
          return acc;
        },
        {
          checklist: 0,
          controlTest: 0,
          others: 0,
          checklistName: "",
          controlName: "",
          othersName: "",
        }
      );

      const combinedCounts = { controlOthercount, checklistcount };

      setWpCounts(combinedCounts);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIssueObervationData = () => {
    getviewData({
      viewName: "pa_ir_issue_observation_log_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `fnd_program=1 and src_obj_id=${objectId}`,
    })
      .then((response) => {
        setFindingObservationData(response.data.data);
        quarterMap[3] = [];
        const sortedData = response.data.data?.sort((a, b) => {
          if (a.fnd_type < b.fnd_type) return -1;
          if (a.fnd_type > b.fnd_type) return 1;
          return 0;
        });
        sortedData.forEach(function (item, index) {
          quarterMap[3].push(item);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchReportData = () => {
    getviewData({
      viewName: "pa_ia_audit_report_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `audit_title=${objectId}`,
    })
      .then((response) => {
        setReportData(response.data.data);
        quarterMap[4] = [];

        response.data.data?.forEach(function (item, index) {
          quarterMap[4].push(item);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchDocumentData = async () => {
    try {
      quarterMap[5] = [];
      const auditsResponse = await getviewData({
        viewName: "pa_ia_audits_doc_bt",
        pageNumber: 0,
        pageSize: 0,
        sortField: "",
        sortOrder: "",
        orderExpression: "",
        filterExpression: `object_id=${objectId}`,
      });
      setDocumentData(auditsResponse.data.data?.[0]);
      auditsResponse.data.data?.forEach((item) => {
        quarterMap[5].push(item);
      });
      const workpapersResponse = await getviewData({
        viewName: "pa_ia_audit_workpaper_doc_bt",
        pageNumber: 0,
        pageSize: 0,
        sortField: "",
        sortOrder: "",
        orderExpression: "",
        filterExpression: `object_id IN (select object_id from pa_ia_audit_workpaper where audit_id=${objectId})`,
      });
      setDocumentData(workpapersResponse.data.data?.[0]);
      workpapersResponse.data.data?.forEach((item) => {
        quarterMap[5].push(item);
      });
      const respondentFormResponse = await getviewData({
        viewName: "pa_sm_respondent_form_doc_bt",
        pageNumber: 0,
        pageSize: 0,
        sortField: "",
        sortOrder: "",
        orderExpression: "",
        filterExpression: `object_id IN (select object_id from pa_sm_respondent_form where audit_id=${objectId})`,
      });
      setDocumentData(respondentFormResponse.data.data?.[0]);
      respondentFormResponse.data.data?.forEach((item) => {
        quarterMap[5].push(item);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const issueFindingObservations = () => {
    getviewData({
      viewName: "pa_ir_issue_observation_log_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `fnd_program=1 and src_obj_id=${objectId}`,
    })
      .then((response) => {
        const data = response?.data?.data;

        const counts = data.reduce(
          (acc, item) => {
            if (item.fnd_type === 1) {
              acc.findings += 1;
              acc.findingName = item.d_fnd_type;
            } else if (item.fnd_type === 2) {
              acc.observations += 1;
              acc.observationName = item.d_fnd_type;
            }
            return acc;
          },
          { findings: 0, observations: 0, findingName: "", observationName: "" }
        );
        setCounts(counts);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchAuditData();
    fetchworkPaperData();
    fetchReportData();
    fetchDocumentData();
    issueFindingObservations();
  }, []);
  useEffect(() => {
    refresIF();
  }, []);

  const handleRefresh = () => {
    fetchworkPaperData();
    fetchIssueObervationData();
    fetchReportData();
    fetchDocumentData();
  };
  let refreshWpdata = () => {
    fetchworkPaperData();
  };

  let refresIF = () => {
    fetchIssueObervationData();
    issueFindingObservations();
  };
  let refresIAReport = () => {
    fetchReportData();
  };
  const [scope, setScop] = useState([]);
  useEffect(() => {
    getInternalAuditFrameworkData("InternalAuditFramework", objectId)
      .then((response) => {
        console.log(response.data, "ruygurguir");
        setauditEnityData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [objectId]);

  useEffect(() => {
    if (auditEnityData && auditEnityData?.length > 0) {
      setScop(auditEnityData);
      const uniqueEntities = [
        ...new Set(auditEnityData.map((item) => item.d_auditable_entity)),
      ];
      setUniqueAuditableEntities(uniqueEntities);
    }
  }, [auditEnityData]);

  const groupedData = Array.isArray(auditEnityData)
    ? auditEnityData.reduce((acc, item) => {
        const {
          d_auditable_entity,
          d_risk_id,
          d_control_id,
          d_test_procedure_id,
        } = item;

        if (!acc[d_auditable_entity]) {
          acc[d_auditable_entity] = {};
        }
        if (!acc[d_auditable_entity][d_risk_id]) {
          acc[d_auditable_entity][d_risk_id] = {};
        }
        if (!acc[d_auditable_entity][d_risk_id][d_control_id]) {
          acc[d_auditable_entity][d_risk_id][d_control_id] = [];
        }
        if (d_test_procedure_id) {
          acc[d_auditable_entity][d_risk_id][d_control_id].push(
            d_test_procedure_id
          );
        }

        return acc;
      }, {})
    : {};
  if (!auditData) {
    return "Loading...";
  }
  if (!wpData) {
    return "Loading...";
  }

  if (!findingObervation) {
    return "Loading...";
  }

  const handleAuditTask = () => {
    const path = `/form/runtime?formService=audits&objectId=${objectId}`;
    navigate(path);
  };

  const handleriskChanges = (e, scope) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setRiskId(scope[0].risk_id);
    } else {
      setRiskId("");
    }
  };

  const handlecontrolChange = (e, scope) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setcontrolId(scope[0].control_id);
    } else {
      setcontrolId("");
    }
  };

  return (
    <React.Fragment>
      <Helmet title={`Audit: ${auditData?.audit_title}`} />
      <Container fluid className="p-0">
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <div className="z-2 sticky-top" style={{ top: "62px" }}>
            <Row className="p-0 m-0">
              <Card className="reportChart-cards">
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <CustomTooltip
                    tooltip={`[${auditData?.object_id}] ${auditData?.audit_title}`}
                    placement="right"
                  >
                    <h5>
                      {t("Audit")} :{" "}
                      <a className="underline" onClick={handleAuditTask}>
                        {auditData?.audit_title?.length > 50
                          ? `[${
                              auditData?.object_id
                            }] ${auditData?.audit_title?.slice(0, 50)}...}`
                          : `[${auditData?.object_id}] ${auditData?.audit_title}`}
                      </a>
                    </h5>
                  </CustomTooltip>
                  <PageNavigation
                    auditData={auditData}
                    onRefresh={handleRefresh}
                    refreshWp={refreshWpdata}
                    refresIF={refresIF}
                    refresIAReport={refresIAReport}
                    className="justify-content-end "
                    controlId={controlId}
                    riskId={riskId}
                  />
                </div>
              </Card>
            </Row>
          </div>

          <Card className="reportChart-cards p-1">
            <Row>
              <Col className="standard-heading-font">
                <b>{t("Business Unit")}:</b> {auditData?.d_business_unit}
              </Col>
              <Col className="standard-heading-font">
                <b>{t("Audit Manager")}:</b> {auditData?.d_audit_manager}
              </Col>
              <Col className="standard-heading-font">
                <b>{t("Lead Auditor")}:</b> {auditData?.d_lead_auditor}
              </Col>
              <Col className="standard-heading-font">
                <b>{t("Start Date")}:</b>{" "}
                {util.getFormattedDate(auditData?.start_date)}
              </Col>
              <Col className="standard-heading-font">
                <b>{t("End Date")}:</b>{" "}
                {util.getFormattedDate(auditData?.end_date)}
              </Col>
              <Col className="standard-heading-font">
                <b>{t("Status")}:</b> {auditData?.status}
              </Col>
            </Row>
          </Card>
          <Row>
            <Col lg="6" xl="3" className="z-1">
              <Lane name={t("Scope")}>
                <Accordion
                  defaultActiveKey="0"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {uniqueAuditableEntities.map((entity, index) => (
                    <Accordion.Item eventKey={index} key={index}>
                      <Accordion.Header className="standard-heading-font sticky">{`${entity}`}</Accordion.Header>
                      <Accordion.Body>
                        <Form>
                          {Object.entries(groupedData[entity] || {}).map(
                            ([riskId, controls], riskIndex) => (
                              <div key={riskIndex} className="mb-3">
                                <Form.Check
                                  type="checkbox"
                                  className="text-red"
                                  id={`check-risk-${riskId}`}
                                  // onChange={(e) => handleCheckboxChange(e)}
                                >
                                  <Form.Check.Input
                                    type="checkbox"
                                    onChange={(e) =>
                                      handleriskChanges(e, scope)
                                    }
                                  />
                                  <Form.Check.Label className="standard-heading-font">
                                    <span className="fw-bold ">
                                      <FontAwesomeIcon
                                        icon={faTriangleExclamation}
                                      />
                                    </span>
                                    {` ${riskId}`}
                                  </Form.Check.Label>
                                </Form.Check>

                                {/* Iterate over the controls */}
                                {Object.entries(controls).map(
                                  (
                                    [controlId, testProcedures],
                                    controlIndex
                                  ) => (
                                    <div key={controlIndex} className="ms-3">
                                      {controlId !== "null" && (
                                        <Form.Check
                                          type="checkbox"
                                          className="text-blue"
                                          id={`check-control-${controlId}`}
                                        >
                                          <Form.Check.Input
                                            type="checkbox"
                                            onChange={(e) =>
                                              handlecontrolChange(e, scope)
                                            }
                                          />
                                          <Form.Check.Label className="standard-Font">
                                            <FontAwesomeIcon
                                              icon={faCheckToSlot}
                                              className="me-2"
                                            />
                                            {`${controlId}`}
                                          </Form.Check.Label>
                                        </Form.Check>
                                      )}
                                      {/* Iterate over the test procedures for each control */}
                                      {testProcedures.map(
                                        (testProcedure, testIndex) =>
                                          testProcedure !== "null" && (
                                            <Form.Check
                                              type="checkbox"
                                              className="text-green ms-4"
                                              id={`check-testprocedure-${testProcedure}`}
                                              key={testIndex}
                                            >
                                              <Form.Check.Input
                                                type="checkbox"
                                                onChange={(e) =>
                                                  handleTestProcedureChange(
                                                    e,
                                                    scope
                                                  )
                                                }
                                              />
                                              <Form.Check.Label className="standard-Font">
                                                <FontAwesomeIcon
                                                  icon={faComments}
                                                  className="me-2"
                                                />
                                                {`${testProcedure}`}
                                              </Form.Check.Label>
                                            </Form.Check>
                                          )
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            )
                          )}
                        </Form>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Lane>
            </Col>

            <Col lg="6" xl="3">
              <Lane name={t("Workpapers")}>
                {/* <FontAwesomeIcon icon={ faCircle} /> */}

                <ListGroup
                  className="bg-white  rounded-0 "
                  style={{
                    position: "sticky",
                    top: "-5px",
                    zIndex: 1,
                  }}
                >
                  {/* <div className="row g-0 justify-content-between"> */}
                  {/* <FontAwesomeIcon  icon="fa-solid fa-house"/> */}
                  {[
                    {
                      icon: "faRectangleList",
                      label: "Control Test",
                      count: wpCount?.controlOthercount?.controlTest,
                    },
                    {
                      icon: "faRectangleList",
                      label: "Checklist",
                      count: wpCount?.checklistcount?.checklist,
                    },
                    {
                      icon: "faRectangleList",
                      label: "Other",
                      count: wpCount?.controlOthercount?.others,
                    },
                  ].map((item) => {
                    return (
                      <div className=" d-flex align-items-center  ">
                        <Col sm={10}>
                          <FontAwesomeIcon icon={faRectangleList} />
                          {/* <FontAwesomeIcon icon={`${item.icon}`} /> */}
                          <span className="ms-2">{t(item.label)}:</span>
                        </Col>
                        <Col sm={2}>
                          <Badge className="ms-2 float-end">{item.count}</Badge>
                        </Col>
                      </div>
                    );
                  })}
                  {/* </div> */}
                </ListGroup>

                {quarterMap[2].map((item, index) => {
                  return (
                    <WorkpaperTask
                      id={item.object_id}
                      avatar={avatar1}
                      text={item.wp_title || item.task_title}
                      status={item.status}
                      endDate={item.end_date}
                      item={item}
                      statusColors={statusColors}
                    />
                  );
                })}
              </Lane>
            </Col>
            <Col lg="6" xl="3">
              <Lane
                name={t("Findings/Observations")}
                // style={{ zIndex: 1, position: "sticky", top: "-5px" }}
              >
                <ListGroup
                  className="bg-white  rounded-0 "
                  style={{
                    position: "sticky",
                    top: "-5px",
                    zIndex: 1,
                  }}
                >
                  {[
                    {
                      icon: "faRectangleList",
                      label: "Finding(s)",
                      count: counts?.findings,
                    },
                    {
                      icon: "faRectangleList",
                      label: "Observation(s)",
                      count: counts?.observations,
                    },
                  ].map((item) => {
                    const isFinding = item.label === "Finding(s)";
                    return (
                      <div className=" d-flex align-items-center  ">
                        <Col sm={10}>
                          <FontAwesomeIcon icon={faRectangleList} />
                          {/* <FontAwesomeIcon icon={`${item.icon}`} /> */}
                          <span className="ms-2">{t(item.label)}:</span>
                        </Col>
                        <Col sm={2}>
                          <Badge
                            className={`ms-2 float-end ${
                              isFinding ? "bg-danger" : ""
                            }`}
                          >
                            {item.count}
                          </Badge>
                        </Col>
                      </div>
                    );
                  })}
                  {isAnySelected && (
                    <Button onClick={openModal} hidden={!activeIds}>
                      Send to Auditee Review
                    </Button>
                  )}

                  <Modal
                    show={modalOpen}
                    onHide={closeModal}
                    backdrop="static"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Confirm Submission</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>Are you sure you want to submit?</p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={closeModal}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleSubmitInModals(activeIds)}
                      >
                        Submit
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </ListGroup>
                {quarterMap[3].map((item, index) => {
                  return (
                    <FindingObservationTask
                      id={item.fnd_id}
                      text={item.fnd_name}
                      dueBy={item.fnd_due_by}
                      item={item}
                      handleCheckboxChange={handleCheckboxChange}
                      isCheckedF={checkedItems[item.fnd_id] || false}
                      submittedIds={submittedIds}
                      statusColors={statusColors}
                    />
                  );
                })}
              </Lane>
            </Col>
            <Col lg="6" xl="3">
              <Row>
                <Lane name={t("Report")}>
                  {quarterMap[4].map((item, index) => {
                    return (
                      <ReportsTask
                        id={item.object_id}
                        text={item.d_report_type}
                        reportYear={item.report_year}
                        status={item.status}
                        item={item}
                      />
                    );
                  })}
                </Lane>
              </Row>
              <Row>
                <Lane
                  name={t("Documents/Evidences")}
                  download
                  objectId={objectId}
                  auditData={quarterMap[5]?.length > 0 ? auditData : null}
                >
                  <ol className="list-group list-group-numbered">
                    {quarterMap[5].map((item, index) => {
                      return (
                        <Attachment
                          id={item.object_id}
                          text={item.d_doc_category}
                          evidence={item.doc_evidence}
                        />
                      );
                    })}
                  </ol>
                </Lane>
              </Row>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </React.Fragment>
  );
};

export default Tasks;
