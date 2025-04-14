import React from "react";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Card,
  Collapse,
} from "react-bootstrap";
import HybridSection from "src/components/forms/reactformutils/fields/HybridSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import axios from "src/utils/AxiosInstance";

import {
  faCogs,
  faUsers,
  faClipboardList,
  faFileContract,
  faFileInvoice,
  faUserTimes,
  faHandshake,
  faFileShield,
  faCheckCircle,
  faMoneyCheckDollar,
  faBuilding,
  faBuildingColumns,
} from "@fortawesome/free-solid-svg-icons";
import { Bar, Doughnut } from "react-chartjs-2";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import ActiveVendorDetails from "../mockuputils/ActiveVendorDetails";
import ProductServiceDetails from "../mockuputils/ProductServiceDetails";
import OnboardingVendorDetails from "../mockuputils/OnboardingVendorDetails";
import TerminatedVendorDetails from "../mockuputils/TerminatedVendorDetails";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Legend,
  Tooltip
);
import Section from "../mockuputils/section";

export const applyHoverEffects = (e, isEntering) => {
  if (isEntering) {
    e.currentTarget.style.position = "relative";
    e.currentTarget.style.transform = "scale(1.04)";
    e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
    // e.currentTarget.style.zIndex = "5";
    e.currentTarget.style.border = "1px solid #d3d3d3";
  } else {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
    e.currentTarget.style.zIndex = "1";
    e.currentTarget.style.border = "1px solid #d3d3d3";
  }
};

