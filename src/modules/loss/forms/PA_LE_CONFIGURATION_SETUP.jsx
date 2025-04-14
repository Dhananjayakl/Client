import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonToolbar,
  ButtonGroup,
  SplitButton,
  Card,
  Dropdown,
  Modal,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import FormControl from "src/components/forms/reactformutils/FormControl";
import { getviewData } from "src/modules/loss/lossFormService";
import JSHook from "./PA_LE_CONFIGURATION_SETUP_JS";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Section from "src/components/forms/reactformutils/fields/Section";
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import {
  faInfo,
  faPlusSquare,
  faTrash,
  faEdit,
  faPlus,
  faHome,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Grid from "src/components/forms/reactformutils/Grid";
const FormLayout = (props) => {
  let { formMethods, formMetaData, form, fields, formValues, runtimeParams } =
    props;
  const {
    control,
    getValues,
    formState: { errors, touched, isSubmitting, isDirty },
    watch,
  } = formMethods;

  console.log("formValuesformValues",formValues.LA)
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  console.log(
    "propspropspropsprops",
    formMetaData.resources.LE_CURRENCY.length
  );
  // const watchedType = watch("active");
  const {
    fields: LAfields,
    rows: apRows,
    append: appendLA,
    remove: removeLA,
    replace: replaceLA,
  } = useFieldArray({
    name: "LA",
    control,
  });

  // const {
  //   fields: CURfields,
  //   rows: curRows,
  //   append: appendCUR,
  //   remove: removeCUR,
  //   replace: replaceCUR,
  // } = useFieldArray({
  //   name: "CUR",
  //   control,
  // });

  // Function to open the modal with content
  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  formMetaData.form = JSHook(
    form,
    formMethods,
    formMetaData,
    runtimeParams,
    LAfields,
    openModal
  );

  const addImpRow = () => {
    appendLA({
      laApprover: null,
      levelApproverObjectId: null,
      laThreshold: null,
      laActive: false,
    });
  };

  // const addCurRow = () => {
  //   appendCUR({
  //     curTransactionalCurrency: null,
  //     curConversionRate: null,
  //     active: false,
  //     curObjectId: "",
  //   });
  // };

  const viewParams = {
    viewName: "PA_LE_LEVEL_APPROVE_STG_V",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: "",
  };
  const watchedTypeone = watch("approvalLevel");
  const watchedTypetwo = watch("laApprover");
  useEffect(() => {
   
    getviewData(viewParams)
      .then((response) => {
        const responseData = response.data;
        if (
          formMethods.getValues("objectId") == null ||
          formMethods.getValues("objectId") == ""
        ) {
        if (responseData && responseData.data.length > 0) {
          formMethods.setValue("LA", null);

          if (formMethods.getValues("approvalLevel") != "") {
            const endIndex = responseData.data.findIndex(
              (field) => field.row_count === formMethods.getValues("approvalLevel")
            );
            const filteredFields = responseData.data.filter(
              (row, rowIndex) => rowIndex <= endIndex
            );

            filteredFields.forEach((rowData, rowIndex) => {
              appendLA({
                laStageTitle: filteredFields[rowIndex].stage_title,
                laApprover: null,
                levelApproverObjectId: null,
                laThreshold: null,
                laStageCode: filteredFields[rowIndex].stage_code,
                laActive: false,
              });
            });
          }
        }
      }
      else
    {
     
      if(formMethods.getValues("approvalLevel") <formMethods.getValues("LA").length )
      {
      let laExistingdata =formMethods.getValues("LA");
      formMethods.setValue("LA",laExistingdata.filter((item, index) => index <formMethods.getValues("approvalLevel")));
      }

      if(formMethods.getValues("approvalLevel") > formMethods.getValues("LA").length )
      {
        const AddingRows = responseData.data.filter((record, index) => index >= formMethods.getValues("LA").length && index <= formMethods.getValues("approvalLevel")-1 );

        AddingRows.forEach((rowData, rowIndex) => {
          appendLA({
            laStageTitle: AddingRows[rowIndex].stage_title,
            laApprover: null,
            levelApproverObjectId: null,
            laThreshold: null,
            laStageCode: AddingRows[rowIndex].stage_code,
            laActive: false,
          });
        })
      }
      if( formValues.LA.length== formMethods.getValues("LA").length )
      {
        formMethods.setValue("LA",formValues.LA);
      }
    }
      })
      .catch((err) => {
        console.log(err);
      });
  
    
  }, [formMethods.getValues("approvalLevel")]);

  // function enablingActive(rowIndex) {
  //   if (formMethods.getValues("LA") != null) {
  //     if (rowIndex == 0) {
  //       const watchedType = watch("LA." + rowIndex + ".active");
  //       return false;
  //     } else {
  //       if (formMethods.getValues("LA")[rowIndex - 1].active == true) {
  //         const watchedType = watch("LA." + rowIndex + ".active");
  //         // formMethods.setValue("LA." + rowIndex + ".active", false);
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }
  //   }
  // }

  return (
    <>
      <Row>
        <div className="col-md-4">
          <FormControl
            control={control}
            name="systemCurrency"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
        <div className="col-md-4">
          <FormControl
            control={control}
            name="defaultSystemCurrency"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
        {/* <div className="col-md-3">
          <FormControl
            control={control}
            name="minimunOneTransaction"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div> */}
        {/* <div className="col-md-6">
          <FormControl
            control={control}
            name="maximumAmount"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div> */}
        <div className="col-md-4">
          <FormControl
            control={control}
            name="approvalLevel"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </div>
      </Row>
      <Section title={t("Approval Configuration")}>
        {/* {LAfields.filter((row, index) => index <= LAfields.findIndex(field => field.stageCode === formMethods.getValues("level") )) */}
        {LAfields.map((row, rowIndex) => (
          <Row key={row.id}>
            <Col xs={12} md={12} lg={12}>
              <div className="d-flex">
                {/* <div className="col-md-2 me-2">
                  <FormControl
                    control={control}
                    zIndex={true}
                    name={`LA.${rowIndex}.active`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    setData={true}
                    readOnly={enablingActive(rowIndex)}
                    hideTitle={rowIndex > 0 ? true : false}
                  />
                </div> */}

                <div className="col-md-3 me-2">
                  <FormControl
                    control={control}
                    zIndex={true}
                    name={`LA.${rowIndex}.laStageTitle`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    setData={true}
                    hideTitle={rowIndex > 0 ? true : false}
                  />
                </div>

                <div className="col-md-4 me-2">
                  <FormControl
                    control={control}
                    zIndex={true}
                    name={`LA.${rowIndex}.laThreshold`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    setData={true}
                    hideTitle={rowIndex > 0 ? true : false}
                  
                  />
                </div>

                

                <div className="col-md-4 me-2">
                  <FormControl
                    control={control}
                    zIndex={true}
                    name={`LA.${rowIndex}.laApprover`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    setData={true}
                    hideTitle={rowIndex > 0 ? true : false}
                    closeButton={true}
                  />
                </div>
              </div>
            </Col>
          </Row>
        ))}
      </Section>

      <Section title={t("Currency Configuration")}>
        {/* {formMetaData.formmeta.accessCode == 1 && (
          <Button
            className="me-2"
            onClick={() => {
              if (
                formMethods.getValues("CUR") != undefined &&
                formMethods.getValues("CUR") != []
              ) {
                if (
                  formMethods.getValues("CUR").length ==
                  formMetaData.resources.LE_CURRENCY.length
                ) {
                  openModal(
                    "We cannot Add the Currnecy more than currency List."
                  );
                } else {
                  addCurRow();
                }
              } else {
                addCurRow();
              }

              // addCurRow();
            }}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Currency
          </Button>
        )} */}

        {/* {CURfields.map((row, rowIndex) => (
          <Row key={row.id}>
            <Col xs={12} md={12} lg={12}>
              <div className="d-flex">
                <div className="col-md-4 me-2">
                  <FormControl
                    control={control}
                    zIndex={true}
                    name={`CUR.${rowIndex}.curTransactionalCurrency`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    setData={true}
                    hideTitle={rowIndex > 0 ? true : false}
                  />
                </div>

                <div className="col-md-4 me-2">
                  <FormControl
                    control={control}
                    zIndex={true}
                    name={`CUR.${rowIndex}.curConversionRate`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    setData={true}
                    hideTitle={rowIndex > 0 ? true : false}
                    // readOnly={ formMethods.getValues("systemCurrency")==formMethods.getValues("CUR." +rowIndex + ".curTransactionalCurrency") ? true:false}
                  />
                </div>

                <div
                  className="col-md-3 me-2"
                  style={rowIndex == 0 ? { marginTop: "3%" } : {}}
                >
                  <FormControl
                    control={control}
                    zIndex={true}
                    name={`CUR.${rowIndex}.curActive`}
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    setData={true}
                    // readOnly={true}
                    // readOnly={formMethods.getValues(`CUR.${rowIndex}.curTransactionalCurrency`)==null || formMethods.getValues(`CUR.${rowIndex}.curTransactionalCurrency`)== "" ? true:false}
                    hideTitle={rowIndex > 0 ? true : false}
                  />
                </div>
              </div>
            </Col>
          </Row>
        ))} */}

<Grid
            formMetaData={formMetaData}
            formMethods={formMethods}
            region="CUR"
            regionTitle="RATING"
            columns={[
              // "curObjectId",
              
              "curConversionRate",
              "curTransactionalCurrency",
              "curActive",
            ]}
            // actions={{
            //   add:
            //     formMethods.getValues("currentStage") === "INITIATE"
            //       ? true
            //       : false,
            //   remove:
            //     formMethods.getValues("currentStage") === "INITIATE"
            //       ? true
            //       : false,
            // }}
            actions={{ add:true, remove:true}}
          />
      </Section>

      {formMethods.getValues("objectId") != "" &&
        formMethods.getValues("currentStage") != "INITIATE" && (
          <AuditTrail
            formMetaData={formMetaData}
            formMethods={formMethods}
            formId={formMetaData.formmeta.form_id}
            objectId={formValues.objectId}
          />
        )}

      {/* Modal Component */}
      <Modal show={isModalOpen} size="sm" onHide={closeModal} centered>
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title className="font-weight-bold mb-0">
            <h3 className="mb-0" style={{ color: "red" }}>
              Notification
            </h3>
          </Modal.Title>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={closeModal}
            className="cursor-pointer"
            aria-label="Close"
            size="lg"
          />
        </Modal.Header>
        <Modal.Body>
          <h4>{modalContent}</h4>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default FormLayout;
