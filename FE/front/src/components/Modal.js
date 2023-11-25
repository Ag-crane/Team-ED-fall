import React from "react";
import { useEffect } from "react";
import "../styles/components/Modal.css";

function Modal({ isOpen, onClose, children }) {
  // 배경 클릭 시 모달 닫기
  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div id="modal-backdrop" className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <button onClick={onClose} className="modal-close-button">X</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
