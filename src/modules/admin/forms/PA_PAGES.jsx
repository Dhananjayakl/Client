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
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import Section from "src/components/forms/reactformutils/fields/Section";

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

  // formMetaData.form = JSHook(
  //   form,
  //   formMethods,
  //   fields,
  //   callbackToParent,
  //   formValues
  // );
  console.log("form form layout:", formMetaData);

  const formDirtyCheck = () => {
    return isDirty;
  };
  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <FormControl
            control={control}
            name="module"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="pageTitle"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          {/* <FormControl
            control={control}
            name="pageName"
            formMetaData={formMetaData}
            formMethods={formMethods}
          /> */}
          <FormControl
            control={control}
            name="pageName"
            // type="controlledObjectName"
            formMetaData={formMetaData}
            formMethods={formMethods}
            value={formMethods.watch("module")}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="apiHandler"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

        <Row>
          <FormControl
            control={control}
            name="purpose"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="privilege"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="disableNavigation"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>

        <FormControl
            control={control}
            name="active"
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
