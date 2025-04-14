import React, { useState, useEffect } from "react";
import { BellOff } from "react-feather";
import { getNotifications } from "src/components/server/service";
import NavbarDropdown from "./NavbarDropdown";
import NotificationItem from "./NotificationItem";

const Notifications = () => {
  const [tasks, setTasks] = useState([]);
  const currentUserJSON = localStorage.current_logged_User;
  const currentUser = currentUserJSON
    ? JSON.parse(currentUserJSON)[0].user_details.data[0].user_id
    : null;

  useEffect(() => {
    getNotifications("notificationinfo", currentUser)
      .then((response) => {
        const responseData = response.data;
        setTasks(responseData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <div className="mb-1">
        <NavbarDropdown
          header="New Notifications"
          //footer="Show all notifications"
          icon={BellOff}
          count={tasks.length}
          showBadge={tasks.length > 0}
        >
          {tasks.map((task, key) => {
            return (
              <NotificationItem
                key={key}
                spacing
                taskDetails={task}
                taskName={task.task_name}
                time={task.created_on}
              />
            );
          })}
        </NavbarDropdown>
      </div>
    </>
  );
};

export default Notifications;
