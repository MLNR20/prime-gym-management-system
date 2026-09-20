// components/EditEquipmentModal.tsx
import { forwardRef } from "react";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

export type EditEquipmentFormData = {
  _id: string;
  equipment_name: string;
  equipment_status: string;
};

type EditEquipmentModalProps = {
  formKey?: string;
  register: UseFormRegister<EditEquipmentFormData>;
  handleSubmit: UseFormHandleSubmit<EditEquipmentFormData>;
  errors: FieldErrors<EditEquipmentFormData>;
  onSubmit: (data: EditEquipmentFormData) => void;
  onClose: () => void;
};

const EditEquipmentModal = forwardRef<HTMLDialogElement, EditEquipmentModalProps>(
  ({ formKey, register, handleSubmit, errors, onSubmit, onClose }, ref) => {
    return (
      <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black shadow-xl border border-gray-200">
          <h3 className="font-bold text-lg">Edit Equipment</h3>
          <p className="text-sm text-gray-500 pb-2">Update the details of this gym equipment...</p>
          <div className="modal-action flex-col">
            <form key={formKey} onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full">
                <input type="hidden" {...register("_id")} />

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Equipment Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter equipment name..."
                    className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.equipment_name ? "input-error" : ""
                    }`}
                    {...register("equipment_name", {
                      required: "Equipment name is required",
                    })}
                  />
                  {errors.equipment_name && (
                    <span className="text-red-500 text-sm">
                      {errors.equipment_name.message}
                    </span>
                  )}
                </div>

                <div className="flex w-full my-6 flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Equipment Status</span>
                  </label>
                  <select
                    className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.equipment_status ? "select-error" : ""
                    }`}
                    {...register("equipment_status", {
                      required: "Equipment status is required",
                    })}
                  >
                    <option value="" disabled>
                      Select equipment status...
                    </option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="For Repair">For Repair</option>
                    <option value="Under Repair">Under Repair</option>
                  </select>
                  {errors.equipment_status && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.equipment_status.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="gap-2 flex flex-row">
                <button type="submit" className="btn btn-success text-white">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-neutral btn-outline"
                >
                  Close
                </button>
              </div>
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

EditEquipmentModal.displayName = "EditEquipmentModal";

export default EditEquipmentModal;
