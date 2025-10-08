import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
      <div className="bg-white border border-black shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 relative">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 px-2 py-1 text-sm border border-black hover:bg-black hover:text-white"
        >
          ✕
        </button>

        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
