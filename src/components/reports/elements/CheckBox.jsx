// import React, { useState, useEffect, useRef } from "react";

// function IndeterminateCheckbox({
//   row,
//   columnMeta,
//   indeterminate,
//   table,
//   checkedObject,
//   ...rest
// }) {
//   const ref = React.useRef(null);
//   React.useEffect(() => {
//     if (ref?.current?.indeterminate && typeof indeterminate === "boolean") {
//       ref.current.indeterminate = !rest.checked && indeterminate;
//     }
//   }, [ref, indeterminate]);

//   useEffect(() => {
//     if (table) {
//       const rows = table.getSelectedRowModel()?.rows || [];
//       const extractedObjectIds = rows
//         .map((row) => row.original[columnMeta?.id_column_name])
//         .filter((id) => id !== undefined);
//       const formname = columnMeta?.form;
//       if (typeof checkedObject === "function") {
//         checkedObject({ extractedObjectIds, formname });
//       }
//     }
//   }, [table?.getSelectedRowModel(), columnMeta, checkedObject]);

//   const hiddenCheckbox =
//     columnMeta?.column_type === 18 &&
//     row?.original[columnMeta?.column_name] === true;
//   // if (hiddenCheckbox) {
//   //   // row.toggleSelected(true);
//   //   // table.resetRowSelection();
//   //   return null;
//   // }

//   return (
//     <>
//       <input
//         type="checkbox"
//         ref={ref}
//         hidden={hiddenCheckbox}
//         className={`cursor-pointer`}
//         {...rest}
//       />
//     </>
//   );
// }

// export default IndeterminateCheckbox;

import React, { useEffect, useRef } from "react";

function IndeterminateCheckbox({
  row,
  columnMeta,
  indeterminate,
  table,
  checkedObject,
  ...rest
}) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref?.current?.indeterminate && typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  useEffect(() => {
    if (table) {
      const rows = table.getSelectedRowModel()?.rows || [];
      const visibleRows = rows.filter((row) => {
        const hiddenCheckbox =
          columnMeta?.column_type === 18 &&
          row?.original[columnMeta?.column_name] === true;
        return !hiddenCheckbox;
      });

      const extractedObjectIds = visibleRows
        .map((row) => row.original[columnMeta?.id_column_name])
        .filter((id) => id !== undefined);

      const formname = columnMeta?.form;
      if (typeof checkedObject === "function") {
        checkedObject({ extractedObjectIds, formname });
      }
    }
  }, [table?.getSelectedRowModel(), columnMeta, checkedObject]);
  const hiddenCheckbox =
    columnMeta?.column_type === 18 &&
    row?.original[columnMeta?.column_name] === true;

  return (
    <input
      type="checkbox"
      hidden={hiddenCheckbox}
      ref={ref}
      className={`cursor-pointer`}
      {...rest}
    />
  );
}

export default IndeterminateCheckbox;
