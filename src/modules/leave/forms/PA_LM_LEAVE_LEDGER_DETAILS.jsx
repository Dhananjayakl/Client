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
import JSHook from "./PA_LM_LEAVE_LEDGER_DETAILS_JS";
// import { WarnUserBeforeReloadOrExit } from "src/modules/employee/forms/Warnuser";

let FormLayout = (props) => {
  let { formMethods, formMetaData, fields, form, formValues } = props;
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
    formValues
  );

  return (
    <>
      {/* <WarnUserBeforeReloadOrExit formDirtyCheck={formDirtyCheck}/> */}
      <Container className="justify-content-center  ">
        <Row>
          <FormControl
            control={control}
            name="userId"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="employeeCode"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
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
        <Row>
          <FormControl
            control={control}
            name="totalcasualLeaves"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>{" "}
        <Row>
          <FormControl
            control={control}
            name="totalearnedLeaves"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>{" "}
        <Row>
          <FormControl
            control={control}
            name="totalmaternityLeaves"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="totalsickLeaves"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="totalpaternityLeaves"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="totaloptionalHoliday"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
      </Container>
    </>
  );
};

export default FormLayout;
