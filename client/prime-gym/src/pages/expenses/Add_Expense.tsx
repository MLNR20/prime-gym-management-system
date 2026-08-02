import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import createData from "../../data/createData";
import { useNavigate } from "react-router-dom";

type FormData = {
  expense_title: string;
  unit_price: number;
  quantity: number;
  categories: string;
  due_date: string;
};

export default function Add_Expense(): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const result = await createData({
        url: "expenses",
        data: {
          ...data,
          unit_price: Number(data.unit_price),
          quantity: Number(data.quantity),
        },
      });

      if (result) {
        navigate("/expenses");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const labelClass = "text-sm font-medium text-gray-500";
  const inputClass = (hasError: boolean) =>
    `input input-bordered h-12 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "input-error" : ""}`;
  const selectClass = (hasError: boolean) =>
    `select select-bordered h-12 border bg-white border-gray-400 text-gray-500 w-full ${hasError ? "select-error" : ""}`;

  return (
    <div className="flex h-screen p-6 md:p-0 lg:p-0 lg:flex-row md:flex-row flex-col overflow-hidden">
      <div className="w-full md:w-48 lg:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 md:p-24 lg:p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header
            header="Add Expense"
            subheader="Fill in the details to record a new expense."
          />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-10">
            <div className="grid grid-cols-2 gap-6 mb-2">
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
                  defaultValue=""
                  className={selectClass(!!errors.categories)}
                  {...register("categories", { required: "Category is required" })}
                >
                  <option value="" disabled>Select a category...</option>
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
                Add Expense
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
