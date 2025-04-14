import { useState, useEffect } from "react";

let JSHook = (form, formMethods, formMetaData) => {
  useEffect(() => {
    formMethods.setValue("accountType", 2);
  }, []);
};

export default JSHook;
