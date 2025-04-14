import React, { useState } from "react";
// import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import { ExclamationTriangleFill, Check2Circle } from "react-bootstrap-icons";
// import { useNavigate, Link } from "react-router-dom";
import CloseButton from "./CloseButton";

function NotificationModal(props) {
  // let navigate = useNavigate();
  let { runtimeParams } = props;

  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  return (
    <Modal
      {...props}
      size="md"
      
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Access Denied
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ display: "flex" }}>
          <ExclamationTriangleFill
            className="bi flex-shrink-0 me-2"
            width="45"
            height="45"
            color="red"
          />
          <h4>
            Unfortunately, you don't have the necessary permissions to view or
            Edit the details. Please contact the System Administrator.
          </h4>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <CloseButton runtimeParams={runtimeParams}></CloseButton>

        {/* <Button onClick={() => {
          props.onHide();
          //  navigate(`/report?report=areaofcompliance`)
          navigate("/grc/dashboard");

        }} style={{ borderRadius: '20px', marginRight: "50px", border: "3px solid white" }}>Close</Button> */}
      </Modal.Footer>
    </Modal>
  );
}

// export function FormSubmissionModal(props){
//   let {runtimeParams} = props;
//   return (
//     <Modal
//       {...props}
//       size="md"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered

//     >
//       <Modal.Header closeButton>
//         <Modal.Title id="contained-modal-title-vcenter">
//           Form Submission Successful
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body >
//         <div style={{ display: "flex" }}>
//         <Check2Circle className="bi flex-shrink-0 me-2" width="45" height="45" color="green" />
//           <h4>
//                 Form Submitted successfully.
//           </h4>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//       <CloseButton runtimeParams={runtimeParams}></CloseButton>

//         {/* <Button onClick={() => {
//           props.onHide();
//           //  navigate(`/report?report=areaofcompliance`)
//           navigate("/grc/dashboard");

//         }} style={{ borderRadius: '20px', marginRight: "50px", border: "3px solid white" }}>Close</Button> */}
//       </Modal.Footer>
//     </Modal>
//   );
// }
export default NotificationModal;
