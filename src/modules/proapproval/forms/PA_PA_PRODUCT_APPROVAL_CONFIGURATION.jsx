import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useFieldArray, useWatch } from "react-hook-form";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import Grid from "src/components/forms/reactformutils/Grid";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues } = props;
  const {
    control,
    formState: {},
  } = formMethods;

  return (
    <>
      <Container className="justify-content-center  ">
        <Row className="p-0 m-0">
          <Section title="General">
            <Row>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="revenueThreshold"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  required={true}
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="preliminaryRiskChecklist"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  // required={true}
                />
              </div>
              <div className="col-md-4">
                <FormControl
                  control={control}
                  name="operationalPreparednessChecklist"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  // required={true}
                />
              </div>
            </Row>
          </Section>
          {/* <Section title="Product Worklfow Stage">
            <Grid
              formMetaData={formMetaData}
              formMethods={formMethods}
              region="PWF"
              regionTitle="Workflow Stages"
              columns={[
                // "vdaVendor",
                { name: "workflowStage", length: 4 },
                { name: "workflowStageNames", length: 4 },
                { name: "activeStage", length: 4 },
              ]}
              actions={{ add: true, remove: true }}
            />
          </Section> */}

          <Section title="Review Categories">
            <Grid
              formMetaData={formMetaData}
              formMethods={formMethods}
              region="PRC"
              regionTitle="Review Categories"
              columns={[
                { name: "reviewCategory", length: 4 },
                { name: "prcApplicableAssessment", length: 4 },
                { name: "active", length: 4 },
              ]}
              actions={{ add: true, remove: true }}
            />
          </Section>
        </Row>
        <Row>
          <Section title="Rating">
            <Grid
              formMetaData={formMetaData}
              formMethods={formMethods}
              region="RTG"
              regionTitle="Rating"
              columns={[
                // "vdaVendor",
                { name: "rtgLowerValue", length: 4 },
                { name: "rtgUpperValue", length: 4 },
                { name: "rtgRating", length: 4 },
              ]}
              actions={{ add: true, remove: true }}
            />
          </Section>
        </Row>
        {/* </SubSection> */}
      </Container>
    </>
  );
};

export default FormLayout;
