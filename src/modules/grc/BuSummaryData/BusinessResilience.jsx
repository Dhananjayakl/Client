// import React from "react";
// import { Row, Col, Card } from "react-bootstrap";
// import Chart from "src/components/charts/Chart";
// import DataCards from "./DataCards";
// import DataCardsForIssue from "./DataCardsForIssue";

// import { useTranslation } from "react-i18next";


// const cardData = (businessData, businessResilienceData,countofFramework) => { 
//   const { t } = useTranslation("common");

//   return [
//   {
//     label: t("Process"),
//     value: businessData?.process_bt || 0,
//     objectName: "GL_PROCESS_BY_BU",
//     length: 3,
//   },
//   {
//     label: t("Assets"),
//     value: businessData?.asset_bt || 0,
//     objectName: "GL_ASSET_BY_BU",
//     length: 2,
//   },
//   {
//     label: t("BIA"),
//     value:  countofFramework?.["Business Resilience"]?.[0]
//     ?.BIA || 0,
//     objectName: "BR_IMPACT_ANALYSIS",
//     length: 2,
//   },
//   {
//     label: t("BCP"),
//     value: countofFramework?.["Business Resilience"]?.[0]
//     ?.BCP || 0,
//     objectName: "BR_CONTINUITY_PLAN",
//     length: 2,
//   },
//   {
//     label: t("Exercise"),
//     value: businessData?.exercise_bt || 0,
//     objectName: "BR_EXCERCISE_PLAN",
//     length: 3,
//   },
// ];
// };

// const BusinessResilience = ({
//   objectId,
//   refreshCharts,
//   businessData,
//   businessResilienceData,
//   countofFramework,
//   yearStr,
// }) => {
//   const items = cardData(businessData, businessResilienceData,countofFramework).filter(
//     (item) => item.value !== undefined
//   );

//   return (
//     <>
//       <Row className="d-flex justify-content-center">
//         <Col className="gx-5">
//           <Card className="shadow-lg p-4 rounded position-relative">
//             <Card.Body>
//               <DataCards items={items} yearStr={yearStr} objectId={objectId} />
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       <Row>
//         <Col md={4}>
//           <Chart
//             chart="BR_DEPENDENCY_GAP"
//             defaultFilter={{ processId: objectId }}
//             customExpressionFlag
//             key={refreshCharts}
//             yearProp={yearStr}
//           />
//         </Col>
//         <Col md={4}>
//           <Chart
//             chart="BR_PLANS_BY_EXERCISE_STATUS_CHART"
//             defaultFilter={{ processId: objectId }}
//             customExpressionFlag
//             key={refreshCharts}
//             yearProp={yearStr}
//             yearFlag
//           />
//         </Col>
//         <Col md={4}>
//           <Chart
//             chart="BR_PLANS_BY_EXERCISE_RESULTS_CHART"
//             defaultFilter={{ processId: objectId }}
//             customExpressionFlag
//             key={refreshCharts}
//             yearProp={yearStr}
//             yearFlag
//           />
//         </Col>
//       </Row>
//       <Row>
//         <Col md={4}>
//           <Chart
//             chart="BR_EXERCISE_BY_STATUS_CHART"
//             defaultFilter={{ processId: objectId }}
//             customExpressionFlag
//             key={refreshCharts}
//             yearProp={yearStr}
//             yearFlag
//           />    
//         </Col>
//         <Col md={4}>
//           <Chart
//             chart="BR_BIA_BY_STATUS_CHARTS"
//             defaultFilter={{ processId: objectId }}
//             customExpressionFlag
//             key={refreshCharts}
//             yearProp={yearStr}
//             yearFlag
//           />
//         </Col>
//         <Col md={4}>
//           <Chart
//             chart="BR_BC_PLAN_BY_STATUS_CHART"
//             defaultFilter={{ processId: objectId }}
//             customExpressionFlag
//             key={refreshCharts}
//             yearProp={yearStr}
//             yearFlag
//           />
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default BusinessResilience;




import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import Chart from "src/components/charts/Chart";
import DataCards from "./DataCards";
import DataCardsForFinancialYear from "./DataCardsForFinancialYear";
import { useTranslation } from "react-i18next";

