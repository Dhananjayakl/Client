import { Button, Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useFieldArray } from "react-hook-form";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import React from "react";
import JSHook from "./PA_BR_BIA_CONFIGURATION_SETUP_JS";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
const FormLayout = (props) => {
  const { formMethods, formMetaData, form, formValues } = props;
  const {
    control,
    formState: {},
  } = formMethods;

  const {
    fields: QSTFields,
    append: QSTappend,
    remove: QSTremove,
  } = useFieldArray({
    name: "QST",
    control,
  });

  const {
    fields: IMPFields,
    append: IMPappend,
    remove: IMPremove,
  } = useFieldArray({
    name: "IMP",
    control,
  });

  formMetaData.form = JSHook(form, formMethods, control);

  let accessCode = formMetaData.formmeta.accessCode;
  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  return (
    <>
      <div>
        <Container className="justify-content-center ">
          <Row className="mt-2 mb-4">
            <Col>
              <FormControl
                control={control}
                name="revEnabled"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="rasReviEnabled"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Section title=" Asset / Process Assessment" required>
            <Row className="mb-2 px-2">
              <Button
                onClick={() =>
                  QSTappend({
                    qstName: "",
                    tstResponse: "",
                    qstId: "",
                    qstActive: "",
                  })
                }
                hidden={accessCode === 7}
              >
                + Add Questions
              </Button>
            </Row>
            {QSTFields.map((qsItem, qs) => {
              let QSTRecord = `QST.${qs}`;

              return (
                <React.Fragment key={qsItem.id}>
                  <Row>
                    <div className="col-md-9">
                      <FormControl
                        control={control}
                        name={`${QSTRecord}.qstName`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        hideTitle={qs > 0}
                      />
                    </div>

                    <div
                      className={
                        QSTRecord == "QST.0" ? " col-md mt-4" : " col-md mt-0"
                      }
                    >
                      <FormControl
                        control={control}
                        name={`${QSTRecord}.qstActive`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </div>
                    {QSTFields.length > 1 && QSTFields[qs].qstId == "" && (
                      <div
                        className={
                          QSTRecord == "QST.0" ? " col-md mt-4" : " col-md mt-0"
                        }
                      >
                        {/* <Button
                          type="button"
                          variant="warning"
                          className="float-end "
                          onClick={() => QSTremove(qs)}
                        >
                          Remove
                        </Button> */}
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          color="#FF0000"
                          onClick={() => QSTremove(qs)}
                          style={{ cursor: "pointer" }}
                          size="2x"
                        />
                      </div>
                    )}
                  </Row>
                </React.Fragment>
              );
            })}
          </Section>

          <Section title="Impact Assessment Factors and Durations" required>
            <SubSection title={"Factors"}>
              <Row className="mb-2 px-2">
                <Button
                  onClick={() =>
                    IMPappend({
                      impid: "",
                      impFactors: "",
                      selectPicklist: "",
                    })
                  }
                  hidden={accessCode === 7}
                >
                  + Add Impact Factors
                </Button>
              </Row>
              {IMPFields.map((ifItem, ia) => {
                let IMPRecord = `IMP.${ia}`;

                return (
                  <React.Fragment key={ifItem.id}>
                    <Row key={ifItem.id}>
                      <div className="col-md-5">
                        <FormControl
                          control={control}
                          name={`${IMPRecord}.impFactors`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          hideTitle={ia > 0}
                        />
                      </div>
                      <div className="col-md-5">
                        <FormControl
                          control={control}
                          name={`${IMPRecord}.selectPicklist`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          hideTitle={ia > 0}
                        />
                      </div>

                      {IMPFields.length > 1 && (
                        <div
                          className={
                            IMPRecord == "IMP.0"
                              ? " col-md mt-4"
                              : " col-md mt-0"
                          }
                        >
                          {/* <Button
                            type="button"
                            variant="warning"
                            className="float-end"
                            onClick={() => IMPremove(ia)}
                            hidden={accessCode === 7}
                          >
                            Remove
                          </Button> */}
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            color="#FF0000"
                            onClick={() => IMPremove(ia)}
                            style={{ cursor: "pointer" }}
                            size="2x"
                            hidden={accessCode === 7}
                          />
                        </div>
                      )}
                    </Row>
                  </React.Fragment>
                );
              })}
            </SubSection>
            <SubSection title={"Durations (Maximum 10)"} required>
              <Row>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto1"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto2"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto3"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto4"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto5"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto6"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
              <Row></Row>
              <Row></Row>
              <Row>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto7"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto8"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto9"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto10"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto11"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto12"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto13"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto14"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto15"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-2">
                  <FormControl
                    control={control}
                    name="rto16"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            </SubSection>
            <SubSection title={"Define Percentage(s)"}>
              <Row>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="calculateRTO"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="calculateRPO"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="calculateMTD"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            </SubSection>
          </Section>
          <Row style={{ marginBottom: "40px" }}>
            <Col>
              <Row>
                {" "}
                <h4>RA</h4>
              </Row>
              <hr></hr>
              <Row>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    name="raTriggeredby"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    onKeyDown={(e) =>
                      exceptThisSymbols.includes(e.key) && e.preventDefault()
                    }
                  />
                </div>
              </Row>
            </Col>
            <Col>
              <Row>
                {" "}
                <h4>Exercise</h4>
              </Row>
              <hr></hr>
              <Row>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    name="exerciseTriggeredby"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    onKeyDown={(e) =>
                      exceptThisSymbols.includes(e.key) && e.preventDefault()
                    }
                  />
                </div>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                {" "}
                <h4>BIA</h4>
              </Row>
              <hr></hr>
              <Row>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    name="biaTriggeredby"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    onKeyDown={(e) =>
                      exceptThisSymbols.includes(e.key) && e.preventDefault()
                    }
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="biaReminder"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="biaOverDue"
                    onKeyDown={(e) =>
                      exceptThisSymbols.includes(e.key) && e.preventDefault()
                    }
                  />
                </div>

                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="biaOverDue"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="biaReminder"
                    onKeyDown={(e) =>
                      exceptThisSymbols.includes(e.key) && e.preventDefault()
                    }
                  />
                </div>
              </Row>
            </Col>
            <Col>
              <Row>
                {" "}
                <h4>BCP</h4>
              </Row>
              <hr></hr>
              <Row>
                <div className="col-md-6">
                  <FormControl
                    control={control}
                    name="bcpTriggeredby"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    onKeyDown={(e) =>
                      exceptThisSymbols.includes(e.key) && e.preventDefault()
                    }
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="bcpReminder"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="bcpOverDue"
                    onKeyDown={(e) =>
                      exceptThisSymbols.includes(e.key) && e.preventDefault()
                    }
                  />
                </div>

                <div className="col-md-3">
                  <FormControl
                    control={control}
                    name="bcpOverDue"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="bcpReminder"
                    onKeyDown={(e) =>
                      exceptThisSymbols.includes(e.key) && e.preventDefault()
                    }
                  />
                </div>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      {formValues.objectId != null && (
        <Container className="justify-content-center  ">
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
          />
        </Container>
      )}
    </>
  );
};

export default FormLayout;
