import {
  Form,
  Button,
  Table,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useForm, useFieldArray } from "react-hook-form";
import JSHook from "./PA_EM_CERTIFICATIONS_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
//import { WarnUserBeforeReloadOrExit } from "./Warnuser";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    form,
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

  const { fields, rows, append, remove } = useFieldArray({
    name: "CR",
    control,
  });
  const addRow = () => {
    append({
      certType: "",
      certTitle: "",
      certDesc: "",
      uploadCertificate: "",
      expiryDate: "",
      certId: "",
    });
  };
  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    formValues,
    register,
    setValue,
    formMetaData,
    remove,
    append,
    addRow,
    callbackToParent,
    runtimeParams
  );

  let disableButton = formMetaData.formmeta.accessCode === 7;

  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <Col>
            <FormControl
              control={control}
              name="userId"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col></Col>
        </Row>

        {/* </Section> */}
        <Section title="Certifications">
          {fields.map((row, rowIndex) => (
            <Row key={row.id}>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`CR.${rowIndex}.certType`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`CR.${rowIndex}.certTitle`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={4} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`CR.${rowIndex}.certDesc`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  type="date"
                  name={`CR.${rowIndex}.expiryDate`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate={true}
                />
              </Col>
              <Col xs={12} md={6} lg={3} style={{ width: "50%" }}>
                <FormControl
                  control={control}
                  name={`CR.${rowIndex}.uploadCertificate`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>

              <Col className="mt-6">
                {fields.length > 1 && (
                  <div class="text-right">
                    <Button
                      type="button"
                      variant="warning"
                      className="float-end"
                      onClick={() => remove(rowIndex)}
                      hidden={disableButton}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </Col>
              <hr style={{ backgroundColor: "#333", height: "3px" }} />
            </Row>
          ))}
          <Row>
            <Button type="button" onClick={addRow} hidden={disableButton}>
              + Add Certifications
            </Button>
          </Row>
        </Section>
        {/* <Section title="Comments"> */}
        <Row>
          <FormControl
            control={control}
            name="comments"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

        {/* </Section> */}
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
