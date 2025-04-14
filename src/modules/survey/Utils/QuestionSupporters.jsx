import React, { useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";

const QuestionSupporters = ({
  question,
  quesRecord,
  questionRowIndex,
  formMetaData,
  formMethods,
  control,
  respondStage,
  approverStage,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(approverStage ? true : false);
  const [rotate, setRotate] = useState(approverStage ? 180 : 90);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    setRotate(isCollapsed ? 90 : 180);
  };
  return (
    <div className="rounded border-light-subtle p-0">
      <div onClick={handleToggle}>
        <FontAwesomeIcon
          icon={faAngleUp}
          style={{ transform: `rotate(${rotate}deg)` }}
        />
        <span className="ms-1 text-dark">Additional Information</span>
      </div>
      <div className={`collapse ${isCollapsed ? "show" : ""}`}>
        <Row className="m-0">
          {question?.qstSupportComments === true && (
            <Col className="text-light-subtle mb-1 m-0" md={6}>
              <FormControl
                control={control}
                name={`${quesRecord}.qstComments`}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          )}

          {question?.qstSupportDocuments === true && (
            <Col className="text-light-subtle mb-1 m-0" md={6}>
              <FormControl
                control={control}
                name={`${quesRecord}.qstDocuments`}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default QuestionSupporters;

// import React from "react";
// import { Button, Row, Col, Modal } from "react-bootstrap";
// import FormControl from "src/components/forms/reactformutils/FormControl";
// import { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faFlag,
//   faFilePen,
//   faFileLines,
//   faComment,
// } from "@fortawesome/free-solid-svg-icons";

// const QuestionSupporters = ({
//   question,
//   quesRecord,
//   questionRowIndex,
//   formMetaData,
//   formMethods,
//   control,
//   respondStage,
//   approverStage,
// }) => {
//   const [activeQuestion, setActiveQuestion] = useState(null);

//   const handleShow = (index) => setActiveQuestion(index);
//   const handleClose = () => setActiveQuestion(null);

//   return (
//     <div>
//       {respondStage && (
//         <Row key={questionRowIndex} className="float-end m-0 p-0">
//           {(question?.qstSupportComments === true ||
//             question?.qstSupportDocuments === true) && (
//             <div>
//               {formMethods.getValues(`QST[${questionRowIndex}].qstComments`) ||
//               formMethods.getValues(`QST[${questionRowIndex}].qstDocuments`) ? (
//                 <FontAwesomeIcon
//                   icon={faComment}
//                   size="lg"
//                   onClick={() => handleShow(questionRowIndex)}
//                   className="cursor-pointer  position-absolute  p-0 m-0 "
//                   //style={{ transform: `rotate(${180}deg)` }}
//                 />
//               ) : (
//                 <FontAwesomeIcon
//                   icon={faComment}
//                   size="lg"
//                   onClick={() => handleShow(questionRowIndex)}
//                   className="cursor-pointer position-absolute  p-0 m-0"
//                   //style={{ transform: `rotate(${180}deg)` }}
//                 />
//               )}
//             </div>
//           )}
//           <Modal
//             centered
//             show={activeQuestion === questionRowIndex}
//             onHide={handleClose}
//           >
//             <Modal.Header closeButton>
//               <Modal.Title className="fw-medium text-dark">
//                 Question Additional Information
//               </Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <Row>
//                 {question?.qstSupportComments === true && (
//                   <Col className="text-light-subtle mb-1 m-0" md={12}>
//                     <FormControl
//                       control={control}
//                       name={`${quesRecord}.qstComments`}
//                       formMetaData={formMetaData}
//                       formMethods={formMethods}
//                     />
//                   </Col>
//                 )}

//                 {question?.qstSupportDocuments === true && (
//                   <Col className="text-light-subtle mb-1 m-0" md={12}>
//                     <FormControl
//                       control={control}
//                       name={`${quesRecord}.qstDocuments`}
//                       formMetaData={formMetaData}
//                       formMethods={formMethods}
//                     />
//                   </Col>
//                 )}
//               </Row>
//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="primary" onClick={handleClose}>
//                 Save Changes
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         </Row>
//       )}
//       {approverStage && (
//         <Row className="p-0 m-0 mx-2 d-flex justify-content-between align-items-center">
//           {question?.qstSupportComments === true && (
//             <Col className="p-0 m-0 px-1 mt-1" md={6}>
//               <FormControl
//                 control={control}
//                 name={`${quesRecord}.qstComments`}
//                 formMetaData={formMetaData}
//                 formMethods={formMethods}
//               />
//             </Col>
//           )}

//           {question?.qstSupportDocuments === true && (
//             <Col className="p-0 m-0" md={5}>
//               <FormControl
//                 control={control}
//                 name={`${quesRecord}.qstDocuments`}
//                 formMetaData={formMetaData}
//                 formMethods={formMethods}
//               />
//             </Col>
//           )}
//           <Col md={1}>
//             <span className="ms-2 m-0 p-0">
//               {approverStage && question?.qstFlag && (
//                 <FontAwesomeIcon
//                   icon={faFlag}
//                   className=""
//                   style={{
//                     color: "Red",
//                   }}
//                 />
//               )}
//             </span>
//           </Col>
//         </Row>
//       )}
//     </div>
//   );
// };

// export default QuestionSupporters;
