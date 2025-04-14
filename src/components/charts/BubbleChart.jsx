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
import usePalette from "src/hooks/usePalette";
import { Card, Modal } from "react-bootstrap";

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
const BubbleChart = ({ ChartMeta, ChartData }) => {
    const palette = usePalette();
console.log(ChartMeta,"bubble meta")
  let resultantData = ChartData.map((items) => {
    console.log(items,"chart data");
    
    return {
      x: items[ChartMeta.chartInfo.x_column],
      y: items[ChartMeta.chartInfo.y_column],
      r: items[ChartMeta.chartInfo.radius_column
],
    };
  });

  let data = {
    datasets: [],
  };
  data.datasets.push({
    label: "",
    data: resultantData,
    backgroundColor: ["yellow","green","orange","red"],
  });

  console.log(data, "bubble data");

   const options = {
      maintainAspectRatio: false,
       cornerRadius: 15,
       responsive: true,
  plugins: {
        legend: {
          display: ChartMeta.chartInfo.legend_display ? true : false,
          responsive: true,
          position: ChartMeta.chartInfo.legend_position
            ? ChartMeta.chartInfo.legend_position
            : "top",
          labels: {
            boxWidth: ChartMeta.chartInfo.box_width
              ? ChartMeta.chartInfo.box_width
              : "10",
            padding: ChartMeta.chartInfo.legend_padding
              ? ChartMeta.chartInfo.legend_padding
              : "10",
            font: {
              size: ChartMeta.chartInfo.legend_font_size
                ? ChartMeta.chartInfo.legend_font_size
                : "10",
            },
            // useBorderRadius:true
          },
          align: ChartMeta.chartInfo.legend_align
            ? ChartMeta.chartInfo.legend_align
            : "center",
        },
        title: {
          display: false,
          align: "start",
          position: "top",
          font: { weight: "bold", size: 14 },
          text: ChartMeta.chartInfo.chart_title,
          color: "grey",
        },

        datalabels: {
          display: ChartMeta.chartInfo.datalabel_display,
          anchor: ChartMeta.chartInfo.datalabel_align
            ? ChartMeta.chartInfo.datalabel_align
            : "end",
          align: ChartMeta.chartInfo.datalabel_position
            ? ChartMeta.chartInfo.datalabel_position
            : "top",

          color: ChartMeta.chartInfo.datalabel_color
            ? ChartMeta.chartInfo.datalabel_color
            : palette["primary"],

          font: {
            size: ChartMeta.chartInfo.datalabel_font_size
              ? ChartMeta.chartInfo.datalabel_font_size
              : "14",
          },
        },
      },
      scales: {
        y: {
          grid: {
         display: ChartMeta.chartInfo?.y_grid ==true ? true : false,
          },
       
          title: {
            display: ChartMeta?.chartInfo?.y_title,
            text: ChartMeta?.chartInfo?.y_title,
          },
     
        },
        x: {
          grid: {
            display: ChartMeta.chartInfo?.x_grid ==true ? true : false,
          },
       
          title: {
            display: ChartMeta?.chartInfo?.x_title,
            text: ChartMeta?.chartInfo?.x_title,
          },
      
        },
      },
      //  onClick: (event, elements) => onClick(event, elements),
    };
  return (
    <Card className="flex-fill reportChart-cards">
      <Card.Header>
        <h5>{ChartMeta.chartInfo.chart_title}</h5>
      </Card.Header>
      <Card.Body className="d-flex">
        <div className="align-self-center w-100">
          <div className="chart chart-lg">
            <Chart type="bubble" data={data} options={options} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BubbleChart;
