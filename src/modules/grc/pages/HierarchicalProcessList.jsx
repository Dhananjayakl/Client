import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";

const HierarchicalProcessList = ({ menuData }) => {
  const [openMenus, setOpenMenus] = useState({});

  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  // Initialize all menus as open if they have children
  useEffect(() => {
    const initializeOpenMenus = (data) => {
      const openState = {};
      const setAllOpen = (items) => {
        items.forEach((item) => {
          if (item.children && item.children.length > 0) {
            openState[item.object_id] = true;
            setAllOpen(item.children);
          }
        });
      };
      setAllOpen(data);
      return openState;
    };

    setOpenMenus(initializeOpenMenus(menuData));
  }, [menuData]);

  // Recursive rendering for multi-level menu
  const renderProcesses = (data, level = 0) => {
    return (
      <ul className={`ps-${level * 2}`}>
        {data.map((item) => (
          <li key={item.object_id}>
            <div
              className="d-flex justify-content-between align-items-center  m-1 p-1"
              onClick={() => item.children && toggleMenu(item.object_id)}
              style={{ cursor: item.children ? "pointer" : "default" }}
            >
              <h5>
                {item.name} ({item.level})
                {item.object_id == objectId && <span className="ms-1">✅</span>}
              </h5>
              {/* {item.children && (
                <span>
                  {openMenus[item.object_id] ? (
                    <FontAwesomeIcon icon={faChevronDown} />
                  ) : (
                    <FontAwesomeIcon icon={faChevronRight} />
                  )}
                </span>
              )} */}
            </div>
            {item.children &&
              openMenus[item.object_id] &&
              renderProcesses(item.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  // Toggle submenu visibility
  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filter top-level processes (parents with no `parent` value)
  const topLevelProcesses = menuData.filter((item) => !item.parent);

  return (
    <div className="border-light-subtle px-4 py-2">
      {renderProcesses(topLevelProcesses)}
    </div>
  );
};

export default HierarchicalProcessList;
