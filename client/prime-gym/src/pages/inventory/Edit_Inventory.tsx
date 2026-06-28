import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import updateData from "../../data/updateData";
import fetchRecord from "../../data/fetchRecord";

type Params = {
  id: string;
};

type FormData = {
  item_name: string;
  item_code: string;
  category: string;
  quantity: number;
  unit_price: number;
  status: string;
};

export default function Edit_Inventory(): React.ReactElement {
  const { id } = useParams<Params>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const result = await updateData({ url: "inventory", id: id!.toString(), updateData: data });
      if (result) {
        navigate("/inventory");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchRecord({ url: "inventory", id });
        if (result) {
          reset(result);
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
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

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
            header="Edit Inventory Item"
            subheader="Update the details of the inventory item."
          />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-10">

            {/* ── ITEM DETAILS ── */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Item Details
              </span>
              <hr className="flex-1 border-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-2">

              {/* Item Name */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Item Name</label>
                <input
                  type="text"
                  placeholder="Enter item name..."
                  className={inputClass(!!errors.item_name)}
                  {...register("item_name", {
                    required: "Item name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                  })}
                />
                {errors.item_name && (
                  <span className="text-red-500 text-sm">{errors.item_name.message}</span>
                )}
              </div>

              {/* Item Code */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Item Code</label>
                <input
                  type="text"
                  placeholder="e.g. INV-001"
                  className={inputClass(!!errors.item_code)}
                  {...register("item_code", {
                    required: "Item code is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                  })}
                />
                {errors.item_code && (
                  <span className="text-red-500 text-sm">{errors.item_code.message}</span>
                )}
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Category</label>
                <select
                  defaultValue=""
                  className={selectClass(!!errors.category)}
                  {...register("category", { required: "Category is required" })}
                >
                  <option value="" disabled>Select a category...</option>
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

              {/* Status */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Status</label>
                <select
                  defaultValue="Available"
                  className={selectClass(!!errors.status)}
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
            </div>

            {/* ── STOCK & PRICING ── */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Stock & Pricing
              </span>
              <hr className="flex-1 border-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-2">

              {/* Quantity */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity..."
                  className={inputClass(!!errors.quantity)}
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

              {/* Unit Price */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Unit Price (₱)</label>
                <input
                  type="number"
                  placeholder="Enter unit price..."
                  className={inputClass(!!errors.unit_price)}
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
            </div>

            <hr className="border-t border-gray-200 mt-6 mb-6" />

            <div className="flex gap-3">
              <button type="submit" className="btn btn-success text-white">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-neutral btn-outline"
                onClick={() => navigate("/inventory")}
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
