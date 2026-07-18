import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import createData from "../../data/createData";
import { useNavigate } from "react-router-dom";

type FormData = {
  first_name: string;
  last_name: string;
  amount_paid: string;
  contact_no: string;
  email: string;
  subscription_type: string;
  payment_option: string;
};

export default function Add_Customers(): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const usenavigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const createCustomer = await createData({ url: "customers", data: data });
      if (createCustomer) {
        usenavigate("/customers");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const labelClass = "text-sm mb-2 font-medium text-gray-700";
  const inputClass = (hasError: boolean) =>
    `input input-bordered h-12 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "input-error" : ""}`;
  const selectClass = "select select-bordered h-12 border bg-white border-gray-400 text-gray-500 w-full";

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header
            subheader="Hey, there! Let's create a new customer!"
            header="Add Customer"
          />
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-10">

            {/* ── PERSONAL INFO ── */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Personal Info
              </span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* First Name */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>First Name</label>
                <input
                  type="text"
                  placeholder="Enter first name..."
                  className={inputClass(!!errors.first_name)}
                  {...register("first_name", {
                    required: "First name is required",
                    minLength: { value: 3, message: "First name must be at least 3 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces are allowed" },
                  })}
                />
                {errors.first_name && (
                  <span className="text-red-500 text-sm">{errors.first_name.message}</span>
                )}
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  placeholder="Enter last name..."
                  className={inputClass(!!errors.last_name)}
                  {...register("last_name", {
                    required: "Last name is required",
                    minLength: { value: 5, message: "Last name must be at least 5 characters" },
                    pattern: { value: /^[A-Za-z\s]+$/, message: "Only letters and spaces are allowed" },
                  })}
                />
                {errors.last_name && (
                  <span className="text-red-500 text-sm">{errors.last_name.message}</span>
                )}
              </div>

              {/* Contact No */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Contact No</label>
                <input
                  type="number"
                  placeholder="Enter contact number..."
                  className={inputClass(!!errors.contact_no)}
                  {...register("contact_no", {
                    required: "Contact Number is required",
                    minLength: { value: 9, message: "Contact number must be at least 9 characters" },
                    pattern: { value: /^[0-9\s]+$/, message: "Only numbers are allowed" },
                  })}
                />
                {errors.contact_no && (
                  <span className="text-red-500 text-sm">{errors.contact_no.message}</span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  placeholder="Enter email address..."
                  className={inputClass(!!errors.email)}
                  {...register("email", {
                    required: "Email is required to receive routine notifications",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                  })}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message}</span>
                )}
              </div>
            </div>

            {/* ── SUBSCRIPTION ── */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Subscription
              </span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Amount Paid */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Amount Paid</label>
                <input
                  type="number"
                  placeholder="Enter amount paid..."
                  className={inputClass(!!errors.amount_paid)}
                  {...register("amount_paid", {
                    required: "Amount Paid is required",
                    min: { value: 1, message: "Amount Paid must be greater than 0 pesos" },
                    pattern: { value: /^[0-9\s]+$/, message: "Only numbers are allowed" },
                  })}
                />
                {errors.amount_paid && (
                  <span className="text-red-500 text-sm">{errors.amount_paid.message}</span>
                )}
              </div>

              {/* Subscription Type */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Subscription Type</label>
                <select
                  defaultValue=""
                  className={selectClass}
                  {...register("subscription_type", { required: "Subscription type is required" })}
                >
                  <option value="" disabled>Pick a subscription option</option>
                  <option value="Daily Exercise">Daily Exercise</option>
                  <option value="Monthly Subscription">Monthly Subscription</option>
                  <option value="Coaching Subscription">Coaching Subscription</option>
                  <option value="Monthly with Coaching">Monthly With Coaching</option>
                </select>
                {errors.subscription_type && (
                  <span className="text-red-500 text-sm">{errors.subscription_type.message}</span>
                )}
              </div>

              {/* Payment Option */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Payment Option</label>
                <select
                  defaultValue=""
                  className={selectClass}
                  {...register("payment_option", { required: "Payment option is required" })}
                >
                  <option value="" disabled>Pick a payment option</option>
                  <option value="Cash">Cash</option>
                  <option value="GCash">GCash</option>
                </select>
                {errors.payment_option && (
                  <span className="text-red-500 text-sm">{errors.payment_option.message}</span>
                )}
              </div>
            </div>

            <hr className="border-t border-gray-200 mt-6 mb-6" />

            <div className="flex gap-3">
              <button type="submit" className="btn btn-success text-white">
                Add Customer
              </button>
              <button
                type="button"
                className="btn btn-neutral btn-outline"
                onClick={() => usenavigate("/customers")}
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