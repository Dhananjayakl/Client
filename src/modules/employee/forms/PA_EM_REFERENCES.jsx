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
import JSHook from "./PA_EM_REFERENCES_JS";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
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
    callbackToParent,
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

  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    callbackToParent,
    formValues
  );

  const formDirtyCheck = () => {
    return isDirty;
  };
  return (
    <>
      {/* <WarnUserBeforeReloadOrExit formDirtyCheck={formDirtyCheck}/> */}
      <Container className="justify-content-center  ">
        <Row>
          <FormControl
            control={control}
            name="userId"
            formMetaData={formMetaData}
            formMethods={formMethods}
            FieldValue={true}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="refName"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="jobTitle"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="companyName"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="emailId"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

        <Row>
          <FormControl
            control={control}
            name="mobileNo"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

        <Row>
          <FormControl
            control={control}
            name="totalExperience"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="attachment"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

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
