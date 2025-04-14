import React from "react";
import { LogOut } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import useAuth from "../../hooks/useAuth";
import useSidebar from "src/hooks/useSidebar";
import { useTranslation } from "react-i18next";

const SidebarFooter = () => {
  const { t } = useTranslation("common");
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { isOpen, setIsOpen, behavior, setBehavior } = useSidebar();

  // let logout = async () => {
  //   try {
  //     await signOut();
  //     // res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  //     navigate("/auth/sign-in");
  //   } catch (error) {
  //     console.log("Error while signing out", error);
  //   }
  // };

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

  return (
    <>
      {behavior === "sticky" ? (
        <div>
          <Button className="mt-3 footer-button" onClick={() => logout()}>
            <LogOut size={18} className="align-middle me-2" />
            {/* Sign Out */}
            {t("Sign Out")}
          </Button>
        </div>
      ) : (
        ""
      )}

      {behavior === "compact" ? (
        <div>
          {behavior === "compact" ? (
            <Button
              className="mt-5 footer-button "
              onClick={() => logout()}
              // style={{ marginLeft: "-50px" }}
              title="Sign Out"
            >
              <LogOut
                onClick={() => logout()}
                size={18}
                className="align-middle me-2"
              />
              {/* Sign Out */}
            </Button>
          ) : (
            ""
          )}
          {/* </a> */}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default SidebarFooter;
