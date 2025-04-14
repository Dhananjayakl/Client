import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Tabs,
Card
} from "react-bootstrap";
import {
faFilePdf,
faArrowsSpin,
faTriangleExclamation,
faCheckToSlot,
faComments,
faBuilding,
faBriefcase,
faBookBookmark,
faTimes,
faHome,
faCheckCircle,
faBalanceScale,
faGavel
} from "@fortawesome/free-solid-svg-icons";
import { getviewData } from "src/modules/grc/GrcService";
import ReportRuntime from "src/components/reports/Report";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { PageBreadCrumb, PageBreadCrumbItem } from "./PageUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";




const Default = () => {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  const [ROdata, setROdata] = useState(null);

  console.log(ROdata ,"khdfgh");
  

 
  const fetchRoData = () => {
    getviewData({
      viewName: "pa_ct_reporting_obligations_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `object_id=${objectId}`,
    })
      .then((response) => {
        setROdata(response.data.data[0]);
        console.log("Rahulllllll,", response);
      })
     
  };

  useEffect(() => { 
    fetchRoData();
  }, [objectId]);

 
  return (
    <div>
      <Container fluid className="p-3">
      <div className="shadow sticky-top bg-white z-1">
          <PageBreadCrumb>
            <PageBreadCrumbItem title={"Compliance Obligations Environment"} />
            <PageBreadCrumbItem title={ROdata?.deliverable} />
          </PageBreadCrumb>
          <Card className="sticky-top px-2 py-1 mb-3" style={{ zIndex: "1" }}>
            <Row>
              <Col lg={8}>
                <div className="h4 overflow-hidden ">
                  <FontAwesomeIcon icon={faGavel} />{" "}
                  {ROdata?.deliverable}
                </div>
              </Col>
              <Col>
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
              </Col>
            </Row>
          </Card>
        </div>

        <Row className="gx-5">
          <Col md={6}>
            <Row>
              <ReportRuntime
                report="CT_RO_BY_ID"
                drilldownReports={{ objectId: objectId }}
              />
            </Row>
          </Col>
          <Col md={6}>
          <Row>
              <ReportRuntime
                report="CT_RELATED_OBLIGATIONS_TASK"
                drilldownReports={{ reportingObligationId: objectId }}
                dataCard
              />
            </Row>
          </Col>
      
        </Row>
        <Row className="gx-5">
          
           
              <ReportRuntime
                report="CT_RELATED_OBLIGATIONS_TASK"
                drilldownReports={{ reportingObligationId: objectId }}
                
              />
            
          
      
        </Row>
      </Container>
    </div>
  );
};

export default Default;
