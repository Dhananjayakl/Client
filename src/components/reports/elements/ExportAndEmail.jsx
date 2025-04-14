import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFileExcel,
  faFileExport,
  faArrowsRotate,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  Dropdown,
  SplitButton,
  ButtonGroup,
  Modal,
  Button,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";

function getSortExpression(pageSortBy) {
  let orderExpression;
  if (pageSortBy.length > 0) {
    const sortParams = pageSortBy[0];
    let sortOrder = sortParams.desc ? "desc" : "asc";
    let sortField = sortParams.id;
    if (sortField) orderExpression = "ORDER BY " + sortField + " " + sortOrder;
  }
  return orderExpression;
}

function getFilterCondition(pageFilter) {
  let filterCondition;

  if (pageFilter.length > 0) {
    filterCondition = pageFilter.map((filter, index) => {
      const { id, value } = filter;

      // Check if `value` is an array of objects
      if (Array.isArray(value)) {
        const numberValues = value.filter((v) => v.type === "number");
        if (numberValues.length > 0) {
          const [first, second] = numberValues;

          if (first.value !== undefined && second.value !== undefined) {
            return (
              id + " >= " + first.value + " AND " + id + " <= " + second.value
            );
          } else if (first.value !== undefined) {
            return id + " >= " + first.value;
          } else if (second.value !== undefined) {
            return id + " <= " + second.value;
          }
        }
      } else if (typeof value === "object") {
        if (value.type === "text" && value.value) {
          return "UPPER(" + id + ")" + " LIKE UPPER ( '%" + value.value + "%')";
        } else if (value.type === "date" && value.value) {
          if (value.value) {
            return id + " = '" + value.value + "'";
          } else {
            return "";
          }
        }
      } else {
        return "UPPER(" + id + ")" + " LIKE UPPER ('" + value + "')";
      }

      return "";
    });

    filterCondition = filterCondition
      .filter((condition) => condition !== "")
      .join(" AND ");
  }

  return filterCondition;
}

const ExportAndEmail = (props) => {
  let {
    reportMeta,
    queryPageSortBy,
    queryPageFilter,
    report,
    table,
    defaultFilterExpression,
    ChartdrilldownReports,
    mainFilterExport,
  } = props;
  const { t, i18n } = useTranslation();
  const languageDirection = i18n.dir();

  const [showModal, setShowModal] = useState(false);
  const [columns, setColumns] = useState("");
  const [reportfilterexpresiion, setReportfilterexpresiion] = useState(false);
  const floatClass =
    (languageDirection === "ltr" ? "float-end" : "float-start") + " mx-1";
  const handleCloseModal = () => {
    setShowModal(false);
  };

  let exportData = async (
    title,
    report,
    queryPageFilter,
    queryPageSortBy,
    selectedColumns,
    mainFilterExport,
    sendEmail = false
  ) => {
    let orderExpression = getSortExpression(queryPageSortBy);
    let filterCondition = getFilterCondition(queryPageFilter);

    setReportfilterexpresiion(
      mainFilterExport || defaultFilterExpression || filterCondition
    );
    let columnList = Object.values(selectedColumns)
      .filter((column) => column.getIsVisible())
      .map((column) => `${column.id} as "${column.columnDef.header}"`);

    setColumns(columnList);
    setShowModal(true);
  };
  return (
    <>
      <div className={`${floatClass} ms-1 me-0`}>
        <Button
          // className="border p-1 rounded "
          // variant="light"
          // variant="light"
          variant={reportMeta?.reportInfo?.theme == 2 ? "light" : "primary"}
          className="border-primary  p-1 px-2  rounded-circle"
          onClick={() => {
            exportData(
              reportMeta?.reportInfo.report_title,
              report,
              queryPageFilter,
              queryPageSortBy,
              table,
              mainFilterExport
            );
          }}
        >
          <FontAwesomeIcon icon={faEnvelope} />
        </Button>
      </div>

      {/* Modal for email details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="d-none"></Modal.Header>
        <Modal.Body>
          <>
            <FormRunTime
              formService="exportandemail"
              objectId={-1}
              reportfilterexpresiion={reportfilterexpresiion}
              columnList={columns}
              reportMeta={reportMeta?.reportInfo}
              modal
            />
          </>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ExportAndEmail;
