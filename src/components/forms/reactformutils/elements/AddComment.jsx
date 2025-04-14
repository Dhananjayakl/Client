import { useState, useEffect } from "react";
import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createObject,
  getObjectData,
  updateObjectData,
  getviewData,
} from "src/modules/admin/AdminService";
// import { getviewData } from "src/modules/issue/IssueFormService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faCommentAlt,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { faAudible } from "@fortawesome/free-brands-svg-icons";
import { postComments } from "src/components/server/service";
import axios from "src/utils/AxiosInstance";
const service = "designWorkflow";
var Enable = "activity";
import { useTranslation } from "react-i18next";
const AddComment = (props) => {
  const [comments, setComments] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [errorFlag,setErrorFlag]=useState(false)
  const [prevComments, setPrevComments] = useState("");
  const { t } = useTranslation("common");
  let formId = props.formMetaData.formmeta.form_id;

  let objectId = props.objectId;
  let filterExpression = `form_id=${formId} and object_id='${objectId}' and comments != '' and comments != 'null'`;
  let commentsHistory = {
    viewName: "pa_audit_trail_data_v",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: filterExpression,
  };

  // useEffect(() => {
  //   setButtonDisabled(comments === prevComments);
  //   setCharCount(comments.length);
  // }, [comments, prevComments]);

  const handleAddComment = async (event) => {
    event.preventDefault();

    try {
      // setButtonDisabled(true);
      const response = await axios.post(
        `/form/updateObjectComments?objectId=${objectId}&formId=${formId}`,
        comments,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );

      if (response.status === 200) {
        if (charCount <= 3999) {
          setButtonDisabled(false);
          toast.success("Comment added successfully");
          props.updateComments();
          setPrevComments(comments);
          setComments("");
        } else {
          setShowAlert(true);
          // setAlertMessage("Character count exceeds 4000 limit. Please reduce the content.");
        }
      }
    } catch (error) {
      setShowAlert(true);
      // setAlertMessage("Error occurred while adding comment");
      setAlertMessage("Please enter the comment.");
      console.error("Error occurred:", error);
    } finally {
      setButtonDisabled(false);
    }
  };

  // const handleChange = (event) => {
  //   let newComments = event.target.value;

  //   if (newComments.length > 10) {
  //     setShowAlert(true);
  //     setAlertMessage(
  //       "Character count exceeds 4000 limit. Please reduce the content."
  //     );
  //     newComments = newComments.slice(0, 10);

  //     const timer = setTimeout(() => {
  //       setShowAlert(false);
  //       setAlertMessage("");
  //     }, 1000);

  //     return () => clearTimeout(timer);
  //   } else {
  //     setShowAlert(false);
  //     setAlertMessage("");
  //     newComments = newComments.slice(0, 3999);
  //   }

  //   setComments(newComments);
  //   setCharCount(newComments.length);
  //   // setButtonDisabled(newComments === prevComments);
  // };

  return (
    <div className="col-md-12 z-0">
      <div>
        <div>
          <InputGroup className="mb-3 z-0">
            <Form.Control
              className={` ${showAlert ? "textarea-error" : ""}`}
              as="textarea"
              rows={2}
              placeholder="Add Comment"
              aria-label="Add Comment"
              aria-describedby="basic-addon2"
              onChange={(e) => {
                const trimmedValue = e.target.value.trim();
                    if (e.target.value?.length >4000) {
                    setErrorFlag(true);
                    setTimeout(() => {
                      setErrorFlag(false);
                    }, 1000);
                  }
                if (
                  (trimmedValue.length === 1 &&
                    /[^a-zA-Z0-9]/.test(trimmedValue)) ||
                  (trimmedValue === "" && e.target.value.length > 0)
                ) {
                  return;
                }

                const trimmedText = e.target.value.substring(0, 4000);

                setComments(trimmedText);
              }}
              value={comments}
            />
            <Button
              className="z-0"
              variant="outline-secondary"
              id="button-addon2"
              onClick={handleAddComment}
              disabled={buttonDisabled}
            >
              <FontAwesomeIcon icon={faComment} className="me-1" />
              {t("Add Comment")}
            </Button>
          </InputGroup>
        </div>
        <div>
          {errorFlag && (
            <div className="add-comment-alert" variant="danger">
     Maximum Character Length Reached.
            </div>
          )}
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default AddComment;
