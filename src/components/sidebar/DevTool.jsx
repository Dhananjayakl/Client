//DevelopmentTool Cards Start

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Button, Card } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faCog,
//   faCogs,
//   faFileAlt,
//   faLineChart,
//   faExchangeAlt,
//   faBriefcase,
//   faSnowflake,
//   faFolderClosed,
// } from "@fortawesome/free-solid-svg-icons";

// const DevTool = (props) => {
//   const navigate = useNavigate();

//   const items = [
//     { id: 28, icon: faSnowflake, text: "Modules" },
//     { id: 29, icon: faFileAlt, text: "Forms" },
//     { id: 35, icon: faFolderClosed, text: "Reports" },
//     { id: 27, icon: faBriefcase, text: "WorkFlows" },
//     { id: 50, icon: faLineChart, text: "Charts" },
//     { id: 94, icon: faExchangeAlt, text: "Import & Exports" },
//   ];

//   return (
//     <div>
//       <h2>Development Tools</h2>
//       <div className="devtool-container mt-7">
//         {items.map((item) => (
//           <Card key={item.id} className="devtool-card reportChart-cards">
//             <Card.Body className="d-flex align-items-center justify-content-center">
//               <FontAwesomeIcon
//                 icon={item.icon}
//                 size="3x"
//                 className="devtool-icon me-3"
//               />
//               {/* <h3 className="mb-0 devtool">{item.text}</h3> */}
//               <Button variant="link">
//                 <h3
//                   className="mb-0 devtool"
//                   onClick={() => navigate(`/page?id=${item.id}`)}
//                 >
//                   {item.text}
//                 </h3>
//               </Button>
//             </Card.Body>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DevTool;
//DevelopmentTool Cards End

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Button, Card, Row, Col } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faFileAlt,
//   faLineChart,
//   faExchangeAlt,
//   faBriefcase,
//   faSnowflake,
//   faFolderClosed,
// } from "@fortawesome/free-solid-svg-icons";

// const DevTool = (props) => {
//   const navigate = useNavigate();

//   const items = [
//     { name: "MODULES", icon: faSnowflake, text: "Modules" },
//     { name: "FORMS", icon: faFileAlt, text: "Forms" },
//     { name: "WORK_FLOWS", icon: faBriefcase, text: "WorkFlows" },
//     { name: "REPORTS", icon: faFolderClosed, text: "Reports" },
//     { name: "CHARTS", icon: faLineChart, text: "Charts" },
//     { name: "IMPORTS_EXPORTS", icon: faExchangeAlt, text: "Import & Exports" },
//   ];

//   return (
//     <div>
//       {/* <Card> */}
//       <h3 className="m-1">Development Studio</h3>

//       <div className="circle-container">
//         <div className="outer-circle">
//           <h3 className="inner-circle">Development Studio</h3>
//           {items.map((item, index) => (
//             <div
//               key={item.id}
//               className={`card-container card-position-${index + 1}`}
//             >
//               <Card
//                 className="devtool-card border "
//                 onClick={() => navigate(`/page?name=${item.name}`)}
//               >
//                 <Card.Body className="d-flex align-items-center justify-content-center">
//                   <FontAwesomeIcon
//                     icon={item.icon}
//                     // size="2x"
//                     size="3x"
//                     className="devtool-icon me-3 border"
//                   />

//                   <Button variant="link" className="border">
//                     <h4 className="mb-0 devtool ">{item.text}</h4>
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* </Card> */}
//     </div>
//   );
// };

// export default DevTool;

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faLineChart,
  faExchangeAlt,
  faBriefcase,
  faSnowflake,
  faFolderClosed,
} from "@fortawesome/free-solid-svg-icons";

const DevTool = (props) => {
  const navigate = useNavigate();

  const items = [
    { name: "MODULES", icon: faSnowflake, text: "Modules" },
    { name: "FORMS", icon: faFileAlt, text: "Forms" },
    { name: "WORK_FLOWS", icon: faBriefcase, text: "WorkFlows" },
    { name: "REPORTS", icon: faFolderClosed, text: "Reports" },
    { name: "CHARTS", icon: faLineChart, text: "Charts" },
    { name: "IMPORTS_EXPORTS", icon: faExchangeAlt, text: "Import & Exports" },
  ];

  return (
    <div>
      <h3 className="m-1  text-black ">Development Studio</h3>
      <div className="circle-container">
        <div className="outer-circle border-black border ">
          <h3 className="inner-circle border-black  border">
            Development Studio
          </h3>
          {items.map((item, index) => (
            <div
              key={index}
              className={`card-container card-position-${index + 1}`}
            >
              <Card
                className="devtool-card border"
                onClick={() => navigate(`/page?name=${item.name}`)}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <FontAwesomeIcon
                    icon={item.icon}
                    size="3x"
                    className="devtool-icon mb-3"
                  />
                  <Button variant="link" className="p-0">
                    <h4 className="mb-0 devtool">{item.text}</h4>
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevTool;
