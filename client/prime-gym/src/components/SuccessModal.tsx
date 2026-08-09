// components/SuccessModal.tsx
import React, { forwardRef } from "react";
import { CheckCircle2 } from "lucide-react";

type SuccessModalProps = {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  /** Runs after the modal closes — e.g. navigate away or refetch. */
  onConfirm?: () => void;
};

const SuccessModal = forwardRef<HTMLDialogElement, SuccessModalProps>(
  ({ title, message, confirmLabel = "Done", onConfirm }, ref) => {
    const closeModal = () => {
      if (ref && "current" in ref) {
        ref.current?.close();
      }
      onConfirm?.();
    };

    return (
      <dialog
        ref={ref}
        className="modal"
        style={{ backgroundColor: "transparent" }}
      >
        <div className="modal-box bg-white text-gray-800 shadow-xl border border-gray-200">
          <div className="flex flex-col items-center text-center py-2">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mt-4">{title}</h3>
            <div className="py-2 text-sm text-gray-600">{message}</div>
          </div>
          <div className="modal-action justify-center">
            <button
              type="button"
              className="btn btn-success text-white"
              onClick={closeModal}
            >
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

SuccessModal.displayName = "SuccessModal";

export default SuccessModal;
