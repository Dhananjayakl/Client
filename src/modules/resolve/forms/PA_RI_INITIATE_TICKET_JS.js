import { useState, useEffect } from "react";

//Declared for Submission Pop-up and Bottom Bar
let review = "Queue";
let IT = "IT";
let HR = "HR";
let Resolved = "Resolved";

let JSHook = (form, fields, formMethods, formValues) => {
  const [level, setLevel] = useState("");
  let urgency = formMethods.getValues("urgency");
  let impact = formMethods.getValues("impact");
  let priority = 0;

  var currentDate = new Date();
  var formattedDate = currentDate.toISOString().split("T")[0];
  currentDate.setDate(currentDate.getDate());

  // SLAs Based on Priority
  function priorityInRange(priority) {
    switch (priority) {
      case 1:
        return "4";
        break;
      case 2:
        return "6";
        break;
      case 3:
        return "24";
        break;
      case 4:
        return "48";
        break;
      case 5:
        return "72";
        break;
    }
  }

  // Urgency on Change Function
  form.urgency.onChange(function (value) {
    if (impact > 0) {
      priority = Math.round(
        (parseInt(formMethods.getValues("urgency")) +
          parseInt(formMethods.getValues("impact"))) /
          2
      );
      formMethods.setValue("priority", priority);
      formMethods.setValue("sla", priorityInRange(priority));
    }
  });

  //Impact on Change function
  form.impact.onChange(function (value) {
    if (urgency > 0) {
      priority = Math.round(
        (parseInt(formMethods.getValues("urgency")) +
          parseInt(formMethods.getValues("impact"))) /
          2
      );
      formMethods.setValue("priority", priority);
      formMethods.setValue("sla", priorityInRange(priority));
    }
  });

  //Default Date and Ticket Status on Load when ObjectId is null
  if (!formValues.objectId) {
    formMethods.setValue("ticketStatus", 1);
    formattedDate = currentDate.toISOString().split("T")[0];
    formMethods.setValue("reportedDate", formattedDate);
  }

  // Ticket Status will be removed onLoad of the form
  // useEffect(() => {
  //     if (formValues.objectId) {
  //         formMethods.setValue("ticketStatus", "");
  //     }
  // }, []);

  // On Submit Functionality for Action name
  form.onSubmit = function (actionName, actionCode) {
    if (actionName == "Log Ticket") {
      return actionName;
    } else if (actionName == "Assign") {
      return actionName;
    } else if (actionName == "Reassign") {
      return actionName;
    } else if (actionName == "Resolved") {
      return actionName;
    } else if (actionName == "Update Ticket" && actionCode == 4) {
      return actionName;
    } else if (actionName == "Update Ticket" && actionCode == 5) {
      return actionName;
    }
  };

  return form;
};

export default JSHook;
