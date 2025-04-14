import React from "react";
import { getCommonPinningStyles } from "./StickyColumn";

const ReportFilter = (props) => {
  const { reportMeta, headerGroup, flexRender, table } = props;

  return (
    <>
      {reportMeta?.reportInfo?.enable_column_filters && (
        <tr>
          {headerGroup.headers.map((header) => {
            const shouldApplyHeight =
              header.sticky &&
              header.id === "action" &&
              header.filterable !== true;
            const { column } = header;

            let stickyClass = header.column.columnDef.sticky;

            return (
              <th
                key={header.id}
                className={`${stickyClass ? `sticky-column-data` : ""}
                ${shouldApplyHeight ? `cell-HeightActionCol` : ""}
                `}
                style={{
                  ...getCommonPinningStyles(column),
                }}
              >
                <div
                  className={`d-flex justify-content-${
                    header.column.columnDef.align === 1
                      ? "start"
                      : header.column.columnDef.align === 2
                      ? "end"
                      : "center"
                  }`}
                >
                  {/* {column.filterable ? column.render("Filter") : null} */}
                  {header.column.columnDef.filterable
                    ? flexRender(
                        header.column.columnDef.Filter,
                        header.getContext()
                      )
                    : null}
                </div>
              </th>
            );
          })}
        </tr>
      )}
    </>
  );
};

// export default ReportFilter;
export default React.memo(ReportFilter);
