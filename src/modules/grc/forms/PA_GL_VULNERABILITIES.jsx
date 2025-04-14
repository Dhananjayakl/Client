import { Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_REQUIREMENT_JS";

import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    formState: {},
  } = formMethods;



  return (
    <>
      <Container className="justify-content-center  ">       
          <Row>
            <div className="col-md-10">
              <FormControl
                control={control}
                name="name"
                formMetaData={formMetaData}
                formMethods={formMethods}
                others
              />
            </div>
            <div className="col-md-2" style={{marginTop:"30px"}}>
              <FormControl
                control={control}
                name="active"
                formMetaData={formMetaData}
                formMethods={formMethods}
                others
              />
            </div>
           
          </Row>
          <Row>
          <div className="col-md-10">
                       
                <FormControl
                control={control}
                name="description"
             formMetaData={formMetaData}
                formMethods={formMethods}
              />

               
            
            </div>
          </Row>
          <Row>
          <div className="col-md-4">
            <FormControl
                  control={control}
                  name="source"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
            </div>
          <div className="col-md-4">
              <FormControl
                control={control}
                name="score"
                formMetaData={formMetaData}
                formMethods={formMethods}
                others
              />
            </div>
            <div className="col-md-4">
            <FormControl
                  control={control}
                  name="rating"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
            </div>
         
          </Row>       
        
      </Container>
      {formValues.objectId != null && (
        <Container className="justify-content-center  ">
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
            enableAddComment={formValues.status == "Closed" ? false : true}
          />
        </Container>
      )}
    </>
  );
};

export default FormLayout;
