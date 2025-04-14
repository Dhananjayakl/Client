import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useForm, Controller, set } from "react-hook-form";
import FormControl from "./FormControl";
import { MenuOnChange } from "src/redux/slices/SselectDependency";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axios from "src/utils/AxiosInstance";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollProgressBar from "react-scroll-progress-bar";
// import { CircleLoader } from "react-spinners";
import Loader from "src/components/Loader";
import { faCircleLeft } from "@fortawesome/free-regular-svg-icons";

import Spinner from "react-bootstrap/Spinner";
import {
  faAngleDoubleDown,
  faAngleDown,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import BottomBar from "./elements/BottomBar";
import TopBar from "./elements/TopBar";
import NotificationModal from "./elements/Modal";
import { CloseForm } from "./elements/CloseButton";
import AuditFields, { FieldTitle } from "./elements/AuditFields";
import { useDispatch } from "react-redux";
import { CollapseProvider } from "src/contexts/SectionProvider";
import { WarnUserBeforeReloadOrExit } from "./elements/Warnuser";
import * as util from "./elements/formutilfunctions";

import Notify from "src/components/forms/reactformutils/elements/Notify";
import {
  handleYesClick,
  handleNoClick,
  startMonitoring,
} from "./elements/EditButton";
import Toast from "react-bootstrap/Toast";
import CommentsModal from "./elements/CommentsModal";
import AfterSubmit from "./elements/AfterSubmit";
import { async } from "regenerator-runtime";
import { ModalOnClick } from "src/redux/slices/ModalHandler";
const importScript = (resourceUrl) => {
  // the url of the file is passed as an parameter
  React.useEffect(() => {
    const script = document.createElement("script"); // creates an html doc by passing script as an parameter so that it becomes the js file
    script.src = resourceUrl; // in te script there is src so we are assinging the resource url to that script.src
    script.async = true; // not blocking the other rendering
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script); //it is used to remove the script from the doc body
    };
  }, [resourceUrl]);
};

const showToastMessage = (message, type, formMetaData) => {
  if (
    type === "success" &&
    !formMetaData.formmeta.object_name &&
    !formMetaData.formmeta.object_type_post_submit
  ) {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 500,
      closeButton: false,
    });
  } else if (type === "error") {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
      closeButton: true,
    });
  }
};

function getFormURL(serviceName, objectId) {
  const API_BASE_URL = "/form";
  return API_BASE_URL + "/" + serviceName + "/" + objectId;
}

