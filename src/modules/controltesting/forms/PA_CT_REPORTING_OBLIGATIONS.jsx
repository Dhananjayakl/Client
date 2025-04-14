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
import JSHook from "./PA_CT_REPORTING_OBLIGATIONS_JS";
import { useState } from "react";
import Section from "src/components/forms/reactformutils/fields/Section";
import { useFieldArray, useWatch } from "react-hook-form";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation("common");
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

  const [deletedSectionKey, setDeletedSectionKey] = useState(0);
  const isEditable = formMetaData.formmeta.accessCode !== 7;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal1 = () => setIsModalOpen(false);

  const deleteSectionforFND = (index) => {
    setDeletedSectionKey(deletedSectionKey + 1);
    FNDremove(index);
  };
  let AuditFields = runtimeParams.AuditFields;
  const [alert, setAlert] = useState("");
  const [showModal, setShowModal] = useState(false);
  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formValues,
    formMetaData,
    runtimeParams,
    setAlert,
    setShowModal,
    control,
    setIsModalOpen
  );

  const schStartDate = useWatch({
    control: control,
    name: "startDate",
  });
  const startDate = useWatch({
    control: control,
    name: "start",
  });

  const frequency = formMethods.getValues("frequency");
  return (
    <>
      <div>
        <Container className="justify-content-center  ">
          <Section title={t("General Information")}>
            <Row>
              <div className="col-md-12">
                <FormControl
                  control={control}
                  name="deliverable"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  others
                />
              </div>
            </Row>
            <Row>
              <div className="col-md-8">
                <FormControl
                  control={control}
                  name="reportingObligation"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>

              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="category"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />

                <FormControl
                  control={control}
                  name="complianceStatus"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>

            <Row>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="start"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  type="flatpick"
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="end"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate
                  futureDateValue={new Date(startDate).setDate(
                    new Date(startDate).getDate()
                  )}
                  type="flatpick"
                />
              </div>
            </Row>

            <Row>
              <div className="col-md-8">
                <FormControl
                  control={control}
                  name="reference"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>

              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="source"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          </Section>

          <Section title={t("Schedule")}>
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
                <Modal show={isModalOpen} onHide={closeModal1} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>
                      <h3 className="font-weight-bold text-primary">
                        {t("Following Fields are Mandatory")}
                      </h3>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {t("Start date cannot be after the end date")}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal1}>
                      {t("Close")}
                    </Button>
                  </Modal.Footer>
                </Modal>
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

                <Modal show={isModalOpen} onHide={closeModal1} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>
                      <h3 className="font-weight-bold text-primary">
                        {t("Following Fields are Mandatory")}
                      </h3>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {t("Start date cannot be after the end date")}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal1}>
                      {t("Close")}
                    </Button>
                  </Modal.Footer>
                </Modal>

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
          </Section>
          <Section title={t("Ownership and Respondent")}>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="businessUnits"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="owners"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                  zIndex={true}
                />
              </div>
            </Row>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="responsibleBusinessUnit"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                  zIndex={true}
                />
              </div>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="reportOwners"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                  zIndex={true}
                />
              </div>
            </Row>
          </Section>

          <Section title={t("Addtional Details")}>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="attachment"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Section>
          {formValues.objectId != null && (
            <Container className="justify-content-center  ">
              <AuditTrail
                formMetaData={formMetaData}
                formMethods={formMethods}
                formId={formMetaData.formmeta.form_id}
                objectId={formValues.objectId}
                enableAddComment={formValues.status == "Closed" ? false : true}
              />
            </Container>
          )}
        </Container>
      </div>
    </>
  );
};

export default FormLayout;
