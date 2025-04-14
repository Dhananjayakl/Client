import React from "react";
import { Button, Row, Col, Table } from "react-bootstrap";
import { useState } from "react";
import ReportRuntime from "src/components/reports/Report";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HeatMapModal = (props) => {
  console.log(props, "heat map modal  props");

  const xvalue = parseInt(props.HeatMapDrillDown.data.x);
  const yvalue = parseInt(props.HeatMapDrillDown.data.y);
console.log(xvalue,yvalue,"457 italia");

  let [drilldownReports, setDrillDownReports] = useState();

  const DrillDownreports = {
    [props.ChartMeta.chartInfo.x_column]: props.HeatMapDrillDown.data.x,
    [props.ChartMeta.chartInfo.y_column]: props.HeatMapDrillDown.data.y,
  };
  let defaultChartFilterExpression;
  if (props.ChartMeta && DrillDownreports) {
    if (props.ChartMeta.chartInfo.report_filter_expression) {
      let originalString = props.ChartMeta.chartInfo.report_filter_expression;
      function removeEmptyKeys(obj) {
        for (let key in obj) {
          if (obj[key] === undefined || obj[key] === null || obj[key] === "") {
            delete obj[key];
          }
        }
        return obj;
      }

      let values = removeEmptyKeys(DrillDownreports);

      let replacedString = originalString;
      Object.keys(values).forEach((key) => {
        let valueWithQuotes = `'${values[key]}'`;

        replacedString = replacedString.replace(
          new RegExp(`:${key}`, "g"),
          valueWithQuotes
        );
      });
      if (props.default_filter) {
        defaultChartFilterExpression = `${replacedString} and ${props.default_filter}`;
      } else {
        defaultChartFilterExpression = replacedString;
      }
    }
  }

  const Data = props.ChartData.filter((data) => {
    return (
      data[props.ChartMeta.chartInfo.x_column] === xvalue &&
      data[props.ChartMeta.chartInfo.y_column] === yvalue
    );
  });
     console.log(Data,"modal heat map data");
  const HeatMapDrillDown = props.HeatMapDrillDown;
  const raw = HeatMapDrillDown.data;
  const cColor = HeatMapDrillDown.backgroundColor({ raw });
   
  let AddtionalData;
  let TotalCount = 0;
  if (Data?.length > 0) {

    console.log(props.ChartMeta,"purusongue");
    
    AddtionalData = (Data[0].json_agg);
    AddtionalData.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "string") {
          obj[key] = obj[key].replace(/[^\w\s]/gi, "");
        }
      });
    });
console.log(AddtionalData,"REVERT");

    TotalCount = AddtionalData && AddtionalData.length;
  }
  //console.log(AddtionalData[0].d_res_impact, "adder");
  // const stars = "*".repeat(TotalCount);

  const colArray = [];

  for (let i = 0; i < TotalCount; i++) {
    colArray.push(
      <Col key={i}>
        <h3 style={{ color: "6a4c93", borderColor: "black", border: "2px" }}>
          R{i + 1}
        </h3>
      </Col>
    );
  }
  return (
    <>
      {Data?.length > 0 ? (
        <>
          <Row className="d-flex m-5">
            <Col className="d-flex justify-content-center align-items-center">
              <Button
                className="w-100 h-100"
                style={{
                  background: cColor,
                  cursor: "default",
                }}
              >
                <Row>{colArray}</Row>
              </Button>
            </Col>

            <Col className="d-flex justify-content-center align-items-center">
              <Table bordered className="ms-5">
                <thead>
                  <tr>
                    <th>{props.ChartMeta.chartInfo.y_title}</th>
                    <th>{props.ChartMeta.chartInfo.x_title}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{AddtionalData[0][`d_${props.ChartMeta.chartInfo.y_column}`]}</td>
                    <td>{AddtionalData[0][`d_${props.ChartMeta.chartInfo.x_column}`]}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <ReportRuntime
            report={props.ChartMeta.chartInfo.report_name}
            ChartdrilldownReports={defaultChartFilterExpression}
          />
          ;
          {/* <Row className="d-flex m-5">
           <Col nclassName="d-flex justify-content-center align-items-center">
              <Table bordered className="ms-0">
                <thead>
                  <tr>
                    {Object.keys(AddtionalData[0]).map((key) => (
                      <th>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AddtionalData.map((items) => (
                    <tr>
                      {Object.values(items).map((value) => (
                        <td>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row> */}
        </>
      ) : (
        <h3 className="d-flex justify-content-center align-items-center">
          No Data
        </h3>
      )}
    </>
  );
};

export default HeatMapModal;
