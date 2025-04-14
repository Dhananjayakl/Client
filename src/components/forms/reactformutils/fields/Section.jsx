import React, { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { CollapseContext } from "../../../../contexts/SectionProvider";
import { useTranslation } from "react-i18next";
const Section = (props) => {
  const [rotate, setRotate] = useState(180);
  const {t}=useTranslation("common");
  const { sectionStates, setSectionStates, activeSection, setActiveSection } =
    useContext(CollapseContext);
  const isCollapsed = sectionStates[props.title];

  useEffect(() => {
    setRotate(isCollapsed ? 180 : 90);
  }, [isCollapsed]);

  useEffect(() => {
    const handleScroll = () => {
      const topbarElement = document.getElementById("topbar");
      const topbarRect = topbarElement.getBoundingClientRect();

      const sectionElement = document.getElementById(props.title);
      const sectionRect = sectionElement.getBoundingClientRect();
      const sectionTop = sectionRect.top;

      const middleOfViewport = window.innerHeight / 2;

      if (sectionTop <= middleOfViewport) {
        setActiveSection(props.title);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [props.title]);

  useEffect(() => {
    setSectionStates((prevSectionStates) => {
      const defaultStatus =
        sectionStates[props.title] ||
        (props.expand === undefined ? true : props.expand);
      const newSections = {
        ...prevSectionStates,
        [props.title]: defaultStatus,
      };
      return newSections;
    });
  }, [props.title]);

  const handleToggle = () => {
    const newSections = { ...sectionStates, [props.title]: !isCollapsed };
    setSectionStates(newSections);
  };

  const headerStyle = {
    backgroundColor: props.bgcolor,
  };

  const titleStyle = {
    fontSize: props.font,
    fontWeight: props.fontWeight,
  };

  return (
    <div
      id={props.title}
      // className="card rounded"
      className={`${props.hideSection ? "d-none" : ""} card rounded`}
      style={{ boxShadow: "rgb(197 201 200 / 60%) 0px 0px 0.7rem 0px" }}
    >
      <div
        className={`card-header form-section ${props.headerClass}`}
        onClick={handleToggle}
        style={headerStyle}
      >
        <h5 className="mb-0" style={titleStyle}>
          <a
            className={`ps-1 text-decoration-none ${
              props.headerfont ? " text-white" : "text-dark"
            }`}
          >
            <FontAwesomeIcon
              icon={faAngleUp}
              style={{ transform: `rotate(${rotate}deg)` }}
            />
            <span className="ms-1">
              {t(props.title)}
              {props.required && <span className="text-danger">*</span>}
            </span>
          </a>
        </h5>
      </div>
      <div className={`collapse ${isCollapsed ? "show" : ""}`}>
        <div className="card-body text-black">{props.children}</div>
      </div>
    </div>
  );
};

export default Section;
