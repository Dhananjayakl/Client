import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import axios from "src/utils/AxiosInstance";
const Pdfdownload = ({ row, columnMeta, reportmetaValue }) => {
  let objectId = row.original[columnMeta.id_column_name];
  const formName = reportmetaValue[0]?.reportInfo?.form_name;
  let handleExportPDF = async () => {
    try {
      const response = await axios.get(
        `/formprint/${formName}/pdf/${objectId}`,
        {
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${columnMeta.expression.replace(/'/g, "")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div className="">
      <Button
        variant="light"
        className={`rounded-circle d-flex align-items-center justify-content-center`}
        onClick={handleExportPDF}
      >
        <FontAwesomeIcon icon={faFilePdf} size="xl" />
        <i className="bi bi-file-earmark-pdf-fill"></i>
      </Button>
    </div>
  );
};

export default Pdfdownload;
