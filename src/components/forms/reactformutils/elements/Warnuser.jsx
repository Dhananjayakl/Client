import React from "react";

export function WarnUserBeforeReloadOrExit({ formDirtyCheck }) {
  React.useEffect(() => {
    const beforeNavigate = (e) => {
      if (formDirtyCheck()) {
        const answer = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        );
        if (!answer) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    const handleNavigation = (e) => {
      beforeNavigate(e);
      if (e.returnValue === "") {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("beforeunload", handleNavigation);

    window.addEventListener("popstate", handleNavigation);

    //sidebar Prevent
    const sidebarLinks = document.querySelectorAll(".sidebar-item.dropdown");

    sidebarLinks.forEach((link) => {
      link.addEventListener("click", handleNavigation);
    });

    //profileSetting prevent
    const listgroupElements = document.querySelectorAll(
      ".list-group-item-action"
    );
    listgroupElements.forEach((link) => {
      link.addEventListener("click", handleNavigation);
    });

    //navItem Prevent
    const signoutNav = document.querySelectorAll(".dropdown-menu");
    console.log(signoutNav, "signoutNavsignoutNavsignoutNav");

    signoutNav.forEach((link) => {
      link.addEventListener("click", handleNavigation);
    });

    const sidebarButton = document.querySelectorAll(".sidebar  button");

    sidebarButton.forEach((button) => {
      button.addEventListener("click", handleNavigation);
    });
    //closeButton Prevent
    const closeButton = document.querySelector(".close-btn");
    closeButton?.addEventListener("click", handleNavigation);

    //Menu Prevent
    const menuSpan = document.querySelector(".menuspan");
    menuSpan?.addEventListener("click", handleNavigation);

    //Circular Navigation Prevent
    const menuEye = document.querySelector(".sidebar-brand.menueyediv");
    menuEye?.addEventListener("click", handleNavigation);

    //To-do Prevent
    const navIcons = document.querySelector(".navIcons");
    navIcons?.addEventListener("click", handleNavigation);

    return () => {
      window.removeEventListener("beforeunload", handleNavigation);
      window.removeEventListener("popstate", handleNavigation);

      sidebarLinks.forEach((link) => {
        link.removeEventListener("click", handleNavigation);
      });

      listgroupElements.forEach((link) => {
        link.removeEventListener("click", handleNavigation);
      });

      sidebarButton.forEach((button) => {
        button.removeEventListener("click", handleNavigation);
      });

      signoutNav.forEach((link) => {
        link.removeEventListener("click", handleNavigation);
      });

      closeButton?.removeEventListener("click", handleNavigation);
      menuSpan?.removeEventListener("click", handleNavigation);
      menuEye?.removeEventListener("click", handleNavigation);
      navIcons?.removeEventListener("click", handleNavigation);
    };
  }, [formDirtyCheck]);

  return null;
}
