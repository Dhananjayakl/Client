import {
  Form,
  Button,
  Table,
  Card,
  Container,
  Row,
  Col,
  Alert,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import JSHook from "./PA_EM_SKILL_DETAILS_JS";
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

  const years = Array.from({ length: 50 }, (_, i) => i); // Creating an array of 50 years
  const months = Array.from({ length: 12 }, (_, i) => i); // Creating an array of 12 months

  const { fields, rows, append, remove } = useFieldArray({
    name: "SK",
    control,
  });
  const addRow = () => {
    append({
      subCategory: "",
      Category: "",
      title: "",
      rating: "",
      exp: "",
      skillId: "",
      expYears: "",
      expMonths: "",
    });
  };

  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    formMetaData,
    formValues,
    register,
    setValue,
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
        {/* <Section title="Details"> */}
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
        <Section title="Skill Details">
          {fields.map((row, rowIndex) => (
            <Row key={row.id}>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`SK.${rowIndex}.Category`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`SK.${rowIndex}.subCategory`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              {/* <Col xs={12} md={6} lg={3}>
                    <FormControl
                      control={control}
                      name={`SK.${rowIndex}.title`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </Col> */}
              {[74, 75, 76, 77, 78, 79].includes(
                formMethods.watch(`SK.${rowIndex}.subCategory`)
              ) && (
                <Col xs={12} md={6} lg={3}>
                  <FormControl
                    control={control}
                    name={`SK.${rowIndex}.title`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor={`SK.${rowIndex}.Category`}
                  />
                </Col>
              )}
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`SK.${rowIndex}.rating`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              {/* <Col xs={12} md={6} lg={3}>
                    <FormControl
                      control={control}
                      name={`SK.${rowIndex}.exp`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </Col> */}
              <Col xs={12} md={6} lg={6}>
                <FormGroup controlId={`experience[${rowIndex}]`}>
                  <Row>
                    {/* <Col >
                      <FormLabel class="text-dark form-label">Experience</FormLabel> 
                      <span class="text-danger ">*</span>                     
                      </Col> */}
                    <Col className="mt-3 ms-0">
                      <label className="text-dark form-label mb-0">
                        Experience
                        <span className="text-danger mb-0 pb-0">*</span>
                      </label>
                    </Col>
                    <Col style={{ marginTop: "-15px", marginLeft: "-100px" }}>
                      <FormControl
                        control={control}
                        name={`SK.${rowIndex}.expYears`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        field_title=""
                        required={false}
                        groupFieldLabel="Select Year(s)"
                        // helptext=""
                      />
                    </Col>
                    <Col style={{ marginTop: "-15px", marginLeft: "-20px" }}>
                      <FormControl
                        control={control}
                        name={`SK.${rowIndex}.expMonths`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        field_title=""
                        required={false}
                        groupFieldLabel="Select Month(s)"
                      />
                    </Col>
                  </Row>
                  {/* </FormLabel> */}
                </FormGroup>
              </Col>

              <Col className="mt-2">
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
              + Add Skills
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
