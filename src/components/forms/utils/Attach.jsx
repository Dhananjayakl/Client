import React, { useState, useEffect } from "react";
import { Field } from "formik";
import { Form, Button, ProgressBar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faTrash,
  faDownload,
  faUpload,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import FieldDom from "./FieldDom";
import axios from "src/utils/AxiosInstance";

function Attach(props) {
  const [file, setFile] = useState(null);
  const [del, setdel] = useState(true);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const {
    fieldDef,
    label,
    name,
    options,
    helptext,
    tooltip,
    required,
    visible,
    disabled,
    ...rest
  } = props;

  // useEffect(() => {
  //   const fetchUploadedFiles = async () => {

  //     try {
  //       const response = await axios.get( );
  //       setUploadedFiles(response.data);
  //       console.log("hello",response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchUploadedFiles();
  // }, []);

  useEffect(() => {
    const uploadFile = async () => {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const response = await axios.post(
            "/attachment/upload?moduleId=1&formId=1&objectId=1&regionCode=1&multiRowRecId=1&fieldName=1",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (event) => {
                console.log(event, "event loaded");
                const progress = Math.round((100 * event.loaded) / event.total);
                // console.log(progress,"see progress");
                setUploadProgress({ [file.name]: progress });
                console.log(uploadProgress, "upload progress");
              },
            }
          );
          if (response.status == 200) {
            props.setFieldValue(
              name,
              response.data.attachmentId + "#" + response.data.originalName
            );
          }
          setUploadedFiles([
            {
              attachmentId: response.data.attachmentId,
              fileName: response.data.originalName,
            },
          ]);
          console.log(response);
        } catch (error) {
          console.log(error);
          if (error.response.status == 500)
            setUploadError("Incorrect File Format.");
        }
      }
    };

    uploadFile();
  }, [file]);
  const downloadFile = async (file) => {
    const { attachmentId, fileName } = file;
    try {
      const response = await axios.get(`/attachment/${attachmentId}`, {
        responseType: "blob",
      });
      const href = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      console.log(response);
      const inputField = document.getElementById("inputGroupFile");
      if (inputField) {
        inputField.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFile = async (attachmentId) => {
    setdel(false);
    props.setFieldValue(name, "");

    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.attachmentId !== attachmentId)
    );
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
    setFile(selectedFiles[0]);
  };

  useEffect(() => {
    if (Object.keys(uploadProgress).length > 0) {
      const completedFiles = Object.entries(uploadProgress).filter(
        ([_, progress]) => progress === 100
      );
      if (completedFiles.length > 0) {
        const completedFileNames = completedFiles.map(([fileName]) => fileName);
        setUploadProgress((prevProgress) => {
          const newProgress = { ...prevProgress };
          completedFileNames.forEach((fileName) => {
            delete newProgress[fileName];
          });
          return newProgress;
        });
      }
    }
  }, [uploadProgress]);
  return (
    <Field name={name}>
      {({ field, form: { touched, errors }, meta }) => {
        let fieldFile = field.value;
        // console.log("From Attachments: ",field,meta);
        useEffect(() => {
          let isMounted = true;
          if (isMounted && fieldFile) {
            const [attachmentId, fileName] = fieldFile.split("#");
            setUploadedFiles([
              {
                attachmentId: parseInt(attachmentId),
                fileName,
              },
            ]);
          }
          return () => {
            isMounted = false;
          };
        }, [fieldFile]);
        // const [attachmentId, fileName] = fieldFile.split("#");
        //  setUploadedFiles(
        //    [
        //      {
        //        attachmentId: parseInt(attachmentId),
        //          fileName,
        //      },
        //    ] )
        return (
          <div>
            <FieldDom {...props} {...meta}>
              {!disabled && (
                <div
                  className={`file-field ${isDragging ? "dragging" : ""}`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragEnter}
                  onDrop={handleDrop}
                >
                  {isDragging ? (
                    <div className="d-flex justify-content-center">
                      <input
                        disabled
                        className="border border-primary rounded text-center w-100 p-3 m-1"
                        placeholder="Drop your files here"
                      />
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center">
                      <input
                        disabled
                        className="border border-primary rounded text-center w-100 p-3 m-1 "
                        placeholder="Drag a file here or Click below to Add a File"
                      />
                    </div>
                  )}
                </div>
              )}
              {/* <div style={{ position: 'relative', }}> */}

              <div className="d-flex justify-content-center">
                {/* The "Choose file" icon */}

                {/* The "Choose file" text */}
                {/* <span
                  // className={`position-absolute top-0 left-0 right-0 bottom-0 display-flex  align-items-center justify-content-center text-dark bg-primary`}
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 1,
                    fontSize: '16px',
                    color: '#0084f8',
                    backgroundColor: '#fff',
                    border: '1px solid #ced4da',
                    borderRadius: '0.25rem',
                    padding: '0.375rem 0.75rem',
                    cursor: 'pointer',
                  }}
                  > 
                   */}

                {/* <FontAwesomeIcon icon={faFolder} className="me-2" />Choose file</span> */}
              </div>
              <Form.Control
                size="lg"
                type="file"
                aria-label="Upload File"
                disabled={disabled}
                className={
                  required &&
                  "bg-white text-white border-start border-primary border-4"
                }
                isInvalid={Boolean(touched[name] && errors[name])}
                // accept=".pdf,.doc,.docx,.txt"
                onChange={(event) => {
                  setUploadError("");
                  setdel(true);
                  const selectedFile = event.target.files[0];
                  setFile(selectedFile); // Set the selected file
                  event.target.value = null;
                }}
              />

              {del && uploadError && (
                <div className="text-danger p-1">
                  <p>{uploadError}</p>
                </div>
              )}
              {/* </div> */}

              {Object.keys(uploadProgress).length > 0 &&
                Object.entries(uploadProgress).map(([fileName, progress]) => (
                  <div key={fileName} className="mt-2">
                    <div>{fileName}</div>
                    <ProgressBar now={progress} label={`${progress}%`} />
                  </div>
                ))}
              <br></br>
              {uploadedFiles.length > 0 && (
                <ul className="list-group">
                  {uploadedFiles.map((uploadedFile) => (
                    <li
                      key={fieldFile}
                      className="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div className="d-flex flex-grow-1">
                        <FontAwesomeIcon icon={faFile} className="me-2 ms-2" />
                        <a
                          onClick={() => downloadFile(uploadedFile)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="me-2"
                        >
                          {uploadedFile.fileName}
                        </a>
                      </div>

                      <div className="ms-2">
                        {!disabled && (
                          <Button
                            onClick={() => {
                              deleteFile(uploadedFile.attachmentId);
                            }}
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
                          onClick={() => downloadFile(uploadedFile)}
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {fieldFile && (
                <ul>
                  {/* <li>
<div>
<div>{fieldFile}</div>
<FontAwesomeIcon icon={faFile} className="me-2 ms-2" />
</div>  
</li> */}
                </ul>
              )}
            </FieldDom>
            <div>{/* <h3>{fieldFile}</h3> */}</div>
          </div>
        );
      }}
    </Field>
  );
}
export default Attach;
