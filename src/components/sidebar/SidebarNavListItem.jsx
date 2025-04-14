import React, { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Badge, Collapse } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { NameInitialsAvatar } from "react-name-initials-avatar";
import useSidebar from "src/hooks/useSidebar";
import { compactSidebarconfig } from "src/config";

const CustomRouterLink = forwardRef((props, ref) => (
  <React.Fragment ref={ref}>
    <NavLink {...props} />
  </React.Fragment>
));

const SidebarNavListItem = (props) => {
  const { t } = useTranslation("common");
  const {
    title,
    href,
    depth = 0,
    children,
    icon: Icon,
    badge,
    open: openProp = false,
  } = props;

  const [open, setOpen] = React.useState(openProp);
  const router = useLocation();

  const currentRouter = router.pathname + router.search;

  const handleToggle = () => {
    setOpen((state) => !state);
  };

  const { isOpen, setIsOpen, behavior, setBehavior } = useSidebar();
  const bothIconIntial = compactSidebarconfig.bothIconIntial;
  const onlyInitials = compactSidebarconfig.onlyInital;
  const onlyIcon = compactSidebarconfig.onlyIcon;
  if (children) {
    return (
      <li className={`sidebar-item ${open ? "active" : ""}`}>
        <a
          className={`sidebar-link ${open ? "" : "collapsed"}`}
          // style={{ marginLeft: "7px" }}
          data-bs-toggle="collapse"
          aria-expanded={open ? "true" : "false"}
          depth={depth}
          onClick={handleToggle}
        >
          {behavior === "compact" && bothIconIntial && (
            <div className="intials-margin   icon-initial">
              <span>{Icon && <Icon className="feather align-middle " />}</span>
              <NameInitialsAvatar
                name={`${title}}`}
                size="25px"
                borderRadius="50%"
                bgColor="#f2f2f2"
                borderWidth="1px"
                textSize="12px"
                textWeight="12"
              />
            </div>
          )}
          {behavior === "compact" && onlyInitials && (
            <div className="onlyInital">
              <NameInitialsAvatar
                name={`${title}}`}
                size="27px"
                borderRadius="50%"
                bgColor="#f2f2f2"
                borderWidth="1px"
                textSize="14px"
                textWeight="12"
              />
            </div>
          )}
          {behavior === "compact" && onlyIcon && Icon && (
            <Icon className="feather align-middle onlyIcon" />
          )}
          {behavior !== "compact" && Icon && (
            <Icon className="feather align-middle " />
          )}

          <span className="align-middle" depth={depth}>
            {t(title)}
          </span>
          {badge && (
            <Badge className="badge-sidebar-primary" bg="" size={18}>
              {badge}
            </Badge>
          )}
          {open ? <div /> : <div />}
        </a>

        <Collapse in={open}>
          <ul className="sidebar-dropdown list-unstyled ">{children}</ul>
        </Collapse>
      </li>
    );
  }

  return (
    <li className="sidebar-item dropdown">
      <CustomRouterLink
        depth={depth}
        to={href}
        activeclassname="active"
        className={`sidebar-link ${currentRouter === href ? "text-info" : ""}`}
        data-bs-toggle="linkcollapse"
        aria-expanded="true"
      >
        {behavior === "compact" && bothIconIntial && (
          <div className="avoid-dropdown intials-margin icon-initial">
            <span>{Icon && <Icon className="feather align-middle" />}</span>
            <NameInitialsAvatar
              name={`${title}`}
              size="25px"
              borderRadius="50%"
              bgColor="#f2f2f2"
              borderWidth="1px"
              textSize="12px"
              textWeight="12"
            />
          </div>
        )}
        {behavior === "compact" && onlyInitials && (
          <div className="avoid-dropdown onlyInital">
            <NameInitialsAvatar
              name={`${title}`}
              size="27px"
              borderRadius="50%"
              bgColor="#f2f2f2"
              borderWidth="1px"
              textSize="14px"
              textWeight="12"
            />
          </div>
        )}
        {behavior === "compact" && onlyIcon && Icon && (
          <Icon className="feather align-middle  onlyIcon" />
        )}
        {behavior !== "compact" && Icon && (
          <Icon className="feather align-middle " />
        )}

        <span className="align-middle" depth={depth}>
          {t(title)}
        </span>
        {badge && (
          <Badge className="badge-sidebar-primary" bg="" size={18}>
            {badge}
          </Badge>
        )}
      </CustomRouterLink>
    </li>
  );
};

export default SidebarNavListItem;
