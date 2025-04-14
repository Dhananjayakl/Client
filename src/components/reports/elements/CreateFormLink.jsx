import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const CreateFormLink = (props) => {
  let { formLinks, reportMeta } = props;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const languageDirection = i18n.dir();
  const floatClass =
    (languageDirection === "ltr" ? "float-end" : "float-start") + " mx-1";
  return (
    <div className={`${floatClass}`}>
      <div className="d-flex flex-wrap">
        {formLinks.map((link, index) => (
          <Button
            // variant="purple"
            variant={reportMeta?.reportInfo?.theme == 2 ? "light" : "purple"}
            // className="m-1"
            className="ms-1 border-primary"
            // style={{ fontSize: '12px', height: '30px' }}
            key={index}
            onClick={() =>
              navigate(
                `/form/runtime?formService=${link.apiHander}&objectId=${-1}`
              )
            }
          >
            {/* + Add {link.formTitle} */}
            <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
            {t(link.formTitle)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CreateFormLink;
