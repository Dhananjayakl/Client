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
import JSHook from "./PA_VM_CONFIGURATION_JS";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, formValues } = props;
  const {
    control,
    formState: {},
  } = formMethods;

  const {
    fields: SCVFields,
    append: SCVappend,
    remove: SCVremove,
  } = useFieldArray({
    name: "SCV",
    control,
  });
  const addSCVRow = () => {
    SCVappend({
      scvId: "",
      serviceCategory: "",
      applicableAssement: "",
      scvActive: "",
    });
  };

  formMetaData.form = JSHook(
    form,
    formMethods,
    formMetaData,
    formValues,
    SCVappend,
    SCVFields,
    control
  );

  return (
    <>
      <Container className="justify-content-center  ">
        <Section title="General">
          <Row>
            {/* <Col>
              <FormControl
                control={control}
                name="autoTriage"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col> */}

            <Col md={6} lg={6}>
              <FormControl
                control={control}
                name="preliminaryAssessment"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6} lg={6}>
              <FormControl
                control={control}
                name="rBIGuidelinesForm"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={4} lg={4}>
              <FormControl
                control={control}
                name="genericForm"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            {formMethods.getValues("preliminaryAssessment") == true && (
              <Col>
                <FormControl
                  control={control}
                  name="preliminaryEvalutionChecklist"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
            )}

            <Col>
              <FormControl
                control={control}
                name="inheritRiskQuestionnaire"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>

        {/* <SubSection title="Due Diligence">
          <Row>
            <Col>
              <FormControl
                control={control}
                name="VENDOR_AGNOSTIC_RA"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col>
              <FormControl
                control={control}
                name="VENDOR_RISK_ASSESSMENT"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </SubSection> */}

        <Section title="Service category">
          <Grid
            formMetaData={formMetaData}
            formMethods={formMethods}
            region="SCV"
            regionTitle="Region Service Category"
            columns={[
              // "vdaVendor",
              { name: "serviceCategory", length: 5 },
              //{ name: "qualifiers", length: 3 },
              { name: "applicableAssement", length: 5 },
              { name: "scvActive", length: 2 },
            ]}
            actions={{ add: true, remove: true }}
          />
        </Section>

        {/* <Row className="mb-2 px-2">
            <Button onClick={addSCVRow}>+ Add Service Category</Button>
          </Row> */}
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
        <Row>
          <Section title="Termination Checklist">
            <Grid
              formMetaData={formMetaData}
              formMethods={formMethods}
              region="VTC"
              regionTitle="Termination Checklist"
              columns={[
                { name: "vtcTerminationChecklist", length: 7 },
                // { name: "vtcComments", length: 4 },
                // { name: "vtcDocuments", length: 4 },
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
