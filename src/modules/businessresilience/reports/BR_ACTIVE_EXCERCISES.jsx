import React from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";

const ReportTileLayouts = (props) => {
  let { table } = props;

  return (
    <>
      {table.getRowModel().rows.map((row, rowIndex) => {
        const { original } = row;
        return (
          <Excercise
            key={original.object_id || rowIndex}
            rowIndex={rowIndex}
            row={row}
            original={original}
            column={table.getAllColumns()}
          />
        );
      })}
    </>
  );
};

let Excercise = ({ rowIndex, original, column }) => {
  let [expand, setExpand] = React.useState(false);
  const handleClick = () => setExpand(!expand);

  const refreshIssueReportRef = React.useRef(null);
  const refreshTaskReportRef = React.useRef(null);

  let refreshIssueReport = (props) => {
    refreshIssueReportRef.current();
  };

  let refreshTaskReport = (props) => {
    refreshTaskReportRef.current();
  };

  console.log(original, column, "ghhghg");

  return (
    <Card key={rowIndex} className="border rounded mb-2 text-dark">
      <Card.Header className="py-0 px-2">
        <Row className="">
          <Col md={10} className="h6 mb-0">
            <Button
              className="  rounded-circle"
              variant="light"
              size="sm"
              onClick={handleClick}
            >
              <FontAwesomeIcon
                icon={faAngleUp}
                style={{ transform: `rotate(${expand ? 180 : 90}deg)` }}
              />
            </Button>
            {original.exercise_name}
          </Col>
          <Col md={2} className="h6 text-end mb-0 mt-1">
            {original.d_exercise_methods}
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className={` border-top ${expand ? "" : "d-none"}  `}>
        <Row>
          <Col>
            <span className="form-label fw-bold">
              {column[2].columnDef.header} :
            </span>{" "}
            {original.d_exercise_owner}
          </Col>
          {/* <Col>
            <span className="form-label fw-bold">
              {column[7].columnDef.header} :
            </span>{" "}
            <br />
            {original.d_process_recovered}
          </Col>
          <Col>
            <span className="form-label fw-bold">
              {column[8].columnDef.header} :
            </span>{" "}
            <br />
            {original.d_exercise_result}
          </Col> */}
          <Col className="active-review ">
            <span className="form-label fw-bold">
              {original.d_plan_reviewer ? column[3].columnDef.header + ":" : ""}
            </span>
            <br />
            {original.d_plan_reviewer}
          </Col>
          <Col className="active-excercise">
            <span className="form-label fw-bold">
              {column[5].columnDef.header} :
            </span>
            <br />
            {original.start_date}
          </Col>
        </Row>

        <Row className="mt-1">
          <Col>
            <span className="form-label fw-bold">
              {column[6].columnDef.header} :
            </span>
            {original.status}
          </Col>
          <Col>
            <span className="form-label fw-bold">
              {original.d_pl_review ? column[3].columnDef.header + ":" : ""}
            </span>
            {original.d_pl_review}
          </Col>
          <Col></Col>
          <Col></Col>
        </Row>
        <Row className="mt-1">
          <Row>
            <Col>
              <h6>Task Details</h6>
            </Col>
            {original.exercise_methods === 1 && (
              <Col className="h6 text-end mb-1">
                <ModalForm
                  objectId={-1}
                  forname="exercisefunctional"
                  component={
                    <FormRunTime
                      formService="exercisefunctional"
                      objectId={-1}
                      modal
                      ParentFormObjectId={original.object_id}
                      callbackParent={refreshTaskReport}
                    />
                  }
                  buttonText={
                    <>
                      <FontAwesomeIcon icon={faPlusCircle} size="lg" /> Add Task
                    </>
                  }
                />
              </Col>
            )}
          </Row>
          <ReportRuntime
            report="BR_EXERCISE_FUNCTIONAL"
            refreshdataref={refreshTaskReportRef}
            drilldownReports={{ exerciseId: original.object_id }}
          />
        </Row>
        <Row>
          <Row>
            <Col>
              <h6>Findings</h6>
            </Col>
            <Col className="h6 text-end mb-1">
              <ModalForm
                objectId={-1}
                forname="issueobservation"
                component={
                  <FormRunTime
                    formService="issueobservation"
                    objectId={-1}
                    modal
                    ParentFormObjectId={original.object_id}
                    fndApprover={original.exercise_owner}
                    fndBusinessUnit={original.business_unit}
                    program="5"
                    callbackParent={refreshIssueReport}
                    source_form_name="BR_EXERCISE_PLAN"
                  />
                }
                buttonText={
                  <>
                    <FontAwesomeIcon icon={faPlusCircle} size="lg" /> Add
                    Finding
                  </>
                }
              />
            </Col>
          </Row>

          <ReportRuntime
            report="IR_BR_FINDINGS"
            refreshdataref={refreshIssueReportRef}
            drilldownReports={{ exerciseId: original.object_id }}
          />
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ReportTileLayouts;
