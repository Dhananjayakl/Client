import { unLocked } from "src/modules/admin/AdminService";
import React from "react";
import { useState } from "react";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
const LockedUser = ({ value, row }) => {
  const [user, setUser] = useState([]);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const handleUnlock = (userId) => {
    unLocked("unlock", userId)
      .then((response) => {
        setUser((prevUsers) =>
          prevUsers.map((item) =>
            item.userId === userId ? { ...item, locked_out: false } : item
          )
        );
        setShowUnlockModal(true);

        setTimeout(() => {
          setShowUnlockModal(false);
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="d-flex flex-grow-1">
      {row.original.locked_out ? (
        <OverlayTrigger
          placement="right"
          delay={{ show: 60, hide: 60 }}
          overlay={
            <Tooltip id={`unlock-tooltip-${row.original.user_id}`}>
              Unlock User
            </Tooltip>
          }
        >
          <Button
            variant="link"
            onClick={() => {
              handleUnlock(row.original.user_id);
              row.original.locked_out = false;
            }}
            className="text-danger"
          >
            <FontAwesomeIcon icon={faLock} size="2x" />
          </Button>
        </OverlayTrigger>
      ) : null}

      <Modal show={showUnlockModal} onHide={() => setShowUnlockModal(false)}>
        <Modal.Body className="text-success text-center ">
          <p className="lead  mb-1">User unlocked successfully!</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default React.memo(LockedUser);
