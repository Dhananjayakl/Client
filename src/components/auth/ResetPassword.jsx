/////////////////////////////RESET PASSWORD ONCE OTP EXPIRE RESEND OTP BUTTON SHOW START

// import React from "react";
// import { json, useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import { Formik } from "formik";
// import { Button, Card, Container, Col, Row, Form, Alert, Spinner } from "react-bootstrap";;
// import FormControl from "src/components/forms/utils/FormControl";
// import { sendOtp, resetPassword } from "src/modules/admin/AdminService";
// import { useState, useEffect } from "react";

// function ResetPassword() {
//   const navigate = useNavigate();

//   let initialValues = {
//     username: "",
//     otp: "",
//     newPassword: "",
//   }

//   const [otp, setOtp] = useState('');
//   const [resetpassword, setResetPassword] = useState("");
//   const [alertMessage, setAlertMessage] = useState("");
//   const [timerAlertMessage, settimerAlertMessage] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [username, setUsername] = useState('');
//   const [resendOTP, setResendOTP] = useState(false);
//   const [ExpireTime, setExpireTime] = useState('');

//   const responseMessage = otp;
//   const words = responseMessage.split(" ");
//   const indexOfExpired = words.indexOf("Expired");
//   useEffect(() => {
//     if (indexOfExpired !== -1 && words.length > indexOfExpired + 2) {
//       const expirationTimeInSeconds = parseInt(words[indexOfExpired + 2], 10);
//       setExpireTime(expirationTimeInSeconds);
//     }
//   }, [indexOfExpired, words]);

//   // const [timerDuration] = useState(ExpireTime);
//   let timerDuration = ExpireTime;
//   const [remainingTime, setRemainingTime] = useState(timerDuration);

//   useEffect(() => {
//     let timerInterval;
//     if (timerAlertMessage && otp) {
//       timerInterval = setInterval(() => {
//         setRemainingTime((prevTime) => prevTime - 1);
//       }, 1000)
//     }
//     if (otp) {
//       setRemainingTime(timerDuration);
//     }
//     return () => {
//       clearInterval(timerInterval);
//     };
//   }, [timerAlertMessage, otp, timerDuration])

//   const timerDisplay =
//     timerAlertMessage && otp ? (
//       <div className="my-3">
//         <Alert variant="success">
//           <div className="alert-message">
//             OTP sent successfully. Expires In: {remainingTime} seconds
//           </div>
//         </Alert>
//       </div>
//     ) : null;

//   useEffect(() => {
//     if (otp) {
//       settimerAlertMessage(true);
//       const timer = setTimeout(() => {
//         settimerAlertMessage(false);
//       }, timerDuration * 1000);
//       return () => clearTimeout(timer);
//     }

//   }, [otp, timerDuration]);

//   useEffect(() => {
//     if (!timerDisplay) {
//       setOtp('');
//     }
//   }, [timerDisplay])

//   function reset() {

//     if (!otp && username) {
//       setLoading(true);
//       sendOtp("sendotp", username)
//         .then((response) => {
//           console.log("OTP", response.data);
//           setOtp(response.data);
//           // const statusCode = response.status;
//           // if (statusCode === 200) {
//           //   setAlertMessage({
//           //     text: "OTP sent successfully",
//           //     variant: "success",
//           //   });
//           // };
//           setLoading(false);
//         }).catch((err) => {
//           console.log(err)
//           const statusCode = err.response.status;
//           if (statusCode === 404) {
//             setAlertMessage({
//               text: "User not found",
//               variant: "danger",
//             });
//           }
//           setLoading(false);
//         });
//     }
//   }

//   let onSubmit = (values, { resetForm }) => {

//     console.log("Values", JSON.stringify(values));
//     if (otp) {
//       setLoading(true);
//       resetPassword("resetpassword", values)
//         .then((response) => {
//           console.log("OTP", response.data);
//           setResetPassword(response.data);
//           const statusCode = response.status;
//           if (statusCode === 200) {
//             setAlertMessage({
//               text: "Password reset successfully",
//               variant: "success",
//             });
//           }
//           resetForm();
//           setTimeout(() => {
//             navigate("/auth/sign-in");

