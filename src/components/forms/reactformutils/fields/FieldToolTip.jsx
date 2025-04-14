import React, { useState, useRef } from "react";
import OverlayTrigger from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";

function CustomTooltip(props) {
  //console.log("Tooltip Props:", props);
  const [show, setShow] = useState(false);
  const target = useRef(null);

  const handleMouseEnter = () => setShow(true);
  const handleMouseLeave = () => setShow(false);
  let { tooltip, guidence, placement } = props;

  if (tooltip || guidence)
    return (
      <>
        <span
          ref={target}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {props.children}
        </span>

        <OverlayTrigger
          show={show}
          target={target.current}
          placement={placement || "top"}
        >
          {({
            // placement,
            // arrowProps,
            show: overlayShow,
            popper,
            ...overlayProps
          }) => (
            <Popover {...overlayProps} show={overlayShow}>
              <div className="p-2 bg-success p-2 text-dark bg-opacity-25">
                <span>{props.tooltip}</span>
                <span>{props.guidence}</span>
              </div>
            </Popover>
          )}
        </OverlayTrigger>
      </>
    );
}

export default CustomTooltip;
