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
let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    callbackToParent,
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
  if (formValues.objectId !== undefined) {
    formMetaData.fields.progress.editable = true;
  } else {
    formMetaData.fields.progress.editable = false;
  }

  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <Col md={6} xs={12}>
            <FormControl
              control={control}
              name="businessUnit"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col md={6} xs={12}>
            <FormControl
              control={control}
              name="participant"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>

        <Row>
          <Col md={6} xs={12}>
            <FormControl
              control={control}
              name="startDateTime"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>

          <Col md={6} xs={12}>
            <FormControl
              control={control}
              name="endDateTime"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6} xs={12}>
            <FormControl
              control={control}
              name="actualStartDate"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col md={6} xs={12}>
            <FormControl
              control={control}
              name="actualEndDate"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6} xs={12}>
            <FormControl
              control={control}
              name="progress"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FormLayout;
