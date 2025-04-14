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
import React, { useState } from "react";
import fetchFormInfo from "src/components/forms/reactformutils/FormRuntimeEngine";
import { useEffect } from "react";
import {
  createObject,
  getObjectData,
  updateObjectData,
  getObjectInfo,
} from "../../admin/AdminService";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import BottomBar from "src/components/forms/reactformutils/elements/BottomBar";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    formValues,
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

  const [Title, SetTitle] = useState();
  const [issueDueDate, SetIssueDueDate] = useState();
  const [actionStartDate,setActionStartDate]=useState();

  useEffect(() => {
    getObjectInfo(
      "getObjectInfo",
      props.runtimeParams.objectId,
      "IR_ACTION",
      "action_id"
    )
      .then((response) => {
       formMethods.setValue("actionId", response.data[0].action_id);
        SetIssueDueDate(response.data[0].issue_due_date);
        formMethods.setValue("businessUnit", response.data[0].action_bu);

        SetTitle(response.data[0].action_title);
        formMethods.setValue("status", "New");
        setActionStartDate(response?.data[0]?.action_start_date);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <Container className="justify-content-center  ">
        <Col>
          <FormControl
              type="readonly"
              field_title="Action Title :"
              value={Title}
              link={true}
              service={"action"}
              id={props.runtimeParams.objectId}
            />
        </Col>

        <Col>
          <FormControl
            control={control}
            name="actionOwner"
            zIndex={true}
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>
        <Col>
          <FormControl
            control={control}
            name="actionDueDate"
            // type="flatpick"
            modal={props?.modal?true:false}
            formMetaData={formMetaData}
            formMethods={formMethods}
            futureDateValue={actionStartDate}
            ConditionalDate={
              issueDueDate != undefined ? new Date(issueDueDate) : new Date()
            }
            futureDate={true}
          />
        </Col>

        <Col>
          <FormControl
            control={control}
            name="comments"
            type="textarea"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>

        {/* <BottomBar
          formMetaData={formMetaData}
          formMethods={formMethods}
          // dataHandle={props.dataHandle}
          form={form}
          runtimeParams={runtimeParams}
          // subPopup={setSubmissionPopup}
          // submitButtonTitle={undefined}
        /> */}
      </Container>
    </>
  );
};
export default FormLayout;
