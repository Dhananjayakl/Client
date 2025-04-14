import React from "react";
import { Form, Col, Row } from "react-bootstrap";
// import FieldToolTip from "./FieldToolTip";
import CustomTooltip from "./FieldToolTip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
const FieldDom = (props) => {
  let Switch = false;
  const {
    field_title,
    tooltip,
    required,
    error,
    help_text,
    children,
    visible,
    editable,
    singleRow,
    name,
    fieldDef,
    type,
    placeholder,
    responseMessage,
  } = props;
  if (fieldDef?.field_type == 7) {
    Switch = fieldDef?.field_type;
  } else if (type == "swicth") {
    Switch = type;
  }
  // console.log("all props", Switch);
  // console.log("FieldDomformMetaData", formMetaData?.formmeta?.form_name);

  const formName = props?.fieldProps?.formMetaData?.formmeta?.form_name;

  const { t } = useTranslation([
    "grc",
    "vendor",
    "risk",
    "compliance",
    "survey",
    "audits",
    "loss",
    "issue",
    "businessresilience",
    "documentpolicy",
  ]);

  let translationKey;

  const key = name.includes(".") ? name.split(".").pop() : name;
  console.log(key, "key valueee");

  if (i18n.language === "en") {
    translationKey = `${key}`;
  } else {
    translationKey = `${formName}.${key}`;
  }
  const translatedTitle = t(translationKey, {
    ns: [
      "grc",
      "vendor",
      "risk",
      "compliance",
      "survey",
      "audits",
      "loss",
      "issue",
      "businessresilience",
      "documentpolicy",
    ],
    defaultValue: field_title,
  });

  console.log(name, field_title, "fieldtitlename");

  let formGroupClassName = visible === false ? "d-none" : "";
  formGroupClassName = formGroupClassName + " mb-2";

  if (singleRow) {
    return (
      <Form.Group className={formGroupClassName}>
        <Row>
          <Col
            md={props.labelSize}
            className={`${props.hideTitle ? "d-none" : ""}`}
          >
            <Form.Label htmlFor={props.id} className="text-dark fw-medium">
              {/* {field_title} */}
              {translatedTitle}
            </Form.Label>
            {editable && required && <span className="text-danger">*</span>}
            <CustomTooltip
              data-toggle="tooltip"
              tooltip={props.tooltip}
              guidence={props.guidence}
            >
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="p-0"
                style={{
                  color: "#087990",
                  marginLeft: "3px",
                  position: "relative",
                }}
              />
            </CustomTooltip>
          </Col>
          <Col>
            {children}
            {error && (
              <Form.Control.Feedback type="invalid">
                {error.message}
              </Form.Control.Feedback>
            )}
            <Form.Text>{help_text}</Form.Text>
          </Col>
        </Row>
      </Form.Group>
    );
  } else {
    //console.log("Invoke - " + props.placeholder);
    //console.log(type, fieldDef?.field_type, "types are here");
    return (
      <Form.Group className={formGroupClassName}>
        <Col className={`${props.hideTitle ? "d-none" : ""}`}>
          <Col>
            {!Switch && (
              <Form.Label
                id={props.name}
                htmlFor={props.id}
                className="text-dark fw-medium"
              >
                {/* {t(name) === name ? field_title : t(name)} */}
                {translatedTitle}

                {editable && required && (
                  <span id={`${props.name}*`} className="text-danger">
                    *
                  </span>
                )}
                <CustomTooltip
                  data-toggle="tooltip"
                  tooltip={props.tooltip}
                  guidence={props.guidence}
                >
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    className="p-0"
                    style={{
                      color: "#087990",
                      marginLeft: "3px", // No gap between text and icon
                      position: "relative",
                    }}
                  />
                </CustomTooltip>
              </Form.Label>
            )}
          </Col>
        </Col>

        {children}
        {error && !responseMessage && (
          <Form.Control.Feedback type="invalid">
            {error.message}
          </Form.Control.Feedback>
        )}
        {/* <Form.Control.placeholder>
          {t(placeholder) === placeholder ? placeholder : t(placeholder)}
        </Form.Control.placeholder> */}
        <Form.Text>{help_text}</Form.Text>
      </Form.Group>
    );
  }
};

export default FieldDom;
