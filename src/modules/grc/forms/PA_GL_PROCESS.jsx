import { Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_PROCESS_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";
import { useTranslation } from "react-i18next";


const FormLayout = (props) => {
  const { t } = useTranslation("common");

  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    formState: {},
  } = formMethods;

  formMetaData.form = JSHook(form, formMetaData, formMethods, formValues);

  const enbleCIAProcess =
    formMetaData.configurationFormMetaData.enble_cia_process;
  const enbleCteTypeProcess =
    formMetaData.configurationFormMetaData.enble_cte_type_process;
  const enbleRecObjtProcess =
    formMetaData.configurationFormMetaData.enble_rec_objt_process;
  const processReview = formMetaData.configurationFormMetaData.process_review;
  const processHierarchy =
    formMetaData.configurationFormMetaData.process_hierarchy;

  if (enbleCIAProcess === false) {
    formMetaData.fields.availability.visible = false;
    formMetaData.fields.integrity.visible = false;
    formMetaData.fields.confidentiality.visible = false;
  }
  if (enbleCteTypeProcess === false) {
    formMetaData.fields.category.visible = false;
    formMetaData.fields.type.visible = false;
  }
  if (processHierarchy === true) {
    formMetaData.fields.hierarchy.required = true;
  } else {
    formMetaData.fields.hierarchy.required = false;
  }
  const exceptThisSymbols = ["e", "E", "+", "-", "."];
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
                auditableEntity
                formMetaData={formMetaData}
                formMethods={formMethods}
                hideTitle
              />
              <FormControl
                control={control}
                name="auditableEntity"
                formMetaData={formMetaData}
                formMethods={formMethods}
                hideTitle
              />
            </div>
          </Row>
          <Row>
            <Col md={8}>
              <FormControl
                control={control}
                name="description"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={4}>
              <Row>
                <FormControl
                  control={control}
                  name="hierarchy"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Row>
              <Row>
                <FormControl
                  control={control}
                  name="parent"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  watchFor="hierarchy"
                />
              </Row>
            </Col>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="referenceId"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          <Row>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="businessCritic"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>

            <div className="col-md-3">
              <FormControl
                control={control}
                name="confidentiality"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="integrity"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="availability"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="primaryLocation"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="secondaryLocation"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>
        {enbleRecObjtProcess === true && (
          <Section title={t("Recovery Objectives")}>
            <Row>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="rto"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  onKeyDown={(e) =>
                    exceptThisSymbols.includes(e.key) && e.preventDefault()
                  }
                />
              </div>  
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="rpo"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  onKeyDown={(e) =>
                    exceptThisSymbols.includes(e.key) && e.preventDefault()
                  }
                />
              </div>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="wrt"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  onKeyDown={(e) =>
                    exceptThisSymbols.includes(e.key) && e.preventDefault()
                  }
                />
              </div>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="mtd"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  onKeyDown={(e) =>
                    exceptThisSymbols.includes(e.key) && e.preventDefault()
                  }
                />
              </div>
            </Row>
          </Section>
        )}
        <Section title={t("Ownership and Review Cycle")}>
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
            {processReview === true && (
              <>
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
                    type="flatpick"
                    name="nextReviewDate"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="reviewCycle"
                    futureDate={true}
                  />
                </div>
              </>
            )}
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
