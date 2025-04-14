// ===============MFA FINAL CODE  Once time expire THEN RESEND BUTTON IS SHOWING START=========

// import React, { useState, useEffect } from "react";
// import { Link, } from "react-router-dom";
// import {
//   Container, Card, Dropdown, OverlayTrigger, Tooltip, Alert, Button, Form, Row, Col, Spinner
// } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import { Formik } from "formik";
// import useAuth from "../../hooks/useAuth";

// function SignIn(props) {
//   const navigate = useNavigate();
//   const { signIn } = useAuth();

//   const [user_name, setuser_name] = useState(true);
//   const [selected_Username, setselected_Username] = useState(props.selectedUsername || "");
//   const [renderName, setrenderName] = useState(false);
//   const [isOtherUserSelected, setIsOtherUserSelected] = useState(false);
//   const [mfa, setMfa] = useState(``);
//   const [otp, setOtp] = useState('');
//   const [ExpireTime, setExpireTime] = useState('');

//   let timerDuration = ExpireTime;
//   const [remainingTime, setRemainingTime] = useState(timerDuration);

//   let statusCode = 0;
//   const handleOtherUserClick = () => {
//     setrenderName((prevValue) => !prevValue);
//     setuser_name(true);
//     setIsOtherUserSelected(true);
//     setMfa(``);
//     setRemainingTime(remainingTime === 1);
//   };

//   useEffect(() => {
//     const stored_userdata = localStorage.getItem("loggedUsers");
//     const logged_Users = stored_userdata ? JSON.parse(stored_userdata) : [];
//     if (logged_Users.length > 0) {
//       if (props.addNewAccount) {
//         setuser_name(true);
//       }
//       else {
//         setuser_name(false);
//       }
//     }
//   }, []);

//   const [username, setUsername] = useState('');
//   const [spinner, setSpinner] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   // const [ExpireTime, setExpireTime] = useState('');

//   // const [timerDuration] = useState(60);
//   // let timerDuration = ExpireTime;
//   // const [remainingTime, setRemainingTime] = useState(timerDuration);

//   useEffect(() => {
//     let timerInterval;
//     if (showAlert && mfa === true) {
//       timerInterval = setInterval(() => {
//         setRemainingTime((prevTime) => prevTime - 1);
//       }, 1000);
//     }
//     if (mfa === true) {
//       setRemainingTime(timerDuration);
//     }
//     return () => {
//       clearInterval(timerInterval);
//     };
//   }, [showAlert, mfa, timerDuration]);

//   const timerDisplay =
//     showAlert && mfa === true ? (
//       <div className="my-3">
//         <Alert variant="success">
//           <div className="alert-message">
//             A code has been sent to your email. Expire In: {remainingTime} seconds
//           </div>
//         </Alert>
//       </div>
//     ) : null;

//   useEffect(() => {
//     if (mfa === true) {
//       setShowAlert(true);
//       const timer = setTimeout(() => {
//         setShowAlert(false);
//       }, timerDuration * 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [mfa]);

//   useEffect(() => {
//     if (remainingTime === 1) {
//       setMfa('');
//     }
//   }, [remainingTime]);

//   const handleSignIn = async (values, actions) => {
//     setSpinner(true);
//     try {
//       await signIn(
//         values.username,
//         values.password,
//         values.rememberMe,
//         values.otp,
//         (Mfa) => {
//           if (Mfa && Mfa.mfa === true) {
//             setMfa(Mfa.mfa);
//             setExpireTime(Mfa.expire_time);
//           } else {
//             navigate("/");
//           }
//           setSpinner(false);

//         }
//       );
//       actions.setStatus({ success: true });
//       actions.setSubmitting(false);

//     } catch (error) {
//       const message = error.message || "Something went wrong";
//       console.log("message", message);
//       // window['console']['warn'] = function () { };
//       setSpinner(false);

//       if (error.response && error.response.status) {
//         statusCode = error.response.status;

//       }

//       let errors;

//       if (statusCode === 401 && otp) {
//         errors = "Invalid OTP. Please check your code and try again ";
//         setTimeout(() => {
//           actions.setFieldValue("otp", "");
//           setOtp('');
//         }, 5000)
//       } else if (statusCode === 401) {
//         errors = "Invalid Username or Password.Please enter a valid Username & Password.";
//       } else if (statusCode === 423) {
//         errors = "Your account has been blocked due to too many failed login attempts";
//       } else if (statusCode === 406) {
//         errors = error.response.data;
//         setTimeout(() => {
//           actions.setFieldValue("otp", "");
//           setOtp('');
//         }, 8000)
//       } else if (statusCode === 410) {
//         errors = "Generated OTP is expired";
//         setTimeout(() => {
//           actions.setFieldValue("otp", "");
//           setOtp('');
//         }, 5000)

//       }
//       else if (statusCode === 403) {
//         errors = "Access denied";
//       }
//       else {
//         errors = "An error occurred. " + message;

//       }
//       actions.setStatus({ success: false });
//       actions.setErrors({ submit: errors });
//       actions.setSubmitting(false);

//       // setTimeout(() => {
//       //   actions.setErrors({ submit: "" });
//       // }, 5000);
//     }
//     if (mfa === true && statusCode === 0) {
//       navigate("/");
//     }

//   };

//   return (
//     <Container>
//       <Card>
//         <Card.Body>
//           <Formik
//             key={renderName ? "reset" : "signin"}
//             initialValues={{
//               username: isOtherUserSelected ? "" : selected_Username,
//               otp: '',
//               password: '',
//               rememberMe: false,
//               submit: false,

//             }}
//             validationSchema={Yup.object().shape({
//               username: Yup.string().max(255).required("User Name is required"),
//               otp: mfa === true ? Yup.string().required("OTP is required") : Yup.string(),
//               password: mfa !== true ? Yup.string().max(255).required("Password is required") : Yup.string(),
//             })}

//             onSubmit={(values, actions,) => {
//               handleSignIn(values, actions,);
//             }}
//           >
//             {({
//               errors,
//               handleBlur,
//               handleChange,
//               handleSubmit,
//               isSubmitting,
//               touched,
//               values,
//               setFieldValue,
//             }) => (
//               < Form onSubmit={handleSubmit}>
//                 {errors.submit && (
//                   <Alert className="my-3" variant="danger">
//                     <div className="alert-message">{errors.submit}</div>
//                   </Alert>
//                 )}

//                 {timerDisplay}

//                 <Form.Group className="mb-3">
//                   <Form.Label>User Name</Form.Label>
//                   <Form.Control
//                     size="lg"
//                     type="input"
//                     name="username"
//                     placeholder="Enter your user name"
//                     value={values.username}
//                     isInvalid={Boolean(touched.username && errors.username)}
//                     onBlur={handleBlur}
//                     onChange={(e) => {
//                       const username = e.target.value
//                       setUsername(username);
//                       setFieldValue("username", username)
//                     }}
//                     disabled={!user_name || remainingTime === 1 || mfa === true}

//                   />
//                   {!!touched.username && (
//                     <Form.Control.Feedback type="invalid">
//                       {errors.username}
//                     </Form.Control.Feedback>
//                   )}
//                 </Form.Group>

//                 {mfa === true || remainingTime === 1 ? (
//                   <Form.Group className="mb-3">
//                     <Form.Label>Enter OTP</Form.Label>
//                     <Form.Control
//                       size="lg"
//                       type="text"
//                       name="otp"
//                       placeholder="Enter your otp"
//                       value={values.otp}
//                       isInvalid={Boolean(touched.otp && errors.otp)}
//                       onBlur={handleBlur}
//                       onChange={(e) => {
//                         const otp = e.target.value;
//                         setFieldValue("otp", otp);
//                         setOtp(otp)
//                         handleChange(e);
//                       }}
//                     />
//                     {!!touched.otp && (
//                       <Form.Control.Feedback type="invalid">
//                         {errors.otp}
//                       </Form.Control.Feedback>
//                     )}
//                   </Form.Group>
//                 ) : null}

//                 {mfa !== true && remainingTime !== 1 && ( //&& remainingTime !== 2
//                   <Form.Group className="mb-3">
//                     <Form.Label>Password</Form.Label>
//                     <Form.Control
//                       size="lg"
//                       type="password"
//                       name="password"
//                       placeholder="Enter your password"
//                       value={values.password}
//                       isInvalid={Boolean(touched.password && errors.password)}
//                       onBlur={handleBlur}
//                       onChange={handleChange}

//                     // required
//                     />
//                     {!!touched.password && (
//                       <Form.Control.Feedback type="invalid">
//                         {errors.password}
//                       </Form.Control.Feedback>
//                     )
//                     }
//                   </Form.Group>
//                 )}

//                 <Form.Group className="mb-3">

