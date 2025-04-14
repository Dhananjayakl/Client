import axios from "src/utils/AxiosInstance";
export function WithoutFilter(
  formid,
  name,
  inputValue,
  extractedFieldName,
  setOptions,
  Counters
) {
   console.log("without filter-has-been-called");

  // console.log(inputValue,"searchValue");
  // console.log(dropDownCounter, "without filter expression");
  // let selectOption;
  // let multiSelectedOption;
  // if (isMulti == false) {
  //   console.log("selected value fetcher");

  //   if (selectedOption && selectedOption != null) {
  //     if (Array.isArray(selectedOption) && selectedOption.length > 0) {
  //       selectOption = selectedOption[0].value;
  //     } else if (typeof selectedOption == "object") {
  //       selectOption = selectedOption.value;
  //     }
  //   }
  // }
  // console.log(selectOption, name, "selectoption");

  // if (isMulti == true && FieldData) {
  //   console.log("called without setter");

  //   multiSelectedOption =
  //     FieldData &&
  //     selectedOption?.length > 0 &&
  //     FieldData.length > 0 &&
  //     FieldData?.map((items) => {
  //       return (
  //         selectedOption &&
  //         selectedOption.length > 0 &&
  //         selectedOption.find((option) => {
  //           if (items == option.value) return true;
  //           else return false;
  //         })
  //       );
  //     });
  //   //console.log(multiSelectedOption, name, "multiverse");
  // }
  // if (isMulti == true && multiSelectedOption == false && FieldData) {
  //   console.log("withoutFilter1");
  //   fetchOptions(FieldData);
  // } else if (isMulti == false && FieldData && selectOption != FieldData) {
  //   console.log("withoutFilter2");
  //   fetchOptions(FieldData);
  // } else if (!FieldData) {
  //   console.log("withoutFilter3");
  //   FieldData = "empty";
  //   fetchOptions();
  // }

  async function fetchOptions() {
    // console.log(name, FieldData, "inside fetcher");

    try {
      console.log("called empty field data");

      //console.log(name, "inside the first condition");
      const response = await axios.post("/form/fetchDataSourceInfo", {
        formId: formid,
        columnName: extractedFieldName,
        searchString: inputValue,
        pageSize: Counters,
        filterExpression: "",
      });

      let data = response.data; //getting the values from the server and gigving it to data}
      const transformedData = data?.map((item) => ({
        value: item.key,
        label: item.value,
      }));
      setOptions(transformedData);
    } catch (error) {
      setOptions([])
    }
  }
  if(formid){
    fetchOptions();
  }
}

// this function calls an api and this will be called only when there is not filter expression

// }, [debouncedInputValue, getFieldValue, fieldDef.field_expression, counter, defaultApi, field, FieldData, selectOption, inputValue, dropDownCounter, infiniteLoading] || []); // Run the effect if the input value is present or run once
