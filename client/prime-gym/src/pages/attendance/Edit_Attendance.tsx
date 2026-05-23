import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import updateData from "../../data/updateData";
import useFetchData from "../../data/fetchData";
import fetchRecord from "../../data/fetchRecord";
import { useNavigate, useParams } from "react-router-dom";

type FormData = {
  customer_id: string;
  locker_id: string;
  time_in: string;
};

type Params = {
  id: string;
};

const formatToDateTimeLocal = (value?: string) => {
  const date = value ? new Date(value) : new Date();
  if (isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

export default function Edit_Attendance(): React.ReactElement {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();
  const { id } = useParams<Params>();
  const [loading, setLoading] = useState(true);

  // Fetch available customers (Paid, not deleted, no current locker assignment)
  const availableCustomers = useFetchData({ url: "customers/available-users-lockers" });

  // Fetch available active lockers (active, not currently borrowed)
  const availableLockers = useFetchData({ url: "lockers/active-lockers" });

  const [details, setDetails] = useState<any | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<any | null>(null);
  const [currentLocker, setCurrentLocker] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchRecord({ url: "attendance", id });

        if (res) {
          setDetails(res);
          reset({
            customer_id: res.customer_id ?? "",
            locker_id: res.locker_id ?? "",
            time_in: formatToDateTimeLocal(res.time_in),
          });

          try {
            const [customer, locker] = await Promise.all([
              fetchRecord({ url: "customers", id: res.customer_id }),
              fetchRecord({ url: "lockers", id: res.locker_id }),
            ]);
            setCurrentCustomer(customer);
            setCurrentLocker(locker);
          } catch (fetchCurrentError) {
            console.warn("Could not fetch current customer/locker details", fetchCurrentError);
          }
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load attendance record.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      alert("Submitted");
      await updateData({ url: "attendance", id: id!, updateData: data });
      navigate("/attendance");
    } catch (error) {
      console.error(error);
      alert("Failed to update attendance.");
    }
  };

  const customerList = Array.isArray(availableCustomers)
    ? availableCustomers
    : Array.isArray((availableCustomers as any)?.data)
      ? (availableCustomers as any).data
      : [];

  const lockerList = Array.isArray(availableLockers)
    ? availableLockers
    : Array.isArray((availableLockers as any)?.data)
      ? (availableLockers as any).data
      : [];

  const mergedCustomerList = [...customerList];
  if (
    currentCustomer &&
    !mergedCustomerList.some((customer: any) => String(customer._id) === String(currentCustomer._id))
  ) {
    mergedCustomerList.unshift(currentCustomer);
  }

  const mergedLockerList = [...lockerList];
  if (
    currentLocker &&
    !mergedLockerList.some((locker: any) => String(locker._id) === String(currentLocker._id))
  ) {
    mergedLockerList.unshift(currentLocker);
  }

  if (loading) {
    return (
      <div className="flex background-white h-screen overflow-hidden">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 p-24 overflow-auto flex items-center justify-center">
          <div className="text-xl font-semibold">Loading attendance record...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg shadow-sm border border-gray-100">
          <Header
            subheader="Let's assign a locker key to a customer with an active subscription."
            header="Edit Attendance / Assign Key"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full my-12">

            {/* Customer Dropdown */}
            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label">
                <span className="label-text text-black font-semibold">Select Customer</span>
              </label>
              <select
                className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${errors.customer_id ? "select-error" : ""}`}
                defaultValue=""
                {...register("customer_id", {
                  required: "Selecting a customer is required",
                })}
              >
                <option value="" disabled>
                  Pick a customer...
                </option>
                {mergedCustomerList.map((customer: any) => (
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
                className={`select select-bordered h-12 border bg-white border-gray-700 w-full ${errors.locker_id ? "select-error" : ""}`}
                defaultValue=""
                {...register("locker_id", {
                  required: "Selecting a locker key is required",
                })}
              >
                <option value="" disabled>
                  Pick a locker...
                </option>
                {mergedLockerList.map((locker: any) => (
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

            {/* Check-in Date/Time */}
            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label">
                <span className="label-text text-black font-semibold">Check-in Date & Time</span>
              </label>
              <input
                type="datetime-local"
                className={`input input-bordered bg-white border-gray-700 h-12 w-full ${errors.time_in ? "input-error" : ""}`}
                defaultValue={formatToDateTimeLocal(details?.time_in)}
                {...register("time_in", {
                  required: "Check-in date and time is required",
                })}
              />
              {errors.time_in && (
                <span className="text-red-500 text-sm">
                  {errors.time_in.message}
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
