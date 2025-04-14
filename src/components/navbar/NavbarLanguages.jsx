import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "react-bootstrap";

import usFlag from "../../assets/img/flags/us.png";
import inFlag from "../../assets/img/flags/in.png";
import frFlag from "../../assets/img/flags/fr.png";
import deFlag from "../../assets/img/flags/de.png";
import nlFlag from "../../assets/img/flags/nl.png";
import aeFlag from "../../assets/img/flags/ae.png";
import hiFlag from "../../assets/img/flags/in.png";
const languageOptions = {
  en: {
    icon: usFlag,
    name: "USA",
  },
  fr: {
    icon: frFlag,
    name: "French",
  },
  de: {
    icon: deFlag,
    name: "German",
  },
  nl: {
    icon: nlFlag,
    name: "Dutch",
  },
  ar: {
    icon: aeFlag,
    name: "Dubai",
  },
  hi: {
    icon: hiFlag,
    name: "India",
  },
};

const NavbarLanguages = () => {
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem("selectedLanguage") || "en";
  });

  const getLanguageDirection = (languageCode) => {
    const rtlLanguages = ["ar"]; // Right-to-left languages
    const locale = rtlLanguages.includes(languageCode);
    const dirval = locale ? "rtl" : "ltr";
    document.dir = dirval;
    document.body.setAttribute(
      "data-sidebar-position",
      locale ? "right" : "left"
    );
    return dirval;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem("selectedLanguage", language);
    window.location.reload();
  };

  const languageDirection = getLanguageDirection(selectedLanguage);

  useEffect(() => {
    if (!languageOptions[selectedLanguage]) {
      handleLanguageChange("en");
    }
  }, [selectedLanguage]);

  return (
    <Dropdown className="nav-item mt-1 p-0" align="end">
      <Dropdown.Toggle
        as="a"
        className="nav-link nav-flag"
        dir={languageDirection}
      >
        <img
          src={
            languageOptions[selectedLanguage]?.icon ||
            languageOptions["en"].icon
          }
          alt={
            languageOptions[selectedLanguage]?.name ||
            languageOptions["en"].name
          }
          title="Country"
        />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {Object.keys(languageOptions).map((language) => (
          <Dropdown.Item
            key={language}
            onClick={() => handleLanguageChange(language)}
          >
            <img
              src={languageOptions[language].icon}
              alt={languageOptions[language].name}
              width="20"
              className="align-middle me-1"
            />
            <span className="align-middle pe-1">
              {languageOptions[language].name}
            </span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NavbarLanguages;
