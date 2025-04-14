import { Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_CONTACT_DETAILS_JS";

const FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    formValues,
    fields,
    runtimeParams,
  } = props;
  const {
    control,
    formState: {},
  } = formMethods;
  formMetaData.form = JSHook(form, fields, formMethods, formValues);

  return (
    <>
      <Row>
        <Col>
          <Container className="justify-content-center  ">
            <div className="col-md-6">
              <FormControl
                control={control}
                name="type"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="cntName"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="LastName"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate={true}
                />
              </div>
            </Row>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="email"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>

              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="cntPhone"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="userName"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          </Container>
        </Col>
      </Row>
    </>
  );
};
export default FormLayout;
