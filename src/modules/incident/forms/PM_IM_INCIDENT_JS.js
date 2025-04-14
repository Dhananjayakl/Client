import { useEffect } from "react";
let JSHook = (form, formMetaData, formMethods, formValues) => {
  let score = 0;
  form.onLoad = (props) => {};

  function calculateRisk(value) {
    score = Math.round(
      (parseInt(formMethods.getValues("financial")) +
        parseInt(formMethods.getValues("regulatory")) +
        parseInt(formMethods.getValues("customer"))) /
        3
    );

    if (!isNaN(score)) {
      formMethods.setValue("riskRating", score);
    }
  }

  form.customer.onChange(function (value) {
    calculateRisk();
  });

  form.regulatory.onChange(function (value) {
    calculateRisk();
  });

  form.financial.onChange(function (value) {
    calculateRisk();
  });

  form.onLoad();

  return form;
};

export default JSHook;
