import { Button, Card, Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useFieldArray } from "react-hook-form";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import JSHook from "./PA_VM_PRODUCT_SERVICE_JS";
import ReportRuntime from "src/components/reports/Report";
import { useState, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import Grid from "src/components/forms/reactformutils/Grid";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import Relationship from "src/components/forms/reactformutils/elements/Relationship";
import { Modal } from "react-bootstrap";
import VendorModalForm from "../pages/VendorModalForms";
import { useTranslation } from "react-i18next";
const FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues } = props;
  const {
    control,
    getValues,
    formState: {},
  } = formMethods;
  const { t } = useTranslation("common");
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productServiceData, setproductServiceData] = useState({});
  const closeModal1 = () => setIsModalOpen(false);

  const configurationData = formMetaData.configurationFormMetaData;
  console.log(
    configurationData.inherit_risk_questionnaire,
    configurationData.preliminary_evaluation_checklist,
    "formmetadata fields"
  );

  console.log(selectedVendors, "cfgjhbknl");

  const {
    fields: QSTFields,
    append: QSTappend,
    remove: QSTremove,
  } = useFieldArray({
    name: "QST",
    control,
  });

  const {
    fields: SECFields,
    append: SECappend,
    remove: SECremove,
  } = useFieldArray({
    name: "SEC",
    control,
  });

  const {
    fields: OPTFields,
    append: OPTappend,
    remove: OPTremove,
  } = useFieldArray({
    name: "OPT",
    control,
  });

  const VendorDocHelpers = useFieldArray({
    name: "DOC",
    control,
  });

  const VendorActHelpers = useFieldArray({
    name: "ACT",
    control,
  });

  const {
    fields: VDDFields,
    append: VDDappend,
    remove: VDDremove,
  } = useFieldArray({
    name: "VDD",
    control,
  });

  formMetaData.form = JSHook(
    form,
    formMethods,
    formMetaData,
    formValues,
    QSTappend,
    VDDappend,
    VDDremove,
    VDDFields,
    control,
    setSelectedVendors,
    VendorDocHelpers,
    VendorActHelpers,
    QSTFields,
    setIsModalOpen
  );

  useEffect(() => {
    if (formValues.objectId == null) {
      formMethods.setValue("status", "New");
      formMethods.setValue("currentStage", "INITIATE");
      formMethods.setValue("previousStage", " ");
    }
  }, []);

  let hideSection = false;
  let buttonHide = false;
  let dueDiligence = false;

  if (
    formMethods.getValues("objectId") != "" &&
    formMethods.getValues("currentStage") != "INITIATE" &&
    formMethods.getValues("currentStage") != "EVALUATION" &&
    formMethods.getValues("currentStage") != "ASSESSMENT" &&
    formMethods.getValues("currentStage") != "SUBMIT_CLARIFICATION"
  ) {
    hideSection = true;
  }

  if (
    formMethods.getValues("currentStage") === "EVALUATION" ||
    formMethods.getValues("currentStage") === "ASSESSMENT" ||
    formMethods.getValues("currentStage") === "RISK_ASSESSMENT" ||
    formMethods.getValues("currentStage") === "DUE_DILIGENCE" ||
    formMethods.getValues("currentStage") === "ONBOARDING"
  ) {
    buttonHide = true;
  }
  if (
    // formMethods.getValues("currentStage") === "RISK_ASSESSMENT" ||
    formMethods.getValues("currentStage") === "DUE_DILIGENCE" ||
    formMethods.getValues("currentStage") === "ONBOARDING" ||
    formMethods.getValues("currentStage") === "CLOSE" ||
    formMethods.getValues("currentStage") === "REJECT"
  ) {
    dueDiligence = true;
  }

  const renderDDAReport =
    formMethods.getValues("currentStage") === "DUE_DILIGENCE" ||
    formMethods.getValues("currentStage") === "ONBOARDING" ||
    formMethods.getValues("currentStage") === "CLOSE";

  let riskColor;
  switch (formValues.inheritRiskRating) {
    case 1:
      riskColor = "Green";
      break;
    case 2:
      riskColor = "#ffde21";
      break;
    case 3:
      riskColor = "Red";
      break;
    default:
      riskColor = "#ffde21";
  }

  let preliminaryColor;
  switch (formValues.preliminaryRating) {
    case 1:
      preliminaryColor = "Green";
      break;
    case 2:
      preliminaryColor = "#ffde21";
      break;
    case 3:
      preliminaryColor = "Red";
      break;
    default:
      preliminaryColor = "#ffde21";
  }
  const schStartDate = useWatch({
    control: control,
    name: "serviceStartDate",
  });

  return (
    <>
      <Container className="">
        <Section title="General" required>
          {/* <Row>
            <Col md={6}>
              <FormControl
                control={control}
                name="contract"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6}>
              <FormControl
                control={control}
                name="ContractNo"
                formMetaData={formMetaData}
                formMethods={formMethods}
                data={latestContractNo}
              />
            </Col>
          </Row> */}
          <Row>
            <Col md={6}>
              <FormControl
                control={control}
                name="productService"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>

            <Col md={2} className="mt-4">
              <FormControl
                control={control}
                name="materialImpact"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={4}>
              <FormControl
                control={control}
                name="criticality"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <FormControl
                control={control}
                name="details"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={4} className="">
              <div>
                <FormControl
                  control={control}
                  name="category"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="">
                <FormControl
                  control={control}
                  name="purchasingBusinessUnit"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col
              md={
                formMethods.getValues("objectId") === "" ||
                formMethods.getValues("currentStage") === "ASSESSMENT"
                  ? 6
                  : 3
              }
            >
              <FormControl
                control={control}
                name="estimatedCost"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col
              md={
                formMethods.getValues("objectId") === "" ||
                formMethods.getValues("currentStage") === "ASSESSMENT"
                  ? 6
                  : 3
              }
            >
              <FormControl
                control={control}
                name="expectedClosureDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
                futureDate={true}
              />
            </Col>

            {/* <Col md={4}>
              <FormControl
                control={control}
                name="recommendedThirdParty"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col> */}
            {formValues.currentStage === ""}
            <Col md={3}>
              <FormControl
                control={control}
                name="serviceStartDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
                futureDate={true}
              />
            </Col>
            <Col md={3}>
              <FormControl
                control={control}
                name="serviceEndDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
                futureDate={true}
                futureDateValue={new Date(schStartDate).setDate(
                  new Date(schStartDate).getDate() + 1
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FormControl
                control={control}
                name="relationshipManager"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="relationshipAssociate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>
        {(!formMethods.getValues("currentStage") ||
          formMethods.getValues("preliminaryRequired")) && (
          <Section title="Preliminary Info" required>
            <VendorModalForm
              buttonText={t("Preliminary")}
              objectId={configurationData.preliminary_evaluation_checklist}
              control={control}
              formMetaData={formMetaData}
              formMethods={formMethods}
              formValues={formValues}
              modalTitle={"Preliminary Evaluation"}
              SECFields={SECFields}
              SECappend={SECappend}
              QSTFields={QSTFields}
              QSTappend={QSTappend}
              OPTFields={OPTFields}
              OPTappend={OPTappend}
            />

            <Modal show={isModalOpen} onHide={closeModal1} centered>
              <Modal.Header closeButton>
                <Modal.Title>
                  <h3 className="font-weight-bold text-primary">
                    Following Fields are Mandatory
                  </h3>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
                Please perform the Preliminary Assessment
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal1}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            {/* <Row>
              {QSTFields.map((qsItem, qs) => {
                let QSTRecord = `QST.${qs}`;
                return (
                  <Row key={qsItem.id}>
                    <Col lg={9} md={9} sm={12}>
                      <FormControl
                        control={control}
                        name={`${QSTRecord}.questionText`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        textColor={true}
                        hideTitle={true}
                      />
                    </Col>
                    <Col lg={3} md={3} sm={12}>
                      <FormControl
                        control={control}
                        name={`${QSTRecord}.response`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        hideTitle={true}
                      />
                    </Col>
                  </Row>
                );
              })}
            </Row> */}
            <hr></hr>
            <Row>
              <Col>
                <FormControl
                  control={control}
                  name="preliminaryScore"
                  title="Score"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                  labelSize={4}
                />
              </Col>
              <Col>
                <FormControl
                  control={control}
                  name="preliminaryRating"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                  labelSize={4}
                  textColor={preliminaryColor}
                />
              </Col>
            </Row>
          </Section>
        )}
        <Section title="Business Contacts">
          <Grid
            formMetaData={formMetaData}
            formMethods={formMethods}
            region="CNT"
            columns={[
              "cntName",
              "cntDesignation",
              "cntBusinessNumber",
              "cntEmail",
            ]}
            actions={{
              add: ["INITIATE", "SUBMIT_CLARIFICATION"].includes(
                formMethods.getValues("currentStage")
              ),
              remove: ["INITIATE", "SUBMIT_CLARIFICATION"].includes(
                formMethods.getValues("currentStage")
              ),
            }}
          />
        </Section>
        {hideSection === true && (
          <Section title="Risk Assessment">
            <Row>
              {/* <Col lg={6} md={6} sm={12}>
                <FormControl
                  control={control}
                  name="inheritRiskScore"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col> */}
              <Col lg={6} md={6} sm={12}>
                <FormControl
                  control={control}
                  name="inheritRiskRating"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  required={true}
                  singleRow
                  textColor={riskColor}
                />
              </Col>
            </Row>
            <Row>
              <ReportRuntime
                report="SM_IRQ_RESPONSE"
                drilldownReports={{
                  objectId: formMethods.getValues("objectId"),
                }}
              />
            </Row>
          </Section>
        )}
        {
          <Section title="Vendor/Third Party">
            <Row className="d-flex justify-content-center align-items-center">
              <Col lg={10} md={9} sm={12}>
                <FormControl
                  control={control}
                  name="vendors"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  zIndex={true}
                />
              </Col>
              {!dueDiligence && (
                <Col lg={2} md={3} sm={12} className="mt-3">
                  {formMetaData.formmeta.accessCode === 1 && (
                    <ModalForm
                      objectId={-1}
                      component={
                        <FormRunTime
                          formService={"thirdparty"}
                          objectId={-1}
                          evaluation={true}
                          modal
                        />
                      }
                      buttonText={t("+ Add Vendors")}
                      variant="btn btn-outline-secondary"
                    />
                  )}
                </Col>
              )}
            </Row>
            <hr />

            <Row className="mb-2">
              {VDDFields.map((vddItem, vdd) => {
                let VDDRecord = `VDD.${vdd}`;
                console.log(
                  VDDRecord,
                  VDDRecord.vddVendorName,
                  VDDFields,
                  "records to display related to vendor"
                );

                return (
                  <Row key={vddItem.vvdVendorId}>
                    <Collapse
                      key={`${VDDRecord}`}
                      title={`${VDDRecord}.vddVendorName`}
                      secondaryTitle={
                        <FormControl
                          control={control}
                          name={`${VDDRecord}.dueDiligence`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          disabled
                          singleRow
                          hideTitle
                          textColor={"white"}
                        />
                      }
                      className="bg-nblue text-white bg-gradient"
                      control={control}
                      watchFor={[
                        `${VDDRecord}.vddVendorName`,
                        `${VDDRecord}.dueDiligence`,
                      ]}
                      formMethods={formMethods}
                      bgcolor={
                        getValues(`${VDDRecord}.dueDiligence`) == "1"
                          ? "bg-success"
                          : getValues(`${VDDRecord}.dueDiligence`) == "2"
                          ? "bg-danger"
                          : ""
                      }
                      state={
                        getValues(`${VDDRecord}.vddVendorName`) ? false : true
                      }
                    >
                      <Row key={vddItem.id} className="mb-2">
                        <>
                          <Row className="mb-2">
                            <Col lg={4} md={6} sm={12}>
                              <FormControl
                                control={control}
                                name={`${VDDRecord}.dueDiligence`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                              />
                            </Col>

                            <Col lg={4} md={6} sm={12}>
                              <FormControl
                                control={control}
                                name={`${VDDRecord}.vvdRating`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                              />
                            </Col>
                            <Col lg={4} md={6} sm={12}>
                              <FormControl
                                control={control}
                                name={`${VDDRecord}.vddRecommendQualification`}
                                formMetaData={formMetaData}
                                formMethods={formMethods}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Card>
                              <Card.Body>
                                {Array.isArray(selectedVendors) &&
                                selectedVendors
                                  .filter(Boolean)
                                  .some(
                                    (vendor) =>
                                      vendor?.selected_vendor ===
                                      formMethods.getValues(
                                        `${VDDRecord}.vvdVendorId`
                                      )
                                  ) ? (
                                  selectedVendors
                                    .filter(
                                      (vendor, index, self) =>
                                        vendor?.selected_vendor ===
                                          formMethods.getValues(
                                            `${VDDRecord}.vvdVendorId`
                                          ) &&
                                        index ===
                                          self.findIndex(
                                            (v) =>
                                              v?.selected_vendor ===
                                              formMethods.getValues(
                                                `${VDDRecord}.vvdVendorId`
                                              )
                                          ) // Prevent duplicates
                                    )
                                    .map((vendor) => (
                                      <div
                                        key={
                                          vendor?.id || vendor?.selected_vendor
                                        }
                                        className="mb-4"
                                      >
                                        <Row className="mb-2">
                                          <Col>
                                            <p className="mb-1">
                                              <span className="fw-semibold">
                                                Category:
                                              </span>{" "}
                                              {vendor?.d_category || "N/A"}
                                            </p>
                                            <p className="mb-1">
                                              <span className="fw-semibold">
                                                Product Service:
                                              </span>{" "}
                                              {vendor?.product_service || "N/A"}
                                            </p>
                                          </Col>
                                          <Col>
                                            <p className="mb-1">
                                              <span className="fw-semibold">
                                                Criticality:
                                              </span>{" "}
                                              {vendor?.d_criticality || "N/A"}
                                            </p>
                                            <p className="mb-1">
                                              <span className="fw-semibold">
                                                Status:
                                              </span>{" "}
                                              {vendor?.status || "N/A"}
                                            </p>
                                          </Col>
                                        </Row>
                                      </div>
                                    ))
                                ) : (
                                  <div>
                                    <h5>
                                      Vendor is new, no previous data available.
                                    </h5>
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                          </Row>

                          <Row>
                            {/* <Grid
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              region="VDA"
                              //  key="CNT_ID"
                              // helpers={CNTHelpers}
                              //"cntBusinessNo",
                              columns={[
                                // "vdaVendor",
                                { name: "vdaComments", length: 4 },
                                { name: "vdaCategory", length: 4 },
                                { name: "vdaDocuments", length: 4 },
                              ]}
                              actions={{ add: true, remove: true }}
                            /> */}
                          </Row>
                          <Row className="my-2">
                            <Grid
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              region="DOC"
                              helpers={VendorDocHelpers}
                              columns={[
                                { name: "docCategory", length: 4 },
                                { name: "docDocuments", length: 4 },
                                { name: "docDate", length: 4 },
                              ]}
                              parentFilter={{
                                fkColumn: "docVendor",
                                value: getValues(`${VDDRecord}.vvdVendorId`),
                              }}
                              actions={{ add: true, remove: true }}
                              formValues={formValues}
                              futureDate={true}
                            />
                          </Row>
                          <Row className="my-2">
                            <Grid
                              formMetaData={formMetaData}
                              formMethods={formMethods}
                              region="ACT"
                              helpers={VendorActHelpers}
                              columns={[
                                { name: "actActivity", length: 5 },
                                { name: "actActivityDate", length: 5 },
                              ]}
                              parentFilter={{
                                fkColumn: "actVendor",
                                value: formMethods.getValues(
                                  `${VDDRecord}.vvdVendorId`
                                ),
                              }}
                              actions={{ add: true, remove: true }}
                              formValues={formValues}
                              // disableOnNextStage={true}
                              futureDate={true}
                            />
                          </Row>

                          {renderDDAReport && (
                            <Row className="mt-2">
                              <ReportRuntime
                                report="SM_DUE_DILIGENCE_RESPONSE"
                                drilldownReports={{
                                  vendors: formMethods.getValues(
                                    `${VDDRecord}.vvdVendorId`
                                  ),
                                  objectId: formMethods.getValues("objectId"),
                                }}
                              />
                            </Row>
                          )}
                        </>
                      </Row>
                    </Collapse>
                  </Row>
                );
              })}
            </Row>
          </Section>
        }

        {formMethods.getValues("objectId") != "" && (
          <Relationship
            formMetaData={formMetaData}
            hidden={formMetaData.formmeta.accessCode != 1}
            formMethods={formMethods}
            formId={formMetaData?.formmeta.form_id}
            objectId={formValues?.objectId}
            sourceName="VM_PRODUCT_SERVICE"
            formValues={formValues}
            secondaryObjectId={formValues.fndId == null ? 0 : formValues.fndId}
          />
        )}

        {(formValues.currentStage == "ONBOARDING" ||
          formValues.currentStage == "CLOSE") && (
          <Section title="Qualification">
            <Row>
              <Col md={8}>
                <FormControl
                  control={control}
                  name="selectedVendor"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
              >
                <FormControl
                  control={control}
                  name="periodicDueDiligence"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              {/* <Col>
                <FormControl
                  control={control}
                  name="inheritRiskRating"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col>
                <FormControl
                  control={control}
                  name="controlEffectivenessRating"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />{" "}
              </Col>
              <Col>
                <FormControl
                  control={control}
                  name="residualRating"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col> */}
            </Row>

            <Row>
              <Col md={4}>
                <FormControl
                  control={control}
                  name="frequency"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  watchFor="periodicDueDiligence"
                />
              </Col>
              <Col md={4}>
                <FormControl
                  control={control}
                  name="startDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate
                  watchFor="periodicDueDiligence"
                />
              </Col>
              <Col md={4}>
                <FormControl
                  control={control}
                  name="dueByDays"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  watchFor="periodicDueDiligence"
                />
              </Col>
            </Row>
          </Section>
        )}
        <Section title="Attachments">
          <Row>
            <FormControl
              control={control}
              name="attachments"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
        </Section>

        {formValues.objectId != null && (
          <Container className="justify-content-center">
            <AuditTrail
              formMetaData={formMetaData}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
              formMethods={formMethods}
              // enableChangeHistory={
              //   formValues.currentStage == "CLOSE" ? true : false
              // }
              // enableAddComment={formValues.status == "Closed" ? false : true}
            />
          </Container>
        )}
      </Container>
    </>
  );
};

export default FormLayout;
