import React, { memo } from "react";
import FormControl from "src/components/forms/reactformutils/FormControl";

const SurveyResponseField = (props) => {
  const {
    question,
    qstType,
    quesRecord,
    OPTOptions,
    formValues,
    formMetaData,
    formMethods,
    control,
  } = props;

  const queOptions = OPTOptions?.filter(
    (option) => option?.optQstCode === question?.qstCode
  );
  const optionsArray = queOptions?.map((option, index) => {
    if (qstType === "radio") {
      return {
        key: option?.optValue,
        value: option?.optValue,
        parent_key: null,
      };
    }

    // qstDateResponse        qstResponseArray
    return {
      value: option?.optValue,
      label: option?.optValue,
    };
  });

  let qtype;
  let fieldName = "qstResponse";
  let multiSelect = question?.qstMultiSelect;
  switch (qstType) {
    case "files":
      qtype = "multiattach";
      fieldName = "qstResponseArray";
      multiSelect = true;
      break;
    case "checkboxes":
      fieldName = "qstResponseArray";
      qtype = "checkboxes";
      break;
    case "select":
      qtype = "SSelect";
      fieldName = question?.qstMultiSelect ? "qstResponseArray" : "qstResponse";
      break;
    case "boolean":
      qtype = question?.qstBooleanType === 1 ? "check" : "switch";
      break;
    case "date":
      qtype = "date";
      fieldName = "qstDateResponse";
      break;

    default:
      qtype = qstType;
  }

  return (
    <div
      style={{
        wordBreak: "break-word",
        overflowWrap: "break-word",
      }}
      className={
        formValues.currentStage !== "RESPOND"
          ? "rounded  py-2 px-0 m-0  d-flex align-items-center justify-content-center bg-body-tertiary "
          : ""
      }
    >
      <FormControl
        control={control}
        name={`${quesRecord}.${fieldName}`}
        type={qtype}
        dropDownFlag={true}
        dropDown={optionsArray}
        options={optionsArray}
        required={question?.qstMandatory}
        formMetaData={formMetaData}
        formMethods={formMethods}
        ratingDisplayType={question?.qstRatingDisplayType}
        hideTitle={true}
        isMulti={multiSelect}
        textColor={true}
        closeButton={true}
        customDropdown={optionsArray}
        field_size={qtype === "number" ? 10 : 255}
      />
    </div>
  );
};

export default SurveyResponseField;

// import React, { useMemo } from "react";
// import FormControl from "src/components/forms/reactformutils/FormControl";

// // import React, { useMemo } from "react";
// // import FormControl from "./FormControl";

// const SurveyResponseField = React.memo(
//   ({
//     control,
//     quesRecord,
//     qtype,
//     optionsArray,
//     question,
//     formMetaData,
//     formMethods,
//     formValues,
//   }) => {
//     const formControlProps = useMemo(
//       () => ({
//         control,
//         name: `${quesRecord}.qstResponse`,
//         type: qtype,
//         dropDownFlag: true,
//         dropDown: optionsArray,
//         options: optionsArray,
//         required: question?.qstMandatory,
//         formMetaData,
//         formMethods,
//         ratingDisplayType: question?.qstRatingDisplayType,
//         hideTitle: true,
//         isMulti: question?.qstMultiSelect,
//         textColor: true,
//       }),
//       [
//         control,
//         quesRecord,
//         qtype,
//         optionsArray,
//         question,
//         formMetaData,
//         formMethods,
//       ]
//     );

//     return (
//       <div
//         style={{
//           wordBreak: "break-word",
//           overflowWrap: "break-word",
//         }}
//         className={
//           formValues.currentStage !== "RESPOND"
//             ? "rounded py-2 px-0 m-0 d-flex align-items-center justify-content-center bg-body-tertiary"
//             : ""
//         }
//       >
//         <FormControl {...formControlProps} />
//       </div>
//     );
//   }
// );

// export default SurveyResponseField;
