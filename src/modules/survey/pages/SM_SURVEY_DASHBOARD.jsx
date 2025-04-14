import React from "react";
import { Helmet } from "react-helmet-async";
import { Container } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";

const Default = () => {
  let privs = util.getCurrentUser().privileges?.split(",");
  console.log(privs, util.getCurrentUser(), "privileges");
  let forms = [
    {
      title: "Questionnaire",
      form: "questionnaire",
      privilege: "SM_CREATE_QUESTIONNAIRE",
    },
    {
      title: "Initiate Survey",
      form: "initiateSurvey",
      privilege: "SM_INITIATE_SURVEY",
    },
  ];

  let reports = [
    {
      title: "Questionnaire Report",
      report: "SM_QUESTIONNAIRE_REPORT",
      privilege: "SM_CREATE_QUESTIONNAIRE",
    },
  ];

  const combinedItems = [
    ...forms.map((item) => ({ ...item, type: "form" })),
    ...reports.map((item) => ({ ...item, type: "report" })),
  ];

  return (
    <>
      <Helmet title="Survey Dashboard" />
      <Container fluid className="p-0 m-0">
        <div>
          <div>
            {privs?.includes("SM_CREATE_QUESTIONNAIRE") && (
              <>
                <LandingPagesTitle
                  title="Questionnaire Dashboard"
                  configrationForm="surveyconfigurationsetup"
                  privileges="SM_CREATE_QUESTIONNAIRE"
                />

                <FormReportChartLink combinedItems={combinedItems} />
                <Row>
                  <Col className="">
                    <Chart chart="SM_QUESTIONNAIRE_BY_PROGRAMS" />
                  </Col>
                  <Col>
                    <Chart chart="SM_QUESTIIONNAIRE_BY_CATEGORY" />
                  </Col>
                  {/* <Col>
                    <Chart chart="SM_SURVEY_BY_BUSINESS_UNITS" />
                  </Col> */}
                </Row>

                <LandingPagesTitle title="Survey Dashboard" />
                <>
                  {/* <Row>
                    <Col>
                      <Chart chart="SM_SURVEY_BY_STATUS" />
                    </Col>
                  </Row> */}

                  <Row>
                    <ReportRuntime report="SM_SURVEY_STATUS" dataCard />
                  </Row>
                </>
              </>
            )}

            {privs?.includes("SM_PERFORM_SURVEY") && (
              <>
                <ReportRuntime report="SM_RESPONSE_REPORT" />
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Default;