const fetchFormInfo = async (serviceName, objectId) => {
  try {
    const response = await axios.get(getFormURL(serviceName, objectId));
    const data = await response.data;
    return response.data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

function createObject(
  service,
  Object,
  submitRef,
  setLoadingFlag,
  ModalCloseDispatch,
  ServerSideFields
) {
  // setLoadingFlag(true);
  // if (submitRef?.current) {
  //   let submitDom = document.getElementsByClassName(
  //     `${submitRef.current.className}`
  //   );
  //   for (let i = 0; i < submitDom.length; i++) {
  //     submitDom[i].disabled = true;
  //   }

  //   console.log(submitDom, "submit dom");
  // }

  const API_BASE_URL = "/form/" + service;
  return axios.post(API_BASE_URL, Object);
}

function updateObjectData(
  service,
  Object,
  objectid,
  submitRef,
  setLoadingFlag
) {
  // setLoadingFlag(true);
  // if (submitRef?.current) {
  //   let submitDom = document.getElementsByClassName(
  //     `${submitRef.current.className}`
  //   );
  //   for (let i = 0; i < submitDom.length; i++) {
  //     submitDom[i].disabled = true;
  //   }
  //   // setLoadingFlag(false);

  //   console.log(submitDom, "submit dom");
  // }
  const API_BASE_URL = "/form/" + service;
  return axios.put(API_BASE_URL + "/" + objectid, Object);
}

let getkeyColumn = (formMetaData) => {
  // formMetaData.fields.
  for (let [key, value] of formMetaData.fields.entries()) {
  }
};

let getInitObject = (formMetaData) => {
  let obj = {};
  for (const [fieldName, fieldInfo] of Object.entries(formMetaData.fields)) {
    obj[fieldName] = fieldInfo.default_value || "";
  }
  obj.workflow = formMetaData.formmeta.workflowId;
  return obj;
};

let getTemplateName = (formMetaData) => {
  let dbAccronym = formMetaData.formmeta.acronym_db;
  if (formMetaData.formmeta.acronym_db == ".") {
    dbAccronym = "";
  } else {
    dbAccronym = formMetaData.formmeta.acronym_db + "_";
  }
  return (
    "modules/" +
    formMetaData.formmeta.acronym_app +
    "/forms/PA_" +
    formMetaData.formmeta.form_name
  );
};
let counter = 0;

let FormRuntimeEngine = (props) => {
  // const refreshdataref = useRef(null);
  // const getrefreshdataref = useRef(null);
  // State Management for Form Engine.
  // alert(++counter);
  console.log(props, "runners-prop");

  const submitRef = useRef(null);
  const ModalCloseDispatch = useDispatch();
  let [isLoading, setIsLoading] = React.useState(true);
  const [showNoAccessModel, setShowNoAccessModel] = useState(false);
  let [FormLayout, setFormLayout] = React.useState();
  const [formValues, setFormValues] = React.useState(null);
  let [formMetaData, setFormMetaData] = React.useState(null);
  let location = useLocation();
  let [form, setForm] = React.useState({});
  let [validationSchema, setValidationSchema] = React.useState(); // this state is used for the validation schema in the formMethods it consist of the entire function
  let [lazyComp, setlazyComp] = React.useState();
  let [lazyvalid, setlazyvalid] = React.useState();
  let [reload, setReload] = React.useState(false);
  const [refreshfunction, setrefreshfunction] = useState();
  const [showNotify, setShowNotify] = useState(false);
  const [submissionFlag, setSubmissionFlag] = useState(false);
  let [buttonHide, setButtonhide] = useState(true);
  let [loadingFlag, setLoadingFlag] = useState(false);
  let [submissionPopup, setSubmissionPopup] = useState(false);
  let [generatedobjectId, setGeneratedObjectId] = useState();
  let [afterSubmitFlag, setAfterSubmitFlag] = useState(false);
  let [dirtyFlag, setdirtyFlag] = useState(false);
  let [ServerSideFields, setServerSideFields] = useState();
  let [RegionServerSideFields, setRegionServerSideFields] = useState();
  let [fieldData, setFieldData] = useState();
  let [dataSetterFlag, setDataSetterFlag] = useState({
    serverFields: false,
    default: false,
    regionFields: false,
  });

  const dataRef = React.useRef();
  const objectIdRef = React.useRef();
  const serviceRef = React.useRef();
  let [keyColumnName, setKeyColumnName] = React.useState(null);

  // let keyColumnName = null;

  let navigate = useNavigate();

  let runtimeParams = { ...props };
  console.log(runtimeParams, "param");

  // console.log("runtimeParams 1",runtimeParams);
  runtimeParams.closeCanvas = document.querySelector('[class="btn-close"]');
  runtimeParams.popup = document.querySelector(".CloseModalForm button");
  runtimeParams.doesAnyHistoryEntryExist = location.key !== "default";
  runtimeParams.navigate = navigate;
  runtimeParams.setReload = setReload;
  runtimeParams.submitRef = submitRef;
  runtimeParams.setLoadingFlag = setLoadingFlag;
  let menuDispatch = useDispatch();
  useEffect(() => {
    menuDispatch(MenuOnChange(false));
  }, []);
  const ServerCall = async (formData, service, objectId) => {
    console.log(formData, service, objectId, "servercall props");
    const data = formData;
    const serviceName = service;
    let idName = objectId;
    if (data) {
      idName = data[keyColumnName];
      if (idName == "" || idName == undefined) {
        idName = -1;
      }
    }

    if (serviceName && idName && data) {
      console.log(
        ServerSideFields,
        data,
        "formMetaData",
        formMetaData,
        "swr-1"
      );

      ServerSideFields.forEach((field) => {
        if (data[field]) {
          console.log(data[field], "fields---region");

          let rawData = data[field];
          if (rawData?.length > 0) {
            console.log(formMetaData.fields[field].is_multi_select, "leo-t2");
            if (!formMetaData.fields[field].is_multi_select) {
              data[field] = rawData[0].value;
            } else {
              data[field] = rawData.map((items) => {
                console.log(data[field], "testing-here");

                return items.value;
              });
            }
          } else {
            console.log(data[field].value, "Server-side-2");

            data[field] = data[field].value;
          }
        }
      });
      console.log(data, "RegionSideFields are here");

      RegionServerSideFields.forEach((regionObject) => {
        console.log(regionObject, data, "regions-are-iteating");

        if (data?.[regionObject.region_code]) {
          data[regionObject.region_code].forEach((regionfieldArray) => {
            let keys = Object.keys(regionObject);

            console.log(formMetaData.fields[regionObject.field_name], "tesven");
            if (formMetaData.fields[regionObject.field_name].is_multi_select) {
              regionfieldArray[regionObject.field_name] = regionfieldArray[
                regionObject.field_name
              ]?.map((items) => {
                return items.value;
              });
            } else {
              console.log("got in the else condition");
              console.log(regionfieldArray, "region field array in the else");

              regionfieldArray[regionObject.field_name] =
                regionfieldArray[regionObject.field_name]?.value;
            }
          });
        }
      });
      if (idName != -1 && idName != undefined) {
        updateObjectData(serviceName, data, idName, submitRef, setLoadingFlag)
          .then((response) => {
            if (props.callbackParent) {
              console.log("test--1");

              props.callbackParent({
                action: "UPDATE",
                status: "Success",
                data: response.data,
              });
            }
            // console.log(location.key);
            ModalCloseDispatch(
              ModalOnClick({
                status: true,
                id: runtimeParams.objectId,
              })
            );
            showToastMessage(
              "Form submitted successfully!",
              "success",
              formMetaData
            );
            setLoadingFlag(false);

            CloseForm(runtimeParams);

            // console.log(response);
          })
          .catch((err) => {
            console.log(err);
            setLoadingFlag(false);
            // if (submitRef?.current) {
            //   submitRef.current.disabled = false;
            // }
            showToastMessage(
              "Form submission failed. update",
              serviceName,
              "error"
            );
          });
      } else {
        createObject(
          serviceName,
          data,
          submitRef,
          setLoadingFlag,
          ModalCloseDispatch,
          ServerSideFields
        )
          .then((response) => {
            if (props.callbackParent) {
              console.log("cal--parent");
              props.callbackParent({
                action: "CREATE",
                status: "Success",
                data: response.data,
                dataRefValue: data,
                serviceName,
              });
            }
            ModalCloseDispatch(
              ModalOnClick({
                status: true,
                id: runtimeParams.objectId ? runtimeParams.objectId : -1,
              })
            );
            setGeneratedObjectId(response.data);
            console.log(response, "jimkiki kamal");
            showToastMessage(
              "Form submitted successfully!",
              "success",
              formMetaData
            );
            setLoadingFlag(false);
            if (
              !formMetaData.formmeta.object_expression ||
              !formMetaData.formmeta.object_name ||
              !formMetaData.formmeta.object_type_post_submit
            ) {
              CloseForm(runtimeParams, submitRef, formMetaData);
            }

            setSubmissionFlag(true);
            console.log("cal--parent");

            setAfterSubmitFlag(true);
          })
          .catch((err) => {
            console.log(err);
            setLoadingFlag(false);
            // if (submitRef?.current) {
            //   submitRef.current.disabled = false;
            // }

            showToastMessage(
              "Form submission failed.create",
              serviceName,
              "error"
            );
          });
      }
    }
  };
  useEffect(() => {
    if (submissionFlag == true) {
      if (submitRef?.current) {
        submitRef.current.disabled = false;
      }
    }
  }, [submitRef, submissionFlag]);
  let { formService, objectId, ParentFormObjectId } = props;
  if (!formService) {
    const [searchParams] = useSearchParams();
    formService = searchParams.get("formService");
    objectId = searchParams.get("objectId");
    ParentFormObjectId = searchParams.get("ParentFormObjectId");
    searchParams.forEach((value, key) => {
      runtimeParams[key] = value;
    });
  }

  if (!objectId) {
    objectId = -1; // Bring new form.
    runtimeParams.objectId = objectId;
    runtimeParams.isNewForm = true;
  }

  const monitorAccessTime = (runtimeParams) => {
    let accessTimePopupShown = false;
    let lockValue = runtimeParams.lockLimit - 1;
    const { accessTimeDiff, extendedTimeDiff } = startMonitoring(runtimeParams);
    if (
      (accessTimeDiff === lockValue || extendedTimeDiff === lockValue) &&
      !accessTimePopupShown
    ) {
      setShowNotify(true);
      accessTimePopupShown = true;
    }
  };

  if (objectId) {
    React.useEffect(() => {
      fetchFormInfo(formService, objectId)
        .then(async (response) => {
          setFormValues(response.data);
          setFormMetaData(response.meta);
          //console.log(response, "bmw");
          // response.meta.formmeta.accessCode=0;
          if (response.meta.formmeta.accessCode == 0) {
            setShowNoAccessModel(true);
            setIsLoading(false);
          }

          let obj = response.data;
          if (response.data.createdOn == undefined) {
            obj = getInitObject(response.meta);
          }
          console.log(formMetaData, "man with the plan");
          console.log(obj, "raw-server-data");

          setFieldData(obj);

          for (const [fieldName, fieldInfo] of Object.entries(
            response.meta.fields
          )) {
            if (
              fieldInfo.is_key_column == true &&
              fieldInfo.region_code == "NOREGION"
            ) {
              runtimeParams.keyColumnName = fieldName;
              setKeyColumnName(fieldName);
            }
            // console.log("fieldInfo:", fieldInfo);
            form[fieldName] = {
              change: [],
              onChange: (method) => {
                form[fieldName].change.push(method);
              },
            };
          }

          setForm(form);

          const lazyComponentName = getTemplateName(response.meta); //here i am getting the template
          setlazyComp(lazyComponentName);

          const lazyComponentNameValidator = lazyComponentName + "_VALIDATOR"; //concatinating the template and validator
          setlazyvalid(lazyComponentNameValidator);
          const extractedString = lazyComponentName.split("modules/")[1];
          const parts = extractedString.split("/");
          const acronym_app = parts[0];
          const formName = parts[parts.length - 1];
          if (lazyComponentName) {
            try {
              const lazyImport = () =>
                import(`../../../modules/${acronym_app}/forms/${formName}.jsx`);
              // import(`../../modules/${moduleName}/forms/${form_name}.jsx`);
              const form = await lazyImport();
              if (form && form.default) {
                setFormLayout(
                  React.lazy(() =>
                    import(
                      `../../../modules/${acronym_app}/forms/${formName}.jsx`
                    )
                  )
                );
              }
            } catch (error) {
              setButtonhide(false);
              setFormLayout(
                React.lazy(() => import("../../../pages/auth/Page404"))
              );
            }
          } else {
            setFormLayout(
              React.lazy(() => import("../../../pages/auth/Page404"))
            );
          }

          function reschedule(runtimeParams) {
            let lockValue = response.meta.formmeta.lockLimit - 1;
            let delay = lockValue * 60 * 1000;
            function executeMonitor() {
              monitorAccessTime(runtimeParams);
              setTimeout(() => {
                reschedule(runtimeParams);
              }, delay);
            }
            setTimeout(executeMonitor, delay);
          }
          reschedule(runtimeParams);

          setIsLoading(false);
          setReload(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }, [objectId, formService, reload]);
  }
  useEffect(() => {
    console.log("rendering--setter");

    if (
      fieldData &&
      ServerSideFields?.length > 0
      // &&
      // dataSetterFlag.serverFields == false
    ) {
      let FieldData = fieldData;
      ServerSideFields.forEach((field) => {
        if (FieldData[field] && formMetaData.dataSourceResponse?.[field]) {
          FieldData[field] = formMetaData.dataSourceResponse[field];
        }
      });
      formMethods.reset(FieldData);
      console.log(FieldData, "testing-data-1");
      // setDataSetterFlag((value) => ({ ...value, serverFields: true }));
    }
    if (
      RegionServerSideFields &&
      fieldData
      // &&
      // dataSetterFlag.regionFields == false
    ) {
      RegionServerSideFields.forEach((regionServerField) => {
        let regions = fieldData[regionServerField.region_code];
        regions?.forEach((items, index) => {
          if (items[regionServerField.field_name]) {
            console.log(
              fieldData[regionServerField.region_code][index][
                regionServerField.field_name
              ],
              "fieldDataValue--ironman-2"
            );

            fieldData[regionServerField.region_code][index][
              regionServerField.field_name
            ] =
              formMetaData.fields[regionServerField.field_name]
                .is_multi_select == true
                ? formMetaData.dataSourceResponse[
                    regionServerField.region_code +
                      "." +
                      index +
                      "." +
                      regionServerField.field_name
                  ]
                : formMetaData.dataSourceResponse[
                    regionServerField.region_code +
                      "." +
                      index +
                      "." +
                      regionServerField.field_name
                  ][0];
          }
        });
        console.log(fieldData, "fieldDataValue--ironman");
      });
      console.log(
        fieldData,
        RegionServerSideFields,
        formMetaData.dataSourceResponse,
        "region--server--fields-1"
      );

      formMethods.reset(fieldData);
      // setDataSetterFlag((value) => ({ ...value, regionFields: true }));
    } else {
      // if (dataSetterFlag.default == false) {
      formMethods.reset(fieldData);
      // setDataSetterFlag((value) => ({ ...value, default: true }));
      // }
    }
  }, [fieldData, ServerSideFields, RegionServerSideFields]);
  useEffect(() => {
    if (formMetaData?.fields) {
      let fields = formMetaData.fields;

      let dependencyFields = Object.keys(fields).map((key, value) => {
        if (
          fields[key].display_type == "SSelect" &&
          fields[key].filter_expression
        ) {
          let filterExpression = fields[key].filter_expression;
          const regex = /:(\w+)/g;
          let extractedField = regex.exec(filterExpression);

          if (extractedField) {
            return { [extractedField[1]]: key };
          } else {
            return null;
          }
        }
      });
      dependencyFields = dependencyFields.filter((items) => items != null);
      console.log(dependencyFields, "dependent fields 12345");

      if (dependencyFields?.length > 0) {
        formMetaData.dependencyFields = dependencyFields;
      }
    }
  }, [formMetaData]);

  const handleCallbackFromChild = (message) => {
    setValidationSchema(message);
  };
  const formMethods = useForm({
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
  });

  useEffect(() => {
    if (formMetaData?.fields) {
      console.log(formMetaData.fields, "formMetaData fields");
      let ServerSideFields = Object.keys(formMetaData.fields)
        .map((key) => {
          let field = formMetaData.fields[key];

          if (
            field.region_code === "NOREGION" &&
            (field.display_type === "SSelect" || field.display_type === "user")
          ) {
            return key; // Return key if NOREGION and display_type matches
          }

          return null; // Handle cases where neither condition is met
        })
        .filter(Boolean); // Remove null values
      console.log(ServerSideFields, formMetaData, "server side fields");
      setServerSideFields(ServerSideFields);

      let RegionServerSideFields = Object.keys(formMetaData.fields)
        .map((key) => {
          let field = formMetaData.fields[key];
          if (
            field.region_code !== "NOREGION" &&
            (field.display_type === "SSelect" || field.display_type === "user")
          ) {
            return { region_code: field.region_code, field_name: key }; // Return region_code if it's not NOREGION
          }
          return null;
        })
        .filter(Boolean);
      setRegionServerSideFields(RegionServerSideFields);
    }
  }, [formMetaData]);

  let onSubmit = (data) => {
    console.log("Data is here" + JSON.stringify(data), "submitted data");
    console.log(data, "submitted Data");

    //alert("Data" + JSON.stringify(data));
    // dataRef.current = data;
  };

  if (isLoading) {
    return <Loader />;
  }

  runtimeParams.setFormMetaData = setFormMetaData;
  runtimeParams.formId = formMetaData.formmeta.form_id;
  runtimeParams.formmeta = formMetaData.formmeta;
  runtimeParams.workflowCode = formMetaData.formmeta.workflow_code;
  runtimeParams.workflowId =
    formMetaData.formmeta.workflowId || formValues.workflow;
  runtimeParams.AuditFields = AuditFields; //<AuditFields formMetaData={formMetaData} formMethods={formMethods}></AuditFields>
  runtimeParams.util = util;
  formMetaData.util = util;
  runtimeParams.formMethods = formMethods;
  runtimeParams.ServerCall = ServerCall;
  runtimeParams.accessTime = formMetaData.formmeta.accessTime;
  runtimeParams.extendedTime = formMetaData.formmeta.extendedTime;
  runtimeParams.lockLimit = formMetaData.formmeta.lockLimit;
  console.log(formMetaData, "runtime--meta--02");

  if (showNoAccessModel) {
    return (
      <>
        <NotificationModal
          show={showNoAccessModel}
          runtimeParams={runtimeParams}
          onHide={() => CloseForm(runtimeParams)}
        />
      </>
    );
  }

  const handleNotifyClose = () => {
    setShowNotify(false);
  };
  if (showNotify) {
    return (
      <>
        <Notify
          show={showNotify}
          content={`The editing privileges are set to be revoked within 1 minute. Would you like to request an extension for the lock before it expires`}
          onHide={handleNotifyClose}
          onYesClick={() => handleYesClick(runtimeParams)}
          onNoClick={() => handleNoClick(runtimeParams)}
        />
      </>
    );
  }

  const dataHandle = (objectsId, Service) => {
    // alert("dataHandle"+objectsId+ Service);
    // setServiceName(Service);
    // setIdName(objectsId);
    objectIdRef.current = objectsId;
    // setIdName(objectsId);
    serviceRef.current = Service;
    // console.log(objectsId, Service, "parameter");
    // if (data) {

    // }
  };
  runtimeParams.dataHandle = dataHandle;
  const createSubmitHandler = (additionalParam1, additionalParam2) => {
    return (data) => {
      console.log(data, "submitted data");
      // Your onSubmit logic here, using the additional parameters

      onSubmit(data, additionalParam1, additionalParam2);
    };
  };
  const onSubmitWithParams = createSubmitHandler(objectId, formService);

  if (formMetaData.fields && typeof formMetaData.fields === "object") {
    Object.entries(formMetaData.fields).forEach(([key, field]) => {
      const extractedKey = key.split(".").pop();
      if (
        form[extractedKey] &&
        typeof form[extractedKey].onChange === "function"
      ) {
        form[extractedKey].onChange(function (value) {
          setdirtyFlag(true);
        });
      }
    });
  }

  function formDirtyCheck() {
    return dirtyFlag;
  }

  let scrollheight = "63px";
  if (window.innerWidth > 750) {
    scrollheight = "63px";
  } else {
    scrollheight = "5px";
  }

  let closeModel = document.querySelector(".reportcloseButton button");
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
  console.log(formMetaData, "metazz");

  return (
    <>
      <WarnUserBeforeReloadOrExit formDirtyCheck={formDirtyCheck} />

      <CollapseProvider>
        <Container className="px-2 bg-white ">
          <TopBar
            formMetaData={formMetaData}
            formMethods={formMethods}
            runtimeParams={runtimeParams}
            formValues={formValues}
          />
          {submissionFlag == true &&
            generatedobjectId &&
            formMetaData.formmeta.object_expression &&
            formMetaData.formmeta.object_name &&
            formMetaData.formmeta.object_type_post_submit && (
              <AfterSubmit
                runtimeParams={runtimeParams}
                generatedobjectId={generatedobjectId}
                formMetaData={formMetaData}
              />
            )}
          <Row
            className="z-1 sticky-top"
            style={{
              top: runtimeParams?.offCanvas ? "40px" : "100px",
            }}
            // style={{ position: "sticky", top: "100" }}
            // className="d-flex justify-content-center align-items-center p-0 m-0 border sticky-top"
          >
            <Col className="d-flex justify-content-center align-items-center p-0 m-0 ">
              {loadingFlag == true && (
                <>
                  <Row className="p-1 m-1">
                    <Col className="d-flex">
                      <Spinner
                        style={{ color: "#3498db" }}
                        animation="border"
                        role="status"
                      ></Spinner>
                    </Col>
                    {/* <Col className=" pt-1 ps-0 m-0 d-flex align-items-center">
                      <h4 style={{ color: "#3498db", stroke: "black" }}>
                        Submitting
                      </h4>
                    </Col> */}
                  </Row>

                  {/* <span className="p-0 m-0 text-dark">Submitting</span> */}
                </>
              )}
            </Col>
          </Row>
          <div
            style={{
              pointerEvents: loadingFlag == true ? "none" : "auto",
              opacity: loadingFlag == true ? "0.5" : "1",
            }}
          >
            <form
              // onSubmit={formMethods.handleSubmit(onSubmitWithParams)}
              onKeyDown={handleKeyDown}
              className=""
            >
              {/* <AfterSubmit/> */}

              <CommentsModal
                formMetaData={formMetaData}
                submissionPopup={submissionPopup}
                setSubmissionPopup={setSubmissionPopup}
                submissionFlag={submissionFlag}
                formMethods={formMethods}
                form={form}
                fields={formMetaData.fields}
                // ServerCall={ServerCall}
                formValues={formValues}
                callbackToParent={handleCallbackFromChild}
                // datahandle={dataHandle}
                runtimeParams={runtimeParams}
              />

              <FormLayout
                formMetaData={formMetaData}
                formMethods={formMethods}
                form={form}
                fields={formMetaData.fields}
                modal={props.modal}
                // ServerCall={ServerCall}
                formValues={formValues}
                callbackToParent={handleCallbackFromChild}
                // datahandle={dataHandle}
                runtimeParams={runtimeParams}
              />

              <BottomBar
                formMetaData={formMetaData}
                formMethods={formMethods}
                form={form}
                // ServerCall={ServerCall}
                onSubmit={onSubmit}
                subPopup={setSubmissionPopup}
                runtimeParams={runtimeParams}
              />
            </form>
          </div>
        </Container>
      </CollapseProvider>
    </>
  );
};

export default FormRuntimeEngine;
