import React, { useState, useEffect, useCallback } from "react";
import { useRef } from "react";
import useTheme from ".../../../../hooks/useTheme";
import HeatMap from "./HeatMap";
// import { jsPDF } from "jspdf";
// import htmlToImage from "html-to-image";
import * as htmlToImage from "html-to-image";
import MeterChart from "./MeterChart";
import GaugeChart from "./GaugeChart";
import DarkChart from "../../assets/img/avatars/bar-chart.png";
import { Bubble } from "react-chartjs-2";
import Whitechart from "../../assets/img/avatars/bar-chart.png";
import html2canvas from "html2canvas"; // Import html2canvas library
import { util } from "src/Progrec";
import BubbleChart from "./BubbleChart";

// import aiImage from "../../assets/img/Remove background project.png";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import jsPDF from "jspdf"; // Import jsPDF library
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  PointElement,
  LineElement,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale,
  plugins,
} from "chart.js";

ChartJS.register(
  TimeScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  MatrixController,
  MatrixElement,
  ChartDataLabels
);
import { Chart } from "react-chartjs-2";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
// import usePalette from "src/hooks/usePalette";
import { Bar, getElementAtEvent, getDatasetAtEvent } from "react-chartjs-2";
import Select from "react-select";
import { Pie, Line, Doughnut, Radar } from "react-chartjs-2";
import { v4 as uuidv4 } from "uuid";
import ChartFilter from "./ChartFilter";
import { useTranslation } from "react-i18next";
import {
  Card,
  Modal,
  Button,
  Table,
  ListGroup,
  Row,
  Col,
  Nav,
  Navbar,
  Dropdown,
  OverlayTrigger,
  Spinner,
} from "react-bootstrap";
import usePalette from "src/hooks/usePalette";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ReportRuntime from "src/components/reports/Report";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axios from "src/utils/AxiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faPercentage,
  faListNumeric,
  faFilter,
  faSquare,
  faCircle,
  faCompress,
  faDownload,
  faRectangleAd,
  faGear,
  faEllipsisVertical,
  faScaleBalanced,
  faPencil,
  faArrowUp,
  faArrowDown,
  faArrowTrendDown,
  faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import CardHeader from "react-bootstrap/esm/CardHeader";
import BarChart from "./BarChart";
import MixedChart from "./MixedChart";
import MultilineChart from "./MultiLineChart";
import PieChart from "./PieChart";
import DoughnutChart from "./DoughnutChart";
import { useSelector } from "react-redux";
// import { Breathing } from "react-shimmer";
import { current } from "@reduxjs/toolkit";
// import { Random } from "react-animated-text";
// import { display } from "html2canvas/dist/types/css/property-descriptors/display";

