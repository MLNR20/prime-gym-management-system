import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import createData from "../../data/createData";
import useFetchData from "../../data/fetchData";
import { useNavigate } from "react-router-dom";

type FormData = {
  customer_id: string;
  locker_id: string;
  time_in: string;
};

const formatToDateTimeLocal = (value?: string) => {
  const date = value ? new Date(value) : new Date();
  if (isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

export default function Add_Attendance(): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();

  // Fetch available customers (Paid, not deleted, no current locker assignment)
  const availableCustomers = useFetchData({ url: "customers/available-users-lockers" });

  // Fetch available active lockers (active, not currently borrowed)
  const availableLockers = useFetchData({ url: "lockers/active-lockers" });

  const customerList = Array.isArray(availableCustomers) ? availableCustomers : [];
  const lockerList = Array.isArray(availableLockers) ? availableLockers : [];

  const labelClass = "text-sm mb-2 font-medium text-gray-700";
  const inputClass = (hasError: boolean) =>
    `input input-bordered h-12 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "input-error" : ""}`;
  const selectClass = (hasError: boolean) =>
    `select select-bordered h-12 border bg-white border-gray-400 text-gray-500 w-full ${hasError ? "select-error" : ""}`;

  const onSubmit = async (data: FormData) => {
    try {
      const createAttendance = await createData({ url: "attendance", data: data });
      if (createAttendance) {
        navigate("/attendance");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen p-6 md:p-0 lg:p-0 lg:flex-row md:flex-row flex-col overflow-hidden">
      <div className="w-full md:w-48 lg:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 md:p-24 lg:p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header
            subheader="Let's assign a locker key to a customer with an active subscription."
            header="Add Attendance / Assign Key"
          />
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-10">

            {/* ── ASSIGNMENT ── */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Assignment
              </span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Customer Dropdown */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Select Customer</label>
                <select
                  defaultValue=""
                  className={selectClass(!!errors.customer_id)}
                  {...register("customer_id", {
                    required: "Selecting a customer is required",
                  })}
                >
                  <option value="" disabled>Pick a customer...</option>
                  {customerList.map((customer: any) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.first_name} {customer.last_name}
                    </option>
                  ))}
                </select>
                {errors.customer_id && (
                  <span className="text-red-500 text-sm">{errors.customer_id.message}</span>
                )}
                {customerList.length === 0 && (
                  <span className="text-gray-500 text-xs mt-1">
                    No active customers without an assigned locker key were found.
                  </span>
                )}
              </div>

              {/* Locker Dropdown */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Select Locker Key</label>
                <select
                  defaultValue=""
                  className={selectClass(!!errors.locker_id)}
                  {...register("locker_id", {
                    required: "Selecting a locker key is required",
                  })}
                >
                  <option value="" disabled>Pick a locker...</option>
                  {lockerList.map((locker: any) => (
                    <option key={locker._id} value={locker._id}>
                      Locker #{locker.locker_number}
                    </option>
                  ))}
                </select>
                {errors.locker_id && (
                  <span className="text-red-500 text-sm">{errors.locker_id.message}</span>
                )}
                {lockerList.length === 0 && (
                  <span className="text-gray-500 text-xs mt-1">
                    No active/available locker keys were found.
                  </span>
                )}
              </div>
            </div>

            {/* ── CHECK-IN ── */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Check-in
              </span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Check-in Date/Time */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Check-in Date & Time</label>
                <input
                  type="datetime-local"
                  className={inputClass(!!errors.time_in)}
                  defaultValue={formatToDateTimeLocal()}
                  {...register("time_in", {
                    required: "Check-in date and time is required",
                  })}
                />
                {errors.time_in && (
                  <span className="text-red-500 text-sm">{errors.time_in.message}</span>
                )}
              </div>
            </div>

            <hr className="border-t border-gray-200 mt-6 mb-6" />

            <div className="flex gap-3">
              <button type="submit" className="btn btn-success text-white">
                Assign Key
              </button>
              <button
                type="button"
                className="btn btn-neutral btn-outline"
                onClick={() => navigate("/attendance")}
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