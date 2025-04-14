import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Offcanvas,
  Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUser,
  faAddressCard,
  faPhone,
  faFile,
  faBriefcase,
  faGraduationCap,
  faCertificate,
  faUsers,
  faCogs,
  faBank,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

import Navigation from "../forms/SettingNavigation";
import SettingForms from "src/components/forms/reactformutils/FormRuntimeEngine";
import ChangePassword from "../../admin/forms/ChangePassword";
import ReportRuntime from "src/components/reports/Report";
import { ModalForm } from "src/components/forms/reactformutils/elements/ModalForm";

import { getviewData } from "src/modules/employee/EmployeeService";
import { getObjectInfo } from "src/modules/admin/AdminService";

function Settings() {
  const [data, setData] = React.useState("employeeDetails");
  let userId = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].user_id;
  const [objectId, setObjectid] = useState(null);
  const [cobjectId, csetObjectid] = useState(null);
  const [emobjectId, setemObjectid] = useState(null);
  const [skillobj, setskillobj] = useState(null);
  const [bankobj, setbankobj] = useState(null);
  const [docobj, setdocobj] = useState(null);
  const [certobj, setcertobj] = useState(null);
  const [eduobj, seteduobj] = useState(null);
  const [famobj, setfamobj] = useState(null);
  const [jobobj, setjobobj] = useState(null);
  const [selectedForm, setSelectedForm] = React.useState("employeeDetails");
  const [isEdit, setIsEdit] = useState(false);

  const viewData = {
    viewName: "pa_em_skill_details_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `(object_id=${userId})`,
  };

  const bankviewData = {
    viewName: "pa_em_bank_details_bk_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `(object_id=${userId})`,
  };

  const documentViewdata = {
    viewName: "pa_em_documents_dc_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `(object_id=${userId})`,
  };

  const certificationViewdata = {
    viewName: "pa_em_certifications_cr_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `(object_id=${userId})`,
  };

  const educationViewdata = {
    viewName: "PA_EM_EDUCATION_DETAILS_ED_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `(object_id=${userId})`,
  };

  const familyViewdata = {
    viewName: "PA_EM_FAMILY_DETAILS_FM_BV",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `(object_id=${userId})`,
  };

  const jobHistoryViewdata = {
    viewName: "PA_EM_JOB_HISTORY_DETAILS_V",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: `(object_id=${userId})`,
  };

  const checkWhichButtonClicked = (pre, item) => {
    setData(item);
    setSelectedForm(item);
    if (pre) {
      updateActiveTabClass(pre, item);
    }
  };

  let updateActiveTabClass = (pre, tabName) => {
    let oldElement = document.getElementById(pre);
    let targetElement = document.getElementById(tabName);
    if (targetElement) {
      oldElement.classList.remove("active");
      targetElement.classList.add("active");
    }
  };

  const OffCanvasForm = ({ buttonText, canvasTitle, id, type, ...props }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);

    const handleEditClick = () => {
      setIsEdit((prevIsEdit) => !prevIsEdit);
    };

    const handleFormSubmit = () => {
      setIsEdit(false);
    };

    const [apiResponse, setApiResponse] = useState(null);
    const [contactResp, setcontactResp] = useState(null);
    const [employeeResp, setemployeeResp] = useState(null);
    const [skillResp, setskillResp] = useState(null);
    const [bankResp, setbankResp] = useState(null);
    const [docResp, setdocResp] = useState(null);
    const [certResp, setcertResp] = useState(null);
    const [eduResp, seteduResp] = useState(null);
    const [famResp, setfamResp] = useState(null);
    const [jobResp, setjobResp] = useState(null);

    useEffect(() => {
      getObjectInfo("getObjectInfo", userId, "EM_PERSONAL_DETAILS", "object_id")
        .then((response) => {
          const filedData = response.data[0];
          if (filedData && response.data.length > 0) {
            setObjectid(filedData.object_id);
            setApiResponse(response.data);
          } else {
            setObjectid(-1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      getObjectInfo("getObjectInfo", userId, "EM_CONTACT_DETAILS", "object_id")
        .then((response) => {
          const filedData = response.data[0];
          if (filedData && response.data.length > 0) {
            csetObjectid(filedData.object_id);
            setcontactResp(response.data);
          } else {
            cobjectId(-1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      getObjectInfo("getObjectInfo", userId, "EM_EMPLOYEE_DETAILS", "user_id")
        .then((response) => {
          const filedData = response.data[0];
          if (filedData && response.data.length > 0) {
            setemObjectid(filedData.object_id);
            setemployeeResp(response.data);
          } else {
            setemObjectid(-1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      getviewData(viewData)
        .then((response) => {
          const responseData = response.data;
          if (responseData.data.length > 0) {
            setskillobj(responseData.data[0].object_id);
            setskillResp(response.data.data);
          } else {
            setskillobj(-1);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      getviewData(bankviewData)
        .then((response) => {
          const responseData = response.data;
          if (responseData.data.length > 0) {
            setbankobj(responseData.data[0].object_id);
            setbankResp(response.data.data);
          } else {
            setbankobj(-1);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      getviewData(documentViewdata)
        .then((response) => {
          const responseData = response.data;
          if (responseData.data.length > 0) {
            setdocobj(responseData.data[0].object_id);
            setdocResp(response.data.data);
          } else {
            setdocobj(-1);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      getviewData(certificationViewdata)
        .then((response) => {
          const responseData = response.data;
          if (responseData.data.length > 0) {
            setcertobj(responseData.data[0].object_id);
            setcertResp(response.data.data);
          } else {
            setcertobj(-1);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      getviewData(educationViewdata)
        .then((response) => {
          const responseData = response.data;
          if (responseData.data.length > 0) {
            seteduobj(responseData.data[0].object_id);
            seteduResp(response.data.data);
          } else {
            seteduobj(-1);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      getviewData(familyViewdata)
        .then((response) => {
          const responseData = response.data;
          if (responseData.data.length > 0) {
            setfamobj(responseData.data[0].object_id);
            setfamResp(response.data.data);
          } else {
            setfamobj(-1);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      getviewData(jobHistoryViewdata)
        .then((response) => {
          const responseData = response.data;
          if (responseData.data.length > 0) {
            setjobobj(responseData.data[0].object_id);
            setjobResp(response.data.data);
          } else {
            setjobobj(-1);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, [userId]);

    const handlePreviousCard = () => {
      switch (data) {
        case "contactDetails":
          checkWhichButtonClicked(data, "personaldetails");
          break;
        case "personaldetails":
          checkWhichButtonClicked(data, "employeeDetails");
          break;
        case "bankdetails":
          checkWhichButtonClicked(data, "contactDetails");
          break;
        case "skills":
          checkWhichButtonClicked(data, "bankdetails");
          break;
        case "documents":
          checkWhichButtonClicked(data, "skills");
          break;
        case "jobHistory":
          checkWhichButtonClicked(data, "documents");
          break;
        case "educationaldetails":
          checkWhichButtonClicked(data, "jobHistory");
          break;
        case "certification":
          checkWhichButtonClicked(data, "educationaldetails");
          break;
        case "familyDetails":
          checkWhichButtonClicked(data, "certification");
          break;

        default:
      }
    };

    const handleNextCard = () => {
      switch (data) {
        case "employeeDetails":
          checkWhichButtonClicked(data, "personaldetails");
          break;
        case "personaldetails":
          checkWhichButtonClicked(data, "contactDetails");
          break;
        case "contactDetails":
          checkWhichButtonClicked(data, "bankdetails");
          break;
        case "bankdetails":
          checkWhichButtonClicked(data, "skills");
          break;
        case "skills":
          checkWhichButtonClicked(data, "documents");
          break;
        case "documents":
          checkWhichButtonClicked(data, "jobHistory");
          break;
        case "jobHistory":
          checkWhichButtonClicked(data, "educationaldetails");
          break;
        case "educationaldetails":
          checkWhichButtonClicked(data, "certification");
          break;
        case "certification":
          checkWhichButtonClicked(data, "familyDetails");
          break;
        case "familyDetails":
          break;
        default:
      }
    };
    const getObjectId = (selectedForm) => {
      const objectIdMap = {
        employeeDetails: emobjectId,
        personaldetails: objectId,
        contactDetails: cobjectId,
        skills: skillobj,
        bankdetails: bankobj,
        documents: docobj,
        certification: certobj,
        educationaldetails: eduobj,
        familyDetails: famobj,
        jobHistory: jobobj,
      };

      return objectIdMap[selectedForm] || objectId;
    };

    const Tabledetails = ({ title, apiResponse, fieldDetails, icon }) => {
      var experience;
      if (apiResponse && apiResponse.length > 0) {
        apiResponse.map((record, index) => {
          experience = record.no_prior_experience;
        });
      }

      return (
        <Card className="w-100" style={{ borderRadius: "30px" }}>
          <>
            <Card.Title className=" custom-card-title d-flex justify-content-between ms-4 mt-3 small fw-normal lh-1_5">
              <h4>
                <FontAwesomeIcon className="me-2" icon={icon} />
                {title}
              </h4>

              {apiResponse && (
                <ModalForm
                  className="mb-4"
                  objectId={getObjectId(selectedForm)}
                  component={
                    selectedForm === "personaldetails" ? (
                      <SettingForms
                        formService="personaldetails"
                        objectId={objectId}
                        modal
                        disabled={!isEdit}
                        handleFormSubmit={handleFormSubmit}
                        type="Emp"
                      />
                    ) : selectedForm === "contactDetails" ? (
                      <SettingForms
                        formService="contactdetails"
                        objectId={cobjectId}
                        modal
                        disabled={!isEdit}
                        type="Emp"
                      />
                    ) : selectedForm === "changePassword" ? (
                      <ChangePassword />
                    ) : selectedForm === "employeeDetails" ? (
                      <SettingForms
                        formService="employeeDetails"
                        objectId={emobjectId}
                        modal
                        type="Emp"
                      />
                    ) : selectedForm === "skills" ? (
                      <SettingForms
                        formService="skillsdetails"
                        objectId={skillobj}
                        modal
                        type="Emp"
                      />
                    ) : selectedForm === "bankdetails" ? (
                      <SettingForms
                        formService="bankdetails"
                        objectId={bankobj}
                        modal
                        type="Emp"
                      />
                    ) : selectedForm === "documents" ? (
                      <SettingForms
                        formService="documents"
                        modal
                        objectId={docobj}
                        type="Emp"
                      />
                    ) : selectedForm === "certification" ? (
                      <SettingForms
                        formService="certifications"
                        modal
                        objectId={certobj}
                        type="Emp"
                      />
                    ) : selectedForm === "educationaldetails" ? (
                      <SettingForms
                        formService="educationaldetails"
                        modal
                        objectId={eduobj}
                        type="Emp"
                      />
                    ) : selectedForm === "familyDetails" ? (
                      <SettingForms
                        formService="familydetails"
                        modal
                        objectId={famobj}
                        type="Emp"
                      />
                    ) : selectedForm === "jobHistory" ? (
                      <SettingForms
                        formService="jobhistory"
                        modal
                        objectId={jobobj}
                        type="Emp"
                      />
                    ) : null
                  }
                  buttonText="View"
                />
              )}
            </Card.Title>
            {experience ? (
              <h4 className="ms-4">
                No Prior Experience{" "}
                <Badge className="bg-success">
                  {" "}
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size="lg"
                  ></FontAwesomeIcon>
                </Badge>{" "}
              </h4>
            ) : (
              <Card.Body className="custom-header" style={{ overflow: "auto" }}>
                {apiResponse && apiResponse.length > 0 ? (
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table className="custom-tables table text-nowrap">
                      <thead>
                        <tr>
                          {fieldDetails.map((field) => (
                            <th
                              key={field.key}
                              data-header={field.label}
                              title={field.label}
                              className="fs-5 fw-bold lh-1_5 text-center p-2 sticky-top"
                            >
                              {field.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {apiResponse.map((record, index) => (
                          <tr key={index}>
                            {fieldDetails.map((field) => {
                              const value = record[field.key];
                              const isDateField = field.key
                                .toLowerCase()
                                .includes("date");
                              const Exp =
                                field.key.toLowerCase() === "exp" ||
                                field.key.toLowerCase() === "job_tenure";
                              const isidcolumn =
                                field.key.toLowerCase() === "id_number" ||
                                field.key.toLowerCase() === "account_number" ||
                                field.key.toLowerCase() === "ifsc_code";

                              let formattedValue;
                              if (isDateField && value !== null) {
                                formattedValue = new Date(value).toLocaleString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                );
                              } else if (Exp > 0 || isidcolumn) {
                                const [years, months] = value
                                  .toString()
                                  .split(".")
                                  .map(Number);
                                if (years > 0 && months > 0) {
                                  formattedValue = `${years} ${
                                    years === 1 ? "Year" : "Years"
                                  } ${months} ${
                                    months === 1 ? "Month" : "Months"
                                  }`;
                                } else if (years <= 0 && months > 0) {
                                  formattedValue = `${months} ${
                                    months === 1 ? "Month" : "Months"
                                  }`;
                                } else if (isidcolumn && value !== null) {
                                  const idstr = value.toString();
                                  const lastFourDigits = idstr.slice(-4);
                                  const maskedPart = "X".repeat(
                                    idstr.length - 4
                                  );
                                  formattedValue = maskedPart + lastFourDigits;
                                } else {
                                  if (years > 0) {
                                    formattedValue = `${years} ${
                                      years === 1 ? "Year" : "Years"
                                    }`;
                                  }
                                }
                              } else {
                                formattedValue = value !== null ? value : "";
                              }
                              return (
                                <td
                                  key={field.key}
                                  className="fs-5 fw-normal lh-1_5 text-center p-2 overflow-auto text-wrap "
                                >
                                  {Exp || isDateField || isidcolumn
                                    ? formattedValue
                                    : value}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="d-flex justify-content-center rounded ">
                    <ModalForm
                      className="mb-4"
                      objectId={getObjectId(selectedForm)}
                      component={
                        selectedForm === "personaldetails" ? (
                          <SettingForms
                            formService="personaldetails"
                            objectId={objectId}
                            modal
                            disabled={!isEdit}
                            handleFormSubmit={handleFormSubmit}
                            type="Emp"
                          />
                        ) : selectedForm === "contactDetails" ? (
                          <SettingForms
                            formService="contactdetails"
                            objectId={cobjectId}
                            modal
                            disabled={!isEdit}
                            type="Emp"
                          />
                        ) : selectedForm === "changePassword" ? (
                          <ChangePassword />
                        ) : selectedForm === "employeeDetails" ? (
                          <SettingForms
                            formService="employeeDetails"
                            objectId={emobjectId}
                            modal
                            type="Emp"
                          />
                        ) : selectedForm === "skills" ? (
                          <SettingForms
                            formService="skillsdetails"
                            objectId={skillobj}
                            modal
                            type="Emp"
                          />
                        ) : selectedForm === "bankdetails" ? (
                          <SettingForms
                            formService="bankdetails"
                            objectId={bankobj}
                            modal
                            type="Emp"
                          />
                        ) : selectedForm === "documents" ? (
                          <SettingForms
                            formService="documents"
                            modal
                            objectId={docobj}
                            type="Emp"
                          />
                        ) : selectedForm === "certification" ? (
                          <SettingForms
                            formService="certifications"
                            modal
                            objectId={certobj}
                            type="Emp"
                          />
                        ) : selectedForm === "educationaldetails" ? (
                          <SettingForms
                            formService="educationaldetails"
                            modal
                            objectId={eduobj}
                            type="Emp"
                          />
                        ) : selectedForm === "familyDetails" ? (
                          <SettingForms
                            formService="familydetails"
                            modal
                            objectId={famobj}
                            type="Emp"
                          />
                        ) : selectedForm === "jobHistory" ? (
                          <SettingForms
                            formService="jobhistory"
                            modal
                            objectId={jobobj}
                            type="Emp"
                          />
                        ) : null
                      }
                      buttonText="Add"
                    />
                  </div>
                )}
              </Card.Body>
            )}

            <div className="d-flex justify-content-between ms-3">
              <Button
                variant="primary"
                onClick={handlePreviousCard}
                className="me-2 mb-1"
                size="lg"
                style={{ borderRadius: "30px" }}
              >
                <span aria-hidden="true">&laquo;</span> Previous
              </Button>
              <Button
                variant="primary"
                onClick={handleNextCard}
                className="me-3 mb-1"
                size="lg"
                style={{ borderRadius: "30px" }}
                hidden={data === "familyDetails"}
              >
                Next <span aria-hidden="true">&raquo;</span>
              </Button>
            </div>
          </>
        </Card>
      );
    };
    const CardDetails = ({ title, apiResponse, fieldDetails, icon }) => {
      return (
        <Card className="w-100 " style={{ borderRadius: "30px" }}>
          <>
            <Card.Title className="custom-card d-flex justify-content-between ms-4 mt-3 small fw-normal lh-1_5">
              {/* {title} */}
              <div className="h4">
                {" "}
                <FontAwesomeIcon className="me-2" icon={icon} />
                {title}
              </div>

              {apiResponse && (
                <ModalForm
                  className="mb-4"
                  objectId={getObjectId(selectedForm)}
                  component={
                    selectedForm === "personaldetails" ? (
                      <SettingForms
                        formService="personaldetails"
                        objectId={objectId}
                        modal
                        disabled={!isEdit}
                        handleFormSubmit={handleFormSubmit}
                        type="Emp"
                      />
                    ) : selectedForm === "contactDetails" ? (
                      <SettingForms
                        formService="contactdetails"
                        objectId={cobjectId}
                        modal
                        disabled={!isEdit}
                        type="Emp"
                      />
                    ) : selectedForm === "changePassword" ? (
                      <ChangePassword />
                    ) : selectedForm === "employeeDetails" ? (
                      <SettingForms
                        formService="employeeDetails"
                        objectId={emobjectId}
                        modal
                        type="Emp"
                      />
                    ) : selectedForm === "skills" ? (
                      <SettingForms
                        formService="skillsdetails"
                        objectId={skillobj}
                        modal
                        type="Emp"
                      />
                    ) : selectedForm === "bankdetails" ? (
                      <SettingForms
                        formService="bankdetails"
                        objectId={bankobj}
                        modal
                        type="Emp"
                      />
                    ) : selectedForm === "documents" ? (
                      <SettingForms
                        formService="documents"
                        modal
                        objectId={docobj}
                        type="Emp"
                      />
                    ) : selectedForm === "certification" ? (
                      <SettingForms
                        formService="certifications"
                        modal
                        objectId={certobj}
                        type="Emp"
                      />
                    ) : selectedForm === "educationaldetails" ? (
                      <SettingForms
                        formService="educationaldetails"
                        modal
                        objectId={eduobj}
                        type="Emp"
                      />
                    ) : selectedForm === "familyDetails" ? (
                      <SettingForms
                        formService="familydetails"
                        modal
                        objectId={famobj}
                        type="Emp"
                      />
                    ) : selectedForm === "jobHistory" ? (
                      <SettingForms
                        formService="jobhistory"
                        modal
                        objectId={jobobj}
                        type="Emp"
                      />
                    ) : null
                  }
                  buttonText="View"
                />
              )}
            </Card.Title>
            <Card.Body>
              {apiResponse && apiResponse.length > 0 ? (
                <>
                  <Card.Text>
                    <Row>
                      {fieldDetails.map((field) => {
                        const value =
                          apiResponse && apiResponse.length > 0
                            ? apiResponse[0][field.key]
                            : null;

                        const isDateField = field.key
                          .toLowerCase()
                          .includes("date");

                        const formattedValue =
                          isDateField && value
                            ? new Date(value).toLocaleString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : value;
                        if (value !== null) {
                          return (
                            <React.Fragment key={field.key}>
                              <Col
                                key={field.key}
                                xs={12}
                                md={6}
                                className="mb-0"
                              >
                                <div className="card-label mb-2 fs-5 fw-bolder lh-1_5 h1">
                                  <b>{field.label}</b>
                                </div>
                                <div className="card-value mb-4 fs-5 fw-normal lh-1_5 h2">
                                  {isDateField ? formattedValue : value}
                                </div>
                              </Col>
                            </React.Fragment>
                          );
                        }

                        return null;
                      })}
                    </Row>
                  </Card.Text>
                </>
              ) : (
                <div
                  className="d-flex justify-content-center rounded "
                  style={{ cursor: "pointer" }}
                >
                  <ModalForm
                    className="mb-4"
                    objectId={getObjectId(selectedForm)}
                    component={
                      selectedForm === "personaldetails" ? (
                        <SettingForms
                          formService="personaldetails"
                          objectId={objectId}
                          modal
                          disabled={!isEdit}
                          handleFormSubmit={handleFormSubmit}
                          type="Emp"
                        />
                      ) : selectedForm === "contactDetails" ? (
                        <SettingForms
                          formService="contactdetails"
                          objectId={cobjectId}
                          modal
                          disabled={!isEdit}
                          type="Emp"
                        />
                      ) : selectedForm === "changePassword" ? (
                        <ChangePassword />
                      ) : selectedForm === "employeeDetails" ? (
                        <SettingForms
                          formService="employeeDetails"
                          objectId={emobjectId}
                          modal
                          type="Emp"
                        />
                      ) : selectedForm === "skills" ? (
                        <SettingForms
                          formService="skillsdetails"
                          objectId={skillobj}
                          modal
                          type="Emp"
                        />
                      ) : selectedForm === "bankdetails" ? (
                        <SettingForms
                          formService="bankdetails"
                          objectId={bankobj}
                          modal
                          type="Emp"
                        />
                      ) : selectedForm === "documents" ? (
                        <SettingForms
                          formService="documents"
                          modal
                          objectId={docobj}
                          type="Emp"
                        />
                      ) : selectedForm === "certification" ? (
                        <SettingForms
                          formService="certifications"
                          modal
                          objectId={certobj}
                          type="Emp"
                        />
                      ) : selectedForm === "educationaldetails" ? (
                        <SettingForms
                          formService="educationaldetails"
                          modal
                          objectId={eduobj}
                          type="Emp"
                        />
                      ) : selectedForm === "familyDetails" ? (
                        <SettingForms
                          formService="familydetails"
                          modal
                          objectId={famobj}
                          type="Emp"
                        />
                      ) : selectedForm === "jobHistory" ? (
                        <SettingForms
                          formService="jobhistory"
                          modal
                          objectId={jobobj}
                          type="Emp"
                        />
                      ) : null
                    }
                    buttonText="Add"
                  />
                </div>
              )}
              <div
                className={
                  data !== "employeeDetails"
                    ? "d-flex justify-content-between ms-0"
                    : "d-flex justify-content-end ms-0"
                }
              >
                <Button
                  variant="primary"
                  onClick={handlePreviousCard}
                  className="me-2"
                  size="lg"
                  style={{ borderRadius: "30px" }}
                  hidden={data === "employeeDetails"}
                >
                  <span aria-hidden="true">&laquo;</span> Previous
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNextCard}
                  size="lg"
                  style={{ borderRadius: "30px" }}
                >
                  Next <span aria-hidden="true">&raquo;</span>
                </Button>
              </div>
            </Card.Body>
          </>
        </Card>
      );
    };
    // ...

    const fieldDetails = [
      { label: "Employee ID", key: "employee_id" },
      { label: "Citizenship", key: "d_citizenship" },
      { label: "Domicile", key: "d_domicile" },
      { label: "Birth Place", key: "birth_place" },
      { label: "Date of Birth", key: "date_of_birth" },
      { label: "Marital Status", key: "d_marital_status" },
      { label: "Religion", key: "d_religion" },
      { label: "Marriage Date", key: "marriage_date" },
    ];

    const contactDetails = [
      { label: "Mobile No", key: "work_no" },
      { label: "Personal E-Mail", key: "personal_email_id" },
      { label: "Present Address", key: "present_address" },
      { label: "Permanent Address", key: "permanent_address" },
      { label: "Relationship", key: "d_relationship_type" },
      { label: "Name", key: "contact_name" },
      { label: "Mobile No", key: "phone_no" },
      { label: "Address", key: "contact_address" },
    ];

    const EmployeeDetails = [
      { label: "Employee ID", key: "employee_code" },
      { label: "Employee Type", key: "d_employee_type" },
      { label: "Designation", key: "d_designation" },
      { label: "Department", key: "d_department" },
      { label: "Region", key: "d_region" },
      { label: "Gender", key: "d_gender" },
      { label: "Date of Joining", key: "date_of_joining" },
    ];
    const SkillDetails = [
      { label: "Category", key: "d_category" },
      { label: "Skill Name", key: "d_sub_category" },
      { label: "Title", key: "title" },
      { label: "Rating", key: "d_rating" },
      { label: "Experience", key: "experience" },

      // { label: "Experience", key: "exp" },
    ];

    const BankDetails = [
      { label: "Bank Name", key: "bank_name" },
      { label: "Account Number", key: "account_number" },
      { label: "IFSC Code", key: "ifsc_code" },
      { label: "Account Type", key: "d_account_type" },
      { label: "Branch Address", key: "branch_address" },
    ];

    const documents = [
      { label: "Document Type", key: "d_document_type" },
      { label: "Identification No", key: "id_number" },
      { label: "Upload Document(s)", key: "doc_attachment" },
      { label: "Expiry Date", key: "doc_expiry_date" },
    ];

    const certification = [
      { label: "Category", key: "d_cert_type" },
      { label: "Type", key: "d_cert_title" },
      { label: "Description", key: "cert_desc" },
      { label: "Upload Certificate", key: "upload_certificate" },
      { label: "Expiry Date", key: "expiry_date" },
    ];

    const educationDetails = [
      { label: "University Name", key: "university_name" },
      { label: "Institution/College Name", key: "college_name" },
      { label: "Qualification", key: "degree_type" },
      { label: "Specialization", key: "degree_specialization" },
      { label: "Year of Passing", key: "passed_year" },
      { label: "CGPA/Percentile", key: "marks_percentage" },
    ];

    const familyDetails = [
      { label: "Relationship", key: "d_relationship_type" },
      { label: "Name", key: "family_name" },
      { label: "Date Of Birth", key: "birth_date" },
      { label: "Gender", key: "d_family_gender" },
      { label: "Occupation", key: "occupation_type" },
      { label: "Mobile No.", key: "phone_no" },
      { label: "Address", key: "rel_address" },
    ];

    const ProfessionalDetails = [
      { label: "Organization", key: "employer_name" },
      { label: "Employment Type", key: "d_job_type" },
      { label: "Designation", key: "job_title" },
      { label: "Date of Joining", key: "date_of_joined" },
      { label: "Relieving Date", key: "relieving_date" },
      { label: "Experience(Years)", key: "job_tenure" },
      { label: "Last Drawn CTC", key: "last_ctc" },
      { label: "No Prior Experience", key: "no_prior_experience" },
    ];

    return (
      <>
        {data === "personaldetails" ||
        data === "contactDetails" ||
        data === "changePaasword" ||
        data === "employeeDetails" ||
        data === "skills" ||
        data === "certification" ||
        data === "bankdetails" ||
        data === "documents" ||
        data === "educationaldetails" ||
        data === "familyDetails" ||
        data === "jobHistory" ? (
          <Container>
            <Row
              className="justify-content-center  mt-3"
              style={{ width: "125%" }}
            >
              <Col style={{ marginRight: "20px", marginLeft: "0px" }}>
                {selectedForm === "personaldetails" && (
                  <div>
                    {!isEdit ? (
                      <CardDetails
                        title="Personal Details"
                        apiResponse={apiResponse}
                        fieldDetails={fieldDetails}
                        icon={faAddressCard}
                      />
                    ) : null}
                  </div>
                )}
                {selectedForm === "employeeDetails" && (
                  <div>
                    {!isEdit ? (
                      <CardDetails
                        title="Employee Details"
                        apiResponse={employeeResp}
                        fieldDetails={EmployeeDetails}
                        icon={faUser}
                      />
                    ) : null}
                  </div>
                )}
                {selectedForm === "contactDetails" && (
                  <div>
                    {!isEdit ? (
                      <CardDetails
                        title="Contact Details"
                        apiResponse={contactResp}
                        fieldDetails={contactDetails}
                        icon={faPhone}
                      />
                    ) : null}
                  </div>
                )}
                {selectedForm === "skills" && (
                  <div>
                    {!isEdit ? (
                      <Tabledetails
                        title="Skill Details"
                        apiResponse={skillResp}
                        fieldDetails={SkillDetails}
                        icon={faCogs}
                      />
                    ) : null}
                  </div>
                )}
                {selectedForm === "bankdetails" && (
                  <div>
                    {!isEdit ? (
                      <Tabledetails
                        title="Bank Details"
                        apiResponse={bankResp}
                        fieldDetails={BankDetails}
                        icon={faBank}
                      />
                    ) : null}
                  </div>
                )}
                {selectedForm === "documents" && (
                  <div>
                    {!isEdit ? (
                      <Tabledetails
                        title="Documents"
                        apiResponse={docResp}
                        fieldDetails={documents}
                        icon={faFile}
                      />
                    ) : null}
                  </div>
                )}
                {selectedForm === "certification" && (
                  <div>
                    {!isEdit ? (
                      <Tabledetails
                        title="Certifications"
                        apiResponse={certResp}
                        fieldDetails={certification}
                        icon={faCertificate}
                      />
                    ) : null}
                  </div>
                )}
                {selectedForm === "educationaldetails" && (
                  <div>
                    {!isEdit ? (
                      <Tabledetails
                        title="Education Details"
                        apiResponse={eduResp}
                        fieldDetails={educationDetails}
                        icon={faGraduationCap}
                      />
                    ) : null}
                  </div>
                )}
                {selectedForm === "familyDetails" && (
                  <div>
                    {!isEdit ? (
                      <Tabledetails
                        title="Dependent Information"
                        apiResponse={famResp}
                        fieldDetails={familyDetails}
                        icon={faUsers}
                      />
                    ) : null}
                  </div>
                )}
                {selectedForm === "jobHistory" && (
                  <div>
                    {!isEdit ? (
                      <Tabledetails
                        title="Professional Experience"
                        apiResponse={jobResp}
                        fieldDetails={ProfessionalDetails}
                        icon={faBriefcase}
                      />
                    ) : null}
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        ) : (
          <>
            <Button
              variant="primary"
              onClick={toggleShow}
              className="ms-auto text-end me-2 mb-2"
            >
              {buttonText}
            </Button>

            <Offcanvas
              show={show}
              onHide={handleClose}
              backdrop="static"
              {...props}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>{canvasTitle}</Offcanvas.Title>
              </Offcanvas.Header>

              <Offcanvas.Body>
                {/* <Skills id={id} /> */}
                {type}
              </Offcanvas.Body>
            </Offcanvas>
          </>
        )}
      </>
    );
  };

  let componentToReader,
    title,
    tableColumns,
    reportToRender,
    viewName,
    viewParams;
  switch (data) {
    case "personaldetails":
      componentToReader = null;
      break;
    case "contactDetails":
      componentToReader = null;
      break;
    case "employeeDetails":
      componentToReader = null;
      break;
    case "skills":
      title = "Skills";

      componentToReader = (
        <SettingForms formService="skillsdetails" objectId={-1} />
      );

      break;

    case "documents":
      componentToReader = (
        <SettingForms formService="documents" objectId={-1} />
      );
      title = "Documents";

      break;

    case "bankdetails":
      title = "Bank Details";
      componentToReader = (
        <SettingForms formService="bankdetails" objectId={-1} />
      );

      break;

    case "jobHistory":
      componentToReader = (
        <SettingForms formService="jobhistory" objectId={-1} />
      );
      title = "Professional Experience";

      break;

    case "references":
      componentToReader = (
        <SettingForms formService="references" objectId={-1} />
      );
      title = "References";

      break;

    case "educationaldetails":
      componentToReader = (
        <SettingForms formService="educationaldetails" objectId={-1} />
      );
      title = "Educational Details";

      break;

    case "certification":
      componentToReader = (
        <SettingForms formService="certifications" objectId={-1} />
      );
      title = "Certifications";

      break;

    case "familyDetails":
      componentToReader = (
        <SettingForms formService="familydetails" objectId={-1} />
      );
      title = "Family Details";

      break;

    case "emergencyContactDetails":
      componentToReader = (
        <SettingForms formService="econtactdetails" objectId={-1} />
      );
      title = "Emergency Contact Details";

      break;
    case "changePaasword":
      componentToReader = null;

      break;
    case "separationRequest":
      componentToReader = (
        <SettingForms formService="separationrequest" objectId={-1} />
      );
      title = "Separation Request";
      reportToRender = <ReportRuntime report="SEPARATION_REQUEST" />;
      break;
    default:
      componentToReader = null;
      break;
  }

  const tabObjectIds = {
    employeeDetails: emobjectId,
    personaldetails: objectId,
    contactDetails: cobjectId,
    bankdetails: bankobj,
    skills: skillobj,
    documents: docobj,
    jobHistory: jobobj,
    educationaldetails: eduobj,
    certification: certobj,
    familyDetails: famobj,
  };

  return (
    <>
      <React.Fragment>
        <Helmet title="Settings" />
        <Container
          fluid
          className="justify-content-center p-4"
          style={{ width: "100%" }}
        >
          <Row>
            <Row className="md-5 ">
              <Navigation
                checkWhichButtonClicked={checkWhichButtonClicked}
                objectIds={tabObjectIds}
              />
            </Row>

            <Col md="10">
              <Col xs="auto" className="ms-auto  mt-n1">
                <OffCanvasForm
                  placement="end"
                  buttonText={
                    <span>
                      <FontAwesomeIcon icon={faPlus} /> Add {title}
                    </span>
                  }
                  canvasTitle={`Add ${title}`}
                  type={componentToReader}
                />
              </Col>

              {reportToRender}
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    </>
  );
}

export default Settings;
