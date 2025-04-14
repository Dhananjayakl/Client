import { Container, Row } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_REGULATORY_COMPLIANCE_JS";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues, fields, runtimeParams } =
    props;
  const {
    control,
    formState: {},
  } = formMethods;
  formMetaData.form = JSHook(form, formMetaData, formMethods, formValues);

  if (runtimeParams.upload === true) {
    formMethods.setValue("regulatoryBody", {
      label: runtimeParams.regulatoryName[0].label,
      value: runtimeParams.regulatoryName[0].value,
    });
    formMetaData.fields.regulatoryBody.editable = false;
  }

  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <div className="col-md-4">
            <FormControl
              control={control}
              zIndex={true}
              name="regulatoryBody"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
          <div className="col-md-4">
            <FormControl
              control={control}
              zIndex={true}
              name="areaOfCompliance"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
          <div className="col-md-4">
            <FormControl
              control={control}
              zIndex={true}
              name="requirement"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>

        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              zIndex={true}
              name="objectType"
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
