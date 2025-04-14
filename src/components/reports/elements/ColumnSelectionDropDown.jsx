import React, { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";

const ColumnSelectionDropdown = ({
  name,
  reportMeta,
  flexRender,
  table,
  ...props
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const visibleColumnsCount = table
    .getAllLeafColumns()
    .filter((column) => column.getIsVisible()).length;

  const toggleMenu = () => {
    setShowMenu((prevState) => !prevState);
  };

  return (
    <div className="float-end mx-1">
      <Dropdown show={showMenu} onToggle={setShowMenu} align="end">
        {/* Custom trigger without the default Dropdown.Toggle */}
        <div
          onClick={toggleMenu}
          style={{ cursor: "pointer", display: "inline-block" }}
        >
          <Button
            className="border-primary  p-1 px-2 rounded-circle"
            variant={reportMeta?.reportInfo?.theme == 2 ? "light" : "primary"}
          >
            <FontAwesomeIcon icon={faListCheck} className="p-0 m-0 " />
          </Button>
        </div>
        {/* onClick={() => setShowMenu(false)} */}
        <Dropdown.Menu show={showMenu}>
          <div className="p-2 columnSelection">
            {table.getAllLeafColumns().map((column) => (
              <div key={column.id} className="my-1">
                <label>
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    disabled={
                      visibleColumnsCount === 1 && column.getIsVisible()
                    }
                  />{" "}
                  {flexRender(column.columnDef.header)}
                </label>
              </div>
            ))}
            {visibleColumnsCount === 1 && (
              <label className="text-danger">Need at least one column</label>
            )}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ColumnSelectionDropdown;
