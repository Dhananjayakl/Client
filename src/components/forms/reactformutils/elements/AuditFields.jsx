import { Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
export let FieldTitle = (props) => {
  return <span className="h5">{props.children}</span>;
};

// export function FieldTitle;

let AuditFields = (props) => {
  const { t } = useTranslation("common");
  let { formMetaData, formMethods } = props;
  let createdByDisp;
  let updateByDisp;
  const { d_date_format, d_data_time_format } = useSelector(
    (state) => state.systemConfig.systemConfig
  );

  if (formMetaData != null) {
    if (formMetaData?.dataSourceResponse.createdBy !== undefined) {
      for (
        let i = 0;
        i < formMetaData.dataSourceResponse.createdBy.length;
        i++
      ) {
        if (formMetaData.dataSourceResponse.createdBy[i]) {
          createdByDisp = formMetaData?.dataSourceResponse?.createdBy[0]?.label;
        }
      }
    }
    if (formMetaData?.dataSourceResponse.lastUpdatedBy !== undefined) {
      for (
        let i = 0;
        i < formMetaData.dataSourceResponse.lastUpdatedBy.length;
        i++
      ) {
        if (formMetaData?.dataSourceResponse?.lastUpdatedBy[i]) {
          updateByDisp =
            formMetaData?.dataSourceResponse?.lastUpdatedBy[0]?.label;
        }
      }
    }
  }

  return (
    <>
      <Row>
        <div className="col-md-2 ">
          <FieldTitle>{t("Created")}:</FieldTitle>
          {/* <span className="h5">
                
                </span> */}
        </div>
        <div className="col-md-5">
          <FieldTitle>{t("By")}: </FieldTitle>{" "}
          <span style={{ color: "rgb(108, 117, 125)" }}> {createdByDisp}</span>
        </div>
        <div className="col-md-5">
          <FieldTitle>{t("On")}: </FieldTitle>{" "}
          <span style={{ color: "rgb(108, 117, 125)" }}>
            {formMetaData?.util?.formatDateTimeStamp(
              formMethods?.getValues("createdOn"),
              d_data_time_format
            )}{" "}
          </span>
        </div>
      </Row>
      {updateByDisp && (
        <Row>
          <div className="col-md-2">
            <FieldTitle>{t("Modified")}: </FieldTitle>
          </div>
          <div className="col-md-5">
            <FieldTitle>{t("By")}: </FieldTitle>{" "}
            <span style={{ color: "rgb(108, 117, 125)" }}> {updateByDisp}</span>
          </div>
          <div className="col-md-5">
            <FieldTitle>{t("On")}: </FieldTitle>{" "}
            <span style={{ color: "rgb(108, 117, 125)" }}>
              {formMetaData?.util.formatDateTimeStamp(
                formMethods?.getValues("lastUpdatedOn"),
                d_data_time_format
              )}
            </span>
          </div>
        </Row>
      )}
    </>
  );
};

export default AuditFields;
