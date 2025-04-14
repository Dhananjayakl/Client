import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { downloadAlldocument } from "../IAService";
import { useTranslation } from "react-i18next";
const Lane = ({
  name,
  children,
  onContainerLoaded,
  download,
  objectId,
  auditData,
}) => {
  const { t } = useTranslation("common");
  const handleDownload = () => {
    downloadAlldocument("downloadAlldocument", objectId)
      .then((response) => {
        const data = response?.data;
        if (data) {
          const blob = new Blob([data], { type: "application/zip" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${auditData?.audit_title}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } else {
          console.error("No data received for download.");
        }
      })
      .catch((error) => {
        console.error("Download failed:", error);
      });
  };
  return (
    <Card>
      <Card.Header className="p-1 mt-1 m-0">
        {download && auditData && (
          <FontAwesomeIcon
            icon={faDownload}
            className="float-end cursor-pointer me-2"
            size="lg"
            title="Download"
            onClick={handleDownload}
          />
        )}

        <Card.Title className="border-bottom m-1 ">{name}</Card.Title>
        <h6 className="card-subtitle text-muted "></h6>
      </Card.Header>
      <Card.Body
        className="px-2"
        style={{
          // height: "500px",
          height:
            name === t("Report") || name === t("Documents/Evidences")
              ? "220px"
              : "500px",

          overflowY: "auto",
          scrollbarWidth: "thin",
        }}
      >
        <div>{children}</div>
      </Card.Body>
    </Card>
  );
};
export default Lane;
