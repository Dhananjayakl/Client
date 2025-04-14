import React from "react";
import "regenerator-runtime/runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
let GlobalFilter = ({
  // preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  // const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <>
      {/* <label htmlFor="gsearch" className="form-label ">
          Search:
        </label> */}
      <div className="input-group ">
        <div className="input-group-text">
          {" "}
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <input
          placeholder="Search..."
          id="gsearch"
          name="gsearch"
          className="form-control"
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
        />
      </div>
    </>
  );
};

export default GlobalFilter;
