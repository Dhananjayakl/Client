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

import JSHook from "./PA_BR_EMERGENCY_NOTIFICATIONS_JS";
import Section from "src/components/forms/reactformutils/fields/Section";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    formValues,
    validationSchema,
    form,
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

  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    control
  );

  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <Col>
            <FormControl
              control={control}
              name="notificationName"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>

          <Col>
            <FormControl
              control={control}
              name="existNotification"
              formMetaData={formMetaData}
              formMethods={formMethods}
              closeButton={true}
              required={false}
            />
          </Col>
        </Row>
        <Section title="Message to Be Broadcasted">
          <Row>
            <FormControl
              control={control}
              name="subject"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>

          <Row>
            <FormControl
              control={control}
              name="body"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
          <Row>
            <FormControl
              control={control}
              name="emailAttachments"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
          <Row>
            <Col>
              <FormControl
                control={control}
                name="messageType"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="conferenceBridge"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <FormControl
                control={control}
                name="groups"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="individuals"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>
        <Section title="Primary Contacts to Be Notified">
          <Row>
            <Col>
              <FormControl
                control={control}
                name="appliesOrg"
                formMetaData={formMetaData}
                formMethods={formMethods}
                closeButton={true}
              />
            </Col>

            <Col>
              <FormControl
                control={control}
                name="approvers"
                formMetaData={formMetaData}
                formMethods={formMethods}
                closeButton={true}
              />
            </Col>
          </Row>
        </Section>
      </Container>
    </>
  );
};

export default FormLayout;
