import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  ProgressBar,
} from "react-bootstrap";
import { getModulesData } from "../EngineService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFileImport } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "src/utils/AxiosInstance";
import CardHeader from "react-bootstrap/esm/CardHeader";
//import JSZip from "jszip";
import Loader from "src/components/Loader";
import { toast, ToastContainer } from "react-toastify";
import search from "../../../assets/img/illustrations/searching.png";

const ImportExportPage = () => {
  const [moduleData, setModuleData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showObjectsModal, setshowObjectsModal] = useState(false);
  const [showImportedObjectsModal, setshowImportedObjectsModal] =
    useState(false);
  const [uploadedObjects, setUploadedObjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [importedObjects, setImportedObjects] = useState([]);
  const [moduleName, setModuleName] = useState("");
  // const rowClasses = ["bg-light", "bg-success", "bg-light", "bg-info"];
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getModulesData("moduleforminfo")
      .then((response) => {
        const responseData = response.data;

        setModuleData(responseData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    const newFiles = [...files];
    for (let i = 0; i < fileList.length; i++) {
      newFiles.push(fileList[i]);
    }
    setFiles(newFiles);
  };

  const handleObjects = async () => {
    if (files.length === 0) {
      alert("Please select a file to import.");
      setShowModal(true);
      setshowObjectsModal(false);
      return;
    }

    setShowModal(false);
    setshowObjectsModal(true);

    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append("file", file, file.name);
      });
      const response = await axios.post("extract-zip", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const responseData = response.data;
      console.log(responseData.data, "imported")
      console.log(responseData[Object.keys(responseData)], "imported data")
      setImportedObjects(responseData[Object.keys(responseData)]);
      setModuleName(Object.keys(responseData).join());

      //setFiles([]);
    } catch (error) {
      setshowObjectsModal(false);
      setFiles([]);
      alert("Error:" + error.message + "\nImported Failed");
    }
  };

  const handleImport = async () => {
    setUploadedObjects([]);
    setshowObjectsModal(false);
    setshowImportedObjectsModal(true);

    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append("file", file, file.name);
      });
      const response = await axios.post("/extractxml", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        `${moduleName.toLocaleUpperCase()} Module successfully Imported`,
        {
          autoClose: 2000,
        }
      );
      setUploadedObjects(response.data);
      setFiles([]);
    } catch (error) {
      console.error("Error uploading files:", error);
      setshowImportedObjectsModal(false);
      setFiles([]);
      toast.error(`${moduleName.toLocaleUpperCase()} Module import failed`, {
        autoClose: 2000,
      });
    }
  };

  const downloadModule = async (moduleId, moduleName) => {
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      setProgress(progress);
      if (progress > 80) {
        clearInterval(progressInterval);
        setProgress(progress);
      }
    }, 1000);
    try {
      await axios
        .post(`/data-export?moduleId=${moduleId}&exportModule=true`, [], {
          responseType: "blob",
        })
        .then((response) => {
          clearInterval(progressInterval);
          setProgress(100);
          const href = URL.createObjectURL(response.data);
          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", `${moduleName}.zip`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
          toast.success(
            `${moduleName.toLocaleUpperCase()} downloaded successfully`,
            {
              autoClose: 2000,
            }
          );
        });
      setTimeout(() => setProgress(0), 2000);
    } catch (error) {
      alert(error.message);
      setProgress(0);
    }
  };

  const filteredModuleData = moduleData.filter((module) => {
    return module?.module_name?.toLowerCase().includes(searchTerm?.toLowerCase());
  });
  console.log(searchTerm, moduleData);
  const noObjectsFound = filteredModuleData.length === 0;
  return (
    <Card>
      <Card.Header
        as={"h3"}
        className="text-primary mt-1 shadow-lg sticky-top"
        style={{ top: "62px",zIndex:0}}
      >
        {progress > 0 && (
          <ProgressBar
            className="w-100"
            animated
            now={progress}
            style={{ height: "10px" }}
          />
        )}
        <div className="d-flex justify-content-between">
          <h3 className="text-primary text-shadow-lg">Imports and Exports</h3>
          <div className="d-flex justify-content-center align-items-center me-3">
            <Form.Control
              type="search"
              placeholder="🔎 Search by Module"
              value={searchTerm}
              className="me-1"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              style={{ width: "130px" }}
              onClick={() => setShowModal(true)}
            >
              <span>Import</span>{" "}
              <FontAwesomeIcon className="ms-1" icon={faFileImport} />
            </Button>
          </div>
        </div>
      </Card.Header>

      <Table responsive>
        <thead>
          <tr className="bg-primary p-0 m-0 ">
            <th className="py-1 text-white"> Module </th>
            <th className="py-1 text-white">Total Objects</th>
            <th className="py-1 text-white">Status</th>
            <th className="py-1 text-white">DownLoad</th>
          </tr>
        </thead>
        <tbody>
          {noObjectsFound ? (
            <div
              style={{ height: "80vh" }}
              className="d-flex justify-content-center align-items-center text-center"
            >
              <h3 className="text-primary fw-bolder">No Modules found</h3>
              <img src={search} style={{ height: "150px" }} alt="no result" />
            </div>
          ) : (
            filteredModuleData.map((module, index) => (
              <tr key={index} className="p-0 m-0">
                <td className="py-1">
                  <Link
                    className="cursor-pointer  fw-medium"
                    to={`moduleInfo/${module.module_id}`}
                  >
                    {module.module_name}
                  </Link>
                </td>
                <td className="py-1">{module.object_count}</td>
                <td className="py-1">Active</td>
                <td className="py-1 ">
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      downloadModule(module.module_id, module.module_name);
                    }}
                  >
                    <FontAwesomeIcon icon={faDownload} size="lg" />
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      {/* To attach file  */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="md"
      >
        <Modal.Header className="d-flex">
          <Modal.Title>Import Zip file</Modal.Title>
        </Modal.Header>
        <Modal.Body
        // className="scroll"
        >
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select file(s)</Form.Label>
            <Form.Control
              type="file"
              accept=".zip"
              multiple
              onChange={handleFileChange}
              required
            />
            <Form.Label className="text-info p-0 m-0">
              *Only zip file(s) are allowed
            </Form.Label>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleObjects}>
            Show objects
          </Button>
        </Modal.Footer>
      </Modal>
      {/* To show objects from the Zip file  */}
      <Modal
        show={showObjectsModal}
        onHide={() => setshowObjectsModal(false)}
        centered
        size="md"
      >
        <Modal.Header className="d-flex">
          <Modal.Title className="text-primary fw-bold ">
            {`Objects in the ${moduleName?.toLocaleUpperCase()} Module`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
        >
          {importedObjects?.length > 1 ? (
            <div className="text-primary text-center">
              <h4 className="text-primary fw-medium">
                Objects are Importing please wait...
              </h4>
              <Loader />
            </div>
          ) : (importedObjects  &&

            Object?.entries(importedObjects)?.map(([objectType, objects]) => (
              <Card key={objectType} className="mb-3">
                <Card.Header className="fw-semibold text-primary bg-body-secondary">
                  {objectType}
                </Card.Header>
                <Card.Body className="bg-body-tertiary">
                  <Row className="g-2 ">
                    {" "}
                    {objects.map((obj, index) => (
                      <Col
                        xs={6}
                        key={`${obj.objectName}-${index}`}
                        className="d-flex align-items-center"
                      >
                        <p className="fw-medium  mb-0 d-inline-block text-truncate">
                          {obj.objectName}
                        </p>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleImport}>
            Import Objects
          </Button>
        </Modal.Footer>
      </Modal>
      {/* To show Imported Objects */}
      <Modal
        show={showImportedObjectsModal}
        onHide={() => setshowImportedObjectsModal(false)}
        centered
        size="lg"
      >
        <Modal.Header className="d-flex" closeButton>
          <Modal.Title className="fw-semibold text-primary">
            {`Imported Objects in the ${moduleName} Module`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
          }}
        >
          {uploadedObjects?.length < 1 ? (
            <div className="text-primary text-center">
              <h4 className="text-primary fw-medium">
                Objects are Importing please wait...
              </h4>
              <Loader />
            </div>
          ) : (
            Object.keys(uploadedObjects).map((obj, index) => (
              <Card className="">
                <Card.Header
                  key={index}
                  className="h4 ms-3 pb-3 text-primary fw-bolder p-0 pt-2 ps-2"
                >
                  {obj.toLocaleUpperCase()} Module
                </Card.Header>
                <Card.Body>
                  {" "}
                  {uploadedObjects[obj] &&
                    Object.entries(uploadedObjects[obj])?.map(
                      ([subKey, value], innerIndex) => (
                        <Card className="p-0 m-0">
                          <Row className="g-0">
                            <Col>
                              <CardHeader
                                key={innerIndex}
                                className="shadow-lg bg-body-secondary fw-medium"
                              >
                                {subKey}
                              </CardHeader>
                            </Col>

                            <Card.Body className="d-flex bg-body-tertiary  shadow">
                              <Row className="g-2">
                                {value?.map((obj, index) => (
                                  <Col
                                    xs={6}
                                    className="p-2 text-primary  fw-medium"
                                  >
                                    <p key={index} className="d-inline-block">
                                      {obj.objectName}
                                    </p>
                                  </Col>
                                ))}
                              </Row>
                            </Card.Body>
                          </Row>
                        </Card>
                      )
                    )}
                </Card.Body>
              </Card>
            ))
          )}
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default ImportExportPage;
