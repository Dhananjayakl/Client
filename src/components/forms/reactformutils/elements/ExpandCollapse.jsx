import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useCollapseContext from "../../../../hooks/useCollapseContext.js";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Col, Row } from "react-bootstrap";

let ExpandCollapse = (props) => {
  let { formMetaData, runtimeParams } = props;
  const { sectionStates, activeSection, collapseSections, expandSections } =
    useCollapseContext();

  let isRequired = Object.keys(sectionStates).length > 1;
  if (isRequired)
    return (
      <>
        <div className="d-flex justify-content-end ">
          <Button
            variant="light"
            className={`rounded-circle d-flex align-items-center py-1 justify-content-center`}
            onClick={expandSections}
          >
            <FontAwesomeIcon icon={faAngleDoubleDown} size="lg" />
          </Button>
          <Button
            variant="light"
            className={`rounded-circle d-flex align-items-center py-1  justify-content-center`}
            onClick={collapseSections}
          >
            <FontAwesomeIcon icon={faAngleDoubleUp} size="lg" />
          </Button>
        </div>
      </>
    );
};

export default ExpandCollapse;
