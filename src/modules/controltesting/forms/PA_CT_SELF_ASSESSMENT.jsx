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
import JSHook from "./PA_CT_SELF_ASSESSMENT_JS";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import { useWatch } from "react-hook-form";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
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
    formState: { errors, touched, isSubmitting },
  } = formMethods;

  formMetaData.form = JSHook(form, fields, formMethods, formValues,formMetaData,control);

  if (formValues.objectId == null) {
    formMethods.setValue("status", "New");
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("previousStage", " ");
  }
  if (
    runtimeParams.process !== null &&
    runtimeParams.process !== undefined &&
    runtimeParams.process[0] !== undefined
  ) {
    formMethods.setValue("process", parseInt(runtimeParams.process));
  }

  if (
    runtimeParams.businessUnit !== null &&
    runtimeParams.businessUnit !== undefined &&
    runtimeParams.businessUnit[0] !== undefined
  ) {
    formMethods.setValue("businessUnit", parseInt(runtimeParams.businessUnit));
  }
  
  const schStartDate = useWatch({
    control: control,
    name: "startDate",
  });

  const frequency = formMethods.getValues("frequency");

  return (
    <>
      <div>
        <Container className="justify-content-center  ">
          <SubSection title="General Information">
            <Row>
              <div className="col-md-8">
                <FormControl
                  control={control}
                  name="testName"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  others
                />
              </div>
            </Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="framework"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </SubSection>
          <SubSection title="Scope">
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="businessUnit"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
             
                  setData={runtimeParams.businessUnit ? true : false}
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="process"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                
                  setData={runtimeParams.process ? true : false}
                />
              </div>
            </Row>
            <Row>
              <FormControl
                control={control}
                name="controls"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Row>
          </SubSection>
          <SubSection title="Schedule">
            <Row>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="frequency"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              </Row>
              {frequency == "8" || frequency == "1" ? (
                            <Row>
                              <div className="col-md-3">
                                <FormControl
                                  control={control}
                                  name="startDate"
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  futureDate={true}
                                  watchFor="frequency"
                                />
                              </div>
                              <div className="col-md-3">
                                <FormControl
                                  control={control}
                                  name="dueDate"
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  watchFor="frequency"
                                  futureDate={true}
                                  futureDateValue={
                                    frequency == "8"
                                      ? new Date(schStartDate).setDate(
                                          new Date(schStartDate).getDate()
                                        )
                                      : new Date(schStartDate).setDate(
                                          new Date(schStartDate).getDate() + 1
                                        )
                                  }
                                />
                              </div>
                            </Row>
                          ) : (
                            <Row>
                              <div className="col-md-3">
                                <FormControl
                                  control={control}
                                  name="startDate"
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  futureDate={true}
                                  watchFor="frequency"
                                />
                              </div>
               
                              <div className="col-md-3">
                                <FormControl
                                  control={control}
                                  name="dueBy"
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  watchFor="frequency"
                                />
                              </div>
                              <div className="col-md-2 mt-3">
                                <FormControl
                                  control={control}
                                  name="onWorkingDay"
                                  auditableEntity
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  watchFor="frequency"
                                  hideTitle
                                />
                                <FormControl
                                  control={control}
                                  name="onCalendarDay"
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  watchFor="frequency"
                                  hideTitle
                                />
                              </div>
                              <div className="col-md-3">
                                <FormControl
                                  control={control}
                                  name="dueDate"
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  watchFor="frequency"
                                  futureDate={true}
                                  futureDateValue={
                                    frequency == "8"
                                      ? new Date(schStartDate).setDate(
                                          new Date(schStartDate).getDate()
                                        )
                                      : new Date(schStartDate).setDate(
                                          new Date(schStartDate).getDate() + 1
                                        )
                                  }
                                />
                              </div>
                            </Row>
                          )}
          </SubSection>{" "}
          <SubSection title="Ownership">
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  type="select"
                  name="tester"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  zIndex={true}
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="approver"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  zIndex={true}
                />
              </div>
            </Row>
          </SubSection>
        </Container>
      </div>
    </>
  );
};

export default FormLayout;
