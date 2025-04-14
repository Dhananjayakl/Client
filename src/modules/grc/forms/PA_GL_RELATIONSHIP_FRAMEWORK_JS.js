import { useEffect } from "react";
import { getviewData, getServiceData } from "../GrcService";

let JSHook = (
  form,
  formMethods,
  fields,
  formValues,

  setValue,
  formMetaData,
  append,
  remove,
  addRow,
  fieldTitle
) => {
  useEffect(() => {
    if (formValues.objectId === undefined) {
      addRow();
    }
  }, []);

  const relationframeDetails = [
    { label: "factor_name", key: "factorName" },
    { label: "start_range", key: "startRange" },
    { label: "end_range", key: "endRange" },
    { label: "rating", key: "rating" },
    { label: "score", key: "score" },
    { label: "guidance", key: "guidance" },
    { label: "id", key: "id" },
  ];
  useEffect(() => {
    const filteredFieldNames = Object.keys(fieldTitle); // Get all field names from fieldTitle
    formMethods.setValue("objectId", 1);
    // formMethods.setValue("objectId", responseData.objectId);
    // formMethods.setValue("objectId", responseData.metadata.objectId);

    // Construct filterExpression based on filteredFieldNames
    const filterExpression = filteredFieldNames
      .map((fieldName) => `(factor_name='${fieldTitle[fieldName]}')`)
      .join(" OR ");

    const relationframeViewdata = {
      viewName: "pa_gl_relationship_framework_scr_bv",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `(${filterExpression})`,
    };

    // Fetch data based on the combined filter expression
    getviewData(relationframeViewdata)
      .then((response) => {
        const responseData = response.data;

        // Clear values and close all rows
        fields.forEach((_, rowIndex) => {
          relationframeDetails.forEach(({ key }) => {
            setValue(`SCR[${rowIndex}].${key}`, ""); // Clear the values
          });
        });

        // Close all rows
        for (let i = fields.length - 1; i >= 0; i--) {
          remove(i);
        }

        if (responseData && responseData.data.length > 0) {
          responseData.data.forEach((rowData, rowIndex) => {
            relationframeDetails.forEach(({ key, label }) => {
              const apiValue = rowData[label];
              setValue(`SCR[${rowIndex}].${key}`, apiValue);
            });
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });

    getServiceData("getRiskFrameworkData")
      .then((response) => {
        const rangeData = response.data;
        console.log("fgcghghcfc", rangeData);
        formMethods.setValue("assessmentType", rangeData[0].assessment_type);
        formMethods.setValue("factorType", rangeData[0].factor_type);
        formMethods.setValue("factorBased", rangeData[0].factor_based);
        formMethods.setValue("scoreFields", rangeData[0].score_fields);
        formMethods.setValue("preProRating", rangeData[0].pre_pro_rating);
        formMethods.setValue("preRegRating", rangeData[0].pre_reg_rating);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [setValue, remove, fieldTitle, formMethods]);

  return form;
};

export default JSHook;
