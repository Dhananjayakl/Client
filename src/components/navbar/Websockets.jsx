import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "src/utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

const WebSockets = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [client, setClient] = useState(null);
  const [checkServer, setCheckServer] = useState(false);
  const [isNetworkLost, setIsNetworkLost] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [reload, setReload] = useState(false);

  const [restoredata, setrestoredata] = useState(true);

  const currentUserJSON = localStorage.current_logged_User;
  const currentUser = currentUserJSON
    ? JSON.parse(currentUserJSON)[0].user_details.data[0].user_id
    : null;
  const sessionkey = localStorage.getItem("session_key");

  let jwtExperation =
    (currentUserJSON ? JSON.parse(currentUserJSON)[0].jwtExpiration : null) -
    300000;

  const navigate = useNavigate();
  const lastActivityRef = useRef(Date.now());

  const [isInactive, setIsInactive] = useState(false);

  const timeoutRef = useRef(null);
  const sessionTimeoutRef = useRef(null);
  const toastRef = useRef(null);

  useEffect(() => {
    if (sessionkey) {
      const socket = new SockJS(axios.getUri() + "/ws-message");
      const stompClient = Stomp.over(socket);
      stompClient.connect(
        {},
        () => {
          setClient(stompClient);
          stompClient.subscribe("/topic/message", (msg) => {
            onMessageReceived(msg);
          });
          stompClient.subscribe("/queue/task", (msg) => {
            onTaskMessageReceived(msg);
          });

          stompClient.subscribe("/queue/reply", (msg) => {
            onSessionManagmentReceived(msg);
          });
        },
        (error) => {
          console.error("Error connecting to WebSocket server:", error);
        }
      );

      return () => {
        if (stompClient !== null) {
          stompClient.send(
            "/app/taskMessage",
            {},
            JSON.stringify({ userId: currentUser })
          );
          stompClient.disconnect();
        }
      };
    }
  }, [sessionkey]);

  const sendMessageToServer = (user) => {
    if (client) {
      client.send("/app/sendMessage", {}, user);
    }
  };

  const onMessageReceived = (msg) => {
    setInputMessage(msg.body);
    if (
      msg.body.includes(
        "Please Save Your Work. The Server will be down in the next 2 minutes"
      )
    ) {
      setShowMaintenanceModal(true);
      setCheckServer(true);
      setrestoredata(false);
    }
  };

  const onSessionManagmentReceived = (msg) => {
    const bodyObject = JSON.parse(msg.body);
    setInputMessage(bodyObject.warningMessage);
    if (bodyObject.sessionkey.includes(sessionkey)) {
      setShowMaintenanceModal(true);
      startTimeout();
      startCountdown();
      setrestoredata(false);
    }
  };
  const sendSessionRequestServer = (user) => {
    if (client) {
      client.send("/app/clientToServer", {}, user);
    }
  };

  const onTaskMessageReceived = (msg) => {
    const task = JSON.parse(msg.body);
    task.data.forEach((taskDetails) => {
      if (taskDetails.userId === currentUser) {
        showToastMessage(taskDetails);
      }
    });
  };

  const showToastMessage = (taskDetails) => {
    const { taskName, formService, objectId } = taskDetails;
    const cleanFormService = formService.replace(/^\/+/, "");
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const url = `/form/runtime?formService=${cleanFormService}&objectId=${objectId}`;

    const navigateToUrl = () => {
      navigate(url);
    };

    toast(taskName, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 5000,
      closeButton: true,
      onClick: () => {
        if (params.get("formService") === cleanFormService) {
          setTimeout(navigateToUrl, 5000);
        } else {
          navigateToUrl();
        }
      },
    });
  };

  if (client) {
    sendMessageToServer(JSON.stringify({ userId: currentUser }));
  }

  const handleCloseClick = () => {
    clearTimeout(timeoutRef.current);
    clearInterval(sessionTimeoutRef.current);
    navigate("/auth/sign-in");
    delete axios.defaults.headers.common.Authorization;
    localStorage.removeItem("showMaintenanceModal");
    localStorage.removeItem("popupmessage");
    setShowMaintenanceModal(false);
  };

  const handleExtendClick = async () => {
    clearTimeout(timeoutRef.current);
    clearInterval(sessionTimeoutRef.current);
    const response = await axios.post("/auth/refresh-token");
    const currentLoggedUser = localStorage.getItem("current_logged_User");
    if (currentLoggedUser) {
      const currentLoggedUserObj = JSON.parse(currentLoggedUser);
      localStorage.setItem(
        "current_logged_User",
        JSON.stringify(currentLoggedUserObj)
      );
    }

    setShowMaintenanceModal(false);
    localStorage.removeItem("showMaintenanceModal");
    localStorage.removeItem("popupmessage");

    setReload(false);
    setIsNetworkLost(false);
  };

  const startCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setCountdown(60);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const countdownIntervalRef = useRef(null);
  const startTimeout = () => {
    timeoutRef.current = setTimeout(() => {
      navigate("/auth/sign-in");
      localStorage.removeItem("showMaintenanceModal");
      localStorage.removeItem("popupmessage");
      setShowMaintenanceModal(false);
      clearTimeout(timeoutRef.current);
      delete axios.defaults.headers.common.Authorization;
    }, 60000);
  };
  //Added By Suhas Session Time out  when screen is Ideal Start.

  useEffect(() => {
    const checkInactivity = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= 1200000) {
        // sendSessionRequestServer(
        //   JSON.stringify({action: "sessionkey",sess:{sessionkey} })
        // );
        setIsInactive(true);
      }
    }, 420000);

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "keydown",
      "keyup",
      "click",
      "touchmove",
      "touchend",
      "wheel",
      "focus",
      "blur",
      "resize",
      "visibilitychange",
      "input",
      "contextmenu",
      "dblclick",
      "drag",
      "dragend",
      "dragenter",
      "dragexit",
      "dragleave",
      "dragover",
      "dragstart",
      "drop",
      "focusin",
      "focusout",
      "mouseenter",
      "mouseleave",
      "mouseover",
      "mouseout",
      "pointerdown",
      "pointerup",
      "pointermove",
      "pointerover",
      "pointerout",
      "pointerenter",
      "pointerleave",
      "pointercancel",
      "selectionchange",
      "selectstart",
      "selectend",
      "touchcancel",
      "touchforcechange",
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      clearInterval(checkInactivity);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isInactive]);

  useEffect(() => {
    if (isInactive) {
      sendSessionRequestServer(
        JSON.stringify({ action: "checkSession", sessionkey: { sessionkey } })
      );
      setIsInactive(false);
    }
  }, [isInactive, currentUser]);
  //Added By Suhas Session Time out  when screen is Ideal End

  //Added By Suhas UseEffect even Page Refresh Modal popup should not Close StartP
  useEffect(() => {
    const modalState = localStorage.getItem("showMaintenanceModal");
    const popmessage = localStorage.getItem("popupmessage");

    if (modalState === "true" && popmessage) {
      clearTimeout(timeoutRef.current);
      setShowMaintenanceModal(true);
      setInputMessage(popmessage);
      startTimeout();
      startCountdown();
    }
  }, []);
  useEffect(() => {
    if (showMaintenanceModal) {
      localStorage.setItem("showMaintenanceModal", "true");
      localStorage.setItem("popupmessage", inputMessage);
    } else {
      localStorage.removeItem("showMaintenanceModal");
      localStorage.removeItem("popupmessage");
    }
  }, [showMaintenanceModal]);
  //Added By Suhas UseEffect even Page Refresh Modal popup should not Close End

  // Added By Suhas UseEffect CheckLongSession Start
  useEffect(() => {
    if (sessionTimeoutRef.current) {
      clearInterval(sessionTimeoutRef.current);
    }

    sessionTimeoutRef.current = setInterval(() => {
      sendSessionRequestServer(
        JSON.stringify({
          action: "checkLongSession",
          sessionkey: { sessionkey },
        })
      );
    }, 6900000);

    return () => {
      clearInterval(sessionTimeoutRef.current);
    };
  }, [sessionkey, client]);
  // Added By Suhas UseEffect CheckLongSession End

  //  Added By Suhas UseEffect Once page reload Extend access token start
  // useEffect(() => {
  //   if (window.performance) {
  //     if (performance.navigation.type === 1) {
  //       handleExtendClick();
  //     }
  //   }
  // }, []);
  //  Added By Suhas UseEffect Once page reload Extend access token End

  // Added By Suhas UseEffect for network connectivity start
  useEffect(() => {
    const handleOffline = () => {
      if (!isNetworkLost) {
        setIsNetworkLost(true);
        setInputMessage(
          "Network connection lost. Please check your connection."
        );
        setShowMaintenanceModal(true);
        setrestoredata(false);
        // setIsNetworkLost(false);
      }
    };
    const handleOnline = () => {
      if (isNetworkLost) {
        // setIsNetworkLost(true);
        setInputMessage(
          "Network restore, Please click on 'Resume' to continue."
        );
        setShowMaintenanceModal(true);
        setrestoredata(true);
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [isNetworkLost]);

  const handleReloadPage = () => {
    if (navigator.onLine) {
      setShowMaintenanceModal(false);
      // window.location.reload();
      setInputMessage("Network restore, Please click on 'Resume' to continue.");

      handleExtendClick();
    } else {
      if (toastRef.current) {
        return;
      }
      toastRef.current = toast.error(
        `Network connection is lost. Please check your connection.`,
        {
          autoClose: 1000,
          onClose: () => {
            toastRef.current = null;
          },
        }
      );
      // toast.error("");
    }
  };

  useEffect(() => {
    if (
      inputMessage ===
        "Network connection lost. Please check your connection." &&
      sessionkey != null
    )
      if (window.performance) {
        if (performance.navigation.type === 1) {
          setReload(true);
          setIsNetworkLost(true);
          // setShowMaintenanceModal(false);
        }
      }
  }, [inputMessage]);
  // Added By Suhas UseEffect for network connectivity End

  return (
    <>
      {showMaintenanceModal && (
        <Modal
          show={showMaintenanceModal}
          onHide={() => setShowMaintenanceModal(false)}
          backdrop="static"
          keyboard={false}
        >
          {/* //closeButton */}
          <Modal.Header>
            <h3 className="text-danger">Alert!</h3>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center mt-3">
              <h4>{inputMessage}</h4>
            </div>
            {countdown > 0 && (
              <div className="d-flex justify-content-center mt-3">
                {!checkServer && !isNetworkLost && !reload && (
                  <h4>Time remaining: {countdown}</h4>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {!checkServer && !isNetworkLost && !reload && !restoredata && (
              <>
                <Button variant="secondary" onClick={handleExtendClick}>
                  Extend Session
                </Button>
                <Button variant="secondary" onClick={handleCloseClick}>
                  Close & SignOut
                </Button>
              </>
            )}
            {checkServer && (
              <Button
                variant="secondary"
                onClick={() => setShowMaintenanceModal(false)}
              >
                Ok
              </Button>
            )}
            {restoredata && (
              <Button variant="secondary" onClick={handleReloadPage}>
                {/* Reload Page */}
                Resume
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default WebSockets;
