// import React from "react";
// import { NavLink } from "react-router-dom";
// import { Badge, Card, Container, Row, Col } from "react-bootstrap";

// const TitleComponent = ({ title,maintitle }) => { //style={title.props.style}
//     return <span style={{ fontSize: '1rem' }} >{title.props.children} </span>;
// };

// const ChildrenComponent = ({ children }) => {
//     const pages = children.props.pages;
//     const itemsPerColumn = Math.ceil(pages.length / 3);

//     return (
//         <Row className="text-black  ps-5 pb-2 ">
//             {[...Array(3)].map((_, colIndex) => (
//                 <Col key={colIndex}>
//                     <ul>
//                         {pages
//                             .slice(colIndex * itemsPerColumn, (colIndex + 1) * itemsPerColumn)
//                             .map((page, index) => (
//                                 <li key={index} className=" pt-3 " style={{ fontSize: '0.9rem' }}>

//                                     <NavLink to={page.href}>{page.title}</NavLink>
//                                 </li>
//                             ))}
//                     </ul>
//                 </Col>
//             ))}
//         </Row>
//     );
// };

// const NavigationNavListItem = (props) => {
//     const { title, href, depth = 0, children, icon: Icon, badge,maintitle } = props;

//     if (children) {
//         return (
//             <Container className="container-fluid">
//                 {/* <Card style={{ width: "100%"}}> */}
//                     <li className="">

//                         <a className="text-black">
//                             <div className="pt-3 ps-4 pb-3" style={{ padding: '2px', position: 'relative' }}>
//                                 {Icon && <Icon className="me-3 " style={{ color: 'green' }} />}{" "}

//                                 <TitleComponent title={title} maintitle={maintitle}/>
//                                 <div style={{ position: 'absolute', bottom: 0, left: '50px', right: '50px', borderBottom: '0.5px solid gray' }}></div>

//                             </div>
//                         </a>
//                         {children && <ChildrenComponent children={children} />}
//                     </li>
//                 {/* </Card> */}
//             </Container>
//         );
//     }
// };

// export default NavigationNavListItem;

// NAVIGATION WORKING FINE START

import React from "react";
import { NavLink } from "react-router-dom";
import { Badge, Card, Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const TitleComponent = ({ title }) => {
const { t } = useTranslation("common");
  //style={title.props.style}
  return <span style={{ fontSize: "1rem" }}>{t(title.props.children)}</span>;
};

const ChildrenComponent = ({ children, maintitle }) => {
 const { t } = useTranslation("common");
  const pages = children.props.pages;
  // Determine the number of columns based on maintitle
  // const numberOfColumns = maintitle === "Applications" ? 3 : 1;
  const titlesWithThreeColumns = ["Administration"];
  const numberOfColumns = titlesWithThreeColumns.includes(maintitle) ? 1 : 3;
  const itemsPerColumn = Math.ceil(pages.length / numberOfColumns);

  return (
    <Row className="text-black ps-3 pb-1 ">
      {[...Array(numberOfColumns)].map((_, colIndex) => (
        <Col key={colIndex}>
          <ul>
            {pages
              .slice(colIndex * itemsPerColumn, (colIndex + 1) * itemsPerColumn)
              .map((page, index) => (
                <li key={index} className="pt-2" style={{ fontSize: "0.9rem" }}>
                  <NavLink to={page.href} className="NavChildLink">
                    {t(page.title)}
                  </NavLink>
                </li>
              ))}
          </ul>
        </Col>
      ))}
    </Row>
  );
};

const NavigationNavListItem = (props) => {
  const {
    title,
    href,
    depth = 0,
    children,
    icon: Icon,
    badge,
    maintitle,
  } = props;
  if (children) {
    return (
      <Container className="container-fluid">
        <Card style={{ width: "100%" }}>
          <li className="">
            <a className="text-black sidebar-link-navigation ">
              <div className="px-1 ps-3" style={{ position: "relative" }}>
                <div style={{ cursor: "default" }}>
                  {Icon && (
                    <Icon className="me-3 " style={{ color: "green" }} />
                  )}{" "}
                  <TitleComponent title={title} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "20px",
                    right: "10px",
                    borderBottom: "0.5px solid gray",
                  }}
                ></div>
              </div>
              {/* {badge && (
                <Badge className="" bg="" size={18}>
                  {badge}
                </Badge>
              )} */}
            </a>
            {children && (
              <ChildrenComponent children={children} maintitle={maintitle} />
            )}
          </li>
        </Card>
      </Container>
    );
  }
};

export default NavigationNavListItem;

// NAVIGATION WORKING FINE END
