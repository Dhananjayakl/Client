import React, { useState, useEffect } from "react";

import { Dropdown } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";

import {
  LogOut,
  PieChart,
  Settings,
  User,
  HelpCircle,
  Key,
} from "react-feather";

import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { getServiceData } from "src/components/server/service";
import { NameInitialsAvatar } from "react-name-initials-avatar";
import axios from "src/utils/AxiosInstance";
import { useSelector } from "react-redux";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";

const NavbarUser = () => {
  const { t, i18n } = useTranslation("common");
  const [user, setUser] = useState([]);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const uploadSuccess = useSelector((state) => state.upload.uploadSuccess);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    const stored_userdata = localStorage.getItem("current_logged_User");
    const current_logged_User = stored_userdata
      ? JSON.parse(stored_userdata)
      : [];
    setUser(current_logged_User[0]?.user_details?.data[0]);
  }, []);

  const fetchProfileImage = async (userId) => {
    if (!userId) {
      return;
    }

    try {
      const response = await axios.get(`/profile/getImg/${userId}`, {
        responseType: "blob",
      });
      const blob = response.data;
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
      setImageError(false);
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };
  useEffect(() => {
    if (uploadSuccess) {
      fetchProfileImage(user?.user_id);
    } else if (uploadSuccess === null) {
      setImageError(true);
      setImage(null);
    }
  }, [user, uploadSuccess]);

  useEffect(() => {
    fetchProfileImage(user?.user_id);
  }, [user]);

  const { signOut } = useAuth();
  const navigate = useNavigate();

  let logout = async () => {
    try {
      await signOut();
      localStorage.setItem("azureLogin", false);
      localStorage.setItem("loggingIn", "false");
      localStorage.removeItem("session_key");
      navigate("/auth/sign-in");
    } catch (error) {
      console.log("Error while signing out", error);
    }
  };
  // let ssologout = async () => {
  //   try {
  //     localStorage.setItem("loggingIn", "false");
  //     // localStorage.setItem("backButton", "false");

  //     await instance.logoutRedirect();
  //     await logout();
  //     navigate("/auth/sign-in");
  //   } catch (error) {
  //     console.log("Error while signing out", error);
  //   }
  // };
  return (
    <Dropdown className="nav-item " align="end">
      <span className="d-inline-block d-sm-none">
        <Dropdown.Toggle as="a" className="nav-link">
          <Settings size={18} className="align-middle" />
        </Dropdown.Toggle>
      </span>
      <span className="d-none d-sm-inline-block">
        <Dropdown.Toggle as="a" className="nav-link avatar-container">
          {imageError || !image ? (
            <NameInitialsAvatar
              name={`${user?.first_name} ${user?.last_name}`}
              size="30px"
              borderRadius="50%"
              bgColor="#f2f2f2"
              borderWidth="1px"
              textSize="14px"
              textWeight="12"
            />
          ) : (
            <img
              src={image}
              className="avatar img-fluid rounded-circle me-1 border"
              alt={user?.first_name}
            />
          )}
          <span className="text-dark ms-1">
            {user?.first_name} {user?.middle_name} {user?.last_name}
          </span>
        </Dropdown.Toggle>
      </span>
      <Dropdown.Menu drop="end">
        <Dropdown.Item className="shadow" as={Link} to="/page?name=PROFILE">
          <User size={18} className="align-middle me-2" />
          {t("Profile")}
        </Dropdown.Item>
        {/* <Dropdown.Item>
          <PieChart size={18} className="align-middle me-2" />
          {t("anlyts")}
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>
          <Settings size={18} className="align-middle me-2" />
          {t("stgsaprvc")}
        </Dropdown.Item>
        <Dropdown.Item>
          <HelpCircle size={18} className="align-middle me-2" />
          {t("help")}
        </Dropdown.Item> */}
        <Dropdown.Item as={Link} to="/form/changepwd" className="shadow">
          <Key size={18} className="align-middle me-2" />
          {t("Change Password")}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => logout()} className="shadow mb-0">
          <LogOut size={18} className="align-middle me-2" />
          {t("Sign Out")}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NavbarUser;
