import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faRepeat,
  faArrowLeft,
  faArrowRight,
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { Pagination, Button, Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export function SimplePagination({
  pageIndex,
  pageCount,
  setPageIndex,
  table,
}) {
  const [inputPage, setInputPage] = React.useState(pageIndex + 1);
  const { t } = useTranslation("common");

  const handleInputChange = (e) => {
    setInputPage(e.target.value);
  };
  const handleGoToPage = () => {
    const page = parseInt(inputPage, 10);
    if (page >= 1 && page <= table.getPageCount()) {
      table.setPageIndex(page - 1);
    }
  };

  return (
    <>
      {/* {reportMeta?.reportInfo?.enable_pagination && ( */}
      <Row className="mx-2 pt-3 justify-content-center d-sm-none">
        <Col xs="auto" className="text-center">
          <button
            className="border p-1 rounded"
            onClick={() =>
              table.setPageIndex((prevIndex) => Math.max(prevIndex - 1, 0))
            }
            disabled={pageIndex === 0}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <span className="mx-2">
            {t("pages")} <strong>{pageIndex + 1}</strong> {t("of")}{" "}
            <strong>{table.getPageCount().toLocaleString()}</strong>
          </span>

          <button
            className="border p-1 rounded"
            onClick={() =>
              table.setPageIndex((prevIndex) =>
                Math.min(prevIndex + 1, table.getPageCount() - 1)
              )
            }
            disabled={pageIndex === table.getPageCount() - 1}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

          <div className="d-flex align-items-center ms-3 me-2 pt-2 pb-2">
            <span>{t("gtpgs")}</span>
            <Form.Control
              className="ms-2"
              type="number"
              value={inputPage}
              onChange={handleInputChange}
              style={{ width: "75px", height: "25px" }}
            />
            <Button
              variant="primary"
              className="ms-2 btn-sm "
              onClick={handleGoToPage}
            >
              Go
            </Button>
          </div>
        </Col>
      </Row>
      {/* )} */}
    </>
  );
}

export function ActionButtons({
  // getSelectedRowModel,
  // hasNextPage,
  // hasPreviousPage,
  // nextPage,
  // pageCount,
  pageIndex,
  // pageSize,
  // previousPage,
  // setPageIndex,
  setPageSize,
  totalRows,
  reportMeta,
  table,
  pageCount,
}) {
  const { t } = useTranslation("common");
  const [pageLink, setPageLink] = React.useState(0);
  // const [currentPage, setCurrentPage] = React.useState(pageIndex + 1);
  const [recordsPerPage, setRecordsPerPage] = React.useState("");
  const [isSmallScreen, setIsSmallScreen] = React.useState(
    window.innerWidth <= 576
  );
  let totalRowPerPage = reportMeta?.reportInfo?.no_of_records_per_page;

  React.useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 576);
      // setIsSmallScreen(window.innerWidth <= 568);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  React.useEffect(() => {
    if (pageIndex < pageLink)
      setPageLink(() => (pageIndex == 0 ? 0 : pageIndex - 4));
    else if (pageIndex > pageLink + 4) {
      setPageLink(() => pageIndex);
    }
    // setCurrentPage(pageIndex + 1);
  }, [pageIndex]);

  // const isSmallScreen = useMediaQuery({ minWidth: 280, maxWidth: 576 });
  // const isSmallScreen = window.innerWidth <= 576;

  if (isSmallScreen) {
    return (
      <SimplePagination
        pageIndex={pageIndex}
        // pageCount={pageCount}
        // setPageIndex={setPageIndex}
        reportMeta={reportMeta}
        table={table}
      />
    );
  }
  const [inputValue, setInputValue] = React.useState(pageIndex + 1);

  React.useEffect(() => {
    setInputValue(pageIndex + 1); // Keep input value in sync with pageIndex
  }, [pageIndex]);
  return (
    <React.Fragment>
      {/* <Col md="4" className="col-sm-12 col-md-4 text-center"> */}
      {reportMeta?.reportInfo?.default_bottom_bar && (
        <>
          <Row className="action-buttons  mx-2 pt-3  sticky-bottom z-1 bg-white text-center">
            {reportMeta?.reportInfo?.enable_records_per_page && (
              <Col sm="12" md="auto" lg="auto" className="text-center ">
                {reportMeta?.reportInfo?.total_row && (
                  <span>
                    {" "}
                    {/* <strong className=""> {totalRows} </strong> {t("rows")} | */}
                    {totalRows === 0 ? (
                      <strong>{t("No Records")}</strong>
                    ) : (
                      <>
                        <strong className="">{totalRows}</strong> {t("Rows")}
                      </>
                    )}{" "}
                    |
                  </span>
                )}
                {reportMeta?.reportInfo?.page_of_total_page && (
                  <>
                    <span className="mx-2">
                      {t("Page")}
                      {"  "}
                      <strong className="">
                        {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount().toLocaleString()}
                        {/* {0} */}
                      </strong>
                    </span>
                    <span className=" me-2">{t("Show")}:</span>
                    <Form.Select
                      className="d-inline-block w-auto"
                      value={recordsPerPage}
                      onChange={(e) => {
                        setRecordsPerPage(Number(e.target.value));
                        setPageSize(Number(e.target.value));
                      }}
                    >
                      {/* {[totalRowPerPage, 10, 20, 30, 40, 50].map(
                        (pageSize, index) => (
                          <option key={index} value={pageSize}>
                            {pageSize}
                          </option>
                        )
                      )} */}
                      {[totalRowPerPage, 10, 20, 30, 40, 50]
                        .filter(
                          (pageSize, index, self) =>
                            self.indexOf(pageSize) === index
                        )
                        .map((pageSize, index) => (
                          <option key={index} value={pageSize}>
                            {pageSize}
                          </option>
                        ))}
                    </Form.Select>
                    <span className=" fs-6"> {t("Records")} </span>
                  </>
                )}
              </Col>
            )}

            {reportMeta?.reportInfo?.enable_pagination && (
              <Col
                sm="12"
                md="auto"
                lg="auto"
                className="  pt-1  d-flex justify-content-center"
              >
                {/* <div className=" ms-5"> */}
                {reportMeta?.reportInfo?.goto_page && (
                  <Form.Control
                    className="action-input d-inline-block"
                    type="number"
                    value={inputValue}
                    min={1}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setInputValue("");
                        return;
                      }

                      const page = Number(value) - 1;
                      setInputValue(value);
                      table.setPageIndex(page);
                    }}
                  />
                )}

                <Pagination className="action-page flex-wrap ">
                  {reportMeta?.reportInfo?.first_lastpage && (
                    <Pagination.Item
                      style={{ margin: "0px 2px" }}
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                      className=""
                    >
                      {t("First")}
                    </Pagination.Item>
                  )}
                  {reportMeta?.reportInfo?.previous_nextpage && (
                    <Pagination.Prev
                      style={{ margin: "0px 0px" }}
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      {" "}
                      {t("Prev")}
                    </Pagination.Prev>
                  )}
                  {reportMeta?.reportInfo?.page_index && (
                    <>
                      {[0, 1, 2, 3, 4].map((value, index, array) => {
                        return (
                          <Pagination.Item
                            key={index}
                            active={pageLink + value === pageIndex}
                            onClick={() => table.setPageIndex(pageLink + value)}
                            hidden={
                              pageLink + value < 0 ||
                              pageLink + value >= table.getPageCount()
                            }
                            // style={{ margin: "0px 2px" }}
                            className="z-0 "
                          >
                            {pageLink + value + 1}
                          </Pagination.Item>
                        );
                      })}
                    </>
                  )}

                  {reportMeta?.reportInfo?.previous_nextpage && (
                    <Pagination.Next
                      style={{ margin: "0px 2px" }}
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      {" "}
                      {t("Next")}
                    </Pagination.Next>
                  )}

                  {reportMeta?.reportInfo?.first_lastpage && (
                    <Pagination.Last
                      style={{ margin: "0px 2px" }}
                      onClick={() =>
                        table.setPageIndex(table.getPageCount() - 1)
                      }
                      disabled={!table.getCanNextPage()}
                    >
                      {" "}
                      {t("Last")}
                    </Pagination.Last>
                  )}
                </Pagination>
                {/* </div> */}
              </Col>
            )}
          </Row>
        </>
      )}
      {/* optional Bottom Panel start */}

      {reportMeta?.reportInfo?.enable_optional_bottom_panel && (
        <div className="optional-bottom mx-2 pt-3  sticky-bottom z-1 bg-white text-center  justify-content-between pt-2 pb-2">
          <div className="optional-col1 align-items-center ms-2 ps-2">
            {reportMeta?.reportInfo?.total_row && (
              <span>
                {" "}
                {/* <strong className=""> {totalRows} </strong> Rows | */}
                {totalRows === 0 ? (
                  <strong>{t("No Records")}</strong>
                ) : (
                  <>
                    <strong className="">{totalRows}</strong> {t("Rows")}
                  </>
                )}{" "}
                |
              </span>
            )}
            {reportMeta?.reportInfo?.page_of_total_page && (
              <>
                <span className="mx-2">
                  {t("Page")}{" "}
                  <strong className="">
                    {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount().toLocaleString()}
                  </strong>
                </span>
                <span className=" me-2">{t("Show")}:</span>
                <Form.Select
                  className="d-inline-block w-auto"
                  value={recordsPerPage}
                  onChange={(e) => {
                    setRecordsPerPage(Number(e.target.value));
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {/* {[10, 20, 30, 40, 50].map((pageSize, index) => (
                    <option key={index} value={pageSize}>
                      {pageSize}
                    </option>
                  ))} */}

                  {[totalRowPerPage, 10, 20, 30, 40, 50]
                    .filter(
                      (pageSize, index, self) =>
                        self.indexOf(pageSize) === index
                    )
                    .map((pageSize, index) => (
                      <option key={index} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                </Form.Select>
                <span className=" fs-5 ms-1"> {t("Records")} </span>
              </>
            )}
          </div>
          <div className="optional-col2  align-items-center pe-2">
            {reportMeta?.reportInfo?.first_lastpage && (
              <Button
                variant="light"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="me-1"
              >
                <FontAwesomeIcon icon={faAnglesLeft} className=" me-1 pe-1" />
              </Button>
            )}
            {reportMeta?.reportInfo?.previous_nextpage && (
              <Button
                variant="light"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="me-1"
              >
                <FontAwesomeIcon icon={faAngleLeft} className=" me-1 pe-1" />
              </Button>
            )}

            {reportMeta?.reportInfo?.previous_nextpage && (
              <Button
                variant="light"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <FontAwesomeIcon icon={faAngleRight} className=" ms-1 ps-1" />
              </Button>
            )}

            {reportMeta?.reportInfo?.first_lastpage && (
              <Button
                variant="light"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="ms-1"
              >
                <FontAwesomeIcon
                  icon={faAnglesRight}
                  className="fs-5 ms-1 ps-1"
                />
              </Button>
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );

  {
    /* optional Bottom Panel End */
  }
}

// export default ActionButtons;
export default React.memo(ActionButtons);
