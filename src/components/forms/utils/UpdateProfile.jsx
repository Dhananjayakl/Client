import React from "react";
import axios from "src/utils/axiosInstance";
import { useRef, useState, useEffect } from "react";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import {
  createObject,
  getObjectData,
  updateObjectData,
  getviewData,
} from "../../../modules/leave/LeaveService";
// import avatar4 from "../../../assets/img/avatars/avatar-4.jpg";
// import userdefault from "../../../assets/img/default/userdefault.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faMapMarkerAlt,
  faEnvelope,
  faBirthdayCake,
  faGlobe,
  faUser,
  faEdit,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Resizer from "react-image-file-resizer";
import "../../../../src/assets/scss/profile.scss";
import { getServiceData } from "src/components/server/service";

const WIDTH = 100;

function UpdateProfile() {
  const filterType =
    /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

  const inputRef = useRef(null);

  const [image, setImage] = useState();
  const [defaultImage, setDefaultImage] = useState(true);

  useEffect(() => {
    getServiceData(
      "profileUpdate",
      JSON.parse(localStorage.current_logged_User)[0].user_details.data[0]
        .user_id
    )
      .then((response) => {
        const uri = `data:${response.data.contentType};base64,${response.data.base64Image}`;
        setImage(uri);
        console.log(image, "image");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleCancelClick = async () => {
    try {
      const response = await getServiceData(
        "profileDelete",
        JSON.parse(localStorage.current_logged_User)[0].user_details.data[0]
          .user_id
      );
      const uri = `data:${response.data.contentType};base64,${response.data.base64Image}`;
      setImage(uri);
    } catch (err) {
      console.log(err);
    }
  };

  const handleProfileClick = () => {
    // Trigger the file input click
    inputRef.current.click();
  };

  const uploadImage = async (file, user_id) => {
    try {
      // const user_id1 = JSON.parse(localStorage.current_logged_User)[0].user_details.data[0].user_id;
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(
        `/attachment/uploadImg?userId=${user_id}`,
        formData
      );

      if (response.status === 200) {
        console.log("Image uploaded successfully");
      } else {
        console.error(
          "Error uploading image. Status:",
          response.status,
          "Data:",
          response.data
        );
      }
      const uploadResponse = await fetch(uploadImgUrl, {
        method: "POST",
        body: formData,
      });
      if (uploadResponse.ok) {
        const data = await uploadResponse.json();
        console.log("Upload API response:", data);
      } else {
        console.error(
          "Upload API request failed with status:",
          uploadResponse.status
        );
      }
    } catch (error) {
      console.error("Error while handling file change:", error);
    }
  };

  const handleImageChange = async (event) => {
    try {
      const fileInput = event.target;
      const file = fileInput.files[0];
      const user_id = JSON.parse(localStorage.current_logged_User)[0]
        .user_details.data[0].user_id;
      const resizedImage = await resizeImage(file);
      console.log("Resized Image:", resizedImage);
      setImage(resizedImage);
      uploadImage(file, user_id);
    } catch (error) {
      console.error("Error while handling file change:", error);
    }
  };

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        720,
        500,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64",
        200,
        200
      );
    });
  };

  return (
    <>
      <div
        style={{
          alignItems: "left",
          // Vertically center the content
        }}
      >
        {image ? (
          <img
            src={image}
            alt=""
            id="selectedimg"
            className="rounded-circle for-profile"
            width="110"
            height="110px"
          />
        ) : (
          <img
            src={defaultImage ? image : userdefault}
            className="rounded-circle for-profile"
            width="110"
            height="110px"
            id="canvas"
            alt=""
          />
        )}

        <input
          type="file"
          ref={inputRef}
          id="canvas"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <div style={{ display: "flex", marginLeft: "40px" }}>
          <FontAwesomeIcon
            icon={faEdit}
            size="2x"
            style={{ marginLeft: "23px" }}
            className="icon-color"
            onClick={() => handleProfileClick()}
          />
          <FontAwesomeIcon
            icon={faTimes}
            size="2x"
            style={{ marginLeft: "16px" }}
            className="icon-color"
            onClick={() => handleCancelClick()}
          />
        </div>
      </div>
    </>
  );
}

export default UpdateProfile;
