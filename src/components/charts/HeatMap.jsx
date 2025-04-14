import React, { useEffect, useState } from "react";
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
import { Chart, getElementAtEvent, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { useTranslation } from "react-i18next";
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
  MatrixElement,
  ChartDataLabels
);

const HeatMap = (props) => {
  const { t } = useTranslation("common");
  const ChartMeta = props.ChartMeta;
  const ChartData = props.ChartData;
  const data = {
    labels: [],
    datasets: [],
  };

  const AdditionalData = ChartData.map((items) => {
    if (items.json_agg) {
      return items.json_agg;
    }
  });

  let [HeatMapDrillDown, setHeatMapDrillDown] = React.useState();
  const [fullscreen, setfullScreen] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [colors, setcolors] = React.useState();
  const [showModal, setShowModal] = React.useState(false);
  const [mutate, setMutate] = useState("");
  const chartRef = React.useRef(null);

  const handleClick = (event, element) => {
    if (getElementAtEvent(chartRef.current, event).length > 0) {
      const datasetIndexNum = getElementAtEvent(chartRef.current, event);

      const dataPoint = getElementAtEvent(chartRef.current, event)[0].index;

      setHeatMapDrillDown({
        data: data.datasets[0].data[dataPoint],
        backgroundColor: data.datasets[0].backgroundColor,
      });
      const message = `Clicked on dataset index ${datasetIndexNum}, data point ${dataPoint}`;

      setShowModal(true);
    }
  };

  const handleClose = () => setShowModal(false);
  const handlefullscreen = () => {
    setfullScreen(!fullscreen);
  };

  const finalData = ChartMeta.heatMaps.map((items) => {
    for (const key in items) {
      // console.log(key, "betakey");
      if (key == "xvalue") {
        items.x = items[key];
        delete items[key];
      }
      if (key == "yvalue") {
        items.y = items[key];
        delete items[key];
      }
    }
    return items;
  });

  const size = parseInt(ChartMeta.chartInfo.matrix_type);

  data.labels.push(["verylow", "low", "medium", "high"]);
  data.datasets.push({
    label: ChartMeta.chartInfo.chart_title,
    data: finalData,
    borderColor: "grey",
    borderWidth: 0.5,
    width: ({ chart }) => (chart.chartArea || {}).width / size - 1,
    height: ({ chart }) => (chart.chartArea || {}).height / size - 1,
    backgroundColor({ raw }) {
      const color = ChartMeta.heatMaps.find((item, index) => {
        return item.x == raw.x && item.y == raw.y;
      });

      if (color) {
        return color.background_color;
      } else {
        return null; // Or any other default value when no match is found
      }
    },
  });

  const drawArrow = (props) => ({
    id: "drawArrow",

    afterDatasetsDraw: (chart) => {
      const { ChartMeta, AdditionalData } = props;

      const ctx = chart.ctx;

      ctx.save(); // Save the state
      let totalCount = 0;
      const dataset = chart.getDatasetMeta(0);

      // Check if the current chart's data warrants an arrow being drawn

      const DataLabelValue = AdditionalData.filter((data) => {
        return dataset.data.map((items) => {
          return (
            data[0][ChartMeta.chartInfo.x_column] == items.$context.parsed.x &&
            data[0][ChartMeta.chartInfo.y_column] == items.$context.parsed.y
          );
        });
      });

      if (DataLabelValue.length === 0 || !ChartMeta.chartInfo.transition) {
        // If no data or transition is false, don't draw the arrow
        return;
      }

      // Calculate and draw arrow
      DataLabelValue.forEach((obj) => {
        totalCount += Object.keys(obj).length;
      });

      if (totalCount > 0) {
        const fromCell = dataset.data
          .map((items) => {
            if (
              items.$context.parsed.x ==
                DataLabelValue[0][0][ChartMeta.chartInfo.x_column] &&
              items.$context.parsed.y ==
                DataLabelValue[0][0][ChartMeta.chartInfo.y_column]
            ) {
              return {
                x: items.x + items.width / 2,
                y: items.y + items.height / 1.5,
              };
            }
          })
          .filter((item) => item !== undefined);

        const toCell = dataset.data
          .map((items) => {
            if (
              items.$context.parsed.x ==
                DataLabelValue[1][0][ChartMeta.chartInfo.x_column] &&
              items.$context.parsed.y ==
                DataLabelValue[1][0][ChartMeta.chartInfo.y_column]
            ) {
              return {
                x: items.x + items.width / 2,
                y: items.y + items.height / 1.5,
              };
            }
          })
          .filter((item) => item !== undefined);

        if (fromCell && toCell && ChartMeta.chartInfo.transition) {
        

          const startX = toCell?.[0]?.x;
          const startY = toCell?.[0]?.y;
          const endX = fromCell?.[0]?.x;
          const endY = fromCell?.[0]?.y;

          // Draw the arrow
          if (fromCell[0].x != toCell[0].x && fromCell[0].y != toCell[0].y) {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw arrowhead
            const headLength = 10;
            const angle = Math.atan2(endY - startY, endX - startX);
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
              endX - headLength * Math.cos(angle - Math.PI / 6),
              endY - headLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
              endX - headLength * Math.cos(angle + Math.PI / 6),
              endY - headLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.lineTo(endX, endY);
            ctx.fillStyle = "black";
            ctx.fill();
          }
        }
      }

      ctx.restore(); // Restore the state
    },
  });
  const handleHover = (event, elements) => {
    if (!elements.length) return; // Avoid unnecessary updates
  };

  const Matrixoptions = {
    maintainAspectRatio: false,
    onHover: handleHover,
    scales: {
      x: {
        display: true,
        min: 0.5,
        max: size + 0.5,
        offset: false,
        reverse: false,
        ticks: {
          callback: function (val, index) {
            if (props.type == "risk" || "") {
              switch (val) {
                case 1:
                  return "Very Unlikely";
                case 2:
                  return "Unlikely";
                case 3:
                  return "Likely";
                case 4:
                  return "Very Likely";
                case 5:
                  return "Possible";
                default:
                  return "";
              }
            }
            if (props.type == "control") {
              switch (val) {
                case 1:
                  return "Effective";
                case 2:
                  return "Partially Effective";
                case 3:
                  return "Not Effective";
                default:
                  return "";
              }
            }
          },
          display: true,
          stepSize: 1,
          precision: 0,
          beginAtZero: true,
        },
        title: {
          display: true,
          text: [ChartMeta.chartInfo.x_title],
        },
      },
      y: {
        display: true,
        min: 0.5,
        max: size + 0.5,
        offset: false,
        reverse: false,
        ticks: {
          callback: function (val, index) {
            if (props.type == "risk" || "") {
              switch (val) {
                case 1:
                  return "Very Unlikely";
                case 2:
                  return "Unlikely";
                case 3:
                  return "Likely";
                case 4:
                  return "Very Likely";
                case 5:
                  return "Possible";
                default:
                  return "";
              }
            }
            if (props.type == "control") {
              switch (val) {
                case 1:
                  return "Effective";
                case 2:
                  return "Partially Effective";
                case 3:
                  return "Not Effective";
                default:
                  return "";
              }
            }
          },
          display: true,
          stepSize: 1,
          precision: 0,
          beginAtZero: true,
        },
        title: {
          display: true,
          text: [ChartMeta.chartInfo.y_title],
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      // drawArrow: drawArrow({
      //   ChartMeta: props.ChartMeta,
      //   AdditionalData: AdditionalData,
      // }),
      datalabels: {
        formatter: (value, context) => {
          let totalCount = 0;
          const DataLabelValue = AdditionalData.filter((data) => {
            return (
              data[0][props.ChartMeta.chartInfo.x_column] == value.x &&
              data[0][props.ChartMeta.chartInfo.y_column] == value.y
            );
          });

          if (DataLabelValue.length > 0) {
            DataLabelValue.forEach((obj) => {
              totalCount += Object.keys(obj).length;
            });
          }

          setTotalCount(totalCount);

          if (totalCount > 0) {
            return totalCount;
          } else {
            return "*";
          }
        },

        display: true,
        color: "#FCFCFC",
        borderWidth: 5,
        font: {
          size: 14,
          weight: "normal",
        },
      },
    },
  };

  useEffect(() => {
    const arrowPlugin = drawArrow({
      ChartMeta: props.ChartMeta,
      AdditionalData: AdditionalData,
    });

    ChartJS.register(arrowPlugin);

    return () => {
      // Clean up the plugin when the component unmounts
      ChartJS.unregister(arrowPlugin);
    };
  }, [ChartMeta, AdditionalData]); // Add dependencies

  return (
    <>
      <Card className="flex-fill reportChart-cards">
        <Card.Header>
          <h5>{t(ChartMeta.chartInfo.chart_title)}</h5>
        </Card.Header>
        <Card.Body className="d-flex">
          <div className="align-self-center w-100">
            <div className="chart chart-lg">
              <Chart
                type="matrix"
                data={data}
                options={Matrixoptions}
                ref={chartRef}
                onClick={handleClick}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
      <Modal
        show={showModal}
        fullscreen={fullscreen}
        onHide={handleClose}
        size="lg"
      >
        <Modal.Header className="d-flex justify-content-between align-items-center">
          {/* <Modal.Title>Modal Title</Modal.Title> */}
          <Button
            variant="link"
            onClick={handlefullscreen}
            className="p-0 border-0"
          >
            <FontAwesomeIcon icon={faExpand} className="text-dark" />
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Header>
        <Modal.Body size="lg">
          <HeatMapModal
            HeatMapDrillDown={HeatMapDrillDown}
            default_filter={props.default_filter}
            ChartMeta={ChartMeta}
            ChartData={ChartData}
            TotalCount={totalCount}
          />
          {/* <ReportRuntime
              report={chartMeta && chartMeta.chartInfo.report_name}
              ChartdrilldownReports={reportFilter}
            /> */}
        </Modal.Body>
        {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default HeatMap;
