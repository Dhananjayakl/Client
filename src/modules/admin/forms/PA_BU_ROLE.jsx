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
import { useState, useEffect } from "react";
//   import { WarnUserBeforeReloadOrExit } from "src/Warnuser";

let FormLayout = (props) => {
  let { formMethods, formMetaData, validationSchema, form, fields } = props;
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

    formState: { errors, touched, isSubmitting, isDirty },
  } = formMethods;
  // const formDirtyCheck = () => {
  //     return isDirty;
  //   }

  useEffect(() => {
    const updatedButton = document.querySelector(".my-2.disbutton");
    if (updatedButton) {
      updatedButton.textContent = "Create";
    }
  }, [form, formMethods, fields, formMetaData]);

  // my-2 close-btn
  // useEffect(() => {
  //     const updatedButton = document.querySelector('.my-2.close-btn');
  //     if (updatedButton) {
  //         updatedButton.textContent = '';
  //     }
  // }, [form, formMethods, fields, formMetaData]);

  return (
    <>
      {/* <WarnUserBeforeReloadOrExit formDirtyCheck={formDirtyCheck} /> */}

      <Col>
        <FormControl
          control={control}
          name="businessUnits"
          formMetaData={formMetaData}
          formMethods={formMethods}
          isMulti={true}
        />
      </Col>

      <Col>
        <FormControl
          control={control}
          name="roles"
          formMetaData={formMetaData}
          formMethods={formMethods}
          isMulti={true}
        />
      </Col>
    </>
  );
};
export default FormLayout;
