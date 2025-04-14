import React from "react";
import { matchPath } from "react-router-dom";

import NavigationNavList from "./NavigationNavList";
import NavigationNavListItem from "./NavigationNavListItems";

const reduceChildRoutes = (props) => {
  const { items, page, depth, currentRoute, maintitle } = props;
  const commonStyle = {}; // { fontSize: '15px', fontWeight: 'bold', color: 'grey' };
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
      <NavigationNavListItem
        depth={depth}
        icon={page.icon}
        key={key}
        badge={page.badge}
        open={!!open}
        // title={page.title}
        title={<span style={commonStyle}>{page.title}</span>}
        href={page.href}
        maintitle={maintitle}
      >
        <NavigationNavList
          depth={depth + 1}
          pages={page.children}
          maintitle={maintitle}
        />
      </NavigationNavListItem>
    );
  } else {
    items.push(
      <NavigationNavListItem
        depth={depth}
        href={page.href}
        icon={page.icon}
        key={key}
        // key={page.title}
        badge={page.badge}
        // title={page.title}
        title={<span style={commonStyle}>{page.title}</span>}
        maintitle={maintitle}
      />
    );
  }

  return items;
};

export default reduceChildRoutes;
