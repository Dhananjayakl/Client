import React from "react";
import FormControl from "src/components/forms/reactformutils/FormControl";
import Section from "src/components/forms/reactformutils/fields/Section";
import SubSection from "src/components/forms/reactformutils/fields/SubSection";
import SurveySection from "./SurveySection";

import { Row, Col } from "react-bootstrap";

const RespondentInformation = (props) => {
  const { formMetaData, formMethods, control } = props;
  return (
    <SurveySection title="General Information" expandCollapse={true}>
      <Row>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="questionnaireName"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="program"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>

        <div className="col-md-6">
          <FormControl
            control={control}
            name="auditTitle"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="wpCategory"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
        <div className="col-md-6">
          <FormControl
            control={control}
            name="wpType"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>

        <Row>
          <Col>
            <SubSection title="Scope">
              <Row>
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="businessUnit"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    singleRow
                    labelSize={4}
                  />
                </div>
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="aeProcess"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    singleRow
                    labelSize={4}
                  />
                </div>
              </Row>
            </SubSection>
          </Col>
          <Col>
            <SubSection title="Ownership">
              <Row>
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="wpAuditor"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    singleRow
                    labelSize={4}
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-12">
                  <FormControl
                    control={control}
                    name="approver"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    singleRow
                    labelSize={4}
                  />
                </div>
              </Row>
            </SubSection>
          </Col>
          <Col>
            <SubSection title="Key Dates">
              <Row>
                <FormControl
                  control={control}
                  name="wpStartDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                />
              </Row>

              <Row>
                <FormControl
                  control={control}
                  name="wpEndDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                />
              </Row>
            </SubSection>
          </Col>
        </Row>
      </Row>
    </SurveySection>
  );
};

export default RespondentInformation;
