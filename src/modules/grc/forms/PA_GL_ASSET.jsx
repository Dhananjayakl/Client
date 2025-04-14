import { Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_ASSET_JS";
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

  const enbleCIAAsset = formMetaData.configurationFormMetaData.enble_cia_asset;
  const enbleRecObjtAsset =
    formMetaData.configurationFormMetaData.enble_rec_objt_asset;
  const assetReview = formMetaData.configurationFormMetaData.asset_review;
  const assetHierarchy = formMetaData.configurationFormMetaData.asset_hierarchy;
  if (enbleCIAAsset === false) {
    formMetaData.fields.availability.visible = false;
    formMetaData.fields.integrity.visible = false;
    formMetaData.fields.confidentiality.visible = false;
  }
  if (assetHierarchy === true) {
    formMetaData.fields.hierarchy.required = true;
  } else {
    formMetaData.fields.hierarchy.required = false;
  }

  const exceptThisSymbols = ["e", "E", "+", "-", "."];

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
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="businessCritic"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    required={false}
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="confidentiality"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="integrity"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="availability"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="primaryLocation"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="secondaryLocation"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            </Section>
            {enbleRecObjtAsset === true && (
              <Section title="Recovery Objectives">
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

                {assetReview === true && (
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
