import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faAngleUp,
  fa0,
  faAngleLeft,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { useWatch } from "react-hook-form";
import OptionsCard from "src/components/pages/OptionsCard";

const Collapse = (props) => {
  let initialState = props.state;
  const [rotate, setRotate] = useState(180);
  const [isExpanded, setIsExpanded] = useState(initialState ? true : false);

  useEffect(() => {
    setRotate(isExpanded ? 180 : 90);
  }, [isExpanded]);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  let title = props.title;
  if (props.control) {
    title = useWatch({
      control: props.control,
      // name: props.id,
      name: props.watchFor,
    });
  }

  // const bgcolor =
  // title[1] == "1" ? "bg-danger" : title[1] == " " ? "" : "bg-warning";
  const bgcolor = props.bgcolor;

  return (
    <div>
      <div className={`expandable ${isExpanded ? "active" : ""}`}>
        <div
          className={`card-header card-expanded rounded mb-1 py-2 px-2 d-flex justify-content-between ${props.className}`}
        >
          <div
            className=" ms-3 d-flex align-items-center"
            onClick={toggleExpand}
          >
            <FontAwesomeIcon
              icon={faAngleUp}
              style={{ transform: `rotate(${rotate}deg)` }}
            />
            <span className="ms-2 pt-1" style={{ color: "white" }}>
              {props.formMethods
                ? props.formMethods.getValues(props.title)
                : props.title}
            </span>
          </div>
          <div className="d-flex align-items-center ">
            {props.renderOptionsCard === true ? (
              ""
            ) : (
              <div className="vr bg-primary me-1"></div>
            )}
            <div
              className={`ms-2 rounded-pill ${bgcolor} text-uppercase align-items-center`}
            >
              <div className="ms-2 me-2 mt-2 align-items-center">
                {props.secondaryTitle}
              </div>
            </div>
            {props.renderOptionsCard && (
              <OptionsCard
                objectId={props.objectId}
                businessUnit={props.businessUnitId}
                render={true}
                button={props.button}
              />
            )}
          </div>
        </div>
        <div className={`collapse ${isExpanded ? "show" : ""}`}>
          <div className="card-body">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default Collapse;
