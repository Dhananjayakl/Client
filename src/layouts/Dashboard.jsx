import React, { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import * as Icon from "react-feather";

import Wrapper from "../components/Wrapper";
import Sidebar from "../components/sidebar/Sidebar";
import Main from "../components/Main";
import Navbar from "../components/navbar/Navbar";
import Content from "../components/Content";
import Footer from "../components/Footer";
import Settings from "../components/Settings";
import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import { getServiceData } from "src/components/server/service";
import { useTranslation } from "react-i18next";
import { setthreesixtySlicerProps } from "src/redux/slices/ThreeSixtyMenu";
import { setSystemConfig } from "src/redux/slices/SystemConfig";

function flatToHierarchy(flat, t) {
  const categories = {};
  flat.forEach((item) => {
    const ModuleIcon = Icon[item.icon];
    const category = item.admin_setup
      ? "Administration"
      : item.offering || "Applications";
    if (!categories[category]) {
      categories[category] = [];
    }

    let obj = categories[category].find((o) => o.title === item.name);
    if (obj) {
      obj.children.push({
        href: "/page?id=" + item.page_id,
        title:
          item.page_name === t(item.page_name)
            ? item.page_title
            : t(item.page_name),
        name: item.page_name,
      });
      return true;
    } else {
      categories[category].push({
        href: item.acronym_app,
        icon: ModuleIcon,
        title: item.name,
        children: [
          {
            href: "/page?id=" + item.page_id,
            title:
              item.page_name === t(item.page_name)
                ? item.page_title
                : t(item.page_name),
            name: item.page_name,
          },
        ],
      });
    }
  });

  const navItems = Object.keys(categories).map((key) => {
    categories[key].forEach((part, index) => {
      if (part.children.length === 1) {
        part.href = part.children[0].href;
        delete part.children;
      }
    });

    return {
      title: key,
      pages: categories[key],
    };
  });

  navItems.sort((a, b) => {
    if (a.title === "Administration") return 1;
    if (b.title === "Administration") return -1;
    if (a.title === "Applications") return 1;
    if (b.title === "Applications") return -1;
    return 0;
  });
  return navItems;
}

const Dashboard = ({ children }) => {
  const { t } = useTranslation();

  const [dashboardItems, setDashboardItems] = React.useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const sanitizedDashboardItems = dashboardItems.map((item) => ({
      ...item,
      pages: item.pages.map((page) => {
        const { icon, ...restPage } = page;
        return restPage;
      }),
    }));
    dispatch(
      setthreesixtySlicerProps({ dashboardItems: sanitizedDashboardItems })
    );
  }, [dashboardItems]);
  // useEffect(() => {
  //   dispatch(setthreesixtySlicerProps({ dashboardItems }));
  // }, [dashboardItems]);

  useEffect(() => {
    getServiceData("getpagesinfo")
      .then((response) => {
        const finalNavItems = flatToHierarchy(response.data.data, t);
        setDashboardItems(finalNavItems);

        const { systemConfig } = response.data;

        dispatch(setSystemConfig(systemConfig));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [t]);

  return (
    <React.Fragment>
      <Wrapper>
        <Sidebar items={dashboardItems} />
        <Main>
          <Navbar />
          <Content>
            <Suspense fallback={<Loader />}>
              {children}
              <Outlet />
            </Suspense>
          </Content>
          <Footer />
        </Main>
      </Wrapper>
      {/* <Settings /> */}
    </React.Fragment>
  );
};

export default Dashboard;
