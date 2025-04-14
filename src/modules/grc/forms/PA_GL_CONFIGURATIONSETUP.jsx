import { Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_GL_CONFIGURATIONSETUP_JS";
import React from "react";
import { useTranslation } from "react-i18next";


const FormLayout = (props) => {
  const { t } = useTranslation("common");
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    formState: {},
  } = formMethods;

  formMetaData.form = JSHook(form, formMetaData, formMethods, formValues);
  

  return (
    <>
      <Row style={{ margin: "50px" }}>
        <Col>
          <Row>
            {" "}
            <h4>{t("Process")}</h4>
          </Row>
          <hr></hr>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="enbleCIAProcess"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />  
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="processHierarchy"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="enbleRecObjtProcess"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          {/* <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="enbleCteTypeProcess"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row> */}

          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="processReview"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="processReminder"
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="processReview"
              />
            </div>

            <div className="col-md-3">
              <FormControl
                control={control}
                name="processOverDue"
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="processReview"
              />
            </div>
          </Row>
        </Col>
        <Col>
          <Row>
            {" "}
            <h4>{t("Asset")}</h4>
          </Row>
          <hr></hr>
          <Row>
            {" "}
            <div className="col-md-6">
              <FormControl
                control={control}
                name="enbleCIAAsset"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="assetHierarchy"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="enbleRecObjtAsset"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="assetReview"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="assetReminder"
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="assetReview"
              />
            </div>

            <div className="col-md-3">
              <FormControl
                control={control}
                name="assetOverDue"
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="assetReview"
              />
            </div>
          </Row>
        </Col>
      </Row>

      <Row style={{ margin: "50px" }}>
        <Col>
          <Row>
            <h4>{t("Risk")}</h4>
          </Row>
          <hr></hr>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="riskHierarchy"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="riskReview"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="riskReminder"
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="riskReview"
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="riskOverDue"
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="riskReview"
              />
            </div>
          </Row>
        </Col>
        <Col>
          <Row>
            <h4>{t("Control")}</h4>
          </Row>
          <hr></hr>

          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="controlHierarchy"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6" style={{ marginTop: "20px" }}>
              <FormControl
                control={control}
                name="controlReview"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="controlReminder"
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="controlReview"
              />
            </div>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="controlOverDue"
                formMetaData={formMetaData}
                formMethods={formMethods}
                watchFor="controlReview"
              />
            </div>
          </Row>
        </Col>
      </Row>

      <Row style={{ margin: "50px" }}>
        <Col>
          <Row>
            <h4>{t("Requirement")}</h4>
          </Row>
          <hr></hr>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="requirementHierarchy"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Col>
        <Col>
          <Row>
            <h4>{t("Standard")}</h4>
          </Row>
          <hr></hr>
          <Row>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="standardHierarchy"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Col>
      </Row>
      <Row style={{ margin: "50px" }}>
        <Col>
          <Row>
            <h4>{t("Notification")}</h4>
          </Row>
          <hr></hr>
          <Row>
            <div>
              <FormControl
                control={control}
                name="noifyObjtMofiction"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Col>
        <Col></Col>
      </Row>
    </>
  );
};
export default FormLayout;
