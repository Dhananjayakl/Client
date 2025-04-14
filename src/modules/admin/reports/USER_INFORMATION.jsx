import React from "react";
import { Card, Col, Row } from "react-bootstrap";
//import './ReportTileLayouts.css'; // Import custom CSS for additional styling if needed
import logo from "src/assets/img/logo.png";

const ReportTileLayouts = (props) => {
  let { table, flexRender } = props;

  // if (!headerGroups || headerGroups.length === 0) {
  //   return <div>No Records Available</div>;
  // }

  return (
    <>
      {/* {table.getRowModel().rows.map((row, rowIndex) => {
        return (
          <Card key={rowIndex} className="mb-3 p-2">
            <Card.Body className="m-0 p-1">
              <Row className="d-flex flex-wrap">
                {row.getVisibleCells().map((record, cellIndex) => (
                  <Col
                    key={cellIndex}
                    lg={4}
                    md={4}
                    xs={12}
                    className="d-flex align-items-center mb-2"
                  >
                    <span className="fw-bold text-primary me-2">
                      {flexRender(
                        record.column.columnDef.header,
                        record.getContext()
                      )}
                      :
                    </span>
                    <span className="text-primary" style={{ fontSize: "12px" }}>
                      {record.getValue() === true ? "true" : record.getValue()}
                    </span>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        );
      })} */}
      {table.getRowModel().rows.map((row, rowIndex) => {
        return (
          <Card key={rowIndex} className="mb-3 p-2">
            <Card.Body className="m-0 p-1">
              <Row className="d-flex flex-wrap">
                {row.getVisibleCells().map((record, cellIndex) => (
                  <Col
                    key={cellIndex}
                    lg={4}
                    md={5}
                    xs={12}
                    className="d-flex align-items-center mb-2 flex-wrap"
                  >
                    {/* Label section */}
                    <div
                      className="fw-bold text-primary"
                      style={{
                        flexBasis: "40%",
                        minWidth: "100px",
                        flexShrink: 0,
                      }}
                    >
                      {flexRender(
                        record.column.columnDef.header,
                        record.getContext()
                      )}
                    </div>

                    {/* Value section */}
                    <div
                      className="text-primary flex-grow-1 "
                      style={{
                        fontSize: "10px",
                        flexShrink: 0,
                      }}
                    >
                      :{" "}
                      {record.getValue() === true ? "true" : record.getValue()}
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
};

export default ReportTileLayouts;
