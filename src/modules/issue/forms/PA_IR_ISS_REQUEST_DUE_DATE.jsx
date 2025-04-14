import {
  
  Container,
  Row,
  Col,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import React, { useState } from "react";
import JSHook from "./PA_IR_ISS_REQUEST_DUE_DATE_JS";
import { useEffect } from "react";
import {
  getObjectInfo,
} from "../../admin/AdminService";
import "/src/assets/scss/profile.scss";

const FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    form,
    fields,
    runtimeParams,
    formValues,
  } = props;

  let AuditFields = runtimeParams.AuditFields;
  const {
    control,
    formState: { errors, touched, isSubmitting },
  } = formMethods;
  let [minmumDate,setMinmumDate]=useState(null);
  const [title,SetTitle]=useState(null);
  useEffect(() => {
    getObjectInfo(
      "getObjectInfo",
      props.runtimeParams.objectId
        ? props.runtimeParams.objectId
        : props.formValues.objectId,
      "IR_ISSUE_REGISTRY",
      "issue_id"
    )
      .then((response) => {
        formMethods.setValue("issueTitle", response.data[0].issue_title);
        SetTitle(response.data[0].issue_title);
        formMethods.setValue("issueOwner", response.data[0].managed_by_owner);
        formMethods.setValue(
          "originalIssueDueDate",
          response.data[0].issue_due_date
        );
        setMinmumDate(response.data[0].issue_due_date);
        formMethods.setValue("issueApprover", response.data[0].approver);
        formMethods.setValue("status", "New");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (
    formMethods.getValues("objectId") == null ||
    formMethods.getValues("objectId") == ""
  ) {
    formMethods.setValue("action", 1);
    formMethods.setValue("currentStage", "INITIATE");
    formMethods.setValue("objectId", props.runtimeParams.objectId);
  }
  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formMetaData,
    formValues
  );
  return (
    
      <Container className="justify-content-center  ">
        <Row >
          <FormControl
            type="readonly"
            field_title="Issue Title"
            value={title}
            link={true}
            service={"issueregistry"}
            id={formMethods.getValues("objectId")}
          />
        </Row>
        <Col  md={6}>
          <FormControl
            control={control}
            name="requestDueDate"
            modal={props?.modal?true:false}
            formMetaData={formMetaData}
            formMethods={formMethods}
            futureDate={true}
            futureDateValue={minmumDate!=null?new Date(minmumDate):new Date()}
          />
        </Col>
        {formMethods.getValues("currentStage") == "INITIATE" &&
         <Col >
          <FormControl
            control={control}
            name="comments"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>}

        {props.formValues.lastComment != null && (
          <FormControl
            type="readonly"
            field_title="Comments"
            value={props.formValues.lastComment}
          />
        )}

        {formMethods.getValues("currentStage") != "INITIATE" && (
          <AuditFields
            formMetaData={formMetaData}
            formMethods={formMethods}
          ></AuditFields>
        )}
      </Container>
  );
};
export default FormLayout;
