import { useState, useEffect } from "react";

let JSHook = (form, formMethods, fields, formMetaData, formValues) => {
  //starting hide;
  formMetaData.fields.optionalHoliday.required = false;

  const [checked, ischecked] = useState("");
  const [view, setView] = useState(false);

  formMethods.setValue("restrictedHolidays", 0);
  formMethods.setValue("optionalHoliday", 0);
  formMethods.setValue("sickLeaves", 0);

  // if (formValues.objectId === undefined && !view) {
  //   fields.casualLeaves.visible = false;
  //   fields.earnedLeaves.visible = false;
  //   fields.maternityLeaves.visible = false;
  //   fields.paternityLeaves.visible = false;
  //   fields.sickLeaves.visible = false;
  //   fields.optionalHoliday.visible = false;
  // }

  form.isMedicalCertReq.onChange(function (value) {
    ischecked(value);
  });

  // form.leaveTypes.onChange(function (value) {
  //   console.log("Leave Types.......", value);
  //   enableLeaveFields(value);
  // });
  // function enableLeaveFields(dataset) {
  //   let result = '';
  //   setView(true);
  //   for (let i = 0; i < dataset.length; i++){
  //     result = result.concat(dataset[i].value);
  //     if (i < dataset.length - 1) {
  //       result = result.concat(",");
  //     }
  //   }
  //   console.log("Result Set", result);
  //   if (result.indexOf('1') != -1) {
  //     fields.casualLeaves.visible = true;
  //   } else {
  //     fields.casualLeaves.visible = false;
  //   }
  //   if (result.indexOf('2') != -1) {
  //     fields.earnedLeaves.visible = true;
  //   } else {
  //     fields.earnedLeaves.visible = false;
  //   }
  //   if (result.includes('3')) {
  //     fields.maternityLeaves.visible = true;
  //     fields.paternityLeaves.visible = true;
  //   }
  //   if (result.includes('4')) {
  //     fields.sickLeaves.visible = true;
  //   }
  //   if (result.includes('5')) {
  //     fields.optionalHoliday.visible = true;
  //   }
  // }

  useEffect(() => {
    if (checked == true) {
      formMetaData.fields.noOfDays.visible = false;
      // formMetaData.fields.attachments.required = false;
    }
    if (checked == "") {
      formMetaData.fields.noOfDays.visible = true;
      // formMetaData.fields.attachments.required = true;
    } else if (checked == false) {
      formMetaData.fields.noOfDays.visible = true;
      // formMetaData.fields.attachments.required = true;
    }
  }, [checked]);
  let getSwitch = formMethods.getValues("isMedicalCertReq");
  if (getSwitch == true) {
    formMetaData.fields.noOfDays.visible = true;
    formMetaData.fields.noOfDays.required = true;
    // formMetaData.fields.attachments.required=true;
  } else {
    formMetaData.fields.noOfDays.visible = false;
    formMetaData.fields.noOfDays.required = false;
    // formMetaData.fields.attachments.required=false;
  }

  let fromDate = formMethods.getValues("effectiveFrom");
  let Year = new Date(fromDate).getFullYear();
  formMethods.setValue("year", Year);

  if (fromDate !== "") {
    formMetaData.fields.effectiveUntil.visible = true;
  } else {
    formMetaData.fields.effectiveUntil.visible = false;
  }

  form.leaveCreditByAnnually.onChange(function (value) {
    formMethods.setValue("ledgerRefresh", "");
    if (value) {
      formMetaData.fields.ledgerRefresh.visible = true;
      formMetaData.fields.ledgerRefresh.required = true;
    } else {
      formMetaData.fields.ledgerRefresh.visible = false;
      formMetaData.fields.ledgerRefresh.required = false;
    }
  });

  let leaveCred = formMethods.getValues("leaveCreditByAnnually");
  if (leaveCred === "" || leaveCred === false) {
    formMetaData.fields.ledgerRefresh.visible = false;
    formMetaData.fields.ledgerRefresh.required = false;
  } else {
    formMetaData.fields.ledgerRefresh.visible = true;
    formMetaData.fields.ledgerRefresh.required = true;
  }

  if (formValues.objectId !== undefined) {
    formMetaData.fields.leaveCreditByAnnually.editable = false;
  }

  return form;
};

export default JSHook;
