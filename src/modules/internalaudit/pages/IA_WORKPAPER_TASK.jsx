import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleList } from "@fortawesome/free-solid-svg-icons";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
const WorkpaperTask = ({ id, text, status, endDate, item, statusColors }) => {
  const circleColor = statusColors[status] || "grey";
  const navigate = useNavigate();
  const handleworkpaper = (item) => {
    if (item?.d_wp_type == "Checklist") {
      const path = `/form/runtime?formService=respondentForm&objectId=${id}`;
      navigate(path);
    } else {
      const path = `/form/runtime?formService=workpaper&objectId=${id}`;
      navigate(path);
    }
  };
  return (
    <Card
      className="mb-3 textlink-border"
      style={{
        borderLeft: `5px solid ${circleColor || "grey"}`,
        zIndex: 0,
      }}
    >
      <Card.Body className="py-1 px-2 ">
        <div>
          <span className="standard-Font">
            <FontAwesomeIcon icon={faRectangleList} className="me-1" />
            <strong>{item?.d_wp_type}</strong>
          </span>
          <span className="float-end standard-Font">
            <strong> {item?.status} </strong>
          </span>
        </div>
        <h5
          className=" standard-heading-font text-link"
          onClick={() => handleworkpaper(item)}
        >
          {text}
        </h5>

        <div className="d-flex flex-column standard-Font">
          {item.d_wp_auditor && (
            <span className="">
              <strong>Auditor:</strong> {item.d_wp_auditor}
            </span>
          )}
          {(item.d_wp_approver || item.d_approver) && (
            <span className="">
              <strong>Approver:</strong> {item.d_wp_approver || item.d_approver}
            </span>
          )}

          {endDate && (
            <span className="">
              <strong>End Date:</strong> {util.getFormattedDate(endDate)}
            </span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
export default WorkpaperTask;