const cardData = (businessData, businessResilienceData, countofFramework) => {
  const { t } = useTranslation("common");
  return [
    {
      label: t("Process"),
      value: businessData?.process_bt || 0,
      objectName: "GL_PROCESS_BY_BU",
      length: 3,
    },
    {
      label: t("Assets"),
      value: businessData?.asset_bt || 0,
      objectName: "GL_ASSET_BY_BU",
      length: 2,
    },
    {
      label: t("BIA"),
      value: countofFramework?.["Business Resilience"]?.[0]?.BIA || 0,
      objectName: "BR_IMPACT_ANALYSIS",
      length: 2,
    },
    {
      label: t("BCP"),
      value: countofFramework?.["Business Resilience"]?.[0]?.BCP || 0,
      objectName: "BR_CONTINUITY_PLAN",
      length: 2,
    },
    {
      label: t("Exercise"),
      value: businessData?.exercise_bt || 0,
      objectName: "BR_EXCERCISE_PLAN",
      length: 3,
    },
  ];
};

const BusinessResilience = ({
  objectId,
  refreshCharts,
  businessData,
  businessResilienceData,
  countofFramework,
  yearStr,
}) => {
 
  const items = cardData(businessData, businessResilienceData, countofFramework).filter(
    (item) => item.value !== undefined
  );
  return (
    <>
      <Row className="d-flex justify-content-center">
        {items.map((item, index) => {
          // Check if the current item is for BIA or BCP and render accordingly
          if (item.label === "BCP" || item.label === "BIA") {
            return (
              <Col key={index} className="gx-0">
                <Card className="shadow-lg p-4 rounded position-relative">
                  <Card.Body>
                    <DataCardsForFinancialYear
                      items={[item]} // Only pass the specific item (BIA or BCP)
                      yearStr={yearStr}
                      objectId={objectId}
                    />
                  </Card.Body>
                </Card>
              </Col>
            );
          } else {
          return (   // For all other items, render DataCards
            <Col key={index} className="gx-0">
              <Card className="shadow-lg p-4 rounded position-relative">
                <Card.Body>
                  <DataCards
                    items={[item]} // Only pass the specific item
                    yearStr={yearStr}
                    objectId={objectId}
             />
            </Card.Body>
           </Card>
          </Col>
             );
          }
        })}
      </Row>

      <Row>
        <Col md={4}>
          <Chart
            chart="BR_DEPENDENCY_GAP"
            defaultFilter={{ processId: objectId }}
            customExpressionFlag
            key={refreshCharts}
            yearProp={yearStr}
          />
        </Col>
        <Col md={4}>
          <Chart
            chart="BR_PLANS_BY_EXERCISE_STATUS_CHART"
            defaultFilter={{ processId: objectId }}
            customExpressionFlag
            key={refreshCharts}
            yearProp={yearStr}
            yearFlag
          />
        </Col>
        <Col md={4}>
          <Chart
            chart="BR_PLANS_BY_EXERCISE_RESULTS_CHART"
            defaultFilter={{ processId: objectId }}
            customExpressionFlag
            key={refreshCharts}
            yearProp={yearStr}
            yearFlag
          />
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Chart
            chart="BR_EXERCISE_BY_STATUS_CHART"
            defaultFilter={{ processId: objectId }}
            customExpressionFlag
            key={refreshCharts}
            yearProp={yearStr}
            yearFlag
          />
        </Col>
        <Col md={4}>
          <Chart
            chart="BR_BIA_BY_STATUS_CHARTS"
            defaultFilter={{ processId: objectId }}
            customExpressionFlag
            key={refreshCharts}
            yearProp={yearStr}
            yearFlag
          />
        </Col>
        <Col md={4}>
          <Chart
            chart="BR_BC_PLAN_BY_STATUS_CHART"
            defaultFilter={{ processId: objectId }}
            customExpressionFlag
            key={refreshCharts}
            yearProp={yearStr}
            yearFlag
          />
        </Col>
      </Row>
    </>
  );
};

export default BusinessResilience;
