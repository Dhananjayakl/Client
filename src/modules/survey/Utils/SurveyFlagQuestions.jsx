import React, { useState } from "react";
import { Card, Table } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";

const ReadMore = ({ text, charLimit = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  if (Array.isArray(text)) {
    const joinedText = text.join(", ");
    if (joinedText.length <= charLimit) {
      return <span>{joinedText}</span>;
    }

    return (
      <span>
        {isExpanded ? joinedText : `${joinedText.slice(0, charLimit)}...`}{" "}
        <a className="text-primary cursor-pointer" onClick={toggleReadMore}>
          {isExpanded ? "Read Less" : "Read More"}
        </a>
      </span>
    );
  }

  // If it's a string, handle it normally
  if (typeof text === "string" && text.length <= charLimit) {
    return <span>{text}</span>;
  }

  return (
    <span>
      {isExpanded ? text : `${text?.slice(0, charLimit)}...`}{" "}
      <a className="text-primary cursor-pointer" onClick={toggleReadMore}>
        {isExpanded ? "Read Less" : "Read More"}
      </a>
    </span>
  );
};

const SurveyFlagQuestions = (props) => {
  const { flaggedQuestions, formMetaData, formMethods, control } = props;

  console.log(flaggedQuestions, "flagged questions");

  return (
    <Card>
      <Card.Body>
        <Table striped bordered>
          <thead>
            <tr className="bg-body-secondary fw-medium">
              <th style={{ width: "40%" }} className="fw-medium">
                Question
              </th>
              <th style={{ width: "30%" }} className="fw-medium">
                Actual
              </th>
              <th style={{ width: "30%" }} className="fw-medium">
                Expected
              </th>
            </tr>
          </thead>
          <tbody>
            {flaggedQuestions?.map((question, index) => (
              <tr key={index} className="text-left">
                <td
                  style={{
                    width: "40%",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                  className="text-wrap"
                >
                  <ReadMore text={question?.qstQuestion} charLimit={200} />
                </td>
                <td
                  style={{
                    width: "30%",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  <ReadMore text={question?.actualValue} charLimit={100} />
                </td>
                <td
                  style={{
                    width: "30%",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  <ReadMore text={question?.optValue} charLimit={100} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default SurveyFlagQuestions;
