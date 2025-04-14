import { Container, Row } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_REGULATORYBODY_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    formState: {},
  } = formMethods;

  formMetaData.form = JSHook(form, formMetaData, formMethods, formValues);

  return (
    <>
      <Container className="justify-content-center  ">
        <Section title="General">
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="name"
                formMetaData={formMetaData}
                formMethods={formMethods}
                others
              />
            </div>
            <div className="col-md-2">
              <FormControl
                control={control}
                name="status"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-2">
              <FormControl
                control={control}
                name="active"
                formMetaData={formMetaData}
                formMethods={formMethods}
                hideTitle
              />
            </div>
          </Row>

          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="description"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>
        <Section title="Ownership and Security">
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="businessUnits"
                isMulti={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="owners"
                zIndex={true}
                isMulti={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>
        <Section title="Additional Details">
          <Row>
            <div>
              <FormControl
                control={control}
                name="attachFiles"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>
      </Container>
      {formValues.objectId != null && (
        <Container className="justify-content-center  ">
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
            enableAddComment={formValues.status == "Closed" ? false : true}
          />
        </Container>
      )}
    </>
  );
};
export default FormLayout;
