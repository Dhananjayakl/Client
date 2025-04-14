import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "2f661bc9-a5d9-4632-a41e-cf205f63f3aa",
    authority:
      "https://login.microsoftonline.com/ee631066-837f-4993-929d-45b85d5a19b8",
    redirectUri: "https://rnddev.progrec.com",
    // redirectUri: "http://localhost:3000",
    postLogoutRedirectUri: "http://localhost:3000/auth/sign-in",
    scopes: ["user.read"],
  },
  cache: {
    cacheLocation: "localStorage", // or sessionStorage localStorage
    storeAuthStateInCookie: false, // Adjust for compatibility
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

const initializeMsal = async () => {
  await msalInstance.initialize();
  const accounts = msalInstance.getAllAccounts();
  console.log("Accounts:", accounts);
};

initializeMsal();
