import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import {
  postBookMark,
  deleteBookMark,
  getBookMark,
  existsBookMark,
} from "src/components/server/service";

const Bookmark = (props) => {
  const { runtimeParams, formValues } = props;

  const objectId = runtimeParams.objectId;
  const formId = runtimeParams.formId;
  const moduleId = runtimeParams?.formmeta?.module_id;
  // const objectTitle = runtimeParams?.formmeta?.header_column;
  const userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;
  const objectTitle = formValues[runtimeParams?.formmeta?.header_column];

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [bookmarkIds, setBookmarkIds] = useState(null);

  useEffect(() => {
    existsBookMark("exitsbookmark", formId, objectId, userId)
      .then((response) => {
        const responseData = response.data;
        if (responseData === true) {
          setIsBookmarked(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  useEffect(() => {
    getBookMark("getbookmark", formId, objectId, userId).then((response) => {
      const responseData = response.data;

      if (responseData?.length > 0) {
        var ids = responseData[0].bookmarkId;
        setBookmarkIds(ids);
      } else {
        setBookmarkIds(null);
      }
    });
    if (buttonClicked) {
      if (isBookmarked) {
        postBookMark("postbookmark", formId, objectId, userId, moduleId)
          .then((response) => {
            const responseData = response.data;
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (!isBookmarked && bookmarkIds) {
        deleteBookMark("deletebookmark", userId, bookmarkIds, formId)
          .then((response) => {})
          .catch((err) => {
            console.error(err);
          });
        setBookmarkIds(null);
      }
      setButtonClicked(false);
    }
  }, [isBookmarked, buttonClicked, objectId, userId, bookmarkIds, formId]);

  const handleBookmarkClick = () => {
    const newBookmarkStatus = !isBookmarked;
    setIsBookmarked(newBookmarkStatus);
    setButtonClicked(true);
  };

  return (
    <div className="float-end">
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
    </div>
  );
};

export default Bookmark;
