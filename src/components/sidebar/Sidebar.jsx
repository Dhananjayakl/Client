// import React, { useState, useEffect } from "react";

// import PerfectScrollbar from "react-perfect-scrollbar";

// import useSidebar from "../../hooks/useSidebar";
// import SidebarFooter from "./SidebarFooter";
// import SidebarNav from "./SidebarNav";

// import logo from "../../assets/img/logo.png";
// import OnlyLogo from "../../assets/img/OnlyLogo.png";
// import NewLogo from "../../assets/img/Newlogo.png";
// import OnlyNewLogo from "../../assets/img/OnlyNewLogo.png";
// // import lercLogo from "../../assets/img/LERC_LOGO.png";
// import DashboardNavigation from "src/components/navigation/DashboardNavigation";
// import { Menu } from "react-feather";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { NameInitialsAvatar } from "react-name-initials-avatar";
// import { compactSidebarconfig } from "src/config";

// const Sidebar = ({ items, showFooter = true }) => {
//   const { t } = useTranslation();
//   const { isOpen } = useSidebar();
//   const [showDashboardNavigation, setShowDashboardNavigation] = useState(false);
//   // const location = useLocation();
//   const navigate = useNavigate();
//   const handleButtonClick = () => {
//     setShowDashboardNavigation(!showDashboardNavigation);

//     const targetRoute = showDashboardNavigation
//       ? "/pages/tasks"
//       : "/DashboardNavigation";
//     navigate(targetRoute);
//   };

//   const bothIconIntial = compactSidebarconfig.bothIconIntial;
//   const onlyInitials = compactSidebarconfig.onlyInital;
//   const onlyIcon = compactSidebarconfig.onlyIcon;

//   return (
//     <>
//       <nav className={`sidebar  ${!isOpen ? "collapsed" : ""}`}>
//         <div className="sidebar-content">
//           <PerfectScrollbar>
//             <div className="sticky-top">
//               <a className="sidebar-brand sticky-top " href="/">
//                 <img
//                   src={OnlyNewLogo}
//                   style={{
//                     width: "80px",
//                     height: "60px",
//                   }}
//                   className="only-logo"
//                 />
//                 <span className="sidebar-brand-text align-middle">
//                   <img
//                     src={NewLogo}
//                     // style={{
//                     //   width: "200px",
//                     //   height: "65px",
//                     //   marginRight: "20px",
//                     // }}
//                     className="sidebarlogo"
//                   />
//                 </span>
//               </a>
//               <a className="sidebar-brand " onClick={handleButtonClick}>
//                 <div className="d-flex align-items-center  menu-intial">
//                   {bothIconIntial && (
//                     <>
//                       <Menu
//                         className=" sidebar-brand-icon only-logo  p-0 m-0 right-Menuicon"
//                         style={{ width: "20px", height: "20px" }}
//                       />
//                       <div className="onlyMenuInitials">
//                         <NameInitialsAvatar
//                           name={"Menu"}
//                           size="25px"
//                           borderRadius="50%"
//                           bgColor="#f2f2f2"
//                           borderWidth="1px"
//                           textSize="12px"
//                           textWeight="12"
//                         />
//                       </div>
//                     </>
//                   )}
//                   {onlyInitials && (
//                     <div className="onlyMenuInitials  p-1">
//                       <NameInitialsAvatar
//                         name={"Menu"}
//                         size="27px"
//                         borderRadius="50%"
//                         bgColor="#f2f2f2"
//                         borderWidth="1px"
//                         textSize="14px"
//                         textWeight="12"
//                       />
//                     </div>
//                   )}
//                   {onlyIcon && (
//                     <Menu
//                       className="menu-nav-items onlyMenuIcon"
//                       style={{ width: "34px", height: "20px" }}
//                     />
//                   )}
//                 </div>

//                 <span className=" menuspan">
//                   <Menu
//                     // className="pe-3 ms-1 "
//                     className="menu-nav-items"
//                     style={{ width: "34px", height: "20px" }}
//                   />
//                   <span className="sidebar-menu">{t("menu")}</span>
//                 </span>
//               </a>
//             </div>
//             <div className="sidebarNav">
//               <SidebarNav items={items} />
//             </div>

//             <div className=" sidebar  sticky-bottom position-fixed sidebarFooter">
//               {!!showFooter && <SidebarFooter />}
//             </div>
//           </PerfectScrollbar>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Sidebar;
import React, { useEffect, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import useSidebar from "../../hooks/useSidebar";
import SidebarFooter from "./SidebarFooter";
import SidebarNav from "./SidebarNav";
import FulLogo from "../../assets/img/Rego.png";
import SmallLogo from "../../assets/img/OnlyNewLogo.png";
import DashboardNavigation from "src/components/navigation/DashboardNavigation";
import { Menu, Disc, Crosshair } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NameInitialsAvatar } from "react-name-initials-avatar";
import { compactSidebarconfig } from "src/config";
import axios from "src/utils/AxiosInstance";
import { useSelector } from "react-redux";

