import React from "react";
import { Helmet } from "react-helmet-async";
// import {
//   useTable,
//   usePagination,
//   useSortBy,
//   useFilters,
//   useGlobalFilter,
//   useGroupBy,
//   useExpanded,
//   useRowSelect,
// } from "react-table";

import ReportTool from "./ReportTool";

import {
  Card,
  Container,
  Table,
  Pagination,
  Row,
  Col,
  Form,
  Nav,
  NavDropdown,
  Dropdown,
  Button,
  Badge,
  Offcanvas,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
  faEye,
  faGear,
  faMagnifyingGlass,
  faArrowUpFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import {
  AlertCircle,
  Bell,
  BellOff,
  Home,
  MessageCircle,
  UserPlus,
  Search,
} from "react-feather";

import GlobalFilter from "./GlobalFilter";
// import DefaultColumnFilter from "./DefaultColumnFilter";
import {
  DateRangeColumnFilter,
  dateBetweenFilterFn,
  SelectColumnFilter,
  DefaultColumnFilter,
  SliderColumnFilter,
  NumberRangeColumnFilter,
} from "./Filters";

import ActionButtons from "./ActionButtons";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

const ColumnSelectionOffConvas = ({ name, allColumns, ...props }) => {
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  return (
    <>
      <Button variant="primary" onClick={toggleShow}>
        {name}
      </Button>

      <Offcanvas show={show} onHide={handleClose} {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{name}</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {/* <Holiday /> */}

          <div className="card card-body">
            <div>
              {/* <div>
                <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} />{" "}
                Toggle All
              </div> */}
              {/* Loop through columns data to create checkbox */}
              {allColumns.map((column) => (
                <div className="cb action" key={column.id}>
                  <label>
                    <input type="checkbox" {...column.getToggleHiddenProps()} />{" "}
                    <span>{column.Header}</span>
                  </label>
                </div>
              ))}
              <br />
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

const { forwardRef, useRef, useImperativeHandle } = React;

const SimpleReport = forwardRef((props, ref) => {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
      maxWidth: 400,
      minWidth: 140,
      width: 200,
    }),
    []
  );
  let reportInfo = {
    reportInfo: {
      enable_export_history: true,
      enable_filter_panel: true,
      enable_column_filters: true,
      enable_column_selection: true,
      enable_header_bar: true,
      enable_bottom_bar: true,
      enable_pagination: true,
      enable_records_per_page: true,
      first_lastpage: true,
      goto_page: true,
      no_of_records_per_page: true,
      page_index: true,
      page_of_total_page: true,
      previous_nextpage: true,
      records_in_page: true,
      total_row: true,
      default_bottom_bar: true,
    },
  };
  const [showHide, setShowHide] = React.useState(false);

  let { columns, data, dataFunction, service, title, enableCheck } = props;

  const [tableData, setTableData] = React.useState(data || []);
  const refreshData = () => {
    dataFunction(service).then((response) => {
      if (response.data.data === undefined) {
        setTableData(response.data);
      } else {
        setTableData(response.data.data);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    refreshData,
  }));

  if (dataFunction)
    React.useEffect(() => {
      dataFunction(service).then((response) => {
        if (response.data.data === undefined) {
          setTableData(response.data);
        } else {
          setTableData(response.data.data);
        }
      });
    }, []);

  columns.forEach(function (column, index) {
    switch (column.type) {
      case "number":
        column.Filter = NumberRangeColumnFilter;
        break;
      case "date":
        column.Filter = DateRangeColumnFilter;
        column.filter = dateBetweenFilterFn;
        break;
      case "slider":
        column.Filter = SliderColumnFilter;
        break;
    }
  });
  const filterTypes = React.useMemo(
    () => ({
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter, columnFilters, selectedRowIds },
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    allColumns,
    rows,
    rowSelection,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: { pageIndex: 0, pageSize: 10 },
      sorters: {
        initial: [
          {
            field: "status",
            order: "asc",
          },
        ],
      },
      defaultColumn,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        if (enableCheck)
          return [
            {
              id: "selection",
              // The header can use the table's getToggleAllRowsSelectedProps method
              // to render a checkbox
              Header: ({ getToggleAllRowsSelectedProps }) => (
                <div>
                  <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                </div>
              ),
              // The cell can use the individual row's getToggleRowSelectedProps method
              // to the render a checkbox
              Cell: ({ row }) => (
                <div>
                  <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                </div>
              ),
            },
            ...columns,
          ];
        else return columns;
      });
    }
  );

  return (
    <Container fluid className="p-0">
      <Card>
        {/* <Card.Header>
          <div>
            <span className="h2">{title}</span>
           
            <div className="float-end  mx-2">
              <Button variant="secondary">
                <Badge bg="text-bg-secondary">
                  <FontAwesomeIcon icon={faArrowUpFromBracket} />{" "}
                </Badge>{" "}
                Export
              </Button>
            </div>
            <div className="float-end  mx-2">
              <ColumnSelectionOffConvas
                placement="end"
                name={`Select Columns`}
                allColumns={allColumns}
              />
            </div>
           
          </div>
        </Card.Header> */}

        <Card.Body className="table-responsive py-0">
          <Table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <>
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps({
                          style: {
                            minWidth: column.minWidth,
                            width: column.width,
                          },
                        })}
                        className="align-baseline"
                      >
                        <span {...column.getSortByToggleProps()}>
                          {column.canSort ? (
                            column.isSorted ? (
                              column.isSortedDesc ? (
                                <FontAwesomeIcon
                                  icon={faSortUp}
                                  className="ms-2"
                                />
                              ) : (
                                <FontAwesomeIcon
                                  icon={faSortDown}
                                  className="ms-2"
                                />
                              )
                            ) : (
                              <FontAwesomeIcon icon={faSort} className="ms-2" />
                            )
                          ) : (
                            ""
                          )}
                        </span>{" "}
                        {column.render("Header")}
                        {/* <div>
                          {column.canFilter ? column.render("Filter") : null}
                        </div> */}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {/* <tr {...headerGroup.getHeaderGroupProps()}> */}
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        <div>
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                </>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
        {/* <ActionButtons
          // getSelectedRowModel={getSelectedRowModel}
          hasNextPage={canNextPage}
          hasPreviousPage={canPreviousPage}
          nextPage={nextPage}
          pageCount={pageOptions.length}
          pageIndex={pageIndex}
          pageSize={pageOptions.length}
          previousPage={previousPage}
          refreshData={refreshData}
          // rerender={rerender}
          rowSelection={rowSelection}
          setPageIndex={gotoPage}
          setPageSize={setPageSize}
          totalRows={rows.length}
          reportMeta={reportInfo}
        /> */}
      </Card>
    </Container>
  );
});

