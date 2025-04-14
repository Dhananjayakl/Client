import { useEffect, useReducer } from "react";

import axios from "../utils/AxiosInstance";
import { isValidToken, setSession } from "../utils/jwt";
import { multiFactorAuth } from "src/modules/admin/AdminService";
import AuthContext from "./JWTContext";
import AxiosInstance from "../utils/AxiosInstance";

const INITIALIZE = "INITIALIZE";
const SIGN_IN = "SIGN_IN";
const SIGN_OUT = "SIGN_OUT";
const SIGN_UP = "SIGN_UP";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};
const generateRandomKey = (length = 20) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(length)]
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
};
const JWTReducer = (state, action) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case SIGN_UP:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await AxiosInstance.get("/user/session");

        const isAuthenticated = response?.data?.UserAuthenticate || false;
        const user = response?.data?.UserDetails?.data || null;

        dispatch({
          type: INITIALIZE,
          payload: {
            isAuthenticated,
            user,
          },
        });
      } catch (err) {
        console.error("Session check failed:", err);
        dispatch({
          type: INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };
    const sessionkey = window.localStorage.getItem("session_key");
    const checkInit = window.localStorage.getItem("loggingIn");

    if (sessionkey || checkInit === "false") {
      initialize();
    }

    //  else {
    //   dispatch({
    //     type: INITIALIZE,
    //     payload: {
    //       isAuthenticated: false,
    //       user: null,
    //     },
    //   });
    // }
  }, []);

  const signIn = async (
    username,
    password,
    rememberMe,
    otp,
    callback,
    idToken
  ) => {
    if (idToken) {
      try {
        const response = await axios.post(
          `/auth/azure/validate-token?idToken=${idToken}`
        );
        const { access_token, user_details } = response.data;
        setSession(access_token, user_details);
        const randomKey = generateRandomKey();
        localStorage.setItem("session_key", randomKey);
        // localStorage.setItem("AzureAuth", true);
        dispatch({
          type: SIGN_IN,
          payload: {
            user: user_details,
          },
        });
      } catch (error) {
        console.error("Error validating token:", error);
      }
    }

    if (otp === "" && !idToken) {
      const authResponse = await axios.post("/auth/authenticate", {
        username,
        password,
        rememberMe,
      });
      const { access_token, user_details } = authResponse.data;
      setSession(access_token, user_details, rememberMe);
      const randomKey = generateRandomKey();
      localStorage.setItem("session_key", randomKey);
      const Mfa = authResponse.data;
      if (callback) {
        callback(Mfa);
      }
      dispatch({
        type: SIGN_IN,
        payload: {
          user: user_details,
        },
      });
    }

    if (otp !== "" && !idToken) {
      const mfaResponse = await multiFactorAuth(
        "multifactorauth",
        username,
        otp
      );
      const { access_token, user_details } = mfaResponse.data;
      const randomKey = generateRandomKey();
      localStorage.setItem("session_key", randomKey);
      setSession(access_token, user_details, rememberMe);
      dispatch({
        type: SIGN_IN,
        payload: {
          user: user_details,
        },
      });
    }
  };

  const signOut = async () => {
    const response = await axios.get("/auth/logout");
    setSession(null);
    dispatch({ type: SIGN_OUT });
  };

  const signUp = async (email, password, firstName, lastName) => {
    const response = await axios.post("/api/auth/sign-up", {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem("accessToken", accessToken);
    dispatch({
      type: SIGN_UP,
      payload: {
        user,
      },
    });
  };

  const resetPassword = (email) => console.log(email);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        signIn,
        signOut,
        signUp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
