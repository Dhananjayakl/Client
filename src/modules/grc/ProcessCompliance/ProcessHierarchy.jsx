import React, { useEffect, useState } from "react";
import { getviewData } from "../GrcService";
import { Card, Spinner, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import HierarchicalProcessList from "../pages/HierarchicalProcessList";

// Function to build a flat list of relevant processes (based on objectId)
const buildRelevantProcesses = (map, objectId) => {
  const relevantProcesses = [];
  const process = map[objectId];

  if (process) {
    // Add the current process
    relevantProcesses.push({ ...process, isChild: false });

    // Add all ancestors
    let parent = process.parent ? map[process.parent] : null;
    while (parent) {
      relevantProcesses.unshift({ ...parent, isChild: false });
      parent = parent.parent ? map[parent.parent] : null;
    }

    // Add all children
    const addChildren = (children) => {
      children.forEach((child) => {
        relevantProcesses.push({ ...child, isChild: true });
        addChildren(child.children);
      });
    };

    addChildren(process?.children || []);
  }
  console.log("Relevant Processes", relevantProcesses);
  return relevantProcesses;
};

const ProcessTimeline = ({
  processes,
  selectedProcessId,
  navigate,
  setLoading,
}) => {
  const handleClick = (object_id) => {
    setLoading(selectedProcessId === object_id ? true : false);
    navigate(`/page?name=GL_PROCESS_ENV&objectId=${object_id}`);
  };

  console.log("Processes Hierarchy", processes);

  return (
    <div className="timeline">
      {processes.map((process) => (
        <div
          key={process.object_id}
          className={`timeline-item bg-body-tertiary border border-light-subtle ${
            process.isChild ? "child-item" : ""
          } py-2 px-3 my-2`}
          onClick={() => handleClick(process.object_id)}
        >
          <h5 className="ms-3">
            {process.name} ({process.hierarchy})
            {process.object_id == selectedProcessId && (
              <span className="ms-1">✅</span>
            )}
          </h5>
        </div>
      ))}
    </div>
  );
};

const ProcessHierarchy = ({ objectId }) => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getviewData({
      viewName: "pa_gl_process_bt",
      pageNumber: 0,
      pageSize: 0,
      orderExpression: "",
      filterExpression: "",
    })
      .then((response) => {
        const responseData = response.data.data;
        console.log("Process Information", responseData);

        // Map processes by object_id
        const processMap = responseData.reduce((acc, process) => {
          acc[process.object_id] = {
            object_id: process.object_id,
            name: process.name || "Unnamed Process",
            parent: process.parent || null,
            hierarchy: process.hierarchy,
            level: process.d_hierarchy,
            children: [],
          };
          return acc;
        }, {});

        responseData.forEach((process) => {
          if (process.parent && processMap[process.parent]) {
            processMap[process.parent].children.push(
              processMap[process.object_id]
            );
          }
        });

        // Building the relevant processes based on the selected objectId
        const relevantProcesses = buildRelevantProcesses(processMap, objectId);
        setProcesses(relevantProcesses);
      })
      .catch((err) => {
        console.error("Error fetching process data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [objectId]);

  return (
    <Card
      style={{ maxHeight: "55vh", minHeight: "55vh", overflowY: "auto" }}
      className="reportChart-cards"
    >
      <Card.Header className="">
        <Card.Title>Process Hierarchy</Card.Title>
      </Card.Header>
      <Card.Body>
        <div>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Row>
              {/* <Col>
                <ProcessTimeline
                  processes={processes}
                  selectedProcessId={objectId}
                  navigate={navigate}
                  setLoading={setLoading}
                />
              </Col> */}
              <HierarchicalProcessList menuData={processes} />
            </Row>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProcessHierarchy;
