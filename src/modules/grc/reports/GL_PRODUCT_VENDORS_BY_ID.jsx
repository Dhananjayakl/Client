import React from "react";
import { Card, Table, Col } from "react-bootstrap";

const ReportTileLayouts = (props) => {
  let { table, flexRender } = props;

  let colorField;
  let applyColor;
  let applyFont;

  return (
    <>
      {table.getRowModel().rows.map((row, i) => {
        return (
          <Card className="custom-card">
            <Table className="border-0">
              <tbody>
                <tr className="flex-header">
                  {...row.getVisibleCells().map((cell, cellIndex) => {
                    colorField = null;
                    applyColor = null;
                    if (cell.column.columnDef.colors?.length > 0)
                      cell.column.columnDef.colors.map((items) => {
                        if (items.column_value == cell.getValue()) {
                          colorField = items.background_color;
                          applyColor = items.apply_color;
                          applyFont = items.font_color;
                        }
                      });
                    // let cellProps = cell.getCellProps();
                    // cellProps.style.color = applyColor == 2 ? applyFont : "";
                    // cellProps.style.backgroundColor =
                    //   applyColor == 2 ? colorField : "";// Replace with your colors

                    // const header = headerGroups[0].headers[cellIndex];
                    return (
                      <div className="header-cell-width d-flex pt-0">
                        <Col className="d-flex">
                          <td
                            key={cellIndex}
                            className="border-0 cell bold-header  "
                          >
                            <strong>
                              {" "}
                              {flexRender(
                                cell.column.columnDef.header,
                                cell.getContext()
                              )}{" "}
                            </strong>
                          </td>
                        </Col>
                        :
                        <Col>
                          <td
                            style={{
                              color: applyColor == 2 ? applyFont : "",
                              minWidth: "150px",
                              width: "100%",
                              backgroundColor:
                                applyColor == 2 ? colorField : "", 
                            }}
                          >
                            {applyColor == 1 ? (
                              <span
                                className="badge rounded-pill"
                                style={{
                                  backgroundColor: colorField,
                                  color: applyColor == 1 ? applyFont : "",
                                }}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </span>
                            ) : (
                              <span>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </span>
                            )}
                          </td>
                        </Col>
                      </div>
                    );
                  })}
                </tr>
              </tbody>
            </Table>
          </Card>
        );
      })}
    </>
  );
};

export default ReportTileLayouts;
