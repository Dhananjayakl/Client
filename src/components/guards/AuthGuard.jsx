import React, { useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

function AuthGuard({ children }) {
  let navigate = useNavigate();
  let location = useLocation();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate("/auth/sign-in", {
        state: { bearerURL: location.pathname + location.search },
      });
    }
  }, [
    isInitialized,
    isAuthenticated,
    navigate,
    location.pathname,
    location.search,
  ]);

  return isAuthenticated ? <React.Fragment>{children}</React.Fragment> : null;
}

export default AuthGuard;
