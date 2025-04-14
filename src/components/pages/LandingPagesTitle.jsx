import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Row,
  Nav,
  Container,
  Col,
  Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faArrowUp,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import { useSelector } from "react-redux";
import {
  getFiscalYear,
  getNormalYear,
} from "src/components/forms/reactformutils/elements/formutilfunctions";

const ScrollToTop = () => {
  const [showScrollTopButton, setShowScrollTopButton] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTopButton(true);
      } else {
        setShowScrollTopButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {showScrollTopButton && (
        <FontAwesomeIcon
          icon={faArrowUp}
          className="top-btn-position btn-danger z-1 mb-4 top-btn-style "
          onClick={scrollTop}
        />
      )}
    </div>
  );
};

const LandingPagesTitle = (props) => {
  const {
    title,
    configrationForm,
    configrationReport,
    privileges,
    navBar,
    updateValue,
    tabs,
    onYearChange,
    showYearFilter,
    fontawsomeIcon,
  } = props;
  const { fiscal_year_starts } = useSelector(
    (state) => state.systemConfig.systemConfig
  );
  // const [yearcallback, setYearcallback] = useState(new Date().getFullYear());
  let fiscalConfigYear = getFiscalYear();
  const configyear = fiscalConfigYear.match(/^\d+/)[0];

  const [yearcallback, setYearcallback] = useState(
    fiscal_year_starts === 4 ? configyear : getNormalYear().toString()
  );

  const navigate = useNavigate();
  let privs = util.getCurrentUser().privileges?.split(",");
  const filteredNavBar = navBar?.filter((item) =>
    item.privileges ? privs.includes(item.privileges) : false
  );

  const filteredtabs = tabs?.filter((item) =>
    item.privilege ? privs.includes(item.privilege) : false
  );

  const handleIconClick = () => {
    if (configrationReport) {
      navigate(`/report?report=${configrationReport}`);
    } else if (configrationForm) {
      navigate(`/form/runtime?formService=${configrationForm}&objectId=1`);
    }
  };
  useEffect(() => {
    if (onYearChange && yearcallback !== undefined) {
      onYearChange(yearcallback);
    }
  }, [yearcallback, onYearChange]);

  const handleNavButtonClick = (item) => {
    let path = "";
    if (item.type === "FORM") {
      path = `/form/runtime?formService=${item.name}`;
    } else if (item.type === "PAGE") {
      path = `/page?name=${item.name}`;
    }
    navigate(path);
  };

  const Privileges =
    privileges && privs?.some((priv) => privileges.includes(priv));

  // Callback function to handle the selected year
  const handleYearChange = (year) => {
    setYearcallback(year);
  };

  return (
    <>
      <div className="z-2 sticky-top" style={{ top: "62px" }}>
        <Row className="p-0 m-0">
          <Card className="reportChart-cards mb-3">
            {/* <div className="d-flex justify-content-between align-items-center mt-1 ">
              <h4>{title}</h4>


              {filteredNavBar && filteredNavBar.length > 0 && (
                <div className="d-flex align-items-centerms-auto">

                  {filteredNavBar.map((item, index) => (
                    <Button
                      key={index}
                      variant="primary"
                      size="sm"
                      className="mb-1 me-2"
                      onClick={() => handleNavButtonClick(item)}
                    >
                      {item.title}
                    </Button>
                  ))}
                </div>
              )}

              {Privileges && (
                <FontAwesomeIcon
                  icon={faGear}
                  style={{ cursor: "pointer" }}
                  size="lg"
                  className="mb-2"
                  onClick={handleIconClick}
                />
              )}
            </div> */}
            <div className="d-flex justify-content-between align-items-center m-1">
              <h4 className="mb-0">
                {fontawsomeIcon && (
                  <FontAwesomeIcon className="px-1" icon={fontawsomeIcon} />
                )}
                {title}
              </h4>

              <div className="d-flex align-items-center ms-auto">
                {showYearFilter && (
                  <YearFilter
                    onYearChange={handleYearChange}
                    className="me-2"
                  />
                )}

                {filteredNavBar && filteredNavBar.length > 0 && (
                  <div className="d-flex align-items-center">
                    {filteredNavBar.map((item, index) => (
                      <Button
                        key={index}
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleNavButtonClick(item)}
                      >
                        {item.title}
                      </Button>
                    ))}
                  </div>
                )}

                {Privileges && (
                  <FontAwesomeIcon
                    icon={faGear}
                    style={{ cursor: "pointer" }}
                    size="lg"
                    onClick={handleIconClick}
                  />
                )}
              </div>
            </div>

            {filteredtabs && filteredtabs.length > 0 && (
              <>
                <hr className="my-1 py-0" />
                <Container fluid>
                  <Row className="align-items-center">
                    <Col>
                      <PageNavigation
                        tabs={filteredtabs}
                        updateValue={updateValue}
                      />
                    </Col>
                    {/* Empty space in between */}
                    {/* <Col className="text-end">
                      <YearFilter onYearChange={handleYearChange} />
                    </Col> */}
                  </Row>
                </Container>
              </>
            )}
          </Card>
        </Row>
      </div>
      <ScrollToTop />
    </>
  );
};

