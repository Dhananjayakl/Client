
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
import { AspectRatio } from "react-bootstrap-icons";
// import { display } from "html2canvas/dist/types/css/property-descriptors/display";

const MeterChart = ({
  options,
  data,
  onClick,
  chartRef,
  chartMeta,
  customlegendData,
  legendToggle,
  Runtimevalue,
}) => {
  console.log(ChartDataLabels.defaults.display, "labelsssss");
  console.log(data, "meter--data");

  ChartDataLabels.defaults.display = false;
  ChartDataLabels.formatter = (value) => {
    console.log(value, "formatter vaue");
  };

  const [hiddenFlag, setHiddenFlag] = useState([]);
  const [index, setIndex] = useState();
  const [onClickValue, setOnclickValue] = useState();
  const { theme, setTheme } = useTheme();

  const lineRefs = useRef([]);

  const clickHandle = (event, element) => {
    onClick(event, element);
  };
  console.log(legendToggle, "bar toggle");
  const toggleValue = (value, index) => {
    const meta = chartRef.current.getDatasetMeta(0);
    setIndex(meta._dataset.labels.indexOf(value));
    setOnclickValue(value);
    console.log(index, "label index");
    if (hiddenFlag[value]) {
      setHiddenFlag((prev) => ({
        ...prev,
        [value]: !prev[value], // Toggle the value
      }));
      lineRefs.current[index].style.textDecoration = "none";

      const chart = chartRef.current;

      chart.update;
    } else {
      setHiddenFlag((prev) => ({
        ...prev, // Spread the previous state to retain existing values
        [value]: true, // Add or update the new key-value pair
      }));
      lineRefs.current[index].style.textDecoration = "line-through";
    }
  };
  useEffect(() => {
    console.log(chartRef.current, "doughnut ref");

    let hideFlag = hiddenFlag[onClickValue];
    if (hideFlag == true) {
      chartRef.current.hide(0, index);
    }
    if (hideFlag == false) {
      chartRef.current.show(0, index);
    }
  }, [hiddenFlag, chartRef?.current, index, onClickValue]);

  //   let totalCount = data.datasets[0].data.reduce(
  //     (sum, current) => sum + current,
  //     0
  //   );
  //   console.log(totalCount, "total counts are here");

  const Doughnut_Pie_Guage_Options = {
          responsive: true,
      maintainAspectRatio: false,
    cutout: "76%",
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: {
        display:
          chartMeta.chartInfo.legend_display && !chartMeta.chartInfo.only_chart
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
          chartMeta.chartInfo.compact_view 
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

        textStrokeColor: "black",
        textStrokeWidth: 0.5,
      },
    },
  };

  const textCenterPlugin = {
    id: "textCenter",
    afterDraw(chart) {
      const { width, height } = chart;
      const ctx = chart.ctx;

      ctx.save(); // Save initial canvas state

      // Dynamic text values
      const text = Runtimevalue?.[0] ? Runtimevalue[0] : ""; // Your main text

      ctx.fillStyle = theme === "dark" ? "white" : "#000"; // Text color
      ctx.textBaseline = "end";
      ctx.textAlign = "center";

      // Dynamic font size based on chart size
      const fontSize = Math.min(width, height) /5 ;
      ctx.font = `${fontSize}px Arial`;

      // Center text position
      const textX = width / 2;
      const textY = height /1.3;

      // Draw text
      ctx.fillText(text, textX, textY);

      ctx.restore(); // Restore the previous canvas state
    },
  };


  return (
    <>
      {chartMeta.chartInfo.compact_view == true &&
        chartMeta.chartInfo.data_label_view == "end" && (
          <div className="align-self-center w-90">
            <Row>
              <Col className="m-0 p-0">
                <div id={chartMeta.chartInfo.chart_name} className="p-y-3">
                  {/* <h5>{chartMeta.chartInfo.chart_title}</h5> */}
                  <div className="chart chart-xs">
                    <Doughnut
                      fallback={<Breathing />}
                      ref={chartRef}
                      options={Doughnut_Pie_Guage_Options}
                      data={data}
                      onClick={clickHandle}
                      // plugins={[textCenterPlugin]}
                    />
                  </div>
                </div>
              </Col>
              <Col
                className="ms-3 p-0 w-100"
                style={{
                  maxHeight: "152px",
                  overflowX: "hidden",
                  overflowY: customlegendData?.length > 6 ? "scroll" : "hidden",
                }}
              >
                {customlegendData &&
                  customlegendData.map((items, index) => {
                    return (
                      <Row className="">
                        <Col xs={2} className="ms-3">
                          <div
                            className=""
                            style={{
                              position: "relative",
                              borderRadius: "4px",
                              display: "inline-block",
                              width: "40px",
                              height: "18px",
                              marginLeft: "-15px",
                              background:
                                legendToggle == true
                                  ? items.backgroundColor
                                  : "transparent",
                            }}
                          >
                            {legendToggle == false && (
                              <FontAwesomeIcon
                                icon={
                                  chartMeta.chartInfo.legend_marker == "square"
                                    ? faSquare
                                    : chartMeta.chartInfo.legend_marker ==
                                      "circle"
                                    ? faCircle
                                    : faCircle
                                }
                                style={{
                                  color: items.backgroundColor,
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            )}
                            <span
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                color: chartMeta.chartInfo.legend_font_color
                                  ? chartMeta.chartInfo.legend_font_color
                                  : "white", // Change this color as needed
                                fontSize: "10px", // Adjust font size as needed
                                fontWeight: "bold", // Optional: bold text
                              }}
                            >
                              {legendToggle == true
                                ? `${Math.round(items.percentage)}%`
                                : items.data}
                            </span>
                          </div>
                        </Col>

                        <Col
                          className={
                            legendToggle
                              ? "p-0 ms-3 mt-1 d-flex "
                              : "p-0 ms-2 mt-1 d-flex "
                          }
                        >
                          <span
                            ref={(el) => (lineRefs.current[index] = el)}
                            className=""
                            id={index}
                            onClick={() => toggleValue(items.label, index)}
                            style={{
                              display: "-webkit-box",
                              fontSize: "9px",
                              color: chartMeta.chartInfo.legend_label_color
                                ? chartMeta.chartInfo.legend_label_color
                                : "black",
                              cursor: "pointer",
                              color: theme == "dark" ? "white" : "black",
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              WebkitLineClamp: 2, // Limit to 3 lines
                              lineHeight: "1.2em", // Adjust according to your font size
                              maxHeight: "1.6em", // lineHeight * 3 lines
                            }}
                            title={items.label}
                          >
                            {items.label}
                          </span>
                        </Col>
                      </Row>
                    );
                  })}
              </Col>
            </Row>
          </div>
        )}
      {chartMeta.chartInfo.compact_view == true &&
        chartMeta.chartInfo.data_label_view == "bottom" && (
          <div className="align-self-center w-90">
            <div className="py-3">
              <div className="chart chart-xs">
                <Doughnut
                  data={data}
                  ref={chartRef}
                  onClick={clickHandle}
                  options={Doughnut_Pie_Guage_Options}
                  // plugins={[textCenterPlugin]}
                />
              </div>
            </div>
            <div
              style={{
                maxHeight: "150px",
                minHeight: "150px",
                overflowX: "hidden",
                overflowY: customlegendData?.length > 6 ? "scroll" : "hidden",
              }}
            >
              {customlegendData &&
                customlegendData.map((items, index) => {
                  return (
                    <Row className="d-flex align-items-center justify-content-center ">
                      <Col
                        xs={2}
                        className="d-flex align-items-end justify-content-end ms-3 mt-1 me-0 pe-1"
                      >
                        <div
                          style={{
                            position: "relative",
                            borderRadius: "4px",
                            display: "inline-block",
                            width: "40px",
                            height: "18px",
                            marginLeft: "-15px",
                            background: items.backgroundColor,
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              stroke: "black",
                              color: "white", // Change this color as needed
                              fontSize: "10px", // Adjust font size as needed
                              fontWeight: "bold", // Optional: bold text
                            }}
                          >
                            {legendToggle == true
                              ? `${Math.round(items.percentage)}%`
                              : items.data}

                            {/* {legendToggle==true?`${Math.round(items.percentage)}%`:items.data}  */}
                          </span>
                        </div>
                      </Col>

                      <Col className="d-flex align-items-center justify-content-start mt-1 p-0 ">
                        <span
                          ref={(el) => (lineRefs.current[index] = el)}
                          id={index}
                          onClick={() => toggleValue(items.label, index)}
                          style={{
                            display: "-webkit-box",
                            fontSize: "9px",
                            color: chartMeta.chartInfo.legend_label_color
                              ? chartMeta.chartInfo.legend_label_color
                              : "black",
                            cursor: "pointer",
                            color: theme == "dark" ? "white" : "black",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 2, // Limit to 3 lines
                            lineHeight: "1.2em", // Adjust according to your font size
                            maxHeight: "1.6em", // lineHeight * 3 lines
                          }}
                          title={items.label}
                        >
                          {items.label}
                        </span>
                      </Col>
                    </Row>
                  );
                })}
            </div>
          </div>
        )}
      {!chartMeta.chartInfo.compact_view && (
        <div className="align-self-center w-90">
          <div className="py-3">
            <Row className="m-0 p-0">
              <Col></Col>
            </Row>
            <Row className=" w-100 d-flex align-items-end justify-content-end float-end">
              <Col className="p- m-0">
                <div
                  className={
                    chartMeta.chartInfo.chart_size
                      ? `chart chart-${chartMeta.chartInfo.chart_size}`
                      : "chart chart-md"
                  }
                >
                  <Doughnut
                    data={data}
                    ref={chartRef}
                    onClick={clickHandle}
                    options={Doughnut_Pie_Guage_Options}
                    plugins={[textCenterPlugin]}
                  />
                </div>

                {Runtimevalue?.length > 0 &&
                  Runtimevalue?.map((items, index) => {
                    if (index > 0) {
                      return (
                        <div className="d-flex align-items-center justify-content-center">
                          <h4>{items}</h4>
                        </div>
                      );
                    }
                  })}
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default MeterChart;
