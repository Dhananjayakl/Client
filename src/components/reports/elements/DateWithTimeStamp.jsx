import React from "react";

const DateWithTimeStampCell = ({ value, format }) => {
  // if (!value) {
  //   return;
  // } else {
  //   const dateObj = new Date(value);
  //   const day = dateObj.getDate().toString().padStart(2, "0");
  //   const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  //   const year = dateObj.getFullYear();
  //   const formattedDate = `${day}-${month}-${year}`;
  //   return <span>{formattedDate}</span>;
  // }
  return <span>{value}</span>;
};

export default DateWithTimeStampCell;
