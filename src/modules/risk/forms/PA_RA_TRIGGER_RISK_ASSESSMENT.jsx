import { Container, Row } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_RA_TRIGGER_RISK_ASSESSMENT_JS";
import { useState, useEffect } from "react";
import { useWatch } from "react-hook-form";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import { useTranslation } from "react-i18next";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    formState: {},
  } = formMethods;
  const { t } = useTranslation("common");

  const [fieldTitle, setFieldTitle] = useState("");
  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formValues,
    formMetaData,
    setFieldTitle,
    control,
    runtimeParams
  );
  

  useEffect(() => {
    if (formValues.objectId == null) {
      formMethods.setValue("status", "New");
      formMethods.setValue("currentStage", "INITIATE");
      formMethods.setValue("previousStage", " ");
    }
  }, []);
  const privs = util.getCurrentUser().privileges?.split(",");
  if (privs.includes("RM_ORM_PROCESS_COMPLIANCE")) {
    formMethods.setValue("framework", 2);
    formMetaData.fields.framework.editable = false;
  }
  if (privs.includes("GL_PROCESS_COM_FRAMEWORK")) {
    formMethods.setValue("framework", 2);
    formMetaData.fields.framework.editable = false;
  }
  if (
    privs.includes("GL_REGULATORY_COM_FRAMEWORK") &&
    privs.includes("GL_PROCESS_COM_FRAMEWORK")
  ) {
    formMethods.setValue("framework", 1);
    formMetaData.fields.framework.editable = false;
  }

  if (
    runtimeParams.assessableEntity !== null &&
    runtimeParams.assessableEntity !== undefined &&
    runtimeParams.assessableEntity[0] !== undefined
  ) {
    formMethods.setValue("assessableEntity", {
      label: runtimeParams.assessableEntity[0][0].label,
      value: runtimeParams.assessableEntity[0][0].value,
    });
  }

  if (
    runtimeParams.businessUnit !== null &&
    runtimeParams.businessUnit !== undefined &&
    runtimeParams.businessUnit[0] !== undefined
  ) {
    formMethods.setValue(
      "businessUnit",
      parseInt(runtimeParams.businessUnit[0][0].value)
    );
    formMetaData.fields.businessUnit.editable = false;
    formMetaData.fields.assessableEntity.editable = false;
  }
  const schStartDate = useWatch({
    control: control,
    name: "startDate",
  });
  const Frequency = useWatch({
    control: control,
    name: "frequency",
  });

  return (
    <>
      <div>
        <Container className="justify-content-center  ">
          <SubSection title={t("General Information")}>
            <Row>
              <div className="col-md-12">
                <FormControl
                  control={control}
                  name="riskName"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  others
                />
              </div>
            </Row>
            <Row className="mt-2">
              <div className="col-md-7">
                <FormControl
                  control={control}
                  name="assessmentType"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                  labelSize={4}
                />
              </div>
              <div className="col-md-5">
                <FormControl
                  control={control}
                  name="framework"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                  labelSize={4}
                />
              </div>
            </Row>
          </SubSection>
          <SubSection title={t("Scope")}>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="businessUnit"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="assessableEntity"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-12">
                <FormControl
                  control={control}
                  name="risks"
                  field_title={fieldTitle}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          </SubSection>
          <SubSection title={t("Schedule")}>
            <Row>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="frequency"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>

            {Frequency == "8" || Frequency == "1" ? (
              <Row>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="startDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    futureDate={true}
                    watchFor="frequency"
                  />
                </div>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="dueDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="frequency"
                    futureDate={true}
                    futureDateValue={
                      Frequency == "8"
                        ? new Date(schStartDate).setDate(
                            new Date(schStartDate).getDate()
                          )
                        : new Date(schStartDate).setDate(
                            new Date(schStartDate).getDate() + 1
                          )
                    }
                  />
                </div>
              </Row>
            ) : (
              <Row>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="startDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    futureDate={true}
                    watchFor="frequency"
                  />
                </div>

                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="dueBy"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="frequency"
                  />
                </div>
                <div className="col-md-2 mt-3">
                  <FormControl
                    control={control}
                    name="onWorkingDay"
                    auditableEntity
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="frequency"
                    hideTitle
                  />
                  <FormControl
                    control={control}
                    name="onCalendarDay"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="frequency"
                    hideTitle
                  />
                </div>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="dueDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="frequency"
                    futureDate={true}
                    futureDateValue={
                      Frequency == "8"
                        ? new Date(schStartDate).setDate(
                            new Date(schStartDate).getDate()
                          )
                        : new Date(schStartDate).setDate(
                            new Date(schStartDate).getDate() + 1
                          )
                    }
                  />
                </div>
              </Row>
            )}
          </SubSection>{" "}
          <SubSection title={t("Ownership")}>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  type="select"
                  name="assessor"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  zIndex={true}
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="approver"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  zIndex={true}
                />
              </div>
            </Row>
          </SubSection>
        </Container>
      </div>
    </>
  );
};

export default FormLayout;
