import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import {
  faList,
  faPlusCircle,
  faLineChart,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import { getUploadIds } from "src/modules/admin/AdminService";
import { useTranslation } from "react-i18next";
const FormReportChartLink = (props) => {
  const { combinedItems } = props;
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadedIds, setUploadedIds] = useState("");
  const [modalFormData, setModalFormData] = useState({});

  let privs = util.getCurrentUser().privileges?.split(",");

  const filterByPrivilege = (items) => {
    return items.filter((item) => privs.includes(item.privilege));
  };

  const forms = filterByPrivilege(
    combinedItems.filter((item) => item.type === "form")
  );

  const reports = filterByPrivilege(
    combinedItems.filter((item) => item.type === "report")
  );
  const charts = filterByPrivilege(
    combinedItems.filter((item) => item.type === "chart")
  );

  useEffect(() => {
    const fetchUploadedIds = async () => {
      const responses = [];
      for (const form of forms) {
        try {
          const tableResponse = await getUploadIds("uploadIds", form.form);
          responses.push({ form: form.form, data: tableResponse.data });
        } catch (err) {
          console.log(err);
        }
      }

      setUploadedIds(responses);
    };

    fetchUploadedIds();
  }, []);

  const handleClick = (route) => {
    navigate(route);
  };

  const handleUploadClick = (form) => {
    const uploadedForm = uploadedIds.find((item) => item.form === form);
    if (uploadedForm) {
      const { form_id, module_id } = uploadedForm.data;
      setModalFormData({ formId: form_id, moduleId: module_id });
      setModalVisible(true);
    }
  };

  const renderColumn = (
    title,
    items,
    icon,
    param,
    routePrefix,
    showUploadIcon
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="column">
        <h5>{`${t(title)}`}</h5>
        <div className="d-flex flex-wrap">
          {items.map((item, index) => (
            <div
              key={index}
              className="d-flex align-items-center mb-2 me-3 item-container"
            >
              {showUploadIcon && item.upload ? (
                <span
                  onClick={() => handleUploadClick(item.form)}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon
                    icon={faUpload}
                    size="lg"
                    style={{
                      color: "green",
                      marginRight: "0.5rem",
                    }}
                    title={"Upload"}
                  />
                </span>
              ) : (
                <span
                  style={{
                    display: "inline-block",
                    width: "1.25rem",
                    marginRight: "0.3rem",
                  }}
                />
              )}
              <FontAwesomeIcon
                icon={icon}
                size="lg"
                style={{ color: "green", marginRight: "0.5rem" }}
              />
              <span>
                <a
                  href={`${routePrefix}${item[param]}`}
                  className="fw-bold text-black clickable"
                  onClick={(e) => {
                    if (e.button == 0) {
                      e.preventDefault();
                      handleClick(`${routePrefix}${item[param]}`);
                    }
                  }}
                >
                  {`${t(item.title)}`}
                </a>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (forms.length === 0 && reports.length === 0 && charts.length === 0) {
    return null;
  }

  return (
    <Container fluid className="p-0 m-0">
      <Card className="reportChart-cards">
        <Card.Body>
          <Row className="d-flex flex-wrap">
            {renderColumn(
              "Forms",
              forms,
              faPlusCircle,
              "form",
              "/form/runtime?formService=",
              true
            )}
            {renderColumn(
              "Reports",
              reports,
              faList,
              "report",
              "/report?report=",
              false
            )}
            {renderColumn(
              "Charts",
              charts,
              faLineChart,
              "chart",
              "/chart?chart=",
              false
            )}
          </Row>
        </Card.Body>
      </Card>
      {modalVisible && (
        <ModalForm
          component={
            <FormRunTime
              formService="dataimports"
              objectId={-1}
              modal
              formIds={modalFormData.formId}
              moduleId={modalFormData.moduleId}
              upload={true}
            />
          }
          onHide={() => setModalVisible(false)}
          show={modalVisible}
          buttonText={"dataimports"}
          variant="btn btn-outline-secondary"
        />
      )}
    </Container>
  );
};

export default FormReportChartLink;
