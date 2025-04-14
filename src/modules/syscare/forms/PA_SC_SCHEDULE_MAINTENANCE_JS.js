import { useWatch } from "react-hook-form";

let JSHook = (
  form,
  formMethods,
  fields,
  formMetaData,
  formValues,
  callbackToParent,
  control
) => {
  let reason = useWatch({
    control: control,
    name: "reason",
  });

  if (reason === "4") {
    formMetaData.fields.reasonDetails.required = true;
  } else {
    formMetaData.fields.reasonDetails.required = false;
  }

  return form;
};

export default JSHook;
