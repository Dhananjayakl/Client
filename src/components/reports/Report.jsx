import React from "react";
import FilterColumnSelection from "./MainFilter";

import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import axios from "src/utils/AxiosInstance";
import ActionButtons from "src/components/reports/ActionButtons";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { downloadFile } from "src/components/forms/reactformutils/fields/Attach";
import {
  DateRangeColumnFilter,
  dateBetweenFilterFn,
  SelectColumnFilter,
  DefaultColumnFilter,
  SliderColumnFilter,
  NumberRangeColumnFilter,
  MultiSelectColumnFilter,
} from "./Filters";

import { util } from "src/Progrec";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faTh,
  faFilter,
  faArrowsRotate,
  faListCheck,
  faCircleLeft,
  faPencil,
  faTable,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import {
  OverlayTrigger,
  Tooltip,
  Card,
  Container,
  Table,
  Row,
  Col,
  Form,
  Nav,
  NavDropdown,
  Dropdown,
  Button,
  Badge,
  Offcanvas,
  DropdownButton,
  SplitButton,
  Figure,
  ButtonGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import clsx from "clsx";
import "../../../src/assets/scss/profile.scss";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { getReportMeta, getServiceData } from "src/components/server/service";
// import OffCanvasForm from 'src/components/pages/OffCanvasNew';
import Action from "src/components/forms/reactformutils/FormRuntimeEngine";
import CreateFormLink from "./elements/CreateFormLink";
import ColumnSelectionDropdown from "./elements/ColumnSelectionDropDown";
import ReportFilter from "./elements/ReportFilter";
import SplitButtonExport from "./elements/SplitButtonExport";
import Header from "./elements/Header";
import ProgressColumn from "./elements/ProgressColumn";
import PopUpFormLink from "./elements/PopUpFormLink";
import FormLink from "./elements/FormLink";
import AttachmentCell from "./elements/AttachmentCell";
import DateCell from "./elements/DateCell";
import BooleanCell from "./elements/BooleanCell";

// import RptActions from "./elements/RptActions";
import OnclickButton from "./elements/OnclickButton";
import LockedUser from "./elements/Unlockeduser";
import OffCanvasLink from "./elements/OffCanvasLink";
// import FilterFunction from "./elements/FilterFunction";
// import FilterFunction from "./elements/FilterFunction";
import FavouriteFilter from "./elements/FavouriteFilter";
import ReportDataCard from "./elements/ReportDataCard";
import PlayButton from "./elements/PlayButton";
import Actions from "./elements/Actions";
import ArrayObjectCell from "./elements/ArrayObjectCell";
import { useTranslation } from "react-i18next";
import ChildReportLink from "./elements/ChildReportLink";
import FilterProfile from "./FilterProfile";
import Unpin from "./elements/Unpin";
import Pdfdownload from "./elements/PdfDownLoad";
import { toast, ToastContainer } from "react-toastify";
import GlobaltFilter from "./elements/UIGlobalFilter";
import { getCommonPinningStyles } from "./elements/StickyColumn";
import Trends from "./elements/Trends";
import IndeterminateCheckbox from "./elements/CheckBox";
import PivotTableCard from "./elements/PivotTableCard";
import DateWithTimeStampCell from "./elements/DateWithTimeStamp";
import DownLoadUploadTemplate from "./elements/DownLoadUploadTemplate";
import Switch from "./elements/Switch";
import ColumnReports from "./elements/ColumnReports";
import TextArea from "./elements/TextArea";
// import EditableCell from "./elements/EditableCell";
// let Drpoptions = [];
let exArray = [];

function getReportMetaURL(report) {
  const API_BASE_URL = "/report/meta/" + report;
  return API_BASE_URL;
}

const fetchReportMeta = async (report) => {
  try {
    const response = await axios.get(getReportMetaURL(report));
    return await response.data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

function getReportURL(report, pageNumber, pageSize, responseType) {
  const API_BASE_URL = "/report";
  return (
    API_BASE_URL +
    "/" +
    report +
    "?pageNumber=" +
    pageNumber +
    "&pageSize=" +
    pageSize +
    "&responseType=" +
    responseType
  );
}

function getFilterCondition(pageFilter) {
  let conditionsList = [];

  if (pageFilter.length > 0) {
    conditionsList = pageFilter.map((filter, index) => {
      const { id, value } = filter;

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
            let arrayValue = value.value
              .split(",")
              .filter((item) => item !== "");
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
    // .join(" AND ");
  }

  return conditionsList;
}

function getSortExpression(pageSortBy) {
  let orderExpression;
  if (pageSortBy.length > 0) {
    const sortParams = pageSortBy[0];
    let sortOrder = sortParams.desc ? "desc" : "asc";
    let sortField = sortParams.id;
    if (sortField) orderExpression = "" + sortField + " " + sortOrder;
  }

  return orderExpression;
}

export const fetchReportData = async (
  report,
  page,
  pageSize,
  pageFilter,
  pageSortBy,
  defaultFilterExpression,
  allColumns,
  filterExpression,
  responseType,
  fiscalYearFilter
) => {
  const selected_Columns = Object.values(allColumns)
    .filter((item) => item.isVisible)
    .map((visibleColumn) => visibleColumn.id);

  const offset = page * pageSize;
  const orderExpression = getSortExpression(pageSortBy);
  const filterParam = getFilterCondition(pageFilter);

  let filterCondition = "";
  if (filterExpression || filterExpression === "") {
    filterCondition = filterExpression;
  }

  if (filterExpression && filterParam) {
    filterCondition = filterExpression;
  }

  try {
    const response = await axios.post(
      getReportURL(report, page + 1, pageSize, responseType),
      {
        orderExpression,
        filterExpression: filterCondition,
        defaultFilterExpression,
        selectedReportColumns: selected_Columns,
        selectedYears: fiscalYearFilter,
        conditionsList: filterParam,
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(`Report:API error:${e?.message}`);
  }
};

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 0,
  totalCount: 0,
  queryPageFilter: "",
  queryPageSortBy: [],
  finalExpression: "",
};

const PAGE_CHANGED = "PAGE_CHANGED";
const PAGE_SIZE_CHANGED = "PAGE_SIZE_CHANGED";
const PAGE_SORT_CHANGED = "PAGE_SORT_CHANGED";
const PAGE_FILTER_CHANGED = "PAGE_FILTER_CHANGED";
const TOTAL_COUNT_CHANGED = "TOTAL_COUNT_CHANGED";
const FINAL_EXPRESSION_CHANGED = "FINAL_EXPRESSION_CHANGED";

const reducer = (state, { type, payload }) => {
  switch (type) {
    case PAGE_CHANGED:
      return {
        ...state,
        queryPageIndex: payload,
      };
    case PAGE_SIZE_CHANGED:
      return {
        ...state,
        queryPageSize: payload,
      };
    case PAGE_SORT_CHANGED:
      return {
        ...state,
        queryPageSortBy: payload,
      };
    case PAGE_FILTER_CHANGED:
      return {
        ...state,
        queryPageFilter: payload,
      };
    case TOTAL_COUNT_CHANGED:
      return {
        ...state,
        totalCount: payload,
      };
    case FINAL_EXPRESSION_CHANGED:
      return {
        ...state,
        finalExpression: payload,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

let getTemplateName = (reportData) => {
  let dbAccronym = reportData?.reportInfo?.acronym_db;
  if (reportData?.reportInfo?.acronym_db == ".") {
    dbAccronym = "";
  } else {
    dbAccronym = reportData?.reportInfo?.acronym_db + "_";
  }
  return (
    "modules/" +
    reportData?.reportInfo?.acronym_app +
    "/reports/" +
    reportData?.reportInfo?.report_name
  );
};

function ReportTable(props) {
  const { t, i18n } = useTranslation("common");
  const languageDirection = i18n.dir();
  const floatClass = languageDirection === "ltr" ? "float-end" : "float-start";
  let {
    report,
    formJSON,
    drilldownReports,
    ChartdrilldownReports,
    dataCard,
    refreshdataref,
    formcallbackParent,
    pivotTable,
    yearProp,
    ReletionDltIcon,
    formExpression,
    generatedobjectId,
    columnReport,
    totalsum,
    className,
  } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const showButton = location.search.includes("?report=");
  if (!report) {
    const [searchParams] = useSearchParams();
    report = searchParams.get("report");
  }

  const [filteropen, setfilterOpen] = React.useState(false);
  let [reportMeta, setReportMeta] = React.useState();
  let [columnDef, setColumnDef] = React.useState([]);
  let [reportData, setReportData] = React.useState([]);
  const [expressionParam, setExpressionParam] = React.useState("");
  const [filterExpression, setFilterExpression] = React.useState("");
  const [mainFilterExport, setmainFilterExport] = React.useState("");
  const [fiscalYearFilter, setfiscalYearFilter] = React.useState([] || "");

  const [cardWidth, setCardWidth] = useState();

  const [viewport, setViewPort] = useState(0);
  let [ReportTileLayout, setReportTileLayout] = useState();
  const [pageHeader, setpageHeader] = useState(false);
  const [show, setShow] = useState(false);
  const [tileviewshow, setTileViewshow] = useState(false);
  const [selectedObjectIds, setSelectedObjectIds] = useState([]);
  const toastRef = useRef(null);
  let Pagevalues =
    reportMeta?.reportInfo?.no_of_records_per_page === 0
      ? 100000
      : reportMeta?.reportInfo?.no_of_records_per_page;
  let [Pagevalue, setPageValue] = useState(Pagevalues);
  useEffect(() => {
    setPageValue(Pagevalues);
  }, [Pagevalues]);

  let colorField;
  let applyColor;
  let applyFont;
  let ColorName;
  let defaultFilterExpression = "";
  let defaultdataExpression = "";

  let responseType = dataCard || pivotTable ? "cards" : "data";
  let exp1;

  const updateFilterExpression = (expression) => {
    if (expression != undefined) {
      exp1 = expression;
      setExpressionParam(expression);
    }
  };

  const formLinks = reportMeta?.reportInfo?.create_form_link || [];

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
      // minWidth: 300,
      // width: 150,
      // maxWidth: 400,
    }),
    []
  );

  // Bulk Object Deletion Start
  const [selectedData, setSelectedData] = useState({
    extractedObjectIds: [],
    formname: "",
  });
  const handleCheckboxChange = ({ extractedObjectIds, formname }) => {
    setSelectedData({ extractedObjectIds, formname });
  };

  const handleDeleteRecords = async () => {
    const { extractedObjectIds, formname } = selectedData;
    const url = `/form/${formname}`;
    const body = extractedObjectIds;

    const isConfirmed = window.confirm(
      "Are you sure? The records will be deleted."
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(url, { data: body });
        refreshData();
        table.resetRowSelection();
      } catch (error) {
        console.error(error);
      }
    }
  };
  // Bulk Object Deletion End

  React.useEffect(() => {
    fetchReportMeta(report).then(async (value) => {
      let Pagevalue = value?.reportInfo?.no_of_records_per_page;
      let columnArray = [];
      let Drpoptions = [];
      let reportmetaValue = [];
      reportmetaValue.push(value);
      // let card = document.getElementById("myCard");
      // setCardWidth(card.offsetWidth);
      document.addEventListener("DOMContentLoaded", () => {
        let card = document.getElementById("myCard");
        if (card) {
          setCardWidth(card.offsetWidth);
        } else {
          console.error("Element with ID 'myCard' not found.");
        }
      });

      // card ? setCardWidth(card.offsetWidth) : "";

      // let resizeObserver = new ResizeObserver(() => {
      //   setCardWidth(card.offsetWidth);
      // });
      // resizeObserver.observe(card);
      let modalviewport = document.querySelectorAll(".modalviewport");
      modalviewport.forEach((element) => {
        setViewPort(element.clientWidth);
      });

      let modalviewportpinned = document.querySelectorAll(
        ".modalviewportpinned"
      );
      const viewportWidth = window.innerWidth;
      let totalColumnWidth = value?.columns.reduce((total, column) => {
        if (column.visible && column.menu_column !== true) {
          return total + (column.column_size || 0);
        } else {
          return total;
        }
      }, 0);

      value?.columns.forEach(function (item, index) {
        let columnWidth;
        let widthToUse = viewport ? viewport : cardWidth;

        if (totalColumnWidth < widthToUse && modalviewportpinned?.length == 0) {
          let remainingwidth = widthToUse - totalColumnWidth;
          let colwidth = item.column_size / totalColumnWidth;
          columnWidth = colwidth * widthToUse;
        } else {
          columnWidth = item.column_size;
        }

        let obj = {
          // header: item.column_title,
          header:
            item.column_title === "Select"
              ? ({ table }) => (
                  <IndeterminateCheckbox
                    {...{
                      checked: table.getIsAllRowsSelected(),
                      // indeterminate: table.getIsSomeRowsSelected(),
                      onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                  />
                )
              : item.column_title,
          accessorKey: item.column_name,
          sticky: item.sticky_column
            ? item.sticky_direction == 2
              ? "right"
              : "left"
            : undefined,
          colors: item.colors,
          minSize: item.column_size,
          // size: item.column_size,
          size: columnWidth,
          align: item.align,
          // datatype: item.column_type,
          // format: item.format,
        };

        if (item.visible) {
          obj.disableSortBy = item.sortable;
          obj.filterable = item.filterable;
          if (item.column_type == 3) {
            obj.cell = ({ getValue }) => {
              return <DateCell value={getValue()} format={item.format} />;
            };
            // obj.Filter = DateRangeColumnFilter;
            (obj.Filter = (props) => DateRangeColumnFilter({ ...props, item })),
              (obj.filter = dateBetweenFilterFn);
          } else if (item.column_type == 19) {
            obj.cell = ({ getValue }) => {
              return (
                <DateWithTimeStampCell
                  value={getValue()}
                  format={item.format}
                />
              );
            };
            obj.Filter = DateRangeColumnFilter;
            obj.filter = dateBetweenFilterFn;
          } else if (item.menu_column == true) {
            Drpoptions.push(item);
          }
          if (item.menu_column == null || item.menu_column == false) {
            if (item.column_type == 6) {
              obj.cell = ({ getValue }) => {
                return <AttachmentCell value={getValue()} />;
              };
            } else if (item.column_type == 2 && item.expression != null) {
              obj.cell = ({ getValue, row }) => {
                return (
                  <RptActions
                    value={getValue()}
                    row={row}
                    columnMeta={item}
                    Drpoptions={Drpoptions}
                  />
                );
              };
            } else if (item.column_type == 2) {
              obj.cell = ({ getValue, row }) => {
                return (
                  <FormLink value={getValue()} row={row} columnMeta={item} />
                );
              };
            } else if (item.column_type == 9) {
              obj.cell = ({ getValue, row }) => {
                return (
                  <PopUpFormLink
                    value={getValue()}
                    row={row}
                    columnMeta={item}
                    refreshData={refreshData}
                    formcallbackParent={formcallbackParent}
                  />
                );
              };
            } else if (item.column_type == 8) {
              obj.cell = ({ getValue, row }) => {
                return (
                  <OffCanvasLink
                    value={getValue()}
                    row={row}
                    columnMeta={item}
                    refreshData={refreshData}
                  />
                );
              };
            } else if (item.column_type == 7) {
              obj.cell = ({ getValue, row }) => {
                return (
                  <OnclickButton
                    value={getValue()}
                    row={row}
                    columnMeta={item}
                    Drpoptions={Drpoptions}
                  />
                );
              };
            } else if (item.column_type == 10) {
              obj.cell = ({ getValue, row }) => {
                return (
                  <ProgressColumn
                    value={getValue()}
                    row={row}
                    columnMeta={item}
                  />
                );
              };
            } else if (item.column_type == 16) {
              obj.cell = ({ getValue, row }) => {
                return (
                  <Pdfdownload
                    value={getValue()}
                    row={row}
                    columnMeta={item}
                    reportmetaValue={reportmetaValue}
                  />
                );
              };
            } else if (item.column_type == 15) {
              obj.cell = ({ getValue, row }) => {
                return <Unpin value={getValue()} row={row} columnMeta={item} />;
              };
            } else if (item.column_type == 11) {
              obj.cell = ({ getValue, row }) => {
                return (
                  <PlayButton value={getValue()} row={row} columnMeta={item} />
                );
              };
            } else if (item.column_type == 12) {
              obj.cell = ({ getValue, row }) => {
                return (
                  <Actions
                    value={getValue()}
                    row={row}
                    columnMeta={item}
                    refreshData={refreshData}
                  />
                );
              };
            } else if (item.column_type == 13) {
              obj.Filter = MultiSelectColumnFilter;

              obj.cell = ({ getValue, row }) => {
                return (
                  <ArrayObjectCell
                    value={getValue()}
                    row={row}
                    columnMeta={item}
                  />
                );
              };
            } else if (item.column_type == 18) {
              obj.cell = ({ getValue, row, columnMeta }) => {
                return (
                  <div className="px-1 mt-1">
                    <IndeterminateCheckbox
                      {...{
                        row: row,
                        columnMeta: item,
                        checked: row.getIsSelected(),
                        disabled: !row.getCanSelect(),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                        checkedObject: handleCheckboxChange,
                        table: table,
                      }}
                    />
                  </div>
                );
              };
            } else if (item.column_type == 17) {
              obj.cell = ({ getValue, row }) => {
                return (
                  <Trends value={getValue()} row={row} columnMeta={item} />
                );
              };
            } else if (item.column_type == 20) {
              obj.cell = ({ getValue, row }) => {
                return (
                  <Switch
                    value={getValue()}
                    row={row}
                    columnMeta={item}
                    refreshData={refreshData}
                  />
                );
              };
            } else if (item.column_type == 4) {
              obj.cell = ({ getValue, row }) => {
                return (
                  <TextArea value={getValue()} row={row} columnMeta={item} />
                );
              };
            }
            //  else if (item.column_type == 21) {
            //   obj.cell = ({ getValue, row }) => {
            //     return (
            //       <EditableCell
            //         value={getValue()}
            //         row={row}
            //         columnMeta={item}
            //         refreshData={refreshData}
            //       />
            //     );
            //   };
            // }
            else if (item.column_type == 14) {
              obj.Filter = NumberRangeColumnFilter;
              obj.cell = ({ getValue, row }) => {
                // if (typeof getValue !== "number") {
                //   obj.Filter = undefined;
                //   return null;
                // }
                return (
                  <ChildReportLink
                    value={getValue()}
                    row={row}
                    columnMeta={item}
                    reportmetaValue={reportmetaValue}
                  />
                );
              };
            } else if (
              item.column_type == 5 &&
              item.column_name == "locked_out"
            ) {
              obj.cell = ({ getValue, row }) => {
                return <LockedUser value={getValue()} row={row} />;
              };
            } else if (item.column_type == 5) {
              obj.cell = ({ getValue, row }) => {
                return <BooleanCell value={getValue()} row={row} />;
              };
            } else if (item.column_type == 1) {
              obj.Filter = NumberRangeColumnFilter;
            }
            columnArray.push(obj);
          }
        }
      });

      // if (value?.reportInfo?.enable_tail_view !== null) {
      //   const lazyComponentName = getTemplateName(value);
      //   const importComponent = () =>
      //     import("../../" + lazyComponentName + ".jsx");

      //   try {
      //     // Use React.lazy directly
      //     const LazyComponent = React.lazy(importComponent);
      //     setReportTileLayout(() => LazyComponent);
      //   } catch (error) {
      //     console.error("Error importing the page:", error);

      //     const fallbackImport = () => import("../../pages/auth/Page404.jsx");
      //     const fallbackComponent = await fallbackImport();
      //     if (fallbackComponent && fallbackComponent.default) {
      //       setReportTileLayout(() => fallbackComponent.default);
      //     } else {
      //       throw new Error("Invalid fallback component");
      //     }
      //   }
      // }

      const lazyComponentName = getTemplateName(value);
      const extractedString = lazyComponentName.split("modules/")[1];
      const parts = extractedString.split("/");
      const acronym_app = parts[0];
      const reportName = parts[parts.length - 1];
      if (lazyComponentName) {
        try {
          const lazyImport = () =>
            import(`../../modules/${acronym_app}/reports/${reportName}.jsx`);
          const report = await lazyImport();
          if (report && report.default) {
            setReportTileLayout(
              React.lazy(() =>
                import(`../../modules/${acronym_app}/reports/${reportName}.jsx`)
              )
            );
          }
        } catch (error) {
          setReportTileLayout(
            React.lazy(() => import("../../pages/auth/Page404.jsx"))
          );
        }
      } else {
        setReportTileLayout(
          React.lazy(() => import("../../pages/auth/Page404.jsx"))
        );
      }

      setColumnDef(columnArray);
      setReportMeta(value);
    });
  }, [report, cardWidth]);

  if (ChartdrilldownReports) {
    defaultFilterExpression = ChartdrilldownReports;
  } else {
    defaultFilterExpression = "";
  }

  if (reportMeta != undefined && drilldownReports != undefined) {
    if (reportMeta.reportInfo.default_filter != null) {
      let originalString = reportMeta.reportInfo.default_filter;
      let values = drilldownReports;
      let replacedString = originalString;
      Object.keys(values).forEach((key) => {
        let valueWithQuotes = `${values[key]}`;
        replacedString = replacedString.replace(
          new RegExp(`:${key}`, "g"),
          valueWithQuotes
        );
      });
      defaultFilterExpression = replacedString;
    }
  }
  if (reportMeta?.reportInfo?.default_filter) {
    defaultdataExpression = reportMeta?.reportInfo?.default_filter;
  }
  let [
    {
      queryPageIndex,
      queryPageSize,
      totalCount,
      queryPageFilter,
      queryPageSortBy,
      finalExpression,
      conditionsList,
    },
    dispatch,
  ] = React.useReducer(reducer, initialState);

  useEffect(() => {
    queryPageIndex = 0;
  }, [finalExpression]);

  useEffect(() => {
    queryPageSortBy = [];
  }, [report]);

  if (!reportMeta) defaultFilterExpression = "";

  let { isLoading, error, isError, data, isSuccess, refetch } = useQuery(
    [
      "reportData",
      report,
      queryPageIndex,
      queryPageSize,
      queryPageFilter,
      queryPageSortBy,
      defaultFilterExpression,
      finalExpression,
      responseType,
      fiscalYearFilter,
      conditionsList,
    ],
    () => {
      if (reportMeta && queryPageSize > 0) {
        return fetchReportData(
          report,
          queryPageIndex,
          queryPageSize,
          queryPageFilter,
          queryPageSortBy,
          defaultFilterExpression,
          // table.getAllColumns(),
          columnDef,
          finalExpression,
          responseType,
          fiscalYearFilter,
          conditionsList
        );
      } else {
        // return Promise.resolve(null);
        return (data = null), (isLoading = false), (isSuccess = false);
      }
    },

    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  useEffect(() => {
    if (data && data.data) {
      setReportData(data.data);
    }
  }, [data]);

  const refreshData = (toastTrue) => {
    if (toastTrue === true) {
      if (toastRef.current) {
        return;
      }
      toastRef.current = toast.success(`Report Refetched Successfully`, {
        autoClose: 1000,
        pauseOnHover: false,

        onClose: () => {
          toastRef.current = null;
        },
      });

      refetch();
    } else {
      refetch();
    }
    // dispatch({ type: PAGE_FILTER_CHANGED, payload: 0 });
    // gotoPage(0);
  };
  if (refreshdataref) {
    refreshdataref.current = refreshData;
  }

  // const [columnVisibility, setColumnVisibility] = React.useState({});
  // console.log("columnVisibility", columnVisibility);

  const [sorting, setSorting] = React.useState([]);
  // const [globalFilter, setGlobalFilter] = useState("");
  // console.log("globalFilter", globalFilter);

  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [previousPageCount, setPreviousPageCount] = useState(1);

  let table = useReactTable({
    columns: columnDef,
    data: data ? data.data : reportData && reportData,

    initialState: {
      pagination: {
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
      },
    },
    manualPagination: true,
    manualFiltering: true,
    // pageCount: isSuccess
    //   ? Math.ceil((totalCount || 0) / (queryPageSize || 1))
    //   : 1,
    pageCount:
      isSuccess && totalCount
        ? Math.ceil(totalCount / (queryPageSize || 1))
        : previousPageCount,
    autoResetSortBy: false,
    autoResetFilters: false,
    autoResetPageIndex: false,
    defaultColumn,

    state: {
      // columnVisibility,
      sorting,
      // globalFilter,
      columnFilters,
      rowSelection,
      // pagination: pagination,
    },
    enableRowSelection: true,
    // onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    // onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    // getPaginationRowModel: getPaginationRowModel(),

    // getSortedRowModel: getSortedRowModel(),

    // getFilteredRowModel: getFilteredRowModel(),

    // onPaginationChange: setPagination,
  });

  useEffect(() => {
    if (isSuccess) {
      setPreviousPageCount(Math.ceil(totalCount / (queryPageSize || 1)));
    }
  }, [totalCount, queryPageSize, isSuccess]);
  React.useEffect(() => {
    dispatch({
      type: PAGE_CHANGED,
      payload: table.getState().pagination.pageIndex,
    });
  }, [table.getState().pagination.pageIndex]);

  React.useEffect(() => {
    dispatch({
      type: PAGE_SIZE_CHANGED,
      payload: table.getState().pagination.pageSize,
    });
    table.setPageIndex(0);
  }, [table.getState().pagination.pageSize, table.setPageIndex]);

  React.useEffect(() => {
    dispatch({ type: PAGE_SIZE_CHANGED, payload: Pagevalue });
    table.setPageIndex(0);
  }, [Pagevalue, table.setPageIndex]);

  React.useEffect(() => {
    dispatch({ type: PAGE_SORT_CHANGED, payload: sorting });
    table.setPageIndex(0);
  }, [sorting, table.setPageIndex]);

  React.useEffect(() => {
    dispatch({ type: PAGE_FILTER_CHANGED, payload: columnFilters });
    table.setPageIndex(0);
  }, [table.setPageIndex, columnFilters]);

  // React.useEffect(() => {
  //   dispatch({ type: FINAL_EXPRESSION_CHANGED, payload:  });

  // }, []);
  React.useEffect(() => {
    if (data?.totalRecords || data?.totalRecords === 0) {
      dispatch({
        type: TOTAL_COUNT_CHANGED,
        payload: data.totalRecords,
      });
    }
  }, [data?.totalRecords]);
  React.useEffect(() => {
    if (formExpression && generatedobjectId) {
      const updatedExpression = formExpression.replace(
        /:\w+/g,
        generatedobjectId
      );
      dispatch({ type: FINAL_EXPRESSION_CHANGED, payload: updatedExpression });
    }
  }, [formExpression, generatedobjectId, dispatch]);

  const updateFinalExpression = (expression) => {
    dispatch({ type: FINAL_EXPRESSION_CHANGED, payload: expression });
  };
  useEffect(() => {
    if (yearProp) {
      setfiscalYearFilter([yearProp]);
    }
  }, [yearProp]);
  // if (error) {
  //   return (
  //     <p>
  //       Issue Encountered while fetching the data for the report. Please contact
  //       system administrator.
  //     </p>
  //   );
  // }
  // else {
  //   // <h4>LOADING...</h4>;
  //   return (
  //     <div className="d-flex align-itms-center justify-content-center">
  //       <h4>LOADING...</h4>
  //       <Spinner animation="grow" variant="primary" size="sm" />
  //     </div>
  //   );
  // }

  let column_sizes = reportMeta?.columns.map((column) => {
    return column.column_size;
  });

  const handleTailViewButtonClick = () => {
    // setShow(true);
    setTileViewshow(false);
  };
  const handleGridViewButtonClick = () => {
    setShow(false);
    setTileViewshow(true);
  };

  const renderIcon = (icon, tooltip, clickHandler) => (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id="tileViewTooltip">{tooltip}</Tooltip>}
    >
      <Button
        // className="border"
        className="border-primary  me-1 px-2 rounded-circle"
        variant={reportMeta?.reportInfo?.theme == 2 ? "light" : "primary"}
        onClick={clickHandler}
      >
        <FontAwesomeIcon icon={icon} size="1x" />
      </Button>
    </OverlayTrigger>
  );
  const handleFilter = () => {
    setfilterOpen(!filteropen);
  };
  const FilterFunction = () => {
    return (
      <>
        <Row>
          <div className={`${floatClass} `}>
            <FilterColumnSelection
              placement="end"
              props={props}
              reportmeta={reportMeta}
              setFinalExpression={updateFinalExpression}
              setFilterExpression1={setFilterExpression}
              finalExpression={finalExpression}
              report={report}
              filteropen={filteropen}
              mainfiltetWithExport={setmainFilterExport}
              fiscalYearFilter={setfiscalYearFilter}
              yearProp={yearProp}
            />
          </div>
        </Row>
      </>
    );
  };

  // if (reportMeta?.reportInfo?.data_card) {
  //   return (
  //     <>
  //       {dataCard && (
  //         <ReportDataCard
  //           data={data}
  //           reportMeta={reportMeta}
  //           defaultFilterExpression={defaultFilterExpression}
  //           defaultdataExpression={defaultdataExpression}
  //         />
  //       )}

  //       {pivotTable && (
  //         <PivotTableCard
  //           data={data}
  //           reportMeta={reportMeta}
  //           defaultFilterExpression={defaultFilterExpression}
  //           defaultdataExpression={defaultdataExpression}
  //         />
  //       )}
  //     </>
  //   );
  // }

  if (dataCard && reportMeta?.reportInfo?.data_card && reportMeta && data) {
    return (
      <>
        <ReportDataCard
          data={data}
          reportMeta={reportMeta}
          defaultFilterExpression={defaultFilterExpression}
          defaultdataExpression={defaultdataExpression}
          yearProp={yearProp}
        />
      </>
    );
  }

  if (pivotTable && reportMeta?.reportInfo?.data_card && reportMeta && data) {
    return (
      <>
        <PivotTableCard
          data={data}
          reportMeta={reportMeta}
          defaultFilterExpression={defaultFilterExpression}
          defaultdataExpression={defaultdataExpression}
          yearProp={yearProp}
        />
      </>
    );
  }

  if (columnReport && reportMeta && data) {
    return (
      <ColumnReports data={data} reportMeta={reportMeta} totalsum={totalsum} />
    );
  }

  // /Adding Shimmers to Report Starts
  const ShimmerCard = ({ colSize }) => (
    <Col xl={colSize} lg={colSize} md={colSize} sm={12} className="d-flex">
      <Card className="flex-fill reportChart-cards">
        <Card.Header className="p-2">
          <div className="shimmer shimmer-card-header"></div>
        </Card.Header>
        <Card.Body className="p-2">
          <div className="shimmer shimmer-card-body"></div>
        </Card.Body>
      </Card>
    </Col>
  );
  if (data === false) {
    const shimmerCount = 1;
    const colSize = 12;
    return (
      <Row className="p-0 m-0">
        {Array.from({ length: shimmerCount }).map((_, index) => (
          <ShimmerCard key={index} colSize={colSize} />
        ))}
      </Row>
    );
  }
  //Adding Shimmers to Reports Ends
  if (!dataCard && !pivotTable && !columnReport) {
    return (
      <div>
        {/* {isSuccess ? ( */}
        <Container fluid className="p-0 m-0">
          <div className="d-flex justify-content-end  pt-0 pb-1 mx-3">
            {selectedData.extractedObjectIds.length > 0 &&
              selectedData.formname && (
                <Button onClick={handleDeleteRecords} variant="outline-primary">
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </Button>
              )}
          </div>
          <Card
            className={className === "remove-styles" ? "" : "reportChart-cards"}
          >
            {/* <div className="z-2 sticky-top" style={{ top: "62px" }}> */}
            {reportMeta?.reportInfo?.enable_header_bar && !pageHeader && (
              // className="stickyTopHeader"
              <Card.Header style={{ height: "55px" }}>
                <div className=" ">
                  <span className="h5">
                    {t(reportMeta?.reportInfo.report_title)}
                  </span>

                  <div className={`${floatClass}`}>
                    {showButton && (
                      <Button
                        variant={
                          reportMeta?.reportInfo?.theme == 2
                            ? "light"
                            : "primary"
                        }
                        // variant="primary"
                        className="border-primary  p-1"
                        // onClick={() => navigate(-1)}
                        onClick={() => {
                          window.history.back();
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faCircleLeft}
                          className="me-1 "
                        />
                        {t("Close")}
                      </Button>
                    )}
                  </div>
                  <div className={`${floatClass}`} title="Filter">
                    {reportMeta?.reportInfo?.filter_profile && (
                      <FilterProfile
                        props={props}
                        reportmeta={reportMeta}
                        setFinalExpression={updateFinalExpression}
                        finalExpression={finalExpression}
                        report={report}
                      />
                    )}
                  </div>

                  <SplitButtonExport
                    reportMeta={reportMeta}
                    report={report}
                    queryPageFilter={queryPageFilter}
                    queryPageSortBy={queryPageSortBy}
                    defaultFilterExpression={defaultFilterExpression}
                    ChartdrilldownReports={ChartdrilldownReports}
                    mainFilterExport={mainFilterExport}
                    table={table.getAllColumns()}
                    fiscalYearFilter={fiscalYearFilter}
                  />
                  <div className={`${floatClass}`}>
                    {reportMeta?.reportInfo?.enable_export_to_template &&
                      reportMeta?.reportInfo?.form_name !== null && (
                        <DownLoadUploadTemplate
                          reportMeta={reportMeta}
                          report={report}
                          queryPageFilter={queryPageFilter}
                          queryPageSortBy={queryPageSortBy}
                          defaultFilterExpression={defaultFilterExpression}
                          ChartdrilldownReports={ChartdrilldownReports}
                          mainFilterExport={mainFilterExport}
                          table={table.getAllColumns()}
                          fiscalYearFilter={fiscalYearFilter}
                        />
                      )}
                  </div>
                  <div className={`${floatClass}`}>
                    <Button
                      // className="border p-1 rounded "

                      variant={
                        reportMeta?.reportInfo?.theme == 2 ? "light" : "primary"
                      }
                      className="border-primary  me-1 px-2 rounded-circle"
                      // onClick={refreshData}
                      onClick={() => refreshData(true)}
                    >
                      <FontAwesomeIcon icon={faArrowsRotate} />
                    </Button>
                  </div>
                  {reportMeta?.reportInfo?.enable_filter_panel &&
                    reportMeta?.filters.some(
                      (item) => item.frequent_filter === true
                    ) === false &&
                    reportMeta?.filters?.length > 0 && (
                      <div className={`${floatClass}`}>
                        <Button
                          onClick={handleFilter}
                          variant={
                            reportMeta?.reportInfo?.theme == 2
                              ? "light"
                              : "primary"
                          }
                          className="border-primary border p-1 px-2 mx-1 rounded-circle"
                        >
                          <FontAwesomeIcon icon={faFilter} />
                        </Button>
                      </div>
                    )}
                  <div className={`${floatClass}`}>
                    {reportMeta?.reportInfo?.enable_column_selection && (
                      <ColumnSelectionDropdown
                        placement="start"
                        // name={
                        //   <>
                        //     <FontAwesomeIcon icon={faListCheck} />
                        //   </>
                        // }
                        reportMeta={reportMeta}
                        flexRender={flexRender}
                        table={table}
                      />
                    )}
                  </div>
                  <CreateFormLink
                    formLinks={formLinks}
                    reportMeta={reportData}
                  />
                  <div className={`${floatClass}`}>
                    {reportMeta?.reportInfo?.enable_tile_view && (
                      <div>
                        <div className={`${floatClass}`}>
                          {tileviewshow
                            ? renderIcon(
                                faList,
                                "Tile view",
                                handleTailViewButtonClick
                              )
                            : renderIcon(
                                faTh,
                                "Grid view",
                                handleGridViewButtonClick
                              )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`${floatClass} m-0 p-0 `}>
                    {util.getCurrentUser()?.id ==
                      reportMeta?.reportInfo?.created_by && (
                      <Button
                        variant={
                          // reportMeta?.reportInfo?.theme == 2 ? "light" : "primary"
                          "purple"
                        }
                        // variant="primary"
                        className="border-primary  p-1 px-2 rounded-circle mx-1"
                        onClick={() =>
                          navigate(
                            "/form/reportdesigner?id=" +
                              reportMeta?.reportInfo?.report_id
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faPencil} className="p-0 m-0 " />
                        {/* Configure */}
                      </Button>
                    )}
                  </div>
                  {/* <div className={`${floatClass}`}>
                  <GlobaltFilter setGlobalFilter={setGlobalFilter} />
                </div> */}
                </div>
              </Card.Header>
            )}

            <FavouriteFilter
              placement="end"
              props={props}
              reportmeta={reportMeta}
              setFinalExpression={updateFinalExpression}
              setFilterExpression1={setFilterExpression}
              finalExpression={finalExpression}
              report={report}
            />
            {FilterFunction()}
            {/* </div> */}
            {/* ref={cardRef} */}
            {/* id="myCard" */}
            <Card.Body id="myCard" className="table-responsive py-0">
              {!show ? (
                <div className="table-container">
                  {reportMeta?.reportInfo?.enable_tile_view && !tileviewshow ? (
                    <ReportTileLayout
                      // page={table.getAllColumns()}
                      // // prepareRow={prepareRow}
                      // // headerGroups={headerGroups}
                      refreshData={refreshData}
                      table={table}
                      flexRender={flexRender}
                      ReletionDltIcon={ReletionDltIcon}
                    />
                  ) : (
                    <>
                      <Table
                        // striped={reportMeta?.reportInfo?.theme === 2 ? true : false}

                        className="p-7 table-sticky sticky "
                        // {...{
                        //   style: {
                        //     width: table.getCenterTotalSize(),
                        //   },
                        // }}
                        // id="myCard"
                      >
                        <thead>
                          {table.getHeaderGroups().map((headerGroup, index) => (
                            <React.Fragment key={`thead_${index}`}>
                              <Header
                                reportMeta={reportMeta}
                                headerGroup={headerGroup}
                                refreshData={refreshData}
                                table={table}
                                flexRender={flexRender}
                              />
                              <ReportFilter
                                reportMeta={reportMeta}
                                headerGroup={headerGroup}
                                table={table}
                                flexRender={flexRender}
                              />

                              {/* <hr className="p-0 m-0 border-black " /> */}
                            </React.Fragment>
                          ))}
                        </thead>
                        <tbody>
                          {table.getRowModel().rows.map((row, i) => {
                            // const isSelected = row.getIsSelected();

                            return (
                              <tr
                                key={row.id}
                                // className={isSelected ? "strikeout" : ""}
                              >
                                {...row.getVisibleCells().map((cell, idx) => {
                                  const { column } = cell;

                                  let alignmentClass =
                                    cell.column.columnDef.align === 1
                                      ? "text-start"
                                      : cell.column.columnDef.align === 2
                                      ? "text-end"
                                      : "text-center";

                                  let stickyClass =
                                    cell.column.columnDef.sticky;

                                  colorField = null;
                                  applyColor = null;
                                  if (cell.column.columnDef.colors?.length > 0)
                                    cell.column.columnDef.colors.map(
                                      (items) => {
                                        if (
                                          items.column_value == cell.getValue()
                                        ) {
                                          colorField = items.background_color;
                                          applyColor = items.apply_color;
                                          applyFont = items.font_color;
                                        }
                                      }
                                    );

                                  // let cellProps = getVisibleCells;

                                  // cellProps.style.color =
                                  //   applyColor == 2 ? applyFont : "";
                                  // cellProps.style.backgroundColor =
                                  //   applyColor == 2 ? colorField : ""; // Replace with your colors

                                  // cellProps.className = `p-1 fs-sm  ${
                                  //   cell.column.sticky ? "sticky-column-data" : ""
                                  // } ${alignmentClass}`;
                                  return (
                                    <td
                                      key={cell.id}
                                      className={` p-1 fs-sm border-dark-subtle ${
                                        stickyClass ? "sticky-column-data" : ""
                                      }  ${alignmentClass}`}
                                      style={{
                                        ...getCommonPinningStyles(column),
                                      }}
                                    >
                                      <div
                                        className={`d-flex justify-content-${
                                          cell.column.columnDef.align === 1
                                            ? "start"
                                            : cell.column.columnDef.align === 2
                                            ? "end"
                                            : "center"
                                        }`}
                                      >
                                        {applyColor == 1 ? (
                                          <span
                                            className={`badge rounded-pill text-break  `}
                                            style={{
                                              backgroundColor: colorField,
                                              color:
                                                applyColor == 1
                                                  ? applyFont
                                                  : "red",
                                              fontSize: !colorField
                                                ? "12px"
                                                : "",
                                              wordWrap: "break-word",
                                            }}
                                          >
                                            {flexRender(
                                              cell.column.columnDef.cell,
                                              cell.getContext()
                                            )}
                                          </span>
                                        ) : (
                                          <span className={`text-break `}>
                                            {flexRender(
                                              cell.column.columnDef.cell,
                                              cell.getContext()
                                            )}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </>
                  )}
                </div>
              ) : null}
            </Card.Body>
            {reportMeta?.reportInfo?.enable_bottom_bar && !pageHeader && (
              <ActionButtons
                // getSelectedRowModel={getSelectedRowModel}
                // hasNextPage={canNextPage}
                // hasPreviousPage={canPreviousPage}
                // nextPage={table.nextPage}
                // pageCount={table.getPageCount.length}
                pageIndex={table.getState().pagination.pageIndex}
                // pageSize={table.getState().pagination.pageSize}
                // previousPage={table.previousPage}
                // setPageIndex={table.setPageIndex}
                setPageSize={table.setPageSize}
                totalRows={totalCount}
                reportMeta={reportMeta}
                table={table}
                pageCount={table.getPageCount()}
              />
            )}
            {/* <div className="d-flex justify-content-end  pt-0 pb-1 mx-3">
            {selectedData.extractedObjectIds.length > 0 &&
              selectedData.formname && (
                <Button onClick={handleDeleteRecords} variant="outline-primary">
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </Button>
              )}
          </div> */}
          </Card>
        </Container>
        {/* ) : null} */}
      </div>
    );
  }
}

const queryClient = new QueryClient();

const SimpleReportPage = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReportTable {...props} />
    </QueryClientProvider>
  );
};

export default SimpleReportPage;
