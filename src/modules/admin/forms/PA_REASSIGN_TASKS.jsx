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
import { useEffect } from "react";
//   import { WarnUserBeforeReloadOrExit } from "src/Warnuser";
import { getviewData } from "src/modules/admin/AdminService";
import { useState } from "react";
import JSHook from "./PA_REASSIGN_TASKS_JS";

let FormLayout = (props) => {
  const [showAlert, setShowAlert] = useState(false);
  const [newAssignee, setNewAssignee] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
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
    fieldTitles,

    formState: { errors, touched, isSubmitting, isDirty },
  } = formMethods;

  const handleNewAssignee = (value) => {
    setNewAssignee(value?.value);
  };

  formMetaData.form = JSHook(
    form,
    formMethods,
    fields,
    runtimeParams,
    formMetaData,
    showAlert,
    handleNewAssignee
  );

  useEffect(() => {
    const Viewdata = {
      viewName: "pa_reassign_v",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: `(record_id=${runtimeParams.ParentFormObjectId})`,
    };

    getviewData(Viewdata)
      .then((response) => {
        const responseData = response.data;
        if (responseData.data.length > 0) {
          formMethods.setValue("formId", {
            label: responseData.data[0].d_form_name,
            value: responseData.data[0].form_id,
          });
          formMethods.setValue("currentUsers", {
            label: responseData.data[0].d_user_name,
            value: responseData.data[0].user_id,
          });
          formMethods.setValue("taskId", responseData.data[0].task_id);
          formMethods.setValue("moduleId", {
            label: responseData.data[0].d_module_name,
            value: responseData.data[0].module_id,
          });
          setCurrentUser(responseData.data[0].user_id);
          setShowAlert(newAssignee === responseData.data[0].user_id);
        } else {
          formMethods.setValue("formId", "");
          formMethods.setValue("currentUsers", "");
          formMethods.setValue("taskId", "");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [runtimeParams.ParentFormObjectId, newAssignee]);
  return (
    <>
      <Col>
        <FormControl
          control={control}
          name="moduleId"
          formMetaData={formMetaData}
          formMethods={formMethods}
          setData={true}
          disabled
        />
      </Col>
      <Col>
        <FormControl
          control={control}
          name="formId"
          formMetaData={formMetaData}
          formMethods={formMethods}
          setData={true}
          disabled
        />
      </Col>

      <Col>
        <FormControl
          control={control}
          name="currentUsers"
          formMetaData={formMetaData}
          formMethods={formMethods}
          setData={true}
          disabled
        />
      </Col>

      <Col>
        <FormControl
          control={control}
          name="businessRolePair"
          formMetaData={formMetaData}
          formMethods={formMethods}
          FieldValue={true}
          // disabled
        />
      </Col>
      <Col>
        <FormControl
          control={control}
          name="newAssigner"
          // type='select'
          formMetaData={formMetaData}
          formMethods={formMethods}
          FieldValue={true}

          // isMulti={true}
          // disabled
        />
      </Col>
      <Alert
        show={showAlert && newAssignee === currentUser}
        variant="danger"
        className="text-danger"
      >
        Current Users and New Assigner cannot be the same.
      </Alert>
      <Col>
        <FormControl
          control={control}
          name="assignText"
          formMetaData={formMetaData}
          formMethods={formMethods}
          FieldValue={true}
        />
      </Col>
      <Col>
        <FormControl
          control={control}
          name="ownerShip"
          formMetaData={formMetaData}
          formMethods={formMethods}
        />
      </Col>
    </>
  );
};
export default FormLayout;
