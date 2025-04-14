import React, { useEffect } from "react";
import {
  faUser,
  faAddressCard,
  faPhone,
  faFile,
  faBriefcase,
  faGraduationCap,
  faCertificate,
  faUsers,
  faUserInjured,
  faCogs,
  faBank,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Badge } from "react-bootstrap";
// import { OverlayTrigger,Tooltip } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Navigation({ checkWhichButtonClicked, objectIds }) {
  const tabs = [
    "employeeDetails",
    "personaldetails",
    "contactDetails",
    "bankdetails",
    "skills",
    "documents",
    "jobHistory",
    "educationaldetails",
    "certification",
    "familyDetails",
    // "separationRequest"
    // "emergencyContactDetails",
  ];

  const titles = [
    "Employee Details",
    "Personal Details",
    "Contact Details",
    "Bank Details",
    "Skills",
    "Documents",
    "Professional Experience",
    "Educational Details",
    "Certification",
    "Dependent Information",

    // "Separation Request"
    // "Emergency Contact Details",
  ];

  const icons = [
    faUser,
    faAddressCard,
    faPhone,
    faBank,
    faCogs,
    faFile,
    faBriefcase,
    faGraduationCap,
    faCertificate,
    faUsers,
    // faUserInjured,
    // faSOS,
  ];

  const totalTabs = tabs.length;
  const completedTabs = tabs.filter((tab) => objectIds[tab] > 0).length;
  const percentage = Math.round((completedTabs / totalTabs) * 100);
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  const handleBreadcrumbClick = (tab, event) => {
    event.preventDefault();
    let parentElem = document.getElementsByClassName("empbreadcrumb")[0];
    let childElem = parentElem.getElementsByClassName("active")[0];
    let childElem1 = parentElem.getElementsByClassName("active")[1];

    if (childElem1 != undefined) {
      childElem1.classList.remove("active");
    }
    if (childElem != undefined) {
      childElem.classList.remove("active");
    }

    setActiveTab(tab);
    checkWhichButtonClicked("", tab);
    // Perform any other action you want on breadcrumb click
  };
  // let conditionMet = true;
  // const handleBreadcrumbClick = (tab, event) => {
  //   if (tab !== 'employeeDetails' && objectIds.employeeDetails <= 0) {
  //     conditionMet = false;
  //     event.preventDefault();
  //   }
  //   if (conditionMet) {
  //     setActiveTab(tab);
  //     checkWhichButtonClicked(tab);
  //     // Perform any other action you want on breadcrumb click
  //   }
  // };

  return (
    <>
      <div className="empbreadcrumb d-flex flex-wrap">
        {titles.map((title, index) => (
          <a
            id={tabs[index]}
            key={index}
            href="#"
            className={`text-decoration-none d-flex h-100 position-relative mb-2 fw-300 flex-grow-1 flex-auto
         ${index == 0 ? "rounded-start-3 ps-1" : ""} ${
              index == titles.length - 1 ? "rounded-end-3 pe-1 " : ""
            }${activeTab === tabs[index] ? "active" : ""} ${
              objectIds[tabs[index]] > 0 ? "highlight" : ""
            }`}
            onClick={(event) => handleBreadcrumbClick(tabs[index], event)}
          >
            <span
              key={tabs[index]}
              href="#"
              // className={`breadcrumb__inner ${activeTab === tabs[index] ? 'active' : ''} ${objectIds[tabs[index]] > 0 ? 'highlight' : ''} ${tabs[index] !== 'employeeDetails' && !conditionMet ? 'disabled' : ''}`}
              className={`breadcrumb__inner ${
                activeTab === tabs[index] ? "active" : ""
              } ${objectIds[tabs[index]] > 0 ? "highlight" : ""}`}
            >
              <span className="breadcrumb__title">
                <span className="breadcrumb__desc">
                  <FontAwesomeIcon icon={icons[index]} className=" me-1" />{" "}
                  {title}{" "}
                  {/* {objectIds[tabs[index]] > 0 && <Badge className="bg-success"> <FontAwesomeIcon icon={faCheckCircle}  size="lg"></FontAwesomeIcon></Badge>} */}
                </span>
              </span>
            </span>
          </a>
        ))}
      </div>
      <div className="circle percentage-79">
        <span>
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            background
            backgroundPadding={6}
            styles={buildStyles({
              backgroundColor: "#3e98c7",
              textColor: "#fff",
              pathColor: "#fff",
              trailColor: "transparent",
            })}
          />
        </span>
      </div>
    </>
  );
}

export default Navigation;
