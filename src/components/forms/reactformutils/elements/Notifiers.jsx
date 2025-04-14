import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Row, Col, Button, Card, Dropdown } from "react-bootstrap";
import axios from "src/utils/AxiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";

function Notifiers(props) {
  const { runtimeParams } = props;
  const formId = runtimeParams.formId;
  const objectId = runtimeParams.objectId;

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [watchersData, setWatchersData] = useState([]);
  const [userId, setUserId] = useState();
  const [watchersCount, setWatchersCount] = useState(0);
  const [error, setError] = useState("");
  const [displayUser, setdisplayuser] = useState();
  const [dropdownVisible, setDropdownVisible] = useState(true);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await axios.get(`/util/getUserInfo`);
        const data = await response.data.data;

        const filteredUsers = data.filter(
          (item) => !watchersData.some((watcher) => watcher.userid === item.key)
        );
        const transformedData = filteredUsers.map((item) => ({
          value: item.key,
          label: item.value,
        }));

        setUsers(transformedData);
        setdisplayuser(data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }
    fetchOptions();
  }, [watchersData]);

  const getWatchers = async () => {
    try {
      const response = await axios.get(
        `/form/formObjectNotifier?formId=${formId}&objectId=${objectId}`
      );
      setWatchersData(response.data);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  useEffect(() => {
    getWatchers();
  }, []);

  useEffect(() => {
    setWatchersCount(watchersData.length);
  }, [watchersData]);

  const deleteWatchers = async (userId) => {
    try {
      const response = await axios.delete(
        `/form/deleteformObjectNotifier?formId=${formId}&objectId=${objectId}&userId=${userId}`
      );
      const data = await response.data.data;
      const updatedWatchersData = watchersData.filter(
        (watcher) => watcher.userid !== userId
      );
      setWatchersData(updatedWatchersData);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const handleDeleteWatcher = (userId) => {
    deleteWatchers(userId);
  };

  // const handleCloseButtonClick = () => {
  //   setDropdownVisible(false);
  //   setSelectedUsers([]);
  // };

  const handleUsersSelect = async (selectedOptions) => {
    setSelectedUsers(selectedOptions);
    const selectedUserId = selectedOptions.value;
    setUserId(selectedUserId);
    setError("");

    try {
      const isUserExists = watchersData.some(
        (watcher) => watcher.userid === selectedUserId
      );
      if (isUserExists) {
        setError("User already exists as a watcher.");
        return;
      }

      const response = await axios.post(
        `/form/formObjectNotifier?formId=${formId}&objectId=${objectId}&userId=${selectedUserId}`
      );
      const data = await response.data.data;
      setSelectedUsers([]);
      setUserId("");
      getWatchers();
    } catch (error) {
      console.error("Error occurred:", error);
      setError("Please select a watcher");
    }
  };
  const getUserName = (userId) => {
    const user = displayUser && displayUser.find((user) => user.key === userId);
    return user ? user.value : "Unknown User";
  };

  return (
    <>
      <div className="float-end removeToggle p-0 m-0 ">
        <Dropdown className="" align="end ">
          <Dropdown.Toggle as="a" className="pb-1 ">
            <Button
              // size='sm'
              variant="text"
            >
              <FontAwesomeIcon icon={faEye} /> ({watchersCount})
            </Button>
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropmenu">
            {/* <Dropdown.Item >
            <div className="watcher-header">        
              <FontAwesomeIcon
                icon={faTimes}
                style={{ fontSize: '1.3rem' }}
                // onClick={handleCloseButtonClick} 
                className='faTimes-icon'
              />   
            </div>
          </Dropdown.Item> */}

            <Select
              name="notifiers"
              options={users}
              value={selectedUsers}
              onChange={handleUsersSelect}
              className="mb-1 select-user"
            />

            {watchersData.map((watcher, index) => (
              <div key={index} className="watcher-item">
                <span className="user-name">{getUserName(watcher.userid)}</span>
                <FontAwesomeIcon
                  icon={faTrash}
                  className="delete-icon"
                  onClick={() => handleDeleteWatcher(watcher.userid)}
                />
              </div>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
}

export default Notifiers;
