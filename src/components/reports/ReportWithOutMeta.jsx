import React from "react";
// import styled from 'styled-components';
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useGroupBy,
  useExpanded,
  useRowSelect,
} from "react-table";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import axios from "src/utils/AxiosInstance";
import ActionButtons from "src/components/reports/ActionButtons";
// import { fetchPokemonData } from './fetchData';

import {
  DateRangeColumnFilter,
  dateBetweenFilterFn,
  SelectColumnFilter,
  DefaultColumnFilter,
  SliderColumnFilter,
  NumberRangeColumnFilter,
} from "./Filters";

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

const columns = [
  {
    Header: "Name",
    accessor: "created_by_fullname",
  },
  {
    Header: "Leave From",
    accessor: "leave_from",
  },
  {
    Header: "Leave Until",
    accessor: "leave_until",
  },
  {
    Header: "No. of Days",
    accessor: "no_of_days",
    maxWidth: 400,
    minWidth: 140,
    width: 200,
  },
  {
    Header: "Status",
    accessor: "status",
    maxWidth: 400,
    minWidth: 140,
    width: 200,
    // width:10px,
  },
  {
    Header: "Approver",
    accessor: "manager_fullname",
  },
  {
    Header: "Reason For",
    accessor: "reason_for_value",
  },
  {
    Header: "Reason Details",
    accessor: "reason_details",
    maxWidth: 400,
    minWidth: 140,
    width: 200,
  },
  {
    Header: "Comments",
    accessor: "comments",
  },
  {
    Header: "History",
    Cell: ({ row }) => {
      return (
        <>
          <div>
            {row.original.created_by_fullname} - {row.original.created_on}
          </div>
          <div>
            {row.original.last_updated_by_fullname} -{" "}
            {row.original.last_updated_on}
          </div>
        </>
      );
    },
  },
];

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

function getReportURL(
  entity,
  pageNumber,
  pageSize,
  sortField,
  sortOrder,
  orderExpression,
  filterExpression
) {
  const API_BASE_URL = "/viewdata";
  if (pageNumber === undefined) pageNumber = 0;
  if (pageSize === undefined) pageSize = 0;
  if (sortField === undefined) sortField = "";
  if (sortOrder === undefined) sortOrder = "";
  if (orderExpression === undefined) orderExpression = "";
  if (filterExpression === undefined) filterExpression = "";
  return (
    API_BASE_URL +
    "?entity=" +
    entity +
    "&pageNumber=" +
    pageNumber +
    "&pageSize=" +
    pageSize +
    "&sortField=" +
    sortField +
    "&sortOrder=" +
    sortOrder +
    "&OrderExpression=" +
    orderExpression +
    "&filterExpression=" +
    filterExpression
  );
}

