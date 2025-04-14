// 
      
import { useState,useEffect } from "react";
import * as Yup from 'yup';

let JSHook = (form, formMethods,fields,formMetaData,callbackToParent) => {
  useEffect(()=>{
    const validationSchema = Yup.object({
      year: Yup.string().required("Year is Required"),
      region: Yup.string().required("Region is Required"),
      holidayDate: Yup.string()
        .required("Holiday Date is Required")
        .test("holiday-date-year-mismatch", "Invalid Holiday Date Year", function (value) {
          const selectedYear = this.parent.year;
          const selectedDate = new Date(value);
          const selectedYearFromValue = selectedDate.getFullYear();
    
          if (selectedYearFromValue === parseInt(selectedYear, 10)) {
            return true;
          }
          return false;
        }),
      occasion: Yup.string().required("Occasion is Required"),
    });
    
   
    callbackToParent(validationSchema)
  },[]);

  form.occasion.onChange(function (value) {
    let Occasion = value.replace(/[^a-zA-Z\s]+/g, '');;
    formMethods.setValue('occasion', Occasion);
  });
  
    return form;
  };
  
  export default JSHook;
      