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
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useState, useEffect, useLayoutEffect, useMemo } from "react";

import Section from "src/components/forms/reactformutils/fields/Section";
// import Popup from "src/components/forms/utils/Popup";
import "../../../../src/assets/scss/profile.scss";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import AuditTrail, {
  ChangeHistoryComp,
  AuditTrailComp,
} from "src/components/forms/reactformutils/elements/AuditTrail";
let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    disableDrop,
    checkCondition,
    setCheckCondition,
    finalcheck,
    FormFunction,
    reportlen,
    formValues,
    setFun,
    click,
    setClick,
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
    formState: { errors, touched, isSubmitting },
  } = formMethods;
  const [openPopup, setOpenPopup] = useState(null);
  useEffect(() => {
    if (
      formMethods.getValues("initiator") === null ||
      formMethods.getValues("initiator") === ""
    ) {
      formMethods.setValue(
        "initiator",
        JSON.parse(localStorage.current_logged_User)[0].user_details.data[0]
          .user_id
      );
      formMethods.setValue("action", 1);
      formMethods.setValue("currentStage", "INITIATE");
      formMethods.setValue("status", "New");
    }
  });

  let navigate = useNavigate();
  if (
    formMethods.getValues("workflow") === null ||
    formMethods.getValues("workflow") === undefined ||
    formMethods.getValues("workflow") === ""
  ) {
    formMethods.setValue("workflow", 14);
  } else {
    formMethods.setValue("workflow", formMethods.getValues("workflow"));
  }
  return (
    <>
      <Row>
        <Col md="8" xl="9">
          <Container
            className="justify-content-center  "
            style={{ marginTop: "3%" }}
          >
            <Section title="Issue Details">
              <Col>
                <FormControl
                  control={control}
                  type="input"
                  name="issueTitle"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>

              <Col>
                <FormControl
                  control={control}
                  type="input"
                  name="description"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col>
                <FormControl
                  control={control}
                  type="date"
                  name="identifiedOn"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
            </Section>
            <Section title="Classification">
              <Col>
                <FormControl
                  control={control}
                  //type="input"
                  name="issueTypes"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>

              <Col>
                <FormControl
                  control={control}
                  //type="input"
                  name="rating"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>

              <Col>
                <FormControl
                  control={control}
                  //type="input"
                  name="priority"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
              <Col>
                <FormControl
                  control={control}
                  type="singleattach"
                  name="attachFiles"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>

              <div className="text-center mt-3">
                {formMetaData &&
                  formMetaData.actions &&
                  formMetaData.actions.map((action, idx) => (
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="mx-1"
                      onClick={() =>
                        formMethods.setValue("action", action.action_code)
                      }
                    >
                      {action.action}
                    </Button>
                  ))}
                <Button
                  onClick={() => navigate("/pages/tasks")}
                  //   onClick={showToastMessage}
                  variant="primary"
                  size="lg"
                  style={{ marginLeft: "10px" }}
                >
                  Close
                </Button>
              </div>
            </Section>
          </Container>
        </Col>

        {/* <div>
          {openPopup && (
            <Popup
              content={
                <>
                  <div>
                    <h2>Assigne Issue</h2>
                  </div>
                  <hr></hr>
                  <Col>
                    <FormControl
                      control={control}
                      isMulti={true}
                      name="ownerOrganization"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </Col>
                  <Col>
                    <FormControl
                      control={control}
                      name="owner"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </Col>
                  <Col>
                    <FormControl
                      control={control}
                      name="comments"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </Col>
                  <Button type="submit" variant="primary" size="lg">
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    style={{ marginLeft: "1%" }}
                    onClick={() => setOpenPopup(null)}
                  >
                    Cancel
                  </Button>
                </>
              }
            />
          )}
        </div> */}
      </Row>
    </>
  );
};

export default FormLayout;
