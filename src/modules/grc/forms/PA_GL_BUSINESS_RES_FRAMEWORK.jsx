import { Container, Row } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_BUSINESS_RES_FRAMEWORK_JS";

const FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    form,
    runtimeParams,
    formValues
  } = props;
  const {
    control,
    formState: {},
  } = formMethods;
  formMetaData.form = JSHook(form, formMetaData, formMethods, formValues);

  if (runtimeParams.modal === true) {
    formMethods.setValue("process", runtimeParams.processName);
    formMetaData.fields.process.editable = false;
  }
  if (runtimeParams.hide === true) {
    formMetaData.fields.objectType.visible = false;
    formMetaData.fields.objectName.visible = false;
    formMetaData.fields.objectType.required = false;
    formMetaData.fields.objectName.required = false;
  }



  return (
    <>
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
          <div className="col-md-6">
            <FormControl
              control={control}
              zIndex={true}
              name="process"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>

        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="objectType"
              zIndex={true}
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
          <div className="col-md-6">
            <FormControl
              control={control}
              zIndex={true}
              name="objectName"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>
      </Container>
    </>
  );
};
export default FormLayout;
