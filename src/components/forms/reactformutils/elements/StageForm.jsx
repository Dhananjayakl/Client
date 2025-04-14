import "../../../../assets/scss/stageform.scss";
import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleDown,
  faArrowDownUpAcrossLine,
  faArrowsDownToPeople,
  faArrowsLeftRight,
  faArrowsUpDown,
  faArrowsUpDownLeftRight,
  faComment,
  faCommentAlt,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
const StageForm = (props) => {
  const Stages = [
    { stage: "Initiate", name: "INITIATE", value: false, user: "initiator" },
    {
      stage: "Initial Approval",
      name: "INITIAL-APPROVAL",
      value: false,
      user: "initialApprover",
    },
    {
      stage: "Manage Stage",
      name: "MANAGE-STAGE",
      value: false,
      user: "owner",
    },
    {
      stage: "Action Plan Approver  ",
      name: "ACTION-PLAN-APPROVER",
      value: false,
      user: "actionPlanApprover",
    },
    {
      stage: "Monitor Stage",
      name: "MONITOR-STAGE",
      value: false,
      user: "owner",
    },
    {
      stage: "Final Approver",
      name: "FINAL-APPROVER",
      value: false,
      user: "owner",
    },
  ];

  return (
    <>
      {" "}
      <div class="">
        <ul class="step-wizard-list">
          {Stages.map((item) => (
            <li
              className={`step-wizard-item ${
                item.name == props.currentStage ? "current-item" : ""
              }`}
              //  class="step-wizard-item     current-item"
            >
              <span class="progress-count  "></span>
              <span class="progress-label">{item.stage}</span>
            </li>
          ))}
        </ul>
        <ul class="step-wizard-list" style={{ position: "static" }}>
          <li class="step-wizard-item  ">
            <FontAwesomeIcon
              style={{
                color: "#21d4fd",
                height: "30px",
                transform: "rotateZ(40deg)",
                marginLeft: "22%",
              }}
              icon={faArrowsUpDown}
            />
            <span class="progress-count">2</span>
            <span class="progress-label">Request Clarification</span>
          </li>
          <li class="step-wizard-item  ">
            <FontAwesomeIcon
              style={{
                color: "#21d4fd",
                height: "30px",
                transform: "rotateZ(40deg)",
                marginLeft: "22%",
              }}
              icon={faArrowsUpDown}
            />
            <span class="progress-count">3</span>
            <span class="progress-label">Request Clarification</span>
          </li>
          <li class="step-wizard-item current-item">
            <FontAwesomeIcon
              style={{
                color: "#21d4fd",
                height: "30px",
                transform: "rotateZ(40deg)",
                marginLeft: "22%",
              }}
              icon={faArrowsUpDown}
            />
            <span class="progress-count">4</span>
            <span class="progress-label">Request Clarification</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default StageForm;
