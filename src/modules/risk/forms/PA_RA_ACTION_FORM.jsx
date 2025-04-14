import React from "react";
import { Container, Row } from "react-bootstrap";
import JSHook from "./PA_RA_ACTION_FORM_JS";
import FormControl from "src/components/forms/reactformutils/FormControl";
import "react-toastify/dist/ReactToastify.css";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const { control } = formMethods;
  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formValues,
    formMetaData,
    runtimeParams,
    control
  );
  const showRequestDate =
    formMethods?.getValues("currentStage") === "DUE DATE CLARIFICATION";
  const showRequestDates = formMethods?.getValues("currentStage") === "PERFORM";

  const check = showRequestDate || showRequestDates;
  if (check === true) {
    formMetaData.fields.oldDueDate.visible = true;
  }
  const oldDueDate = formMethods?.getValues("oldDueDate");

  // // Explicitly check for null, undefined, or empty string
  // if (oldDueDate !== null && oldDueDate !== undefined && oldDueDate !== "") {
  //   formMetaData.fields.oldDueDate.visible = true;
  // } else {
  //   formMetaData.fields.oldDueDate.visible = false;
  // }

  const schedule = formMethods.getValues("schedule");

  return (
    <Container className="justify-content-center  ">
      <Row>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="name"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="owner"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-12">
          <FormControl
            control={control}
            name="dueDate"
            formMetaData={formMetaData}
            formMethods={formMethods}
            singleRow
            labelSize={4}
            futureDate
            required={true}
          />
        </div>
        <div>
          <FormControl
            control={control}
            name="oldDueDate"
            formMetaData={formMetaData}
            formMethods={formMethods}
            singleRow
            labelSize={4}
          />
        </div>
      </Row>
      <Row>
        <div>
          <FormControl
            control={control}
            name="description"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
      <Row>
        <div>
          <FormControl
            control={control}
            name="workDone"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-3">
          <FormControl
            control={control}
            name="percentageCompletion"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
        <div className="col-md-8">
          <FormControl
            control={control}
            name="attachment"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
    </Container>
  );
};

export default FormLayout;
