import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import { useNavigate } from "react-router-dom";
import ColorPicker from "src/components/forms/reactformutils/fields/ColorPicker";

import FormControl from "../../../components/forms/utils/FormControl";
import { createObject, getObjectData, updateObjectData } from "../AdminService";

const service = "picklistvalues";

import {
  Button,
  Card,
  Container,
  Col,
  Row,
  Form,
  Alert,
} from "react-bootstrap";

import { Header } from "../../../components/forms/utils/Header";

import { ModuleOptions } from "src/components/forms/lovs";

const validationSchema = Yup.object({
  key: Yup.number().required("Required"),
  value: Yup.string().required("Required"),
  displayOrder: Yup.number().required("Required"),
  // purpose: Yup.string().required("Required"),
});

let onSubmit = (values) => {
  console.log("Values", JSON.stringify(values));

  //Fail the onsubmit to avoid page refresh.
  let closeCanvas = document.querySelector('[class="btn-close"]');
  if (values.id) {
    updateObjectData(service, values, values.id)
      .then((response) => {
        closeCanvas.click();
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    createObject(service, values)
      .then((response) => {
        closeCanvas.click();
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

let initialValues = {
  picklistValueId: "",
  picklistId: "",
  createdOn: "",
  createdBy: "",
  lastUpdatedOn: "",
  lastUpdatedBy: "",
  key: "",
  value: "",
  displayOrder: "",
  guidence: "",
  active: true, // Initial value of the check
  valueColor: "",
  score: "",
};

const Lov = ({ id, lovId }) => {
  console.log("id", id);
  initialValues.picklistId = lovId;
  const [formValues, setFormValues] = useState(null);

  if (id) {
    useEffect(() => {
      getObjectData(service, id)
        .then((response) => {
          console.log("response", response.data);
          setFormValues(response.data);
        })
        .catch((err) => {
          console.log(err);
        });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
  }

  const [touchedAllFields, setTouchedAllFields] = useState(false);
  return (
    <Formik
      initialValues={formValues || initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({
        errors,
        handleSubmit,
        handleBlur,
        handleChange,
        isSubmitting,
        touched,
        values,
      }) => (
        <Container fluid className="p-0">
          {values.createdBy && (
            <div>
              {" "}
              Creation: <span>{values.createdBy}</span>
              {"("}
              <span>{values.createdOn}</span>
              {")"}
            </div>
          )}

          {values.lastUpdatedBy && (
            <div>
              {" "}
              Last Updated: <span>{values.lastUpdatedBy}</span>
              {"("}
              <span>{values.lastUpdatedOn}</span>
              {")"}
            </div>
          )}
          <Form id="picklist" onSubmit={handleSubmit}>
            {errors.submit && (
              <Alert className="my-3" variant="danger">
                <div className="alert-message">{errors.submit}</div>
              </Alert>
            )}

            <Row>
              <FormControl control="number" label="Key" name="key" required />
            </Row>
            <Row>
              <FormControl
                control="input"
                label="Value"
                name="value"
                required
              />
            </Row>
            <Row>
              <Col xs={6}>
                <div className="d-flex align-items-center  justify-content-end">
                  <ColorPicker
                    label=" Color"
                    value={"#8593cb"}
                    onChange={(color) =>
                      handleChange({
                        target: { name: "valueColor", value: color },
                      })
                    }
                  />
                  <FormControl
                    control="input"
                    label="Value Color "
                    name="valueColor"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <FormControl control="number" label="Score" name="score" />
            </Row>

            <Row>
              <FormControl
                control="textarea"
                label="Guidence"
                name="guidence"
              />
            </Row>
            <Row>
              <FormControl
                control="number"
                label="Display Order"
                name="displayOrder"
                required
              />
            </Row>
            <Row>
              <FormControl control="switch" label="Active" name="active" />
            </Row>

            <div className="text-center mt-3">
              <Button type="submit" variant="primary" size="lg">
                Submit
              </Button>
            </div>
          </Form>
        </Container>
      )}
    </Formik>
  );
};

const HolidayFormPage = () => (
  <React.Fragment>
    <Helmet title="List Of Values" />
    <Lov />
  </React.Fragment>
);

export default Lov;
