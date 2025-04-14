import { Helmet } from "react-helmet-async";
import { Button, Container, Dropdown } from "react-bootstrap";
import ReportRuntime from "src/components/reports/Report";
import { Row, Col, Tab, Card } from "react-bootstrap";

import React, { useState } from "react";

import { getviewData } from "src/modules/admin/AdminService";

import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import FormLink from "src/components/pages/FormLink";
import LandingPagesTitle from "src/components/pages/LandingPagesTitle";
import FormReportChartLink from "src/components/pages/FormReportChartLink";
import Chart from "src/components/charts/Chart";
import dragula from "react-dragula";
import { current } from "@reduxjs/toolkit";
import { format } from "date-fns";

import { useNavigate } from "react-router-dom";
import {
  faAngleLeft,
  faAngleRight,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const containers = [];
let quarterMap = {};
let phaseOpt = {};

const Default = () => {
  let privs = util.getCurrentUser().privileges?.split(",");
  let forms = [];
  forms = [
    {
      title: "Create Account",
      form: "cmaccount",
      privilege: "CM_CREATE_ACCOUNT",
    },
    {
      title: "Create Lead",
      form: "cmlead",
      privilege: "CM_CREATE_ACCOUNT",
      upload: true,
    },
    {
      title: "Create Opportunity",
      form: "cmopportunity",
      privilege: "CM_CREATE_ACCOUNT",
    },
  ];

  let reports = [
    {
      title: "Account List Report",
      report: "CM_ACCOUNT_LIST",
      privilege: "CM_VIEW_ACCOUNT",
    },
    {
      title: "Lead List Report",
      report: "CM_LEAD_LIST",
      privilege: "CM_VIEW_LEAD",
    },
    {
      title: "Opportunity List Report",
      report: "CM_OPPORTUNITY_LIST",
      privilege: "CM_VIEW_OPPORTUNITY",
    },
    {
      title: "Activity List Report",
      report: "CM_ACTIVITY_LIST_RPT",
      privilege: "CM_VIEW_ACTIVITY",
    },
  ];

  let [opportunityData, setOpportunityData] = React.useState();
  let [yearProp, setYearProp] = React.useState();

  let OpportunityInfo = {
    viewName: "pa_cm_opportunity_bt",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `EXTRACT(YEAR FROM CREATED_ON) =${yearProp}`,
    //  `BDE = ${util.getCurrentUser().id} OR SALES_MANAGER= ${
    //   util.getCurrentUser().id
    // }`,
  };

  React.useEffect(() => {
    // Assuming containers and dragula are defined elsewhere
    dragula(containers);
    getviewData(OpportunityInfo)
      .then((response) => {
        let optData = response.data.data;
        quarterMap = { 1: [], 2: [], 3: [], 4: [] };
        phaseOpt = {
          INITIATE: [],
          SOLUTION: [],
          PROPOSAL: [],
          NEGOTIATION: [],
          COMMITMENT: [],
          CLOSE_WIN: [],
          CLOSE_LOST: [],
        };

        optData.forEach((item) => {
          const itemYear = new Date(item.expected_close_date).getFullYear();
          //   if (itemYear === selectedYear) {
          const quarter = util.getQuarter(item.expected_close_date);
          console.log(item.currentStage, item);
          quarterMap[quarter]?.push(item);
          phaseOpt[item.current_stage]?.push(item);
          //   }
        });
        console.log("optData", optData, quarterMap, phaseOpt);
        setOpportunityData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [yearProp]);

  const FormsandReport = () => {
    const combinedItems = [
      ...forms.map((item) => ({ ...item, type: "form" })),
      ...reports.map((item) => ({ ...item, type: "report" })),
      //   ...chart.map((item) => ({ ...item, type: "chart" })),
    ];

    return (
      <>
        <div>
          <FormReportChartLink combinedItems={combinedItems} />
        </div>
      </>
    );
  };

  const handleYearCallback = (year) => {
    setYearProp(year);
  };

  //Avoid Tab navigation OnReload Start
  const initialTab = window.history.state?.activeTab || "CM_OVERVIEW";
  const [activeTab, setActiveTab] = useState(initialTab);
  const handleSelect = (key) => {
    if (key !== null) {
      setActiveTab(key);
      window.history.replaceState({ activeTab: key }, "");
    }
  };
  //Avoid Tab navigation OnReload End

  return (
    <>
      <Helmet title="Manage CRM" />
      <Container fluid className="p-0 ">
        <Tab.Container id="menu" activeKey={activeTab} onSelect={handleSelect}>
          <LandingPagesTitle
            title="Manage CRM"
            // configurationForm="biaconfigurationsetup"
            // privileges="BR_SETUP_BR"
            tabs={[
              {
                title: "Overview",
                key: "CM_OVERVIEW",
                privilege: "CM_VIEW_LEAD",
              },
              {
                title: "Pipeline",
                key: "CM_PIPELINE",
                privilege: "CM_VIEW_LEAD",
              },
              {
                title: "Timeline",
                key: "CM_TIMELINE",
                privilege: "CM_VIEW_LEAD",
              },
            ]}
            onYearChange={handleYearCallback}
          />
          <Tab.Content className="bg-white pt-3">
            <Tab.Pane eventKey="CM_OVERVIEW" unmountOnExit>
              {/* <CombinedAssurance objectId={objectId} /> */}
              <div className="row  row-cols-sm-1">
                <FormsandReport />
              </div>

              {privs.includes("CM_VIEW_LEAD") && (
                <>
                  <Row>
                    <ReportRuntime report="CM_MY_LEADS" yearProp={yearProp} />
                  </Row>
                </>
              )}
              {privs.includes("CM_VIEW_OPPORTUNITY") && (
                <>
                  <Row>
                    <ReportRuntime
                      report="CM_MY_OPPORTUNITY"
                      yearProp={yearProp}
                    />
                  </Row>
                </>
              )}
              <Row>
                {privs.includes("CM_VIEW_OPPORTUNITY") && (
                  <>
                    <Col xs={12} md={3} lg={6}>
                      <Chart chart="CM_SALES_MODULE" yearProp={yearProp} />
                    </Col>

                    <Col xs={12} md={3} lg={6}>
                      <Chart chart="CM_SALES_CHANNEL" yearProp={yearProp} />
                    </Col>
                  </>
                )}
              </Row>

              <Row>
                {privs.includes("CM_VIEW_OPPORTUNITY") && (
                  <>
                    <Col xs={12} md={3} lg={6}>
                      <Chart chart="CM_LEAD_BY_INDUSTRY" yearProp={yearProp} />
                    </Col>

                    {/* <Col xs={12} md={3} lg={3}>
                      <Chart chart="CM_TOTAL_USERS_BY_SOURCE_TYPE" />
                    </Col> */}
                    <Col xs={12} md={3} lg={6}>
                      <Chart
                        chart="CM_OPPORTUINTY_WIN_LOSS"
                        yearProp={yearProp}
                      />
                    </Col>
                  </>
                )}
              </Row>

              {privs.includes("CM_VIEW_OPPORTUNITY") && (
                <>
                  <Chart
                    chart="CM_LEAD_QUARTER_TREND_CHART"
                    yearProp={yearProp}
                  />
                </>
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="CM_PIPELINE" unmountOnExit>
              <Pipeline />
            </Tab.Pane>

            <Tab.Pane eventKey="CM_TIMELINE" unmountOnExit>
              <Timeline />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
};

let statusColors = {};

const Opportunity = ({ item }) => {
  const navigate = useNavigate();
  const circleColor =
    statusColors[status] ||
    item.current_stage == "CLOSE_WIN" ||
    item.current_stage == "CLOSE_LOST"
      ? item.status == "Win"
        ? "green"
        : "red"
      : "grey";
  const today = format(new Date(), "yyyy-MM-dd");
  let isPast = false;

  const handleClick = (e) => {
    // const path = `/page?id=${179}`;
    const path = `/form/runtime?formService=cmopportunity&objectId=${item.object_id}`;
    navigate(path);
  };

  if (item.next_followup_date < today) {
    isPast = true;
  }
  return (
    <Card
      className=" cursor-grab textlink-border2 px-0"
      style={{
        borderLeft: `5px solid ${circleColor}`,
      }}
    >
      <Card.Body className="p-0">
        {/* <div className="row px-2">
           
            <div className="col-md-12 px-1"> */}
        <p
          className="standard-Font text-link2 px-1 "
          onClick={handleClick}
          value={item.object_id}
        >
          {item.opportunity_name}
        </p>
        {item.next_followup_date != null && (
          <h5 className="standard-Font">Next FollowUp Date</h5>
        )}
        {/* <p className="standard-Font text-link2 px-1">Next FollowUp Date</p> */}
        {item.next_followup_date != null && (
          <p
            className="standard-Font text-link2 px-1"
            style={{
              color: isPast ? "red" : "inherit",
            }}
          >
            {util.getFormattedDate(item.next_followup_date)}
          </p>
        )}
        {/* </div>
          </div> */}
      </Card.Body>
    </Card>
  );
};

// let OpportunityInfo = {
//   viewName: "pa_cm_opportunity_bt",
//   pageNumber: 0,
//   pageSize: 0,
//   sortField: "",
//   sortOrder: "",
//   orderExpression: "",
//   filterExpression: `created_on=${yearProp}`,
//   //  `BDE = ${util.getCurrentUser().id} OR SALES_MANAGER= ${
//   //   util.getCurrentUser().id
//   // }`,
// };

let Timeline = () => {
  //   console.log("phaseOpt",phaseOpt,newQuarterMap,opportunityData)

  return (
    <Row>
      <Col lg="6" xl="3" className="mt-2">
        <Lane
          name="Q1 (Jan to Mar)"
          onContainerLoaded={(container) => containers.push(container)}
        >
          {quarterMap[1]?.map((item) => (
            <Opportunity item={item} />
          ))}
        </Lane>
      </Col>
      <Col lg="6" xl="3" className="mt-2">
        <Lane
          name="Q2 (Apr to Jun)"
          onContainerLoaded={(container) => containers.push(container)}
        >
          {quarterMap[2]?.map((item) => (
            <Opportunity item={item} />
          ))}
        </Lane>
      </Col>
      <Col lg="6" xl="3" className="mt-2">
        <Lane
          name="Q3 (Jul to Sep)"
          onContainerLoaded={(container) => containers.push(container)}
        >
          {quarterMap[3]?.map((item) => (
            <Opportunity item={item} />
          ))}
        </Lane>
      </Col>
      <Col lg="6" xl="3" className="mt-2">
        <Lane
          name="Q4 (Oct to Dec)"
          onContainerLoaded={(container) => containers.push(container)}
        >
          {quarterMap[4]?.map((item) => (
            <Opportunity item={item} />
          ))}
        </Lane>
      </Col>
    </Row>
  );
};

let Pipeline = () => {
  return (
    <div style={{ overflowX: "auto" }}>
      <Row style={{ flexWrap: "nowrap", display: "flex" }}>
        <Col className="" lg="3">
          <Lane
            name="Identification"
            onContainerLoaded={(container) => containers.push(container)}
            percentage="0%"
          >
            {phaseOpt["INITIATE"]?.map((item) => (
              <Opportunity item={item} />
            ))}
          </Lane>
        </Col>

        <Col className="" lg="3">
          <Lane
            name="Solutioning"
            onContainerLoaded={(container) => containers.push(container)}
            percentage="40%"
          >
            {phaseOpt["SOLUTION"]?.map((item) => (
              <Opportunity item={item} />
            ))}
          </Lane>
        </Col>
        <Col className="" lg="3">
          <Lane
            name="Proposal"
            onContainerLoaded={(container) => containers.push(container)}
            percentage="60%"
          >
            {phaseOpt["PROPOSAL"]?.map((item) => (
              <Opportunity item={item} />
            ))}
          </Lane>
        </Col>
        <Col className="" lg="3">
          <Lane
            name="Negotiation"
            onContainerLoaded={(container) => containers.push(container)}
            percentage="70%"
          >
            {phaseOpt["NEGOTIATION"]?.map((item) => (
              <Opportunity item={item} />
            ))}
          </Lane>
        </Col>
        <Col className="" lg="3">
          <Lane
            name="Decision/Commitment"
            onContainerLoaded={(container) => containers.push(container)}
            percentage="80%"
          >
            {phaseOpt["COMMITMENT"]?.map((item) => (
              <Opportunity item={item} />
            ))}
          </Lane>
        </Col>
        <Col className="" lg="3">
          <Lane
            name="Closed/Win/Lost"
            onContainerLoaded={(container) => containers.push(container)}
            percentage="100%"
          >
            {/* {phaseOpt[("CLOSE_WIN", "CLOSE_LOST")]?.map((item) => (
              <Opportunity item={item} />
            ))} */}
            {[
              ...(phaseOpt["CLOSE_WIN"] || []),
              ...(phaseOpt["CLOSE_LOST"] || []),
            ]?.map((item) => (
              <Opportunity key={item.id} item={item} />
            ))}
          </Lane>
        </Col>
      </Row>
    </div>
  );
};

const Lane = ({ name, children, onContainerLoaded, percentage }) => {
  const handleContainerLoaded = (container) => {
    if (container) {
      onContainerLoaded(container);
    }
  };
  let childrenCount;

  if (children != undefined) {
    childrenCount = children.length;
  }

  return (
    <Card
      className=" h-100  pt-2 pb-0"
      style={{ boxShadow: "rgb(197 201 200 / 60%) 0px 0px 0.7rem 0px" }}
    >
      <Card.Header className="p-1 m-0">
        <Card.Title className="border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <p> {name}</p>
            <p>{percentage}</p>
            <p> {childrenCount}</p>
          </div>
        </Card.Title>
      </Card.Header>
      <Card.Body className="px-1">
        <div ref={handleContainerLoaded}>{children}</div>
      </Card.Body>
    </Card>
  );
};

export default Default;