//           }, 3000);
//           setLoading(false);
//         }).catch((err) => {
//           console.log(err);
//           const statusCode = err.response.status;
//           const statusData = err.response.data;
//           setLoading(false);

//           if (statusCode === 401) {
//             setAlertMessage({
//               text: "Invalid OTP",
//               variant: "danger",
//             });
//           } else if (statusCode === 404) {
//             setAlertMessage({
//               text: "User not found",
//               variant: "danger",
//             });
//           }
//           else if (statusCode === 410) {
//             setAlertMessage({
//               text: "Generated OTP is expired",
//               variant: "danger",
//             });
//           } else if (statusCode === 406) {
//             setAlertMessage({
//               text: statusData,
//               variant: "danger",
//             });
//           }

//         });
//     }
//   }
//   const validationSchema = Yup.object({
//     username: Yup.string().required('Username is required'),
//     otp: Yup.string().required('OTP is required'),
//     // otp: Yup.string(),
//     newPassword: Yup.string()
//       .required('Please enter your password')
//       .matches(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,15})/, "Password: 8-15 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char."
//       )
//       .max(15, 'Password must not exceed 15 characters'),
//   });
//   useEffect(() => {
//     if (alertMessage) {
//       setShowAlert(true);
//       const timer = setTimeout(() => {
//         setShowAlert(false);
//       }, 6000);
//       return () => clearTimeout(timer);
//     }
//   }, [alertMessage]);

//   useEffect(() => {
//     if (!username) {
//       setResendOTP(false);
//     }
//   })

//   useEffect(() => {
//     if (alertMessage && showAlert) {
//       const timer = setTimeout(() => {
//         setShowAlert(false);
//       }, 6000);

//       return () => clearTimeout(timer);
//     }
//   }, [alertMessage, showAlert]);

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={onSubmit}

//       enableReinitialize
//     >
//       {({
//         errors,
//         handleSubmit,
//         handleBlur,
//         handleChange,
//         isSubmitting,
//         touched,
//         values,
//         setFieldValue,
//       }) => (
//         useEffect(() => {
//           if (!timerDisplay) {
//             setFieldValue("otp", "");
//             setFieldValue("newPassword", "");
//           }
//         }, [timerDisplay]),
//         < Container fluid className="p-0">
//           <Form onSubmit={handleSubmit}>

//             {timerDisplay}
//             {alertMessage && showAlert && (
//               <Alert
//                 variant={alertMessage.variant}
//                 className="mt-2 d-flex justify-content-center pt-3 "
//               >
//                 <p className="text-lg font-weight-bold">{alertMessage.text}</p>

//               </Alert>
//             )}

//             <Row>
//               <FormControl
//                 control="input"
//                 label="Enter UserName"
//                 name="username"
//                 onChange={(e) => {
//                   const user = e.target.value
//                   setUsername(user)
//                   setFieldValue("username", user)
//                   handleChange(e)

//                 }}
//                 disabled={otp}
//                 required
//               />
//             </Row>
//             {otp && (
//               <>
//                 <Row>
//                   <FormControl
//                     control="input"
//                     label="Enter OTP"
//                     name="otp"
//                     required
//                     // onChange={(e) => {
//                     //   setResendOTP(true)
//                     //   handleChange(e)
//                     // }}
//                     onClick={setResendOTP(true)}

//                   />
//                 </Row>

//                 <Row>
//                   <FormControl
//                     control="password"
//                     label="Enter New Password"
//                     name="newPassword"
//                     required
//                   />
//                 </Row>
//               </>
//             )}

//             {loading ? (
//               <div className="text-center mt-3">
//                 <Spinner animation="border" role="status" variant="primary">
//                   <span className="sr-only"></span>
//                 </Spinner>
//               </div>
//             ) : (
//               <>
//                 {otp ? (
//                   <div className="text-center mt-3">
//                     <Button
//                       type="submit"
//                       variant="primary"
//                       size="lg"
//                     // onClick={setResendOTP(true)}
//                     >
//                       Reset password
//                       {/* {!timerDisplay ? 'Resend OTP' : 'Reset password'} */}

