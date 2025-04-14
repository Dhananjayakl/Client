import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_STANDARD_OPERATING_PROCEDURES_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";
import Confirmation from "src/components/forms/reactformutils/elements/Confirmation";

const FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    formValues,
    fields,
    runtimeParams,
  } = props;
  const {
    control,
    formState: {},
    watch,
  } = formMethods;

  const updatevalue = (value) => {
    setArchiveValue(value);
  };

  const [archiveValue, setArchiveValue] = useState(false);

  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formValues,
    formMetaData,
    updatevalue
  );

  const [showModal, setShowModal] = useState(false);
  const processReview = formMetaData.configurationFormMetaData.process_review;

  useEffect(() => {
    const archiveValue = formMethods.getValues("archive");
    if (archiveValue === false) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [formMethods.getValues("archive")]);
  const handleAlertClose = () => {
    setShowModal(false);
  };
  return (
    <>
      <Row>
        <Col>
          <Container className="justify-content-center  ">
            <Section title="General">
              <Row>
                <div className="col-md-8">
                  <FormControl
                    control={control}
                    name="name"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    others
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
                <div className="col-md-2">
                  <Col>
                    <FormControl
                      control={control}
                      name="active"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </Col>
                </div>
              </Row>
              <Row>
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="procedures"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>

              <Row>
                <div className="col-md-4">
                  <FormControl
                    control={control}
                    name="type"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            </Section>
            <Section title="Ownership and Review">
              <Row>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="businessUnits"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="owners"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                {processReview === true && (
                  <>
                    <div className="col-md-3">
                      <FormControl
                        control={control}
                        name="reviewCycle"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </div>
                    <div className="col-md-3">
                      <FormControl
                        control={control}
                        type="flatpick"
                        name="nextReviewDate"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        watchFor="reviewCycle"
                        futureDate={true}
                      />
                    </div>
                  </>
                )}
              </Row>
            </Section>

            <Section title="Additional Details">
              <div>
                <FormControl
                  control={control}
                  name="attachFiles"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
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
              enableAddComment={formValues.status == "Closed" ? false : true}
            />
          </Container>
        )}

        {archiveValue === false && (
          <Confirmation
            show={showModal}
            content={`Would Like to Archive the SOP "${formMethods.getValues(
              "name"
            )}" Effective From "${formMethods.getValues("endDate")}"`}
            onHide={handleAlertClose}
          />
        )}
      </Row>
    </>
  );
};
export default FormLayout;
