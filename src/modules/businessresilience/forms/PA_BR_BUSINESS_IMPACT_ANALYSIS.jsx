import { Container, Row, Col } from "react-bootstrap";
import { useFieldArray } from "react-hook-form";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import JSHook from "./PA_BR_BUSINESS_IMPACT_ANALYSIS_JS";
import React, { useState, useRef, useEffect } from "react";
import "../../../../src/assets/scss/profile.scss";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";

const FormLayout = (props) => {
  let { formMethods, formMetaData, formValues, form, runtimeParams } = props;
  const {
    control,
    formState: {},
  } = formMethods;
  const [sectionName, setSectionName] = useState();
  const [GroupValue, setGroupValue] = useState();
  const { fields: QSTFields, append: QSTappend } = useFieldArray({
    name: "QST",
    control,
  });

  const { fields: impFields, append: appendImp } = useFieldArray({
    name: "IMP",
    control,
  });
  let disabledOption = useRef([]);

  const { append: appendCtd, remove: removeCtd } = useFieldArray({
    name: "CTD",
    control,
  });

  const [fieldVisibility, setFieldVisibility] = useState({});
  const [errorMessage, seterrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    appendImp,
    QSTappend,
    appendCtd,
    setFieldVisibility,
    removeCtd,
    control,
    setGroupValue,
    setSectionName,
    seterrorMessage,
    setSuccessMessage,
    runtimeParams
  );

  let rowIndex = -1;

  let ctdDisabled;

  const buttons = document.querySelectorAll(".disbutton");
  useEffect(() => {
    buttons.forEach((button) => {
      const buttonChildren = button.textContent.trim();
      if (errorMessage) {
        if (
          buttonChildren === "Send to Owner" ||
          buttonChildren == "Send for Approval" ||
          buttonChildren == "Send for Review" ||
          buttonChildren == "Draft"
        ) {
          button.hidden = true;
        } else {
          button.hidden = false;
        }
      }
    });
  }, [buttons, errorMessage]);

  const currentStage = formMethods.getValues("currentStage");

  return (
    <>
      <Container className="justify-content-center  ">
        <Section title="General" required>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="objName"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>

            <div className="col-md-4">
              <FormControl
                control={control}
                name="status"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <SubSection title="Scope">
            <Row>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="businessUnit"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>

              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="processName"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  closeButton={true}
                />
              </div>

              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="assetName"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  closeButton={true}
                />
              </div>
              {errorMessage ? (
                <div className="text-danger p-1">{errorMessage}</div>
              ) : (
                successMessage && <div>{successMessage}</div>
              )}
            </Row>
          </SubSection>
          <SubSection title="Ownership">
            <Row>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="biaOwner"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="biaApprover"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          </SubSection>
          <SubSection title="Review Cycle">
            <Row>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="scheduleFrequency"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="nextReviewDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-4"></div>
            </Row>

            <Row>
              <div className="col-md-12">
                <FormControl
                  control={control}
                  name="controls"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          </SubSection>{" "}
        </Section>
        <Section title="Asset / Process Assessment" required>
          {QSTFields.map((qsItem, qs) => {
            let QSTRecord = `QST.${qs}`;

            return (
              <React.Fragment key={qsItem.id}>
                <Row>
                  <div className="col-md-8">
                    <FormControl
                      control={control}
                      name={`${QSTRecord}.qstName`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      textColor={true}
                      hideTitle
                    />
                  </div>
                  <div className="col-md-2">
                    <FormControl
                      control={control}
                      name={`${QSTRecord}.qstResponse`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      hideTitle
                    />
                  </div>
                </Row>
              </React.Fragment>
            );
          })}
        </Section>
        <Section title="Impact Assessment" required>
          <div
            style={{
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            {impFields.map((row, rowIndex) => (
              <Row key={row.id}>
                <Col xs={12} md={12} lg={12}>
                  <div>
                    <div className="d-flex">
                      <div
                        className="col-md-2 me-5 bg-white position-sticky start-0"
                        style={{
                          maxWidth: "100px",
                          minWidth: "100px",
                          zIndex: 1,
                        }}
                      >
                        <FormControl
                          control={control}
                          name={`IMP.${rowIndex}.impFactor`}
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                          setData={true}
                          hideTitle={rowIndex > 0}
                        />
                      </div>
                      {fieldVisibility.rto1 && (
                        <div className="col-md-2 ">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto1`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto2 && (
                        <div className="col-md-2">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto2`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto3 && (
                        <div className="col-md-2">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto3`}
                            formMetaData={formMetaData}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto4 && (
                        <div className="col-md-2 ">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto4`}
                            formMetaData={formMetaData}
                            disabledoptions={disabledOption}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto5 && (
                        <div className="col-md-2 ">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto5`}
                            formMetaData={formMetaData}
                            disabledoptions={disabledOption}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto6 && (
                        <div className="col-md-2 ">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto6`}
                            formMetaData={formMetaData}
                            disabledoptions={disabledOption}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto7 && (
                        <div className="col-md-2">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto7`}
                            formMetaData={formMetaData}
                            disabledoptions={disabledOption}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto8 && (
                        <div className="col-md-2 ">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto8`}
                            formMetaData={formMetaData}
                            disabledoptions={disabledOption}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto9 && (
                        <div className="col-md-2 ">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto9`}
                            formMetaData={formMetaData}
                            disabledoptions={disabledOption}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto10 && (
                        <div className="col-md-2">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto10`}
                            formMetaData={formMetaData}
                            disabledoptions={disabledOption}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto11 && (
                        <div className="col-md-2 ">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto11`}
                            formMetaData={formMetaData}
                            disabledoptions={disabledOption}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto12 && (
                        <div className="col-md-2 ">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto12`}
                            formMetaData={formMetaData}
                            disabledoptions={disabledOption}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto13 && (
                        <div className="col-md-2">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto13`}
                            formMetaData={formMetaData}
                            disabledoptions={disabledOption}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto14 && (
                        <div className="col-md-2 ">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto14`}
                            formMetaData={formMetaData}
                            disabledoptions={disabledOption}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto15 && (
                        <div className="col-md-2">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto15`}
                            formMetaData={formMetaData}
                            disabledoptions={disabledOption}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0}
                          />
                        </div>
                      )}
                      {fieldVisibility.rto16 && (
                        <div className="col-md-2">
                          <FormControl
                            control={control}
                            zIndex={true}
                            name={`IMP.${rowIndex}.rto16`}
                            formMetaData={formMetaData}
                            disabledoptions={disabledOption}
                            formMethods={formMethods}
                            setData={true}
                            hideTitle={rowIndex > 0 ? true : false}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            ))}
          </div>

          <SubSection title="Summary">
            <div className="mt-2">
              <Row>
                <Col>
                  <FormControl
                    control={control}
                    name="calBusinessCriticality"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Col>
                  <FormControl
                    control={control}
                    name="overrideBusinessCriticality"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Col className="col-md-6">
                  <FormControl
                    control={control}
                    name="overrideComments"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormControl
                    control={control}
                    name="calMTD"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>

                <Col>
                  <FormControl
                    control={control}
                    name="overrideMTD"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>

                <Col className="col-md-6">
                  <FormControl
                    control={control}
                    name="overrideMTDComments"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormControl
                    control={control}
                    name="impRTO"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    watchFor="impRTO"
                  />
                </Col>

                <Col>
                  <FormControl
                    control={control}
                    name="overrideRTO"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Col className="col-md-6">
                  <FormControl
                    control={control}
                    name="overrideRTOComments"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormControl
                    control={control}
                    name="impRPO"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>

                <Col>
                  <FormControl
                    control={control}
                    name="impWRT"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>

                <Col>
                  <FormControl
                    control={control}
                    name="impMTD"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                  />
                </Col>
                <Col></Col>
              </Row>
            </div>
          </SubSection>
        </Section>

        <Section title="Critical Processing time for Process / Asset">
          <Row>
            <Col>
              <FormControl
                control={control}
                type="PicklistSelect"
                isMulti={true}
                name="selectMonths"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                type="PicklistSelect"
                isMulti={true}
                name="selectWeeks"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                type="PicklistSelect"
                isMulti={true}
                name="selectDays"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col></Col>
          </Row>
        </Section>

        <Section title="Critical Dependencies" required>
          {sectionName &&
            sectionName.map(
              (sectionName, sectionIndex) => (
                console.log(sectionIndex, "sectionIndexsectionIndex"),
                (
                  <SubSection key={sectionIndex} title={sectionName}>
                    <div
                      className="card"
                      style={{
                        overflowX: "auto",
                        maxWidth: "100%",
                      }}
                    >
                      {GroupValue &&
                        GroupValue[sectionName].map((row, rowIndex1) => {
                          rowIndex++;
                          ctdDisabled = ["SOP", "Third Party", "Process"].some(
                            (keyword) => sectionName.includes(keyword)
                          )
                            ? true
                            : false;

                          return (
                            <Row key={row.id}>
                              <Col xs={12} md={12} lg={12}>
                                <div className="d-flex">
                                  <div className="col-md-4  bg-white">
                                    <FormControl
                                      control={control}
                                      name={`CTD.${rowIndex}.ctdName`}
                                      formMetaData={formMetaData}
                                      trimmedValue={true}
                                      formMethods={formMethods}
                                      autoDisplay={true}
                                      hideTitle={rowIndex1 > 0}
                                    />
                                  </div>
                                  {sectionName !== "SOP" &&
                                    sectionName !== "Third Party" && (
                                      <div className="col-md-2 ">
                                        <FormControl
                                          control={control}
                                          name={`CTD.${rowIndex}.ctdRTO`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                          hideTitle={rowIndex1 > 0}
                                        />
                                      </div>
                                    )}
                                  {sectionName !== "SOP" &&
                                    sectionName !== "Third Party" && (
                                      <div className="col-md-2 me-3">
                                        <FormControl
                                          control={control}
                                          name={`CTD.${rowIndex}.ctddependencyGap`}
                                          formMetaData={formMetaData}
                                          formMethods={formMethods}
                                          hideTitle={rowIndex1 > 0}
                                        />
                                      </div>
                                    )}
                                  {(sectionName === "Asset" ||
                                    sectionName === "Process") && (
                                    <div className="col-md-3 me-1">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctdBusinessAsUsual`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {(sectionName === "SOP" ||
                                    sectionName === "Third Party") && (
                                    <div className="col-md-2 me-1">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctdisApplicableduringcrisis`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  <div className="col-md-0 ">
                                    <FormControl
                                      control={control}
                                      name={`CTD.${rowIndex}.ctdId`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                      hideTitle={rowIndex1 > 0}
                                    />
                                  </div>
                                  <div className="col-md-0 ">
                                    <FormControl
                                      control={control}
                                      name={`CTD.${rowIndex}.ctdObjId`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                      hideTitle={rowIndex1 > 0}
                                    />
                                  </div>
                                  <div className="col-md-0 ">
                                    <FormControl
                                      control={control}
                                      name={`CTD.${rowIndex}.ctdObjType`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                      hideTitle={rowIndex1 > 0}
                                    />
                                  </div>
                                  <div className="col-md-0 ">
                                    <FormControl
                                      control={control}
                                      name={`CTD.${rowIndex}.ctdDeptType`}
                                      formMetaData={formMetaData}
                                      formMethods={formMethods}
                                      hideTitle={rowIndex1 > 0}
                                    />
                                  </div>
                                  {fieldVisibility.rto1 && !ctdDisabled && (
                                    <div className="col-md-1 me-2 ">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd1`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto2 && !ctdDisabled && (
                                    <div className="col-md-1 me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd2`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto3 && !ctdDisabled && (
                                    <div className="col-md-1 me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd3`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto4 && !ctdDisabled && (
                                    <div className="col-md-1 me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd4`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto5 && !ctdDisabled && (
                                    <div className="col-md-1 me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd5`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto6 && !ctdDisabled && (
                                    <div className="col-md-1 me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd6`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto7 && !ctdDisabled && (
                                    <div className="col-md-1 me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd7`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto8 && !ctdDisabled && (
                                    <div className="col-md-1  me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd8`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto9 && !ctdDisabled && (
                                    <div className="col-md-1 me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd9`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto10 && !ctdDisabled && (
                                    <div className="col-md-1 me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd10`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto11 && !ctdDisabled && (
                                    <div className="col-md-1 me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd11`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto12 && !ctdDisabled && (
                                    <div className="col-md-1 me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd12`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto13 && !ctdDisabled && (
                                    <div className="col-md-1 me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd13`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto14 && !ctdDisabled && (
                                    <div className="col-md-1 me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd14`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto15 && !ctdDisabled && (
                                    <div className="col-md-1 me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd15`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                  {fieldVisibility.rto16 && !ctdDisabled && (
                                    <div className="col-md-1 me-2">
                                      <FormControl
                                        control={control}
                                        name={`CTD.${rowIndex}.ctd16`}
                                        formMetaData={formMetaData}
                                        formMethods={formMethods}
                                        hideTitle={rowIndex1 > 0}
                                      />
                                    </div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          );
                        })}
                    </div>
                  </SubSection>
                )
              )
            )}
        </Section>

        {formValues.objectId != null && (
          <Container className="justify-content-center  ">
            <AuditTrail
              formMetaData={formMetaData}
              formId={formMetaData.formmeta.form_id}
              masterObjectId={formValues.masterObjectId}
              objectId={formValues.objectId}
              formMethods={formMethods}
              enableChangeHistory={currentStage == "INITIATE"}
            />
          </Container>
        )}
      </Container>
    </>
  );
};

export default FormLayout;
