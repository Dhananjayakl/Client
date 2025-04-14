import axios from "src/utils/AxiosInstance";
export function getdependentvalues(
  formid,
  name,
  orginalName,
  inputValue,
  setOptions,
  formMethods,
  formMetaData,
  getFieldValue,
  setSelectedOption,
  selectedOption,
  field_name,
  StoredValue,
  extractedFieldName,
  field,
  isMulti,
  setData,
  FilteredOptions,
  options
) {
  console.log(name, getFieldValue, selectedOption, "zoro");
  console.log("inside dependecy");
  if (formMetaData?.fields[name].filter_expression != null) {
    const FilterIdentification = formMetaData.fields[name].filter_expression;
    const semicolonCount = (FilterIdentification.match(/:/g) || []).length;

    const regex = /:(\w+)/g;
    const matches = [];
    let match;
    async function callbackend() {
      console.log(name, "fetch5");
      // console.log(field_name, "fetch5");
      try {
        if (
          (match = regex.exec(formMetaData.fields[name].filter_expression)) !==
          null
        ) {
          matches.push({
            name: match[1],
            value: orginalName
              ? formMethods.getValues(orginalName + match[1])
              : formMethods.getValues(match[1]),
          });
          console.log(match[1], "matches1");
        }

        if (matches && semicolonCount == 1) {
          let insertArray = [];
          if (Array.isArray(matches) == true) {
            let mulParts = formMetaData.fields[name].filter_expression;

            for (let i = 0; i < matches.length; i++) {
              if (Array.isArray(matches[i].value) == true) {
                mulParts = mulParts.replace(
                  `:${matches[i].name}`,
                  `(${matches[i].value})`
                );
              } else {
                mulParts = mulParts.replace(
                  `:${matches[i].name}`,
                  matches[i].value
                );
              }
            }

            if (mulParts.includes("undefined")) {
              mulParts = formMetaData.fields[name].filter_expression;
            }

            console.log(
              name,
              "field",
              field,
              "getter",
              selectedOption,
              "sell",
              formMetaData.dataSourceResponse.length,
              "datasource1"
            );
            let selectOption;
            if (selectedOption && selectedOption != null) {
              if (Array.isArray(selectedOption) && selectedOption.length > 0) {
                selectOption = selectedOption[0].value;
              } else if (typeof selectedOption == "object") {
                selectOption = selectedOption.value;
              }
            }
            console.log(selectOption, field, name, "s99");

            if (
              (field &&
                !Array.isArray(selectOption) &&
                isMulti == false &&
                selectOption &&
                selectOption != field &&
                formMetaData.dataSourceResponse.length <= 0) ||
              (field &&
                isMulti == false &&
                !selectOption &&
                setData == true &&
                formMetaData.dataSourceResponse.length <= 0)
            ) {
              console.log(name, "swap last condition");
              mulParts = `${mulParts} and ${formMetaData.fields[name].stored_column} =${field}`;
              const response = await axios.get(
                `/form/fetchDataSourceInfo?formId=${formid}&columnName=${name}&searchString=${inputValue}&pageSize=&filterExpression=${mulParts}`
              );

              const data = await response.data;
              console.log(field_name, "api1");
              for (let j = 0; j < data.length; j++) {
                insertArray.push({
                  value: data[j].key,
                  label: data[j].value,
                  isdisabled: false,
                });
              }
              console.log(insertArray, name, "insert array0");
              setOptions(insertArray);
              setSelectedOption(insertArray);
              console.log(name, mulParts, "value are not same");
            }
            console.log("inside mulparts");
            const response = await axios.get(
              `/form/fetchDataSourceInfo?formId=${formid}&columnName=${name}&searchString=${inputValue}&pageSize=&filterExpression=${mulParts}`
            );

            const data = await response.data;

            console.log(field_name, "api2");

            for (let j = 0; j < data.length; j++) {
              insertArray.push({
                value: data[j].key,
                label: data[j].value,
                isdisabled: FilteredOptions?.current?.find(
                  (item) => item == data[j].key
                )
                  ? true
                  : false,
              });
            }
            let finalOptions = [];

            console.log(finalOptions, "formula e");

            console.log("not inside the final options", finalOptions);
            setOptions(insertArray);
          } else {
            let singleParts = formMetaData.fields[
              name
            ].filter_expression.replace(regex, emtpyArray[0]);
            console.log("inside single fields");
            const response = await axios.get(
              `/form/fetchDataSourceInfo?formId=${formid}&columnName=${name}&searchString=${inputValue}&pageSize=&filterExpression in (${singleParts})`
            );

            const data = await response.data;
            console.log(name, "api3");
            for (let j = 0; j < data.length; j++) {
              insertArray.push({
                value: data[j].key,
                label: data[j].value,
                isdisabled: false,
              });
            }
            console.log(insertArray, name, "insert array2");
            setOptions(insertArray);
          }
        } else if (semicolonCount > 1) {
          let newMatch = [];
          let multiExpression = formMetaData.fields[name].filter_expression;
          let RawExpression = formMetaData.fields[
            name
          ].filter_expression.replace(/:/g, "");
          console.log(multiExpression, "multi expression");
          newMatch =
            formMetaData.fields[name].filter_expression.match(/:(\w+)/g);
          console.log(newMatch, "lambo");
          let arrayWithoutColon = newMatch.map((element) =>
            element.substring(1)
          );
          console.log(arrayWithoutColon, "arrwithout");
          let ValueObject = {};
          ValueObject = arrayWithoutColon.map((items) => ({
            key: items,
            value: [
              formMethods.getValues(orginalName + items) != undefined
                ? formMethods.getValues(orginalName + items)
                : formMethods.getValues(items),
            ],
          }));
          arrayWithoutColon.forEach((items) => {
            console.log(orginalName + items, "completeName");
          });
          console.log(ValueObject, "v12");

          ValueObject.forEach(({ key, value }) => {
            let regex = new RegExp(key, "g");
            console.log(regex, "regex");
            RawExpression = RawExpression.replace(regex, value);
          });
          console.log(RawExpression, "multifinal");
          if (
            getFieldValue &&
            (!selectedOption || selectedOption.length <= 0)
          ) {
            RawExpression = `${StoredValue} in(${getFieldValue})`;
          }
          console.log(RawExpression, "raone");
          let insertArray = [];
          const response = await axios.get(
            `/form/fetchDataSourceInfo?formId=${formid}&columnName=${name}&searchString=${inputValue}&pageSize=&filterExpression=${RawExpression}`
          );
          console.log(name, "api4");
          const data = await response.data;
          for (let j = 0; j < data.length; j++) {
            insertArray.push({ value: data[j].key, label: data[j].value });
          }
          console.log(name, insertArray, "insert array3");
          setOptions(insertArray);
        } else {
          let insertArray = [];
          const response = await axios.get(
            `/form/fetchDataSourceInfo?formId=${formid}&columnName=${name}&searchString=${inputValue}&fpageSize=&filterExpression=${formMetaData.fields[name].filter_expression}`
          );

          const data = await response.data;
          console.log(name, "api5");
          for (let j = 0; j < data.length; j++) {
            insertArray.push({ value: data[j].key, label: data[j].value });
          }

          setOptions(insertArray);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }
    callbackend();
  }
}
