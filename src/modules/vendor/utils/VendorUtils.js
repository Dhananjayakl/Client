export function validateResponses(questions, formMethods) {
  const invalidQuestions = questions?.filter((question, index) => {
    if (!question.qstMandatory) return false;
    const response = formMethods.getValues(`QST.${index}.qstResponse`);
    const responseArray = formMethods.getValues(
      `QST.${index}.qstResponseArray`
    );
    const dateResponse = formMethods.getValues(`QST.${index}.qstDateResponse`);
    const isEmpty =
      !response &&
      (!responseArray || responseArray.length === 0) &&
      !dateResponse;

    return isEmpty;
  });
  console.log("Invalid Questions:", invalidQuestions);
  return invalidQuestions.length === 0;
}

export function calculateScore(questions, options, formMethods) {
  console.log(questions, options, "questions, options");
  return questions.map((question, index) => {
    const qstResponse = formMethods.getValues(`QST.${index}.qstResponse`);
    const qstResponseArray = formMethods.getValues(
      `QST.${index}.qstResponseArray`
    );
    const qstDateResponse = formMethods.getValues(
      `QST.${index}.qstDateResponse`
    );

    // Filter options for the current question
    const questionOptions = options.filter(
      (option) => option.optQstCode === question.questionCode
    );

    if (questionOptions.length === 0) {
      if (qstResponse || qstResponseArray?.length > 0 || qstDateResponse) {
        return question.score || 0; // Use question's score if available
      }
      return 0; // No response, no score
    }

    if (qstResponse) {
      const matchedOption = questionOptions.find(
        (opt) =>
          opt.optValue.trim().toLowerCase() === qstResponse.trim().toLowerCase()
      );
      return matchedOption?.optScore || 0;
    }

    if (qstResponseArray && Array.isArray(qstResponseArray)) {
      return qstResponseArray.reduce((total, response) => {
        const matchedOption = questionOptions.find(
          (opt) =>
            opt.optValue.trim().toLowerCase() === response.trim().toLowerCase()
        );
        return total + (matchedOption?.optScore || 0);
      }, 0);
    }

    if (qstDateResponse) {
      return question.score || 0; // Use the question's score for date responses
    }

    return 0; // Default to 0 if no valid responses are provided
  });
}

export function getRatingAndScoreByTotalScore(totalScore, ratings) {
  totalScore = parseInt(totalScore);
  console.log(totalScore, ratings, "rating and total score");
  if (isNaN(totalScore)) {
    console.error("Invalid totalScore:", totalScore);
    return { rating: null, score: null };
  }

  console.log(totalScore, typeof totalScore, ratings, "Rating details");

  // Iterate through the ratings to find the appropriate range
  for (let i = 0; i < ratings.length; i++) {
    const lowerValue = parseInt(ratings[i].rtg_lower_value);
    const upperValue = parseInt(ratings[i].rtg_upper_value);

    if (totalScore >= lowerValue && totalScore <= upperValue) {
      return ratings[i].rtg_rating;
      //score: ratings[i].rtgScore ?? 0, // Default score to 0 if null
    }
  }

  // If totalScore exceeds the last range, use the last rating
  const lastRating = ratings[ratings.length - 1];
  const lastUpperValue = parseInt(lastRating?.rtg_upper_value);

  if (totalScore > lastUpperValue) {
    return lastRating?.rtg_rating;
  }

  // Fallback case

  return lastRating?.rtg_rating;
}
