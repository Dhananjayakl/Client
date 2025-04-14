import React, { useState, useEffect } from "react";
import { Button, Col } from "react-bootstrap";
import FormControl from "src/components/forms/reactformutils/FormControl";
import CloseButton from "./CloseButton";
import WindowPopup from "./WindowPopup";
import ErrorAlert from "./ErrorAlert";
import { ToastContainer, toast } from "react-toastify";
import Popup from "src/components/forms/reactformutils/elements/Popup";
import { isTemplateSpan } from "typescript";

let CommentsModal = ({
  formMetaData,
  formMethods,
  form,
  fields,
  formValues,
  callbackToParent,
  runtimeParams,
  submissionFlag,
  setSubmissionPopup,
  submissionPopup,
}) => {
  let [submissionAction, setSubmissionAction] = useState();
  useEffect(() => {
    if (submissionPopup != null) {
      setSubmissionAction(submissionPopup);
    }
  }, [submissionPopup]);
  const {
    control,
    formState: { errors, touched, isSubmitting, isDirty },
    watch,
  } = formMethods;
  const formObjectId =
    formMethods.getValues("objectId") == ""
      ? -1
      : formMethods.getValues("objectId");
  const formApi = formMetaData.formmeta.api_handler.replace(/[/]/, "");
  let commentSection = Object.keys(formMetaData.fields).map((key) => {
    if (formMetaData.fields[key].is_comment_section == true) {
      return formMetaData.fields[key];
    }

    // Perform operations on the key and value
  });
  commentSection = commentSection.filter((items) => items != undefined);
  let FilteredFields;
  console.log(submissionPopup, "sub123");

  useEffect(() => {
    if (submissionPopup) {
      FilteredFields = commentSection.map((items) => {
        const arrayRules = items.rules?.includes(",")
          ? items.rules.split(",")
          : [items.rules];
        if (arrayRules.includes(submissionPopup)) {
          console.log(arrayRules, "ar1");
          return items.field_name;
        }
      });
      FilteredFields = FilteredFields.filter((items) => items != undefined);
      console.log(FilteredFields, "f76");

      FilteredFields.forEach((items) => {
        const arrayMandate = formMetaData?.fields[items].is_mandate?.includes(
          ","
        )
          ? formMetaData.fields[items].is_mandate.split(",")
          : [formMetaData.fields[items].is_mandate];
        console.log(arrayMandate, "array mandate");

        if (
          formMetaData?.fields[items] &&
          arrayMandate.includes(submissionPopup)
        ) {
          formMetaData.fields[items].required = true;
        } else {
          formMetaData.fields[items].required = false;
        }
      });
      commentSection.forEach((items) => {
        if (!FilteredFields.includes(items.field_name)) {
          formMetaData.fields[items.field_name].required = false;
        }
      });
    }
  }, [formMetaData, submissionPopup, commentSection]);
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < commentSection.length - 1; i++) {
      if (
        commentSection[i].display_order > commentSection[i + 1].display_order
      ) {
        console.log(
          i,
          commentSection[i].display_order,
          "index current",
          i+1,
          commentSection[i + 1].display_order , "index current +1"
        );

        let temp = commentSection[i];
        commentSection[i] = commentSection[i + 1];
        commentSection[i + 1] = temp;
        swapped = true;
      }
    }
  } while (swapped);
  // commentSection.sort((a, b) => a.display_order - b.display_order);
  // for (let i = 0; i < commentSection.length - 1; i++) {
  //   console.log(commentSection.length - 1 - i,"i length",i,"j length");

  //   for (let j = 0; j < commentSection.length - 1 - i; j++) {
  //     if (commentSection[j].display_order > commentSection[j + 1].display_order) {
  //       const temp = commentSection[j];
  //       commentSection[j] = commentSection[j + 1];
  //       commentSection[j + 1] = temp;
  //     }
  //   }
  // }

  console.log(commentSection, "comments section1");
  console.log(submissionPopup, "subpop up");

  return (
    <div>
      {submissionPopup && (
        <Popup
          header={submissionPopup + " Comments"}
          content={
            <>
              {commentSection.map((items) => {
                const arrayRules = items.rules?.includes(",")
                  ? items.rules.split(",")
                  : [items.rules];
                console.log(
                  arrayRules,
                  items.field_name,
                  submissionPopup,
                  "ar2"
                );

                return (
                  arrayRules.includes(submissionPopup) && (
                    <Col key={items.field_name}>
                      <FormControl
                        control={control}
                        name={items.field_name}
                        formMetaData={formMetaData}
                        formMethods={formMethods}
                      />
                    </Col>
                  )
                );
              })}
            </>
          }
          formObjectId={formObjectId}
          formApi={formApi}
          form={form}
          // datahandle={props.datahandle}
          runtimeParams={runtimeParams}
          closePopup={setSubmissionPopup}
        />
      )}
    </div>
  );
};
export default CommentsModal;
