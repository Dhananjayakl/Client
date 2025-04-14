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
import { useWatch } from "react-hook-form";
import JSHook from "./PA_SC_SCHEDULE_MAINTENANCE_JS";

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

  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    formMetaData,
    formValues,
    callbackToParent,
    control
  );
  if (formValues.objectId !== undefined) {
    formMetaData.fields.progress.editable = true;
  } else {
    formMetaData.fields.progress.editable = false;
  }

  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <Col md={6}>
            {" "}
            <FormControl
              control={control}
              name="businessUnit"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col md={6}>
            <FormControl
              control={control}
              name="domainName"
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
          <Col md={6}>
            <FormControl
              control={control}
              name="reason"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col md={6}>
            <FormControl
              control={control}
              name="reasonDetails"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormControl
              control={control}
              name="participant"
              formMetaData={formMetaData}
              formMethods={formMethods}
              zIndex={true}
            />
          </Col>

          <Col md={6}>
            <FormControl
              control={control}
              name="issueOrChanllenges"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormControl
              control={control}
              name="actualStartDate"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col md={6}>
            <FormControl
              control={control}
              name="actualEndDate"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <FormControl
            control={control}
            name="adminUsers"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="progress"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
      </Container>
    </>
  );
};

export default FormLayout;
