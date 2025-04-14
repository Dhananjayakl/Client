import { Container, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import React, { useState, useEffect } from "react";
import { getObjectInfo } from "../../admin/AdminService";

const FormLayout = (props) => {
  let { formMethods, formMetaData, form } = props;

  const {
    control,
    watch,
    formState: { errors, touched, isSubmitting },
  } = formMethods;

  const [Title, SetTitle] = useState();
  const [dueDateStart, setDueDateStart] = useState();
  const [dueDateEnd, setDueDateEnd] = useState();

  useEffect(() => {
    getObjectInfo(
      "getObjectInfo",
      props.runtimeParams.objectId
        ? props.runtimeParams.objectId
        : props.formValues.objectId,
      "IR_ACTION",
      "action_id"
    )
      .then((response) => {
        formMethods.setValue("objectId", response.data[0].action_id);
        formMethods.setValue("actionTitle", response.data[0].action_title);
        SetTitle(response.data[0].action_title);
        formMethods.setValue("actionOwner", {
          value: response.data[0].action_owner,
          label: response.data[0].d_action_owner,
        });
        setDueDateStart(response.data[0].action_due_date);
        setDueDateEnd(response.data[0].issue_due_date);

        formMethods.setValue(
          "originalActDueDate",
          response.data[0].action_due_date
        );
        formMethods.setValue("actionApprover", {
          value: response.data[0].action_approver,
          label: response.data[0].d_action_approver,
        });

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
  }

  form.onSubmit = function (actionName) {
    formMetaData.fields.comments.required = true;
    formMetaData.fields.comments.editable = true;

    if (actionName == "Submit") {
      return "skip";
    }
    return actionName;
  };
  return (
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
      <Col md={6}>
        <FormControl
          control={control}
          name="requestDueDate"
          formMetaData={formMetaData}
          formMethods={formMethods}
          futureDate={true}
          modal={props?.modal ? true : false}
          futureDateValue={dueDateStart}
          ConditionalDate={
            dueDateEnd != null ? new Date(dueDateEnd) : new Date()
          }
        />
      </Col>
      {formMethods.getValues("currentStage") == "INITIATE" && (
        <Col>
          <FormControl
            control={control}
            name="comments"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>
      )}

      {props.formValues.lastComment != null && (
        <FormControl
          type="readonly"
          field_title="Comments"
          value={props.formValues.lastComment}
        />
      )}
    </Container>
  );
};
export default FormLayout;
