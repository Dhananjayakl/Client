// import React from "react";

// const Popup = props => {
//     return (
//         <div className="popup-box">
//             <div className="box">
//                 {props.content}
//             </div>
//         </div>
//     );
// };

// export default Popup;

import { Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faList,
  faPlusCircle,
  faTimesCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { LogIn } from "react-feather";

const Popup = (props) => {
  console.log(props, "pop up props");
  return (
    <>
      <div className="popup-box ">
        <div className="box bg-white">
          <div className="text-break fixed-header  bg-white ">
            <h3>{props.header}</h3>
            <hr></hr>
          </div>

          <div className="scrollable-content ">{props.content}</div>
          <hr></hr>
          <div className="text-break   ">
            {/* {props.footer} */}

            <>
              <div className="d-flex justify-content-end">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  ref={props.runtimeParams.submitRef}
                  // onClick={props.onSubmit}
                  onClick={props.runtimeParams.formMethods.handleSubmit((data) =>{
                     props.runtimeParams.setLoadingFlag(true);
                    props.runtimeParams.ServerCall(
                      data,
                      props.runtimeParams.formService,
                      props.runtimeParams.objectId
                    )
                  }
                  )}
                  id={props.form}
                >
                  <FontAwesomeIcon icon={faCheckCircle} size="lg" /> Submit
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="lg"
                  className="ms-1"
                  onClick={() => {
                    if (props.form.onCancel) {
                      props.form.onCancel(props.header);
                    }
                    props.closePopup(null);
                  }}
                >
                  <FontAwesomeIcon icon={faTimesCircle} size="lg" /> Cancel
                </Button>
              </div>
            </>
          </div>

          {/* {props.content} */}
        </div>
      </div>
    </>
  );
};

export default Popup;
