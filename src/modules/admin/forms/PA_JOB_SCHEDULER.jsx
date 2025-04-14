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
import Moving from "src/components/forms/reactformutils/fields/Moving";

import JSHook from "./PA_JOB_SCHEDULER_JS";
import { Section } from "src/Progrec";

let FormLayout = (props) => {
  let { formMethods, formMetaData, validationSchema, form, objectId, fields } =
    props;
  const {
    setError,
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touched, isSubmitting },
  } = formMethods;

  formMetaData.form = JSHook(form, formMethods, fields, formMetaData, control);

  console.log("form form layout:", formMetaData);
  console.log("jsx values of fields", form);
  console.log("h3", fields);

  return (
    <>
      <Container className="justify-content-center  ">
        <Section title="Details">
          <Row>
            <Col md={4}>
              <FormControl
                control={control}
                // type="select"
                name="module"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>

            {/* <Moving fieldname={fields}/> */}

            <Col>
              <FormControl
                control={control}
                name="name"
                // type="controlledObjectName"
                formMetaData={formMetaData}
                formMethods={formMethods}
                value={formMethods.watch("module")}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FormControl
                control={control}
                // type="textarea"
                name="description"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <FormControl
                control={control}
                // type="select"
                name="jobType"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                // type="input"
                name="className"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                // type="input"
                name="methodName"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FormControl
                control={control}
                // type="date"
                name="validfrom"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>

            <Col>
              <FormControl
                control={control}
                // type="date"
                name="validuntil"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col></Col>
          </Row>
        </Section>
        <Section title="Schedule">
          <Row>
            <Col>
              <FormControl
                control={control}
                type="select"
                name="timeZone"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                // type="select"
                name="scheduleType"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                type="select"
                name="run"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                type="time"
                name="hourly"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
              <FormControl
                control={control}
                type="date"
                name="date"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
              <FormControl
                control={control}
                // type="input"
                name="byMinute"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
              <FormControl
                control={control}
                // type="select"
                name="weekly"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
              <FormControl
                control={control}
                // type="select"
                name="days"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <FormControl
                control={control}
                type="timepicker"
                name="runAt"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>

            <Col></Col>
          </Row>
        </Section>
      </Container>
    </>
  );
};

export default FormLayout;
