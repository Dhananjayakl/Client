import { getObjectData } from "src/modules/employee/EmployeeService";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { getObjectInfo } from "src/modules/admin/AdminService";

let JSHook = (
  form,
  formMethods,
  fields,
  formMetaData,
  formValues,
  callbackToParent,
  runtimeParams
) => {
  const [value1, setvalue] = useState("");
  const [maritalStatus, setmaritalStatus] = useState("");

  fields.marriageDate.visible = false;
  form.maritalStatus.onChange(function (value) {
    setmaritalStatus(value);
  });

  form.dateOfBirth.onChange(function (value) {
    formMethods.setValue("marriageDate", "");
  });

  const getMaritalvalue = formMethods.getValues("maritalStatus");
  // |(getMaritalvalue==1)||(getMaritalvalue==3)||(getMaritalvalue==4)|(getMaritalvalue==2)
  if (maritalStatus == 1 || maritalStatus == 3 || maritalStatus == 4) {
    fields.marriageDate.visible = true;
    fields.marriageDate.required = true;
  }
  if (
    maritalStatus == 2 ||
    maritalStatus == "Select an option" ||
    getMaritalvalue == 2
  ) {
    fields.marriageDate.visible = false;
    fields.marriageDate.required = false;
    formMethods.setValue("marriageDate", undefined);
  }
  //  if((maritalStatus=='')){
  //   fields.marriageDate.visible=false;
  //   fields.marriageDate.required=false;
  //  }

  useEffect(() => {
    if (getMaritalvalue == 1 || getMaritalvalue == 3 || getMaritalvalue == 4) {
      formMetaData.fields.marriageDate.visible = true;
      formMetaData.fields.marriageDate.required = true;
    }
  }, [getMaritalvalue]);

  formMetaData.fields.emloyeeId.editable = false;
  formMetaData.fields.firstName.editable = false;
  formMetaData.fields.middleName.editable = false;
  formMetaData.fields.lastName.editable = false;

  form.userId.onChange(function (value) {
    setvalue(value);
  });

  if (formValues.objectId != null) {
    formMetaData.fields.userId.editable = false;
    if (formMethods.getValues("marriageDate") != null) {
      fields.marriageDate.visible = true;
      fields.marriageDate.required = true;
    } else if (
      maritalStatus == 2 ||
      maritalStatus == "Select an option" ||
      getMaritalvalue == 2
    ) {
      fields.marriageDate.visible = false;
      fields.marriageDate.required = false;
      formMethods.setValue("marriageDate", "");
    }
  }

  if (formValues.objectId === undefined) {
    formMethods.setValue("objectId", value1);
    useEffect(() => {
      if (value1 !== "") {
        getObjectInfo(
          "getObjectInfo",
          value1,
          "EM_PERSONAL_DETAILS",
          "object_id"
        )
          .then((response) => {
            const filedData = response.data[0];
            if (response.data && response.data.length > 0) {
              formMethods.setValue(
                "dateOfBirth",
                response.data[0].date_of_birth
              );
              formMethods.setValue("bloodGroup", response.data[0].blood_group);
              formMethods.setValue("birthPlace", response.data[0].birth_place);
              formMethods.setValue("domicile", response.data[0].domicile);
              formMethods.setValue("citizenship", response.data[0].citizenship);
              formMethods.setValue("religion", response.data[0].religion);
              formMethods.setValue(
                "maritalStatus",
                response.data[0].marital_status
              );
              formMethods.setValue(
                "marriageDate",
                response.data[0].marriage_date
              );
              formMethods.setValue("comments", response.data[0].comments);
              formMethods.setValue("objectId", response.data[0].object_id);
              formMethods.setValue("createdBy", response.data[0].created_by);
              formMethods.setValue("createdOn", response.data[0].created_on);
              formMethods.setValue("firstName", response.data[0].first_name);
            } else {
              formMethods.setValue("dateOfBirth", "");
              // formMethods.setValue('dateOfJoin', new Date(''));
              formMethods.setValue("bloodGroup", "");
              formMethods.setValue("birthPlace", "");
              formMethods.setValue("domicile", "");
              formMethods.setValue("citizenship", "");
              formMethods.setValue("religion", "");
              formMethods.setValue("maritalStatus", "");
              formMethods.setValue("marriageDate", "");
              formMethods.setValue("comments", "");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      // })
      if (value1 !== "") {
        getObjectInfo("getObjectInfo", value1, "USERS", "USER_ID")
          .then((response) => {
            if (response.data && response.data.length > 0) {
              formMethods.setValue("emloyeeId", response.data[0].employee_id);
              formMethods.setValue("firstName", response.data[0].first_name);
              formMethods.setValue("middleName", response.data[0].middle_name);
              formMethods.setValue("lastName", response.data[0].last_name);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, [value1]);
  }

  if (runtimeParams.type === "Emp") {
    let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
      .data[0].user_id;
    formMethods.setValue("objectId", userId);
    formMethods.setValue("userId", userId);

    formMetaData.fields.userId.editable = false;
    getObjectInfo("getObjectInfo", userId, "USERS", "USER_ID")
      .then((response) => {
        if (response.data && response.data.length > 0) {
          formMethods.setValue("emloyeeId", response.data[0].employee_id);
          formMethods.setValue("firstName", response.data[0].first_name);
          formMethods.setValue("middleName", response.data[0].middle_name);
          formMethods.setValue("lastName", response.data[0].last_name);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    if (formValues.objectId != null) {
      formMetaData.fields.domicile.editable = false;
      formMetaData.fields.citizenship.editable = false;
      formMetaData.fields.religion.editable = false;
      formMetaData.fields.bloodGroup.editable = false;
      formMetaData.fields.dateOfBirth.editable = false;
      formMetaData.fields.dateOfJoin.editable = false;
      formMetaData.fields.birthPlace.editable = false;
      formMetaData.fields.gender.editable = false;
    }
  }
  if (formValues.objectId === undefined && !(runtimeParams.type === "Emp")) {
    formMetaData.fields.userId.editable = true;
  }

  useEffect(() => {
    const validationSchema = Yup.object({
      userId: Yup.number().typeError("Employee Name is Required"),
      dateOfBirth: Yup.string()
        .required("Date of Birth is Required")
        .test(
          "is-future-date",
          "Date of Birth must be less than a future date",
          function (value) {
            const dateOfBirth = new Date(value);
            const currentDate = new Date();
            return dateOfBirth < currentDate;
          }
        ),

      // designation: Yup.string().required("Required"),
      // deparatment: Yup.string().required("Required"),
      birthPlace: Yup.string().required("Place of Birth is Required"),
      domicile: Yup.string().required("Domicile is Required"),
      citizenship: Yup.string().required("Citizenship is Required"),
      // religion: Yup.number().required("Religion is Required"),
      maritalStatus: Yup.string().required("Marital Status is Required"),

      bloodGroup: Yup.string().required("Blood Group is Required"),
      // comments: Yup.string().required("Comments is Required"),
      // gender: Yup.string().required("Gender is required"),
      marriageDate:
        formMetaData.fields.marriageDate.visible === true
          ? Yup.string()
              .required("Marriage Date is Required")
              .test(
                "is-after-date-of-joined",
                "Marriage Date must be greater than Date of Birth",
                function (value) {
                  const dateOfBirth = this.resolve(Yup.ref("dateOfBirth"));
                  return !dateOfBirth || !value || value > dateOfBirth;
                }
              )
              .test(
                "not-equal-to-date-of-join",
                "Marriage Date must not be equal to Date of Joining",
                function (value) {
                  const dateOfJoin = this.resolve(Yup.ref("dateOfJoin"));
                  return !dateOfJoin || value !== dateOfJoin;
                }
              )
              .test(
                "not-today-or-future-date",
                "Marriage Date must not be today or a future date",
                function (value) {
                  const currentDate = new Date();
                  const selectedDate = new Date(value);
                  currentDate.setHours(0, 0, 0, 0);
                  selectedDate.setHours(0, 0, 0, 0);
                  return selectedDate <= currentDate;
                }
              )
          : Yup.string(),
    });

    callbackToParent(validationSchema);
  }, [formMetaData.fields.marriageDate.visible]);

  form.birthPlace.onChange(function (value) {
    let birthPlace = value.replace(/[^a-zA-Z\s,]+/g, "");
    formMethods.setValue("birthPlace", birthPlace);
  });

  return form;
};

export default JSHook;
