import { useState, useEffect, useRef } from "react";
import { getRegionData } from "../VendorFormservice";
import { useWatch } from "react-hook-form";
import { getviewData } from "src/modules/businessresilience/BRService";
import { keys } from "regenerator-runtime";
import { validateResponses } from "../utils/VendorUtils";
let formMetaFields = [];

const JSHook = (
  form,
  formMethods,
  formMetaData,
  formValues,
  QSTappend,
  VDDappend,
  VDDremove,
  VDDFields,
  control,
  setSelectedVendors,
  VendorDocHelpers,
  VendorActHelpers,
  QSTFields,
  setIsModalOpen
) => {
  let questionId =
    formMetaData.configurationFormMetaData.preliminary_evaluation_checklist;
  const [InherentRating, setInherentRating] = useState("");
  const [dueDiligenceRating, setDueDiligenceRating] = useState("");

  const handleSubmit = async (actionName) => {
    try {
      const productServiceFields = formMetaData.fields;

      const isValid = validateResponses(QSTFields, formMethods);
      console.log(isValid, "validddd");

      let requiredProductServiceFields = Object.values(productServiceFields)
        .filter((field) => field.required && field.field_name !== "response")
        .map((field) => field.field_name);

      console.log(requiredProductServiceFields, "Required Fields");

      let checkMainForm = true;

      if (requiredProductServiceFields.length > 0) {
        for (let element of requiredProductServiceFields) {
          let fieldValue = formMethods.getValues(element);
          if (
            fieldValue == null ||
            fieldValue === "" ||
            fieldValue === undefined
          ) {
            checkMainForm = false;
            break;
          }
        }
      }

      if (checkMainForm && !isValid) {
        setIsModalOpen(true);
        return false;
      }

      setIsModalOpen(false);
      return actionName;
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      return false;
    }
  };

  useEffect(() => {
    if (formValues.objectId === undefined) {
      getRegionData("getRegionData", questionId, "SM_QUESTIONNAIRE")
        .then((response) => {
          console.log(response.data, "preliminary info data");
          if (response.data.QST && response.data.QST.length > 0) {
            response.data.QST.forEach((rowData) => {
              // QSTappend({
              //   questionId: "",
              //   questionText: rowData.qst_question,
              //   score: rowData.qst_question_score,
              //   rating: rowData.qst_rating_scale,
              //   sqoId: rowData.qst_code,
              // });
            });
          }
          console.log(response.data, "preliminaryScore response");

          if (response.data.OPT.length > 0) {
            const scores = response.data.OPT.map((item) => item.opt_score);

            const totalScore = scores.reduce((acc, score) => acc + score, 0);
            const averageScore = totalScore / scores.length;
            const roundedScore =
              averageScore % 1 < 0.5
                ? Math.floor(averageScore)
                : Math.ceil(averageScore);

            // formMethods.setValue("preliminaryScore", roundedScore);

            let preliminaryRating;
            if (averageScore >= 0 && averageScore <= 4.9) {
              preliminaryRating = "Low";
            } else if (averageScore === 5) {
              preliminaryRating = "Medium";
            } else if (averageScore > 5 && averageScore <= 20) {
              preliminaryRating = "High";
            }

            // formMethods.setValue("preliminaryRating", preliminaryRating);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [questionId, formValues.objectId, QSTappend, formMethods]);

  form.onLoad = (props) => {};

  const [field, setField] = useState("");
  useEffect(() => {
    if (Array.isArray()) {
      VDDFields?.map((titem, vdd) => {
        let VDDRecord = `VDD.${vdd}`;
        setField(`${VDDRecord}.dueDiligence`);
      });
    }

    console.log(VDDFields, "vendor details added in the form");
  }, [VDDFields]);

  let tstResult = {
    key: useWatch({
      control: control,
      name: field,
    }),
    value: field,
  };

  let tstName = useWatch({
    control: control,
    name: "VDD",
  });

  console.log(tstName, "test names in the list");
  let shouldHideButton = false;
  let showFields = false;

  if (Array.isArray(tstName)) {
    shouldHideButton = tstName.some((vendor) => vendor.dueDiligence == 1);
    showFields = tstName.every((vendor) => vendor.dueDiligence == 2);

    console.log(shouldHideButton, "shouldHideButton");
    console.log(showFields, "showFields");

    const buttons = document.querySelectorAll(".disbutton");
    buttons.forEach((button) => {
      const buttonText = button.textContent.trim();

      if (buttonText === "Send for Qualification") {
        button.hidden = shouldHideButton;
      }

      if (buttonText === "Initiate Due Diligence") {
        button.hidden = showFields;
      }

      if (buttonText === "Send for Qualification" && formMetaData?.fields) {
        if (
          formMetaData.fields.vvdRating &&
          formMetaData.fields.vddRecommendQualification
        ) {
          formMetaData.fields.vvdRating.visible = showFields;
          formMetaData.fields.vvdRating.required = showFields;
          formMetaData.fields.vddRecommendQualification.visible = showFields;
          formMetaData.fields.vddRecommendQualification.required = showFields;
        }
      }
    });
  } else {
    console.error("tstName is not an array or is undefined");
  }

  let process = useWatch({
    control: control,
    name: "vendors",
  });

  console.log(process, "vendor in the managment");
  let vendorDocuments = useWatch({
    control,
    name: "DOC",
  });

  let vendorActivities = useWatch({
    control,
    name: "ACT",
  });

  useEffect(() => {
    getviewData({
      viewName: "pa_sm_respondent_form_bt",
      pageNumber: 0,
      pageSize: 0,
      sortField: "",
      sortOrder: "",
      orderExpression: "",
      filterExpression: "",
    }).then((response) => {
      const vendorData = response.data.data[0];
      // const statusOfRespondentForm = formMethods.getValues("status");
      console.log(vendorData, "get the data of respondent form");
    });
  }, []);

  const fetchInherentRating = async (object_id, category) => {
    try {
      const response = await getviewData({
        viewName: "pa_sm_respondent_form_bt",
        pageNumber: 0,
        pageSize: 0,
        sortField: "",
        sortOrder: "",
        orderExpression: "",
        filterExpression: `source_object_id = ${object_id} and category=${category}`,
      });
      const vendorData = await response.data.data;
      console.log(vendorData, response.data.data, "vendor assessment details");
      return vendorData;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getVendorInherentRating = (totalScore, ratings) => {
    for (let i = 0; i < ratings.length; i++) {
      if (
        totalScore >= ratings[i].rtg_lower_value &&
        totalScore <= ratings[i].rtg_upper_value
      ) {
        return ratings[i].rtg_rating;
      }
    }
  };

  useEffect(() => {
    if (formValues.currentStage == null) {
      formMethods.setValue(
        "preliminaryRequired",
        formMetaData.configurationFormMetaData.preliminary_assessment
      );
    }
  }, []);

  // form.onLoad = (props) => {
  useEffect(() => {
    if (formValues.currentStage == "RISK_ASSESSMENT") {
      const vendorRatingDetails = fetchInherentRating(formValues.objectId, 2);
      console.log(vendorRatingDetails, "vendorDueRatingvendorDueRating");
      vendorRatingDetails
        .then((result) => {
          if (result[0].status === "Approved") {
            const rating = getVendorInherentRating(
              result[0].total_score,
              formMetaData.configurationFormMetaData.RTG
            );
            setInherentRating(rating);
            formMethods.setValue("inheritRiskRating", rating);
          }
        })
        .catch((error) => {
          console.error("Error fetching vendor rating:", error);
        });
    } else if (formValues.currentStage == "DUE_DILIGENCE") {
      const vendorDueRating = fetchInherentRating(formValues.objectId, 4);
    }
  }, []);
  // };

  if (InherentRating) {
    formMetaData.fields.inheritRiskRating.editable = false;
  } else {
    // formMetaData.fields.inheritRiskRating.editable = true;
  }

  form.inheritRiskRating.onChange(() => {
    if (!InherentRating) {
      formMethods.setValue("inheritRiskRating", "");
      formMethods.setError("inheritRiskRating", {
        type: "manual",
        message: "Please perform inherent risk assessment",
      });
    }
  });

  const prevLengthRef = useRef(process ? process.length : 0);
  console.log(prevLengthRef, "prevLengthRef");

  useEffect(() => {
    if (Array.isArray(process)) {
      if (
        process.length === 0 &&
        (formValues.objectId === undefined ||
          formMethods.getValues("currentStage") === "INITIATE")
      ) {
        VDDremove();
        return;
      }

      if (process.length > prevLengthRef.current) {
        const lastVendorId = process[process.length - 1];
        console.log(lastVendorId, "last vendor id in the vendor ");
        getviewData({
          viewName: "pa_vm_product_service_bt",
          pageNumber: 0,
          pageSize: 0,
          sortField: "",
          sortOrder: "",
          orderExpression: "",
          filterExpression: `status = 'Closed' and selected_vendor= ${lastVendorId?.value}`,
        }).then((response) => {
          const vendorData = response.data.data[0];

          setSelectedVendors((prevVendors) => {
            return prevVendors ? [...prevVendors, vendorData] : [vendorData];
          });
        });

        const rsData = {
          viewName: "pa_gl_thirdparty_bt",
          pageNumber: 0,
          pageSize: 0,
          sortField: "",
          sortOrder: "",
          orderExpression: "",
          filterExpression: `object_id = ${lastVendorId.value}`,
        };

        getviewData(rsData)
          .then((response) => {
            const responseData = response.data;
            console.log(responseData.data.length, "vendor response data");
            if (responseData && responseData.data.length > 0) {
              responseData.data.forEach((rowData) => {
                VDDappend({
                  vddVendorId: "",
                  vvdVendorId: rowData.object_id,
                  vddVendorName: rowData.name,
                  vddRecommendQualification: "",
                  dueDiligence: "",
                  productService: "",
                  criticality: "",
                  category: "",
                  status: "",
                });
              });
            } else {
              VDDremove();
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else if (process.length < prevLengthRef.current) {
        const removedVendors = VDDFields.filter(
          (item) => !process.includes(item.vvdVendorId)
        );

        console.log(vendorActivities, vendorDocuments, "vendor related do");
        removedVendors.forEach((vendor) => {
          const vendorIdToRemove = vendor.vvdVendorId;

          for (let i = 0; i < VDDFields.length; i++) {
            if (VDDFields[i].vvdVendorId === vendorIdToRemove) {
              VDDremove(i);

              const removedVendorDocs =
                vendorDocuments?.filter(
                  (item) => item.docVendor === vendorIdToRemove
                ) || [];
              removedVendorDocs.forEach((doc) => {
                VendorDocHelpers.remove(doc);
              });

              const removedVendorActs =
                vendorActivities?.filter(
                  (item) => item.actVendor === vendorIdToRemove
                ) || [];
              removedVendorActs.forEach((act) => {
                VendorActHelpers.remove(act);
              });

              break;
            }
          }

          setSelectedVendors((prevVendors) =>
            prevVendors.filter(
              (vendor) => vendor?.selectedvendorId !== vendorIdToRemove
            )
          );
        });
      }

      prevLengthRef.current = process.length;
    } else {
      if (VDDFields.length != 0) {
        prevLengthRef.current = 0;
        VDDremove();
      }
    }
    // else {
    //   VDDremove();
    // }
  }, [
    process,
    VDDappend,
    VDDremove,
    VDDFields,
    formMethods,
    formValues.objectId,
  ]);

  let action = useWatch({
    control: control,
    name: "action",
  });

  useEffect(() => {
    if (action === 7) {
      for (const key in VDDFields) {
        formMetaData.fields.dueDiligence.required = false;
      }
    }
    if (action === 2) {
      if (formMetaFields.length == 0) {
        for (const key in formMetaData.fields) {
          if (formMetaData.fields[key].required == true) {
            formMetaFields.push(key);
          }
        }
      }
      for (const key in formMetaData.fields) {
        if (key !== "productService") {
          formMetaData.fields[key].required = false;
        }
      }
    } else if (action !== 2) {
      if (formMetaFields.length != 0) {
        for (const key in formMetaFields) {
          formMetaData.fields[formMetaFields[key]].required = true;
        }
      }
    }
  }, [action]);

  form.onSubmit = function (actionName, actionCode) {
    if (actionName === "Assign Relationship Associate") {
      formMetaData.fields.relationshipManager.required = true;
      formMetaData.fields.relationshipAssociate.required = true;
    } else if (actionName === "Request Clarification") {
      formMetaData.fields.relationshipManager.required = false;
      formMetaData.fields.relationshipAssociate.required = false;
    } else if (actionName === "Initiate Internal Assessment") {
      formMetaData.fields.dueDiligence.required = false;
    }

    // return actionName;
  };

  form.periodicDueDiligence.onChange((value) => {
    if (value == true) {
      // Visible - ON
      formMetaData.fields.frequency.visible = true;
      formMetaData.fields.startDate.visible = true;
      formMetaData.fields.dueByDays.visible = true;
      // Mandatory
      formMetaData.fields.frequency.required = true;
      formMetaData.fields.startDate.required = true;
      formMetaData.fields.dueByDays.required = true;
    } else if (value != true) {
      // Visible - OFF
      formMetaData.fields.frequency.visible = false;
      formMetaData.fields.startDate.visible = false;
      formMetaData.fields.dueByDays.visible = false;
      // Mandatory
      formMetaData.fields.frequency.required = false;
      formMetaData.fields.startDate.required = false;
      formMetaData.fields.dueByDays.required = false;
    }
  });

  form.serviceStartDate.onChange((value) => {
    if (value !== "") {
      formMethods.setValue("serviceEndDate", "");
    }
  });

  form.estimatedCost.onChange((value) => {
    if (value.length <= 10) {
      formMethods.setValue("estimatedCost", value);
    } else {
      const truncatedValue = value.slice(0, 10);
      formMethods.setValue("estimatedCost", truncatedValue);
    }
  });

  form.dueByDays.onChange((value) => {
    if (value.length <= 2) {
      formMethods.setValue("dueByDays", value);
    } else {
      const truncatedValue = value.slice(0, 2);
      formMethods.setValue("dueByDays", truncatedValue);
    }
  });
  form.serviceStartDate.onChange((value) => {
    formMethods.setValue("serviceEndDate", "");
  });

  form.onSubmit = function (actionName) {
    if (actionName == "Submit") {
      return handleSubmit(actionName);
    }
  };

  form.onCancel = (action) => {
    formMethods.setValue("comments", "");
  };

  form.onLoad();
  return form;
};

export default JSHook;
