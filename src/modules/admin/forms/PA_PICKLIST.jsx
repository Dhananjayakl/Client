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
import JSHook from "./PA_PICKLIST_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import ColorPicker from "src/components/forms/reactformutils/fields/ColorPicker";

let FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues, callbackToParent } = props;
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
    name: "VALUES",
    control,
  });

  const addRow = () => {
    const newRowIndex = fields.length + 1;
    append({
      picklistValueId: "",
      parentKey: "",
      key: newRowIndex.toString(),
      value: "",
      active: true,
      displayOrder: "",
      valueColor: "",
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
    remove,
    append,
    addRow
  );

  const handleChangeColor = (color, rowIndex) => {
    setValue(`VALUES.${rowIndex}.valueColor`, color);
  };

  let disableButton = formMetaData.formmeta.accessCode === 7;

  return (
    <>
      <Container className="justify-content-center ">
        {/* <Section title="Details"> */}
        <Row>
          <Col>
            <FormControl
              control={control}
              name="moduleId"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>
            {/* <FormControl
              control={control}
              name="name"
              formMetaData={formMetaData}
              formMethods={formMethods}
            /> */}
            <FormControl
              control={control}
              name="name"
              // type="controlledObjectName"
              formMetaData={formMetaData}
              formMethods={formMethods}
              value={formMethods.watch("moduleId")}
            />
          </Col>
          <Col>
            <FormControl
              control={control}
              name="purpose"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
        {/* </Section> */}

        <Section title="Picklist Values">
          {fields.map((row, rowIndex) => (
            <Row key={row.id}>
              <Col xs={12} md={6} lg={2}>
                <FormControl
                  control={control}
                  name={`VALUES.${rowIndex}.parentKey`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>

              <Col xs={12} md={6} lg={2}>
                <FormControl
                  control={control}
                  name={`VALUES.${rowIndex}.key`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={2}>
                <FormControl
                  control={control}
                  name={`VALUES.${rowIndex}.value`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={2}>
                <FormControl
                  control={control}
                  name={`VALUES.${rowIndex}.displayOrder`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <div className="d-flex align-items-center  justify-content-end">
                  <FormControl
                    control={control}
                    type="colorPicker"
                    field_title="color"
                    name={`VALUES.${rowIndex}.valueColor`}
                    required={false}
                  />
                  {/* <FormControl
                    control={control}
                    name={`VALUES.${rowIndex}.valueColor`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  /> */}
                </div>
              </Col>
              <Col xs={12} md={6} lg={1} className="mt-5">
                <FormControl
                  control={control}
                  name={`VALUES.${rowIndex}.active`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>

              {/* <Col className="mt-3">
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
                  </Col> */}
              <hr style={{ backgroundColor: "#333", height: "3px" }} />
            </Row>
          ))}
          <Row>
            <Button type="button" onClick={addRow} hidden={disableButton}>
              + Add picklist Values
            </Button>
          </Row>
        </Section>
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
