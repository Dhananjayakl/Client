import { Container, Row } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";

const FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,

    form,
    objectId,
    runtimeParams,
  } = props;
  const {
    control,
    formState: {},
  } = formMethods;

  console.log("bvxc", runtimeParams);

  if (runtimeParams.upload === true) {
    formMethods.setValue("processId", runtimeParams.processName);
    formMetaData.fields.testProcedureId.required = false;
    formMetaData.fields.processId.editable = false;
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
            name="processId"
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