const fetchReportData = async (
  service,
  page,
  pageSize,
  pageFilter,
  pageSortBy
) => {
  const offset = page * pageSize;

  let sortOrder;
  let sortField;
  let filterCondition;

  if (pageSortBy.length > 0) {
    const sortParams = pageSortBy[0];
    sortOrder = sortParams.desc ? "desc" : "asc";
    sortField = sortParams.id;
    // paramStr = `${paramStr}&sortby=${sortParams.id}&direction=${sortyByDir}`
  }

  if (pageFilter.length > 0) {
    filterCondition = pageFilter.map((value, index, array) => {
      // return value.id + " LIKE '%"+ value.value+"%'";
      return value.id + " LIKE '" + value.value + "'";
    });
    filterCondition = filterCondition.join(" AND ");
  }

  try {
    const response = await axios.get(
      getReportURL(
        service,
        page + 1,
        pageSize,
        sortField,
        sortOrder,
        undefined,
        filterCondition
      )
    ); //fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pageSize}`);
    const data = await response.data.data;
    return response.data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 10,
  totalCount: 0,
  queryPageFilter: "",
  queryPageSortBy: [],
};

const PAGE_CHANGED = "PAGE_CHANGED";
const PAGE_SIZE_CHANGED = "PAGE_SIZE_CHANGED";
const PAGE_SORT_CHANGED = "PAGE_SORT_CHANGED";
const PAGE_FILTER_CHANGED = "PAGE_FILTER_CHANGED";
const TOTAL_COUNT_CHANGED = "TOTAL_COUNT_CHANGED";

// const reducer = (state, { type, payload }) => {
//   switch (type) {
//     case PAGE_CHANGED:
//       return {
//         ...state,
//         queryPageIndex: payload,
//       };
//     case PAGE_SIZE_CHANGED:
//       return {
//         ...state,
//         queryPageSize: payload,
//       };
//     case TOTAL_COUNT_CHANGED:
//       return {
//         ...state,
//         totalCount: payload,
//       };
//     default:
//       throw new Error(`Unhandled action type: ${type}`);
//   }
// };

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
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

function ReportTable(props) {
  let {
    columns,
    data: sourceData,
    dataFunction,
    service,
    title,
    enableCheck,
  } = props;

  const [keyword, setKeyword] = React.useState("");
  const [useFilter, setUseFilter] = React.useState(true);

  // let columnList = React.useMemo( () => columns, []);

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const [
    {
      queryPageIndex,
      queryPageSize,
      totalCount,
      queryPageFilter,
      queryPageSortBy,
    },
    dispatch,
  ] = React.useReducer(reducer, initialState);

  const { isLoading, error, data, isSuccess } = useQuery(
    [
      "reportData",
      queryPageIndex,
      queryPageSize,
      queryPageFilter,
      queryPageSortBy,
    ],
    () =>
      fetchReportData(
        service,
        queryPageIndex,
        queryPageSize,
        queryPageFilter,
        queryPageSortBy
      ),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
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
    allColumns,
    // Get the state from the instance
    state: { pageIndex, pageSize, filters, sortBy },
  } = useTable(
    {
      columns, // columnList,
      data: isSuccess ? data.data : [],
      initialState: {
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
        sortBy: queryPageSortBy,
      },
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      manualFilters: true,
      pageCount: isSuccess ? Math.ceil(totalCount / queryPageSize) : null,
      autoResetSortBy: false,
      autoResetFilters: false,
      defaultColumn,
    },
    useFilters,
    // useGlobalFilter,
    useSortBy,
    // useExpanded,
    usePagination
    // useRowSelect,
  );
  React.useEffect(() => {
    dispatch({ type: PAGE_CHANGED, payload: pageIndex });
  }, [pageIndex]);

  React.useEffect(() => {
    dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
    gotoPage(0);
  }, [pageSize, gotoPage]);

  React.useEffect(() => {
    dispatch({ type: PAGE_SORT_CHANGED, payload: sortBy });
    gotoPage(0);
  }, [sortBy, gotoPage]);

  React.useEffect(() => {
    if (useFilter) {
      dispatch({ type: PAGE_FILTER_CHANGED, payload: filters });
      gotoPage(0);
    }
  }, [filters, gotoPage, useFilter]);

  React.useEffect(() => {
    if (data?.totalRecords) {
      dispatch({
        type: TOTAL_COUNT_CHANGED,
        payload: data.totalRecords,
      });
    }
  }, [data?.totalRecords]);

  if (error) {
    return <p>Error</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {isSuccess ? (
        <Container fluid className="p-0">
          <Card>
            <Card.Header>
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
                  {/* <ReportTool /> */}
                  <ColumnSelectionOffConvas
                    placement="end"
                    name={`Select Columns`}
                    allColumns={allColumns}
                  />
                </div>
                {/* <div className="float-end">
            {" "}
            <GlobalFilter
              // preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div> */}
              </div>
            </Card.Header>
            <Card.Body className="table-responsive py-0">
              <Table striped {...getTableProps()}>
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
                                  <FontAwesomeIcon
                                    icon={faSort}
                                    className="ms-2"
                                  />
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
                      {/* <tr > */}
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps()}>
                            <div>
                              {column.canFilter
                                ? column.render("Filter")
                                : null}
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
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
            {/* <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table> */}

            <ActionButtons
              // getSelectedRowModel={getSelectedRowModel}
              hasNextPage={canNextPage}
              hasPreviousPage={canPreviousPage}
              nextPage={nextPage}
              pageCount={pageOptions.length}
              pageIndex={pageIndex}
              pageSize={pageOptions.length}
              previousPage={previousPage}
              // refreshData={refreshData}
              // rerender={rerender}
              // rowSelection={rowSelection}
              setPageIndex={gotoPage}
              setPageSize={setPageSize}
              totalRows={totalCount}
            />
          </Card>
        </Container>
      ) : null}

      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
              sortBy,
              // state,
              // groupBy,
              // expanded: expanded,
              filters,
              // selection: selection,
            },
            null,
            2
          )}
        </code>
      </pre>
    </div>
  );
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

// export default PokemonTable;
