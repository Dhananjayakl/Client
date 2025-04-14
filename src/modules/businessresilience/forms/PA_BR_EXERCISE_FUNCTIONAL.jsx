import { Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_BR_EXERCISE_FUNCTIONAL_JS";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";

const FormLayout = (props) => {
  let { formMethods, formMetaData, formValues, form, runtimeParams } = props;
  const {
    control,
    formState: {},
  } = formMethods;

  formMetaData.form = JSHook(form, formMetaData, formMethods, formValues);
  formMethods.setValue("exerciseId", runtimeParams.ParentFormObjectId);
  
  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="risk"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>

          <div className="col-md-6">
            <FormControl
              control={control}
              name="taskName"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>
        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="timeAllocated"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="taskOwner"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>
        <Row>
          <Col>
            <FormControl
              control={control}
              name="actualTimeTaken"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col>
            <FormControl
              control={control}
              name="percCompleted"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
        <Row>
          <FormControl
            control={control}
            name="comments"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="exerciseId"
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
