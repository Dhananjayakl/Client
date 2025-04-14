import { useEffect } from "react";

const JSHook = (form, formMetaData, formMethods,formValues) => {
  if (
    formMethods.getValues("previousStage") === null ||
    formMethods.getValues("previousStage") === ""
  ) {
    formMethods.setValue("action", 1);
    formMethods.setValue("currentStage", "INITIATE");
  }
 
  let action = formMethods.getValues("action");
  useEffect(() => {
    if (action === 3) {
      formMetaData.fields.dcComments.required = false;
      formMetaData.fields.reviewerComments.required = false;
      formMetaData.fields.comments.required = true;
    } else if (action === 2) {
      formMetaData.fields.dcComments.required = true;
      formMetaData.fields.reviewerComments.required = true;
      formMetaData.fields.comments.required = false;
    }
  }, [action]);

  
   useEffect(()=>{
      const editButton = document.querySelector(
        `.form-${formMetaData.formmeta.form_id}`
      );
      if (editButton != null || editButton != undefined) {
        if (formValues.objectId!= undefined) {
          editButton.hidden = true;
        } else {
          editButton.hidden = false;
        }
      }
    },[formValues.objectId,formMetaData.formmeta.form_id]);
  return form;
};

export default JSHook;
