import React, { useState, useEffect, useRef, useMemo } from "react";
import { Container, Tab } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getviewData,
  getCountByFiscalyear,
  getCountoflastquarted,
  getPresentFinanceyearTotalcount,
  getCountOfPreviousFinanceYear,
  getCountofFramework,
  getTotalLoss,getVendorsummary,
  getIssueSummary
} from "../GrcService";
import { PageBreadCrumb, PageBreadCrumbItem } from "./PageUtils";
import Overview from "../BuSummaryData/OverView";
import Complianceposture from "../BuSummaryData/CompliancePosture";
import Businessresilience from "../BuSummaryData/BusinessResilience";
import Riskposture from "../BuSummaryData/RiskPosture";
import LossManagement from "../BuSummaryData/Loss";
import VendorThirdparty from "../BuSummaryData/VendorTP";
import IssueManagement from "../BuSummaryData/Issues";
import Aigenerate from "../BuSummaryData/AiGenerate";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import { faBriefcase, faPencil } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
const Default = () => {
    const {t}=useTranslation("common")
  const [businessData, setBusinessData] = useState(null);
  const [countoflastquarted, setCountoflastquarted] = useState(null);
  const [lossData, setLossData] = useState(null);
  const [parentBusinessUnits, setParentBusinessInits] = useState([]);
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  const [budata, setBudata] = useState(null);
  const [options, setOptions] = useState([]);
  const [refreshCharts, setRefreshCharts] = useState(false);
  const [businessResilienceData, setBusinessResilienceData] = useState(null);
  const [presentFinanceyearTotalcount,setPresentFinanceyearTotalcount]=useState(null);
  const [countOfPreviousFinanceYear,setCountOfPreviousFinanceYear]=useState(null);
  const [countofFramework,setCountofFramework]=useState(null)
  const [totalLoss,setTotalLoss]=useState(null)
  const [vendorData,setVendorData]=useState(null);
  const [issueData,setIssueData]=useState(null);
  let [yearProps, setYearProps] = React.useState(new Date().getFullYear());
  const initialTabs = window.history.state?.activeTab || "OVERVIEW";
  const [activeTabs, setActiveTabs] = useState(initialTabs);
  console.log("yearProp", yearProps);

  const handleYearCallback = (year) => {
    setYearProps(year);
  };

  const handleSelected = (key) => {
    if (key !== null) {
      setActiveTabs(key);
      window.history.replaceState({ activeTab: key }, "");
    }
  };

  const getParentHierarchy = (unit, allBusinessUnits) => {
    let parents = new Set();
    let hierarchy = [];

    while (unit && unit?.parent_entity_id !== 1) {
      // Check if we've already visited this entity to avoid infinite loops
      if (parents.has(unit.business_entity_id)) {
        console.warn("Circular reference detected:", unit);
        break;
      }

      const parentUnit = allBusinessUnits.find(
        (bu) => bu?.business_entity_id === unit?.parent_entity_id
      );

      console.log(parentUnit, "parent unit");

      if (parentUnit) {
        hierarchy.push(parentUnit);
        parents.add(unit.business_entity_id); // Mark as visited
        unit = parentUnit; // Move up the hierarchy
      } else {
        break; // Break if no parent is found
      }
    }

    console.log(hierarchy, "parent business units");
    return hierarchy;
  };

  const fetchBusinessHierarchy = () => {
    getviewData({
      viewName: "pa_business_entity_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: ``,
    })
      .then((response) => {
        const businessUnits = response?.data?.data;

        const currentBusinessUnit = businessUnits?.filter(
          (bu) => String(bu?.business_entity_id) === String(objectId)
        );

        const parentHierarchy = getParentHierarchy(
          currentBusinessUnit[0],
          businessUnits
        );
        setParentBusinessInits(parentHierarchy);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchBuData = () => {
    getviewData({
      viewName: "pa_business_entity_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `business_entity_id=${objectId}`,
    })
      .then((response) => {
        setBudata(response.data.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const currentUser = JSON.parse(localStorage?.current_logged_User)[0]
    .user_details?.data[0]?.user_id;

  const fetchBusinessUnits = () => {
    getviewData({
      viewName: "PA_GL_BUSINESS_UNITS_FOR_BU_SUMMARY_V",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "order by business_entity_name",
      filterExpression: `
        user_id=${currentUser}
      `,
    })
      .then((response) => {
        const formattedOptions = response.data.data
          .filter((entity) => entity.business_entity_name !== "Enterprise")
          .map((entity) => ({
            value: entity.business_entity_id,
            label: entity.business_entity_name,
          }));
        setOptions(formattedOptions);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const grcTotalData = async () => {
    if (!objectId) return;
    try {
      const response = await getCountByFiscalyear(
        "grcTotalData",
        objectId,
        yearProps
      );
      setBusinessData(response.data);
      console.log(response.data, "dctfgyuh");
    } catch (error) {
      console.error("Error fetching business data:", error);
    }
  };


  // const quarterlyTotalsAndAssessed = async () => {
  //   if (!objectId) return;

  //   try {
  //     const response = await getCountoflastquarted(
  //       "totalAssessedLastQuaterCount",
  //       objectId,
  //       "2024",
  //       "2025"
  //     );
  //     setCountoflastquarted(response.data);

  //     console.log(response.data, "responsssss");
  //   } catch (error) {
  //     console.error("Error fetching business data:", error);
  //   }
  // };


  const fetchPresentFinanceyearTotalcount = async () => {
    if (!objectId) return;
    try {
      const response = await getPresentFinanceyearTotalcount(
        "presentFinanceyearTotalcount",
        objectId,
        yearProps
      );
      setPresentFinanceyearTotalcount(response.data);
      console.log(response.data, "dctfgyuh");
    } catch (error) {
      console.error("Error fetching business data:", error);
    }
  };


  const fetchCountOfPreviousFinanceYear = async () => {
    if (!objectId) return;
    try {
      const response = await getCountOfPreviousFinanceYear(
        "countOfPreviousFinanceYear",
        objectId,
        yearProps
      );

      console.log(response ,"uuuuuuuu");
      
      setCountOfPreviousFinanceYear(response.data);
      console.log(response.data, "dctfgyuh");
    } catch (error) {
      console.error("Error fetching business data:", error);
    }
  };


  const fetchCountofFramework = async () => {
    if (!objectId) return;
    try {
      const response = await getCountofFramework(
        "countofFramework",
        objectId,
        yearProps
      );

      console.log(response ,"uuuuuuuu");
      
      setCountofFramework(response.data);
      console.log(response.data, "dctfgyuh");
    } catch (error) {
      console.error("Error fetching business data:", error);
    }
  };


  const fetchVendorSummary = async () => {
    if (!objectId) return;
    try {
      const response = await getVendorsummary(
        "vendorsummary",
        objectId,
        yearProps
      );
      setVendorData(response.data);
    } catch (error) {
      console.error("Error fetching business data:", error);
    }
  };


  const fetchIssueSummary = async () => {
    if (!objectId) return;
    try {
      const response = await getIssueSummary(
        "issueSummary",
        objectId,
        yearProps
      );
      setIssueData(response.data);
    } catch (error) {
      console.error("Error fetching business data:", error);
    }
  };


  const fetchTotalLoss = async () => {
    if (!objectId) return;
    try {
      const response = await getTotalLoss(
        "totalLoss",
        objectId,
        yearProps
      );
      setTotalLoss(response.data);
    } catch (error) {
      console.error("Error fetching business data:", error);
    }
  };

  useEffect(() => {
    fetchBuData();
    fetchBusinessUnits();
    fetchBusinessHierarchy();
    grcTotalData();
    // quarterlyTotalsAndAssessed();
    fetchPresentFinanceyearTotalcount();
    fetchCountOfPreviousFinanceYear();
    fetchCountofFramework();
    fetchTotalLoss(); 
    fetchVendorSummary();
    fetchIssueSummary();
    setRefreshCharts((prev) => !prev);
  }, [objectId, yearProps]);

  const navigate = useNavigate();
  const handleBuChange = (selectedOption) => {
    if (selectedOption) {
      navigate(`/page?name=GL_BU_SUMMARY&objectId=${selectedOption.value}`);
    } else {
      console.log("No option selected");
    }
  };

  return (
    <div>
      <Container fluid className="p-3">
        <div className="sticky-top  z-1">
          <PageBreadCrumb>
            <PageBreadCrumbItem
              title={"Business Unit Environment"}
              isDropdown={true}
              options={options}
              onChange={handleBuChange}
            />
            <PageBreadCrumbItem title={budata?.business_entity_name} />
            {parentBusinessUnits && (
              <>
                {parentBusinessUnits?.map((bu) => (
                  <PageBreadCrumbItem title={bu?.business_entity_name} />
                ))}
              </>
            )}
          </PageBreadCrumb>
          <Tab.Container
            id="menu"
            activeKey={activeTabs}
            onSelect={handleSelected}
          >
            <LandingPagesTitle
              title={budata?.business_entity_name}
              onYearChange={handleYearCallback}
              showYearFilter
              fontawsomeIcon={faBriefcase}
              tabs={[
                {
                  title: t("Overview"),
                  key: "OVERVIEW",
                  privilege: "GL_CREATE_GRC",
                },
                {
                  title: t("Risk Outlook"),
                  key: "RISK_OUTLOOK",
                  privilege: "GL_CREATE_GRC",
                },
                {
                  title: t("Compliance Posture"),
                  key: "COMPLIANCE_POSTRUE",
                  privilege: "GL_CREATE_GRC",
                },
                {
                  title: t("Business Resilience"),
                  key: "BUSSINESS_RESILIENCE",
                  privilege: "GL_CREATE_GRC",
                },
                {
                  title: t("Loss Management"),
                  key: "LOSS_MANAGEMENT",
                  privilege: "GL_CREATE_GRC",
                },
                {
                  title: t("Vendors/Third Parties"),
                  key: "THIRDPARTY_VENDORS",
                  privilege: "GL_CREATE_GRC",
                },
                {
                  title: t("Issues"),
                  key: "ISSUES",
                  privilege: "GL_CREATE_GRC",
                },
                {
                  title: t("RiskVision AI"),
                  key: "RISKVISION_AI",
                  privilege: "GL_CREATE_GRC",
                },
              ]}
            />
            <Tab.Content className="pt-3">
              <Tab.Pane eventKey="OVERVIEW" unmountOnExit>
                <Overview
                  objectId={objectId}
                  refreshCharts={refreshCharts}
                  yearStr={yearProps}
                  businessData={businessData}
                  countoflastquarted={countoflastquarted}
                  presentFinanceyearTotalcount={presentFinanceyearTotalcount}
                  countOfPreviousFinanceYear={countOfPreviousFinanceYear}
                  countofFramework={countofFramework}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="RISK_OUTLOOK" unmountOnExit>
                <Riskposture
                  objectId={objectId}
                  refreshCharts={refreshCharts}
                  yearStr={yearProps}
                  businessData={businessData}
                  countoflastquarted={countoflastquarted}
                  countofFramework={countofFramework}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="COMPLIANCE_POSTRUE" unmountOnExit>
                <Complianceposture
                  objectId={objectId}
                  refreshCharts={refreshCharts}
                  yearStr={yearProps}
                  businessData={businessData}
                  countoflastquarted={countoflastquarted}
                  countofFramework={countofFramework}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="BUSSINESS_RESILIENCE" unmountOnExit>
                <Businessresilience
                  objectId={objectId}
                  refreshCharts={refreshCharts}
                  yearStr={yearProps}
                  businessData={businessData}
                  countofFramework={countofFramework}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="LOSS_MANAGEMENT" unmountOnExit>
                <LossManagement
                  objectId={objectId}
                  refreshCharts={refreshCharts}
                  yearStr={yearProps}
                  totalLoss={totalLoss}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="THIRDPARTY_VENDORS" unmountOnExit>
                <VendorThirdparty
                  objectId={objectId}
                  refreshCharts={refreshCharts}
                  businessData={businessData}
                  yearStr={yearProps}
                  vendorData={vendorData}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="ISSUES" unmountOnExit>
                <IssueManagement
                  objectId={objectId}
                  refreshCharts={refreshCharts}
                  yearStr={yearProps}
                  issueData={issueData}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="RISKVISION_AI" unmountOnExit>
                <Aigenerate />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Container>
    </div>
  );
};

export default Default;
