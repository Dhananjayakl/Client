import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_EM_SEPARATION_REQUEST_JS";
import AuditTrail, {
  ChangeHistoryComp,
  AuditTrailComp,
} from "src/components/forms/reactformutils/elements/AuditTrail";
import Section from "src/components/forms/reactformutils/fields/Section";
// import { WarnUserBeforeReloadOrExit } from "./Warnuser";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    formValues,
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

  // formMetaData.form=JSHook(form,formMethods);

  formMetaData.form = JSHook(form, formMethods, fields, formMetaData);

  const formDirtyCheck = () => {
    return isDirty;
  };
  return (
    <>
      {/* <WarnUserBeforeReloadOrExit formDirtyCheck={formDirtyCheck}/> */}
      <Row>
        <Col>
          <Container className="justify-content-center  ">
            <Row>
              <FormControl
                control={control}
                type="SSelect"
                name="userId"
                formMetaData={formMetaData}
                formMethods={formMethods}
                FieldValue={true}
              />
            </Row>
            <Row>
              <FormControl
                control={control}
                type="date"
                name="resDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Row>
            <Row>
              <FormControl
                control={control}
                type="input"
                name="noticePeriod"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Row>
            <Row>
              <FormControl
                control={control}
                type="date"
                name="relievingDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Row>
            <Row>
              <FormControl
                control={control}
                type="textarea"
                name="reasonSeparation"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Row>
            <Row>
              <FormControl
                control={control}
                type="textarea"
                name="srFeedback"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Row>
            <Row>
              <FormControl
                control={control}
                type="textarea"
                name="confFeedback"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Row>
            <Row>
              <FormControl
                control={control}
                type="input"
                name="manager"
                formMetaData={formMetaData}
                formMethods={formMethods}
                FieldValue={true}
              />
            </Row>
            <Row>
              <FormControl
                control={control}
                type="textarea"
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
        </Col>
        {formValues.objectId != null && (
          <Col md="4" xl="3" style={{ marginTop: "2%" }}>
            <AuditTrailComp
              objectId={formValues.objectId}
              formMethods={formMethods}
              formMetaData={formMetaData}
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default FormLayout;
