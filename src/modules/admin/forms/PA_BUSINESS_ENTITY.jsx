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
import { useState } from "react";
import JSHook from "../forms/PA_BUSINESS_ENTITY";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    formValues,
    validationSchema,
    form,
    callbackToParent,
    runtimeParams,
    fields,
  } = props;

  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formMetaData,
    formValues,
    runtimeParams
  );

  console.log(runtimeParams, "paramssssssss");
  if (runtimeParams?.parentEntityName) {
    formMethods.setValue("parentEntityName", runtimeParams?.parentEntityName);
    formMetaData.fields.parentEntityName.editable = false;
  } else {
    formMetaData.fields.parentEntityName.editable = true;
  }
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

    formState: { errors, touched, isSubmitting },
  } = formMethods;

  let formIds = formMetaData.formmeta.form_id;
  formMethods.setValue("active", true);
  let SetArrays = {};
  return (
    <>
      <Col>
        <FormControl
          control={control}
          name="businessEntityName"
          formMetaData={formMetaData}
          formMethods={formMethods}
          others
        />
      </Col>

      <Col>
        <FormControl
          control={control}
          name="parentEntityName"
          formMetaData={formMetaData}
          formMethods={formMethods}
        />
      </Col>

      <Col>
        <FormControl
          control={control}
          name="description"
          formMetaData={formMetaData}
          formMethods={formMethods}
        />
      </Col>

      <Col>
        <FormControl
          control={control}
          name="type"
          formMetaData={formMetaData}
          formMethods={formMethods}
        />
      </Col>

      <Col>
        <FormControl
          control={control}
          name="active"
          formMetaData={formMetaData}
          formMethods={formMethods}
        />
      </Col>
      {/* <Col>
        <FormControl
          control={control}
          name="users"
          formId={formIds}
          formMetaData={formMetaData}
          formMethods={formMethods}
          isMulti={true}
          // onSelectCnage={value => {
          //     // SetArrays = [];
          //     for (let i = 0; i < value.length; i++) {
          //         SetArrays.push(value[i].value)
          //     }
          //     console.log("SetArrays", SetArrays)
          //     // console.log("stringify", {})
          //     formMethods.setValue('users', SetArrays)

          // }}
        />
      </Col> */}
      {/* <div className="text-center mt-3">
                {

                    (formMetaData &&
                        formMetaData.actions &&
                        formMetaData.actions.length > 0 ? (

                        formMetaData.actions.map((action, idx) => (


                            <Button
                                // type={"submit"}

                                type="submit"
                                variant="primary"
                                size="lg"
                                className="mx-1"
                                onClick={() => {
                                    formMethods.setValue("action", action.action_code);

                                }
                                }
                            >
                                {action.action}
                            </Button>
                        ))
                    ) : (
                        <Button type="submit" size="lg" variant="primary" >
                            Submit
                        </Button>
                    ))
                }
                <Button
                    // type="submit"
                    onClick={() => navigate("/pages/tasks")}
                    //   onClick={showToastMessage}
                    size="lg"
                    variant="primary" style={{ marginLeft: '10px' }}>Close</Button>
            </div> */}
    </>
  );
};
export default FormLayout;
