// Below code this All conditon final Start

// import React from "react";
// import { Menu, MenuItem, SubMenu } from "@spaceymonk/react-radial-menu";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import OnlyNewLogo from "src/assets/img/Newlogo.png";
// import useTheme from "src/hooks/useTheme";
// import { Container, Row, Col } from "react-bootstrap";

// function CircularMenu() {
//   const navigate = useNavigate();
//   const [show, setShow] = React.useState(true);
//   const { theme } = useTheme();

//   const handleItemClick = (href) => {
//     navigate(href);
//   };

//   const handleDisplayClick = (position) => {};

//   const sidebarProps = useSelector((state) => state?.threesixty);
//   let dashboardItems = sidebarProps?.props?.dashboardItems || [];

//   // Ensure that each dashboard item has at least two children
//   if (dashboardItems.length === 1) {
//     dashboardItems = [
//       {
//         title: "Under Implementation",
//         pages: [{ href: "#", title: "Under Implementation", isVisible: false }],
//       },
//       ...dashboardItems,
//     ];
//   }

//   // Function to render submenus with hidden "Under Implementation" items
//   const renderSubMenu = (subMenuData) => {
//     const children = subMenuData.children || [];
//     let adjustedChildren = children;

//     if (adjustedChildren.length === 1) {
//       adjustedChildren = [
//         { title: "Under Implementation", href: "#", isVisible: false },
//         ...adjustedChildren,
//       ];
//     }

//     if (adjustedChildren.length < 2) {
//       return null;
//     }

//     return (
//       <SubMenu
//         onDisplayClick={handleDisplayClick}
//         itemView={subMenuData.title}
//         displayPosition="center"
//         key={subMenuData.title}
//         style={{ fontSize: "1.1rem" }}
//       >
//         {adjustedChildren.map((child) =>
//           child.isVisible === false ? null : child.children ? (
//             renderSubMenu(child)
//           ) : (
//             <MenuItem
//               key={child.title}
//               onItemClick={() => handleItemClick(child.href)}
//               style={{ fontSize: "1rem" }}
//             >
//               {child.title}
//             </MenuItem>
//           )
//         )}
//       </SubMenu>
//     );
//   };

//   return (
//     <Container
//       fluid
//       className={`monkmenu d-flex justify-content-center align-items-center border bg-white ${
//         theme === "dark" ? "menu-wrapper" : "custom-wrapper"
//       }`}
//     >
//       <Menu
//         innerRadius={100}
//         className="menu"
//         // centerX={550}
//         // centerY={300}
//         outerRadius={330}
//         show={show}
//         animation={["fade", "scale", "rotate"]}
//         animationTimeout={350}
//         animateSubMenuChange
//         drawBackground={true}
//       >
//         {dashboardItems
//           .filter((item) => item.isVisible !== false)
//           .map((item) => {
//             const pages = item.pages || [];
//             let adjustedPages = pages;

//             if (adjustedPages.length === 1) {
//               adjustedPages = [
//                 {
//                   title: "Under Implementation",
//                   href: "#",
//                   isVisible: false,
//                 },
//                 ...adjustedPages,
//               ];
//             }

//             return item.title !== "Under Implementation" ? (
//               <SubMenu
//                 onDisplayClick={handleDisplayClick}
//                 itemView={item.title}
//                 displayPosition="center"
//                 key={item.title}
//                 style={{ fontSize: "1.2rem" }}
//               >
//                 {adjustedPages.map((page) =>
//                   page.isVisible === false ? null : page.children ? (
//                     renderSubMenu(page)
//                   ) : (
//                     <MenuItem
//                       key={page.title}
//                       onItemClick={() => handleItemClick(page.href)}
//                       style={{ fontSize: "1.2rem" }}
//                     >
//                       {page.title}
//                     </MenuItem>
//                   )
//                 )}
//               </SubMenu>
//             ) : null;
//           })}
//       </Menu>
//     </Container>
//   );
// }

// export default CircularMenu;

// // Below code this only when i one child direct navigation start

// import React from "react";
// import { Menu, MenuItem, SubMenu } from "@spaceymonk/react-radial-menu";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import useTheme from "src/hooks/useTheme";
// import { Container } from "react-bootstrap";

// function CircularMenu() {
//   const navigate = useNavigate();
//   const [show, setShow] = React.useState(true);
//   const { theme } = useTheme();

//   const handleItemClick = (href) => {
//     navigate(href);
//   };

//   const handleDisplayClick = (position) => {};