const Sidebar = ({ items, showFooter = true }) => {
  const [stickyLogo, setStickyLogo] = useState(FulLogo);
  const [compactLogo, setCompactLogo] = useState(SmallLogo);

  const { t } = useTranslation("common");
  const { isOpen } = useSidebar();
  const [showDashboardNavigation, setShowDashboardNavigation] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = (button) => {
    setShowDashboardNavigation(!showDashboardNavigation);

    const targetRoute =
      button === "menu"
        ? "/DashboardNavigation"
        : button === "eye"
        ? "/CircularNavigation"
        : "/pages/tasks";

    navigate(targetRoute);
  };

  const bothIconIntial = compactSidebarconfig.bothIconIntial;
  const onlyInitials = compactSidebarconfig.onlyInital;
  const onlyIcon = compactSidebarconfig.onlyIcon;

  const logoconfig = async () => {
    try {
      const response = await axios.get(`logoConfig/getAllImages`, {
        responseType: "blob",
      });

      const jsonData = await response.data.text();
      const parsedData = JSON.parse(jsonData);

      if (parsedData.length > 0) {
        parsedData.forEach((item) => {
          if (item.img_name === "stickyLogo") {
            setStickyLogo(`data:image/png;base64,${item.image_data}`);
            localStorage.setItem(
              "stickyLogo",
              `data:image/png;base64,${item.image_data}`
            );
          } else if (item.img_name === "compactLogo") {
            setCompactLogo(`data:image/png;base64,${item.image_data}`);
          }
        });
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  useEffect(() => {
    logoconfig();
  }, []);
  return (
    <>
      <nav className={`sidebar  ${!isOpen ? "collapsed" : ""}`}>
        <div className="sidebar-content">
          <PerfectScrollbar>
            <div className="sticky-top">
              <a
                className="sidebar-brand sticky-top  m-0"
                href="/DashboardNavigation"
                // onClick={() => {
                //   navigate("/DashboardNavigation");
                // }}
              >
                <img
                  src={compactLogo}
                  style={{
                    width: "80px",
                    height: "60px",
                  }}
                  className="only-logo m-0 p-0"
                />
                <span className="sidebar-brand-text align-middle">
                  <img src={stickyLogo} className="sidebarlogo" />
                </span>
              </a>
              <div className="d-flex align-items-center sidebar-brand ">
                <div
                  className="sidebar-brand  menuEye"
                  onClick={() => handleButtonClick("menu")}
                >
                  <div className="d-flex align-items-center menu-intial">
                    {bothIconIntial && (
                      <>
                        <Menu
                          className=" sidebar-brand-icon only-logo p-0 m-0 right-Menuicon cursor-pointer"
                          style={{ width: "20px", height: "20px" }}
                        />
                        <div className="onlyMenuInitials cursor-pointer">
                          <NameInitialsAvatar
                            name={"Menu"}
                            size="25px"
                            borderRadius="50%"
                            bgColor="#f2f2f2"
                            borderWidth="1px"
                            textSize="12px"
                            textWeight="12"
                          />
                        </div>
                      </>
                    )}
                    {onlyInitials && (
                      <div className="onlyMenuInitials p-1 cursor-pointer">
                        <NameInitialsAvatar
                          name={"Menu"}
                          size="27px"
                          borderRadius="50%"
                          bgColor="#f2f2f2"
                          borderWidth="1px"
                          textSize="14px"
                          textWeight="12"
                        />
                      </div>
                    )}
                    {onlyIcon && (
                      <Menu
                        className="menu-nav-items onlyMenuIcon cursor-pointer"
                        style={{ width: "34px", height: "20px" }}
                      />
                    )}
                  </div>
                  <span className="menuspan">
                    <Menu
                      className="menu-nav-items cursor-pointer"
                      style={{ width: "34px", height: "20px" }}
                    />
                    <span className="sidebar-menu cursor-pointer">
                      {t("Menu")}
                    </span>
                  </span>
                </div>
                <div
                  className="sidebar-brand menueyediv"
                  onClick={() => handleButtonClick("eye")}
                >
                  <Disc
                    className=" eyeOnly cursor-pointer"
                    style={{ width: "34px", height: "20px" }}
                  />
                </div>
              </div>
            </div>
            <div className="sidebarNav">
              <SidebarNav items={items} />
            </div>
            <div className="sidebar sticky-bottom position-fixed sidebarFooter">
              {!!showFooter && <SidebarFooter />}
            </div>
          </PerfectScrollbar>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
