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
    objectId,
    runtimeParams,
  } = props;
  const {
    control,
    formState: { errors, touched, isSubmitting },
    watch,
  } = formMethods;
 
  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="businessUnit"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="aeTitle"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>

        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="relType"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="relName"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>
      </Container>
    </>
  );
};
export default FormLayout;
