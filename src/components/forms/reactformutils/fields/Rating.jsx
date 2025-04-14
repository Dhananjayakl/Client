import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faFaceFrownOpen,
  faFaceSmile,
  faFaceGrinStars,
  faFaceGrinHearts,
  faFaceLaughBeam,
  faFaceGrinWide,
  faFaceMeh,
  faFaceFrown,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import FieldDom from "./FieldDom";

function Rating(props) {
  const {
    fieldDef,
    label,
    control,
    name,
    options,
    helptext,
    tooltip,
    required,
    visible,
    formMethods,
    formMetaData,
    isMulti,
    rules,
    editable,
    field_title,
    fieldValue,
    ratingDisplayType,
    ...rest
  } = props;

  const feedback = ["Unsatisfied", "Bad", "Neutral", "Good", "Satisfied"];
  const scale = fieldDef?.scale || 5;
  const representationType = ratingDisplayType === 1 ? "stars" : "emojis";

  const emojis = [
    faFaceFrown,
    faFaceMeh,
    faFaceGrinWide,
    faFaceLaughBeam,
    faFaceGrinHearts,
  ];

  const representation = [...Array(Number(scale))];

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required && editable,
          message: `${field_title} is required!`,
        },
      }}
      render={({ field, fieldState, formState }) => {
        useEffect(() => {
          if (fieldValue) {
            field.onChange(fieldValue);
          }
        }, [fieldValue]);

        const feedbackIcon = emojis[field.value - 1];
        const message = fieldState?.error;

        return (
          <FieldDom {...props} {...fieldState} {...field}>
            {editable && (
              <div className="d-flex align-items-center justify-content-between">
                {representation.map((_, index) => {
                  const currentIndex = index + 1;
                  const icon =
                    representationType === "emojis"
                      ? emojis[index % emojis.length]
                      : faStar;

                  return (
                    <span
                      key={currentIndex}
                      onClick={() => {
                        field.onChange(currentIndex);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={icon}
                        className={
                          currentIndex <= field.value
                            ? "text-warning fa-2xl"
                            : "text-muted fa-2xl"
                        }
                      />
                    </span>
                  );
                })}
                <span className="ms-3 text-primary fw-medium">
                  {ratingDisplayType === 1 ? (
                    `${field?.value ?? 0} Stars`
                  ) : (
                    <div className="d-flex">
                      <FontAwesomeIcon className="fa-xl" icon={feedbackIcon} />
                      <p className="ms-3 m-0">{feedback[field.value - 1]}</p>
                    </div>
                  )}
                </span>
                {/* Add a clear button */}
                {field.value && (
                  <button
                    type="button"
                    className="btn btn-link text-danger p-0 m-0 "
                    onClick={() => field.onChange(null)}
                    title="Clear the rating"
                  >
                    <FontAwesomeIcon className="" icon={faXmark} />
                  </button>
                )}
              </div>
            )}
            {!editable && (
              <span className="ms-1 text-primary fw-medium">
                {ratingDisplayType === 1 ? (
                  `${field?.value ?? 0} Stars`
                ) : (
                  <div className="d-flex">
                    <FontAwesomeIcon className="fa-xl" icon={feedbackIcon} />
                    <p className="ms-1 m-0 p-0">{feedback[field.value - 1]}</p>
                  </div>
                )}
              </span>
            )}
            {message && <div className="text-danger">{message.message}</div>}
          </FieldDom>
        );
      }}
    />
  );
}

export default Rating;
