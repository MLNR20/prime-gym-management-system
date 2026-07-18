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

  const labelClass = "text-sm mb-2 font-medium text-gray-700";
  const inputClass = (hasError: boolean) =>
    `input input-bordered h-12 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "input-error" : ""}`;
  const selectClass = (hasError: boolean) =>
    `select select-bordered h-12 border bg-white border-gray-400 text-gray-500 w-full ${hasError ? "select-error" : ""}`;

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
            console.log(fetchCurrentError);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateData({ url: "attendance", id: id!, updateData: data });
      navigate("/attendance");
    } catch (error) {
      console.log(error);
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
      <div className="flex h-screen overflow-hidden">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 p-24 overflow-auto flex items-center justify-center">
          <div className="text-xl font-semibold text-gray-700">Loading attendance record...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header
            subheader="Let's assign a locker key to a customer with an active subscription."
            header="Edit Attendance / Assign Key"
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
                  {mergedCustomerList.map((customer: any) => (
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
                  {mergedLockerList.map((locker: any) => (
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
                  defaultValue={formatToDateTimeLocal(details?.time_in)}
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