function getChartMetaURL(chart) {
  const API_BASE_URL = "/chart/meta/" + chart;
  return API_BASE_URL;
}
const fetchChartMeta = async (chart) => {
  try {
    const response = await axios.get(getChartMetaURL(chart));
    // const data = await response.data.reportInfo;
    return await response.data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

export const trendData = async (
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
export const chartSData = async (
  report,
  orderExpression,
  filterExpression,
  defaultFilterExpression,
  fiscalYearFilter,
  setChartApiError
) => {
  console.log(fiscalYearFilter, "chart--data--fetcher");
  try {
    const API_BASE_URL = "/chart";
    const response = await axios.post(API_BASE_URL + "/" + report, {
      orderExpression,
      filterExpression,
      defaultFilterExpression,
      selectedYears: Array.isArray(fiscalYearFilter)
        ? fiscalYearFilter
        : [fiscalYearFilter],
    });
    if (response?.data) {
      setChartApiError(false);
    }
    return response;
  } catch (e) {
    console.log(e, "error in fetching the data");
    setChartApiError(true);
  }
};

const Charts = (props) => {
  console.log(props.Runtimevalue, "chart--name");
  let Runtimevalue = props?.Runtimevalue?.length > 0 ? props?.Runtimevalue : "";
  const { fiscal_year_starts } = useSelector(
    (state) => state.systemConfig.systemConfig
  );
  const palette = usePalette();
  const chartRef = useRef(null);
  let { chart, formJSON } = props; //columns, data:sourceData, dataFunction, service, title, enableCheck,
  if (!chart) {
    const [searchParams] = useSearchParams();
    chart = searchParams.get("chart");
  }
  const [chartFilter, setChartFilter] = useState();
  let [drilldownReports, setDrillDownReports] = React.useState();
  let [chartMeta, setChartMeta] = React.useState();
  let [legendToggle, setLegendToggle] = useState(false);
  let [chartData, setChartData] = React.useState();
  const [showModal, setShowModal] = useState(false);
  const [fullscreen, setfullScreen] = useState(true);
  const [reportFilter, setReportFilter] = useState();
  const [finalExpression, setFinalExpression] = useState("");
  const [default_filter, setDefault_filter] = useState("");
  const [buttonHide, setButtonHide] = useState(false);
  const [fiscalYearFilter, setfiscalYearFilter] = React.useState([]);
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [successFlag, setSuccessFlag] = useState(false);
  const [titleLength, setTitleLength] = useState();
  const [dataFlag, setDataFlag] = useState(false); // even if the use query could not fetch the data this flag becomes true helpful to show message in the display
  const [CurrentTotalValues, setCurrentTotalValues] = useState();
  const [aiValue, setaiValue] = useState("");
  const [chartApiError, setChartApiError] = useState(false);
  const [showaiModal, setShowaiModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);
  const { t } = useTranslation("common");
  const [prevTotalValue, setPrevTotalValue] = useState(0);
  console.log(drilldownReports, "report-filter");

  let previousYear = [];
  previousYear.push(new Date().getFullYear());
  previousYear = previousYear.map((item) => {
    return item - 1;
  });
  console.log(previousYear, "previous year data is here");
  let navigate = useNavigate();
  const [isOverflowing, setIsOverflowing] = useState(false);
  const Data = {
    labels: [],
    datasets: [],
  };
  // X Axis/Primary Chart Information
  let value = [];
  let background = [];
  let bordercolor = [];
  let borderRadius = [];
  let SubColumnName = [];
  let finalData = {};
  let result = [];
  let trimData = [];
  let filterData = [];
  let IncludingSubcloumn = [];
  let chartDataMap = new Map(); //this will store key and value pairs
  //we can use set,get,has ,set will set the value ,get will get the value using keys, has will check whether the value is present
  let chartDataArray = new Array();
  let chartLabelArray = new Array();
  let chartSubLabelArray = new Array();
  let DataSubColumn = new Map();
  let index = "x";
  let BackGround_Color = new Map();
  // variables for Guage Chart Data population
  let rotate = 0;
  let circum = 360;
  let colref = useRef();
  const { theme, setTheme } = useTheme(); //theme is used either dark or light
  const colorArray = [
    "#FF4433",
    "#097969",
    "#FF7518",
    "#FFBF00",
    "#ff595e",
    "#E34234",
    "#8ac926",
    "#5F9EA0",
    "#ffca3a",
    "#FFEA00",
    "#0096FF",
    "#FFAC1C",
    "#FA5F55",
    "#E1C16E",
    "#7393B3",
    "#CD7F32",
    "#FA8072",
    "#E4D00A",
    "#E49B0F",
  ];
  console.log(prevTotalValue, "prev-total-value");
  console.log(chartApiError, "chart-api-error");

  useEffect(() => {
    if (props.yearProp) {
      setfiscalYearFilter([props.yearProp]);
    }
  }, [props.yearProp]);
  console.log(fiscalYearFilter, "fiscal-year-filter");

  useEffect(() => {
    console.log(titleRef, "title reference");
    if (titleRef.current?.clientWidth <= 190) {
      setTitleLength(20);
    } else {
      setTitleLength(70);
    }
  }, [titleRef.current]);
  console.log(titleLength, "title length");
  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current) {
        setIsOverflowing(
          titleRef.current.scrollWidth > titleRef.current.clientWidth
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);
  console.log(chartData, "data reload");
  console.log(chartMeta, "meta-rrt");

  // useEffect(() => {
  //   console.log("diablo");

  //    chartSData();
  // }, [chartData]);
  useEffect(() => {
    if (chartMeta?.chartInfo.default_filter) {
      let originalString = chartMeta.chartInfo.default_filter;
      let values = props.defaultFilter;
      let replacedString = originalString;

      if (values) {
        Object.keys(values).forEach((key) => {
          let valueWithQuotes = `${values[key]}`;

          replacedString = replacedString.replace(
            new RegExp(`:${key}`, "g"),
            valueWithQuotes
          );
          console.log(
            replacedString,
            "replaced string",
            "replaced string is here"
          );
        });
      }

      setDefault_filter(replacedString);
    }
  }, [chartMeta]);
  console.log(default_filter, "dynamic default");

  const downloadChart = useCallback((chartType, title) => {
    setButtonHide(true);
    const cardElement = document.getElementById(chartType);
    htmlToImage
      .toPng(cardElement)
      .then((dataUrl) => {
        // Create a temporary link element to download the PNG image
        const link = document.createElement("a");
        // let title = chartMeta.chartInfo?.chart_title;
        console.log(title, "chart title");
        link.download = `${title}.png`;
        setButtonHide(false);
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        setButtonHide(false);
        console.error("Error exporting contents as PNG:", error);
      });
  }, []);

  let defaultChartFilterExpression;
  let frequentValue = {};

  useEffect(() => {
    if (chartMeta?.filters) {
      setChartFilter(chartMeta.filters);
    }
  }, [chartMeta]); //setting meta
  useEffect(() => {
    fetchChartMeta(chart).then(async (value) => {
      setChartMeta(value);
    });
  }, [chart]);
  const { isLoading, error, isError, data, isSuccess, refetch } = useQuery(
    
    
    [
      "chartData",
      chart,
      finalExpression,
      default_filter,
      fiscalYearFilter,
      chartMeta,
    ],

    async () => {
      console.log(
        chart,
        fiscalYearFilter,
        finalExpression,
        default_filter,
        successFlag,
        "fiscal year filter in use query"
      );
      console.log("else condition in query", chart);
      console.log(
        finalExpression,
        "final expression",
        default_filter,
        "default filter",
        fiscalYearFilter,
        "porsche"
      );
      console.log(chartMeta, "meta--1--2");

      console.log(
        props.yearFlag,
        props.customExpressionFlag,
        chart,
        fiscalYearFilter,
        finalExpression,
        default_filter,
        "properties control"
      );
      if (
        chartMeta?.chartInfo.chart_type &&
        chartMeta?.chartInfo.chart_type != "trend" &&
        props.yearFlag &&
        Array.isArray(fiscalYearFilter) &&
        fiscalYearFilter.length > 0 &&!props.customExpressionFlag
      ) {
        console.log("link0", chart, fiscalYearFilter);

        return await chartSData(
          chart,
          "",
          "",
          "",
          fiscalYearFilter,
          setChartApiError
        );
      } else if (
        (chartMeta?.chartInfo.chart_type &&
          chartMeta?.chartInfo.chart_type != "trend" &&
          props.yearFlag &&
          Array.isArray(fiscalYearFilter) &&
          fiscalYearFilter.length > 0 &&
          props.customExpressionFlag &&
          (default_filter || finalExpression)) ||
        (chartMeta?.chartInfo.chart_type != "trend" &&
          !props.yearFlag &&
          props.customExpressionFlag &&
          (default_filter || finalExpression))
      ) {
        console.log(
          "link1",
          default_filter,
          finalExpression,
          chart,
          fiscalYearFilter,
          setChartApiError
        );
        return await chartSData(
          chart,
          "",
          finalExpression,
          default_filter,
          fiscalYearFilter,
          setChartApiError
        );
      } else if (
        chartMeta?.chartInfo.chart_type &&
        chartMeta?.chartInfo.chart_type != "trend" &&
        (fiscalYearFilter?.length == 0 || !fiscalYearFilter) &&
        !props.customExpressionFlag &&
        !props.yearFlag
      ) {
        console.log("link2", chartMeta, chart);
        return await chartSData(
          chart,
          "",
          finalExpression,
          default_filter,
          fiscalYearFilter,
          setChartApiError
        );
      } else if (
        chartMeta?.chartInfo.chart_type &&
        chartMeta?.chartInfo.chart_type == "trend"
      ) {
        let currentYear = new Date().getFullYear();
        console.log(currentYear, fiscalYearFilter, "link--3");

        return await trendData(
          chartMeta?.chartInfo.chart_name,
          "",
          finalExpression,
          default_filter,
          fiscalYearFilter.length > 0
            ? fiscalYearFilter
            : fiscal_year_starts == 4
            ? previousYear
            : currentYear,
          chartMeta?.chartInfo.trend_type
        );
      } else {
        console.log("link3", chart);
        setDataFlag(true);
        return false;
      }
    },

    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
  console.log(data, "trendData");

  const PercentageCalculation = (previousYearData, currentYearValue) => {
    let percentageValue = "";

    let previousTotalValue = previousYearData
      ?.filter(
        (item) => item.Status === chartMeta.chartInfo.comparison_column_value
      )
      ?.reduce((sum, item) => sum + item.aggregatednumber, 0);

    let chartDatalValue = chartData
      ?.filter(
        (item) => item.Status === chartMeta.chartInfo.comparison_column_value
      )
      ?.reduce((sum, item) => sum + item.count, 0);

    console.log(
      "Filtered Data:",
      chartDatalValue,
      previousTotalValue,
      chartMeta.chartInfo.comparison_column_value
    );

    if (previousTotalValue > 0 && chartDatalValue > 0) {
      percentageValue =
        ((chartDatalValue - previousTotalValue) / previousTotalValue) * 100;
      percentageValue = Math.round(percentageValue);
      console.log("Calculated Percentage:", percentageValue);
      setPrevTotalValue(percentageValue);
    }

    return percentageValue;
  };

  // async function fetchPreviousYearData(
  //   chart,
  //   orderExpression,
  //   finalExpression,
  //   default_filter,
  //   previousYear,
  //   CurrentTotalValues
  // ) {
  //   let prevYearArray;
  //   if (!Array.isArray(previousYear)) {
  //     prevYearArray = [previousYear];
  //   }
  //   try {
  //     const previousYearData = await chartSData(
  //       chart,
  //       "",
  //       finalExpression,
  //       default_filter,
  //       previousYear
  //     );
  //     console.log(previousYearData, "previous-year-data");
  //     let PreviousYearPercentage = PercentageCalculation(
  //       previousYearData,
  //       CurrentTotalValues
  //     );
  //     console.log(PreviousYearPercentage, "previous-year-percentage");

  //     return {
  //       prevYearData: previousYearData,
  //       prevPrecnetage: PreviousYearPercentage,
  //     };
  //   } catch (error) {
  //     // Handle any errors
  //     console.error("Error fetching previous year data:", error);
  //   }
  // }
  // const fetchLlamaResponse = async (userPrompt) => {
  //   console.log(userPrompt, "use-promt-here");

  //   setShowaiModal(true);
  //   setLoading(true);
  //   axios
  //     .post("ai/generate", userPrompt, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((response) => {
  //       // const data = response.json();
  //       setaiValue(response.data.response);
  //       setLoading(false);
  //       console.log("LLaMA Response:", response.data.response);
  //       return response.data.response;
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching response:", error);
  //       return "Error fetching response.";
  //     });
  // };
  //   const handleAIClick = () => {
  //     async function AiPromptCall() {
  //       let currentYear = new Date().getFullYear();
  //       console.log(previousYear, "previous--Year--chart");

  //       let previousYearData = await fetchPreviousYearData(
  //         chart,
  //         "",
  //         finalExpression,
  //         default_filter,
  //         previousYear,
  //         CurrentTotalValues
  //       );
  //       console.log(previousYearData, chartMeta.chartInfo.purpose, "p-r-1");
  //       fetchLlamaResponse(
  //         `You are an AI assistant analyzing a chart from the Business Resilience module. The chart type is ${chart}, and its purpose is ${
  //           chartMeta.chartInfo.purpose
  //         }.

  // Analyze the data for the current year (${currentYear}): ${JSON.stringify(
  //           chartData
  //         )} and the previous year (${previousYear}): ${JSON.stringify(
  //           previousYearData
  //         )}.
  // here the chartData which i have mentioned array of object there "aggregated number" represents the count dont make any spelling or gramatical mistakes

  // Your response **must** follow this format for consistency:
  // 1. Key Trends: (Summarize overall movement: increase, decrease, or stability make the numbrings simple.)
  // 2. Discrepancies: (Highlight notable gaps, anomalies, or deviations.)
  // 3. Recommendations: (Suggest actions to improve or sustain performance.)

  // Your response **must be exactly 200 characters**. Do not include labels, introductions, or filler words—only insights in the required format. Avoid variations in phrasing across responses.`
  //       );
  //     }
  //     AiPromptCall();
  //   };

  useEffect(() => {
    if (successFlag == false && isSuccess == true) {
      setSuccessFlag == true;
    }
  }, [isSuccess]);

  useEffect(() => {
    if (data && chartMeta?.chartInfo.chart_type != "trend") {
      let finalData = data.data.map((items) => {
        const { aggregatednumber, ...rest } = items;
        return { ...rest, count: aggregatednumber };
      });
      console.log(finalData, "final123");

      let totalValue = finalData?.reduce((sum, item) => sum + item.count, 0);
      setCurrentTotalValues(totalValue);
      console.log(totalValue, "total value123");
      if (fiscalYearFilter.length > 0) {
        previousYear = fiscalYearFilter[0] - 1;
        console.log(previousYear, "nysc");
      }

      console.log(data, "data of charts are here");
      if (chartMeta?.chartInfo.chart_type != "heatmap" && props.yearFlag) {
        console.log("called prevYear");

        // fetchPreviousYearData(
        //   chart,
        //   "",
        //   finalExpression,
        //   default_filter,
        //   previousYear,
        //   totalValue
        // );
      }

      console.log(finalData, "finalData");
      finalData.forEach((obj) => {
        Object.entries(obj).forEach(([key, value]) => {
          if (value === null) {
            obj[key] = "--";
          }
        });
      });
      console.log(chartMeta, finalData, "zee5");
      let orderingData = Array(finalData.length).fill(undefined);
      console.log(orderingData, "ordering data");

      chartMeta?.columns.forEach((meta, index) => {
        finalData.forEach((data, index1) => {
          if (data[chartMeta.chartInfo.x_title] == meta.dataset_value) {
            let indexVal = meta.display_order - 1;

            console.log(indexVal, "indo val");

            orderingData[indexVal] = data;
          }
        });
      });
      console.log(orderingData, finalData, "ordering data1");

      orderingData = orderingData.filter((items) => items != undefined);

      if (orderingData.length > 0) {
        setChartData(orderingData);
      } else {
        setChartData(finalData);
      }
    }
    if (data && chartMeta?.chartInfo.chart_type == "trend") {
      console.log(data, "setting trend data");

      setChartData(data);
    }
  }, [data, chartMeta]);
  console.log(data, "values are here"), React.useEffect(() => {}, [chartMeta]); //setting chart data
  function replaceNullValuesInArray(array) {
    return array;
  }
  console.log(chartData, "deadpool");

  useEffect(() => {
    if (chartMeta && drilldownReports) {
      console.log(drilldownReports, "report check");

      if (chartMeta.chartInfo.report_filter_expression) {
        let originalString = chartMeta.chartInfo.report_filter_expression;

        function removeEmptyKeys(obj) {
          for (let key in obj) {
            if (
              obj[key] === undefined ||
              obj[key] === null ||
              obj[key] === "--"
            ) {
              delete obj[key];
            }
          }
          return obj;
        }

        let values = removeEmptyKeys(drilldownReports);
        console.log(values, "values of report");

        let replacedString = originalString;
        console.log(replacedString, "rep0");

        Object.keys(values).forEach((key) => {
          let valueWithQuotes = `'${values[key]}'`;
          console.log(valueWithQuotes, "value with quotes");
          console.log(replacedString, "rep1");

          if (valueWithQuotes == "'--'" || valueWithQuotes == "'empty'") {
            console.log("rep2", replacedString);

            replacedString = replacedString
              .replace(
                new RegExp(`=`, "g"), // Match the pattern of `=<key>`
                "" // Remove the `=`
              )
              .replace(
                new RegExp(`:${key}`, "g"), // Replace `:<key>` with `IS NULL`
                " IS NULL"
              );
            console.log(replacedString, "replaced null string");
          } else {
            console.log("not null inside");

            replacedString = replacedString.replace(
              new RegExp(`:${key}`, "g"),
              valueWithQuotes
            );
          }
        });
        console.log(replacedString, "replaced string");

        defaultChartFilterExpression = replacedString;
        replacedString = replacedString.replace(/--/g, null);

        setReportFilter(replacedString);
      }
    }
  }, [chartMeta, drilldownReports]); //building the filter expressiioin for the report

  if (chartMeta != undefined && chartData != undefined) {
    //Note:remove chartData!=undefined to open the heat map work
    console.log(chartData, "chartData");

    const handleClick = (event, element) => {
      console.log(chartRef.current, "current-is-here");

      console.log(
        getElementAtEvent(chartRef.current, event),
        getElementAtEvent(chartRef.current, event)[0].datasetIndex,
        "refer123"
      );

      // if (getElementAtEvent(chartRef.current, event).length > 0) {
      const datasetIndexNum = getElementAtEvent(chartRef.current, event)[0]
        .datasetIndex;
      console.log(datasetIndexNum, "--datasetIndex-num--");
      const dataPoint = getElementAtEvent(chartRef.current, event)[0].index;

      if (chartMeta.chartInfo.x_sub_column) {
        console.log("filtering condition 1");

        let dataDrillDown = Data.labels[dataPoint];
        console.log(dataDrillDown, "data drill down");

        setDrillDownReports({
          [chartMeta.chartInfo.x_column]: Data.labels[dataPoint],
          [chartMeta.chartInfo.x_sub_column]:
            Data.datasets[datasetIndexNum].label,
        });
      } else if (!chartMeta.chartInfo.x_sub_column && props.defaultFilter) {
        console.log("filter condition 2");

        setDrillDownReports({
          [chartMeta.chartInfo.x_column]: Data.labels[dataPoint],
          ...props.defaultFilter,
        });
      } else {
        console.log("filtering condition 3");
        console.log(Data, "leo--123");

        let dataDrillDown = Data.labels[dataPoint];
        if (dataDrillDown === "--") {
          dataDrillDown = "empty";
        }
        setDrillDownReports({
          [chartMeta.chartInfo.x_column]: dataDrillDown,
        });
      }
      const message = `Clicked on dataset index ${datasetIndexNum}, data point ${dataPoint}`;
      if (chartMeta.chartInfo.report_name) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
      // }
    }; //here this functiioin fetches the particular data based on the click from the chart
    console.log(drilldownReports, "driller");

    const handleClose = () => setShowModal(false);
    const handlefullscreen = () => {
      setfullScreen(!fullscreen);
    };

    console.log(drilldownReports, "driller");

    // Setting up the vertical or Horizontal Bar Chart
    if (
      chartMeta.chartInfo.chart_type == "bar" &&
      chartMeta.chartInfo.index == true
    ) {
      index = "y";
    }
    chartMeta.columns.forEach((column) => {
      if (column.is_sub === true) {
        //here i am finding which column has the is_sub true
        SubColumnName.push(column.dataset_value); //here if the is sub is true i am assigning the data_set value of the is sub true column
        return;
      }
    });
    if (SubColumnName) {
      chartMeta.columns.forEach((value) =>
        SubColumnName.forEach((subvalue) => {
          if (subvalue === value.dataset_value) {
            BackGround_Color.set(subvalue, value.background_color);

            // console.log(color,"bg")
          }
        })
      );
    }

    //filtering the columns based on the user rquirement executed only when the columns are present in the designer
    if (
      chartMeta &&
      chartMeta.columns.length > 0 &&
      chartMeta.chartInfo.chart_type != "heatmap"
    )
      console.log("condition filter data");

    filterData = chartData.filter((items) => {
      const valueToCheck = items[chartMeta.chartInfo.x_title];
      const DataSetValue = chartMeta.columns.map((item) => item.dataset_value);

      return DataSetValue.includes(valueToCheck);
    });

    //filtering the subcolumns from the filtered data executes only when the user provides is sub is true in the designer
    if (
      chartMeta.columns?.length > 0 &&
      chartMeta.chartInfo.x_sub_column &&
      SubColumnName &&
      filterData?.length > 0
    ) {
      console.log(chartMeta.chartInfo.chart_title, "condition1");
      IncludingSubcloumn = filterData.filter((items) => {
        //filtering the sub columns
        const valueToCheck = items[chartMeta.chartInfo.x_sub_column];
        const DataSetValue = chartMeta.columns.map(
          (item) => item.dataset_value
        );
        return DataSetValue.includes(valueToCheck);
      });
    }
    if (
      chartMeta.columns?.length == 0 &&
      chartMeta.chartInfo.x_sub_column &&
      SubColumnName &&
      filterData?.length == 0
    ) {
      console.log(chartMeta.chartInfo.chart_title, "condition2");
      IncludingSubcloumn = chartData.filter((items) => {
        console.log(chartData, chartMeta, "condition 2 chart data");

        //filtering the sub columns
        const valueToCheck = items[chartMeta.chartInfo.x_sub_column];
        const DataSetValue = chartMeta.columns.map(
          (item) => item.dataset_value
        );
        return DataSetValue.includes(valueToCheck);
      });
      console.log(IncludingSubcloumn, "including sub column of chart data");
    }
    console.log(
      chartMeta.columns?.length,
      "columns",
      chartMeta.chartInfo.x_sub_column,
      "x_sub_column",
      SubColumnName,
      "SubColumnName",
      filterData?.length,
      "FILTERDATA",
      "condition details"
    );
    if (
      (chartMeta.columns?.length == 0 &&
        chartMeta.chartInfo.x_sub_column &&
        SubColumnName.length == 0 &&
        filterData?.length == 0) ||
      (chartMeta &&
        chartMeta.columns?.length > 0 &&
        SubColumnName &&
        SubColumnName.length > 0 &&
        // filterData?.length == 0 &&  need to verify
        chartMeta.chartInfo.chart_type != "heatmap")
    ) {
      let DataToIterate;
      if (IncludingSubcloumn?.length > 0) {
        DataToIterate = IncludingSubcloumn;
      } else {
        DataToIterate = chartData;
      }

      console.info(
        "condition4,not includes the column from the designer all columns from sub and main table"
      );
      console.log(DataToIterate, "data to iterate without columns and columns");

      DataToIterate.forEach(function (item, index, arr) {
        console.log(item, "data to iterate ");

        chartDataMap.set(item[chartMeta.chartInfo.x_title], item.count); //using map we are setting the key an value pairs for example
        // {"Casual Leave" => 325}
        chartDataArray.push(item.count);
        chartLabelArray.push(item[chartMeta.chartInfo.x_title]); // {leavetype:"casual leave"}
        //here in every iteration from the chartdata it will get the label names when the labels are not present
        if (item[chartMeta.chartInfo.x_sub_column])
          chartSubLabelArray.push(item[chartMeta.chartInfo.x_sub_column]);
      });
      chartLabelArray = [...new Set(chartLabelArray)]; //it will be in the object so i will get it inan array
      console.log(chartSubLabelArray, chartMeta.columns, "sub label is here");

      chartSubLabelArray = [...new Set(chartSubLabelArray)];
      DataToIterate.forEach((type, index) => {
        finalData[type[chartMeta.chartInfo.x_title]] = Array.from(
          { length: chartSubLabelArray.length },
          () => null
        );
      });
      console.log(
        finalData,

        "condition4 data"
      );
      DataToIterate.forEach((type) => {
        chartSubLabelArray.forEach((sublabel, index) => {
          console.log(chartLabelArray, DataToIterate, "iteration of data");

          if (type[chartMeta.chartInfo.x_sub_column] == sublabel) {
            finalData[type[chartMeta.chartInfo.x_title]][index] = type.count;
          }
        });
      });

      for (let i = 0; i < chartData.length; i++) {
        const counts = chartLabelArray.map((xlabel) => finalData[xlabel][i]);
        result.push(counts);
      }
      chartLabelArray.map((items) => {
        Data.labels.push(items);
      });

      if (chartLabelArray && chartMeta.columns?.length > 0) {
        background = chartLabelArray.map((label, index) => {
          const matchingColumn = chartMeta.columns.find(
            (column) => column.dataset_value === label
          );
          if (matchingColumn && matchingColumn.background != "") {
            return matchingColumn.background_color;
          } else {
            return colorArray[index];
          }
        });
      }

      if (background.length == 0) {
        background = colorArray;
      }
      chartLabelArray = chartLabelArray.map((items) => {
        if (!items) {
          return "--";
        } else {
          return items;
        }
      });
      if (chartMeta.chartInfo.chart_type == "bar") {
        console.log("condition5", chartSubLabelArray);

        chartSubLabelArray.forEach((datasetlabel, index) => {
          console.log(chartMeta.columns[index], index, datasetlabel, "utopia");
          let BgColor = new Map();
          chartMeta?.columns?.forEach((items, index) => {
            if (items.dataset_value == datasetlabel) {
              BgColor.set(datasetlabel, items.background_color);
            }
          });
          console.log(BgColor, "Bg-color");

          const DataSetData = result[index];
          Data.datasets.push({
            label: datasetlabel,
            backgroundColor: BgColor.get(datasetlabel)
              ? BgColor.get(datasetlabel)
              : colorArray[index],
            borderColor: "rgb(205,177,121)",
            data: DataSetData,
            barPercentage: 0.8,
            categoryPercentage: 0.5,
            barThickness: 25,
            maxBarThickness: 30,
            minBarLength: 8,
            borderRadius: borderRadius,
            // circumference:180,
            // rotation:270,
            iterationIndex: index,
            hoverOffset: chartMeta.chartInfo.hover_value
              ? chartMeta.chartInfo.hover_value
              : "", // Adding the index value for the iteration
          });
        });
      }
      if (
        // chartMeta.chartInfo.chart_type == "guage" ||
        chartMeta.chartInfo.chart_type == "pie" ||
        chartMeta.chartInfo.chart_type == "doughnut" ||
        chartMeta.chartInfo.chart_type == "meter"
      ) {
        console.log(chartMeta.chartInfo.chart_title, "condition6");
        chartSubLabelArray.forEach((datasetlabel, index) => {
          const DataSetData = result[index];
          Data.datasets.push({
            label: datasetlabel,
            backgroundColor: background,
            data: DataSetData,
            // circumference: chartMeta.chartInfo.chart_type == "meter"?270:0,
            // rotation: chartMeta.chartInfo.chart_type == "meter"?270:360,
            iterationIndex: index,
            // cutout:
            //   chartMeta.chartInfo.chart_type == "pie"
            //     ? 0
            //     : chartMeta.chartInfo.compact_view &&
            //       chartMeta.chartInfo.chart_type == "doughnut"
            //     ? 46
            //     : !chartMeta.chartInfo.compact_view &&
            //       chartMeta.chartInfo.chart_type == "doughnut"
            //     ? 65
            //     : 0,
            // hoverOffset: chartMeta.chartInfo.hover_value
            //   ? chartMeta.chartInfo.hover_value
            //   : "", // Adding the index value for the iteration
          });
        });
      }

      if (
        chartMeta.chartInfo.chart_type == "multilineChart" &&
        chartSubLabelArray.length > 0
      ) {
        chartSubLabelArray.forEach((datasetlabel, index) => {
          const DataSetData = result[index];
          Data.datasets.push({
            label: datasetlabel,
            data: DataSetData,
            fill: chartMeta.chartInfo.fill,
            borderColor: chartMeta.columns[index]?.background_color
              ? chartMeta.columns[index].background_color
              : colorArray[index],
            pointBorderColor: chartMeta.chartInfo.pointer_color
              ? chartMeta.chartInfo.pointer_color
              : colorArray[1],
            pointBorderWidth: chartMeta.chartInfo.point_radius
              ? chartMeta.chartInfo.point_radius / 2
              : "",
            pointRadius: chartMeta.chartInfo.point_radius
              ? chartMeta.chartInfo.point_radius
              : "",
            tension: chartMeta.chartInfo.tension,
          });
        });
        // return (
        //   <MultilineChart
        //     onClick={handleClick}
        //     chartMeta={chartMeta}
        //     data={data}
        //     chart={chart}
        //     default_filter={default_filter}
        //     finalExpression={finalExpression}
        //   />
        // );
      }
    }
    if (
      chartMeta.columns?.length > 0 &&
      chartMeta.chartInfo.x_sub_column &&
      SubColumnName &&
      SubColumnName.length > 0 &&
      filterData &&
      filterData.length > 0
    ) {
      console.log(
        "condition7,not includes the column from the designer all columns from sub and main table"
      );
      filterData.forEach(function (item, index, arr) {
        chartDataMap.set(item[chartMeta.chartInfo.x_title], item.count); //using map we are setting the key an value pairs for example
        // {"Casual Leave" => 325}
        chartDataArray.push(item.count);
        chartLabelArray.push(item[chartMeta.chartInfo.x_title]); // {leavetype:"casual leave"}
        //here in every iteration from the chartdata it will get the label names when the labels are not present
        if (item[chartMeta.chartInfo.x_sub_column])
          chartSubLabelArray.push(item[chartMeta.chartInfo.x_sub_column]);
      });
      chartLabelArray = [...new Set(chartLabelArray)]; //it will be in the object so i will get it inan array
      chartSubLabelArray = [...new Set(chartSubLabelArray)];
      chartData.forEach((type) => {
        finalData[type[chartMeta.chartInfo.x_title]] = Array.from(
          { length: chartSubLabelArray.length },
          () => null
        );
      });
      chartData.forEach((type) => {
        chartSubLabelArray.forEach((sublabel, index) => {
          if (type[chartMeta.chartInfo.x_sub_column] == sublabel) {
            finalData[type[chartMeta.chartInfo.x_title]][index] = type.count;
          }
        });
      });

      for (let i = 0; i < chartData.length; i++) {
        const counts = chartLabelArray.map((xlabel) => finalData[xlabel][i]);
        result.push(counts);
      }
      chartLabelArray.map((items) => {
        Data.labels.push(items);
      });

      if (chartLabelArray && chartMeta.columns?.length > 0) {
        background = chartLabelArray.map((label, index) => {
          const matchingColumn = chartMeta.columns.find(
            (column) => column.dataset_value === label
          );
          if (matchingColumn && matchingColumn.background != "") {
            return matchingColumn.background_color;
          } else {
            return colorArray[index];
          }
        });
      }

      if (background.length <= 0) {
        background = colorArray;
      }

      if (chartMeta.chartInfo.chart_type == "bar") {
        chartSubLabelArray.forEach((datasetlabel, index) => {
          const DataSetData = result[index];
          Data.datasets.push({
            label: datasetlabel,
            backgroundColor: colorArray[index],
            borderColor: "rgb(205,177,121)",
            data: DataSetData,
            categoryPercentage: 0.5,
            minBarLength: 8,
            borderRadius: borderRadius,
            barPercentage: 0.8,
            barThickness: 25,
            maxBarThickness: 30,
            // circumference:180,
            // rotation:270,
            iterationIndex: index,
            hoverOffset: chartMeta.chartInfo.hover_value
              ? chartMeta.chartInfo.hover_value
              : "", // Adding the index value for the iteration
          });
        });
      }
      if (chartMeta.chartInfo.chart_type == "multilineChart") {
        chartSubLabelArray.forEach((datasetlabel, index) => {
          const DataSetData = result[index];
          Data.datasets.push({
            data: DataSetData,
            label: datasetlabel,
            fill: chartMeta.chartInfo.fill,
            borderColor:
              chartMeta.chartInfo.chart_type == "line"
                ? chartMeta.chartInfo.line_border_color
                : "",
            pointBorderColor: chartMeta.chartInfo.pointer_color
              ? chartMeta.chartInfo.pointer_color
              : colorArray[1],
            pointBorderWidth: chartMeta.chartInfo.point_radius
              ? chartMeta.chartInfo.point_radius / 2
              : "",
            pointRadius: chartMeta.chartInfo.point_radius
              ? chartMeta.chartInfo.point_radius
              : "",
            tension: chartMeta.chartInfo.tension,
          });
        });
      }
    }
    if (
      (chartMeta.columns?.length == 0 &&
        chartMeta.chartInfo.chart_type !== "gauge" &&
        chartMeta.chartInfo.chart_type != "mixedChart" &&
        !chartMeta.chartInfo.x_sub_column &&
        chartMeta.chartInfo.chart_type != "heatmap") ||
      (chartMeta.columns?.length > 0 &&
        !chartMeta.chartInfo.x_sub_column &&
        filterData &&
        chartMeta.chartInfo.chart_type !== "gauge" &&
        chartMeta.chartInfo.chart_type != "heatmap")
    ) {
      console.log("condition8");
      console.log("condition 8 meta", chartMeta.chartInfo.pointer_color);

      let DataToIterate;
      if (filterData?.length > 0) {
        DataToIterate = filterData;
      } else {
        DataToIterate = chartData;
      }
      let ValueArray = {};

      DataToIterate.forEach(function (item, index, arr) {
        chartDataMap.set(item[chartMeta.chartInfo.x_title], item.count);
        chartDataArray.push(item.count);
        chartLabelArray.push(item[chartMeta.chartInfo.x_title]);
        console.log(item[chartMeta.chartInfo.x_title], item, "rx-7");
        ValueArray[item[chartMeta.chartInfo.x_title]] = Array.from(
          { length: 1 },
          () => null
        );
      });
      chartLabelArray.forEach((items, index) => {
        console.log(ValueArray[items][index], "value items");
        ValueArray[items][index] = chartDataArray[index];
      });
      console.log(
        ValueArray,
        chart,

        "Value array"
      );

      if (chartLabelArray) {
        background = chartLabelArray.map((label, index) => {
          const matchingColumn = chartMeta.columns.find(
            (column) => column.dataset_value === label
          );
          if (matchingColumn && matchingColumn.background != "") {
            return matchingColumn.background_color;
          } else {
            return colorArray[index];
          }
        });
      }
      if (chartMeta?.columns) {
      }
      chartDataArray.map((items, index) => {
        return colorArray[index];
      });

      console.log(background, "heman");
      if (chartDataArray && chartLabelArray) {
        console.log(chartDataArray, "chart data array for condition 8");
        if (chartMeta.chartInfo.chart_type == "bar") {
          chartLabelArray.forEach((items, index) => {
            Data.datasets.push({
              label: items,
              data: ValueArray[items],
              borderRadius: 3.5,
              backgroundColor:
                background &&
                background.length > 0 &&
                background.every((item) => item !== undefined)
                  ? background[index]
                  : colorArray[index],
              hoverOffset: chartMeta.chartInfo.hover_value
                ? chartMeta.chartInfo.hover_value
                : "",

              barThickness:
                chartMeta.chartInfo.compact_view == true ||
                chartMeta.chartInfo.chart_size == "xs"
                  ? 10
                  : 20,
              minBarLength: 1,
              maxBarLength: 1,
              maxBarThickness:
                chartMeta.chartInfo.compact_view == true ||
                chartMeta.chartInfo.chart_size == "xs"
                  ? 10
                  : 20,
            });
          });

          Data.labels = chartLabelArray;
        }
        console.log(chart, Data, "condition 8 data");

        if (chartMeta.chartInfo.chart_type == "line") {
          Data.datasets.push({
            label: chartMeta.chartInfo.x_title + " " + "Values",
            data: chartDataArray,
            fill: chartMeta.chartInfo.fill,
            borderColor:
              chartMeta.chartInfo.chart_type == "line"
                ? chartMeta.chartInfo.line_border_color
                : "",
            pointBorderColor: chartMeta.chartInfo.pointer_color
              ? chartMeta.chartInfo.pointer_color
              : colorArray[1],
            pointBorderWidth: chartMeta.chartInfo.point_radius
              ? chartMeta.chartInfo.point_radius / 2
              : "",
            pointRadius: chartMeta.chartInfo.point_radius
              ? chartMeta.chartInfo.point_radius
              : "",
            tension: chartMeta.chartInfo.tension,
          });
          Data.labels = chartLabelArray;
        }
        chartLabelArray = chartLabelArray.map((items) => {
          if (!items) {
            return "--";
          } else {
            return items;
          }
        });

        if (
          chartMeta.chartInfo.chart_type == "pie" ||
          chartMeta.chartInfo.chart_type == "doughnut" ||
          chartMeta.chartInfo.chart_type == "meter"
          //  ||
          // chartMeta.chartInfo.chart_type == "guage"
        ) {
          console.log(chartMeta.chartInfo.chart_title, "condition8");
          console.log(Data, "Data is here");

          Data.datasets.push({
            label: chartMeta.chartInfo.x_title + " " + "Values",
            data: chartDataArray,
            backgroundColor:
              background &&
              background.length > 0 &&
              background.every((item) => item !== undefined)
                ? background
                : colorArray,
            // cutout:
            //   chartMeta.chartInfo.chart_type == "pie"
            //     ? 0
            //     : chartMeta.chartInfo.compact_view &&
            //       chartMeta.chartInfo.chart_type == "doughnut"
            //     ? 46
            //     : !chartMeta.chartInfo.compact_view &&
            //       chartMeta.chartInfo.chart_type == "doughnut"
            //     ? 50
            //     : 0,
            // borderColor: "black",
            // borderWidth: 0.5,
            //    circumference: chartMeta.chartInfo.chart_type == "meter"?270:0,
            // rotation: chartMeta.chartInfo.chart_type == "meter"?270:360,
            // circumference: circum ? circum : 360,
            // cutout:
            hidden: false,
            //      "70%",
            // rotation: rotate ? rotate : 0,
            angleValue: 75,
            // hoverOffset: chartMeta.chartInfo.hover_value
            //   ? chartMeta.chartInfo.hover_value
            //   : "",
          });
          Data.labels = chartLabelArray;
        }
      }
    }

    if (
      chartMeta.columns?.length >= 0 &&
      chartMeta.chartInfo.x_sub_column &&
      SubColumnName &&
      SubColumnName.length > 0 &&
      filterData?.length > 0
    ) {
      IncludingSubcloumn = chartData.filter((items) => {
        //filtering the sub columns
        const valueToCheck = items[chartMeta.chartInfo.x_sub_column];
        const DataSetValue = chartMeta.columns.map(
          (item) => item.dataset_value
        );
        return DataSetValue.includes(valueToCheck);
      });

      IncludingSubcloumn.forEach(function (item, index, arr) {
        chartDataMap.set(item[chartMeta.chartInfo.x_title], item.count); //using map we are setting the key an value pairs for example
        // {"Casual Leave" => 325}
        chartDataArray.push(item.count);
        chartLabelArray.push(item[chartMeta.chartInfo.x_title]); // {leavetype:"casual leave"}
        //here in every iteration from the chartdata it will get the label names when the labels are not present
        if (item[chartMeta.chartInfo.x_sub_column])
          chartSubLabelArray.push(item[chartMeta.chartInfo.x_sub_column]);
      });

      chartLabelArray = [...new Set(chartLabelArray)]; //it will be in the object so i will get it inan array
      chartSubLabelArray = [...new Set(chartSubLabelArray)];
      chartLabelArray = chartLabelArray?.map((items) => {
        if (!items) {
          return "--";
        } else {
          return items;
        }
      });
      console.log(chartLabelArray, "label array");
      IncludingSubcloumn.forEach((type) => {
        finalData[type[chartMeta.chartInfo.x_title]] = Array.from(
          { length: chartSubLabelArray.length },
          () => null
        );
      });
      IncludingSubcloumn.forEach((type) => {
        chartSubLabelArray.forEach((sublabel, index) => {
          if (type[chartMeta.chartInfo.x_sub_column] == sublabel) {
            finalData[type[chartMeta.chartInfo.x_title]][index] = type.count;
          }
        });
      });

      for (let i = 0; i < chartData.length; i++) {
        const counts = chartLabelArray.map((xlabel) => finalData[xlabel][i]);
        result.push(counts);
      }
      let SubColumnColor = new Map();
      let SubBorderColor = new Map();
      let SubColumnBorderRadius = new Map();
      chartMeta.columns.map((meta) => {
        IncludingSubcloumn.map((Data) => {
          if (Data[chartMeta.chartInfo.x_sub_column] == meta.dataset_value) {
            SubColumnColor.set(meta.dataset_value, meta.background_color);
            SubBorderColor.set(meta.dataset_value, meta.border_color);
            SubColumnBorderRadius.set(meta.dataset_value, meta.border_radius);
          }
        });
      });

      // chartDataMap.set(item[chartMeta.chartInfo.x_title], item.count)
      chartLabelArray.map((items) => {
        Data.labels.push(items);
      });

      if (chartMeta.chartInfo.chart_type == "bar") {
        chartSubLabelArray.forEach((datasetlabel, index) => {
          const DataSetData = result[index];
          Data.datasets.push({
            label: datasetlabel,
            backgroundColor: SubColumnColor.get(datasetlabel)
              ? SubColumnColor.get(datasetlabel)
              : colorArray[index],
            borderColor: SubBorderColor.get(datasetlabel)
              ? SubBorderColor.get(datasetlabel)
              : "white",
            data: DataSetData,
            categoryPercentage: 0.5,
            borderRadius: SubColumnBorderRadius.get(datasetlabel)
              ? SubColumnBorderRadius.get(datasetlabel)
              : "0",
            // circumference:180,
            // rotation:270,
            iterationIndex: index,
            barPercentage: 0.8,
            barThickness: 25,
            maxBarThickness: 30,
            minBarLength: 8,
            hoverOffset: chartMeta.chartInfo.hover_value
              ? chartMeta.chartInfo.hover_value
              : "", // Adding the index value for the iteration
          });
        });
      }

      if (chartMeta.chartInfo.chart_type == "line") {
        chartSubLabelArray.forEach((datasetlabel, index) => {
          const DataSetData = result[index];
          Data.datasets.push({
            label: datasetlabel,
            data: DataSetData,
            fill: chartMeta.chartInfo.fill,
            borderColor:
              chartMeta.chartInfo.chart_type == "line"
                ? chartMeta.chartInfo.line_border_color
                : "",
            pointBorderColor: chartMeta.chartInfo.pointer_color
              ? chartMeta.chartInfo.pointer_color
              : colorArray[1],
            pointBorderWidth: chartMeta.chartInfo.point_radius
              ? chartMeta.chartInfo.point_radius / 2
              : "",
            pointRadius: chartMeta.chartInfo.point_radius
              ? chartMeta.chartInfo.point_radius
              : "",
            tension: chartMeta.chartInfo.tension,
          });
        });
      }
      console.log(chartMeta, "meta zone");

      if (
        // chartMeta.chartInfo.chart_type == "guage" ||
        chartMeta.chartInfo.chart_type == "pie" ||
        chartMeta.chartInfo.chart_type == "doughnut" ||
        chartMeta.chartInfo.chart_type == "meter"
      ) {
        console.log(chartMeta.chartInfo.chart_title, "condition9");
        chartSubLabelArray.forEach((datasetlabel, index) => {
          const DataSetData = result[index];
          Data.datasets.push({
            label: datasetlabel,
            backgroundColor: chartMeta.columns[index].background_color
              ? chartMeta.columns[index].background_color
              : colorArray[index],
            borderColor: "rgb(205,177,121)",
            data: DataSetData,
            //  circumference: chartMeta.chartInfo.chart_type == "meter"?270:0,
            //     rotation: chartMeta.chartInfo.chart_type == "meter"?270:360,
            // cutout:
            //   chartMeta.chartInfo.chart_type == "pie"
            //     ? 0
            //     : chartMeta.chartInfo.compact_view &&
            //       chartMeta.chartInfo.chart_type == "doughnut"
            //     ? 46
            //     : !chartMeta.chartInfo.compact_view &&
            //       chartMeta.chartInfo.chart_type == "doughnut"
            //     ? 65
            //     : 0,
            iterationIndex: index,
            // hoverOffset: chartMeta.chartInfo.hover_value
            //   ? chartMeta.chartInfo.hover_value
            //   : "", // Adding the index value for the iteration
          });
        });
      }
    }

    // Reuse the built-in legendItems generator
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      // cornerRadius: 15,
      plugins: {
        legend: {
          display:
            chartMeta.chartInfo.legend_display &&
            !chartMeta.chartInfo.only_chart
              ? true
              : false,
          responsive: false,
          position: chartMeta.chartInfo.legend_position
            ? chartMeta.chartInfo.legend_position
            : "top",
          labels: {
            boxWidth: chartMeta.chartInfo.box_width
              ? chartMeta.chartInfo.box_width
              : "10",
            padding: chartMeta.chartInfo.legend_padding
              ? chartMeta.chartInfo.legend_padding
              : "10",
            font: {
              size: chartMeta.chartInfo.legend_font_size
                ? chartMeta.chartInfo.legend_font_size
                : "10",
            },
            // useBorderRadius:true
          },
          align: chartMeta.chartInfo.legend_align
            ? chartMeta.chartInfo.legend_align
            : "center",
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
          display:
            chartMeta.chartInfo.compact_view || chartMeta.chartInfo.only_chart
              ? false
              : true,
          anchor: chartMeta.chartInfo.datalabel_align
            ? chartMeta.chartInfo.datalabel_align
            : "end",
          align: chartMeta.chartInfo.datalabel_position
            ? chartMeta.chartInfo.datalabel_position
            : "top",
          clamp: false,
          offset: 1,

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
      indexAxis: chartMeta.chartInfo.chart_index ? "y" : "x",
      scales: {
        y: {
          grid: {
            display: chartMeta.chartInfo.y_grid == null ? false : true,
          },
          stacked: chartMeta.chartInfo.x_stack
            ? chartMeta.chartInfo.x_stack
            : false,
          title: {
            display: chartMeta.chartInfo.y_title,
            text: chartMeta.chartInfo.y_title,
          },
          ticks: {
            stepSize: 1,
            precision: 0,
            // beginAtZero: true,
          },
        },
        x: {
          grid: {
            display: chartMeta.chartInfo.x_grid == null ? false : true,
          },
          stacked: chartMeta.chartInfo.x_stack
            ? chartMeta.chartInfo.x_stack
            : false,
          title: {
            display: chartMeta.chartInfo.x_title,
            text: chartMeta.chartInfo.x_title,
          },
          ticks: {
            display: false,
            stepSize: 2,
            precision: 1,
          },
        },
      },
      //  onClick: (event, elements) => onClick(event, elements),
    };

    const Doughnut_Pie_Guage_Options = {
      responsive: true,
      maintainAspectRatio: false,
      circumference: chartMeta.chartInfo.chart_type == "meter" ? 180 : 360,
      rotation: chartMeta.chartInfo.chart_type == "meter" ? -90 : 0,

      plugins: {
        legend: {
          display:
            chartMeta.chartInfo.legend_display &&
            !chartMeta.chartInfo.only_chart
              ? true
              : false,
          responsive: false,
          position: chartMeta.chartInfo.legend_position
            ? chartMeta.chartInfo.legend_position
            : "top",
          labels: {
            boxWidth: chartMeta.chartInfo.box_width
              ? chartMeta.chartInfo.box_width
              : "10",
            padding: chartMeta.chartInfo.legend_padding
              ? chartMeta.chartInfo.legend_padding
              : "10",
            font: {
              size: chartMeta.chartInfo.legend_font_size
                ? chartMeta.chartInfo.legend_font_size
                : "10",
            },
            // useBorderRadius:true
          },
          align: chartMeta.chartInfo.legend_align
            ? chartMeta.chartInfo.legend_align
            : "center",
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
          formatter: (value, context) => {
            console.log(value, context, "value and context");
            const datapoints = context.dataset.data;
            const sanitizedDatapoints = datapoints.map((datapoint) =>
              datapoint === undefined ? 0 : datapoint
            );
            let val = value ? value : 0;
            function totalSum(total, datapoint) {
              return total + datapoint;
            }
            const totalValue = sanitizedDatapoints.reduce(totalSum, 0);
            console.log(sanitizedDatapoints, "sanitized data points");

            const percentages = sanitizedDatapoints.map(
              (datapoint) => (datapoint / totalValue) * 100
            );
            console.log(percentages, "formatted percentages");
            let rounded = percentages.map((p) =>
              p < 1 && p !== 0 ? 1 : Math.round(p)
            );
            console.log(rounded, "rounded value is here");
            let total = rounded.reduce((acc, val) => acc + val, 0);
            const target = 100;
            console.log(total, "total is here");
            if (total > 0) {
              while (total !== target) {
                const diff = target - total;

                // Find index of the element to adjust
                let index =
                  diff > 0
                    ? rounded.indexOf(Math.min(...rounded)) // Add 1 to the smallest value
                    : rounded.indexOf(Math.max(...rounded)); // Subtract 1 from the largest value

                rounded[index] += diff > 0 ? 1 : -1;
                total = rounded.reduce((acc, val) => acc + val, 0);
              }
            }
            console.log(rounded, "rounded is here");
            let percentageIndex = sanitizedDatapoints.indexOf(val);
            console.log(percentageIndex, "index of percentage");

            if (chartMeta.chartInfo.value_percentage === true) {
              return `${rounded[percentageIndex]}%`;
            } else {
              return "";
            }
          },
          display:
            chartMeta.chartInfo.compact_view || chartMeta.chartInfo.only_chart
              ? false
              : true,
          color: chartMeta.chartInfo.datalabel_color
            ? chartMeta.chartInfo.datalabel_color
            : "black",

          font: {
            size: chartMeta.chartInfo.datalabel_font_size
              ? chartMeta.chartInfo.datalabel_font_size
              : "12",
          },

          textStrokeColor: "black", // <-- added this
          textStrokeWidth: 0.5,
        },
      },
    };
    let CombinedData;
    let customlegendData;
    if (Data && Data.datasets?.length > 0) {
      CombinedData = Data;

      CombinedData.datasets[0].labels = Data.labels;
      console.log(CombinedData, "combo is here");

      CombinedData.datasets[0].data = CombinedData.datasets[0].data.map(
        (item) => {
          console.log(item, "each data");

          return item === undefined || item === "" ? 0 : item;
        }
      );
      const totalSum = CombinedData.datasets[0].data.reduce(
        (acc, curr) => acc + curr,
        0
      );
      console.log(totalSum, "total sum");

      let percentages = CombinedData.datasets[0].data.map((item) => {
        console.log(item, "data of per");
        return (item / totalSum) * 100;
      });
      console.log(percentages, "first percentage");

      // percentages = percentages.toFixed(2);

      function normalizePercentages(percentages) {
        // Step 1: Round each percentage, ensuring values less than 1 but not 0 are set to 1
        let rounded = percentages.map((p) =>
          p < 1 && p !== 0 ? 1 : Math.round(p)
        );

        // Step 2: Calculate the total sum of the rounded percentages
        let total = rounded.reduce((acc, val) => acc + val, 0);
        const target = 100;
        console.log(total, "total is here");

        // Step 3: Adjust the total to make it exactly 100
        if (total > 0) {
          while (total !== target) {
            const diff = target - total;

            // Find index of the element to adjust
            let index =
              diff > 0
                ? rounded.indexOf(Math.min(...rounded)) // Add 1 to the smallest value
                : rounded.indexOf(Math.max(...rounded)); // Subtract 1 from the largest value

            rounded[index] += diff > 0 ? 1 : -1;
            total = rounded.reduce((acc, val) => acc + val, 0);
          }
        }

        return rounded;
      }
      percentages = normalizePercentages(percentages);
      console.log(percentages, "second percentage");

      percentages.map((items) => {
        if (items < 1 && items != 0) {
          return 1;
        } else {
          return items;
        }
      });

      CombinedData.datasets[0].percentage = percentages;

      console.log(percentages, "percentages are here");

      customlegendData = CombinedData.datasets[0].labels.map((item, index) => {
        console.log(CombinedData, "combined data");

        return {
          label: item,
          data: chartDataArray[index] ? chartDataArray[index] : 0,
          backgroundColor:
            CombinedData?.datasets?.[0]?.backgroundColor?.[index],
          percentage: CombinedData.datasets[0].percentage[index],
        };
      });
    }
    console.log(customlegendData, "bar legend data");

    const handleMouseEnter = () => {
      setTooltipVisible(true);
    };
    const handleMouseLeave = () => {
      setTooltipVisible(false);
    };

    const updateFinalExpression = (newvalue) => {
      setFinalExpression(newvalue);
    };
    // if (chartMeta.chartInfo.chart_type == "gauge") {
    //   console.log("condition guage");
    //   return (
    //     <MeterChart
    //       ChartMeta={chartMeta}
    //       ChartData={chartData}
    //       circum={circum}
    //       chartFilter={chartFilter}
    //       fiscalYearFilter={setfiscalYearFilter}
    //       finalExpression={finalExpression}
    //       updateFinalExpression={updateFinalExpression}
    //     />
    //   );
    // }
    if (chartMeta.chartInfo.chart_type == "heatmap") {
      return (
        <HeatMap
          ChartMeta={chartMeta}
          ChartData={chartData}
          default_filter={default_filter}
          customRender={props.customRender}
          type={props.type}
        />
      );
    }
    if (chartMeta.chartInfo.chart_type == "trend" && chartMeta && chartData) {
      console.log(chartData, "raw2data");

      return (
        <MultilineChart
          // fallback={<Breathing />}
          ChartMeta={chartMeta}
          ChartData={chartData}
          onClick={handleClick}
          chartRef={chartRef}
          yearProp={props.yearProp}
          default_filter={default_filter}
          chartType={props.chartType}
        />
      );
    }
    if (chartMeta.chartInfo.chart_type == "mixedChart") {
      return (
        <MixedChart
          chartMeta={chartMeta}
          chartDataArray={chartDataArray}
          chartLabelArray={chartLabelArray}
        />
      );

      console.log("mixed chart");
    }
    console.log(chartMeta.chartInfo.chart_type, "typer");

    if (chartMeta.chartInfo.chart_type == "bubble") {
      console.log("first bubble");

      return <BubbleChart ChartMeta={chartMeta} ChartData={chartData} />;
    }
    console.log(legendToggle, "legend toggle");

    // const card = document.getElementById("col1");
    // console.log(card.offsetWidth, "column width");
    // console.log(colref, "column ref");
    let transparent = {
      background: "transparent",
      border: "none",
      boxShadow: "none",
    };
    let CardStyle = {
      boxShadow: "",
    };
    console.log(isSuccess, chart, "chart api message");
    let totalValues =
      chartDataArray?.length > 0
        ? chartDataArray.reduce((items, current) => items + current)
        : 0;
    console.log(totalValues, "t7500");

    // const speakText = () => {
    //   if ("speechSynthesis" in window) {
    //     const utterance = new SpeechSynthesisUtterance(aiValue);
    //     utterance.lang = "en-US"; // Adjust language if needed
    //     window.speechSynthesis.speak(utterance);
    //   } else {
    //     alert("Your browser does not support speech synthesis.");
    //   }
    // };
    console.log(isError, chartMeta, chartData, "is-chart-error");

    if (chartMeta && chartData?.length > 0 && chartApiError == false) {
      console.log("having chart data");

      return (
        <>
          {chartMeta.chartInfo.chart_type != "guage" && (
            <>
              <Card
                className={
                  chartMeta.chartInfo.transparent ||
                  chartMeta.chartInfo.only_chart
                    ? "flex-fill w-100"
                    : "flex-fill w-100 reportChart-cards"
                }
                id={chartMeta.chartInfo.chart_name}
                style={
                  chartMeta.chartInfo.transparent ||
                  chartMeta.chartInfo.only_chart
                    ? transparent
                    : CardStyle
                }
                // style={{ boxShadow: "0px 0px 8px" }}
              >
                {!chartMeta.chartInfo.only_chart && (
                  <Card.Header
                    className="m-0 p-0 ms-1 me-1 mt-1"
                    style={
                      chartMeta.chartInfo.transparent ||
                      chartMeta.chartInfo.only_chart
                        ? transparent
                        : CardStyle
                    }
                  >
                    <Row
                      className={
                        chartMeta.chartInfo.transparent ||
                        chartMeta.chartInfo.only_chart
                          ? "m-0 p-0 w-100"
                          : "m-0 p-1 w-100"
                      }
                    >
                      <Col
                        id="col1"
                        ref={colref}
                        className="m-0 ps-0 pt-1"
                        xs={10}
                        // sm={10}
                        // md={10}
                        title={chartMeta.chartInfo.chart_title}
                      >
                        <>
                          <h5
                            className={
                              isTooltipVisible == false ? "text-truncate" : ""
                            }
                            id="chartTitle"
                            ref={titleRef}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          >
                            {t(chartMeta.chartInfo.chart_title)}
                          </h5>

                          {/* {chartMeta.chartInfo.chart_title &&
                          chartMeta.chartInfo.chart_title.length <=
                            titleLength && (
                            <h4>{chartMeta.chartInfo.chart_title}</h4>
                          )} */}
                        </>
                      </Col>
                      {chartMeta.chartInfo.compact_view == true &&
                        chartMeta.chartInfo.chart_type !== "bar" && (
                          <Col
                            xs={1}
                            className="m-0 p-0 d-flex align-items-end justify-content-end"
                          >
                            <Button
                              variant="link"
                              size="xs"
                              className="p-0 m-0"
                              onClick={() => setLegendToggle(!legendToggle)}
                            >
                              <FontAwesomeIcon
                                icon={
                                  legendToggle ? faScaleBalanced : faPercentage
                                }
                              />
                            </Button>
                          </Col>
                        )}

                      <Col
                        // sm={2}
                        // md={2}
                        className="me-1 p-0 d-flex align-items-center justify-content-end "
                      >
                        <Dropdown align="end">
                          <Dropdown.Toggle as="a" bsPrefix="-">
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() =>
                                downloadChart(
                                  chartMeta.chartInfo.chart_name,
                                  chartMeta.chartInfo.chart_title
                                )
                              }
                            >
                              <Row>
                                <Col xs={2}>
                                  <FontAwesomeIcon icon={faDownload} />
                                </Col>
                                <Col>{t("Download")}</Col>
                              </Row>
                            </Dropdown.Item>
                            {util.getCurrentUser()?.id ==
                              chartMeta.chartInfo.created_by && (
                              <Dropdown.Item
                                onClick={() =>
                                  navigate(
                                    "/form/chartdesigner?id=" +
                                      chartMeta.chartInfo.chart_id
                                  )
                                }
                              >
                                <Row className="">
                                  <Col xs={2} className="m-0">
                                    <FontAwesomeIcon icon={faPencil} />
                                  </Col>
                                  <Col>{t("Configure")}</Col>
                                </Row>
                              </Dropdown.Item>
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </Card.Header>
                )}
                <Card.Body className="d-flex ">
                  {chartData.length > 0 && (
                    <div className="align-self-center w-100">
                      {" "}
                      {chartMeta.chartInfo.chart_type == "bar" &&
                        !chartMeta.chartInfo.detailed_legend_display && (
                          <BarChart
                            chartRef={chartRef}
                            chartDataArray={chartDataArray}
                            options={options}
                            data={Data}
                            chartMeta={chartMeta}
                            customlegendData={customlegendData}
                            onClick={handleClick}
                            legendToggle={legendToggle}
                            background={background}
                            colorArray={colorArray}
                          />
                        )}
                      {chartMeta.chartInfo.chart_type == "line" && (
                        <div id={chartMeta.chartInfo.chart_name}>
                          <div
                            className="align-self-center w-100"
                            id={chartMeta.chartInfo.chart_name}
                          >
                            <Line
                              options=""
                              data={Data}
                              onClick={handleClick}
                              ref={chartRef}
                            />
                          </div>
                        </div>
                      )}
                      {chartMeta.chartInfo.chart_type == "radar" && (
                        <div className="align-self-center w-100">
                          <Radar
                            options={Doughnut_Pie_Guage_Options}
                            data={Data}
                            onClick={handleClick}
                            ref={chartRef}
                          />
                        </div>
                      )}
                      {chartMeta.chartInfo.chart_type == "pie" && (
                        <PieChart
                          chartRef={chartRef}
                          options={Doughnut_Pie_Guage_Options}
                          data={Data}
                          chartMeta={chartMeta}
                          customlegendData={customlegendData}
                          onClick={handleClick}
                          legendToggle={legendToggle}
                        />
                      )}
                      {chartMeta.chartInfo.chart_type == "doughnut" && (
                        <DoughnutChart
                          chartRef={chartRef}
                          options={Doughnut_Pie_Guage_Options}
                          data={Data}
                          legendToggle={legendToggle}
                          chartMeta={chartMeta}
                          customlegendData={customlegendData}
                          onClick={handleClick}
                          Runtimevalue={Runtimevalue}
                        />
                      )}
                      {chartMeta.chartInfo.chart_type == "meter" && (
                        <MeterChart
                          chartRef={chartRef}
                          options={Doughnut_Pie_Guage_Options}
                          data={Data}
                          legendToggle={legendToggle}
                          chartMeta={chartMeta}
                          customlegendData={customlegendData}
                          onClick={handleClick}
                          Runtimevalue={Runtimevalue}
                        />
                      )}
                      {chartMeta.chartInfo.chart_type == "gauge" && (
                        <GaugeChart
                          chartRef={chartRef}
                          options={Doughnut_Pie_Guage_Options}
                          data1={chartData}
                          legendToggle={legendToggle}
                          chartMeta={chartMeta}
                          customlegendData={customlegendData}
                          onClick={handleClick}
                          setDrillDownReports={setDrillDownReports}
                          setShowModal={setShowModal}
                          defaultFilter={props.defaultFilter}
                        />
                      )}
                    </div>
                  )}
                </Card.Body>
                {chartMeta.chartInfo?.pro_nova_enabled && (
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleAIClick}
                    // style={{ background: "transparent", border: "none", padding: 0 }}
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      right: "15px",
                      cursor: "pointer",
                      // fontSize: "18px",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    <img
                      src={aiImage}
                      alt="AI"
                      style={{
                        width: "50px",
                        height: "50px",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                )}
                <Modal
                  show={showaiModal}
                  onHide={() => setShowaiModal(false)}
                  centered
                  backdrop="static"
                >
                  <Modal.Body>
                    {/* <button
                      // onClick={speakText()}
                      onClick={() => speakText(aiValue)}
                      className="btn btn-primary mt-2"
                    >
                      🔊 Speak
                    </button> */}
                    {loading ? (
                      <>
                        <h3
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            marginBottom: "20px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            ProNova Analyzing{" "}
                            {/* <Random
                              text="...."
                              effect="verticalFadeIn"
                              effectDirection="up"
                              effectChange={3.0}
                            /> */}
                          </div>
                        </h3>
                        <div
                          style={{
                            position: "relative",
                            textAlign: "center",
                            marginTop: "20px",
                          }}
                        >
                          {/* Circular Gradient Loader */}
                          <div
                            style={{
                              position: "relative",
                              width: "130px",
                              height: "130px",
                              borderRadius: "50%",
                              background:
                                "radial-gradient(circle, rgba(255, 255, 255, 0.1) 30%, transparent 70%)",
                              boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
                              display: "inline-block",
                            }}
                          >
                            <Spinner
                              animation="border"
                              role="status"
                              size="lg"
                              style={{
                                width: "120px",
                                height: "120px",
                                borderTop: "7px solid #2bdcde",
                                borderRight: "7px solid #2bdcde",
                                borderBottom: "7px solid #6382e6",
                                borderLeft: "7px solid #6382e6",
                                display: "inline-block",
                              }}
                            />
                          </div>
                          <img
                            src={aiImage}
                            alt="AI"
                            style={{
                              width: "120px",
                              height: "120px",
                              opacity: 0.8,
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      // chartMeta.chartInfo.chart_type == "gauge" && (
                      //   <div>
                      //     <MeterChart
                      //       chartRef={chartRef}
                      //       options={Doughnut_Pie_Guage_Options}
                      //       data1={chartData}
                      //       legendToggle={legendToggle}
                      //       chartMeta={chartMeta}
                      //       customlegendData={customlegendData}
                      //       onClick={handleClick}
                      //     />

                      //   </div>
                      // )
                      <>
                        <Row className="w-100 d-flex justify-content-center">
                          <div className="">
                            <Row className="m-0 p-0">
                              <Col className="">
                                <h3
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "15px",
                                  }}
                                >
                                  ProNova Suggestion
                                </h3>
                              </Col>
                            </Row>
                            {prevTotalValue != 0 && (
                              <Col className="d-flex justify-content-center align-items-center  pe-0">
                                <div className="d-flex justify-content-center ">
                                  <span
                                    className="mt-2 me-1 pe-1"
                                    style={{ fontSize: "20px" }}
                                  >
                                    V/S last year{" "}
                                  </span>
                                  <h3
                                    className="mt-1 me-1 pe-1"
                                    style={{ fontSize: "30px" }}
                                  >
                                    {" "}
                                    (
                                    {
                                      chartMeta.chartInfo
                                        .comparison_column_value
                                    }
                                    )
                                  </h3>
                                  <h3
                                    className="mt-1 me-1 py-0"
                                    style={{ fontSize: "30px" }}
                                  >
                                    {Math.abs(prevTotalValue)}%
                                  </h3>
                                  {prevTotalValue != 0 && (
                                    <div
                                      className="d-flex justify-content-center align-items-center"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                      }}
                                    >
                                      {" "}
                                      <FontAwesomeIcon
                                        className="fa-solid fa-5X"
                                        style={{
                                          color:
                                            prevTotalValue < 0
                                              ? "red"
                                              : "#50C878",
                                          // width: "100px",
                                        }}
                                        size="3x"
                                        icon={
                                          prevTotalValue < 0
                                            ? faArrowTrendDown
                                            : faArrowTrendUp
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              </Col>
                            )}
                          </div>
                        </Row>
                        <Row className="mt-3">
                          <div style={{ whiteSpace: "pre-wrap" }}>
                            {aiValue}
                          </div>
                        </Row>
                        <Button
                          variant="primary"
                          className="float-end variant"
                          hidden={loading ? true : false}
                          onClick={() => setShowaiModal(false)}
                        >
                          Close
                        </Button>
                      </>
                    )}
                  </Modal.Body>
                </Modal>
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
                    {t("Close")}
                  </Button>
                </Modal.Header>
                <Modal.Body size="lg">
                  <ReportRuntime
                    report={chartMeta && chartMeta.chartInfo.report_name}
                    ChartdrilldownReports={reportFilter}
                    yearProp={props.yearProp}
                  />
                </Modal.Body>
              </Modal>
            </>
          )}
        </>
      );
    }
  }
  if (isLoading) {
    const shimmerCount = 1;
    const colSize = 12;
    const ShimmerCard = ({ colSize }) => (
      <Col xl={colSize} lg={colSize} md={colSize} sm={12} className="d-flex">
        <Card
          className={"flex-fill w-100"}
          // style={{
          //   background: "transparent",
          //   border: "none",
          //   boxShadow: "none",
          // }}
        >
          <Card.Header className="p-2">
            <div className="shimmer shimmer-card-header"></div>
          </Card.Header>
          <Card.Body className="p-2">
            <div className="shimmer shimmer-card-body"></div>
          </Card.Body>
        </Card>
      </Col>
    );
    return (
      <Row className="p-0 m-0">
        {Array.from({ length: shimmerCount }).map((_, index) => (
          <ShimmerCard key={index} colSize={colSize} />
        ))}
      </Row>
    );
  }
  if (chartApiError == true) {
    return (
       <Card
        // style={{
        //   background: "transparent",
        //   border: "none",
        //   boxShadow: "none",
        //   width: "100%",
        //   height: "100%",
        // }}
      >
        <CardHeader className="m-0 p-0"></CardHeader>
        <Card.Body
          className="p-0 m-0 d-flex flex-column align-items-center justify-content-center"
          style={{ maxWidth: "100%", overflow: "hidden" }}
        >
          <Row>
            <Col xs={5}>
              <img
                className="m-0 p-0"
                src={theme === "dark" ? Whitechart : DarkChart}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Col>
            <Col className="d-flex align-items-center justify-content-center">
              <h5 className="text-center ">No Chart Data to Display</h5>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
  if (isSuccess && (!data || data.data?.length == 0)) {
    console.log(chartMeta, "chartMeta--isSuccess");

    return (
      <Card
      className="flex-fill w-100"
        // style={{
        //   background: "transparent",
        //   border: "none",
        //   boxShadow: "none",
        //   width: "100%",
        //   height: "100%",
        // }}
      >
        <CardHeader className="m-0 p-0"></CardHeader>
        <Card.Body
          className="p-0 m-0 d-flex flex-column align-items-center justify-content-center"
          style={{ maxWidth: "100%", overflow: "hidden" }}
        >
          <Row>
            <Col xs={5}>
              <img
                className="m-0 p-0"
                src={theme === "dark" ? Whitechart : DarkChart}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Col>
            <Col className="d-flex align-items-center justify-content-center">
              <h5 className="text-center ">No Chart Data to Display</h5>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
};
const queryClient = new QueryClient();
const SimpleChartPage = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Charts {...props} />
    </QueryClientProvider>
  );
};

export default SimpleChartPage;
