import React from "react";
import { matchPath } from "react-router-dom";

import SidebarNavListItem from "./SidebarNavListItem";
import SidebarNavList from "./SidebarNavList";
import { useTranslation } from "react-i18next";

const reduceChildRoutes = (props) => {
  const { items, page, depth, currentRoute } = props;
  const { t } = useTranslation();
  if (page.children) {
    const open = page.href
      ? !!matchPath(
          {
            path: page.href,
            end: false,
          },
          currentRoute
        )
      : false;
    const key = `child_${page.title}_${page.href}_${depth}`;

    items.push(
      <SidebarNavListItem
        depth={depth}
        icon={page.icon}
        key={key}
        badge={page.badge}
        open={!!open}
        title={page.title}
        href={page.href}
      >
        <SidebarNavList depth={depth + 1} pages={page.children} />
      </SidebarNavListItem>
    );
  } else {
    const key = `child_${page.title}_${page.href}_${depth}`;
    items.push(
      <SidebarNavListItem
        depth={depth}
        href={page.href}
        icon={page.icon}
        key={key}
        badge={page.badge}
        title={page.title}
      />
    );
  }

  return items;
};

export default reduceChildRoutes;
