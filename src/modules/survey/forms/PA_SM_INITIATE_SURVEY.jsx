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
import { useState, useEffect } from "react";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";

const FormLayout = (props) => {
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

  //formMetaData.form = JSHook(form, fields, formMethods, formValues);

  //formMethods.setValue("formId", formMetaData.formmeta.form_id);

  return (
    <>
      <div>
        <Container className="justify-content-center  ">
          <SubSection title="General Information">
            <Row>
              <div className="col-md-12">
                <FormControl
                  control={control}
                  name="surveyTitle"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  others
                />
              </div>

              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="questionnaireName"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  zIndex={true}
                />
              </div>

              {/* <div className="col-md-6">
                <FormControl
                  control={control}
                  name="version"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  
                  
                />
              </div> */}
            </Row>
          </SubSection>
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
                  name="approver"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  zIndex={true}
                />
              </div>
              <Col className="col-md-4">
                <FormControl
                  control={control}
                  name="respondent"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  zIndex={true}
                />
              </Col>
            </Row>
            <Row>
              {/* <Col className="d-flex">
              <div className="col-md-2">
                <FormControl
                  control={control}
                  name="anyUser"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-2">
                <FormControl
                  control={control}
                  name="allUsers"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-2">
                <FormControl
                  control={control}
                  name="collaborate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              </Col> */}
            </Row>
          </SubSection>
        </Container>
      </div>
    </>
  );
};

export default FormLayout;
