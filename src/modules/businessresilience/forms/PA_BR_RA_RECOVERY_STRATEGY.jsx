import { Container, Row, Col, Modal } from "react-bootstrap";
import { useFieldArray } from "react-hook-form";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useState } from "react";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import JSHook from "./PA_BR_RA_RECOVERY_STRATEGY_JS";
import "../../../../src/assets/scss/profile.scss";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import { useWatch } from "react-hook-form";

const FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    formValues,

    form,
  } = props;
  const {
    control,

    formState: {},
  } = formMethods;
  const [sectionName, setSectionName] = useState();
  const [GroupValue, setGroupValue] = useState();

  const [biAName, setBiaName] = useState("");
  const [errorMessage, seterrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [biaformId, setbiaformId] = useState("");

  const { append: appendRas, remove: removeras } = useFieldArray({
    name: "RAS",
    control,
  });

  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    appendRas,
    removeras,
    control,
    setBiaName,
    setGroupValue,
    setSectionName,
    seterrorMessage,
    setSuccessMessage,
    setbiaformId
  );

  let rowIndex = -1;

  const buttons = document.querySelectorAll(".disbutton");

  buttons.forEach((button) => {
    const buttonChildren = button.textContent.trim();
    if (errorMessage) {
      if (buttonChildren == "Send for Review" || buttonChildren == "Submit") {
        button.hidden = true;
      } else {
        button.hidden = false;
      }
    } else {
      button.hidden = false;
    }
  });

  let biaId = useWatch({
    control: control,
    name: "biaName",
  });
  console.log(biaId, "biaIdbiaId");
  const impactName = formMetaData?.dataSourceResponse?.biaName;

  return (
    <>
      <Container className="justify-content-center">
        <Section title="General" required>
          <Row>
            <Col>
              <FormControl
                control={control}
                name="biaName"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />

              {!errorMessage && (
                <ModalForm
                  className="mb-4 ms-3"
                  variant
                  style={{ textDecoration: "underline" }}
                  objectId={
                    biaId[0]?.value || biaId?.value
                      ? biaId[0]?.value || biaId?.value
                      : biaformId
                  }
                  component={
                    <FormRunTime
                      formService="businessimpactanalysis"
                      objectId={
                        biaId[0]?.value || biaId?.value
                          ? biaId[0]?.value || biaId?.value
                          : biaformId
                      }
                      modal
                      editButton={true}
                      // callbackParent={callbackFromChild}
                    />
                  }
                  buttonText={
                    biAName ? biAName : impactName ? impactName[0].label : ""
                  }
                />
              )}
            </Col>

            <Col>
              <FormControl
                control={control}
                name="processName"
                formMetaData={formMetaData}
                formMethods={formMethods}
                setData={true}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="assetName"
                formMetaData={formMetaData}
                formMethods={formMethods}
                setData={true}
              />
            </Col>
            {errorMessage ? (
              <div className="text-danger p-1">{errorMessage}</div>
            ) : (
              successMessage && <div>{successMessage}</div>
            )}
          </Row>

          <Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="businessUnit"
                formMetaData={formMetaData}
                formMethods={formMethods}
                setData={true}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="biaOwner"
                formMetaData={formMetaData}
                formMethods={formMethods}
                setData={true}
              />
            </div>

            <div className="col-md-4">
              <FormControl
                control={control}
                name="biaApprover"
                formMetaData={formMetaData}
                formMethods={formMethods}
                setData={true}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="frequencyReview"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="nextReviewDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="rto"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="wrt"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="rpo"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="mtd"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="inputriskHere"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="status"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>
        <Section title="Recovery Strategy" required>
          {sectionName &&
            sectionName.map((sectionName, sectionIndex) => (
              <SubSection key={sectionIndex} title={sectionName}>
                <div
                  style={{
                    overflowX: "auto",
                    maxWidth: "100%",
                  }}
                >
                  {GroupValue &&
                    GroupValue[sectionName].map((row, rowIndex1) => {
                      rowIndex++;
                      return (
                        <Row key={row.id}>
                          <Col xs={12} md={12} lg={12}>
                            <div className="d-flex">
                              <div className="col-md-4 ">
                                <FormControl
                                  control={control}
                                  name={`RAS.${rowIndex}.raDependencies`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  autoDisplay={true}
                                  trimmedValue={true}
                                  hideTitle={rowIndex1 > 0}
                                />
                              </div>
                              {sectionName !== "Human Resource" &&
                                sectionName !== "SOP" &&
                                sectionName !== "Third Party" && (
                                  <div className="col-md-2 me-3 ">
                                    <FormControl
                                      control={control}
                                      name={`RAS.${rowIndex}.raRto`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                      hideTitle={rowIndex1 > 0}
                                    />
                                  </div>
                                )}

                              {sectionName !== "Human Resource" &&
                                sectionName !== "SOP" &&
                                sectionName !== "Third Party" && (
                                  <div className="col-md-3 me-0 ">
                                    <FormControl
                                      control={control}
                                      name={`RAS.${rowIndex}.dependencyGap`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                      hideTitle={rowIndex1 > 0}
                                    />
                                  </div>
                                )}
                              {sectionName !== "Human Resource" && (
                                <div className="col-md-2 me-3 ">
                                  <FormControl
                                    control={control}
                                    name={`RAS.${rowIndex}.purpose`}
                                    formMetaData={formMetaData}
                                    formMethods={formMethods}
                                    hideTitle={rowIndex1 > 0}
                                  />
                                </div>
                              )}
                              {sectionName === "Human Resource" && (
                                <div className="col-md-2 me-3">
                                  <FormControl
                                    control={control}
                                    name={`RAS.${rowIndex}.type`}
                                    formMetaData={formMetaData}
                                    formMethods={formMethods}
                                    hideTitle={rowIndex1 > 0}
                                  />
                                </div>
                              )}
                              {sectionName === "Human Resource" && (
                                <div className="col-md-2 me-3">
                                  <FormControl
                                    control={control}
                                    name={`RAS.${rowIndex}.resourcesDuringBau`}
                                    formMetaData={formMetaData}
                                    formMethods={formMethods}
                                    hideTitle={rowIndex1 > 0}
                                  />
                                </div>
                              )}
                              {sectionName === "Human Resource" && (
                                <div className="col-md-2 me-3">
                                  <FormControl
                                    control={control}
                                    name={`RAS.${rowIndex}.pctResourcesWfh`}
                                    formMetaData={formMetaData}
                                    formMethods={formMethods}
                                    hideTitle={rowIndex1 > 0}
                                  />
                                </div>
                              )}
                              <div className="col-md-2 me-3">
                                <FormControl
                                  control={control}
                                  name={`RAS.${rowIndex}.primaryLocation`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  hideTitle={rowIndex1 > 0}
                                />
                              </div>

                              <div className="col-md-2 me-3 ">
                                <FormControl
                                  control={control}
                                  name={`RAS.${rowIndex}.secondaryLocation`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  hideTitle={rowIndex1 > 0}
                                />
                              </div>

                              <div className="col-md-2 me-3 ">
                                <FormControl
                                  control={control}
                                  name={`RAS.${rowIndex}.primaryContact`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  hideTitle={rowIndex1 > 0}
                                />
                              </div>
                              <div className="col-md-2 me-3 ">
                                <FormControl
                                  control={control}
                                  name={`RAS.${rowIndex}.secondaryContact`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  hideTitle={rowIndex1 > 0}
                                />
                              </div>

                              <div className="col-md-2 me-3">
                                <FormControl
                                  control={control}
                                  name={`RAS.${rowIndex}.raComments`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  hideTitle={rowIndex1 > 0}
                                />
                              </div>

                              <div className="col-md-4 me-3">
                                <FormControl
                                  control={control}
                                  name={`RAS.${rowIndex}.attachment`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  hideTitle={rowIndex1 > 0}
                                />
                              </div>
                              <div className="col-md-0">
                                <FormControl
                                  control={control}
                                  name={`RAS.${rowIndex}.raId`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  hideTitle={rowIndex1 > 0}
                                />
                              </div>
                              <div className="col-md-0">
                                <FormControl
                                  control={control}
                                  name={`RAS.${rowIndex}.raObjId`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  hideTitle={rowIndex1 > 0}
                                />
                              </div>
                              <div className="col-md-0">
                                <FormControl
                                  control={control}
                                  name={`RAS.${rowIndex}.raObjType`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  hideTitle={rowIndex1 > 0}
                                />
                              </div>
                              <div className="col-md-0">
                                <FormControl
                                  control={control}
                                  name={`RAS.${rowIndex}.raDeptType`}
                                  formMetaData={formMetaData}
                                  formMethods={formMethods}
                                  hideTitle={rowIndex1 > 0}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      );
                    })}
                </div>
              </SubSection>
            ))}
        </Section>

        <Section title="Summary" required>
          <div className="mt-2">
            <Row>
              <Col>
                <FormControl
                  control={control}
                  name="riskRating"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>

              <Col>
                <FormControl
                  control={control}
                  name="recoveryStrategy"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col>
                <FormControl
                  control={control}
                  name="justification"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <FormControl
                  control={control}
                  name="responsible"
                  zIndex={true}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col>
                <FormControl
                  control={control}
                  name="raLocation"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col>
                <FormControl
                  control={control}
                  name="raAttachments"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
            </Row>
          </div>
        </Section>
        {formValues.objectId != null && (
          <Container className="justify-content-center  ">
            <AuditTrail
              formMetaData={formMetaData}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
              formMethods={formMethods}
            />
          </Container>
        )}
      </Container>
    </>
  );
};

export default FormLayout;
