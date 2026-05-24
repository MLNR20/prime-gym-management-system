import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import createData from "../../data/createData";
import { useNavigate } from "react-router-dom";

type FormData = {
  program_name: string;
  description: string;
  date_assigned: string;
};

export default function Add_Program(): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);

    try {
      const createProgram = await createData({
        url: "programs",
        data: data,
      });

      if (createProgram) {
        alert("Program created successfully!");
        navigate("/programs");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to create program.");
    }
  };

  return (
    <div className="flex background-white h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-24 overflow-auto">
        <div className="bg-white p-16 rounded-lg">
          <Header
            subheader="Create a new training program for your gym members."
            header="Add Program"
          />
          <form onSubmit={handleSubmit(onSubmit)} className="w-full my-12">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex w-full my-6 flex-col gap-2">
                <label className="label">
                  <span className="label-text text-black">Program Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter program name..."
                  className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                    errors.program_name ? "input-error" : ""
                  }`}
                  {...register("program_name", {
                    required: "Program name is required",
                    minLength: {
                      value: 3,
                      message: "Program name must be at least 3 characters",
                    },
                  })}
                />
                {errors.program_name && (
                  <span className="text-red-500 text-sm">
                    {errors.program_name.message}
                  </span>
                )}
              </div>

              <div className="flex w-full my-6 flex-col gap-2">
                <label className="label">
                  <span className="label-text text-black">Date Assigned</span>
                </label>
                <input
                  type="date"
                  className={`input input-bordered h-12 border bg-white border-gray-700 w-full ${
                    errors.date_assigned ? "input-error" : ""
                  }`}
                  {...register("date_assigned", {
                    required: "Date assigned is required",
                  })}
                />
                {errors.date_assigned && (
                  <span className="text-red-500 text-sm">
                    {errors.date_assigned.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex w-full my-6 flex-col gap-2">
              <label className="label">
                <span className="label-text text-black">Description</span>
              </label>
              <textarea
                placeholder="Enter program description..."
                className={`textarea textarea-bordered h-32 border bg-white border-gray-700 w-full ${
                  errors.description ? "textarea-error" : ""
                }`}
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                })}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                className="btn btn-success text-white w-32"
              >
                Create Program
              </button>
              <button
                type="button"
                className="btn btn-outline w-32"
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
