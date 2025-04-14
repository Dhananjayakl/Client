import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
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
import { Breathing } from "react-shimmer";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";

import {
  Bar,
  getElementAtEvent,
  getDatasetAtEvent,
  Pie,
  Doughnut,
} from "react-chartjs-2";
import { Row, Col } from "react-bootstrap";
import ChartDataLabels from "chartjs-plugin-datalabels";
import useTheme from "src/hooks/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquare,
  faCircle,
  faRectangleAd,
} from "@fortawesome/free-solid-svg-icons";
import { LogIn } from "react-feather";
import { chartSData } from "./Chart";
// import { display } from "html2canvas/dist/types/css/property-descriptors/display";

const GaugeChart = ({
  data1,
  chartMeta,
  onClick,
  chartRef,
  setDrillDownReports,
  setShowModal,
  defaultFilter,
}) => {
  console.log(data1, chartMeta, "datas 123");
  const chartData = data1;
  let gaugeValue =
    chartMeta &&
    chartMeta?.gauge.map((items) => {
      return {
        display: items.gauge_value,
        background_color: items.gauge_background_color,
      };
    });
  console.log(gaugeValue, "gauge Value spider");
  let statusFlag = false;
  let closestItem = null;
  let minDifference = Infinity;
  let rating = chartData[0].Rating;
  let closestIndex = -1;
  gaugeValue?.forEach((item, index) => {
    if (item.display >= rating) {
      let difference = Math.abs(item.display - rating);
      if (difference < minDifference) {
        minDifference = difference;
        closestItem = item;
        closestIndex = index;
      }
    }
  });
  console.log(gaugeValue, "g123");
  console.log(chartMeta.chartInfo.chart_size, "chart--meta--gauge");

  // Use the closest item to determine the statusDisplay
  let statusDisplay = gaugeValue?.map((items, index) => {
    if (index === closestIndex) {
      console.log(items, "items are here");
      statusFlag = true;
      return {
        display: chartMeta.gauge[index].gauge_title,
        background_color: chartMeta.gauge[index].gauge_background_color,
      };
    }
    return null;
  });

  // Remove any null values from the statusDisplay array
  statusDisplay = statusDisplay.filter((item) => item !== null);
  // console.log(statusDisplay, "status display is here");
  let ratingValue = chartData[0].Rating;
  let ratingArray = [];
  ratingArray[0] = 100 - ratingValue;
  ratingArray[1] = ratingValue;
  // console.log(ratingArray, "rating array");

  const data = {
    labels: ["yes"],
    datasets: [
      {
        label: "Poll",
        data: [ratingArray[1], ratingArray[0]],
        backgroundColor: [statusDisplay[0].background_color, "grey"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "83%",
    borderRadius: "20",
    layout: {
      padding: 2,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      doughnutPointer: {
        pointerTarget: 10,
        pointerColor: "grey",
        pointerRadius: 5,
        textColor: "red",
      },
      datalabels: {
        display: false,
      },
    },
  };
  const backgroundCircle = {
    id: "backgroundCircle",
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const { ctx } = chart;
      ctx.save();

      const xCoor = chart.getDatasetMeta(0).data[0].x;
      const yCoor = chart.getDatasetMeta(0).data[0].y;
      const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
      const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
      const width = outerRadius - innerRadius;
      const angle = Math.PI / 180;
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.strokeStyle = "grey";
      ctx.arc(xCoor, yCoor, innerRadius + 7.8, 0, angle * 360, false);
      ctx.stroke();
    },
  };
  const textCenterPlugin = {
    id: "textCenter",
    afterDraw(chart) {
      const { width, height } = chart;
      const ctx = chart.ctx;
      ctx.restore();
      const text2 = `${data.datasets[0].data[0]}%`;
      const text1 = statusDisplay[0].display;
      const textX = width / 2; // Center horizontally
      const textY1 = height / 2.5 - 10; // Adjust vertical position for the first line
      const textY2 = height / 2.0 + 15; // Adjust vertical position for the second line
      ctx.fillStyle = statusDisplay[0].background_color; // Text color
      ctx.font = `${(height / 150).toFixed(2)}em Arial`; // Smaller font size for "Total"
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(text1, textX, textY1);
      // Draw the second text (larger size for the total count)
      ctx.font = `${(height / 70).toFixed(2)}em Arial`; // Larger font size for the total count
      ctx.fillText(text2, textX, textY2);

      ctx.save();
    },
  };
  console.log(chartMeta.gauge, "yuna");
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

      let dataDrillDown = data1.labels[dataPoint];
      console.log(dataDrillDown, "data drill down");

      setDrillDownReports({
        [chartMeta.chartInfo.x_column]: data1.labels[dataPoint],
        [chartMeta.chartInfo.x_sub_column]:
          data1.datasets[datasetIndexNum].label,
      });
    } else if (!chartMeta.chartInfo.x_sub_column && defaultFilter) {
      console.log("filter condition 2");

      setDrillDownReports({
        [chartMeta.chartInfo.x_column]: data1.labels[dataPoint],
        ...defaultFilter,
      });
    } else {
      console.log("filtering condition 3");
      console.log(data1, "gauge-data");
      console.log(data1[0].Rating, "rating-457");
      const RatingValue = data1[0].Rating;
      gaugeValue?.forEach((item, index) => {
        if (item.display >= RatingValue) {
          let difference = Math.abs(item.display - rating);
          if (difference < minDifference) {
            minDifference = difference;
            closestItem = item;
            closestIndex = index;
          }
        }
      });
      console.log(gaugeValue, "g123");

      // Use the closest item to determine the statusDisplay
    }

    if (chartMeta.chartInfo.report_name) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
    // }
  };
  return (
    <div className="align-self-center w-90">
      <div className="py-3">
        <Row>
          <Col>
            <div
              className={
                chartMeta.chartInfo.chart_size
                  ? chartMeta.chartInfo.chart_size
                  : "chart chart-sm"
              }
            >
              <Doughnut
                ref={chartRef}
                key={JSON.stringify(data)} // Force re-render when data changes
                data={data}
                onClick={handleClick}
                options={options}
                plugins={[textCenterPlugin, backgroundCircle]}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center align-items-center ">
            {/* <span style={{ color: "rgb(37, 150, 190)" }}>▲ 2% </span> */}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default GaugeChart;
