import React, { useState, useEffect } from "react";
import { Field } from "formik";
import { Form, Button, ProgressBar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faTrash, faDownload } from "@fortawesome/free-solid-svg-icons";
import axios from "src/utils/AxiosInstance";
import FieldDom from "./FieldDom";
function MAttach(props) {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const uploadFiles = async () => {
      const uploadPromises = files.map((file) => {
        const uniqueFilename = `${file.name} `; // Generate a unique filename
        const formData = new FormData();
        formData.append("file", file, file.name); // Use the unique filename in the form data

        return axios
          .post(
            "/attachment/upload?moduleId=1&formId=1&objectId=1&regionCode=1&multiRowRecId=1&fieldName=1",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (event) => {
                const progress = Math.round((100 * event.loaded) / event.total);
                setUploadProgress((prevProgress) => ({
                  ...prevProgress,
                  [uniqueFilename]: progress,
                }));
              },
            }
          )
          .then((response) => {
            props.setFieldValue(
              "attachments",
              response.data.attachmentId + "#" + response.data.originalName
            );
            setUploadedFiles((prevFiles) => [
              ...prevFiles,
              {
                attachmentId: response.data.attachmentId,
                fileName: response.data.originalName,
              },
            ]);
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
          });
      });

      try {
        await Promise.all(uploadPromises);
      } catch (error) {
        console.log(error);
      }
    };

    if (files.length > 0) {
      uploadFiles();
    }
  }, [files]);

  const downloadFile = async (file) => {
    const { attachmentId, fileName } = file;

    try {
      await axios
        .get(`/attachment/${attachmentId}`, { responseType: "blob" })
        .then((response) => {
          const href = URL.createObjectURL(response.data);

          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          URL.revokeObjectURL(href);
          console.log(response);
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
    props.setFieldValue("attachments", "");

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
    setFiles(selectedFiles);
  };

  const {
    fieldDef,
    label,
    name,
    options,
    helptext,
    tooltip,
    required,
    visible,
    ...rest
  } = props;

  useEffect(() => {
    if (Object.keys(uploadProgress).length > 0) {
      const completedFiles = Object.entries(uploadProgress).filter(
        ([_, progress]) => progress === 100
      );

      if (completedFiles.length > 0) {
        const completedFileNames = completedFiles.map(([fileName]) => fileName);
        setUploadProgress((prevProgress) => {
          const updatedProgress = { ...prevProgress };
          completedFileNames.forEach((fileName) => {
            delete updatedProgress[fileName];
          });
          return updatedProgress;
        });
        setUploadedFiles((prevFiles) =>
          prevFiles.filter(
            (file) => !completedFileNames.includes(file.fileName)
          )
        );
      }
    }
  }, [uploadProgress]);

  return (
    <Field name={name}>
      {({ field, form: { touched, errors }, meta }) => {
        let file = field.value;

        return (
          <div>
            <FieldDom {...props} {...meta}>
              <div
                className={`drop-zone ${isDragging ? "dragging" : ""}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isDragging ? (
                  <div className="d-flex justify-content-center">
                    <input
                      disabled
                      className="border border-primary rounded text-center w-75 p-1 m-1 border-3"
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

              <Form.Control
                id="inputGroupFile"
                size="lg"
                type="file"
                className={
                  required ? "border-start border-primary border-4" : ""
                }
                isInvalid={Boolean(touched[name] && errors[name])}
                onChange={(event) => {
                  const selectedFiles = Array.from(event.target.files);
                  setFiles(selectedFiles);
                  event.target.value = null;
                }}
              />

              {uploadedFiles.length > 0 && (
                <ul className="list-group">
                  {uploadedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div className="d-flex flex-grow-1">
                        <FontAwesomeIcon icon={faFile} className="me-2 ms-2" />
                        <a
                          onClick={() => downloadFile(file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="me-2"
                        >
                          {file.fileName}
                        </a>
                      </div>

                      <div className="ms-2">
                        <Button
                          onClick={() => deleteFile(file.attachmentId)}
                          variant="light"
                        >
                          <FontAwesomeIcon
                            style={{ color: "black" }}
                            icon={faTrash}
                          />
                        </Button>

                        <Button
                          variant="light"
                          onClick={() => downloadFile(file)}
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {Object.keys(uploadProgress).length > 0 && (
                <ul className="list-group">
                  {Object.entries(uploadProgress).map(
                    ([fileName, progress]) => (
                      <li
                        key={fileName}
                        className="list-group-item d-flex justify-content-between align-items-start"
                      >
                        <div className="d-flex flex-grow-1">
                          <FontAwesomeIcon
                            icon={faFile}
                            className="me-2 ms-2"
                          />
                          <span>{fileName}</span>
                        </div>

                        <div className="ms-2">
                          <ProgressBar
                            style={{ width: "50px" }}
                            now={progress}
                            label={`${progress}%`}
                          />
                        </div>
                      </li>
                    )
                  )}
                </ul>
              )}
            </FieldDom>
          </div>
        );
      }}
    </Field>
  );
}

export default MAttach;
