import { Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_THIRDPARTY_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";
import Grid from "src/components/forms/reactformutils/Grid";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    formValues,
    runtimeParams,
  } = props;
  const {
    control,
    formState: {},
  } = formMethods;

  formMetaData.form = JSHook(
    form,
    control,
    formMetaData,
    formMethods,
    formValues
  );

  if (runtimeParams.evaluation == true) {
    formMethods.setValue("evaluation", true);
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
                    runtimeParams={runtimeParams}
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
                <Col>
                  <div className="col-md-2">
                    <FormControl
                      control={control}
                      name="active"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      hideTitle
                    />
                  </div>
                  <div className="col-md-2">
                    <FormControl
                      control={control}
                      name="evaluation"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      hideTitle
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <div>
                  <FormControl
                    control={control}
                    name="description"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>

              <Row>
                <div className="col-md-8">
                  <FormControl
                    control={control}
                    name="address"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-4">
                  <Col>
                    <FormControl
                      control={control}
                      name="country"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                    <FormControl
                      control={control}
                      name="city"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </Col>
                </div>
              </Row>

              <Row>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="zipCode"
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
                    name="phone"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>

                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="faxNumber"
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
                    name="website"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
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

              <Row>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="category"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="subCategory"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>

                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="type"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="globalThirdParty"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>

                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="keyThirdParty"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="criticality"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    futureDate={true}
                  />
                </div>
              </Row>
            </Section>
            <Section title="Contacts">
              <Grid
                formMetaData={formMetaData}
                formMethods={formMethods}
                region="CNT"
                columns={[
                  { name: "cntFirstName", length: 2 },
                  { name: "cntLastName", length: 2 },
                  { name: "cntUserName", length: 2 },
                  { name: "cntPhoneNumber", length: 3 },
                  { name: "cntEmail", length: 3},
                ]}
                actions={{
                  add: true,
                  remove: true,
                }}
              />
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
