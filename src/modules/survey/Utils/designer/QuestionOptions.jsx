import { Row, Col, Table, Button } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useWatch } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { GetOptionsByPredefinedOption } from "./AdvancedFields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const QuestionOptions = (props) => {
  const {
    questionIndex,
    component,
    scoring,
    currentQuestionOptions,
    currentQuestionCode,
    OPToptions,
    OPTappendOptions,
    OPTremoveOptions,
    control,
    formMetaData,
    formMethods,
    initialData,
  } = props;

  const predefinedOption = useWatch({
    control,
    name: `QST[${questionIndex}].predefinedOptions`,
  });

  const othersOption = useWatch({
    control,
    name: `QST[${questionIndex}].qstOthers`,
  });

  const flagQuestion = useWatch({
    control,
    name: `QST[${questionIndex}].qstFlag`,
  });

  const multiSelect = useWatch({
    control,
    name: `QST[${questionIndex}].qstMultiSelect`,
  });

  useEffect(() => {
    // Find the index of the "Others" option in OPToptions for the current question
    const othersIndex = OPToptions?.findIndex(
      (opt) =>
        opt?.optValue?.toLowerCase() === "others" &&
        opt?.optQstCode === currentQuestionCode
    );

    if (othersOption) {
      // Add the "Others" option if it doesn't exist for the current question
      if (othersIndex === -1) {
        OPTappendOptions({
          optId: "",
          optValue: "Others",
          optScore: "",
          optRating: "",
          optExpected: "",
          optCode: uuidv4(),
          optQstCode: currentQuestionCode,
          optQstId: questionIndex,
          predefinedOption: true,
        });
      }
    } else {
      // Remove the "Others" option if it exists for the current question
      if (othersIndex !== -1) {
        OPTremoveOptions(othersIndex); // Remove using the index from OPToptions
      }
    }
  }, [othersOption]);

  useEffect(() => {
    if (
      currentQuestionOptions?.length === 0 &&
      predefinedOption !== undefined
    ) {
      formMethods.setValue(`QST[${questionIndex}].predefinedOptions`, "0");
    }
  }, [OPToptions]);

  const [prevPredefinedOption, setPrevPredefinedOption] = useState(null);

  useEffect(() => {
    const isEditMode = initialData !== null;
    if (isEditMode && prevPredefinedOption === null) {
      setPrevPredefinedOption(predefinedOption);
      return;
    }

    if (predefinedOption !== prevPredefinedOption) {
      const existingOptionIndices = OPToptions?.map((option, index) =>
        option.optQstCode === currentQuestionCode ? index : -1
      ).filter((index) => index !== -1);

      OPTremoveOptions(existingOptionIndices);

      const options = GetOptionsByPredefinedOption(predefinedOption);
      options.forEach((option) => {
        OPTappendOptions({
          ...option,
          optId: "",
          optExpected: "",
          optCode: uuidv4(),
          optQstCode: currentQuestionCode,
          optQstId: questionIndex,
          predefinedOption: true,
        });
      });

      setPrevPredefinedOption(predefinedOption);
    }
  }, [predefinedOption, prevPredefinedOption]);

  const addOption = () => {
    OPTappendOptions({
      optId: "",
      optValue: "",
      optScore: "",
      optRating: "",
      optExpected: "",
      optCode: uuidv4(),
      optQstCode: currentQuestionCode,
      optQstId: questionIndex,
    });
  };

  return (
    <>
      <Table className="border p-1 m-1">
        <thead>
          <tr className="table-primary text-left fw-medium p-1">
            <th className="fw-medium col-6 text-center">Value</th>
            {scoring && (
              <>
                <th className="fw-medium col-3 text-center">Score</th>
                {/* <th className="fw-medium">Rating</th> */}
              </>
            )}
            {flagQuestion && (
              <th className="fw-medium text-center">Expected</th>
            )}

            <th className="fw-medium col-3 text-center">Remove</th>
          </tr>
        </thead>
        <tbody>
          {currentQuestionOptions?.map((option, index) => {
            const optionRowIndex = OPToptions?.findIndex(
              (opt) => opt.id === option.id
            );
            if (!flagQuestion) {
              formMethods.setValue(`OPT[${optionRowIndex}].optExpected`, "");
            }

            return (
              <tr key={option.id}>
                <td className="col-6 text-center p-0 m-0">
                  <div className="p-1 m-1">
                    <FormControl
                      control={control}
                      name={`OPT[${optionRowIndex}].optValue`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      hideTitle={true}
                      disabled={formMethods.getValues(
                        `OPT[${optionRowIndex}].predefinedOption`
                      )}
                      textColor={true}
                    />
                  </div>
                </td>
                {scoring && (
                  <>
                    <td className="p-0 m-0 pt-1 col-3">
                      <FormControl
                        control={control}
                        name={`OPT[${optionRowIndex}].optScore`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        hideTitle={true}
                      />
                    </td>
                    {/* <td className="p-1 m-1">
                      <FormControl
                        control={control}
                        name={`OPT[${optionRowIndex}].optRating`}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                        hideTitle={true}
                      />
                    </td> */}
                  </>
                )}
                {flagQuestion && (
                  <td className="p-0 m-0 ps-4 col-3">
                    <FormControl
                      control={control}
                      name={`OPT[${optionRowIndex}].optExpected`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                      hideTitle={true}
                    />
                  </td>
                )}
                <td className="p-0">
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="text-center ms-5 text-danger"
                    onClick={() => {
                      if (
                        formMethods.getValues(
                          `OPT[${optionRowIndex}].optValue`
                        ) === "Others"
                      ) {
                        formMethods.setValue(
                          `QST[${questionIndex}].qstOthers`,
                          ""
                        );
                      }
                      OPTremoveOptions(optionRowIndex);
                    }}
                    size="lg"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between align-items-center">
        <Button className="m-0 fw-medium" onClick={addOption}>
          Add Option
        </Button>
        {(component === "radio" ||
          (component === "select" &&
            !formMethods.getValues(
              `QST[${questionIndex}].qstMultiSelect`
            ))) && (
          <div>
            <FormControl
              className="m-0"
              control={control}
              name={`QST[${questionIndex}].predefinedOptions`}
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        )}
      </div>
    </>
  );
};
export default QuestionOptions;