//                   <Row>
//                     <Col>
//                       <small className="text-sm">
//                         <Link to="/auth/reset-password" className="text-decoration-none">Forgot password?</Link>
//                       </small>
//                     </Col>
//                     {/*|| username === '' || remainingTime === 1 */}
//                     {props.addNewAccount ? "" : <Col className="d-flex justify-content-end">
//                       <small className="text-sm">
//                         <Link
//                           to="/auth/sign-in"
//                           onClick={handleOtherUserClick}
//                           className="text-decoration-none"
//                         >
//                           Other User..?
//                         </Link>
//                       </small>
//                     </Col>}
//                   </Row>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   {!user_name ? null : (
//                     <Form.Check
//                       type="checkbox"
//                       name="rememberMe"
//                       label="Remember Me"
//                       checked={values.rememberMe}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       isInvalid={Boolean(
//                         touched.rememberMe && errors.rememberMe
//                       )}
//                     />
//                   )}
//                   {!!touched.rememberMe && (
//                     <Form.Control.Feedback type="invalid">
//                       {errors.rememberMe}
//                     </Form.Control.Feedback>
//                   )}
//                 </Form.Group>

//                 {spinner ? (
//                   <div className="text-center mt-3">
//                     <Spinner animation="border" variant="primary" />
//                   </div>
//                 ) : (

//                   <div className="text-center mt-3">
//                     <Button
//                       type="submit"
//                       variant="primary"
//                       size="lg"
//                     // disabled={isSubmitting}
//                     >
//                       {remainingTime === 1 && otp === '' ? 'Resend OTP' : 'Sign In'}
//                     </Button>
//                   </div>
//                 )}
//               </Form>
//             )}
//           </Formik>
//         </Card.Body>
//       </Card>
//     </Container >
//   );
// }

// function SignInHistory() {
//   const [logged_Users, setlogged_Users] = useState(
//     localStorage.getItem("loggedUsers") ? JSON.parse(localStorage.getItem("loggedUsers")) : []
//   )

//   //deleting userlist from signIN history  start
//   const [userNames, setUserNames] = useState(
//     logged_Users.map((user) => user.user_details.data[0].user_name)
//   );
//   const [selectedUserName, setSelectedUserName] = useState(null);

//   const handleDelete = (index) => {
//     const updatedUserNames = [...userNames];
//     updatedUserNames.splice(index, 1);

//     const updated_Users_afterdeleting = logged_Users.filter((_, i) => i !== index);
//     localStorage.setItem("loggedUsers", JSON.stringify(updated_Users_afterdeleting));

//     setUserNames(updatedUserNames);
//     window.location.reload();

//   };
//   //deleting userlist from signIN history  END

//   const handleUser = (index) => {
//     const selectedUserName = userNames[index];
//     setSelectedUserName(selectedUserName);
//     const selectedUser = logged_Users[index];
//     const firstName = selectedUser.user_details.data[0].first_name;

//     console.log("Login User Name:", selectedUserName);
//     console.log("First Name:", firstName);

//   };
//   if (selectedUserName === "addAcc") {
//     return <SignIn addNewAccount={selectedUserName === "addAcc"} />;
//   }

//   if (selectedUserName === null) {
//     return (
//       <Container>
//         <Card>
//           <Card.Body>
//             <div className="text-center mt-3">
//               <h4>Select an account to sign in</h4>
//               {userNames.map((userName, index) => (
//                 <div key={index} className="mt-3 user-card d-flex align-items-center">
//                   <div className="flex-grow-1">

//                     <OverlayTrigger
//                       placement="bottom"
//                       overlay={<Tooltip>Click Here</Tooltip>}
//                       trigger={['hover', 'focus']}
//                     >
//                       <Button
//                         variant="link"
//                         className="text-decoration-none d-flex align-items-center p-2 h4 text border-bottom w-100"
//                         onClick={() => handleUser(index)}
//                       >
//                         <div className="d-flex align-items-center h4">
//                           <FontAwesomeIcon icon={faUser} className="mr-3 h3 me-4" />
//                           <span>{userName}</span>
//                         </div>
//                       </Button>
//                     </OverlayTrigger>
//                   </div>
//                   <Dropdown className="ml-2">
//                     <Dropdown.Toggle variant="link" className="text-decoration-none text-varient border-0" />
//                     <Dropdown.Menu>
//                       <Dropdown.Item onClick={() => handleDelete(index)}>Delete</Dropdown.Item>
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </div>
//               ))}
//               <div className="mt-3 user-card d-flex align-items-center ">
//                 <div className="flex-grow-1">
//                   <OverlayTrigger
//                     placement="bottom"
//                     overlay={<Tooltip>Click Here</Tooltip>}
//                     trigger={['hover', 'focus']}
//                   >
//                     <Button variant="link" className="text-decoration-none" onClick={() => setSelectedUserName("addAcc")}>
//                       <FontAwesomeIcon icon={faPlus} className="me-2 " />
//                       Add Account
//                     </Button>
//                   </OverlayTrigger>
//                 </div>
//               </div>
//             </div>
//           </Card.Body>
//         </Card>
//       </Container>

//     );
//   }

//   return (
//     <SignIn selectedUsername={selectedUserName} />
//   );
// }

// function SignIn_Page() {
//   const [userExist, setUserExist] = useState("No");

//   useEffect(() => {
//     const stored_userdata = localStorage.getItem("loggedUsers");
//     const logged_Users = stored_userdata ? JSON.parse(stored_userdata) : [];

//     if (logged_Users.length > 0) {
//       const lastItem = logged_Users[logged_Users.length - 1];
//       setUserExist("Yes");
//     } else {
//       setUserExist("No");
//     }
//   }, []);

//   useEffect(() => {

//   }, [userExist]);

//   return (
//     <>
//       {userExist === "No" && <SignIn />}
//       {userExist === "Yes" && <SignInHistory />}
//     </>
//   );
// }

// export default SignIn_Page;

// ===============MFA FINAL CODE  Once time expire THEN RESEND BUTTON IS SHOWING END=========

//==================MFA FINAL CODE WITH ALL TIME RESEND OTP BUTTON   START=============

// import React, { useState, useEffect } from "react";
// import { Link, } from "react-router-dom";
// import {
//   Container, Card, Dropdown, OverlayTrigger, Tooltip, Alert, Button, Form, Row, Col, Spinner
// } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";
// import * as Yup from "yup";
// import { Formik } from "formik";
// import useAuth from "../../hooks/useAuth";
// import { actions } from "react-table";

// function SignIn(props) {
//   const navigate = useNavigate();
//   const { signIn } = useAuth();

//   const [resendButtonClicked, setResendButtonClicked] = useState(false);
//   const [buttonClicked, setButtonClicked] = useState("");
//   const [user_name, setuser_name] = useState(true);
//   const [selected_Username, setselected_Username] = useState(props.selectedUsername || "");
//   const [renderName, setrenderName] = useState(false);
//   const [isOtherUserSelected, setIsOtherUserSelected] = useState(false);
//   const [mfa, setMfa] = useState(``);
//   const [otp, setOtp] = useState('');
//   const [username, setUsername] = useState('');
//   const [spinner, setSpinner] = useState(false);
//   const [ExpireTime, setExpireTime] = useState(0);
//   const [timer, setTimer] = useState(0);
//   const [showTimer, setShowTimer] = useState(false);
//   const [clearTimer, setclearTimer] = useState(null);

//   const startTimer = () => {
//     setShowTimer(true);
//     setTimer(ExpireTime);

//     if (clearTimer) {
//       clearInterval(clearTimer);
//     }

//     const newclearTimer = setInterval(() => {
//       setTimer((prevTimer) => {
//         if (prevTimer === 1) {
//           clearInterval(newclearTimer);
//           setShowTimer(false);
//         }
//         return prevTimer - 1;
//       });
//     }, 1000);

//     setclearTimer(newclearTimer);

//   };
//   useEffect(() => {
//     setTimer(ExpireTime);
//     if (ExpireTime > 0) {
//       startTimer();
//     }
//   }, [ExpireTime]);

//   let statusCode = 0;
//   const handleOtherUserClick = () => {
//     setrenderName((prevValue) => !prevValue);
//     setuser_name(true);
//     setIsOtherUserSelected(true);
//     setMfa(``);
//     setSpinner(false);
//     setShowTimer(false);
//   };

//   useEffect(() => {
//     const stored_userdata = localStorage.getItem("loggedUsers");
//     const logged_Users = stored_userdata ? JSON.parse(stored_userdata) : [];
//     if (logged_Users.length > 0) {
//       if (props.addNewAccount) {
//         setuser_name(true);
//       }
//       else {
//         setuser_name(false);
//       }
//     }
//   }, []);

//   const handleSignIn = async (values, actions) => {
//     setSpinner(true);
//     try {
//       await signIn(
//         values.username,
//         values.password,
//         values.rememberMe,
//         values.otp,
//         (Mfa) => {
//           if (Mfa && Mfa.mfa === true) {
//             setMfa(Mfa.mfa);
//             setExpireTime(Mfa.expire_time);
//             startTimer();

//           } else {
//             navigate("/");
//           }
//           setSpinner(false);

//         }
//       );
//       actions.setStatus({ success: true });
//       actions.setSubmitting(false);

//     } catch (error) {
//       const message = error.message || "Something went wrong";
//       setSpinner(false);

//       if (error.response && error.response.status) {
//         statusCode = error.response.status;
//       }

//       let errors;

