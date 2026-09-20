// components/ConfirmModal.tsx
import React, { forwardRef } from "react";

type ConfirmModalProps = {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmClassName?: string;
  onConfirm: () => void;
  dimBackdrop?: boolean;
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
      dimBackdrop = true,
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
        className={`modal modal-bottom sm:modal-middle${
          dimBackdrop ? "" : " modal-no-dim"
        }`}
      >
        <div className="modal-box bg-white text-black shadow-xl border border-gray-200">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{message}</p>
          <div className="modal-action gap-2">
            <button type="button" className={confirmClassName} onClick={onConfirm}>
              {confirmLabel}
            </button>
            <button
              type="button"
              className="btn btn-neutral btn-outline"
              onClick={closeModal}
            >
              {cancelLabel}
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  }
);

ConfirmModal.displayName = "ConfirmModal";

export default ConfirmModal;
