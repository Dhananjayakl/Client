import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import { useNavigate } from "react-router-dom";

import FormControl from "../../../components/forms/utils/FormControl";
import { createObject, getObjectData, updateObjectData } from "../AdminService";

const service = "picklist";

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
import { getServiceData } from "src/components/server/service";

const validationSchema = Yup.object({
  moduleId: Yup.string().required("Required"),
  name: Yup.string().required("Required"),
  purpose: Yup.string().required("Required"),
  // purpose: Yup.string().required("Required"),
});

let onSubmit = (values) => {
  //Fail the onsubmit to avoid page refresh.
  let closeCanvas = document.querySelector('[class="btn-close"]');
  if (values.id) {
    updateObjectData(service, values, values.id)
      .then((response) => {
        closeCanvas.click();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    createObject(service, values)
      .then((response) => {
        closeCanvas.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

let initialValues = {
  picklistId: "",
  moduleId: "",
  createdOn: "",
  createdBy: "",
  lastUpdatedOn: "",
  lastUpdatedBy: "",
  name: "",
  purpose: "",
  active: true, // Initial value of the check
  picklistValues: "",
};

const Picklist = ({ id }) => {
  const [formValues, setFormValues] = useState(null);

  const [ModuleOptions, setModuleOptions] = useState();
  useEffect(() => {
    getServiceData("getModuleInfo")
      .then((response) => {
        setModuleOptions(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (id) {
    useEffect(() => {
      getObjectData(service, id)
        .then((response) => {
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
              <FormControl
                control="select"
                label="Module"
                name="moduleId"
                placeholder="Please select any one"
                options={ModuleOptions}
                required
              />
            </Row>
            <Row>
              <FormControl control="input" label="Name" name="name" required />
            </Row>
            {!id && (
              <Row>
                <FormControl
                  control="input"
                  label="Picklist Values "
                  name="picklistValues"
                />
              </Row>
            )}
            <Row>
              <FormControl
                control="input"
                label="Purpose"
                name="purpose"
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

export default Picklist;
