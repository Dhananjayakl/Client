import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonToolbar,
  ButtonGroup,
  SplitButton,
  Card,
  Dropdown,
  Modal,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFieldArray } from "react-hook-form";
import Section from "src/components/forms/reactformutils/fields/Section";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_LE_INTERNAL_LOSS_EVENT_JS";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportRuntime from "src/components/reports/Report";
import {
  faFilter,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { getPrimaryKeyByFormName } from "src/modules/admin/AdminService";
import { useEffect, useState, useRef } from "react";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
// import SmartWizard from "src/components/forms/reactformutils/elements/SmartWizard";
import Popup from "src/components/forms/reactformutils/elements/Popup";
import BottomBar from "src/components/forms/reactformutils/elements/BottomBar";
import {
  faPlusSquare,
  faTrashAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import CheckConfiguration from "./CheckConfiguration";
import { getviewData, getActionCode } from "src/modules/loss/lossFormService";
import Relationship from "src/components/forms/reactformutils/elements/Relationship";

let FilterVariable = null;
const MultiRow = (props) => {
  let {
    formMethods,
    formMetaData,
    form,
    fields,
    formValues,
    runtimeParams,
    minThreshold,
  } = props;
  const {
    control,
    getValues,
    formState: { errors, touched, isSubmitting, isDirty },
    watch,
  } = formMethods;

  console.log("formMetaDataformMetaData", formMetaData);
  const { t } = useTranslation("common");
  const {
    fields: LeFields,
    rows: leRows,
    append: appendLE,
    remove: removeLE,
    replace: replaceLE,
  } = useFieldArray({
    name: "LE",
    control,
  });

  const [arrayData, setArrayData] = useState(watch("LE"));
  const addImpRow = (entryType) => {
    appendLE({
      leCategory: 0,
      leLossAmount: null,
      leEquivalentAmount: 0,
      leCurrency:
        formMetaData.configurationFormMetaData.default_system_currency == true
          ? formMetaData.configurationFormMetaData.system_currency
          : null,
      // currency: null,
      leEntryType: entryType,
      leImpact: null,
      directLossId: null,
      leAttachFiles: null,
    });
  };

  useEffect(() => {
    const subscription = watch((value) => setArrayData(value.LE));
    return () => subscription.unsubscribe();
  }, [watch, LeFields]);

  useEffect(() => {
    setArrayData(LeFields);
  }, [LeFields, replaceLE]);

  formMetaData.form = JSHook(
    form,
    formMethods,
    formMetaData,
    runtimeParams,
    LeFields,
    arrayData,
    leRows,
    appendLE,
    removeLE,
    minThreshold
  );
  let currentStage = formMethods.getValues("currentStage");
  let allowedStages = [
    "OWNER",
    "SUBMIT-CLARIFICATION-L1",
    "SUBMIT-CLARIFICATION-L2",
    "SUBMIT-CLARIFICATION-L3",
    "SUBMIT-CLARIFICATION-L4",
    "SUBMIT-CLARIFICATION-L5",
  ];
  return (
    <>
      {formMethods.getValues("objectId") != "" &&
        formMethods.getValues("currentStage") != "TRIAGE" && (
          <Section title={t("Loss Entry")}>
            <div className="container">
              <div className="mb-2">
                <ButtonToolbar
                  className="  justify-content-center "
                  aria-label="Toolbar with Action Management"
                >
                  {formMetaData.resources.LE_LOSS_ENTRY.map((column) => (
                    <ButtonGroup
                      aria-label="First group "
                      className="flex-grow-1 me-1"
                      key={column.key}
                    >
                      {" "}
                      {allowedStages.includes(currentStage) &&
                        formMetaData.formmeta.accessCode == 1 && (
                          <Button
                            className=" btn btn-primary btn-block"
                            type="button"
                            onClick={() => {
                              if (
                                formMetaData.configurationFormMetaData == null
                              ) {
                                alert("Currency Cofiguration is not created.");
                              }

                              addImpRow(column.key);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faPlusCircle}
                              size="medium"
                              style={{ marginRight: "4px" }}
                            />
                            {t(`${column.value}`)}
                          </Button>
                        )}
                    </ButtonGroup>
                  ))}
                </ButtonToolbar>
              </div>

              <div
                style={{
                  overflowX: "auto",
                  maxWidth: "100%",
                }}
              >
                {LeFields.map((row, rowIndex) => (
                  <Row key={row.id}>
                    <Col xs={12} md={12} lg={12}>
                      <div>
                        <div className="d-flex">
                          {allowedStages.includes(currentStage) && (
                            <div
                              className="me-2 "
                              style={rowIndex == 0 ? { marginTop: "3%" } : {}}
                            >
                              {formMetaData.formmeta.accessCode == 1 && (
                                <FontAwesomeIcon
                                  icon={faTrashAlt}
                                  color="#FF0000"
                                  onClick={() => {
                                    removeLE(rowIndex);
                                  }}
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                            </div>
                          )}
                          <div
                            className="col-md-2 me-5 z-1 bg-white position-sticky start-0"
                            style={{
                              maxWidth: "100px",
                              minWidth: "100px",
                              zIndex: 1,
                            }}
                          >
                            <FormControl
                              control={control}
                              name={`LE.${rowIndex}.leEntryType`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              setData={true}
                              hideTitle={rowIndex > 0 ? true : false}
                            />
                          </div>
                          <div className="col-md-3 me-2">
                            <FormControl
                              control={control}
                              zIndex={true}
                              name={`LE.${rowIndex}.leCategory`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              setData={true}
                              hideTitle={rowIndex > 0 ? true : false}
                            />
                          </div>
                          {formMetaData.fields.leEquivalentAmount.visible && (
                            <div className="col-md-2 me-2">
                              <FormControl
                                control={control}
                                zIndex={true}
                                name={`LE.${rowIndex}.leCurrency`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                                setData={true}
                                hideTitle={rowIndex > 0 ? true : false}
                              />
                            </div>
                          )}
                          <div className="col-md-2 me-2">
                            <FormControl
                              control={control}
                              zIndex={true}
                              name={`LE.${rowIndex}.leLossAmount`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              setData={true}
                              disabled={
                                !formMethods.getValues(
                                  `LE.${rowIndex}.leCurrency`
                                ) ||
                                formMethods.getValues(
                                  `LE.${rowIndex}.leCurrency`
                                ) == ""
                                  ? true
                                  : false
                              }
                              hideTitle={rowIndex > 0 ? true : false}
                            />
                          </div>
                          {formMetaData.fields.leEquivalentAmount.visible && (
                            <div className="col-md-2 me-2">
                              <FormControl
                                control={control}
                                zIndex={true}
                                name={`LE.${rowIndex}.leEquivalentAmount`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                                setData={true}
                                hideTitle={rowIndex > 0 ? true : false}
                              />
                            </div>
                          )}
                          <div className="col-md-2 me-2">
                            <FormControl
                              control={control}
                              zIndex={true}
                              name={`LE.${rowIndex}.leImpact`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              setData={true}
                              hideTitle={rowIndex > 0 ? true : false}
                            />
                          </div>

                          <div className="col-md-4 me-3">
                            <FormControl
                              control={control}
                              zIndex={true}
                              name={`LE.${rowIndex}.leAttachFiles`}
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              setData={true}
                              hideTitle={rowIndex > 0 ? true : false}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ))}
              </div>
            </div>
          </Section>
        )}
    </>
  );
};

const BaselCategory = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;

  const {
    control,
    getValues,
    formState: { errors, touched, isSubmitting, isDirty },
    watch,
  } = formMethods;
  const { t } = useTranslation("common");
  const {
    fields: BcgFields,
    rows: BcgRows,
    append: appendBCG,
    remove: removeBCG,
    replace: replaceBCG,
  } = useFieldArray({
    name: "BCG",
    control,
  });

  const addBCGRow = (entryType) => {
    appendBCG({
      bcgAllocation: null,
      bcgId: null,
      bcgCategoryLevelOne: null,
      bcgCategoryLevelTwo: null,
      bcgCategoryLevelThree: null,
    });
  };

  const {
    fields: LossAllocFields,
    rows: LossAllocRows,
    append: appendLossAlloc,
    remove: removeLossAlloc,
    replace: replaceLossAlloc,
  } = useFieldArray({
    name: "LA",
    control,
  });

  const addLossAllocRow = (entryType) => {
    appendLossAlloc({
      laBusinessUnit: null,
      laLossAllocationId: null,
      laAllocation: null,
    });
  };

  form.bcgCategoryLevelOne.onChange(function (value, row) {
    formMethods.setValue("BCG." + row + ".bcgCategoryLevelTwo", "");
    formMethods.setValue("BCG." + row + ".bcgCategoryLevelThree", "");
  });
  form.bcgCategoryLevelTwo.onChange(function (value, row) {
    formMethods.setValue("BCG." + row + ".bcgCategoryLevelThree", "");
  });
  form.bcgAllocation.onChange(function (value, row) {
    let totalBcgAllocation = 0;
    console.log("bcgAllocation", value);

    for (let i = 0; i < formMethods.getValues("BCG").length; i++) {
      totalBcgAllocation += formMethods.getValues("BCG")[i].bcgAllocation;
    }
  });

  let currentStage = formMethods.getValues("currentStage");
  let allowedStages = [
    "OWNER",
    "SUBMIT-CLARIFICATION-L1",
    "SUBMIT-CLARIFICATION-L2",
    "SUBMIT-CLARIFICATION-L3",
    "SUBMIT-CLARIFICATION-L4",
    "SUBMIT-CLARIFICATION-L5",
  ];

  return (
    <>
      {formMethods.getValues("objectId") != "" &&
        formMethods.getValues("currentStage") != "TRIAGE" && (
          <Section title={t("Basel Categorization")}>
            <div className="mb-2">
              <ButtonToolbar
                className="  justify-content-center "
                aria-label="Toolbar with Action Management"
              >
                <ButtonGroup
                  aria-label="First group "
                  className="flex-grow-1 me-1"
                >
                  {allowedStages.includes(currentStage) &&
                    formMetaData.formmeta.accessCode == 1 && (
                      <Button
                        className=" btn btn-primary "
                        onClick={() => {
                          addBCGRow();
                        }}
                        type="button"
                      >
                        <FontAwesomeIcon icon={faPlusCircle} />{" "}
                        {t("Add Basel Category")}
                      </Button>
                    )}
                </ButtonGroup>
              </ButtonToolbar>
            </div>

            {BcgFields.map((row, rowIndex) => (
              <Row key={row.id}>
                <Col xs={12} md={12} lg={12}>
                  <div>
                    <div className="d-flex">
                      <div
                        className="me-2 "
                        style={rowIndex == 0 ? { marginTop: "3%" } : {}}
                      >
                        {allowedStages.includes(currentStage) &&
                          formMetaData.formmeta.accessCode == 1 && (
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              color="#FF0000"
                              onClick={() => removeBCG(rowIndex)}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                      </div>
                      <div className="col-md-3 me-2">
                        <FormControl
                          control={control}
                          zIndex={true}
                          name={`BCG.${rowIndex}.bcgCategoryLevelOne`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          setData={true}
                          hideTitle={rowIndex > 0 ? true : false}
                        />
                      </div>
                      <div className="col-md-3 me-2">
                        <FormControl
                          control={control}
                          zIndex={true}
                          name={`BCG.${rowIndex}.bcgCategoryLevelTwo`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          setData={true}
                          hideTitle={rowIndex > 0 ? true : false}
                          // parentKey={formMethods.getValues(
                          //   "BCG." + rowIndex + ".bcgCategoryLevelOne"
                          // )}
                          // Hierarchy={true}
                        />
                      </div>
                      <div className="col-md-3 me-2">
                        <FormControl
                          control={control}
                          zIndex={true}
                          name={`BCG.${rowIndex}.bcgCategoryLevelThree`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          setData={true}
                          hideTitle={rowIndex > 0 ? true : false}
                          parentKey={formMethods.getValues(
                            "BCG." + rowIndex + ".bcgCategoryLevelTwo"
                          )}
                          Hierarchy={true}
                        />
                      </div>
                      <div className="col-md-2 me-2">
                        <FormControl
                          control={control}
                          zIndex={true}
                          name={`BCG.${rowIndex}.bcgAllocation`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          setData={true}
                          hideTitle={rowIndex > 0 ? true : false}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            ))}
          </Section>
        )}
      {formMethods.getValues("objectId") != "" &&
        formMethods.getValues("currentStage") != "TRIAGE" && (
          <Section title={t("Loss Allocation")}>
            <div className="mb-2">
              <ButtonToolbar
                className="  justify-content-center "
                aria-label="Toolbar with Action Management"
              >
                <ButtonGroup
                  aria-label="First group "
                  className="flex-grow-1 me-1"
                >
                  {allowedStages.includes(currentStage) &&
                    formMetaData.formmeta.accessCode == 1 && (
                      <Button
                        className=" btn btn-primary "
                        onClick={() => {
                          addLossAllocRow();
                        }}
                        type="button"
                      >
                        <FontAwesomeIcon icon={faPlusCircle} />{" "}
                        {t("Add Business Unit")}
                      </Button>
                    )}
                </ButtonGroup>
              </ButtonToolbar>
            </div>

            {LossAllocFields.map((row, rowIndex) => (
              <Row key={row.id}>
                <Col xs={12} md={12} lg={12}>
                  <div>
                    <div className="d-flex">
                      <div
                        className=" me-2 "
                        style={rowIndex == 0 ? { marginTop: "3%" } : {}}
                      >
                        {allowedStages.includes(currentStage) &&
                          formMetaData.formmeta.accessCode == 1 && (
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              color="#FF0000"
                              onClick={() => removeLossAlloc(rowIndex)}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                      </div>
                      <div className="col-md-6 me-2">
                        <FormControl
                          control={control}
                          zIndex={true}
                          name={`LA.${rowIndex}.laBusinessUnit`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          setData={true}
                          hideTitle={rowIndex > 0 ? true : false}
                        />
                      </div>
                      <div className="col-md-5 me-2">
                        <FormControl
                          control={control}
                          zIndex={true}
                          name={`LA.${rowIndex}.laAllocation`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          setData={true}
                          hideTitle={rowIndex > 0 ? true : false}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            ))}
          </Section>
        )}
    </>
  );
};
const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    formState: { errors, touched, isSubmitting, isDirty },
    watch,
  } = formMethods;
  const allapprovers = [
    "levelOneApprover",
    "levelTwoApprover",
    "levelThreeApprover",
    "levelFourApprover",
    "levelFiveApprover",
  ];
  const allapproverslevelcodes = [
    "LEVEL-1-APPR",
    "LEVEL-2-APPR",
    "LEVEL-3-APPR",
    "LEVEL-4-APPR",
    "LEVEL-5-APPR",
  ];
  let previouslevelapproverValues = [];
  if (
    formMethods.getValues("previousStage") == "LEVEL-1-APPR" ||
    formMethods.getValues("previousStage") == "LEVEL-2-APPR" ||
    formMethods.getValues("previousStage") == "LEVEL-2-APPR" ||
    formMethods.getValues("previousStage") == "LEVEL-3-APPR" ||
    formMethods.getValues("previousStage") == "LEVEL-4-APPR" ||
    formMethods.getValues("previousStage") == "LEVEL-5-APPR"
  ) {
    for (let i = 0; i < allapproverslevelcodes.length; i++) {
      let tem = allapprovers[i];
      if (formValues[tem] !== null) {
        previouslevelapproverValues.push(tem);
      }
    }
  }
  CheckConfiguration(formMethods, formMetaData);
  const watchedType = watch("finalApproverStage");
  const { t } = useTranslation("common");
  let AuditFields = runtimeParams.AuditFields;
  const refreshdataref = React.useRef(null);
  runtimeParams.refreshdataref = refreshdataref;

  // let [submissionPopup, setSubmissionPopup] = useState(false);
  let [isOwnerCompleted, setIsOwnerCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [minThresholdValue, setMinhresholdValue] = useState(0);
  const [isAlertShow, setIsAlertShow] = useState(false);

  const formApi = formMetaData.formmeta.api_handler.replace(/[/]/, "");
  const formObjectId =
    formMethods.getValues("objectId") == ""
      ? -1
      : formMethods.getValues("objectId");

  const viewParams = {
    viewName: "pa_le_configuration_setup_la_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: "",
  };

  function isGreaterThanAll(threshold, array) {
    for (let obj of array) {
      if (obj.la_threshold !== null && threshold >= obj.la_threshold) {
        return false;
      }
    }
    return true;
  }
  let fieldsToManipulate = [
    "levelOneApprover",
    "levelTwoApprover",
    "levelThreeApprover",
    "levelFourApprover",
    "levelFiveApprover",
  ];
  useEffect(() => {
    if (
      formMethods.getValues("currentStage") == "OWNER" &&
      (formMethods.getValues("totalNetLoss") == null ||
        formMethods.getValues("totalNetLoss") == 0 ||
        formMethods.getValues("totalNetLoss") < minThresholdValue)
    ) {
      // fieldsToManipulate.forEach(function (fieldName) {
      //   formMethods.setValue(fieldName, null);
      //   formMetaData.fields[fieldName].visible = false;
      //   formMetaData.fields[fieldName].required = false;
      // });
    }

    if (
      formMethods.getValues("previousStage") == "SUBMIT-CLARIFICATION-L1" ||
      formMethods.getValues("previousStage") == "SUBMIT-CLARIFICATION-L2" ||
      formMethods.getValues("previousStage") == "SUBMIT-CLARIFICATION-L3" ||
      formMethods.getValues("previousStage") == "SUBMIT-CLARIFICATION-L4" ||
      formMethods.getValues("previousStage") == "SUBMIT-CLARIFICATION-L5"
    ) {
      if (formMethods.getValues("totalNetLoss") <= minThresholdValue) {
        let isreached = 0;
        for (let i = 0; i < allapprovers.length; i++) {
          let tem = allapprovers[i];
          let currentapprovalstage = allapproverslevelcodes[i];
          if (isreached == 0) {
            formMetaData.fields[tem].editable = false;
            formMetaData.fields[tem].visible = true;
          } else {
            formMetaData.fields[tem].editable = false;
            formMetaData.fields[tem].visible = false;
          }
          if (formMethods.getValues("currentStage") == currentapprovalstage) {
            isreached++;
          }
        }
      }
    }
  }, [
    formMethods.getValues("totalNetLoss"),
    formMethods.getValues("netExpectedAmount"),
    minThresholdValue,
  ]);

  let filterExpression = `form_id=${formMetaData.formmeta.form_id} and object_id='${formObjectId}'`;
  const viewParamsforOwner = {
    viewName: "pa_audit_trail_data_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: filterExpression,
  };

  useEffect(() => {
    getviewData(viewParamsforOwner)
      .then((response) => {
        let isOwner = response.data.data.some(
          (item) => item.current_stage == "OWNER"
        );
        setIsOwnerCompleted(isOwner);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
    setIsAlertShow(true);
  };

  //setting the approvers and changing the properties according to previous stage
  function assignApproversBasedOnPreviousStage(approversToShow) {
    console.log(approversToShow, "approvers in the previous stage ");
    let cStage = formMethods.getValues("currentStage");
    if (
      cStage == "SUBMIT-CLARIFICATION-L1" ||
      cStage == "SUBMIT-CLARIFICATION-L2" ||
      cStage == "SUBMIT-CLARIFICATION-L3" ||
      cStage == "SUBMIT-CLARIFICATION-L4" ||
      cStage == "SUBMIT-CLARIFICATION-L5"
    ) {
      formMethods.setValue(
        "finalApproverStage",
        formMethods.getValues("previousStage")
      );
    }
    for (let i = 0; i < approversToShow.length; i++) {
      let tem = allapprovers[i];
      const indexOfApprover = allapproverslevelcodes.indexOf(
        approversToShow[i].la_stage_code
      );
      let previousValue = formValues[tem];
      if (approversToShow[i].la_approver == null) {
        let tem = allapprovers[indexOfApprover];
        formMethods.setValue(tem, previousValue);
        formMetaData.fields[allapprovers[indexOfApprover]].required = true;
        formMetaData.fields[allapprovers[indexOfApprover]].visible = true;
        let cStage = formMethods.getValues("currentStage");
        //written beacause to show only not filled level of approvers in the edit mode else if it is filled it should be in the edit mode only
        if (
          cStage == "SUBMIT-CLARIFICATION-L1" ||
          cStage == "SUBMIT-CLARIFICATION-L2" ||
          cStage == "SUBMIT-CLARIFICATION-L3" ||
          cStage == "SUBMIT-CLARIFICATION-L4" ||
          cStage == "SUBMIT-CLARIFICATION-L5"
        ) {
          if (previousValue == null || previousValue == "") {
            formMetaData.fields[allapprovers[indexOfApprover]].editable = true;
          } else {
            formMetaData.fields[allapprovers[indexOfApprover]].editable = false;
          }
        } else {
          formMetaData.fields[allapprovers[indexOfApprover]].editable = true;
        }
      } else {
        formMethods.setValue(allapprovers[indexOfApprover], previousValue);
        formMetaData.fields[allapprovers[indexOfApprover]].editable = false;
        formMetaData.fields[allapprovers[indexOfApprover]].visible = true;
      }
      if (i + 1 > approversToShow.length) {
        formMetaData.fields[allapprovers[indexOfApprover]].editable = false;
        formMetaData.fields[allapprovers[indexOfApprover]].visible = false;
      }
    }
    for (let i = 0; i < allapprovers.length; i++) {
      let tem = allapprovers[i];
      if (i + 1 > approversToShow.length) {
        formMetaData.fields[tem].editable = false;
        formMetaData.fields[tem].visible = false;
      }
    }
  }
  //setting the approvers and changing the properties according to the Loss amount
  function approversAccordingToLossAmount(approversToShow) {
    console.log(approversToShow, "approverAccording to the show");
    const allapproverslist = approversToShow.map((item) => item.la_stage_code);
    // this code is to show the approvers when the loss amount changes and make the level of approvers non editable
    for (let i = 0; i < approversToShow.length; i++) {
      const indexOfApprover = allapproverslevelcodes.indexOf(
        approversToShow[i].la_stage_code
      );
      if (approversToShow[i].la_approver == null) {
        let tem = allapprovers[indexOfApprover];
        let previousValue = formValues[tem];
        formMethods.setValue(tem, previousValue);
        formMetaData.fields[allapprovers[indexOfApprover]].required = true;
        formMetaData.fields[allapprovers[indexOfApprover]].visible = true;
        let cStage = formMethods.getValues("currentStage");
        //written beacause to show only not filled level of approvers in the edit mode else if it is filled it should be in the edit mode only
        if (
          cStage == "SUBMIT-CLARIFICATION-L1" ||
          cStage == "SUBMIT-CLARIFICATION-L2" ||
          cStage == "SUBMIT-CLARIFICATION-L3" ||
          cStage == "SUBMIT-CLARIFICATION-L4" ||
          cStage == "SUBMIT-CLARIFICATION-L5"
        ) {
          if (previousValue == null || previousValue == "") {
            formMetaData.fields[allapprovers[indexOfApprover]].editable = true;
          } else {
            formMetaData.fields[allapprovers[indexOfApprover]].editable = false;
          }
        } else {
          formMetaData.fields[allapprovers[indexOfApprover]].editable = true;
        }
      } else {
        formMethods.setValue(
          allapprovers[indexOfApprover],
          approversToShow[i].la_approver
        );
        formMetaData.fields[allapprovers[indexOfApprover]].editable = false;
        formMetaData.fields[allapprovers[indexOfApprover]].visible = true;
      }
    }

    for (let i = 0; i < allapprovers.length; i++) {
      let tem = allapprovers[i];
      if (i + 1 > approversToShow.length) {
        formMetaData.fields[tem].editable = false;
        formMetaData.fields[tem].visible = false;
      }
    }
  }

  //for getting the data of approvers in the previous stage
  function ApproversUntilLastStage(Data) {
    let previousapproverslimit = [];
    //this  code is for to set the number of approvers there whe it got triggerd for request
    if (
      formMethods.getValues("previousStage") == "LEVEL-1-APPR" ||
      formMethods.getValues("previousStage") == "LEVEL-2-APPR" ||
      formMethods.getValues("previousStage") == "LEVEL-3-APPR" ||
      formMethods.getValues("previousStage") == "LEVEL-4-APPR" ||
      formMethods.getValues("previousStage") == "LEVEL-5-APPR"
    ) {
      for (let i = 0; i < Data.length; i++) {
        if (Data[i].la_stage_code !== formMethods.getValues("previousStage")) {
          previousapproverslimit.push(Data[i]);
        } else {
          previousapproverslimit.push(Data[i]);
          break;
        }
      }
    }
    return previousapproverslimit;
  }

  useEffect(() => {
    const buttons = document.querySelectorAll(".disbutton");
    if (
      formMethods.getValues("totalNetLoss") != null &&
      formMethods.getValues("totalNetLoss") != 0
    ) {
      getviewData(viewParams)
        .then((response) => {
          console.log(
            formMethods.getValues("totalNetLoss"),
            "laThresholdlaThreshold",
            response
          );
          const responseData = response.data;
          let isGreaterThan = isGreaterThanAll(
            formMethods.getValues("totalNetLoss"),
            responseData.data
          );

          if (responseData.data.length > 0) {
            let minThreshold = responseData.data[0].la_threshold;
            for (let i = 1; i < responseData.data.length; ++i) {
              if (responseData.data[i].la_threshold != null)
                if (responseData.data[i].la_threshold < minThreshold) {
                  minThreshold = responseData.data[i].la_threshold;
                }
            }
            setMinhresholdValue(minThreshold);
          }
          let combinedArray = [];

          if (isGreaterThan == false) {
            const filteredArray = [];
            const breakedArray = [];
            for (let i = 0; i < response.data.data.length; i++) {
              if (response.data.data[i].la_threshold != null) {
                if (
                  response.data.data[i].la_threshold >=
                  formMethods.getValues("totalNetLoss")
                ) {
                  console.log(
                    response.data.data[i].la_threshold,
                    " Threshold Values"
                  );
                  breakedArray.push(response.data.data[i]);
                } else {
                  filteredArray.push(response.data.data[i]);
                }
              }
            }
            combinedArray = [...filteredArray];
          }
          buttons.forEach((button) => {
            const buttonChildren = button.textContent.trim();
            if (combinedArray.length === 0) {
              button.hidden = buttonChildren === "Submit and Initiate Action";
            } else {
              button.hidden = buttonChildren === "Submit";
            }
          });

          let previousapproverslimit = ApproversUntilLastStage(
            response.data.data
          );
          //this code is to set the finalapproverstage
          if (combinedArray.length > 0) {
            if (combinedArray.length == 1) {
              formMethods.setValue(
                "finalApproverStage",
                combinedArray[0].la_stage_code
              );
            } else if (combinedArray.length > 0) {
              let maxIndex = combinedArray.length - 1;
              formMethods.setValue(
                "finalApproverStage",
                combinedArray[maxIndex].la_stage_code
              );
            }
            // console.log(formValues.totalNetLoss,"owner is completed  loss amount",formMethods.getValues("totalNetLoss"));
            if (
              isOwnerCompleted == true &&
              formMethods.getValues("totalNetLoss") < formValues.totalNetLoss
            ) {
              if (
                !isAlertShow &&
                formMethods.getValues("currentStage") != "OWNER"
              ) {
                openModal(
                  "The updated net loss value is lower than the previous net loss value."
                );
              }
              fieldsToManipulate.forEach(function (fieldName) {
                formMethods.setValue(fieldName, null);
              });
            }
            if (formMethods.getValues("currentStage") != "PUBLISHED") {
              //if-else written if the loss amount is reduced than the level of clarification requested then it should not decreased according to the loss amount approvers need to be shown as it is level of approver requested for clarification
              if (previousapproverslimit.length >= combinedArray.length) {
                assignApproversBasedOnPreviousStage(previousapproverslimit);
              } else {
                let cStage = formMethods.getValues("currentStage");
                if (
                  cStage !== "LEVEL-1-APPR" &&
                  cStage !== "LEVEL-2-APPR" &&
                  cStage !== "LEVEL-3-APPR" &&
                  cStage !== "LEVEL-4-APPR" &&
                  cStage !== "LEVEL-5-APPR"
                ) {
                  approversAccordingToLossAmount(combinedArray);
                }
              }
            } else {
              fieldsToManipulate.forEach(function (fieldName) {
                if (
                  formMethods.getValues(fieldName) != "" &&
                  formMethods.getValues(fieldName) != null
                )
                  formMetaData.fields[fieldName].visible = true;
              });
            }
            //when all approvers are finished saying it is the final stage
            if (formValues.currentStage == formValues.finalApproverStage) {
              formMethods.setValue(
                "finalApproverStage",
                formValues.currentStage
              );
            }
          }
          //when after the loss amount is reduced much to show the level approver as time when it get request for clarification
          if (previousapproverslimit.length > combinedArray.length) {
            assignApproversBasedOnPreviousStage(previousapproverslimit);
          } else if (combinedArray.length == 0) {
            approversAccordingToLossAmount([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    formMethods.getValues("totalNetLoss"),
    formMethods.getValues("netExpectedAmount"),
    formMethods.getValues("LE"),
    minThresholdValue,
  ]);

  useEffect(() => {
    if (
      formMethods.getValues("currentStage") == "LEVEL-1-APPR" ||
      formMethods.getValues("currentStage") == "LEVEL-2-APPR" ||
      formMethods.getValues("currentStage") == "LEVEL-2-APPR" ||
      formMethods.getValues("currentStage") == "LEVEL-3-APPR" ||
      formMethods.getValues("currentStage") == "LEVEL-4-APPR" ||
      formMethods.getValues("currentStage") == "LEVEL-5-APPR"
    ) {
      let approverlast = formMethods.getValues("finalApproverStage");
      let last = 0;
      for (let i = 0; i < allapprovers.length; i++) {
        let tem = allapprovers[i];
        if (last == 0 && allapproverslevelcodes[i] != approverlast) {
          formMetaData.fields[tem].visible = true;
          formMetaData.fields[tem].editable = false;
        } else if (allapproverslevelcodes[i] == approverlast) {
          last++;
          formMetaData.fields[tem].visible = true;
          formMetaData.fields[tem].editable = false;
        } else {
          formMetaData.fields[tem].visible = false;
        }
      }
    }
  }, []);

  const watchedTypeone = watch("totalGrossLoss");
  const watchedTypeFour = watch("lastOccurrence");
  formValues.source_form_name = "LE_INTERNAL_LOSS_EVENT";
  const divStyle = {
    gap: "20px",
    display: window.innerWidth > 800 ? "flex" : "block",
  };
  let currentStage = formMethods.getValues("currentStage");
  let allowedStages = [
    "OWNER",
    "SUBMIT-CLARIFICATION-L1",
    "SUBMIT-CLARIFICATION-L2",
    "SUBMIT-CLARIFICATION-L3",
    "SUBMIT-CLARIFICATION-L4",
    "SUBMIT-CLARIFICATION-L5",
  ];

  return (
    <div className="pdf">
      <Container className="justify-content-center">
        <Section title={t("Details")}>
          <Row>
            <div className="col-md-9">
              <FormControl
                control={control}
                type="input"
                name="eventName"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                type="input"
                name="status"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div>
              <FormControl
                control={control}
                type="textarea"
                name="description"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                // type="select"
                name="reportedDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>

            {formMethods.getValues("objectId") == "" && (
              <div className="col-md-6">
                <FormControl
                  control={control}
                  // type="select"
                  name="businessUnit"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  zIndex={true}
                />
              </div>
            )}

            <div className="col-md-6">
              <FormControl
                control={control}
                // type="select"
                name="financialStatus"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          <Row>
            {formMethods.getValues("objectId") != "" && (
              <div className="col-md-6">
                <FormControl
                  control={control}
                  // type="select"
                  name="businessUnit"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            )}
            <div className="col-md-6">
              <FormControl
                control={control}
                // type="select"
                name="owner"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                // type="select"
                name="impactedBu"
                formMetaData={formMetaData}
                formMethods={formMethods}
                zIndex={true}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                // type="select"
                name="relatedRisks"
                formMetaData={formMetaData}
                formMethods={formMethods}
                zIndex={true}
              />
            </div>
          </Row>

          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                // type="select"
                name="impactRating"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="boundaryEvent"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>

        {formMethods.getValues("objectId") != "" && (
          <Section title={t("Key Dates")}>
            <Row>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  // type="select"
                  name="firstOccurrence"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  minDate={new Date()}
                />
              </div>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  // type="select"
                  name="lastOccurrence"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate={true}
                  futureDateValue={
                    formMethods.getValues("firstOccurrence") != ""
                      ? new Date(formMethods.getValues("firstOccurrence"))
                      : new Date("01-01-1900")
                  }
                  minDate={new Date()}
                />
              </div>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  // type="select"
                  name="identifedOn"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate={true}
                  futureDateValue={
                    formMethods.getValues("firstOccurrence") != ""
                      ? new Date(formMethods.getValues("firstOccurrence"))
                      : new Date()
                  }
                  minDate={new Date()}
                />
              </div>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  // type="select"
                  name="financialImpactOn"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>

            <Row>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  // type="select"
                  name="provisionOn"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate={true}
                  futureDateValue={
                    formMethods.getValues("firstOccurrence") != ""
                      ? new Date(formMethods.getValues("firstOccurrence"))
                      : new Date("01-01-1900")
                  }
                />
              </div>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  // type="select"
                  name="settlementOn"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate={true}
                  futureDateValue={
                    formMethods.getValues("firstOccurrence") != ""
                      ? new Date(formMethods.getValues("firstOccurrence"))
                      : new Date("01-01-1900")
                  }
                />
              </div>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  // type="select"
                  name="expectedClosure"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate={true}
                  futureDateValue={
                    formMethods.getValues("createdOn") != ""
                      ? new Date(formMethods.getValues("createdOn"))
                      : new Date("01-01-1900")
                  }
                />
              </div>
            </Row>
          </Section>
        )}
        <MultiRow
          form={form}
          formMethods={formMethods}
          formMetaData={formMetaData}
          runtimeParams={runtimeParams}
          minThreshold={minThresholdValue}
        />

        {formMethods.getValues("objectId") != "" &&
          formMethods.getValues("currentStage") != "TRIAGE" && (
            <Section title={t("Loss Event Summary")}>
              <div className="table-responsive">
                <table
                  className="table  table-bordered table-sm "
                  // style={{ width: "50%" }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: "33%" }}>{t("Particulars")}</th>
                      <th style={{ width: "33%" }}>{t("Loss")}</th>
                      <th style={{ width: "33%" }}>{t("Gain")}</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <tr>
                      <td>{t("Direct Loss")}</td>
                      <td>{formMethods.getValues("netDirectLoss")}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>{t("Indirect Loss")}</td>
                      <td>{formMethods.getValues("netIndirectLoss")}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>{t("Additional Cost")}</td>
                      <td>{formMethods.getValues("netAdditionalCost")}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>{t("Recoveries")}</td>
                      <td></td>
                      <td>{formMethods.getValues("netRecoveryAmount")}</td>
                    </tr>

                    <tr>
                      <th>{t("Gross")}</th>
                      <th>{formMethods.getValues("totalGrossLoss")}</th>
                      <th>{formMethods.getValues("netRecoveryAmount")}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Row className="mb-2">
                <Col xs={12} md={6}>
                  <Row className="align-items-center">
                    <Col xs={5} md={4} className="font-weight-bold">
                      {t("Gross Loss")}
                    </Col>
                    <Col xs={7} md={8}>
                      : {formMethods.getValues("totalGrossLoss")}
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} md={6}>
                  <Row className="align-items-center">
                    <Col xs={5} md={4} className="font-weight-bold">
                      {t("Net Loss")}
                    </Col>
                    <Col xs={7} md={8}>
                      : {formMethods.getValues("totalNetLoss")}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mb-2">
                <Col xs={12} md={6}>
                  <Row className="align-items-center">
                    <Col xs={5} md={4} className="font-weight-bold">
                      {t("Potential Loss")}
                    </Col>
                    <Col xs={7} md={8}>
                      : {formMethods.getValues("netPotentialAmount")}
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} md={6}>
                  <Row className="align-items-center">
                    <Col xs={5} md={4} className="font-weight-bold">
                      {t("Expected Loss")}
                    </Col>
                    <Col xs={7} md={8}>
                      : {formMethods.getValues("netExpectedAmount")}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div className="table-responsive " style={divStyle}></div>
            </Section>
          )}

        <BaselCategory
          form={form}
          formMethods={formMethods}
          formMetaData={formMetaData}
          runtimeParams={runtimeParams}
        />

        {formMethods.getValues("objectId") != "" &&
          formMethods.getValues("currentStage") != "TRIAGE" && (
            <Section title={t("Approvers")}>
              <Row>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    // type="select"
                    name="levelOneApprover"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    closeButton={true}
                  />
                </div>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    // type="select"
                    name="levelTwoApprover"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    closeButton={true}
                  />
                </div>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    // type="select"
                    name="levelThreeApprover"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    closeButton={true}
                  />
                </div>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    // type="select"
                    name="levelFourApprover"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    closeButton={true}
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    // type="select"
                    name="levelFiveApprover"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    closeButton={true}
                  />
                </div>
              </Row>
            </Section>
          )}

        {formMethods.getValues("objectId") != "" &&
          formMethods.getValues("currentStage") != "TRIAGE" && (
            <Section title={t("Analysis")}>
              <Row>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    // type="select"
                    name="rootCause"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>

                <div className="col-md-6">
                  <FormControl
                    control={control}
                    // type="select"
                    name="rootCauseAnalysis"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    // type="select"
                    name="communicationPlan"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    // type="select"
                    name="regulatoryOrCompliance"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            </Section>
          )}

        {formMethods.getValues("objectId") != "" &&
          formMethods.getValues("currentStage") != "TRIAGE" && (
            <Section title={t("Findings")}>
              {formMetaData.formmeta.accessCode == 1 &&
                allowedStages.includes(currentStage) && (
                  <div>
                    <ButtonToolbar
                      className="justify-content-center mb-1"
                      aria-label="Toolbar with Action Management"
                    >
                      <ButtonGroup
                        aria-label="First group"
                        className="flex-grow-1"
                      >
                        <ModalForm
                          objectId={-1}
                          component={
                            <FormRunTime
                              formService="issueobservation"
                              objectId={-1}
                              modal
                              // runtimeParams={{ objectData: { formValues } }}
                              objectData={formValues}
                              // ParentFormObjectId={formMethods.getValues("objectId")}
                              type="1"
                              callbackParent={form.callbackFromChild}
                            />
                          }
                          buttonText={
                            <>
                              <FontAwesomeIcon icon={faPlusCircle} size="lg" />{" "}
                              {t("Add Findings")}
                            </>
                          }
                          size="xl"
                        />
                      </ButtonGroup>
                    </ButtonToolbar>
                  </div>
                )}
              <ReportRuntime
                refreshdataref={refreshdataref}
                report="IR_LE_FINDINGS"
                drilldownReports={{
                  objectId: formMethods.getValues("objectId"),
                }}
              />
            </Section>
          )}
        <Section title={t("Additional Details")}>
          <Row>
            <FormControl
              control={control}
              // type="singleattach"
              name="attachFiles"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
        </Section>

        {formMethods.getValues("objectId") != "" && (
          <Relationship
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
            sourceName="LE_INTERNAL_LOSS_EVENT"
            formValues={formValues}
            hidden={
              runtimeParams.formmeta.accessCode != 1 ||
              formMethods.getValues("currentStage") == "INITIATE" ||
              formMethods.getValues("currentStage") == "CLOSE" ||
              formMethods.getValues("currentStage") == "PUBLISHED"
                ? true
                : false
            }
          />
        )}

        {formMethods.getValues("objectId") != "" &&
          formMethods.getValues("currentStage") != "INITIATE" && (
            <AuditTrail
              formMetaData={formMetaData}
              formMethods={formMethods}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
            />
          )}
      </Container>

      <Modal show={isModalOpen} size="sm" onHide={closeModal} centered>
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title className="font-weight-bold mb-0">
            <h3 className="mb-0" style={{ color: "red" }}>
              Notification
            </h3>
          </Modal.Title>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={closeModal}
            className="cursor-pointer"
            aria-label="Close"
            size="lg"
          />
        </Modal.Header>
        <Modal.Body>
          <h4>{modalContent}</h4>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FormLayout;
