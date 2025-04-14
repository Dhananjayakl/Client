import React, { useState, useEffect, useRef, Children } from "react";
import { Helmet } from "react-helmet-async";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  ButtonToolbar,
  ButtonGroup,
  Form,
  Card,
  Breadcrumb,
  Badge,
  Nav,
  Dropdown,
} from "react-bootstrap";

import Chart from "src/components/charts/Chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportRuntime from "src/components/reports/Report";
import Tree from "src/components/pages/Tree";
import BusinessTree from "src/components/pages/BusinessTree";
import { useSearchParams } from "react-router-dom";
import {
  faFilePdf,
  faArrowsSpin,
  faTriangleExclamation,
  faCheckToSlot,
  faComments,
  faBriefcase,
  faPencil,
  faHome,
  faUser,
  faFileAlt,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import Collapse from "src/components/forms/reactformutils/elements/Collapse";

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
