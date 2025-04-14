import { createContext, useState } from "react";
import React from "react";

export const CollapseContext = createContext();

export const CollapseProvider = ({ children }) => {
  const [sectionStates, setSectionStates] = useState(() => {
    const initialState = {};
    return initialState;
  });
  console.log(children, "props");
  const [activeSection, setActiveSection] = useState("");
  const collapseSections = () => {
    setSectionStates((prevSectionStates) => {
      const newSectionStates = { ...prevSectionStates };

      for (const key in prevSectionStates) {
        newSectionStates[key] = false; // Setting all sections to collapsed
      }

      return newSectionStates;
    });
    setActiveSection("");
    //window.scrollTo({ top: 0, behavior: "smooth" });   commented due to extra section adding to the section navigation when validation error popup scenario
  };

  const expandSections = () => {
    setSectionStates((prevSectionStates) => {
      const newSectionStates = { ...prevSectionStates };
      for (const key in prevSectionStates) {
        newSectionStates[key] = true; // Setting all sections to expanded
      }

      return newSectionStates;
    });

    setActiveSection("");
  };

  return (
    <CollapseContext.Provider
      value={{
        sectionStates,
        setSectionStates,
        activeSection,
        setActiveSection,
        collapseSections,
        expandSections,
      }}
    >
      {children}
    </CollapseContext.Provider>
  );
};
