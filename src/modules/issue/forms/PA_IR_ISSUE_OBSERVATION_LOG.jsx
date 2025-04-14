import {
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useFieldArray, useWatch } from "react-hook-form";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useState, useEffect} from "react";
import JSHook from "./PA_IR_ISSUE_OBSERVATION_LOG_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import Relationship from "src/components/forms/reactformutils/elements/Relationship";
import { getPrimaryKeyByFormName } from "src/modules/admin/AdminService";
const FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    formValues,
    validationSchema,
    form,
    callbackToParent,
    runtimeParams,
    fields,
  } = props;
  const {
    
    control,
    
    formState: { errors, touched, isSubmitting, isDirty },
  } = formMethods;

  const [primarykey, setprimaryKey] = useState(null);
  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formMetaData,
    formValues,
    control,
    runtimeParams
  );

  // console.log(runtimeParams,"runtimeparamsss" ,form,
  //   fields,
  //   formMethods,
  //   formMetaData,
  //   formValues,
  //   control,
  //   runtimeParams)

  //   console.log(formMethods.getValues("currentStage"),"stageeeeeeeeee")

  useEffect(() => {
    if (
      formMethods.getValues("fndId") == null ||
      formMethods.getValues("fndId") == ""
    ) {
      getPrimaryKeyByFormName(
        "getPrimaryKeyByFormName",
        formMetaData.formmeta.form_id,
        "NOREGION"
      )
        .then((response) => {
          formMethods.setValue("fndId", response.data);
          console.log(
            formMethods.getValues("fndId"),
            "form idform idform idform idform id"
          );
          setprimaryKey(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  const {
    fields: actFields,
    rows: ACTRows,
    append: appendAct,
    remove: removeACT,
  } = useFieldArray({
    name: "ACT",
    control,
  });

  const addActRow = () => {
    appendAct({
      actId: "",
      actActionTitle: "",
      actActionDueDate: "",
      actActionOwner: "",
      actActionPriority: "",
      actActionStartDate: "",
      actActionType: "",
      actActionApprover: "",
      actActionDescription: "",
      actBusinessUnit: "",
      actExpectedOutput: "",
    });
  };
  let showCount = formValues?.ACT?.length;
  console.log(formValues.status, "formValuesformValuesformValuesformValues");

  const dateconditionforfirstoccuredOn=useWatch({
    control:control,
    name: "fndIdentifiedOn",
  })

  return (
    
      <Container className="justify-content-center  ">
        <Section title="General">
          <Row>
            <Col md={3}>
              <Row>
                <FormControl
                  control={control}
                  name="fndProgram"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Row>
              <Row>
                <FormControl
                  control={control}
                  name="fndType"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Row>

              <Row>
                <FormControl
                  control={control}
                  name="fndSeverity"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Row>

              <Row className="mt-3">
                <FormControl
                  control={control}
                  name="fndPriority"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Row>
            </Col>
            <Col>
              <Row>
                <Col>
                  <FormControl
                    control={control}
                    name="fndName"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormControl
                    control={control}
                    name="fndDescription"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Row className="mt-1">
                  <Col>
                    <FormControl
                      control={control}
                      name="fndIdentifiedOn"
                      modal={props?.modal?true:false}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      minDate={new Date()}
                      // watchFor="fndfirstOccurredOn"
                    />
                  </Col>
                  <Col>
                    <FormControl
                      control={control}
                      name="fndfirstOccurredOn"
                      modal={props?.modal?true:false}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      ConditionalDate={
                        formMethods.getValues("fndIdentifiedOn") != ""
                          ? new Date(dateconditionforfirstoccuredOn)
                          : new Date()
                      }
                      watchFor="fndIdentifiedOn"
                    />
                  </Col>
                  <Col>
                    {" "}
                    <FormControl
                      control={control}
                      name="fndDueBy"
                      modal={props?.modal?true:false}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      futureDate={true}
                    />
                  </Col>
                </Row>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormControl
                control={control}
                name="relatedId"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="relatedObject"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>

          

          <Row></Row>

          <SubSection title="Ownership">
            <Row>
              <Col>
                <FormControl
                  control={control}
                  name="fndBusinessUnit"
                  zIndex={true}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col>
                <FormControl
                  control={control}
                  name="fndOwner"
                  zIndex={true}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col>
                <FormControl
                  control={control}
                  name="fndapproverBusinessUnit"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>

              <Col>
                <FormControl
                  control={control}
                  name="fndApprover"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
            </Row>
          </SubSection>
          <Row></Row>
          <Row>
            <Col>
              <FormControl
                control={control}
                name="fndRecommendation"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="fndAttachment"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <FormControl
                control={control}
                name="fndTriggerIssue"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          
        </Section>
        {(runtimeParams.program == 1 || formValues.fndProgram == 1) && (
          <Section title="Action Plans">
            <div
              style={{
                overflowX: "auto",
                maxWidth: "100%",
              }}
            >
              {actFields.map((row, rowIndex) => (
                <Row key={row.id}>
                  <Col xs={12} md={12} lg={12}>
                    <div>
                      <div
                        className="d-flex"
                        
                      >
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`ACT.${rowIndex}.actActionType`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0 ? true : false}
                            disabled={rowIndex < showCount ? true : false}
                          />
                        </div>
                        <div className="col-md-3 me-3 ">
                          <FormControl
                            control={control}
                            name={`ACT.${rowIndex}.actActionTitle`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0 ? true : false}
                            disabled={rowIndex < showCount ? true : false}
                          />
                        </div>
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`ACT.${rowIndex}.actBusinessUnit`}
                            formMetaData={formMetaData}
                            zIndex={true}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0 ? true : false}
                            disabled={rowIndex < showCount ? true : false}
                          />
                        </div>
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`ACT.${rowIndex}.ActTimeLine`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0 ? true : false}
                            disabled={rowIndex < showCount ? true : false}
                          />
                        </div>
                        <div className="col-md-3 me-3">
                          <FormControl
                            control={control}
                            name={`ACT.${rowIndex}.actExpectedOutput`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={rowIndex > 0 ? true : false}
                            disabled={rowIndex < showCount ? true : false}
                          />
                        </div>

                        {/* {ACTFields.length > 1 && ( */}
                        <div
                          style={{
                            marginTop: rowIndex === 0 ? "39px" : "9px",
                            // Optionally, add other styles you might want to mimic from `.col-md`
                          }}
                        >
                          
                          <Button
                            type="button"
                            variant="warning"
                            className="float-end"
                            onClick={() => removeACT(rowIndex)}
                            disabled={rowIndex < showCount ? true : false}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              ))}
            </div>
            {runtimeParams.formmeta.accessCode == 1 &&  formMethods.getValues("currentStage")==="INITIATE" && (
              <Row>
                <Button type="button" onClick={addActRow}>
                  + Add Management Action Plan
                </Button>
              </Row>
            )}
          </Section>
        )}
        {formMethods.getValues("currentStage") !== "INITIATE" && <Relationship
          formMetaData={formMetaData}
          formMethods={formMethods}
          formId={formMetaData.formmeta.form_id}
          objectId={formMethods.getValues("fndId")}
          sourceName="IR_ISSUE_OBSERVATION_LOG"
          formValues={formValues}
          hidden={
            formMetaData.formmeta.accessCode === 7 ||
            formMetaData.formmeta.accessCode === 1
              ? true
              : false
          }
        />}
        {formMethods.getValues("fndId") != "" && formMethods.getValues("currentStage") !== "INITIATE" && (
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.fndId}
          />
        )}
      </Container>
    
  );
};

export default FormLayout;
