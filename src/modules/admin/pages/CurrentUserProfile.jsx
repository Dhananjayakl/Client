import {
  faAngleDown,
  faAngleUp,
  faDownload,
  faRemove,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import axios from "src/utils/AxiosInstance";
import DefaultProfile from "src/assets/img/DefaultProfile.png";
import { useDispatch } from "react-redux";
import { setUploadSuccess } from "src/redux/slices/ProfileImg";
import ReportRuntime from "src/components/reports/Report";

const CurrentUserProfile = () => {
  const [user, setUser] = useState([]);

  const [profileImage, setProfileImage] = useState(DefaultProfile);
  const [expand, setExpand] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const stored_userdata = localStorage.getItem("current_logged_User");
    const current_logged_User = stored_userdata
      ? JSON.parse(stored_userdata)
      : [];
    setUser(current_logged_User[0]?.user_details?.data[0]);
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Resize image before uploading (maintaining original format)
    const resizedFile = await resizeImage(file, 300); // Max 300px width/height

    const formData = new FormData();
    formData.append("image", resizedFile);

    try {
      const response = await axios.post(
        `/profile/uploadImg/${user?.user_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      fetchProfileImage(user?.user_id);
      dispatch(setUploadSuccess(true));
    } catch (error) {
      console.error("Upload failed", error);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resizeImage = (file, maxSize) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1); // Keep aspect ratio
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = self.OffscreenCanvas
          ? new OffscreenCanvas(width, height)
          : document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.convertToBlob
          ? canvas
              .convertToBlob({ type: file.type, quality: 0.8 })
              .then(resolve) // OffscreenCanvas (modern browsers)
          : canvas.toBlob(resolve, file.type, 0.8); // Fallback for older browsers
      };
    });
  };

  const fetchProfileImage = async (userId) => {
    if (!userId) {
      return;
    }

    try {
      const response = await axios.get(`/profile/getImg/${userId}`, {
        responseType: "blob", // Ensure response is treated as a binary Blob
      });
      const blob = response.data;
      const imageUrl = URL.createObjectURL(blob);
      setProfileImage(imageUrl);
      dispatch(setUploadSuccess(false));
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  useEffect(() => {
    fetchProfileImage(user?.user_id);
  }, [user]);

  const triggerFileInput = () => {
    document.getElementById("profileImageInput").click();
  };

  const handleCancelClick = async () => {
    try {
      const response = await axios.delete(
        `/profile/deleteImg/${user?.user_id}`
      );
      setProfileImage(DefaultProfile);
      dispatch(setUploadSuccess(null));
    } catch (err) {
      console.log(err);
    }
  };

  const toggleExpand = () => {
    setExpand((prevExpand) => !prevExpand);
  };

  const handleImageClick = () => {
    setPreviewImage(profileImage); // Set the clicked image for preview
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setPreviewImage(""); // Reset the preview image
  };

  const DownLoadImg = async (userId) => {
    try {
      const response = await axios.get(`/profile/getImg/${userId}`, {
        responseType: "blob", // Ensure response is treated as a binary Blob
      });

      const blob = response.data;
      const url = URL.createObjectURL(blob);

      // Create a temporary link element
      const a = document.createElement("a");
      a.href = url;
      a.download = `Image.jpg`; // Change extension based on the actual image type
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowModal(false);
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  return (
    <>
      <Card className="w-100 vh-25 reportChart-cards m-0 p-0">
        <Card.Body className="m-0 p-0">
          <div className="d-flex">
            <div className="profile-border w-25" style={{ height: "230px" }}>
              <div className="d-flex justify-content-center">
                <img
                  className="border rounded-circle mt-3"
                  style={{ width: "120px", height: "120px", cursor: "pointer" }} // Add cursor style for interaction
                  src={profileImage}
                  alt="Profile"
                  onClick={handleImageClick}
                />
              </div>
              <div className="d-flex flex-column align-items-center mt-2">
                <div>
                  <input
                    type="file"
                    id="profileImageInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                  <Button
                    size="sm"
                    className="mx-1"
                    variant="outline-secondary"
                    title="Upload Profile"
                    onClick={triggerFileInput}
                  >
                    <FontAwesomeIcon icon={faUpload} size="1x" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    title="Remove Profile"
                    onClick={handleCancelClick}
                  >
                    <FontAwesomeIcon icon={faRemove} size="1x" />
                  </Button>
                </div>
                {/* <h3 className="mb-3">
                  {user?.first_name} {user?.last_name}
                </h3> */}
                <Row>
                  <Col
                    xs={12}
                    md={12}
                    lg={12}
                    className="text-center text-md-start"
                  >
                    <h3 className="mb-3 fs-4">
                      {user?.first_name} {user?.last_name}
                    </h3>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="w-75 d-flex flex-column justify-content-evenly">
              <div className="d-flex flex-column justify-content-evenly">
                <div className="align-items-center">
                  <h4 className="mx-3">User Information</h4>

                  <div>
                    <ReportRuntime
                      report="USER_INFORMATION"
                      className="remove-styles"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-top ">
            <Button
              onClick={toggleExpand}
              className="rounded-circle border text-primary mx-2 my-1"
              variant="outline-light"
            >
              <FontAwesomeIcon
                icon={expand ? faAngleUp : faAngleDown}
                style={{
                  transform: `rotate(${expand ? 180 : -90}deg)`,
                }}
              />
            </Button>

            {expand && (
              <ReportRuntime
                report="USER_BUSINESS_UNIT_ROLES"
                className="remove-styles"
              />
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Modal to preview the image */}
      <Modal show={showModal} onHide={handleCloseModal} size="sm">
        <Modal.Body>
          <img
            src={previewImage}
            alt="Profile Preview"
            style={{ width: "100%", height: "auto" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="sm"
            className="mx-1"
            variant="outline-secondary"
            title="DownLoad Profile"
            onClick={() => DownLoadImg(user?.user_id)}
          >
            <FontAwesomeIcon icon={faDownload} size="1x" />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CurrentUserProfile;
