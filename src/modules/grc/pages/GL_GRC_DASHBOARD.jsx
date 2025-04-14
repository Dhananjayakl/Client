import React from "react";
import { Helmet } from "react-helmet-async";
import { Container } from "react-bootstrap";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import GlGrcFrameworks from "./GL_GRC_FRAMEWORKS";
import ReportRuntime from "src/components/reports/Report";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import { useTranslation } from "react-i18next";
const Default = () => {
  const {t}=useTranslation("common")
  let privs = util.getCurrentUser().privileges?.split(",");
  // GRC Registry & Framework Forms
  let forms = [
    {
      title: "Process",
      form: "process",
      privilege: "GL_CREATE_PROCESS",
      upload: true,
    },
    {
      title: "Control",
      form: "control",
      privilege: "GL_CREATE_CONTROL",
      upload: true,
    },
    {
      title: "Risk",
      form: "risk",
      privilege: "GL_CREATE_RISK",
      upload: true,
    },
    {
      title: "Area of Compliance",
      form: "areaofcompliance",
      privilege: "GL_CREATE_AOC",
      upload: true,
    },
    {
      title: "Requirement",
      form: "requirement",
      privilege: "GL_CREATE_REQUIREMENT",
      upload: true,
    },
    {
      title: "Exception",
      form: "exception",
      privilege: "GL_CREATE_EXCEPTION",
      upload: true,
    },
    {
      title: "Standard",
      form: "standard",
      privilege: "GL_CREATE_STANDARD",
      upload: true,
    },
    {
      title: "Asset",
      form: "asset",
      privilege: "GL_CREATE_ASSET",
      upload: true,
    },
    {
      title: "Regulatory Body",
      form: "regulatorybody",
      privilege: "GL_CREATE_REG_BODY",
      upload: true,
    },
    {
      title: "Test and Procedures",
      form: "testandprocedures",
      privilege: "GL_CREATE_TEST_PROCEDURE",
      upload: true,
    },
    {
      title: "Third Party/Vendors",
      form: "thirdparty",
      privilege: "GL_CREATE_THIRD_PARTY",
      upload: true,
    },
    {
      title: "Standard Operating Procedures",
      form: "standardoperatingprocedures",
      privilege: "GL_CREATE_SOP",
      upload: true,
    },
    {
      title: "Key Risk Indicators",
      form: "kriLibrary",
      privilege: "GL_CREATE_KRI",
      upload: true,
    },
    {
      title: "Process Compliance Framework",
      form: "relationship",
      privilege: "GL_PROCESS_COM_FRAMEWORK",
      upload: true,
    },
    {
      title: t("Business Resilience Framework"),
      form: "businessresilienceframework",
      privilege: "GL_BUSINESS_RES_FRAMEWORK",
      upload: true,
    },
    {
      title: t("Regulatory Compliance Framework"),
      form: "regulatorycompliance",
      privilege: "GL_REGULATORY_COM_FRAMEWORK",
      upload: true,
    },
    {
      title: t("Internal Audits Framework"),
      form: "internalaudits",
      privilege: "GL_IA_CREATE",
      upload: true,
    },
    {
      title: t("Threat"),
      form: "threat",
      privilege: "GL_CREATE_ASSET",
      upload: true,
    },
    {
      title: t("Vulnerabilities"),
      form: "vulnerabilities",
      privilege: "GL_CREATE_ASSET",
      upload: true,
    },
  ];

  // GRC List Reports
  let reports = [
    { title: "Process", report: "GL_PROCESS", privilege: "GL_VIEW_PROCESS" },
    { title: "Control", report: "GL_CONTROL", privilege: "GL_VIEW_CONTROL" },
    { title: "Risk", report: "GL_RISK", privilege: "GL_VIEW_RISK" },
    {
      title: "Area of Compliance",
      report: "GL_AREAOFCOMPLIANCE",
      privilege: "GL_VIEW_AOC",
    },
    {
      title: "Requirement",
      report: "GL_REQUIREMENT",
      privilege: "GL_VIEW_REQUIREMENT",
    },
    {
      title: "Exception",
      report: "GL_EXCEPTION",
      privilege: "GL_VIEW_EXCEPTION",
    },
    {
      title: "Standard",
      report: "GL_STANDARD",
      privilege: "GL_VIEW_STANDARD",
    },
    { title: "Asset", report: "GL_ASSET", privilege: "GL_VIEW_ASSET" },
    {
      title: "Regulatory Body",
      report: "GL_REGULATORYBODY",
      privilege: "GL_VIEW_REG_BODY",
    },
    {
      title: "Test and Procedures",
      report: "GL_TESTANDPROCEDURES",
      privilege: "GL_VIEW_TEST_PROCEDURE",
    },
    {
      title: "Third Party/Vendors",
      report: "GL_THIRD_PARTY",
      privilege: "GL_VIEW_THIRD_PARTY",
    },
    {
      title: "Standard Operating Procedures",
      report: "GL_STANDARD_OPERATING_PROCEDURES",
      privilege: "GL_VIEW_SOP",
    },

    {
      title: "Key Risk Indicators",
      report: "GL_KRI_LIBRARY",
      privilege: "GL_VIEW_KRI",
    },

    {
      title: t("KRI Data Collection"),
      report: "GL_KRI_TASK",
      privilege: "GL_VIEW_KRI_TASK",
    },
    {
      title: "Process Compliance Framework",
      report: "GL_PROCESS_COMPLINACE_FRAMEWORK",
      privilege: "GL_PROCESS_COM_FRAMEWORK",
    },
    {
      title: "Business Resilience Framework",
      report: "GL_BUSINESS_RESILIENCE",
      privilege: "GL_BUSINESS_RES_FRAMEWORK",
    },
    {
      title: "Regulatory Compliance Framework",
      report: "GL_REGULATORY_COMPLIANCE",
      privilege: "GL_REGULATORY_COM_FRAMEWORK",
    },
    {
      title: "Internal Audits Framework",
      report: "GL_INTERNAL_AUDITS",
      privilege: "GL_IA_CREATE",
    },
    {
      title: "Threat",
      report: "GL_THREAT",
      privilege: "GL_CREATE_ASSET",
    },
    {
      title: "Vulnerabilities",
      report: "GL_VULNERABILITIES",
      privilege: "GL_CREATE_ASSET",
    },
  ];

  const combinedItems = [
    ...forms.map((item) => ({ ...item, type: "form" })),
    ...reports.map((item) => ({ ...item, type: "report" })),
  ];

  return (
    <>
      <Helmet title="GRC Foundation" />
      <Container fluid className="p-0 m-0">
        <div>
          <LandingPagesTitle
            title={t("Create/Manage GRC")}
            configrationForm={"configurationsetup"}
            privileges={"GL_GRC_ADMIN"}
          />
          <FormReportChartLink combinedItems={combinedItems} />
          <ReportRuntime report="GL_APPLICABLE_BUSINESS_UNITS" />
          {(privs.includes("GL_PROCESS_COM_FRAMEWORK") ||
            privs.includes("GL_REGULATORY_COM_FRAMEWORK") ||
            privs.includes("GL_INTERNAL_AUDIT_FRAMEWORK")) && (
            <GlGrcFrameworks />
          )}
        </div>
      </Container>
    </>
  );
};

export default Default;
