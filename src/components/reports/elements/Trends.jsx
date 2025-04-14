import React from "react";
import { Minus, TrendingDown, TrendingUp, GitCommit } from "react-feather";

const Trends = ({ value, row, columnMeta }) => {
  if (value == "Low") return <TrendingDown color=" #8ac926" />;
  else if (value == "High") return <TrendingUp color="#ff595e" />;
  else if (value == "Medium") return <GitCommit color="#ffca3a" />;
  else return value;
};

export default React.memo(Trends);
