import { Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_CONTROL_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    formState: {},
    watch,
  } = formMethods;

  formMetaData.form = JSHook(form, formMetaData, formMethods, formValues);

  const controlReview = formMetaData.configurationFormMetaData.control_review;
  const controlHierarchy =
    formMetaData.configurationFormMetaData.control_hierarchy;
  if (controlHierarchy === true) {
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
              <FormControl
                control={control}
                name="keyControl"
                formMetaData={formMetaData}
                formMethods={formMethods}
                hideTitle
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-8">
              <Col >
                <FormControl
                  control={control}
                  name="description"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              
            </div>
            <Col>
              <Col>
                <FormControl
                  control={control}
                  name="hierarchy"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col>
                <FormControl
                  control={control}
                  name="parent"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  watchFor="hierarchy"
                />
              </Col>
            </Col>
          </Row>

          <Row>
            <Col>
              <FormControl
                control={control}
                name="purpose"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="types"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="nature"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <FormControl
                control={control}
                name="sources"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="priority"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col></Col>
          </Row>
        </Section>
        <Section title="Ownership and Review">
          <Row>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="businessUnits"
                isMulti={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="owners"
                isMulti={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>{" "}
            <>
              {controlReview == true && (
                <>
                  <div className="col-md-3">
                    <Col>
                      <FormControl
                        control={control}
                        name="reviewCycle"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </Col>
                  </div>
                  <div className="col-md-3">
                    <Col>
                      <FormControl
                        control={control}
                        type="flatpick"
                        name="nextReviewDate"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        watchFor="reviewCycle"
                        futureDate={true}
                      />
                    </Col>
                  </div>
                </>
              )}
            </>
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
