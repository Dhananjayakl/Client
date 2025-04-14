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
        <Section title="Version Information" required>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="title"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="releaseCode"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="startDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="endDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
                futureDate={true}
                futureDateValue={formMethods.getValues("startDate")}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="endOfLifeDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
                futureDate={true}
                futureDateValue={formMethods.getValues("endDate")}
              />
            </div>
          </Row>

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
