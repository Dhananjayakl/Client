// import ProcessAssessment from "src/components/forms/reactformutils/FormRuntimeEngine";

import { Row, Col, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { getObjectInfo, getObjectCount } from "../BRService";
import { useEffect, useState } from "react";
import ReportRuntime from "src/components/reports/Report";

let Configuration = () => {
  const [biaCount, setbiaCount] = useState("");
  const [raCount, setraCount] = useState("");
  const [bcpCount, setbcpCount] = useState("");
  const [exerciseCount, setexerciseCount] = useState("");

  const location = useLocation();
  let filterExpressionbia;
  if (location?.state?.objectData?.type === "Asset") {
    filterExpressionbia = `asset_name=${location?.state?.objectData?.id}`;
  } else {
    filterExpressionbia = `process_name=${location?.state?.objectData?.id}`;
  }
  let filterExpressionra;
  if (location?.state?.objectData?.type === "Asset") {
    filterExpressionra = `asset_name=${location?.state?.objectData?.id}`;
  } else {
    filterExpressionra = `process_name=${location?.state?.objectData?.id}`;
  }
  let filterExpressionbcp;
  if (location?.state?.objectData?.type === "Asset") {
    filterExpressionbcp = `${location?.state?.objectData?.bia_id}=any(process_asset)`;
  } else {
    filterExpressionbcp = `${location?.state?.objectData?.bia_id}=any(process_asset)`;
  }
  let impactRating = location?.state?.objectData;
  let filterExpressionexercise = `scope in (select object_id from pa_br_business_continuity_plan_bt  where ${location?.state?.objectData?.bia_id}=any(process_asset))`;

  console.log(impactRating, "restetsttett");

  useEffect(() => {
    if (location?.state?.objectData?.id !== "") {
      getObjectCount(
        "getObjectCount",
        "pa_br_business_impact_analysis_bt",
        filterExpressionbia
      )
        .then((response) => {
          setbiaCount(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (location?.state?.objectData?.id !== "") {
      getObjectCount(
        "getObjectCount",
        "pa_br_ra_recovery_strategy_bt",
        filterExpressionra
      )
        .then((response) => {
          setraCount(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (location?.state?.objectData?.bia_id !== "") {
      getObjectCount(
        "getObjectCount",
        "pa_br_business_continuity_plan_bt",
        filterExpressionbcp
      )
        .then((response) => {
          setbcpCount(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (location?.state?.objectData?.bia_id !== "") {
      getObjectCount(
        "getObjectCount",
        "pa_br_exercise_plan_bt",
        filterExpressionexercise
      )
        .then((response) => {
          setexerciseCount(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    location,
    filterExpressionbia,
    filterExpressionra,
    filterExpressionbcp,
    filterExpressionexercise,
  ]);

  return (
    <>
      <Row>
        <Col xl={4} lg={4} md={4} sm={6}>
          {location?.state?.objectData?.type === "Process" && (
            <ReportRuntime
              report="GL_PROCESS_DETAILS"
              drilldownReports={{ objectId: location?.state?.objectData?.id }}
            />
          )}
          {location?.state?.objectData?.type === "Asset" && (
            <ReportRuntime
              report="GL_ASSET_DETAILS"
              drilldownReports={{ objectId: location?.state?.objectData?.id }}
            />
          )}
        </Col>

        <Col className="gx-4">
          <Card className="reportChart-cards">
            <Card.Body>
              <div className="row text-center">
                <div className="col-md-3 border-end">
                  <h5 className="text-secondary">BIA</h5>
                  <div className="display-6">{biaCount}</div>
                </div>
                <div className="col-md-3 border-end">
                  <h5 className="text-secondary">Recovery Strategies</h5>
                  <div className="display-6">{raCount}</div>
                </div>
                <div className="col-md-3 border-end">
                  <h5 className="text-secondary">BCP</h5>
                  <div className="display-6">{bcpCount}</div>
                </div>
                <div className="col-md-3 border-end">
                  <h5 className="text-secondary">Exercises</h5>
                  <div className="display-6">{exerciseCount}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
          <Col className="gx-4">
            <Card className="reportChart-cards">
              <Card.Body>
                <div className="row text-center">
                  <div className="col-md-3 border-end">
                    <h5 className="text-secondary">RTO</h5>
                    <div className="display-6">{impactRating?.rto}</div>
                  </div>
                  <div className="col-md-3 border-end">
                    <h5 className="text-secondary">RPO</h5>
                    <div className="display-6">{impactRating?.rpo}</div>
                  </div>
                  <div className="col-md-3 border-end">
                    <h5 className="text-secondary">WRT</h5>
                    <div className="display-6">{impactRating?.wrt}</div>
                  </div>
                  <div className="col-md-3 border-end">
                    <h5 className="text-secondary">MTD</h5>
                    <div className="display-6">{impactRating?.mtd}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Col>
      </Row>

      <Row>
        <Col xl={6} lg={6} md={6} sm={6}>
          <div>
            <ReportRuntime
              report="BR_BIA_PROCESS_REPORT"
              drilldownReports={{
                processName: location?.state?.objectData?.id,
              }}
            />
          </div>
        </Col>
        <Col xl={6} lg={6} md={6} sm={6}>
          <div>
            <ReportRuntime
              report="BR_RA_PROCESS_REPORT"
              drilldownReports={{
                processName: location?.state?.objectData?.id,
              }}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xl={6} lg={6} md={6} sm={6}>
          <div>
            <ReportRuntime
              report="BR_BCP_PROCESS_ASSET"
              drilldownReports={{
                processAsset: location?.state?.objectData?.bia_id,
              }}
            />
          </div>
        </Col>
        <Col xl={6} lg={6} md={6} sm={6}>
          <div>
            <ReportRuntime
              report="BR_EXERCISE_REPORT"
              drilldownReports={{
                bcpId: location?.state?.objectData?.bia_id,
              }}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Configuration;
