// components/EditExpenseModal.tsx
import { forwardRef } from "react";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

export type EditExpenseFormData = {
  _id: string;
  expense_title: string;
  unit_price: number;
  quantity: number;
  categories: string;
  due_date: string;
};

type EditExpenseModalProps = {
  formKey?: string;
  register: UseFormRegister<EditExpenseFormData>;
  handleSubmit: UseFormHandleSubmit<EditExpenseFormData>;
  errors: FieldErrors<EditExpenseFormData>;
  onSubmit: (data: EditExpenseFormData) => void;
  onClose: () => void;
};

const EditExpenseModal = forwardRef<HTMLDialogElement, EditExpenseModalProps>(
  ({ formKey, register, handleSubmit, errors, onSubmit, onClose }, ref) => {
    return (
      <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black shadow-xl border border-gray-200 max-w-2xl">
          <h3 className="font-bold text-lg">Edit Expense</h3>
          <p className="text-sm text-gray-500 pb-2">Update the details of this expense entry...</p>
          <div className="modal-action flex-col">
            <form key={formKey} onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="hidden" {...register("_id")} />

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Expense Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter expense title..."
                    className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.expense_title ? "input-error" : ""
                    }`}
                    {...register("expense_title", {
                      required: "Expense title is required",
                      minLength: { value: 2, message: "Minimum 2 characters" },
                    })}
                  />
                  {errors.expense_title && (
                    <span className="text-red-500 text-sm">{errors.expense_title.message}</span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Category</span>
                  </label>
                  <select
                    className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.categories ? "select-error" : ""
                    }`}
                    {...register("categories", { required: "Category is required" })}
                  >
                    <option value="">Select a category...</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Wages">Wages</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                  {errors.categories && (
                    <span className="text-red-500 text-sm">{errors.categories.message}</span>
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

                <div className="flex w-full flex-col gap-2 sm:col-span-2">
                  <label className="label">
                    <span className="label-text text-black">Due Date</span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.due_date ? "input-error" : ""
                    }`}
                    {...register("due_date", { required: "Due date is required" })}
                  />
                  {errors.due_date && (
                    <span className="text-red-500 text-sm">{errors.due_date.message}</span>
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

EditExpenseModal.displayName = "EditExpenseModal";

export default EditExpenseModal;