const VM_MANAGEMENT_MOCKUP = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [cardData, setCardData] = useState();
  const [businessCriticalityData, setBusinessCriticalityData] = useState();
  const [allData, setAllData] = useState();
  const [expiredProductData, setExpiredProductData] = useState();
  const [onboardingData, setOnboardingData] = useState();
  const [activeVendorDetails, setActiveVendorDetails] = useState();
  const [rejectedVendorDetails, setRejectedVendorDetails] = useState();
  console.log(
    rejectedVendorDetails,
    "rejectedVendorDetailsrejectedVendorDetails"
  );

  const navigate = useNavigate();
  let currentUserInfo = {
    logInId: util.getCurrentUser().id,
    privileges: util.getCurrentUser().privileges.split(","),
  };

  const handleYearCallback = (year) => {
    setSelectedYear(year);
    console.log(year, typeof year, "year changed");
  };

  const handleClick = (route) => {
    navigate(route);
  };

  const fetchCardData = async (logInId, year) => {
    const response = await axios.get(
      `/VendorRiskManagement/countOfThirdPartyAndProducts/${logInId}?year=${Number(
        year
      )}`
    );
    setCardData(response.data);
    console.log(response.data, "data card response");
  };

  const fetchData = async (logInId, year) => {
    const response = await axios.get(
      `/VendorRiskManagement/vmgrcOverview/${logInId}?year=${Number(year)}`
    );
    setAllData(response.data);
    console.log(response.data, "data card response");
  };

  const fetchBusinessCriticalityData = async (logInId, year) => {
    const response = await axios.get(
      `/VendorRiskManagement/productServiceOnCriticality/${logInId}?year=${Number(
        year
      )}`
    );
    setBusinessCriticalityData(response.data);
    console.log(response.data, "data card response");
  };

  const fetchExpiredProductData = async (logInId, year) => {
    const response = await axios.get(
      `/VendorRiskManagement/experingproduct/${logInId}?year=${Number(year)}`
    );
    setExpiredProductData(response.data);
    console.log(response.data, "data card response");
  };

  const fetchOnboardingData = async (logInId, year) => {
    const response = await axios.get(
      `/VendorRiskManagement/CountOfOnBoardingVendorDetails/${logInId}?year=${Number(
        year
      )}`
    );
    setOnboardingData(response.data);
    console.log(response.data, "data card response");
  };

  const fetchCountOfActiveVendorDetails = async (logInId, year) => {
    const response = await axios.get(
      `/VendorRiskManagement/CountOfActiveVendorDetails/${logInId}?year=${Number(
        year
      )}`
    );
    setActiveVendorDetails(response.data);
    console.log(response.data, "data card response");
  };

  const fetchCountOfRejectedVendorDetails = async (logInId, year) => {
    const response = await axios.get(
      `/VendorRiskManagement/rejectingProduct/${logInId}?year=${Number(year)}`
    );
    setRejectedVendorDetails(response.data);
    console.log(response.data, "data card response");
  };

  useEffect(() => {
    fetchCardData(currentUserInfo.logInId, selectedYear);
    fetchData(currentUserInfo.logInId, selectedYear);
    fetchBusinessCriticalityData(currentUserInfo.logInId, selectedYear);
    fetchExpiredProductData(currentUserInfo.logInId, selectedYear);
    fetchOnboardingData(currentUserInfo.logInId, selectedYear);
    fetchCountOfActiveVendorDetails(currentUserInfo.logInId, selectedYear);
    fetchCountOfRejectedVendorDetails(currentUserInfo.logInId, selectedYear);
  }, [selectedYear]);

  const cardDataArray = [
    {
      id: 1,
      title: "Process",
      number: allData?.process_bt,
      icon: faCogs,
      action: "Create",
      report: "GL_PROCESS",
      api: "process",
    },
    {
      id: 2,
      title: "Third-Party",
      number: allData?.thirdparty_bt,
      icon: faUsers,
      action: "Create",
      report: "GL_THIRD_PARTY",
      api: "thirdparty",
    },
    {
      id: 3,
      title: "Questionnaire",
      number: allData?.["vendormanagementdata"]?.questionnariesCount,
      icon: faClipboardList,
      action: "Create",
      report: "SM_QUESTIONNAIRE_REPORT",
      api: "questionnaire",
    },
    {
      id: 4,
      title: "Product/Service",
      number: allData?.["vendormanagementdata"]?.ProductServiceQuerycount,
      icon: faFileContract,
      action: "Initiate",
      report: "VM_PRODUCT_VENDOR_LIFE_CYCLE",
      api: "productservice",
    },
    {
      id: 5,
      title: "Due-Diligence",
      number: allData?.["vendormanagementdata"]?.dueDiligenceCount,
      icon: faFileInvoice,
      action: "Initiate",
      report: "SM_ONGOING_DUE_DILIGENCE",
      api: "duediligence",
    },
    {
      id: 6,
      title: "Terminate",
      number: allData?.["vendormanagementdata"]?.terminateCount,
      icon: faUserTimes,
      action: "Initiate",
      report: "VM_TERMINATION_REPORT",
      api: "vendorTermination",
    },
  ];
  return (
    <div>
      <Container fluid className="p-3">
        <div className="shadow sticky-top bg-white z-1">
          <Tab.Container id="menu" defaultActiveKey="CREATE/MANAGE">
            <LandingPagesTitle
              title={"Vendor Risk Management"}
              fontawsomeIcon={faHandshake}
              onYearChange={handleYearCallback}
              showYearFilter
              tabs={[
                {
                  title: "Create/Manage",
                  key: "CREATE/MANAGE",
                  privilege: "VM_CREATE_PS",
                },
                {
                  title: "Applicable Business Units",
                  key: "APPLICABLE_BUSIENESS_UNITS",
                  privilege: "VM_CREATE_PS",
                },
                {
                  title: "Admin Setup",
                  key: "ADMIN_SETUP",
                  privilege: "VM_CREATE_PS",
                },
              ]}
            />

            <Tab.Content className="bg-white pt-3">
              <Tab.Pane eventKey="CREATE/MANAGE">
                <Create_manage
                  currentUserInfo={currentUserInfo}
                  cardDataArray={cardDataArray}
                  businessCriticalityData={businessCriticalityData}
                  expiredProductData={expiredProductData}
                  onboardingData={onboardingData}
                  activeVendorDetails={activeVendorDetails}
                  rejectedVendorDetails={rejectedVendorDetails}
                  handleClick={handleClick}
                  cardData={cardData}
                  year={selectedYear}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="APPLICABLE_BUSIENESS_UNITS">
                <Applicable_business_units
                  handleClick={handleClick}
                  currentUserInfo={currentUserInfo}
                  year={selectedYear}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="ADMIN_SETUP">
                <Admin_setup
                  currentUserInfo={currentUserInfo}
                  handleClick={handleClick}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Container>
    </div>
  );
};

