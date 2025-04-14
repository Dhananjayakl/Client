import ReportRuntime from "src/components/reports/Report";

import { Row, Col } from "react-bootstrap";

let Skills = () => {
  return (
    <>
      <Row>
        <ReportRuntime report="EM_SKILLS_DETAILS" />
      </Row>
    </>
  );
};

export default Skills;
