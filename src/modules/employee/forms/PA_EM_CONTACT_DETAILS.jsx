import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Modal,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_EM_CONTACT_DETAILS_JS";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import Section from "src/components/forms/reactformutils/fields/Section";
// import { WarnUserBeforeReloadOrExit } from "./Warnuser";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    form,
    fields,
    formValues,
    callbackToParent,
    runtimeParams,
  } = props;
  const {
    setError,
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touched, isSubmitting, isDirty },
  } = formMethods;

  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    formMetaData,
    callbackToParent,
    formValues,
    runtimeParams
  );

  return (
    <>
      {/* <WarnUserBeforeReloadOrExit formDirtyCheck={formDirtyCheck} /> */}
      <Container className="justify-content-center  ">
        <Section title="Contact Details">
          <Row>
            <Col>
              <FormControl
                control={control}
                name="userId"
                formMetaData={formMetaData}
                formMethods={formMethods}
                FieldValue={true}
              />
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              <FormControl
                control={control}
                name="workNo"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="personalEmailId"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <FormControl
              control={control}
              name="presentAddress"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
          <Row>
            <FormControl
              control={control}
              name="sameAddress"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
          <Row>
            <FormControl
              control={control}
              name="permanentAddress"
              formMetaData={formMetaData}
              formMethods={formMethods}
              watchFor="sameAddress"
            />
          </Row>
        </Section>
        <Section title="Emergency Contact Details">
          <Row>
            <Col>
              <FormControl
                control={control}
                name="relationshipType"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="contactName"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          {/* <Row>
            <FormControl
              control={control}
              name="contactName"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row> */}
          <Row>
            <FormControl
              control={control}
              name="phoneNo"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
          <Row>
            <FormControl
              control={control}
              name="contactAddress"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
        </Section>
        <Row>
          <FormControl
            control={control}
            name="comments"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
      </Container>
      {formValues.objectId != null && (
        <Container className="justify-content-center  ">
          <Section title="Comments and Change History">
            <AuditTrail
              formMetaData={formMetaData}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
            />
          </Section>
        </Container>
      )}
    </>
  );
};

export default FormLayout;
