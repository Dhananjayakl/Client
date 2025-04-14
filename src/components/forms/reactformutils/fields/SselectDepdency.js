import axios from "src/utils/AxiosInstance";
import { expressionbuilder } from "./SselectExpressionBuilder";
import { useState } from "react";
export function DependencyFields(
  parentFieldValues,
  parentFieldName,
  name,
  formid,
  colum,
  FieldData,
  OriginalExpression,
  formMethods,
  extractedFieldName,
  extractedSubstring
) {
  console.log(
    "called inside the dependency",
    parentFieldName,
    name,
    formid,
    colum,
    FieldData,
    parentFieldValues
  );

  let BuiltExpresison = expressionbuilder(
    formMethods,
    OriginalExpression,
    extractedFieldName,
    extractedSubstring
  );

  if (
    parentFieldName &&
    name &&
    formid &&
    colum &&
    FieldData &&
    parentFieldValues
  ) {
    fetchDependecyValues();
  }
  console.log(FieldData, "Field--Data--457");

  async function fetchDependecyValues() {
    try {
      let childColumnValue;
      if (Array.isArray(FieldData)) {
        console.log("child-values in array");

        childColumnValue = FieldData?.map((items) => items.value);
      }
      if (!Array.isArray(FieldData)) {
        childColumnValue = FieldData?.value;
      }
      let response;
      response = await axios.get(
        `/form/refreshChildValue?formId=${formid}&childColumnName=${colum}&childColumnValue=${childColumnValue}&filterExpression=${BuiltExpresison}`
      );
      let data = response?.data; //getting the values from the server and gigving it to data}

      const transformedData = data?.map((item) => ({
        value: item.key,
        label: item.value,
      }));

      if (transformedData.length > 0) {
        // setSelectedOption(transformedData);

        formMethods.setValue(name, transformedData);
      } else {
        // setSelectedOption("");
        formMethods.setValue(name, "");
      }
    } catch (error) {
      // setSelectedOption(name, "");
      formMethods.setValue(name, "");
      console.error("Error fetching options:", error);
    }
  }
}
