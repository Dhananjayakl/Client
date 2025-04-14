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
import JSHook from "./PA_EM_DOCUMENTS_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";

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
    clearErrors,
    formState: { errors, touched, isSubmitting, isDirty },
  } = formMethods;

  const { fields, rows, append, remove } = useFieldArray({
    name: "DC",
    control,
  });
  const addRow = () => {
    append({
      documentType: "",
      idNumber: "",
      docAttachment: "",
      accountType: "",
      docExpiryDate: "",
      docId: "",
    });
  };
  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    callbackToParent,
    formValues,
    setValue,
    register,
    formMetaData,
    remove,
    append,
    addRow,
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
        <Section title="Documents Details">
          {fields.map((row, rowIndex) => (
            <Row key={row.id}>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`DC.${rowIndex}.documentType`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`DC.${rowIndex}.idNumber`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  type="date"
                  name={`DC.${rowIndex}.docExpiryDate`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate={true}
                  required={
                    ["3", "4", 3, 4].includes(
                      formMethods.watch(`DC.${rowIndex}.documentType`)
                    )
                      ? true
                      : false
                  }
                  disabled={
                    ["1", "2", 1, 2, ""].includes(
                      formMethods.watch(`DC.${rowIndex}.documentType`)
                    )
                      ? true
                      : false
                  }
                />
              </Col>

              <Col xs={4} md={6} lg={3} style={{ width: "50%" }}>
                <FormControl
                  control={control}
                  name={`DC.${rowIndex}.docAttachment`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>

              <Col className="mt-6">
                {fields.length > 1 && (
                  <div className="text-right">
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
              + Add Documents
            </Button>
          </Row>
        </Section>
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
    </>
  );
};
export default FormLayout;
