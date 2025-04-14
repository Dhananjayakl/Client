import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import QUESTIONNAIRE from "../Utils/designer/QUESTIONNAIRE";
import JSHook from "./PA_SM_QUESTIONNAIRE_JS";
import Grid from "src/components/forms/reactformutils/Grid";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues } = props;
  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touched, isSubmitting, isDirty, dirtyFields },
  } = formMethods;

  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    control
  );

  const accessCode = formMetaData?.formmeta?.accessCode;
  const scoring = formMethods.getValues("enableScoring");
  const instructions = formMethods.getValues("enableInstructions");
  const introductionPage = formMethods.getValues("enableIntroductionPage");
  const surveyEndingPage = formMethods.getValues("enableEndingPage");
  const certificationPage = formMethods.getValues("enableCertificationPage");

  return (
    <>
      <Container className="justify-content-center ">
        <Tabs
          defaultActiveKey="details"
          id="form-layout-tabs"
          className="sticky-top bg-white text-dark z-1 border-light-subtle border  p-0"
          variant="underline"
          fill
          style={{ top: "100px" }}
        >
          <Tab eventKey="details" title="Details">
            <Section title="Details">
              <Row>
                <Col className="col-md-6">
                  <FormControl
                    control={control}
                    name="questionnaire"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    others
                  />
                </Col>
                <Col className="col-md-6">
                  <FormControl
                    control={control}
                    name="businessUnit"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    zIndex={true}
                    closeButton={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="col-md-6">
                  <FormControl
                    control={control}
                    name="program"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Col className="col-md-6">
                  <FormControl
                    control={control}
                    name="category"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    required={formMethods.getValues(`program`) ? true : false}
                  />
                </Col>
              </Row>
              {introductionPage && (
                <Row>
                  <Col className="col-md-6">
                    <FormControl
                      control={control}
                      name="introductionPageTitle"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </Col>
                  <Col className="col-md-6">
                    <FormControl
                      control={control}
                      name="introductionPageDescription"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </Col>
                </Row>
              )}
              {certificationPage && (
                <Row>
                  <FormControl
                    control={control}
                    name="certificateContent"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Row>
              )}
            </Section>
          </Tab>

          <Tab
            eventKey="designer"
            title="Questionnaire"
            className="bg-white text-dark"
          >
            <Col>
              <QUESTIONNAIRE
                formMetaData={formMetaData}
                instructions={instructions}
                scoring={scoring}
                formMethods={formMethods}
                control={control}
                form={form}
                formValues={formValues}
                accessCode={accessCode}
              />
            </Col>
          </Tab>

          {scoring && (
            <Tab eventKey="rating" title="Rating">
              <Section title="Rating">
                <Col className="col-md-6">
                  <FormControl
                    control={control}
                    name="ratingType"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Grid
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  region="RTG"
                  regionTitle="RATING"
                  columns={[
                    { name: "rtgLowerValue", length: 4 },
                    { name: "rtgUpperValue", length: 4 },
                    //"rtgScore",
                    { name: "rtgRating", length: 4 },
                  ]}
                  actions={{ add: true, remove: true }}
                />
              </Section>
            </Tab>
          )}
        </Tabs>
      </Container>
    </>
  );
};
export default FormLayout;
