import { Modal } from "antd";
import React from "react";

export default function ConfirmModal({ open, onOk, onCancel, textContent }) {
  return (
    <Modal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Sure, Delete!"
      cancelText="Cancel"
      cancelButtonProps={{ danger: true, type: "primary" }}
      closeIcon={<></>}
    >
      <div className="modal-confirm-content">
        <p>{textContent ? textContent : "Are you sure to delete this?"}</p>
      </div>
    </Modal>
  );
}
