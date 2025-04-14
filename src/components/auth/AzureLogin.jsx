import React, { useContext, useEffect, useState } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthContext from "src/contexts/JWTContext";

const AzureLogin = () => {
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  console.log("dddddddddddd", accounts);

  const isAuthenticated = useIsAuthenticated();
  const [idToken, setIdToken] = useState();
  console.log("isAuthenticated", isAuthenticated);
  const { signIn } = useContext(AuthContext);

  // Avoid triggering login if the user has logged out

  const isAzureLoggedIn = localStorage.getItem("azureLogin") === "true";
  console.log("isAzureLoggedIn", isAzureLoggedIn, isAuthenticated);

  useEffect(() => {
    if (accounts.length > 0) {
      console.log("Authenticated User:", accounts[0]);
    } else {
      // localStorage.setItem("loggingIn", "false");
      console.log("No user account found.");
    }
  }, [accounts]);

  const handleLogin = () => {
    localStorage.setItem("azureLogin", true);
    // localStorage.setItem("loggingIn", "true");

    instance.loginRedirect({
      scopes: ["User.Read"],
    });
  };

  const handleLogout = () => {
    localStorage.setItem("loggingIn", "false");

    instance.logoutRedirect();
    localStorage.setItem("azureLogin", false); // Set the flag to false after logout
    // localStorage.setItem("loggingIn", "false");
  };

  useEffect(() => {
    const handleAuthentication = async () => {
      if (isAuthenticated && isAzureLoggedIn) {
        try {
          const response = await instance.acquireTokenSilent({
            scopes: ["User.Read"], // Use the scope your app requires
            account: accounts[0], // Specify the current user account
          });

          console.log("Access Token:", response, response.idToken);
          setIdToken(response.accessToken);
          await signIn(null, null, false, null, null, response.idToken);
          navigate("/DashboardNavigation");

          // Set azureLogin flag in localStorage after successful login
          localStorage.setItem("azureLogin", "true");
        } catch (err) {
          console.log("Token acquisition failed", err);
          navigate("/auth/sign-in");
        }
      }
    };

    handleAuthentication();
  }, [isAuthenticated, accounts, instance, isAzureLoggedIn, signIn, navigate]);

  const interactionStatus = sessionStorage.getItem("msal.interaction.status");
  if (interactionStatus) {
    localStorage.setItem("loggingIn", "true");
  }

  return (
    <div className="my-2">
      <Button
        variant="primary"
        onClick={handleLogin}
        className="rememberme  bg-dark bg-opacity-90 border"
      >
        SSO with Azure
      </Button>
      {/* <Button variant="light" onClick={handleLogout}>
        SSO LogOut
      </Button> */}
      {/* {isAuthenticated && <div>Welcome, {accounts[0]?.name}</div>} */}
    </div>
  );
};

export default React.memo(AzureLogin);
