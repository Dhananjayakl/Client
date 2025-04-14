import React from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";

import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import JSHook from "./PA_CM_ACTIVITY_JS";
let FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues, runtimeParams } = props;

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

  formMetaData.form = JSHook(
    form,
    formMethods,
    formMetaData,
    formValues,
    control
  );

  console.log(props.runtimeParams, "props.runtimeParams");

  if (
    formMethods.getValues("source") == "" &&
    props.runtimeParams.ParentFormObjectId
  ) {
    formMethods.setValue("source", props.runtimeParams.ParentFormObjectId);
    formMethods.setValue("sourceType", props.runtimeParams.sourceType);
    formMetaData.fields.source.editable = false;
    formMetaData.fields.sourceType.editable = false;
  } else if (formValues.objectId !== undefined) {
    formMetaData.fields.source.editable = false;
    formMetaData.fields.sourceType.editable = false;
  }

  if (formValues.objectId == null) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "Lead");
  }

  return (
    <>
      <Container className="justify-content-center">
        <Section title="Basic Information">
          <Row>
            <Col md={9}>
              <FormControl
                control={control}
                name="title"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="status"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <FormControl
                control={control}
                name="type"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="sourceType"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="source"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="performedOn"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            {/* <Col md={3}>
              <FormControl
                control={control}
                name="priority"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="assignedTo"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col> */}
            {/* <Col md={3}>
              <FormControl
                control={control}
                name="lead"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col> */}
          </Row>
          <Row></Row>
        </Section>

        <Section title="Activity Details">
          <Row>
            <Col md={6}>
              <FormControl
                control={control}
                name="descriptionNotes"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6}>
              <FormControl
                control={control}
                name="nextSteps"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            {/* <Col md={6}>
              <FormControl
                control={control}
                name="agenda"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6}>
              <FormControl
                control={control}
                name="outcome"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col> */}
            <Col md={4}>
              <FormControl
                control={control}
                name="disposition"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={4}>
              <FormControl
                control={control}
                name="dueDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={4}>
              <FormControl
                control={control}
                name="activityStatus"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FormControl
                control={control}
                name="attachment"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>
        {/* <Section title="Date & Times">
          <Row >
          
            <Col md={3}>
              <FormControl
                control={control}
                name="startDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          
            <Col md={3}>
              <FormControl
                control={control}
                name="endDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="dueDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="completedDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        
        </Section> */}
        {/* <Section title="Recurrence">


        <Row>
        <Col md={6}>
              <FormControl
                control={control}
                name="recurrencePattern"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6}>
              <FormControl
                control={control}
                name="recurrenceEndDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
        </Row>
         
        </Section> */}

        {formValues.objectId != null && (
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
          />
        )}
      </Container>
    </>
  );
};

export default FormLayout;
