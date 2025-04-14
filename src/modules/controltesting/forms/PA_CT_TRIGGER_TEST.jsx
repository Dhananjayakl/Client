import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_CT_TRIGGER_TEST_JS";
import { useState, useEffect } from "react";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import { useWatch } from "react-hook-form";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    formValues,
    runtimeParams,
  } = props;
  const {
    setError,
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touched, isSubmitting },
  } = formMethods;

  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formValues,
    formMetaData,
    control
  );
  const privs = util.getCurrentUser().privileges?.split(",");
  console.log("vbnvbvnv", runtimeParams);

  if (privs.includes("RM_ORM_PROCESS_COMPLIANCE")) {
    formMethods.setValue("framework", 2);
    formMetaData.fields.framework.editable = false;
  }

  if (
    privs.includes("GL_PROCESS_COM_FRAMEWORK") &&
    runtimeParams.button != "extra" &&
    runtimeParams.modal === true
  ) {
    formMethods.setValue("framework", 2);
    formMetaData.fields.framework.editable = false;
  }
  if (
    privs.includes("GL_REGULATORY_COM_FRAMEWORK") &&
    privs.includes("GL_PROCESS_COM_FRAMEWORK") &&
    runtimeParams.button === "extra" &&
    runtimeParams.modal === true
  ) {
    formMethods.setValue("framework", 1);
    formMetaData.fields.framework.editable = false;
  }
  if (formValues.objectId == null) {
    formMethods.setValue("status", "New");
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("previousStage", " ");
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
    formMetaData.fields.assessableEntity.editable = false;
  }

  if (
    runtimeParams.businessUnit !== null &&
    runtimeParams.businessUnit !== undefined &&
    runtimeParams.businessUnit[0] !== undefined
  ) {
    formMethods.setValue(
      "assessableBusinessUnit",
      parseInt(runtimeParams.businessUnit[0][0].value)
    );
    formMetaData.fields.assessableBusinessUnit.editable = false;
  }

  const frequency = formMethods.getValues("frequency");

  const schStartDate = useWatch({
    control: control,
    name: "startDate",
  });

  return (
    <>
      <div>
        <Container className="justify-content-center  ">
          <div>
            <SubSection title="General Information">
              <Row>
                <div className="col-md-8">
                  <FormControl
                    control={control}
                    name="testName"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    others
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    name="framework"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            </SubSection>
            <SubSection title="Scope">
              <Row>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    name="assessableBusinessUnit"
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
                    name="controls"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            </SubSection>{" "}
            <SubSection title="Schedule">
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

              {frequency == "8" || frequency == "1" ? (
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
                        frequency == "8"
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
                        frequency == "8"
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
            <SubSection title="Ownership">
              <Row>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="businessUnit"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    zIndex={true}
                  />
                </div>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="tester"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    zIndex={true}
                  />
                </div>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="approver"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    zIndex={true}
                  />
                </div>
              </Row>
            </SubSection>{" "}
          </div>
        </Container>
      </div>
    </>
  );
};

export default FormLayout;
