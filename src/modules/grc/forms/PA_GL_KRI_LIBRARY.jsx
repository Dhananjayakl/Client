import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  ButtonToolbar,
  ButtonGroup,
  Table,
} from "react-bootstrap";
import Section from "src/components/forms/reactformutils/fields/Section";
import FormControl from "src/components/forms/reactformutils/FormControl";
import DynamicModalPopup from "src/components/pages/DynamicModalPopup";
import AuditTrail from "../../../components/forms/reactformutils/elements/AuditTrail";
import Grid from "src/components/forms/reactformutils/Grid";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import JSHook from "./PA_GL_KRI_LIBRARY_JS";
import { getObjects, getServiceMultiData } from "src/modules/grc/GrcService";
import { useFieldArray } from "react-hook-form";
import { useWatch } from "react-hook-form";

const FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    form,
    fields,
    formValues,
    runtimeParams,
    setValue,
  } = props;

  const {
    control,

    formState: {},
  } = formMethods;

  const [compValue, setCompValue] = useState("");

  const updatevalue = (value) => {
    setCompValue(value);
  };
  const KRIsub = useFieldArray({
    name: "SUB",
    control,
  });

  formMetaData.form = JSHook(
    form,
    formMetaData,
    formMethods,
    formValues,
    updatevalue,
    KRIsub,
    runtimeParams,
    control
  );

  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  const View = formMetaData.formmeta.accessCode;

  if (runtimeParams.modal == true) {
    formMetaData.fields.computation.visible = false;
  }
  const [tableDetails, setTableDetails] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [kriLibArray, setKriLibArray] = useState([]);
  const [selectedKriId, setSelectedKriId] = useState(null);
  const [kriData, setKriData] = useState([]);
  const [kriId, setKriId] = useState([]);

  const handleClick = () => {
    getObjects("objectdetails", "kriLibrary")
      .then((tableResponse) => {
        const kridataarray = formMethods
          .getValues("SUB")
          .map((item) => item.subTitle.toLowerCase());
        const filteredData = tableResponse.data.filter((record) => {
          let isDuplicate = false;
          kridataarray.forEach((subTitle) => {
            if (subTitle === record.name.toLowerCase()) {
              isDuplicate = true;
            }
          });
          return !isDuplicate;
        });
        setTableDetails(filteredData);
        setShowModal(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function callbackFromChild(props) {
    setKriId(props.data);
  }

  const handleModalClose = (selectedData, label, source, options) => {
    if (selectedData && selectedData.length > 0) {
      const selectedIds = selectedData.map((item) => item.value);
      setSelectedKriId(selectedIds);
      setKriLibArray((prevArray) => [...prevArray, ...selectedIds]);
      setKriId(selectedIds);
    }
    setShowModal(false);
  };

  useEffect(() => {
    if (kriId) {
      getServiceMultiData("MultipleData", "kriLibrary", kriId)
        .then((response) => {
          const responseData = response.data;

          responseData.forEach((data) => {
            KRIsub.append({
              id: "",
              subTitle: data.name,
              subOwner: data.d_owner,
              parentId: data.object_id,
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [kriId, setValue]);
  const schStartDate = useWatch({
    control: control,
    name: "startDate",
  });
  const Frequency = useWatch({
    control: control,
    name: "frequency",
  });

  return (
    <>
      <Container className="justify-content-center">
        <Section title="General">
          <Row>
            <Col md={10}>
              <FormControl
                control={control}
                type="input"
                name="name"
                formMetaData={formMetaData}
                formMethods={formMethods}
                others
              />
            </Col>
            <Col md={2}>
              <FormControl
                control={control}
                name="computation"
                formMetaData={formMetaData}
                formMethods={formMethods}
                hideTitle
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <FormControl
                control={control}
                name="description"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <div className="col-md-3">
              <FormControl
                control={control}
                name="frequency"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </div>
          </Row>

          {Frequency == "8" || Frequency == "1" ? (
            <Row>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="startDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate={true}
                  watchFor="frequency"
                />
              </div>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="dueDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  watchFor="frequency"
                  futureDate={true}
                  futureDateValue={
                    Frequency == "8"
                      ? new Date(schStartDate).setDate(
                          new Date(schStartDate).getDate()
                        )
                      : new Date(schStartDate).setDate(
                          new Date(schStartDate).getDate() + 1
                        )
                  }
                />
              </div>
            </Row>
          ) : (
            <Row>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="startDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  futureDate={true}
                  watchFor="frequency"
                />
              </div>

              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="dueBy"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  watchFor="frequency"
                />
              </div>
              <div className="col-md-2 mt-3">
                <FormControl
                  control={control}
                  name="onWorkingDay"
                  auditableEntity
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  watchFor="frequency"
                  hideTitle
                />
                <FormControl
                  control={control}
                  name="onCalendarDay"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  watchFor="frequency"
                  hideTitle
                />
              </div>
              <div className="col-md-3">
                <FormControl
                  control={control}
                  name="dueDate"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  watchFor="frequency"
                  futureDate={true}
                  futureDateValue={
                    Frequency == "8"
                      ? new Date(schStartDate).setDate(
                          new Date(schStartDate).getDate()
                        )
                      : new Date(schStartDate).setDate(
                          new Date(schStartDate).getDate() + 1
                        )
                  }
                />
              </div>
            </Row>
          )}
        </Section>
        {compValue === true && (
          <Section title="Computation">
            <Row>
              <Col md={4}>
                <FormControl
                  control={control}
                  name="logic"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                />
              </Col>
            </Row>

            {View !== 7 && (
              <ButtonToolbar
                className="justify-content-center mb-1"
                aria-label="Toolbar with Action Management"
              >
                <ButtonGroup aria-label="First group" className="flex-grow-1">
                  <ModalForm
                    className="ms-1"
                    objectId={-1}
                    component={
                      <FormRunTime
                        formService="kriLibrary"
                        objectId={-1}
                        modal
                        callbackParent={callbackFromChild}
                      />
                    }
                    buttonText={"(+)Create KRI"}
                  />
                  <Button
                    type="button"
                    className="ms-4"
                    onClick={() => {
                      handleClick();
                    }}
                  >
                    (+) Add KRI
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
            )}
            <Grid
              formMetaData={formMetaData}
              formMethods={formMethods}
              region="SUB"
              columns={[
                { name: "subTitle", length: 5 },
                { name: "subOwner", length: 5 },
              ]}
              actions={{ add: false, remove: true }}
              formValues={formValues}
              helpers={KRIsub}
              disabled={true}
            />
          </Section>
        )}
        <Section title="Ownership and Metrics">
          <Row>
            <Col>
              <Col md={12}>
                <FormControl
                  control={control}
                  name="type"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                  labelSize={4}
                />
              </Col>
              <Col md={12}>
                <FormControl
                  control={control}
                  name="owner"
                  formMetaData={formMetaData}
                  formMethods={formMethods}
                  singleRow
                  labelSize={4}
                />
              </Col>
            </Col>

            <Col>
              <Row>
                <Col md={12}>
                  <FormControl
                    control={control}
                    name="high"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    onKeyDown={(e) =>
                      exceptThisSymbols.includes(e.key) && e.preventDefault()
                    }
                    singleRow
                    labelSize={3}
                  />
                </Col>
                <Col md={12}>
                  <FormControl
                    control={control}
                    name="medium"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    onKeyDown={(e) =>
                      exceptThisSymbols.includes(e.key) && e.preventDefault()
                    }
                    singleRow
                    labelSize={3}
                  />
                </Col>
                <Col md={12}>
                  <FormControl
                    control={control}
                    name="low"
                    formMetaData={formMetaData}
                    formMethods={formMethods}
                    onKeyDown={(e) =>
                      exceptThisSymbols.includes(e.key) && e.preventDefault()
                    }
                    singleRow
                    labelSize={3}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Section>
        <Section title="Applicability">
          <Row>
            <Col md={6}>
              <FormControl
                control={control}
                name="riskCategory"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
            <Col md={6}>
              <FormControl
                control={control}
                zIndex={true}
                name="process"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FormControl
                control={control}
                zIndex={true}
                name="risk"
                formMetaData={formMetaData}
                formMethods={formMethods}
              />
            </Col>
          </Row>
        </Section>

        {formValues.objectId != null && (
          <Container className="justify-content-center">
            <AuditTrail
              formMetaData={formMetaData}
              formMethods={formMethods}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
              enableAddComment={formValues.status == "Closed" ? false : true}
            />
          </Container>
        )}
      </Container>
      <DynamicModalPopup
        show={showModal}
        onHide={handleModalClose}
        title="Select KRI"
        label="KRI"
        options={tableDetails}
        buttonLabel="Select"
        source="kriLibrary"
      />
    </>
  );
};

export default FormLayout;
