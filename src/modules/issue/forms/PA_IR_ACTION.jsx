import { Row } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import JSHook from "./PA_IR_ACTION_JS";
import "../../../../src/assets/scss/profile.scss";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import { useState, useEffect } from "react";
import { getObjectInfo } from "../../admin/AdminService";
import { useTranslation } from "react-i18next";
import ISSUE_ALERT_MODAL from "./ISSUE_ALERT_MODAL";
let issueCuurentSTg = null;

const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const [startDateChange, setStartDateChange] = useState(
    formMethods.getValues("actionStartDate")
  );

  const [isAlertShown, setIsAlertshown] = useState(false);
  const [ismessageForAlert, setISMessageForAlert] = useState("");

  let changeTheAertModal = (messageForAlert) => {
    setISMessageForAlert(messageForAlert);
    toogleAertModal();
  };
  let toogleAertModal = () => {
    setIsAlertshown((prev) => !prev);
  };

  const { control, watch } = formMethods;

  const [action, SetAction] = useState();
  const { t } = useTranslation();

  form.actionStartDate.onChange(() => {
    setStartDateChange(formMethods.getValues("actionStartDate"));
  });

  useEffect(() => {
    if (
      formMethods.getValues("issueId") == null ||
      formMethods.getValues("issueId") == ""
    ) {
      formMethods.setValue("issueId", props.runtimeParams.ParentFormObjectId);
    }
    getObjectInfo(
      "getObjectInfo",
      formMethods.getValues("issueId"),
      "IR_ISSUE_REGISTRY",
      "issue_id"
    )
      .then((response) => {
        formMethods.setValue("issueOwner", response.data[0].managed_by_owner);
        formMethods.setValue("issueDueDate", response.data[0].issue_due_date);
        formMethods.setValue("issueTitle", response.data[0].issue_title);

        if (
          formMethods.getValues("actionId") == null ||
          formMethods.getValues("actionId") == ""
        ) {
          formMethods.setValue(
            "ownerOrganization",
            response.data[0].managed_by_bu
          );
          formMethods.setValue(
            "actionApprover",
            response.data[0].managed_by_owner
          );
        }

        SetTitle(response.data[0].issue_title);
        SetissueOwner(response.data[0].managed_by_owner);
        SetissueDueDate(response.data[0].issue_due_date);
        issueCuurentSTg = response.data[0].current_stage;

        if (action == null || action == undefined) {
          SetAction(formMetaData.actions);
        }
        if (issueCuurentSTg == "API") {
          formMethods.setValue("containment", true);
          if (formMethods.getValues("actionId") == "") {
            if (formMetaData.actions != null) {
              formMetaData.actions = formMetaData.actions.filter(
                (item) => item.action != "Draft"
              );
            }
          }
          if (
            formMethods.getValues("actionId") != "" ||
            formMethods.getValues("currentStage") == "INITIATE" ||
            formMethods.getValues("type") == 2
          ) {
            if (formMetaData.actions != null) {
              formMetaData.actions = formMetaData.actions.filter(
                (item) => item.action != "Draft"
              );
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    formMethods.setValue("type", runtimeParams.type);
  }, []);
  if (!formMethods.getValues("containment")) {
    const buttons = document.querySelectorAll(".modaldisbutton");
    buttons.forEach((button) => {
      const buttonChildren = button.textContent.trim();
      if (buttonChildren == "Initiate Action") {
        button.hidden = true;
      }
    });
  }

  const [Title, SetTitle] = useState();
  const [issueOwner, SetissueOwner] = useState();
  const [issueDueDate, SetissueDueDate] = useState();

  const [type, setType] = useState();
  const watchedType = watch("type");
  const watchedTypeone = watch("containment");
  formMetaData.form = JSHook(
    form,
    fields,
    formMethods,
    formMetaData,
    formValues,
    control,
    changeTheAertModal
  );

  if (
    formMethods.getValues("workflow") === null ||
    formMethods.getValues("workflow") === ""
  ) {
    formMethods.setValue("workflow", formMetaData.formmeta.workflowId);
  } else {
    formMethods.setValue("workflow", formMethods.getValues("workflow"));
  }

  let Disable;

  let formIds = formMetaData.formmeta.form_id;

  if (formMethods.getValues("actionId") != "") {
    Disable = "actionId";
  }

  let showButton = false;
  let showFields = false;

  let pathName = window.parent.location.href;
  const regex = /formService=([^&]+)/;

  if (pathName.match(regex) != null) {
    if (
      pathName.match(regex)[1] != "action" &&
      formMethods.getValues("actionId") != ""
    ) {
      showButton = true;
    }

    if (
      pathName.match(regex)[1] != "action" &&
      formMethods.getValues("actionId") == ""
    ) {
      showButton = false;
    }
  } else {
    showFields = true;
  }

  function changeActions(value) {
    if (formMethods.getValues("type") == 2) {
      if (value == true) {
        formMetaData.actions = action;
        const buttons = document.querySelectorAll(".modaldisbutton");
        buttons.forEach((button) => {
          const buttonChildren = button.textContent.trim();
          if (buttonChildren == "Initiate Action") {
            button.hidden = false;
          }
        });
      } else {
        formMetaData.actions = formMetaData.actions.filter(
          (item) => item.action != "Initiate Action"
        );
      }
    }
  }

  form.type.onChange(function (value) {
    if (issueCuurentSTg != "API") {
      if (value == 1) {
        if (action != null || action != undefined) {
          formMetaData.actions = action.filter(
            (item) => item.action != "Initiate Action"
          );
        }
        formMethods.setValue("containment", false);
      }
      setType(value);
    }
  });

  function formatDate(jsonDate) {
    if (jsonDate === undefined || jsonDate == "") return "";
    const date = new Date(jsonDate);

    const getYear = date.toLocaleDateString("default", {
      year: "numeric",
    });
    const getMonth = date.toLocaleDateString("default", {
      month: "2-digit",
    });
    const getDay = date.toLocaleDateString("default", { day: "2-digit" });
    const formattedDate = getDay + "-" + getMonth + "-" + getYear;

    return formattedDate;
  }
  return (
    <>
      <Section title={t("Details")}>
        {showFields == true && (
          <Row>
            <div className="col-md-4">
              <FormControl
                type="readonly"
                field_title="Issue Title"
                value={Title}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                type="readonly"
                field_title="Issue Owner"
                value={issueOwner}
              />
            </div>
            <div className="col-md-4">
              <FormControl
                type="readonly"
                field_title="Issue Due Date"
                value={formatDate(issueDueDate)}
              />
            </div>
          </Row>
        )}

        {formMethods.getValues("actionId") != "" && (
          <Row>
            <FormControl
              type="readonly"
              field_title="Issue Title"
              value={formMethods.getValues("issueTitle")}
              link={runtimeParams.modal ? false : true}
              service={"issueregistry"}
              id={formMethods.getValues("issueId")}
            />
          </Row>
        )}
        <Row>
          <div
            className={`${
              formMethods.getValues("actionId") == "" ? "" : "col-md-8"
            }`}
          >
            <FormControl
              control={control}
              name="actionTitle"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
          {formMethods.getValues("actionId") != "" && (
            <div className="col-md-4">
              <FormControl
                control={control}
                name="status"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          )}
        </Row>
        <Row>
          <FormControl
            control={control}
            name="description"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="type"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="actionPriority"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
        </Row>

        {formMethods.getValues("type") == 2 &&
          formMethods.getValues("currentStage") == "INITIATE" &&
          issueCuurentSTg != "API" && (
            <Row>
              <FormControl
                control={control}
                name="containment"
                formMetaData={formMetaData}
                formMethods={formMethods}
                onClick={(e) => {
                  changeActions(e.target.checked);
                }}
              />
            </Row>
          )}

        <Row>
          <div className="col-md-6">
            <FormControl
              control={control}
              name="actionStartDate"
              formMetaData={formMetaData}
              formMethods={formMethods}
              futureDate={true}
              ConditionalDate={
                formMethods.getValues("issueDueDate") != ""
                  ? new Date(formMethods.getValues("issueDueDate"))
                  : new Date()
              }
            />
          </div>

          <div className="col-md-6">
            <FormControl
              control={control}
              name="actionDueDate"
              formMetaData={formMetaData}
              formMethods={formMethods}
              futureDate={true}
              futureDateValue={startDateChange}
              ConditionalDate={
                formMethods.getValues("issueDueDate") != ""
                  ? new Date(formMethods.getValues("issueDueDate"))
                  : new Date()
              }
            />
          </div>
        </Row>

        {formMethods.getValues("actionId") != "" &&
          formMethods.getValues("noOfExtensions") != null && (
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  type="datepick"
                  name="origActionDueDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
              <div className="col-md-6">
                {" "}
                <label className="text-dark fw-medium form-label">
                  No of Extensions :
                </label>
                <br />{" "}
                <span style={{ color: "rgb(108, 117, 125)" }}>
                  {formMethods.getValues("noOfExtensions")}
                </span>
              </div>
            </Row>
          )}

        <Row>
          <div className="col-md-4">
            <FormControl
              control={control}
              name="actionBu"
              zIndex={true}
              isMulti={false}
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>
          <div className="col-md-4">
            <FormControl
              control={control}
              name="actionOwner"
              zIndex={true}
              formId={formIds}
              disableDrop={Disable}
              isMulti={false}
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </div>

          <div className="col-md-4">
            {issueOwner && (
              <FormControl
                control={control}
                name="actionApprover"
                formId={formIds}
                disableDrop={Disable}
                isMulti={false}
                zIndex={true}
                formMetaData={formMetaData}
                formMethods={formMethods}
                defaultvalue={issueOwner}
              />
            )}
          </div>
        </Row>
      </Section>
      {formMethods.getValues("currentStage") != "INITIATE" && (
        <Section title={t("Implementation")}>
          <Row>
            <FormControl
              control={control}
              name="actionWorkDone"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>
          <Row>
            <FormControl
              control={control}
              name="actionResults"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Row>

          <Row>
            <div className="col-md-6">
              <FormControl
                control={control}
                name="progressPercent"
                disableDrop={Disable}
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>
        </Section>
      )}
      <Section title={t("Additional Details")}>
        <Row>
          <FormControl
            control={control}
            name="actionAttachment"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Row>
      </Section>
      {formMethods.getValues("reasonForCancel") != null &&
        formMethods.getValues("actionId") != "" && (
          <Section title={t("Cancellation Details")}>
            <Row>
              <div className="col-md-6">
                <FormControl
                  control={control}
                  type="select"
                  name="reasonForCancel"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>

              <div className="col-md-6">
                <FormControl
                  control={control}
                  name="justificationForCancellation"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </div>
            </Row>
          </Section>
        )}

      {formMethods.getValues("actionId") != "" && showButton != true && (
        <AuditTrail
          formMetaData={formMetaData}
          formId={formMetaData.formmeta.form_id}
          formMethods={formMethods}
          objectId={formValues.actionId}
          enableAddComment={formValues.status == "Closed" ? false : true}
        />
      )}
      {isAlertShown && (
        <ISSUE_ALERT_MODAL
          isOpen={isAlertShown}
          onClose={toogleAertModal}
          message={ismessageForAlert}
        />
      )}
    </>
  );
};
export default FormLayout;
