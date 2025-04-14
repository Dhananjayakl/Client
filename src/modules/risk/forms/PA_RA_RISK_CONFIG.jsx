import { Button, Container, Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_RA_RISK_CONFIG_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues } = props;
  const { control } = formMethods;
  const { t } = useTranslation("common");
  const {
    fields: SCRFields,
    append: SCRappend,
    remove: SCRremove,
  } = useFieldArray({
    name: "SCR",
    control,
  });
  const addSCRRow = () => {
    SCRappend({
      id: "",
      factorName: "",
    });
  };
  formMetaData.form = JSHook(
    form,
    formMethods,
    formMetaData,
    formValues,
    SCRappend,
    SCRFields,
    control
  );
  let accessCode = formMetaData.formmeta.accessCode;
  let stageFlag = false;

  return (
    <div>
      <Container className="justify-content-center  ">
        <Section title="General Setup">
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="immediateInheritant"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <Col>
              <Row>
                <h5>{t("Process Compliance")}</h5>
              </Row>
              <hr></hr>
              <Row>
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="assessmentType"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>

                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="factorType"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="scoreFields"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="preProRating"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="priorIssuesReport"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
              </Row>
            </Col>
            <Col>
              <Row>
                <h5>{t("Regulatory Compliance")}</h5>
              </Row>
              <hr></hr>
              <Row>
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="factorBased"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </div>
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="preRegRating"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    hideTitle
                  />
                </div>
              </Row>
            </Col>
          </Row>
          <Row></Row>
        </Section>
        <Section title={t("Impact Rating")}>
          <div
            style={{
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            {SCRFields.map((scrItem, scr) => {
              let SCRecord = `SCR.${scr}`;
              formMethods.setValue(`${SCRecord}.factorName`, "Impact Rating");
              return (
                <>
                  <Row>
                    <div className="d-flex">
                      <div className="col-md-2">
                        <FormControl
                          control={control}
                          name={`${SCRecord}.factorName`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          hideTitle={scr > 0}
                        />
                      </div>
                      <div className="col-md-2 me-1">
                        <FormControl
                          control={control}
                          name={`${SCRecord}.startRange`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          hideTitle={scr > 0}
                        />
                      </div>
                      <div className="col-md-2 me-1">
                        <FormControl
                          control={control}
                          name={`${SCRecord}.endRange`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          hideTitle={scr > 0}
                        />
                      </div>

                      <div className="col-md-2 me-1">
                        <FormControl
                          control={control}
                          name={`${SCRecord}.rating`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          hideTitle={scr > 0}
                        />
                      </div>
                      <div className="col-md-2 me-1">
                        <FormControl
                          control={control}
                          name={`${SCRecord}.score`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          hideTitle={scr > 0}
                        />
                      </div>
                      <div className="col-md-2 me-1">
                        <FormControl
                          control={control}
                          name={`${SCRecord}.guidance`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          hideTitle={scr > 0}
                        />
                      </div>

                      <div className={scr === 0 ? "mt-4" : "mt-2"}>
                        <Button
                          type="button"
                          variant="warning"
                          className="float-end"
                          onClick={() => SCRremove(scr)}
                          hidden={accessCode === 7 || stageFlag}
                        >
                          {t("Remove")}
                        </Button>
                      </div>
                    </div>
                  </Row>
                </>
              );
            })}
          </div>
          {accessCode !== 7 && (
            <Row className="mb-2 px-2">
              <Button onClick={addSCRRow}>+ Add inherent Rating</Button>
            </Row>
          )}
        </Section>
      </Container>
    </div>
  );
};

export default FormLayout;
