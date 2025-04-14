import {
  ProgressBar,
  OverlayTrigger,
  Popover,
  Col,
  Row,
} from "react-bootstrap";
import React from "react";
import axios from "src/utils/AxiosInstance";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
let WFIndicator = (props) => {
  const { t, i18n } = useTranslation("common");
  let { runtimeParams } = props;

  let [workflow, setWorkflow] = React.useState(null);
  const { d_date_format, d_data_time_format } = useSelector(
    (state) => state.systemConfig.systemConfig
  );
  React.useEffect(() => {
    const getWorkflowInfo = async () => {
      if (runtimeParams?.workflowCode) {
        try {
          const response = await axios.get(
            `/workflow/workflowIndicatorInfo?workflowId=${runtimeParams.workflowId}&formId=${runtimeParams.formId}&objectId=${runtimeParams.objectId}`
          );
          setWorkflow(response.data);
        } catch (error) {
          console.error("Error occurred:", error);
        }
      } else {
        setWorkflow({
          stages: [],
        });
      }
    };
    getWorkflowInfo();
  }, [runtimeParams]);

  let ind = 0;
  if (workflow?.stages?.length > 0) {
    return (
      <div className="container">
        <div className="accordion" id="accordionExample">
          <div className="steps z-0">
            <progress id="progress" value="0" max="100"></progress>

            {workflow.stages.map(function (item, index) {
              if (
                (item.optional == true &&
                  (item.parent_stage != null || item.parent_stage != "") &&
                  item.status === "Pending") ||
                (item.optional == true &&
                  (item.parent_stage != null || item.parent_stage != "") &&
                  item.status === "done" &&
                  item.is_end_stage !== true) ||
                (item.optional == true &&
                  (item.parent_stage != null || item.parent_stage != "") &&
                  item.status === "Not Done") ||
                (item.optional == true &&
                  (item.parent_stage != null || item.parent_stage != "") &&
                  item.status === "NA")
              )
                return;
              ind = ind + 1;
              return (
                <div className="step-item" key={index}>
                  {item.responsibilities !== null && !(item.status === "NA") ? (
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Popover
                          id={`popover-${index}`}
                          className="custom-popover"
                          style={{
                            minWidth: "250px",
                          }}
                        >
                          <Popover.Header as="h3">
                            {t(item.stage_title)}
                          </Popover.Header>
                          <Popover.Body>
                            <>
                              {item.completed_by && (
                                <>
                                  <Row>
                                    <Col md={2} className="h5 pophover-title ">
                                      {t("By")}:
                                    </Col>
                                    <Col md={10} className=" p-0">
                                      {item.completed_by}
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col md={2} className="h5 pophover-title">
                                      {t("On")}:
                                    </Col>
                                    <Col md={10} className="p-0">
                                      {runtimeParams.util.formatDateTimeStamp(
                                        item.completed_on,
                                        d_data_time_format
                                      )}
                                    </Col>
                                  </Row>
                                  <hr />
                                </>
                              )}
                              <ul className="responsibilities">
                                {item.responsibilities
                                  .split("\n")
                                  .map((responsibility, index) => (
                                    <li key={index}>{t(responsibility)}</li>
                                  ))}
                              </ul>
                            </>
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <button
                        className={`step-button text-center ${
                          item.status === "done" ? "collapsed done" : ""
                        }
                          ${item.status === "current" ? "current" : ""}
                          ${item.status === "NA" ? "NA" : ""}
                          ${item.is_end_stage}
                          `}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${index + 1}`}
                        aria-expanded="false"
                        aria-controls={`collapse${index + 1}`}
                      >
                        {ind}
                      </button>
                    </OverlayTrigger>
                  ) : (
                    <button
                      className={`step-button text-center ${
                        item.status === "done" ? "collapsed done" : ""
                      }
                        ${item.status === "current" ? "current" : ""}
                        ${item.status === "NA" ? "NA" : ""}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index + 1}`}
                      aria-expanded="false"
                      aria-controls={`collapse${index + 1}`}
                    >
                      {ind}
                    </button>
                  )}

                  <div
                    className={`step-title ${
                      item.status === "NA" ? "NA-striketitle" : ""
                    }`}
                  >
                    {/* {t(item.stage_title)} */}
                    {t(item.stage_title) === item.stage_title
                      ? item.stage_title
                      : t(item.stage_title)}{" "}
                    <br />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default WFIndicator;
