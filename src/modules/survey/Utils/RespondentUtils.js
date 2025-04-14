// export const getExpectedOptionValues = (questions, options) => {
//   return questions
//     .filter((question) => question?.qstFlag)
//     .map((question) => {
//       const questionOptions = options?.filter(
//         (option) => option?.optQstCode === question?.qstCode
//       );
//       const expectedOption = questionOptions.find(
//         (option) => option?.optExpected
//       );
//       console.log(questionOptions, questions, "questionOptions");
//       return {
//         qstQuestion: question?.qstQuestion || "--",

//         optValue: expectedOption?.optValue || "N/A",
//         actualValue:
//           questionOptions[Number(question?.qstResponse)]?.optValue ||
//           question?.qstResponse ||
//           "N/A",
//       };
//     });
// };

export const getExpectedOptionValues = (questions, options) => {
  return questions
    .map((question, originalIndex) => {
      if (!question?.qstFlag) return null; // Skip questions without qstFlag

      const questionOptions = options?.filter(
        (option) => option?.optQstCode === question?.qstCode
      );
      const expectedOption = questionOptions.find(
        (option) => option?.optExpected
      );

      // const parsedArray = question?.qstResponseArray?.replace(/[{}"]/g, "");

      return {
        index: originalIndex, // Index from the original questions array
        qstQuestion: question?.qstQuestion || "--",
        optValue: expectedOption?.optValue || "N/A",
        actualValue:
          question?.qstResponse ||
          question?.qstResponseArray ||
          question?.qstDateResponse ||
          "N/A",
      };
    })
    .filter((result) => result !== null); // Remove null values from skipped questions
};

// export const getQuestionScores = (questions, options) => {
//   return questions.map((question) => {
//     const questionOptions = options?.filter(
//       (option) => option?.optQstCode === question?.qstCode
//     );
//     if (questionOptions.length === 0) {
//       return 0;
//     }

//     console.log(question?.qstResponse, "question response");
//     const responseIndex = Number(question?.qstResponse);
//     if (responseIndex >= 0 && responseIndex < questionOptions.length) {
//       console.log(
//         questionOptions,
//         question?.qstResponse,

//         responseIndex,
//         "option response"
//       );
//       return questionOptions[responseIndex]?.optScore || null;
//     } else {
//       return null; // Return null if the responseIndex is out of bounds
//     }
//   });
// };

// export const getQuestionScores = (questions, options) => {
//   return questions.map((question) => {
//     if (!question?.qstResponse && !question.qstResponseArray) {
//       console.log("Skipping question with null response:", question);
//       return 0;
//     }

//     const questionOptions = options?.filter(
//       (option) => option?.optQstCode === question?.qstCode
//     );

//     if (!questionOptions || questionOptions.length === 0) {
//       return 0;
//     }

//     const response =
//       (typeof question?.qstResponse === "string" ||
//         typeof question?.qstResponseArray === "string") &&
//       question?.qstResponse.startsWith("{") &&
//       question?.qstResponse.endsWith("}")
//         ? question?.qstResponse.slice(1, -1).split(",").map(Number)
//         : [Number(question?.qstResponse)];

//     const scores = response
//       .filter((index) => index >= 0 && index < questionOptions.length)
//       .map((index) => questionOptions[index]?.optScore || 0);

//     const totalScore = scores.reduce((sum, score) => sum + score, 0);
//     console.log(totalScore, "total Score");
//     return scores.length > 0 ? totalScore : null;
//   });
// };

// export const getQuestionScores = (questions, options) => {
//   try {
//     return questions.map((question) => {
//       try {
//         const {
//           qstResponse,
//           qstResponseArray,
//           qstDateResponse,
//           qstScore,
//           qstCode,
//         } = question;

//         // If all response fields are null or undefined, return 0
//         if (!qstResponse && !qstResponseArray && !qstDateResponse) {
//           console.warn("No response fields found for question:", qstCode);
//           return 0;
//         }

//         // Get options relevant to the question
//         const questionOptions = options?.filter(
//           (option) => option?.optQstCode === qstCode
//         );

//         if (!questionOptions || questionOptions.length === 0) {
//           console.warn("No options found for question:", qstCode);
//           return qstScore || 0;
//         }

//         // 1. Handle qstResponse
//         if (qstResponse) {
//           const matchedOption = questionOptions.find(
//             (opt) => opt.optValue?.trim() === qstResponse.trim()
//           );
//           return matchedOption?.optScore || qstScore || 0;
//         }

