import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  formObjectLock,
  formObjectExtendTime,
  formObjectUnlock,
} from "src/components/server/service";
import Alert from "./Alert";
import { useTranslation } from "react-i18next";
import { getMinutesDifffromCurrentDate } from "src/components/forms/reactformutils/elements/formutilfunctions";
const EditButton = (props) => {
  let { runtimeParams } = props;
  let formId = runtimeParams.formId;
  const objectId = runtimeParams.objectId;
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const { t } = useTranslation("common");
  const handleButtonClick = () => {
    formObjectLock("formobjectlock", objectId, formId)
      .then((response) => {
        setAlert(response.data.lockedUser);
        if (response.data.isLocked === false) {
          setShowAlert(true);
        } else {
          runtimeParams.setReload(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <div className={`float-end mx-1 edit form-${formId}`}>
      <Button
        type="button"
        className={`d-flex align-items-center justify-content-center px-2 editbutton`}
        variant="secondary"
        hidden={false}
        onClick={handleButtonClick}
      >
        <FontAwesomeIcon icon={faEdit} /> {t("Edit")}
      </Button>

      {showAlert && (
        <Alert
          content={`Unfortunately, you don't have the necessary permissions to lock the object, as it is already locked by the user with ID ${alert}. Please contact the System Administrator for further assistance.`}
          show={showAlert}
          onHide={handleAlertClose}
          info
        />
      )}
    </div>
  );
};

export default EditButton;
export const handleYesClick = (runtimeParams, setshowNotify) => {
  const { objectId, formId } = runtimeParams;

  formObjectExtendTime("formobjectlock", objectId, formId, "true")
    .then((response) => {
      runtimeParams.setReload(true);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const handleNoClick = (runtimeParams) => {
  const { formId, objectId } = runtimeParams;

  formObjectUnlock("formobjectunlock", objectId, formId)
    .then((response) => {})
    .catch((err) => {
      console.log(err);
    });
};
export const startMonitoring = (runtimeParams) => {
  const { accessTime, extendedTime } = runtimeParams?.formmeta || {};

  const checkTime = (time) => {
    if (time !== null && time !== undefined) {
      const minutesDifference = getMinutesDifffromCurrentDate(
        time,
        "YYYY-MM-DD HH:mm:ss"
      );
      const roundMinute = Math.round(minutesDifference);
      return roundMinute;
    }
    return 0;
  };

  const monitorEveryMinute = () => {
    const accessTimeDiff = checkTime(accessTime);
    const extendedTimeDiff = checkTime(extendedTime);
    return {
      accessTimeDiff,
      extendedTimeDiff,
    };
  };
  return monitorEveryMinute();
};
