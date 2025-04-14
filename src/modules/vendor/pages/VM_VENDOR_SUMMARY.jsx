import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  ButtonToolbar,
  Modal,
  Form,
  Card,
  Breadcrumb,
  Table,
  ListGroup,
  ProgressBar,
  OverlayTrigger,
  Tooltip,
  Nav,
} from "react-bootstrap";

import {
  Minus,
  TrendingDown,
  TrendingUp,
  GitCommit,
  AlertTriangle,
  Check,
  DollarSign,
  ChevronsRight,
} from "react-feather";
import Chart from "src/components/charts/Chart";
//import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportRuntime from "src/components/reports/Report";
import Tree from "src/components/pages/Tree";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  faFilePdf,
  faArrowsSpin,
  faTriangleExclamation,
  faFileContract,
  faHandshake,
  faCheckToSlot,
  faChartPie,
  faComments,
  faBuilding,
  faBriefcase,
  faBookBookmark,
  faTimes,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { getviewData } from "../VendorFormservice";
import { PageBreadCrumb, PageBreadCrumbItem } from "../../grc/pages/PageUtils";

const Default = () => {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  const [vendordata, setVendordata] = useState(null);

  const fetchVendorData = () => {
    getviewData({
      viewName: "pa_gl_thirdparty_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `object_id=${objectId}`,
    })
      .then((response) => {
        setVendordata(response.data.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchVendorData();
  }, [objectId]);

  return (
    <div>
      <Container fluid className="p-3">
        <div className="shadow sticky-top bg-white z-1">
          <PageBreadCrumb>
            <PageBreadCrumbItem title={"Vendor Environment"} />
            <PageBreadCrumbItem title={vendordata?.name} />
          </PageBreadCrumb>

          <Tab.Container id="menu" defaultActiveKey="Overview">
            <Card className="sticky-top px-2 py-1 mb-3" style={{ zIndex: "1" }}>
              <Row>
                <Col lg={8}>
                  <div className="h4 overflow-hidden ">
                    <FontAwesomeIcon icon={faHandshake} /> {vendordata?.name}
                  </div>
                </Col>
                {/* <Col>
                  <div className="float-end">
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
                </Col> */}
              </Row>

              <Row className="ps-2">
                <PageNavigation />
              </Row>
            </Card>

            <Tab.Content className="bg-white pt-3">
              <Tab.Pane eventKey="Overview">
                <Overview objectId={objectId} />
              </Tab.Pane>
              <Tab.Pane eventKey="DueDiligence">
                <DueDiligence objectId={objectId} />
              </Tab.Pane>
              <Tab.Pane eventKey="ProductService">
                <ProductService objectId={objectId} />
              </Tab.Pane>
              <Tab.Pane eventKey="Relationship">
                <Relationship objectId={objectId} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Container>
    </div>
  );
};

const Overview = ({ objectId }) => {
  const [vendorRating, setVendorRating] = useState(null);
  const [vendorsDataCount, setVendorsDataCount] = useState(false);
  const [terminatedvendor, setterminatedvendor] = useState(false);

  const fetchVendorRatingData = () => {
    getviewData({
      viewName: "pa_vm_vendor_register_v",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `object_id=${objectId}`,
    })
      .then((response) => {
        setVendorRating(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const vendorsData = () => {
    getviewData({
      viewName: "pa_vm_product_service_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `selected_vendor=${objectId}`,
    })
      .then((response) => {
        const vendorsData = response.data.data;
        const productserviceCount = vendorsData.reduce((count, vendor) => {
          return vendor.status === "Closed" ? count + 1 : count;
        }, 0);

        setVendorsDataCount({
          productserviceCount,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const vendorsDatas = () => {
    getviewData({
      viewName: "pa_vm_vendor_termination_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `vendor=${objectId}`,
    })
      .then((response) => {
        const vendorsData = response.data.data;
        const terminatedVendor = vendorsData.reduce((count, vendor) => {
          return vendor.status === "Approved" ? count + 1 : count;
        }, 0);
        setterminatedvendor({
          terminatedVendor,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    vendorsData();
    vendorsDatas();
    fetchVendorRatingData();
  }, [objectId]);

  const statusColors = {
    Critical: "red",
    High: "#ff0000",
    Medium: "#ffbf00",
    Low: "#008000",
  };

  const data = [
    {
      value:
        vendorRating && vendorRating[0]?.d_rating != null
          ? vendorRating[0]?.d_rating
          : "--",
      label: "Vendor Rating",
      icon: <GitCommit color="blue" size={30} />,
    },
    {
      value: vendorsDataCount?.productserviceCount,
      label: "Total Product/Service",
      icon: <Check color="blue" size={45} />,
    },
    {
      value: terminatedvendor?.terminatedVendor,
      label: "Terminated Product/service",
      icon: <ChevronsRight color="blue" size={45} />,
    },
  ];
  return (
    <div>
      <Row className="gx-5">
        <Col md={7}>
          <Row className="mb-0 ms-5">
            <ReportRuntime
              report="GL_PRODUCT_VENDORS_BY_ID"
              drilldownReports={{ processId: objectId }}
            />
          </Row>
        </Col>
        <Col md={5}>
          {data.map((item, index) => (
            <Row className="ms-2">
              <Card
                className="reportChart-cards"
                style={{ height: "90px", width: "220px" }}
              >
                <div className="p-2">
                  <Row className="d-flex align-items-center justify-content-between">
                    <Col className="d-flex align-items-center">
                      <h4 className="mb-0 me-4">{item.label}</h4>

                      {item.icon}
                    </Col>
                  </Row>

                  <Row className="justify-content-center">
                    <h4
                      className="p-2"
                      style={{
                        marginLeft: "25%",
                        color: statusColors[item.value] || "black",
                      }}
                    >
                      {item.value}
                    </h4>
                  </Row>
                </div>
              </Card>
            </Row>
          ))}
        </Col>
      </Row>
    </div>
  );
};

const DueDiligence = ({ objectId }) => {
  return (
    <div>
      <Row>
        <Col>
          <Row>
            <ReportRuntime
              report="SM_DUE_DILIGENCE_RESPONSE_BY_ID"
              drilldownReports={{ processId: objectId }}
            />
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row className="m-0 p-0">
            <Chart
              chart="VM_VENDOR_RATING_BY_ID"
              defaultFilter={{ processId: objectId }}
            />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

const ProductService = ({ objectId }) => {
  const [productsData, setProductsData] = useState(null);

  const fetchProductsData = () => {
    getviewData({
      viewName: "pa_vm_product_service_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `selected_vendor=${objectId}`,
    })
      .then((response) => {
        setProductsData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchProductsData();
  }, [objectId]);

  return (
    <div>
      {/* <Row md={6}>
        <ReportRuntime
          report="VM_PRODUCT_CONTRACT_LIFECYCLE_BY_ID"
          drilldownReports={{ processId: objectId }}
        />
      </Row> */}
      <Row>
        {/* <Col md={6}>
          <div>{renderProductsItems()}</div>
        </Col> */}
        <Col
          md={6}
          style={{
            marginTop: "2%",
            height: "70vh",
            overflowY: "auto",
            // backgroundColor: "#e9ecef",
            scrollbarWidth: "thin", // For Firefox
            scrollbarColor: "rgba(0, 0, 0, 0.5) #f1f1f1", // For Firefox
          }}
        >
          <ReportRuntime
            report="VM_PRODUCT_CONTRACT_LIFECYCLE_BY_ID"
            drilldownReports={{ processId: objectId }}
          />
        </Col>
        <Col md={6} style={{ marginTop: "2%" }}>
          <ReportRuntime
            report="VM_ESTIMATED_COST_BY_VENDOR"
            pivotTable
            drilldownReports={{ processId: objectId }}
          />
        </Col>
      </Row>
    </div>
  );
};

const Relationship = ({ objectId }) => {
  const [productData, setProductData] = useState(null);
  console.log(productData, "uuuuuuuuuuuuuuu");

  const fetchProductData = () => {
    getviewData({
      viewName: "pa_vm_object_relationship_v",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `selected_vendor=${objectId}`,
    })
      .then((response) => {
        setProductData(response.data.data);
        console.log(response.data, "uuuuuuuuuuuuuuu");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchProductData();
  }, [objectId]);

  const renderItemsWithHover = (items, key, targetTypeKey) => {
    const filteredItems = items
      .filter((item) => item[targetTypeKey] === key)
      .map((item) => item.target_object_name?.trim())
      .filter(Boolean)
      .reduce((acc, item) => {
        if (!acc.includes(item)) {
          acc.push(item);
        }
        return acc;
      }, []);

    // const firstFive = filteredItems.slice(0, 5);
    // const remainingItems = filteredItems.slice(5);

    return (
      <div className="ms-2">
        <ul className="mb-0">
          {filteredItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
          {/* {remainingItems.length > 0 && (
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip className="tooltip-custom">
                  {remainingItems.join(", ")}
                </Tooltip>
              }
            >
              <span
                className="text-primary cursor-pointer ms-2"
                style={{ overflowY: "scroll" }}
              >
                +{remainingItems.length} more
              </span>
            </OverlayTrigger>
          )} */}
        </ul>
      </div>
    );
  };

  return (
    <Row className="mt-3">
      <Col className="mb-3" style={{ marginLeft: "100px" }}>
        <h4 className="mb-2">Related Product/Service</h4>
        <div className="d-inline-block">
          {productData
            ? renderItemsWithHover(
                productData,
                "VM_PRODUCT_SERVICE",
                "target_object_type"
              )
            : "--"}
        </div>
      </Col>
      <Col>
        <h4 className="mb-2">Related Process</h4>
        <div
          className="d-inline-block"
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "normal",
            maxWidth: "50%",
            overflowX: "auto",
          }}
        >
          {productData
            ? renderItemsWithHover(
                productData,
                "GL_PROCESS",
                "target_object_type"
              )
            : "--"}
        </div>
      </Col>
    </Row>
  );
};

const PageNavigation = () => {
  return (
    <Nav
      variant="underline"
      defaultActiveKey="Overview"
      className="justify-content-start mt-1"
    >
      <Nav.Item>
        <Nav.Link eventKey="Overview" className="py-0">
          Overview
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="DueDiligence" className="py-0">
          Due Diligence
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="ProductService" className="py-0">
          Product/Service
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="Relationship" className="py-0">
          Relationship
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Default;
