import React from "react";
import { Play } from "react-feather";
import { useNavigate } from "react-router-dom";

const PlayButton = ({ value, row, columnMeta }) => {
  let navigate = useNavigate();

  let formservice = row.original.api_handler;
  const withoutslashFormservice = formservice?.replace(/\//g, "");

  let reportName = row.original.report_name;
  let chartName = row.original.chart_name;

  return (
    <>
      <a
        variant="light"
        className="mx-2 text-dark"
        size="sm"
        // onClick={() => navigate(`/report?report=${reportName}`)}
        // navigate(`/form/runtime?formService=${formName}`
        onClick={() => {
          if (formservice) {
            navigate(`/form/runtime?formService=${withoutslashFormservice}`);
          } else if (reportName) {
            navigate(`/report?report=${reportName}`);
          } else if (chartName) {
            navigate(`/chart?chart=${chartName}`);
          }
        }}
      >
        <Play />
      </a>
    </>
  );
};

export default PlayButton;
