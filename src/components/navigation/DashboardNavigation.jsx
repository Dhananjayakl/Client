import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navigationbar from "./Navigationbar";
import * as Icon from "react-feather";
import { getServiceData } from "src/components/server/service";

function flatToHierarchy(flat, t) {
  const groupedData = {
    Administration: [],
    Applications: [],
  };

  flat.forEach((item) => {
    const ModuleIcon = Icon[item.icon];
    const pageItem = {
      href: "/page?id=" + item.page_id,
      title:
        item.page_name === t(item.page_name)
          ? item.page_title
          : t(item.page_name),
      name: item.page_name,
    };

    const category = item.admin_setup
      ? "Administration"
      : item.offering || "Applications";

    if (item.admin_setup) {
      const groupObj = groupedData.Administration.find(
        (o) => o.title === item.name
      );

      if (groupObj) {
        groupObj.children.push(pageItem);
      } else {
        groupedData.Administration.push({
          href: item.acronym_app,
          icon: ModuleIcon,
          title: item.name,
          children: [pageItem],
        });
      }
    } else {
      if (!groupedData[category]) {
        groupedData[category] = [];
      }

      const groupObj = groupedData[category].find((o) => o.title === item.name);

      if (groupObj) {
        groupObj.children.push(pageItem);
      } else {
        groupedData[category].push({
          href: item.acronym_app,
          icon: ModuleIcon,
          title: item.name,
          children: [pageItem],
        });
      }
    }
  });

  const navItems = Object.keys(groupedData)
    .filter((key) => groupedData[key].length > 0)
    .map((key) => ({
      title: key,
      pages: groupedData[key],
    }));

  navItems.sort((a, b) => {
    if (a.title === "Administration") return 1;
    if (b.title === "Administration") return -1;
    if (a.title === "Applications") return 1;
    if (b.title === "Applications") return -1;
    return 0;
  });

  return navItems;
}

const DashboardNavigation = () => {
  const { t } = useTranslation();
  const [dashboardItems, setDashboardItems] = React.useState([]);

  useEffect(() => {
    getServiceData("getpagesinfo")
      .then((response) => {
        const finalNavItems = flatToHierarchy(response.data.data, t);
        setDashboardItems(finalNavItems);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [t]);

  return (
    <>
      <Navigationbar items={dashboardItems} />
    </>
  );
};

export default DashboardNavigation;
