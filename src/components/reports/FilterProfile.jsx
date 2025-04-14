import React, { useCallback } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownShortWide } from "@fortawesome/free-solid-svg-icons";

const RangeFilters = (props) => {
  const { reportmeta } = props;
  const handleRange = useCallback(
    (filterProfileTitle, filterProfile) => {
      props.setFinalExpression(filterProfile);
      if (props.setSelectedOption) {
        props.setSelectedOption("");
      }
    },
    [props.setFinalExpression, props.setSelectedOption]
  );

  return (
    <>
      <DropdownButton
        variant={reportmeta?.reportInfo?.theme == 2 ? "light" : "primary"}
        className="border me-1 rounded"
        title={<FontAwesomeIcon icon={faArrowDownShortWide} className="me-2" />}
      >
        {props.reportmeta.filters.map((filter, index) => (
          <React.Fragment key={index}>
            {filter.filter_profile_status && (
              <Dropdown.Item
                onClick={() =>
                  handleRange(
                    filter.filter_profile_title,
                    filter.filter_profile
                  )
                }
              >
                {filter.filter_profile_title}
              </Dropdown.Item>
            )}
          </React.Fragment>
        ))}
      </DropdownButton>
    </>
  );
};

// export default RangeFilters;
export default React.memo(RangeFilters);
