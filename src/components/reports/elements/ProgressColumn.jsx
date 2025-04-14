import React from "react";
import { ProgressBar } from "react-bootstrap";

const ProgressColumn = ({ value, row, columnMeta }) => {
  const percentage = Math.min(value, 100);
  const remaining = row?.original?.total_days;
  const clampedValue = Math.min(value, remaining);
  const Dayspercentage = (clampedValue / remaining) * 100;
  if (remaining) {
    return (
      <>
        <div>
          {clampedValue} / {remaining} days
        </div>
        <ProgressBar
          variant="primary"
          now={Dayspercentage}
          className="column-progress"
        />
      </>
    );
  }
  return (
    <>
      <div className="">{value ? value : 0}%</div>
      <ProgressBar
        variant="primary"
        now={percentage}
        className="column-progress"
      />
    </>
  );
};

// export default ProgressColumn;
export default React.memo(ProgressColumn);
