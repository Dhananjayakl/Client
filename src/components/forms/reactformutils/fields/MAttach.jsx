import React, { useState, useEffect, useRef, useId } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Form,
  Button,
  ProgressBar,
  Row,
  Col,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Modal,
  ModalTitle,
  ModalBody,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faFileUpload,
  faTrash,
  faDownload,
  faXmark,
  faUpload,
  faPlus,
  faEllipsis,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import FieldDom from "./FieldDom";
import axios from "src/utils/AxiosInstance";
import { useTranslation } from "react-i18next";
function MAttach(props) {
  //console.log(props, "mattach props");

  const [files, setFiles] = useState([]);
  // holds the files that the user has selected
  const { setValue, getValues } = props.formMethods;
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState();
  const [uploadError, setUploadError] = useState(null);
  const [modalFlag, setModalFlag] = useState(false);
  const [multiToggle, setMultiToggle] = useState(false);
  const [del, setdel] = useState(true);
  const [fields, setfield] = useState("");
  const [uploadProgress, setUploadProgress] = useState({}); //upload progress of each file
  const [uploadedFiles, setUploadedFiles] = useState([]); //contains the info o fthe files that have beeen uploaded succesfully
  const [isDragging, setIsDragging] = useState(false); // returns true if theh user drags
  const [tooltipShow, setTooltipShow] = useState(false);
  const controllerRef = useRef(new AbortController());
  const [showMessage, setShowMessage] = useState(false);

  const attachRef = useRef("");
  // const [fields, setfield] = useState("");
  const AttachRef = useRef(null);
  const [hasRunEffect, setHasRunEffect] = useState(false);
  const {
    name,
    label,
    control,
    options,
    helptext,
    tooltip,
    required,
    visible,
    formMethod,
    disableDates,
    leaveType,
    gender,
    selectedDate,
    setClear,
    userId,
    workday,
    field_title,
    editable,
    disabled,
    fieldDef,
    formMetaData,
    icon,
    setformdata,
    ...rest
  } = props;
  // console.log(successMessage, showMessage, "show message");
  console.log(props, name, "ps5");
  const { t } = useTranslation("common");
  const [disable, setDisable] = useState(disabled);

  //console.log(disable, "disable is here");

  const uniqueId = useId();
  const pagepath = window.parent.location.pathname;
  //console.log(fieldDef, name, icon, "attachfiles");
  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };
  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };
  const moduleId = formMetaData?.module_id
    ? formMetaData.module_id
    : props?.formMetaData?.formmeta?.module_id;

  const formId = props?.formMetaData?.formmeta?.form_id
    ? props.formMetaData.formmeta.form_id
    : formMetaData.formName;
  const fieldName = name;
  const regionCode = props?.fieldDef?.region_code
    ? props?.fieldDef?.region_code
    : "NOREGION";
  const objectId =
    formMethod.getValues("objectId") > 0
      ? formMethod.getValues("objectId")
      : -1;
  useEffect(() => {
    const uploadFile = async () => {
      setModalFlag(false);
      const { signal } = controllerRef.current;
      const uploadPromises = files.map((file) => {
        //it triggers only when the user selecetd the file or if the file is changed
        const uniqueFilename = `${file.name} `; // Generate a unique filename
        const formData = new FormData();
        formData.append("file", file, file.name); // Use the unique filename in the form data
        if(setformdata){
        setformdata(file);
        }

        return axios
          .post(
            `/attachment/upload?moduleId=${moduleId}&formId=${formId}&objectId=${objectId}&regionCode=${regionCode}&multiRowRecId=${regionCode}&fieldName=${fieldName}`,
            formData, //the formdata is sent here to post in the server
            {
              headers: {
                "Content-Type": "multipart/form-data", // it tells to the server that i am sending a multipart/form-data
              },
              onUploadProgress: (event) => {
                // console.log(event, "event cancel");
                if (fieldDef.display_type == "singleattach") {
                  setDisable(true);
                }
                // this is an option provided by  the axios server
                const progress = Math.round((100 * event.loaded) / event.total); // by the properties of the event i am calculating the loaded and total
                setUploadProgress((prevProgress) => ({
                  ...prevProgress,
                  [uniqueFilename]: progress, // it holds the previous progress state along with the uniquefilename and the progress
                }));
              },
              signal,
            }
          )
          .then((response) => {
            uploadSuccess(response);

            // console.log(response, "upload response");
            const currentFileNames = fields ? fields : [];
            // Get the current file names as an array

            const newFileName =
              response.data.attachmentId + "#" + response.data.originalName;

            const updatedFileNames = [...currentFileNames, newFileName];

            // when the file is uploaded to the server successfully
            // console.log("value of field",props.form.values[name])
            if (fieldDef.display_type == "singleattach") {
              setValue(name, updatedFileNames.join(","));
            } else {
              setValue(name, updatedFileNames);
            }

            // for the field i am setting the value
            //console.log("Updated uploaded files:", uploadedFiles);
            setUploadedFiles((prevFiles) => [
              ...prevFiles,
              {
                attachmentId: response.data.attachmentId,
                fileName: response.data.originalName,
                fileSize: Math.round(response.data.fileSize / 1024),
                uploadedBy: response.data.uploadedBy,
                uploadedOn: response.data.uploadedOn,
              },
            ]);
            setMultiToggle(false);
            // due to the asynchronous state if i console log outside the use effect it will shouw the old values
          })
          .catch((err) => {
            console.log(err);
            // console.log(err, "errors are here");
            if (err.response.status == 500) {
              setUploadError(
                "The file you have uploaded appears to be corrupted or unreadable. Please check the file and try uploading again"
              );
            }
            if (err.response.status == 403)
              setUploadError(
                "File upload failed. Please check the file Format.."
              );
            if (err.response.status == 400)
              setUploadError(
                "File upload failed. Please check the file Format.."
              );
          });
      });

      try {
        await Promise.all(uploadPromises); // represents the individual file uploads
      } catch (error) {
        console.log(error);
      }
    };

    if (files.length > 0) {
      uploadFile(); // Call the function to initiate the upload
    }
  }, [files]);
  // console.log(uploadedFiles, "upc");

  const downloadFile = async (file) => {
    const { attachmentId, fileName } = file;

    try {
      await axios
        .get(`/attachment/${attachmentId}`, { responseType: "blob" }) //passing the attachment id
        .then((response) => {
          const href = URL.createObjectURL(response.data); //temprovary url is generated

          const link = document.createElement("a"); //this i sused to trigger download
          link.href = href;
          link.setAttribute("download", fileName); //suggest the browser for the download
          document.body.appendChild(link); // anchor is appended to the doc body
          link.click(); //

          document.body.removeChild(link);
          URL.revokeObjectURL(href);
          // console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });

      const inputField = document.getElementById("inputGroupFile");
      if (inputField) {
        inputField.value = " ";
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteFile = async (attachmentId) => {
    setdel(false);
    // Remove the file from the uploadedFiles array
    const updatedFiles = uploadedFiles.filter(
      (file) => file.attachmentId !== attachmentId
    );
    // Update the form field value with the updated file list
    const updatedFileNames = updatedFiles.map(
      (file) => `${file.attachmentId}#${file.fileName}`
    );
    console.log(updatedFileNames, "updated file names");

    if (fieldDef.display_type == "singleattach") {
      setValue(name, updatedFileNames.join(","));
    } else {
      setValue(name, updatedFileNames);
    }

    // Update the uploadedFiles state with the updated files
    setUploadedFiles(updatedFiles);
    try {
      axios
        .delete(`attachment/${attachmentId}`)
        .then((response) => {
          //console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const selectedFiles = Array.from(event.dataTransfer.files);
    setFiles(selectedFiles);
  };

  useEffect(() => {
    if (Object.keys(uploadProgress).length > 0) {
      const completedFiles = Object.entries(uploadProgress).filter(
        ([_, progress]) => progress === 100
      ); //This creates an array of [filename, progress] pairs for files that have completed uploading (progress is 100)
      if (completedFiles.length > 0) {
        const completedFileNames = completedFiles.map(([fileName]) => fileName); // completed file names
        setUploadProgress((prevProgress) => {
          //here new upload prgoress suppose if the file is uploaded then they are deleted
          const updatedProgress = { ...prevProgress };
          completedFileNames.forEach((fileName) => {
            delete updatedProgress[fileName];
          });
          return updatedProgress;
        });
        setUploadedFiles(
          (prevFiles) =>
            prevFiles.filter(
              (file) => !completedFileNames.includes(file.fileName)
            ) // here i am updating the filenames by filtering the completed file names
        );
      }
    }
  }, [uploadProgress]);
  // console.log(AttachRef.current, "attachref");
  // console.log(uploadedFiles, "uploaded files");
  let uploadClick = () => {
    setModalFlag(true);
  };
  //console.log(modalFlag, "modal flag for attach");
  let uploadSuccess = (response) => {
    if (response) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 1000); // 2000 milliseconds = 2 seconds

      return () => clearTimeout(timer); // Cleanup the timer
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required && editable,
          message: `${t(props.field_title)}  ${t("is required")}!`,
        },
      }}
      render={({ field, fieldState, formState }) => {
        console.log(field.value, "attachment file");

        setfield(field.value);
        let message;
        if (fieldState) {
          message = fieldState.error;
        }
        // console.log(fieldState, "attach field state");

        // setfield(field.value);

        useEffect(() => {
          if (!hasRunEffect && field.value) {
            // Execute this block only once when the component mounts and if fields exist
            let fileEntries;
            if (
              fieldDef?.display_type == "singleattach" ||
              props.type == "singleattach"
            ) {
              fileEntries = field.value.split(",");
            } else if (
              fieldDef?.display_type == "multiattach" ||
              props.type == "multiattach"
            ) {
              fileEntries = field.value;
            } else {
              fileEntries = field.value.split(",");
            }

            //console.log(fileEntries, "upc");

            let parsedFiles = fileEntries.map((entry) => {
              const [attachmentId, fileName] = entry.split("#");
              return {
                attachmentId: parseInt(attachmentId),
                fileName,
                fileSize: uploadedFiles.find(
                  (item) => item.attachmentId == attachmentId
                )?.fileSize,
                uploadedBy: uploadedFiles.find(
                  (item) => item.attachmentId == attachmentId
                )?.uploadedBy,
                uploadedOn: uploadedFiles.find(
                  (item) => item.attachmentId == attachmentId
                )?.uploadedOn,
              };
            });
            // console.log(parsedFiles, "parsed files");

            setUploadedFiles(parsedFiles);
            setMultiToggle(false);

            // Set the flag to true so the effect won't run again
            setHasRunEffect(true);
          }
        }, [fields, hasRunEffect]);
        const toggler = () => {
          setMultiToggle(true);
        };
        useEffect(() => {
          if (
            multiToggle == true &&
            document.getElementById("inputGroupFile")?.click()
          ) {
            document.getElementById("inputGroupFile").click();
          }
        }, [multiToggle]);

        let fileType = "pdf,xls,doc";
        let hoverHandle = () => {
          setTooltipShow(true);
          //console.log(e, "test hover");
        };
        useEffect(() => {
          //console.log(disabled, uploadedFiles, fields, "miles");
          if (
            disabled == false &&
            uploadedFiles.length > 0 &&
            fieldDef.display_type == "singleattach"
          ) {
            // console.log("inside the disable true");
            setDisable(true);
          } else {
            setDisable(disabled);
          }
        }, [uploadedFiles, disabled, fields]);
        //console.log(disable, "field disable");

        // console.log(uploadProgress, "upload progress");
        const handleCancel = () => {
          controllerRef.current.abort(); // Cancel the request
          controllerRef.current = new AbortController();
          setDisable(false);
          // Reset the controller for potential future uploads
          setUploadProgress({});
        };
        //console.log(uploadProgress, "progress bar");
        useEffect(() => {
          Object.entries(uploadProgress).map(([fileName, progress]) => {
            if (progress == "100" && fieldDef.display_type == "singleattach") {
              setDisable(false);
            } else if (
              progress != "100" &&
              fieldDef.display_type == "singleattach"
            ) {
              setDisable(true);
            }
          });
        }, [uploadProgress]);

        return (
          <div>
            <FieldDom {...props} {...fieldState}>
              {(editable && uploadedFiles.length == 0) ||
              (!editable &&
                regionCode != "NOREGION" &&
                uploadedFiles.length > 0) ||
              (uploadedFiles.length > 0 && editable) ||
              formMetaData.designer == true ? (
                <>
                  <div
                    className=""
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <label
                      htmlFor={`inputGroupFile${name}`}
                      className="w-100 h-100 btn mt-0 pt-0"
                    >
                      <>
                        <Row>
                          <Col
                            className={
                              message && required && uploadedFiles.length == 0
                                ? "form-control border-danger"
                                : "form-control"
                            }
                          >
                            <Row>
                              {/* <Col
                                xs={2}
                                className="d-flex justify-content-center align-items-center  p-1"
                              >
                                <p>Files Accepted:{fieldDef.file_type}</p>
                              </Col> */}
                              <Col>
                                <Row>
                                  <Col className="d-flex align-items-start">
                                    <FontAwesomeIcon
                                      icon={faUpload}
                                      size="1.5x"
                                      className="p-1"
                                      style={{ color: "#007aff" }}
                                    />
                                    {showMessage && (
                                      <Row className="d-flex m-0 p-0 w-100">
                                        <Col xs={8} className=" m-0 p-0">
                                          <span
                                            className=""
                                            style={{ fontSize: "10px" }}
                                          >
                                            {t("Upload SuccessFull")}
                                          </span>
                                        </Col>
                                        {!showMessage && (
                                          <Col className=" m-0 p-0">
                                            <span
                                              className=""
                                              style={{ fontSize: "10px" }}
                                            >
                                              {t("Uploaded")} (
                                              {uploadedFiles.length})
                                            </span>
                                          </Col>
                                        )}
                                      </Row>
                                    )}
                                    {regionCode != "NOREGION" &&
                                      !editable &&
                                      uploadedFiles.length > 0 && (
                                        <span className="ps-2 text-start">
                                          {t("File Uploaded")}
                                          <br></br>
                                          {t("Uploaded")} (
                                          {uploadedFiles.length}) {t("Files")}
                                        </span>
                                      )}

                                    {(formMetaData?.designer == true ||
                                      disable == false) &&
                                      !showMessage && (
                                        <Row className="d-flex m-0 p-1 w-100">
                                          <Col className=" m-0 p-0">
                                            <span
                                              className=""
                                              style={{ fontSize: "10px" }}
                                            >
                                              {t("Uploaded")} (
                                              {uploadedFiles.length})
                                            </span>
                                          </Col>
                                        </Row>
                                      )}
                                    {disable == true &&
                                      editable &&
                                      !showMessage && (
                                        <Row className="d-flex m-0 p-0 w-100">
                                          <Col xs={8} className=" m-0 p-0">
                                            <span
                                              className="m-0 p-0"
                                              style={{ fontSize: "12px" }}
                                            >
                                              {t("File Upload Limit Reached")}
                                            </span>
                                          </Col>
                                          <Col className=" m-0 p-0">
                                            <span
                                              className=""
                                              style={{ fontSize: "10px" }}
                                            >
                                              {t("Uploaded")} (
                                              {uploadedFiles.length})
                                            </span>
                                          </Col>
                                        </Row>
                                      )}
                                  </Col>
                                </Row>
                              </Col>
                              {uploadedFiles.length > 0 &&
                                regionCode != "NOREGION" && (
                                  <Col
                                    className="p-0 m-0 d-flex justify-content-center align-items-center"
                                    xs={1}
                                  >
                                    <Button
                                      className="me-3"
                                      onClick={uploadClick}
                                    >
                                      <FontAwesomeIcon
                                        icon={faFile}
                                        className="m-0 p-0"
                                      />
                                    </Button>
                                  </Col>
                                )}
                              {/* <Col
                                xs={2}
                                className="d-flex-align-items-end justify-content-end m-0 p-1"
                              >
                                <p>
                                  Max Files Allowed:
                                  {fieldDef.display_type == "singleattach"
                                    ? 1
                                    : 2}
                                </p>
                              </Col> */}
                              {/* <Col xs={1}>Max File Size:</Col> */}
                            </Row>
                            {/* drag and drop here or click here to upload */}
                          </Col>
                        </Row>
                      </>
                    </label>

                    <Row className="">
                      <Col xs={3}>
                        <Form.Control
                          style={{
                            position: "absolute", // Position absolutely to place it behind the label
                            top: 0,
                            left: 0,
                            width: "87%",
                            height: "100%",
                            opacity: 0,
                            // visibility: "hidden", // Hide native tooltip and label
                          }}
                          id={`inputGroupFile${name}`}
                          size="lg"
                          type="file"
                          // multiple={
                          //   !fieldDef?.display_type == "singleattach"
                          //     ? false
                          //     : true
                          // }
                          title="" // This removes the default tooltip
                          // accept={fieldDef.file_type}
                          ref={attachRef}
                          className={required && "mandatory"}
                          disabled={disable}
                          isInvalid={message && !field.value ? true : false}
                          onChange={(event) => {
                            setUploadError("");
                            setdel(true);
                            const selectedFiles = Array.from(
                              event.target.files
                            );
                            // console.log(event, selectedFiles, "targeted files");
                            if (selectedFiles?.length > 0) {
                              selectedFiles.map((items) => {
                                if (items.name.includes(",")) {
                                  setUploadError(
                                    "Invalid file name. File name should not include (,)"
                                  );
                                }
                                if (!items.name.includes(",")) {
                                  setFiles(selectedFiles);
                                }
                              });
                            }

                            event.target.value = null;
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                </>
              ) : (
                !editable && uploadedFiles?.length == 0 && <span>--</span>
              )}
              {del && uploadError && (
                <div className="text-danger p-1">
                  <p>{uploadError}</p>
                </div>
              )}
              {message && required && uploadedFiles.length == 0 && (
                <div className="text-danger p-1">
                  <p>
                    {t(field_title)} {t("is Required!")}
                  </p>
                </div>
              )}
              {/* {disable == true && editable && (
                <div>Max Number of File Uploads Reached</div>
              )} */}
              {uploadedFiles.length > 0 && regionCode == "NOREGION" && (
                <ul className="list-group">
                  {uploadedFiles.map((file, index) => (
                    <ul
                      key={index}
                      className="border p-0"
                      // style={{ width: "100%", height: "40px" }}
                    >
                      <Row className="">
                        <Col className="d-flex">
                          <div className="d-flex flex-grow-1">
                            <FontAwesomeIcon
                              icon={faFile}
                              className="me-2 ms-2 mt-2"
                            />
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="button-tooltip-2">
                                  {file.fileName}
                                </Tooltip>
                              }
                            >
                              <a
                                onMouseEnter={() => hoverHandles(file.fileName)}
                                onClick={
                                  disabled ? null : () => downloadFile(file)
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`me-2 mt-1 ${
                                  disabled ? "text-muted" : ""
                                }`}
                              >
                                <div>
                                  {file?.fileName?.length > 50
                                    ? `${file.fileName.substring(0, 50)}...`
                                    : file.fileName}
                                </div>
                              </a>
                            </OverlayTrigger>
                          </div>

                          {!disabled && editable && (
                            <Button
                              onClick={() => deleteFile(file.attachmentId)}
                              variant="light"
                              className="me-2"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          )}

                          <Button
                            variant="light"
                            onClick={() => downloadFile(file)}
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </Button>
                        </Col>
                      </Row>
                      {/* <Row className="m-0 p-0">
                        <Col className="m-0 p-0">
                          <Row className="p-0 m-0">
                            <Col>
                              <span
                                className="p-0 m-0 text-muted"
                                style={{ fontSize: "12px" }}
                              >
                                Uploaded By:{file.uploadedBy}
                              </span>
                            </Col>
                            <Col>
                              <span
                                className="text-muted p-0 m-0"
                                style={{ fontSize: "12px" }}
                              >
                                Uploaded On:{file.uploadedOn}
                              </span>
                            </Col>
                            <Col>
                              <span
                                className="text-muted p-0 m-0"
                                style={{ fontSize: "12px" }}
                              >
                                Size:{file.fileSize}kb
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row> */}
                    </ul>
                  ))}
                </ul>
              )}
              {uploadedFiles.length > 0 && regionCode != "NOREGION" && (
                <>
                  <Modal show={modalFlag}>
                    <ModalTitle className="d-flex ms-2 mt-2">
                      <Row className="w-100">
                        <Col>
                          <h4> {t("Uploaded Files")}</h4>
                        </Col>
                        <Col className="d-flex align-items-end justify-content-end m-0 p-0">
                          <Button
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                            onClick={() => setModalFlag(false)}
                          >
                            <FontAwesomeIcon
                              icon={faXmark}
                              size="3.5x"
                              className="transparent"
                              style={{ color: "black" }}
                            />
                          </Button>
                        </Col>
                      </Row>
                    </ModalTitle>
                    <ModalBody>
                      <ul className="list-group">
                        {uploadedFiles.map((file, index) => (
                          <ul
                            key={index}
                            className="border p-1"
                            // style={{ width: "100%", height: "40px" }}
                          >
                            <Row className="p-0 m-0">
                              <Col className="d-flex">
                                <div className="d-flex flex-grow-1">
                                  <FontAwesomeIcon
                                    icon={faFile}
                                    className="me-2 ms-2 mt-2"
                                  />
                                  <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                      <Tooltip id="button-tooltip-2">
                                        {file.fileName}
                                      </Tooltip>
                                    }
                                  >
                                    <a
                                      onClick={
                                        disabled
                                          ? null
                                          : () => downloadFile(file)
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`me-2 mt-1 ${
                                        disabled ? "text-muted" : ""
                                      }`}
                                    >
                                      <div>
                                        {file.fileName.length > 50
                                          ? `${file.fileName.substring(
                                              0,
                                              50
                                            )}...`
                                          : file.fileName}
                                      </div>
                                    </a>
                                  </OverlayTrigger>
                                </div>
                                {/* {(!editable || editable) &&
                            fieldDef.field_type === "6" && (
                              <Button variant="light" onClick={toggler}>
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            )} */}
                                {!disabled && editable && (
                                  <Button
                                    onClick={() =>
                                      deleteFile(file.attachmentId)
                                    }
                                    variant="light"
                                  >
                                    <FontAwesomeIcon
                                      style={{ color: "black" }}
                                      icon={faTrash}
                                    />
                                  </Button>
                                )}
                                <Button
                                  variant="light"
                                  onClick={() => downloadFile(file)}
                                >
                                  <FontAwesomeIcon icon={faDownload} />
                                </Button>
                              </Col>
                            </Row>
                          </ul>
                        ))}
                      </ul>
                    </ModalBody>
                  </Modal>
                </>
              )}

              {Object.keys(uploadProgress).length > 0 && (
                <ul className="list-group">
                  {Object.entries(uploadProgress).map(
                    ([fileName, progress]) => (
                      <li key={fileName} className="list-group-item w-100">
                        <Row className="d-flex align-items-center">
                          <Col
                            className="d-flex justify-content-between align-items-start p-0"
                            sm={11}
                          >
                            <span className="ms-2">{fileName}</span>
                            <Button
                              variant="link"
                              className="p-0 ms-2"
                              onClick={handleCancel}
                            >
                              <FontAwesomeIcon
                                icon={faClose}
                                className="m-0 p-0"
                              />
                            </Button>
                          </Col>
                        </Row>
                        <Row className="mt-1">
                          <Col>
                            <ProgressBar
                              now={progress}
                              label={`${progress}%`}
                            />
                          </Col>
                        </Row>
                      </li>
                    )
                  )}
                </ul>
              )}
            </FieldDom>
          </div>
        );
      }}
    />
  );
}

export default MAttach;