// Utilities

// // Create an editable cell renderer
// const EditableCell = ({
//   value: initialValue,
//   row: { index },
//   column: { id },
//   updateMyData, // This is a custom function that we supplied to our table instance
//   editable,
// }) => {
//   // We need to keep and update the state of the cell normally
//   const [value, setValue] = React.useState(initialValue);

//   const onChange = (e) => {
//     setValue(e.target.value);
//   };

//   // We'll only update the external data when the input is blurred
//   const onBlur = () => {
//     updateMyData(index, id, value);
//   };

//   // If the initialValue is changed externall, sync it up with our state
//   React.useEffect(() => {
//     setValue(initialValue);
//   }, [initialValue]);

//   if (!editable) {
//     return `${initialValue}`;
//   }

//   return <input value={value} onChange={onChange} onBlur={onBlur} />;
// };

// // Define a default UI for filtering
// function DefaultColumnFilter({
//   column: { filterValue, preFilteredRows, setFilter },
// }) {
//   const count = preFilteredRows.length;

//   return (
//     <input
//       value={filterValue || ""}
//       onChange={(e) => {
//         setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
//       }}
//       placeholder={`Search ${count} records...`}
//     />
//   );
// }

// // This is a custom filter UI for selecting
// // a unique option from a list
// function SelectColumnFilter({
//   column: { filterValue, setFilter, preFilteredRows, id },
// }) {
//   // Calculate the options for filtering
//   // using the preFilteredRows
//   const options = React.useMemo(() => {
//     const options = new Set();
//     preFilteredRows.forEach((row) => {
//       options.add(row.values[id]);
//     });
//     return [...options.values()];
//   }, [id, preFilteredRows]);

//   // Render a multi-select box
//   return (
//     <select
//       value={filterValue}
//       onChange={(e) => {
//         setFilter(e.target.value || undefined);
//       }}
//     >
//       <option value="">All</option>
//       {options.map((option, i) => (
//         <option key={i} value={option}>
//           {option}
//         </option>
//       ))}
//     </select>
//   );
// }

// // This is a custom filter UI that uses a
// // slider to set the filter value between a column's
// // min and max values
// function SliderColumnFilter({
//   column: { filterValue, setFilter, preFilteredRows, id },
// }) {
//   // Calculate the min and max
//   // using the preFilteredRows

//   const [min, max] = React.useMemo(() => {
//     let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
//     let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
//     preFilteredRows.forEach((row) => {
//       min = Math.min(row.values[id], min);
//       max = Math.max(row.values[id], max);
//     });
//     return [min, max];
//   }, [id, preFilteredRows]);

//   return (
//     <>
//       <input
//         type="range"
//         min={min}
//         max={max}
//         value={filterValue || min}
//         onChange={(e) => {
//           setFilter(parseInt(e.target.value, 10));
//         }}
//       />
//       <button onClick={() => setFilter(undefined)}>Off</button>
//     </>
//   );
// }

// // This is a custom UI for our 'between' or number range
// // filter. It uses two number boxes and filters rows to
// // ones that have values between the two
// function NumberRangeColumnFilter({
//   column: { filterValue = [], preFilteredRows, setFilter, id },
// }) {
//   const [min, max] = React.useMemo(() => {
//     let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
//     let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
//     preFilteredRows.forEach((row) => {
//       min = Math.min(row.values[id], min);
//       max = Math.max(row.values[id], max);
//     });
//     return [min, max];
//   }, [id, preFilteredRows]);

//   return (
//     <div
//       style={{
//         display: "flex",
//       }}
//     >
//       <input
//         value={filterValue[0] || ""}
//         type="number"
//         onChange={(e) => {
//           const val = e.target.value;
//           setFilter((old = []) => [
//             val ? parseInt(val, 10) : undefined,
//             old[1],
//           ]);
//         }}
//         placeholder={`Min (${min})`}
//         style={{
//           width: "70px",
//           marginRight: "0.5rem",
//         }}
//       />
//       to
//       <input
//         value={filterValue[1] || ""}
//         type="number"
//         onChange={(e) => {
//           const val = e.target.value;
//           setFilter((old = []) => [
//             old[0],
//             val ? parseInt(val, 10) : undefined,
//           ]);
//         }}
//         placeholder={`Max (${max})`}
//         style={{
//           width: "70px",
//           marginLeft: "0.5rem",
//         }}
//       />
//     </div>
//   );
// }

export default SimpleReport;