//       if (statusCode === 401 && otp) {
//         errors = "Invalid OTP. Please check your code and try again ";
//         setTimeout(() => {
//           actions.setFieldValue("otp", "");
//           setOtp('');
//         }, 5000)
//       } else if (statusCode === 401) {
//         errors = "Invalid Username or Password.Please enter a valid Username & Password.";
//       } else if (statusCode === 423) {
//         errors = "Your account has been blocked due to too many failed login attempts";
//       } else if (statusCode === 406) {
//         errors = error.response.data;
//         setTimeout(() => {
//           actions.setFieldValue("otp", "");
//           setOtp('');
//         }, 8000)
//       } else if (statusCode === 410) {
//         errors = "Generated OTP is expired";
//         setTimeout(() => {
//           actions.setFieldValue("otp", "");
//           setOtp('');
//         }, 5000)
//       }
//       else if (statusCode === 403) {
//         errors = "Access denied";
//       }
//       else {
//         errors = "An error occurred. " + message;
//       }
//       actions.setStatus({ success: false });
//       actions.setErrors({ submit: errors });
//       actions.setSubmitting(false);
//     }

//     if (mfa === true && statusCode === 0 && !resendButtonClicked) {
//       navigate("/");
//     }
//   };

//   return (
//     <Container>
//       <Card>
//         <Card.Body>
//           <Formik
//             key={renderName ? "reset" : "signin"}
//             initialValues={{
//               username: isOtherUserSelected ? "" : selected_Username,
//               otp: '',
//               password: '',
//               rememberMe: false,
//               submit: false,

//             }}

//             validationSchema={Yup.object().shape({
//               username: Yup.string().max(255).required("User Name is required"),
//               otp: (buttonClicked === "SignIn" && mfa === true) ? Yup.string().required("OTP is required") : Yup.string(),
//               password: (mfa !== true) ? Yup.string().max(255).required("Password is required") : Yup.string(),
//             })}
//             onSubmit={(values, actions,) => {
//               handleSignIn(values, actions,);
//             }}
//           >
//             {({
//               errors,
//               handleBlur,
//               handleChange,
//               handleSubmit,
//               isSubmitting,
//               touched,
//               values,
//               setFieldValue,
//             }) => (
//               < Form onSubmit={handleSubmit}>
//                 {errors.submit && (
//                   <Alert className="my-3" variant="danger">
//                     <div className="alert-message">{errors.submit}</div>
//                   </Alert>
//                 )}

//                 {showTimer && (
//                   <Alert variant="success" className="my-3">
//                     <div className="alert-message">
//                       A code has been sent to your email. Expire's In: {timer} seconds
//                     </div>
//                   </Alert>
//                 )}

//                 <Form.Group className="mb-3">
//                   <Form.Label>User Name</Form.Label>
//                   <Form.Control
//                     size="lg"
//                     type="input"
//                     name="username"
//                     placeholder="Enter your user name"
//                     value={values.username}
//                     isInvalid={Boolean(touched.username && errors.username)}
//                     onBlur={handleBlur}
//                     onChange={(e) => {
//                       const username = e.target.value
//                       setUsername(username);
//                       setFieldValue("username", username)
//                     }}
//                     disabled={!user_name || mfa === true}

//                   />
//                   {!!touched.username && (
//                     <Form.Control.Feedback type="invalid">
//                       {errors.username}
//                     </Form.Control.Feedback>
//                   )}
//                 </Form.Group>

//                 {mfa === true ? (
//                   <Form.Group className="mb-3">
//                     <Form.Label>Enter OTP</Form.Label>
//                     <Form.Control
//                       size="lg"
//                       type="text"
//                       name="otp"
//                       placeholder="Enter your otp"
//                       value={values.otp}
//                       // isInvalid={Boolean(touched.otp && errors.otp)}
//                       isInvalid={(buttonClicked === "SignIn" && Boolean(touched.otp && errors.otp))}
//                       onBlur={handleBlur}
//                       onChange={(e) => {
//                         const otp = e.target.value;
//                         setFieldValue("otp", otp);
//                         setOtp(otp)
//                         handleChange(e);
//                       }}
//                     />
//                     {!!touched.otp && (
//                       <Form.Control.Feedback type="invalid">
//                         {errors.otp}
//                       </Form.Control.Feedback>
//                     )}
//                   </Form.Group>
//                 ) : null}

//                 {mfa !== true && (
//                   <Form.Group className="mb-3">
//                     <Form.Label>Password</Form.Label>
//                     <Form.Control
//                       size="lg"
//                       type="password"
//                       name="password"
//                       placeholder="Enter your password"
//                       value={values.password}
//                       isInvalid={Boolean(touched.password && errors.password)}
//                       onBlur={handleBlur}
//                       onChange={handleChange}

//                     // required
//                     />
//                     {!!touched.password && (
//                       <Form.Control.Feedback type="invalid">
//                         {errors.password}
//                       </Form.Control.Feedback>
//                     )
//                     }
//                   </Form.Group>
//                 )}

//                 <Form.Group className="mb-3">

//                   <Row>
//                     <Col>
//                       <small className="text-sm">
//                         <Link to="/auth/reset-password" className="text-decoration-none">Forgot password?</Link>
//                       </small>
//                     </Col>
//                     {/*|| username === '' || remainingTime === 1 */}
//                     {props.addNewAccount ? "" : <Col className="d-flex justify-content-end">
//                       <small className="text-sm">
//                         <Link
//                           to="/auth/sign-in"
//                           onClick={handleOtherUserClick}
//                           className="text-decoration-none"
//                         >
//                           Other User..?
//                         </Link>
//                       </small>
//                     </Col>}
//                   </Row>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   {!user_name ? null : (
//                     <Form.Check
//                       type="checkbox"
//                       name="rememberMe"
//                       label="Remember Me"
//                       checked={values.rememberMe}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       isInvalid={Boolean(
//                         touched.rememberMe && errors.rememberMe
//                       )}
//                     />
//                   )}
//                   {!!touched.rememberMe && (
//                     <Form.Control.Feedback type="invalid">
//                       {errors.rememberMe}
//                     </Form.Control.Feedback>
//                   )}
//                 </Form.Group>

//                 <div className="mt-3">
//                   {spinner ? (
//                     <div className="text-center">
//                       <Spinner animation="border" variant="primary" />
//                     </div>
//                   ) : (
//                     <div className={mfa === true ? "d-flex justify-content-between align-items-center" : "text-center"}>
//                       <Button
//                         type="submit"
//                         variant="primary"
//                         size="lg"
//                         // disabled={isSubmitting}
//                         onClick={() => {
//                           setButtonClicked("SignIn");
//                           setResendButtonClicked(false);
//                         }}
//                       >
//                         Sign In
//                       </Button>
//                       {mfa === true &&
//                         <Button
//                           type="submit"
//                           variant="primary"
//                           size="lg"
//                           onClick={() => {
//                             setButtonClicked("Resend");
//                             setResendButtonClicked(true);
//                             setFieldValue("otp", '');
//                             setSpinner(false);

//                           }}
//                         >
//                           Resend OTP
//                         </Button>
//                       }
//                     </div>
//                   )}
//                 </div>

//               </Form>
//             )}
//           </Formik>
//         </Card.Body>
//       </Card>
//     </Container >
//   );
// }

// function SignInHistory() {
//   const [logged_Users, setlogged_Users] = useState(
//     localStorage.getItem("loggedUsers") ? JSON.parse(localStorage.getItem("loggedUsers")) : []
//   )

//   //deleting userlist from signIN history  start
//   const [userNames, setUserNames] = useState(
//     logged_Users.map((user) => user.user_details.data[0].user_name)
//   );
//   const [selectedUserName, setSelectedUserName] = useState(null);

//   const handleDelete = (index) => {
//     const updatedUserNames = [...userNames];
//     updatedUserNames.splice(index, 1);

//     const updated_Users_afterdeleting = logged_Users.filter((_, i) => i !== index);
//     localStorage.setItem("loggedUsers", JSON.stringify(updated_Users_afterdeleting));

//     setUserNames(updatedUserNames);
//     window.location.reload();

//   };
//   //deleting userlist from signIN history  END

//   const handleUser = (index) => {
//     const selectedUserName = userNames[index];
//     setSelectedUserName(selectedUserName);
//     const selectedUser = logged_Users[index];
//     const firstName = selectedUser.user_details.data[0].first_name;

//   };
//   if (selectedUserName === "addAcc") {
//     return <SignIn addNewAccount={selectedUserName === "addAcc"} />;
//   }

//   if (selectedUserName === null) {
//     return (
//       <Container>
//         <Card>
//           <Card.Body>
//             <div className="text-center mt-3">
//               <h4>Select an account to sign in</h4>
//               {userNames.map((userName, index) => (
//                 <div key={index} className="mt-3 user-card d-flex align-items-center">
//                   <div className="flex-grow-1">

