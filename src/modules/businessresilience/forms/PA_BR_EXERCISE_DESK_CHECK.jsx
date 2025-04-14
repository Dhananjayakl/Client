import { Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_BR_EXERCISE_DESK_CHECK_JS";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";

const FormLayout = (props) => {
  let { formMethods, formMetaData, formValues, form } = props;
  const { control } = formMethods;

  formMetaData.form = JSHook(form, formMetaData, formMethods,formValues);

  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <Col>
            <FormControl
              control={control}
              name="scope"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <FormControl
              control={control}
              name="planReviewer"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col>
            <FormControl
              control={control}
              name="startDate"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
        <Row>
          <FormControl
            control={control}
            name="dcComments"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="reviewerComments"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="comments"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
      </Container>
      {formValues.objectId != null && (
        <Container className="justify-content-center  ">
          <AuditTrail
            formMetaData={formMetaData}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
            formMethods={formMethods}
          />
        </Container>
      )}
    </>
  );
};

export default FormLayout;