//   const sidebarProps = useSelector((state) => state?.threesixty);
//   let dashboardItems = sidebarProps?.props?.dashboardItems || [];
//   // Ensure that each dashboard item has at least two children
//   if (dashboardItems.length === 1) {
//     dashboardItems = [
//       {
//         title: "Under Implementation",
//         pages: [{ href: "#", title: "Under Implementation", isVisible: false }],
//       },
//       ...dashboardItems,
//     ];
//   }

//   // Function to render submenus with hidden "Under Implementation" items
//   const renderSubMenu = (subMenuData) => {
//     const children = subMenuData.children || [];
//     let adjustedChildren = children;

//     if (adjustedChildren.length === 1) {
//       adjustedChildren = [
//         { title: "Under Implementation", href: "#", isVisible: false },
//         ...adjustedChildren,
//       ];
//     }

//     if (adjustedChildren.length < 2) {
//       return null;
//     }

//     return (
//       <SubMenu
//         onDisplayClick={handleDisplayClick}
//         itemView={subMenuData.title}
//         displayPosition="center"
//         key={subMenuData.title}
//         style={{ fontSize: "1.1rem" }}
//       >
//         {adjustedChildren.map((child) =>
//           child.isVisible === false ? null : child.children ? (
//             renderSubMenu(child)
//           ) : (
//             <MenuItem
//               key={child.title}
//               onItemClick={() => handleItemClick(child.href)}
//               style={{ fontSize: "1rem" }}
//             >
//               {child.title}
//             </MenuItem>
//           )
//         )}
//       </SubMenu>
//     );
//   };

//   return (
//     <Container
//       fluid
//       className={`monkmenu d-flex justify-content-center align-items-center border bg-white ${
//         theme === "dark" ? "menu-wrapper" : "custom-wrapper"
//       }`}
//     >
//       <Menu
//         innerRadius={100}
//         className="menu"
//         outerRadius={330}
//         show={show}
//         animation={["fade", "scale", "rotate"]}
//         animationTimeout={350}
//         animateSubMenuChange
//         drawBackground={true}
//       >
//         {dashboardItems
//           .filter((item) => item.isVisible !== false)
//           .map((item) => {
//             const pages = item.pages || [];
//             let adjustedPages = pages;
//             if (adjustedPages.length === 1) {
//               adjustedPages = [
//                 {
//                   title: "Under Implementation",
//                   href: "#",
//                   isVisible: false,
//                 },
//                 ...adjustedPages,
//               ];
//             }

//             // if (
//             //   adjustedPages.length === 2 &&
//             //   adjustedPages.some(
//             //     (page) => page.title === "Under Implementation"
//             //   )
//             // ) {
//             //   const visiblePage = adjustedPages.find(
//             //     (page) => page.title !== "Under Implementation"
//             //   );
//             //   return visiblePage ? (
//             //     <MenuItem
//             //       key={visiblePage.title}
//             //       onItemClick={() => handleItemClick(visiblePage.href)}
//             //       style={{ fontSize: "1.2rem" }}
//             //     >
//             //       {visiblePage.title}
//             //     </MenuItem>
//             //   ) : null;
//             // }
//             if (
//               adjustedPages.length === 2 &&
//               adjustedPages.some(
//                 (page) => page.title === "Under Implementation"
//               )
//             ) {
//               const visiblePage = adjustedPages.find(
//                 (page) => page.title !== "Under Implementation"
//               );
//               return visiblePage ? (
//                 <MenuItem
//                   key={item.title}
//                   onItemClick={() => handleItemClick(visiblePage.href)}
//                   style={{ fontSize: "1.2rem" }}
//                 >
//                   {item.title}
//                 </MenuItem>
//               ) : null;
//             }

//             return item.title !== "Under Implementation" ? (
//               <SubMenu
//                 onDisplayClick={handleDisplayClick}
//                 itemView={item.title}
//                 displayPosition="center"
//                 key={item.title}
//                 style={{ fontSize: "1.2rem" }}
//               >
//                 {adjustedPages.map((page) =>
//                   page.isVisible === false ? null : page.children ? (
//                     renderSubMenu(page)
//                   ) : (
//                     <MenuItem
//                       key={page.title}
//                       onItemClick={() => handleItemClick(page.href)}
//                       style={{ fontSize: "1.2rem" }}
//                     >
//                       {page.title}
//                     </MenuItem>
//                   )
//                 )}
//               </SubMenu>
//             ) : null;
//           })}
//       </Menu>
//     </Container>
//   );
// }

// export default CircularMenu;

// Below code this All conditon final End