const PageNavigation = ({ tabs, updateValue }) => {
  const handleSelects = (eventKey) => {
    updateValue && updateValue(eventKey);
    // return true;
  };
  return (
    <Nav
      variant="underline"
      // defaultActiveKey="CM_OVERVIEW"
      className="justify-content-start mt-1 mb-2"
      onSelect={handleSelects}
    >
      {tabs.map((item, index) => (
        <Nav.Item>
          <Nav.Link eventKey={item.key} className="py-0">
            {item.title}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

const YearFilter = ({ onYearChange }) => {
  const [selectedYear, setSelectedYear] = useState([]);

  const { fiscal_year_starts } = useSelector(
    (state) => state.systemConfig.systemConfig
  );

  const generateFiscalYearsList = () => {
    const currentFiscalYear = getFiscalYear();
    const [startYear] = currentFiscalYear.split("-").map(Number);
    const fiscalYears = [];

    for (let i = 0; i < 5; i++) {
      const yearStart = startYear - i;
      const yearEnd = yearStart + 1;
      fiscalYears.push(`FY${yearStart}-${yearEnd}`);
    }

    return fiscalYears;
  };
  const generateStandardYears = () => {
    const year = getNormalYear();
    const years = [];

    for (let i = 0; i < 5; i++) {
      years.push((year - i).toString());
    }

    return years;
  };

  const fiscalYears = generateFiscalYearsList();

  const StandardYear = generateStandardYears();
  const yearOptions = fiscal_year_starts === 1 ? StandardYear : fiscalYears;

  useEffect(() => {
    if (fiscal_year_starts === 1) {
      setSelectedYear(getNormalYear());
    } else if (fiscal_year_starts === 4) {
      setSelectedYear(`FY${getFiscalYear()}`);
    }
  }, [fiscal_year_starts]);

  const handleSelect = (year) => {
    let extractedYear;
    if (year.includes("FY")) {
      extractedYear = year.split("FY")[1].split("-")[0];
    } else {
      extractedYear = year;
    }
    setSelectedYear(year);
    onYearChange(extractedYear);
  };

  const handlePreviousYear = () => {
    // const currentIndex = yearOptions.indexOf(selectedYear);
    const currentIndex = yearOptions.indexOf(selectedYear.toString());

    if (currentIndex < yearOptions.length - 1) {
      const newSelectedYear = yearOptions[currentIndex + 1];

      setSelectedYear(newSelectedYear);
      const extractedYear = newSelectedYear.includes("FY")
        ? newSelectedYear.split("FY")[1].split("-")[0]
        : newSelectedYear;

      onYearChange(extractedYear);
    }
  };

  const handleNextYear = () => {
    const currentIndex = yearOptions.indexOf(selectedYear);
    if (currentIndex > 0) {
      const newSelectedYear = yearOptions[currentIndex - 1];
      setSelectedYear(newSelectedYear);
      const extractedYear = newSelectedYear.includes("FY")
        ? newSelectedYear.split("FY")[1].split("-")[0]
        : newSelectedYear;

      onYearChange(extractedYear);
    }
  };

  const currentIndex = yearOptions.indexOf(selectedYear);

  return (
    <>
      <div className="float-end d-inline-flex align-items-center mb-1">
        <Button
          className="ml-10 "
          onClick={handlePreviousYear}
          disabled={currentIndex === yearOptions.length - 1}
          size="sm"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </Button>
        <Dropdown className="ms-1 me-1 ">
          <Dropdown.Toggle className="bg-primary btn-sm">
            {selectedYear}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {yearOptions.map((year, index) => (
              <Dropdown.Item key={index} onClick={() => handleSelect(year)}>
                {year}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Button
          className="ms-0"
          onClick={handleNextYear}
          disabled={currentIndex === 0 || currentIndex === -1}
          // disabled={currentIndex === -1}
          size="sm"
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </Button>
      </div>
    </>
  );
};

export default LandingPagesTitle;
