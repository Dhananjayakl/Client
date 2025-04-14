//Above code is existing Login Design Start

// import React, { useEffect, useState } from "react";
// import { Helmet } from "react-helmet-async";
// import { Card, Spinner } from "react-bootstrap";
// import SignIn_Page from "../../components/auth/SignIn";
// import video from "../../assets/video/loginpage_video.mp4";
// import logo from "../../assets/img/OnlyLogo.png";
// import { useMsal, useIsAuthenticated } from "@azure/msal-react";
// import AzureLogin from "src/components/auth/AzureLogin";
// const SignInPage = (props) => {
//   const [firstName, setFirstName] = useState(null);
//   // const [isUserLoggingIn, setisUserLoggingIn] = useState();
//   // console.log("isUserLoggingIn", isUserLoggingIn);

//   useEffect(() => {
//     const stored_userdata = localStorage.getItem("current_logged_User");
//     const current_logged_User = stored_userdata
//       ? JSON.parse(stored_userdata)
//       : [];
//     if (current_logged_User.length > 0) {
//       const lastItem = current_logged_User[current_logged_User.length - 1];
//       const userFirstName = lastItem.user_details.data[0].first_name;
//       setFirstName(userFirstName);
//     }
//     // setisUserLoggingIn(localStorage.getItem("azureLogin") === "true");
//   }, []);
//   const isAuthenticated = useIsAuthenticated();
//   const isAzureLoggedIn = localStorage.getItem("azureLogin") === "true";
//   const isUserLoggingIn = localStorage.getItem("loggingIn") === "true";
//   console.log("isUserLoggingIn", isUserLoggingIn);

//   return (
//     <div className="position-relative overflow-hidden vh-100">
//       <video
//         autoPlay
//         muted
//         loop
//         className="position-fixed top-0 start-0 w-100 h-100 object-fit-cover"
//         style={{ zIndex: -1 }}
//       >
//         <source src={video} type="video/mp4" />
//       </video>
//       {/* <img
//         className="position-fixed top-0 start-0 w-100 h-100 object-fit-cover"
//         style={{ zIndex: -1 }}
//         src={backgroundimage}
//         // src={D2}
//         // src={D3}
//         alt="Logo"
//       /> */}
//       <div
//         className="position-relative d-flex flex-column justify-content-center align-items-center rounded-3 p-3"
//         style={{ zIndex: 1, left: "8%", top: "1%", maxWidth: "100%" }}
//       >
//         <Helmet title="Sign In" />

//         {isUserLoggingIn ? (
//           <>
//             {/* <div className="d-flex justify-content-center align-items-center ">
//               <Spinner animation="border" variant="danger" />
//             </div> */}
//             <div className="d-flex justify-content-center align-items-center min-vh-100">
//               <Spinner animation="border" variant="danger" />
//             </div>

//             <div style={{ display: "none" }}>
//               <AzureLogin />
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="text-center text-white">
//               <img
//                 className="img-fluid mb-1"
//                 src={logo}
//                 alt="Logo"
//                 style={{ maxWidth: "150px" }}
//               />
//               <p
//                 className="text-white fw-normal"
//                 style={{ fontSize: "2.2rem" }}
//               >
//                 Welcome to ReGoRisC
//               </p>
//               <p className="lead text-white">
//                 Sign in to your account to continue
//               </p>
//             </div>

//             <Card
//               style={{ width: "80%", borderRadius: "5%" }}
//               className="text-white bg-dark bg-opacity-50 rounded-10"
//             >
//               <Card.Body>
//                 <div className="m-2">
//                   <SignIn_Page />
//                 </div>
//               </Card.Body>
//             </Card>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SignInPage;

//Above code is existing Login Design End

//New Login page design Start
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, Spinner } from "react-bootstrap";
import SignIn_Page from "../../components/auth/SignIn";
import video from "../../assets/video/loginpage_video.mp4";
import logo from "../../assets/img/OnlyNewLogo.png";
import FulLogo from "../../assets/img/Rego.png";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import AzureLogin from "src/components/auth/AzureLogin";
const SignInPage = (props) => {
  const [firstName, setFirstName] = useState(null);

  useEffect(() => {
    const stored_userdata = localStorage.getItem("current_logged_User");
    const current_logged_User = stored_userdata
      ? JSON.parse(stored_userdata)
      : [];
    if (current_logged_User.length > 0) {
      const lastItem = current_logged_User[current_logged_User.length - 1];
      const userFirstName = lastItem.user_details.data[0].first_name;
      setFirstName(userFirstName);
    }
    // setisUserLoggingIn(localStorage.getItem("azureLogin") === "true");
  }, []);
  const isAuthenticated = useIsAuthenticated();
  const isAzureLoggedIn = localStorage.getItem("azureLogin") === "true";
  const isUserLoggingIn = localStorage.getItem("loggingIn") === "true";
  let stickyLogo = localStorage.getItem("stickyLogo") || FulLogo;

  return (
    <div className="signin-container background">
      {/* Background Image */}
      {/* <img className="background-image" src={d1} alt="Background" /> */}
      {/* <video
        autoPlay
        muted
        loop
        className="position-fixed top-0 start-0 w-100 h-100 object-fit-cover"
        style={{ zIndex: -1 }}
      >
        <source src={video} type="video/mp4" />
      </video> */}
      <div className="content-container ">
        <div className="row-container ">
          {/* Left Section */}

          <div className="left-section ">
            <img
              // src={yesbank}
              src={stickyLogo || FulLogo}
              alt="noImage"
              style={{ width: "350px", height: "100px" }}
              className=" m-0 p-0  mb-3 "
            />
            <div className=" " style={{ marginBottom: "160px" }}>
              <h3 className=" regorisc mb-4 ">ReGoRisC</h3>

              <p>
                ReGoRisC (Regulatory, Governance, Risk and Compliance) is a
                structured framework that helps organizations align with
                industry regulations, enforce ethical governance, and manage
                potential risks effectively. It ensures regulatory compliance by
                adhering to legal requirements and industry standards, promotes
                governance through well-defined policies and decision-making
                structures, and strengthens risk management by identifying,
                assessing, and mitigating potential threats to business
                continuity and security.
              </p>
              <a
                href="https://progrec.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                To Know more about ReGoRisC... Click here
              </a>
            </div>
          </div>

          {/* Right Section */}
          <div className="right-section ">
            <Helmet title="Sign In" />

            {isUserLoggingIn ? (
              <>
                <div className="loading-container">
                  <Spinner animation="border" variant="danger" />
                </div>
                <div className="hidden">
                  <AzureLogin />
                </div>
              </>
            ) : (
              <>
                <div className="text-center p-0 m-0">
                  <img className="logo p-0 m-0" src={logo} alt="Logo" />
                  <p className="welcome-text p-0 m-0">Welcome to ReGoRisC</p>
                  <p className="lead">Sign in to your account to continue</p>
                </div>

                <Card className="signin-card border">
                  <Card.Body>
                    <div className="signin-form">
                      <SignIn_Page />
                    </div>
                  </Card.Body>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

//New Login page design End
