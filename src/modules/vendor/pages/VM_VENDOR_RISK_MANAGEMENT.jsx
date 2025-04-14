import ReportRuntime from "src/components/reports/Report";
import Chart from "src/components/charts/Chart";
import { Row, Col, Card, Button, Modal } from "react-bootstrap";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";

const VendorRiskManagament = () => {
  let privs = util.getCurrentUser().privileges?.split(",");
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  const { t } = useTranslation("common");

  let forms = [
    {
      title: "Product/Service",
      form: "productservice",
      privilege: "VM_VENDOR_BUSINESS_USER",
      // upload: true,
    },

    {
      title: "Initiate Due Diligence",
      form: "duediligence",
      privilege: "VM_VENDOR_BUSINESS_USER",
      // upload: true,
    },
    {
      title: "Vendor Termination",
      form: "vendorTermination",
      privilege: "VM_VENDOR_BUSINESS_USER",
    },
  ];

  let reports = [
    {
      title: "Vendor Risk Register",
      report: "VM_VENDOR_REGISTER",
      privilege: "VM_CREATE_PS",
    },
    {
      title: "Product/Service Status",
      report: "VM_PRODUCT_SERVICE",
      privilege: "VM_VENDOR_MANAGER",
    },
    {
      title: "Product/Service",
      report: "VM_PRODUCT_VENDOR_LIFE_CYCLE",
      privilege: "VM_CREATE_PS",
    },
    {
      title: "Due Diligence Under Progress",
      report: "SM_ONGOING_DUE_DILIGENCE",
      privilege: "VM_VENDOR_BUSINESS_USER",
    },
    {
      title: "Periodic Due Diligence",
      report: "VM_PERIODIC_DUE_DELIGENCE",
      privilege: "VM_CREATE_PS",
    },
    // {
    //   title: "Adhoc Due Diligence Status",
    //   report: "SM_ADHOC_DUE_DILIGENCE_STATUS",
    //   privilege: "VM_CREATE_PS",
    // },

    {
      title: "Vendor Termination Status",
      report: "VM_TERMINATION_REPORT",
      privilege: "VM_VENDOR_BUSINESS_USER",
    },

    {
      title: "Ongoing Due Diligence",
      report: "SM_ACTIVE_DUE_DILIGENCE",
      privilege: "VM_VENDOR_RELATIONSHIP_ASSOCIATE",
    },
    {
      title: "Approved Due Diligence",
      report: "SM_APPROVED_DUE_DILIGENCE",
      privilege: "VM_VENDOR_MANAGER",
    },
    // {
    //   title: "Vendor Life Cycle",
    //   report: "VM_VENDOR_LIFE_CYCLE",
    //   privilege: "VM_VENDOR_BUSINESS_USER",
    // },
  ];
  const combinedItems = [
    ...forms.map((item) => ({ ...item, type: "form" })),
    ...reports.map((item) => ({ ...item, type: "report" })),
  ];
  return (
    <>
      <LandingPagesTitle
        title={t("Vendor Management")}
        privileges={"VM_VENDOR_ADMIN"}
        configrationForm="vendorconfiguration"
        // privileges="IR_ISSUE_ADMINISTRATOR"
      />

      <FormReportChartLink combinedItems={combinedItems} />
      <Row>
        {privs.includes("VM_VENDOR_ADMIN") && (
          <ReportRuntime report="VM_TRIAGE_PRODUCT_SERVICE" />
        )}
      </Row>
      <Row>
        {privs.includes("VM_CREATE_PS") && (
          <>
            <ReportRuntime report="VM_REPORTED_BY_ME" />
            <ReportRuntime
              report="VM_VENDOR_BY_BUSINESS_UNITS"
              pivotTable
              drilldownReports={{ objectId: objectId }}
            />
            <Row>
              <Col>
                <Chart
                  chart="VM_PRODUCT_SERVICE_BY_STATUS"
                  defaultFilter={{ processId: objectId }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Chart
                  chart="VM_PRODUCT_SERVICE_BY_CATEGORY"
                  defaultFilter={{ processId: objectId }}
                />
              </Col>
              <Col>
                <Chart
                  chart="VM_PRODUCT_SERVICE_BY_CRITICALITY"
                  defaultFilter={{ processId: objectId }}
                />
              </Col>
            </Row>
          </>
        )}
      </Row>

      {(privs.includes("VM_VENDOR_RELATIONSHIP_ASSOCIATE") ||
        privs.includes("VM_VENDOR_MANAGER")) && (
        <>
          <Row>
            <ReportRuntime report="VM_MY_PRODUCT_SERVICE_REQUESTS" dataCard />
          </Row>
          <Row>
            <ReportRuntime report="VM_MY_PRODUCT_SERVICE_REQUESTS" />
          </Row>
        </>
      )}
    </>
  );
};

export default VendorRiskManagament;
