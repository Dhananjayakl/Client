import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faList,
  faUpload,
  faTruckPlane,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import { getUploadIds } from "src/modules/admin/AdminService";

const FormLink = (props) => {
  const navigate = useNavigate();
  let privs = util.getCurrentUser().privileges?.split(",");

  const handleClick = (route) => {
    navigate(route);
  };
  const [isHovered, setIsHovered] = useState(false);

  if (props.privilege && !privs.includes(props.privilege)) {
    return null; // Add return null to prevent rendering when the privilege check fails
  }
  const [uploadedIds, setUploadedIds] = useState("");
  const formService = props.id;
  useEffect(() => {
    getUploadIds("uploadIds", formService)
      .then((tableResponse) => {
        setUploadedIds(tableResponse.data);
      })
      .catch(
        (err) => {
          console.log(err);
        },
        [formService]
      );
  }, []);

  const formId = uploadedIds.form_id;
  const moduleId = uploadedIds.module_id;

  return (
    <Card
      className={` p-0 mb-10 rounded-3 m-2  ${
        isHovered ? "border-primary" : "border-primary"
      } `}
      style={{
        cursor: "pointer",
        maxWidth: "240px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {props.form ? (
        <>
          <Card.Body
            className=" d-flex flex-column justify-content-center  ml-3 mr-3 p-0 ps-1 bg-white mt-1"
            onClick={() =>
              handleClick(`/form/runtime?formService=${props.form}`)
            }
          >
            <div className="d-flex align-items-center">
              <FontAwesomeIcon
                icon={faPlusCircle}
                // className="text-black"
                style={{ color: "green" }}
              />
              <span
                className=" fw-bold fs-5   devtool"
                style={{ marginLeft: "10px" }}
              >
                {props.title}
              </span>
            </div>
          </Card.Body>
          <Card.Footer className="p-0 ps-1 bg-dark">
            {props.report && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "auto",
                  }}
                  onClick={() => handleClick(`/report?report=${props.report}`)}
                >
                  <FontAwesomeIcon
                    icon={faList}
                    className="text-light"
                    size="lg"
                  />
                  <div
                    style={{
                      boxSizing: "border-box",
                      marginLeft: "5px",
                    }}
                    className="text-light fw-bold fs-5 "
                  >
                    View
                  </div>
                </span>
                {props.id && (
                  <span className="ms-auto d-flex align-items-center">
                    {/* <span
                      style={{
                        boxSizing: "border-box",
                        marginRight: "5px",
                      }}
                      className="text-light fw-bold mt-2"
                      onClick={() => setShowUploadModal(true)}
                    >
                      <FontAwesomeIcon
                        icon={faUpload}
                        className="text-light"
                        size="lg"
                      />
                    </span> */}

                    <ModalForm
                      component={
                        <FormRunTime
                          formService="dataimports"
                          objectId={-1}
                          modal
                          formIds={formId}
                          moduleId={moduleId}
                          upload={true}
                          // uploadForm={props.form}
                        />
                      }
                      buttonText={
                        <>
                          <FontAwesomeIcon
                            icon={faUpload}
                            className="text-light"
                            size="lg"
                          />{" "}
                          <span className="text-light"> Upload</span>
                        </>
                      }
                      variant="dark"
                    />
                  </span>
                )}
              </div>
            )}
          </Card.Footer>
        </>
      ) : (
        <Card.Body
          // className="d-flex flex-column  justify-content-center ps-2  bg-white "
          className=" d-flex flex-column justify-content-center  ml-3 mr-3 p-0 ps-1 bg-white "
          onClick={() => handleClick(`/report?report=${props.report}`)}
        >
          <div className="d-flex align-items-center">
            {" "}
            <FontAwesomeIcon
              icon={faList}
              className=" me-2"
              style={{ color: "green" }}
              size="lg"
            />
            <span className="devtool" style={{ marginLeft: "10px" }}>
              {props.title}
            </span>
          </div>
        </Card.Body>
      )}
    </Card>
  );
};
export default FormLink;
