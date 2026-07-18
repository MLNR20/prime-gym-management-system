import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import fetchRecord from "../../data/fetchRecord";
import updateData from "../../data/updateData";

type FormData = {
  program_name: string;
  description: string;
  date_assigned: string;
};

export default function Edit_Program(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchRecord({ url: "programs", id });
        if (result) {
          reset({
            program_name: result.program_name || "",
            description: result.description || "",
            date_assigned: result.date_assigned
              ? result.date_assigned.split("T")[0]
              : "",
          });
        }
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

  const onSubmit = async (data: FormData) => {
    try {
      const response = await updateData({
        url: "programs",
        id: id!,
        updateData: data,
      });
      if (response) {
        navigate("/programs");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const labelClass = "text-sm mb-2 font-medium text-gray-700";
  const inputClass = (hasError: boolean) =>
    `input input-bordered h-12 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "input-error" : ""}`;
  const textareaClass = (hasError: boolean) =>
    `textarea textarea-bordered h-32 border bg-white border-gray-400 text-gray-500 placeholder-gray-400 w-full ${hasError ? "textarea-error" : ""}`;

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header
            subheader="Edit and update the program details."
            header="Edit Program"
          />
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-10">

            {/* ── PROGRAM INFO ── */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Program Info
              </span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Program Name */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Program Name</label>
                <input
                  type="text"
                  placeholder="Enter program name..."
                  className={inputClass(!!errors.program_name)}
                  {...register("program_name", {
                    required: "Program name is required",
                    minLength: { value: 3, message: "Program name must be at least 3 characters" },
                  })}
                />
                {errors.program_name && (
                  <span className="text-red-500 text-sm">{errors.program_name.message}</span>
                )}
              </div>

              {/* Date Assigned */}
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Date Assigned</label>
                <input
                  type="date"
                  className={inputClass(!!errors.date_assigned)}
                  {...register("date_assigned", { required: "Date assigned is required" })}
                />
                {errors.date_assigned && (
                  <span className="text-red-500 text-sm">{errors.date_assigned.message}</span>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1 col-span-2">
                <label className={labelClass}>Description</label>
                <textarea
                  placeholder="Enter program description..."
                  className={textareaClass(!!errors.description)}
                  {...register("description", {
                    required: "Description is required",
                    minLength: { value: 10, message: "Description must be at least 10 characters" },
                  })}
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">{errors.description.message}</span>
                )}
              </div>
            </div>

            <hr className="border-t border-gray-200 mt-6 mb-6" />

            <div className="flex gap-3">
              <button type="submit" className="btn btn-success text-white">
                Update Program
              </button>
              <button
                type="button"
                className="btn btn-neutral btn-outline"
                onClick={() => navigate("/programs")}
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
