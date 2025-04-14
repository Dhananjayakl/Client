import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
// import FormControl from "src/components/forms/reactformutils/FormControl"\
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_LM_HOLIDAY_SETUP_JS";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    fields,
    form,
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

  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    formMetaData,
    callbackToParent
  );

  console.log("form form layout:", formMetaData);

  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <FormControl
            control={control}
            name="year"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="region"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

        <Row>
          <FormControl
            control={control}
            name="holidayDate"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="occasion"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
      </Container>
    </>
  );
};

export default FormLayout;
