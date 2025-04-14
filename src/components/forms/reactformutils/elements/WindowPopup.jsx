import { Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useTheme from "src/hooks/useTheme";
import {
  faPlus,
  faList,
  faPlusCircle,
  faTimesCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const WindowPopup = (props) => {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <div className="popup-box ">
        <div className="box ">
          <div className="text-break fixed-header  bg-white ">
            <h3 class="font-weight-bold text-primary">{props.header}</h3>
            <hr></hr>
          </div>

          <div className="h4 scrollable-content " style={{ color: "black" }}>
            {props.content}
          </div>
          <hr></hr>
          <div className="text-break   ">
            {/* {props.footer} */}

            <>
              <div className="d-flex justify-content-end">
                <Button variant="primary" size="lg" onClick={props.onHide}>
                  <FontAwesomeIcon icon={faCheckCircle} size="lg" /> Close
                </Button>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default WindowPopup;
