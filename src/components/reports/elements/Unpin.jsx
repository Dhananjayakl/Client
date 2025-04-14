import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { deleteBookMark } from "src/components/server/service";

const Unpin = ({ value, row, columnMeta }) => {
  let bookmarkIds = row.original.bookmark_id;
  let formId = row.original.form_id;
  const userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;
  const [isBookmarked, setIsBookmarked] = useState(true);

  const handleBookmarkClick = () => {
    deleteBookMark("deletebookmark", userId, bookmarkIds, formId)
      .then((response) => {
        setIsBookmarked(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Button
      variant="light"
      onClick={handleBookmarkClick}
      className={`rounded-circle d-flex align-items-center justify-content-center`}
    >
      {isBookmarked ? (
        <FontAwesomeIcon icon={faBookmarkSolid} size="lg" />
      ) : (
        <FontAwesomeIcon icon={faBookmark} size="lg" />
      )}
    </Button>
  );
};

export default React.memo(Unpin);
