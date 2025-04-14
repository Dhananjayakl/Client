import { Container, Row } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";

const FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    objectId,
    runtimeParams,
  } = props;
  const {
    control,

    formState: {},
  } = formMethods;

  if (runtimeParams.upload === true) {
    formMethods.setValue("auditableEntity", runtimeParams.processName);
    formMetaData.fields.testProcedureId.required = false;
    formMetaData.fields.auditableEntity.editable = false;
  }
  if (runtimeParams.hide === true) {
    formMetaData.fields.testProcedureId.visible = false;
    formMetaData.fields.controlId.visible = false;
    formMetaData.fields.riskId.visible = false;
    formMetaData.fields.controlId.required = false;
    formMetaData.fields.riskId.required = false;
  }

  return (
    <Container className="justify-content-center  ">
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
      </Row>{" "}
      <Row>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="auditableEntity"
            zIndex={true}
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="riskId"
            zIndex={true}
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="controlId"
            zIndex={true}
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="testProcedureId"
            zIndex={true}
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
    </Container>
  );
};
export default FormLayout;
