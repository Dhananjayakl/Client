import React, { useState, useEffect } from "react";
import { getVideos } from "../../../../modules/admin/AdminService";
import { CircleLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalBody } from "react-bootstrap";

import {
  faFilm,
  faQuestionCircle,
  faVideo,
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";

const VideoPlayer = (props) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleVideoClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await getVideos("video", props.name);
        const blob = new Blob([response.data], { type: "video/mp4" });
        const url = URL.createObjectURL(blob);

        setVideoUrl(url);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching video:", err);
        setLoading(false);
      }
    };

    fetchVideo();
  }, []);

  return (
    <>
      <div className="float-end mt-1">
        <FontAwesomeIcon
          className="text-primary "
          icon={faVideo}
          size="xl"
          onClick={handleVideoClick}
        />

        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <ModalBody>
            <div>
              {loading ? (
                <div>
                  <CircleLoader color="#007bff" />
                </div>
              ) : (
                <>
                  {videoUrl && (
                    <video
                      controls
                      controlsList="nodownload"
                      width="100%"
                      height="auto"
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </>
              )}
            </div>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default VideoPlayer;
