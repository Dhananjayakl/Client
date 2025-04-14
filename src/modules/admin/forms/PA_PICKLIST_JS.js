import { useEffect, useState } from "react";
import { getviewData } from "src/modules/admin/AdminService";

let JSHook = (
  form,
  formMethods,
  fields,
  formMetaData,
  formValues,
  register,
  setValue,
  remove,
  append,
  addRow
) => {
  if (formValues.picklistId === undefined) {
    useEffect(() => {
      addRow();
    }, []);
  }

  return form;
};

export default JSHook;
