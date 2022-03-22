import React from "react";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close";

const ModalComponent = ({
  open,
  onClose,
  title,
  children,
  loading,
  actionType,
  editData,
  fetchData
}) => {

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className="modalParentDiv" >
        <div className="modalTitleDiv" >
          <p>
            {title}
          </p>

          <IconButton onClick={onClose} >
            <CloseIcon />
          </IconButton>
        </div>

        <div className="modalContentDiv" >
          {
            React.cloneElement(children, {
              onClose,
              actionType,
              editData,
              fetchData
            })
          }
        </div>
      </div>
    </Modal>
  )
}

export default ModalComponent;