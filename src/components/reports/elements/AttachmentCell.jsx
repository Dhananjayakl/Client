import React from "react";
import { downloadFile } from "src/components/forms/reactformutils/fields/Attach";

const AttachmentCell = ({ value, format }) => {
  function processFileDownload(value) {
    if (value === null || value === undefined || typeof value !== "string") {
      return null;
    }

    const attachments = value?.split(",");

    return attachments.map((attachment, index) => {
      const [attachmentId, fileName] = attachment.split("#");

      return (
        <div key={index} style={{ width: "150px" }}>
          <a
            onClick={() => downloadFile({ attachmentId, fileName })}
            target="_blank"
            rel="noopener noreferrer"
            className="me-2"
          >
            {fileName}
          </a>
        </div>
      );
    });
  }

  return <div>{processFileDownload(value)}</div>;
};

export default AttachmentCell;
