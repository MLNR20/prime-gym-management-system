import React, { useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm, useWatch } from "react-hook-form";
import createData from "../../data/createData";
import useFetchData from "../../data/fetchData";
import { useNavigate } from "react-router-dom";

type FormData = {
  inventory_id: string;
  quantity: number;
};

export default function Add_Sales(): React.ReactElement {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { quantity: 1 } });
  const navigate = useNavigate();

  const forSaleItems = useFetchData({ url: "inventory/for-sale" });
  const itemList = Array.isArray(forSaleItems) ? forSaleItems : [];

  const selectedInventoryId = useWatch({ control, name: "inventory_id" });
  const quantity = useWatch({ control, name: "quantity" });

  const selectedItem = useMemo(
    () => itemList.find((item: any) => item._id === selectedInventoryId),
    [itemList, selectedInventoryId]
  );

  const totalPrice = useMemo(() => {
    if (!selectedItem || !quantity) return 0;
    return Number(quantity) * Number(selectedItem.unit_price);
  }, [selectedItem, quantity]);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await createData({ url: "sales", data });
      if (result) {
        navigate("/sales");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? "Failed to create sale.";
      alert(message);
    }
  };

  const labelClass = "text-sm font-medium text-gray-500";
  const inputClass = (hasError: boolean) =>
    `input input-bordered h-12 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "input-error" : ""}`;
  const selectClass = (hasError: boolean) =>
    `select select-bordered h-12 border bg-white border-gray-400 text-gray-500 w-full ${hasError ? "select-error" : ""}`;

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header
            header="Record New Sale"
            subheader="Select an inventory item marked for sale. Stock will be deducted automatically."
          />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Sale Details
              </span>
              <hr className="flex-1 border-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-2">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Inventory Item</label>
                <select
                  defaultValue=""
                  className={selectClass(!!errors.inventory_id)}
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
                {itemList.length === 0 && (
                  <span className="text-gray-500 text-xs mt-1">
                    No items marked for sale with available stock.
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={selectedItem?.quantity ?? undefined}
                  placeholder="Enter quantity..."
                  className={inputClass(!!errors.quantity)}
                  {...register("quantity", {
                    required: "Quantity is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Minimum quantity is 1" },
                    validate: (value) => {
                      if (selectedItem && value > selectedItem.quantity) {
                        return `Only ${selectedItem.quantity} in stock`;
                      }
                      return true;
                    },
                  })}
                />
                {errors.quantity && (
                  <span className="text-red-500 text-sm">
                    {errors.quantity.message}
                  </span>
                )}
              </div>

              {selectedItem && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Unit Price (₱)</label>
                    <input
                      type="text"
                      readOnly
                      value={Number(selectedItem.unit_price).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                      className="input input-bordered h-12 border bg-gray-50 border-gray-400 text-gray-500 w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Total Price (₱)</label>
                    <input
                      type="text"
                      readOnly
                      value={totalPrice.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                      className="input input-bordered h-12 border bg-gray-50 border-gray-400 text-gray-500 w-full"
                    />
                  </div>
                </>
              )}
            </div>

            <hr className="border-t border-gray-200 mt-6 mb-6" />

            <div className="flex gap-3">
              <button
                type="submit"
                className="btn btn-success text-white"
                disabled={itemList.length === 0}
              >
                Record Sale
              </button>
              <button
                type="button"
                className="btn btn-neutral btn-outline"
                onClick={() => navigate("/sales")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
