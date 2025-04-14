import React from "react";
import { Button, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";

const OptionsCard = ({ objectId, businessUnit, framework, render, button }) => {
  const renderFormButton = (formService, label) => {
    return (
      <ModalForm
        key={label}
        objectId={-1}
        component={
          <FormRunTime
            formService={formService}
            objectId={-1}
            assessableEntity={
              formService === "triggertest" ||
              formService === "triggerriskassessment"
                ? [objectId]
                : null
            }
            process={
              formService === "selfassessment" || formService === "rcmreview"
                ? [objectId]
                : null
            }
            businessUnit={[businessUnit]}
            button={button}
            modal
          />
        }
        buttonText={
          <Button variant="link" style={{ color: "white" }}>
            <span>{label}</span>
          </Button>
        }
        variant="link"
      />
    );
  };
  const privs = util.getCurrentUser().privileges?.split(",");

  const buttonsSetOne = [
    {
      formService: "rcmreview",
      label: "RCM Review",
    },
    {
      formService: "triggerriskassessment",
      label: "Risk Assessment",
    },
  ];
  const buttonsSetTwo = [
    {
      formService: "triggertest",
      label: "Compliance Review",
    },
    {
      formService: "selfassessment",
      label: "Business Review",
    },
  ];
  const buttonsSetThree = [
    {
      formService: "triggerriskassessment",
      label: "Risk Assessment",
    },
    {
      formService: "triggertest",
      label: "Compliance Review",
    },
  ];

  let buttons = [];

  if (
    (framework = "Process Compliance") &&
    privs.includes("GL_PROCESS_COM_FRAMEWORK")
  ) {
    buttons = buttonsSetOne;
  }
  if (
    (framework = "Process Compliance") &&
    privs.includes("GL_PROCESS_COM_FRAMEWORK") &&
    privs.includes("GL_REGULATORY_COM_FRAMEWORK")
  ) {
    buttons = buttonsSetTwo;
  }
  if (
    (framework = "Regulatory Compliance") &&
    privs.includes("GL_PROCESS_COM_FRAMEWORK") &&
    privs.includes("GL_REGULATORY_COM_FRAMEWORK") &&
    button === "extra"
  ) {
    buttons = buttonsSetThree;
  }

  return (
    render === true && (
      <ButtonToolbar className="justify-content-center mb-1">
        <ButtonGroup>
          {buttons.map((button, index) => (
            <React.Fragment key={button.label}>
              {renderFormButton(button.formService, button.label)}
              {index < buttons.length - 1 && (
                <div className="vr bg-primary me-1"></div>
              )}
            </React.Fragment>
          ))}
        </ButtonGroup>
      </ButtonToolbar>
    )
  );
};

export default OptionsCard;
