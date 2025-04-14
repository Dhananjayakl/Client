// import React, { useState, useEffect } from "react";
// import { Helmet } from "react-helmet-async";
// import * as Yup from "yup";
// import { Formik, Field } from "formik";
// import { useNavigate } from "react-router-dom";

// import FormControl from "../../../components/forms/utils/FormControl";

// import { getServiceData } from "src/components/server/service";

// import {
//   createObject,
//   getObjectData,
//   updateObjectData,
// } from "../AdminService";
// import {
//   Button,
//   Card,
//   Container,
//   Col,
//   Row,
//   Form,
//   Alert,
// } from "react-bootstrap";

// import { Header } from "../../../components/forms/utils/Header";
// // import { privileges,ModuleOptions,users } from "src/components/forms/lovs";

// const validationSchema = Yup.object({
//   id: Yup.number(),
//   title: Yup.string().required(),
//   name: Yup.string().required(),
//   purpose: Yup.string().required(),
//   moduleId: Yup.string().required(),
//   // privileges: Yup.string(),
//   privileges: Yup.array()
//   .of(Yup.string())
//   .min(1, <div className="text-danger">Please select at least one Privileges</div>)
//   .required('Please select at least one Privileges'),
//   // users: Yup.string(),
//   users: Yup.array()
//   .of(Yup.string())
//   .min(1, <div className="text-danger">Please select at least one Users</div>)
//   .required('Please select at least one Users'),
// });

// const service = "roles";

// let initialValues = {
//   privileges: [],
//   users: [],
//   id: "",
//   moduleId: "",
//   title: "",
//   name: "",
//   purpose: "",
//   active: true,
//   inActiveOn: "",
//   createdOn: "",
//   createdBy: "",
//   lastUpdatedOn: "",
//   lastUpdatedBy: "",
// };

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

// const Roles = ({ id }) => {
//   console.log("id", id);
//   const [formValues, setFormValues] = useState(null);

//   const [ModuleOptions,setModuleOptions] = useState();
//   const [PrivilegeOptions,setPrivilegeOptions] = useState();
//   const [users,setUsers] = useState();

//   useEffect(() => {
//     getServiceData('getModuleInfo')
//       .then((response) => {
//         console.log("Module Response", response.data);
//         setModuleOptions(response.data.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//       getServiceData('getPrivilegeInfo')
//       .then((response) => {
//         console.log(response.data.data);
//         setPrivilegeOptions(response.data.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//       getServiceData('getUserInfo')
//       .then((response) => {
//         console.log(response.data.data);
//         setUsers(response.data.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   if (id) {
//     useEffect(() => {
//       getObjectData(service, id)
//         .then((response) => {
//           console.log("response", response.data);
//           let data = response.data;
//           // ((response.data.privileges = []));
//           // data.privileges = [];
//           // data.users = [];
//           console.log(data.privileges.map(String));
//           data.privileges=data.privileges.map(String);
//           data.users=data.users.map(String);

//           console.log("data", data);

//           setFormValues(data);
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
//               <FormControl
//               control="input"
//               label="Name"
//               disabled={id!==undefined}
//                name="name"
//                required />
//             </Row>
//             <Row>
//               <FormControl
//                 control="input"
//                 label="Purpose"
//                 name="purpose"
//                 required
//               />
//             </Row>

//             <Row>
//             <label>
//             Privileges<span className="text-danger p-1">
//                     *
//                   </span>
//                   </label>
//               <FormControl
//                 control="checkboxes"
//                 // label="Privileges"
//                 name="privileges"
//                 options={PrivilegeOptions}
//                 // required
//               />
//             </Row>
//             <Row>
//             <label>
//             Users<span className="text-danger p-1">
//                     *
//                   </span>
//                   </label>
//               <FormControl
//                 control="checkboxes"
//                 // label="Users"
//                 name="users"
//                 options={users}
//                 placeholder="Please Select One"
//                 // required
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

// export default Roles;

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
  let {
    formMethods,
    formMetaData,
    validationSchema,
    form,
    fields,
    runtimeParams,
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
          // type="input"
          formMetaData={formMetaData}
          formMethods={formMethods}
        />
      </Col>

      <Col>
        <FormControl
          control={control}
          name="privileges"
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
