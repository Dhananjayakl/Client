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
import JSHook from "./PA_AM_WORK_HOUR_MANAGMENT_JS";
let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
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

  formMetaData.form = JSHook(form, formMethods, fields, callbackToParent);

  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <FormControl
            control={control}
            name="workhoursName"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="colorDrop"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Col>
          <FormControl
            control={control}
            name="workhoursStartTime"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>

        <Row>
          <FormControl
            control={control}
            name="workhoursEndTime"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

        <Row>
          <FormControl
            control={control}
            name="TotalWorkhours"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
      </Container>
    </>
  );
};

export default FormLayout;
