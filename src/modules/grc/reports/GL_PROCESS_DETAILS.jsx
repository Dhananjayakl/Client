import React from "react";
import { Card, Col, Row } from "react-bootstrap";

const ReportTileLayouts = (props) => {
  let { table, flexRender } = props;

  return (
    <>
      {table.getRowModel().rows.map((row, rowIndex) => {
        return (
          <Card key={rowIndex} className="mb-3 p-2">
            <Card.Body className="m-0 p-1">
              <Row className="d-flex flex-column justify-content-evenly">
                {row.getVisibleCells().map((record, cellIndex) => (
                  <div key={cellIndex} className="d-flex p-1">
                    <Col className="m-0 p-0 me-2" md={3} xs={3}>
                      <span className="m-0 p-0 fw-bold fs-5 text-primary">
                        {flexRender(
                          record.column.columnDef.header,
                          record.getContext()
                        )}
                      </span>
                    </Col>
                    <Col className="m-0 p-0" md={1} xs={1}>
                      :
                    </Col>
                    <Col className="" md="auto">
                      <span
                        style={{ fontSize: "12px" }}
                        className="text-primary"
                      >
                        {record.getValue() === true
                          ? "true"
                          : record.getValue()}
                      </span>
                    </Col>
                  </div>
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
