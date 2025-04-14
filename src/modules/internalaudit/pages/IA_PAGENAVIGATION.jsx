import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const PageNavigation = ({
  auditData,
  onRefresh,
  refreshWp,
  refresIF,
  refresIAReport,
  controlId,
  riskId,
}) => {
  let roleName = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].role_names;
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const handleButtonClick = () => {
    if (typeof onRefresh === "function") {
      onRefresh();
      toast.info("Audit Page Refetched Successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        closeButton: false,
      });
    }
  };

  const handleReport = () => {
    const path = `/report?report=IA_AUDITS_REP`;
    navigate(path);
  };
  const handleClick = () => {
    // alert(1);
    const path = `/form/runtime?formService=issueobservation`;
    navigate(path);
  };

  let refreshPage = () => {
    // fetchData();
  };

  return (
    <div className="justify-content-end float-end mb-2">
      {/* <Button className="mx-1">(+) Scope</Button> */}
      {auditData.status != "Scheduled" &&
        auditData.status != "Closed" &&
        auditData.status != "Audit Planning" &&
        auditData.status != "Cancelled" && (
          <ModalForm
            objectId={-1}
            form={"createworkpaper"}
            variant="nblue"
            size="xl"
            // style={{}}
            component={
              <FormRunTime
                formService="createworkpaper"
                objectId={-1}
                modal
                ParentFormObjectId={auditData.object_id}
                fndApprover={auditData.audit_manager}
                fndApproveBU={auditData.business_unit}
                planStartdate={auditData.start_date}
                planendDate={auditData.end_date}
                controlId={controlId}
                riskId={riskId}
                program="1"
                // callbackParent={refreshPage}
                callbackParent={refreshWp}
                source_form_name="IA_AUDITS"
                // subObjId={formValues.objectId}
              />
            }
            buttonText={
              <>
                <FontAwesomeIcon icon={faPlusCircle} size="lg" />{" "}
                {t("Workpaper")}
              </>
            }
          />
        )}{" "}
      {auditData.status != "Scheduled" &&
        auditData.status != "Closed" &&
        auditData.status != "Audit Planning" &&
        auditData.status != "Cancelled" && (
          <ModalForm
            objectId={-1}
            form={"issueobservation"}
            variant="warning"
            size="xl"
            component={
              <FormRunTime
                formService="issueobservation"
                objectId={-1}
                modal
                ParentFormObjectId={auditData.object_id}
                fndApprover={auditData.audit_manager}
                fndApproveBU={auditData.business_unit}
                program="1"
                // callbackParent={refreshIssueReport}
                callbackParent={refresIF}
                source_form_name="IA_AUDITS"
                // subObjId={formValues.objectId}
              />
            }
            buttonText={
              <>
                <FontAwesomeIcon icon={faPlusCircle} size="lg" />{" "}
                {t("Finding/Observation")}
              </>
            }
          />
        )}
      {/* <Button className="mx-1" onClick={handleReport}>
          (+) Report
        </Button> */}{" "}
      {roleName.includes("IA_AUDIT_MANAGER") &&
        auditData.status != "Scheduled" &&
        auditData.status != "Audit Planning" &&
        auditData.status != "Closed" &&
        auditData.status != "Cancelled" && (
          <ModalForm
            objectId={-1}
            form={"auditreport"}
            variant="primary"
            size="xl"
            component={
              <FormRunTime
                formService="auditreport"
                objectId={-1}
                modal
                ParentFormObjectId={auditData.object_id}
                fndApprover={auditData.lead_auditor}
                fndApproveBU={auditData.business_unit}
                program="1"
                // callbackParent={refreshIssueReport}
                callbackParent={refresIAReport}
                source_form_name="IA_AUDITS"
                // subObjId={formValues.objectId}
              />
            }
            buttonText={
              <>
                <FontAwesomeIcon icon={faPlusCircle} size="lg" /> {t("Report")}
              </>
            }
          />
        )}
      {auditData.status != "Scheduled" &&
        auditData.status != "Audit Planning" &&
        auditData.status != "Closed" &&
        auditData.status != "Cancelled" && (
          <Button className="mx-1" onClick={handleButtonClick}>
            <FontAwesomeIcon icon={faArrowsRotate} />
          </Button>
        )}
    </div>
  );
};
export default PageNavigation;
