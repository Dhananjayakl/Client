import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Tabs,
  Tab,
  InputGroup,
} from "react-bootstrap";
import {
  createObject,
  getObjectData,
  updateObjectData,
  getviewData,
} from "src/modules/admin/AdminService";
// import { getviewData } from "src/modules/issue/IssueFormService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faCommentAlt,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { faAudible } from "@fortawesome/free-brands-svg-icons";
import AddComment from "./AddComment";
import { FieldTitle } from "./AuditFields";
import AuditFields from "./AuditFields";
import moment from "moment";
import { useTranslation } from "react-i18next";

import Section from "src/components/forms/reactformutils/fields/Section";
import { useSelector } from "react-redux";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";

const service = "designWorkflow";
var Enable = "activity";

export const ChangeHistoryComp = (props) => {
  const { t } = useTranslation("common");
  let formId = props.formMetaData.formmeta.form_id;
  let objectId = props.objectId;
  let filterExpression = `form_id=${formId} and ((object_id='${objectId}' and parent_object_id is null) or parent_object_id='${objectId}')`;

  const [ChangeHistory, setChangeHistory] = useState([]);

  const { d_date_format, d_data_time_format } = useSelector(
    (state) => state.systemConfig.systemConfig
  );

  let changeHistory = {
    viewName: "pa_change_history_data_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: filterExpression,
  };

  useEffect(() => {
    if (objectId != undefined) {
      getviewData(changeHistory)
        .then((response) => {
          //FormStages = response.data.data;
          const sortedComments = response.data.data.sort((a, b) => {
            const dateA = new Date(a.commented_on).getTime();
            const dateB = new Date(b.commented_on).getTime();
            return dateB - dateA; // For descending order
          });

          setChangeHistory(sortedComments);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  // function getFormattedDate(inputDate) {
  //   if (inputDate == null) {
  //     return "";
  //   } else {
  //     const parsedDate = moment(inputDate);
  //     return parsedDate.format("DD-MM-YYYY");
  //   }
  // }

  return (
    <div className="col-md-12 fs-sm">
      <div className="table-responsive">
        <table className="table table table-bordered table-sm">
          <thead className="bg-light">
            <tr>
              <th>{t("Field Name")}</th>
              {/* <th>Region </th> */}
              <th>{t("Old Value")}</th>
              <th>{t("New Value")}</th>

              <th>{t("Modified By")}</th>
              <th>{t("Modified On")}</th>
            </tr>
          </thead>
          <tbody>
            {ChangeHistory.map((item, index) => {
              return (
                <tr key={index} className="active">
                  <td className="h6">
                    <span className="text-black-50">{item.region_title}</span>
                    <br />
                    <span className="text-dark">{item.field_title}</span>
                  </td>
                  {/* <td className="w-25">{item.region_title}</td> */}

                  <td className="w-25">
                    {item.data_type == 3
                      ? util.formatDate(item.before_value, d_date_format)
                      : item.before_value || (
                          <ul className="px-3">
                            {item?.before_array?.map((value, index) => (
                              <li key={index}>{value}</li>
                            ))}
                          </ul>
                        )}
                  </td>

                  <td className="w-25">
                    {item.data_type == 3
                      ? util.formatDate(item.after_value, d_date_format)
                      : item.after_value || (
                          <ul className="px-3">
                            {item?.after_array?.map((value, index) => (
                              <li key={index}>{value}</li>
                            ))}
                          </ul>
                        )}
                  </td>

                  <td>{item.commented_by_bv}</td>
                  <td>
                    {util.formatDateTimeStamp(
                      item.commented_on,
                      d_data_time_format
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CommentHistoryComp = (props) => {
  const { t } = useTranslation("common");
  const [Comments, setComments] = useState([]);

  const [enableComment, setEnableComment] = useState(true);

  // if (props.enableAddComment == true) {
  //   setEnableComment(props.enableAddComment);
  // }
  const { d_date_format, d_data_time_format } = useSelector(
    (state) => state.systemConfig.systemConfig
  );

  let formId = props.formMetaData.formmeta.form_id;
  let objectId = props.objectId;
  let AddCommentSection = true;
  if (props.enableAddComment != undefined) {
    AddCommentSection = props.enableAddComment;
  }

  let filterExpression = `form_id=${formId} and object_id='${objectId}' and length(comments)>0 and comments != 'null'`;
  let commentsHistory = {
    viewName: "pa_audit_trail_data_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: filterExpression,
  };

  // =======
  const updateComments = () => {
    getviewData(commentsHistory)
      .then((response) => {
        const sortedComments = response.data.data.sort((a, b) => {
          const dateA = new Date(a.created_on).getTime();
          const dateB = new Date(b.created_on).getTime();
          return dateB - dateA; // For descending order
        });

        setComments(sortedComments);
        // setComments(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (objectId != undefined) {
      getviewData(commentsHistory)
        .then((response) => {
          const sortedComments = response.data.data.sort((a, b) => {
            const dateA = new Date(a.created_on).getTime();
            const dateB = new Date(b.created_on).getTime();
            return dateB - dateA; // For descending order
          });

          setComments(sortedComments);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [objectId]);

  return (
    <div className="col-md-12">
      {Comments.length > 0
        ? Comments.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <div className="fs-5 mb-1 text-break">{item.comments}</div>
                <div className="fw-light">
                  <span className="">
                    <FieldTitle>{t("By")}:</FieldTitle> {item.created_by_dv}
                  </span>
                  <div className="float-end">
                    <FieldTitle>{t("On")}:</FieldTitle>{" "}
                    {props.formMetaData.util.formatDateTimeStamp(
                      item.created_on,
                      d_data_time_format
                    )}
                  </div>
                </div>
                <hr className="mt-0" />
              </React.Fragment>
            );
          })
        : // <div className="mt-2 ms-2">
          //   {" "}
          //   <h6>No Comments</h6>
          // </div>
          null}

      {AddCommentSection && (
        <AddComment
          formMetaData={props.formMetaData}
          objectId={objectId}
          updateComments={updateComments}
        ></AddComment>
      )}
    </div>
  );
};

export const AuditTrailComp = (props) => {
  const { t } = useTranslation("common");
  const [FormStages, setFormStages] = useState([]);
  let formId = props.formMetaData.formmeta.form_id;
  let objectId = props.objectId;
  let filterExpression = `form_id=${formId} and object_id='${objectId}'`;
  const { d_date_format, d_data_time_format } = useSelector(
    (state) => state.systemConfig.systemConfig
  );
  useEffect(() => {
    if (objectId != undefined) {
      getviewData(auditTrail)
        .then((response) => {
          const sortedComments = response.data.data.sort((a, b) => {
            const dateA = new Date(a.created_on).getTime();
            const dateB = new Date(b.created_on).getTime();
            return dateB - dateA; // For descending order
          });

          setFormStages(sortedComments);
          let tempArray = [];
          for (let i = 0; i < response.data.data.length; i++) {
            if (
              response.data.data[i].comments != "" &&
              response.data.data[i].comments != null
            ) {
              tempArray.push(response.data.data[i]);
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  let auditTrail = {
    viewName: "pa_audit_trail_data_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: filterExpression,
  };

  return (
    <div>
      <ul className="timeline mt-2 mb-0">
        {FormStages.map((item, index) => {
          return (
            <li key={index} className="timeline-item mb-2">
              <strong>
                {item.current_stage_title || item.current_stage || "Submit"}
              </strong>
              {item.action_title ? " (" + item.action_title + ")" : ""}
              <span className="float-end text-muted ">
                <FieldTitle>{t("By")}:</FieldTitle> {item.created_by_dv}{" "}
                <FieldTitle>{t("On")}:</FieldTitle>{" "}
                {props.formMetaData.util.formatDateTimeStamp(
                  item.created_on,
                  d_data_time_format
                )}{" "}
                ( {props.formMetaData.util.getRelativeTime(item.created_on)})
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

let AuditTrail = (props) => {
  let { formMethods, formMetaData, systemConfig } = props;

  let formId = formMetaData.formmeta.form_id;
  let objectId = props.objectId;
  let enableAddComment = props.enableAddComment;
  let enableChangeHistory = props.enableChangeHistory;
  const [activeTab, setActiveTab] = useState("primary-tab-3");

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  const { t } = useTranslation("common");

  return (
    <>
      <Section title={t("History")}>
        <div className="container-fluid">
          <AuditFields
            formMetaData={formMetaData}
            formMethods={formMethods}
          ></AuditFields>
          <div className="col-12 col-lg-12 mt-2">
            <Tabs
              defaultActiveKey="commentHistory"
              id="justify-tab-example"
              className="justify-content-center"
            >
              <Tab
                eventKey="commentHistory"
                title={
                  <>
                    <FontAwesomeIcon icon={faCommentAlt} />{" "}
                    {t("Comments History")}
                  </>
                }
              >
                <CommentHistoryComp
                  formMetaData={formMetaData}
                  formId={formId}
                  objectId={objectId}
                  enableAddComment={enableAddComment}
                />
              </Tab>
              {!enableChangeHistory && (
                <Tab
                  eventKey="changeHistory"
                  title={
                    <>
                      <FontAwesomeIcon icon={faHistory} /> {t("Change History")}
                    </>
                  }
                >
                  <ChangeHistoryComp
                    formMetaData={formMetaData}
                    formId={formId}
                    objectId={objectId}
                  />
                </Tab>
              )}
              <Tab
                eventKey="auditTrail"
                title={
                  <>
                    <FontAwesomeIcon icon={faAudible} /> {t("Audit Trail")}
                  </>
                }
              >
                <AuditTrailComp
                  formMetaData={formMetaData}
                  formId={formId}
                  objectId={objectId}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </Section>
    </>
  );
};

export default AuditTrail;
