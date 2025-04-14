import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useFieldArray, useWatch } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import JSHook from "./PA_IA_CREATE_WORKPAPER_JS";
import { useTranslation } from "react-i18next";
let FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues, runtimeParams } = props;
  const { t } = useTranslation("common");
  const {
    setError,
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touched, isSubmitting, isDirty },
  } = formMethods;
  let wpType = useWatch({
    control: control,
    name: "wpType",
  });

  const riskList = [
    ...new Set(
      formValues.SCP?.reduce(
        (accumulator, currentValue) => [...accumulator, currentValue.ctRiskID],
        []
      )
    ),
  ];

  const {
    fields: SCPFields,
    append: SCPappend,
    remove: SCPremove,
  } = useFieldArray({
    name: "SCP",
    control,
  });
  const addScpRow = () => {
    SCPappend({
      scpId: "",
      scpAEProcess: "",
      scpRisk: "",
      scpControl: "",
    });
  };
  const [auditName, setauditName] = useState("");
  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    control,
    runtimeParams,
    addScpRow,
    setauditName
  );
  let planStartdate = new Date(new Date(runtimeParams.planStartdate));
  planStartdate.setDate(planStartdate.getDate());
  const currDate = new Date();
  const planendDate = new Date(new Date(runtimeParams.planendDate));
  planendDate.setDate(planendDate.getDate());
  const StartDate = useWatch({
    control: control,
    name: "wpStartDate",
  });
  console.log(runtimeParams, formMetaData, "frfuiui");

  return (
    <>
      <Container className="justify-content-center">
        <Section title="General" required>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="wpTitle"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="wpType"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-8">
              {/* <FormControl
                control={control}
                // field_title="Audit Title"
                // value={formMethods.getValues("auditTitle")}
                name="auditId"
                formMetaData={formMetaData}
                formMethods={formMethods}
                link={runtimeParams.modal ? false : true}
              /> */}
              <Row>
                <label>{t("Audit Title")} </label>
              </Row>
              <ModalForm
                form={"audits"}
                objectId={runtimeParams.ParentFormObjectId}
                className="mb-8"
                variant
                style={{
                  textDecoration: "underline",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
                component={
                  <FormRunTime
                    formService="audits"
                    objectId={runtimeParams.ParentFormObjectId}
                    modal
                    // callbackParent={callbackFromChild}
                  />
                }
                buttonText={auditName}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="wpCategory"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="checklistName"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <Col>
              <SubSection title="Scope">
                <Row>
                  <div className="col-md-12">
                    <FormControl
                      control={control}
                      name="businessUnit"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      // singleRow
                      labelSize={4}
                    />
                  </div>
                  <div className="col-md-12">
                    <FormControl
                      control={control}
                      name="aeProcess"
                      zIndex={true}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      // singleRow
                      labelSize={4}
                    />
                  </div>
                </Row>
              </SubSection>
            </Col>
            <Col>
              <SubSection title="Ownership">
                <Row>
                  <div className="col-md-12">
                    <FormControl
                      control={control}
                      name="wpAuditor"
                      zIndex={true}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      // singleRow
                      labelSize={4}
                    />
                  </div>
                </Row>
                <Row>
                  <div className="col-md-12">
                    <FormControl
                      control={control}
                      name="wpApprover"
                      zIndex={true}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      // singleRow
                      labelSize={4}
                    />
                  </div>
                </Row>
              </SubSection>
            </Col>
            <Col>
              <SubSection title="Key Dates">
                {/* <Row> */}
                <FormControl
                  control={control}
                  name="wpStartDate"
                  zIndex={true}
                  modal={props?.modal ? true : false}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  // singleRow
                  labelSize={5}
                  ConditionalDate={planendDate}
                  futureDate={true}
                  // futureDateValue={planStartdate>=currDate>=planendDate?planStartdate:currDate}
                  futureDateValue={planStartdate}
                  // minDate={planStartdate}
                />
                {/* </Row> */}

                <Row>
                  <FormControl
                    control={control}
                    name="wpEndDate"
                    zIndex={true}
                    modal={props?.modal ? true : false}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    // singleRow
                    labelSize={5}
                    futureDate={true}
                    futureDateValue={new Date(StartDate).setDate(
                      new Date(StartDate).getDate()
                    )}
                    minDate={planendDate}
                  />
                </Row>
              </SubSection>
            </Col>
          </Row>
        </Section>
        {(wpType > 1 || wpType == "") && (
          <Section title="Scope Details">
            <div
              style={{
                overflowX: "auto",
                maxWidth: "100%",
              }}
            >
              {SCPFields.map((row, rowIndex) => (
                <Row key={row.id}>
                  <Col xs={12} md={12} lg={12}>
                    <div>
                      <div className="d-flex">
                        <div className="col-md-5 me-2">
                          <FormControl
                            control={control}
                            name={`SCP.${rowIndex}.scpRisk`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            zIndex={true}
                            dropDownFlag={true}
                            hideTitle={rowIndex > 0 ? true : false}
                          />
                        </div>
                        <div className="col-md-7 me-2">
                          <FormControl
                            control={control}
                            name={`SCP.${rowIndex}.scpControl`}
                            formMetaData={formMetaData}
                            zIndex={true}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0 ? true : false}
                          />
                        </div>

                        {SCPFields.length > 1 &&
                          SCPFields[rowIndex].scpId == "" && (
                            <div
                              style={{
                                marginTop: rowIndex === 0 ? "39px" : "9px",
                              }}
                            >
                              <Button
                                type="button"
                                variant="warning"
                                className="float-end"
                                onClick={() => SCPremove(rowIndex)}
                              >
                                {t("Remove")}
                              </Button>
                            </div>
                          )}
                        {/* <hr style={{ backgroundColor: "#333", height: "3px" }} /> */}
                      </div>
                    </div>
                  </Col>
                </Row>
              ))}
            </div>
            <Row>
              <Button
                type="button"
                onClick={addScpRow}
                // hidden={accessCode === 7 || stageFlag}
              >
                + {t("Add Scope")}
              </Button>
            </Row>
          </Section>
        )}
      </Container>
    </>
  );
};

export default FormLayout;
