import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import CloseButton from "./CloseButton";
import WindowPopup from "./WindowPopup";
import ErrorAlert from "./ErrorAlert";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
let BottomBar = (props) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const { t } = useTranslation("common");
  //console.log("BottomBar:", props);
  let {
    formMetaData,
    formMethods,
    form,
    runtimeParams,
    submitValue,
    refreshDataRef,
    ServerCall,
  } = props;
  //console.log(runtimeParams, "bottomRuntime");

  // console.log(runtimeParams.formService, "bottom form");
  // console.log(formMethods, "submitted methods");

  const errors = formMethods.formState.errors;
  //console.log("bcdbcb", errors);

  useEffect(() => {
    if (
      errors &&
      Object.keys(errors).length > 0 &&
      formMethods.formState.submitCount > 0
    ) {
      //console.log("error called here");

      setShowAlert(true);
      setAlertContent(formMethods.formState.errors);
    }
  }, [formMethods.formState.submitCount]);
  //console.log(alertContent, errors, "alert content");
  const handleAction = (action, idx) => {
    //console.log("handle action");
    if (form.onSubmit) {
      form.onSubmit(action.action, action.action_code);
    }
    formMethods.setValue("action", action.action_code, {
      shouldValidate: true,
      shouldTouch: true,
    });
  };
  const OnWorkFlowSubmission = async (data, action, idx) => {
    //console.log(data, action, idx, "work flow properties");

    try {
      console.log("inside the setter");
      // data.action = action.action_code;
      //console.log(data, "actionData");

      setShowAlert(false);
      // formMethods.setValue("action", action.action_code, {
      //   shouldValidate: true,
      //   shouldTouch: true,
      // });

      if (form.actionChange) form.actionChange(action.action_code);

      let resp;
      if (form.onSubmit) {
        resp = await form.onSubmit(action.action, action.action_code);
      }
      //console.log(resp, "pagani");

      // Await the form validations by trigger method
      const isValid = await formMethods.trigger();

      if (!isValid) {
        // Only setting showAlert if there are errors
        if (Object.keys(formMethods.formState.errors).length > 0) {
          setShowAlert(true);
        }
      } else {
        // console.log("in else");
        // console.log(props.subPopup, "roadster");

        if (props.subPopup) {
          // console.log("in else2");
          // console.log(resp, "resp1234");
          if (resp == false) {
            return;
          }
          if (resp === "skip" || resp == undefined) {
            runtimeParams.setLoadingFlag(true);
            runtimeParams.ServerCall(
              data,
              runtimeParams.formService,
              runtimeParams.objectId
            );
            // await runtimeParams.dataHandle(
            //   runtimeParams.objectId,
            //   runtimeParams.formService
            // );
          } else if (resp) {
            await props.subPopup(resp);
          } else {
            runtimeParams.setLoadingFlag(true);
            runtimeParams.ServerCall(
              data,
              runtimeParams.formService,
              runtimeParams.objectId
            );
          }
        } else {
          runtimeParams.setLoadingFlag(true);
          runtimeParams.ServerCall(
            data,
            runtimeParams.formService,
            runtimeParams.objectId
          );
          // await runtimeParams.dataHandle(
          //   runtimeParams.objectId,
          //   runtimeParams.formService
          // );
        }
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };
  const OnSubmission = (data) => {
    formMethods.trigger().then((isValid) => {
      if (!isValid) {
        setShowAlert(true);
      }
    });
    runtimeParams.setLoadingFlag(true);
    runtimeParams.ServerCall(
      data,
      runtimeParams.formService,
      runtimeParams.objectId
    );
  };
  //console.log(formMetaData.accessCode, formMetaData.actions, "bottomActions");

  return (
    <>
      <div className="text-center py-2 d-flex justify-content-end sticky-bottom shadow z-1">
        <div className="bg-white">
          {formMetaData.formmeta.accessCode == 1 &&
          formMetaData &&
          formMetaData.actions &&
          formMetaData.actions.length > 0
            ? formMetaData.actions.map((action, idx) => (
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  key={idx}
                  ref={runtimeParams.submitRef}
                  disabled={false}
                  style={{ marginInlineStart: "2px" }}
                  className={
                    runtimeParams?.modal ? "modaldisbutton" : "disbutton"
                  }
                  onClick={(e) => {
                    handleAction(action, idx); // Call handleAction as a function
                    if (!e.defaultPrevented) {
                      formMethods.handleSubmit((data) =>
                        OnWorkFlowSubmission(data, action, idx)
                      )(); // Trigger form submission
                    }
                  }}
                  id={form}
                >
                  {t(action.action)}
                </Button>
              ))
            : formMetaData.formmeta.accessCode == 1 &&
              (formMetaData.formmeta.workflow_code === null ||
                formMetaData.formmeta.workflow_code == "") && (
                <Button
                  type="button"
                  // id={125}
                  variant="primary"
                  ref={runtimeParams.submitRef}
                  size="lg"
                  disabled={false}
                  className={
                    runtimeParams?.modal ? "modaldisbutton" : "disbutton"
                  }
                  onClick={(e) => {
                    if (!e.defaultPrevented) {
                      formMethods.handleSubmit((data) => OnSubmission(data))();
                    }
                  }}
                  id={
                    runtimeParams?.modal
                      ? `modal-${runtimeParams.formService}`
                      : runtimeParams.formService
                  }
                >
                  {props.submitButtonTitle == undefined
                    ? "Submit"
                    : props.submitButtonTitle}
                </Button>
              )}
        </div>
        <CloseButton runtimeParams={runtimeParams}></CloseButton>
      </div>
      <div>
        {showAlert && (
          <WindowPopup
            show={showAlert}
            onHide={() => setShowAlert(false)}
            content={
              <ErrorAlert errors={alertContent} formMetaData={formMetaData} />
            }
            warning
            header={t("Following Fields are Mandatory")}
          />
        )}
      </div>
    </>
  );
};

export default BottomBar;
// export default function App() {
//   const { register, handleSubmit } = useForm()
//   const onSubmit = (data, e) => console.log(data, e)
//   const onError = (errors, e) => console.log(errors, e)

//   return (
//     <form onSubmit={handleSubmit(onSubmit, onError)}>
//       <input {...register("firstName")} />
//       <input {...register("lastName")} />
//       <button type="submit">Submit</button>
//     </form>
//   )
