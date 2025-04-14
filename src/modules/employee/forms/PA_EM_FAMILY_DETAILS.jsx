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
import JSHook from "./PA_EM_FAMILY_DETAILS_JS";
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
    name: "FM",
    control,
  });
  const addRow = () => {
    append({
      relationshipType: "",
      familyName: "",
      birthDate: "",
      familyGender: "",
      occupationType: "",
      phoneNo: "",
      relAddress: "",
      familyId: "",
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
    append,
    remove,
    addRow,
    runtimeParams
  );

  let disableButton = formMetaData.formmeta.accessCode === 7;

  const fmDateofbirth = new Date();
  fmDateofbirth.setDate(fmDateofbirth.getDate());
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
        <Section title="Dependent Information">
          {fields.map((row, rowIndex) => (
            <Row key={row.id}>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`FM.${rowIndex}.relationshipType`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`FM.${rowIndex}.familyName`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={4} md={6} lg={3}>
                <FormControl
                  control={control}
                  type="date"
                  name={`FM.${rowIndex}.birthDate`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  ConditionalDate={fmDateofbirth}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`FM.${rowIndex}.familyGender`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`FM.${rowIndex}.occupationType`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`FM.${rowIndex}.phoneNo`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`FM.${rowIndex}.relAddress`}
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
              +Add Dependent Information
            </Button>
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
