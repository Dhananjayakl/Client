import { useEffect } from "react";
import { getviewData } from "../VendorFormservice";
import { useWatch } from "react-hook-form";

const JSHook = (form, control, formMetaData, formMethods, formValues) => {
  form.onLoad = (props) => {
    let currentDate = new Date();
    let formattedDate;
    formattedDate = currentDate.toISOString().split("T")[0];
    formMethods.setValue("triggerDate", formattedDate);
  };

  let productService = useWatch({
    control,
    name: "serviceProductTitle",
  });

  // pa_vm_product_service

  useEffect(() => {
    console.log(
      productService,
      typeof productService,
      "product service title ranga"
    );
    getviewData({
      viewName: "pa_vm_product_service_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `object_id=${productService}`,
    })
      .then((response) => {
        console.log(
          response.data.data[0].selected_vendor,
          "selected vendors i need"
        );
        const selectedVendor = response.data.data[0].selected_vendor;


        formMethods.setValue("vendors", selectedVendor);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [productService]);

  form.serviceProduct.onChange((value) => {
    if ((value = true)) {
      formMetaData.fields.serviceProductTitle.visible = true;
    } else {
      formMetaData.fields.serviceProductTitle.visible = false;
    }
  });

  form.eventBased.onChange((value) => {
    if ((value = true)) {
      formMetaData.fields.event.visible = true;
    } else {
      formMetaData.fields.event.visible = false;
    }
  });

  form.onLoad();

  return form;
};

export default JSHook;
