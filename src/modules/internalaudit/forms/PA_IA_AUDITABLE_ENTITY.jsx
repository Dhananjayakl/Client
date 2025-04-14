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
import ReportRuntime from "src/components/reports/Report";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import JSHook from "./PA_IA_AUDITABLE_ENTITY_JS";

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
  formMetaData.form = JSHook(form, formMetaData, formMethods, formValues);
  return (
    <>
      <Container className="justify-content-center">
        <Section title="General" required>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="title"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-2">
              <FormControl
                control={control}
                name="status"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-2">
              {formMethods.getValues("objectId") != "" && (
                <FormControl
                  control={control}
                  name="active"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              )}
            </div>
          </Row>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="description"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          <Row>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="category"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="aeType"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="hierarchy"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="parent"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="hierarchy"
              />
            </div>
          </Row>
        </Section>

        <Section title="Ownership and Security">
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="businessUnit"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="owners"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>
        {formMethods.getValues("objectId") != "" && (
          <Section title="Audit Coverage">
            The 5 most recent audits related to the Auditable Entity in scope,
            categorized by their current status (with priority given to those
            that are still in progress, planned, or completed), are listed. This
            list excludes audits marked as cancelled or inactive. Details of
            earlier audits conducted for the Auditable Entity can be accessed
            through the Audit coverage report.
            <Row>
              <ReportRuntime
                report="IA_AUDITS_RELATED_TO_AE"
                ChartdrilldownReports={`auditable_entity_id = (${formValues.objectId})`}
              />
            </Row>
          </Section>
        )}

        <Section title="Additional Details">
          <Row>
            <Col md={6} sm={12}>
              <FormControl
                control={control}
                name="businessOverview"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6} sm={12}>
              <FormControl
                control={control}
                name="strategicImportance"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} sm={12}>
              <FormControl
                control={control}
                name="goalsObjectives"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6} sm={12}>
              <FormControl
                control={control}
                name="complianceRequirements"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} sm={12}>
              <FormControl
                control={control}
                name="performanceMetrics"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>
        {formMethods.getValues("objectId") != "" && (
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
            // enableAddComment={formValues.status == "Closed" ? false : true}
          />
        )}
      </Container>
    </>
  );
};

export default FormLayout;
