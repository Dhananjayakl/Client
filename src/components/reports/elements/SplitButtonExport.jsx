import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFileExcel,
  faFileExport,
  faSpinner, // Add spinner icon
} from "@fortawesome/free-solid-svg-icons";
import {
  Dropdown,
  SplitButton,
  ButtonGroup,
  Modal,
  Button,
  Spinner, // Import Spinner from react-bootstrap
} from "react-bootstrap";
import { getServiceData } from "src/components/server/service";
import axios from "src/utils/AxiosInstance";
import ExportAndEmail from "./ExportAndEmail";
import { useSelector } from "react-redux";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";

function getSortExpression(pageSortBy) {
  let orderExpression;
  if (pageSortBy.length > 0) {
    const sortParams = pageSortBy[0];
    let sortOrder = sortParams.desc ? "desc" : "asc";
    let sortField = sortParams.id;
    if (sortField) orderExpression = sortField + " " + sortOrder;
  }
  return orderExpression;
}

function getFilterCondition(pageFilter) {
  let filterCondition;
  let conditionsList = [];

  if (pageFilter.length > 0) {
    conditionsList = pageFilter.map((filter, index) => {
      const { id, value } = filter;

      // Check if `value` is an array of objects or array
      if (Array.isArray(value)) {
        const numberValues = value.filter((v) => v.type === "number");
        if (numberValues.length > 0) {
          const [first, second] = numberValues;

          if (first.value !== undefined && second.value !== undefined) {
            return {
              field: id,
              filterFieldType: "NUMBER",
              values: [first.value, second.value],
              operator: "BETWEEN",
            };
          } else if (first.value !== undefined) {
            return {
              field: id,
              filterFieldType: "NUMBER",
              values: [first.value],
              operator: "GREATER_EQUAL",
            };
          } else if (second.value !== undefined) {
            return {
              field: id,
              filterFieldType: "NUMBER",
              values: [second.value],
              operator: "LESS_EQUAL",
            };
          }
        }
      } else if (typeof value === "object") {
        if (value.type === "text" && value.value) {
          if (value.value.includes("'")) {
            return {
              field: id,
              filterFieldType: "TEXT",
              values: [value.value],
              operator: "EQUALS",
            };
          }
          return {
            field: id,
            filterFieldType: "TEXT",
            values: [value.value],
            operator: "LIKE",
          };
        } else if (value.type === "date" && value.value) {
          if (value.value) {
            return {
              field: id,
              filterFieldType: "DATE",
              values: [value.value],
              operator: "EQUALS",
            };
          }
        } else if (value.type === "array" && value.value) {
          if (value.value) {
            let arrayValue = value.value.split(",");
            return {
              field: id,
              filterFieldType: "TEXT_ARRAY",
              values: arrayValue,
              operator: "CONTAINS",
            };
          }
        }
      } else {
        return {
          field: id,
          filterFieldType: "TEXT",
          values: [value.value],
          operator: "LIKE",
        };
      }
    });
    conditionsList = conditionsList.filter((condition) => condition != null);
  }

  return conditionsList;
}

