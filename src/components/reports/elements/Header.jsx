import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortUp,
  faSortDown,
  faSort,
  faEllipsisVertical,
  faFilter,
  faEye,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { Col, Row, Form } from "react-bootstrap";
import { getCommonPinningStyles } from "./StickyColumn";

const Header = (props) => {
  const { t } = useTranslation([
    "grc",
    "vendor",
    "risk",
    "compliance",
    "survey",
    "audits",
    "loss",
    "issue",
    "businessresilience",
    "documentpolicy",
  ]);

  let { reportMeta, headerGroup, flexRender, table } = props;

  const bgClass =
    reportMeta?.reportInfo?.theme === 2 ? "bg-light" : "bg-primary";
  const textClass =
    reportMeta?.reportInfo?.theme === 2 ? "text-black" : "text-white";

  useEffect(() => {
    headerGroup.headers.forEach((header) => {
      const sticky = header.column.columnDef.sticky;
      const currentPinnedPosition = header.column.getIsPinned();
      if (sticky === "left" && currentPinnedPosition !== "left") {
        header.column.pin("left");
      } else if (sticky === "right" && currentPinnedPosition !== "right") {
        header.column.pin("right");
      } else if (!sticky && currentPinnedPosition) {
        header.column.pin(false);
      }
    });
  }, [headerGroup.headers]);

  const toggleColumnVisibility = (column) => {
    column.toggleVisibility();
  };

  return (
    <>
      <tr key={headerGroup.id} className={bgClass}>
        {headerGroup.headers.map((header, idx) => {
          const alignmentClass =
            header.column.columnDef.align === 1
              ? "text-start"
              : header.column.columnDef.align === 2
              ? "text-end"
              : "text-center";

          const isSorted = header.column.getIsSorted();
          const sortOrder = header.column.getNextSortingOrder();
          const { column } = header;
          const SortBy = header.column.columnDef.disableSortBy;
          const translateColumnTitle = `${
            reportMeta?.reportInfo?.report_name
          }.${flexRender(
            header.column.columnDef.accessorKey,
            header.getContext()
          )}`;
          const translatedTitle = t(translateColumnTitle, {
            ns: [
              "grc",
              "vendor",
              "risk",
              "compliance",
              "survey",
              "audits",
              "loss",
              "issue",
              "businessresilience",
              "documentpolicy",
            ],
          });

          const isFilterApplied = column.getFilterValue();
          const popover = (
            <Popover id={`popover-${header.id}`}>
              <Popover.Body>
                {/* <Row className=" justify-content-center fw-bold fs-5 text-black p-0 m-0 ">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </Row>
                <hr /> */}
                <Row>
                  <Col
                    className={` d-flex justify-content-start align-items-center fs-sm  text-black cursor-pointer`}
                    onClick={() => toggleColumnVisibility(column)} // Toggle column visibility on click
                  >
                    <FontAwesomeIcon icon={faEye} className="me-2" />{" "}
                    {column.getIsVisible() ? "Hide" : "Show"}
                  </Col>
                  <Col className="col-8">
                    {SortBy && (
                      <>
                        <span
                          onClick={() => {
                            if (header.column.getIsSorted() !== "asc") {
                              header.column.toggleSorting(false);
                            }
                          }}
                          className={`fs-sm d-block cursor-pointer ${
                            isSorted === "asc" ? "text-black" : ""
                          }`}
                        >
                          <FontAwesomeIcon icon={faArrowUp} className="me-1" />{" "}
                          {t("Sort Ascending")}
                        </span>
                        <span
                          onClick={() => {
                            if (header.column.getIsSorted() !== "desc") {
                              header.column.toggleSorting(true);
                            }
                          }}
                          className={`fs-sm d-block cursor-pointer ${
                            isSorted === "desc" ? "text-black" : ""
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={faArrowDown}
                            className="me-1"
                          />{" "}
                          {t("Sort Descending")}
                        </span>
                      </>
                    )}
                  </Col>
                  <hr />
                  {/* <Col className="col-6  d-flex justify-content-center">
                    {SortBy && (
                      <>
                        <span
                          onClick={
                            SortBy
                              ? header.column.getToggleSortingHandler()
                              : null
                          }
                          className={`fs-sm d-block cursor-pointer `}
                        >
                          <span className="text-black me-1">Sort</span>
                          <FontAwesomeIcon
                            icon={faArrowUp}
                            className={`ms-1 me-1 ${
                              isSorted === "asc" ? "text-black" : ""
                            }`}
                          />
                          <FontAwesomeIcon
                            icon={faArrowDown}
                            className={`ms-1 me-1 ${
                              isSorted === "desc" ? "text-black" : ""
                            }`}
                          />
                        </span>
                      </>
                    )}
                  </Col> */}

                  {/* <Col className="col-8">
                    {SortBy && (
                      <>
                        <span
                          onClick={() => {
                            if (header.column.getIsSorted() !== "asc") {
                              header.column.toggleSorting(false);
                            }
                          }}
                          className={`fs-sm d-block cursor-pointer ${
                            isSorted === "asc" ? "text-black" : ""
                          }`}
                        >
                          <FontAwesomeIcon icon={faArrowUp} className="me-1" />{" "}
                          Sort Ascending
                        </span>
                        <span
                          onClick={() => {
                            if (header.column.getIsSorted() !== "desc") {
                              header.column.toggleSorting(true);
                            }
                          }}
                          className={`fs-sm d-block cursor-pointer ${
                            isSorted === "desc" ? "text-black" : ""
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={faArrowDown}
                            className="me-1"
                          />{" "}
                          Sort Descending
                        </span>
                      </>
                    )}
                  </Col> */}
                </Row>

                {/* <hr /> */}
                <Row>
                  <Col className="align-items-center d-flex  justify-content-center">
                    {header.column.columnDef.filterable
                      ? flexRender(
                          header.column.columnDef.Filter,
                          header.getContext()
                        )
                      : "No filter available"}
                  </Col>
                </Row>
                {/* <Row>
                  {" "}
                  <Form className="align-items-center  d-flex  justify-content-center fs-5">
                    <Form.Check
                      inline
                      label="AND"
                      name="group1"
                      type="radio"
                      id={`inline-radio-1`}
                    />
                    <Form.Check
                      inline
                      label="OR"
                      name="group1"
                      type="radio"
                      id={`inline-radio-2`}
                    />
                  </Form>
                </Row> */}
              </Popover.Body>
            </Popover>
          );

          return (
            <td
              key={header.id}
              className={` align-baseline ${textClass} text-truncate fs-5 fw-bold p-1  ${
                header.column.columnDef.sticky
                  ? `sticky-column-header ${bgClass}`
                  : ""
              } ${alignmentClass}`}
              style={{
                ...getCommonPinningStyles(column),
                // width: `${header.getSize()}px`,
              }}
            >
              <div className="d-flex align-items-center">
                <div className={`flex-grow-1 ${alignmentClass}`}>
                  {SortBy && (
                    <span
                      onClick={
                        SortBy ? header.column.getToggleSortingHandler() : null
                      }
                    >
                      {isSorted ? (
                        isSorted === "asc" ? (
                          <FontAwesomeIcon icon={faSortUp} />
                        ) : (
                          <FontAwesomeIcon icon={faSortDown} />
                        )
                      ) : (
                        <FontAwesomeIcon
                          icon={faSort}
                          // className="ms-2"
                          style={{ color: "grey" }}
                        />
                      )}
                    </span>
                  )}{" "}
                  {translatedTitle !== translateColumnTitle
                    ? translatedTitle
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </div>
                {isFilterApplied?.value &&
                  reportMeta?.reportInfo?.optional_column_header_filter && (
                    <div>
                      <FontAwesomeIcon
                        icon={faFilter}
                        className="me-2 ms-2"
                        title="Filter Applied"
                      />
                    </div>
                  )}
                {reportMeta?.reportInfo?.optional_column_header_filter &&
                  header.column.columnDef.filterable && (
                    <div className="ms-auto">
                      <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        overlay={popover}
                        rootClose
                      >
                        <span className="d-inline-bloc cursor-pointer">
                          <FontAwesomeIcon icon={faEllipsisVertical} />
                        </span>
                      </OverlayTrigger>
                    </div>
                  )}
              </div>
            </td>
          );
        })}
      </tr>
    </>
  );
};

export default Header;
