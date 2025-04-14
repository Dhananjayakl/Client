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
import { useState, useEffect, useLayoutEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import Action from "src/components/forms/reactformutils/FormRuntimeEngine";
import ReportRuntime from "src/components/reports/Report";
let Section = (props) => {
  return (
    <Row>
      <Col>
        <h4 className="mt-4">{props.title}</h4>
      </Col>
    </Row>
  );
};

let FormLayout = (props) => {
  let { formMethods, formMetaData, validationSchema, form, fields } = props;
  console.log("Properties........", props);
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
  console.log("form form layout:", form);

  console.log("object Id", formMethods.getValues("objectId"));

  // if (formMethods.getValues('objectId') != '-1' || formMethods.getValues('objectId') != null) {
  //     formMetaData.fields.title.editable = false;
  //     formMetaData.fields.attachments.editable = false;
  //     formMetaData.fields.createdOn.editable = false;
  //     formMetaData.fields.description.editable = false;
  //     formMetaData.fields.identifiedOn.editable = false;
  //     formMetaData.fields.occuredOn.editable = false;
  //     formMetaData.fields.type.editable = false;

  // }

  return (
    <>
      <Container className="justify-content-center  ">
        <Section title="Incident Details" />

        <Col>
          <FormControl
            control={control}
            type="input"
            name="title"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>

        <Row>
          <Col>
            <FormControl
              control={control}
              type="textarea"
              name="description"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>
        <Col>
          <FormControl
            control={control}
            type="select"
            name="type"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>

        <Row>
          <Col>
            <FormControl
              control={control}
              type="date"
              name="identifiedOn"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>

          <Col>
            <FormControl
              control={control}
              type="date"
              name="occuredOn"
              formMetaData={formMetaData}
              formMethods={formMethods}
            />
          </Col>
        </Row>

        <Col>
          <FormControl
            control={control}
            type="singleattach"
            name="attachments"
            formMetaData={formMetaData}
            formMethods={formMethods}
          />
        </Col>
      </Container>
    </>
  );
};
export default FormLayout;
