import { useWatch } from "react-hook-form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Trans, useTranslation } from "react-i18next";

let FormTitle = (props) => {
 const { t, i18n } = useTranslation("common");
  let { formMetaData, formMethods, runtimeParams } = props;
  let { control } = formMethods;
  let headerContent = formMetaData.formmeta.header_column
    ? formMethods.getValues(formMetaData.formmeta.header_column)
    : undefined;
  let watchHeaderContent = null;

  watchHeaderContent = useWatch({
      control: control,
      name: formMetaData?.formmeta?.header_column,
    });
  
  // if (formMetaData?.formmeta?.header_column) {
  // watchHeaderContent = useWatch({
  //     control: control,
  //     name: formMetaData?.formmeta?.header_column,
  //   });
  // }
  // console.log(watchHeaderContent,'watchHeaderContentwatchHeaderContent');
  

  headerContent = formMetaData.fields[formMetaData.formmeta.header_column]
    ?.editable
    ? watchHeaderContent
    : headerContent;

  headerContent = headerContent
    ? `${runtimeParams.objectId !== -1 ? `[${runtimeParams.objectId}] ` : ""}` +
      headerContent
    : formMetaData.formmeta.form_title;

  return (
    <>
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip>{headerContent}</Tooltip>}
      >
        <span className="h3 d-inline-block text-truncate cursor-pointer">
          {/* {headerContent} */}
          {t(headerContent)}
        </span>
      </OverlayTrigger>
    </>
  );
};

export default FormTitle;
