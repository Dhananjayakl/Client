import { useEffect } from "react";
import { useWatch } from "react-hook-form";

const JSHook = (form, control, formMetaData, formMethods, formValues) => {
  form.onLoad = (props) => {
    const startDateValue = formMethods.getValues("startDate");
    const endDateValue = formMethods.getValues("endDate");

    if (formValues.objectId == null) {
      formMethods.setValue("status", "New");
    }

    useEffect(() => {
      formMethods.setValue("active", true);
      const statusValue = formMethods.getValues("status");

      if (formMethods.getValues("objectId") != "") {
        if (statusValue === "Active") {
          formMethods.setValue("active", true);
        } else {
          formMethods.setValue("active", false);
        }
      }
    }, []);

    if (startDateValue > endDateValue) {
      formMethods.setValue("endDate", "");
    }
  };

  const submitButton = document.querySelector(".disbutton");

  let website = useWatch({
    control,
    name: "website",
  });

  const isValidURL = (website) => {
    try {
      new URL(website);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const handleFormSubmit = (e) => {
      if (submitButton != null) {
        if (website?.length > 0) {
          if (!isValidURL(website)) {
            e.preventDefault();
            submitButton.hidden = false;
            alert("Please enter a valid website address.");
          } else {
            submitButton.hidden = false;
          }
        }
      }
    };

    if (submitButton) {
      submitButton.addEventListener("click", handleFormSubmit);
    }

    return () => {
      if (submitButton) {
        submitButton.removeEventListener("click", handleFormSubmit);
      }
    };
  }, [formMetaData, formValues, website, submitButton]);

  form.onLoad();

  return form;
};

export default JSHook;
