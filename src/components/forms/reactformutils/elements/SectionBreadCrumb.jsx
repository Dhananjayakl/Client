import React, { useState, useEffect } from "react";
import useCollapseContext from "../../../../hooks/useCollapseContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const SectionBreadCrumb = () => {
  const { t } = useTranslation("common");
  const { sectionStates, activeSection, setActiveSection, setSectionStates } =
    useCollapseContext();
  const [clocation, setClocation] = useState("");

  const sections = Object.keys(sectionStates);

  const navigateSection = (sectionTitle) => {
    const sectionElement = document.getElementById(sectionTitle);
    // setActiveSection(sectionTitle); To fix the flickering
    sectionElement.scrollIntoView({ behavior: "smooth", block: "center" });
    sectionElement.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.8)";
    setTimeout(() => {
      sectionElement.style.boxShadow =
        "rgb(197 201 200 / 60%) 0px 0px 0.7rem 0px";
    }, 2000);
  };

  useEffect(() => {
    if (clocation != "" && clocation != window.location.href) {
      setSectionStates({});
      setClocation(window.location.href);
    }
  }, [window.location.href]);

  useEffect(() => {
    setClocation(window.location.href);
  }, []); // to resolve isse while navigating to another form from the current one

  return (
    <div className="bg-white d-flex  flex-wrap py-1 px-1 z-2 fs-5 fw-semibold rounded text-black  shadow">
      {/* justify-content-around */}
      {sections.map((section, index) => (
        <div key={index}>
          <span
            onClick={() => navigateSection(section)}
            className={`me-2 cursor-pointer ${
              activeSection === section
                ? " fw-medium text-black text-center text-decoration-underline pill px-2 py-1"
                : ""
            }`}
          >
            {t(section)}
          </span>
          {index < sections.length - 1 && (
            <FontAwesomeIcon
              className="me-2 text-black scrollspy-section"
              icon={faAngleDoubleRight}
            />
          )}{" "}
          {/* Render divider */}
        </div>
      ))}
    </div>
  );
};

export default SectionBreadCrumb;
