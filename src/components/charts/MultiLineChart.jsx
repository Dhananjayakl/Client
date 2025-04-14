import React, { useEffect, useRef, useState } from "react";
import axios from "src/utils/AxiosInstance";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  TimeScale,
  plugins,
} from "chart.js";
import { Chart, getElementAtEvent, Bar, Bubble, Line } from "react-chartjs-2";
import usePalette from "src/hooks/usePalette";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import DarkChart from "../../assets/img/avatars/bar-chart.png";
import useTheme from ".../../../../hooks/useTheme";
import Whitechart from "../../assets/img/avatars/bar-chart.png";
import ReportRuntime from "src/components/reports/Report";
import RangeFilters from "src/components/reports/FilterProfile";
import { Card, Modal, Button, Dropdown, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getFiscalYear,
  getNormalYear,
} from "src/components/forms/reactformutils/elements/formutilfunctions";
import {
  faExpand,
  faFilter,
  faSquare,
  faArrowLeft,
  faArrowRight,
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faBarChart,
  faBarsProgress,
  faLineChart,
  faCompress,
} from "@fortawesome/free-solid-svg-icons";
import { CloudSnowFill } from "react-bootstrap-icons";
import { object } from "yup";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
ChartJS.register(
  TimeScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  MatrixController,
  MatrixElement
);

const colorArray = [
  "#afd2c2",
  "#b8d4fd",
  "#ffd294",
  "#FFEA00",
  "#0096FF",
  "#FFAC1C",
  "#FF4433",
  "#097969",
  "#FA5F55",
  "#E1C16E",
  "#7393B3",
  "#CD7F32",
  "#FA8072",
  "#E4D00A",
  "#FF7518",
  "#FFBF00",
  "#ff595e",
  "#E34234",
  "#E49B0F",
];
let index = "x";
let CardStyle = {
  boxShadow: "",
};
let currentFiscalYear = getFiscalYear()
  .split("-")
  ?.map((items) => parseInt(items));
