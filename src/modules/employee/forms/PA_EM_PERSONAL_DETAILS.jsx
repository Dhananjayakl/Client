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
import JSHook from "./PA_EM_PERSONAL_DETAILS_JS";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import Section from "src/components/forms/reactformutils/fields/Section";
import { useWatch } from "react-hook-form";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    form,
    fields,
    formValues,
    callbackToParent,
    runtimeParams,
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

  // formMetaData.form=JSHook(form,formMethods);

  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    formMetaData,
    formValues,
    callbackToParent,
    runtimeParams
  );
  let dateOfBirth = useWatch({
    control: control,
    name: "dateOfBirth",
  });

  var birthDate = new Date();
  birthDate.setFullYear(birthDate.getFullYear() - 18);

  const marriageDate = new Date();
  marriageDate.setDate(marriageDate.getDate() - 1);

  const marrDate = new Date(dateOfBirth).setFullYear(
    new Date(formMethods.getValues("dateOfBirth")).getFullYear() + 18
  );

  return (
    <>
      {/* <WarnUserBeforeReloadOrExit formDirtyCheck={formDirtyCheck}/> */}

      <Container className="justify-content-center  ">
        <Row>
          <Col>
            <FormControl
              control={control}
              name="userId"
              formMetaData={formMetaData}
              formMethods={formMethods}
              setData={true}
            />
          </Col>
          <Col>
            <FormControl
              control={control}
              name="emloyeeId"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <FormControl
              control={control}
              name="firstName"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col>
            <FormControl
              control={control}
              name="middleName"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col>
            <FormControl
              control={control}
              name="lastName"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
        {/* <Row>
        <FormControl
            control={control}
            type="select"
            name="gender"
            formMetaData={formMetaData}
            formMethods={formMethods}
            
          /> 
        </Row> */}

        <Row>
          <Col>
            <FormControl
              control={control}
              // type="datepick"
              type="date"
              name="dateOfBirth"
              formMetaData={formMetaData}
              formMethods={formMethods}
              ConditionalDate={birthDate}
            />
          </Col>
          <Col>
            <FormControl
              control={control}
              name="birthPlace"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <FormControl
              control={control}
              name="bloodGroup"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col>
            <FormControl
              control={control}
              name="religion"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <FormControl
              control={control}
              name="domicile"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col>
            <FormControl
              control={control}
              name="citizenship"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <FormControl
              control={control}
              name="maritalStatus"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>

          <Col>
            <FormControl
              control={control}
              type="date"
              name="marriageDate"
              formMetaData={formMetaData}
              formMethods={formMethods}
              ConditionalDate={marriageDate}
              futureDate={true}
              futureDateValue={marrDate}
            />
          </Col>
        </Row>
        <Row>
          <FormControl
            control={control}
            name="comments"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
      </Container>
      {formValues.objectId != null && (
        <Container className="justify-content-center  ">
          <Section title="Comments and Change History">
            <AuditTrail
              formMetaData={formMetaData}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
            />
          </Section>
        </Container>
      )}
    </>
  );
};

export default FormLayout;
