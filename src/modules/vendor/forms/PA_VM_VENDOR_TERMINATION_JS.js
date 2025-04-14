import { useState, useEffect, useRef } from "react";
import { getRegionData } from "../VendorFormservice";
import { useWatch } from "react-hook-form";
import { getviewData } from "src/modules/businessresilience/BRService";
import { useLocation } from "react-router-dom";

const JSHook = (
  form,
  formMethods,
  formMetaData,
  formValues,
  control,
  runtimeParams
) => {
  const location = useLocation();
  console.log(
    location?.state?.objectData,
    location?.state?.objectData?.object_id,
    "location data js hook"
  );
  if (
    formMethods.getValues("previousStage") === null ||
    formMethods.getValues("previousStage") === ""
  ) {
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("status", "New");
    if (location?.state?.objectData) {
      formMethods.setValue(
        "criticality",
        location?.state?.objectData?.criticality
      );
      formMethods.setValue(
        "classification",
        location?.state?.objectData?.category
      );
      formMethods.setValue("vendor", location?.state?.objectData?.object_id);
    }
  }

  const [vendorId, setVendorId] = useState([]);
  const fetchVendorName = () => {
    getviewData({
      viewName: "pa_gl_thirdparty_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: "",
    })
      .then((response) => {
        const vendorData = response.data.data;
        const object_id = vendorData.map((value) => value.object_id);
        setVendorId({ object_id, vendorData });
      })
      .catch((error) => {
        console.error("Error fetching loss events:", error);
      });
  };
  useEffect(() => {
    fetchVendorName();
  }, []);

  form.vendor.onChange((value) => {
    let selectedVendor = value;
    if (
      (vendorId && Array.isArray(vendorId.object_id)) ||
      Array.isArray(vendorId.vendorData)
    ) {
      let selectedVendorIndex = vendorId.object_id.indexOf(selectedVendor);
      let criticalityOfVendor =
        vendorId.vendorData[selectedVendorIndex].criticality;
      let classificationOfVendor =
        vendorId.vendorData[selectedVendorIndex].category;
      formMethods.setValue("criticality", criticalityOfVendor);
      formMethods.setValue("classification", classificationOfVendor);
    } else {
      console.error("vendorId.object_id is either not defined or not an array");
    }
  });

  form.onSubmit = function (actionName) {
    return actionName;
  };

  form.onSubmit = function (actionName) {
    const actionsRequiringCommentsReset = [
      "Send for Review",
      "Save",
      "Send for Approval",
      "Terminate",
    ];

    if (actionsRequiringCommentsReset.includes(actionName)) {
      formMethods.setValue("comments", "");
      return actionName;
    }
  };

  return form;
};

export default JSHook;
