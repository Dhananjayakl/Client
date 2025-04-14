import ReportRuntime from "src/components/reports/Report";
import BusinessEntity from "src/components/forms/reactformutils/FormRuntimeEngine";
import OffCanvasForm from "src/components/pages/OffCanvasNew";
import { useEffect, useState } from "react";
import { getviewData } from "../AdminService";
import { Card, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import BusinessUnitTree from "./BUSINESS_HIERARCHY";
import BusinessUnitTree from "./BusinessUnitTree";

let BusinessUnit = () => {
  const [businessunitData, setBussinessUnitData] = useState(null);
  const [rootData, setRootData] = useState(null);
  const [entityName, setentityName] = useState(null);

  let navigate = useNavigate();

  function gettheData() {
    const viewParams = {
      viewName: "pa_business_entity_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: "",
    };

    getviewData(viewParams)
      .then((response) => {
        response.data.data.map((businessData) => {
          if (businessData.business_entity_name == "Enterprise") {
            setentityName(businessData.business_entity_id);
          }
        });
        setBussinessUnitData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching business unit data:", error);
      });
  }

  useEffect(() => {
    gettheData();
  }, []);

  useEffect(() => {
    if (businessunitData) {
      let rootBusinessUnit = businessunitData.filter(
        (bu) =>
          bu.parent_entity_id === null || bu.parent_entity_id === undefined
      );
      console.log(rootBusinessUnit, "rootBuunit");
      setRootData(rootBusinessUnit[0]);
    }
  }, [businessunitData]);

  return (
    <>
      <div className="ms-auto text-end me-0">
        <OffCanvasForm
          component={
            <BusinessEntity
              formService="businessunit"
              objectId={-1}
              offCanvas
            />
          }
          title="Business Unit"
        />
      </div>

      <Tabs
        defaultActiveKey="table"
        id="business-unit-tabs"
        variant="underline"
      >
        <Tab eventKey="hierarchy" title="Business Unit Chart" className="pt-3">
          <Card className="reportChart-cards  ">
            <div
              className="heirachy-container d-flex"
              style={{ overflow: "auto" }}
            >
              {rootData ? (
                <BusinessUnitTree
                  rootData={rootData}
                  businessunitData={businessunitData}
                  gettheData={gettheData}
                  businessUnitId={entityName}
                />
              ) : (
                ""
              )}
            </div>
          </Card>
        </Tab>

        <Tab eventKey="table" title="Tabular View" className="pt-3">
          <ReportRuntime report="BUSINESS_UNIT" />
          {/* <ReportRuntime report="APPLICABLE_BUSINESS_UNIT" /> */}
        </Tab>
      </Tabs>
    </>
  );
};

export default BusinessUnit;
