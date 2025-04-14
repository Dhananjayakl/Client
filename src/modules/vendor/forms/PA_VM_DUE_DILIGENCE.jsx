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
import JSHook from "./PA_VM_DUE_DILIGENCE_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";
import { useWatch } from "react-hook-form";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues } = props;
  const {
    control,
    formState: {},
  } = formMethods;
  formMetaData.form = JSHook(
    form,
    control,
    formMetaData,
    formMethods,
    formValues
  );

  const rBiGuideLines =
    formMetaData?.configurationFormMetaData.rbi_guidelines_form;
  console.log(
    formValues,
    formMetaData?.configurationFormMetaData.rbi_guidelines_form,
    "formvalues of due diligence"
  );

  const perodicDDA = useWatch({
    control,
    name: "periodicDueDiligence",
  });

  console.log(perodicDDA, "perdioc ddda");

  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <div className="col-md-8">
            <FormControl
              control={control}
              name="dueDiligenceProcess"
              formMetaData={formMetaData}
              formMethods={formMethods}
              others
            />
          </div>
          <div className="col-md-4">
            <FormControl
              control={control}
              name="triggerDate"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>
        {/* <Row className="mt-2">
          <Col md={6}>
            <FormControl
              control={control}
              name="eventBased"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col md={6}>
            <FormControl
              control={control}
              name="serviceProduct"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row> */}

        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="serviceProductTitle"
              formMetaData={formMetaData}
              formMethods={formMethods}
              watchFor="serviceProduct"
            />
          </div>
          {/* {rBiGuideLines && (
            <>
              <div className="col-md-6 mt-5">
                <FormControl
                  control={control}
                  name="periodicDueDiligence"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  watchFor="serviceProduct"
                />
              </div>
            </>
          )} */}
        </Row>

        {/* {perodicDDA && (
          <>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="dueDiligenceChecklist"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  watchFor="serviceProduct"
                />
              </div>
            </Row>
          </>
        )} */}

        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="event"
              formMetaData={formMetaData}
              formMethods={formMethods}
              watchFor="eventBased"
            />
          </div>
        </Row>
        <Row>
          <div className="col-md-8">
            <FormControl
              control={control}
              name="vendors"
              formMetaData={formMetaData}
              formMethods={formMethods}
              zIndex={true}
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
