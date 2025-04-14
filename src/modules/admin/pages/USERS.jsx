import ReportRuntime from "src/components/reports/Report";
import Userform from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";
import Chart from "src/components/charts/Chart";
import { Row, Col, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import { lazy } from "@loadable/component";

const ChangePassword = lazy(() =>
  import("../forms/ChangePassword")
);

import { ModalForm } from "src/Progrec";

let User = () => {
  return (
    <>
      <div className="ms-auto  mb-4 me-0">
        
        <Row>
          <Col><span className="h4">Users</span></Col>
          <Col>

        <ButtonToolbar className="justify-content-end mb-1">
          <ButtonGroup>

            <ModalForm
              // className="me-4"
              component={<ChangePassword />}
              buttonText="Change Password"
              modalTitle="Change Password"
            /> 
            <span>" "</span>
            <OffCanvasForm
              component={
                <Userform formService="user" offCanvas objectId={-1} />
              }
              title="User"
            />
          </ButtonGroup>
        </ButtonToolbar>
        </Col>
        </Row>
      </div>

    

      <Row>
        <ReportRuntime report="USER_REPORT" />
      </Row>
      {/* <Row>
      <ReportRuntime report="USER_REPORT" dataCard/>
      </Row> */}
    </>
  );
};

export default User;
