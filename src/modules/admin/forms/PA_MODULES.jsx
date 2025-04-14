// import { Formik } from "formik";
// import React, { useEffect, useState } from "react";
// import { Helmet } from "react-helmet-async";
// import * as Yup from "yup";

// import FormControl from "src/components/forms/utils/FormControl";

// import { Alert, Button, Container, Form, Row } from "react-bootstrap";

// import {
//   createObject,
//   getObjectData,
//   updateObjectData,
// } from "../AdminService";

// let initialValues = {
//   id: "",
//   name: "",
//   acronymDb: "",
//   acronymApp: "",
//   purpose: "",
//   active: true,
//   inActiveOn: "",
//   createdOn: "",
//   createdBy: "",
//   lastUpdatedOn: "",
//   lastUpdatedBy: "",
//   adminSetup:false,
//   disableNavigation:false,
//   icon:"",
// };

// const service = "modules";

// const validationSchema = Yup.object({
//   id: Yup.number(),
//   name: Yup.string().required(),
//   acronymDb: Yup.string().required(),
//   acronymApp: Yup.string().required(),
//   purpose: Yup.string().required(),
// });

// let onSubmit = (values) => {
//   console.log("Values", JSON.stringify(values));

//   //Fail the onsubmit to avoid page refresh.
//   let closeCanvas = document.querySelector('[class="btn-close"]');
//   if (values.id) {
//     updateObjectData(service, values, values.id)
//       .then((response) => {
//         closeCanvas.click();
//         console.log(response);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   } else {
//     createObject(service, values)
//       .then((response) => {
//         closeCanvas.click();
//         console.log(response);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// };

// const Modules = ({ id }) => {
//   console.log("id", id);
//   const [formValues, setFormValues] = useState(null);

//   if (id) {
//     useEffect(() => {
//       getObjectData(service, id)
//         .then((response) => {
//           console.log("response", response.data);
//           setFormValues(response.data);
//         })
//         .catch((err) => {
//           console.log(err);
//         });

//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [id]);
//   }

//   const [touchedAllFields, setTouchedAllFields] = useState(false);
//   return (
//     <Formik
//       initialValues={formValues || initialValues}
//       validationSchema={validationSchema}
//       onSubmit={onSubmit}
//       enableReinitialize
//     >
//       {({
//         errors,
//         handleSubmit,
//         handleBlur,
//         handleChange,
//         isSubmitting,
//         touched,
//         values,
//       }) => (
//         <Container fluid className="p-0">
//           {/* <Header forform="privilege" title="PRIVILEGES" /> */}
//           {values.createdBy && (
//             <div>
//               {" "}
//               Creation: <span>{values.createdBy}</span>
//               {"("}
//               <span>{values.createdOn}</span>
//               {")"}
//             </div>
//           )}

//           {values.lastUpdatedBy && (
//             <div>
//               {" "}
//               Last Updated: <span>{values.lastUpdatedBy}</span>
//               {"("}
//               <span>{values.lastUpdatedOn}</span>
//               {")"}
//             </div>
//           )}
//           <Form id="privilege" onSubmit={handleSubmit}>
//             {errors.submit && (
//               <Alert className="my-3" variant="danger">
//                 <div className="alert-message">{errors.submit}</div>
//               </Alert>
//             )}

//             {/* <Row>
//               <FormControl control="input" label="Id" name="id" plaintext />
//             </Row> */}

//             <Row>
//               <FormControl control="input" label="Name" name="name" required />
//             </Row>
//             <Row>
//               <FormControl
//                 control="input"
//                 label="Acronum App"
//                 name="acronymApp"
//                 required
//               />
//             </Row>
//             <Row>
//               <FormControl
//                 control="input"
//                 label="Acronum DB"
//                 name="acronymDb"
//                 required
//               />
//             </Row>
//             <Row>
//               <FormControl
//                 control="textarea"
//                 label="Purpose"
//                 name="purpose"
//                 required
//               />
//             </Row>
//             <Row>
//               <FormControl control="switch" label="Active" name="active" />
//             </Row>
//             <Row>
//               <FormControl control="switch" label="Is Admin Page" name="adminSetup" />
//             </Row> <Row>
//               <FormControl control="switch" label="Disable Navigation" name="disableNavigation" />
//             </Row> <Row>
//               <FormControl control="input" label="Icon" name="icon" />
//             </Row>

//             <div className="text-center mt-3">
//               <Button type="submit" variant="primary" size="lg">
//                 Submit
//               </Button>
//             </div>
//           </Form>
//         </Container>
//       )}
//     </Formik>
//   );
// };

// const HolidayFormPage = () => (
//   <React.Fragment>
//     <Helmet title="Modules" />
//     <Modules />
//   </React.Fragment>
// );

// export default Modules;

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
import AuditTrail from "src/components/forms/reactformutils/elements/AuditTrail";
import Section from "src/components/forms/reactformutils/fields/Section";

let FormLayout = (props) => {
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    formValues,
    callbackToParent,
  } = props;
  const {
    setError,
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, touched, isSubmitting, isDirty },
  } = formMethods;

  // formMetaData.form=JSHook(form,formMethods);

  // formMetaData.form = JSHook(
  //   form,
  //   formMethods,
  //   fields,
  //   callbackToParent,
  //   formValues
  // );
  console.log("form form layout:", formMetaData);

  const formDirtyCheck = () => {
    return isDirty;
  };
  return (
    <>
      <Container className="justify-content-center  ">
        <Row>
          <FormControl control="input" label="Name" name="name" required />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="name"
            formMetaData={formMetaData}
            formMethods={formMethods}
            required
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="offering"
            formMetaData={formMetaData}
            formMethods={formMethods}
            // required
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="acronymApp"
            formMetaData={formMetaData}
            formMethods={formMethods}
            required
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="acronymDb"
            formMetaData={formMetaData}
            formMethods={formMethods}
            required
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            name="purpose"
            formMetaData={formMetaData}
            formMethods={formMethods}
            required
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            formMetaData={formMetaData}
            formMethods={formMethods}
            name="active"
          />
        </Row>
        <Row>
          <FormControl
            control={control}
            formMetaData={formMetaData}
            formMethods={formMethods}
            name="adminSetup"
          />
        </Row>{" "}
        <Row>
          <FormControl
            control={control}
            formMetaData={formMetaData}
            formMethods={formMethods}
            name="disableNavigation"
          />
        </Row>{" "}
        <Row>
          <FormControl
            control={control}
            formMetaData={formMetaData}
            formMethods={formMethods}
            name="icon"
          />
        </Row>
      </Container>
      {formValues.objectId != null && (
        <Container className="justify-content-center  ">
          <Section title="Comments and Change History">
            <AuditTrail
              formMetaData={formMetaData}
              formId={formMetaData.formmeta.form_id}
              objectId={formValues.objectId}
            />
          </Section>
        </Container>
      )}
    </>
  );
};

export default FormLayout;
