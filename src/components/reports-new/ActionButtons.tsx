import { RowData, RowModel } from "@tanstack/react-table";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";

import { Pagination, Row, Col, Form } from "react-bootstrap";

type Props<T extends RowData> = {
  getSelectedRowModel: () => RowModel<T>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => void;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  previousPage: () => void;
  refreshData: () => void;
  rerender: () => void;
  rowSelection: Object;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  totalRows: number;
};

export function ActionButtons<T extends RowData>({
  getSelectedRowModel,
  hasNextPage,
  hasPreviousPage,
  nextPage,
  pageCount,
  pageIndex,
  pageSize,
  previousPage,
  refreshData,
  rerender,
  rowSelection,
  setPageIndex,
  setPageSize,
  totalRows,
}: Props<T>) {
  const [pageLink, setPageLink] = React.useState(0);

  React.useEffect(() => {
    // console.log("pageIndex",pageIndex,"pageLink",pageLink);
    if (pageIndex < pageLink)
      setPageLink(() => (pageIndex == 0 ? 0 : pageIndex - 4));
    else if (pageIndex > pageLink + 4) {
      setPageLink(() => pageIndex);
    }
  }, [pageIndex]);

  return (
    <React.Fragment>
      <Row style={{ border: "1px solid gray" }}>
        <Col md="4">
          <strong> {totalRows} </strong> Rows |
          <span className="mx-2">
            Page{"  "}
            <strong>
              {pageIndex + 1} of {pageCount}
            </strong>
          </span>
          <span className="ms-3 me-2">Show </span>
          <Form.Select
            className="d-inline-block w-auto"
            value={pageSize}
            onChange={(e: any) => {
              setPageSize(Number(e.target.value));
            }}
          >

            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </Form.Select>
          <span className="ms-3 me-2">records </span>

        </Col>
        <Col md="3">
          {/* <button className="border p-1 rounded" onClick={rerender}>
          <FontAwesomeIcon icon={faRepeat} />
          </button> */}
          <button className="border p-1 rounded" onClick={refreshData}>
            <FontAwesomeIcon icon={faArrowsRotate} />
          </button>

          <span className="ms-3 me-2">Go to page:</span>
          <Form.Control
            className="d-inline-block"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              setPageIndex(page);
            }}
            style={{ width: "75px" }}
          />
        </Col>
        <Col md="5">
          <Pagination>
            <Pagination.Item
              onClick={() => setPageIndex(0)}
              disabled={!hasPreviousPage}
            >
              First
            </Pagination.Item>
            <Pagination.Prev
              onClick={() => previousPage()}
              disabled={!hasPreviousPage}
            >
              {" "}
              Prev
            </Pagination.Prev>
            {[0, 1, 2, 3, 4].map((value, index, array) => {
              return (
                <Pagination.Item
                  style={{ margin: "0px 2px" }}
                  active={pageLink + value === pageIndex}
                  onClick={() => setPageIndex(pageLink + value)}
                  hidden={pageLink + value < 0 || pageLink + value > pageCount}
                >
                  {pageLink + value + 1}
                </Pagination.Item>
              );
            })}
            <Pagination.Next onClick={() => nextPage()} disabled={!hasNextPage}>
              {" "}
              Next
            </Pagination.Next>
            <Pagination.Last
              onClick={() => setPageIndex(pageCount - 1)}
              disabled={!hasNextPage}
            >
              {" "}
              Last
            </Pagination.Last>
          </Pagination>
        </Col>
      </Row>

      {/* <div className="flex items-center gap-2">
        <div>
          <button className="border p-1 rounded" onClick={rerender}>
            Force Rerender
          </button>
        </div>
        <div>
          <button className="border p-1 rounded" onClick={refreshData}>
            Refresh Data
          </button>
        </div>
        <div>
          <button
            className="border rounded p-2 mb-2"
            onClick={() => console.info('rowSelection', rowSelection)}
          >
            Log `rowSelection` state
          </button>
        </div>
        <div>
          <button
            className="border rounded p-2 mb-2"
            onClick={() =>
              console.info(
                'table.getSelectedFlatRows()',
                getSelectedRowModel().flatRows
              )
            }
          >
            Log table.getSelectedFlatRows()
          </button>
        </div>
      </div> */}
    </React.Fragment>
  );
}

export default ActionButtons;
