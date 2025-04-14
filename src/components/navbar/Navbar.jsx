import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Button,
  Navbar,
  Nav,
  Dropdown,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
  NavDropdown,
} from "react-bootstrap";

import {
  AlertCircle,
  Bell,
  BellOff,
  Home,
  MessageCircle,
  UserPlus,
  Search,
} from "react-feather";

import { toast } from "react-toastify";

import useSidebar from "../../hooks/useSidebar";
import { SIDEBAR_POSITION, SIDEBAR_BEHAVIOR } from "../../constants";
import NavbarDropdown from "./NavbarDropdown";
import NavbarDropdownItem from "./NavbarDropdownItem";
import NavbarLanguages from "./NavbarLanguages";
import NavbarUser from "./NavbarUser";
import WebSockets from "./Websockets";

// import MapsLocation from "src/modules/Location/MapLocation";

import avatar1 from "../../assets/img/avatars/avatar.jpg";
import avatar3 from "../../assets/img/avatars/avatar-3.jpg";
import avatar4 from "../../assets/img/avatars/avatar-4.jpg";
import avatar5 from "../../assets/img/avatars/avatar-5.jpg";

// Add-ons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faListCheck,
  faCompress,
  faSun,
  faMoon,
  faLightbulb,
  faCircleHalfStroke,
  faCircleChevronLeft,
  faCircleChevronRight,
  faCircleArrowRight,
  faCircleArrowLeft,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";

import { FullScreen, useFullScreenHandle } from "react-full-screen";

import { THEME } from "../../constants";

import useTheme from "../../hooks/useTheme";
import Notifications from "./Notifications";
import PinnedRecords from "src/components/forms/utils/pinnedRecords";

const NavbarComponent = () => {
  const { t } = useTranslation("common");
  const { isOpen, setIsOpen, behavior, setBehavior } = useSidebar();
  const navigate = useNavigate();
  const handle = useFullScreenHandle();
  const [isFullscreen, setIsFullscreen] = useState(false);

  let [isDark, setIsDark] = useState(false);

  const { theme, setTheme } = useTheme();

  const copyURLToClipboard = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL);
    // if (!showToastRef.current) {
    toast.info("Copied to clipboard", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 500,
      closeButton: true,
    });
    // showToastRef.current = true;
    // }
  };
  const toggleMode = () => {
    setIsDark(!isDark);
    setTheme(
      theme === THEME.DEFAULT
        ? THEME.DARK
        : theme === THEME.DARK
        ? THEME.LIGHT
        : THEME.DEFAULT
    );
  };
  // http://localhost:8080/progrecapps/api/v1/util/notificationinfo?userId=961

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }

    setIsFullscreen(!isFullscreen);
  };
  // Add by Suhas G  After clicking Expand icon to change state of fullScreen start
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  // Add by Suhas G  After clicking Expand icon to change state of fullScreen End

  useEffect(() => {
    function handleResize() {
      const isCompact = window.matchMedia("(max-width: 992px)").matches;
      setBehavior(
        isCompact ? SIDEBAR_BEHAVIOR.COMPACT : SIDEBAR_BEHAVIOR.STICKY
      );
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setBehavior]);

  return (
    <Navbar variant="light" expand className="navbar sticky-top">
      <span
        className="sidebar-toggle d-flex"
        onClick={() => {
          // setIsOpen(!isOpen);
          setBehavior(
            behavior == SIDEBAR_BEHAVIOR.COMPACT
              ? SIDEBAR_BEHAVIOR.STICKY
              : SIDEBAR_BEHAVIOR.COMPACT
          );
        }}
      >
        <i className="hamburger align-self-center" />

        {/* <FontAwesomeIcon
          icon={
            behavior === SIDEBAR_BEHAVIOR.STICKY
              ? faCircleChevronLeft
              : faCircleChevronRight
          }
          size="xl"
        /> */}
      </span>

      {/* <MegaMenu /> */}

      <Navbar.Collapse>
        <Nav className="navbar-align ">
          <Nav.Link className="mt-1">
            <PinnedRecords />
          </Nav.Link>

          <Nav.Link as={Link} to="/pages/tasks" className="mt-1">
            <span className="navIcons">
              <FontAwesomeIcon
                icon={faListCheck}
                className="navIcons  m-0"
                title="To Do"
              />{" "}
              {/* {t("mytodo")} */}
            </span>
          </Nav.Link>
          <Nav.Link className="mt-1">
            <span onClick={toggleFullscreen}>
              <span>
                {isFullscreen ? (
                  <FontAwesomeIcon
                    icon={faCompress}
                    className="navIcons m-0"
                    title=" Minimize"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faExpand}
                    className="navIcons m-0"
                    title="Maximize"
                  />
                )}
              </span>
            </span>
          </Nav.Link>

          {/* <Nav.Link className="mt-1">
            <span onClick={toggleMode}>
              {theme === THEME.DARK ? (
                <FontAwesomeIcon icon={faSun} size="lg" />
              ) : (
            
                <FontAwesomeIcon icon={faMoon} size="lg" />
              
              )}
            </span>
          </Nav.Link>  */}
          <Nav.Link className="mt-1">
            <span onClick={toggleMode}>
              {theme === THEME.DARK ? (
                <FontAwesomeIcon
                  icon={faLightbulb}
                  className="navIcons m-0"
                  title="Theme"
                />
              ) : theme === THEME.LIGHT ? (
                <FontAwesomeIcon
                  icon={faCircleHalfStroke}
                  className="navIcons m-0"
                  title="Theme"
                />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faMoon}
                    className="navIcons m-0"
                    title="Theme"
                  />
                </>
              )}
            </span>
          </Nav.Link>
          {/* <Notifications /> COMMENTED BY NAG TEMPORARILY */}
          {/* {tasks.length > 0 && <NavbarDropdown
            header="New Messages"
            icon={MessageCircle}
            count={tasks?.length}
            showBadge
          >
           {tasks.map((item, key) => {
              return (
                <NavbarDropdownItem
                key={key}
                description={item.task_name}
                time={item.created_on}
                onClick={()=>{
                  navigate(`/form/runtime?formService=${item.form_service.replace(/^\/+/, "")}&objectId=${item.object_id}`);
                }}
              />
              );
            })}
          </NavbarDropdown>}
           */}
          {/* <NavbarDropdown
            header="New Notifications"
            footer="Show all notifications"
            icon={BellOff}
            count={notifications.length}
          >
            {notifications.map((item, key) => {
              let icon = <Bell size={18} className="text-warning" />;

              if (item.type === "important") {
                icon = <AlertCircle size={18} className="text-danger" />;
              }

              if (item.type === "login") {
                icon = <Home size={18} className="text-primary" />;
              }

              if (item.type === "request") {
                icon = <UserPlus size={18} className="text-success" />;
              }

              return (
                <NavbarDropdownItem
                  key={key}
                  icon={icon}
                  title={item.title}
                  description={item.description}
                  time={item.time}
                />
              );
            })}
          </NavbarDropdown> */}
          {/* <MapsLocation /> */}
          <NavbarLanguages />
          <div className="d-flex align-items-center justify-content-between ">
            <NavbarUser />
            {/* <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Copy URL</Tooltip>}
              trigger={["hover", "focus"]}
            > */}
            <span onClick={copyURLToClipboard} className="p-0">
              <FontAwesomeIcon
                icon={faClipboard}
                className="navIcons"
                title="Copy URL"
              />
            </span>
            {/* </OverlayTrigger> */}
          </div>
        </Nav>

        <WebSockets />
      </Navbar.Collapse>
    </Navbar>
  );
};