//                     </Button>
//                   </div>
//                 ) :
//                   (
//                     <div className="text-center mt-3">
//                       <Button
//                         type="submit"
//                         variant="primary"
//                         size="lg"
//                         onClick={reset}
//                       >
//                         {resendOTP && username !== '' ? 'Resend OTP' : 'Send OTP'}
//                         {/* Sent OTP */}

//                       </Button>
//                     </div>
//                   )
//                 }
//               </>
//             )}
//           </Form>
//         </Container>
//       )
//       }
//     </Formik >
//   );
// }

// export default ResetPassword;

/////////////////////////////RESET PASSWORD ONCE OTP EXPIRE RESEND OTP BUTTON SHOW END

/////////////////////////////RESET PASSWORD ALL TIME OTP GENERATING RESEND OTP BUTTON START

import React from "react";
import { json, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Button,
  Card,
  Container,
  Col,
  Row,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import FormControl from "src/components/forms/utils/FormControl";
import { sendOtp, resetPassword } from "src/modules/admin/AdminService";
import { useState, useEffect } from "react";

function ResetPassword() {
  const navigate = useNavigate();

  let initialValues = {
    username: "",
    otp: "",
    newPassword: "",
  };

  const [otp, setOtp] = useState("");
  const [resetpassword, setResetPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [ExpireTime, setExpireTime] = useState("");
  const responseMessage = otp;
  const words = responseMessage.split(" ");
  const indexOfExpired = words.indexOf("Expired");
  useEffect(() => {
    if (indexOfExpired !== -1 && words.length > indexOfExpired + 2) {
      const expirationTimeInSeconds = parseInt(words[indexOfExpired + 2], 10);
      setExpireTime(expirationTimeInSeconds);
    }
  }, [indexOfExpired, words]);

  // let timerDuration = ExpireTime;

  const [timer, setTimer] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [clearTimer, setclearTimer] = useState(null);
  const startTimer = () => {
    setShowTimer(true);
    setTimer(ExpireTime);

    if (clearTimer) {
      clearInterval(clearTimer);
    }

    const newclearTimer = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(newclearTimer);
          setShowTimer(false);
        }
        return prevTimer - 1;
      });
    }, 1000);

    setclearTimer(newclearTimer);
  };

  useEffect(() => {
    setTimer(ExpireTime);
    if (ExpireTime > 0) {
      startTimer();
    }
  }, [ExpireTime]);

  function reset() {
    if (username) {
      setLoading(true);
      sendOtp("sendotp", username)
        .then((response) => {
          setOtp(response.data);

          // const statusCode = response.status;
          // if (statusCode === 200) {
          //   setAlertMessage({
          //     text: "OTP sent successfully",
          //     variant: "success",
          //   });
          // };
          setLoading(false);
          startTimer();
        })
        .catch((err) => {
          console.log(err);
          const statusCode = err.response.status;
          if (statusCode === 404) {
            setAlertMessage({
              text: "User not found",
              variant: "danger",
            });
          }
          setLoading(false);
        });
    }
  }

  let onSubmit = (values, { resetForm }) => {
    if (otp) {
      setLoading(true);
      resetPassword("resetpassword", values)
        .then((response) => {
          setResetPassword(response.data);
          const statusCode = response.status;
          if (statusCode === 200) {
            setAlertMessage({
              text: "Password reset successfully",
              variant: "success",
            });
          }
          resetForm();
          setTimeout(() => {
            navigate("/auth/sign-in");
          }, 3000);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          const statusCode = err.response.status;
          const statusData = err.response.data;
          setLoading(false);

          if (statusCode === 401) {
            setAlertMessage({
              text: "Invalid OTP. Please enter valid OTP",
              variant: "danger",
            });
          } else if (statusCode === 404) {
            setAlertMessage({
              text: "User not found",
              variant: "danger",
            });
          } else if (statusCode === 410) {
            setAlertMessage({
              text: "Generated OTP is expired",
              variant: "danger",
            });
          } else if (statusCode === 406) {
            setAlertMessage({
              text: statusData,
              variant: "danger",
            });
          }
        });
    }
  };
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    otp: Yup.string().required("OTP is required"),
    newPassword: Yup.string()
      .required("Please enter your password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*_])(?=.{8,15})/,
        "Password: 8-15 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char."
      )
      .max(15, "Password must not exceed 15 characters"),
  });

  useEffect(() => {
    if (alertMessage) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({
        errors,
        handleSubmit,
        handleBlur,
        handleChange,
        isSubmitting,
        touched,
        values,
        setFieldValue,
      }) => (
        useEffect(() => {
          if (!timer) {
            setFieldValue("otp", "");
            setFieldValue("newPassword", "");
          }
        }, [timer]),
        useEffect(() => {
          if (alertMessage) {
            setTimeout(() => {
              setFieldValue("otp", "");
              setFieldValue("newPassword", "");
            }, 6000);
          }
        }, [alertMessage]),
        (
          <Container fluid className="p-0">
            <Form onSubmit={handleSubmit}>
              {alertMessage && showAlert && (
                <Alert
                  variant={alertMessage.variant}
                  className="mt-2 d-flex justify-content-center pt-3 "
                >
                  <p className="text-lg font-weight-bold">
                    {alertMessage.text}
                  </p>
                </Alert>
              )}

              {/* Only show the timer and form fields if the alert message is not "Password reset successfully" */}
              {alertMessage.text !== "Password reset successfully" && (
                <>
                  {showTimer && (
                    <Alert variant="success" className="my-3">
                      <div className="alert-message">
                        A code has been sent to your email. Expires In: {timer}{" "}
                        seconds
                      </div>
                    </Alert>
                  )}

                  <Row>
                    <FormControl
                      control="input"
                      style={{ borderRadius: "20px" }}
                      // className="bg-dark bg-opacity-2 text-white  inputSize"
                      label="Enter User Name"
                      name="username"
                      onChange={(e) => {
                        const user = e.target.value;
                        setUsername(user);
                        setFieldValue("username", user);
                        handleChange(e);
                      }}
                      disabled={otp}
                      required
                    />
                  </Row>
                  {otp && (
                    <>
                      <Row>
                        <FormControl
                          // className="bg-dark bg-opacity-2 text-white  inputSize"
                          control="input"
                          label="Enter OTP"
                          name="otp"
                          required
                          style={{ borderRadius: "20px" }}
                        />
                      </Row>

                      <Row>
                        <FormControl
                          control="password"
                          label="Enter New Password"
                          name="newPassword"
                          required
                          style={{ borderRadius: "20px" }}
                          // className="bg-dark bg-opacity-2 text-white  inputSize"
                        />
                      </Row>
                    </>
                  )}

                  {loading ? (
                    <div className="text-center mt-3 ">
                      <Spinner animation="border" role="status" variant="light">
                        <span className="sr-only"></span>
                      </Spinner>
                    </div>
                  ) : (
                    <div className="text-center mt-3">
                      {otp ? (
                        <div className="d-flex justify-content-between">
                          <div>
                            <Button
                              type="submit"
                              variant="primary"
                              className="p-1 border"
                            >
                              Reset Password
                            </Button>
                          </div>
                          <div>
                            <Button
                              type="submit"
                              variant="primary"
                              onClick={reset}
                              className="p-1 border"
                            >
                              Resend OTP
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center ">
                          <Button
                            type="submit"
                            onClick={reset}
                            className="p-1 border"
                          >
                            Send OTP
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </Form>
          </Container>
        )
      )}
    </Formik>
  );
}

export default ResetPassword;

/////////////////////////////RESET PASSWORD ALL TIME OTP GENERATING RESEND OTP BUTTON END
