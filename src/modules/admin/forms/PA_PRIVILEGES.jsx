// import { Formik } from "formik";
// import React, { useEffect, useState } from "react";
// import { Helmet } from "react-helmet-async";
// import * as Yup from "yup";

// import FormControl from "src/components/forms/utils/FormControl";

// import { Alert, Button, Container, Form, Row } from "react-bootstrap";

// // import { ModuleOptions } from "src/components/forms/lovs";
// import { getServiceData } from "src/components/server/service";

// import {
//   createObject,
//   getObjectData,
//   updateObjectData,
// } from "../AdminService";

// let initialValues = {
//   active: true,
//   createdBy: "",
//   createdOn: "",
//   id: "",
//   inActiveOn: "",
//   lastUpdatedBy: "",
//   lastUpdatedOn: "",
//   moduleId: "",
//   name: "",
//   purpose: "",
//   title: "",
// };

// const validationSchema = Yup.object({
//   id: Yup.number(),
//   moduleId: Yup.string().required("Required"),
//   name: Yup.string().required("Required"),
//   title: Yup.string().required("Required"),
//   purpose: Yup.string().required("Required"),
// });

// let onSubmit = (values) => {
//   console.log("Values", JSON.stringify(values));

//   //Fail the onsubmit to avoid page refresh.
//   let closeCanvas = document.querySelector('[class="btn-close"]');
//   if (values.id) {
//     updateObjectData("privilege", values, values.id)
//       .then((response) => {
//         closeCanvas.click();
//         console.log(response);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   } else {
//     createObject("privilege", values)
//       .then((response) => {
//         closeCanvas.click();
//         console.log(response);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// };

// const Privileges = ({ id }) => {
//   console.log("id", id);
//   const [formValues, setFormValues] = useState(null);
//   const [ModuleOptions,setModuleOptions] = useState();

//   useEffect(() => {
//     getServiceData('getModuleInfo')
//       .then((response) => {
//         console.log("Module Response", response.data);
//         setModuleOptions(response.data.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//   }, []);

//   if (id) {
//     useEffect(() => {
//       getObjectData("privilege", id)
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
//               <FormControl
//                 control="select"
//                 label="Module"
//                 name="moduleId"
//                 options={ModuleOptions}
//                 required

//               />
//             </Row>
//             <Row>
//               <FormControl
//                 control="input"
//                 label="Title"
//                 name="title"
//                 required
//               />
//             </Row>
//             <Row>
//               <FormControl control="input" label="Name" name="name" required />
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
//     <Helmet title="PRIVILEGES" />
//     <Privileges />
//   </React.Fragment>
// );

// export default Privileges;

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
import { useState, useEffect } from "react";
//   import { WarnUserBeforeReloadOrExit } from "src/Warnuser";

let FormLayout = (props) => {
  let { formMethods, formMetaData, validationSchema, form, fields } = props;
  const {
    setError,
    handleSubmit,
    register,
    reset,
    control,
    getValues,
    setValue,
    watch,
    fieldTitles,

    formState: { errors, touched, isSubmitting, isDirty },
  } = formMethods;

  return (
    <>
      {/* <WarnUserBeforeReloadOrExit formDirtyCheck={formDirtyCheck} /> */}

      <Col>
        <FormControl
          control={control}
          name="moduleId"
          // type='select'
          formMetaData={formMetaData}
          formMethods={formMethods}
          // isMulti={true}
        />
      </Col>

      <Col>
        <FormControl
          control={control}
          name="title"
          // type="input"
          formMetaData={formMetaData}
          formMethods={formMethods}
        />
      </Col>

      {/* <Col>
        <FormControl
          control={control}
          name="name" 
          // type="input"         
          formMetaData={formMetaData}
          formMethods={formMethods}
        />
      </Col> */}

      <Col>
        <FormControl
          control={control}
          name="name"
          // type="controlledObjectName"
          formMetaData={formMetaData}
          formMethods={formMethods}
          value={formMethods.watch("moduleId")}
        />
      </Col>

      <Col>
        <FormControl
          control={control}
          name="purpose"
          // type="select"
          formMetaData={formMetaData}
          formMethods={formMethods}
          isMulti={true}
        />
      </Col>

      <Col>
        <FormControl
          control={control}
          name="active"
          // type="switch"
          formMetaData={formMetaData}
          formMethods={formMethods}
        />
      </Col>
    </>
  );
};
export default FormLayout;
