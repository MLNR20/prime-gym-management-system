import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import createData from "../../data/createData";
import { useNavigate } from "react-router-dom";

type FormData = {
  lockerNumber: string;
};

export default function Add_Locker(): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const usenavigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const createLocker = await createData({ url: "lockers", data: data });
      if (createLocker) {
        usenavigate("/lockers", {
          state: { alertMessage: "Locker added successfully!", alertVariant: "success" },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const labelClass = "text-sm mb-2 font-medium text-gray-700";
  const inputClass = (hasError: boolean) =>
    `input input-bordered h-12 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "input-error" : ""}`;

  return (
    <div className="background-white flex h-screen p-6 min-[1025px]:p-0 landscape:min-[1024px]:p-0 min-[1025px]:flex-row landscape:min-[1024px]:flex-row flex-col overflow-hidden">
      <div className="w-full min-[1025px]:w-64 landscape:min-[1024px]:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 min-[1025px]:p-24 landscape:min-[1024px]:p-24 overflow-auto">
        <div className="bg-white p-6 sm:p-16 rounded-lg">
          <Header
            subheader="Hey, there! Let's create a new locker!"
            header="Add Locker"
          />
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-10">

            {/* ── LOCKER INFO ── */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Locker Info
              </span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Locker Number */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Locker Number</label>
                <input
                  type="number"
                  placeholder="Enter locker number..."
                  className={inputClass(!!errors.lockerNumber)}
                  {...register("lockerNumber", {
                    required: "Locker Number is required",
                    minLength: { value: 1, message: "Locker number must not be 0" },
                    pattern: { value: /^[0-9\s]+$/, message: "Only numbers are allowed" },
                  })}
                />
                {errors.lockerNumber && (
                  <span className="text-red-500 text-sm">{errors.lockerNumber.message}</span>
                )}
              </div>
            </div>

            <hr className="border-t border-gray-200 mt-6 mb-6" />

            <div className="flex gap-3">
              <button type="submit" className="btn btn-success text-white">
                Add Locker
              </button>
              <button
                type="button"
                className="btn btn-neutral btn-outline"
                onClick={() => usenavigate("/lockers")}
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
