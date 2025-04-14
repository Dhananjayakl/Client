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
import fetchFormInfo from "../../../components/forms/reactformutils/FormRuntimeEngine";
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
  const [minmumDate,setMinmumDate]=useState();
  useEffect(() => {
    getObjectInfo(
      "getObjectInfo",
      props.runtimeParams.objectId,
      "IR_ISSUE_REGISTRY",
      "issue_id"
    )
      .then((response) => {
        formMethods.setValue("issueId", response.data[0].issue_id);
        formMethods.setValue("issueTitle", response.data[0].issue_title);
        SetTitle(response.data[0].issue_title);
        formMethods.setValue("issueOwner", response.data[0].managed_by_owner);
        //  SetissueOwner(response.data[0].d_managed_by_owner);
        formMethods.setValue(
          "originalIssueDueDate",
          response.data[0].issue_due_date
        );
        setMinmumDate(response.data[0].issue_due_date);
        formMethods.setValue("issueApprover", response.data[0].issue_approver);
        formMethods.setValue("managedByBU", response.data[0].managed_by_bu);
        // SetApprover(response.data[0].d_issue_approver);
        formMethods.setValue("status", "New");
      })
      .catch((err) => {
        console.log(err);
      });
    // }
  }, []);

  if (
    formMethods.getValues("objectId") == null ||
    formMethods.getValues("objectId") == ""
  ) {
    formMethods.setValue("action", 1);
    formMethods.setValue("status", "Reopen Issue");
  }
  return (
    <>
      <Container className="justify-content-center  ">
        <Col>
          <Row >
            <FormControl
              type="readonly"
              field_title="Issue Title"
              value={Title}
              link={true}
              service={"issueregistry"}
              id={formMethods.getValues("issueId")}
            />
          </Row>
        </Col>

        <Col>
          <FormControl
            control={control}
            name="issueOwner"
            zIndex={true}
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>
        <Col>
          <FormControl
            control={control}
            name="dueDate"
            // type="flatpick"
            modal={props?.modal?true:false}
            futureDateValue={minmumDate!=null?new Date(minmumDate):new Date()}
            formMetaData={formMetaData}
            formMethods={formMethods}
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
