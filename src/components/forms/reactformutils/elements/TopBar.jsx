import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Breadcrumb, BreadcrumbItem,Button } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faVideoCamera } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {util} from "src/Progrec";

import {
  faAngleDown,
  faBookmark,
  faCheck,
  faFilePdf,
  faVideoCamera,
  faPencil
} from "@fortawesome/free-solid-svg-icons";

import WFIndicator from "./WFIndicator";
import Bookmark from "./Bookmark";
import ExpandCollapse from "./ExpandCollapse";
import PrintPDF from "./PrintPDF";
import EditButton from "./EditButton";
import Notifiers from "./Notifiers";
import VideoPlayer from "./VideoPlayer";
import FormTitle from "./FormTitle";
import SectionBreadCrumb from "./SectionBreadCrumb";
import useCollapseContext from "../../../../hooks/useCollapseContext.js";
import {useNavigate} from "react-router-dom";
let TopBar = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  let { formMetaData, formMethods, runtimeParams, formValues } = props;
  console.log("runtimeParams", runtimeParams);
  const { sectionStates } = useCollapseContext();

  let topmargin = "62px";
  if (runtimeParams.closeCanvas || runtimeParams.popup) {
    topmargin = "0";
  }

  let isNewObject =
    runtimeParams.objectId == undefined || runtimeParams.objectId == -1
      ? true
      : false;

  return (
    <>
      <div
        id="topbar"
        className=" font-medium text-2xl py-1 bg-white sticky-top z-2 topbar"
        style={{ top: topmargin }}
      >
        <div className="d-flex justify-content-between">
          <FormTitle
            formMetaData={formMetaData}
            formMethods={formMethods}
            runtimeParams={runtimeParams}
          />

          <div className="d-flex">
            {!isNewObject && formMetaData.formmeta.enable_notifiers == true && (
              <Notifiers runtimeParams={runtimeParams}></Notifiers>
            )}
            {!isNewObject &&
              (runtimeParams.formmeta.accessCode == 7 ? (
                <EditButton runtimeParams={runtimeParams}></EditButton>
              ) : (
                ""
              ))}

            <ExpandCollapse runtimeParams={runtimeParams}></ExpandCollapse>
            {runtimeParams.formmeta.video_file_url && (
              <div className="ps-1">
                <VideoPlayer name={runtimeParams.formmeta.video_file_url} />
              </div>
            )}
            {/* <div className="float-end mx-2 text-dark">
                <FontAwesomeIcon icon={faFilePdf} size="xl" />
              </div> */}
            {!isNewObject && runtimeParams.formmeta.enable_print && (
              <PrintPDF runtimeParams={runtimeParams}></PrintPDF>
            )}
            {!isNewObject && runtimeParams.formmeta.enable_bookmark && (
              <Bookmark
                runtimeParams={runtimeParams}
                formValues={formValues}
              ></Bookmark>
            )}

{util.getCurrentUser()?.id==formMetaData.formmeta.created_by && (
                    <Button
                      variant={
                        // reportMeta?.reportInfo?.theme == 2 ? "light" : "primary"
                        "purple"
                      }
                      // variant="primary"
                      className="border-primary  rounded-circle"
                      size="sm"
                      onClick={() => navigate('/form/formdesigner?id='+formMetaData.formmeta.form_id)}
                    >
                      <FontAwesomeIcon icon={faPencil} className="me-1" />
                      
                    </Button>
                  )} 
          </div>
        </div>

        <hr className="m-0 " />
        {runtimeParams.formmeta.enable_section_navigation &&
          Object.keys(sectionStates).length > 1 && <SectionBreadCrumb />}
      </div>

      {runtimeParams.formmeta.enable_workflow_indicator && (
        <WFIndicator
          runtimeParams={runtimeParams}
          className="bg-white"
        ></WFIndicator>
      )}
    </>
  );
};

export default TopBar;
