import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";

import JSHook from "./PA_DATA_IMPORT_JS";
import { useState, useEffect } from "react";

import axios from "src/utils/AxiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { getObjectData } from "../AdminService";

import { useWatch } from "react-hook-form";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    objectId,
    runtimeParams,
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
    formState: { errors, touched, isSubmitting },
  } = formMethods;


  console.log("runtimeParams ", runtimeParams)
  const [Option, setOptions] = useState("");
  const [loading, setLoading] = useState(false);

  const [modulIds, setModuleId] = useState("");
  const [Forms, setForms] = useState("");

  formMetaData.form = JSHook(form, formMethods, formMetaData);

  form.formId.onChange(function (value) {
    setOptions(value);
  });

  form.moduleId.onChange(function (value) {
    setModuleId(value);
    formMethods.setValue("formId", "");
  });

  if (runtimeParams.upload === true) {
    formMethods.setValue("moduleId", runtimeParams.moduleId);
    formMethods.setValue("formId", runtimeParams.formIds);
    formMetaData.fields.moduleId.editable=false;
    formMetaData.fields.formId.editable=false;

  }
  // }
  let formId = formMethods.getValues("formId");
  let moduleId = formMethods.getValues("moduleId");


  console.log("responseresponseresponseresponseresponseresponse ", formId)
  console.log("responseresponseresponseresponseresponseresponse ", moduleId)

  useEffect(() => {
    // debugger;
    if (moduleId !== "") {
      getObjectData("getFormsByModule", moduleId)
        .then((response) => {



          const mappedData = response.data.map((item) => ({
            formTitle: item.formTitle,
            formId: item.formId,
          }));

          const keyValuePairArray = mappedData.map((item) => ({
            key: item.formId,
            value: item.formTitle,
          }));

          const formTitle = keyValuePairArray.find(
            (item) => item.key === formId
          )?.value;
          setForms(formTitle);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [moduleId, formId]);

  const handleDownloadExcel = async () => {

    console.log("responseresponseresponseresponseresponseresponse ", formId)

    try {
      setLoading(true);
      const response = await axios.get(`/excel/generate-excel/${formId}`, {
        responseType: "blob",
      });

      const href = URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = href;

      link.setAttribute("download", `${Forms}.xlsx`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(href);

      const inputField = document.getElementById("inputGroupFile");
      if (inputField) {
        inputField.value = "";
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container className="justify-content-center text-start ">
        <Col>
          <FormControl
            control={control}
            name="moduleId"
            formMetaData={formMetaData}
            formMethods={formMethods}

            // setData={formService !== undefined ? true : false}
          />
        </Col>

        <Col>
          <FormControl
            control={control}
            name="formId"
            formMetaData={formMetaData}
            formMethods={formMethods}
            setData={true}
            // setData={formService !== undefined ? true : false}
          />
        </Col>
        <Col>
          <FormControl
            control={control}
            type="singleattach"
            name="template"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>
        <Col>
          <FormControl
            control={control}
            type="multiattach"
            name="uploads"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>

        {formMethods.getValues("formId") !== "" ? (
          <Col>
            <Button
              variant="primary"
              onClick={handleDownloadExcel}
              disabled={loading}
            >
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{ marginRight: "5px" }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCloudDownloadAlt}
                  style={{ marginRight: "5px" }}
                />
              )}
              {loading ? "Downloading..." : "Download Excel"}
            </Button>
          </Col>
        ) : (
          ""
        )}
        {/* )} */}
      </Container>
    </>
  );
};

export default FormLayout;
