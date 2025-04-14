import React from "react";
import { Row, Col, Card, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faArrowsSpin,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

export const PageBreadCrumb = (props) => {
  return (
    <div className="bg-body-tertiary  text-dark  ">
      <Row>
        <nav
          aria-label="breadcrumb"
          style={{
            "--bs-breadcrumb-divider": "'>'",
          }}
        >
          <ol className="breadcrumb mb-1 standard-Font">
            <li className="breadcrumb-item">
              <a href="/">
                <FontAwesomeIcon icon={faHome} /> Home
              </a>
            </li>
            {props?.children}
          </ol>
        </nav>
      </Row>
    </div>
  );
};

export const PageBreadCrumbItem = ({
  title,
  href,
  isDropdown,
  options,
  onChange,
}) => {
  return (
    <li
      className="breadcrumb-item d-inline-flex align-items-center"
      aria-current="page"
    >
      {isDropdown ? (
        <Dropdown>
          <Dropdown.Toggle
            as="a"
            className="text-decoration-none text-dark d-inline-flex align-items-center justify-content-center"
            href="#"
          >
            <span className="me-1">{title}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu
            className="overflow-auto"
            style={{ maxHeight: "14rem" }}
          >
            {options.map((option) => (
              <Dropdown.Item
                className="shadow-sm"
                key={option.value}
                onClick={() => onChange(option)}
              >
                {option.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <a
          href={href || "#"}
          className="text-decoration-none text-dark d-inline-flex align-items-center"
        >
          {title}
        </a>
      )}
    </li>
  );
};

export const PageHeader = (props) => {
  return (
    <Card className="sticky-top px-2 py-1 mb-3">
      <Row>
        <Col lg={8}>
          <div className="h4 overflow-hidden ">
            <FontAwesomeIcon icon={faArrowsSpin} /> {processInfo?.name}
          </div>
        </Col>
        <Col>
          <div className="float-end">
            {processInfo?.auditable_entity && (
              <span className="badge border fs-6 border-primary text-primary">
                Auditable Entity
              </span>
            )}
            <span className=" ms-1 badge border fs-6 border-primary text-primary">
              {processInfo?.status}
            </span>
            <span className="ms-1 badge border  fs-6 border-primary text-primary">
              {processInfo?.d_business_critic}
            </span>
            <span
              className={`ms-1 rounded-circle  align-items-center justify-content-center`}
            >
              <FontAwesomeIcon
                icon={faFilePdf}
                size="lg"
                className="text-black"
              />
              <i className="bi bi-file-earmark-pdf-fill"></i>
            </span>
          </div>
        </Col>
        <hr className="my-1 py-0" />
      </Row>
      <Row className="ps-2">{/* <PageNavigation /> */}</Row>
    </Card>
  );
};
