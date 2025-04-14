import { Container, Row, Tab, Tabs } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useState, useEffect } from "react";
import { getServiceData } from "../GrcService";
import JSHook from "./PA_GL_RCM_REVIEW_JS";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";
import ProcessTree from "src/modules/grc/pages/ProcessTree";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues, fields, runtimeParams } =
    props;
  const {
    control,
    formState: {},
  } = formMethods;

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
    formMethods.setValue("process", {
      label: runtimeParams.process[0][0].label,
      value: runtimeParams.process[0][0].value,
    });
    formMetaData.fields.process.editable = false;
  }

  if (
    runtimeParams.businessUnit !== null &&
    runtimeParams.businessUnit !== undefined &&
    runtimeParams.businessUnit[0] !== undefined
  ) {
    formMethods.setValue(
      "businessUnit",
      parseInt(runtimeParams.businessUnit[0][0].value)
    );
    formMetaData.fields.businessUnit.editable = false;
  }

  formMetaData.form = JSHook(form, formMetaData, formMethods, formValues);

  let processId = formMethods.getValues("process");
  const [processName, setProcessName] = useState("null");

  useEffect(() => {
    getServiceData("getProcessInfo", processId)
      .then((response) => {
        const responseData = response.data;
        setProcessName(responseData.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (runtimeParams?.process !== undefined) {
    formMethods.setValue("processName", runtimeParams.process[0][0].label);
  }

  return (
    <>
      {formMethods.getValues("currentStage") == "REVIEW" ? (
        <Tabs
          defaultActiveKey="Combined Assurance"
          id="ProcessTab"
          className="mb-3 mt-3 "
        >
          <Tab eventKey="Combined Assurance" title="General Details">
            <Container className="justify-content-center ">
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
              {formValues.objectId != null && (
                <>
                  <Row>
                    <div className="col-md-8">
                      <FormControl
                        control={control}
                        name="attachment"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </div>
                  </Row>
                </>
              )}
              <Row>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    name="reviewer"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    disabled={formValues.objectId != null}
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="comments"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            </Container>
          </Tab>
          <Tab eventKey="relationships" title="Relationship">
            <ProcessTree processId={processId} render={true} />
          </Tab>
        </Tabs>
      ) : (
        <Container className="justify-content-center mt-3">
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="businessUnit"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="process"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="reviewer"
                formMetaData={formMetaData}
                formMethods={formMethods}
                disabled={formValues.objectId != null}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="processName"
                formMetaData={formMetaData}
                formMethods={formMethods}
                visible={false}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="comments"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Container>
      )}

      {formValues.objectId != null && (
        <Container className="pt-4 justify-content-center">
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
