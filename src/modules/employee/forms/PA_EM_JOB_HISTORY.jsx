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
import JSHook from "./PA_EM_JOB_HISTORY_JS";
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
    name: "PE",
    control,
  });
  const addRow = () => {
    append({
      employerName: "",
      jobType: "",
      jobTitle: "",
      dateOfJoined: "",
      relievingDate: "",
      jobTenure: "",
      lastCtc: "",
      jobId: "",
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
  const priortoToday = new Date();
  priortoToday.setDate(priortoToday.getDate() - 1);

  const relievingDate = new Date();
  relievingDate.setDate(relievingDate.getDate() - 1);

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
        <Row>
          <Col>
            <FormControl
              control={control}
              name="nopriorExperience"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col></Col>
        </Row>
        {/* </Section> */}
        {[false, "",null].includes(formMethods.watch("nopriorExperience")) ===
        true ? (
          <Section title="Professional Experience">
            {fields.map((row, rowIndex) => (
              <Row key={row.id}>
                <Col xs={12} md={6} lg={3}>
                  <FormControl
                    control={control}
                    name={`PE.${rowIndex}.employerName`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <FormControl
                    control={control}
                    name={`PE.${rowIndex}.jobType`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <FormControl
                    control={control}
                    name={`PE.${rowIndex}.jobTitle`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <FormControl
                    control={control}
                    type="date"
                    name={`PE.${rowIndex}.dateOfJoined`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    ConditionalDate={priortoToday}
                  />
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <FormControl
                    control={control}
                    type="date"
                    name={`PE.${rowIndex}.relievingDate`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    ConditionalDate={relievingDate}
                  />
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <FormControl
                    control={control}
                    name={`PE.${rowIndex}.jobTenure`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <FormControl
                    control={control}
                    name={`PE.${rowIndex}.lastCtc`}
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

            <Row>
              <Button type="button" onClick={addRow} hidden={disableButton}>
                + Add Professional Experience
              </Button>
            </Row>
          </Section>
        ) : (
          ""
        )}
        {/* <Section title="Comments"> */}
        <Row>
          <FormControl
            control={control}
            name="reasonForLeaving"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="expRelAttach"
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
