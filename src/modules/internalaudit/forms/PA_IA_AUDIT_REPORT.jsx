import React, { useState } from "react";

import { Button, Container, Row, Col, Spinner } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import { useTranslation } from "react-i18next";
import JSHook from "./PA_IA_AUDIT_REPORT_JS";
import Popup from "src/components/forms/reactformutils/elements/Popup";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import ReportRuntime from "src/components/reports/Report";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "src/utils/AxiosInstance";
import Tabledetails from "../../../components/forms/reactformutils/elements/Table";
const FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues, runtimeParams } = props;
  const { t } = useTranslation();
  const refreshdataref = React.useRef(null);
  runtimeParams.refreshdataref = refreshdataref;
  let [jsonData, setjsonData] = useState({});
  const exceptThisSymbols = ["e", "E", "+", "-", "."];

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
  const [apiResponse, setApiResponse] = useState("");

  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    control,
    runtimeParams,
    setjsonData,
    setApiResponse
  );

  let [submissionPopup, setSubmissionPopup] = useState(false);
  const formApi = formMetaData.formmeta.api_handler.replace(/[/]/, "");
  const [loading, setLoading] = useState(false);
  const formObjectId =
    formMethods.getValues("objectId") == ""
      ? -1
      : formMethods.getValues("objectId");
  const handleDownloadExcel = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `/jasperReport/Internal Audits/${formMetaData.formmeta.form_name}/rtf/${runtimeParams.ParentFormObjectId}`,
        jsonData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );
      const href = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", `${formMetaData.formmeta.form_title}.doc`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(href);

      const inputField = document.getElementById("inputGroupFile");
      if (inputField) {
        inputField.value = "";
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const testDetails = [
    { label: "Test Name", key: "tst_name" },
    { label: "Test Result", key: "d_tst_result" },
    { label: "Sample Tested", key: "sample_tested" },
    { label: "Sample Passed", key: "sample_passed" },
    { label: "Sample Failed", key: "sample_failed" },
  ];

  return (
    <>
      <Container className="justify-content-center">
        <Section title="General" required>
          <Row>
            <div className="col-md-8">
              <FormControl
                type="readonly"
                control={control}
                name="auditTitle"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                type="readonly"
                control={control}
                name="status"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                type="readonly"
                control={control}
                name="auditManager"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                type="readonly"
                control={control}
                name="leadAuditor"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                type="readonly"
                control={control}
                name="startDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                type="readonly"
                control={control}
                name="endDate"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>
        <Section title="Report Details">
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="businessUnitAudited"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="reportNumber"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="reportYear"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
                onKeyDown={(e) =>
                  exceptThisSymbols.includes(e.key) && e.preventDefault()
                }
              />
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="auditRating"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-8">
              <FormControl
                control={control}
                name="selectFindings"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="auditProcedures"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-12">
              <FormControl
                control={control}
                name="auditConclusion"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="reportType"
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
              {formMethods.getValues("reportType") !== "" &&
              formMethods.getValues("currentStage") == "INITIATE" ? (
                <Col className="float-end">
                  <Button
                    variant="primary"
                    onClick={handleDownloadExcel}
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        style={{ marginRight: "5px" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faCloudDownloadAlt}
                        style={{ marginRight: "5px" }}
                      />
                    )}
                    {loading ? "Generating..." : "Generate Report"}
                  </Button>
                </Col>
              ) : (
                ""
              )}
            </div>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="uploadReport"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>
        <Section title="Test and Procedures">
          <Tabledetails
            apiResponse={apiResponse}
            fieldDetails={testDetails}
            // icon={faCogs}
          />
        </Section>
        {formValues != null && formValues.objectId != undefined && (
          <Section title="Finding Details">
            <ReportRuntime
              refreshdataref={refreshdataref}
              report="IR_AUDIT_REPORT_FINDINGS"
              drilldownReports={{
                objectId: formMethods.getValues("objectId"),
              }}
            />
          </Section>
        )}
        {formValues != null && formValues.objectId != undefined && (
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
          />
        )}

        <div>
          {submissionPopup && (
            <Popup
              header={
                submissionPopup == "Review"
                  ? "Send for Review"
                  : submissionPopup
              }
              content={
                <>
                  {submissionPopup == "Review" &&
                    submissionPopup !== "Submit" && (
                      <Col>
                        <FormControl
                          control={control}
                          name="reportReviewer"
                          formMetaData={formMetaData}
                          formMethods={formMethods}
                        />
                      </Col>
                    )}

                  <Col>
                    <FormControl
                      control={control}
                      name="comments"
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </Col>
                </>
              }
              formObjectId={formObjectId}
              formApi={formApi}
              form={form}
              runtimeParams={runtimeParams}
              closePopup={setSubmissionPopup}
            />
          )}
        </div>
      </Container>
    </>
  );
};
export default FormLayout;
