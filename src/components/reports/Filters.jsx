import React, { Component, useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, FormControl, InputGroup, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/flatpickr.css";

// import "flatpickr/dist/themes/light.css";

import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import moment from "moment";
import useTheme from "src/hooks/useTheme";

import {
  faFile,
  faTrash,
  faDownload,
  faUpload,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "use-debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
export const dateBetweenFilterFn = (rows, id, getFilterValue) => {
  const sd = getFilterValue[0] ? new Date(getFilterValue[0]) : undefined;
  const ed = getFilterValue[1] ? new Date(getFilterValue[1]) : undefined;
  if (ed || sd) {
    return rows.filter((r) => {
      const cellDate = new Date(r.values[id]);
      if (ed && sd) {
        return cellDate >= sd && cellDate <= ed;
      } else if (sd) {
        return cellDate >= sd;
      } else if (ed) {
        return cellDate <= ed;
      }
    });
  } else {
    return rows;
  }
};

// export const DateRangeColumnFilter = ({
//   column: { getFilterValue = [], preFilteredRows = [], setFilterValue, id },
// }) => {
//   const [min, max] = React.useMemo(() => {
//     let min = preFilteredRows.length
//       ? new Date(preFilteredRows[0].values[id])
//       : new Date(0);
//     let max = preFilteredRows.length
//       ? new Date(preFilteredRows[0].values[id])
//       : new Date(0);

//     preFilteredRows?.forEach((row) => {
//       const rowDate = new Date(row.values[id]);

//       min = rowDate <= min ? rowDate : min;
//       max = rowDate >= max ? rowDate : max;
//     });

//     return [min, max];
//   }, [id, preFilteredRows]);

//   return (
//     <Row className="p-0 me-1">
//       <input
//         className="form-control"
//         onChange={(e) => {
//           const val = e.target.value;
//           setFilterValue((old = []) => [val ? val : undefined, old[1]]);
//         }}
//         type="date"
//         value={getFilterValue[0] || ""}
//       />
//       <center> {" to "}</center>
//       <input
//         className="form-control "
//         onChange={(e) => {
//           const val = e.target.value;
//           setFilterValue((old = []) => [old[0], val ? val : undefined]);
//         }}
//         type="date"
//         value={getFilterValue[1]?.slice(0, 10) || ""}
//       />
//     </Row>
//   );
// };

// export const DateRangeColumnFilter = ({
//   column: { getFilterValue = [], preFilteredRows = [], setFilterValue, id },
// }) => {
//   const [min, max] = React.useMemo(() => {
//     // Initialize min and max with default values
//     let min = new Date(0);
//     let max = new Date(0);

//     if (preFilteredRows.length) {
//       min = new Date(preFilteredRows[0].values[id]);
//       max = new Date(preFilteredRows[0].values[id]);

//       // Find min and max dates from the rows
//       preFilteredRows.forEach((row) => {
//         const rowDate = new Date(row.values[id]);

//         min = rowDate < min ? rowDate : min;
//         max = rowDate > max ? rowDate : max;
//       });
//     }

//     return [min, max];
//   }, [id, preFilteredRows]);

//   return (
//     <Row className="p-0 me-1">
//       <input
//         className="form-control"
//         min={min.toISOString().slice(0, 10)}
//         onChange={(e) => {
//           const val = e.target.value;
//           setFilterValue((old = []) => [val || undefined, old[1]]);
//         }}
//         type="date"
//         value={getFilterValue[0] || ""}
//       />
//       <center> {" to "}</center>
//       <input
//         className="form-control"
//         max={max.toISOString().slice(0, 10)}
//         onChange={(e) => {
//           const val = e.target.value;
//           setFilterValue((old = []) => [old[0], val || undefined]);
//         }}
//         type="date"
//         value={getFilterValue[1]?.slice(0, 10) || ""}
//       />
//     </Row>
//   );
// };

// export const DateRangeColumnFilter = ({
//   column: { getFilterValue, setFilterValue },
// }) => {
//   // Retrieve the current filter value
//   const filterValue = getFilterValue();
//   const { t } = useTranslation("common");
//   const currentValue = filterValue?.value || "";

//   return (
//     <Row className="p-0 me-1 w-100">
//       <input
//         className="form-control"
//         type="date"
//         value={currentValue}
//         onChange={(e) => {
//           const val = e.target.value;
//           setFilterValue({
//             value: val === "" ? "" : val,
//             type: "date",
//           });
//         }}
//       />
//     </Row>
//   );
// };

export const DateRangeColumnFilter = ({
  column: { getFilterValue, setFilterValue },
  item,
}) => {
  const format =
    item?.format === "1"
      ? "dd-mm-yyyy"
      : item?.format === "2"
      ? "yyyy-mm-dd"
      : null;
  const [selectedDate, setSelectedDate] = useState(null);
  const filterValue = getFilterValue();

  const { t } = useTranslation("common");

  const { d_date_format, d_data_time_format } = useSelector(
    (state) => state.systemConfig.systemConfig
  );

  const handleDateChange = (date) => {
    setSelectedDate(date.length > 0 ? date[0] : null);

    const validDate = date[0];
    if (!validDate) {
      setFilterValue({
        value: "",
        type: "date",
      });
    } else {
      let formattedFormat = d_date_format
        .replace(/dd/g, "DD")
        .replace(/EEEE/g, "dddd")
        .replace(/E/g, "ddd");

      const formattedDate = moment(validDate).format("yyyy-MM-DD");
      // const formattedDate = `${moment(validDate).format(formattedFormat)}`;

      setFilterValue({
        value: formattedDate === "" ? "" : `${formattedDate}`,
        type: "date",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setFilterValue({
        value: "",
        type: "date",
      });
    }
  };
  function transformDateFormat(format) {
    const formatMapping = {
      yyyy: "Y", // Full year
      MM: "m", // Month with leading zero
      mm: "m",
      dd: "d", // Day with leading zero
      HH: "H", // Hours (24-hour format)
      // mm: "i", // Minutes
    };

    // Replace each part of the format dynamically
    return format.replace(
      /yyyy|MM|dd|HH|mm/g,
      (match) => formatMapping[match] || match
    );
  }
  const fp = useRef(null);
  // Theme changes for diffrent mode Start
  const { theme, setTheme } = useTheme();

  const loadTheme = (themeName) => {
    const themeId = "flatpickr-theme";
    let themeLink = document.getElementById(themeId);

    if (!themeLink) {
      themeLink = document.createElement("link");
      themeLink.rel = "stylesheet";
      themeLink.id = themeId;
      document.head.appendChild(themeLink);
    }

    themeLink.href = `https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/${themeName}.css`;
  };

  useEffect(() => {
    loadTheme(theme === "dark" ? "dark" : "light");
  }, [theme]);

  // Theme changes for diffrent mode Ends

  return (
    <Row xs="auto" className=" w-100 ">
      <InputGroup xs="auto" className="ps-0 pe-1 w-100">
        <Flatpickr
          className="p-1 text-start"
          ref={fp}
          // placeholder={d_date_format}
          placeholder={format ? format : d_date_format}
          onChange={handleDateChange}
          onKeyDown={handleKeyDown}
          options={{
            // dateFormat: transformDateFormat(d_date_format),
            dateFormat: transformDateFormat(format ? format : d_date_format),

            monthSelectorType: "static",
            // mode: "range",
          }}
          render={({ value, defaultValue, ...props }, ref) => (
            <FormControl
              {...props}
              ref={ref}
              defaultValue={defaultValue}
              value={value}
            />
          )}
        />
        {selectedDate && (
          <Button
            className="border"
            size="sm"
            variant="light"
            onClick={() => {
              if (!fp?.current?.flatpickr) return;
              fp.current.flatpickr.clear();
            }}
          >
            X
          </Button>
        )}
      </InputGroup>
    </Row>
  );
};

export const DefaultColumnFilter = React.memo(
  ({ column: { getFilterValue, setFilterValue } }) => {
    useEffect(() => {
      const filterValue = getFilterValue() || {};
      const { value } = filterValue;

      setFilterValues(value || "");
    }, []);
    const { t } = useTranslation("common");
    const [filterValues, setFilterValues] = useState(
      getFilterValue?.value || ""
    );

    const clicking = () => {
      setFilterValue({ value: filterValues, type: "text" });
      // setFilterValue(filterValues);
    };
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        clicking();
      }
    };

    return (
      <>
        <Row xs="auto" className="pe-1 w-100">
          {/* <Col xs="auto"> */}
          <input
            className="form-control "
            value={filterValues}
            onChange={(e) => {
              setFilterValues(e.target.value);
            }}
            placeholder={`🔎 ${t("Search")}...`}
            onKeyDown={handleKeyPress}
          />
        </Row>
      </>
    );
  }
);

// export const DefaultColumnFilter = ({
//   column: { getFilterValue, setFilterValue },
// }) => {
//   const [filterValues, setFilterValues] = useState(getFilterValue || "");

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setFilterValues(value);
//     setFilterValue({ value, type: "text" });
//   };

//   return (
//     <>
//       <Row xs="auto" className="pe-1 w-100">
//         <input
//           className="form-control"
//           value={filterValues}
//           onChange={handleInputChange}
//           placeholder="🔎 Search..."
//         />
//       </Row>
//     </>
//   );
// };

export const SelectColumnFilter = ({
  column: { getFilterValue, setFilterValue, preFilteredRows, id },
}) => {
  // Use preFilteredRows to calculate the options
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // UI for Multi-Select box ,
  return (
    <select
      value={getFilterValue()}
      onChange={(e) => {
        setFilterValue(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
export function SliderColumnFilter({
  column: { getFilterValue, setFilterValue, preFilteredRows, id },
}) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows?.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows?.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={getFilterValue() || min}
        onChange={(e) => {
          setFilterValue(parseInt(e.target.value, 10));
        }}
      />
      <button onClick={() => setFilterValue(undefined)}>Off</button>
    </>
  );
}

// export const DefaultColumnFilter = React.memo(

export const NumberRangeColumnFilter = React.memo(
  ({ column: { getFilterValue = [], setFilterValue, id } }) => {
    const [filters, setFilters] = useState(getFilterValue[0]?.value || "");
    const [filters1, setFilters1] = useState(getFilterValue[1]?.value || "");

    const isButtonDisabled = !filters || !filters1;

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        clicking1();
      }
    };
    useEffect(() => {
      const filterValue = getFilterValue() || [];

      if (filterValue.length >= 2) {
        setFilters(filterValue[0]?.value || "");
        setFilters1(filterValue[1]?.value || "");
      }
    }, []);
    const clicking1 = () => {
      setFilterValue((old = []) => [
        { value: filters ? parseInt(filters, 10) : undefined, type: "number" },
        {
          value: filters1 ? parseInt(filters1, 10) : undefined,
          type: "number",
        },
      ]);
    };
    const { t } = useTranslation("common");
    return (
      <Row xs="auto" className=" w-100">
        <div className="d-flex p-0 pe-1">
          <Col>
            <input
              value={filters}
              type="number"
              className="form-control"
              onChange={(e) => {
                const val = e.target.value;
                setFilters(val);
              }}
              placeholder={`${t("Mn")}`} // (${min})
              style={
                {
                  // width: "70px",
                  // marginRight: "0.5rem",
                }
              }
              onKeyPress={handleKeyPress}
            />
          </Col>
          {/* <center> {" to "}</center> */}

          <Col className="ms-1">
            <input
              value={filters1}
              className="form-control"
              type="number"
              onChange={(e) => {
                const val = e.target.value;
                setFilters1(val);
              }}
              placeholder={`${t("Mx")}`} //(${max})
              style={
                {
                  // width: "70px",
                  // marginLeft: "0.5rem",
                }
              }
              onKeyPress={handleKeyPress}
            />
          </Col>
        </div>
      </Row>
    );
  }
);
// export  DateRangeColumnFilter;

export const MultiSelectColumnFilter = React.memo(
  ({ column: { getFilterValue, setFilterValue } }) => {
    useEffect(() => {
      const filterValue = getFilterValue() || {};
      const { value } = filterValue;

      setFilterValues(value || "");
    }, []);
    const { t } = useTranslation("common");
    const [filterValues, setFilterValues] = useState(
      getFilterValue?.value || ""
    );

    const clicking = () => {
      setFilterValue({ value: filterValues, type: "array" });
      // setFilterValue(filterValues);
    };
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        clicking();
      }
    };

    return (
      <>
        <Row xs="auto" className="pe-1 w-100">
          {/* <Col xs="auto"> */}
          <input
            className="form-control "
            value={filterValues}
            onChange={(e) => {
              setFilterValues(e.target.value);
            }}
            placeholder={` ${t("Search")}...`}
            onKeyDown={handleKeyPress}
          />
        </Row>
      </>
    );
  }
);
