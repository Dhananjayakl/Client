import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { useEffect, useState } from "react";
import JSHook from "./PA_BU_ROLE_USER_JS";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    formValues,
  } = props;
  const {
    setError,
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    setValue,
    watch,
    fieldTitles,

    formState: { errors, touched, isSubmitting },
  } = formMethods;
  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    formMetaData,
    formValues
  );

  useEffect(() => {
    const updatedButton = document.querySelector(".my-2.disbutton");
    if (updatedButton) {
      updatedButton.textContent = "Update";
    }
  }, [form, formMethods, fields, formMetaData, formValues]);

  return (
    <>
      <Col>
        <FormControl
          control={control}
          type="input"
          name="businessUnitName"
          formMetaData={formMetaData}
          formMethods={formMethods}
          // isMulti={true}
        />
      </Col>

      <Col>
        <FormControl
          control={control}
          name="roleName"
          type="input"
          formMetaData={formMetaData}
          formMethods={formMethods}
          // isMulti={true}
        />
      </Col>
      <Col>
        <FormControl
          control={control}
          name="users"
          formMetaData={formMetaData}
          formMethods={formMethods}
          isMulti={true}
        />
      </Col>
    </>
  );
};
export default FormLayout;
