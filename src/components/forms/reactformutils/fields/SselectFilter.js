import { faL } from "@fortawesome/free-solid-svg-icons";
import axios from "src/utils/AxiosInstance";
import { expressionbuilder } from "./SselectExpressionBuilder";
import { useState } from "react";
import { counter } from "@fortawesome/fontawesome-svg-core";
export async function FilteredOptions(
  formid,
  name,
  inputValue,
  extractedFieldName,
  extractedSubstring,
  formMetaData,
  formMethods,
  colum,
  setOptions,
  counters
) {
  // let selectOption;
  // let multiSelectedOption;
  // let CompletedOptions;
  // let insertArray = [];
  // const OptionsLimit = (options, dropDownCounter) => {
  //   console.log("optionlimit");
  //   if (options.length + 10 > dropDownCounter) {
  //     setInfiniteLoading(false);
  //   }
  // };
  // if (selectedOption && selectedOption != null && isMulti == false) {
  //   if (Array.isArray(selectedOption) && selectedOption.length > 0) {
  //     selectOption = selectedOption[0].value;
  //   } else if (typeof selectedOption == "object") {
  //     selectOption = selectedOption.value;
  //   }
  // }
  // if (isMulti == true) {
  //   multiSelectedOption =
  //     FieldData &&
  //     selectedOption?.length > 0 &&
  //     FieldData?.length > 0 &&
  //     FieldData.map((items) => {
  //       return selectedOption?.find((option) => {
  //         if (items == option.value) return true;
  //         else return false;
  //       });
  //     });
  // }
  // console.log(multiSelectedOption, "multiSelectOption");
  console.log(
    formMetaData.fields[extractedFieldName],
    extractedFieldName,
    "filt---2"
  );

  if (formMetaData?.fields[extractedFieldName].filter_expression != null) {
    let BuiltExpresison = expressionbuilder(
      formMethods,
      formMetaData.fields[extractedFieldName].filter_expression,
      extractedFieldName,
      extractedSubstring,
      name
    );
    console.log(BuiltExpresison, "Built-Expression-1");

    async function callbackend() {
      // console.log(field_name, "fetch5");
      try {
        if (BuiltExpresison) {
          console.log("called-backend-api");
          console.log("counter", counter);

          const response = await axios.post("/form/fetchDataSourceInfo", {
            formId: formid,
            columnName: extractedFieldName,
            searchString: inputValue ? inputValue : "",
            pageSize: counters ? counters : 10,
            filterExpression: BuiltExpresison,
          });

          let data = await response.data;
          data = data?.map((items) => {
            return {
              label: items.value,
              value: items.key,
            };
          });
          setOptions(data);
        }
      } catch (error) {
        setOptions([]);
      }
    }

    if (BuiltExpresison && formid) {
      async function fetchOptions() {
        if (BuiltExpresison && formid) {
          console.log("called backend");
          let options = await callbackend(); // Await the function to get resolved data
          return options;
        }
      }
      fetchOptions().then((options) => {
        return options;
      });
    } else {
    }
  }
}
