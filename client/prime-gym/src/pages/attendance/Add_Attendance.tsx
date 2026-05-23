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

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);

    try {
      alert("Submitted");
      const createAttendance = await createData({ url: "attendance", data: data });

      if (createAttendance) {
        navigate("/attendance");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to assign locker key.");
    }
  };

  const customerList = Array.isArray(availableCustomers) ? availableCustomers : [];
  const lockerList = Array.isArray(availableLockers) ? availableLockers : [];

  return (
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg shadow-sm border border-gray-100">
          <Header
            subheader="Let's assign a locker key to a customer with an active subscription."
            header="Add Attendance / Assign Key"
          />
          <form onSubmit={handleSubmit(onSubmit)} className="w-full my-12">

            {/* Customer Dropdown */}
            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label">
                <span className="label-text text-black font-semibold">Select Customer</span>
              </label>
              <select
                className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${errors.customer_id ? "select-error" : ""
                  }`}
                defaultValue=""
                {...register("customer_id", {
                  required: "Selecting a customer is required",
                })}
              >
                <option value="" disabled>
                  Pick a customer...
                </option>
                {customerList.map((customer: any) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.first_name} {customer.last_name}
                  </option>
                ))}
              </select>
              {errors.customer_id && (
                <span className="text-red-500 text-sm">
                  {errors.customer_id.message}
                </span>
              )}
              {customerList.length === 0 && (
                <span className="text-gray-500 text-xs mt-1">
                  No active customers without an assigned locker key were found.
                </span>
              )}
            </div>

            {/* Locker Dropdown */}
            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label">
                <span className="label-text text-black font-semibold">Select Locker Key</span>
              </label>
              <select
                className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${errors.locker_id ? "select-error" : ""
                  }`}
                defaultValue=""
                {...register("locker_id", {
                  required: "Selecting a locker key is required",
                })}
              >
                <option value="" disabled>
                  Pick a locker...
                </option>
                {lockerList.map((locker: any) => (
                  <option key={locker._id} value={locker._id}>
                    Locker #{locker.locker_number}
                  </option>
                ))}
              </select>
              {errors.locker_id && (
                <span className="text-red-500 text-sm">
                  {errors.locker_id.message}
                </span>
              )}
              {lockerList.length === 0 && (
                <span className="text-gray-500 text-xs mt-1">
                  No active/available locker keys were found.
                </span>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <button type="submit" className="btn btn-success text-white px-6">
                Assign Key
              </button>
              <button
                type="button"
                className="btn btn-outline px-6"
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
