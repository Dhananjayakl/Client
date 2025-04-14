import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  TimeScale,
} from "chart.js";
import { Chart, getElementAtEvent, Bar, Bubble, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";

import { Card, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HeatMapModal from "./HeatMapModal";
import {
  faExpand,
  faFilter,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import { CloudSnowFill } from "react-bootstrap-icons";
import { getEffectiveTypeParameterDeclarations } from "typescript";
import { LogIn } from "react-feather";
// import "chartjs-adapter-moment";

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
let index = "x";
const MixedChart = ({ chartMeta, chartDataArray, chartLabelArray }) => {
  const data = {
    labels: [],
    datasets: [],
  };
  console.log(chartMeta, "mixed execute");
  data.datasets.push(
    {
      label: chartMeta.chartInfo.x_title + " " + "Values",
      data: chartDataArray,
      fill: chartMeta.chartInfo.fill,
      borderColor: chartMeta.chartInfo.line_border_color
        ? chartMeta.chartInfo.line_border_color
        : colorArray[1],
      pointBorderColor: chartMeta.chartInfo.pointer_color
        ? chartMeta.chartInfo.pointer_color
        : colorArray[0],
      pointBorderWidth: chartMeta.chartInfo.point_radius
        ? chartMeta.chartInfo.point_radius * 2
        : 0,
      pointRadius: chartMeta.chartInfo.point_radius
        ? chartMeta.chartInfo.point_radius
        : 0,
      tension: chartMeta.chartInfo.tension
        ? chartMeta.chartInfo.tension
        : "0.1",
      borderWidth: chartMeta.chartInfo.line_border_width
        ? chartMeta.chartInfo.line_border_width
        : "3",
    },
    {
      label: chartMeta.chartInfo.x_title + " " + "Values",
      data: chartDataArray,
      borderColor: colorArray[9],
      backgroundColor: chartMeta?.columns[index]?.background_color
        ? chartMeta.columns[index]?.background_color
        : colorArray,
      // pointBorderColor: chartMeta.chartInfo.pointer_color
      //   ? chartMeta.chartInfo.pointer_color
      //   : colorArray[2],
      // pointBorderWidth: 3,
      // pointRadius: 5,
      // borderWidth: 3,
      // tension: 0,
      hoverOffset: chartMeta.chartInfo.hover_value
        ? chartMeta.chartInfo.hover_value
        : "",
      type: "bar",
      barPercentage: 0.3,
      barThickness: 25,
      maxBarThickness: 30,
    }
  );
  data.labels = chartLabelArray;

  const options = {
    maintainAspectRatio: false,
    // cornerRadius: 15,
    // responsive: true,

    plugins: {
      legend: {
        display: chartMeta.chartInfo.legend_display ? true : false,
        responsive: true,
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

      //   datalabels: {
      //     display: chartMeta.chartInfo.datalabel_display,
      //     anchor: chartMeta.chartInfo.datalabel_align
      //       ? chartMeta.chartInfo.datalabel_align
      //       : "end",
      //     align: chartMeta.chartInfo.datalabel_position
      //       ? chartMeta.chartInfo.datalabel_position
      //       : "top",

      //     color: chartMeta.chartInfo.datalabel_color
      //       ? chartMeta.chartInfo.datalabel_color
      //       : palette["primary"],

      //     font: {
      //       size: chartMeta.chartInfo.datalabel_font_size
      //         ? chartMeta.chartInfo.datalabel_font_size
      //         : "14",
      //     },
      //   },
    },

    indexAxis: index,
    scales: {
      y: {
        grid: {
          display: chartMeta.chartInfo.y_grid == null ? false : true,
        },
        stacked: chartMeta.chartInfo.y_stack == true ? true : false,
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
        stacked: chartMeta.chartInfo.x_stack == true ? true : false,
        title: {
          display: chartMeta.chartInfo.x_title,
          text: chartMeta.chartInfo.x_title,
        },
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
    //  onClick: (event, elements) => onClick(event, elements),
  };

  return (
    <Card className="flex-fill reportChart-cards">
      <Card.Header>
        <h5>test for bubble</h5>
      </Card.Header>
      <Card.Body className="d-flex">
        <div className="align-self-center w-100">
          <div className="chart chart-lg">
            <Chart type="line" data={data} options={options} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
export default MixedChart;
