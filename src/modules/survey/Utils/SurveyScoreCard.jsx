import React, { useEffect } from "react";
import { getQuestionScores } from "./RespondentUtils";
import { Card, Row, Col, Table } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";

function getRatingAndScoreByTotalScore(totalScore, ratings) {
  // Ensure totalScore is a number
  totalScore = parseInt(totalScore);
  if (isNaN(totalScore)) {
    console.error("Invalid totalScore:", totalScore);
    return { rating: null, score: null };
  }

  console.log(totalScore, typeof totalScore, ratings, "Rating details");

  // Iterate through the ratings to find the appropriate range
  for (let i = 0; i < ratings.length; i++) {
    const lowerValue = parseInt(ratings[i].rtgLowerValue);
    const upperValue = parseInt(ratings[i].rtgUpperValue);

    if (totalScore >= lowerValue && totalScore <= upperValue) {
      return {
        rating: ratings[i].rtgRating,
        score: ratings[i].rtgScore ?? 0, // Default score to 0 if null
      };
    }
  }

  // If totalScore exceeds the last range, use the last rating
  const lastRating = ratings[ratings.length - 1];
  const lastUpperValue = parseInt(lastRating?.rtgUpperValue);

  if (totalScore > lastUpperValue) {
    return {
      rating: lastRating?.rtgRating,
      score: lastRating?.rtgScore ?? 0, // Default score to 0 if null
    };
  }

  // Fallback case
  console.warn("No matching range found. Using last rating as fallback.");
  return {
    rating: lastRating?.rtgRating ?? null,
    score: lastRating?.rtgScore ?? 0, // Default score to 0 if null
  };
}

const SurveyScoreCard = (props) => {
  const {
    QSTQuestions,
    OPTOptions,
    formValues,
    formMetaData,
    formMethods,
    control,
  } = props;

  const questionScores = getQuestionScores(QSTQuestions, OPTOptions);
  console.log(questionScores, "questionScores");
  const totalScore = questionScores.reduce((total, score) => total + score, 0);
  const RatingData = getRatingAndScoreByTotalScore(totalScore, formValues?.RTG);
  const weightage = QSTQuestions.reduce((sum, question) => {
    return sum + (question.qstScore || 0);
  }, 0);
  useEffect(() => {
    console.log("Total Score:", totalScore);
    console.log("Rating Data:", RatingData);
    console.log("Weightage:", weightage);

    formMethods.setValue("totalScore", totalScore);
    formMethods.setValue("finalRating", RatingData?.rating);
    formMethods.setValue("vvdRating", RatingData?.rating);
    formMethods.setValue("weightage", weightage);
  }, [RatingData?.rating, totalScore, weightage, formMethods]);

  return (
    <Card>
      <Card.Body>
        <Table>
          <thead>
            <tr className="text-left bg-body-secondary fw-medium">
              <th className="fw-medium">Total Score</th>
              <th className="fw-medium">Rating</th>
              <th className="fw-medium">Weightage</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-left">
              <td className="ps-4">
                <FormControl
                  control={control}
                  name="totalScore"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  textColor={true}
                  disabled={true}
                  hideTitle={true}
                />
              </td>
              <td className="ps-4">
                <FormControl
                  control={control}
                  name="finalRating"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  textColor={true}
                  disabled={true}
                  hideTitle={true}
                />
              </td>
              <td className="ps-4">
                <FormControl
                  control={control}
                  name="weightage"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  textColor={true}
                  disabled={true}
                  hideTitle={true}
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default SurveyScoreCard;
