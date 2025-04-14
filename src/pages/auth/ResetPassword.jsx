// import React from "react";
// import { Helmet } from "react-helmet-async";
// import { Card } from "react-bootstrap";

// import ResetPassword from "../../components/auth/ResetPassword";

// const ResetPasswordPage = () => (
//   <React.Fragment>
//     <Helmet title="Reset Password" />
//     <div className="text-center mt-4">
//       <h1 className="h2">Reset password</h1>
//       <p className="lead">Enter your User Name to reset your password.</p>
//     </div>

//     <Card>
//       <Card.Body>
//         <div className="m-sm-4">
//           <ResetPassword />
//         </div>
//       </Card.Body>
//     </Card>
//   </React.Fragment>
// );

// export default ResetPasswordPage;

// import React from "react";
// import { Helmet } from "react-helmet-async";
// import { Card, Container } from "react-bootstrap";

// import ResetPassword from "../../components/auth/ResetPassword";

// const ResetPasswordPage = () => (
//   <React.Fragment>
//     <Helmet title="Reset Password" />
//     <Container className="d-flex justify-content-center align-items-center vh-100 background">
//       <Card
//         className="w-100 h-100"
//         style={{ maxWidth: "500px", maxHeight: "300px" }}
//       >
//         <Card.Body className="d-flex flex-column justify-content-center">
//           <div className="text-center">
//             <h1 className="h2">Reset password</h1>
//             <p className="lead">Enter your User Name to reset your password.</p>
//           </div>
//           <div className="m-sm-4">
//             <ResetPassword />
//           </div>
//         </Card.Body>
//       </Card>
//     </Container>
//   </React.Fragment>
// );

// export default ResetPasswordPage;
import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, Container, Row, Col } from "react-bootstrap";
import Main from "src/components/Main";
import ResetPassword from "../../components/auth/ResetPassword";

const ResetPasswordPage = () => (
  <React.Fragment>
    <div className="signin-container background">
      <div className="content-container ">
        <div className="right-section ">
          {" "}
          <Helmet title="Reset Password" />
          <div className="text-center ">
            <h1 className=" welcome-text">Reset password</h1>
            <p className=" lead">
              Enter your User Name to reset your password.
            </p>
          </div>
          <Card className="signin-card border">
            <Card.Body>
              <div className="signin-form">
                <ResetPassword />
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  </React.Fragment>
);

export default ResetPasswordPage;
