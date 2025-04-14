import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row } from "react-bootstrap";
import "src/assets/scss/profile.scss";
import CurrentUserProfile from "./CurrentUserProfile";

const Profile = () => {
  return (
    <Container>
      <Helmet title="Profile Detials" />
      <h4 className="mb-3">Profile Details</h4>
      <Row className="m-0 p-0 mb-4">
        <CurrentUserProfile />
      </Row>
    </Container>
  );
};

export default Profile;
