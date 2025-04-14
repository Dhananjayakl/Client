import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCross } from "@fortawesome/free-solid-svg-icons";

const GlobaltFilter = (props) => {
  const { setGlobalFilter, table } = props;
  return (
    <>
      <div>
        <input
          placeholder="Global Filter..."
          //   value={globalFilter}
          type="text"
          onChange={(e) => {
            setGlobalFilter(String(e.target.value));
          }}
        />
      </div>
    </>
  );
};

export default GlobaltFilter;
