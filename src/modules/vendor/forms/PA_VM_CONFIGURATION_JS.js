import { useState, useEffect, useRef } from "react";
import { getRegionData } from "../VendorFormservice";
import { useWatch } from "react-hook-form";
import { getviewData } from "src/modules/businessresilience/BRService";

const JSHook = (
  form,
  formMethods,
  formMetaData,
  formValues,
  SCVappend,
  SCVFields,
  control
) => {
  const hideTitle = (recordPrefix, fields, metaData) => {
    fields.forEach((item, index) => {
      const record = `${recordPrefix}.${index}`;
      Object.values(metaData.fields).forEach((field) => {
        if (field && field.field_title) {
          let fieldTitleId = document.getElementById(
            `${record}.${field.field_name}`
          );
          if (fieldTitleId) {
            fieldTitleId.style.display = index === 0 ? "inline-block" : "none";
          }
          let fieldreq = document.getElementById(
            `${record}.${field.field_name}*`
          );
          if (fieldreq) {
            fieldreq.style.display = index === 0 ? "inline-block" : "none";
          }
        }
      });
    });
  };

  useEffect(() => {
    hideTitle("SCV", SCVFields, formMetaData);
  }, [SCVFields, formMetaData]);

  return form;
};

export default JSHook;
