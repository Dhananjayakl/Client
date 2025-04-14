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
import {
  Bar,
  getElementAtEvent,
  getDatasetAtEvent,
  Pie,
} from "react-chartjs-2";
import { Row, Col } from "react-bootstrap";
import useTheme from "src/hooks/useTheme";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCircle } from "@fortawesome/free-solid-svg-icons";

const PieChart = ({
  options,
  data,
  onClick,
  chartRef,
  chartMeta,
  customlegendData,
  legendToggle,
}) => {
  console.log(ChartDataLabels.defaults.display, "labelsssss");
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
    console.log(lineRefs.current[index], "simba");

    console.log(value, customlegendData, "asdf");

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
    let hideFlag = hiddenFlag[onClickValue];
    if (hideFlag == true) {
      chartRef.current.hide(0, index);
    }
    if (hideFlag == false) {
      chartRef.current.show(0, index);
    }
  }, [hiddenFlag, chartRef?.current, index, onClickValue]);

  console.log(lineRefs.current, "refers");

  console.log(hiddenFlag, "hidden flag");

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
                    <Pie
                      ref={chartRef}
                      options={options}
                      data={data}
                      onClick={clickHandle}
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
                              // textDecoration:
                              //   onClickValue &&
                              //   onClickValue == items.label &&
                              //   hiddenFlag[onClickValue] == true
                              //     ? "line-through"
                              //     : "none",
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
                <Pie
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
                   <Col>{/* <h3>hello</h3> */}</Col>
                 </Row>
                 <Row className=" w-100 d-flex align-items-end justify-content-end float-end">
                   <Col className="p- m-0">
                     <div className="chart chart-md">
                       <Pie
                         data={data}
                         ref={chartRef}
                         onClick={clickHandle}
                         options={options}
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

export default PieChart;



// const PieChart 