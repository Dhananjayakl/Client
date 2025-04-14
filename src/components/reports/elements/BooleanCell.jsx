import React from "react";
import { downloadFile } from "src/components/forms/reactformutils/fields/Attach";

import { CheckCircle, XCircle } from "react-feather";

const BooleanCell = ({ value }) => {
  if (!value) {
    return (
      <>
        <XCircle color="red" />
      </>
    );
  } else {
    // return <span>{formattedDate}</span>;

    return (
      <>
        <CheckCircle color="green" />
      </>
    );
  }
};

export default BooleanCell;
