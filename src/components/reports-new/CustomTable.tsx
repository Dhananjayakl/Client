import {
  flexRender,
  HeaderGroup,
  Row,
  RowData,
  Table,
} from "@tanstack/react-table";
import React from "react";
import Filter from "./Filter";
import TablePins from "./TablePins";
import { Card, Container, Table as BTable, Row as BRow,Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

type TableGroup = "center" | "left" | "right";

function getTableHeaderGroups<T extends RowData>(
  table: Table<T>,
  tg?: TableGroup
): [HeaderGroup<T>[], HeaderGroup<T>[]] {
  if (tg === "left") {
    return [table.getLeftHeaderGroups(), table.getLeftFooterGroups()];
  }

  if (tg === "right") {
    return [table.getRightHeaderGroups(), table.getRightFooterGroups()];
  }

  if (tg === "center") {
    return [table.getCenterHeaderGroups(), table.getCenterFooterGroups()];
  }

  return [table.getHeaderGroups(), table.getFooterGroups()];
}

function getRowGroup<T extends RowData>(row: Row<T>, tg?: TableGroup) {
  if (tg === "left") return row.getLeftVisibleCells();
  if (tg === "right") return row.getRightVisibleCells();
  if (tg === "center") return row.getCenterVisibleCells();
  return row.getVisibleCells();
}

type Props<T extends RowData> = {
  table: Table<T>;
  tableGroup?: TableGroup;
};

export function CustomTable<T extends RowData>({
  table,
  tableGroup,
}: Props<T>) { 
  const [headerGroups, footerGroup] = getTableHeaderGroups(table, tableGroup);
  return (
    <BTable responsive striped >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                className="relative"
                key={header.id}
                style={{
                  width: header.getSize(),
                }}
                colSpan={header.colSpan}
              >
                {header.isPlaceholder ? null : (
                  <>
                    <div>
                      {/* {header.column.getCanGroup() ? (
                          // If the header can be grouped, let's add a toggle
                          <button
                            onClick={header.column.getToggleGroupingHandler()}
                            style={{
                              cursor: 'pointer',
                            }}
                          >
                            {header.column.getIsGrouped()
                              ? `🛑(${header.column.getGroupedIndex()})`
                              : `👊`}
                          </button>
                        ) : null}{' '} */}
                      {!header.isPlaceholder && header.column.getCanPin() && (
                        <TablePins
                          isPinned={header.column.getIsPinned()}
                          pin={header.column.pin}
                        />
                      )}
                                            {header.column.getCanSort() ? (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className="cursor-pointer select-none border rounded px-1"
                        >
                          {{
                            asc: (
                              <FontAwesomeIcon
                                icon={faSortUp}
                                
                              />
                            ),
                            desc: (
                              <FontAwesomeIcon
                                icon={faSortDown}
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? (
                            <FontAwesomeIcon icon={faSort} />
                          )}
                        </button> 
                      ) : null}
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}{" "}

                    </div>
                    {header.column.getCanFilter() ? (
                      <div>
                        <Filter column={header.column} table={table} />
                      </div>
                    ) : null}
                  </>
                )}
                <div
                  className="absolute right-0 top-0 h-full w-1 bg-blue-300 select-none touch-none hover:bg-blue-500 cursor-col-resize"
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                />
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {getRowGroup(row, tableGroup).map((cell) => (
              <td
                key={cell.id}
                style={{
                  width: cell.column.getSize(),
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {footerGroup.map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </BTable>
  );
}

export default CustomTable;
