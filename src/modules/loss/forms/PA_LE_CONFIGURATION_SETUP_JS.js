import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
let JSHook = (
  form,
  formMethods,
  formMetaData,
  runtimeParams,
  LAfields,
  openModal
) => {

  const [changeCurrency, setChangeCurrency] = useState(false);

  form.laActive.onChange(function (value, row) {
    if (value == false) {
      for (let i = row; i < formMethods.getValues("LA").length; i++) {
        formMethods.setValue("LA." + i + ".laActive", false);
      }
    }
  });

  form.curTransactionalCurrency.onChange(function (value, row) {
    formMethods.setValue("CUR." + row + ".curTransactionalCurrency", '');
    const valuesArray = formMethods.getValues("CUR");
    const isCurrencyPresent = valuesArray.some(item => item.curTransactionalCurrency == value);

    if (isCurrencyPresent) {
      openModal(
        "This currency is already present in the transaction currency list."
      );
     }
     else
     {
      formMethods.setValue("CUR." + row + ".curTransactionalCurrency", value);
     }
    if (
      formMethods.getValues("systemCurrency") ==
      formMethods.getValues("CUR." + row + ".curTransactionalCurrency")
    ) {
      formMethods.setValue("CUR." + row + ".curConversionRate", 1);
    }
  });





  useEffect(() => {
    form.systemCurrency.onChange(function (value, row) {
      if (formMethods.getValues("systemCurrency") != null) {
        if (
          formMethods.getValues("CUR") != undefined ||
          formMethods.getValues("CUR") != []
        ) {
          for (let i = 0; i < formMethods.getValues("CUR").length; i++) {
            formMethods.setValue("CUR." + i + ".curActive", false);
            setChangeCurrency(i);
          }
        }
        // Open modal with a custom message or content
        openModal(
          "System Currency has been changed. All the Transactional Currency will get Deactive."
        );
      }
    });
  }, [formMethods.getValues("systemCurrency"), openModal]);

  formMethods.setValue("objectId",1);

  return form;
};

export default JSHook;
