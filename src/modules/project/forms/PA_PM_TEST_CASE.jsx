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

  return (
    <>
      <Container className="justify-content-center">
        <Section title="Details" required>
          <Row>
            <div className="col-md-9">
              <FormControl
                name="TEST_CASE_TITLE"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-3">
              <FormControl
                name="TEST_CASE_CODE"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          <Row>
            <div className="col-md-6">
              <FormControl
                name="PRODUCT"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-3">
              <FormControl
                name="TEST_CATEGORY"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <Col md={3}>
            <FormControl
                name="TEST_SCENARIO"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>

          <Row>
           

           <FormControl
                name="PRE_CONDITION"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
          </Row>
          
          <Row>
           

           <FormControl
                name="TEST_STEPS"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
          </Row>
          <Row>
           

           <FormControl
                name="EXPECTED_OUTPUT"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
          </Row>
          <Row>
            <div className="col-md-12">
              <FormControl
                name="comments"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>
      </Container>
    </>
  );
};

export default FormLayout;
