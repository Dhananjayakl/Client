import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Dropdown, Button } from "react-bootstrap";
import FormRunTime from "src/components/forms/reactformutils/FormRuntimeEngine";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

const OnclickButton = ({ value, row, columnMeta, Drpoptions }) => {
  console.log("rowrow", columnMeta);

  const navigate = useNavigate();
  const objectId = row.original[columnMeta.id_column_name];
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (option, row) => {
    const objId = row.original[option.id_column_name];
    setSelectedItem({ ...option, objId });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  const isHidden = Drpoptions.every(
    (item) => row.original[item.column_name] === null
  );

  return (
    <div
      // className="d-flex flex-grow-1 "
      ref={dropdownRef}
      // style={{ position: "relative" }}
    >
      <Dropdown
        show={dropdownOpen}
        onToggle={() => setDropdownOpen(!dropdownOpen)}
      >
        <Dropdown.Toggle
          // as={Button}
          variant="link"
          // onClick={toggleDropdown}
          className={`p-0 ${isHidden ? "d-none" : ""} `}
          // style={{
          //   cursor: "pointer",
          //   overflow: "inherit !mportant",
          //   zIndex: 9999,
          // }}
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </Dropdown.Toggle>

        <Dropdown.Menu
          style={{
            marginLeft: "1.2rem",
            marginRight: "1.2rem",
          }}
          popperConfig={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -25], // Adjust offset (x, y)
                },
              },
            ],
          }}
        >
          {Drpoptions.map((item) => {
            if (
              row.original[item.column_name] === "" ||
              row.original[item.column_name] == null
            )
              return null;
            return (
              <Dropdown.Item
                key={item.column_name}
                className="text-primary"
                onClick={() => handleOptionClick(item, row)}
              >
                {row.original[item.column_name]}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>

      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Body>
            <FormRunTime
              formService={selectedItem?.form}
              objectId={selectedItem?.objId}
              objectData={row?.original}
              modal
              ParentFormObjectId={
                row.original[selectedItem?.parent_object_name]
              }
            />
            <div hidden className="CloseModalForm">
              <Button onClick={handleCloseModal}>Close</Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default OnclickButton;