//         // 2. Handle qstResponseArray
//         if (qstResponseArray) {
//           let responseArray = [];
//           try {
//             // Clean and parse qstResponseArray (handling emojis)
//             let cleanedResponse = qstResponseArray
//               .replace(/{/g, "[") // Replace curly braces with square brackets
//               .replace(/}/g, "]") // Replace closing curly braces
//               .replace(/\"([^"]*)\"/g, '"$1"') // Ensure proper quote formatting around elements
//               .replace(/,/g, '","') // Ensure proper comma separation between elements
//               .replace(/\\\"/g, '"') // Remove escaped quotes if present
//               .replace(/\\/g, ""); // Remove any other escape characters

//             // Check for emojis or special characters and ensure valid UTF-8 encoding
//             cleanedResponse = cleanedResponse.replace(
//               /([^\[])([A-Za-z0-9 ]+)(?=\[|\{)/g,
//               '$1"$2"'
//             );

//             // Now try parsing the cleaned response string as JSON
//             responseArray = JSON.parse(cleanedResponse); // Parse the string into an array
//           } catch (err) {
//             console.error(
//               `Error parsing qstResponseArray for question:`,
//               qstResponseArray,
//               err
//             );
//             return qstScore || 0; // Return default score if parsing fails
//           }

//           const totalScore = responseArray
//             .map((response) =>
//               questionOptions.find(
//                 (opt) => opt.optValue?.trim() === response?.trim()
//               )
//             )
//             .filter(Boolean)
//             .reduce((sum, option) => sum + (option?.optScore || 0), 0);

//           return totalScore || qstScore || 0;
//         }

//         // 3. Handle qstDateResponse
//         if (qstDateResponse) {
//           return qstScore || 0;
//         }

//         // Default to qstScore if no response fields are present
//         return qstScore || 0;
//       } catch (err) {
//         console.error(
//           "Error processing question:",
//           question?.qstCode || "Unknown",
//           err
//         );
//         return 0; // Return 0 if any error occurs for this question
//       }
//     });
//   } catch (err) {
//     console.error("Error processing questions:", err);
//     return []; // Return an empty array if the entire process fails
//   }
// };

export const getQuestionScores = (questions, options) => {
  try {
    return questions.map((question) => {
      try {
        const {
          qstResponse,
          qstResponseArray,
          qstDateResponse,
          qstScore,
          qstCode,
          qstQuestion,
        } = question;

        // If response fields are not set, return 0 by default
        if (!qstResponse && !qstResponseArray && !qstDateResponse) {
          console.warn("No response fields found for question:", qstCode);
          return 0;
        }

        // Get the options related to this question
        const questionOptions = options?.filter(
          (option) => option?.optQstCode === qstCode
        );

        if (!questionOptions || questionOptions.length === 0) {
          console.warn("No options found for question:", qstCode);
          return qstScore || 0;
        }

        // 1. Handle qstResponse (single response)
        if (qstResponse) {
          const matchedOption = questionOptions.find(
            (opt) =>
              opt.optValue?.trim().toLowerCase() ===
              qstResponse.trim().toLowerCase()
          );

          if (matchedOption) {
            return matchedOption.optScore || 0; // Return matched option score
          } else {
            console.warn(
              `No matching option found for response: "${qstResponse}" in question: ${qstQuestion}`
            );
            return 0; // No match found, return 0
          }
        }

        // 2. Handle qstResponseArray (if it's not null)
        if (qstResponseArray && Array.isArray(qstResponseArray)) {
          const totalScore = qstResponseArray
            .map((response) =>
              questionOptions.find(
                (opt) =>
                  opt.optValue?.trim().toLowerCase() ===
                  response?.trim().toLowerCase()
              )
            )
            .filter(Boolean)
            .reduce((sum, option) => sum + (option?.optScore || 0), 0);

          return totalScore || qstScore || 0;
        }

        if (qstDateResponse) {
          console.log("date rate response:", qstDateResponse, qstScore);
          return qstScore || 0;
        }
        // If no valid response, default to qstScore
        return qstScore || 0;
      } catch (err) {
        console.error(
          "Error processing question:",
          question?.qstCode || "Unknown",
          err
        );
        return 0; // Return 0 if any error occurs for this question
      }
    });
  } catch (err) {
    console.error("Error processing questions:", err);
    return []; // Return an empty array if the entire process fails
  }
};
