import { useEffect } from "react";

const JSHook = (form, formMetaData, formMethods, formValues) => {
    form.objectType.onChange(function (value) {
        
        formMethods.setValue("objectName", "")
      });
   
  return form;
};

export default JSHook;