//                     <OverlayTrigger
//                       placement="bottom"
//                       overlay={<Tooltip>Click Here</Tooltip>}
//                       trigger={['hover', 'focus']}
//                     >
//                       <Button
//                         variant="link"
//                         className="text-decoration-none d-flex align-items-center p-2 h4 text border-bottom w-100"
//                         onClick={() => handleUser(index)}
//                       >
//                         <div className="d-flex align-items-center h4">
//                           <FontAwesomeIcon icon={faUser} className="mr-3 h3 me-4" />
//                           <span>{userName}</span>
//                         </div>
//                       </Button>
//                     </OverlayTrigger>
//                   </div>
//                   <Dropdown className="ml-2">
//                     <Dropdown.Toggle variant="link" className="text-decoration-none text-varient border-0" />
//                     <Dropdown.Menu>
//                       <Dropdown.Item onClick={() => handleDelete(index)}>Delete</Dropdown.Item>
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </div>
//               ))}
//               <div className="mt-3 user-card d-flex align-items-center ">
//                 <div className="flex-grow-1">
//                   <OverlayTrigger
//                     placement="bottom"
//                     overlay={<Tooltip>Click Here</Tooltip>}
//                     trigger={['hover', 'focus']}
//                   >
//                     <Button variant="link" className="text-decoration-none" onClick={() => setSelectedUserName("addAcc")}>
//                       <FontAwesomeIcon icon={faPlus} className="me-2 " />
//                       Add Account
//                     </Button>
//                   </OverlayTrigger>
//                 </div>
//               </div>
//             </div>
//           </Card.Body>
//         </Card>
//       </Container>

//     );
//   }

//   return (
//     <SignIn selectedUsername={selectedUserName} />
//   );
// }

// function SignIn_Page() {
//   const [userExist, setUserExist] = useState("No");

//   useEffect(() => {
//     const stored_userdata = localStorage.getItem("loggedUsers");
//     const logged_Users = stored_userdata ? JSON.parse(stored_userdata) : [];

//     if (logged_Users.length > 0) {
//       const lastItem = logged_Users[logged_Users.length - 1];
//       setUserExist("Yes");
//     } else {
//       setUserExist("No");
//     }
//   }, []);

//   useEffect(() => {
//   }, [userExist]);

//   return (
//     <>
//       {userExist === "No" && <SignIn />}
//       {userExist === "Yes" && <SignInHistory />}
//     </>
//   );
// }

// export default SignIn_Page;

//==================MFA FINAL CODE WITH ALL TIME RESEND OTP BUTTON   END=============

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   Container,
//   Card,
//   Dropdown,
//   OverlayTrigger,
//   Tooltip,
//   Alert,
//   Button,
//   Form,
//   Row,
//   Col,
//   Spinner,
// } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate, useLocation } from "react-router-dom";
// import * as Yup from "yup";
// import { Formik } from "formik";
// import useAuth from "../../hooks/useAuth";
// import useSidebar from "../../hooks/useSidebar";
// import { SIDEBAR_POSITION, SIDEBAR_BEHAVIOR } from "../../constants";

// function SignIn(props) {
//   const navigate = useNavigate();

//   const { isOpen, setIsOpen, behavior, setBehavior } = useSidebar();

//   const { signIn } = useAuth();

//   const { state } = useLocation();

//   if (state?.bearerURL != "/") {
//     const stateString = JSON.stringify(state);
//     sessionStorage.setItem("stateData", stateString);
//   }

//   const [resendButtonClicked, setResendButtonClicked] = useState(false);
//   const [buttonClicked, setButtonClicked] = useState("");
//   const [user_name, setuser_name] = useState(true);
//   const [selected_Username, setselected_Username] = useState(
//     props.selectedUsername || ""
//   );
//   const [renderName, setrenderName] = useState(false);
//   const [isOtherUserSelected, setIsOtherUserSelected] = useState(false);
//   const [mfa, setMfa] = useState(``);
//   const [otp, setOtp] = useState("");
//   const [username, setUsername] = useState("");
//   const [spinner, setSpinner] = useState(false);
//   const [ExpireTime, setExpireTime] = useState(0);
//   const [timer, setTimer] = useState(0);
//   const [showTimer, setShowTimer] = useState(false);
//   const [clearTimer, setclearTimer] = useState(null);

//   const startTimer = () => {
//     setShowTimer(true);
//     setTimer(ExpireTime);

//     if (clearTimer) {
//       clearInterval(clearTimer);
//     }

//     const newclearTimer = setInterval(() => {
//       setTimer((prevTimer) => {
//         if (prevTimer === 1) {
//           clearInterval(newclearTimer);
//           setShowTimer(false);
//         }
//         return prevTimer - 1;
//       });
//     }, 1000);

//     setclearTimer(newclearTimer);
//   };
//   useEffect(() => {
//     setTimer(ExpireTime);
//     if (ExpireTime > 0) {
//       startTimer();
//     }
//   }, [ExpireTime]);

//   let statusCode = 0;
//   const handleOtherUserClick = () => {
//     setrenderName((prevValue) => !prevValue);
//     setuser_name(true);
//     setIsOtherUserSelected(true);
//     setMfa(``);
//     setSpinner(false);
//     setShowTimer(false);
//   };

//   useEffect(() => {
//     const stored_userdata = localStorage.getItem("loggedUsers");
//     const logged_Users = stored_userdata ? JSON.parse(stored_userdata) : [];
//     if (logged_Users.length > 0) {
//       if (props.addNewAccount) {
//         setuser_name(true);
//       } else {
//         setuser_name(false);
//       }
//     }
//   }, []);

//   const handleSignIn = async (values, actions) => {
//     setSpinner(true);
//     try {
//       await signIn(
//         values.username,
//         values.password,
//         values.rememberMe,
//         values.otp,
//         (Mfa) => {
//           if (Mfa && Mfa.mfa === true) {
//             setMfa(Mfa.mfa);
//             setExpireTime(Mfa.expire_time);
//             startTimer();
//           } else if (state?.bearerURL && state?.bearerURL !== "/") {
//             navigate(state?.bearerURL);
//           } else {
//             navigate("/DashboardNavigation");
//             setBehavior(SIDEBAR_BEHAVIOR.STICKY);
//           }
//           setSpinner(false);
//         }
//       );
//       actions.setStatus({ success: true });
//       actions.setSubmitting(false);
//     } catch (error) {
//       const message = error.message || "Something went wrong";
//       setSpinner(false);

//       if (error.response && error.response.status) {
//         statusCode = error.response.status;
//       }

//       let errors;
//       if (statusCode === 401 && otp) {
//         errors = "Invalid OTP. Please check your code and try again ";
//         setTimeout(() => {
//           actions.setFieldValue("otp", "");
//           setOtp("");
//         }, 5000);
//       } else if (statusCode === 401) {
//         errors = "Invalid Password.Please enter a valid Password.";
//       } else if (statusCode === 423) {
//         errors =
//           "Your account has been blocked due to too many failed login attempts";
//       } else if (statusCode === 406) {
//         errors = error.response.data;
//         setTimeout(() => {
//           actions.setFieldValue("otp", "");
//           setOtp("");
//         }, 8000);
//       } else if (statusCode === 410) {
//         errors = "Generated OTP is expired";
//         setTimeout(() => {
//           actions.setFieldValue("otp", "");
//           setOtp("");
//         }, 5000);
//       } else if (statusCode === 403) {
//         errors = error.response.data;
//       } else if (statusCode) {
//         errors = error.response.data;
//       } else {
//         errors = "An error occurred. " + message;
//       }
//       actions.setStatus({ success: false });
//       actions.setErrors({ submit: errors });
//       actions.setSubmitting(false);
//     }

//     if (mfa === true && statusCode === 0 && !resendButtonClicked) {
//       navigate("/");
//     }
//   };

//   return (
//     <Container>
//       <Card>
//         <Card.Body>
//           <Formik
//             key={renderName ? "reset" : "signin"}
//             initialValues={{
//               username: isOtherUserSelected ? "" : selected_Username,
//               otp: "",
//               password: "",
//               rememberMe: false,
//               submit: false,
//             }}
//             validationSchema={Yup.object().shape({
//               username: Yup.string().max(255).required("User Name is required"),
//               otp:
//                 buttonClicked === "SignIn" && mfa === true
//                   ? Yup.string().required("OTP is required")
//                   : Yup.string(),
//               password:
//                 mfa !== true
//                   ? Yup.string().max(255).required("Password is required")
//                   : Yup.string(),
//             })}
//             onSubmit={(values, actions) => {
//               handleSignIn(values, actions);
//             }}
//           >
//             {({
//               errors,
//               handleBlur,
//               handleChange,
//               handleSubmit,
//               isSubmitting,
//               touched,
//               values,
//               setFieldValue,
//             }) => (
//               <Form onSubmit={handleSubmit}>
//                 {errors.submit && (
//                   <Alert className="my-3" variant="danger">
//                     <div className="alert-message">{errors.submit}</div>
//                   </Alert>
//                 )}

//                 {showTimer && (
//                   <Alert variant="success" className="my-3">
//                     <div className="alert-message">
//                       A code has been sent to your email. Expire's In: {timer}{" "}
//                       seconds
//                     </div>
//                   </Alert>
//                 )}

//                 <Form.Group className="mb-3">
//                   <Form.Label>User Name</Form.Label>
//                   <Form.Control
//                     className="input-border-bottom"
//                     size="lg"
//                     type="input"
//                     name="username"
//                     placeholder="Enter your user name"
//                     value={values.username}
//                     isInvalid={Boolean(touched.username && errors.username)}
//                     onBlur={handleBlur}
//                     onChange={(e) => {
//                       const username = e.target.value;
//                       setUsername(username);
//                       setFieldValue("username", username);
//                     }}
//                     disabled={!user_name || mfa === true}
//                   />
//                   {!!touched.username && (
//                     <Form.Control.Feedback type="invalid">
//                       {errors.username}
//                     </Form.Control.Feedback>
//                   )}
//                 </Form.Group>

