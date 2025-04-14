import React, { useState, useEffect } from "react";
import { Card, Table, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faCompress,
  faArrowDown,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import ReportRuntime from "src/components/reports/Report";
import { useTranslation } from "react-i18next";
const PivotTableCard = ({
  data,
  reportMeta,
  defaultdataExpression,
  defaultFilterExpression,
  yearProp,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [reportFilter, setReportFilter] = useState({});
  const [fullscreen, setFullscreen] = useState(true);
  const [pivotDataMap, setPivotDataMap] = useState({});
  const { t } = useTranslation("common");
  useEffect(() => {
    if (data && reportMeta) {
      const groupedRecordsMap = {};

      reportMeta.dataCards
        .filter((item) => item.is_pivot)
        .forEach((item) => {
          const cardColumn = item.card_column;
          const groupedRecords = data.pivots[cardColumn] || [];

          if (groupedRecords.length > 0) {
            const rowKey = Object.keys(groupedRecords[0])[0];
            const colKey = Object.keys(groupedRecords[0])[1];
            const aggKey = Object.keys(groupedRecords[0])[2];

            const uniqueRowHeaders = [
              ...new Set(groupedRecords.map((item) => item[rowKey])),
            ];
            const uniqueColHeaders = [
              ...new Set(groupedRecords.map((item) => item[colKey])),
            ];

            const dataMap = {};
            groupedRecords.forEach((item) => {
              const rowValue = item[rowKey];
              const colValue = item[colKey];
              const aggValue = item[aggKey] || 0;

              if (!dataMap[rowValue]) dataMap[rowValue] = {};
              dataMap[rowValue][colValue] = aggValue;
            });

            // Find the specific reportMeta item for the current card
            const reportMetaItem = reportMeta.dataCards.find(
              (metaItem) => metaItem.card_id === item.card_id
            );

            // Store only the relevant reportMetaItem in the map
            groupedRecordsMap[item.card_id] = {
              dataMap,
              rowHeaders: uniqueRowHeaders,
              colHeaders: uniqueColHeaders,
              reportMetaItems: reportMetaItem ? [reportMetaItem] : [],
            };
          }
        });

      setPivotDataMap(groupedRecordsMap);
    }
  }, [data, reportMeta]);

  const handleCellClick = (
    rowValue,
    colValue,
    aggValue,
    reportMetaItems,
    grandTotal
  ) => {
    let reportFilter;

    let cardColumn = reportMetaItems[0]?.card_column;
    let subCardColumn = reportMetaItems[0]?.sub_card_column;
    if (grandTotal === "grandTotal") {
      if (defaultFilterExpression || defaultdataExpression) {
        reportFilter = `${defaultFilterExpression || defaultdataExpression} `;
      } else {
        reportFilter = "";
      }
    } else if (colValue === "TotalColumn") {
      if (defaultFilterExpression || defaultdataExpression) {
        reportFilter = `${
          defaultFilterExpression || defaultdataExpression
        } AND ${cardColumn} ${rowValue ? `= '${rowValue}'` : "IS NULL"}`;
      } else {
        reportFilter = ` ${cardColumn} ${
          rowValue ? `= '${rowValue}'` : "IS NULL"
        }`;
      }
    } else if (rowValue === "TotalRow") {
      if (defaultFilterExpression || defaultdataExpression) {
        reportFilter = `${
          defaultFilterExpression || defaultdataExpression
        } AND ${subCardColumn} ${colValue ? `= '${colValue}'` : "IS NULL"}`;
      } else {
        reportFilter = `  ${subCardColumn} ${
          colValue ? `= '${colValue}'` : "IS NULL"
        }`;
      }
    } else {
      if (defaultFilterExpression || defaultdataExpression) {
        reportFilter = `${
          defaultFilterExpression || defaultdataExpression
        } AND ${cardColumn} ${
          rowValue ? `= '${rowValue}'` : "IS NULL"
        } AND ${subCardColumn} ${colValue ? `= '${colValue}'` : "IS NULL"}`;
      } else {
        reportFilter = `${cardColumn} ${
          rowValue ? `= '${rowValue}'` : "IS NULL"
        } AND ${subCardColumn} ${colValue ? `= '${colValue}'` : "IS NULL"}`;
      }
    }

    setReportFilter(reportFilter);
    setShowModal(true);
  };

  const handleFullscreen = () => setFullscreen(!fullscreen);
  const handleClose = () => setShowModal(false);

  return (
    <>
      {Object.keys(pivotDataMap).map((cardId) => {
        const { dataMap, rowHeaders, colHeaders, reportMetaItems } =
          pivotDataMap[cardId];
        // const grandTotals = colHeaders.map((col) =>
        //   rowHeaders.reduce((sum, row) => sum + (dataMap[row]?.[col] || 0), 0)
        // );

        return (
          <Card className="flex-fill reportChart-cards" key={cardId}>
            <Card.Header
              as="h5"
              className="d-flex justify-content-between p-0  pt-2 ps-3"
            >
              <h5 className="p-0 m-0">
                {t(reportMeta?.reportInfo?.report_title)}
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table bordered responsive="sm">
                  <thead>
                    <tr>
                      <th className="p-1 m-0 ps-1 text-center">
                        {/* {reportMetaItems[0]?.card_title} \{" "}
                        {reportMetaItems[0]?.sub_card_title} */}
                        {t(reportMetaItems[0]?.card_title)}
                        <FontAwesomeIcon
                          icon={faArrowDown}
                          className="px-1"
                        />{" "}
                        {t(reportMetaItems[0]?.sub_card_title)}
                        <FontAwesomeIcon icon={faArrowRight} className="px-1" />
                        {/* <div>
                          {reportMetaItems[0]?.card_title}
                          <FontAwesomeIcon
                            icon={faArrowDown}
                            className="px-1"
                          />
                        </div>
                        <div>
                          {reportMetaItems[0]?.sub_card_title}
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="px-1"
                          />
                        </div> */}
                      </th>

                      {colHeaders.map((col) => (
                        <td className="text-center p-1 m-0" key={col}>
                          {col}
                        </td>
                      ))}
                      <th className="text-center p-1 m-0">{t("Total")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowHeaders.map((row) => (
                      <tr key={row}>
                        <td className="p-1 m-0 ps-1">{row}</td>
                        {colHeaders.map((col) => {
                          return (
                            <td key={col} className="text-center p-0 m-0">
                              <a
                                className="underline-link"
                                onClick={() =>
                                  handleCellClick(
                                    row,
                                    col,
                                    dataMap[row]?.[col] || 0,
                                    reportMetaItems
                                  )
                                }
                              >
                                {dataMap[row]?.[col] || 0}
                              </a>
                            </td>
                          );
                        })}
                        <td className="text-center p-0 m-0">
                          <a
                            className="underline-link"
                            onClick={() =>
                              handleCellClick(
                                row,
                                "TotalColumn",
                                colHeaders.reduce(
                                  (sum, col) =>
                                    sum + (dataMap[row]?.[col] || 0),
                                  0
                                ),
                                reportMetaItems
                              )
                            }
                          >
                            {colHeaders.reduce(
                              (sum, col) => sum + (dataMap[row]?.[col] || 0),
                              0
                            )}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th className="p-0 m-0 ps-1">{t("Total")}</th>
                      {colHeaders.map((col) => (
                        <td key={col} className="text-center p-0 m-0">
                          <a
                            className="underline-link"
                            onClick={() =>
                              handleCellClick(
                                "TotalRow",
                                col,
                                rowHeaders.reduce(
                                  (sum, row) =>
                                    sum + (dataMap[row]?.[col] || 0),
                                  0
                                ),
                                reportMetaItems
                              )
                            }
                          >
                            {rowHeaders.reduce(
                              (sum, row) => sum + (dataMap[row]?.[col] || 0),
                              0
                            )}
                          </a>
                        </td>
                      ))}
                      <td className="text-center p-0 m-0">
                        <a
                          className="underline-link"
                          onClick={() =>
                            handleCellClick("", "", "", "", "grandTotal")
                          }
                        >
                          {rowHeaders.reduce(
                            (sum, row) =>
                              sum +
                              colHeaders.reduce(
                                (colSum, col) =>
                                  colSum + (dataMap[row]?.[col] || 0),
                                0
                              ),
                            0
                          )}
                        </a>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
            </Card.Body>
          </Card>
        );
      })}

      <Modal show={showModal} fullscreen={fullscreen} onHide={handleClose}>
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Button
            variant="link"
            onClick={handleFullscreen}
            className="p-0 border-0"
          >
            <FontAwesomeIcon
              icon={fullscreen ? faCompress : faExpand}
              className="text-dark"
            />
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            {t("Close")}
          </Button>
        </Modal.Header>
        <Modal.Body>
          <ReportRuntime
            report={reportMeta?.reportInfo?.report_name}
            ChartdrilldownReports={reportFilter}
            yearProp={yearProp}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

// export default PivotTableCard;
export default React.memo(PivotTableCard);
