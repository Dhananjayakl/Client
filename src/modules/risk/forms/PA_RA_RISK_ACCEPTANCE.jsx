import React, { useState } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import JSHook from "./PA_RA_RISK_ACCEPTANCE_JS";
import Section from "src/components/forms/reactformutils/fields/Section";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import "react-toastify/dist/ReactToastify.css";
import { useFieldArray } from "react-hook-form";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";
import { useWatch } from "react-hook-form";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const { control } = formMethods;
  const [deletedSectionKey, setDeletedSectionKey] = useState(0);
  const { t } = useTranslation("common");

  const deleteSectionforFND = (index) => {
    setDeletedSectionKey(deletedSectionKey + 1);
    ACTremove(index);
  };
  const deleteSectionforCTL = (index) => {
    setDeletedSectionKey(deletedSectionKey + 1);
    CTLremove(index);
  };
  function callbackFromChild(props) {
    CTLappend({
      ctlID: props.dataRefValue.ctlID || "",
      ctlName: props.dataRefValue.name || "",
      ctlOwner: props.dataRefValue.owner || "",
      ctlDescription: props.dataRefValue.description || "",
      ctlStartDate: props.dataRefValue.startDate || "",
      ctlEndDate: props.dataRefValue.endDate || "",
      ctlTestFrequency: props.dataRefValue.reviewCycle || "",
    });
  }
  const [compValue, setCompValue] = useState("");

  const updatevalue = (value) => {
    setCompValue(value);
  };

  const {
    fields: CTLFields,
    append: CTLappend,
    remove: CTLremove,
  } = useFieldArray({
    name: "CTL",
    control,
  });

  const {
    fields: ACTFields,
    append: ACTappend,
    remove: ACTremove,
  } = useFieldArray({
    name: "ACT",
    control,
  });
  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formValues,
    formMetaData,
    runtimeParams,
    control,
    updatevalue
  );
  const schStartDate = useWatch({
    control: control,
    name: "startDate",
  });

  return (
    <Container className="justify-content-center  ">
      <Row>
        <div className="col-md-9">
          <FormControl
            control={control}
            name="name"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
      <Row>
        <div>
          <FormControl
            control={control}
            name="description"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="businessUnit"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="process"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="processOwner"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="processSPOC"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
      <Row>
        <div>
          <FormControl
            control={control}
            name="riskAcceptanceDescription"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="sources"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="initiator"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="startDate"
            formMetaData={formMetaData}
            formMethods={formMethods}
            futureDate={true}
          />
        </div>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="endDate"
            formMetaData={formMetaData}
            formMethods={formMethods}
            watchFor="startDate"
            futureDate={true}
            futureDateValue={new Date(schStartDate).setDate(
              new Date(schStartDate).getDate() + 1
            )}
          />
        </div>
      </Row>

      <Section title={t("Actions")}>
        <Row className="mb-2 px-2">
          {(formMethods.getValues("currentStage") != "APPROVAL" ||
            formMethods.getValues("currentStage") ===
              "SUBMIT_CLARIFICATION") && (
            <Button
              onClick={() =>
                ACTappend({
                  actId: "",
                  actActionName: "",
                  actOwner: "",
                  actDescription: "",
                  actDueDate: "",
                  actNextFollowup: "",
                })
              }
            >
              {t("+ Add Actions")}
            </Button>
          )}
        </Row>

        {ACTFields.map((fitem, fi) => {
          let ACTRecord = `ACT.${fi}`;

          return (
            <Row key={`${ACTRecord}-${deletedSectionKey}`}>
              <Collapse
                title={`${ACTRecord}.actActionName`}
                className="bg-primary text-white bg-gradient bg-opacity-75"
                control={control}
                watchFor={[`${ACTRecord}.actActionName`]}
                formMethods={formMethods}
              >
                <Row>
                  <div className="col-md-6">
                    <FormControl
                      control={control}
                      name={`${ACTRecord}.actActionName`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </div>

                  <div className="col-md-6">
                    <FormControl
                      control={control}
                      name={`${ACTRecord}.actOwner`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </div>
                </Row>
                <Row>
                  <div className="col-md-6">
                    <FormControl
                      control={control}
                      name={`${ACTRecord}.actDueDate`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </div>

                  <div className="col-md-6">
                    <FormControl
                      control={control}
                      name={`${ACTRecord}.actNextFollowup`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </div>
                </Row>

                <Row>
                  <div>
                    <FormControl
                      control={control}
                      name={`${ACTRecord}.actDescription`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </div>
                </Row>

                <Row>
                  <Col className="mb-3 mr-2">
                    <div className="text-right">
                      {formMethods.getValues("currentStage") != "APPROVAL" ||
                      formMethods.getValues("currentStage") ==
                        "SUBMIT_CLARIFICATION" ? (
                        <Button
                          type="button"
                          variant="warning"
                          className="float-end"
                          onClick={() => deleteSectionforFND(fi)}
                        >
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  </Col>
                </Row>
              </Collapse>
            </Row>
          );
        })}
      </Section>
      <Row>
        <div>
          <FormControl
            control={control}
            name="compensationgControl"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
      {compValue == true && (
        <Section title={t("Compensation Control")}>
          {formMethods.getValues("currentStage") != "APPROVAL" ||
          formMethods.getValues("currentStage") == "SUBMIT_CLARIFICATION" ? (
            <ButtonToolbar
              className="justify-content-center mb-1"
              aria-label="Toolbar with Action Management"
            >
              <ButtonGroup aria-label="First group" className="flex-grow-1">
                <Button
                  onClick={() =>
                    CTLappend({
                      ctlID: "",
                      ctlName: "",
                      ctlOwner: "",
                      ctlDescription: "",
                      ctlStartDate: "",
                      ctlEndDate: "",
                      ctlTestFrequency: "",
                    })
                  }
                >
                  {t("+ Add Controls")}
                </Button>
                <ModalForm
                  component={
                    <FormRunTime
                      formService="control"
                      objectId={-1}
                      modal
                      callbackParent={callbackFromChild}
                    />
                  }
                  buttonText={
                    <>
                      <FontAwesomeIcon icon={faPlusCircle} size="lg" /> Create
                      Controls
                    </>
                  }
                />
              </ButtonGroup>
            </ButtonToolbar>
          ) : null}

          {CTLFields.map((fitem, fi) => {
            let CTLRecord = `CTL.${fi}`;

            return (
              <Row key={`${CTLRecord}-${deletedSectionKey}`}>
                <Collapse
                  title={`${CTLRecord}.ctlName`}
                  className="bg-primary text-white bg-gradient bg-opacity-75"
                  control={control}
                  watchFor={[`${CTLRecord}.ctlName`]}
                  formMethods={formMethods}
                >
                  <Row>
                    <div className="col-md-6">
                      <FormControl
                        control={control}
                        name={`${CTLRecord}.ctlName`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </div>

                    <div className="col-md-6">
                      <FormControl
                        control={control}
                        name={`${CTLRecord}.ctlOwner`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </div>
                  </Row>
                  <Row>
                    <div className="col-md-6">
                      <FormControl
                        control={control}
                        name={`${CTLRecord}.ctlStartDate`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </div>

                    <div className="col-md-6">
                      <FormControl
                        control={control}
                        name={`${CTLRecord}.ctlEndDate`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </div>
                  </Row>
                  <Row>
                    <div className="col-md-6">
                      <FormControl
                        control={control}
                        name={`${CTLRecord}.ctlTestFrequency`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </div>
                  </Row>

                  <Row>
                    <div>
                      <FormControl
                        control={control}
                        name={`${CTLRecord}.ctlDescription`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </div>
                  </Row>

                  <Row>
                    <Col className="mb-3 mr-2">
                      <div className="text-right">
                        {formMethods.getValues("currentStage") == "PERFORM" ||
                        formMethods.getValues("currentStage") ==
                          "SUBMIT_CLARIFICATION" ? (
                          <Button
                            type="button"
                            variant="warning"
                            className="float-end"
                            onClick={() => deleteSectionforCTL(fi)}
                          >
                            Remove
                          </Button>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                </Collapse>
              </Row>
            );
          })}
        </Section>
      )}

      {/* <div>
          {submissionPopup && (
            <Popup
              header={submissionPopup + " Comments"}
              content={
                <>
                  {
                    <Col>
                      <FormControl
                        control={control}
                        name="comments"
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        required={
                          submissionPopup == "Request Clarification" ||
                          submissionPopup == "Submit Clarification"
                        }
                      />
                    </Col>
                  }
                </>
              }
              formApi={formApi}
              form={form}
              runtimeParams={runtimeParams}
              closePopup={setSubmissionPopup}
            />
          )}
        </div> */}
      <Section title={t("Review and Approvers")}>
        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="reviewedBy"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="approvedBy"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>
      </Section>
    </Container>
  );
};

export default FormLayout;
