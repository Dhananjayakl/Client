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
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";

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

  if (formValues.objectId == null) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
  }

  let action = formMethods.getValues("action");

  // Fields setting Non-mandatory during Save Action
  if (action == 11) {
    formMetaData.fields.title.required = false;
    formMetaData.fields.type.required = false;
    formMetaData.fields.severity.required = false;
    formMetaData.fields.reportedBy.required = false;
    formMetaData.fields.assignedTo.required = false;
    formMetaData.fields.product.required = false;
    formMetaData.fields.category.required = false;
    formMetaData.fields.productVersion.required = false;
    formMetaData.fields.reportedIn.required = false;
    formMetaData.fields.description.required = false;
    formMetaData.fields.stepsToReproduce.required = false;
  }
  if (action == 9) {
    formMetaData.fields.title.required = false;
    formMetaData.fields.type.required = false;
    formMetaData.fields.severity.required = false;
    formMetaData.fields.reportedBy.required = false;
    formMetaData.fields.assignedTo.required = false;
    formMetaData.fields.product.required = false;
    formMetaData.fields.category.required = false;
    formMetaData.fields.productVersion.required = false;
    formMetaData.fields.reportedIn.required = false;
    formMetaData.fields.description.required = false;
    formMetaData.fields.stepsToReproduce.required = false;
    formMetaData.fields.resolvedBy.required = false;
    formMetaData.fields.rootCause.required = false;
    formMetaData.fields.resolution.required = false;
    formMetaData.fields.fixAvailableIn.required = false;
  }

  if (action == 2 || action == 12 || action == 14) {
    // Update in Resolve Stage
    formMetaData.fields.resolvedBy.required = false;
    formMetaData.fields.rootCause.required = false;
    formMetaData.fields.resolution.required = false;
    formMetaData.fields.fixAvailableIn.required = false;
  }

  return (
    <>
      <Container className="justify-content-center">
        <Section title="Details" required>
          <Row>
            <Col md={8}>
              <FormControl
                control={control}
                name="title"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={4}>
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
                name="severity"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="reportedBy"
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
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <FormControl
                control={control}
                name="product"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="category"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="productVersion"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="reportedIn"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormControl
                control={control}
                name="description"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6}>
              <FormControl
                control={control}
                name="stepsToReproduce"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormControl
                control={control}
                name="testData"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6}>
              <FormControl
                control={control}
                name="attachments"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>

        {formMethods.getValues("currentStage") != "INITIATE" && (
          <Section title="Resolution">
            <Row>
              <Col md={6}>
                <FormControl
                  control={control}
                  name="resolvedBy"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col md={6}>
                <FormControl
                  control={control}
                  name="rootCause"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col md={6}>
                <FormControl
                  control={control}
                  name="resolution"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>

              <Col md={6}>
                <FormControl
                  control={control}
                  name="preventiveSteps"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col md={6}>
                <FormControl
                  control={control}
                  name="evidences"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col md={6}>
                <FormControl
                  control={control}
                  name="fixAvailableIn"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
            </Row>

            <Row></Row>
          </Section>
        )}

        {formValues.objectId != null && (
          <AuditTrail
            formMetaData={formMetaData}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
            formMethods={formMethods}
          />
        )}
      </Container>
    </>
  );
};

export default FormLayout;
