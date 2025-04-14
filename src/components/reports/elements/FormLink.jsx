import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";

const FormLink = ({ value, row, columnMeta }) => {
  const navigate = useNavigate();
  const { original: rowData } = row;
  const objectId = rowData[columnMeta.id_column_name];
  const formService = rowData.formservice;
  const closeModel = document.querySelector(".modelLinkcloseButton");
  const isTemplateString = columnMeta.form?.includes("${");
  const multiformService = columnMeta.form
    ? rowData[columnMeta.form.match(/\$\{([^}]+)\}/)?.[1] || ""]
    : null;

  const links = {
    formRuntime: `/form/runtime?formService=${
      formService || columnMeta.form
    }&objectId=${objectId}`,
    page: `/page?name=${columnMeta.page}&objectId=${objectId}`,
    formDesigner: `/form/formdesigner?id=${rowData.form_id}`,
    reportDesigner: `/form/reportdesigner?id=${rowData.report_id}`,
    chartDesigner: `/form/chartdesigner?id=${rowData.chart_id}`,
    workflowDesigner: `/form/workflowdesigner?id=${rowData.workflow_id}`,
  };

  const handleNavigation = (e, url) => {
    if (e.button === 0) {
      e.preventDefault();
      navigate(url, { state: { objectData: rowData } });
      closeModel?.click();
    }
  };

  const determineUrl = () => {
    if ((columnMeta.form && !isTemplateString) || formService)
      return links.formRuntime;
    if (multiformService)
      return `/form/runtime?formService=${multiformService}&objectId=${objectId}`;
    if (rowData.form_id) return links.formDesigner;
    if (rowData.report_id) return links.reportDesigner;
    if (rowData.chart_id) return links.chartDesigner;
    if (rowData.workflow_id) return links.workflowDesigner;
    return links.page;
  };

  const mainUrl = determineUrl();

  return (
    <div className="d-flex flex-grow-1">
      {columnMeta.form && columnMeta.page && (
        <>
          <span className="me-1">
            <a
              href={links.page}
              onClick={(e) => handleNavigation(e, links.page)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black"
            >
              <FontAwesomeIcon icon={faList} />
            </a>
          </span>
          <div className="vr me-1"></div>
        </>
      )}
      <a
        href={mainUrl}
        onClick={(e) => handleNavigation(e, mainUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-black"
      >
        {value}
      </a>
    </div>
  );
};

// export default FormLink;
export default React.memo(FormLink);
