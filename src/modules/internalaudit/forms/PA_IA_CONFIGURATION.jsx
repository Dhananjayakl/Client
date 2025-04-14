import React from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useFieldArray, useWatch } from "react-hook-form";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import { useTranslation } from "react-i18next";
let FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues, runtimeParams } = props;

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
  const { t } = useTranslation("common");
  const accessCode = formMetaData?.formmeta?.accessCode;
  const {
    fields: MSTFields,
    append: MSTappend,
    remove: MSTremove,
  } = useFieldArray({
    name: "MST",
    control,
  });
  const addMstRow = () => {
    MSTappend({
      mstId: "",
      mstName: "",
      mstTimeline: "",
      mstOrder: "",
    });
  };

  return (
    <>
      <Container className="justify-content-center">
        <Section title="General">
          <Row>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="reviewPlan"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="FISCAL_YEAR_STARTS_FROM"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                control={control}
                name="auditBU"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>
        <Section title="Milestones">
          <div
            style={{
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            {MSTFields.map((row, rowIndex) => (
              <Row key={row.id}>
                <Col xs={12} md={12} lg={12}>
                  <div>
                    <div
                      className="d-flex"
                      // style={{
                      //   minWidth: "max-content",
                      // }}
                    >
                      <div className="col-md-2 me-1">
                        <FormControl
                          control={control}
                          name={`MST.${rowIndex}.mstName`}
                          formMetaData={formMetaData}
                          zIndex={true}
                          dropDownFlag={true}
                          // dropDown={opt}
                          formMethods={formMethods}
                          hideTitle={rowIndex > 0 ? true : false}
                        />
                      </div>
                      <div className="col-md-2 me-1">
                        <FormControl
                          control={control}
                          name={`MST.${rowIndex}.mstTimeline`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          hideTitle={rowIndex > 0 ? true : false}
                        />
                      </div>
                      <div className="col-md-2 me-1">
                        <FormControl
                          control={control}
                          name={`MST.${rowIndex}.mstOrder`}
                          formMetaData={formMetaData}
                          zIndex={true}
                          formMethods={formMethods}
                          hideTitle={rowIndex > 0 ? true : false}
                        />
                      </div>
                      {MSTFields.length > 1 && (
                        <div
                          className={
                            rowIndex == "0" ? " col-md mt-4" : " col-md mt-0"
                          }
                        >
                          {accessCode === 1 && (
                            <Button
                              type="button"
                              variant="warning"
                              className="float-end"
                              onClick={() => MSTremove(rowIndex)}
                            >
                              {t("Remove")}
                            </Button>
                          )}
                        </div>
                      )}
                      {/* <hr style={{ backgroundColor: "#333", height: "3px" }} /> */}
                    </div>
                  </div>
                </Col>
              </Row>
            ))}
          </div>
          <Row>
            {accessCode === 1 && (
              <Button
                type="button"
                onClick={addMstRow}
                // hidden={accessCode === 7 || stageFlag}
              >
                + {t("Add Milestones")}
              </Button>
            )}
          </Row>
        </Section>
        {formMethods.getValues("objectId") != "" && (
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
            // enableAddComment={formValues.status == "Closed" ? false : true}
          />
        )}
      </Container>
    </>
  );
};

export default FormLayout;
