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
import JSHook from "./PA_EM_EDUCATION_DETAILS_JS";
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
    formState: { errors, touched, isSubmitting, isDirty },
  } = formMethods;

  const { fields, rows, append, remove } = useFieldArray({
    name: "ED",
    control,
  });
  const addRow = () => {
    append({
      universityName: "",
      collegeName: "",
      degreeType: "",
      degreeSpecialization: "",
      passedYear: "",
      marksPercentage: "",
      eduId: "",
    });
  };
  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    formValues,
    formMetaData,
    setValue,
    register,
    callbackToParent,
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

        {/* </Section> */}
        <Section title="Education Details">
          {fields.map((row, rowIndex) => (
            <Row key={row.id}>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`ED.${rowIndex}.universityName`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`ED.${rowIndex}.collegeName`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={6} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`ED.${rowIndex}.degreeType`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`ED.${rowIndex}.degreeSpecialization`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`ED.${rowIndex}.passedYear`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  min="1000"
                  max="9999"
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  type="number"
                  name={`ED.${rowIndex}.marksPercentage`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col className="mt-5">
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
          {/* Button to add a new row */}
          <Row>
            <Button type="button" onClick={addRow} hidden={disableButton}>
              + Add Education Details
            </Button>
          </Row>
        </Section>
        {/* <Section title="Comments"> */}
        <Row>
          <FormControl
            control={control}
            name="uploadCertification"
            formMetaData={formMetaData}
            formMethods={formMethods}
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
    </>
  );
};
export default FormLayout;
