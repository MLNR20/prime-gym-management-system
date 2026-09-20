// components/EditSalesModal.tsx
import { forwardRef, useMemo } from "react";
import type {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

export type EditSalesFormData = {
  _id: string;
  inventory_id: string;
  quantity: number;
  is_active: string;
};

type EditSalesModalProps = {
  formKey?: string;
  register: UseFormRegister<EditSalesFormData>;
  handleSubmit: UseFormHandleSubmit<EditSalesFormData>;
  control: Control<EditSalesFormData>;
  errors: FieldErrors<EditSalesFormData>;
  itemList: any[];
  originalQuantity: number;
  onSubmit: (data: EditSalesFormData) => void;
  onClose: () => void;
};

const EditSalesModal = forwardRef<HTMLDialogElement, EditSalesModalProps>(
  (
    {
      formKey,
      register,
      handleSubmit,
      control,
      errors,
      itemList,
      originalQuantity,
      onSubmit,
      onClose,
    },
    ref
  ) => {
    const selectedInventoryId = useWatch({ control, name: "inventory_id" });
    const quantity = useWatch({ control, name: "quantity" });

    const selectedItem = useMemo(
      () => itemList.find((item: any) => item._id === selectedInventoryId),
      [itemList, selectedInventoryId]
    );

    const maxQuantity = useMemo(() => {
      if (!selectedItem) return undefined;
      return selectedInventoryId === selectedItem._id
        ? selectedItem.quantity + originalQuantity
        : selectedItem.quantity;
    }, [selectedItem, selectedInventoryId, originalQuantity]);

    const totalPrice = useMemo(() => {
      const unitPrice = selectedItem?.unit_price ?? 0;
      if (!quantity) return 0;
      return Number(quantity) * Number(unitPrice);
    }, [selectedItem, quantity]);

    return (
      <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black shadow-xl border border-gray-200 max-w-2xl">
          <h3 className="font-bold text-lg">Edit Sale</h3>
          <p className="text-sm text-gray-500 pb-2">
            Update sale details. Inventory stock will adjust automatically...
          </p>
          <div className="modal-action flex-col">
            <form key={formKey} onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="hidden" {...register("_id")} />

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Inventory Item</span>
                  </label>
                  <select
                    className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.inventory_id ? "select-error" : ""
                    }`}
                    {...register("inventory_id", {
                      required: "Inventory item is required",
                    })}
                  >
                    <option value="" disabled>
                      Select an item for sale...
                    </option>
                    {itemList.map((item: any) => (
                      <option key={item._id} value={item._id}>
                        {item.item_code} — {item.item_name} (Stock: {item.quantity})
                      </option>
                    ))}
                  </select>
                  {errors.inventory_id && (
                    <span className="text-red-500 text-sm">
                      {errors.inventory_id.message}
                    </span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Quantity</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={maxQuantity}
                    placeholder="Enter quantity..."
                    className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.quantity ? "input-error" : ""
                    }`}
                    {...register("quantity", {
                      required: "Quantity is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Minimum quantity is 1" },
                      validate: (value) => {
                        if (maxQuantity !== undefined && value > maxQuantity) {
                          return `Only ${maxQuantity} available`;
                        }
                        return true;
                      },
                    })}
                  />
                  {errors.quantity && (
                    <span className="text-red-500 text-sm">{errors.quantity.message}</span>
                  )}
                </div>

                <div className="flex w-full flex-col gap-2">
                  <label className="label">
                    <span className="label-text text-black">Status</span>
                  </label>
                  <select
                    className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${
                      errors.is_active ? "select-error" : ""
                    }`}
                    {...register("is_active", { required: "Status is required" })}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  {errors.is_active && (
                    <span className="text-red-500 text-sm">{errors.is_active.message}</span>
                  )}
                </div>

                {selectedItem && (
                  <div className="flex w-full flex-col gap-2">
                    <label className="label">
                      <span className="label-text text-black">Total Price (₱)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={totalPrice.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                      className="input input-bordered h-12 border bg-gray-50 border-gray-700 w-full"
                    />
                  </div>
                )}
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

EditSalesModal.displayName = "EditSalesModal";

export default EditSalesModal;
