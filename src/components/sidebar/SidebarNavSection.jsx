import React from "react";

import SidebarNavList from "./SidebarNavList";
import { useTranslation } from "react-i18next";

const SidebarNavSection = (props) => {
  const { title, pages, className, ...rest } = props;
  const { t } = useTranslation("common");
  return (
    <React.Fragment {...rest}>
      {title && <li className="sidebar-header sidebar-menu">{t(title)}</li>}
      <SidebarNavList pages={pages} depth={0} />
    </React.Fragment>
  );
};

export default SidebarNavSection;
