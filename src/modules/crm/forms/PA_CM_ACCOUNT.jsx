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
import JSHook from "./PA_CM_ACCOUNT_JS";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";

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

  formMetaData.form = JSHook(form, formMethods, formMetaData, formValues);
  const watchedTypeone = watch("accountSource");
  return (
    <>
      <Container className="justify-content-center">
        <Section title="Basic Information">
          <Row>
            <Col md={8}>
              <FormControl
                control={control}
                name="accountName"
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
                name="accountType"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="accountSource"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="industry"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="parentAccount"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>
        <Section title="Contact Information">
          <Row>
            <Col md={3}>
              <FormControl
                control={control}
                name="primaryContact"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="phoneNumber"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="email"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="website"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormControl
                control={control}
                name="billingAddress"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6}>
              <FormControl
                control={control}
                name="country"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>
        <Section title="Financial Information">
          <Row>
            <Col md={3}>
              <FormControl
                control={control}
                name="accountCurrency"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            {/* <Col md={3}><FormControl
                control={control}
                name="creditLimit"
                formMetaData={formMetaData}
                formMethods={formMethods}
              /></Col>
               <Col md={3}><FormControl
                control={control}
                name="paymentTerms"
                formMetaData={formMetaData}
                formMethods={formMethods}
              /></Col> */}
          </Row>
        </Section>

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
