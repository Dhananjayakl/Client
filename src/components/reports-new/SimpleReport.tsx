import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  GroupingState,
  useReactTable,
} from "@tanstack/react-table";
import { faker } from "@faker-js/faker";

import React from "react";
import { Button, Card, Badge } from "react-bootstrap";

// import styled from '@emotion/styled'
import { useSkipper } from "./hooks";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faMagnifyingGlass,
  faArrowUpFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import {
  // columns,
  defaultColumn,
  fuzzyFilter,
  getTableMeta,
} from "./tableModels";
import DebouncedInput from "./DebouncedInput";
import ActionButtons from "./ActionButtons";
import CustomTable from "./CustomTable";



export const SimpleReport = (...props) => {
  console.log(...props); 
  let columns = props[0].columns;
  let makeData = props[0].data;
  let title = props[0].title;
  console.log('columns',columns);
  console.log('makeData',makeData);
  console.log('title',title);
  const rerender = React.useReducer(() => ({}), {})[1];

  const [showHide, setShowHide] = React.useState(false);

  const [data, setData] = React.useState(makeData(1000));
  const refreshData = () => setData(makeData(1000));

  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [grouping, setGrouping] = React.useState<GroupingState>([]);
  const [isSplit, setIsSplit] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnPinning, setColumnPinning] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data,
    columns,
    // defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    autoResetPageIndex,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    // Provide our updateData function to our table meta
    meta: getTableMeta(setData, skipAutoResetPageIndex),
    state: {
      grouping,
      columnFilters,
      globalFilter,
      columnVisibility,
      columnPinning,
      rowSelection,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id))
    );
  };

  return (
    // <Styles>
    <>
      <Card>
        <Card.Header>
          <div >
            <span className="h2">{title}</span>
            <div className="float-end">
              <Button variant="secondary">
                <Badge bg="text-bg-secondary">
                  <FontAwesomeIcon icon={faArrowUpFromBracket} />{" "}
                </Badge>{" "}
                Export
              </Button>
            </div>
          </div>
          <hr></hr>
          <div className="d-flex">
            <div className="  w-75 p-2">
              {/* <label htmlFor="AllColumnSearch" className="col-sm-3 col-form-label">Search:</label> */}
              <div className="input-group col-sm-8">
                <div className="input-group-text">
                  {" "}
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <DebouncedInput
                  value={globalFilter ?? ""}
                  onChange={(value) => setGlobalFilter(String(value))}
                  className="form-control "
                  placeholder="Search all columns..."
                  name="AllColumnSearch"
                />
              </div>
            </div>
            <div className=" float-end p-2">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setShowHide(!showHide)}
              >
                Show/Hide Columns
              </button>
            </div>
          </div>
        </Card.Header>
     

      <div
        className={"collapse " + (showHide ? "show" : "")}
        id="showHideColumns"
      >
        <div className="card card-body">
          <div className="px-1 border-b border-black">
            <label>
              <input
                type="checkbox"
                checked={table.getIsAllColumnsVisible()}
                onChange={table.getToggleAllColumnsVisibilityHandler()}
                className="mr-1"
              />
              Toggle All
            </label>
          </div>
          {table.getAllLeafColumns().map((column) => {
            return (
              <div key={column.id} className="px-1" style={{ columnCount: 3 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className="mr-1"
                  />
                  {column.id}
                </label>
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className="p-2">
            <div>
              <input
                type="checkbox"
                checked={isSplit}
                onChange={e => setIsSplit(e.target.checked)}
                className="mx-1"
              />
              Split Mode
            </div>
            <button onClick={randomizeColumns} className="border rounded p-1">
              Shuffle Columns
            </button>
          </div> */}
      {/* </div> */}

      <div className="card card-body">
      <div className={`flex ${isSplit ? "gap-4" : ""}`}>
        {isSplit ? <CustomTable table={table} tableGroup="left" /> : null}
        <CustomTable
          table={table}
          tableGroup={isSplit ? "center" : undefined}
        />
        {isSplit ? <CustomTable table={table} tableGroup="right" /> : null}
      </div>
      <div className="p-2" />

      <ActionButtons
        getSelectedRowModel={table.getSelectedRowModel}
        hasNextPage={table.getCanNextPage()}
        hasPreviousPage={table.getCanPreviousPage()}
        nextPage={table.nextPage}
        pageCount={table.getPageCount()}
        pageIndex={table.getState().pagination.pageIndex}
        pageSize={table.getState().pagination.pageSize}
        previousPage={table.previousPage}
        refreshData={refreshData}
        rerender={rerender}
        rowSelection={rowSelection}
        setPageIndex={table.setPageIndex}
        setPageSize={table.setPageSize}
        totalRows={table.getPrePaginationRowModel().rows.length}
      />
      </div>
      </Card>
      <div className="p-2" />
      <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
    </>
    //  </Styles>
  );
};

export default SimpleReport;
