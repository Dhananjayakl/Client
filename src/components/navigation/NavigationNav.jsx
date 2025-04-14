import React from "react";

import NavigationNavSection from "./NavigationNavSection";
const NavigationNav = ({ items }) => {
  return (
    <>
      {/* <h3>Navigation</h3>  */}
      {/* <ul className="sidebar-nav"> */}
      <ul className="sidebar-nav ps-0">
        <NavigationNavSection pages={items} />
      </ul>
    </>
  );
};

export default NavigationNav;
