import { ColumnPinningPosition } from "@tanstack/react-table";
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkregular } from "@fortawesome/free-regular-svg-icons";

type Props = {
  isPinned: ColumnPinningPosition;
  pin: (position: ColumnPinningPosition) => void;
};

export const TablePins: React.FC<Props> = ({ isPinned, pin }) => {
  const pinLeft = () => pin("left");
  const unPin = () => pin(false);
  const pinRight = () => pin("right");

  return (
    <span>
      {isPinned !== "left" ? (
        <button className="border rounded px-1" onClick={pinLeft}>
          <FontAwesomeIcon icon={faBookmarkregular} />
        </button>
      ) : null}
      {isPinned ? (
        <button className="border rounded px-1" onClick={unPin}>
          <FontAwesomeIcon icon={faBookmark} />
        </button>
      ) : null}
      {/* {isPinned !== 'right' ? (
        <button className="border rounded px-2" onClick={pinRight}>
          {'=>'}
        </button>
      ) : null} */}
    </span>
  );
};

export default TablePins;
