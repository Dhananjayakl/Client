import {
  Form,
  Button,
  Table,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Modal,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useForm, useFieldArray } from "react-hook-form";
import JSHook from "./PA_EM_BANK_DETAILS_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import NotificationModal from "src/components/forms/reactformutils/elements/Modal";
import { useSSR } from "react-i18next";
import { useEffect, useState } from "react";
import { ExclamationTriangleFill } from "react-bootstrap-icons";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    form,
    formValues,
    callbackToParent,
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

  const { fields, rows, append, remove } = useFieldArray({
    name: "BK",
    control,
  });
  const addRow = () => {
    append({
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountType: "",
      bankId: "",
      branchAddress: "",
    });
  };
  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    callbackToParent,
    formValues,
    register,
    setValue,
    formMetaData,
    append,
    remove,
    addRow,
    runtimeParams
  );

  let disableButton = formMetaData.formmeta.accessCode === 7;

  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  const [showNoAccessModel, setShowNoAccessModel] = useState(false);

  useEffect(() => {
    if (
      formValues.objectId !== undefined &&
      !JSON.parse(
        localStorage.current_logged_User
      )[0].user_details.data[0].privilege_name.includes("HR_Accounts")
    ) {
      setShowNoAccessModel(true);
    }
  }, [formValues.objectId]);
  const handleClose = () => {
    setShowNoAccessModel(false);
  };

  return (
    <>
      <Container className="justify-content-center  ">
        <>
          {showNoAccessModel && (
            <Modal
              show={showNoAccessModel}
              onHide={handleClose}
              size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Access Denied
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div style={{ display: "flex" }}>
                  <ExclamationTriangleFill
                    className="bi flex-shrink-0 me-2"
                    width="45"
                    height="45"
                    color="red"
                  />
                  <h4>
                    Unfortunately, you don't have the necessary edit the
                    details. Please contact the Financial Department.
                  </h4>
                </div>
              </Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>
          )}
        </>
        {/* <Section title="Details"> */}

        <Row>
          <Col>
            <FormControl
              control={control}
              name="userId"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
          <Col></Col>
        </Row>

        {/* </Section> */}
        <Section title="Bank Details">
          {fields.map((row, rowIndex) => (
            <Row key={row.id}>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`BK.${rowIndex}.bankName`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`BK.${rowIndex}.accountNumber`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  onKeyDown={(e) =>
                    exceptThisSymbols.includes(e.key) && e.preventDefault()
                  }
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`BK.${rowIndex}.ifscCode`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`BK.${rowIndex}.accountType`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col xs={12} md={6} lg={3}>
                <FormControl
                  control={control}
                  name={`BK.${rowIndex}.branchAddress`}
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>

              <Col className="mt-7">
                {fields.length > 1 && (
                  <div class="text-right">
                    <Button
                      type="button"
                      variant="warning"
                      className="float-end"
                      onClick={() => remove(rowIndex)}
                      hidden={disableButton}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </Col>

              <hr style={{ backgroundColor: "#333", height: "3px" }} />
            </Row>
          ))}
          {/* Button to add a new row */}
          <Row>
            <Button type="button" onClick={addRow} hidden={disableButton}>
              + Add Bank Details
            </Button>
          </Row>
        </Section>
        {/* <Section title="Comments"> */}
        <Row>
          <FormControl
            control={control}
            name="bankAttachments"
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

        {/* </Section> */}
      </Container>
      {formValues.objectId != null && (
        <Container className="justify-content-center  ">
          <Section title="Comments and Change History">
            <AuditTrail
              formMetaData={formMetaData}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
            />
          </Section>
        </Container>
      )}
    </>
  );
};
export default FormLayout;
