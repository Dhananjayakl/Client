import React from "react";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./authConfig";

const AuthProviderMsal = ({ children }) => {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

export default AuthProviderMsal;
