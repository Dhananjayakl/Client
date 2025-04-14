import { useTranslation } from "react-i18next";
import FormControl from "src/components/forms/reactformutils/FormControl";
const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    getValues,
    formState: { errors, touched, isSubmitting, isDirty },
    watch,
  } = formMethods;

  console.log("yyyyyyyyyyyyyyyyyyyyyyyy", props);
  const { t } = useTranslation();

  formMethods.setValue(
    "filterExpression",
    runtimeParams.reportfilterexpresiion
  );
  formMethods.setValue("columnList", runtimeParams.columnList);
  formMethods.setValue("idOrReportname", runtimeParams.reportMeta.report_name);
  return (
    <>
      <div style={{ marginTop: "20px" }}>
        <FormControl
          control={control}
          // type="select"
          name="sendTo"
          formMetaData={formMetaData}
          formMethods={formMethods}
        />
      </div>
      <FormControl
        control={control}
        // type="select"
        name="sendCc"
        formMetaData={formMetaData}
        formMethods={formMethods}
      />
      <FormControl
        control={control}
        // type="select"
        name="subject"
        formMetaData={formMetaData}
        formMethods={formMethods}
      />
      <FormControl
        control={control}
        // type="select"
        name="description"
        formMetaData={formMetaData}
        formMethods={formMethods}
      />
    </>
  );
};

export default FormLayout;
