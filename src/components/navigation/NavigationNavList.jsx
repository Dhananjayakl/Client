import React from "react";
import { useLocation } from "react-router-dom";
import reduceChildRoutes from "./navigationReduceChildRotes";

const NavigationNavList = (props) => {
  const { pages, depth, maintitle } = props;

  const router = useLocation();
  const currentRoute = router.pathname;

  const childRoutes = pages.reduce(
    (items, page) =>
      reduceChildRoutes({ items, page, currentRoute, depth, maintitle }),
    []
  );

  return <React.Fragment>{childRoutes}</React.Fragment>;
};

export default NavigationNavList;
