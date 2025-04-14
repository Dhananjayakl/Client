import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";

const Buttons = ({
  isProcess,
  isControl,
  isTest,
  isAsset,
  isSop,
  isThirdParty,
  isBusiness,
  isArea,
  isRequire,
  isControls,
  isObligate,
  isBusinessUnit,
  isTestProcedure,
  handleAddButtonClick,
  handleDeleteNode,
  handleCreateNode,
  setObjectRisk,
  setObjectControl,
  setObjectTest,
  setObjectAsset,
  setObjectSop,
  setObjectThird,
  setObjectArea,
  setObjectRequire,
  setObjectObligate,
  setObjectBusiness,
}) => {
  const getButtonJson = (
    formService,
    label,
    includeButtons = [0, 1, 2],
    disableAddCreate = false
  ) => {
    let obj = [
      {
        text: (
          <>
            {label} (<FontAwesomeIcon icon={faPlus} className="p-0 m-0" />)
          </>
        ),
        variant: "btn btn-outline-secondary",
        formService: formService,
        action: "modalForm",
        disabled: disableAddCreate,
      },
      {
        text: (
          <>
            <FontAwesomeIcon icon={faListCheck} />
          </>
        ),
        onClick: () => handleAddButtonClick(),
        variant: "btn btn-outline-secondary",
        action: "function",
        disabled: disableAddCreate,
      },
      {
        text: (
          <>
            <FontAwesomeIcon icon={faTrash} className="m-0  " />
          </>
        ),
        onClick: () => handleDeleteNode(),
        variant: "btn btn-outline-danger",
        action: "function",
      },
    ];

    return includeButtons.map((index) => obj[index]);
  };

  const buttonConfigurations = {
    isProcess: getButtonJson("risk", "RSK", [0, 1]),
    isControl: getButtonJson("control", "CTL", [0, 1, 2]),
    isTestProcedure: getButtonJson("testandprocedures", "", [0, 1, 2], true),
    isBusiness: getButtonJson("", "", [0, 1, 2], true),
    isAsset: getButtonJson("asset", "AST", [0, 1]),
    isThirdParty: getButtonJson("thirdparty", "TP", [0, 1]),
    isSop: getButtonJson("standardoperatingprocedures", "SOP", [0, 1]),
    isArea: getButtonJson("areaofcompliance", "AOC", [0, 1]),
    isRequire: getButtonJson("requirement", "REQ", [0, 1, 2]),
    isControls: getButtonJson("control", "CTL", [0, 1]),
    isObligate: getButtonJson("reportingobligations", "OBL", [0, 1]),
    isBusinessUnit: getButtonJson("businessunit", "BU", [1]),
    isTest: getButtonJson("testandprocedures", "TST"),
  };

  const applicableConfigs = isProcess
    ? buttonConfigurations.isProcess
    : isControl
    ? buttonConfigurations.isControl
    : isTest
    ? buttonConfigurations.isTest
    : isTestProcedure
    ? buttonConfigurations.isTestProcedure
    : isBusiness
    ? buttonConfigurations.isBusiness
    : isAsset
    ? buttonConfigurations.isAsset
    : isSop
    ? buttonConfigurations.isSop
    : isArea
    ? buttonConfigurations.isArea
    : isRequire
    ? buttonConfigurations.isRequire
    : isControls
    ? buttonConfigurations.isControls
    : isObligate
    ? buttonConfigurations.isObligate
    : isBusinessUnit
    ? buttonConfigurations.isBusinessUnit
    : isThirdParty
    ? buttonConfigurations.isThirdParty
    : [];
  let objectRiskArray = [];
  let objectControlArray = [];
  let objectTestArray = [];
  let objectAssetArray = [];
  let objectSopArray = [];
  let objectThirdArray = [];
  let objectAreaArray = [];
  let objectRequireArray = [];
  let objectObligateArray = [];
  let objectBusinessArray = [];

  const [shouldCreateNode, setShouldCreateNode] = useState(false);

  const [status, setStatus] = useState(null);
  function callbackFromChild(props) {
    console.log("calledback", props);

    const objectName = props.dataRefValue.name;
    const objectNames = props.dataRefValue.deliverable;
    const objectNamed = props.dataRefValue.business_entity_name;
    const formService = props.serviceName;
    const data = props.data;
    const status = props.status;

    setStatus(status);
    setShouldCreateNode(true);
    if (formService === "risk") {
      const id = data;
      const name = objectName;
      objectRiskArray.push({ name, id });
      setObjectRisk(objectRiskArray);
    } else if (formService === "control") {
      const id = data;
      const name = objectName;
      objectControlArray.push({ name, id });
      setObjectControl(objectControlArray);
    } else if (formService === "testandprocedures") {
      const id = data;
      const name = objectName;
      objectTestArray.push({ name, id });
      setObjectTest(objectTestArray);
    } else if (formService === "asset") {
      const id = data;
      const name = objectName;
      objectAssetArray.push({ name, id });
      setObjectAsset(objectAssetArray);
    } else if (formService === "standardoperatingprocedures") {
      const id = data;
      const name = objectName;
      objectSopArray.push({ name, id });
      setObjectSop(objectSopArray);
    } else if (formService === "thirdparty") {
      const id = data;
      const name = objectName;
      objectThirdArray.push({ name, id });
      setObjectThird(objectThirdArray);
    } else if (formService === "areaofcompliance") {
      const id = data;
      const name = objectName;
      objectAreaArray.push({ name, id });
      setObjectArea(objectAreaArray);
    } else if (formService === "requirement") {
      const id = data;
      const name = objectName;
      objectRequireArray.push({ name, id });
      setObjectRequire(objectRequireArray);
    } else if (formService === "reportingobligations") {
      const id = data;
      const name = objectNames;
      objectObligateArray.push({ name, id });
      setObjectObligate(objectObligateArray);
    } else if (formService === "businessunit") {
      const id = data;
      const name = objectNamed;
      objectBusinessArray.push({ name, id });
      setObjectBusiness(objectBusinessArray);
    } else {
      console.log("Unknown formService:", formService);
    }
  }

  useEffect(() => {
    if (shouldCreateNode) {
      handleCreateNode();

      setShouldCreateNode(false);
    }
  }, [shouldCreateNode, callbackFromChild]);

  const buttons = applicableConfigs
    ? applicableConfigs.map((config, index) => (
        <React.Fragment key={index}>
          {config.action === "modalForm" ? (
            <ModalForm
              className="ms-1"
              objectId={-1}
              formname={config.formService}
              component={
                <FormRunTime
                  formService={config.formService}
                  objectId={-1}
                  modal
                  callbackParent={callbackFromChild}
                />
              }
              buttonText={config.text}
              variant="btn btn-outline-secondary"
              callbackOnClick={() => handleCreateNode()}
              disabled={config.disabled}
            />
          ) : (
            <Button
              variant={config.variant}
              onClick={config.onClick}
              className="ms-1"
              disabled={config.disabled}
            >
              {config.text}
            </Button>
          )}
        </React.Fragment>
      ))
    : null;

  return <>{buttons}</>;
};

export default Buttons;
