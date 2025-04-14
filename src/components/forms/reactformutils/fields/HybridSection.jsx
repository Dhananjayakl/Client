import { Row, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";

const Section = (props) => {
  const [rotate, setRotate] = useState();
  const [collapse, setCollapse] = useState(true);
  const [partialOpen, setPartialOpen] = useState(false);

  useEffect(() => {
    if (
      props.field1 !== null ||
      props.field2 !== null ||
      props.field3 !== null
    ) {
      setPartialOpen(true);
      setCollapse(false);
      setRotate(135);
    } else {
      setPartialOpen(false);
      setCollapse(false);
      setRotate(90);
    }
  }, []);

  const handleToggle = () => {
    if (partialOpen) {
      setCollapse(true);
      setPartialOpen(false);
      setRotate(180);
    }
    if (collapse) {
      if (
        props.field1 !== null ||
        props.field2 !== null ||
        props.field3 !== null
      ) {
        setPartialOpen(true);
        setCollapse(false);
        setRotate(135);
      } else {
        setCollapse(false);
        setRotate(90);
      }
    } else {
      setCollapse(true);
      setRotate(180);
    }
  };
  const bgcolor = props.bgcolor;

  return (
    <div
      id={props.title}
      className="card rounded"
      style={{ boxShadow: "rgb(197 201 200 / 60%) 0px 0px 0.7rem 0px" }}
    >
      <div>
        <div className={`card-header form-section ${props.headerClass}`}>
          <Row className="d-flex justify-content-between align-items-center">
            <div className="col-12 col-md-auto" onClick={handleToggle}>
              <h5 className="mb-0">
                <a className="ps-1 text-decoration-none text-white">
                  <FontAwesomeIcon
                    icon={faAngleUp}
                    style={{ transform: `rotate(${rotate}deg)` }}
                  />
                  <span className="ms-1"> {props.title}</span>
                </a>
              </h5>
            </div>
            <div className="d-flex align-items-center col-12 col-md-auto">
              <div className="vr bg-primary me-1"></div>
              <div
                className={`ms-2 rounded-pill ${bgcolor} text-uppercase align-items-center`}
              >
                <div className="ms-2 me-2 mt-2 align-items-center">
                  {props.secondaryTitle}
                </div>
              </div>
            </div>
          </Row>
        </div>

        {partialOpen ? (
          <div>
            <Row className="mt-3">
              <div className="col-md-2 ms-5">
                {props.formMethods
                  ? props.formMethods.getValues(props.field1)
                  : props.field1}
              </div>
              <div className="col-md-3">
                {props.formMethods
                  ? props.formMethods.getValues(props.field2)
                  : props.field2}
              </div>
              <div className="col-md-2">
                {props.formMethods
                  ? props.formMethods.getValues(props.field3)
                  : props.field3}
              </div>
              <div className="col-3">
                {props.formMethods
                  ? props.formMethods.getValues(props.editablefield)
                  : props.editablefield}
              </div>
              <div>
                {props.formMethods
                  ? props.formMethods.getValues(props.field4)
                  : props.field4}
              </div>
            </Row>
            <div className="ms-3 me-3">{props.fndsection}</div>
          </div>
        ) : null}
      </div>
      <div className={`collapse ${collapse && !partialOpen ? "show" : ""}`}>
        <div className="card-body">{props.children}</div>
      </div>
    </div>
  );
};

export default Section;
