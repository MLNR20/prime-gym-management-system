import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar";
import EditLoadingScreen from "../../components/EditLoadingScreen";
import Header from "../../components/Header";
import ConfirmModal from "../../components/ConfirmModal";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import updateData from "../../data/updateData";
import fetchRecord from "../../data/fetchRecord";
import useFetchData from "../../data/fetchData";

type Params = {
  id: string;
};

type FormData = {
  inventory_id: string;
  quantity: number;
  is_active: string;
};

export default function Edit_Sales(): React.ReactElement {
  const { id } = useParams<Params>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [originalQuantity, setOriginalQuantity] = useState(0);
  const [currentSaleItem, setCurrentSaleItem] = useState<any>(null);
  const [pendingData, setPendingData] = useState<FormData | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const forSaleItems = useFetchData({ url: "inventory/for-sale" });
  const baseItemList = Array.isArray(forSaleItems) ? forSaleItems : [];

  const itemList = useMemo(() => {
    if (!currentSaleItem) return baseItemList;
    const exists = baseItemList.some((item: any) => item._id === currentSaleItem._id);
    return exists ? baseItemList : [...baseItemList, currentSaleItem];
  }, [baseItemList, currentSaleItem]);

  const selectedInventoryId = useWatch({ control, name: "inventory_id" });
  const quantity = useWatch({ control, name: "quantity" });

  const selectedItem = useMemo(
    () => itemList.find((item: any) => item._id === selectedInventoryId),
    [itemList, selectedInventoryId]
  );

  const maxQuantity = useMemo(() => {
    if (!selectedItem) return undefined;
    const available =
      selectedInventoryId === selectedItem._id
        ? selectedItem.quantity + originalQuantity
        : selectedItem.quantity;
    return available;
  }, [selectedItem, selectedInventoryId, originalQuantity]);

  const totalPrice = useMemo(() => {
    const unitPrice = selectedItem?.unit_price ?? 0;
    if (!quantity) return 0;
    return Number(quantity) * Number(unitPrice);
  }, [selectedItem, quantity]);

  const onValidSubmit = (data: FormData) => {
    setPendingData(data);
    modalRef.current?.showModal();
  };

  const confirmSubmit = async () => {
    if (!pendingData) return;
    try {
      const result = await updateData({
        url: "sales",
        id: id!.toString(),
        updateData: {
          inventory_id: pendingData.inventory_id,
          quantity: pendingData.quantity,
          is_active: pendingData.is_active === "true",
        },
      });
      if (result) {
        modalRef.current?.close();
        navigate("/sales", {
          state: { alertMessage: "Sale updated successfully!", alertVariant: "success" },
        });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? "Failed to update sale.";
      alert(message);
    }
  };

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchRecord({ url: "sales", id });
        if (result) {
          setOriginalQuantity(result.quantity);
          if (result.inventory_id) {
            const inventoryItem = await fetchRecord({
              url: "inventory",
              id: result.inventory_id,
            });
            if (inventoryItem) {
              setCurrentSaleItem(inventoryItem);
            }
          }
          reset({
            inventory_id: result.inventory_id,
            quantity: result.quantity,
            is_active: result.is_active ? "true" : "false",
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, reset]);

  if (loading) {
    return <EditLoadingScreen message="Loading sales record..." />;
  }

  const labelClass = "text-sm font-medium text-gray-500";
  const inputClass = (hasError: boolean) =>
    `input input-bordered h-12 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "input-error" : ""}`;
  const selectClass = (hasError: boolean) =>
    `select select-bordered h-12 border bg-white border-gray-400 text-gray-500 w-full ${hasError ? "select-error" : ""}`;

  return (
    <div className="background-white flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-6 sm:p-16 rounded-lg">
          <Header
            header="Edit Sale"
            subheader="Update sale details. Inventory stock will adjust automatically."
          />

          <form onSubmit={handleSubmit(onValidSubmit)} className="w-full mt-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Sale Details
              </span>
              <hr className="flex-1 border-gray-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
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
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={maxQuantity}
                  placeholder="Enter quantity..."
                  className={inputClass(!!errors.quantity)}
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
                  <span className="text-red-500 text-sm">
                    {errors.quantity.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Status</label>
                <select
                  className={selectClass(!!errors.is_active)}
                  {...register("is_active", { required: "Status is required" })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {selectedItem && (
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
              )}
            </div>

            <hr className="border-t border-gray-200 mt-6 mb-6" />

            <div className="flex gap-3">
              <button type="submit" className="btn btn-success text-white">
                Save Changes
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

          <ConfirmModal
            ref={modalRef}
            title="Confirm Update"
            message={
              <>
                Are you sure you want to save these changes
                {selectedItem ? (
                  <>
                    {" "}
                    to <span className="font-semibold">{selectedItem.item_name}</span>
                  </>
                ) : null}
                ?
              </>
            }
            confirmLabel="Yes, Update"
            onConfirm={confirmSubmit}
          />
        </div>
      </div>
    </div>
  );
}
