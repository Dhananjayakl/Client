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

  formMethods.setValue("formId", formMetaData.formmeta.form_id);

  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <Col>
          <FormControl
            control={control}
            name="businessUnit"
            zIndex={true}
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
          </Col>
       <Col><FormControl
            control={control}
            name="domainName"
            formMetaData={formMetaData}
            formMethods={formMethods}
          /></Col>
        </Row>
        <Row>
        <Col>
        <FormControl
            control={control}
            name="maxActiveUsers"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
          </Col>
          <Col>
        <FormControl
            control={control}
            name="maxConcurrentUsers"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
          </Col>
        </Row>

        {/* <Row>
          <FormControl
            control={control}
            name="maxConcurrentUsers"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row> */}

        <Row>
         
                    <Col> <FormControl
            control={control}
            name="startDate"
            formMetaData={formMetaData}
            formMethods={formMethods}
          /></Col>

                    <Col>   <FormControl
            control={control}
            name="endDate"
            formMetaData={formMetaData}
            formMethods={formMethods}
          /></Col>

        </Row>
        {/* <Row>
       
        </Row> */}

        {/* <Row>
          
        </Row> */}
        <Row>
          <FormControl
            control={control}
            name="activateAllProducts"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
      </Container>
    </>
  );
};

export default FormLayout;
