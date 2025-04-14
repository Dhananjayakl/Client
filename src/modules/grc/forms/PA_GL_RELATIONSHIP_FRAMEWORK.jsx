import {
  Form,
  Button,
  Table,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import Section from "src/components/forms/reactformutils/fields/Section";
import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import JSHook from "./PA_GL_RELATIONSHIP_FRAMEWORK_JS";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    formValues,
    runtimeParams,
  } = props;
  const {
    setError,
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touched, isSubmitting },
  } = formMethods;

  // ========
  const [columnTitles, setColumnTitles] = useState({});

  // Function to get the field title
  const getFormFieldTitle = (fieldName) => {
    const field = formMetaData.fields[fieldName];
    return field ? field.field_title : "";
  };

  useEffect(() => {
    const titles = {
      impactRating: getFormFieldTitle("impactRating"),
      likelihoodRating: getFormFieldTitle("likelihoodRating"),
      inherentRating: getFormFieldTitle("inherentRating"),
      controlEffectiveness: getFormFieldTitle("controlEffectiveness"),
      residualRating: getFormFieldTitle("residualRating"),
      financialRating: getFormFieldTitle("financialRating"),
      reputationalRating: getFormFieldTitle("reputationalRating"),
      stakeholder: getFormFieldTitle("stakeholder"),
      legal: getFormFieldTitle("legal"),
    };

    setColumnTitles(titles);
  }, []);

  const { fields, rows, append, remove } = useFieldArray({
    name: "SCR",
    control,
  });

  const addRow = (fieldName) => {
    const fieldCount = addedFields[fieldName] || 0;

    setAddedFields((prevFields) => ({
      ...prevFields,
      [fieldName]: fieldCount + 1,
    }));

    const fieldTitle = getFormFieldTitle(fieldName);

    append({
      startRange: "",
      endRange: "",
      factorName: fieldTitle,
      id: "",
      rating: "",
      score: "",
      guidance: "",
      fieldName,
    });
  };

  useEffect(() => {
    addRow("impactRating");
    addRow("likelihoodRating");
    addRow("inherentRating");
    addRow("controlEffectiveness");
    addRow("residualRating");
    addRow("financialRating");
    addRow("reputationalRating");
    addRow("stakeholder");
    addRow("legal");
  }, []);

  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    formValues,
    register,
    setValue,
    formMetaData,
    append,
    remove,
    addRow,
    columnTitles
  );

  formMetaData.fields.factorName.field_title = false;
  formMetaData.fields.startRange.field_title = false;
  formMetaData.fields.endRange.field_title = false;
  formMetaData.fields.rating.field_title = false;
  formMetaData.fields.score.field_title = false;
  formMetaData.fields.guidance.field_title = false;

  const ScoreTable = ({
    fields,
    control,
    formMetaData,
    formMethods,
    remove,
    selectedField,
    responseData,
    fieldTitle,
  }) => {
    const filteredFields = fields.filter(
      (row) => row.fieldName === selectedField
    );

    // const shouldRenderHeaders = filteredFields.length > 0 || fields.length > 0;
    return (
      <Table responsive className="mt-2">
        {/* {showHeader && ( */}
        <thead>
          {/* {filteredFields.length>0&& ( */}

          <tr className="table-secondary ">
            <th>Factor Name</th>
            <th>Start Range</th>
            <th>End Range</th>
            <th>Rating</th>
            <th>Score</th>
            <th>Guidance</th>
            <th>Remove</th>
          </tr>
        </thead>
        {/* )} */}
        <tbody>
          {fields.map(
            (row, rowIndex) =>
              (fieldTitle === row.factorName ||
                row.fieldName === selectedField) && (
                <tr key={row.id} className="">
                  <td className="py-0">
                    <FormControl
                      control={control}
                      name={`SCR[${rowIndex}].factorName`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </td>
                  <td className="py-0">
                    <FormControl
                      control={control}
                      name={`SCR[${rowIndex}].startRange`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </td>
                  <td className="py-0">
                    <FormControl
                      control={control}
                      name={`SCR[${rowIndex}].endRange`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </td>
                  <td className="py-0">
                    <FormControl
                      control={control}
                      name={`SCR[${rowIndex}].rating`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </td>
                  <td className="py-0">
                    <FormControl
                      control={control}
                      name={`SCR[${rowIndex}].score`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </td>
                  <td className="py-0">
                    <FormControl
                      control={control}
                      name={`SCR[${rowIndex}].guidance`}
                      formMetaData={formMetaData}
                      formMethods={formMethods}
                    />
                  </td>
                  <td className="py-0">
                    <Button
                      type="button"
                      variant="warning"
                      onClick={() => remove(rowIndex)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </Table>
    );
  };

  const [addedFields, setAddedFields] = useState({
    impactRating: 0,
    likelihoodRating: 0,
    inherentRating: 0,
    controlEffectiveness: 0,
    residualRating: 0,
    velocity: 0,
    financialRating: 0,
    reputationalRating: 0,
    stakeHolder: 0,
  });

  return (
    <>
      <Section title="General Setup">
        <Row>
          <Col>
            <Row>
              <h5>Process Compliance</h5>
            </Row>
            <hr></hr>
            <Row>
              <div className="col-md-12">
                <FormControl
                  control={control}
                  name="assessmentType"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>

              <div className="col-md-12">
                <FormControl
                  control={control}
                  name="factorType"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-12">
                <FormControl
                  control={control}
                  name="scoreFields"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-12">
                <FormControl
                  control={control}
                  name="preProRating"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          </Col>
          <Col>
            <Row>
              <h5>Regulatory Compliance</h5>
            </Row>
            <hr></hr>
            <Row>
              <div className="col-md-12">
                <FormControl
                  control={control}
                  name="factorBased"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-12">
                <FormControl
                  control={control}
                  name="preRegRating"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          </Col>
        </Row>
        <Row></Row>
      </Section>
      <Section title="Impact Rating">
        <div className="col-md-6">
          <Button type="button" onClick={() => addRow("impactRating")}>
            Add Impact Rating
          </Button>
        </div>
        {addedFields["impactRating"] > 0 && (
          <Row>
            <div className="col-md-12">
              <ScoreTable
                fields={fields}
                control={control}
                formMetaData={formMetaData}
                formMethods={formMethods}
                remove={remove}
                selectedField="impactRating"
                fieldTitle={getFormFieldTitle("impactRating")}
              />
            </div>
          </Row>
        )}
      </Section>

      <Section title="Likelihood Rating">
        <div className="col-md-6">
          <Button type="button" onClick={() => addRow("likelihoodRating")}>
            Add Likelihood Rating
          </Button>
        </div>
        {addedFields["likelihoodRating"] > 0 && (
          <Row>
            <div className="col-md-12">
              <ScoreTable
                fields={fields}
                control={control}
                formMetaData={formMetaData}
                formMethods={formMethods}
                remove={remove}
                selectedField="likelihoodRating"
                fieldTitle={getFormFieldTitle("likelihoodRating")}
              />
            </div>
          </Row>
        )}
      </Section>

      <Section title="Inherent Rating">
        <Row>
          <div className="col-md-6">
            <Button type="button" onClick={() => addRow("inherentRating")}>
              Add Inherent Rating
            </Button>
          </div>
        </Row>
        {addedFields["inherentRating"] > 0 && (
          <Row>
            <div className="col-md-12">
              <ScoreTable
                fields={fields}
                control={control}
                formMetaData={formMetaData}
                formMethods={formMethods}
                remove={remove}
                selectedField="inherentRating"
                fieldTitle={getFormFieldTitle("inherentRating")}
              />
            </div>
          </Row>
        )}
      </Section>

      <Section title="Control Effectiveness">
        <Row>
          <div className="col-md-6">
            <Button
              type="button"
              onClick={() => addRow("controlEffectiveness")}
            >
              Add Control Effectiveness
            </Button>
          </div>
        </Row>
        {addedFields["controlEffectiveness"] > 0 && (
          <Row>
            <div className="col-md-12">
              <ScoreTable
                fields={fields}
                control={control}
                formMetaData={formMetaData}
                formMethods={formMethods}
                remove={remove}
                selectedField="controlEffectiveness"
                fieldTitle={getFormFieldTitle("controlEffectiveness")}
              />
            </div>
          </Row>
        )}
      </Section>

      {/* <SubSection title="Residual Rating">
        <Row>
          <div className="col-md-6">
            <Button type="button" onClick={() => addRow("residualRating")}>
              Add Residual Rating
            </Button>
          </div>
        </Row>
        {addedFields["residualRating"] > 0 && (
          <Row>
            <div className="col-md-12">
              <ScoreTable
                fields={fields}
                control={control}
                formMetaData={formMetaData}
                formMethods={formMethods}
                remove={remove}
                selectedField="residualRating"
                fieldTitle={getFormFieldTitle("residualRating")}
              />
            </div>
          </Row>
        )}
      </SubSection> */}

      {/* <SubSection title=" Velocity">
        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="velocity"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>
      </SubSection> */}

      {/* <SubSection title="Financial Rating">
        <Row>
          <div className="col-md-6">
            <Button type="button" onClick={() => addRow("financialRating")}>
              Add Financial Rating
            </Button>
          </div>
        </Row>
        {addedFields["financialRating"] > 0 && (
          <Row>
            <div className="col-md-12">
              <ScoreTable
                fields={fields}
                control={control}
                formMetaData={formMetaData}
                formMethods={formMethods}
                remove={remove}
                selectedField="financialRating"
                fieldTitle={getFormFieldTitle("financialRating")}
              />
            </div>
          </Row>
        )}
      </SubSection>

      <SubSection title="Reputational Rating">
        <Row>
          <div className="col-md-6">
            <Button type="button" onClick={() => addRow("reputationalRating")}>
              Add Reputational Rating
            </Button>
          </div>
        </Row>
        {addedFields["reputationalRating"] > 0 && (
          <Row>
            <div className="col-md-12">
              <ScoreTable
                fields={fields}
                control={control}
                formMetaData={formMetaData}
                formMethods={formMethods}
                remove={remove}
                selectedField="reputationalRating"
                fieldTitle={getFormFieldTitle("reputationalRating")}
              />
            </div>
          </Row>
        )}
      </SubSection>

      <SubSection title="Stakeholder">
        <Row>
          <div className="col-md-6">
            <Button type="button" onClick={() => addRow("stakeholder")}>
              Add Stakeholder
            </Button>
          </div>
        </Row>
        {addedFields["stakeholder"] > 0 && (
          <Row>
            <div className="col-md-12">
              <ScoreTable
                fields={fields}
                control={control}
                formMetaData={formMetaData}
                formMethods={formMethods}
                remove={remove}
                selectedField="stakeholder"
                fieldTitle={getFormFieldTitle("stakeholder")}
              />
            </div>
          </Row>
        )}
      </SubSection>

      <SubSection title="Legal">
        <Row>
          <div className="col-md-6">
            <Button type="button" onClick={() => addRow("legal")}>
              Add Legal
            </Button>
          </div>
        </Row>
        {addedFields["legal"] > 0 && (
          <Row>
            <div className="col-md-12">
              <ScoreTable
                fields={fields}
                control={control}
                formMetaData={formMetaData}
                formMethods={formMethods}
                remove={remove}
                selectedField="legal"
                fieldTitle={getFormFieldTitle("legal")}
              />
            </div>
          </Row>
        )}
      </SubSection> */}
    </>
  );
};
export default FormLayout;
