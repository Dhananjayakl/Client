//rahul changes
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  ButtonToolbar,
  ButtonGroup,
  Dropdown,
  Form,
  Card,
  Breadcrumb,
  Table,
} from "react-bootstrap";
import { getObjects, getTableDetails, getviewData } from "../GrcService";
import { PageBreadCrumb, PageBreadCrumbItem } from "./PageUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportRuntime from "src/components/reports/Report";
import Tree from "src/components/pages/Tree";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import GL_PROCESS_INFO_BY_ID from "src/modules/grc/reports/GL_PROCESS_INFO_BY_ID";

import {
  faFilePdf,
  faArrowsSpin,
  faTriangleExclamation,
  faCheckToSlot,
  faComments,
  faBriefcase,
  faPlusCircle,
  faBookBookmark,
  faTimes,
  faBuilding,
  faArrowCircleRight,
  faChevronRight,
  faEllipsis,
  faAngleDoubleRight,
  faPencil,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import DynamicModalPopup from "src/components/pages/DynamicModalPopup";
import Buttons from "src/components/pages/Buttons";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";
import { getServiceData } from "../GrcService";
import OptionsCard from "src/components/pages/OptionsCard";
import { useTranslation } from "react-i18next";

const Default = ({ selectedFramework }) => {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  console.log(objectId, "objjjjjjj");

  const [kriTrend, setKriTrend] = useState({});
  const [krilibrarydata, setKrilibrarydata] = useState(null);
  const [businessUnitData, setBusinessUnitData] = useState([]);

  const [kriDetails, setKRIDetails] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const [isBlurred, setIsBlurred] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState("Year");
  const [kridata, setkridata] = useState(null);
  const fetchAllKriData = () => {
    getviewData({
      viewName: "pa_gl_kri_library_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `object_id=${objectId}`,
    })
      .then((response) => {
        setkridata(response.data.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleIconClick = (popupType) => {
    setActivePopup(popupType);
    setIsBlurred(true);
  };

  const closePopup = () => {
    setActivePopup(null);
    setIsBlurred(false);
  };

  // Fetch KRI details data
  const fetchAuditData = () => {
    getviewData({
      viewName: "pa_gl_kri_library_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `object_id=${objectId}`,
    })
      .then((response) => {
        setKRIDetails(response.data.data?.[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const fetchKriData = async () => {
    try {
      const previousYear1 = selectedYear - 1;
      const previousYear2 = selectedYear - 2;

      let filterExpression = `source_kri=${objectId} AND year IN (${selectedYear}, ${previousYear1}, ${previousYear2})`;
      const response = await getviewData({
        viewName: "pa_gl_kri_task_summary_v",
        pageNumber: 0,
        pageSize: 0,
        sortField: "",
        sortOrder: "",
        orderExpression: "",
        filterExpression: filterExpression,
      });

      const kriData = response.data.data;
      console.log(kriData, "kkkkkkk");
      const filteredData = kriData.filter(
        (item) =>
          item.year === selectedYear ||
          item.year === previousYear1 ||
          item.year === previousYear2
      );
      console.log(filteredData, "fffffffff");
      const acc = {
        [selectedYear]: Array.from({ length: 12 }, () => ({
          kri_value: "-",
          threshold: "-",
          low: "-",
          medium: "-",
          high: "-",
        })),
        [previousYear1]: Array.from({ length: 12 }, () => ({
          kri_value: "-",
          threshold: "-",
          low: "-",
          medium: "-",
          high: "-",
        })),
        [previousYear2]: Array.from({ length: 12 }, () => ({
          kri_value: "-",
          threshold: "-",
          low: "-",
          medium: "-",
          high: "-",
        })),
      };

      filteredData.forEach((item) => {
        const { month, low, medium, high, kri_value, threshold, year } = item;
        if (!acc[year]) {
          acc[year] = Array.from({ length: 12 }, () => ({
            kri_value: "-",
            threshold: "-",
            low: "-",
            medium: "-",
            high: "-",
          }));
        }
        acc[year][month - 1] = {
          kri_value,
          threshold,
          low,
          medium,
          high,
        };
      });

      console.log(acc, "mmmmm");
      setKriTrend(acc);
      console.log(kriTrend, "sssssssss");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchKriData();
  }, [selectedYear, viewMode]);
  console.log("kriTrend", kriTrend);
  console.log("kriDetails", objectId);
  const currentYear = new Date().getFullYear();
  const startYear = 2020;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const getQuarterData = (quarter, kriData) => {
    if (!kriData) return { data: [], low: [], medium: [], high: [] };

    const quarterMonths = {
      1: [0, 1, 2], // Jan, Feb, Mar
      2: [3, 4, 5], // Apr, May, Jun
      3: [6, 7, 8], // Jul, Aug, Sep
      4: [9, 10, 11], // Oct, Nov, Dec
    };

    // Extract data for the specific quarter
    const quarterData = quarterMonths[quarter]
      .map((monthIndex) => kriData[monthIndex])
      .filter(Boolean); // Filters out undefined or null values

    let low = [];
    let medium = [];
    let high = [];

    // Separate the values based on their types
    quarterData.forEach((item) => {
      if (item.low) low.push(item.low);
      if (item.medium) medium.push(item.medium);
      if (item.high) high.push(item.high);
    });

    return { data: quarterData, low, medium, high };
  };

  const getColorForThreshold = (threshold) => {
    switch (threshold) {
      case 1:
        return "red";
      case 2:
        return "yellow";
      case 3:
        return "green";
      default:
        return "transparent";
    }
  };

  const getThresholdForAvgKri = (avgKriValue, low, medium, high) => {
    let value = avgKriValue;
    const lowNumeric = low.filter((val) => val !== "-");
    const mediumNumeric = medium.filter((val) => val !== "-").map(Number);
    const highNumeric = high.filter((val) => val !== "-").map(Number);
    // console.log("vvvaaa", value, lowNumeric,mediumNumeric);
    if (value < lowNumeric[0]) {
      value = lowNumeric[0];
      return 3;
    } else {
      if (value >= lowNumeric[0] && value < mediumNumeric[0]) {
        return 3; // Green
      } else if (value >= mediumNumeric[0] && value < highNumeric[0]) {
        return 2; // Yellow
      } else if (value >= highNumeric[0]) {
        return 1; // Red
      } else {
        return 0;
      }
    }
  };

  // Fetch KRI library data
  const fetchkrilibraryData = () => {
    getviewData({
      viewName: "pa_gl_kri_library_bv",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `object_id=${objectId}`,
    })
      .then((response) => {
        setKrilibrarydata(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchbusinessunitofkri = () => {
    getviewData({
      viewName: "pa_gl_kri_business_unit_v",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `source_kri=${objectId}`,
    })
      .then((response) => {
        setBusinessUnitData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchAuditData();
    fetchkrilibraryData();
    fetchKriData();
    fetchbusinessunitofkri();
    fetchAllKriData();
  }, [objectId]);

  const renderProcessItems = () => {
    if (!krilibrarydata || !Array.isArray(krilibrarydata)) return null;

    return krilibrarydata.map(({ d_process }, index) => {
      const processItems = d_process
        .toString()
        .split(",")
        .map((item, i) => (
          <ul key={`${index}-${i}`}>
            <li>{item.trim()}</li>
          </ul>
        ));

      return <div key={index}>{processItems}</div>;
    });
  };

  const renderRiskItems = () => {
    if (!krilibrarydata || !Array.isArray(krilibrarydata)) return null;

    return krilibrarydata.map(({ d_risk }, index) => {
      const processItems = d_risk
        .toString()
        .split(",")
        .map((item, i) => (
          <ul key={`${index}-${i}`}>
            <li>{item.trim()}</li>
          </ul>
        ));

      return <div key={index}>{processItems}</div>;
    });
  };

  const renderBusinessUnits = () => {
    if (!businessUnitData || !Array.isArray(businessUnitData))
      return <div>--</div>;

    const uniqueBusinessUnits = new Set();

    const businessUnitItems = businessUnitData
      .map(({ business_unit_name }, index) => {
        if (
          !business_unit_name ||
          uniqueBusinessUnits.has(business_unit_name.trim())
        )
          return null;
        uniqueBusinessUnits.add(business_unit_name.trim());
        return (
          <div key={index}>
            <ul>
              <li>{business_unit_name.trim()}</li>
            </ul>
          </div>
        );
      })
      .filter(Boolean);

    return businessUnitItems.length > 0 ? (
      businessUnitItems
    ) : (
      <ul>
        <li>
          <div>--</div>
        </li>
      </ul>
    );
  };

  const { t } = useTranslation("common");
  return (
    <div>
      <Container fluid className="p-3">
        <div className="shadow sticky-top bg-white z-1">
          <PageBreadCrumb>
            <PageBreadCrumbItem title={"KRI Environment"} />
            <PageBreadCrumbItem title={kridata?.name} />
          </PageBreadCrumb>
          <Card className="sticky-top px-2 py-1 mb-3" style={{ zIndex: "2" }}>
            <Row>
              <Col lg={8}>
                <div className="h4 overflow-hidden ">
                  <FontAwesomeIcon icon={faPlusCircle} /> {kridata?.name}
                </div>
              </Col>
              {/* <Col>
                <div className="float-end">
                  <span
                    className={`ms-1 rounded-circle  align-items-center justify-content-center`}
                  >
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      size="lg"
                      className="text-black"
                    />
                    <i className="bi bi-file-earmark-pdf-fill"></i>
                  </span>
                </div>
              </Col> */}
            </Row>
          </Card>
        </div>

        <Row className="gx-5">
          <Col md={5}>
            <Row>
              <ReportRuntime
                report="GL_KRI_BY_ID"
                drilldownReports={{ objectId: objectId }}
              />
            </Row>
          </Col>
          <Col md={7}>
            <Row>
              <Card className="reportChart-cards">
                <Card.Header className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-0 text-left">{t("Trends")}</h5>
                  <ButtonToolbar className="d-flex align-items-center">
                    <Button
                      onClick={() =>
                        setSelectedYear((prevYear) => prevYear - 1)
                      }
                      className="me-1"
                    >
                      {"<"}
                    </Button>

                    <Dropdown
                      onSelect={(year) => setSelectedYear(Number(year))}
                      className="me-2"
                    >
                      <Dropdown.Toggle variant="light" id="dropdown-year">
                        {selectedYear || "Select Year"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {years.map((year) => (
                          <Dropdown.Item key={year} eventKey={year}>
                            {year}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>

                    <Button
                      onClick={() =>
                        setSelectedYear((prevYear) => prevYear + 1)
                      }
                      className="me-1"
                    >
                      {">"}
                    </Button>

                    <Button
                      onClick={() => {
                        setViewMode("Year");
                      }}
                      className="me-1"
                    >
                      {t("Month")}
                    </Button>

                    <Button
                      onClick={() => {
                        setViewMode("Quarter");
                      }}
                      className="me-1"
                    >
                      {t("Quarter")}
                    </Button>

                    <Button
                      onClick={() => {
                        setViewMode("Month");
                      }}
                      className="me-1"
                    >
                      {t("Year")}
                    </Button>
                  </ButtonToolbar>
                </Card.Header>

                <Card.Body className="p-3">
                  <div className="table-responsive">
                    <Table responsive="sm" className="text-center">
                      <thead>
                        <tr>
                          <th>Year</th>
                          {viewMode === "Year" &&
                            [
                              t("Jan"),
                              t("Feb"),
                              t("Mar"),
                              t("Apr"),
                              t("May"),
                              t("Jun"),
                              t("Jul"),
                              t("Aug"),
                              t("Sep"),
                             t("Oct"),
                              t("Nov"),
                              t("Dec"),
                            ].map((month, index) => (
                              <th key={index}>{month}</th>
                            ))}
                          {viewMode === "Quarter" && (
                            <>
                              <th>{t("Quarter 1")}</th>
                              <th>{t("Quarter 2")}</th>
                              <th>{t("Quarter 3")}</th>
                              <th>{t("Quarter 4")}</th>
                            </>
                          )}
                          {viewMode === "Month" && <th>{t("Value")}</th>}
                        </tr>
                      </thead>
                      {/* <tbody>
          {viewMode === "Year" && (
            <>
              {[selectedYear, selectedYear - 1, selectedYear - 2].map((year) => (
                <tr key={year}>
                  <td>{year}</td>
                  {kriTrend[year]
                    ? kriTrend[year].map(({ kri_value ,threshold}, index) => (
                        <td key={index}>{kri_value !== '-' ? kri_value : "-"}</td>
                      ))
                    : Array(12)
                        .fill(null)
                        .map((_, index) => <td key={index}>-</td>)}
                </tr>
              ))}
            </>
          )}

          {viewMode === "Quarter" && (
            <>
              {[selectedYear, selectedYear - 1, selectedYear - 2].map((year) => (
                <tr key={year}>
                  <td>{year}</td>
                  {[1, 2, 3, 4].map((quarter) => {
                    const quarterData = getQuarterData(quarter, kriTrend[year]);
                    const avgKriValue =
                      quarterData.length > 0
                        ? (
                            quarterData.reduce((sum, { kri_value ,low,medium,high}) => sum + (kri_value !== '-' ? kri_value : 0), 0) /
                            quarterData.length
                          ).toFixed(0)
                        : "-";
                    return <td key={quarter}>{avgKriValue === "0" ? "-" : avgKriValue}</td>;
                  })}
                </tr>
              ))}
            </>
          )}
{viewMode === "Month" && (
  <>
    {[selectedYear, selectedYear - 1, selectedYear - 2].map((year) => (
      <tr key={year}>
        <td>{year}</td>
        <td>
          {kriTrend[year]
            ? (() => {
                const total = kriTrend[year]
                  .map(({ kri_value }) => (kri_value !== '-' ? kri_value : 0))
                  .reduce((sum, kri_value) => sum + kri_value, 0);
                const avgKriValue = (total / kriTrend[year].length).toFixed(0);
                return avgKriValue === "0" ? "-" : avgKriValue;
              })()
            : "-"
          }
        </td>
      </tr>
    ))}
  </>
)}
</tbody>
       */}
                      <tbody className="text-center">
                        {viewMode === "Year" && (
                          <>
                            {[
                              selectedYear,
                              selectedYear - 1,
                              selectedYear - 2,
                            ].map((year) => (
                              <tr key={year}>
                                <td>{year}</td>
                                {kriTrend[year]
                                  ? kriTrend[year].map(
                                      (
                                        {
                                          kri_value,
                                          threshold,
                                          low,
                                          medium,
                                          high,
                                        },
                                        index
                                      ) => (
                                        <td
                                          key={index}
                                          className={
                                            kri_value === "-"
                                              ? ""
                                              : threshold === 1
                                              ? "table-light-red"
                                              : threshold === 2
                                              ? "table-light-yellow"
                                              : threshold === 3
                                              ? "table-light-green"
                                              : ""
                                          }
                                          style={
                                            kri_value === "-"
                                              ? {}
                                              : {
                                                  backgroundColor:
                                                    threshold === 1
                                                      ? "#f8d7da"
                                                      : threshold === 2
                                                      ? "#fff3cd"
                                                      : threshold === 3
                                                      ? "#d4edda"
                                                      : {},
                                                }
                                          }
                                        >
                                          {kri_value}
                                        </td>
                                      )
                                    )
                                  : Array(12)
                                      .fill(null)
                                      .map((_, index) => (
                                        <td key={index}>-</td>
                                      ))}
                              </tr>
                            ))}
                          </>
                        )}

                        {viewMode === "Quarter" && (
                          <>
                            {[
                              selectedYear,
                              selectedYear - 1,
                              selectedYear - 2,
                            ].map((year) => (
                              <tr key={year}>
                                <td>{year}</td>
                                {[1, 2, 3, 4].map((quarter) => {
                                  const { data, low, medium, high } =
                                    getQuarterData(quarter, kriTrend[year]);
                                  const avgKriValue =
                                    data?.length > 0
                                      ? (
                                          data.reduce(
                                            (sum, { kri_value }) =>
                                              sum +
                                              (kri_value !== "-"
                                                ? kri_value
                                                : 0),
                                            0
                                          ) / data.length
                                        ).toFixed(0)
                                      : "-";

                                  const threshold =
                                    avgKriValue === "-"
                                      ? ""
                                      : getThresholdForAvgKri(
                                          avgKriValue,
                                          low,
                                          medium,
                                          high
                                        );

                                  return (
                                    <td
                                      key={quarter}
                                      className={
                                        avgKriValue === "-"
                                          ? ""
                                          : threshold === 1
                                          ? "table-light-red"
                                          : threshold === 2
                                          ? "table-light-yellow"
                                          : threshold === 3
                                          ? "table-light-green"
                                          : ""
                                      }
                                      style={
                                        avgKriValue === "-"
                                          ? {}
                                          : {
                                              backgroundColor:
                                                threshold === 1
                                                  ? "#f8d7da"
                                                  : threshold === 2
                                                  ? "#fff3cd"
                                                  : threshold === 3
                                                  ? "#d4edda"
                                                  : {},
                                            }
                                      }
                                    >
                                      {avgKriValue === "0" ? "-" : avgKriValue}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </>
                        )}

                        {viewMode === "Month" && (
                          <>
                            {[
                              selectedYear,
                              selectedYear - 1,
                              selectedYear - 2,
                            ].map((year) => (
                              <tr key={year}>
                                <td>{year}</td>

                                {kriTrend[year] ? (
                                  (() => {
                                    const total = kriTrend[year]
                                      .map(({ kri_value }) =>
                                        kri_value !== "-" ? kri_value : 0
                                      )
                                      .reduce(
                                        (sum, kri_value) => sum + kri_value,
                                        0
                                      );
                                    const avgKriValue = (
                                      total / kriTrend[year].length
                                    ).toFixed(0);
                                    const low = kriTrend[year].map(
                                      ({ low }) => low
                                    );
                                    const medium = kriTrend[year].map(
                                      ({ medium }) => medium
                                    );
                                    const high = kriTrend[year].map(
                                      ({ high }) => high
                                    );

                                    // console.log(medium, "lllllllll");
                                    const threshold =
                                      avgKriValue === "0"
                                        ? ""
                                        : getThresholdForAvgKri(
                                            avgKriValue,
                                            low,
                                            medium,
                                            high
                                          );
                                    console.log("thresh", threshold);
                                    return avgKriValue === "0" ? (
                                      <td>-</td>
                                    ) : (
                                      <td
                                        className={
                                          threshold === 1
                                            ? "table-light-red"
                                            : threshold === 2
                                            ? "table-light-yellow"
                                            : threshold === 3
                                            ? "table-light-green"
                                            : ""
                                        }
                                        style={
                                          avgKriValue === "-"
                                            ? {}
                                            : {
                                                backgroundColor:
                                                  threshold === 1
                                                    ? "#f8d7da"
                                                    : threshold === 2
                                                    ? "#fff3cd"
                                                    : threshold === 3
                                                    ? "#d4edda"
                                                    : {},
                                              }
                                        }
                                      >
                                        {avgKriValue}
                                      </td>
                                    );
                                  })()
                                ) : (
                                  <td>-</td>
                                )}
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Row>
            <Row>
              <Row className="text-center align-items-center d-flex justify-content-center">
                <Col className="d-flex">
                <h4>{t("Relationship")}</h4>
                </Col>
                {/* <Col className="d-flex">
                  <hr className="w-100 ms-n7" />
                </Col> */}
              </Row>

              <Row className="mt-2 d-flex  align-items-stretch">
                <Col md={3} className="d-flex">
                  <Card
                    className="gx-5 flex-grow-1"
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      textAlign: "center",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      flexGrow: 1,
                    }}
                  >
                    <h5>{t("Process")}</h5>
                    <FontAwesomeIcon
                      icon={faArrowsSpin}
                      style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        color: "#007bff",
                      }}
                      onClick={() => handleIconClick("process")}
                    />
                    {activePopup === "process" && (
                      <>
                        <div
                          style={{
                            position: "fixed",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
                            backdropFilter: "blur(5px)", // Blur effect
                            zIndex: 2,
                          }}
                        />
                        <div
                          style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "400px",
                            padding: "40px",
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            zIndex: 2,
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="position-absolute text-primary"
                            style={{
                              top: "15px",
                              right: "15px",
                              cursor: "pointer",
                              fontSize: "20px",
                            }}
                            onClick={closePopup}
                          />
                          <h4
                            style={{
                              textAlign: "center",
                              marginBottom: "20px",
                              color: "#007bff"
                            }}
                          >
                             {t("Related Process")}
                          </h4>
                          <div
                            style={{
                              textAlign: "left",
                              marginTop: "20px",
                              maxHeight: "40vh",
                              overflowY: "auto",
                            }}
                          >
                            {renderProcessItems()}
                          </div>
                        </div>
                      </>
                    )}
                  </Card>
                </Col>

                <Col md={3} className="d-flex">
                  <Card
                    className="gx-5 flex-grow-1"
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      textAlign: "center",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      flexGrow: 1,
                    }}
                  >
                     <h5>{t("Risk(s)")}</h5>
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        color: "#007bff",
                      }}
                      onClick={() => handleIconClick("risk")}
                    />
                    {activePopup === "risk" && (
                      <>
                        <div
                          style={{
                            position: "fixed",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
                            backdropFilter: "blur(5px)", // Blur effect
                            zIndex: 2,
                          }}
                        />
                        <div
                          style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "400px",
                            padding: "40px",
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            zIndex: 2,
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="position-absolute text-primary"
                            style={{
                              top: "15px",
                              right: "15px",
                              cursor: "pointer",
                              fontSize: "20px",
                            }}
                            onClick={closePopup}
                          />
                          <h4
                            style={{
                              textAlign: "center",
                              marginBottom: "20px",
                              color: "#007bff"
                            }}
                          >
                            {t("Related Risk(s)")}"
                          </h4>
                          <div
                            style={{
                              textAlign: "left",
                              maxHeight: "40vh",
                              overflowY: "auto",
                            }}
                          >
                            {renderRiskItems()}
                          </div>
                        </div>
                      </>
                    )}
                  </Card>
                </Col>

                <Col md={4} className="d-flex">
                  <Card
                    className="gx-5 flex-grow-1"
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      textAlign: "center",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      flexGrow: 1,
                    }}
                  >
                     <h5>{t("Business Unit(s)")}</h5>
                    <FontAwesomeIcon
                      icon={faBuilding}
                      style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        color: "#007bff",
                      }}
                      onClick={() => handleIconClick("businessUnits")}
                    />
                    {activePopup === "businessUnits" && (
                      <>
                        <div
                          style={{
                            position: "fixed",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
                            backdropFilter: "blur(5px)", // Blur effect
                            zIndex: 2,
                          }}
                        />
                        <div
                          style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "400px",
                            padding: "40px",
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            zIndex: 2,
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="position-absolute text-primary"
                            style={{
                              top: "15px",
                              right: "15px",
                              cursor: "pointer",
                              fontSize: "20px",
                            }}
                            onClick={closePopup}
                          />
                          <h4
                            style={{
                              textAlign: "center",
                              marginBottom: "20px",
                              color: "#007bff"
                            }}
                          >
                             {t("Related Business Unit(s)")}
                          </h4>
                          <div
                            style={{
                              textAlign: "left",
                              marginTop: "20px",
                              maxHeight: "40vh",
                              overflowY: "auto",
                            }}
                          >
                            {renderBusinessUnits()}
                          </div>
                        </div>
                      </>
                    )}
                  </Card>
                </Col>
              </Row>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className="p-0 m-0">
            <ReportRuntime
              report="GL_KRI_ISSUE_TASK"
              drilldownReports={{ processId: objectId }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Default;