// Below code this only when i one child direct navigation End

import React from "react";
import { Menu, MenuItem, SubMenu } from "@spaceymonk/react-radial-menu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useTheme from "src/hooks/useTheme";
import { Container } from "react-bootstrap";

function CircularMenu() {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(true);
  const { theme } = useTheme();

  const handleItemClick = (href) => {
    navigate(href);
  };

  const handleDisplayClick = (position) => {};

  const sidebarProps = useSelector((state) => state?.threesixty);
  let dashboardItems = sidebarProps?.props?.dashboardItems || [];
  // Ensure that each dashboard item has at least two children
  if (dashboardItems.length === 1) {
    dashboardItems = [
      {
        title: "Under Implementation",
        pages: [{ href: "#", title: "Under Implementation", isVisible: false }],
      },
      ...dashboardItems,
    ];
  }

  // Function to render submenus with hidden "Under Implementation" items
  const renderSubMenu = (subMenuData) => {
    const children = subMenuData.children || [];
    let adjustedChildren = children;

    if (adjustedChildren.length === 1) {
      adjustedChildren = [
        { title: "Under Implementation", href: "#", isVisible: false },
        ...adjustedChildren,
      ];
    }

    if (adjustedChildren.length < 2) {
      return null;
    }

    return (
      <SubMenu
        onDisplayClick={handleDisplayClick}
        itemView={subMenuData.title}
        displayPosition="center"
        key={subMenuData.title}
        style={{ fontSize: "1.1rem" }}
      >
        {adjustedChildren.map((child) =>
          child.isVisible === false ? null : child.children ? (
            renderSubMenu(child)
          ) : (
            <MenuItem
              key={child.title}
              onItemClick={() => handleItemClick(child.href)}
              style={{ fontSize: "1rem" }}
            >
              {child.title}
            </MenuItem>
          )
        )}
      </SubMenu>
    );
  };

  return (
    <Container
      fluid
      className={`monkmenu d-flex justify-content-center align-items-center border bg-white ${
        theme === "dark" ? "menu-wrapper" : "custom-wrapper"
      }`}
    >
      <Menu
        innerRadius={100}
        className="menu"
        outerRadius={390}
        show={show}
        animation={["fade", "scale", "rotate"]}
        animationTimeout={350}
        animateSubMenuChange
        drawBackground={true}
      >
        {dashboardItems
          .filter((item) => item.isVisible !== false)
          .map((item) => {
            const pages = item.pages || [];
            let adjustedPages = pages;
            if (adjustedPages.length === 1) {
              adjustedPages = [
                {
                  title: "Under Implementation",
                  href: "#",
                  isVisible: false,
                },
                ...adjustedPages,
              ];
            }

            // if (
            //   adjustedPages.length === 2 &&
            //   adjustedPages.some(
            //     (page) => page.title === "Under Implementation"
            //   )
            // ) {
            //   const visiblePage = adjustedPages.find(
            //     (page) => page.title !== "Under Implementation"
            //   );
            //   return visiblePage ? (
            //     <MenuItem
            //       key={visiblePage.title}
            //       onItemClick={() => handleItemClick(visiblePage.href)}
            //       style={{ fontSize: "1.2rem" }}
            //     >
            //       {visiblePage.title}
            //     </MenuItem>
            //   ) : null;
            // }
            if (
              adjustedPages.length === 2 &&
              adjustedPages.some(
                (page) => page.title === "Under Implementation"
              )
            ) {
              const visiblePage = adjustedPages.find(
                (page) => page.title !== "Under Implementation"
              );
              return visiblePage ? (
                <MenuItem
                  key={item.title}
                  onItemClick={() => handleItemClick(visiblePage.href)}
                  style={{ fontSize: "1.2rem" }}
                >
                  {item.title}
                </MenuItem>
              ) : null;
            }

            return item.title !== "Under Implementation" ? (
              <SubMenu
                onDisplayClick={handleDisplayClick}
                itemView={item.title}
                displayPosition="center"
                key={item.title}
                style={{ fontSize: "1.2rem" }}
              >
                {adjustedPages.map((page) =>
                  page.isVisible === false ? null : page.children ? (
                    renderSubMenu(page)
                  ) : (
                    <MenuItem
                      key={page.title}
                      onItemClick={() => handleItemClick(page.href)}
                      style={{ fontSize: "1.2rem" }}
                    >
                      {page.title}
                    </MenuItem>
                  )
                )}
              </SubMenu>
            ) : null;
          })}
      </Menu>
    </Container>
  );
}

export default CircularMenu;
