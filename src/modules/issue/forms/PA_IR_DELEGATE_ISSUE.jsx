import {
  Form,
  Container,
  Row,
  Alert,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import React, { useState,useEffect } from "react";
import {
  getObjectInfo,
} from "../../admin/AdminService";
import {
  useNavigate,
} from "react-router-dom";

const FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    form,
    fields,
    runtimeParams,
  } = props;

  let AuditFields = runtimeParams.AuditFields;

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

  const [isdelegate, SetIsdelegate] = useState();
  const [isdelegateUser, SetIsdelegateUser] = useState();
  let navigate = useNavigate();

  formMethods.setValue("objectId", props.runtimeParams.objectId);
  useEffect(() => {

    getObjectInfo(
      "getObjectInfo",
      props.runtimeParams.objectId,
      "IR_ISSUE_REGISTRY",
      "issue_id"
    )
      .then((response) => {
        formMethods.setValue("issueTitle", response.data[0].issue_title);
        SetTitle(response.data[0].issue_title);
        formMethods.setValue(
          "ownerOrganization",
          response.data[0].managed_by_bu
        );
        formMethods.setValue("issueOwner", response.data[0].managed_by_owner);
        SetIsdelegateUser(response.data[0].d_delegate);
        SetIsdelegate(response.data[0].delegate_object_id);
        getObjectInfo(
          "getObjectInfo",
          props.runtimeParams.objectId,
          "DELEGATE_ISSUE",
          "object_id"
        )
          .then((response) => {
            formMethods.setValue("createdBy", response.data[0].created_by);
            formMethods.setValue("createdOn", response.data[0].created_on);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  useEffect(() => {
    // const updatedButton = document.querySelector("modaldisbutton");
    const delegatebutton = document.getElementById("modal-delegateissue");
    // console.log(formMetaData,"delegationsssssssss")
    if (delegatebutton) {
      delegatebutton.textContent = isdelegate?"Remove Delegation":"Delegate Issue";
      // delegatebutton.style.borderRadius = "30px";
    }
    // if (skipButton) {
    //   skipButton.textContent = "Skip";
    //   skipButton.style.borderRadius = "30px";
    // }
  }, [form, formMethods, fields, formMetaData,isdelegate]);

  const FormLink = () => {
    let navigate = useNavigate();
    const service = "issueregistry";
    let objectId = props.runtimeParams.objectId;

    return (
      <Form.Group>
        <Form.Label className="text-dark">Issue Title:</Form.Label>
        <div>
          <Alert.Link
            onClick={() =>
              navigate(
                `/form/runtime?formService=${service}&objectId=${objectId}`
              )
            }
            target="_blank"
          >
            {Title}
          </Alert.Link>
        </div>
      </Form.Group>
    );
  };

  const ColumnName = ({ name, value }) => {
    return (
      <Form.Group>
        <Form.Label className="text-dark">{name}</Form.Label>

        <Form.Text className="text-dark">
          <font size="-1"> {value}</font>
        </Form.Text>
      </Form.Group>
    );
  };

  if (isdelegate == null) {
    formMethods.setValue("action", 1);
  } else {
    runtimeParams.objectId = formMethods.getValues("objectId");
    formMethods.setValue("action", 2);
  }

  return (
    <>
      <Container className="justify-content-center  ">
        <div style={{ flexBasis: "1", width: "100%" }}>
          {" "}
          <FormLink></FormLink>
        </div>

        {isdelegate == null && (
          <Row>
            <FormControl
              control={control}
              name="delegateUser"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
        )}

        {isdelegate != null && (
          <div style={{ marginTop: "10px" }}>
            <ColumnName name={"Delegated User:"} value={isdelegateUser} />
          </div>
        )}

        <Row>
          <FormControl
            control={control}
            name="comments"
            type="textarea"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>

        {/* <BottomBar
          formMetaData={formMetaData}
          formMethods={formMethods}
          // dataHandle={props.dataHandle}
          form={form}
          runtimeParams={runtimeParams}
          // subPopup={setSubmissionPopup}
          submitButtonTitle={
            isdelegate == null ? "Delegate Issue" : "Remove Delegation"
          }
        /> */}
      </Container>
    </>
  );
};
export default FormLayout;
