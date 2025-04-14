import React, { useState, useEffect } from "react";
import axios from "src/utils/AxiosInstance";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLong } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const FavouriteFilter = (props) => {
  const { t } = useTranslation("common");
  const [filtermeta, setFilterMeta] = useState();
  const [selectOptions, setSelectOptions] = useState({});
  const [clickedButton, setClickedButton] = useState({
    label: null,
    parameter: null,
    item: null,
  });
  const [expressionHistory, setExpressionHistory] = useState([]);
  useEffect(() => {
    if (props.reportmeta?.filters) {
      setFilterMeta(props.reportmeta.filters);
    }
  }, [props]);

  useEffect(() => {
    if (filtermeta?.length > 0) {
      filtermeta.forEach((item) => {
        fetchOptions(item.report_id, item.filter_id, item.filter_parameter);
      });
    }
  }, [filtermeta]);

  async function fetchOptions(reportId, filterId, fieldName) {
    try {
      const response = await axios.get(
        `/report/fetchDataSourceOrPicklistInfo?reportId=${reportId}&filterId=${filterId}&searchString&filterExpression`
      );
      const data = response.data;
      const transformedData =
        data &&
        data?.map((item) => ({
          value: item.key,
          label: item.value,
        }));
      setSelectOptions((prevOptions) => ({
        ...prevOptions,
        [fieldName]: transformedData,
      }));
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  }

  const handleButtonClick = (expression, parameter, value, label, item) => {
    // let updatedExpression = expression.replace(`:${parameter}`, value);
    let updatedExpression = expression
      ? expression.replace(`:${parameter}`, value)
      : setExpressionHistory([]);

    const index = expressionHistory.findIndex(
      (exp) => exp === updatedExpression
    );

    if (index !== -1) {
      const newExpressionHistory = [...expressionHistory];
      newExpressionHistory.splice(index, 1);
      setExpressionHistory(newExpressionHistory);
      setClickedButton({ label: null, parameter: null, item: item });
    } else {
      setClickedButton({ label, parameter, item });

      if (updatedExpression.trim() !== "") {
        const index = expressionHistory.findIndex(
          (exp) => exp.split("(")[0].trim() === expression.split("(")[0].trim()
        );

        if (index !== -1) {
          const newExpressionHistory = [...expressionHistory];
          newExpressionHistory.splice(index, 1, updatedExpression);
          setExpressionHistory(newExpressionHistory);
        } else {
          setExpressionHistory((prevHistory) => [
            ...prevHistory,
            updatedExpression,
          ]);
        }
      }
    }
  };

  useEffect(() => {
    const finalExpression = expressionHistory.join(" And ");
    // setFinalExpression1(finalExpression);
    props.setFinalExpression(finalExpression);
  }, [expressionHistory]);

  useEffect(() => {
    if (clickedButton.label === "All" && clickedButton.item !== null) {
      if (typeof clickedButton.item.filter_expression === "string") {
        const filterFirstWord =
          clickedButton.item.filter_expression.split(" ")[0];

        const updatedExpressionHistory = expressionHistory.filter(
          (exp) => !exp.includes(filterFirstWord)
        );

        setExpressionHistory(updatedExpressionHistory);
      }
    }
  }, [clickedButton]);
  let allButtonRendered = false;
  return (
    <div className="filter-container">
      {filtermeta &&
        filtermeta.map(
          (item, index) =>
            item.filter_type &&
            item.favourite_filter && (
              <div key={index} className="d-flex align-items-center">
                <Button
                  className="title-filter-button active mb-4 ms-4 w-20"
                  variant="light"
                  title={item.filter_title}
                >
                  <span className="d-flex align-items-center justify-content-between ">
                    <span className="p-0 m-0 h4">{t(item.filter_title)}</span>
                    <FontAwesomeIcon icon={faRightLong} size="1x" />
                  </span>
                </Button>
                <div className="d-flex flex-wrap">
                  {/* Render the "All" button only once */}
                  {/* {!allButtonRendered && ( */}
                  <Button
                    key={`all_${item.filter_parameter}`}
                    variant={
                      clickedButton.label === "All" &&
                      clickedButton.parameter === item.filter_parameter
                        ? "success"
                        : "light"
                    }
                    className="filter-button mb-3 border rounded-3 ms-1 mb-4 text-truncate"
                    onClick={() =>
                      handleButtonClick(
                        "",
                        item.filter_parameter,
                        "all",
                        "All",
                        item
                      )
                    }
                    title="All"
                  >
                    {t("All")}
                  </Button>
                  {/* // )} */}
                  {selectOptions[item.filter_parameter]?.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        expressionHistory.includes(
                          `${item.filter_expression.replace(
                            `:${item.filter_parameter}`,
                            option.value
                          )}`
                        )
                          ? "success"
                          : "light"
                      }
                      className="filter-button mb-3 border rounded-3 ms-1 mb-4 text-truncate"
                      onClick={() =>
                        handleButtonClick(
                          item.filter_expression,
                          item.filter_parameter,
                          option.value,
                          option.label,
                          item
                        )
                      }
                      title={option.label}
                    >
                      {t(option.label)}
                    </Button>
                  ))}
                </div>
                {/* {(allButtonRendered = true)}{" "} */}
              </div>
            )
        )}
    </div>
  );
};

export default FavouriteFilter;
