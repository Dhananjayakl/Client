import { useState, useEffect } from "react";
import * as Yup from "yup";
import { getviewData } from "../EmployeeService";
import { getObjectInfo } from "src/modules/admin/AdminService";

let JSHook = (
  form,
  formMethods,
  fields,
  callbackToParent,
  formValues,
  register,
  setValue,
  formMetaData,
  append,
  remove,
  addRow,
  runtimeParams
) => {
  // const[accountNumber,setAccountnumber]=useState('');
  // const[ifscNumber,setifscNumber]=useState('');
  const [euser, setuser] = useState("");
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;

  form.userId.onChange(function (value) {
    setuser(value);
  });
  if (euser) {
    formMethods.setValue("objectId", euser);
  }

  if (formValues.objectId === undefined) {
    useEffect(() => {
      addRow();
    }, []);
  }

  if (runtimeParams.type === "Emp") {
    formMethods.setValue("userId", userId);
    formMethods.setValue("objectId", userId);
    formMetaData.fields.userId.visible = false;
    formMetaData.fields.userId.required = false;
  } else {
    formMetaData.fields.userId.visible = true;
    formMetaData.fields.userId.required = true;
  }
  if (formValues.objectId !== undefined) {
    formMetaData.fields.userId.editable = false;
  }

  useEffect(() => {
    const validationSchema = Yup.object({
      userId: Yup.number().typeError("Employee Name is Required"),
      BK: Yup.array().of(
        Yup.object().shape({
          bankName: Yup.string()
            .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s]+$/, "* Required")
            .required("* Required"),
          accountNumber: Yup.string()
            .required("* Required")
            .matches(/^(?!([0-9])\1+$)\d+$/, "Invalid Account Number")
            .min(9, "Account Number must be at least 9 digits")
            .max(18, "Account Number must not exceed 18 digits"),
          ifscCode: Yup.string()
            .required("* Required")
            .matches(/^[A-Z]{4}[0][A-Z0-9]{6}$/, "Invalid IFSC Code"),
          accountType: Yup.string().required("* Required"),
        })
      ),
    });

    callbackToParent(validationSchema);
  }, []);

  form.bankName.onChange(function (value, row) {
    let numericValue = value.replace(/[^a-zA-Z\s]+/g, "");
    formMethods.setValue("BK." + row + ".bankName", numericValue);
  });

  form.ifscCode.onChange(function (value, row) {
    let numericValue = value.replace(/[^0-9a-zA-Z]/g, "");
    formMethods.setValue("BK." + row + ".ifscCode", numericValue);
  });

  form.accountNumber.onChange(function (value, row) {
    if (value.length > 18) {
      value = value.slice(0, 18);
    }
    formMethods.setValue("BK." + row + ".accountNumber", value);
  });

  const bankViewdata = {
    viewName: "pa_em_bank_details_bk_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `(object_id=${euser})`,
  };

  const BankDetails = [
    { label: "bank_name", key: "bankName" },
    { label: "account_number", key: "accountNumber" },
    { label: "ifsc_code", key: "ifscCode" },
    { label: "account_type", key: "accountType" },
    { label: "branch_address", key: "branchAddress" },
    { label: "bank_id", key: "bankId" },
  ];

  useEffect(() => {
    if (euser !== "") {
      getviewData(bankViewdata)
        .then((response) => {
          const responseData = response.data;
          // Clear values and close all rows
          fields.forEach((_, rowIndex) => {
            BankDetails.forEach(({ key }) => {
              // callbacktoHook(null);
              setValue(`BK[${rowIndex}].${key}`, ""); // Clear the values
            });
          });

          // Close all rows
          for (let i = fields.length; i >= 0; i--) {
            remove(i);
          }

          if (responseData && responseData.data.length > 0) {
            responseData.data.forEach((rowData, rowIndex) => {
              BankDetails.forEach(({ key, label }) => {
                const apiValue = rowData[label];
                // callbacktoHook(rowIndex);
                setValue(`BK[${rowIndex}].${key}`, apiValue);
              });

              // Open additional rows if needed
              if (rowIndex >= fields.length) {
                append({
                  bankName: "",
                  accountNumber: "",
                  ifscCode: "",
                  accountType: "",
                  bankId: "",
                  branchAddress: "",
                });
              }
            });
          } else {
            append({
              bankName: "",
              accountNumber: "",
              ifscCode: "",
              accountType: "",
              bankId: "",
              branchAddress: "",
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [setValue, remove, euser]);

  useEffect(() => {
    if (euser !== "") {
      getObjectInfo("getObjectInfo", euser, "EM_BANK_DETAILS", "object_id")
        .then((response) => {
          if (response.data && response.data.length > 0) {
            formMethods.setValue("createdOn", response.data[0].created_on);
            formMethods.setValue("createdBy", response.data[0].created_by);
          } else {
            formMethods.setValue("comments", "");
            formMethods.setValue("createdOn", "");
            formMethods.setValue("createdBy", "");
            // formMethods.setValue('bankAttachments', '');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [euser]);

  useEffect(() => {
    const EditButton = document.querySelector(".editbutton");
    if (EditButton != null || EditButton != undefined) {
      if (runtimeParams.type === "Emp") {
        EditButton.hidden = true;
      } else {
        EditButton.hidden = false;
      }
    }
  }, [runtimeParams.type]);
  return form;
};

export default JSHook;
