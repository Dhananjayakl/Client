import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const ReportsTask = ({ id, text, reportYear, status, item }) => {
  // const borderColor=;

  let circleColor = "grey";
  if (status === "Published") {
    circleColor = "green";
  }

  const navigate = useNavigate();

  const handleReports = () => {
    const path = `/form/runtime?formService=auditreport&objectId=${id}`;
    navigate(path);
  };

  return (
    <Card
      className="mb-3 textlink-border"
      style={{
        borderLeft: `5px solid ${circleColor || "red"}`,
      }}
    >
      <Card.Body className="py-1 px-2 ">
        <h5
          className=" standard-heading-font text-link"
          onClick={handleReports}
        >
          {text}
        </h5>

        <div className="d-flex flex-column standard-Font">
          {reportYear && (
            <span className="">
              <strong>Report Year:</strong> {reportYear}
            </span>
          )}
          {status && (
            <span className="">
              <strong>Status:</strong> {status}
            </span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
export default ReportsTask;
