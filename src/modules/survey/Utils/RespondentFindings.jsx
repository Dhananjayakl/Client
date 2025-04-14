import React, { useRef } from "react";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportRuntime from "src/components/reports/Report";
import { Row, Col } from "react-bootstrap";
import SurveySection from "./SurveySection";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const RespondentFindings = (props) => {
  const {
    form,
    formValues,
    formMetaData,
    formMethods,
    control,
    runtimeParams,
  } = props;
  const refreshdataref = useRef(null);
  runtimeParams.refreshdataref = refreshdataref;

  form.callbackFromChild = (props) => {
    runtimeParams.refreshdataref.current();
  };
  return (
    <>
      <Row className="mx-1">
        <ModalForm
          objectId={-1}
          formname="issueobservation"
          component={
            <FormRunTime
              formService="issueobservation"
              objectId={-1}
              modal
              ParentFormObjectId={formValues.auditTitle}
              fndApprover={formValues.wpAuditor}
              fndApproveBU={formValues.businessUnit}
              program="1"
              source_form_name="IA_AUDITS"
              subObjId={formValues.objectId}
              callbackParent={form.callbackFromChild}
            />
          }
          buttonText={
            <>
              <FontAwesomeIcon icon={faPlusCircle} size="lg" /> Add Findings
            </>
          }
        />
      </Row>
      <SurveySection title="Finding Details" expandCollapse={true}>
        <ReportRuntime
          refreshdataref={refreshdataref}
          report="IR_AUDIT_WP_FINDINGS"
          drilldownReports={{ wpId: formMethods.getValues("objectId") }}
        />
      </SurveySection>
    </>
  );
};

export default RespondentFindings;
