import React from "react";
import { Dropdown } from "react-bootstrap";
import { Settings } from "react-feather";

import usFlag from "../../assets/img/flags/us.png";
import frFlag from "../../assets/img/flags/fr.png";
import deFlag from "../../assets/img/flags/de.png";
import nlFlag from "../../assets/img/flags/nl.png";

<FontAwesomeIcon icon={faFileExcel} />;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFileExcel,
  faFileCsv,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

const languageOptions = {
  excel: {
    icon: faFileExcel,
    label: "Export to Excel",
    name: "excel",
  },
  pdf: {
    icon: faFileCsv,
    label: "Export to PDF",
    name: "PDF",
  },
  csv: {
    icon: faFilePdf,
    label: "Export to CSV",
    name: "CSV",
  },
};

const ReportTool = () => {
  return (
    <Dropdown className="me-2 nav-item" align="end">
      <Dropdown.Toggle as="a" className="nav-link nav-flag">
        {/* <img src={Settings} alt="Settings" /> */}
        <Settings className="feather align-middle" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {Object.keys(languageOptions).map((language) => (
          <Dropdown.Item
            key={language}
            name={languageOptions[language].name}
            onClick={(e) => {}}
          >
            {/* <img
              src={languageOptions[language].icon}
              alt="English"
              width="20"
              className="align-middle me-1"
            /> */}
            <FontAwesomeIcon icon={languageOptions[language].icon} />{" "}
            <span className="align-middle">
              {languageOptions[language].label}
            </span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ReportTool;
