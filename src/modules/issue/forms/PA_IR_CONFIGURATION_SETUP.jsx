import { Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_IR_CONFIGURATION_SETUP_JS";
import React from "react";
import { useTranslation } from "react-i18next";
const FormLayout = (props) => {
  const { t } = useTranslation("common");
  let { formMethods, formMetaData, form, formValues, fields } = props;
  const {
    control,
    formState: { errors, touched, isSubmitting },
  } = formMethods;

  formMetaData.form = JSHook(form, fields, formMethods, formValues);

  const radioOptions = [
    { key: "1", value: "Action Plan Preparation" },
    { key: "2", value: "Action Plan Implementation" },
  ];
  if (
    formMethods.getValues("objectId") == "" ||
    formMethods.getValues("objectId") == null
  ) {
    formMethods.setValue("reopenIssue", "1");
  }

  return (
    <>
      <Row>
        <div className="col-md-6">
          <FormControl
            control={control}
            type="radio"
            name="reopenIssue"
            formMetaData={formMetaData}
            formMethods={formMethods}
            options={radioOptions}
          />
        </div>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="isActionPlanApproverAutoApprove"
            formMetaData={formMetaData}
            formMethods={formMethods}
            options={radioOptions}
          />
        </div>
      </Row>

      <Row>
        <Col>
          <Row>
            {" "}
            <h4>{t("Issue")}</h4>
          </Row>
          <hr></hr>
          <Row>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="issueReminder"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>

            <div className="col-md-3">
              <FormControl
                control={control}
                name="issueOverDue"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Col>
        <Col>
          <Row>
            {" "}
            <h4>{t("Action")}</h4>
          </Row>
          <hr></hr>
          <Row>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="actionReminder"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>

            <div className="col-md-3">
              <FormControl
                control={control}
                name="actionOverDue"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Col>
      </Row>
    </>
  );
};
export default FormLayout;