let currentYear = getNormalYear();
export const chartSData = async (
  report,
  orderExpression,
  filterExpression,
  defaultFilterExpression,
  selectedOption,
  trend_type
) => {
  const API_BASE_URL = "/chart";
  let runtimeFilter = `?trendType=${trend_type}&trendYear=${
    selectedOption ? selectedOption : ""
  }`;
  const response = await axios.post(
    API_BASE_URL + "/" + report + runtimeFilter,
    {
      orderExpression,
      filterExpression,
      defaultFilterExpression,
    }
  );
  return response.data;
};
const MultilineChart = (props) => {
  console.log(props, "prop multiline");
  const { t } = useTranslation("common");
  const { theme, setTheme } = useTheme(); //theme is used either dark or light
  // console.log(props.ChartData, "props data");
  let chartRef = useRef(null);
  const [fullscreen, setfullScreen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { fiscal_year_starts } = useSelector(
    (state) => state.systemConfig.systemConfig
  );
  let [chartData, setChartData] = useState(props.ChartData);

  console.log(chartData, "chart--data--is--here");

  let [chartType, setChartType] = useState(false);
  let [selectedValue, setSelectedValue] = useState("");
  let [selectedOption, setSelectedOption] = useState();
  let [finalData, setFinalData] = useState();
  let [xlabel, setXlabel] = useState();
  let [valueLabel, setValueLabel] = useState([]);
  let [drilldownReports, setDrillDownReports] = useState();
  let individualDataset = [];
  let chartMeta = props.ChartMeta;
  // let chartData = props.ChartData;
  let chart = props.chart;
  let default_filter = props.default_filter;
  let [finalExpression, setFinalExpression] = useState(props.finalExpression);
  let years = [];

  console.log(chartMeta.chartInfo.trend_type, "trend type");
  chartMeta.chartInfo.trend_type;
  let transparent = {
    background: "transparent",
    border: "none",
    boxShadow: "none",
  };
  useEffect(() => {
    if (props.ChartData) {
      setChartData(props.ChartData);
    }
  }, [props.ChartData]);
  console.log(chartData, "chart--data--1");

  useEffect(() => {
    if (props.yearProp) {
      setSelectedOption(props.yearProp);
    }
  }, [props.yearProp]);

  if (chartMeta && chartData.length > 0) {
    if (chartMeta?.chartInfo?.no_of_years) {
      for (let i = 0; i <= chartMeta.chartInfo.no_of_years; i++) {
        years.push(currentYear - i);
      }
    } else {
      years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    }

    console.log(selectedOption, "Selected-option");

    // useEffect(() => {
    //   if (selectedOption || finalExpression || selectedValue) {
    //     console.log(selectedOption, "called the multi chart1");
    //     chartSData(
    //       chartMeta?.chartInfo.chart_name,
    //       "",
    //       finalExpression,
    //       props.default_filter,
    //       selectedOption ? selectedOption : "",
    //       chartMeta?.chartInfo.trend_type
    //     ).then((value) => {
    //       let finalData = value;
    //       console.log(finalData, "multi-data-1");
    //       finalData.forEach((obj) => {
    //         Object.entries(obj).forEach(([key, value]) => {
    //           if (value === null) {
    //             obj[key] = "--";
    //           }
    //         });
    //       });
    //       console.log(finalData, "fs1");
    //       let test = [
    //         {
    //           year: 2025,
    //           monval: 1,
    //           month: "January",
    //           d_threshold: "Low",
    //           aggregatednumber: 15,
    //         },
    //       ];
    //       setChartData(finalData);
    //       // setChartData(value);
    //     });
    //   }
    // }, [finalExpression, default_filter, chart, selectedOption, selectedValue]);
    let data;
    console.log(chartData, "initial data");
    console.log(finalExpression, "multi final expression");
    let months = [
      { key: 1, value: "January" },
      { key: 2, value: "February" },
      { key: 3, value: "March" },
      { key: 4, value: "April" },
      { key: 5, value: "May" },
      { key: 6, value: "June" },
      { key: 7, value: "July" },
      { key: 8, value: "August" },
      { key: 9, value: "September" },
      { key: 10, value: "October" },
      { key: 11, value: "November" },
      { key: 12, value: "December" },
    ];
    let Quater = ["Q1", "Q2", "Q3", "Q4"];
    let QuarterObj = [
      { key: 1, value: "Q1" },
      { key: 2, value: "Q2" },
      { key: 3, value: "Q3" },
      { key: 4, value: "Q4" },
    ];

    let datasets;
    let formattedResult;
    let backgroundColor = new Map();
    let backgroundColorArray = [];
    chartMeta?.columns?.forEach((items, index) => {
      backgroundColorArray.push(items.background_color);
    });
    console.log(backgroundColorArray, "array color");

    chartMeta?.columns?.forEach((items, index) => {
      backgroundColor.set(items.dataset_value, items.background_color);
    });

    console.log(backgroundColor.get("High"), "bgmi");

    const uniqueLeaveTypes = [
      ...new Set(chartData.map((item) => item[chartMeta?.chartInfo?.y_column])),
    ];

    let filledData;
    if (chartMeta.chartInfo.y_column) {
      console.log("inisde the y column");
      filledData = chartData.reduce((acc, item) => {
        console.log(acc, "accumulator");
        const key =
          chartMeta.chartInfo.trend_type == 3
            ? item.monval
            : chartMeta.chartInfo.trend_type == 2
            ? item.quarter
            : chartMeta.chartInfo.trend_type
            ? item.year
            : "";

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(item);

        return acc;
      }, {});
      console.log(filledData, "filled data--123");

      useEffect(() => {
        console.log("called condition 3");
        if (chartMeta.chartInfo.trend_type == 3 && chartData.length > 0) {
          for (let key in filledData) {
            const monthData = filledData[key].map(
              (item) => item[chartMeta.chartInfo.y_column]
            );
            uniqueLeaveTypes.forEach((type) => {
              if (!monthData.includes(type)) {
                filledData[key].push({
                  year: filledData[key][0].year, // Use the year from the existing data
                  monval: filledData[key][0].monval, // Use the month value from the existing data
                  month: filledData[key][0].month.trim(), // Trim month for consistency
                  [chartMeta.chartInfo.y_column]: type,
                  aggregatednumber: 0, // Add with count 0
                });
              }
            });
          }

          let result = Object.values(filledData).flat();
          months.forEach((items) => {
            let isMonvalFound = false;

            // Check if the monval exists in result
            result.forEach((res) => {
              if (res.monval == items.key) {
                isMonvalFound = true;
              }
            });

            // If monval is not found, add a new entry for each leave type
            if (!isMonvalFound) {
              console.log(items, "not equal");
              uniqueLeaveTypes.forEach((type) => {
                result.push({
                  year:
                    fiscal_year_starts == 4
                      ? items.key >= 4 && items.key <= 12
                        ? currentFiscalYear[0]
                        : currentFiscalYear[1]
                      : currentFiscalYear[0],
                  monval: items.key,
                  month: items.value.trim(),
                  [chartMeta.chartInfo.y_column]: type,
                  aggregatednumber: 0, // Add with count 0
                });
              });
            }
          });
          console.log(result, "responder");
          result = result.sort((a, b) => a.monval - b.monval);
          console.log(chartMeta, "monthly meta");

          function customSort(array, key, priorityValue) {
            return array.sort((a, b) => {
              if (a[key] >= priorityValue && b[key] < priorityValue) return -1; // Prioritize values >= 4
              if (a[key] < priorityValue && b[key] >= priorityValue) return 1;
              return a[key] - b[key]; // Sort normally within the groups
            });
          }
          console.log(chartMeta.systemConfig, "trend system");

          if (chartMeta.systemConfig?.fiscal_year_starts == 4) {
            console.log("fiscal calculation");

            result = customSort(result, "monval", 4);
          }
          const structuredData = result.reduce((acc, item) => {
            const month = item.month.trim(); // Remove any extra spaces
            if (!acc[month]) {
              acc[month] = {};
            }
            acc[month][item[chartMeta.chartInfo.y_column]] =
              item.aggregatednumber;
            return acc;
          }, {});

          // Transform the result into the desired format
          formattedResult = Object.entries(structuredData).map(
            ([month, value]) => ({
              month,
              [chartMeta.chartInfo.y_column]: value,
            })
          );
          setFinalData(formattedResult);
          console.log(formattedResult, "structured data");

          setValueLabel(
            Object.keys(formattedResult[0][chartMeta.chartInfo.y_column])
          );
          setXlabel(
            formattedResult.map((items) => {
              return items.month;
            })
          );
          console.log(xlabel, formattedResult, "xlabel");

          // Create datasets for each leave type
        }
      }, [selectedOption, chartData]);
      console.log(finalData, "final data after render");
      useEffect(() => {
        if (chartMeta.chartInfo.trend_type == 1 && chartData.length > 0) {
          let strYear = new Date().getFullYear();
          const currentYear = parseInt(strYear); // Convert the string to a number
          for (let key in filledData) {
            const yearData = filledData[key].map(
              (item) => item[chartMeta.chartInfo.y_column]
            );
            console.log(yearData, "year data");

            uniqueLeaveTypes.forEach((type) => {
              if (!yearData.includes(type)) {
                filledData[key].push({
                  year: filledData[key][0].year,
                  [chartMeta.chartInfo.y_column]: type,
                  aggregatednumber: 0, // Add with count 0
                });
              }
            });
          }
          let result = Object.values(filledData).flat();
          console.log(result, "res data");
          years.forEach((items) => {
            let isYearFound = false;

            // Check if the monval exists in result
            result.forEach((res) => {
              if (res.year == items) {
                isYearFound = true;
              }
            });
            console.log(isYearFound, "is year found");

            // If monval is not found, add a new entry for each leave type
            if (!isYearFound) {
              console.log(items, "not equal");
              uniqueLeaveTypes.forEach((type) => {
                result.push({
                  year: items,
                  [chartMeta.chartInfo.y_column]: type,
                  aggregatednumber: 0, // Add with count 0
                });
              });
            }
          });

          result = result.sort((a, b) => a.year - b.year);
          const structuredData = result.reduce((acc, item) => {
            const year = item.year; // Remove any extra spaces
            if (!acc[year]) {
              acc[year] = {};
            }
            acc[year][item[chartMeta.chartInfo.y_column]] =
              item.aggregatednumber;
            return acc;
          }, {});

          // Transform the result into the desired format
          formattedResult = Object.entries(structuredData).map(
            ([year, value]) => ({
              year,
              [chartMeta.chartInfo.y_column]: value,
            })
          );
          setFinalData(formattedResult);
          setValueLabel(
            Object.keys(formattedResult[0][chartMeta.chartInfo.y_column])
          );
          setXlabel(
            formattedResult.map((items) => {
              return items.year;
            })
          );
        }
      }, [selectedOption, chartData]);
      useEffect(() => {
        if (chartMeta.chartInfo.trend_type == 2 && chartData.length > 0) {
          console.log(filledData, "quarter data");

          for (let key in filledData) {
            const QuarterData = filledData[key].map(
              (item) => item[chartMeta.chartInfo.y_column]
            );

            uniqueLeaveTypes.forEach((type) => {
              if (!QuarterData.includes(type)) {
                filledData[key].push({
                  year: filledData[key][0].year,
                  quarter: filledData[key][0].quarter,
                  [chartMeta.chartInfo.y_column]: type,
                  aggregatednumber: 0, // Add with count 0
                });
              }
            });
          }
          let result = Object.values(filledData).flat();
          Quater.forEach((items) => {
            let isQuarterFound = false;

            // Check if the monval exists in result
            result.forEach((res) => {
              if (res.quarter == items) {
                isQuarterFound = true;
              }
            });

            // If monval is not found, add a new entry for each leave type
            if (!isQuarterFound) {
              console.log(items, "not equal");
              uniqueLeaveTypes.forEach((type) => {
                result.push({
                  year: result[0].year,
                  quarter: items,
                  [chartMeta.chartInfo.y_column]: type,
                  aggregatednumber: 0, // Add with count 0
                });
              });
            }
          });
          console.log(result, "filled quarter");
          const quarterOrder = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };
          result = result.sort(
            (a, b) => quarterOrder[a.quarter] - quarterOrder[b.quarter]
          );
          const structuredData = result.reduce((acc, item) => {
            const quarter = item.quarter;
            if (!acc[quarter]) {
              acc[quarter] = {};
            }
            acc[quarter][item[chartMeta.chartInfo.y_column]] =
              item.aggregatednumber;
            return acc;
          }, {});
          formattedResult = Object.entries(structuredData).map(
            ([quarter, value]) => ({
              quarter,
              [chartMeta.chartInfo.y_column]: value,
            })
          );
          setFinalData(formattedResult);
          setValueLabel(
            Object.keys(formattedResult[0][chartMeta.chartInfo.y_column])
          );
          setXlabel(
            formattedResult.map((items) => {
              return items.quarter;
            })
          );
        }
      }, [selectedOption, chartData]);

      if (
        chartMeta.chartInfo.y_column &&
        chartMeta.chartInfo.enable_individual_dataset_view
      ) {
        console.log(
          finalData,
          chartMeta.chartInfo.y_column,
          "final data is here"
        );

        datasets = valueLabel?.map((items, index) => ({
          label: items != "undefined" ? items : [chartMeta.chartInfo.y_title],
          data: finalData?.map((item) => {
            return item[chartMeta.chartInfo.y_column][items];
          }),
          backgroundColor: backgroundColor?.get(items)
            ? backgroundColor?.get(items)
            : colorArray[index],

          // borderDash:[2],
          fill: true,
          borderColor: colorArray[index],
          borderWidth: 5,
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
        }));
        console.log(datasets, "datasets are here");

        individualDataset = valueLabel?.map((items, index) => {
          return {
            labels: xlabel,
            datasets: [
              {
                label:
                  items != "undefined" ? items : [chartMeta.chartInfo.y_title],
                data: finalData?.map((item) => {
                  return item[chartMeta.chartInfo.y_column][items];
                }),
                pointBackgroundColor: colorArray[index],
                pointRadius: 2.5,
                backgroundColor: "#242529",
                borderColor: "#28282B",
                borderWidth: 2,
                tension: 0.2,
                barPercentage: 0.5,
                barThickness: 6,
                maxBarThickness: 8,
                minBarLength: 2,
              },
            ],
          };
        });

        data = {
          labels: xlabel,
          datasets: datasets,
        };
      }
      if (
        !chartMeta.chartInfo.enable_individual_dataset_view &&
        chartMeta.chartInfo.y_column
      ) {
        console.log("fs97");

        datasets = valueLabel?.map((items, index) => ({
          label: items != "undefined" ? items : [chartMeta.chartInfo.y_title],
          data: finalData?.map(
            (item) => item[chartMeta.chartInfo.y_column][items]
          ),
          backgroundColor: backgroundColorArray?.[index]
            ? backgroundColorArray?.[index]
            : colorArray[index],
          stepSize: 10,
          // borderDash:[2],
          // fill:true,
          // borderColor: backgroundColorArray?.[index]
          //   ? backgroundColorArray?.[index]
          //   : colorArray[index],
          // borderWidth: 3,
          // tension: 0.1,
          // barPercentage: 0.2,
          // minBarLength: 1,
          // categoryPercentage: 0.1,
          // barThickness: 10,
          // maxBarThickness: 10,
        }));

        data = {
          labels: xlabel,
          datasets: datasets,
        };
      }
    }

    if (!chartMeta.chartInfo.y_column) {
      filledData = chartData;
      console.log("inside without y column", chartData, filledData);
      console.log(filledData);

      if (chartMeta.chartInfo.trend_type == 3 && chartData.length > 0) {
        const existingKeys = chartData.map((items) => items.monval);
        console.log(existingKeys, "existing keys ");

        months.forEach((items) => {
          if (!existingKeys.includes(items.key)) {
            filledData.push({
              year:
                fiscal_year_starts == 4
                  ? items.key >= 4 && items.key <= 12
                    ? currentFiscalYear[0]
                    : currentFiscalYear[1]
                  : currentFiscalYear[0],
              monval: items.key,
              month: items.value,
              aggregatednumber: 0,
            });
          }
        });
        filledData = filledData.sort((a, b) => a.monval - b.monval);
        console.log(filledData, "furious");

        function customSort(array, key, priorityValue) {
          return array.sort((a, b) => {
            if (a[key] >= priorityValue && b[key] < priorityValue) return -1; // Prioritize values >= 4
            if (a[key] < priorityValue && b[key] >= priorityValue) return 1;
            return a[key] - b[key]; // Sort normally within the groups
          });
        }

        if (chartMeta.systemConfig?.fiscal_year_starts == 4) {
          console.log("fiscal calculation");
          filledData = customSort(filledData, "monval", 4);
          console.log(filledData, "filled data123");
        }

        console.log(filledData, "goat");
        let dataValue = filledData.map((items) => items.aggregatednumber);
        console.log(dataValue, "data value");

        let mainLabel = filledData.map((items) => items.month);
        datasets = [
          {
            label: [chartMeta.chartInfo.y_title],
            data: dataValue,
            backgroundColor: backgroundColorArray?.[index]
              ? backgroundColorArray?.[index]
              : colorArray[index],
            // borderDash:[2],
            // fill:true,
            borderColor: backgroundColorArray?.[index]
              ? backgroundColorArray?.[index]
              : colorArray[index],
            borderWidth: 3,
            tension: 0.1,
            barPercentage: 0.8,
            categoryPercentage: 0.5,
            barThickness: 25,
            maxBarThickness: 30,
          },
        ];
        data = {
          labels: mainLabel ? mainLabel : chartMeta.chartInfo.y_title,
          datasets: datasets,
        };
      }
      if (chartMeta.chartInfo.trend_type == 1 && chartData.length > 0) {
        console.log(chartData, "year data");
        filledData = chartData;
        const existingKeys = chartData.map((items) => items.year);
        console.log(existingKeys, "exist key");

        years.forEach((items) => {
          if (!existingKeys.includes(items)) {
            filledData.push({
              year: items,
              aggregatednumber: 0,
            });
          }
        });
        console.log(filledData, "final fill");
        filledData = filledData.sort((a, b) => a.year - b.year);
        let dataValue = filledData.map((items) => items.aggregatednumber);
        console.log(dataValue, "data value years");

        let mainLabel = filledData.map((items) => items.year);
        datasets = [
          {
            label: [chartMeta.chartInfo.y_title],
            data: dataValue,
            backgroundColor: backgroundColorArray?.[index]
              ? backgroundColorArray?.[index]
              : colorArray[index],
            // borderDash:[2],
            // fill:true,
            borderColor: backgroundColorArray?.[index]
              ? backgroundColorArray?.[index]
              : colorArray[index],
            borderWidth: 3,
            tension: 0.1,
            barPercentage: 0.8,
            categoryPercentage: 0.5,
            barThickness: 25,
            maxBarThickness: 30,
          },
        ];
        data = {
          labels: mainLabel,
          datasets: datasets,
        };
      }
      if (chartMeta.chartInfo.trend_type == 2 && chartData.length > 0) {
        console.log(chartData, "quarter data");
        filledData = chartData;
        const existingKeys = chartData.map((items) => items.quarter);
        console.log(existingKeys, "exist key");

        Quater.forEach((items) => {
          if (!existingKeys.includes(items)) {
            filledData.push({
              year:
                fiscal_year_starts == 4
                  ? items.key >= 4 && items.key <= 12
                    ? currentFiscalYear[0]
                    : currentFiscalYear[1]
                  : currentFiscalYear[0],
              quarter: items,
              aggregatednumber: 0,
            });
          }
        });
        const quarterOrder = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };
        filledData = filledData.sort(
          (a, b) => quarterOrder[a.quarter] - quarterOrder[b.quarter]
        );

        let dataValue = filledData.map((items) => items.aggregatednumber);
        console.log(dataValue, "data value years");
        let mainLabel = filledData.map((items) => items.quarter);
        datasets = [
          {
            label: [chartMeta.chartInfo.y_title],
            data: dataValue,
            backgroundColor: colorArray[index],
            // borderDash:[2],
            // fill:true,
            borderColor: colorArray[index],
            borderWidth: 3,
            tension: 0.1,
            barPercentage: 0.8,
            categoryPercentage: 0.5,
            barThickness: 25,
            maxBarThickness: 30,
          },
        ];
        data = {
          labels: mainLabel,
          datasets: datasets,
        };
      }
    }
    const palette = usePalette();

    const Compactoptions = {
      maintainAspectRatio: false,
      // cornerRadius: 15,
      responsive: true,

      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
          align: "start",
          position: "top",
          font: { weight: "bold", size: 14 },
          text: chartMeta.chartInfo.chart_title,
          color: "grey",
        },
        // datasets: {
        //   barThickness: 30,
        // },

        datalabels: {
          display: chartMeta.chartInfo.datalabel_display,
          anchor: chartMeta.chartInfo.datalabel_align
            ? chartMeta.chartInfo.datalabel_align
            : "end",
          align: chartMeta.chartInfo.datalabel_position
            ? chartMeta.chartInfo.datalabel_position
            : "top",

          color: chartMeta.chartInfo.datalabel_color
            ? chartMeta.chartInfo.datalabel_color
            : palette["primary"],

          font: {
            size: chartMeta.chartInfo.datalabel_font_size
              ? chartMeta.chartInfo.datalabel_font_size
              : "14",
          },
        },
      },

      indexAxis: index,
      scales: {
        y: {
          display: false,
          beginAtZero: true,
          type: "logarithmic",
          min: 0.1, // Adjust as needed
          max: 10, // Adjust based on your highest value

          grid: {
            display: chartMeta.chartInfo.y_grid == null ? false : true,
          },
          stacked: chartMeta.chartInfo.y_stack == true ? true : false,
          title: {
            display: chartMeta.chartInfo.y_title,
            text: chartMeta.chartInfo.y_title,
          },
          ticks: {
            stepSize: chartMeta.chartInfo.y_steps
              ? chartMeta.chartInfo.y_steps
              : 0.7,
            precision: 0.3,
          },
        },
        x: {
          display: false,
          grid: {
            display: chartMeta.chartInfo.x_grid == null ? false : true,
            stacked: true,
          },
          stacked: chartMeta.chartInfo.x_stack == true ? true : false,
          title: {
            display: chartMeta.chartInfo.x_title,
            text: chartMeta.chartInfo.x_title,
          },
        },
      },
      //  onClick: (event, elements) => onClick(event, elements),
    };
    console.log(data, "multi data is here");

    const handlekey = (e) => {
      console.log(e, "dropper selector");
      if (e.target.textContent) {
        setSelectedValue(e.target.textContent);
      }
    };
    const handleSelect = (eventKey) => {
      setFinalExpression("");
      setSelectedOption(eventKey);
    };
    const handleClose = () => setShowModal(false);
    console.log(selectedOption, "years");
    const handleleft = () => {
      let incrementalVal = years.map((items, index) => {
        if (items == selectedOption) {
          let valindex = index + 1;
          return years[valindex];
        }
        if (!selectedOption) {
          let valindex = 1;
          return years[1];
        }
      });
      incrementalVal = incrementalVal?.filter((items) => items != undefined);
      if (incrementalVal[0]) {
        setSelectedOption(incrementalVal[0]);
        {
          chartMeta.systemConfig?.fiscal_year_starts == 4
            ? setSelectedValue(
                `FY${incrementalVal[0]}-${(incrementalVal[0] + 1)
                  .toString()
                  .slice(-2)}`
              )
            : setSelectedValue(incrementalVal[0]);
        }
      }
      console.log(incrementalVal, "incremental val");
    };
    const handleRight = () => {
      console.log("handle right");

      let decremental = years.map((items, index) => {
        if (items == selectedOption) {
          let valindex = index - 1;
          return years[valindex];
        }
      });
      decremental = decremental?.filter((items) => items != undefined);
      if (decremental[0]) {
        setSelectedOption(decremental[0]);
        {
          chartMeta.systemConfig?.fiscal_year_starts == 4
            ? setSelectedValue(
                `FY${decremental[0]}-${(decremental[0] + 1)
                  .toString()
                  .slice(-2)}`
              )
            : setSelectedValue(decremental[0]);
        }
      }
    };

    const handleChart = () => {
      setChartType(!chartType);
    };
    const onClick = props.onClick;
    const clickHandle = (event, element) => {
      onClick(event, element);
    };
    const handleClick = (event, element) => {
      console.log(event, "clicked event is here");
      console.log(chartMeta, chartData, "multi-meta-trend");

      console.log("handle clicked here");

      const monthsData = (datapoint) => {
        let monthskey = months.map((item) => {
          if (item.value == data.labels[datapoint]) {
            return item.key;
          }
        });
        monthskey = monthskey.filter((item) => item != undefined);
        return monthskey;
      };

      const quarterData = (datapoint) => {
        let quarterkey = QuarterObj.map((item) => {
          console.log(data.labels[datapoint], "quarter label");

          if (item.value == data.labels[datapoint]) {
            return item.key;
          }
        });
        quarterkey = quarterkey.filter((item) => item != undefined);
        return quarterkey;
      };
      const yearData = (dataPoint) => {
        console.log(
          data.labels[dataPoint],
          dataPoint,
          data,
          "year key is called"
        );

        let yearkey = years.map((items) => {
          if (items == data.labels[dataPoint]) {
            return items;
          }
        });

        yearkey = yearkey.filter((item) => item != undefined);
        console.log(yearkey, "year key");
        return yearkey;
      };

      let finalExpression;
      console.log(
        chartMeta.chartInfo.chart_operations,
        "trend metadata is here"
      );

      if (
        getElementAtEvent(chartRef.current, event).length > 0 &&
        chartMeta.chartInfo.y_column
      ) {
        const datasetIndexNum = getElementAtEvent(chartRef.current, event)[0]
          .datasetIndex;
        console.log(datasetIndexNum, "data set index number");
        const dataPoint = getElementAtEvent(chartRef.current, event)[0].index;
        console.log(dataPoint, "data-point-is-here");

        let monthskey = monthsData(dataPoint);
        let quarterKey = quarterData(dataPoint);
        let yearsKey = yearData(dataPoint);

        if (chartMeta.chartInfo.trend_type == 3) {
          console.log(
            monthskey,
            filledData,
            currentFiscalYear,
            "condition-multi-3"
          );

          if (chartMeta.chartInfo.chart_operations != "sum") {
            finalExpression = `${chartMeta.chartInfo.y_column}='${
              data.datasets[datasetIndexNum].label
            }'and extract(month from ${chartMeta.chartInfo.x_column})=${
              monthskey[0]
            } and extract(year from ${chartMeta.chartInfo.x_column})=${
              selectedOption
                ? selectedOption
                : filledData[dataPoint]?.year
                ? filledData[dataPoint]?.year
                : currentFiscalYear[1]
            }`;
            console.log(finalExpression, "final expression");
          } else {
            finalExpression = `extract(month from ${
              chartMeta.chartInfo.x_column
            })=${monthskey[0]} and extract(year from ${
              chartMeta.chartInfo.x_column
            })=${
              selectedOption
                ? selectedOption
                : filledData[dataPoint]?.year
                ? filledData[dataPoint]?.year
                : currentFiscalYear[1]
            }`;
          }
        }
        if (chartMeta.chartInfo.trend_type == 2) {
          console.log("condition-multi-2");
          if (chartMeta.chartInfo.chart_operations != "sum") {
            finalExpression = `${chartMeta.chartInfo.y_column}='${
              data.datasets[datasetIndexNum].label
            }'and extract(quarter from ${chartMeta.chartInfo.x_column})=${
              quarterKey[0]
            } and extract(year from ${chartMeta.chartInfo.x_column})=${
              selectedOption
                ? selectedOption
                : filledData[dataPoint]?.year
                ? filledData[dataPoint]?.year
                : currentFiscalYear[1]
            }`;
          } else {
            console.log(filledData, dataPoint, "filled-data");

            finalExpression = `extract(quarter from ${
              chartMeta.chartInfo.x_column
            })=${quarterKey[0]} and extract(year from ${
              chartMeta.chartInfo.x_column
            })=${
              selectedOption
                ? selectedOption
                : filledData[dataPoint]?.year
                ? filledData[dataPoint]?.year
                : currentFiscalYear[1]
            }`;
          }
        }
        if (chartMeta.chartInfo.trend_type == 1) {
          console.log("condition-multi-1");
          if (chartMeta.chartInfo.chart_operations != "sum") {
            finalExpression = `${chartMeta.chartInfo.y_column}='${
              data.datasets[datasetIndexNum].label
            }' and extract(year from ${chartMeta.chartInfo.x_column})=${
              selectedOption ? selectedOption : yearsKey[0]
            }`;
          } else {
            finalExpression = `extract(year from ${
              chartMeta.chartInfo.x_column
            })=${selectedOption ? selectedOption : yearsKey[0]}`;
          }
        }
        if (props.default_filter) {
          finalExpression = `${finalExpression} and ${props.default_filter}`;
        }
        console.log(chartMeta.chartInfo.report_filter_expression, "antony das");

        setDrillDownReports(finalExpression);

        if (chartMeta.chartInfo.report_name) {
          setShowModal(true);
        } else {
          setShowModal(false);
        }
      }
      if (
        getElementAtEvent(chartRef.current, event).length > 0 &&
        !chartMeta.chartInfo.y_column
      ) {
        const datasetIndexNum = getElementAtEvent(chartRef.current, event)[0]
          .datasetIndex;
        const dataPoint = getElementAtEvent(chartRef.current, event)[0].index;
        console.log(dataPoint, datasetIndexNum, "goat");

        let monthskey = monthsData(dataPoint);
        let quarterKey = quarterData(dataPoint);
        let yearsKey = yearData(dataPoint);
        console.log(yearsKey, dataPoint, monthskey, "rolex");
        if (chartMeta.chartInfo.trend_type == 2) {
          if (chartMeta.chartInfo.chart_operations != "sum") {
            finalExpression = `extract(quarter from ${
              chartMeta.chartInfo.x_column
            })=${quarterKey[0]} and extract(year from ${
              chartMeta.chartInfo.x_column
            })=${selectedOption ? selectedOption : filledData[dataPoint].year}`;
          } else {
            finalExpression = `extract(year from ${
              chartMeta.chartInfo.x_column
            })=${selectedOption ? selectedOption : filledData[dataPoint].year}`;
          }
        }

        if (chartMeta.chartInfo.trend_type == 3) {
          console.log("expression 3");
          console.log(datasetIndexNum, "jeev");

          if (chartMeta.chartInfo.chart_operations == "sum") {
            finalExpression = `${chartMeta.chartInfo.x_column}='${
              data.datasets[datasetIndexNum].label
            }'and extract(month from ${chartMeta.chartInfo.x_column})=${
              monthskey[0]
            } and extract(year from ${chartMeta.chartInfo.x_column})=${
              selectedOption ? selectedOption : filledData[dataPoint].year
            }`;
          } else {
            finalExpression = `extract(month from ${
              chartMeta.chartInfo.x_column
            })=${monthskey[0]} and extract(year from ${
              chartMeta.chartInfo.x_column
            })=${selectedOption ? selectedOption : filledData[dataPoint].year}`;
          }
        }
        if (chartMeta.chartInfo.trend_type == 1) {
          finalExpression = `extract(year from ${
            chartMeta.chartInfo.x_column
          })=${selectedOption ? selectedOption : yearsKey[0]}`;
        }
        if (props.default_filter) {
          finalExpression = `${finalExpression} and ${props.default_filter}`;
        }
        setDrillDownReports(finalExpression);

        if (chartMeta.chartInfo.report_name) {
          setShowModal(true);
        } else {
          setShowModal(false);
        }
      }
    };
    const handlefullscreen = () => {
      setfullScreen(!fullscreen);
    };
    // console.log(selectedValue,"selected value");
    const options = {
      maintainAspectRatio: false,
      // cornerRadius: 15,
      // responsive: true,

      plugins: {
        legend: {
          display: chartMeta.chartInfo.y_column ? true : false,
        },
        title: {
          display: false,
          align: "start",
          position: "top",
          font: { weight: "bold", size: 14 },
          text: chartMeta.chartInfo.chart_title,
          color: "grey",
        },

        datalabels: {
          display: chartMeta.chartInfo.datalabel_display,
          anchor: chartMeta.chartInfo.datalabel_align
            ? chartMeta.chartInfo.datalabel_align
            : "end",
          align: chartMeta.chartInfo.datalabel_position
            ? chartMeta.chartInfo.datalabel_position
            : "top",

          color: chartMeta.chartInfo.datalabel_color
            ? chartMeta.chartInfo.datalabel_color
            : palette["primary"],

          font: {
            size: chartMeta.chartInfo.datalabel_font_size
              ? chartMeta.chartInfo.datalabel_font_size
              : "14",
          },
        },
      },

      indexAxis: index,
      scales: {
        y: {
          beginAtZero: true,

          grid: {
            display: chartMeta.chartInfo.y_grid == null ? false : true,
          },
          stacked: chartMeta.chartInfo.y_stack == true ? true : false,
          title: {
            display: chartMeta.chartInfo.y_title,
            text: chartMeta.chartInfo.y_title,
          },
          ticks: {
            stepSize: chartMeta.chartInfo.y_steps
              ? chartMeta.chartInfo.y_steps
              : 0,
            precision: 0,
          },
        },
        x: {
          grid: {
            display: chartMeta.chartInfo.x_grid == null ? false : true,
            stacked: true,
          },
          stacked: chartMeta.chartInfo.x_stack == true ? true : false,
          title: {
            display: chartMeta.chartInfo.x_title,
            text: chartMeta.chartInfo.x_title,
          },
        },
      },
      //  onClick: (event, elements) => onClick(event, elements),
    };

    return (
      <>
        {chartMeta.chartInfo.enable_individual_dataset_view && (
          <Row>
            {individualDataset?.map((items, index) => {
              return (
                <Col key={index}>
                  <Card
                    className=""
                    style={{
                      background: backgroundColor?.get(items.datasets[0].label)
                        ? backgroundColor?.get(items.datasets[0].label)
                        : colorArray[index],
                    }}
                  >
                    {" "}
                    {!chartMeta.chartInfo.only_chart && (
                      <Card.Header
                        style={{
                          background: backgroundColor?.get(
                            items.datasets[0].label
                          )
                            ? backgroundColor?.get(items.datasets[0].label)
                            : colorArray[index],
                        }}
                        className="mt-1 pb-0 pt-0"
                      >
                        <Row>
                          <Col className="m-0 p-0 mt-1">
                            <h5>{chartMeta.chartInfo.chart_title}</h5>
                          </Col>
                        </Row>
                      </Card.Header>
                    )}
                    <Card.Body>
                      <div className="align-self-center w-100">
                        <Row>
                          <Col className="m-0 p-0">
                            <h4 style={{ color: "#242529" }}>
                              {valueLabel[index]}
                            </h4>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="m-0 p-0" xs={8}>
                            <h1 style={{ color: "#242529" }}>
                              {chartData &&
                                chartData?.length > 0 &&
                                items.datasets[0].data.reduce(
                                  (sum, counter) => sum + counter,
                                  0
                                )}
                            </h1>
                          </Col>
                          <Col>{/* Optional content here */}</Col>
                        </Row>
                        <Row>
                          <Col>
                            <div
                              className={
                                chartMeta.chartInfo.chart_size
                                  ? `chart chart-${chartMeta.chartInfo.chart_size}`
                                  : "chart chart-lg"
                              }
                            >
                              {chartData.length > 0 ? (
                                <Chart
                                  ref={chartRef}
                                  // type={
                                  //   props.chartType ? props.chartType : "line"
                                  // }
                                  type="bar"
                                  onClick={handleClick}
                                  data={items}
                                  options={Compactoptions}
                                />
                              ) : (
                                <div className="d-flex flex-column align-items-center justify-content-center">
                                  <Row>
                                    <img
                                      src={
                                        theme == "dark" ? Whitechart : DarkChart
                                      }
                                      style={{
                                        minWidth: "200px",
                                        maxWidth: "200px",
                                      }}
                                    />
                                  </Row>
                                  <Row>
                                    <h5>No Chart Data to Display</h5>
                                  </Row>
                                </div>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {!chartMeta.chartInfo.enable_individual_dataset_view && (
          <>
            <Card
              className="flex-fill reportChart-cards"
              style={
                chartMeta.chartInfo.transparent ||
                chartMeta.chartInfo.only_chart
                  ? transparent
                  : CardStyle
              }
            >
              {!chartMeta.chartInfo.only_chart && (
                <Card.Header>
                  <Row className="">
                    <Col className="">
                      <h5>{t(chartMeta.chartInfo.chart_title)}</h5>
                    </Col>
                    {(chartMeta.chartInfo.trend_type == 3 ||
                      chartMeta.chartInfo.trend_type == 2) && (
                      <Col className="d-flex justify-content-end p-0">
                        <Button className="me-3" onClick={handleChart}>
                          <FontAwesomeIcon
                            icon={chartType == false ? faBarChart : faLineChart}
                            className=""
                          />
                        </Button>

                        {/* <>
                        <Button className="me-1" onClick={handleleft}>
                          <FontAwesomeIcon
                            icon={faAngleLeft}
                            className="bg-transparent"
                          />
                        </Button>
                        <Dropdown
                          align="end"
                          onSelect={(eventKey) => handleSelect(eventKey)}
                        >
                          <Dropdown.Toggle className="bg-primary">
                            {selectedValue
                              ? selectedValue
                              : chartMeta.systemConfig?.fiscal_year_starts ==
                                  4 && chartData?.[0]?.["year"]
                              ? `FY${chartData?.[0]?.["year"]}-${(
                                  chartData?.[0]?.["year"] + 1
                                )
                                  .toString()
                                  .slice(-2)}`
                              : chartMeta.systemConfig?.fiscal_year_starts ==
                                  4 && chartData?.[0]?.["year"]
                              ? chartData?.[0]?.["year"]
                              : currentYear}
                          </Dropdown.Toggle>
                          <Dropdown.Menu onClick={handlekey}>
                            {chartMeta.systemConfig?.fiscal_year_starts == 4 &&
                              years?.map((items) => (
                                <Dropdown.Item eventKey={items} value={items}>
                                  FY{items}-{(items + 1).toString().slice(-2)}
                                </Dropdown.Item>
                              ))}
                            {chartMeta.systemConfig?.fiscal_year_starts != 4 &&
                              years?.map((items) => (
                                <Dropdown.Item eventKey={items} value={items}>
                                  {items}
                                </Dropdown.Item>
                              ))}
                          </Dropdown.Menu>
                        </Dropdown>
                        <Button className="ms-1" onClick={handleRight}>
                          {" "}
                          <FontAwesomeIcon icon={faAngleRight} className="" />
                        </Button>
                      </> */}

                        {chartMeta?.filters?.find(
                          (items) => items.filter_profile_status === true
                        ) && (
                          <div className="ms-2">
                            <RangeFilters
                              props={props}
                              reportmeta={chartMeta}
                              setFinalExpression={setFinalExpression}
                              setSelectedOption={setSelectedOption}
                              report={chart}
                            />
                          </div>
                        )}
                      </Col>
                    )}
                  </Row>
                </Card.Header>
              )}
              <Card.Body className="d-flex">
                <div className="align-self-center w-100">
                  <div
                    className={
                      chartMeta.chartInfo.chart_size
                        ? `chart chart-${chartMeta.chartInfo.chart_size}`
                        : "chart chart-lg"
                    }
                  >
                    <Chart
                      ref={chartRef}
                      // type={
                      //   props.chartType ? props.chartType : "line"
                      // }
                      type="bar"
                      onClick={handleClick}
                      data={data}
                      options={options}
                    />
                  </div>
                </div>
                <Col></Col>
              </Card.Body>
            </Card>
            <Modal
              show={showModal}
              fullscreen={fullscreen}
              onHide={handleClose}
              size="lg"
              className="modalviewport"
            >
              <Modal.Header className="d-flex justify-content-between align-items-center">
                {/* <Modal.Title>Modal Title</Modal.Title> */}
                <Button
                  variant="link"
                  onClick={handlefullscreen}
                  className="p-0 border-0 "
                >
                  <FontAwesomeIcon
                    icon={fullscreen ? faCompress : faExpand}
                    className="text-dark"
                  />
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Header>
              <Modal.Body size="lg">
                <ReportRuntime
                  report={chartMeta && chartMeta.chartInfo.report_name}
                  ChartdrilldownReports={drilldownReports}
                />
              </Modal.Body>
              {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer> */}
            </Modal>
          </>
        )}

        <Modal
          show={showModal}
          fullscreen={fullscreen}
          onHide={handleClose}
          size="lg"
          className="modalviewport"
        >
          <Modal.Header className="d-flex justify-content-between align-items-center">
            {/* <Modal.Title>Modal Title</Modal.Title> */}
            <Button
              variant="link"
              onClick={handlefullscreen}
              className="p-0 border-0 "
            >
              <FontAwesomeIcon
                icon={fullscreen ? faCompress : faExpand}
                className="text-dark"
              />
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Header>
          <Modal.Body size="lg">
            <ReportRuntime
              report={chartMeta && chartMeta.chartInfo.report_name}
              ChartdrilldownReports={drilldownReports}
            />
          </Modal.Body>
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer> */}
        </Modal>
      </>
    );
  } else {
    return (
      <Card className="flex-fill reportChart-cards">
        <Card.Body className="d-flex">
          <div className="align-self-center w-100">
            <div className="d-flex flex-column align-items-center justify-content-center">
              <Row>
                <img
                  src={theme == "dark" ? Whitechart : DarkChart}
                  style={{ minWidth: "200px", maxWidth: "200px" }}
                ></img>
              </Row>
              <Row>
                <h5>No Chart Data to Displayss</h5>
              </Row>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }
};
export default MultilineChart;