//                 {mfa === true ? (
//                   <Form.Group className="mb-3">
//                     <Form.Label>Enter OTP</Form.Label>
//                     <Form.Control
//                       // className="input-border-bottom"
//                       size="lg"
//                       type="text"
//                       name="otp"
//                       placeholder="Enter your otp"
//                       value={values.otp}
//                       // isInvalid={Boolean(touched.otp && errors.otp)}
//                       isInvalid={
//                         buttonClicked === "SignIn" &&
//                         Boolean(touched.otp && errors.otp)
//                       }
//                       onBlur={handleBlur}
//                       onChange={(e) => {
//                         const otp = e.target.value;
//                         setFieldValue("otp", otp);
//                         setOtp(otp);
//                         handleChange(e);
//                       }}
//                     />
//                     {!!touched.otp && (
//                       <Form.Control.Feedback type="invalid">
//                         {errors.otp}
//                       </Form.Control.Feedback>
//                     )}
//                   </Form.Group>
//                 ) : null}

//                 {mfa !== true && (
//                   <Form.Group className="mb-3">
//                     <Form.Label>Password</Form.Label>
//                     <Form.Control
//                       className="input-border-bottom"
//                       size="lg"
//                       type="password"
//                       name="password"
//                       placeholder="Enter your password"
//                       value={values.password}
//                       isInvalid={Boolean(touched.password && errors.password)}
//                       onBlur={handleBlur}
//                       onChange={handleChange}

//                       // required
//                     />
//                     {!!touched.password && (
//                       <Form.Control.Feedback type="invalid">
//                         {errors.password}
//                       </Form.Control.Feedback>
//                     )}
//                   </Form.Group>
//                 )}