const Create_manage = ({
  cardDataArray,
  handleClick,
  currentUserInfo,
  year,
  cardData,
  businessCriticalityData,
  expiredProductData,
  onboardingData,
  activeVendorDetails,
  rejectedVendorDetails,
}) => {
  console.log(cardData, "card data");

  const cardSubData = [
    {
      status: "Active",
      count: cardData?.["Total Vendors / Third-Parties"]?.["Active thirdparty"],
    },
    {
      status: "On Boarding",
      count: cardData?.["Total Vendors / Third-Parties"]?.["On Boarding"],
    },
    {
      status: "Terminated",
      count: cardData?.["Total Vendors / Third-Parties"]?.["Terminated"],
    },
  ];

  const cardSubData2 = [
    {
      status: "Active",
      count: cardData?.["Total Products / Services"]?.["Active Products"],
    },
    {
      status: "Expired",
      count: cardData?.["Total Products / Services"]?.["Experied Products"],
    },
    {
      status: "Rejected",
      count: cardData?.["Total Products / Services"]?.["Rejected Products"],
    },
  ];

  return (
    <>
      <Row className="d-flex flex-wrap g-3">
        {[
          {
            title: "Total Vendors / Third-Parties",
            icon: (
              <FontAwesomeIcon
                icon={faUsers}
                className="text-secondary"
                style={{ fontSize: "40px" }}
              />
            ),
            total:
              cardData?.["Total Vendors / Third-Parties"]?.["Total thirdparty"],
            subData: cardSubData,
          },
          {
            title: "Total Products / Services",
            icon: (
              <FontAwesomeIcon
                icon={faFileInvoice}
                className="text-secondary"
                style={{ fontSize: "40px" }}
              />
            ),
            total: cardData?.["Total Products / Services"]?.["Total Products"],
            subData: cardSubData2,
          },
        ].map((item, index) => (
          <Col key={index} md={6} className="mb-3">
            <Card
              className="reportChart-cards"
              style={{
                background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                backgroundColor: "#f5f7f6",
                borderRadius: "12px",
                padding: "13px",
                minHeight: "70px",
                marginLeft: "3px",
                marginRight: "3px",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.1s ease-in-out",
                border: "1px solid #90caf9",
              }}
              onMouseEnter={(e) => applyHoverEffects(e, true)}
              onMouseLeave={(e) => applyHoverEffects(e, false)}
            >
              <Card.Body className="d-flex flex-column justify-content-between h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Subtitle className="text-dark mb-0">
                    {item.title}
                  </Card.Subtitle>
                  {item.icon}
                </div>
                <Card.Title className="fw-bold fs-1">{item.total}</Card.Title>

                <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3 mt-1">
                  {item.subData.map((data, i) => (
                    <span key={i} className="fw-bold text-dark fs-6 fs-md-5">
                      {data?.status}:{" "}
                      <span className="text-muted">{data?.count}</span>
                    </span>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row
        className="d-flex flex-wrap justify-content-center g-2"
        style={{ marginTop: "-30px" }}
      >
        {cardDataArray.map((card) => (
          <Col key={card.id} className="p-2">
            <Card
              className="reportChart-cards d-flex flex-column justify-content-between"
              style={{
                background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                backgroundColor: "#f5f7f6",
                borderRadius: "12px",
                height: "auto",
                padding: "15px",
                minHeight: "130px",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out",
                cursor: "pointer",
                // border: "1px solid #ccc",
                border: "1px solid #90caf9",
              }}
              onMouseEnter={(e) => applyHoverEffects(e, true)}
              onMouseLeave={(e) => applyHoverEffects(e, false)}
            >
              <div className="d-flex align-items-center justify-content-between">
                <h5
                  className="mb-1 text-truncate flex-grow-1"
                  style={{ minWidth: 0, maxWidth: "80%", whiteSpace: "nowrap" }}
                  title={card.title}
                >
                  {card.title}
                </h5>
                <FontAwesomeIcon
                  icon={card.icon}
                  className="text-secondary flex-shrink-0"
                  style={{ fontSize: "20px" }}
                />
              </div>

              <div
                className="d-flex justify-content-center align-items-center"
                style={{ flexGrow: 1 }}
              >
                <p
                  className="fw-bold mb-0"
                  style={{ fontSize: "22px", color: "#333" }}
                >
                  {card.number}
                </p>
              </div>
              <div className="border-top w-100"></div>
              <div className="d-flex w-100">
                <button
                  className="flex-grow-1 text-primary py-2 border-0 bg-transparent fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    if (e.button === 0) {
                      e.preventDefault();
                      handleClick(`/form/runtime?formService=${card.api}`);
                    }
                  }}
                >
                  {card.action}
                </button>
                <div
                  className="border-start"
                  style={{ borderLeft: "2px solid #007BFF" }}
                ></div>
                <button
                  className="flex-grow-1 text-primary py-2 border-0 bg-transparent fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    if (e.button === 0) {
                      e.preventDefault();
                      handleClick(`/report?report=${card.report}`);
                    }
                  }}
                >
                  View
                </button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Section
        title={"Product/Service Details"}
        headerClass="bg-primary bg-gradient bg-opacity-55"
        field4={
          <ProductServiceDetails
            businessCriticalityData={businessCriticalityData}
            expiredProductData={expiredProductData}
            rejectedVendorDetails={rejectedVendorDetails}
          />
        }
      >
        <Row>
          <ProductServiceDetails
            businessCriticalityData={businessCriticalityData}
            expiredProductData={expiredProductData}
            rejectedVendorDetails={rejectedVendorDetails}
          />
        </Row>
        field1=
        {
          "The vendor lifecycle encompasses the stages from vendor selection to contract termination. Effective vendor management throughout this lifecycle ensures that risks are minimized, compliance is achieved, and performance standards are met."
        }
      </Section>

      <Section
        title={"Active Vendor Details"}
        headerClass="bg-warning bg-gradient bg-opacity-55"
        field4={
          <ActiveVendorDetails activeVendorDetails={activeVendorDetails} />
        }
      >
        <ActiveVendorDetails activeVendorDetails={activeVendorDetails} />
        field1=
        {
          "The vendor lifecycle encompasses the stages from vendor selection to contract termination. Effective vendor management throughout this lifecycle ensures that risks are minimized, compliance is achieved, and performance standards are met."
        }
      </Section>

      <Section
        title={"On-Boarding Vendor Details"}
        headerClass="bg-secondary bg-gradient bg-opacity-55"
        field4={<OnboardingVendorDetails onboardingData={onboardingData} />}
      >
        <OnboardingVendorDetails onboardingData={onboardingData} />
        field1=
        {
          "The vendor lifecycle encompasses the stages from vendor selection to contract termination. Effective vendor management throughout this lifecycle ensures that risks are minimized, compliance is achieved, and performance standards are met."
        }
      </Section>

      <Section
        title={"Terminated Vendor Details"}
        headerClass="bg-dark bg-gradient bg-opacity-55"
        field4={<TerminatedVendorDetails cardData={cardData} />}
      >
        <TerminatedVendorDetails cardData={cardData} />
        field1=
        {
          "The vendor lifecycle encompasses the stages from vendor selection to contract termination. Effective vendor management throughout this lifecycle ensures that risks are minimized, compliance is achieved, and performance standards are met."
        }
      </Section>
    </>
  );
};

const Applicable_business_units = ({ currentUserInfo, year, handleClick }) => {
  const [applicableBData, setApplicableBuData] = useState([]);
  const { logInId } = currentUserInfo;
  const fetchBusinessUnitData = async () => {
    try {
      const response = await axios.get(
        `riskmanagement/applicableBusinessUnit/${logInId}?year=${year}`
      );
      console.log(response.data, "business unit data ratings");

      const formattedData = Array.isArray(response.data)
        ? response.data
        : Object.values(response.data);

      setApplicableBuData(formattedData);
    } catch (error) {
      console.error("Error fetching business unit data:", error);
    }
  };

  useEffect(() => {
    fetchBusinessUnitData();
  }, [year]);

  console.log(applicableBData, "applicable business unit data");
  return (
    <>
      <Row className="p-0 m-0 d-flex justify-content-center align-items-center">
        {applicableBData?.map((unit, index) => (
          <div
            className="col-10 col-md-7 d-flex-column justify-content-evenly align-items-center"
            key={index}
          >
            <Card
              className="reportChart-cards"
              style={{
                minHeight: "80px",
                backgroundImage:
                  "linear-gradient(to top, #dfe9f3 0%, white 100%)",
                borderRadius: "8px",
              }}
              onMouseEnter={(e) => applyHoverEffects(e, true)}
              onMouseLeave={(e) => applyHoverEffects(e, false)}
              onClick={(e) => {
                if (e.button === 0) {
                  e.preventDefault();
                  handleClick(
                    `/page?name=GL_BU_SUMMARY&objectId=${unit?.parentBuId}`
                  );
                }
              }}
            >
              <Card.Body>
                <Row className="mt-1 d-flex justify-content-between align-items-center">
                  {/* Business Unit Name */}
                  <Col
                    md={9}
                    className="d-flex justify-content-start align-items-center"
                  >
                    <h4 style={{ color: "#09203f" }}>
                      {unit.businessUnitName}
                    </h4>
                  </Col>
                  <Col md={3} className="text-center">
                    <FontAwesomeIcon
                      icon={unit.parentBuId ? faBuilding : faBuildingColumns}
                      size="2x"
                      style={{ color: "#09203f", cursor: "pointer" }}
                    />
                    <h5 style={{ color: "#09203f" }}>
                      {unit.parentBuId ? `Child` : `Root`}
                    </h5>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Row>
    </>
  );
};

const Admin_setup = ({ privs, handleClick }) => {
  return (
    <>
      <Row className="p-0 m-0 d-flex justify-content-evenly align-items-circle">
        {[
          {
            title: "GRC Setup",
            icon: faFileShield,
            form: "configurationsetup",
            subtitle: "Initiate",
          },

          {
            title: "Survey Management Setup",
            icon: faCheckCircle,
            form: "surveyconfigurationsetup",
            subtitle: "Initiate",
          },

          {
            title: "Vendor Management Setup",
            icon: faMoneyCheckDollar,
            form: "vendorconfiguration",
            subtitle: "Initiate",
          },
        ].map(({ title, icon, form }, index) => (
          <Col key={index} md={2}>
            <Card
              className={`reportChart-cards rounded m-0 mt-1`}
              // onMouseEnter={(e) => applyHoverEffects(e, true)}
              // onMouseLeave={(e) => applyHoverEffects(e, false)}
              style={{ borderRadius: "10px" }}
            >
              <Card.Body
                className="d-flex flex-column align-items-center justify-content-center text-center bg-body-tertiary text-info-emphasis"
                style={{
                  minHeight: "100px",
                  background: "linear-gradient(to top, #dfe9f3 0%, white 100%)",
                }}
              >
                <FontAwesomeIcon
                  icon={icon}
                  size="3x"
                  className="mb-2 linear-gradient(to top, #09203f 0%, #537895 100%)"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    if (e.button == 0) {
                      e.preventDefault();
                      handleClick(
                        `/form/runtime?formService=${form}&objectId=1`
                      );
                    }
                  }}
                />
                <h6 className="mb-0 text-wrap text-dark">{title}</h6>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default VM_MANAGEMENT_MOCKUP;
