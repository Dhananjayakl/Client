import React, { useState, useEffect, useCallback, useRef } from "react";
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

import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Bar, getElementAtEvent, getDatasetAtEvent } from "react-chartjs-2";
import { Row, Col } from "react-bootstrap";
import useTheme from "src/hooks/useTheme";
import ChartDataLabels from "chartjs-plugin-datalabels";
import usePalette from "src/hooks/usePalette";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCircle } from "@fortawesome/free-solid-svg-icons";

const BarChart = ({
  chartDataArray,
  options,
  data,
  onClick,
  chartRef,
  chartMeta,
  customlegendData,
  legendToggle,
  background,
  colorArray,
}) => {
  console.log(chartRef, chartDataArray, "bar ref is here");
  console.log(customlegendData, data, "custom data");
  const lineRefs = useRef([]);
  const [hiddenFlag, setHiddenFlag] = useState([]);
  const [index, setIndex] = useState();
  const { theme, setTheme } = useTheme();
  const palette = usePalette();
  const [onClickValue, setOnclickValue] = useState();
  const clickHandle = (event, element) => {
    onClick(event, element);
  };
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
  console.log(
    hiddenFlag,
    "hidden flag",
    index,
    "index",
    onClickValue,
    "Onclick value"
  );

  useEffect(() => {
    let hideFlag = hiddenFlag[onClickValue];
    console.log(hideFlag, chartRef.current, index, "hide flag");

    if (hideFlag == true) {
      chartRef.current.hide(index);
    }
    if (hideFlag == false) {
      chartRef.current.show(index);
    }
  }, [hiddenFlag, chartRef?.current, index, onClickValue]);
  console.log(
    chartMeta.chartInfo.only_chart,
    chartMeta.chartInfo.chart_title,
    "only-chart"
  );
console.log(chartMeta.chartInfo.chart_index,"ferrari-457")
  const BarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // cornerRadius: 15,
    plugins: {
      legend: {
        display:
          chartMeta.chartInfo.legend_display && !chartMeta.chartInfo.only_chart
            ? true
            : false,
        
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
      datasets: {
        barPercentage: 0.2,
        minBarLength: 1,
        categoryPercentage: 0.1,
        barThickness: 20,
        maxBarThickness: 20,
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

    indexAxis: chartMeta.chartInfo.chart_index
      ? "y"
      : "x",
    scales: {
      y: {
        grid: {
          display: true,
        },
        stacked: chartMeta.chartInfo.x_stack
          ? chartMeta.chartInfo.x_stack
          : false,
        title: {
          display: chartMeta.chartInfo.y_title,
          text: chartMeta.chartInfo.y_title,
        },
        ticks: {
          display: true,
          stepSize: 20,
          precision: 0,
          beginAtZero: true,
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
        min: 0,
        max: 200,
        ticks: {
          display: true,
          stepSize: 30,
        },
      },
    },
    //  onClick: (event, elements) => onClick(event, elements),
  };

  return (
    <>
      {chartMeta.chartInfo.compact_view == true &&
        chartMeta.chartInfo.data_label_view == "end" && (
          <Row>
            <Col className="m-0 p-0">
              <div id={chartMeta.chartInfo.chart_name} className="m-0 p-0">
                {/* <h5>{chartMeta.chartInfo.chart_title}</h5> */}
                <div className="chart chart-xs">
                  <Bar
                    ref={chartRef}
                    options={options}
                    data={data}
                    onClick={clickHandle}
                  />
                </div>
              </div>
            </Col>
            <Col className="m-0 p-0">
              {customlegendData &&
                customlegendData.map((items, index) => (
                  <Row className="d-flex">
                    <Col xs={2} className="ms-1">
                      <div
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
                                : chartMeta.chartInfo.legend_marker == "circle"
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
                          ? "p-0 ms-3 mt-1 d-flex"
                          : "p-0 ms-2 mt-1 d-flex"
                      }
                    >
                      <span
                        id={index}
                        onClick={() => toggleValue(items.label)}
                        style={{
                          textDecoration:
                            onClickValue &&
                            onClickValue == items.label &&
                            hiddenFlag[onClickValue] == true
                              ? "line-through"
                              : "none",
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
                          maxHeight: "3.6em", // lineHeight * 3 lines
                        }}
                        title={items.label}
                      >
                        {items.label}
                      </span>
                    </Col>
                  </Row>
                ))}
            </Col>
          </Row>
        )}
      {chartMeta.chartInfo.compact_view == true &&
        chartMeta.chartInfo.data_label_view == "bottom" && (
          <div className="align-self-center w-90 ">
            <div className="py-3">
              <div className="chart chart-xs">
                <Bar
                  data={data}
                  ref={chartRef}
                  onClick={clickHandle}
                  options={options}
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
              <Row>
                <Col className="">
                  {customlegendData &&
                    customlegendData.map((items, index) => (
                      <Row className="d-flex align-items-center justify-content-center w-100 ms-1">
                        <Col
                          xs={2}
                          className="d-flex align-items-end justify-content-end ms-1 mt-1 pe-1"
                        >
                          <div
                            style={{
                              position: "relative",
                              borderRadius: "4px",
                              display: "inline-block",
                              width: "56px",
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
                                  color:
                                    background.length > 0 && background[index]
                                      ? background[index]
                                      : colorArray[index],
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
                                fontSize: "11px", // Adjust font size as needed
                                fontWeight: "bold", // Optional: bold text
                              }}
                            >
                              {legendToggle == true
                                ? `${items.percentage}%`
                                : items.data}
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
                    ))}
                </Col>
              </Row>
            </div>
          </div>
        )}
      {!chartMeta.chartInfo.compact_view && (
        <div className="align-self-center w-90">
          <div className="py-3">
            <Row className="m-0 p-0">
              <Col>{/* <h3>hello</h3> */}</Col>
            </Row>
            <Row className=" w-100 d-flex align-items-end justify-content-end float-end">
              <Col className="p- m-0">
                <div
                  className={
                    chartMeta.chartInfo.chart_size
                      ? `chart chart-${chartMeta.chartInfo.chart_size}`
                      : "chart chart-lg"
                  }
                >
                  <Bar
                    data={data}
                    ref={chartRef}
                    onClick={clickHandle}
                    options={
                      chartMeta?.chartInfo.chart_size == "xs"
                        ? BarOptions
                        : options
                    }
                  />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default BarChart;
