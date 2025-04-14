import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useForm, useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import JSHook from "./PM_IM_INCIDENT_JS";

import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";
import Grid from "src/components/forms/reactformutils/Grid";

import React from "react";
let FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    formState: { errors, touched, isSubmitting },
    watch,
  } = formMethods;

  formMetaData.form = JSHook(form, formMetaData, formMethods, formValues);

  let AuditFields = runtimeParams.AuditFields;
  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  React.useEffect(() => {
    if (formValues.objectId == null) {
      formMethods.setValue("status", "New");
      formMethods.setValue("currentStage", "INITIATE");
      formMethods.setValue("previousStage", " ");
    }
  }, []);

  const {
    fields: EVTFields,
    append: EVTappend,
    remove: EVTremove,
  } = useFieldArray({
    name: "EVT",
    control,
  });
  const addEVTRow = () => {
    EVTappend({
      evtId: "",
      evtEvent: "",
      evtDate: "",
    });
  };
  return (
    <>
      <Row>
        <Col>
          <Container className="justify-content-center  ">
            <Section title="General">
              <Row>
                <div className="col-md-7">
                  <FormControl
                    control={control}
                    name="title"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    others
                  />
                </div>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="category"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="status"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>

              <Row>
                <Col>
                  <FormControl
                    control={control}
                    name="financial"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Col>
                  <FormControl
                    control={control}
                    name="regulatory"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Col>
                  {" "}
                  <FormControl
                    control={control}
                    name="customer"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Col>
                  <FormControl
                    control={control}
                    name="riskRating"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row>
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="briefDescription"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>

              <Row>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="dateOfOccurrence"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="dateOfReporting"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    required={false}
                  />
                </div>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="dateofDetection"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="reportingUnit"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="occurrenceUnit"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="objectType"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="grossLoss"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="recovery"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="netLoss"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            </Section>

            <Section title="Events">
              <Grid
                formMetaData={formMetaData}
                formMethods={formMethods}
                region="EVT"
                regionTitle="Event"
                columns={["evtEvent", "evtDate"]}
                actions={{ add: true, remove: true }}
              />
            </Section>

            <Section title="RCA & Action Plan">
              <Row>
                <Col md={6}>
                  <FormControl
                    control={control}
                    name="rootCause"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
              </Row>
              <Grid
                formMetaData={formMetaData}
                formMethods={formMethods}
                region="ACT"
                columns={[
                  "actType",
                  "actTitle",
                  "ACT_OWNER",
                  "actdueDate",
                  "ACT_DESCRIPTION",
                ]}
                regionTitle="Action"
                actions={{ add: true, remove: true }}
              />
            </Section>

            <Section title="Basel Categorization">
              <Grid
                formMetaData={formMetaData}
                formMethods={formMethods}
                region="BSL"
                regionTitle="Category"
                columns={["BSL_CATEGORY", "BSL_ALLOCATION"]}
                actions={{ add: true, remove: true }}
              />
            </Section>

            <Section title="Accounting Entries">
              <Row>
                <Col md={3}>
                  <FormControl
                    control={control}
                    name="DATE_OF_ENTRY"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Col md={3}>
                  <FormControl
                    control={control}
                    name="REFERENCE_TRANSACTION_NUMBER"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Col md={3}>
                  <FormControl
                    control={control}
                    name="SERIAL_NUMBER"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
              </Row>
            </Section>
          </Container>
        </Col>
        {formValues.objectId != null && (
          <Container className="justify-content-center  ">
            <AuditTrail
              formMetaData={formMetaData}
              formMethods={formMethods}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
              // enableAddComment={formValues.status == "Closed" ? false : true}
            />
          </Container>
        )}
      </Row>
    </>
  );
};
export default FormLayout;
