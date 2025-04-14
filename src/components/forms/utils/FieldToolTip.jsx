import React from "react";

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const FieldToolTip = (props) => {
  let { tooltip } = props;

  if (tooltip)
    return (
      <OverlayTrigger placement="top" overlay={<Tooltip>{tooltip}</Tooltip>}>
        <span>
          {" "}
          <FontAwesomeIcon icon={faCircleInfo} />
        </span>
      </OverlayTrigger>
    );
};

export default FieldToolTip;
