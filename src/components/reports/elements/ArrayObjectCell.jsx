import React from "react";

const ArrayObjectCell = ({ value, row, columnMeta }) => {
  // const commaSeparatedValue = row.original[columnMeta.column_name]?.join(", ");

  // return <>{commaSeparatedValue}</>;
  return (
    <>
      <ul className=" m-0">
        {value?.map((res, column_id) => (
          <li key={column_id}>{res}</li>
        ))}
      </ul>
    </>
  );
};

export default ArrayObjectCell;
