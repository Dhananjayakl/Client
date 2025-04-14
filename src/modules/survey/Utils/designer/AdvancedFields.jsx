import { Row, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";

export const GetOptionsByPredefinedOption = (predefinedOption) => {
  switch (predefinedOption) {
    case "1":
      return [
        { optValue: "Yes", optScore: "", optRating: "" },
        { optValue: "No", optScore: "", optRating: "" },
        //{ optValue: "N/A", optScore: "", optRating: "" },
      ];
    case "2":
      return [
        { optValue: "Like", optScore: "", optRating: "" },
        { optValue: "Dislike", optScore: "", optRating: "" },
      ];
    case "3":
      return [
        { optValue: "True", optScore: "", optRating: "" },
        { optValue: "False", optScore: "", optRating: "" },
      ];
    case "4":
      return [
        { optValue: "Agree", optScore: "", optRating: "" },
        { optValue: "Disagree", optScore: "", optRating: "" },
      ];
    case "5":
      return [
        { optValue: "Male", optScore: "", optRating: "" },
        { optValue: "Female", optScore: "", optRating: "" },
      ];
    default:
      return [];
  }
};

const AdvancedFields = (props) => {
  const { questionIndex, component, control, formMetaData, formMethods } =
    props;

  const fields = [
    {
      name: `QST[${questionIndex}].qstFlag`,
      show: formMetaData?.configurationFormMetaData?.flag_questions,
    },
    {
      name: `QST[${questionIndex}].qstMultiSelect`,
      show: component === "select",
    },
    {
      name: `QST[${questionIndex}].qstMandatory`,
      show: !["rating", "range", "boolean"].includes(component),
    },
    {
      name: `QST[${questionIndex}].qstOthers`,
      show:
        component === "select" ||
        component === "checkboxes" ||
        component === "radio",
    },
    // { name: `QST[${questionIndex}].qstEnableDescription`, show: true },
    // {
    //   name: `QST[${questionIndex}].qstEnableAdditionalAttributes`,
    //   show: true,
    // },
    { name: `QST[${questionIndex}].qstSupportComments`, show: true },
    { name: `QST[${questionIndex}].qstSupportDocuments`, show: true },
  ];
  return (
    <Row>
      {fields
        .filter((field) => field.show)
        .map((field, index) => (
          <Col md={6} key={index}>
            <FormControl
              control={control}
              name={field.name}
              formMetaData={formMetaData}
              formMethods={formMethods}
              hideTitle={true}
            />
          </Col>
        ))}
    </Row>
  );
};

export default AdvancedFields;
