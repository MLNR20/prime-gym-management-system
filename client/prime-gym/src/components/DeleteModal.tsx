// components/DeleteModal.tsx
import { forwardRef } from "react";

type DeleteModalProps = {
  label: string;
  onConfirm: () => void;
  dimBackdrop?: boolean;
};

const DeleteModal = forwardRef<HTMLDialogElement, DeleteModalProps>(
  ({ label, onConfirm, dimBackdrop = true }, ref) => {
    return (
      <dialog
        ref={ref}
        className={`modal modal-bottom sm:modal-middle${
          dimBackdrop ? "" : " modal-no-dim"
        }`}
      >
        <div className="modal-box bg-white text-black shadow-xl border border-gray-200">
          <h3 className="font-bold text-lg">Delete!</h3>
          <p className="py-4">
            You're about to delete <strong>{label}</strong>? This action
            cannot be reversed!
          </p>

          <div className="modal-action gap-2">
            <button className="btn btn-error text-white" onClick={onConfirm}>
              Delete
            </button>
            <form method="dialog">
              <button className="btn btn-neutral btn-outline">Close</button>
            </form>
          </div>
        </div>

        {/* backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  }
);

DeleteModal.displayName = "DeleteModal";

export default DeleteModal;
