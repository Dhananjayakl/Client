import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faFaceFrown,
  faFaceFrownOpen,
  faFaceMeh,
  faFaceSmile,
  faFaceGrinStars,
} from "@fortawesome/free-solid-svg-icons";

const Rating = ({ scale, representationType }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const representation = [...Array(Number(scale))];

  const emojis = [
    faFaceFrown,
    faFaceFrownOpen,
    faFaceMeh,
    faFaceSmile,
    faFaceGrinStars,
  ];

  return (
    <div>
      {representation.map((_, index) => {
        const currentIndex = index + 1;
        let icon;
        if (representationType === "emojis") {
          icon = emojis[index % emojis.length];
        } else {
          icon = faStar;
        }

        return (
          <span
            key={currentIndex}
            onClick={() => setRating(currentIndex)}
            onMouseEnter={() => setHover(currentIndex)}
            onMouseLeave={() => setHover(rating)}
          >
            <FontAwesomeIcon
              icon={icon}
              className={
                currentIndex <= (hover || rating)
                  ? "text-warning fa-2xl m-2"
                  : "text-muted fa-2xl m-2"
              }
            />
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
