import React from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import { useNavigate } from "react-router-dom";

const ReportTileLayouts = (props) => {
  let { table, flexRender } = props;

  return (
    <>
      {table.getRowModel().rows.map((row, rowIndex) => {
        const { original } = row;
        console.log("original", original);
        return (
          <ProjectTask
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

let ProjectTask = ({ rowIndex, row, original, column }) => {
  let [expand, setExpand] = React.useState(false);
  const handleClick = () => setExpand(!expand);
  const navigate = useNavigate();
  let objectId = row?.original?.object_id;

  const refreshIssueReportRef = React.useRef(null);
  const refreshTaskReportRef = React.useRef(null);

  let refreshTaskReport = (props) => {
    refreshTaskReportRef.current();
  };
  let handleFormOpen = () => {
    navigate(`/form/runtime?formService=task&objectId=${objectId}`);
  };

  return (
    <Card key={rowIndex} className="border rounded mb-2 text-dark">
      <Card.Header className="py-0 px-2">
        <Row className="">
          <Col className="h6 mb-0">
            <Button
              className="rounded-circle"
              variant="light"
              size="sm"
              onClick={handleClick}
            >
              <FontAwesomeIcon
                icon={faAngleUp}
                style={{ transform: `rotate(${expand ? 180 : 90}deg)` }}
              />
            </Button>
            <span
              className="text-decoration-underline cursor-pointer"
              onClick={handleFormOpen}
            >
              {" "}
              {original.task_title}
            </span>
          </Col>
          <Col className="h6 text-end mb-0 mt-1">{original.status}</Col>
        </Row>
      </Card.Header>
      <Card.Body className={` border-top ${expand ? "" : "d-none"}  `}>
        <Row className="mt-1">
          {/* {original.d_project && (
            <Col>
              <span className="form-label fw-bold  ">
                {column[0].columnDef.header} :
              </span>{" "}
              <span> {original.d_project}</span>
            </Col>
          )} */}
          {original.d_product_name && (
            <Col>
              <span className="form-label fw-bold">
                {column[4].columnDef.header} :
              </span>{" "}
              {original.d_product_name}
            </Col>
          )}
          {/* {original.d_project && (
            <Col>
              <span className="form-label fw-bold">
                {column[2].columnDef.header} :
              </span>{" "}
              {original.d_project_status}
            </Col>
          )} */}
        </Row>

        <Row className="mt-1">
          <Col>
            <span className="form-label fw-bold">
              Task {column[3].columnDef.header} :
            </span>

            {original.d_task_assignee}
          </Col>
          <Col>
            <span className="form-label fw-bold">
              {column[6].columnDef.header} :
            </span>

            {original.planned_task_start_date}
          </Col>
          <Col>
            <span className="form-label fw-bold">
              {column[7].columnDef.header} :
            </span>

            {original.planned_task_end_date}
          </Col>
        </Row>
        <Row className="mt-1">
          <Row>
            <Col>
              <h6>Task Activities</h6>
            </Col>

            <Col className="h6 text-end mb-1">
              <ModalForm
              formService="taskactivities"
              objectId={-1}
                component={
                  
                  <FormRunTime
                    formService="taskactivities"
                    objectId={-1}
                    // notform={true}
                    modal
                    ParentFormObjectId={original.object_id}
                    callbackParent={refreshTaskReport}
                  />
                }
                buttonText={
                  <>
                    <FontAwesomeIcon icon={faPlusCircle} size="lg" /> Add
                    Activities
                  </>
                }
              />
            </Col>
          </Row>
          <ReportRuntime
            report="PM_TASK_ACTIVITIES"
            refreshdataref={refreshTaskReportRef}
            drilldownReports={{ taskId: original.object_id }}
          />
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ReportTileLayouts;
