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
        <Section title="Product Information" required>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="name"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="type"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="appAccronym"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="dbAccronym"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="businessUnit"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="offering"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <SubSection title="Team Members" required>
            <Row>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="productManager"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="teamMembers"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          </SubSection>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
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
