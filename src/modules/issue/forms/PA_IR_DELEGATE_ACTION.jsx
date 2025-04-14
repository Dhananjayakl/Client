import {
  Form,
  Container,
  Col,
  Alert,
} from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  getObjectInfo,
} from "../../admin/AdminService";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
const FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    runtimeParams,
  } = props;

  let AuditFields = runtimeParams.AuditFields;

  const {
    control,
    formState: { errors, touched, isSubmitting },
  } = formMethods;

  // });
  const [Title, SetTitle] = useState();
  const [isdelegateUser, SetIsdelegateUser] = useState();
  useEffect(() => {
    getObjectInfo(
      "getObjectInfo",
      props.runtimeParams.ParentFormObjectId,
      "ACTION",
      "action_id"
    )
      .then((response) => {
        formMethods.setValue("objectId", response.data[0].action_id);
        formMethods.setValue("actionTitle", response.data[0].action_title);
        formMethods.setValue("status", "New");
        formMethods.setValue("actionOwner", response.data[0].action_owner);
        SetTitle(response.data[0].action_title);
        SetIsdelegateUser(response.data[0].d_delegate);
        getObjectInfo(
          "getObjectInfo",
          props.runtimeParams.ParentFormObjectId,
          "IR_DELEGATE_ACTION",
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

  const FormLink = () => {
    let navigate = useNavigate();
    const service = "action";
    let objectId = props.runtimeParams.ParentFormObjectId;

    return (
      <Form.Group>
        <Form.Label className="text-dark">Action Title:</Form.Label>
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
      <div className="d-flex flex-grow-1">
        <h4 style={{ fontSize: "15px" }}>{name}</h4>

        <h5 style={{ fontSize: "13px", paddingLeft: "5%" }}> {value}</h5>
      </div>
    );
  };

  if (isdelegateUser == null) {
    // runtimeParams.objectId=-1
    formMethods.setValue("action", 1);
  } else {
    runtimeParams.objectId = formMethods.getValues("objectId");
    formMethods.setValue("action", 2);
  }
  

  return (
    
      <Container className="justify-content-center  ">

        <div style={{ marginTop: "40px" }}>
          <div style={{ flexBasis: "1", width: "100%" }}>
            {" "}
            <FormLink></FormLink>
          </div>
        </div>

        {isdelegateUser == null && (
          <Col>
            <FormControl
              control={control}
              name="delegateUser"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        )}

        {isdelegateUser != null && (
          <div style={{ marginTop: "10px" }}>
            <ColumnName name={"Delegated User:"} value={isdelegateUser} />
          </div>
        )}

        <Col>
          <FormControl
            control={control}
            type="Textarea"
            name="comments"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>
        {formMethods.getValues("objectId") != "" && (
          <AuditFields
            formMetaData={formMetaData}
            formMethods={formMethods}
          ></AuditFields>
        )}
        
      </Container>
  );
};
export default FormLayout;
