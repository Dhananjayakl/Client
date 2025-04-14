import React from "react";
import NavigationNav from "./NavigationNav";

const Navigationbar = ({ items }) => {
  return (
    <>
      <div>
        <NavigationNav items={items} />
      </div>
    </>
  );
};

export default Navigationbar;