const SplitButtonExport = (props) => {
  let {
    reportMeta,
    queryPageSortBy,
    queryPageFilter,
    report,
    defaultFilterExpression,
    ChartdrilldownReports,
    mainFilterExport,
    table,
    fiscalYearFilter,
  } = props;
  let report_id = reportMeta?.reportInfo?.report_id;
  const [exports, setExports] = useState([]);
  const [exportJson, setExportJson] = useState([]);
  const [loading, setLoading] = useState(false);

  const { d_date_format, d_data_time_format } = useSelector(
    (state) => state.systemConfig.systemConfig
  );

  let exportData = async (
    title,
    report,
    queryPageFilter,
    queryPageSortBy,
    selectedColumns,
    mainFilterExport
  ) => {
    let orderExpression = getSortExpression(queryPageSortBy);
    let filterCondition = getFilterCondition(queryPageFilter);
    let columnList = Object.values(selectedColumns)
      .filter((column) => column.getIsVisible())
      .map((column) => `${column.id} as "${column.columnDef.header}"`);

    let finaldefaultFilterExpression = defaultFilterExpression;

    let finalfilterExpression;
    if (mainFilterExport) {
      finalfilterExpression = ` ${mainFilterExport}`;
    }
    //  else if (filterCondition) {
    //   finalfilterExpression = filterCondition;
    // }
    else if (mainFilterExport) {
      finalfilterExpression = mainFilterExport;
    } else {
      finalfilterExpression = "";
    }

    setLoading(true);

    try {
      const response = await axios.post(
        getReportExportURL(report),
        {
          orderExpression: orderExpression,
          filterExpression: finalfilterExpression,
          defaultFilterExpression: finaldefaultFilterExpression,
          selectedReportColumns: columnList,
          selectedYears: fiscalYearFilter,
          conditionsList: filterCondition,
        },
        {
          responseType: "blob",
        }
      );

      const href = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", title + ".xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      const inputField = document.getElementById("inputGroupFile");
      if (inputField) {
        inputField.value = "";
      }

      setLoading(false); // End loading after successful export
    } catch (e) {
      setLoading(false); // End loading on error
      throw new Error(`API error:${e?.message}`);
    }
  };

  function getReportExportURL(report) {
    const API_BASE_URL = "/reportexport/" + report;
    return API_BASE_URL;
  }

  useEffect(() => {
    getServiceData("ReportFilterMeta", report_id)
      .then((response) => {
        // const exportedOnValues = response.data.map((item) => item?.exportedOn);
        if (response && response.data) {
          const exportOptions = response.data.map((item) => ({
            key: item.exportId,
            label: item.exportedOn,
          }));
          setExports(exportOptions);
          // Optionally set the state if needed
          // setExportJson(exportOptions);
        }

        // setExportJson(response);
      })
      .catch((err) => {});
  }, [report_id]);

  let handleDropdownItemClick = async (exportOption) => {
    let exportId = exportOption.key;
    let fileName = exportOption.label;
    try {
      await axios
        .get(`/reportexport/exportAgain/${exportId}`, {
          responseType: "blob",
        })
        .then((response) => {
          const href = URL.createObjectURL(response.data);
          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", fileName + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        })
        .catch((err) => {
          console.log(err);
        });

      const inputField = document.getElementById("inputGroupFile");
      if (inputField) {
        inputField.value = " ";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="float-end">
      <>
        {reportMeta?.reportInfo?.enable_export_history && (
          <div className="d-flex ">
            <ExportAndEmail
              reportMeta={reportMeta}
              table={table}
              report={report}
              queryPageFilter={queryPageFilter}
              queryPageSortBy={queryPageSortBy}
              defaultFilterExpression={defaultFilterExpression}
              ChartdrilldownReports={ChartdrilldownReports}
              mainFilterExport={mainFilterExport}
            />
            {["down"].map((direction) => (
              <SplitButton
                as={ButtonGroup}
                key={direction}
                id={`dropdown-button-drop-${direction}`}
                drop={direction}
                variant={
                  reportMeta?.reportInfo?.theme == 2 ? "light" : "primary"
                }
                className="border-primary border mx-1"
                title={
                  loading ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faDownload} />
                  )
                }
                onClick={() => {
                  exportData(
                    reportMeta?.reportInfo.report_title,
                    report,
                    queryPageFilter,
                    queryPageSortBy,
                    table,
                    mainFilterExport
                  );
                }}
              >
                <Dropdown>
                  {exports.map((exportOption, index) => (
                    <Dropdown.Item
                      key={exportOption.key}
                      eventKey={exportOption.key}
                      onClick={() => handleDropdownItemClick(exportOption)}
                    >
                      {util.formatDateTimeStamp(
                        exportOption.label,
                        d_data_time_format
                      )}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </SplitButton>
            ))}
          </div>
        )}
      </>
    </div>
  );
};

export default React.memo(SplitButtonExport);
