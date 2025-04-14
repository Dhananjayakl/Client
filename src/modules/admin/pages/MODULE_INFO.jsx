import React, { useState, useEffect } from "react";
import { getSpecificModuleInfo } from "../AdminService";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { Button, Col, Container, Row, ProgressBar } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import Loader from "src/components/Loader";
import ObjectInfo from "./OBJECT_INFO";
import Navigation from "./OBJECT_NAVIGATION";
import axios from "src/utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

const ModuleInfo = () => {
  const [selectedObjectType, setSelectedObjectType] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [moduleData, setModuleData] = useState({});
  const [moduleName, setModuleName] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    getSpecificModuleInfo("formdatainfo", id)
      .then((response) => {
        const responseData = response.data;

        const modData = responseData[Object.keys(responseData)];

        setSelectedObjectType(Object.keys(modData));
        setModuleData(modData);
        setModuleName(Object.keys(responseData).join());

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const exportObjects = async () => {
    toast.info("Exporting in progress. Please wait", {
      autoClose: 1000,
    });
    if (selectedItems.length >= 1) {
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
        const response = await axios.post(
          `/data-export?moduleId=${id}&exportModule=false`,
          selectedItems,
          {
            responseType: "blob",
          }
        );
        clearInterval(progressInterval);
        setProgress(100);

        downloadZip(response.data, `${moduleName}.zip`);
      } catch (error) {
        console.error("Error occurred during download:", error);
        setProgress(0);
        clearInterval(progressInterval);
      }
    } else {
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
        const response = await axios.post(
          `/data-export?moduleId=${id}&exportModule=true`,
          selectedItems,
          {
            responseType: "blob",
          }
        );
        setProgress(100);
        clearInterval(progressInterval);
        downloadZip(response.data, `${moduleName}.zip`);
      } catch (error) {
        console.error(error);
        clearInterval(progressInterval);
      }
    }

    setSelectedItems([]);
    setTimeout(() => setProgress(0), 1000);
  };

  const goBack = () => {
    // setTimeout(()=>{
    //   navigate(-1);
    // },1000)
    if (progress === 0) {
      navigate(-1);
    }
  };

  const downloadZip = (data, filename) => {
    const blob = new Blob([data], { type: "application/zip" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    goBack();
  };

  return (
    <React.Fragment>
      <Helmet
        title={`${
          moduleName.charAt(0).toUpperCase() + moduleName.slice(1).toLowerCase()
        } Information`}
      />
      <Container fluid>
        <div className="sticky-top" style={{ top: "60px" }}>
          {progress > 0 && (
            <ProgressBar
              className="w-100"
              animated
              now={progress}
              style={{ height: "10px" }}
            />
          )}
        </div>
        <Row
          className="px-1 sticky-top bg-primary text-white py-1"
          style={{ top: "62px", zIndex: 1 }}
        >
          <Col
            xs={12}
            className="d-flex flex-wrap justify-content-between align-items-center"
          >
            <div className="flex-fill p-1">
              <span className="text-nowrap overflow-hidden">
                {moduleName.toUpperCase()}:
              </span>
            </div>
            <div className="flex-fill p-1">
              <span>Total Objects Selected: {selectedItems.length}</span>
            </div>
            <Button
              onClick={exportObjects}
              className="bg-purple text-white m-1"
            >
              Export
              <FontAwesomeIcon icon={faFileExport} className="ms-1" />
            </Button>
          </Col>
        </Row>

        <Row>
          <Col className="p-0 sticky-top  z-0 d-none d-md-block" md={4} xl={2}>
            <Navigation
              setSelectedObjectType={setSelectedObjectType}
              moduleData={moduleData}
              selectedObjectType={selectedObjectType}
            />
          </Col>
          <Col xs={12} md={8} xl={10} className="p-0  vh-100 overflow-y-scroll">
            {loading ? (
              <Loader />
            ) : (
              <ObjectInfo
                moduleId={id}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                selectedObjectType={selectedObjectType}
                moduleData={moduleData}
              />
            )}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default ModuleInfo;
