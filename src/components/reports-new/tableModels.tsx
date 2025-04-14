import {
  ColumnDef,
  FilterFn,
  SortingFn,
  sortingFns,
  RowData,
} from "@tanstack/react-table";
import React from "react";
import {
  rankItem,
  compareItems,
  RankingInfo,
} from "@tanstack/match-sorter-utils";

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the ranking info
  addMeta(itemRank);

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;
  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]! as RankingInfo,
      rowB.columnFiltersMeta[columnId]! as RankingInfo
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export type TableMeta = {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
};

// Give our default column cell renderer editing superpowers!
export const defaultColumn: Partial<ColumnDef<any>> = {
  cell: ({ getValue, row: { index }, column: { id }, column, table }) => {
    const initialValue = getValue();
    console.log(getValue(), index, id, column, table);
    if (column.columnDef.type === "number")
      return (<span className="float-right">{initialValue}</span>);
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      (table.options.meta as TableMeta).updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  },
};

export const getTableMeta = (
  setData: React.Dispatch<React.SetStateAction<any[]>>,
  skipAutoResetPageIndex: () => void
) =>
  ({
    updateData: (rowIndex, columnId, value) => {
      // Skip age index reset until after next rerender
      skipAutoResetPageIndex();
      setData((old) =>
        old.map((row, index) => {
          if (index !== rowIndex) return row;

          return {
            ...old[rowIndex]!,
            [columnId]: value,
          };
        })
      );
    },
  } as TableMeta);