//                 <Form.Group className="mb-3">
//                   <Row>
//                     <Col>
//                       <small className="text-sm">
//                         <Link
//                           to="/auth/reset-password"
//                           className="text-decoration-none"
//                         >
//                           Forgot password?
//                         </Link>
//                       </small>
//                     </Col>
//                     {/*|| username === '' || remainingTime === 1 */}
//                     {props.addNewAccount ? (
//                       ""
//                     ) : (
//                       <Col className="d-flex justify-content-end">
//                         <small className="text-sm">
//                           <Link
//                             to="/auth/sign-in"
//                             onClick={handleOtherUserClick}
//                             className="text-decoration-none"
//                           >
//                             Other User..?
//                           </Link>
//                         </small>
//                       </Col>
//                     )}
//                   </Row>
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   {!user_name ? null : (
//                     <Form.Check
//                       type="checkbox"
//                       name="rememberMe"
//                       label="Remember Me"
//                       checked={values.rememberMe}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       isInvalid={Boolean(
//                         touched.rememberMe && errors.rememberMe
//                       )}
//                     />
//                   )}
//                   {!!touched.rememberMe && (
//                     <Form.Control.Feedback type="invalid">
//                       {errors.rememberMe}
//                     </Form.Control.Feedback>
//                   )}
//                 </Form.Group>

//                 <div className="mt-3">
//                   {spinner ? (
//                     <div className="text-center">
//                       <Spinner animation="border" variant="primary" />
//                     </div>
//                   ) : (
//                     <div
//                       className={
//                         mfa === true
//                           ? "d-flex justify-content-between align-items-center"
//                           : "text-center"
//                       }
//                     >
//                       <Button
//                         type="submit"
//                         variant="primary"
//                         size="lg"
//                         // disabled={isSubmitting}
//                         onClick={() => {
//                           setButtonClicked("SignIn");
//                           setResendButtonClicked(false);
//                         }}
//                       >
//                         Sign In
//                       </Button>
//                       {mfa === true && (
//                         <Button
//                           type="submit"
//                           variant="primary"
//                           size="lg"
//                           onClick={() => {
//                             setButtonClicked("Resend");
//                             setResendButtonClicked(true);
//                             setFieldValue("otp", "");
//                             setSpinner(false);
//                           }}
//                         >
//                           Resend OTP
//                         </Button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// }

// function SignInHistory() {
//   const [logged_Users, setlogged_Users] = useState(
//     localStorage.getItem("loggedUsers")
//       ? JSON.parse(localStorage.getItem("loggedUsers"))
//       : []
//   );

//   //deleting userlist from signIN history  start
//   const [userNames, setUserNames] = useState(
//     logged_Users.map((user) => user.user_details.data[0].user_name)
//   );
//   const [selectedUserName, setSelectedUserName] = useState(null);

//   const handleDelete = (index) => {
//     const updatedUserNames = [...userNames];
//     updatedUserNames.splice(index, 1);

//     const updated_Users_afterdeleting = logged_Users.filter(
//       (_, i) => i !== index
//     );
//     localStorage.setItem(
//       "loggedUsers",
//       JSON.stringify(updated_Users_afterdeleting)
//     );

//     setUserNames(updatedUserNames);
//     window.location.reload();
//   };
//   //deleting userlist from signIN history  END

//   const handleUser = (index) => {
//     const selectedUserName = userNames[index];
//     setSelectedUserName(selectedUserName);
//     const selectedUser = logged_Users[index];
//     const firstName = selectedUser.user_details.data[0].first_name;
//   };
//   if (selectedUserName === "addAcc") {
//     return <SignIn addNewAccount={selectedUserName === "addAcc"} />;
//   }

//   if (selectedUserName === null) {
//     return (
//       <Container>
//         <Card>
//           <Card.Body>
//             <div className="text-center mt-3">
//               <h4>Select an account to sign in</h4>
//               {userNames.map((userName, index) => (
//                 <div
//                   key={index}
//                   className="mt-3 user-card d-flex align-items-center"
//                 >
//                   <div className="flex-grow-1">
//                     <OverlayTrigger
//                       placement="bottom"
//                       overlay={<Tooltip>Click Here</Tooltip>}
//                       trigger={["hover", "focus"]}
//                     >
//                       <Button
//                         variant="link"
//                         className="text-decoration-none d-flex align-items-center p-2 h4 text border-bottom w-100"
//                         onClick={() => handleUser(index)}
//                       >
//                         <div className="d-flex align-items-center h4">
//                           <FontAwesomeIcon
//                             icon={faUser}
//                             className="mr-3 h3 me-4"
//                           />
//                           <span>{userName}</span>
//                         </div>
//                       </Button>
//                     </OverlayTrigger>
//                   </div>
//                   <Dropdown className="ml-2">
//                     <Dropdown.Toggle
//                       variant="link"
//                       className="text-decoration-none text-varient border-0"
//                     />
//                     <Dropdown.Menu>
//                       <Dropdown.Item onClick={() => handleDelete(index)}>
//                         Delete
//                       </Dropdown.Item>
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </div>
//               ))}
//               <div className="mt-3 user-card d-flex align-items-center ">
//                 <div className="flex-grow-1">
//                   <OverlayTrigger
//                     placement="bottom"
//                     overlay={<Tooltip>Click Here</Tooltip>}
//                     trigger={["hover", "focus"]}
//                   >
//                     <Button
//                       variant="link"
//                       className="text-decoration-none"
//                       onClick={() => setSelectedUserName("addAcc")}
//                     >
//                       <FontAwesomeIcon icon={faPlus} className="me-2 " />
//                       Add Account
//                     </Button>
//                   </OverlayTrigger>
//                 </div>
//               </div>
//             </div>
//           </Card.Body>
//         </Card>
//       </Container>
//     );
//   }

//   return <SignIn selectedUsername={selectedUserName} />;
// }

// function SignIn_Page() {
//   const [userExist, setUserExist] = useState("No");

//   useEffect(() => {
//     const stored_userdata = localStorage.getItem("loggedUsers");
//     const logged_Users = stored_userdata ? JSON.parse(stored_userdata) : [];

//     if (logged_Users.length > 0) {
//       const lastItem = logged_Users[logged_Users.length - 1];
//       setUserExist("Yes");
//     } else {
//       setUserExist("No");
//     }
//   }, []);

//   useEffect(() => {}, [userExist]);

//   return (
//     <>
//       {userExist === "No" && <SignIn />}
//       {userExist === "Yes" && <SignInHistory />}
//     </>
//   );
// }

// export default SignIn_Page;

//Above code is existing Login Design Start

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   Container,
//   Card,
//   Dropdown,
//   OverlayTrigger,
//   Tooltip,
//   Alert,
//   Button,
//   Form,
//   Row,
//   Col,
//   Spinner,
// } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate, useLocation } from "react-router-dom";
// import * as Yup from "yup";
// import { Formik } from "formik";
// import useAuth from "../../hooks/useAuth";
// import useSidebar from "../../hooks/useSidebar";
// import { SIDEBAR_POSITION, SIDEBAR_BEHAVIOR } from "../../constants";
// import AzureLogin from "./AzureLogin";

// function SignIn(props) {
//   const navigate = useNavigate();

//   const { isOpen, setIsOpen, behavior, setBehavior } = useSidebar();

//   const { signIn } = useAuth();

//   const { state } = useLocation();
//   console.log("state", state);

//   if (state?.bearerURL != "/") {
//     const stateString = JSON.stringify(state);
//     sessionStorage.setItem("stateData", stateString);
//   }

//   const [resendButtonClicked, setResendButtonClicked] = useState(false);
//   const [buttonClicked, setButtonClicked] = useState("");
//   const [user_name, setuser_name] = useState(true);
//   const [selected_Username, setselected_Username] = useState(
//     props.selectedUsername || ""
//   );
//   const [renderName, setrenderName] = useState(false);
//   const [isOtherUserSelected, setIsOtherUserSelected] = useState(false);
//   const [mfa, setMfa] = useState(``);
//   const [otp, setOtp] = useState("");
//   const [username, setUsername] = useState("");
//   const [spinner, setSpinner] = useState(false);
//   const [ExpireTime, setExpireTime] = useState(0);
//   const [timer, setTimer] = useState(0);
//   const [showTimer, setShowTimer] = useState(false);
//   const [clearTimer, setclearTimer] = useState(null);

//   const startTimer = () => {
//     setShowTimer(true);
//     setTimer(ExpireTime);

//     if (clearTimer) {
//       clearInterval(clearTimer);
//     }

//     const newclearTimer = setInterval(() => {
//       setTimer((prevTimer) => {
//         if (prevTimer === 1) {
//           clearInterval(newclearTimer);
//           setShowTimer(false);
//         }
//         return prevTimer - 1;
//       });
//     }, 1000);

//     setclearTimer(newclearTimer);
//   };
//   useEffect(() => {
//     setTimer(ExpireTime);
//     if (ExpireTime > 0) {
//       startTimer();
//     }
//   }, [ExpireTime]);

//   let statusCode = 0;
//   const handleOtherUserClick = () => {
//     setrenderName((prevValue) => !prevValue);
//     setuser_name(true);
//     setIsOtherUserSelected(true);
//     setMfa(``);
//     setSpinner(false);
//     setShowTimer(false);
//   };

//   useEffect(() => {
//     const stored_userdata = localStorage.getItem("loggedUsers");
//     const logged_Users = stored_userdata ? JSON.parse(stored_userdata) : [];
//     if (logged_Users.length > 0) {
//       if (props.addNewAccount) {
//         setuser_name(true);
//       } else {
//         setuser_name(false);
//       }
//     }
//   }, []);

//   const handleSignIn = async (values, actions) => {
//     setSpinner(true);
//     try {
//       await signIn(
//         values.username,
//         values.password,
//         values.rememberMe,
//         values.otp,
//         (Mfa) => {
//           if (Mfa && Mfa.mfa === true) {
//             setMfa(Mfa.mfa);
//             setExpireTime(Mfa.expire_time);
//             startTimer();
//           } else if (state?.bearerURL) {
//             navigate(state?.bearerURL);
//           } else {
//             navigate("/DashboardNavigation");
//             setBehavior(SIDEBAR_BEHAVIOR.STICKY);
//           }
//           setSpinner(false);
//         }
//       );
//       actions.setStatus({ success: true });
//       actions.setSubmitting(false);
//     } catch (error) {
//       const message = error.message || "Something went wrong";
//       setSpinner(false);

//       if (error.response && error.response.status) {
//         statusCode = error.response.status;
//       }

//       let errors;
//       if (statusCode === 401 && otp) {
//         errors = "Invalid OTP. Please check your code and try again ";
//         setTimeout(() => {
//           actions.setFieldValue("otp", "");
//           setOtp("");
//         }, 5000);
//       } else if (statusCode === 401) {
//         errors = "Invalid Password.Please enter a valid Password.";
//       } else if (statusCode === 423) {
//         errors =
//           "Your account has been blocked due to too many failed login attempts";
//       } else if (statusCode === 406) {
//         errors = error.response.data;
//         setTimeout(() => {
//           actions.setFieldValue("otp", "");
//           setOtp("");
//         }, 8000);
//       } else if (statusCode === 410) {
//         errors = "Generated OTP is expired";
//         setTimeout(() => {
//           actions.setFieldValue("otp", "");
//           setOtp("");
//         }, 5000);
//       } else if (statusCode === 403) {
//         errors = "Access denied";
//       } else if (statusCode) {
//         errors = error.response.data;
//       } else {
//         errors = "An error occurred. " + message;
//       }
//       actions.setStatus({ success: false });
//       actions.setErrors({ submit: errors });
//       actions.setSubmitting(false);
//     }

//     if (mfa === true && statusCode === 0 && !resendButtonClicked) {
//       navigate("/");
//     }
//   };

//   return (
//     <Container>
//       {/* <Card  className="bg-dark bg-opacity-50" >
//         <Card.Body> */}
//       <Formik
//         key={renderName ? "reset" : "signin"}
//         initialValues={{
//           username: isOtherUserSelected ? "" : selected_Username,
//           otp: "",
//           password: "",
//           rememberMe: false,
//           submit: false,
//         }}
//         validationSchema={Yup.object().shape({
//           username: Yup.string().max(255).required("User Name is required"),
//           otp:
//             buttonClicked === "SignIn" && mfa === true
//               ? Yup.string().required("OTP is required")
//               : Yup.string(),
//           password:
//             mfa !== true
//               ? Yup.string().max(255).required("Password is required")
//               : Yup.string(),
//         })}
//         onSubmit={(values, actions) => {
//           handleSignIn(values, actions);
//         }}
//       >
//         {({
//           errors,
//           handleBlur,
//           handleChange,
//           handleSubmit,
//           isSubmitting,
//           touched,
//           values,
//           setFieldValue,
//         }) => (
//           <Form onSubmit={handleSubmit}>
//             {errors.submit && (
//               <Alert className="my-3" variant="danger">
//                 <div className="alert-message">{errors.submit}</div>
//               </Alert>
//             )}

//             {showTimer && (
//               <Alert variant="success" className="my-3">
//                 <div className="alert-message">
//                   A code has been sent to your email. Expire's In: {timer}{" "}
//                   seconds
//                 </div>
//               </Alert>
//             )}

//             <Form.Group className="mb-3 text-white">
//               <Form.Label>User Name</Form.Label>
//               <Form.Control
//                 style={{ borderRadius: "20px" }}
//                 className="bg-dark bg-opacity-2 text-white"
//                 size="lg"
//                 type="input"
//                 name="username"
//                 placeholder="Enter your user name"
//                 value={values.username}
//                 isInvalid={Boolean(touched.username && errors.username)}
//                 onBlur={handleBlur}
//                 onChange={(e) => {
//                   const username = e.target.value;
//                   setUsername(username);
//                   setFieldValue("username", username);
//                 }}
//                 disabled={!user_name || mfa === true}
//               />
//               {!!touched.username && (
//                 <Form.Control.Feedback type="invalid">
//                   {errors.username}
//                 </Form.Control.Feedback>
//               )}
//             </Form.Group>

//             {mfa === true ? (
//               <Form.Group className="mb-3">
//                 <Form.Label>Enter OTP</Form.Label>
//                 <Form.Control
//                   size="lg"
//                   type="text"
//                   name="otp"
//                   placeholder="Enter your otp"
//                   value={values.otp}
//                   // isInvalid={Boolean(touched.otp && errors.otp)}
//                   isInvalid={
//                     buttonClicked === "SignIn" &&
//                     Boolean(touched.otp && errors.otp)
//                   }
//                   onBlur={handleBlur}
//                   onChange={(e) => {
//                     const otp = e.target.value;
//                     setFieldValue("otp", otp);
//                     setOtp(otp);
//                     handleChange(e);
//                   }}
//                 />
//                 {!!touched.otp && (
//                   <Form.Control.Feedback type="invalid">
//                     {errors.otp}
//                   </Form.Control.Feedback>
//                 )}
//               </Form.Group>
//             ) : null}

//             {mfa !== true && (
//               <Form.Group className="mb-3 text-white">
//                 <Form.Label>Password</Form.Label>
//                 <Form.Control
//                   size="lg"
//                   style={{ borderRadius: "20px" }}
//                   className="bg-dark bg-opacity-2 text-white"
//                   type="password"
//                   name="password"
//                   placeholder="Enter your password"
//                   value={values.password}
//                   isInvalid={Boolean(touched.password && errors.password)}
//                   onBlur={handleBlur}
//                   onChange={handleChange}

//                   // required
//                 />
//                 {!!touched.password && (
//                   <Form.Control.Feedback type="invalid">
//                     {errors.password}
//                   </Form.Control.Feedback>
//                 )}
//               </Form.Group>
//             )}

//             <Form.Group className="mb-3">
//               <Row>
//                 <Col>
//                   <small className="text-sm">
//                     <Link
//                       to="/auth/reset-password"
//                       className="text-decoration-none text-white"
//                     >
//                       Forgot password?
//                     </Link>
//                   </small>
//                 </Col>
//                 {props.addNewAccount ? (
//                   ""
//                 ) : (
//                   <Col className="d-flex justify-content-end">
//                     <small className="text-sm">
//                       <Link
//                         to="/auth/sign-in"
//                         onClick={handleOtherUserClick}
//                         className="text-decoration-none text-white"
//                       >
//                         Other User..?
//                       </Link>
//                     </small>
//                   </Col>
//                 )}
//               </Row>
//             </Form.Group>

//             <Form.Group className="mb-3 text-white">
//               {!user_name ? null : (
//                 <Form.Check
//                   type="checkbox"
//                   name="rememberMe"
//                   label="Remember Me"
//                   checked={values.rememberMe}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   isInvalid={Boolean(touched.rememberMe && errors.rememberMe)}
//                 />
//               )}
//               {!!touched.rememberMe && (
//                 <Form.Control.Feedback type="invalid">
//                   {errors.rememberMe}
//                 </Form.Control.Feedback>
//               )}
//             </Form.Group>

//             <div className="mt-3">
//               {spinner ? (
//                 <div className="text-center">
//                   <Spinner animation="border" variant="primary" />
//                 </div>
//               ) : (
//                 <div
//                   className={
//                     mfa === true
//                       ? "d-flex justify-content-between align-items-center"
//                       : "text-center"
//                   }
//                 >
//                   <Button
//                     type="submit"
//                     variant="primary"
//                     className=" bg-dark bg-opacity-90"
//                     size="lg"
//                     // disabled={isSubmitting}
//                     onClick={() => {
//                       setButtonClicked("SignIn");
//                       setResendButtonClicked(false);
//                     }}
//                   >
//                     Sign In
//                   </Button>
//                   {mfa === true && (
//                     <Button
//                       type="submit"
//                       variant="primary"
//                       size="lg"
//                       onClick={() => {
//                         setButtonClicked("Resend");
//                         setResendButtonClicked(true);
//                         setFieldValue("otp", "");
//                         setSpinner(false);
//                       }}
//                     >
//                       Resend OTP
//                     </Button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </Form>
//         )}
//       </Formik>
//       {/* </Card.Body>
//       </Card> */}
//     </Container>
//   );
// }

// function SignInHistory() {
//   const [logged_Users, setlogged_Users] = useState(
//     localStorage.getItem("loggedUsers")
//       ? JSON.parse(localStorage.getItem("loggedUsers"))
//       : []
//   );

//   //deleting userlist from signIN history  start
//   const [userNames, setUserNames] = useState(
//     logged_Users.map((user) => user.user_details.data[0].user_name)
//   );
//   const [selectedUserName, setSelectedUserName] = useState(null);

//   const handleDelete = (index) => {
//     const updatedUserNames = [...userNames];
//     updatedUserNames.splice(index, 1);

//     const updated_Users_afterdeleting = logged_Users.filter(
//       (_, i) => i !== index
//     );
//     localStorage.setItem(
//       "loggedUsers",
//       JSON.stringify(updated_Users_afterdeleting)
//     );

//     setUserNames(updatedUserNames);
//     window.location.reload();
//   };
//   //deleting userlist from signIN history  END

//   const handleUser = (index) => {
//     const selectedUserName = userNames[index];
//     setSelectedUserName(selectedUserName);
//     const selectedUser = logged_Users[index];
//     const firstName = selectedUser.user_details.data[0].first_name;
//   };
//   if (selectedUserName === "addAcc") {
//     return <SignIn addNewAccount={selectedUserName === "addAcc"} />;
//   }

//   if (selectedUserName === null) {
//     return (
//       <Container>
//         {/* <Card className="bg-dark bg-opacity-50"  >
//           <Card.Body> */}
//         <div className="text-center mt-3">
//           <h4 className="text-white">Select an account to sign in</h4>
//           {userNames.map((userName, index) => (
//             <div
//               key={index}
//               className="mt-3 user-card d-flex align-items-center"
//             >
//               <div className="flex-grow-1">
//                 <OverlayTrigger
//                   placement="bottom"
//                   overlay={<Tooltip>Click Here</Tooltip>}
//                   trigger={["hover", "focus"]}
//                 >
//                   <Button
//                     variant="link"
//                     className="text-decoration-none d-flex align-items-center p-2 h4 text border-bottom w-100"
//                     onClick={() => handleUser(index)}
//                   >
//                     <div className="d-flex align-items-center h4">
//                       <FontAwesomeIcon
//                         icon={faUser}
//                         className="mr-3 h3 me-4 text-white"
//                       />
//                       <span className="text-white">{userName}</span>
//                     </div>
//                   </Button>
//                 </OverlayTrigger>
//               </div>
//               <Dropdown className="ml-2">
//                 <Dropdown.Toggle
//                   variant="link"
//                   className="text-decoration-none text-varient border-0"
//                 />
//                 <Dropdown.Menu>
//                   <Dropdown.Item onClick={() => handleDelete(index)}>
//                     Delete
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//           ))}
//           <div className="mt-3 user-card d-flex align-items-center ">
//             <div className="flex-grow-1">
//               <OverlayTrigger
//                 placement="bottom"
//                 overlay={<Tooltip>Click Here</Tooltip>}
//                 trigger={["hover", "focus"]}
//               >
//                 <Button
//                   variant="link"
//                   className="text-decoration-none text-white"
//                   onClick={() => setSelectedUserName("addAcc")}
//                 >
//                   <FontAwesomeIcon icon={faPlus} className="me-2 text-white" />
//                   Add Account
//                 </Button>
//               </OverlayTrigger>
//             </div>
//           </div>
//         </div>
//         {/* </Card.Body>
//         </Card> */}
//       </Container>
//     );
//   }

//   return <SignIn selectedUsername={selectedUserName} />;
// }

// function SignIn_Page() {
//   const [userExist, setUserExist] = useState("No");

//   useEffect(() => {
//     const stored_userdata = localStorage.getItem("loggedUsers");
//     const logged_Users = stored_userdata ? JSON.parse(stored_userdata) : [];

//     if (logged_Users.length > 0) {
//       const lastItem = logged_Users[logged_Users.length - 1];
//       setUserExist("Yes");
//     } else {
//       setUserExist("No");
//     }
//   }, []);

//   useEffect(() => {}, [userExist]);

//   return (
//     <>
//       {userExist === "No" && <SignIn />}
//       {userExist === "Yes" && <SignInHistory />}
//       <Container
//         fluid
//         className="h-100 d-flex justify-content-center align-items-center"
//       >
//         <Row className="w-100">
//           <Col className="d-flex justify-content-center">
//             <AzureLogin />
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// }

// export default SignIn_Page;

//Above code is existing Login Design End

//New Login page design Start

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Card,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Alert,
  Button,
  Form,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import useAuth from "../../hooks/useAuth";
import useSidebar from "../../hooks/useSidebar";
import { SIDEBAR_POSITION, SIDEBAR_BEHAVIOR } from "../../constants";
import AzureLogin from "./AzureLogin";

function SignIn(props) {
  const navigate = useNavigate();

  const { isOpen, setIsOpen, behavior, setBehavior } = useSidebar();

  const { signIn } = useAuth();

  const { state } = useLocation();
  console.log("state", state);

  if (state?.bearerURL != "/") {
    const stateString = JSON.stringify(state);
    sessionStorage.setItem("stateData", stateString);
  }

  const [resendButtonClicked, setResendButtonClicked] = useState(false);
  const [buttonClicked, setButtonClicked] = useState("");
  const [user_name, setuser_name] = useState(true);
  const [selected_Username, setselected_Username] = useState(
    props.selectedUsername || ""
  );
  const [renderName, setrenderName] = useState(false);
  const [isOtherUserSelected, setIsOtherUserSelected] = useState(false);
  const [mfa, setMfa] = useState(``);
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [ExpireTime, setExpireTime] = useState(0);
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

  let statusCode = 0;
  const handleOtherUserClick = () => {
    setrenderName((prevValue) => !prevValue);
    setuser_name(true);
    setIsOtherUserSelected(true);
    setMfa(``);
    setSpinner(false);
    setShowTimer(false);
  };

  useEffect(() => {
    const stored_userdata = localStorage.getItem("loggedUsers");
    const logged_Users = stored_userdata ? JSON.parse(stored_userdata) : [];
    if (logged_Users.length > 0) {
      if (props.addNewAccount) {
        setuser_name(true);
      } else {
        setuser_name(false);
      }
    }
  }, []);

  const handleSignIn = async (values, actions) => {
    setSpinner(true);
    try {
      await signIn(
        values.username,
        values.password,
        values.rememberMe,
        values.otp,
        (Mfa) => {
          if (Mfa && Mfa.mfa === true) {
            setMfa(Mfa.mfa);
            setExpireTime(Mfa.expire_time);
            startTimer();
          } else if (state?.bearerURL) {
            navigate(state?.bearerURL);
          } else {
            navigate("/DashboardNavigation");
            setBehavior(SIDEBAR_BEHAVIOR.STICKY);
          }
          setSpinner(false);
        }
      );
      actions.setStatus({ success: true });
      actions.setSubmitting(false);
    } catch (error) {
      const message = error.message || "Something went wrong";
      setSpinner(false);

      if (error.response && error.response.status) {
        statusCode = error.response.status;
      }

      let errors;
      if (statusCode === 401 && otp) {
        errors = "Invalid OTP. Please check your code and try again ";
        setTimeout(() => {
          actions.setFieldValue("otp", "");
          setOtp("");
        }, 5000);
      } else if (statusCode === 401) {
        errors = "Invalid Password.Please enter a valid Password.";
      } else if (statusCode === 423) {
        errors =
          "Your account has been blocked due to too many failed login attempts";
      } else if (statusCode === 406) {
        errors = error.response.data;
        setTimeout(() => {
          actions.setFieldValue("otp", "");
          setOtp("");
        }, 8000);
      } else if (statusCode === 410) {
        errors = "Generated OTP is expired";
        setTimeout(() => {
          actions.setFieldValue("otp", "");
          setOtp("");
        }, 5000);
      } else if (statusCode === 403) {
        errors = "Access denied";
      } else if (statusCode) {
        errors = error.response.data;
      } else {
        errors = "An error occurred. " + message;
      }
      actions.setStatus({ success: false });
      actions.setErrors({ submit: errors });
      actions.setSubmitting(false);
    }

    if (mfa === true && statusCode === 0 && !resendButtonClicked) {
      navigate("/");
    }
  };
  const screenWidth = window.innerWidth;
  console.log("Screen Width:", screenWidth);

  return (
    <Container>
      {/* <Card  className="bg-dark bg-opacity-50" >
        <Card.Body> */}
      <Formik
        key={renderName ? "reset" : "signin"}
        initialValues={{
          username: isOtherUserSelected ? "" : selected_Username,
          otp: "",
          password: "",
          rememberMe: false,
          submit: false,
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required("User Name is required"),
          otp:
            buttonClicked === "SignIn" && mfa === true
              ? Yup.string().required("OTP is required")
              : Yup.string(),
          password:
            mfa !== true
              ? Yup.string().max(255).required("Password is required")
              : Yup.string(),
        })}
        onSubmit={(values, actions) => {
          handleSignIn(values, actions);
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>
            {errors.submit && (
              <Alert className="my-3" variant="danger">
                <div className="alert-message">{errors.submit}</div>
              </Alert>
            )}

            {showTimer && (
              <Alert variant="success" className="my-3">
                <div className="alert-message">
                  A code has been sent to your email. Expire's In: {timer}{" "}
                  seconds
                </div>
              </Alert>
            )}

            <Form.Group className="mb-3  forget_other_username_pasword">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                style={{ borderRadius: "20px" }}
                className="bg-dark bg-opacity-2 text-white  inputSize"
                // size="lg"
                type="input"
                name="username"
                placeholder="Enter your user name"
                value={values.username}
                isInvalid={Boolean(touched.username && errors.username)}
                onBlur={handleBlur}
                onChange={(e) => {
                  const username = e.target.value;
                  setUsername(username);
                  setFieldValue("username", username);
                }}
                disabled={!user_name || mfa === true}
              />
              {!!touched.username && (
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {mfa === true ? (
              <Form.Group className="mb-3 forget_other_username_pasword">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                  // size="lg"
                  type="text"
                  name="otp"
                  placeholder="Enter your otp"
                  className="bg-dark bg-opacity-2 text-white  inputSize"
                  value={values.otp}
                  // isInvalid={Boolean(touched.otp && errors.otp)}
                  isInvalid={
                    buttonClicked === "SignIn" &&
                    Boolean(touched.otp && errors.otp)
                  }
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const otp = e.target.value;
                    setFieldValue("otp", otp);
                    setOtp(otp);
                    handleChange(e);
                  }}
                />
                {!!touched.otp && (
                  <Form.Control.Feedback type="invalid">
                    {errors.otp}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            ) : null}

            {mfa !== true && (
              <Form.Group className="mb-3  forget_other_username_pasword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  // size="lg"
                  style={{ borderRadius: "20px" }}
                  className="bg-dark bg-opacity-2 text-white  inputSize"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={values.password}
                  isInvalid={Boolean(touched.password && errors.password)}
                  onBlur={handleBlur}
                  onChange={handleChange}

                  // required
                />
                {!!touched.password && (
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            )}

            <Form.Group className="mb-3 forget_other_username_pasword">
              <Row>
                <Col className="text-white">
                  <small className="">
                    <Link
                      to="/auth/reset-password"
                      className="text-decoration-none textColor"
                    >
                      Forgot password?
                    </Link>
                  </small>
                </Col>
                {props.addNewAccount ? (
                  ""
                ) : (
                  <Col className="d-flex justify-content-end">
                    <small className="">
                      <Link
                        to="/auth/sign-in"
                        onClick={handleOtherUserClick}
                        className="text-decoration-none textColor"
                      >
                        Other User..?
                      </Link>
                    </small>
                  </Col>
                )}
              </Row>
            </Form.Group>

            <Form.Group className="mb-3 fs-5">
              {!user_name ? null : (
                <Form.Check
                  type="checkbox"
                  name="rememberMe"
                  label="Remember Me"
                  checked={values.rememberMe}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={Boolean(touched.rememberMe && errors.rememberMe)}
                />
              )}
              {!!touched.rememberMe && (
                <Form.Control.Feedback type="invalid">
                  {errors.rememberMe}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <div className="mt-3">
              {spinner ? (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <div
                  className={
                    mfa === true
                      ? "d-flex justify-content-between align-items-center"
                      : "text-center"
                  }
                >
                  <Button
                    type="submit"
                    variant="primary"
                    className=" bg-dark bg-opacity-90 rememberme border"
                    // size="lg"
                    // disabled={isSubmitting}
                    onClick={() => {
                      setButtonClicked("SignIn");
                      setResendButtonClicked(false);
                    }}
                  >
                    Sign In
                  </Button>
                  {mfa === true && (
                    <Button
                      type="submit"
                      variant="primary"
                      // size="lg"
                      onClick={() => {
                        setButtonClicked("Resend");
                        setResendButtonClicked(true);
                        setFieldValue("otp", "");
                        setSpinner(false);
                      }}
                      className="rememberme"
                    >
                      Resend OTP
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
      {/* </Card.Body>
      </Card> */}
    </Container>
  );
}

function SignInHistory() {
  const [logged_Users, setlogged_Users] = useState(
    localStorage.getItem("loggedUsers")
      ? JSON.parse(localStorage.getItem("loggedUsers"))
      : []
  );

  //deleting userlist from signIN history  start
  const [userNames, setUserNames] = useState(
    logged_Users.map((user) => user.user_details.data[0].user_name)
  );
  const [selectedUserName, setSelectedUserName] = useState(null);

  const handleDelete = (index) => {
    const updatedUserNames = [...userNames];
    updatedUserNames.splice(index, 1);

    const updated_Users_afterdeleting = logged_Users.filter(
      (_, i) => i !== index
    );
    localStorage.setItem(
      "loggedUsers",
      JSON.stringify(updated_Users_afterdeleting)
    );

    setUserNames(updatedUserNames);
    window.location.reload();
  };
  //deleting userlist from signIN history  END

  const handleUser = (index) => {
    const selectedUserName = userNames[index];
    setSelectedUserName(selectedUserName);
    const selectedUser = logged_Users[index];
    const firstName = selectedUser.user_details.data[0].first_name;
  };
  if (selectedUserName === "addAcc") {
    return <SignIn addNewAccount={selectedUserName === "addAcc"} />;
  }

  if (selectedUserName === null) {
    return (
      <Container>
        {/* <Card className="bg-dark bg-opacity-50"  >
          <Card.Body> */}
        <div className="text-center mt-3">
          <h4 className="textColor">Select an account to sign in</h4>
          {userNames.map((userName, index) => (
            <div
              key={index}
              className="mt-3 user-card d-flex align-items-center"
            >
              <div className="flex-grow-1">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Click Here</Tooltip>}
                  trigger={["hover", "focus"]}
                >
                  <Button
                    variant="link"
                    className="text-decoration-none d-flex align-items-center p-2 h4 text border-bottom w-100"
                    onClick={() => handleUser(index)}
                  >
                    <div className="d-flex align-items-center h4">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="mr-3 h3 me-4 textColor"
                      />
                      <span className="textColor">{userName}</span>
                    </div>
                  </Button>
                </OverlayTrigger>
              </div>
              <Dropdown className="ml-2">
                <Dropdown.Toggle
                  variant="link"
                  className="text-decoration-none text-varient border-0 textColor"
                />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleDelete(index)}>
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ))}
          <div className="mt-3 user-card d-flex align-items-center ">
            <div className="flex-grow-1">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Click Here</Tooltip>}
                trigger={["hover", "focus"]}
              >
                <Button
                  variant="link"
                  className="text-decoration-none textColor"
                  onClick={() => setSelectedUserName("addAcc")}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2 textColor" />
                  Add Account
                </Button>
              </OverlayTrigger>
            </div>
          </div>
        </div>
        {/* </Card.Body>
        </Card> */}
      </Container>
    );
  }

  return <SignIn selectedUsername={selectedUserName} />;
}

function SignIn_Page() {
  const [userExist, setUserExist] = useState("No");
  console.log("qqqqqqqqq", userExist);

  useEffect(() => {
    const stored_userdata = localStorage.getItem("loggedUsers");
    const logged_Users = stored_userdata ? JSON.parse(stored_userdata) : [];

    if (logged_Users.length > 0) {
      const lastItem = logged_Users[logged_Users.length - 1];
      setUserExist("Yes");
    } else {
      setUserExist("No");
    }
  }, []);

  useEffect(() => {}, [userExist]);

  return (
    <>
      {userExist === "No" && <SignIn />}
      {userExist === "Yes" && <SignInHistory />}
      <Container
        fluid
        className="h-100 d-flex justify-content-center align-items-center"
      >
        <Row className="w-100">
          <Col className="d-flex justify-content-center">
            <AzureLogin />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SignIn_Page;

//New Login page design End
