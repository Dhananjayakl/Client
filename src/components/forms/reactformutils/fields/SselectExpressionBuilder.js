export function expressionbuilder(
  formMethods,
  filterExpression,
  extractedFieldName,
  extractedSubString,
  name
) {
  let match;
  let matches = [];
  let builtExpression;
  const semicolonCount = (filterExpression.match(/:/g) || []).length;
  const regex = /:(\w+)/g;
  console.log(matches, "-matches", match, "-match", "matches are here");
  const getFieldName = (value) => {
    let fieldValue = formMethods.getValues(value);
    if (typeof fieldValue === "object" && !Array.isArray(fieldValue)) {
      console.log(fieldValue, "type-01");

      fieldValue = fieldValue.value;
    } else if (Array.isArray(fieldValue)) {
      console.log("type-02");
      fieldValue = fieldValue.map(
        (items) => {
          if (typeof items === "object" && items != null) {
            return items.value;
          } else {
            return items;
          }
        }
        // typeof items === "object" && items !== null ? items.value : items
      );
    }
    return fieldValue;
  };
  if ((match = regex.exec(filterExpression)) !== null) {
    console.log(match, extractedSubString, "match--1");
    let fieldValue;
    if (extractedSubString) {
      console.log(extractedSubString, "extracted--sub--string");

      fieldValue = getFieldName(extractedSubString + match[1]);
      console.log(fieldValue, "expression-field-value-1");
    } else {
      console.log(extractedSubString, "extracted--sub--string1");
      fieldValue = getFieldName(match[1]);
      console.log(fieldValue, "expression-field-value-2");
    }

    console.log(fieldValue, "refreshed-value");

    matches.push({
      name: match[1],
      value: fieldValue,
    });
  }

  if (matches && semicolonCount == 1) {
    console.log(extractedFieldName, matches, "in single colon");

    if (Array.isArray(matches) == true) {
      let mulParts = filterExpression;
      for (let i = 0; i < matches.length; i++) {
        if (Array.isArray(matches[i].value) == true) {
          builtExpression = mulParts.replace(
            `:${matches[i].name}`,
            `(${matches[i].value})`
          );
        } else {
          builtExpression = mulParts.replace(
            `:${matches[i].name}`,
            matches[i].value
          );
        }
      }
      console.log(mulParts, "mul parts builder");
    } else {
      builtExpression = formMetaData.fields[name].filter_expression.replace(
        regex,
        emtpyArray[0]
      );
    }
    if (builtExpression.includes("undefined")) {
      builtExpression = filterExpression;
    }
  } else if (semicolonCount > 1) {
    console.log(extractedFieldName, "in multi colon");

    let newMatch = [];
    let RawExpression = filterExpression.replace(/:/g, "");
    console.log(extractedSubString, "Raw in multi");

    newMatch = filterExpression.match(/:(\w+)/g);
    let arrayWithoutColon = newMatch.map((element) => element.substring(1));
    console.log(arrayWithoutColon, "array without colon");
    let ValueObject = {};
    ValueObject = arrayWithoutColon.map((items) => ({
      key: items,
      value: [
        items == "LOGINID"
          ? JSON.parse(localStorage.current_logged_User)[0].user_details.data[0]
              .user_id
          : formMethods.getValues(extractedSubString + items) != undefined
          ? getFieldName(extractedSubString + items)
          : getFieldName(items),
      ],
    }));
    console.log(ValueObject, "Value object is here");

    ValueObject.forEach(({ key, value }) => {
      let regex = new RegExp(key, "g");

      RawExpression = RawExpression.replace(regex, value);
      builtExpression = RawExpression;
    });
  } else {
    builtExpression = filterExpression;
  }
  console.log(builtExpression, "built expression");
  return builtExpression;
}
// export function expressionbuilder(
//   formMethods,
//   filterExpression,
//   extractedFieldName,
//   extractedSubString
// ) {
//   console.log(extractedSubString, "--expression builder");
//   let match;
//   let matches = [];
//   let builtExpression;
//   const semicolonCount = (filterExpression.match(/:/g) || []).length;
//   const regex = /:(\w+)/g;
//   if ((match = regex.exec(filterExpression)) !== null) {
//     matches.push({
//       name: match[1],
//       value: extractedSubString
//         ? formMethods.getValues(extractedSubString + match[1])
//         : formMethods.getValues(match[1]),
//     });
//   }
//   console.log(matches, "matches are here");

//   if (matches && semicolonCount == 1) {
//     console.log(extractedFieldName, "in single colon");

//     if (Array.isArray(matches) == true) {
//       let mulParts = filterExpression;
//       for (let i = 0; i < matches.length; i++) {
//         if (Array.isArray(matches[i].value) == true) {
//           builtExpression = mulParts.replace(
//             `:${matches[i].name}`,
//             `(${matches[i].value})`
//           );
//         } else {
//           builtExpression = mulParts.replace(
//             `:${matches[i].name}`,
//             matches[i].value
//           );
//         }
//       }
//       console.log(mulParts, "mul parts builder");
//     } else {
//       builtExpression = formMetaData.fields[name].filter_expression.replace(
//         regex,
//         emtpyArray[0]
//       );
//     }
//     if (builtExpression.includes("undefined")) {
//       builtExpression = filterExpression;
//     }
//   } else if (semicolonCount > 1) {
//     console.log(extractedFieldName, "in multi colon");

//     let newMatch = [];
//     let RawExpression = filterExpression.replace(/:/g, "");
//     console.log(extractedSubString, "Raw in multi");

//     newMatch = filterExpression.match(/:(\w+)/g);
//     let arrayWithoutColon = newMatch.map((element) => element.substring(1));
//     console.log(arrayWithoutColon, "array without colon");
//     let ValueObject = {};
//     ValueObject = arrayWithoutColon.map((items) => ({
//       key: items,
//       value: [
//         items == "LOGINID"
//           ? JSON.parse(localStorage.current_logged_User)[0].user_details.data[0]
//               .user_id
//           : formMethods.getValues(extractedSubString + items) != undefined
//           ? formMethods.getValues(extractedSubString + items)
//           : formMethods.getValues(items),
//       ],
//     }));
//     arrayWithoutColon.forEach((items) => {});

//     ValueObject.forEach(({ key, value }) => {
//       let regex = new RegExp(key, "g");

//       RawExpression = RawExpression.replace(regex, value);
//       builtExpression = RawExpression;
//     });
//   } else {
//     builtExpression = filterExpression;
//   }
//   console.log(builtExpression, "built expression");
//   return builtExpression;
// }
