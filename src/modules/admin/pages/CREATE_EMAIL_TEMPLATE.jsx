import ReportRuntime from "src/components/reports/Report";

import EmailTemplate from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";
import { Row, Col } from "react-bootstrap";

let Skills = () => {
  return (
    <>
      <div className="ms-auto text-end mb-4 me-0">
        <OffCanvasForm
          component={
            <EmailTemplate
              formService="emailtemplate"
              objectId={-1}
              offCanvas
            />
          }
          title="Email Template"
        />
      </div>
      <Row>
        <ReportRuntime report="EMAIL_TEMPLATE" />
      </Row>
    </>
  );
};

export default Skills;
