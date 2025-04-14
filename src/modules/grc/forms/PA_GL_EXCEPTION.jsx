import { Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_EXCEPTION_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues, fields, runtimeParams } =
    props;
  const {
    control,
    formState: {},
  } = formMethods;
  formMetaData.form = JSHook(form, fields, formMethods, formValues);

  return (
    <>
      <Row>
        <Col>
          <Container className="justify-content-center  ">
            <Section title="General">
              <Row>
                <div className="col-md-8">
                  <FormControl
                    control={control}
                    name="typeOfExcep"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
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
                    name="explanation"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>

                <div className="col-md-4">
                  <Col>
                    <FormControl
                      control={control}
                      name="exceptionFor"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />

                    <FormControl
                      control={control}
                      name="itemObjt"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </Col>
                </div>
              </Row>
              <Row>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    type="flatpick"
                    name="startDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    type="flatpick"
                    name="endDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    futureDate={true}
                    futureDateValue={formMethods.getValues("startDate")}
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
                    type="multiattach"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            </Section>
          </Container>
        </Col>

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
      </Row>
    </>
  );
};
export default FormLayout;
