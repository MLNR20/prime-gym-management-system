// components/EditInventoryModal.tsx
import { forwardRef } from "react";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

export type EditInventoryFormData = {
  _id: string;
  item_name: string;
  item_code: string;
  category: string;
  quantity: number;
  unit_price: number;
  status: string;
  is_for_sale: string;
};

type EditInventoryModalProps = {
  formKey?: string;
  register: UseFormRegister<EditInventoryFormData>;
  handleSubmit: UseFormHandleSubmit<EditInventoryFormData>;
  errors: FieldErrors<EditInventoryFormData>;
  onSubmit: (data: EditInventoryFormData) => void;
  onClose: () => void;
};

const EditInventoryModal = forwardRef<HTMLDialogElement, EditInventoryModalProps>(
  ({ formKey, register, handleSubmit, errors, onSubmit, onClose }, ref) => {
    return (
      <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black shadow-xl border border-gray-200 max-w-2xl">
          <h3 className="font-bold text-lg">Edit Inventory Item</h3>
          <p className="text-sm text-gray-500 pb-2">Update the details of this inventory item...</p>
          <div className="modal-action flex-col">
            <form key={formKey} onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="hidden" {...register("_id")} />

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Item Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter item name..."
                    className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.item_name ? "input-error" : ""
                    }`}
                    {...register("item_name", {
                      required: "Item name is required",
                      minLength: { value: 2, message: "Minimum 2 characters" },
                    })}
                  />
                  {errors.item_name && (
                    <span className="text-red-500 text-sm">{errors.item_name.message}</span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Item Code</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. INV-001"
                    className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.item_code ? "input-error" : ""
                    }`}
                    {...register("item_code", {
                      required: "Item code is required",
                      minLength: { value: 2, message: "Minimum 2 characters" },
                    })}
                  />
                  {errors.item_code && (
                    <span className="text-red-500 text-sm">{errors.item_code.message}</span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Category</span>
                  </label>
                  <select
                    className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.category ? "select-error" : ""
                    }`}
                    {...register("category", { required: "Category is required" })}
                  >
                    <option value="" disabled>
                      Select a category...
                    </option>
                    <option value="Equipment">Equipment</option>
                    <option value="Supplements">Supplements</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Cleaning Supplies">Cleaning Supplies</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                  {errors.category && (
                    <span className="text-red-500 text-sm">{errors.category.message}</span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Status</span>
                  </label>
                  <select
                    className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.status ? "select-error" : ""
                    }`}
                    {...register("status", { required: "Status is required" })}
                  >
                    <option value="Available">Available</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                  {errors.status && (
                    <span className="text-red-500 text-sm">{errors.status.message}</span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Quantity</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter quantity..."
                    className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.quantity ? "input-error" : ""
                    }`}
                    {...register("quantity", {
                      required: "Quantity is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Quantity cannot be negative" },
                    })}
                  />
                  {errors.quantity && (
                    <span className="text-red-500 text-sm">{errors.quantity.message}</span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Unit Price (₱)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter unit price..."
                    className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.unit_price ? "input-error" : ""
                    }`}
                    {...register("unit_price", {
                      required: "Unit price is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Price cannot be negative" },
                    })}
                  />
                  {errors.unit_price && (
                    <span className="text-red-500 text-sm">{errors.unit_price.message}</span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">For Sale</span>
                  </label>
                  <select
                    className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.is_for_sale ? "select-error" : ""
                    }`}
                    {...register("is_for_sale", { required: "For sale selection is required" })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                  {errors.is_for_sale && (
                    <span className="text-red-500 text-sm">{errors.is_for_sale.message}</span>
                  )}
                </div>
              </div>

              <div className="gap-2 flex flex-row mt-6">
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

EditInventoryModal.displayName = "EditInventoryModal";

export default EditInventoryModal;
