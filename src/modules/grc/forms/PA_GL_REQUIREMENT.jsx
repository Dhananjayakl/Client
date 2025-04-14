import { Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_REQUIREMENT_JS";

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

  const requirementHierarchy =
    formMetaData.configurationFormMetaData.requirement_hierarchy;
  if (requirementHierarchy === true) {
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
              <Col>
                <FormControl
                  control={control}
                  name="active"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  hideTitle
                />

                <FormControl
                  control={control}
                  name="keyRequirement"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
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
            </div>
          </Row>

          <Row>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="sectionNo"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>

            <div className="col-md-3">
              <FormControl
                control={control}
                name="categorization"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="typeOfCompliance"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>

            <div className="col-md-3">
              <Col className="pt-4">
                <FormControl
                  control={control}
                  name="technicalFeasibilityExceptions"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  watchFor="typeOfCompliance"
                />
              </Col>
            </div>
          </Row>
          <Row>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="violation"
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="typeOfCompliance"
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="violationRiskFactor"
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="typeOfCompliance"
              />
            </div>

            <div className="col-md-3">
              <FormControl
                control={control}
                name="tier"
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="typeOfCompliance"
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="year"
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="typeOfCompliance"
              />
            </div>
          </Row>
        </Section>

        <Section title="Penalty Implications">
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="penaltyNonCompliance"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>

            <div className="col-md-4">
              <FormControl
                control={control}
                name="impactAndPenalties"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
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
            </div>

            <div className="col-md-3">
              <FormControl
                control={control}
                name="reviewCycle"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="nextReviewDate"
                type="flatpick"
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="reviewCycle"
                futureDate={true}
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
