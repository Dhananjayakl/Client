import { faFileDownload, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import axios from "src/utils/AxiosInstance";
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

const DownLoadUploadTemplate = ({
  reportMeta,
  report,
  queryPageFilter,
  queryPageSortBy,
  defaultFilterExpression,
  ChartdrilldownReports,
  mainFilterExport,
  table,
  fiscalYearFilter,
}) => {
  let title = reportMeta?.reportInfo.report_title;
  const [loading, setLoading] = useState(false);
  let handleUploadTemplate = async () =>
    // title,
    // report,
    // queryPageFilter,
    // queryPageSortBy,
    // selectedColumns,
    // mainFilterExport
    {
      let orderExpression = getSortExpression(queryPageSortBy);
      let filterCondition = getFilterCondition(queryPageFilter);
      let columnList = Object.values(table)
        .filter((column) => column.getIsVisible())
        .map((column) => `${column.id} as "${column.columnDef.header}"`);

      let finaldefaultFilterExpression = defaultFilterExpression;
      let finalfilterExpression;
      if (mainFilterExport) {
        finalfilterExpression = ` ${mainFilterExport}`;
      } else if (mainFilterExport) {
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
            selectedReportColumns: [],
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
        setLoading(false);
      } catch (e) {
        setLoading(false);
        throw new Error(`API error:${e?.message}`);
      }
    };
  function getReportExportURL(report) {
    const API_BASE_URL = `/reportexport/generate-excel-for-template?idOrReportName=${report} `;
    return API_BASE_URL;
  }
  //   const handleUploadTemplate = () => {};
  return (
    <>
      <Button
        variant={reportMeta?.reportInfo?.theme == 2 ? "light" : "primary"}
        className="border-primary  p-1 px-2  rounded-circle "
        onClick={handleUploadTemplate}
      >
        {loading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        ) : (
          <FontAwesomeIcon icon={faFileExcel} />
        )}
      </Button>
    </>
  );
};

export default DownLoadUploadTemplate;
