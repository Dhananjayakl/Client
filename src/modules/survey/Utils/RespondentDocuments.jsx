import React from "react";
import { Row } from "react-bootstrap";
import SurveySection from "./SurveySection";
import Grid from "src/components/forms/reactformutils/Grid";
const RespondentDocuments = (props) => {
  const { formMetaData, formMethods } = props;

  return (
    <SurveySection title="Documents/Evidence" expandCollapse={true}>
      <Row>
        <Grid
          formMetaData={formMetaData}
          formMethods={formMethods}
          region="DOC"
          regionTitle="Documents"
          columns={[
            { name: "docCategory", length: 6 },
            { name: "docUploadEvidence", length: 6 },
          ]}
          actions={{ add: true, remove: true }}
        />
      </Row>
    </SurveySection>
  );
};

export default RespondentDocuments;
