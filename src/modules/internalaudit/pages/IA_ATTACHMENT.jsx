import axios from "src/utils/AxiosInstance";
const Attachment = ({ id, text, evidence }) => {
  const [beforeHash, afterHash] = evidence.split("#");
  const Evidence = afterHash ? afterHash : "";

  const handleIndependentDownload = async () => {
    try {
      const response = await axios.get(`/attachment/${beforeHash}`, {
        responseType: "blob",
      });
      const href = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", Evidence);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } catch (error) {
      console.error("Download error:", error);
    }
  };
  return (
    <li className="list-group-item d-flex justify-content-between align-items-start">
      <div
        className="ms-2 me-auto text-decoration-underline cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          handleIndependentDownload();
        }}
      >
        <strong>{text} </strong>
        {Evidence}
      </div>
    </li>
  );
};
export default Attachment;
