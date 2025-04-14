import jwtDecode from "jwt-decode";
import { verify, sign } from "jsonwebtoken";
import axios from "./AxiosInstance";
import { useNavigate } from "react-router-dom";

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const handleTokenExpired = (exp) => {
  let expiredTimer;

  window.clearTimeout(expiredTimer);
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;
  expiredTimer = window.setTimeout(() => {}, timeLeft);
};

const setSession = (accessToken, user_details, rememberMe, jwtExpiration) => {
  // alert(accessToken);

  if (user_details) {
    // localStorage.setItem("accessToken", accessToken);
    // localStorage.setItem("user_details", JSON.stringify(user_details));

    if (rememberMe) {
      const stored_userdata = localStorage.getItem("loggedUsers");

      let logged_Users = stored_userdata ? JSON.parse(stored_userdata) : [];

      const existingUserIndex = logged_Users.findIndex(
        (user) =>
          user.user_details.data[0].user_name === user_details.data[0].user_name
      );
      if (existingUserIndex !== -1) {
        logged_Users[existingUserIndex].accessToken = accessToken;
      } else {
        const newUser = {
          // accessToken,
          user_details,
          jwtExpiration,
        };
        logged_Users.unshift(newUser);
      }

      localStorage.setItem("loggedUsers", JSON.stringify(logged_Users));
    }

    const currentUserData = {
      accessToken,
      user_details,
      jwtExpiration,
    };
    const current_logged_User = localStorage.getItem("current_logged_User");
    const current_logged_userData = current_logged_User
      ? JSON.parse(current_logged_User)
      : [];
    current_logged_userData.pop();
    current_logged_userData.push(currentUserData);
    localStorage.setItem(
      "current_logged_User",
      JSON.stringify(current_logged_userData)
    );

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    // // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // handleTokenExpired(exp);
  } else {
    // localStorage.removeItem("accessToken");
    localStorage.removeItem("showMaintenanceModal");
    localStorage.removeItem("popupmessage");
    delete axios.defaults.headers.common.Authorization;
  }
};

export { verify, sign, isValidToken, setSession };
