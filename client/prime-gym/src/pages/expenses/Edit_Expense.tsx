import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import EditLoadingScreen from "../../components/EditLoadingScreen";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import updateData from "../../data/updateData";
import fetchRecord from "../../data/fetchRecord";

type Params = {
  id: string;
};

type FormData = {
  expense_title: string;
  unit_price: number;
  quantity: number;
  categories: string;
  due_date: string;
};

export default function Edit_Expense(): React.ReactElement {
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
      const result = await updateData({
        url: "expenses",
        id: id!.toString(),
        updateData: {
          ...data,
          unit_price: Number(data.unit_price),
          quantity: Number(data.quantity),
        },
      });

      if (result) {
        navigate("/expenses", {
          state: { alertMessage: "Expense updated successfully!", alertVariant: "success" },
        });
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
        const result = await fetchRecord({ url: "expenses", id });
        if (result) {
          reset({
            ...result,
            due_date: result.due_date
              ? new Date(result.due_date).toISOString().split("T")[0]
              : "",
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
    return <EditLoadingScreen message="Loading expense record..." />;
  }

  const labelClass = "text-sm font-medium text-gray-500";
  const inputClass = (hasError: boolean) =>
    `input input-bordered h-12 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "input-error" : ""}`;
  const selectClass = (hasError: boolean) =>
    `select select-bordered h-12 border bg-white border-gray-400 text-gray-500 w-full ${hasError ? "select-error" : ""}`;

  return (
    <div className="flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-6 sm:p-16 rounded-lg">
          <Header
            header="Edit Expense"
            subheader="Update the details of this expense entry."
          />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Expense Title</label>
                <input
                  type="text"
                  placeholder="Enter expense title..."
                  className={inputClass(!!errors.expense_title)}
                  {...register("expense_title", {
                    required: "Expense title is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                  })}
                />
                {errors.expense_title && (
                  <span className="text-red-500 text-sm">{errors.expense_title.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Category</label>
                <select
                  className={selectClass(!!errors.categories)}
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

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Due Date</label>
                <input
                  type="date"
                  className={inputClass(!!errors.due_date)}
                  {...register("due_date", { required: "Due date is required" })}
                />
                {errors.due_date && (
                  <span className="text-red-500 text-sm">{errors.due_date.message}</span>
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
                onClick={() => navigate("/expenses")}
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
