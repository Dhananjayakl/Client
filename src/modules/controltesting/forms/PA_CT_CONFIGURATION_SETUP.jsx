import {
    Container,
    Row,
  } from "react-bootstrap";
  import FormControl from "src/components/forms/reactformutils/FormControl";
  
  const FormLayout = (props) => {
    let {
      formMethods,
       formMetaData,
    } = props;
    const {
      control,
    } = formMethods;
     
    return (
      
        <div>
          <Container className="justify-content-center  ">
           
           <Row>

            <div className="col-md-8">
                <FormControl
                  control={control}
                  name="priorissue"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  others
                />
                <FormControl
                  control={control}
                  name="adhocTestScript"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  others
                />
                <FormControl
                  control={control}
                  name="previousRating"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  others
                />
              </div>
           </Row>
          </Container>
        </div>
     
    );
  };
  
  export default FormLayout;
  