import React, { useState, useEffect } from "react";
// import { Field } from "formik";
import { useForm, Controller } from "react-hook-form";
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
export const downloadFile = async (file) => {
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

function Attach(props) {
  const { setValue, getValues } = props.formMethods;
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(false); // Initialize as false
  // const [uploadedFile, setUploadedFile] = useState([]); // Initialize as an empty array

  const {
    fieldDef,
    control,
    label,
    name,
    options,
    helptext,
    tooltip,
    required,
    visible,
    isMulti,
    disabled,
    field_title,
    formMetaData,
    ...rest
  } = props;

  const pagepath = window.parent.location.pathname;
  const moduleId = props.formMetaData.formmeta.module_id;
  const formId = props.formMetaData.formmeta.form_id;
  const fieldName = props.fieldDef.field_name;
  const regionCode = props.fieldDef.region_code;
  const objectId =
    formMethods.getValues("objectId") > 0
      ? formMethods.getValues("objectId")
      : -1;
  useEffect(() => {
    const uploadFile = async () => {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const response = await axios.post(
            `/attachment/upload?moduleId=${moduleId}&formId=${formId}&objectId=${objectId}&regionCode=${regionCode}&multiRowRecId=${regionCode}&fieldName=${fieldName}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (event) => {
                const progress = Math.round((100 * event.loaded) / event.total);
                setUploadProgress({ [file.name]: progress });
              },
            }
          );
          setValue(
            name,
            response.data.attachmentId + "#" + response.data.originalName
          );

          setUploadedFiles([
            {
              attachmentId: response.data.attachmentId,
              fileName: response.data.originalName,
            },
          ]);
          console.log(response);
        } catch (error) {
          console.log(error);
          setUploadError("An error occurred while uploading the file.");
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
    setValue(name, "");

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
    <Controller
      name={name}
      control={control}
      rules={{
        required: {
          value: required && editable,
          message: `${field_title} is required!`,
        },
      }}
      render={({ field, fieldState, formState }) => {
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
            console.log(uploadedFiles, "uploaded files");
          }
          return () => {
            isMounted = false;
          };
        }, [fieldFile]);

        return (
          <div>
            <FieldDom {...props} {...fieldState}>
              {!disabled && editable && (
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
                        className="border border-primary rounded text-center w-75 p-1 m-1"
                        placeholder="Drop your files here"
                      />
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center">
                      <input
                        disabled
                        className="border border-primary rounded text-center w-75 p-1 m-1 "
                        placeholder="Drag a file here or click to Choose File"
                      />
                    </div>
                  )}
                </div>
              )}
              {editable && (
                <Form.Control
                  size="lg"
                  type="file"
                  aria-label="Upload File"
                  className={required && "mandatory"}
                  disabled={disabled}
                  isInvalid={Boolean(
                    (fieldState.isTouched || formState.submitCount > 0) &&
                      fieldState.error
                  )}
                  onChange={(event) => {
                    const selectedFile = event.target.files[0];
                    setFile(selectedFile); // Set the selected file
                    event.target.value = null;
                  }}
                />
              )}
              {uploadError && uploadedFiles.length === 0 && (
                <div className="upload-error">
                  <p>{uploadError}</p>
                </div>
              )}
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
                          onClick={
                            disabled ? null : () => downloadFile(uploadedFile)
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`me-2 ${disabled ? "text-muted" : ""}`}
                        >
                          {uploadedFile.fileName}
                        </a>
                      </div>

                      <div className="ms-2">
                        {!disabled && editable && (
                          <Button
                            onClick={() =>
                              deleteFile(uploadedFile.attachmentId)
                            }
                            variant="light"
                          >
                            <FontAwesomeIcon
                              style={{ color: "black" }}
                              icon={faTrash}
                            />
                          </Button>
                        )}

                        {(editable || !editable) && (
                          <Button
                            variant="light"
                            onClick={() => downloadFile(uploadedFile)}
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </FieldDom>
            <div></div>
          </div>
        );
      }}
    />
  );
}
export default Attach;
