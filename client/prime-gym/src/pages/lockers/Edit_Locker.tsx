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
  locker_number: string;
};

export default function Edit_Lockers(): React.ReactElement {
  const { id } = useParams<Params>();
  const redirect = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(true);

  const onSubmit = async (data: FormData) => {
    try {
      await updateData({ url: "lockers", id: id!.toString(), updateData: data });
      redirect("/lockers");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchRecord({ url: "lockers", id });
        if (result) reset(result);
      } catch (error) {
        console.log("Fetch error:", error);
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

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header
            subheader="Update the details of this locker."
            header="Edit Locker"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-10">

            {/* ── LOCKER INFO ── */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Locker Info
              </span>
              <hr className="flex-1 border-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Locker Number */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Locker Number</label>
                <input
                  type="number"
                  placeholder="Enter locker number..."
                  className={inputClass(!!errors.locker_number)}
                  {...register("locker_number", {
                    required: "Locker Number is required",
                    minLength: { value: 1, message: "Locker number must not be 0" },
                    pattern: { value: /^[0-9\s]+$/, message: "Only numbers are allowed" },
                  })}
                />
                {errors.locker_number && (
                  <span className="text-red-500 text-sm">{errors.locker_number.message}</span>
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
                onClick={() => redirect("/lockers")}
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
