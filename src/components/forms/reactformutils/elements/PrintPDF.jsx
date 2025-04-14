import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import axios from "src/utils/AxiosInstance";

let PrintPDF = (props) => {
  let { formMetaData, runtimeParams } = props;
  const form_title = runtimeParams?.formmeta?.form_title;
  const form_id = runtimeParams?.formmeta?.form_id;
  const objectId = runtimeParams.objectId;

  let handleExportPDF = async () => {
    try {
      // const response = await axios.get(`/generate-jasper-report/${form_id}/pdf/${objectId}`, {
      const response = await axios.get(
        `/formprint/${form_id}/pdf/${objectId}`,
        {
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form_title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <>
      <div className="float-end">
        <Button
          variant="light"
          className={`rounded-circle d-flex align-items-center justify-content-center`}
          onClick={handleExportPDF}
        >
          <FontAwesomeIcon icon={faFilePdf} size="xl" />
          <i className="bi bi-file-earmark-pdf-fill"></i>
        </Button>
      </div>
    </>
  );
};

export default PrintPDF;
