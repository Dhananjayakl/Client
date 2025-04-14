import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  faIndianRupee,
  faDollarSign,
  faShekelSign,
} from "@fortawesome/free-solid-svg-icons";

const ColumnReports = ({ data, reportMeta, totalsum }) => {
  let columnMeta = reportMeta?.columns;
  let dataValue = data?.data;
  const navigate = useNavigate();
  const { d_system_currency } = useSelector(
    (state) => state.systemConfig.systemConfig
  );

  const ShimmerCard = ({ colSize }) => (
    <Col xl={colSize} lg={colSize} md={colSize} sm={12} className="d-flex">
      <Card className="flex-fill reportChart-cards">
        <Card.Header className="p-2">
          <div className="shimmer shimmer-card-header"></div>
        </Card.Header>
        <Card.Body className="p-2">
          <div className="shimmer shimmer-card-body"></div>
        </Card.Body>
      </Card>
    </Col>
  );

  if (!data) {
    const shimmerCount = 1;
    const colSize = 12;

    return (
      <Row className="">
        {Array.from({ length: shimmerCount }).map((_, index) => (
          <ShimmerCard key={index} colSize={colSize} />
        ))}
      </Row>
    );
  }

  const getCurrencyFormat = (currency, value) => {
    let currencyFormat = {
      icon: <FontAwesomeIcon icon={faIndianRupee} />,
      formattedValue: value,
    };

    // Number formatting based on currency system
    switch (currency) {
      case "₹ - Rupees":
        currencyFormat.icon = <FontAwesomeIcon icon={faIndianRupee} />;
        currencyFormat.formattedValue = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(value);
        break;
      case "$ - Dollar":
        currencyFormat.icon = <FontAwesomeIcon icon={faDollarSign} />;
        currencyFormat.formattedValue = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
        break;
      case "AED - United Arab Emirates dirham":
        currencyFormat.icon = <FontAwesomeIcon icon={faShekelSign} />;
        currencyFormat.formattedValue = new Intl.NumberFormat("ar-AE", {
          style: "currency",
          currency: "AED",
        }).format(value);
        break;
      default:
        currencyFormat.icon = <FontAwesomeIcon icon={faIndianRupee} />;
        currencyFormat.formattedValue = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(value);
        break;
    }

    return currencyFormat;
  };

  return (
    <>
      <Card className="reportChart-cards">
        <h4 className="d-flex justify-content-center m-0 mt-1 mb-1">
          {reportMeta?.reportInfo?.report_title}
        </h4>

        <Table responsive bordered hover>
          <thead className="p-1">
            <tr>
              {Array.isArray(columnMeta) &&
                columnMeta
                  ?.filter((value) => value.visible)
                  .map((item) => (
                    <th className="p-1 ps-3" key={item.column_title}>
                      {item.column_title}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(dataValue) &&
              dataValue.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom:
                      index === dataValue.length - 1 ? "none" : undefined,
                  }}
                >
                  {Array.isArray(columnMeta) &&
                    columnMeta
                      ?.filter((meta) => meta.visible)
                      .map((meta, colIndex) => (
                        <td
                          className={`p-1 ps-3 ${
                            typeof item[meta.column_name] === "string"
                              ? "text-decoration-underline cursor-pointer"
                              : ""
                          }`}
                          key={colIndex}
                          style={{ color: "#495057" }}
                          onClick={() => {
                            if (typeof item[meta.column_name] === "string") {
                              navigate(
                                `/form/runtime?formService=${meta.form}&objectId=${item.object_id}`
                              );
                            }
                          }}
                        >
                          {/* Display formatted value */}
                          {typeof item[meta.column_name] === "number"
                            ? getCurrencyFormat(
                                d_system_currency,
                                item[meta.column_name]
                              ).formattedValue
                            : item[meta.column_name]}
                        </td>
                      ))}
                </tr>
              ))}

            {(() => {
              const columnTotals = {};
              if (Array.isArray(dataValue)) {
                columnMeta?.forEach((meta) => {
                  if (meta.visible && meta.column_type === 4) {
                    columnTotals[meta.column_name] = null;
                  }
                });

                // Calculate totals for each column
                dataValue.forEach((item) => {
                  columnMeta?.forEach((meta) => {
                    if (
                      meta.visible &&
                      meta.column_type === 4 &&
                      typeof item[meta.column_name] === "number"
                    ) {
                      columnTotals[meta.column_name] += item[meta.column_name];
                    }
                  });
                });
              }

              if (totalsum) {
                return (
                  <tr style={{ borderBottom: "none" }}>
                    <th className="p-1 ps-3">Total</th>
                    {columnMeta?.map((meta) =>
                      meta.visible &&
                      meta.column_type === 4 &&
                      columnTotals[meta.column_name] != null ? (
                        <th key={meta.column_name} className="p-1 ps-3">
                          {/* Display formatted total value */}

                          {typeof columnTotals[meta.column_name] === "number"
                            ? getCurrencyFormat(
                                d_system_currency,
                                columnTotals[meta.column_name]
                              ).formattedValue
                            : columnTotals[meta.column_name]}
                        </th>
                      ) : null
                    )}
                  </tr>
                );
              }

              return null;
            })()}
          </tbody>
        </Table>
      </Card>
    </>
  );
};

export default React.memo(ColumnReports);
