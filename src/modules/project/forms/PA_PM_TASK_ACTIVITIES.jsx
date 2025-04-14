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
import { useFieldArray } from "react-hook-form";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import { useEffect, useMemo, useState } from "react";
//   import JSHook from "./PA_PM_PROJECT_JS";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
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

  console.log(runtimeParams.ParentFormObjectId, "runtimeParamsruntimeParams");
  // formMetaData.form = JSHook(
  //   form,
  //   formMetaData,
  //   formMethods,
  //   MSFields,
  //   formValues,
  //   control
  // );

  if (formValues.taskId === undefined) {
    formMethods.setValue("taskId", runtimeParams.ParentFormObjectId);
  }
  return (
    <>
      <Container className="justify-content-center">
        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="activityName"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="actCategory"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>
        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="performedOn"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="activityHours"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>
        <Row>
          <div className="col-md-12">
            <FormControl
              control={control}
              name="actComments"
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