let MegaMenu = () => {
  return (
    <NavDropdown title="Menu" id="collapsible-nav-dropdown">
      <div class="d-md-flex align-items-start justify-content-start ">
        <div class="dropdown-mega-list">
          <div class="dropdown-header">Forms</div>
          {/* <a class="dropdown-item" href="#">Alerts</a> */}
          <ItemLink title="Issue" description="To log the issues" />
          <a class="dropdown-item" href="#">
            Buttons
          </a>
          <a class="dropdown-item" href="#">
            Cards
          </a>
          <a class="dropdown-item" href="#">
            Carousel
          </a>
          <a class="dropdown-item" href="#">
            General
          </a>
          <a class="dropdown-item" href="#">
            Grid
          </a>
          <a class="dropdown-item" href="#">
            Modals
          </a>
          <a class="dropdown-item" href="#">
            Tabs
          </a>
          <a class="dropdown-item" href="#">
            Typography
          </a>
        </div>
        <div class="dropdown-mega-list">
          <div class="dropdown-header">Reports</div>
          <a class="dropdown-item" href="#">
            Layouts
          </a>
          <a class="dropdown-item" href="#">
            Basic Inputs
          </a>
          <a class="dropdown-item" href="#">
            Input Groups
          </a>
          <a class="dropdown-item" href="#">
            Advanced Inputs
          </a>
          <a class="dropdown-item" href="#">
            Editors
          </a>
          <a class="dropdown-item" href="#">
            Validation
          </a>
          <a class="dropdown-item" href="#">
            Wizard
          </a>
        </div>
        <div class="dropdown-mega-list">
          <div class="dropdown-header">Charts</div>
          <a class="dropdown-item" href="#">
            Basic Tables
          </a>
          <a class="dropdown-item" href="#">
            Responsive Table
          </a>
          <a class="dropdown-item" href="#">
            Table with Buttons
          </a>
          <a class="dropdown-item" href="#">
            Column Search
          </a>
          <a class="dropdown-item" href="#">
            Muulti Selection
          </a>
          <a class="dropdown-item" href="#">
            Ajax Sourced Data
          </a>
        </div>
      </div>
    </NavDropdown>
  );
};

let ItemLink = (props) => {
  return (
    <>
      <div className="dropdown-item">
        <a className=" text-underline" href="#">
          {props.title}
        </a>
        <p className="fs-6 text-dark-emphasis">{props.description}</p>
      </div>
    </>
  );
};

export default NavbarComponent;
