import { Row, Col, Container } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import React from "react";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    formState: { errors, touched, isSubmitting },
  } = formMethods;

  return (
    <Container className="justify-content-center mt-2">
      <Row>
        <Col>
          <FormControl
            control={control}
            name="surveyIntroductionPage"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>
        <Col>
          <FormControl
            control={control}
            name="surveyEndPage"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <FormControl
            control={control}
            name="certificationPage"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>
        <Col>
          <FormControl
            control={control}
            name="scoring"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormControl
            control={control}
            name="pageInstructions"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>
        <Col md={6}>
          <FormControl
            control={control}
            name="flagQuestions"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>
      </Row>
    </Container>
  );
};
export default FormLayout;
