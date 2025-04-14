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
import JSHook from "./PA_AM_REGULARIZATION_JS";
import { useEffect } from "react";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    callbackToParent,
    formValues,
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
    fields,
    formMethods,
    formMetaData,
    callbackToParent,
    formValues,
    runtimeParams
  );
  console.log(runtimeParams, "runtimeParamsruntimeParams");

  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <FormControl
            control={control}
            name="employeeName"
            formMetaData={formMetaData}
            formMethods={formMethods}
            FieldValue={true}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="futureRegularization"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

        <Row>
          <FormControl
            control={control}
            type="date"
            name="from"
            formMetaData={formMetaData}
            formMethods={formMethods}
            watchFor="futureRegularization"
            futureDate={
              formMethods.getValues("futureRegularization") ? true : false
            }
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            type="date"
            name="until"
            formMetaData={formMetaData}
            formMethods={formMethods}
            watchFor="from"
          />
        </Row>
        {/*
         <Col >
        <FormControl
            control={control}
            type="input"
            name="absenceDuration"
            formMetaData={formMetaData}
            formMethods={formMethods}
           
          />
        </Col> */}

        {/* <Row>
        <FormControl
            control={control}
            type="date"
            name="approvedOn"
            formMetaData={formMetaData}
            formMethods={formMethods}
            placeholder="Confidentiality"
          />
        </Row> */}
        <Row>
          <FormControl
            control={control}
            type="date"
            name="date"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="duration"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

        <Row>
          <FormControl
            control={control}
            name="reason"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="manager"
            FieldValue={true}
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
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
    </>
  );
};

export default FormLayout;
