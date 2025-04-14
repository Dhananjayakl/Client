import { Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_STANDARD_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    formState: { errors, touched, isSubmitting },
    watch,
  } = formMethods;
  formMetaData.form = JSHook(form, formMetaData, formMethods, formValues);

  const standardHierarchy =
    formMetaData.configurationFormMetaData.standard_hierarchy;
  if (standardHierarchy === true) {
    formMetaData.fields.hierarchy.required = true;
  } else {
    formMetaData.fields.hierarchy.required = false;
  }

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
            <div className="col-md-8">
              <FormControl
                control={control}
                name="description"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <Col>
                <FormControl
                  control={control}
                  name="hierarchy"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
                <FormControl
                  control={control}
                  name="parent"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  watchFor="hierarchy"
                />
              </Col>
            </div>
          </Row>
          <Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="type"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>

        <Section title="Ownership">
          <Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="businessUnits"
                isMulti={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="owners"
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
