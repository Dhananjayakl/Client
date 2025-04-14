import { Button, Card, Container, Row, Col, Table } from "react-bootstrap";
import { useFieldArray, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import Grid from "src/components/forms/reactformutils/Grid";
import JSHook from "./PA_ZA_VENDOR_BOARDING_JS";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faKey,
  faList,
  faShieldHalved,
  faTrashAlt,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

let FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues } = props;
  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touched, isSubmitting, isDirty },
  } = formMethods;

  formMetaData.form = JSHook(
    form,
    control,
    formMetaData,
    formMethods,
    formValues
  );

  const {
    fields: attachments,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "ATH",
  });
  console.log("current stage");
  const showColumn =
    formMethods?.getValues("currentStage") === "INITIATE" ||
    formMethods?.getValues("currentStage") === "RISK_HOD_REVIEW" ||
    formMethods?.getValues("currentStage") === "CLOSE";

  // const multiRegionCustomization = (rowIndex, row) => {
  //   console.log(
  //     rowIndex,
  //     row,
  //     formMethods.getValues(`ATH.${rowIndex}.athClarification`),
  //     "multi region customization"
  //   );
  //   if (
  //     formMethods.getValues(`ATH.${rowIndex}.athClarification`) &&
  //     !formMethods.getValues(`ATH.${rowIndex}.athRiskReviewComments`)
  //   ) {
  //     formMetaData.fields["ATH." + row + ".athRiskReviewComments"] = {};
  //     formMetaData.fields[
  //       "ATH." + rowIndex + ".athRiskReviewComments"
  //     ].required = true;
  //   }
  // };

  console.log(formMetaData, "vendor meta");
  return (
    <>
      <Container>
        <Section title="Vendor Details">
          <Row>
            <Col className="col-md-6">
              <FormControl
                control={control}
                name="vendorName"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col className="col-md-6">
              <FormControl
                control={control}
                name="service"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col className="col-md-6">
              <FormControl
                control={control}
                name="details"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col className="col-md-6">
              <FormControl
                control={control}
                name="businessUnit"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>

        <Section title="Attachments">
          <Row className="p-0 m-0 mb-1">
            <Button
              onClick={() =>
                append({
                  athId: "",
                  athCategory: "",
                  athBusinessComments: "",
                  athRiskRevieComments: "",
                  athClarification: "",
                })
              }
            >
              <FontAwesomeIcon icon={faPlusCircle} size="lg" /> Attachment
            </Button>
          </Row>
          <Table responsive>
            <thead>
              <tr className="table-secondary text-left fw-medium p-0 m-0">
                <th className="fw-medium  py-1">
                  <span className="me-1">
                    <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                  </span>

                  <span>Category</span>
                </th>
                <th className="fw-medium py-1">Attachment</th>
                <th className="fw-medium py-1">Business Comments</th>
                {!showColumn && (
                  <>
                    <th className="fw-medium py-1">Risk Review Comments</th>
                    <th className="fw-medium py-1">Clarification</th>
                  </>
                )}
              </tr>
            </thead>

            {attachments.map((attachement, index) => (
              <>
                <tbody className="p-0 m-0">
                  <tr key={attachement.id} className="p-0 m-0">
                    <td className="">
                      <div className="d-flex">
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          color="#FF0000"
                          onClick={() => remove(index)}
                          style={{ cursor: "pointer" }}
                          size="lg"
                          className="me-2"
                        />
                        <FormControl
                          control={control}
                          name={`ATH.${index}.athCategory`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          hideTitle={true}
                        />
                      </div>
                    </td>
                    <td>
                      <FormControl
                        control={control}
                        name={`ATH.${index}.athAttachment`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        hideTitle={true}
                      />
                    </td>
                    <td>
                      <FormControl
                        control={control}
                        name={`ATH.${index}.athBusinessComments`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        hideTitle={true}
                      />
                    </td>
                    {!showColumn && (
                      <>
                        <td>
                          <FormControl
                            control={control}
                            name={`ATH.${index}.athRiskReviewComments`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={true}
                            required={
                              formMethods.getValues(
                                `ATH.${index}.athClarification`
                              )
                                ? true
                                : false
                            }
                          />
                        </td>
                        <td>
                          <FormControl
                            control={control}
                            name={`ATH.${index}.athClarification`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            hideTitle={true}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                </tbody>
              </>
            ))}
          </Table>
        </Section>
        {/* temporarily commented due to unable to do customization of multi-region fields  */}
        {/* <Section title="Attachments">
          <Grid
            formMetaData={formMetaData}
            formMethods={formMethods}
            region="ATH"
            regionTitle="Attachment"
            columns={[
              "athCategory",
              "athAttachment",
              "athBusinessComments",
              !showColumn && "athRiskReviewComments",
              !showColumn && "athClarification",
            ].filter(Boolean)}
            multiRegionCustomization={multiRegionCustomization}
            actions={{ add: true, remove: true }}
          />
        </Section> */}
        {formValues.objectId != null && (
          <Container className="justify-content-center">
            <AuditTrail
              formMetaData={formMetaData}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
            />
          </Container>
        )}
      </Container>
    </>
  );
};
export default FormLayout;
