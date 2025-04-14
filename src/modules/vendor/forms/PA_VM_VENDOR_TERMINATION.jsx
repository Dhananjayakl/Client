import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Table,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_VM_VENDOR_TERMINATION_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";
import { useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Grid from "src/components/forms/reactformutils/Grid";
import { useFieldArray } from "react-hook-form";
import ReportRuntime from "src/components/reports/Report";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    formState: { errors, touched, isSubmitting },
    watch,
  } = formMethods;
  formMetaData.form = JSHook(
    form,
    formMethods,
    formMetaData,
    formValues,
    control
  );

  const { fields: VTCChecklist, append: addVTCchecklist } = useFieldArray({
    name: "VTC",
    control,
  });

  console.log(formMethods, formMetaData, VTCChecklist, "uuuuuuuuuuuuuuuuuuu");

  useEffect(() => {
    if (
      formMethods.getValues("currentStage") === "INITIATE" &&
      formMethods.getValues("previousStage") !== "INITIATE"
    ) {
      formMetaData.configurationFormMetaData.VTC.map((vtc, index) => {
        addVTCchecklist(
          {
            vtcId: "",
            vtcQuestion: vtc?.vtc_termination_checklist,
            vtcDocuments: "",
            vtcComments: "",
          },
          { shouldFocus: false }
        );
      });
    }
  }, []);

  let productServiceId = useWatch({
    control: control,
    name: "productService",
  });

  return (
    <>
      <Container className="justify-content-center">
        <Section title="General Information">
          <Row>
            <Col>
              <FormControl
                control={control}
                name="vendor"
                formMetaData={formMetaData}
                formMethods={formMethods}
                others
              />
            </Col>

            <Col md={6}>
              <FormControl
                control={control}
                name="classification"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormControl
                control={control}
                name="criticality"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6}>
              <FormControl
                control={control}
                name="productService"
                formMetaData={formMetaData}
                formMethods={formMethods}
                zIndex={true}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormControl
                control={control}
                name="relationshipAssociate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6}>
              <FormControl
                control={control}
                name="relationshipManager"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>

            {/* <Col md={6}>
              <FormControl
                control={control}
                name="comments"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col> */}
          </Row>
        </Section>

        <ReportRuntime
          report="VM_PRODUCT_DETAILS_FOR_TERMINATION"
          drilldownReports={{ processId: productServiceId }}
        />

        <Section title="Termination Checklist">
          <Table className="border border-subtle-light">
            <thead>
              <tr className="table-primary m-0 p-0 fw-medium">
                <th className="fw-medium">Question</th>
                <th className="fw-medium">Documents</th>
                <th className="fw-medium">Comments</th>
              </tr>
            </thead>
            <tbody>
              {VTCChecklist.map((vtcField, index) => {
                return (
                  <tr>
                    <td md={2} lg={2} className="pb-0 mb-0">
                      <FormControl
                        control={control}
                        name={`VTC.${index}.vtcQuestion`}
                        formMethods={formMethods}
                        formMetaData={formMetaData}
                        hideTitle={true}
                        textColor={true}
                      />
                    </td>
                    <td md={5} lg={5} className="pb-0 mb-0">
                      <FormControl
                        control={control}
                        name={`VTC.${index}.vtcDocuments`}
                        formMethods={formMethods}
                        formMetaData={formMetaData}
                        hideTitle={true}
                        textColor={true}
                      />
                    </td>
                    <td md={5} lg={5} className="pb-0 mb-0">
                      <FormControl
                        control={control}
                        name={`VTC.${index}.vtcComments`}
                        formMethods={formMethods}
                        formMetaData={formMetaData}
                        hideTitle={true}
                        textColor={true}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Section>
      </Container>

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
    </>
  );
};
export default FormLayout;
