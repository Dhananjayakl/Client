import { getServiceData } from "src/components/server/service";
import { useState, useEffect } from "react";
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
import JSHook from "./PA_EMAIL_TEMPLATE_JS";
import { getObjectData } from "../AdminService";

let FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields } = props;
  const {
    setError,
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touched, isSubmitting },
  } = formMethods;

  // formMetaData.form=JSHook(form,formMethods);
  //   formMetaData.form=JSHook(form,formMethods,fields);
  formMetaData.form = JSHook(form, formMethods, formMetaData);
  console.log("form form layout:", formMetaData);
  const [formIds, setformId] = useState("");
  const [formOptions, setFormOptions] = useState("");
  const [ModuleOptions, setModuleOptions] = useState();
  const [modId, setModId] = useState("");

  form.formId.onChange(function (value) {
    setformId(value);
    console.log("asasa", value);
  });
  form.moduleId.onChange(function (value) {
    setModId(value);
    console.log("Module Id", value);
  });
  useEffect(() => {
    getServiceData("getModuleInfo")
      .then((response) => {
        console.log("Module Response", response.data);
        setModuleOptions(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    if (modId !== "") {
      // debugger;
      getObjectData("getFormsByModule", modId)
        .then((response) => {
          console.log("getForms response", response.data);
          const mappedData = response.data.map((item) => ({
            formTitle: item.formName,
            formId: item.formId,
          }));
          const keyValuePairArray = mappedData.map((item) => ({
            key: item.formId,
            value: item.formTitle,
          }));
          setFormOptions(keyValuePairArray);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [modId]);
  // const filterExpression = `module_id=${modId}`;
  // const viewParams = {
  //   viewName: "pa_forms_v",
  //   pageNumber: 0,
  //   pageSize: 0,
  //   sortField: "",
  //   sortOrder: "",
  //   orderExpression: "",
  //   filterExpression: filterExpression
  // };

  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              // type="richtext"
              name="moduleId"
              // options={ModuleOptions}
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
          <div className="col-md-6">
            <FormControl
              control={control}
              // type="richtext"
              // type="select"
              name="formId"
              // options={formOptions}
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>
        <Row>
          <div className="col-md-6">
            {/* <FormControl
            control={control}
            // type="input"
            name="templateName"
            formMetaData={formMetaData}
            formMethods={formMethods}
          /> */}
            <FormControl
              control={control}
              name="templateName"
              // type="controlledObjectName"
              formMetaData={formMetaData}
              formMethods={formMethods}
              value={formMethods.watch("moduleId")}
            />
          </div>
          <div className="col-md-6">
            <FormControl
              control={control}
              // type="textarea"
              name="description"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>
        <Row></Row>
        <Row>
          <FormControl
            control={control}
            // type="input"
            name="subject"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            // type="richtext"
            name="templateContent"
            formId={formIds}
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
      </Container>
    </>
  );
};

export default FormLayout;
