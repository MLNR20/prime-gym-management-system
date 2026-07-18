// components/ConfirmModal.tsx
import React, { forwardRef } from "react";

type ConfirmModalProps = {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmClassName?: string;
  onConfirm: () => void;
};

const ConfirmModal = forwardRef<HTMLDialogElement, ConfirmModalProps>(
  (
    {
      title,
      message,
      confirmLabel = "Confirm",
      cancelLabel = "Go Back",
      confirmClassName = "btn btn-success text-white",
      onConfirm,
    },
    ref
  ) => {
    const closeModal = () => {
      if (ref && "current" in ref) {
        ref.current?.close();
      }
    };

    return (
      <dialog
        ref={ref}
        className="modal"
        style={{ backgroundColor: "transparent" }}
      >
        <div className="modal-box bg-white text-gray-800 shadow-xl border border-gray-200">
          <h3 className="font-bold text-lg text-gray-900">{title}</h3>
          <div className="py-4 text-sm text-gray-600">{message}</div>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-neutral btn-outline"
              onClick={closeModal}
            >
              {cancelLabel}
            </button>
            <button type="button" className={confirmClassName} onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>

        <form
          method="dialog"
          className="modal-backdrop"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <button>close</button>
        </form>
      </dialog>
    );
  }
);

ConfirmModal.displayName = "ConfirmModal";

export default ConfirmModal;
