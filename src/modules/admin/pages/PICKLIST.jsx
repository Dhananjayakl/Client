import ReportRuntime from "src/components/reports/Report";
import { Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

let PicklistValues = () => {
  // const navigate = useNavigate();

  // const handleClick = () => {
  //   navigate("/form/runtime?formService=picklist&objectId=-1");
  // };
  return (
    <>
      {/* <div className="ms-auto text-end mb-4 me-0">
        <Button onClick={handleClick}>Add Picklist</Button>
      </div> */}
      <Row>
        <ReportRuntime report="PICKLIST" />
      </Row>
    </>
  );
};

export default PicklistValues;
